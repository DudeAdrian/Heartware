import React, { useState } from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const gongSounds = [
  { name: 'Classic Gong', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b7b2b7b7.mp3' },
  { name: 'Deep Resonance', url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b7b2b7b8.mp3' },
  // Add more URLs as needed
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
