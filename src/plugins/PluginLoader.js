// src/plugins/PluginLoader.js
// Centralized plugin registration for Heartware
import PluginRegistry from '../core/PluginRegistry';
import WeatherPlugin from './WeatherPlugin';
import SmartAlertsPlugin from './SmartAlertsPlugin';
import IoTDevicesPlugin from './IoTDevicesPlugin';
import AquaponicsPlugin from './AquaponicsPlugin';
// import SkillsDirectoryPlugin from './SkillsDirectoryPlugin'; // Placeholder, needs real implementation

// Example: pass your SofieCore instance here
export function registerAllPlugins(sofieCore) {
  const registry = sofieCore.getService('pluginRegistry');
  if (!registry) throw new Error('PluginRegistry not found');

  registry.registerPlugin('weather', {
    name: 'Weather Plugin',
    version: '1.0.0',
    description: 'Real-time weather integration',
    author: 'Heartware',
    category: 'Environment',
    pluginClass: WeatherPlugin,
  });
  registry.registerPlugin('smart-alerts', {
    name: 'Smart Alerts Plugin',
    version: '1.0.0',
    description: 'Configurable threshold-based notifications',
    author: 'Heartware',
    category: 'System',
    pluginClass: SmartAlertsPlugin,
  });
  registry.registerPlugin('iot-devices', {
    name: 'IoT Devices Plugin',
    version: '1.0.0',
    description: 'Smart device integration and monitoring',
    author: 'Heartware',
    category: 'IoT',
    pluginClass: IoTDevicesPlugin,
  });
  registry.registerPlugin('aquaponics', {
    name: 'Aquaponics Manager',
    version: '1.0.0',
    description: 'Monitor and optimize aquaponics systems',
    author: 'Heartware',
    category: 'Food Production',
    pluginClass: AquaponicsPlugin,
  });
  // Add more plugins as needed
}
