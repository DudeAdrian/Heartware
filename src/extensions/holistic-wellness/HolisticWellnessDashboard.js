import TaiChiLibrary from './TaiChiLibrary';
import HouseholdExerciseLibrary from './HouseholdExerciseLibrary';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import SynthFrequencyPlayer from './SynthFrequencyPlayer';
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
  { name: 'Tai Chi', type: 'Movement', description: 'Ancient Chinese movement art for health, balance, and inner peace.' },
  { name: 'Household Exercise', type: 'Movement', description: 'Simple, effective exercise routines for home.' },
];

function HolisticWellnessDashboard() {
  const navigate = useNavigate();
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [journal, setJournal] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);

  const handleJournalSave = () => {
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2000);
  };

  // Frequency player for world traditions
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-heart-600 dark:text-heart-300">Holistic Wellness Protocols</h2>
      <Integrations />
      {selectedProtocol === null ? (
        <GlassGrid columns={1} gap={6}>
          {protocols.map((p, i) => (
            <GlassCard
              key={i}
              className="flex flex-col gap-2 border-l-4 border-heart-400 cursor-pointer"
              onClick={() => setSelectedProtocol(p.name)}
            >
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-heart-700 dark:text-heart-200">{p.name}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{p.type}</span>
                <span className="text-slate-700 dark:text-slate-200">{p.description}</span>
              </div>
            </GlassCard>
          ))}
        </GlassGrid>
      ) : null}


      {/* Protocol detail blocks (full library/catalogue for each) */}
      {selectedProtocol === 'Tibetan Singing Bowls' && (
        <div className="mt-8">
          <GlassCard>
            <>
              <h3 className="text-2xl font-bold mb-2">Tibetan Singing Bowls</h3>
              <div className="mb-2 text-slate-700 dark:text-slate-200">
                <b>What is it?</b> Tibetan singing bowls are ancient sound healing instruments used for meditation, relaxation, and energetic balancing.<br /><br />
                <b>Library of Sounds:</b>
                <ul className="list-disc ml-6 my-2">
                  <li>Classic Bowl (Root Chakra)</li>
                  <li>Large Bowl (Heart Chakra)</li>
                  <li>Crystal Bowl (Crown Chakra)</li>
                </ul>
                <TibetanBowlMeditation />
                <div className="mt-4">
                  <b>Explore More:</b>
                  <ul className="list-disc ml-6 my-2">
                    <li>Learn about chakra frequencies and bowl types</li>
                    <li>Guided meditations with bowls (coming soon)</li>
                  </ul>
                </div>
              </div>
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
            </>
          </GlassCard>
        </div>
      )}


      {selectedProtocol === 'Solfeggio 528Hz' && (
        <div className="mt-8">
          <GlassCard>
            <>
              <h3 className="text-2xl font-bold mb-2">Solfeggio Frequencies Library</h3>
              <div className="mb-2 text-slate-700 dark:text-slate-200">
                <b>What is it?</b> The Solfeggio scale is a set of ancient frequencies used for healing, transformation, and meditation.<br /><br />
                <b>Audio Player Catalogue:</b>
                <div className="grid grid-cols-1 gap-4 my-2">
                  {[{label:'396Hz (Liberation)',file:'/audio/solfeggio-396hz.mp3',desc:'Removes fear/guilt.',attribution:'Pixabay (CC0)'},{label:'417Hz (Change)',file:'/audio/solfeggio-417hz.mp3',desc:'Facilitates change.',attribution:'Pixabay (CC0)'},{label:'528Hz (Miracles)',file:'/audio/solfeggio-528hz.mp3',desc:'DNA repair.',attribution:'Pixabay (CC0)'},{label:'639Hz (Relationships)',file:'/audio/solfeggio-639hz.mp3',desc:'Connects/relationships.',attribution:'Pixabay (CC0)'},{label:'741Hz (Awakening)',file:'/audio/solfeggio-741hz.mp3',desc:'Awakening intuition.',attribution:'Pixabay (CC0)'},{label:'852Hz (Return to Spirit)',file:'/audio/solfeggio-852hz.mp3',desc:'Spiritual order.',attribution:'Pixabay (CC0)'}].map(freq => (
                    <div key={freq.label} className="p-2 rounded bg-slate-100 dark:bg-slate-800">
                      <div className="font-semibold mb-1">{freq.label}</div>
                      <audio controls className="w-full mb-1">
                        <source src={freq.file} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <div className="text-xs text-slate-500 italic">Attribution: {freq.attribution}</div>
                      <div className="text-xs text-slate-600">{freq.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <b>Explore More:</b>
                  <ul className="list-disc ml-6 my-2">
                    <li>Learn about Solfeggio frequencies and their effects</li>
                    <li>Guided meditations with each frequency (coming soon)</li>
                  </ul>
                </div>
              </div>
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
            </>
          </GlassCard>
        </div>
      )}

      {selectedProtocol === 'Theta Binaural' && (
        <div className="mt-8">
          <GlassCard>
            <>
              <h3 className="text-2xl font-bold mb-2">Theta Binaural</h3>
              <div className="mb-2 text-slate-700 dark:text-slate-200">
                <b>What is it?</b> Theta binaural beats are audio tracks that use two slightly different frequencies to create a perceived third frequency in the brain, promoting deep relaxation and meditation.<br /><br />
                <b>Binaural Beat Player:</b>
                <BinauralBeatPlayer />
                <div className="mt-4">
                  <b>Explore More:</b>
                  <ul className="list-disc ml-6 my-2">
                    <li>Learn about brainwave entrainment and theta states</li>
                    <li>Guided meditations with theta binaural beats (coming soon)</li>
                  </ul>
                </div>
              </div>
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
            </>
          </GlassCard>
        </div>
      )}

      {selectedProtocol === 'Gong Bath' && (
        <div className="mt-8">
          <GlassCard>
            <>
              <h3 className="text-2xl font-bold mb-2">Gong Bath</h3>
              <div className="mb-2 text-slate-700 dark:text-slate-200">
                <b>What is it?</b> Gong baths are immersive sound healing experiences using gongs to create deep, resonant vibrations. Used for relaxation, energetic clearing, and spiritual awakening.<br /><br />
                <b>Indigenous/Ancestral Context:</b> Gongs have been used for thousands of years in Asia (China, Indonesia, Southeast Asia) for ritual, healing, and ceremony. Sound immersion and drumming are found in indigenous cultures worldwide for trance, healing, and spiritual connection.<br /><br />
                <b>Benefits:</b> Stress relief, energetic cleansing, emotional release, and expanded awareness.<br /><br />
                <b>How to use:</b> Listen to the virtual gong bath below, or attend a live session. Allow the sound to wash over you and notice sensations, emotions, and insights.
              </div>
              <GongBathMeditation />
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
            </>
          </GlassCard>
        </div>
      )}

    </div>
  );
}

export default HolisticWellnessDashboard;
