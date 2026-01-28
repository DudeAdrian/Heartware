import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const moonRitualSteps = [
  { step: 'Set Intention', desc: 'Identify what you wish to manifest or release. Align with the current moon phase (new, full, etc.).' },
  { step: 'Create Sacred Space', desc: 'Light a candle, burn incense, or arrange meaningful objects.' },
  { step: 'Ritual Action', desc: 'Write your intention on paper, meditate, or perform a symbolic gesture (e.g., release paper to water or fire).' },
  { step: 'Gratitude & Closing', desc: 'Give thanks to the moon, nature, and any guides. Close the ritual with a breath or prayer.' },
  { step: 'Reflect', desc: 'Journal your experience and any insights or feelings that arose.' },
];

const MoonRituals = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < moonRitualSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Moon Rituals Guide</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {moonRitualSteps.length}</div>
          <div className="mb-2">
            <b>{moonRitualSteps[current].step}</b>: {moonRitualSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === moonRitualSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Ritual complete! Notice any shifts in energy or awareness.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Ritual</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Moon rituals are practiced in many cultures for intention setting, release, and spiritual connection.</div>
    </GlassCard>
  );
};

export default MoonRituals;
