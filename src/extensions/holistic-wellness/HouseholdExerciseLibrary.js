import React from 'react';

// Example open-source household exercise routines
const exerciseResources = [
  {
    title: '10-Minute Full Body Home Workout',
    type: 'video',
    url: 'https://www.youtube.com/embed/UItWltVZZmE',
    duration: '10:00',
    attribution: 'HASfit, YouTube (open educational)'
  },
  {
    title: 'Beginner Bodyweight Routine',
    type: 'video',
    url: 'https://www.youtube.com/embed/2pLT-olgUJs',
    duration: '15:00',
    attribution: 'MadFit, YouTube (open educational)'
  },
  {
    title: 'Stretching for Flexibility',
    type: 'video',
    url: 'https://www.youtube.com/embed/JEb1mI6QkZ0',
    duration: '12:00',
    attribution: 'Yoga With Adriene, YouTube (open educational)'
  }
];

const HouseholdExerciseLibrary = () => (
  <div>
    <h3 className="text-2xl font-bold mb-4">Household Exercise Library</h3>
    <div className="grid grid-cols-1 gap-4">
      {exerciseResources.map((res, idx) => (
        <div key={idx} className="p-4 rounded bg-slate-100 dark:bg-slate-800">
          <div className="font-semibold mb-1">{res.title}</div>
          <iframe width="100%" height="315" src={res.url} title={res.title} frameBorder="0" allowFullScreen></iframe>
          <div className="text-xs text-slate-600">Duration: {res.duration}</div>
          <div className="text-xs text-slate-500 italic">Attribution: {res.attribution}</div>
        </div>
      ))}
    </div>
  </div>
);

export default HouseholdExerciseLibrary;
