/**
 * AI Companion Service
 * Connects to partner's AI for holistic health guidance
 * Psychology, heart-space healing, ancient wisdom integration
 */

class AICompanionService {
  constructor() {
    this.wsConnection = null;
    this.isConnected = false;
    this.conversationHistory = [];
    this.aiEndpoint = process.env.REACT_APP_AI_ENDPOINT || 'ws://localhost:8080/ai';
  }

  /**
   * Initialize WebSocket connection to AI companion
   */
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.wsConnection = new WebSocket(this.aiEndpoint);

        this.wsConnection.onopen = () => {
          this.isConnected = true;
          console.log('✓ Connected to AI Companion');
          resolve(true);
        };

        this.wsConnection.onerror = (error) => {
          console.error('AI Companion connection error:', error);
          reject(error);
        };

        this.wsConnection.onclose = () => {
          this.isConnected = false;
          console.log('AI Companion disconnected');
        };

        this.wsConnection.onmessage = (event) => {
          this.handleAIMessage(event.data);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send message to AI companion
   */
  async sendMessage(message, context = {}) {
    if (!this.isConnected) {
      // Fallback to REST API if WebSocket not connected
      return this.sendMessageREST(message, context);
    }

    const payload = {
      type: 'chat',
      message,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        conversationHistory: this.conversationHistory.slice(-5) // Last 5 messages for context
      }
    };

    this.wsConnection.send(JSON.stringify(payload));
    this.conversationHistory.push({ role: 'user', content: message, timestamp: new Date() });
  }

  /**
   * REST API fallback for AI communication
   */
  async sendMessageREST(message, context = {}) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          context,
          conversationHistory: this.conversationHistory.slice(-5)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        this.conversationHistory.push(
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'ai', content: data.response, timestamp: new Date() }
        );
        return data.response;
      }
    } catch (error) {
      console.error('AI REST API error:', error);
      return this.getOfflineResponse();
    }
  }

  /**
   * Handle incoming AI messages
   */
  handleAIMessage(data) {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'response') {
        this.conversationHistory.push({
          role: 'ai',
          content: message.content,
          timestamp: new Date(),
          wisdom: message.wisdom, // Ancient wisdom references
          heartSpace: message.heartSpace // Heart-centered insights
        });

        // Trigger event for UI to update
        window.dispatchEvent(new CustomEvent('ai-message', { detail: message }));
      }
    } catch (error) {
      console.error('Error handling AI message:', error);
    }
  }

  /**
   * Get holistic health insights from AI
   */
  async getHealthInsights(healthData) {
    const context = {
      type: 'health_analysis',
      vitals: healthData.vitals,
      symptoms: healthData.symptoms,
      mood: healthData.mood,
      energy: healthData.energy,
      sleep: healthData.sleep
    };

    return this.sendMessage('Can you provide holistic insights on my current health state?', context);
  }

  /**
   * Request ancient wisdom guidance
   */
  async getWisdomGuidance(topic) {
    const context = {
      type: 'wisdom_inquiry',
      topic,
      traditions: ['stoicism', 'buddhism', 'taoism', 'hermetic', 'indigenous']
    };

    return this.sendMessage(`Share wisdom from antiquity about ${topic}`, context);
  }

  /**
   * Heart-space meditation guidance
   */
  async getHeartSpaceGuidance() {
    const context = {
      type: 'meditation',
      focus: 'heart_space'
    };

    return this.sendMessage('Guide me into heart-centered presence', context);
  }

  /**
   * Psychological support and reflection
   */
  async getPsychologicalSupport(emotion, situation) {
    const context = {
      type: 'psychological_support',
      emotion,
      situation,
      approach: 'compassionate_inquiry'
    };

    return this.sendMessage(`I'm feeling ${emotion}. ${situation}`, context);
  }

  /**
   * Get conversation history
   */
  getHistory(limit = 50) {
    return this.conversationHistory.slice(-limit);
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Offline fallback response
   */
  getOfflineResponse() {
    return {
      content: "I'm currently offline, but I'm here with you in spirit. Take a moment to breathe deeply and connect with your inner wisdom. 🌟",
      type: 'offline',
      timestamp: new Date()
    };
  }

  /**
   * Disconnect from AI companion
   */
  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.isConnected = false;
    }
  }
}

export default new AICompanionService();
