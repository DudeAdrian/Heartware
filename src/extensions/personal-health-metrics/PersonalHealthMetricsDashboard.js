import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const metrics = [
  { label: 'Heart Rate', value: '72 bpm', icon: '❤️' },
  { label: 'Sleep', value: '7.5 hrs', icon: '🛌' },
  { label: 'Mood', value: '😊', icon: '🙂' },
  { label: 'Steps', value: '8,200', icon: '👟' },
];

const PersonalHealthMetricsDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-300">Personal Health Metrics</h2>
    <Integrations />
    <GlassGrid columns={2} gap={6}>
      {metrics.map((m, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-emerald-400">
          <span className="text-3xl">{m.icon}</span>
          <div>
            <div className="text-lg font-semibold">{m.label}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{m.value}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default PersonalHealthMetricsDashboard;
