// src/pages/Home_v2.js - Glassmorphic Landing Page with Web3 Integration

import React from "react";
import { Link } from "react-router-dom";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const Home = () => {
  const features = [
    {
      icon: "❤️",
      title: "Holistic Wellness",
      description: "Access frequency, vibration, and holistic healing tools for mind, body, and spirit.",
      link: "/holistic",
      color: "heart",
    },
    {
      icon: "📊",
      title: "Personal Health Metrics",
      description: "Track vitals, mood, sleep, activity, and self-reported symptoms.",
      link: "/metrics",
      color: "emerald",
    },
    {
      icon: "🧘‍♂️",
      title: "Mindfulness & Mental Health",
      description: "Guided meditations, breathwork, and mood tracking.",
      link: "/mindfulness",
      color: "sky",
    },
    {
      icon: "🥗",
      title: "Nutrition & Hydration",
      description: "Personalized meal plans, hydration reminders, and food logging.",
      link: "/nutrition",
      color: "lime",
    },
    {
      icon: "🏃‍♀️",
      title: "Movement & Physical Activity",
      description: "Exercise routines, yoga, and movement reminders.",
      link: "/movement",
      color: "orange",
    },
    {
      icon: "💊",
      title: "Medication & Supplement Management",
      description: "Reminders, tracking, and education for medications and supplements.",
      link: "/medications",
      color: "violet",
    },
    {
      icon: "🤝",
      title: "Care Team & Support Network",
      description: "Connect with care providers, family, and support groups.",
      link: "/care-team",
      color: "teal",
    },
    {
      icon: "🌿",
      title: "Self-Care & Lifestyle Pathways",
      description: "Customizable self-care routines and habit tracking.",
      link: "/self-care",
      color: "green",
    },
    {
      icon: "🔬",
      title: "Biofeedback & Self-Regulation",
      description: "Tools for HRV, breath, and other biofeedback modalities.",
      link: "/biofeedback",
      color: "cyan",
    },
    {
      icon: "📁",
      title: "Personal Health Records",
      description: "Secure, user-controlled access to health data and documents.",
      link: "/records",
      color: "slate",
    },
    {
      icon: "🚨",
      title: "Emergency & Safety",
      description: "Quick access to emergency contacts and crisis resources.",
      link: "/emergency",
      color: "rose",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <GlassSection colors={{ primary: "green", secondary: "emerald" }} elevation="high">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-900 to-emerald-700 dark:from-green-100 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
              🌱 Heartware
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-4">
              Operating System for Patient-Centered Care communities. Empowering health and wellness through integrated systems, collaborative networks, and intelligent health management.
            </p>
            <p className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              The benchmark operating system for regenerative living
            </p>
            <div className="mt-6 text-xs inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">Network syncing</span>
            </div>
          </div>
        </GlassSection>

        {/* Feature Cards */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Featured Services</h2>
          <GlassGrid columns={2} gap={6}>
            {features.map((feature) => (
              <Link key={feature.link} to={feature.link}>
                <GlassCard
                  blurAmount="md"
                  className="h-full flex flex-col justify-between"
                  // Use heart palette for the holistic card, otherwise use feature color
                  {...(feature.color === "heart"
                    ? { style: { borderLeft: '6px solid #e11d48' } } // heart-600
                    : { style: { borderLeft: undefined } })}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={feature.color === "heart" ? "text-4xl text-heart-500" : "text-4xl"}>{feature.icon}</span>
                    <span className={feature.color === "heart"
                      ? "text-xs font-bold px-3 py-1 rounded-full bg-heart-100/60 text-heart-700 border border-heart-200"
                      : "text-xs font-bold px-3 py-1 rounded-full bg-white/30 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50"}
                    >
                      Active
                    </span>
                  </div>
                  <h3 className={feature.color === "heart" ? "text-2xl font-bold text-heart-700 dark:text-heart-200 mb-2" : "text-2xl font-bold text-slate-900 dark:text-white mb-2"}>{feature.title}</h3>
                  <p className={feature.color === "heart" ? "text-heart-600 dark:text-heart-300 mb-4" : "text-slate-600 dark:text-slate-400 mb-4"}>{feature.description}</p>
                  <div className={feature.color === "heart" ? "text-sm font-semibold text-heart-500 dark:text-heart-200" : "text-sm font-semibold text-green-600 dark:text-green-400"}>Explore →</div>
                </GlassCard>
              </Link>
            ))}
          </GlassGrid>
        </div>

        {/* System Overview */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">System Overview</h2>
          <GlassGrid cols={1} colsMd={3} gap={6}>
            <div className="text-center">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sustainable</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Zero-waste living solutions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connected</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Community-driven development</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Intelligent</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">AI-powered optimization</p>
            </div>
          </GlassGrid>
        </GlassSection>

        {/* Call to Action */}
        <GlassSection colors={{ primary: "green", secondary: "emerald" }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to Transform Your Space?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">Start tracking your sustainability metrics today.</p>
            <Link
              to="/sustainability"
              className="inline-block px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all"
            >
              Launch Sustainability Dashboard
            </Link>
          </div>
        </GlassSection>
      </div>
    </div>
  );
};

export default Home;
