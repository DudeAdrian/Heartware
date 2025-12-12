import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';

const meds = [
  { name: 'Vitamin D', time: '8:00 AM', icon: '💊' },
  { name: 'Probiotic', time: '12:00 PM', icon: '🦠' },
  { name: 'Magnesium', time: '9:00 PM', icon: '🧂' },
];

const MedicationDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-violet-600 dark:text-violet-300">Medication & Supplement Management</h2>
    <GlassGrid columns={1} gap={6}>
      {meds.map((m, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-violet-400">
          <span className="text-3xl">{m.icon}</span>
          <div>
            <div className="text-lg font-semibold">{m.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{m.time}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default MedicationDashboard;
