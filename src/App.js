import RegionProvider from "./context/RegionContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { SofieProvider } from "./context/SofieContext";
import Home from "./pages/Home";
import SofieLlamaWelcome from "./components/SofieLlamaWelcome";
import Holistic from "./pages/Holistic";
import ThetaBinauralPage from "./pages/holistic/ThetaBinauralPage";
import Solfeggio528HzPage from "./pages/holistic/Solfeggio528HzPage";
import MedicationInventory from "./pages/MedicationInventory";
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
import Profile from "./pages/Profile";
import SystemShell from "./components/SystemShellTouchOS";
import SofieAI from "./pages/SofieAI";
import SofieOnboarding from "./components/SofieOnboarding";

// The following imports are commented out because the files are not present or not implemented yet.
// import HealthcareOperations from "./pages/HealthcareOperations";
// import PatientWellbeing from "./pages/PatientWellbeing";
// import MedicationInventory from "./pages/MedicationInventory";
// import PatientOutcomes from "./pages/PatientOutcomes";
// import MedicalDevices from "./pages/MedicalDevices";
// import HealthOutcomeTracking from "./pages/HealthOutcomeTracking";
// import ClinicalPredictions from "./pages/ClinicalPredictions";
// import Wellness from "./pages/Wellness";
// import PersonalHerbalJournal from "./pages/PersonalHerbalJournal";
// import AlertCenter from "./pages/AlertCenter";
// import KnowledgeBase from "./pages/KnowledgeBase";
// import Services from "./pages/Services";
// import Map from "./pages/Map";
// import HealthSystemAdmin from "./pages/HealthSystemAdmin";
// import Governance from "./pages/Governance";
// import Resilience from "./pages/Resilience";

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
                <Route path="/" element={<SofieOnboarding />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/holistic" element={<Holistic />} />
                  <Route path="/holistic" element={<Holistic />} />
                <Route path="/holistic/theta-binaural" element={<ThetaBinauralPage />} />
                <Route path="/holistic/solfeggio-528hz" element={<Solfeggio528HzPage />} />
                <Route path="/metrics" element={<PersonalHealthMetrics />} />
                <Route path="/mindfulness" element={<Mindfulness />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/movement" element={<Movement />} />
                <Route path="/medications" element={<MedicationInventory />} />
                <Route path="/care-team" element={<CareTeam />} />
                <Route path="/self-care" element={<SelfCare />} />
                <Route path="/biofeedback" element={<Biofeedback />} />
                <Route path="/sofie" element={<SofieAI />} />
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
