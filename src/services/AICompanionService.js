/**
 * AI Companion Service (Stub for Heartware)
 * Minimal implementation to prevent import errors
 */

class AICompanionService {
  constructor() {
    this.conversationHistory = [];
  }

  async getHerbalConsultation(condition, userProfile = {}) {
    return {
      success: true,
      data: []
    };
  }

  async getHealthInsights(healthData) {
    return { insights: [] };
  }

  getHistory(limit = 50) {
    return [];
  }

  clearHistory() {}
}

export default new AICompanionService();
