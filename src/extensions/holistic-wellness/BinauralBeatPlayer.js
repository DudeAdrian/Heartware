import React, { useState } from 'react';


const binauralLibrary = [
  {
    name: 'Theta (4.5Hz)',
    file: '/audio/theta-binaural-1.mp3',
    description: 'Deep relaxation and meditation.'
  },
  {
    name: 'Theta (6Hz)',
    file: '/audio/theta-binaural-2.mp3',
    description: 'Creativity and insight.'
  },
  {
    name: 'Delta (2Hz)',
    file: '/audio/delta-binaural.mp3',
    description: 'Deep sleep and healing.'
  }
];

const BinauralBeatPlayer = () => {
  const [selected, setSelected] = useState(binauralLibrary[0]);
  return (
    <div>
      <h4 className="text-lg font-bold mb-2">Binaural Beats Library</h4>
      <div className="mb-2">
        <label className="mr-2 font-semibold">Select Track:</label>
        <select value={selected.name} onChange={e => setSelected(binauralLibrary.find(b => b.name === e.target.value))}>
          {binauralLibrary.map(b => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
      <audio controls className="mb-2 w-full">
        <source src={selected.file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="text-slate-600 text-sm mb-2">{selected.description}</div>
      <p>Use headphones for best results. Listen for 10–30 minutes for deep relaxation.</p>
    </div>
  );
};

export default BinauralBeatPlayer;
