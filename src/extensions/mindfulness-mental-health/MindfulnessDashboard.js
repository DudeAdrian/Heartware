import React, { useState } from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';
import BridgedSubTab from '../../components/BridgedSubTab';

const practices = [
  // Meditation & Mindfulness
  { name: 'Guided Meditation', description: '10-minute mindfulness meditation.', icon: '🧘‍♂️' },
  { name: 'Zen Zazen', description: 'Seated meditation from Zen Buddhism.', icon: '🪷' },
  { name: 'Vipassana', description: 'Insight meditation for self-awareness.', icon: '👁️' },
  { name: 'Loving-Kindness (Metta)', description: 'Cultivate compassion and goodwill.', icon: '💗' },
  { name: 'Stoic Reflection', description: 'Daily journaling and negative visualization.', icon: '📓' },

  // Breathwork
  { name: 'Box Breathing', description: '4-4-4-4 count for stress relief.', icon: '🌬️' },
  { name: 'Alternate Nostril', description: 'Yogic breath for balance (Nadi Shodhana).', icon: '👃' },
  { name: 'Sufi Heart Rhythm', description: 'Breath and heart focus for calm.', icon: '💓' },

  // Emotional & Mental Health
  { name: 'Mood Check-In', description: 'Log your current mood.', icon: '🙂' },
  { name: 'Journaling Prompt', description: 'Reflect on your day or emotions.', icon: '📝' },
  { name: 'Emotional Literacy', description: 'Name and process feelings.', icon: '🎭' },
  { name: 'Gratitude Practice', description: 'List 3 things you’re grateful for.', icon: '🙏' },

  // Indigenous & Group Practices
  { name: 'Talking Circle', description: 'Share and listen in a safe group.', icon: '🪶' },
  { name: 'Nature Mindfulness', description: 'Practice presence outdoors.', icon: '🌳' }
];


const MindfulnessDashboard = () => {
  const [selectedPractice, setSelectedPractice] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-sky-600 dark:text-sky-300">Mindfulness & Mental Health</h2>
      <Integrations />
      <GlassGrid columns={1} gap={6}>
        {practices.map((p, i) => (
          <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-sky-400 cursor-pointer" onClick={() => setSelectedPractice(p.name)}>
            <span className="text-3xl">{p.icon}</span>
            <div>
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-base text-slate-700 dark:text-slate-200">{p.description}</div>
            </div>
            <button className="ml-auto px-3 py-1 rounded bg-sky-200 dark:bg-sky-700 text-sky-900 dark:text-sky-100" onClick={e => { e.stopPropagation(); setSelectedPractice(p.name); }}>
              View Actions
            </button>
          </GlassCard>
        ))}
      </GlassGrid>
      {selectedPractice && (
        <div className="mt-8">
          <BridgedSubTab subTabKey={selectedPractice} />
          <button className="mt-4 px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100" onClick={() => setSelectedPractice(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MindfulnessDashboard;
