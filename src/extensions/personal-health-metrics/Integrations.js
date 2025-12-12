import React from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const Integrations = () => (
  <GlassCard className="mb-4">
    <h3 className="text-xl font-bold mb-2">Device Integrations</h3>
    <ul className="space-y-2">
      <li>Connect to Apple Health, Google Fit, Fitbit, Oura, Garmin</li>
      <li>Sync real-time vitals, sleep, activity, HRV</li>
      <li>Enable smart home wellness (air quality, lighting)</li>
    </ul>
  </GlassCard>
);

export default Integrations;
