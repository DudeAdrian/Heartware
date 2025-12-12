import React from 'react';
import { GlassCard, GlassGrid } from '../../theme/GlassmorphismTheme';
import Integrations from './Integrations';

const nutrition = [
  { name: 'Breakfast', details: 'Oatmeal, berries, green tea', icon: '🥣' },
  { name: 'Lunch', details: 'Quinoa salad, avocado, lemon water', icon: '🥗' },
  { name: 'Hydration', details: '5/8 cups today', icon: '💧' },
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
