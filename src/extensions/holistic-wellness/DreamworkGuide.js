import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const dreamworkSteps = [
  { step: 'Set Intention', desc: 'Before sleep, set an intention to remember and learn from your dreams.' },
  { step: 'Dream Recall', desc: 'Upon waking, remain still and recall as much of your dream as possible.' },
  { step: 'Journal', desc: 'Write down your dream in detail, including feelings, symbols, and events.' },
  { step: 'Reflect', desc: 'Consider the meaning, messages, or patterns in your dream.' },
  { step: 'Integration', desc: 'Apply insights from your dream to your waking life. Share with a trusted friend or guide if desired.' },
];

const DreamworkGuide = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < dreamworkSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Dreamwork Practice</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {dreamworkSteps.length}</div>
          <div className="mb-2">
            <b>{dreamworkSteps[current].step}</b>: {dreamworkSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === dreamworkSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Practice complete! Notice any insights or patterns from your dreams.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Practice</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Dreamwork is practiced in shamanic, indigenous, and modern traditions for healing, guidance, and creativity.</div>
    </GlassCard>
  );
};

export default DreamworkGuide;
