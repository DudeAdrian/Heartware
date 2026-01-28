import React, { useState } from 'react';
import TibetanBowlMeditation from './TibetanBowlMeditation';
import GongBathMeditation from './GongBathMeditation';
import MeridianTappingGuide from './MeridianTappingGuide';
import AmazonianPlantDieta from './AmazonianPlantDieta';
import SweatLodgeCeremony from './SweatLodgeCeremony';
import HeartCoherenceBreathing from './HeartCoherenceBreathing';
import GuidedVisualization from './GuidedVisualization';
import ForestBathing from './ForestBathing';
import AromatherapyGuide from './AromatherapyGuide';
import MantraMeditation from './MantraMeditation';
import HoOponopono from './HoOponopono';
import DreamworkGuide from './DreamworkGuide';
import MoonRituals from './MoonRituals';
import BinauralBeatPlayer from './BinauralBeatPlayer';
import ChakraGuidedVisualization from './ChakraGuidedVisualization';
import ReikiGuidedSession from './ReikiGuidedSession';
import QiGongGuidedSession from './QiGongGuidedSession';
import PranicHealingGuidedSession from './PranicHealingGuidedSession';
import DinacharyaChecklist from './DinacharyaChecklist';
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
  { name: 'Ho\'oponopono', type: 'Hawaiian', description: 'Forgiveness and reconciliation practice for inner peace.' },
  { name: 'Dreamwork', type: 'Shamanic/Modern', description: 'Exploring dreams for insight, healing, and guidance.' },
  { name: 'Moon Rituals', type: 'Lunar', description: 'Setting intentions and releasing with lunar cycles.' },
];

