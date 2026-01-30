import React from 'react';

// Example open-source Tai Chi video/audio resources
const taiChiResources = [
  {
    title: 'Tai Chi for Beginners (Yang Style)',
    type: 'video',
    url: 'https://www.youtube.com/embed/cEOS2zoyQw4',
    duration: '24:00',
    attribution: 'Dr Paul Lam, YouTube (open educational)'
  },
  {
    title: 'Tai Chi 5-Minute Daily Routine',
    type: 'audio',
    url: '/audio/tai-chi-5min.mp3',
    duration: '5:00',
    attribution: 'Pixabay (CC0)'
  },
  {
    title: 'Tai Chi Music for Practice',
    type: 'audio',
    url: '/audio/tai-chi-music.mp3',
    duration: '10:00',
    attribution: 'Pixabay (royalty-free)'
  }
];

const TaiChiLibrary = () => (
  <div>
    <h3 className="text-2xl font-bold mb-4">Tai Chi Library</h3>
    <div className="grid grid-cols-1 gap-4">
      {taiChiResources.map((res, idx) => (
        <div key={idx} className="p-4 rounded bg-slate-100 dark:bg-slate-800">
          <div className="font-semibold mb-1">{res.title}</div>
          {res.type === 'video' ? (
            <iframe width="100%" height="315" src={res.url} title={res.title} frameBorder="0" allowFullScreen></iframe>
          ) : (
            <audio controls className="w-full mb-1">
              <source src={res.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <div className="text-xs text-slate-600">Duration: {res.duration}</div>
          <div className="text-xs text-slate-500 italic">Attribution: {res.attribution}</div>
        </div>
      ))}
    </div>
  </div>
);

export default TaiChiLibrary;
