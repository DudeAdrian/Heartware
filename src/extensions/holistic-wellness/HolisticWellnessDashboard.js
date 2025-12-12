import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const protocols = [
  { name: 'Solfeggio 528Hz', type: 'Frequency', description: 'DNA repair, transformation, miracles.' },
  { name: 'Theta Binaural', type: 'Vibration', description: 'Deep relaxation, meditation, healing.' },
  { name: 'Chakra Balancing', type: 'Energy', description: 'Align and balance energy centers.' },
];

const HolisticWellnessDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-heart-600 dark:text-heart-300">Holistic Wellness Protocols</h2>
    <Integrations />
    <GlassGrid columns={1} gap={6}>
      {protocols.map((p, i) => (
        <GlassCard key={i} className="flex flex-col gap-2 border-l-4 border-heart-400">
          <div className="text-xl font-semibold text-heart-500">{p.name}</div>
          <div className="text-sm text-gray-500">{p.type}</div>
          <div className="text-base text-slate-700 dark:text-slate-200">{p.description}</div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default HolisticWellnessDashboard;
