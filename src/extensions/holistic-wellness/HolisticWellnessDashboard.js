
import React, { useState } from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';
import BridgedSubTab from '../../components/BridgedSubTab';



const protocols = [
  // Sound & Frequency Healing
  { name: 'Solfeggio 528Hz', type: 'Frequency', description: 'DNA repair, transformation, miracles.' },
  { name: 'Theta Binaural', type: 'Vibration', description: 'Deep relaxation, meditation, healing.' },
  { name: 'Tibetan Singing Bowls', type: 'Sound', description: 'Harmonize body and mind with ancient Himalayan sound therapy.' },
  { name: 'Gong Bath', type: 'Sound', description: 'Immersive sound healing for deep relaxation and energetic clearing.' },

  // Energy & Subtle Body Practices
  { name: 'Chakra Balancing', type: 'Energy', description: 'Align and balance energy centers (yogic/ayurvedic).' },
  { name: 'Reiki', type: 'Energy', description: 'Japanese hands-on healing for stress reduction and energy flow.' },
  { name: 'Qi Gong', type: 'Energy', description: 'Chinese practice for cultivating and balancing life force (Qi).' },
  { name: 'Pranic Healing', type: 'Energy', description: 'No-touch energy healing using prana (life energy).' },

  // Traditional Medicine & Ritual
  { name: 'Ayurveda Dinacharya', type: 'Daily Ritual', description: 'Daily self-care routines for balance (oil pulling, abhyanga, tongue scraping).' },
  { name: 'TCM Meridian Tapping', type: 'Acupressure', description: 'Stimulate meridian points for emotional and physical health.' },
  { name: 'Amazonian Plant Dieta', type: 'Shamanic', description: 'Plant-based healing and vision questing (with guidance).'},
  { name: 'Sweat Lodge Ceremony', type: 'Indigenous', description: 'Purification and renewal through heat and prayer.' },

  // Modern Integrative & Mind-Body
  { name: 'Heart Coherence Breathing', type: 'Breathwork', description: 'Synchronize heart and mind for emotional balance.' },
  { name: 'Guided Visualization', type: 'Mind-Body', description: 'Imagery for healing, goal setting, and stress relief.' },
  { name: 'Forest Bathing (Shinrin-yoku)', type: 'Nature Therapy', description: 'Japanese practice of mindful immersion in nature.' },
  { name: 'Aromatherapy', type: 'Scent', description: 'Essential oils for mood, relaxation, and healing.' },

  // Spiritual & Wisdom Traditions
  { name: 'Mantra Meditation', type: 'Spiritual', description: 'Chanting sacred sounds for focus and spiritual growth.' },
  { name: 'Ho’oponopono', type: 'Hawaiian', description: 'Forgiveness and reconciliation practice for inner peace.' },
  { name: 'Dreamwork', type: 'Shamanic/Modern', description: 'Exploring dreams for insight, healing, and guidance.' },
  { name: 'Moon Rituals', type: 'Lunar', description: 'Setting intentions and releasing with lunar cycles.' },
];

const HolisticWellnessDashboard = () => {
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div style={{color: '#0af', fontWeight: 'bold', marginBottom: 8}}>HolisticWellnessDashboard.js is rendering (debug)</div>
      <h2 className="text-3xl font-bold mb-6 text-heart-600 dark:text-heart-300">Holistic Wellness Protocols</h2>
      <Integrations />
      <GlassGrid columns={1} gap={6}>
        {protocols.map((p, i) => (
          <GlassCard key={i} className="flex flex-col gap-2 border-l-4 border-heart-400 cursor-pointer" onClick={() => setSelectedProtocol(p.name)}>
            <div className="text-xl font-semibold text-heart-500">{p.name}</div>
            <div className="text-sm text-gray-500">{p.type}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{p.description}</div>
            <button className="mt-2 px-3 py-1 rounded bg-heart-200 dark:bg-heart-700 text-heart-900 dark:text-heart-100 w-max self-end" onClick={e => { e.stopPropagation(); setSelectedProtocol(p.name); }}>
              View Actions
            </button>
          </GlassCard>
        ))}
      </GlassGrid>
      {selectedProtocol && (
        <div className="mt-8">
          <BridgedSubTab subTabKey={selectedProtocol} />
          <button className="mt-4 px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100" onClick={() => setSelectedProtocol(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default HolisticWellnessDashboard;
