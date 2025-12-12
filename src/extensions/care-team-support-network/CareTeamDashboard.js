import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';


const team = [
  // Professional & Clinical
  { name: 'Dr. Smith', role: 'Primary Care', icon: '👩‍⚕️' },
  { name: 'Coach Lee', role: 'Wellness Coach', icon: '🧑‍🏫' },
  { name: 'Therapist Kim', role: 'Mental Health', icon: '🧑‍⚕️' },

  // Family & Community
  { name: 'Family Circle', role: 'Loved Ones', icon: '👨‍👩‍👧‍👦' },
  { name: 'Elder Wisdom', role: 'Elders/Ancestors', icon: '🧓' },
  { name: 'Healing Circle', role: 'Group Support', icon: '🪶' },
  { name: 'Support Group', role: 'Peers', icon: '🤝' },

  // Digital & Peer
  { name: 'Online Community', role: 'Digital Support', icon: '🌐' },
  { name: 'Peer Mentor', role: 'Lived Experience', icon: '🧑‍🤝‍🧑' },
  { name: 'Spiritual Guide', role: 'Faith/Tradition', icon: '🕊️' },
];

const CareTeamDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-teal-600 dark:text-teal-300">Care Team & Support Network</h2>
    <Integrations />
    <GlassGrid columns={1} gap={6}>
      {team.map((t, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-teal-400">
          <span className="text-3xl">{t.icon}</span>
          <div>
            <div className="text-lg font-semibold">{t.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{t.role}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default CareTeamDashboard;
