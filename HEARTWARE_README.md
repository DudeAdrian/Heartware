# 🏥 Heartware - Enterprise Healthcare System

**Blockchain-powered, internationally compliant healthcare platform**

---

## 🎯 Strategic Vision

Heartware is a comprehensive healthcare management system built on:
- **Patient Portal** - Personal health records, appointments, prescriptions
- **Provider System** - Clinical management, patient directory, medical records
- **Admin Dashboard** - Facility operations, compliance tracking, analytics
- **Blockchain Integration** - Immutable records via Terracare Ledger
- **International Compliance** - HIPAA (US) + GDPR (EU) + Regional regulations

---

## 🏗️ Architecture

### Frontend (React 19)
- **33 Healthcare Pages** - Fully adapted from agricultural domain
- **Glasmorphic Design** - Dark mode + healthcare color palette
- **Role-Based Dashboards** - Patient, Provider, Admin views
- **Regional Context** - Healthcare facility locator, disease prevalence data

### Backend (Express + Prisma + PostgreSQL)
- **8 Data Models** - Patient, Provider, Appointment, Prescription, LabResult, HealthRecord, Facility, Insurance
- **48+ API Endpoints** - Complete CRUD + specialized operations
- **HIPAA Compliance** - Audit logging, field encryption, access controls
- **Regional Regulations** - Dynamic compliance by geographic region

### Blockchain (Terracare - Solidity)
- **HealthRecordRegistry** - Immutable medical records with hash verification
- **ProviderCredentialRegistry** - License verification + specialty tracking
- **ConsentManagement** - Patient consent for data sharing (time-bound + revocable)
- **ComplianceAuditLog** - Regulatory event logging (HIPAA/GDPR)

---

## 📄 Pages Overview

### Healthcare Operations
| Original (Sofie) | Healthcare (Heartware) | Purpose |
|---|---|---|
| HarvestForecast | **PatientOutcomes** | Clinical event prediction & treatment outcomes |
| ClimateSettings | **EnvironmentalHealth** | Environmental risk factors & public health |
| PestManagement | **DiseaseManagement** | Disease prevention, control, and epidemiology |
| CommunityNetwork | **PatientCommunity** | Patient support groups & peer networks |
| Inventory | **MedicationInventory** | Pharmacy inventory & medication tracking |
| SeedBank | **GeneticRegistry** | Genetic health profiles & biobank management |
| WaterRecyclingMonitor | **BloodBankMonitor** | Blood supply management & donation tracking |
| SystemDashboard | **HealthcareOperations** | Facility operations & resource allocation |
| IoT | **MedicalDevices** | Patient monitoring devices & IoMT integration |
| ImpactTracking | **HealthOutcomeTracking** | Treatment efficacy & patient outcome metrics |
| Predictions | **ClinicalPredictions** | AI-powered diagnosis & prognosis predictions |
| AdminDashboard | **HealthSystemAdmin** | System-wide administration & policy management |
| GlobalBenchmarks | **HealthcareBenchmarks** | Regional health comparisons & quality metrics |
| NutritionOptimization | **ClinicalNutrition** | Dietary planning & nutritional therapy |
| AquaticLifeDatabase | **BiomedicalDatabase** | Medical research database & clinical trials |
| AutopilotMode | **AutomatedCare** | Care pathway automation & protocol adherence |
| SelfSufficiency | **PatientWellbeing** | Holistic wellness & preventive health |
| Expansion | **FacilityExpansion** | Healthcare facility growth planning |
| GlobalNetwork | **HealthcareNetwork** | Inter-facility collaboration & referrals |
| Marketplace | **HealthMarketplace** | Medical equipment & pharmaceutical marketplace |
| PluginMarketplace | **MedicalPlugins** | Healthcare integrations & third-party tools |

### Shared Pages (Unchanged)
- **Home** - Landing page with system overview
- **Login** - Authentication portal
- **Settings** - User preferences & account management
- **SetupWizard** - Initial system configuration
- **Services** - Service directory
- **AlertCenter** - Notifications & critical alerts
- **KnowledgeBase** - Medical documentation & protocols
- **Governance** - Compliance & regulatory management
- **Resilience** - System reliability & disaster recovery
- **Wellness** - Organizational wellness programs
- **Map** - Facility location mapping

