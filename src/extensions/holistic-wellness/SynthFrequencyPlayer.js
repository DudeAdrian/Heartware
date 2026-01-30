import React, { useState, useRef } from 'react';

const DURATIONS = [
  { label: '1.5 min', value: 90 },
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
];


const frequencyLibrary = [
  { label: '528 Hz (DNA Repair)', value: 528 },
  { label: '432 Hz (Harmony)', value: 432 },
  { label: '639 Hz (Relationships)', value: 639 },
  { label: '852 Hz (Awakening)', value: 852 },
];

const SynthFrequencyPlayer = ({ frequency = 528, label = 'Frequency', defaultDuration = 180 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(defaultDuration);
  const [selectedFreq, setSelectedFreq] = useState(frequencyLibrary[0].value);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const timerRef = useRef(null);

  const handlePlay = () => {
    if (isPlaying) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(selectedFreq, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    audioCtxRef.current = ctx;
    oscRef.current = osc;
    setIsPlaying(true);
    timerRef.current = setTimeout(() => {
      handleStop();
    }, duration * 1000);
  };

  const handleStop = () => {
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <div style={{marginBottom: 12}}>
      <h4>{label} Synthesizer Library</h4>
      <div style={{marginBottom: 8}}>
        <label>Frequency: </label>
        <select value={selectedFreq} onChange={e => setSelectedFreq(Number(e.target.value))} disabled={isPlaying}>
          {frequencyLibrary.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
      <div style={{marginBottom: 8}}>
        <label>Duration: </label>
        <select value={duration} onChange={e => setDuration(Number(e.target.value))} disabled={isPlaying}>
          {DURATIONS.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      <button onClick={handlePlay} disabled={isPlaying} style={{marginRight: 8}}>
        {isPlaying ? `Playing ${selectedFreq} Hz...` : `Play ${selectedFreq} Hz`}
      </button>
      <button onClick={handleStop} disabled={!isPlaying}>Stop</button>
      <p style={{fontSize: '0.95em', color: '#888'}}>This module generates a pure synthesized tone at {selectedFreq} Hz for the selected duration. Use headphones for best results.</p>
    </div>
  );
};

export default SynthFrequencyPlayer;
