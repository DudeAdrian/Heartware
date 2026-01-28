import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const visualizationSteps = [
  { step: 'Relax & Settle', desc: 'Sit comfortably, close your eyes, and take a few deep breaths.' },
  { step: 'Choose a Scene', desc: 'Imagine a peaceful place (forest, beach, mountain, etc.).' },
  { step: 'Engage the Senses', desc: 'Notice sights, sounds, smells, and sensations in your scene.' },
  { step: 'Intention Setting', desc: 'Set a healing or goal-oriented intention for your visualization.' },
  { step: 'Return & Reflect', desc: 'Gently return to the present, open your eyes, and reflect on your experience.' },
];

const GuidedVisualization = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < visualizationSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Guided Visualization Journey</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {visualizationSteps.length}</div>
          <div className="mb-2">
            <b>{visualizationSteps[current].step}</b>: {visualizationSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === visualizationSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Visualization complete! Notice how you feel and what insights arose.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Journey</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Visualization is used in indigenous, yogic, and modern mind-body traditions for healing and transformation.</div>
    </GlassCard>
  );
};

export default GuidedVisualization;
