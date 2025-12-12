import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const practices = [
  { name: 'Guided Meditation', description: '10-minute mindfulness meditation.', icon: '🧘‍♂️' },
  { name: 'Breathwork', description: 'Box breathing for stress relief.', icon: '🌬️' },
  { name: 'Mood Check-In', description: 'Log your current mood.', icon: '🙂' },
];

const MindfulnessDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-sky-600 dark:text-sky-300">Mindfulness & Mental Health</h2>
    <Integrations />
    <GlassGrid columns={1} gap={6}>
      {practices.map((p, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-sky-400">
          <span className="text-3xl">{p.icon}</span>
          <div>
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{p.description}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default MindfulnessDashboard;
