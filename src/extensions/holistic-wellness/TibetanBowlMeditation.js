import React from 'react';


import { useState } from 'react';

const bowlLibrary = [
  {
    name: 'Root Chakra Bowl',
    file: '/audio/tibetan-bowl-root.mp3',
    description: 'Deep grounding sound for root chakra meditation.'
  },
  {
    name: 'Heart Chakra Bowl',
    file: '/audio/tibetan-bowl-heart.mp3',
    description: 'Warm, resonant sound for heart opening.'
  },
  {
    name: 'Crown Chakra Bowl',
    file: '/audio/tibetan-bowl-crown.mp3',
    description: 'High, clear tone for spiritual connection.'
  }
];

const TibetanBowlMeditation = () => {
  const [selected, setSelected] = useState(bowlLibrary[0]);
  return (
    <div>
      <h4 className="text-lg font-bold mb-2">Tibetan Singing Bowl Library</h4>
      <div className="mb-2">
        <label className="mr-2 font-semibold">Select Bowl:</label>
        <select value={selected.name} onChange={e => setSelected(bowlLibrary.find(b => b.name === e.target.value))}>
          {bowlLibrary.map(b => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
      <audio controls className="mb-2 w-full">
        <source src={selected.file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="text-slate-600 text-sm mb-2">{selected.description}</div>
      <p>Listen to the selected bowl. Focus on the vibration and let go of tension. If you have a real bowl, try playing it yourself for a deeper experience.</p>
    </div>
  );
};

export default TibetanBowlMeditation;
