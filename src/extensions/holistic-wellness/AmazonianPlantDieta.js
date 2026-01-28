import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const dietaSteps = [
  { step: 'Preparation', desc: 'Set intention, dietary restrictions, and mental focus before starting the dieta.' },
  { step: 'Plant Ally Selection', desc: 'Choose a plant teacher (e.g., Ayahuasca, Bobinsana, Tobacco) with guidance from a trained facilitator.' },
  { step: 'Isolation', desc: 'Spend time in solitude, fasting from salt, sugar, and stimulation.' },
  { step: 'Ceremony', desc: 'Participate in guided ceremonies with music, prayer, and plant medicine.' },
  { step: 'Integration', desc: 'Reflect, journal, and integrate lessons with support from community or facilitator.' },
];

const AmazonianPlantDieta = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < dietaSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Amazonian Plant Dieta Journey</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {dietaSteps.length}</div>
          <div className="mb-2">
            <b>{dietaSteps[current].step}</b>: {dietaSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === dietaSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Dieta complete! Take time to integrate your experience.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Journey</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Always work with experienced guides and respect indigenous traditions. Dieta is a sacred process for healing and learning.</div>
    </GlassCard>
  );
};

export default AmazonianPlantDieta;
