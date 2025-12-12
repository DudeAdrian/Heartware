
import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const routines = [
  // Daily Rituals
  { name: 'Morning Routine', details: 'Meditation, journaling, hydration', icon: '🌅' },
  { name: 'Evening Routine', details: 'Stretching, gratitude, sleep prep', icon: '🌙' },
  { name: 'Weekly Check-In', details: 'Reflect, plan, set intentions', icon: '📅' },

  // Global Traditions
  { name: 'Ikigai Reflection', details: 'Japanese purpose and joy practice', icon: '🗾' },
  { name: 'Hygge Moment', details: 'Scandinavian coziness and comfort', icon: '🕯️' },
  { name: 'Indigenous Ceremony', details: 'Ritual for gratitude and connection', icon: '🪶' },

  // Modern Wellness
  { name: 'Habit Tracker', details: 'Track daily self-care habits', icon: '✅' },
  { name: 'Digital Detox', details: 'Screen-free time for renewal', icon: '📵' },
  { name: 'Nature Time', details: 'Daily time outdoors', icon: '🌳' },
  { name: 'Community Sharing', details: 'Share routines and inspiration', icon: '🤗' },
];

const SelfCareDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-300">Self-Care & Lifestyle Pathways</h2>
    <Integrations />
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
