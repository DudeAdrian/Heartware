import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';

const emergencies = [
  { name: 'Emergency Contacts', details: 'Call or message your emergency contacts', icon: '📞' },
  { name: 'Crisis Resources', details: 'Hotlines and support', icon: '🚨' },
  { name: 'Safety Plan', details: 'View or update your safety plan', icon: '📝' },
];

const EmergencyDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-rose-600 dark:text-rose-300">Emergency & Safety</h2>
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
