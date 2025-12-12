import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';

const activities = [
  { name: 'Yoga', details: '20 min morning flow', icon: '🧘‍♀️' },
  { name: 'Walking', details: '30 min after lunch', icon: '🚶‍♂️' },
  { name: 'Stretching', details: '5 min break', icon: '🤸‍♂️' },
];

const MovementDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-300">Movement & Physical Activity</h2>
    <GlassGrid columns={1} gap={6}>
      {activities.map((a, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-orange-400">
          <span className="text-3xl">{a.icon}</span>
          <div>
            <div className="text-lg font-semibold">{a.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{a.details}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default MovementDashboard;