const HolisticWellnessDashboard = () => {
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Frequency player for world traditions
  const frequencyLibrary = [
    { name: 'Solfeggio 174Hz', freq: 174, culture: 'Solfeggio', description: 'Pain relief, grounding.' },
    { name: 'Solfeggio 285Hz', freq: 285, culture: 'Solfeggio', description: 'Tissue healing, rejuvenation.' },
    { name: 'Solfeggio 396Hz', freq: 396, culture: 'Solfeggio', description: 'Liberation from fear, guilt.' },
    { name: 'Solfeggio 417Hz', freq: 417, culture: 'Solfeggio', description: 'Undoing situations, facilitating change.' },
    { name: 'Solfeggio 528Hz', freq: 528, culture: 'Solfeggio', description: 'DNA repair, transformation, miracles.' },
    { name: 'Solfeggio 639Hz', freq: 639, culture: 'Solfeggio', description: 'Connection, relationships.' },
    { name: 'Solfeggio 741Hz', freq: 741, culture: 'Solfeggio', description: 'Awakening intuition, consciousness.' },
    { name: 'Solfeggio 852Hz', freq: 852, culture: 'Solfeggio', description: 'Return to spiritual order.' },
    { name: 'Solfeggio 963Hz', freq: 963, culture: 'Solfeggio', description: 'Pineal gland, unity, oneness.' },
    { name: 'Ancient Greek 432Hz', freq: 432, culture: 'Greek', description: 'Natural tuning, harmony with nature.' },
    { name: 'Tibetan 110Hz', freq: 110, culture: 'Tibetan', description: 'Chanting, deep meditation.' },
    { name: 'Egyptian 256Hz', freq: 256, culture: 'Egyptian', description: 'Sacred geometry, temple resonance.' },
    { name: 'Gregorian 1024Hz', freq: 1024, culture: 'Gregorian', description: 'Chant resonance, clarity.' },
    { name: '432Hz OM', freq: 432, culture: 'Vedic', description: 'Universal OM, deep relaxation.' },
  ];

  const [selectedFreq, setSelectedFreq] = useState(frequencyLibrary[4]); // Default 528Hz
  const [duration, setDuration] = useState(300); // Default 5 minutes (300s)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [journal, setJournal] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);

  const playFrequency = () => {
    if (!isPlaying) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(selectedFreq.freq, ctx.currentTime);
      osc.connect(ctx.destination);
      osc.start();
      setAudioCtx(ctx);
      setOscillator(osc);
      setIsPlaying(true);
      const id = setTimeout(() => {
        stopFrequency();
      }, duration * 1000);
      setTimerId(id);
    }
  };

  const stopFrequency = () => {
    if (oscillator && audioCtx) {
      oscillator.stop();
      audioCtx.close();
      setOscillator(null);
      setAudioCtx(null);
    }
    setIsPlaying(false);
    if (timerId) clearTimeout(timerId);
  };

  const handleJournalSave = () => {
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
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

      {selectedProtocol === 'Theta Binaural' && (
        <>
          <div className="mt-8">
            <GlassCard>
              <h3 className="text-2xl font-bold mb-2">Theta Binaural Beats</h3>
              <div className="mb-2 text-slate-700 dark:text-slate-200">
                <b>What is it?</b> Theta binaural beats are audio tones played at slightly different frequencies in each ear, producing a perceived beat at the difference (e.g., 4Hz). This entrains the brain to a theta state (4–8Hz), associated with deep relaxation, meditation, and healing.<br /><br />
                <b>Indigenous/Ancestral Context:</b> Rhythmic drumming, chanting, and sound rituals have been used by indigenous cultures worldwide (e.g., Native American, Aboriginal, Amazonian, Siberian, African) to induce trance, healing, and spiritual connection. Binaural beats are a modern extension of these ancient practices.<br /><br />
                <b>Benefits:</b> Deep relaxation, stress reduction, enhanced creativity, access to subconscious, and support for healing.<br /><br />
                <b>How to use:</b> Use headphones. Select a carrier frequency (e.g., 200Hz) and a theta beat (e.g., 4Hz). Listen for 10–30 minutes during meditation or rest.
              </div>
              <BinauralBeatPlayer />
              <div className="mb-2">
                <b>Personal Journal:</b>
                <textarea
                  className="w-full p-2 border rounded mt-2"
                  rows={3}
                  value={journal}
                  onChange={e => setJournal(e.target.value)}
                  placeholder="Describe your experience, feelings, or insights..."
                />
                <button className="mt-2 px-3 py-1 rounded bg-heart-200 text-heart-900 font-semibold" onClick={handleJournalSave}>
                  Save Journal
                </button>
                {journalSaved && <span className="ml-3 text-emerald-600 font-bold">Saved!</span>}
              </div>
              <BridgedSubTab subTabKey={selectedProtocol} />
              <button className="mt-4 px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100" onClick={() => setSelectedProtocol(null)}>
                Close
              </button>
            </GlassCard>
          </div>
          <div className="mt-8">
            <GlassCard>
              <h3 className="text-2xl font-bold mb-2">Frequency & Sound Healing Library</h3>
              <div className="mb-2 text-slate-700 dark:text-slate-200">
                <b>What is it?</b> Explore a curated library of healing frequencies from world traditions. Select a frequency, set your session duration, and experience the resonance.<br /><br />
                <b>How to use:</b> Choose a frequency, set your session length, and press Play. Listen during meditation, relaxation, or healing rituals.<br /><br />
                <b>Frequencies:</b>
                <ul className="mb-2">
                  {frequencyLibrary.map(f => (
                    <li key={f.freq} style={{fontWeight: selectedFreq.freq === f.freq ? 'bold' : 'normal', color: selectedFreq.freq === f.freq ? '#d9008d' : undefined}}>
                      <button style={{marginRight: 8}} onClick={() => setSelectedFreq(f)} disabled={isPlaying}>{f.name}</button>
                      <span style={{fontSize: '0.95em', color: '#888'}}>{f.culture} — {f.description}</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-2">
                  <label><b>Session Duration:</b> </label>
                  <select value={duration} onChange={e => setDuration(Number(e.target.value))} disabled={isPlaying}>
                    <option value={60}>1 minute</option>
                    <option value={180}>3 minutes</option>
                    <option value={300}>5 minutes</option>
                    <option value={600}>10 minutes</option>
                    <option value={1200}>20 minutes</option>
                    <option value={1800}>30 minutes</option>
                    <option value={3600}>1 hour</option>
                  </select>
                </div>
              </div>
              <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-4 mr-2" onClick={playFrequency} disabled={isPlaying}>
                {isPlaying ? `Playing ${selectedFreq.name}...` : `Play ${selectedFreq.name}`}
              </button>
              {isPlaying && (
                <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-4" onClick={stopFrequency}>
                  Stop
                </button>
              )}
              <div className="mb-2">
                <b>Personal Journal:</b>
                <textarea
                  className="w-full p-2 border rounded mt-2"
                  rows={3}
                  value={journal}
                  onChange={e => setJournal(e.target.value)}
                  placeholder="Describe your experience, feelings, or insights..."
                />
                <button className="mt-2 px-3 py-1 rounded bg-heart-200 text-heart-900 font-semibold" onClick={handleJournalSave}>
                  Save Journal
                </button>
                {journalSaved && <span className="ml-3 text-emerald-600 font-bold">Saved!</span>}
              </div>
              <BridgedSubTab subTabKey={selectedProtocol} />
              <button className="mt-4 px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100" onClick={() => { stopFrequency(); setSelectedProtocol(null); }}>
                Close
              </button>
            </GlassCard>
          </div>
        </>
      )}

      {selectedProtocol && selectedProtocol !== 'Theta Binaural' && selectedProtocol !== 'Solfeggio 528Hz' && (
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
