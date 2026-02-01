/**
 * BiometricAdapter.js
 * Factory for multiple biometric input methods
 * Supports: Webcam PPG, WebBluetooth wearables, Manual entry
 * 
 * Features:
 * - Auto-detection of available methods
 * - Webcam-based heart rate estimation (photoplethysmography)
 * - WebBluetooth HR monitor support
 * - Manual fallback for demo/testing
 * - Data encryption before transmission
 */

export class BiometricAdapter {
  constructor() {
    this.bleDevice = null;
    this.bleServer = null;
    this.bleCharacteristic = null;
    this.lastBLEValue = null;
    this.webcamStream = null;
    this.isCapturingWebcam = false;
  }

  /**
   * Capture biometric data using best available method
   * @param {string} preferredMethod - 'auto', 'webcam', 'wearable', 'manual'
   * @returns {Promise<Object|null>} Biometric data or null
   */
  static async capture(method = 'auto') {
    const adapter = new BiometricAdapter();
    
    try {
      switch (method) {
        case 'webcam':
          return await adapter.captureWebcam();
          
        case 'wearable':
          return await adapter.captureWearable();
          
        case 'manual':
          return adapter.captureManual();
          
        case 'auto':
        default:
          // Try methods in order: webcam -> wearable -> manual
          const webcamData = await adapter.captureWebcam();
          if (webcamData?.confidence > 0.5) {
            return webcamData;
          }
          
          const wearableData = await adapter.captureWearable();
          if (wearableData?.confidence > 0.7) {
            return wearableData;
          }
          
          return adapter.captureManual();
      }
    } catch (error) {
      console.error('[BiometricAdapter] Capture error:', error);
      return null;
    }
  }

