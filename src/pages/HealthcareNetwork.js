// src/pages/GlobalNetwork_v2.js - Glassmorphic Global Community Network with Web3

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const GlobalNetwork = () => {
  const [networkService, setNetworkService] = useState(null);
  const [communities, setCommunities] = useState([
    { id: "1", name: "Harmony Village", region: "North America", population: 245, status: "operational", tier: "hub", sustainabilityScore: 92 },
    { id: "2", name: "Green Haven", region: "Europe", population: 180, status: "operational", tier: "regional", sustainabilityScore: 88 },
    { id: "3", name: "Eco Community", region: "South America", population: 120, status: "growing", tier: "local", sustainabilityScore: 79 },
  ]);
  const [metrics, setMetrics] = useState({
    totalCommunities: 156,
    totalPopulation: 28450,
    averageSelfSufficiency: 76,
    energyExchanged: 1250,
    foodExchanged: 8900,
    waterShared: 45000,
  });
  const [selectedTab, setSelectedTab] = useState("map");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [web3Status, setWeb3Status] = useState("synced");

  useEffect(() => {
    try {
      const service = sofieCore.getService("globalNetwork");
      if (service) {
        setNetworkService(service);
        const comms = service.getCommunities?.() || communities;
        setCommunities(comms);
        const mets = service.getGlobalMetrics?.() || metrics;
        setMetrics(mets);
      }
    } catch (error) {
      console.error("Error loading Global Network:", error);
    }
  }, []);

  const regions = [
    { name: "all", label: "All Regions" },
    { name: "North America", label: "North America" },
    { name: "South America", label: "South America" },
    { name: "Europe", label: "Europe" },
    { name: "Africa", label: "Africa" },
    { name: "Oceania", label: "Oceania" }
  ];

  const filteredCommunities = selectedRegion === "all" 
    ? communities 
    : communities.filter(c => c.region === selectedRegion);

  const getTierColor = (tier) => {
    switch (tier) {
      case "hub": return "from-purple-400 to-violet-500";
      case "regional": return "from-blue-400 to-cyan-500";
      case "local": return "from-green-400 to-emerald-500";
      default: return "from-slate-400 to-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "operational": return "from-green-400 to-emerald-500";
      case "growing": return "from-amber-400 to-orange-500";
      case "active": return "from-blue-400 to-cyan-500";
      default: return "from-slate-400 to-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "teal", secondary: "cyan" }} elevation="high">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-900 to-blue-700 dark:from-teal-100 dark:to-blue-400 bg-clip-text text-transparent">
                🌍 Global Community Network
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Connecting {metrics.totalCommunities} sustainable communities worldwide • {metrics.totalPopulation.toLocaleString()} members
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{web3Status}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Blockchain verified</p>
            </div>
          </div>
        </GlassSection>

        {/* Global Metrics */}
        <GlassGrid cols={2} colsMd={6} gap={3}>
          <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase">Communities</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{metrics.totalCommunities}</p>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Population</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{(metrics.totalPopulation / 1000).toFixed(0)}k</p>
          </GlassCard>

          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Avg Self-Suff.</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{metrics.averageSelfSufficiency}%</p>
          </GlassCard>

          <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Energy Exchanged</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.energyExchanged} MWh</p>
          </GlassCard>

          <GlassCard colors={{ primary: "green", secondary: "lime" }}>
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Food Exchanged</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{(metrics.foodExchanged / 1000).toFixed(1)}t</p>
          </GlassCard>

          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}>
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase">Water Shared</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{(metrics.waterShared / 1000).toFixed(0)}k L</p>
          </GlassCard>
        </GlassGrid>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["map", "communities", "analytics", "trades"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                selectedTab === tab
                  ? "bg-gradient-to-r from-teal-700 to-blue-900 text-white dark:from-teal-300 dark:to-blue-100 dark:text-slate-900"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              {tab === "map" && "🗺️"} 
              {tab === "communities" && "🏘️"}
              {tab === "analytics" && "📊"}
              {tab === "trades" && "🔄"}
              {" " + tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Map Tab */}
        {selectedTab === "map" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Network Map by Region</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {regions.map(region => (
                <button
                  key={region.name}
                  onClick={() => setSelectedRegion(region.name)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedRegion === region.name
                      ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg"
                      : "bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50"
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredCommunities.map(community => (
                <div key={community.id} className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30 hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">🏘️</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{community.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{community.region} • {community.population} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTierColor(community.tier)} text-white`}>
                        {community.tier}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(community.status)} text-white`}>
                        {community.status}
                      </span>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">↑ {community.sustainabilityScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassSection>
        )}

        {/* Communities Tab */}
        {selectedTab === "communities" && (
          <GlassGrid cols={1} colsMd={2} gap={6}>
            {filteredCommunities.map(community => (
              <GlassCard key={community.id} colors={{ primary: "teal", secondary: "cyan" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{community.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{community.region}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTierColor(community.tier)} text-white`}>
                    {community.tier}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Population:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{community.population}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Sustainability:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{community.sustainabilityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <span className={`font-bold ${
                      community.status === "operational" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {community.status}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 dark:border-slate-700/50">
                  <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg transition-all">
                    View Details
                  </button>
                </div>
              </GlassCard>
            ))}
          </GlassGrid>
        )}

        {/* Analytics Tab */}
        {selectedTab === "analytics" && (
          <GlassSection colors={{ primary: "purple", secondary: "violet" }}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Network Analytics</h3>
            
            <GlassGrid cols={1} colsMd={2} gap={6}>
              <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Self-Sufficiency Leaderboard</h4>
                <div className="space-y-2">
                  {[
                    { rank: 1, name: "Harmony Village", score: 92 },
                    { rank: 2, name: "Green Haven", score: 88 },
                    { rank: 3, name: "Eco Community", score: 79 },
                  ].map(item => (
                    <div key={item.rank} className="flex items-center justify-between p-2 rounded bg-white/20 dark:bg-slate-800/20">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">#{item.rank}</span>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{item.score}%</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resource Exchange Rate</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Energy (MWh)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{metrics.energyExchanged}</span>
                    </div>
                    <div className="h-2 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Food (tonnes)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{(metrics.foodExchanged / 1000).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Water (k liters)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{(metrics.waterShared / 1000).toFixed(0)}</span>
                    </div>
                    <div className="h-2 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </GlassGrid>
          </GlassSection>
        )}

        {/* Trades Tab */}
        {selectedTab === "trades" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Recent Inter-Community Trades</h3>
            <div className="space-y-2">
              {[
                { from: "Harmony Village", to: "Green Haven", resource: "Energy", amount: "250 MWh" },
                { from: "Eco Community", to: "Harmony Village", resource: "Food", amount: "45 tonnes" },
                { from: "Green Haven", to: "Eco Community", resource: "Water", amount: "12000 L" },
              ].map((trade, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">🔄</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{trade.resource} Trade</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{trade.from} → {trade.to}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{trade.amount}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 dark:border-slate-700/50">
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                🔗 All trades recorded on blockchain • Smart contract verified
              </p>
            </div>
          </GlassSection>
        )}
      </div>
    </div>
  );
};

export default GlobalNetwork;
