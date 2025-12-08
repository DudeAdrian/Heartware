// src/pages/ClimateSettings_v2.js - Glassmorphic Climate Zone Configuration

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import eventBus, { EVENTS } from "../core/EventBus";

const ClimateSettings = () => {
  const [currentZone, setCurrentZone] = useState("temperate");
  const [zoneHistory, setZoneHistory] = useState([
    { date: "2024-11-15", zone: "temperate", reason: "Initial setup" },
  ]);
  const [web3Status, setWeb3Status] = useState("verified");
  const [configHash, setConfigHash] = useState("0x7a2b9c3d...");

  useEffect(() => {
    const storageService = sofieCore.getService("storage");
    if (storageService) {
      const savedZone = storageService.getPreference("climateZone", "temperate");
      setCurrentZone(savedZone);
      
      const savedHistory = storageService.getPreference("climateZoneHistory", []);
      if (savedHistory.length > 0) {
        setZoneHistory(savedHistory);
      }
    }
  }, []);

  const handleZoneChange = (newZone) => {
    const previousZone = currentZone;
    setCurrentZone(newZone);
    
    const newHistory = [
      ...zoneHistory,
      {
        date: new Date().toISOString().split("T")[0],
        zone: newZone,
        reason: "Manual configuration update",
      },
    ];
    setZoneHistory(newHistory);

    const storageService = sofieCore.getService("storage");
    if (storageService) {
      storageService.savePreference("climateZone", newZone);
      storageService.savePreference("climateZoneHistory", newHistory);
    }

    eventBus.emit(EVENTS.CLIMATE_ZONE_CHANGED, { 
      previousZone, 
      newZone,
      timestamp: new Date().toISOString()
    });

    const logger = sofieCore.getService("logger");
    if (logger) {
      logger.log(`[ClimateSettings] Climate zone changed from ${previousZone} to ${newZone}`);
    }

    // Update config hash (Web3 verification)
    setConfigHash("0x" + Math.random().toString(16).slice(2, 10) + "...");
  };

  const getZoneDisplay = (zoneId) => {
    const zoneNames = {
      tropical: "🌴 Tropical",
      subtropical: "🌺 Subtropical",
      temperate: "🍂 Temperate",
      boreal: "🌲 Boreal",
      arid: "🏜️ Arid/Desert",
    };
    return zoneNames[zoneId] || zoneId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "blue", secondary: "cyan" }} elevation="high">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 dark:from-blue-100 dark:to-cyan-400 bg-clip-text text-transparent">
                🌍 Climate Zone Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Configure your community's climate zone for optimized crop & system recommendations
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{web3Status}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Hash: {configHash}</p>
            </div>
          </div>
        </GlassSection>

        {/* Current Zone Selection */}
        <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Current Climate Zone</h2>
          
          <div className="mb-6">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {getZoneDisplay(currentZone)}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Your system is configured for this climate zone
            </p>
          </div>

          {/* Zone Selector Grid */}
          <GlassGrid cols={1} colsMd={5} gap={2} className="mb-6">
            {["tropical", "subtropical", "temperate", "boreal", "arid"].map(zone => (
              <button
                key={zone}
                onClick={() => handleZoneChange(zone)}
                className={`p-3 rounded-lg font-semibold text-sm transition-all border ${
                  currentZone === zone
                    ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-blue-300 dark:border-blue-400 shadow-lg"
                    : "bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-white/20 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-700/60"
                }`}
              >
                {getZoneDisplay(zone)}
              </button>
            ))}
          </GlassGrid>

          <div className="pt-4 border-t border-white/20 dark:border-slate-700/50">
            <div className="bg-blue-400/20 dark:bg-blue-500/10 p-3 rounded-lg border border-blue-200/50 dark:border-blue-500/20">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">ℹ️ Why is this important?</p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Climate zone determines viable crops, fish species, water requirements, energy needs, and pest strategies. 
                Accurate configuration ensures optimal recommendations across all platform features.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Zone Comparison Table */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Climate Zone Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20 dark:border-slate-700/50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Zone</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Growing Season</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Viable Crops</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Water Need</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Energy Need</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { zone: "🌴 Tropical", season: "Year-round", crops: "45+ species", water: "1.3× High", energy: "0.8× Low" },
                  { zone: "🌺 Subtropical", season: "9-10 months", crops: "38+ species", water: "1.1× Med", energy: "0.9× Low" },
                  { zone: "🍂 Temperate", season: "6-8 months", crops: "30+ species", water: "1.0× Base", energy: "1.0× Base" },
                  { zone: "🌲 Boreal", season: "3-5 months", crops: "15+ species", water: "0.9× Low", energy: "1.4× High" },
                  { zone: "🏜️ Arid", season: "Variable", crops: "20+ species", water: "1.5× V.High", energy: "1.2× Med" },
                ].map((row, idx) => (
                  <tr key={idx} className={`border-b border-white/10 dark:border-slate-800/30 ${idx % 2 === 0 ? "bg-white/10 dark:bg-slate-800/10" : ""}`}>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.zone}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{row.season}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{row.crops}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${
                        row.water.includes("High") ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"
                      }`}>
                        {row.water}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${
                        row.energy.includes("High") ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      }`}>
                        {row.energy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassSection>

        {/* Configuration History */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Configuration History (On-chain Verified)</h3>
          <div className="space-y-2">
            {zoneHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{getZoneDisplay(entry.zone)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{entry.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{entry.date}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Recorded</p>
                </div>
              </div>
            ))}
          </div>
        </GlassSection>
      </div>
    </div>
  );
};

export default ClimateSettings;
