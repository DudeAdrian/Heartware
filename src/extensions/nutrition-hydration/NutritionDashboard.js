import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const nutrition = [
  // Modern & Mediterranean
  { name: 'Breakfast', details: 'Oatmeal, berries, green tea', icon: '🥣' },
  { name: 'Lunch', details: 'Quinoa salad, avocado, lemon water', icon: '🥑' },
  { name: 'Dinner', details: 'Grilled fish, olive oil, greens', icon: '🐟' },
  { name: 'Snacks', details: 'Nuts, seeds, fruit', icon: '🥜' },

  // Hydration & Rituals
  { name: 'Hydration', details: '5/8 cups today', icon: '💧' },
  { name: 'Morning Lemon Water', details: 'Alkalizing daily ritual', icon: '🍋' },

  // Ayurveda
  { name: 'Ayurvedic Meal', details: 'Kitchari, ghee, cumin tea', icon: '🌾' },
  { name: 'Seasonal Eating', details: 'Root veggies in winter, greens in spring', icon: '🥕' },

  // TCM
  { name: 'TCM Soup', details: 'Bone broth, goji berries, ginger', icon: '🍲' },
  { name: 'Yin/Yang Balance', details: 'Warming/cooling foods for harmony', icon: '☯️' },

  // Blue Zones & Indigenous
  { name: 'Blue Zones Meal', details: 'Beans, whole grains, local veggies', icon: '🫘' },
  { name: 'Indigenous Wisdom', details: 'Foraged foods, gratitude ritual', icon: '🌽' },

  // Mindful Eating
  { name: 'Mindful Meal', details: 'Eat slowly, savor, gratitude', icon: '🧘‍♀️' }
];

const NutritionDashboard = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6 text-lime-600 dark:text-lime-300">Nutrition & Hydration</h2>
    <Integrations />
    <GlassGrid columns={1} gap={6}>
      {nutrition.map((n, i) => (
        <GlassCard key={i} className="flex items-center gap-4 border-l-4 border-lime-400">
          <span className="text-3xl">{n.icon}</span>
          <div>
            <div className="text-lg font-semibold">{n.name}</div>
            <div className="text-base text-slate-700 dark:text-slate-200">{n.details}</div>
          </div>
        </GlassCard>
      ))}
    </GlassGrid>
  </div>
);

export default NutritionDashboard;
