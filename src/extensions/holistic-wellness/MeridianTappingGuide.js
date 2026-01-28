import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const meridianPoints = [
  { name: 'Eyebrow', description: 'Start of the eyebrow, just above the nose.' },
  { name: 'Side of Eye', description: 'On the bone at the outside corner of the eye.' },
  { name: 'Under Eye', description: 'On the bone under the eye, about 1 inch below the pupil.' },
  { name: 'Under Nose', description: 'Between the nose and upper lip.' },
  { name: 'Chin', description: 'Midway between the bottom of the lower lip and the chin.' },
  { name: 'Collarbone', description: 'Just below the hard ridge of your collarbone.' },
  { name: 'Under Arm', description: 'About 4 inches below the armpit.' },
  { name: 'Top of Head', description: 'Directly on the crown of your head.' },
];

const MeridianTappingGuide = () => {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [completed, setCompleted] = useState(false);

  const nextPoint = () => {
    if (currentPoint < meridianPoints.length - 1) {
      setCurrentPoint(currentPoint + 1);
    } else {
      setCompleted(true);
    }
  };

  const restart = () => {
    setCurrentPoint(0);
    setCompleted(false);
  };

  return (
    <GlassCard>
      <h4 className="text-xl font-bold mb-2">TCM Meridian Tapping Guide</h4>
      {!completed ? (
        <>
          <div className="mb-2 font-semibold">Step {currentPoint + 1} of {meridianPoints.length}</div>
          <div className="mb-2">
            <b>{meridianPoints[currentPoint].name}</b>: {meridianPoints[currentPoint].description}
          </div>
          <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2" onClick={nextPoint}>
            {currentPoint === meridianPoints.length - 1 ? 'Finish' : 'Next Point'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-2 text-emerald-700 font-semibold">Tapping sequence complete! Notice how you feel.</div>
          <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={restart}>Restart Sequence</button>
        </>
      )}
      <div className="text-slate-600 text-sm mt-2">Tap gently on each point 5-7 times while breathing slowly. Focus on your intention for healing or balance.</div>
    </GlassCard>
  );
};

export default MeridianTappingGuide;
