import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';


const feedback = [
  // Biofeedback & HRV
  { name: 'HRV Training', details: 'Heart rate variability session', icon: '💓' },
  { name: 'Breath Pacer', details: 'Guided breathing exercise', icon: '🌬️' },
  { name: 'Neurofeedback', details: 'Brainwave training (alpha/theta)', icon: '🧠' },
  { name: 'GSR Monitor', details: 'Skin conductance for stress', icon: '🖐️' },

  // Somatic & Trauma Healing
  { name: 'Relaxation', details: 'Progressive muscle relaxation', icon: '🧘‍♂️' },
  { name: 'Tapping (EFT)', details: 'Emotional Freedom Technique', icon: '🤲' },
  { name: 'TRE (Tension Release)', details: 'Somatic shaking for trauma release', icon: '🦵' },

  // Resilience & Regulation
  { name: 'Resilience Builder', details: 'Track stress and recovery', icon: '🛡️' },
  { name: 'Coherence Breathing', details: 'Synchronize heart and mind', icon: '🔄' },
  { name: 'Cold Exposure', details: 'Wim Hof or cold shower', icon: '❄️' },
];

const BiofeedbackDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-cyan-600 dark:text-cyan-300">Biofeedback & Self-Regulation</h2>
    <Integrations />
    <GlassGrid columns={1} gap={6}>
      {feedback.map((f, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-cyan-400">
          <span className="text-3xl">{f.icon}</span>
          <div>
            <div className="text-lg font-semibold">{f.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{f.details}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default BiofeedbackDashboard;
