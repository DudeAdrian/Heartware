import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const mantraSteps = [
  { step: 'Choose a Mantra', desc: 'Select a sacred sound or phrase (e.g., OM, So Hum, Lokah Samastah Sukhino Bhavantu).' },
  { step: 'Settle & Breathe', desc: 'Sit comfortably, close your eyes, and take a few deep breaths.' },
  { step: 'Chant or Repeat', desc: 'Chant the mantra aloud or silently, focusing on its vibration and meaning.' },
  { step: 'Sustain', desc: 'Continue for 3-10 minutes, letting the sound guide your mind to stillness.' },
  { step: 'Reflect', desc: 'Notice any shifts in mood, energy, or awareness. Journal your experience.' },
];

const MantraMeditation = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < mantraSteps.length - 1) {
      setCurrent(current + 1);
    } else {
      setComplete(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setComplete(false);
  };

  return (
    <GlassCard>
      <h4 className="text-xl font-bold mb-2">Mantra Meditation Practice</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {mantraSteps.length}</div>
          <div className="mb-2">
            <b>{mantraSteps[current].step}</b>: {mantraSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === mantraSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Practice complete! Notice the resonance and peace within.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Practice</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Mantra meditation is practiced in Vedic, Buddhist, Sufi, and indigenous traditions for healing and spiritual growth.</div>
    </GlassCard>
  );
};

export default MantraMeditation;
