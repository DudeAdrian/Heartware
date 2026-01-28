import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const heartCoherenceSteps = [
  { step: 'Settle In', desc: 'Sit comfortably, close your eyes, and bring awareness to your breath.' },
  { step: 'Heart Focus', desc: 'Gently focus your attention on the area around your heart.' },
  { step: 'Heart Breathing', desc: 'Imagine your breath flowing in and out of your heart area. Breathe slowly and deeply.' },
  { step: 'Positive Emotion', desc: 'Recall a positive feeling (gratitude, love, appreciation) and radiate it from your heart.' },
  { step: 'Sustain', desc: 'Continue for 2-5 minutes, noticing any shifts in mood or energy.' },
];

const HeartCoherenceBreathing = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < heartCoherenceSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Heart Coherence Breathing</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {heartCoherenceSteps.length}</div>
          <div className="mb-2">
            <b>{heartCoherenceSteps[current].step}</b>: {heartCoherenceSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === heartCoherenceSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Practice complete! Notice your emotional state and heart rhythm.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Practice</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Heart coherence breathing is used in many traditions for emotional balance and resilience. Practice daily for best results.</div>
    </GlassCard>
  );
};

export default HeartCoherenceBreathing;
