import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const aromatherapySteps = [
  { step: 'Choose an Oil', desc: 'Select an essential oil (e.g., lavender for relaxation, peppermint for energy, eucalyptus for clarity).' },
  { step: 'Prepare the Space', desc: 'Diffuse the oil, add to a bath, or place a drop on a tissue. Ensure good ventilation.' },
  { step: 'Inhale & Notice', desc: 'Close your eyes, inhale the aroma deeply, and notice any shifts in mood or sensation.' },
  { step: 'Set Intention', desc: 'Focus on your intention (calm, energy, clarity, etc.) as you breathe in the scent.' },
  { step: 'Reflect', desc: 'After a few minutes, reflect on how you feel and any changes in your state.' },
];

const AromatherapyGuide = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < aromatherapySteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Aromatherapy Experience</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {aromatherapySteps.length}</div>
          <div className="mb-2">
            <b>{aromatherapySteps[current].step}</b>: {aromatherapySteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === aromatherapySteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Session complete! Notice your mood and energy after aromatherapy.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Session</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Aromatherapy is used in many cultures for healing, ritual, and mood support. Use only safe, high-quality oils.</div>
    </GlassCard>
  );
};

export default AromatherapyGuide;