  /**
   * Capture heart rate using webcam (photoplethysmography approximation)
   * Uses face detection and color analysis for rough heart rate estimation
   * @returns {Promise<Object|null>}
   */
  async captureWebcam() {
    try {
      // Request webcam access
      if (!this.webcamStream) {
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 320, height: 240 },
          audio: false
        });
      }

      // Create video element for analysis
      const video = document.createElement('video');
      video.srcObject = this.webcamStream;
      video.play();

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          resolve();
        };
      });

      // Create canvas for frame analysis
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      // Capture frame
      ctx.drawImage(video, 0, 0);
      
      // Analyze face region (center of image as approximation)
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const sampleSize = 50;
      
      const frameData = ctx.getImageData(
        centerX - sampleSize/2,
        centerY - sampleSize/2,
        sampleSize,
        sampleSize
      );

      // Calculate average green channel (blood oxygenation affects green)
      let totalGreen = 0;
      for (let i = 0; i < frameData.data.length; i += 4) {
        totalGreen += frameData.data[i + 1]; // Green channel
      }
      const avgGreen = totalGreen / (frameData.data.length / 4);

      // Estimate pulse rate based on brightness (very rough approximation)
      // In a real implementation, you'd use face-api.js or similar for proper PPG
      const estimatedHR = this._estimateHRFromBrightness(avgGreen);
      
      // Cleanup video element (keep stream for reuse)
      video.pause();
      video.srcObject = null;

      return {
        pulseRate: estimatedHR,
        breathPhase: this._estimateBreathPhase(),
        emotionalValence: this._estimateEmotionalValence(estimatedHR),
        timestamp: Date.now(),
        source: 'webcam',
        confidence: 0.4, // Low confidence for basic implementation
        rawValue: avgGreen
      };
      
    } catch (error) {
      console.error('[BiometricAdapter] Webcam capture error:', error);
      return null;
    }
  }

  /**
   * Connect to and capture from Bluetooth HR monitor
   * @returns {Promise<Object|null>}
   */
  async captureWearable() {
    try {
      // Check if WebBluetooth is available
      if (!navigator.bluetooth) {
        console.log('[BiometricAdapter] WebBluetooth not available');
        return null;
      }

      // If not connected, try to connect
      if (!this.bleDevice) {
        this.bleDevice = await navigator.bluetooth.requestDevice({
          filters: [
            { services: ['heart_rate'] },
            { namePrefix: 'Polar' },
            { namePrefix: 'WHOOP' },
            { namePrefix: 'Garmin' }
          ],
          optionalServices: ['heart_rate']
        });

        this.bleDevice.addEventListener('gattserverdisconnected', () => {
          console.log('[BiometricAdapter] BLE device disconnected');
          this.bleDevice = null;
          this.bleServer = null;
          this.bleCharacteristic = null;
        });

        this.bleServer = await this.bleDevice.gatt.connect();
        const service = await this.bleServer.getPrimaryService('heart_rate');
        this.bleCharacteristic = await service.getCharacteristic('heart_rate_measurement');

        // Start notifications
        await this.bleCharacteristic.startNotifications();
        this.bleCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
          const value = event.target.value;
          const flags = value.getUint8(0);
          const hrFormat = flags & 0x1;
          
          let heartRate;
          if (hrFormat === 0) {
            heartRate = value.getUint8(1);
          } else {
            heartRate = value.getUint16(1, true);
          }
          
          this.lastBLEValue = heartRate;
        });
      }

      // Wait a moment for a fresh reading
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (this.lastBLEValue) {
        return {
          pulseRate: this.lastBLEValue,
          breathPhase: this._estimateBreathPhase(),
          emotionalValence: this._estimateEmotionalValence(this.lastBLEValue),
          timestamp: Date.now(),
          source: 'wearable_ble',
          confidence: 0.9,
          deviceName: this.bleDevice.name
        };
      }

      return null;
      
    } catch (error) {
      console.error('[BiometricAdapter] Wearable capture error:', error);
      return null;
    }
  }

  /**
   * Manual biometric entry (fallback for demo/testing)
   * @returns {Object}
   */
  captureManual() {
    // Return simulated or cached values
    // In production, this might prompt the user for input
    return {
      pulseRate: null,
      breathPhase: 'unknown',
      emotionalValence: 'neutral',
      timestamp: Date.now(),
      source: 'manual',
      confidence: 0
    };
  }

  /**
   * Estimate heart rate from brightness value (simplified PPG)
   * This is a placeholder - real PPG requires multi-frame analysis
   * @param {number} brightness - Average brightness value
   * @returns {number} Estimated heart rate
   */
  _estimateHRFromBrightness(brightness) {
    // Normalize brightness to rough HR range (60-100)
    // This is NOT accurate - real implementation needs temporal analysis
    const normalized = brightness / 255;
    return Math.round(60 + (normalized * 40));
  }

  /**
   * Estimate breath phase based on time
   * @returns {string} 'inhale'|'hold'|'exhale'|'unknown'
   */
  _estimateBreathPhase() {
    // Simplified: assume 4-second breath cycle
    const cyclePosition = (Date.now() % 4000) / 4000;
    
    if (cyclePosition < 0.4) return 'inhale';
    if (cyclePosition < 0.5) return 'hold';
    if (cyclePosition < 0.9) return 'exhale';
    return 'hold';
  }

  /**
   * Estimate emotional valence based on heart rate
   * @param {number} hr - Heart rate
   * @returns {string} 'anxious'|'calm'|'neutral'|'focused'
   */
  _estimateEmotionalValence(hr) {
    if (!hr) return 'neutral';
    if (hr > 100) return 'anxious';
    if (hr < 60) return 'calm';
    if (hr >= 70 && hr <= 80) return 'focused';
    return 'neutral';
  }

  /**
   * Disconnect Bluetooth device
   */
  async disconnectWearable() {
    if (this.bleDevice && this.bleDevice.gatt.connected) {
      await this.bleDevice.gatt.disconnect();
    }
    this.bleDevice = null;
    this.bleServer = null;
    this.bleCharacteristic = null;
  }

  /**
   * Stop webcam capture and release resources
   */
  stopWebcam() {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(track => track.stop());
      this.webcamStream = null;
    }
  }

  /**
   * Check if Webcam is available
   * @returns {boolean}
   */
  static isWebcamAvailable() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Check if WebBluetooth is available
   * @returns {boolean}
   */
  static isWebBluetoothAvailable() {
    return !!navigator.bluetooth;
  }

  /**
   * Get available capture methods
   * @returns {string[]}
   */
  static getAvailableMethods() {
    const methods = ['manual'];
    if (BiometricAdapter.isWebcamAvailable()) methods.push('webcam');
    if (BiometricAdapter.isWebBluetoothAvailable()) methods.push('wearable');
    return methods;
  }
}

/**
 * Encrypt biometric data before transmission
 * Uses WebCrypto API for sovereign data requirements
 * @param {Object} data - Biometric data
 * @param {string} userId - User identifier for key derivation
 * @returns {Promise<Object>} Encrypted data package
 */
export async function encryptBiometricData(data, userId) {
  try {
    // Derive key from userId (simplified - production should use proper key management)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(userId.padEnd(32, '0').slice(0, 32));
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt data
    const encoded = encoder.encode(JSON.stringify(data));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
      timestamp: Date.now(),
      algorithm: 'AES-GCM-256'
    };
    
  } catch (error) {
    console.error('[BiometricAdapter] Encryption error:', error);
    // Return unencrypted on error (with warning)
    return { ...data, _warning: 'encryption_failed' };
  }
}

// Export singleton for convenience
export const biometricAdapter = new BiometricAdapter();
export default BiometricAdapter;
