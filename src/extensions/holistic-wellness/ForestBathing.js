import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const forestBathingSteps = [
  { step: 'Arrive in Nature', desc: 'Find a natural setting (forest, park, garden). Silence your phone and set an intention to be present.' },
  { step: 'Slow Down', desc: 'Walk slowly, breathe deeply, and notice your surroundings.' },
  { step: 'Engage the Senses', desc: 'Touch leaves, smell the air, listen to birds, and observe the light.' },
  { step: 'Sit & Absorb', desc: 'Sit quietly for 5-10 minutes, letting nature’s energy restore you.' },
  { step: 'Reflect & Return', desc: 'Reflect on your experience, give thanks, and return to daily life with renewed calm.' },
];

const ForestBathing = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < forestBathingSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Forest Bathing (Shinrin-yoku)</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {forestBathingSteps.length}</div>
          <div className="mb-2">
            <b>{forestBathingSteps[current].step}</b>: {forestBathingSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === forestBathingSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Session complete! Notice your mood and energy after time in nature.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Session</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Forest bathing is a Japanese practice, but mindful nature immersion is found in indigenous cultures worldwide.</div>
    </GlassCard>
  );
};

export default ForestBathing;
