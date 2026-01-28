import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const hoOponoponoSteps = [
  { step: 'Settle & Breathe', desc: 'Sit quietly, close your eyes, and take a few deep breaths.' },
  { step: 'Recall a Situation', desc: 'Bring to mind a person or situation needing healing or forgiveness.' },
  { step: 'Repeat the Phrases', desc: 'Silently or aloud, repeat: "I’m sorry. Please forgive me. Thank you. I love you."' },
  { step: 'Feel & Release', desc: 'Allow any emotions to arise and gently let them go with each breath.' },
  { step: 'Reflect', desc: 'Notice any shifts in your feelings, and journal your experience.' },
];

const HoOponopono = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < hoOponoponoSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Ho’oponopono Practice</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {hoOponoponoSteps.length}</div>
          <div className="mb-2">
            <b>{hoOponoponoSteps[current].step}</b>: {hoOponoponoSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === hoOponoponoSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Practice complete! Notice any peace or release you feel.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Practice</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Ho’oponopono is a Hawaiian practice of forgiveness and reconciliation, used for personal and community healing.</div>
    </GlassCard>
  );
};

export default HoOponopono;
