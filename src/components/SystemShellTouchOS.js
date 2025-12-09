// src/components/SystemShellTouchOS.js
// Touch-screen OS shell for kiosk/panel display
// Bottom navigation, full-screen layouts, region selection modal
// Heartware (Healthcare) variant

import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import HealthcareCore from "../core/HealthcareCore";
import { SofieContext } from "../context/SofieContext";
import { useRegion } from "../context/RegionContext";

const SystemShellTouchOS = ({ children }) => {
  const [mode, setMode] = useState("manual");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sofie-dark-mode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showRegionModal, setShowRegionModal] = useState(false);
  const location = useLocation();
  const { updateState, state } = useContext(SofieContext);
  const { selectedRegion, regions, selectRegion } = useRegion();

  useEffect(() => {
    try {
      HealthcareCore.init();
      if (state?.operationMode) {
        setMode(state.operationMode);
        HealthcareCore.updateState("operationMode", state.operationMode);
      }
    } catch (error) {
      console.error("Error initializing HealthcareCore:", error);
    }

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, state]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('sofie-dark-mode', JSON.stringify(newDarkMode));
  };

  const handleSelectRegion = (region) => {
    selectRegion(region);
    setShowRegionModal(false);
  };

  // Don't show shell on login page
  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  // Bottom navigation items (6 large touch buttons) - Healthcare variant
  const navItems = [
    { id: 'home', label: 'Home', path: '/', icon: '🏥' },
    { id: 'patients', label: 'Patients', path: '/patients', icon: '👥' },
    { id: 'appointments', label: 'Appointments', path: '/appointments', icon: '📅' },
    { id: 'records', label: 'Records', path: '/health-records', icon: '📋' },
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { id: 'settings', label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  // Get current page title based on route
  const getPageTitle = () => {
    if (location.pathname === '/') return '🏥 Heartware';
    if (location.pathname === '/patients') return '👥 Patients';
    if (location.pathname === '/appointments') return '📅 Appointments';
    if (location.pathname === '/health-records') return '📋 Health Records';
    if (location.pathname === '/dashboard') return '📊 Dashboard';
    if (location.pathname === '/settings') return '⚙️ Settings';
    return '🏥 Heartware';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col overflow-hidden">
      {/* HEADER - Compact, touch-friendly context bar */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-blue-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between h-16">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">{getPageTitle()}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRegionModal(true)}
            className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm touch-target"
            title="Select facility region"
          >
            📍 Facility
          </button>
        </div>
      </header>

      {/* MAIN CONTENT - Full screen */}
      <main className="flex-grow overflow-y-auto px-4 py-4">
        {children}
      </main>

      {/* FOOTER - System status bar */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-blue-200 dark:border-gray-800 px-4 py-2 h-12 flex items-center justify-between text-xs">
        <div className="text-gray-600 dark:text-gray-400">
          Mode: <span className="font-semibold">{mode === 'autopilot' ? '🤖 Autopilot' : '👤 Manual'}</span>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <button
          onClick={toggleDarkMode}
          className="px-2 py-1 rounded text-lg"
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </footer>

      {/* BOTTOM NAVIGATION - 6 large touch buttons */}
      <nav className="bg-white dark:bg-gray-900 border-t border-blue-200 dark:border-gray-800 grid grid-cols-6 gap-0 h-24">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 transition-all font-semibold text-sm ${
              isActive(item.path)
                ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* REGION/FACILITY SELECTION MODAL - Full screen */}
      {showRegionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Your Facility Region</h2>
              <button
                onClick={() => setShowRegionModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleSelectRegion(region)}
                  className={`p-4 rounded-lg border-2 transition-all text-left font-semibold ${
                    selectedRegion?.id === region.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="text-lg mb-1">{region.climateZone}</div>
                  <div className="text-base">{region.name}</div>
                  {region.description && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{region.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SystemShellTouchOS.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SystemShellTouchOS;
