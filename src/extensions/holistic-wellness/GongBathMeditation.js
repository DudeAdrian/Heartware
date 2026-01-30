import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const gongSounds = [
  { name: 'Classic Gong', url: '/audio/gong-classic.mp3', description: 'Traditional large gong for deep clearing.', attribution: 'Pixabay (CC0)' },
  { name: 'Deep Resonance', url: '/audio/gong-deep.mp3', description: 'Low, powerful resonance for energetic release.', attribution: 'Pixabay (CC0)' },
  { name: 'Crystal Gong', url: '/audio/gong-crystal.mp3', description: 'High, shimmering tones for clarity.', attribution: 'Pixabay (CC0)' },
];

const GongBathMeditation = () => {
  const [selectedGong, setSelectedGong] = useState(gongSounds[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const playGong = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new window.Audio(selectedGong.url);
    setAudio(newAudio);
    newAudio.play();
    setIsPlaying(true);
    newAudio.onended = () => setIsPlaying(false);
  };

  const stopGong = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <GlassCard>
      <h4 className="text-xl font-bold mb-2">Virtual Gong Bath</h4>
      <div className="mb-2">
        <label className="mr-2 font-semibold">Select Gong Sound:</label>
        <select value={selectedGong.name} onChange={e => setSelectedGong(gongSounds.find(g => g.name === e.target.value))}>
          {gongSounds.map(g => (
            <option key={g.name} value={g.name}>{g.name}</option>
          ))}
        </select>
      </div>
      <audio controls className="mb-2 w-full">
        <source src={selectedGong.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="text-xs text-slate-500 italic">Attribution: {selectedGong.attribution}</div>
      <div className="text-slate-600 text-sm mb-2">{selectedGong.description}</div>
      <button className="px-4 py-2 rounded bg-heart-400 text-white font-bold mb-2 mr-2" onClick={playGong} disabled={isPlaying}>
        {isPlaying ? `Playing ${selectedGong.name}...` : `Play Gong`}
      </button>
      {isPlaying && (
        <button className="px-4 py-2 rounded bg-slate-400 text-white font-bold mb-2" onClick={stopGong}>Stop</button>
      )}
      <div className="text-slate-600 text-sm mt-2">For best results, use headphones and relax in a comfortable position.</div>
    </GlassCard>
  );
};

export default GongBathMeditation;
