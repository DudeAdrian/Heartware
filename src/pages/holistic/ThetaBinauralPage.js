import React, { useState } from "react";
import SynthFrequencyPlayer from "../../extensions/holistic-wellness/SynthFrequencyPlayer";
import BridgedSubTab from "../../components/BridgedSubTab";

const binauralBeats = [
  { name: 'Delta (1 Hz)', freq: 1, description: 'Deep sleep, healing, unconscious.' },
  { name: 'Theta (4 Hz)', freq: 4, description: 'Deep relaxation, meditation, creativity.' },
  { name: 'Alpha (8 Hz)', freq: 8, description: 'Relaxed focus, stress reduction.' },
  { name: 'Beta (16 Hz)', freq: 16, description: 'Alertness, concentration, cognition.' },
  { name: 'Gamma (32 Hz)', freq: 32, description: 'Peak focus, expanded consciousness.' },
];

const ThetaBinauralPage = () => {
  const [journal, setJournal] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);

  const handleJournalSave = () => {
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-heart-600 dark:text-heart-300">Binaural Beats Catalogue</h2>
      <div className="mb-4 text-slate-700 dark:text-slate-200">
        <b>What is it?</b> Binaural beats are created by playing slightly different frequencies in each ear, producing a perceived beat at the difference. Each frequency range has unique effects on the brain and consciousness.<br /><br />
        <b>How to use:</b> Use headphones. Click play on any beat to experience its effects. Listen for 10–30 minutes for best results.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {binauralBeats.map(b => (
          <div key={b.freq} className="p-4 rounded-lg bg-white/30 dark:bg-slate-800/40 shadow">
            <div className="font-semibold text-lg mb-1">{b.name}</div>
            <div className="text-sm mb-2 text-slate-600 dark:text-slate-300">{b.description}</div>
            <SynthFrequencyPlayer frequency={b.freq} label={b.name} defaultDuration={180} />
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
      <BridgedSubTab subTabKey="Theta Binaural" />
    </div>
  );
};

export default ThetaBinauralPage;
