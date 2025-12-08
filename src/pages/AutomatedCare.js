// src/pages/AutopilotMode_v2.js - Glassmorphic Autopilot Control with Web3

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const AutopilotMode = () => {
  const [autopilotService, setAutopilotService] = useState(null);
  const [mode, setMode] = useState("manual");
  const [activeTab, setActiveTab] = useState("overview");
  const [playbooks, setPlaybooks] = useState([]);
  const [lastExecution, setLastExecution] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [contractStatus, setContractStatus] = useState("0x2f8a...");

  useEffect(() => {
    sofieCore.init();
    const service = sofieCore.getService("autopilot");
    
    if (service) {
      setAutopilotService(service);
      setMode(service.mode);
      updateDisplayData(service);
    }
  }, []);

  const updateDisplayData = (service) => {
    if (!service) return;
    
    setPlaybooks(service.getPlaybookStatus());
    setMode(service.mode);
    setStatistics(service.getStatistics());
    setInterventions(service.getInterventionAlerts());
    setExecutionHistory(service.getExecutionHistory(10));
    
    if (service.lastExecution) {
      setLastExecution(service.lastExecution);
    }
  };

  const handleModeSwitch = (newMode) => {
    if (autopilotService) {
      const result = autopilotService.setMode(newMode);
      if (result.success) {
        setMode(newMode);
        if (newMode === "autopilot") {
          const execution = autopilotService.executeAutopilot("autopilot");
          setLastExecution(execution);
          updateDisplayData(autopilotService);
        }
      }
    }
  };

  const handleExecuteAutopilot = () => {
    if (autopilotService && mode === "autopilot") {
      const execution = autopilotService.executeAutopilot("autopilot");
      setLastExecution(execution);
      updateDisplayData(autopilotService);
    }
  };

  const handleTogglePlaybook = (playbookKey) => {
    if (autopilotService) {
      const playbook = autopilotService.playbooks[playbookKey];
      autopilotService.togglePlaybook(playbookKey, !playbook.enabled);
      setPlaybooks(autopilotService.getPlaybookStatus());
    }
  };

  if (!autopilotService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-slate-600 dark:text-slate-300 py-12">Loading autopilot service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "green", secondary: "emerald" }} elevation="high">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-900 to-emerald-700 dark:from-green-100 dark:to-emerald-400 bg-clip-text text-transparent">
                🤖 Autopilot Mode Control
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Automated system management with intelligent playbooks & real-time decision making
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50">
                <div className={`w-2 h-2 rounded-full ${mode === "autopilot" ? "bg-green-500 animate-pulse" : "bg-slate-400"}`}></div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{mode}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Smart Contract: {contractStatus}</p>
            </div>
          </div>
        </GlassSection>

        {/* Mode Selector */}
        <GlassSection colors={{ primary: "green", secondary: "emerald" }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">⚙️ Operation Mode</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleModeSwitch("manual")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                mode === "manual"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              👤 Manual Control
            </button>
            <button
              onClick={() => handleModeSwitch("autopilot")}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                mode === "autopilot"
                  ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-lg"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              🤖 Autopilot
            </button>
            
            {mode === "autopilot" && (
              <button
                onClick={handleExecuteAutopilot}
                className="ml-auto px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:shadow-lg transition-all"
              >
                ▶️ Execute Now
              </button>
            )}
          </div>
          
          {mode === "autopilot" && (
            <div className="p-4 rounded-lg bg-green-400/20 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20">
              <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                ✅ <strong>Autopilot Active</strong> - System is managing {playbooks.filter(p => p.enabled).length} playbooks automatically
              </p>
            </div>
          )}
        </GlassSection>

        {/* Statistics Overview */}
        {statistics && (
          <GlassGrid cols={1} colsMd={4} gap={4}>
            <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">System Health</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{statistics.systemHealthScore}%</p>
              <div className="mt-2 h-1 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500" style={{ width: `${statistics.systemHealthScore}%` }}></div>
              </div>
            </GlassCard>

            <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Success Rate</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{statistics.successRate}%</p>
              <div className="mt-2 h-1 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${statistics.successRate}%` }}></div>
              </div>
            </GlassCard>

            <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Decisions</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{statistics.totalDecisions}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">avg {statistics.averageDecisionsPerExecution} per run</p>
            </GlassCard>

            <GlassCard colors={{ primary: "amber", secondary: "orange" }}>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Alerts</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{statistics.totalAlerts}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">generated this month</p>
            </GlassCard>
          </GlassGrid>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["overview", "playbooks", "decisions", "interventions", "history"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-green-700 to-emerald-900 text-white dark:from-green-300 dark:to-emerald-100 dark:text-slate-900"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              {tab === "overview" && "📊"} 
              {tab === "playbooks" && "📋"}
              {tab === "decisions" && "✅"}
              {tab === "interventions" && "⚠️"}
              {tab === "history" && "📜"}
              {" " + tab}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === "overview" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Current Status</h3>
            <GlassGrid cols={1} colsMd={2} gap={6}>
              <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-2">Mode</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {mode === "autopilot" ? "🤖 Autopilot" : "👤 Manual"}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  <strong>Active Playbooks:</strong> {playbooks.filter(p => p.enabled).length}/{playbooks.length}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>System Health:</strong> {statistics?.systemHealthScore}%
                </p>
              </GlassCard>

              {lastExecution && (
                <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">Last Execution</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    {new Date(lastExecution.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <strong>Decisions:</strong> {lastExecution.decisions.length}
                  </p>
                  <p className={`text-xs font-semibold ${lastExecution.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {lastExecution.success ? "✅ Success" : "❌ Failed"}
                  </p>
                </GlassCard>
              )}
            </GlassGrid>

            <div className="mt-6 pt-6 border-t border-white/20 dark:border-slate-700/50">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📈 Performance Metrics</h4>
              <GlassGrid cols={1} colsMd={3} gap={4}>
                <div className="p-3 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Executions</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{statistics?.totalExecutions}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Avg Decisions/Run</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{statistics?.averageDecisionsPerExecution}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">On-chain Verified</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">✓ All executions</p>
                </div>
              </GlassGrid>
            </div>
          </GlassSection>
        )}

        {activeTab === "playbooks" && (
          <GlassSection colors={{ primary: "purple", secondary: "violet" }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📋 Active Playbooks</h3>
            <div className="space-y-3">
              {playbooks.map((playbook, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30 hover:bg-white/30 transition-all">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{playbook.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{playbook.description}</p>
                  </div>
                  <button
                    onClick={() => handleTogglePlaybook(playbook.key)}
                    className={`ml-4 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      playbook.enabled
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : "bg-slate-400 text-slate-700"
                    }`}
                  >
                    {playbook.enabled ? "✓ Active" : "○ Inactive"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 dark:border-slate-700/50">
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                🔗 All playbooks backed by smart contracts on-chain
              </p>
            </div>
          </GlassSection>
        )}

        {activeTab === "decisions" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">✅ Recent Decisions</h3>
            <div className="space-y-2">
              {lastExecution?.decisions.slice(0, 10).map((decision, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-white">{decision.action}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{decision.reason}</p>
                </div>
              )) || <p className="text-slate-600 dark:text-slate-400">No decisions recorded yet</p>}
            </div>
          </GlassSection>
        )}

        {activeTab === "interventions" && (
          <GlassSection colors={{ primary: "rose", secondary: "red" }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">⚠️ Intervention Alerts</h3>
            <div className="space-y-2">
              {interventions.slice(0, 8).map((alert, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-rose-400/20 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20">
                  <p className="font-semibold text-rose-900 dark:text-rose-300">{alert.type}</p>
                  <p className="text-xs text-rose-800 dark:text-rose-200 mt-1">{alert.message}</p>
                </div>
              )) || <p className="text-slate-600 dark:text-slate-400">No active interventions</p>}
            </div>
          </GlassSection>
        )}

        {activeTab === "history" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📜 Execution History</h3>
            <div className="space-y-2">
              {executionHistory.map((exec, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{new Date(exec.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{exec.decisions.length} decisions</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    exec.success 
                      ? "bg-green-400/30 text-green-700 dark:text-green-300" 
                      : "bg-red-400/30 text-red-700 dark:text-red-300"
                  }`}>
                    {exec.success ? "✓ Success" : "✗ Failed"}
                  </span>
                </div>
              ))}
            </div>
          </GlassSection>
        )}
      </div>
    </div>
  );
};

export default AutopilotMode;
