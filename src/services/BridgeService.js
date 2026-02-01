/**
 * BridgeService.js
 * Singleton WebSocket manager for real-time AI conversation
 * Connects to sofie-backend WebSocket at ws://localhost:3000/heartware-stream
 * Falls back to HTTP localhost:8000 if WebSocket unavailable
 * 
 * Pattern: Follows RegionService singleton pattern with event listener architecture
 */

import { streamWithFallback } from './sofieLlamaApi';

const WS_URL = process.env.REACT_APP_BRIDGE_WS_URL || 'ws://localhost:3000/heartware-stream';
const AUTH_TOKEN_KEY = 'heartware_auth_token';
const CONNECTION_TIMEOUT = 3000; // 3 second timeout for WebSocket connection

class BridgeService {
  constructor() {
    this.ws = null;
    this.status = 'disconnected'; // disconnected, connecting, connected, authenticated
    this.mode = 'websocket'; // 'websocket' or 'http-fallback'
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map(); // event -> Set(callbacks)
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
    this.shouldReconnect = true;
    this.messageQueue = []; // Queue messages when not connected
    this.conversationId = null;
    this.connectionTimeoutId = null;
    this.currentAbortController = null; // For HTTP fallback cancellation
  }

  /**
   * Establish WebSocket connection with authentication handshake
   * Falls back to HTTP mode if WebSocket fails or times out
   */
  async connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    // Reset mode to websocket for fresh attempt
    this.mode = 'websocket';
    this.status = 'connecting';
    this.emit('status', this.status);
    
    console.log('[BridgeService] Connecting to:', WS_URL);

    // Set connection timeout
    this.connectionTimeoutId = setTimeout(() => {
      if (this.status === 'connecting') {
        console.log('[Bridge] WebSocket connection timeout, switching to HTTP fallback');
        this._switchToHttpFallback();
      }
    }, CONNECTION_TIMEOUT);

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        // Clear timeout since we connected successfully
        if (this.connectionTimeoutId) {
          clearTimeout(this.connectionTimeoutId);
          this.connectionTimeoutId = null;
        }
        
        console.log('[BridgeService] WebSocket opened');
        this.status = 'connected';
        this.mode = 'websocket';
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        
        // Send authentication handshake
        this._sendAuthHandshake();
        
