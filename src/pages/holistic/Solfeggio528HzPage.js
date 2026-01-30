import React, { useState } from "react";
import SynthFrequencyPlayer from "../../extensions/holistic-wellness/SynthFrequencyPlayer";
import BridgedSubTab from "../../components/BridgedSubTab";

const solfeggioFrequencies = [
  { name: 'Solfeggio 174Hz', freq: 174, description: 'Pain relief, grounding.' },
  { name: 'Solfeggio 285Hz', freq: 285, description: 'Tissue healing, rejuvenation.' },
  { name: 'Solfeggio 396Hz', freq: 396, description: 'Liberation from fear, guilt.' },
  { name: 'Solfeggio 417Hz', freq: 417, description: 'Undoing situations, facilitating change.' },
  { name: 'Solfeggio 528Hz', freq: 528, description: 'DNA repair, transformation, miracles.' },
  { name: 'Solfeggio 639Hz', freq: 639, description: 'Connection, relationships.' },
  { name: 'Solfeggio 741Hz', freq: 741, description: 'Awakening intuition, consciousness.' },
  { name: 'Solfeggio 852Hz', freq: 852, description: 'Return to spiritual order.' },
  { name: 'Solfeggio 963Hz', freq: 963, description: 'Pineal gland, unity, oneness.' },
];

const Solfeggio528HzPage = () => {
  const [journal, setJournal] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);

  const handleJournalSave = () => {
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-heart-600 dark:text-heart-300">Solfeggio Frequency Catalogue</h2>
      <div className="mb-4 text-slate-700 dark:text-slate-200">
        <b>What is it?</b> The Solfeggio scale is a set of ancient frequencies used in sacred music and sound healing, each with unique effects on the mind and body. Explore and play any frequency below.<br /><br />
        <b>How to use:</b> Click play on any frequency to experience its effects. Use headphones for best results.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {solfeggioFrequencies.map(f => (
          <div key={f.freq} className="p-4 rounded-lg bg-white/30 dark:bg-slate-800/40 shadow">
            <div className="font-semibold text-lg mb-1">{f.name}</div>
            <div className="text-sm mb-2 text-slate-600 dark:text-slate-300">{f.description}</div>
            <SynthFrequencyPlayer frequency={f.freq} label={f.name} defaultDuration={180} />
          </div>
        ))}
      </div>
      <div className="mb-2">
        <b>Personal Journal:</b>
        <div>
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
      </div>
      <BridgedSubTab subTabKey="Solfeggio 528Hz" />
    </div>
  );
};

export default Solfeggio528HzPage;
