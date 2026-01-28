import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const sweatLodgeSteps = [
  { step: 'Preparation', desc: 'Set intention, gather stones, wood, and sacred herbs. Prepare the lodge with respect.' },
  { step: 'Entering the Lodge', desc: 'Enter clockwise, honoring the directions and ancestors. Sit in silence or prayer.' },
  { step: 'Heating the Stones', desc: 'Stones are heated in a fire and brought into the lodge. Water is poured to create steam.' },
  { step: 'Ceremony', desc: 'Facilitator leads prayers, songs, and rounds of heat. Participants release, pray, and connect.' },
  { step: 'Closing & Integration', desc: 'Exit the lodge, give thanks, hydrate, and rest. Reflect on insights and healing.' },
];

const SweatLodgeCeremony = () => {
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const next = () => {
    if (current < sweatLodgeSteps.length - 1) {
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
      <h4 className="text-xl font-bold mb-2">Sweat Lodge Ceremony Guide</h4>
      {!complete ? (
        <>
          <div className="mb-2 font-semibold">Step {current + 1} of {sweatLodgeSteps.length}</div>
          <div className="mb-2">
            <b>{sweatLodgeSteps[current].step}</b>: {sweatLodgeSteps[current].desc}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={next}>
            {current === sweatLodgeSteps.length - 1 ? 'Finish' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Ceremony complete! Take time to rest and integrate your experience.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Guide</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Sweat lodge is a sacred indigenous practice. Always participate with respect, guidance, and cultural sensitivity.</div>
    </GlassCard>
  );
};

export default SweatLodgeCeremony;
