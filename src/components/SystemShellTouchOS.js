// src/components/SystemShellTouchOS.js
// Touch-screen OS shell for kiosk/panel display
// Bottom navigation, full-screen layouts, region selection modal
// Heartware (Healthcare) variant

import React, { useState, useEffect, useContext } from "react";
import MainMenu from "./MainMenu";
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

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col overflow-hidden">
      {/* MAIN CONTENT - Full screen, no nav, no footer, no header */}
      <main className="flex-grow overflow-y-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

SystemShellTouchOS.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SystemShellTouchOS;
