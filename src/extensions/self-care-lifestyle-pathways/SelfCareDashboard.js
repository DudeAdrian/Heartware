import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';

const routines = [
  { name: 'Morning Routine', details: 'Meditation, journaling, hydration', icon: '🌅' },
  { name: 'Evening Routine', details: 'Stretching, gratitude, sleep prep', icon: '🌙' },
  { name: 'Weekly Check-In', details: 'Reflect, plan, set intentions', icon: '📅' },
];

const SelfCareDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-300">Self-Care & Lifestyle Pathways</h2>
    <GlassGrid columns={1} gap={6}>
      {routines.map((r, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-green-400">
          <span className="text-3xl">{r.icon}</span>
          <div>
            <div className="text-lg font-semibold">{r.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{r.details}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default SelfCareDashboard;
