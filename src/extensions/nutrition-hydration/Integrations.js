import React from 'react';
import { GlassCard } from '../../theme/GlassmorphismTheme';

const Integrations = () => (
  <GlassCard className="mb-4">
    <h3 className="text-xl font-bold mb-2">Nutrition Integrations</h3>
    <ul className="space-y-2">
      <li>Connect to USDA, Edamam, Spoonacular APIs</li>
      <li>Barcode scanning, meal planning, food delivery</li>
      <li>Personalized nutrition recommendations</li>
    </ul>
  </GlassCard>
);

export default Integrations;
