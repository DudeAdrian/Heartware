// src/pages/SelfSufficiency_v2.js - Glassmorphic Self-Sufficiency Dashboard

import React, { useState } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const SelfSufficiency = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [overallScore, setOverallScore] = useState(78);
  const [metrics, setMetrics] = useState({
    food: 82,
    water: 75,
    energy: 71,
    housing: 80,
  });

  const handleAddFood = () => {
    const foodService = sofieCore.getService("food");
    foodService?.addGarden?.({
      name: "Main Garden",
      size: 50,
      type: "vegetable",
    });
  };

  const handleAddWater = () => {
    const waterService = sofieCore.getService("water");
    waterService?.addWaterSystem?.({
      name: "Rainwater Cistern",
      type: "rainwater",
      capacity: 5000,
    });
  };

  const handleAddHousing = () => {
    const housingService = sofieCore.getService("housing");
    housingService?.addStructure?.({
      name: "Main Dwelling",
      type: "passive_solar",
      area: 150,
    });
  };

  const handleCalculateScore = () => {
    const sustainability = sofieCore.getService("sustainability");
    sustainability?.calculateOverallScore?.();
    setOverallScore(Math.round(Math.random() * 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "blue", secondary: "cyan" }} elevation="high">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-emerald-700 dark:from-blue-100 dark:to-emerald-400 bg-clip-text text-transparent">
            Self-Sufficiency Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Monitor and optimize your sustainable living systems</p>
        </GlassSection>

        {/* Overall Score */}
        <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
          <div className="text-center">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-2">Overall Score</p>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
              {overallScore}%
            </div>
            <div className="mt-4 h-2 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-violet-500" style={{ width: `${overallScore}%` }}></div>
            </div>
            <button
              onClick={handleCalculateScore}
              className="mt-4 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-400 to-violet-500 text-white hover:shadow-lg transition-all"
            >
              Recalculate
            </button>
          </div>
        </GlassCard>

        {/* Metrics Grid */}
        <GlassGrid cols={1} colsMd={4} gap={4}>
          {[
            { key: "food", label: "Food", icon: "🌱", color: "green" },
            { key: "water", label: "Water", icon: "💧", color: "blue" },
            { key: "energy", label: "Energy", icon: "⚡", color: "amber" },
            { key: "housing", label: "Housing", icon: "🏠", color: "slate" },
          ].map(item => (
            <GlassCard key={item.key} colors={{ primary: item.color, secondary: item.color }}>
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{metrics[item.key]}%</p>
            </GlassCard>
          ))}
        </GlassGrid>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "food", label: "Food", icon: "🌱" },
            { key: "water", label: "Water", icon: "💧" },
            { key: "housing", label: "Housing", icon: "🏠" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === "overview" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
            <GlassGrid cols={1} colsMd={4} gap={4}>
              <button
                onClick={handleAddFood}
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all"
              >
                + Add Garden
              </button>
              <button
                onClick={handleAddWater}
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:shadow-lg transition-all"
              >
                + Add Water System
              </button>
              <button
                onClick={handleAddHousing}
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-slate-400 to-gray-500 text-white hover:shadow-lg transition-all"
              >
                + Add Housing
              </button>
              <button
                className="px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg transition-all"
              >
                + Add Energy
              </button>
            </GlassGrid>
          </GlassSection>
        )}

        {activeTab === "food" && (
          <GlassSection colors={{ primary: "green", secondary: "emerald" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Food Self-Sufficiency</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Current Score: <span className="font-bold">{metrics.food}%</span></p>
            <div className="p-4 rounded-lg bg-green-400/20 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20">
              <p className="text-sm text-green-900 dark:text-green-300">🌱 Track your gardens, crops, and harvest yield</p>
            </div>
          </GlassSection>
        )}

        {activeTab === "water" && (
          <GlassSection colors={{ primary: "blue", secondary: "cyan" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Water Self-Sufficiency</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Current Score: <span className="font-bold">{metrics.water}%</span></p>
            <div className="p-4 rounded-lg bg-blue-400/20 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20">
              <p className="text-sm text-blue-900 dark:text-blue-300">💧 Monitor rainwater, recycling, and conservation</p>
            </div>
          </GlassSection>
        )}

        {activeTab === "housing" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Housing Self-Sufficiency</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Current Score: <span className="font-bold">{metrics.housing}%</span></p>
            <div className="p-4 rounded-lg bg-slate-400/20 dark:bg-slate-500/10 border border-slate-200/50 dark:border-slate-500/20">
              <p className="text-sm text-slate-900 dark:text-slate-300">🏠 Track energy efficiency, passive design, and climate control</p>
            </div>
          </GlassSection>
        )}
      </div>
    </div>
  );
};

export default SelfSufficiency;
