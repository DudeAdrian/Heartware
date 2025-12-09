import HerbalLibrary from './pages/HerbalLibrary';
import PersonalHerbalJournal from './pages/PersonalHerbalJournal';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { SofieProvider } from "./context/SofieContext";

// Core Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import SetupWizard from "./pages/SetupWizard";

// Personal Health Pages
import HealthcareOperations from "./pages/HealthcareOperations"; // Personal Dashboard
import AIChat from "./pages/AIChat"; // AI Companion
import PatientWellbeing from "./pages/PatientWellbeing"; // Self-sufficiency metrics
import MedicationInventory from "./pages/MedicationInventory"; // Medication tracking
import PatientOutcomes from "./pages/PatientOutcomes"; // Health outcomes
import MedicalDevices from "./pages/MedicalDevices"; // IoT health devices
import HealthOutcomeTracking from "./pages/HealthOutcomeTracking"; // Impact tracking
import ClinicalPredictions from "./pages/ClinicalPredictions"; // Health predictions
import Wellness from "./pages/Wellness"; // Holistic wellness
import AlertCenter from "./pages/AlertCenter";
import KnowledgeBase from "./pages/KnowledgeBase";

// Admin/Management (optional - can be removed if purely personal)
import HealthSystemAdmin from "./pages/HealthSystemAdmin";
import Governance from "./pages/Governance";
import Resilience from "./pages/Resilience";

// Services (simplified)
import Services from "./pages/Services";

import SystemShell from "./components/SystemShell";
import Map from "./pages/Map";

// Block extensions trying to redefine ethereum
if (window.ethereum && Object.getOwnPropertyDescriptor(window, 'ethereum')?.configurable === false) {
  console.warn("Extension attempted to redefine window.ethereum — skipping.");
}

const App = () => {
  return (
    <ErrorBoundary>
      <SofieProvider>
        <Router>
          <SystemShell>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/setup" element={<SetupWizard />} />
              
              {/* Personal Health Dashboard */}
              <Route path="/dashboard" element={<HealthcareOperations />} />
              
              {/* AI Companion - Heart-centered guidance */}
              <Route path="/ai-companion" element={<AIChat />} />
              <Route path="/chat" element={<AIChat />} />
                        <Route path="/herbal-library" element={<HerbalLibrary />} />
              
              {/* Health Management */}
              <Route path="/wellbeing" element={<PatientWellbeing />} />
              <Route path="/medications" element={<MedicationInventory />} />
              <Route path="/outcomes" element={<PatientOutcomes />} />
              <Route path="/devices" element={<MedicalDevices />} />
              <Route path="/tracking" element={<HealthOutcomeTracking />} />
              <Route path="/predictions" element={<ClinicalPredictions />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/herbal-journal" element={<PersonalHerbalJournal />} />
              
              {/* System */}
              <Route path="/alerts" element={<AlertCenter />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/services" element={<Services />} />
              <Route path="/map" element={<Map />} />
              
              {/* Admin (optional) */}
              <Route path="/admin" element={<HealthSystemAdmin />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/resilience" element={<Resilience />} />
            </Routes>
          </SystemShell>
        </Router>
      </SofieProvider>
    </ErrorBoundary>
  );
};

export default App;
