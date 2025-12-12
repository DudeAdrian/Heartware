
import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const records = [
  // Digital & Clinical
  { name: 'Lab Results', details: 'Bloodwork, imaging, etc.', icon: '🧪' },
  { name: 'Immunizations', details: 'Vaccination records', icon: '💉' },
  { name: 'Documents', details: 'Upload/view health docs', icon: '📄' },
  { name: 'EHR Sync', details: 'Connect to digital health vaults', icon: '🔗' },

  // Holistic & Integrative
  { name: 'Holistic Health History', details: 'Mind, body, spirit timeline', icon: '🧘' },
  { name: 'Life Story', details: 'Personal narrative and milestones', icon: '📜' },
  { name: 'Cultural Health Narrative', details: 'Traditions, beliefs, and practices', icon: '🌏' },
  { name: 'Family Health Tree', details: 'Genogram and ancestry', icon: '🌳' },
];

const HealthRecordsDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-slate-600 dark:text-slate-300">Personal Health Records</h2>
    <Integrations />
    <GlassGrid columns={1} gap={6}>
      {records.map((r, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-slate-400">
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

export default HealthRecordsDashboard;
