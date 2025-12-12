// src/holistic/frequencyModels.js
// Ancient and modern frequency healing models

export const solfeggioFrequencies = [
  { name: 'UT', frequency: 396, description: 'Liberating Guilt and Fear' },
  { name: 'RE', frequency: 417, description: 'Undoing Situations and Facilitating Change' },
  { name: 'MI', frequency: 528, description: 'Transformation and Miracles (DNA Repair)' },
  { name: 'FA', frequency: 639, description: 'Connecting/Relationships' },
  { name: 'SOL', frequency: 741, description: 'Awakening Intuition' },
  { name: 'LA', frequency: 852, description: 'Returning to Spiritual Order' },
];

export const rifeFrequencies = [
  { name: 'General Wellness', frequency: 728, description: 'General healing and wellness' },
  { name: 'Pain Relief', frequency: 3000, description: 'Pain management' },
  { name: 'Relaxation', frequency: 10000, description: 'Deep relaxation' },
];

export const tuningForkFrequencies = [
  { name: 'Om', frequency: 136.1, description: 'Meditation, centering' },
  { name: 'C', frequency: 256, description: 'Root chakra, grounding' },
  { name: 'G', frequency: 384, description: 'Throat chakra, communication' },
];

export function getAllFrequencies() {
  return [
    ...solfeggioFrequencies,
    ...rifeFrequencies,
    ...tuningForkFrequencies,
  ];
}
