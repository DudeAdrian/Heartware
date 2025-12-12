// src/holistic/holisticPathways.js
// Logic for recommending and guiding users through holistic healing journeys
import { getAllFrequencies } from './frequencyModels';
import { vibrationTherapies } from './vibrationTherapies';

export function recommendPathways(userState = {}) {
  // Example: recommend based on user mood, stress, or intention
  if (userState.stressLevel > 7) {
    return [
      {
        type: 'sound',
        protocol: getAllFrequencies().find(f => f.name === 'Relaxation'),
        message: 'Try a relaxation frequency session.'
      },
      {
        type: 'vibration',
        protocol: vibrationTherapies.find(t => t.name === 'Sound Bath'),
        message: 'A sound bath can help reduce stress.'
      }
    ];
  }
  // Default holistic pathway
  return [
    {
      type: 'sound',
      protocol: getAllFrequencies()[0],
      message: 'Explore ancient Solfeggio frequencies for holistic wellness.'
    }
  ];
}

export function getAllPathways() {
  return [
    ...getAllFrequencies().map(f => ({ type: 'sound', protocol: f })),
    ...vibrationTherapies.map(t => ({ type: 'vibration', protocol: t })),
  ];
}
