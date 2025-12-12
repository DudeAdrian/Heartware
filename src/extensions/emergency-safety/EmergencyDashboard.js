
import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const emergencies = [
  // Global & Local Protocols
  { name: 'Emergency Contacts', details: 'Call or message your emergency contacts', icon: '📞' },
  { name: 'Crisis Resources', details: 'Hotlines and support (911, 112, Lifeline, Red Cross)', icon: '🚨' },
  { name: 'Safety Plan', details: 'View or update your safety plan', icon: '📝' },
  { name: 'Location Alerts', details: 'Check-in and location-based alerts', icon: '📍' },

  // Spiritual & Psychological First Aid
  { name: 'Spiritual First Aid', details: 'Guided prayer, meditation, and ritual', icon: '🕊️' },
  { name: 'Psychological First Aid', details: 'Immediate support for trauma and crisis', icon: '🧠' },
  { name: 'Disaster Recovery', details: 'Guides for trauma and disaster recovery', icon: '🌪️' },

  // Community & Wearables
  { name: 'Community Response', details: 'Connect to local support networks', icon: '🤝' },
  { name: 'Medical ID', details: 'Wearable and digital medical ID', icon: '🆔' },
];

const EmergencyDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-rose-600 dark:text-rose-300">Emergency & Safety</h2>
    <Integrations />
    <GlassGrid columns={1} gap={6}>
      {emergencies.map((e, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-rose-400">
          <span className="text-3xl">{e.icon}</span>
          <div>
            <div className="text-lg font-semibold">{e.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{e.details}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default EmergencyDashboard;
