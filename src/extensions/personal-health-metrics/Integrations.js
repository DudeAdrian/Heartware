import React from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

  <GlassCard className="mb-4">
    <h3 className="text-xl font-bold mb-2">Device Integrations</h3>
    <ul className="space-y-2">
      <li>Connect to Apple Health, Google Fit, Fitbit, Oura, Garmin</li>
      <li>Sync real-time vitals, sleep, activity, HRV</li>
      <li>Enable smart home wellness (air quality, lighting)</li>
    </ul>
  </GlassCard>
);

const Integrations = () => (
  <GlassCard className="mb-4">
    <h3 className="text-xl font-bold mb-2">Device & Self-Assessment Integrations</h3>
    <ul className="space-y-2">
      <li>Connect to Apple Health, Google Fit, Fitbit, Oura, Garmin, Withings</li>
      <li>Sync real-time vitals, sleep, activity, HRV, SpO2, temperature</li>
      <li>Enable smart home wellness (air quality, lighting, EMF sensors)</li>
      <li>Ayurveda dosha and agni self-checks (interactive quizzes)</li>
      <li>TCM pulse and tongue self-assessment tools</li>
      <li>Global health APIs: WHO, CDC, Blue Zones, longevity research</li>
      <li>Integrate mood, energy, and stress check-ins (emoji, slider, journaling)</li>
      <li>Personalized recommendations based on cross-cultural metrics</li>
    </ul>
  </GlassCard>
);
export default Integrations;
