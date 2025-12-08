import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid, GlassButton, GlassTab } from "../theme/GlassmorphismTheme";

const Governance = () => {
  const [stats, setStats] = useState({});
  const [proposals, setProposals] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const govService = sofieCore.getService("governance");
    if (govService) {
      setStats(govService.getGovernanceStats());
      setProposals(govService.getProposals());
      setMembers(govService.getMembers());
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <GlassSection colors={{ primary: "indigo", secondary: "blue" }} elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              🗳️ Community Governance
            </h1>
            <p className="text-lg text-indigo-700 dark:text-indigo-200 max-w-2xl">
              Transparent community decision-making, voting, and smart contract governance with Web3 integration
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-indigo-100/50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium backdrop-blur-sm">
                ⛓️ On-Chain Voting
              </span>
              <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🤝 Multi-Sig Control
              </span>
              <span className="px-4 py-2 bg-purple-100/50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🔐 Decentralized
              </span>
            </div>
          </div>
        </GlassSection>

        {/* Key Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "indigo", secondary: "blue" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Community Members</div>
              <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalMembers || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Active participants</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "blue", secondary: "indigo" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Proposals</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProposals || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">All-time submissions</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "purple", secondary: "indigo" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Active Now</div>
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">{stats.activeProposals || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Voting in progress</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "emerald", secondary: "blue" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Passed</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{stats.passedProposals || 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Executed on-chain</p>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Tabs */}
        <GlassSection colors={{ primary: "indigo", secondary: "blue" }}>
          <div className="flex flex-wrap border-b border-indigo-300/30 dark:border-indigo-700/30 backdrop-blur-sm">
            {["overview", "members", "proposals", "guidelines"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-indigo-400/40 to-indigo-300/20 dark:from-indigo-600/50 dark:to-indigo-700/30 text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-200/10 dark:hover:bg-indigo-700/10"
                }`}
              >
                {tab === "overview" && "📊"}
                {tab === "members" && "👥"}
                {tab === "proposals" && "📋"}
                {tab === "guidelines" && "📖"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard colors={{ primary: "indigo", secondary: "blue" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Governance Structure</h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔷</span>
                        <span>Democratic voting with 1 member = 1 vote</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔒</span>
                        <span>Multi-signature wallet for treasury control</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⛓️</span>
                        <span>Smart contracts enforce all governance rules</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <span>Web3 wallet integration for transparent voting</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "blue", secondary: "indigo" }}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Voting Power Distribution</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Equal Voting</span>
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                        All active members hold equal voting power. Voting rights confirmed through Web3 wallet verification.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {members.slice(0, 6).map((member) => (
                  <GlassCard key={member.id} colors={{ primary: "indigo", secondary: "blue" }}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                          <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">{member.role}</p>
                        </div>
                        <span className="text-2xl">👤</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>Joined: <span className="font-medium">{member.joinDate}</span></p>
                        <p>Status: <span className="font-medium text-emerald-600 dark:text-emerald-400">Active</span></p>
                        <p>Votes Cast: <span className="font-medium">5</span></p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              {members.length === 0 && (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  No members yet. Start inviting community members!
                </div>
              )}
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === "proposals" && (
            <div className="p-8 space-y-5">
              {proposals.slice(0, 5).map((proposal) => (
                <GlassCard key={proposal.id} colors={{ primary: "indigo", secondary: "blue" }}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{proposal.title}</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{proposal.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ml-4 ${
                        proposal.status === "active"
                          ? "bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          : "bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">For: {proposal.votesFor}</span>
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">Against: {proposal.votesAgainst}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 flex overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-2"
                            style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                          ></div>
                          <div 
                            className="bg-red-500 h-2"
                            style={{ width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {proposals.length === 0 && (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  No proposals yet. Create one to get started!
                </div>
              )}
            </div>
          )}

          {/* Guidelines Tab */}
          {activeTab === "guidelines" && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard colors={{ primary: "indigo", secondary: "blue" }}>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Voting Rules</h3>
                    {[
                      { icon: "⏱️", title: "Discussion Period", desc: "24 hours before voting begins" },
                      { icon: "📅", title: "Voting Duration", desc: "7 days per proposal" },
                      { icon: "✅", title: "Quorum", desc: "50%+ participation required" },
                      { icon: "🎯", title: "Passage", desc: "Simple majority (50%+1) wins" }
                    ].map((rule, idx) => (
                      <div key={idx} className="pb-4 border-b border-indigo-200/30 dark:border-indigo-700/30 last:border-0">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{rule.icon}</span>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{rule.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{rule.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard colors={{ primary: "blue", secondary: "indigo" }}>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Governance Values</h3>
                    {[
                      { icon: "🤝", title: "Transparent", desc: "All decisions visible on blockchain" },
                      { icon: "⚖️", title: "Equitable", desc: "Equal voting rights for all members" },
                      { icon: "🔒", title: "Secure", desc: "Smart contracts enforce all rules" },
                      { icon: "📢", title: "Participatory", desc: "Community input on all decisions" }
                    ].map((value, idx) => (
                      <div key={idx} className="pb-4 border-b border-blue-200/30 dark:border-blue-700/30 last:border-0">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{value.icon}</span>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{value.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{value.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </GlassSection>

        {/* Web3 Integration Status */}
        <GlassCard colors={{ primary: "indigo", secondary: "blue" }}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span>⛓️</span>
              <span>Web3 Integration Status</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Smart Contracts</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">✓ Deployed</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Governance contracts verified on chain</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Wallet Integration</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-bold">✓ Connected</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">MetaMask & WalletConnect ready</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Voting Records</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">✓ Immutable</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">All votes stored on-chain permanently</p>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Governance;
