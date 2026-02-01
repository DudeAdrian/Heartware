/**
 * LedgerAnchor.js
 * Interface to Terracare-Ledger via sofie-backend
 * Anchors conversation data to blockchain for verifiability
 * 
 * Note: No direct blockchain calls from frontend
 * All ledger operations proxy through sofie-backend API
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const LEDGER_API_URL = `${BACKEND_URL}/api/ledger`;

/**
 * Anchor conversation to Terracare-Ledger
 * @param {string} conversationId - Unique conversation identifier
 * @param {string} hash - Hash of conversation content
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Anchor result with txHash
 */
export async function anchorConversation(conversationId, hash, metadata = {}) {
  try {
    const response = await fetch(`${LEDGER_API_URL}/anchor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('heartware_auth_token') || ''}`
      },
      body: JSON.stringify({
        conversationId,
        hash,
        metadata: {
          ...metadata,
          timestamp: Date.now(),
          clientVersion: '1.0.0'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ledger anchor failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      txHash: result.txHash,
      timestamp: result.timestamp,
      blockNumber: result.blockNumber,
      conversationId: result.conversationId
    };
    
  } catch (error) {
    console.error('[LedgerAnchor] Anchor error:', error);
    throw error;
  }
}

/**
 * Verify conversation anchor on ledger
 * @param {string} conversationId - Conversation identifier
 * @param {string} hash - Expected hash
 * @returns {Promise<Object>} Verification result
 */
export async function verifyAnchor(conversationId, hash) {
  try {
    const response = await fetch(`${LEDGER_API_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('heartware_auth_token') || ''}`
      },
      body: JSON.stringify({
        conversationId,
        hash
      })
    });

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('[LedgerAnchor] Verification error:', error);
    return {
      verified: false,
      error: error.message
    };
  }
}

/**
 * Get anchor status for a conversation
 * @param {string} conversationId - Conversation identifier
 * @returns {Promise<Object>} Anchor status
 */
export async function getAnchorStatus(conversationId) {
  try {
    const response = await fetch(`${LEDGER_API_URL}/status/${conversationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('heartware_auth_token') || ''}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          anchored: false,
          message: 'Conversation not found on ledger'
        };
      }
      throw new Error(`Status check failed: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('[LedgerAnchor] Status error:', error);
    return {
      anchored: false,
      error: error.message
    };
  }
}

/**
 * Generate hash for conversation data
 * Uses SHA-256 via WebCrypto API
 * @param {Object} data - Conversation data to hash
 * @returns {Promise<string>} Hex-encoded hash
 */
export async function generateConversationHash(data) {
  try {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(JSON.stringify(data));
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
    
  } catch (error) {
    console.error('[LedgerAnchor] Hash generation error:', error);
    throw error;
  }
}

/**
 * Anchor conversation history to ledger
 * Convenience method that generates hash and anchors
 * @param {string} conversationId 
 * @param {Array} conversationHistory 
 * @param {Object} metadata 
 * @returns {Promise<Object>}
 */
export async function anchorConversationHistory(conversationId, conversationHistory, metadata = {}) {
  // Generate hash of conversation
  const hash = await generateConversationHash({
    conversationId,
    messages: conversationHistory,
    timestamp: Date.now()
  });
  
  // Anchor to ledger
  return await anchorConversation(conversationId, hash, {
    messageCount: conversationHistory.length,
    ...metadata
  });
}

/**
 * Check if ledger integration is available
 * @returns {Promise<boolean>}
 */
export async function isLedgerAvailable() {
  try {
    const response = await fetch(`${LEDGER_API_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Default export
export default {
  anchorConversation,
  verifyAnchor,
  getAnchorStatus,
  generateConversationHash,
  anchorConversationHistory,
  isLedgerAvailable
};
