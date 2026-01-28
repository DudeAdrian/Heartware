// src/pages/Home_v2.js - Glassmorphic Landing Page with Web3 Integration

import React from "react";
import { Link } from "react-router-dom";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";
import SofieGuideWidget from '../components/SofieGuideWidget';

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

  // Map feature.color to border color
  const borderColorMap = {
    heart: '#e11d48', // rose-600
    emerald: '#10b981',
    sky: '#0ea5e9',
    lime: '#84cc16',
    orange: '#f59e42',
    violet: '#8b5cf6',
    teal: '#14b8a6',
    green: '#22c55e',
    cyan: '#06b6d4',
    slate: '#64748b',
    rose: '#e11d48',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 p-4 md:p-8">
      {/* Sofie Guide Widget - persistent tour/chat */}
      <SofieGuideWidget />
      <div className="max-w-4xl mx-auto py-8">
        <GlassGrid columns={2} gap={6}>
          {features.map((feature) => (
            <Link key={feature.link} to={feature.link}>
              <GlassCard
                blurAmount="md"
                className="h-full flex flex-col justify-between"
                style={{ borderLeft: `6px solid ${borderColorMap[feature.color] || '#e5e7eb'}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={feature.color === "heart" ? "text-4xl text-heart-500" : "text-4xl"}>{feature.icon}</span>
                </div>
                <h3 className={feature.color === "heart" ? "text-2xl font-bold text-heart-700 dark:text-heart-200 mb-2" : "text-2xl font-bold text-slate-900 dark:text-white mb-2"}>{feature.title}</h3>
                <p className={feature.color === "heart" ? "text-heart-600 dark:text-heart-300 mb-4" : "text-slate-600 dark:text-slate-400 mb-4"}>{feature.description}</p>
              </GlassCard>
            </Link>
          ))}
        </GlassGrid>
      </div>
    </div>
  );
};

export default Home;