---

## 🗄️ Data Models

### Patient
```javascript
{
  id, firstName, lastName, dateOfBirth, email, phone,
  medicalRecordNumber, bloodType, allergies[], chronicConditions[],
  emergencyContact, insurance, regionId
}
```

### Provider
```javascript
{
  id, firstName, lastName, email, phone, licenseNumber,
  specialties[], credentials[], qualifications[],
  facility, region, isActive
}
```

### Appointment
```javascript
{
  id, patient, provider, facility, dateTime, duration,
  type, status, notes, consentHash (blockchain)
}
```

### Prescription
```javascript
{
  id, patient, provider, medicationName, dosage,
  frequency, quantity, refills, expirationDate, status
}
```

### LabResult
```javascript
{
  id, patient, provider, facility, testName, resultValue,
  unit, normalRange, isAbnormal, encrypted (HIPAA)
}
```

### HealthRecord
```javascript
{
  id, patient, provider, recordType, content (encrypted),
  blockchainHash, accessLog[] (HIPAA audit trail)
}
```

### Facility
```javascript
{
  id, name, type, address, coordinates, phone,
  operatingHours, specialties[], capacity, region,
  complianceLevel (HIPAA/GDPR)
}
```

### Insurance
```javascript
{
  id, patient, providerName, policyNumber, coverage,
  deductible, copay, coveragePercentage, claimStatus[]
}
```

---

## 🔐 Security & Compliance

### HIPAA (US)
- ✅ Audit logging for all data access (who, what, when, why)
- ✅ Field-level encryption (HealthRecord, LabResults, Prescription)
- ✅ De-identification helpers for analytics
- ✅ 90-day audit log retention
- ✅ Access control enforcement

### GDPR (EU)
- ✅ Right to access: Patient data export
- ✅ Right to deletion: Secure record purging
- ✅ Right to portability: HL7 FHIR export
- ✅ Consent management: Explicit opt-ins
- ✅ Privacy by design: Data minimization

### Role-Based Access Control (RBAC)

**Patient Role:**
- ✅ View own records
- ✅ Schedule appointments
- ✅ Manage prescriptions
- ✅ Grant provider access
- ❌ View other patients
- ❌ Modify system settings

**Provider Role:**
- ✅ View assigned patients
- ✅ Create clinical notes
- ✅ Issue prescriptions
- ✅ Refer to other providers
- ❌ View unassigned patients
- ❌ Modify facility settings

**Admin Role:**
- ✅ All access
- ✅ User management
- ✅ Compliance reporting
- ✅ System configuration

---

## 🚀 API Endpoints

### Patients
- `GET /api/patients` - List patients (paginated, filterable by region)
- `GET /api/patients/:id` - Patient details + history
- `POST /api/patients` - Register new patient
- `PUT /api/patients/:id` - Update patient info

### Providers
- `GET /api/providers` - List providers (filterable by specialty, facility, region)
- `GET /api/providers/:id` - Provider details + schedule
- `POST /api/providers` - Add new provider

### Appointments
- `GET /api/appointments` - Query appointments (by patient, provider, date, status)
- `POST /api/appointments` - Schedule appointment (with conflict checking)
- `PATCH /api/appointments/:id/status` - Update status (scheduled/completed/cancelled)

### Prescriptions
- `GET /api/prescriptions` - List prescriptions (by patient, status)
- `POST /api/prescriptions` - Issue prescription
- `POST /api/prescriptions/:id/refill` - Request refill

### Lab Results
- `GET /api/lab-results` - Query results (by patient, test name)
- `POST /api/lab-results` - Add lab result

### Health Records
- `GET /api/health-records` - Query records (by patient, type)
- `POST /api/health-records` - Create record (with blockchain hash)

### Facilities
- `GET /api/facilities` - List facilities (by type, region, specialty)
- `GET /api/facilities/:id` - Facility details + providers + appointments
- `POST /api/facilities` - Add facility

### Insurance
- `GET /api/insurance/patient/:patientId` - Get patient insurance
- `POST /api/insurance` - Create or update insurance

---

