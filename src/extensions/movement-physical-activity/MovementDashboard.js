
import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const activities = [
  // Yoga & Mindful Movement
  { name: 'Yoga', details: '20 min morning flow (Hatha, Vinyasa, Yin)', icon: '🧘‍♀️' },
  { name: 'Qigong', details: '15 min energy cultivation', icon: '🌬️' },
  { name: 'Tai Chi', details: '10 min gentle forms', icon: '☯️' },
  { name: 'Walking', details: '30 min after lunch (mindful, forest, urban)', icon: '🚶‍♂️' },
  { name: 'Stretching', details: '5 min break (dynamic/static)', icon: '🤸‍♂️' },

  // Martial Arts & Dance
  { name: 'Martial Arts', details: '10 min shadowboxing or kata', icon: '🥋' },
  { name: 'Dance', details: 'Freeform, ecstatic, or cultural dance', icon: '💃' },
  { name: 'Primal Movement', details: 'Animal flow, crawling, rolling', icon: '🦍' },

  // Adaptive & All Ages
  { name: 'Chair Yoga', details: 'Gentle movement for mobility', icon: '🪑' },
  { name: 'Kids Movement', details: 'Playful exercise for children', icon: '🧒' },
  { name: 'Elder Mobility', details: 'Balance and fall prevention', icon: '👴' },

  // Modern & Tracking
  { name: 'Step Counter', details: 'Track daily steps', icon: '📱' },
  { name: 'Posture Check', details: 'Reminders and feedback', icon: '🦴' },
  { name: 'Mobility Assessment', details: 'Range of motion self-check', icon: '🦵' },
];

const MovementDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-300">Movement & Physical Activity</h2>
    <Integrations />
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
