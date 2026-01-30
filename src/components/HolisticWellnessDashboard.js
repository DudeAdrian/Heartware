
import React, { useState } from "react";
import { getAllFrequencies } from "../holistic/frequencyModels";
import { vibrationTherapies } from "../holistic/vibrationTherapies";
import { recommendPathways } from "../holistic/holisticPathways";
import { GlassCard } from "../theme/GlassmorphismTheme";

const HolisticWellnessDashboard = ({ userState }) => {
  const [selected, setSelected] = useState(null);
  const frequencies = getAllFrequencies();
  const vibrations = vibrationTherapies;
  const recommendations = recommendPathways(userState);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-900 to-emerald-700 dark:from-green-100 dark:to-emerald-400 bg-clip-text text-transparent">Holistic Wellness Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recommended Pathways</h2>
        <ul className="space-y-2">
          {recommendations.map((rec, i) => (
            <GlassCard key={i} className="flex items-center justify-between">
              <span className="font-bold">{rec.protocol.name}</span>: {rec.message}
              <button
                className="ml-4 px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                onClick={() => setSelected(rec.protocol)}
              >
                Select
              </button>
            </GlassCard>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All Frequencies</h2>
        <ul className="grid grid-cols-2 gap-4">
          {frequencies.map((f, i) => (
            <GlassCard key={i} className="text-center">
              <div className="text-lg font-bold">{f.name}</div>
              <div className="text-primary-600 dark:text-primary-300 text-2xl">{f.frequency} Hz</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{f.description}</div>
              <button
                className="mt-2 px-3 py-1 bg-primary-400 text-white rounded hover:bg-primary-600"
                onClick={() => setSelected(f)}
              >
                Select
              </button>
            </GlassCard>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Vibration Therapies</h2>
        <ul className="grid grid-cols-1 gap-4">
          {vibrations.map((t, i) => (
            <GlassCard key={i}>
              <div className="text-lg font-bold">{t.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t.description}</div>
              <ul className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {t.protocols.map((p, j) => (
                  <li key={j}>{p.name}: {p.frequency} Hz ({p.duration} min) - {p.description}</li>
                ))}
              </ul>
              <button
                className="mt-2 px-3 py-1 bg-primary-400 text-white rounded hover:bg-primary-600"
                onClick={() => setSelected(t)}
              >
                Select
              </button>
            </GlassCard>
          ))}
        </ul>
      </section>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <GlassCard className="p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Selected Protocol</h3>
            <div className="mb-4">
              <div className="font-semibold">{selected.name}</div>
              {selected.frequency && <div>{selected.frequency} Hz</div>}
              {selected.description && <div className="text-sm text-gray-600 dark:text-gray-400">{selected.description}</div>}
            </div>
            <button
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-700"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </GlassCard>
        </div>
      )}

    </div>
  );
}

export default HolisticWellnessDashboard;