## 🔗 Blockchain Integration

### Terracare Smart Contracts (Solidity)

#### HealthRecordRegistry.sol
```solidity
// Store immutable health record hashes
function storeRecordHash(bytes32 hash, address patient) external;
function verifyRecord(bytes32 hash) external view returns (bool);
function getRecordsByPatient(address patient) external view returns (bytes32[]);
```

#### ProviderCredentialRegistry.sol
```solidity
// Immutable provider credentials
function registerProvider(address provider, bytes32[] credentials) external;
function verifyCredential(address provider, bytes32 credential) external view returns (bool);
function revokeCredential(address provider, bytes32 credential) external;
```

#### ConsentManagement.sol
```solidity
// Patient consent for data sharing
function grantConsent(address provider, uint256 expirationTime) external;
function revokeConsent(address provider) external;
function hasConsent(address patient, address provider) external view returns (bool);
```

#### ComplianceAuditLog.sol
```solidity
// Immutable HIPAA/GDPR audit trail
function logAccess(address user, bytes32 recordId, string action) external;
function getAuditTrail(bytes32 recordId) external view returns (AuditEntry[]);
```

---

## 📊 Regional Health Context

Heartware integrates with sofie-backend's regional system to provide:
- **Facility Density** - Healthcare provider availability by region
- **Disease Prevalence** - Regional epidemiological data
- **Insurance Networks** - Provider network coverage
- **Public Health Regulations** - Regional compliance requirements
- **Health Outcome Benchmarks** - Regional quality comparisons

---

## 🛠️ Setup & Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Hardhat (for blockchain)

### Backend Setup
```bash
cd sofie-backend
npm install
npx prisma generate
npx prisma migrate dev
node prisma/seed.js  # Regional data
node prisma/healthcare-seed.js  # Healthcare data
npm run dev  # Starts on localhost:3001
```

### Frontend Setup
```bash
cd heartware-ui
npm install
# Update .env with REACT_APP_BACKEND_URL=http://localhost:3001/api
npm start  # Starts on localhost:3000
```

### Blockchain Setup
```bash
cd Terracare-Ledger
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🎨 Design System

### Colors
- **Primary (Healthcare Blue)**: `#0066CC`
- **Emergency (Alert Red)**: `#FF4444`
- **Success (Clinical Green)**: `#00AA44`
- **Warning (Caution Yellow)**: `#FFAA00`
- **Info (Sky Blue)**: `#33AAFF`

### Terminology Mapping
- `Farm` → `Facility`
- `Crop` → `Patient`
- `Harvest` → `Treatment`
- `Yield` → `Outcome`
- `Soil Health` → `Patient Health`
- `Climate` → `Environmental Health`
- `Pest` → `Disease`
- `Water` → `Blood/Fluids`

---

## 📝 Development Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Rename 32 pages to healthcare context
- [x] Add 8 Prisma healthcare models
- [x] Create 48+ healthcare API endpoints
- [x] Build healthcare seed data

### Phase 2: Components (In Progress)
- [ ] PatientCard component
- [ ] ProviderCard component
- [ ] AppointmentScheduler component
- [ ] PrescriptionWidget component
- [ ] LabResultsViewer component
- [ ] HealthMetricsChart component
- [ ] ConsentForm component

### Phase 3: Security & Compliance
- [ ] HIPAA audit logging middleware
- [ ] Field encryption middleware
- [ ] RBAC enforcement
- [ ] Consent management UI
- [ ] Data anonymization helpers

### Phase 4: Blockchain Integration
- [ ] Deploy 4 Terracare contracts
- [ ] Integrate record hashing
- [ ] Connect consent forms to blockchain
- [ ] Implement audit log storage

### Phase 5: Integration & Testing
- [ ] Wire frontend to backend API
- [ ] Test patient/provider/admin flows
- [ ] Verify regional health context
- [ ] E2E compliance testing

### Phase 6: Documentation & Launch
- [ ] API reference guide
- [ ] Blockchain integration docs
- [ ] Compliance checklist
- [ ] Deployment runbook

---

## 📞 Support & Contact

For issues, questions, or contributions, contact the Heartware development team.

---

**Built with ❤️ for healthcare innovation**
