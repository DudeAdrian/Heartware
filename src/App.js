import Profile from "./pages/Profile";
              <Route path="/profile" element={<Profile />} />
import RegionProvider from "./context/RegionContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { SofieProvider } from "./context/SofieContext";

// Core Pages

import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import SetupWizard from "./pages/SetupWizard";
import PersonalHealthMetrics from "./pages/PersonalHealthMetrics";
import Mindfulness from "./pages/Mindfulness";
import Nutrition from "./pages/Nutrition";
import Movement from "./pages/Movement";
import CareTeam from "./pages/CareTeam";
import SelfCare from "./pages/SelfCare";
import Biofeedback from "./pages/Biofeedback";
import HealthRecords from "./pages/HealthRecords";
import Emergency from "./pages/Emergency";
import SystemShell from "./components/SystemShellTouchOS";


// Block extensions trying to redefine ethereum
if (window.ethereum && Object.getOwnPropertyDescriptor(window, 'ethereum')?.configurable === false) {
  console.warn("Extension attempted to redefine window.ethereum — skipping.");
}

const App = () => {
  return (
    <ErrorBoundary>
      <SofieProvider>
        <RegionProvider>
          <Router>
            <SystemShell>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/setup" element={<SetupWizard />} />
              
              {/* Personal Health Dashboard */}
              <Route path="/dashboard" element={<HealthcareOperations />} />
              
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

              {/* Extension Dashboards */}
              <Route path="/holistic" element={<Home />} /> {/* Optionally replace with HolisticWellnessDashboard if direct */}
              <Route path="/metrics" element={<PersonalHealthMetrics />} />
              <Route path="/mindfulness" element={<Mindfulness />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/movement" element={<Movement />} />
              <Route path="/medications" element={<Home />} /> {/* Optionally replace with MedicationDashboard if direct */}
              <Route path="/care-team" element={<CareTeam />} />
              <Route path="/self-care" element={<SelfCare />} />
              <Route path="/biofeedback" element={<Biofeedback />} />
              <Route path="/records" element={<HealthRecords />} />
              <Route path="/emergency" element={<Emergency />} />
            </Routes>
          </SystemShell>
        </Router>
        </RegionProvider>
      </SofieProvider>
    </ErrorBoundary>
  );
};

export default App;
