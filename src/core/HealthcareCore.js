// src/core/HealthcareCore.js
// Simplified healthcare system core (Heartware variant)
// Minimal dependencies focused on healthcare operations

import LoggerService from "../services/LoggerService";
import StorageService from "../services/StorageService";

class HealthcareCore {
  static instance = null;
  services = new Map();
  state = {};

  static getInstance() {
    if (!HealthcareCore.instance) {
      HealthcareCore.instance = new HealthcareCore();
    }
    return HealthcareCore.instance;
  }

  init() {
    LoggerService.log('[HealthcareCore] Initializing healthcare system');
    this.state = {
      operationMode: 'manual',
      darkMode: StorageService.getItem('healthcare-dark-mode') === 'true',
      theme: 'healthcare',
    };
    this.registerService('logger', LoggerService);
    this.registerService('storage', StorageService);
  }

  registerService(name, service) {
    this.services.set(name, service);
    LoggerService.log(`[HealthcareCore] Service registered: ${name}`);
  }

  getService(name) {
    // Return empty service object if not found to prevent errors
    return this.services.get(name) || { log: () => {} };
  }

  setState(key, value) {
    this.state[key] = value;
    StorageService.setItem(`healthcare-state-${key}`, JSON.stringify(value));
  }

  getState(key) {
    return this.state[key];
  }

  updateState(key, value) {
    this.setState(key, value);
  }

  async shutdown() {
    LoggerService.log('[HealthcareCore] Shutting down healthcare system');
    this.services.clear();
  }
}

// Also export as default and create global reference
const healthcareCore = HealthcareCore.getInstance();
if (typeof window !== 'undefined') {
  window.sofieCore = healthcareCore; // For backward compatibility
  window.healthcareCore = healthcareCore;
}

export default healthcareCore;
export { HealthcareCore };