        this.emit('status', this.status);
      };

      this.ws.onmessage = (event) => {
        this._handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('[BridgeService] WebSocket error:', error);
        
        // If still connecting, switch to HTTP fallback
        if (this.status === 'connecting') {
          this._switchToHttpFallback();
        } else {
          this.emit('error', { type: 'websocket', message: 'Connection error', error });
        }
      };

      this.ws.onclose = (event) => {
        console.log('[BridgeService] WebSocket closed:', event.code, event.reason);
        
        // Clear timeout if still pending
        if (this.connectionTimeoutId) {
          clearTimeout(this.connectionTimeoutId);
          this.connectionTimeoutId = null;
        }
        
        // If we were in websocket mode and not intentionally disconnected, try to reconnect
        if (this.mode === 'websocket') {
          this.status = 'disconnected';
          this.emit('status', this.status);

          if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this._scheduleReconnect();
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            // Switch to HTTP fallback after max reconnection attempts
            console.log('[Bridge] Max WebSocket reconnection attempts reached, switching to HTTP fallback');
            this._switchToHttpFallback();
          }
        }
      };

    } catch (error) {
      console.error('[BridgeService] Failed to create WebSocket:', error);
      this._switchToHttpFallback();
    }
  }

  /**
   * Switch to HTTP fallback mode
   */
  _switchToHttpFallback() {
    // Clear any pending connection timeout
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }
    
    // Close WebSocket if partially connected
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        // Ignore close errors
      }
      this.ws = null;
    }
    
    console.log('[BridgeService] WebSocket unavailable, using HTTP fallback to :8000');
    this.mode = 'http-fallback';
    this.status = 'authenticated'; // HTTP is always "ready" to send
    this.emit('status', this.status);
    this.emit('authenticated', { mode: 'http-fallback', conversationId: null });
  }

  /**
   * Send authentication handshake
   */
  _sendAuthHandshake() {
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const userId = localStorage.getItem('heartware_user_id') || 'anonymous';
    
    this.send('auth', {
      token: authToken,
      userId: userId,
      clientVersion: '1.0.0',
      capabilities: ['biometric', 'voice', 'streaming']
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  _handleMessage(data) {
    try {
      const message = JSON.parse(data);
      const { type, payload, timestamp, id, error } = message;

      // Handle authentication confirmation
      if (type === 'auth_confirmed') {
        this.status = 'authenticated';
        this.conversationId = payload?.conversationId || null;
        this.emit('status', this.status);
        this.emit('authenticated', payload);
        
        // Flush queued messages
        this._flushMessageQueue();
        return;
      }

      // Handle errors from server
      if (error) {
        this.emit('error', { type: 'server', message: error, timestamp });
        return;
      }

      // Emit based on message type
      this.emit(type, { payload, timestamp, id });
      
      // Also emit as generic 'message' for catch-all handlers
      this.emit('message', { type, payload, timestamp, id });

    } catch (e) {
      console.error('[BridgeService] Failed to parse message:', e);
      this.emit('error', { type: 'parse', message: 'Invalid message format', raw: data });
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  _scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);
    
    console.log(`[BridgeService] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
    }, delay);
  }

  /**
   * Flush queued messages after connection
   */
  _flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { type, data } = this.messageQueue.shift();
      this.send(type, data);
    }
  }

  /**
   * Send message to WebSocket server
   * In HTTP fallback mode, uses SofieLlamaApi for chat messages
   * @param {string} type - Message type: 'auth'|'chat'|'biometric'|'interruption'|'stream_chunk'
   * @param {object} data - Message payload
   */
  send(type, data) {
    console.log(`[BridgeService] send() called, type: ${type}, mode: ${this.mode}, status: ${this.status}`);
    
    // In HTTP fallback mode, handle chat via HTTP API
    if (this.mode === 'http-fallback') {
      console.log('[BridgeService] In HTTP fallback mode');
      if (type === 'chat') {
        console.log('[BridgeService] Routing to _sendHttpChat');
        this._sendHttpChat(data);
        return;
      } else if (type === 'interruption') {
        this._abortHttpRequest();
        return;
      }
      // Other message types not supported in HTTP fallback
      console.warn('[BridgeService] Message type not supported in HTTP fallback:', type);
      return;
    }

    // WebSocket mode
    if (this.status !== 'authenticated' && type !== 'auth') {
      // Queue message if not yet authenticated
      if (this.status === 'connected' || this.status === 'connecting') {
        this.messageQueue.push({ type, data });
        return;
      }
      throw new Error('Bridge not ready. Status: ' + this.status);
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const message = {
      type,
      data,
      timestamp: Date.now(),
      id: this._generateMessageId()
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Send chat message via HTTP fallback with simulated streaming
   */
  async _sendHttpChat(data) {
    const { message, context } = data;
    console.log('[BridgeService] _sendHttpChat called with message:', message.substring(0, 50) + '...');
    
    // Create abort controller for interruption support
    this.currentAbortController = new AbortController();
    
    try {
      console.log('[BridgeService] Calling streamWithFallback...');
      // Use the fallback streaming method from SofieLlamaApi
      const fullText = await streamWithFallback(
        message,
        context || {},
        (chunk) => {
          if (chunk) {
            console.log('[BridgeService] Got chunk:', chunk.substring(0, 30));
            // Emit stream_chunk events to mimic WebSocket behavior
            this.emit('stream_chunk', {
              payload: { content: chunk },
              timestamp: Date.now()
            });
          }
        },
        this.currentAbortController.signal
      );
      console.log('[BridgeService] streamWithFallback completed, full text length:', fullText?.length || 0);
      
      // If we got a response but no chunks were emitted (empty callback scenario),
      // emit the full text now
      if (fullText && fullText.length > 0) {
        this.emit('stream_chunk', {
          payload: { content: fullText, isComplete: true },
          timestamp: Date.now()
        });
      }
      
      // Emit stream_end when complete
      this.emit('stream_end', {
        payload: { conversationId: this.conversationId },
        timestamp: Date.now()
      });
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[BridgeService] HTTP request aborted');
      } else {
        console.error('[BridgeService] HTTP chat error:', error.message);
        this.emit('error', { type: 'http', message: error.message });
        // Emit stream_end so UI doesn't hang
        this.emit('stream_end', {
          payload: { conversationId: this.conversationId, error: error.message },
          timestamp: Date.now()
        });
      }
    } finally {
      this.currentAbortController = null;
    }
  }

  /**
   * Abort current HTTP request (for interruption)
   */
  _abortHttpRequest() {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }

  /**
   * Send chat message with streaming support
   */
  sendChat(message, context = {}, streaming = true) {
    console.log('[BridgeService] sendChat called, message length:', message.length);
    this.send('chat', {
      message,
      context: {
        ...context,
        conversationId: this.conversationId
      },
      streaming,
      timestamp: Date.now()
    });
  }

  /**
   * Send biometric data
   */
  sendBiometric(biometricData) {
    // In HTTP fallback, biometric data is sent as part of chat context
    // Standalone biometric endpoint would require additional HTTP API
    if (this.mode === 'http-fallback') {
      console.log('[BridgeService] Biometric data queued for next chat in HTTP fallback mode');
      return;
    }
    
    this.send('biometric', {
      ...biometricData,
      timestamp: Date.now()
    });
  }

  /**
   * Send interruption signal (user wants to stop AI speaking)
   */
  sendInterruption() {
    this.send('interruption', {
      timestamp: Date.now(),
      conversationId: this.conversationId
    });
  }

  /**
   * Generate unique message ID
   */
  _generateMessageId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Register event listener
   * @param {string} event - Event name: 'status', 'message', 'stream_chunk', 'stream_end', 'error', 'biometric-request'
   * @param {function} callback - Event handler
   * @returns {function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Emit event to all listeners
   */
  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(payload);
        } catch (e) {
          console.error('[BridgeService] Listener error:', e);
        }
      });
    }
  }

  /**
   * Get current connection status
   */
  getStatus() {
    return this.status;
  }

  /**
   * Get current mode (websocket or http-fallback)
   */
  getMode() {
    return this.mode;
  }

  /**
   * Get detailed connection status
   */
  getConnectionStatus() {
    return {
      status: this.status,
      mode: this.mode,
      reconnectAttempts: this.reconnectAttempts,
      isHttpFallback: this.mode === 'http-fallback'
    };
  }

  /**
   * Check if connected (WebSocket open or HTTP fallback active)
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN || this.mode === 'http-fallback';
  }

  /**
   * Check if authenticated (WebSocket) or in HTTP fallback mode
   */
  isAuthenticated() {
    return this.status === 'authenticated';
  }

  /**
   * Check if bridge is ready for sending messages
   */
  isReady() {
    return this.status === 'authenticated';
  }

  /**
   * Get current conversation ID
   */
  getConversationId() {
    return this.conversationId;
  }

  /**
   * Set conversation ID (for resuming conversations)
   */
  setConversationId(id) {
    this.conversationId = id;
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    this.shouldReconnect = false;
    this.messageQueue = [];
    
    // Clear any pending timeout
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }
    
    // Abort any HTTP request
    this._abortHttpRequest();
    
    if (this.ws) {
      // Send graceful close if authenticated
      if (this.status === 'authenticated' && this.mode === 'websocket') {
        try {
          this.send('close', { timestamp: Date.now() });
        } catch (e) {
          // Ignore errors during close
        }
      }
      
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.status = 'disconnected';
    this.mode = 'websocket';
    this.conversationId = null;
    this.emit('status', this.status);
    console.log('[BridgeService] Disconnected');
  }

  /**
   * Reconnect manually
   */
  async reconnect() {
    this.disconnect();
    this.shouldReconnect = true;
    this.reconnectAttempts = 0;
    await this.connect();
  }
}

// Export singleton instance
export const bridgeService = new BridgeService();
export default bridgeService;
