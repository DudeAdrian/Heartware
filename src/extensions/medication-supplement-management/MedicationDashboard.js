

import React, { useState } from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';
import BridgedSubTab from '../../components/BridgedSubTab';

const meds = [
  // Conventional
  { name: 'Vitamin D', time: '8:00 AM', icon: '💊' },
  { name: 'Probiotic', time: '12:00 PM', icon: '🦠' },
  { name: 'Magnesium', time: '9:00 PM', icon: '🧂' },
  { name: 'Aspirin', time: 'as needed', icon: '🩹' },

  // Herbal & Traditional
  { name: 'Ashwagandha', time: 'morning', icon: '🌱' },
  { name: 'Reishi Mushroom', time: 'evening', icon: '🍄' },
  { name: 'Ginger Tea', time: 'after meals', icon: '🍵' },
  { name: 'Elderberry Syrup', time: 'immune support', icon: '🫐' },

  // Homeopathic & Nutraceutical
  { name: 'Arnica 30C', time: 'injury', icon: '🧴' },
  { name: 'Omega-3', time: 'with food', icon: '🐟' },
  { name: 'Propolis', time: 'throat', icon: '🍯' },
  { name: 'Turmeric', time: 'anti-inflammatory', icon: '🟠' },
];


const MedicationDashboard = () => {
  const [selectedMed, setSelectedMed] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div style={{color: '#0af', fontWeight: 'bold', marginBottom: 8}}>MedicationDashboard.js is rendering (debug)</div>
      <h2 className="text-3xl font-bold mb-6 text-violet-600 dark:text-violet-300">Medication & Supplement Management</h2>
      <Integrations />
      <GlassGrid columns={1} gap={6}>
        {meds.map((m, i) => (
          <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-violet-400 cursor-pointer" onClick={() => setSelectedMed(m.name)}>
            <span className="text-3xl">{m.icon}</span>
            <div>
              <div className="text-lg font-semibold">{m.name}</div>
              <div className="text-base text-slate-700 dark:text-slate-200">{m.time}</div>
            </div>
            <button className="ml-auto px-3 py-1 rounded bg-violet-200 dark:bg-violet-700 text-violet-900 dark:text-violet-100" onClick={e => { e.stopPropagation(); setSelectedMed(m.name); }}>
              View Actions
            </button>
          </GlassCard>
        ))}
      </GlassGrid>
      {selectedMed && (
        <div className="mt-8">
          <BridgedSubTab subTabKey={selectedMed} />
          <button className="mt-4 px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100" onClick={() => setSelectedMed(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicationDashboard;
