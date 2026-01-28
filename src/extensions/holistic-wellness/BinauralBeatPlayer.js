import React, { useState } from 'react';

const BinauralBeatPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const handlePlay = () => {
    if (!audio) {
      const newAudio = new Audio('/audio/theta-binaural.mp3');
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
      newAudio.onended = () => setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <h4>Theta Binaural Beats Player</h4>
      <button onClick={handlePlay} disabled={isPlaying} style={{marginRight: 8}}>
        {isPlaying ? 'Playing...' : 'Play'}
      </button>
      <button onClick={handlePause} disabled={!isPlaying}>
        Pause
      </button>
      <p>Use headphones for best results. Listen for 10–30 minutes for deep relaxation.</p>
    </div>
  );
};

export default BinauralBeatPlayer;
