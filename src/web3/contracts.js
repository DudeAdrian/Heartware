/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  HEARTWARE CHAMBER 5: SMART CONTRACT INTERFACE                            ║
 * ║  Terracare Ledger Contract Addresses & ABIs                               ║
 * ║                                                                           ║
 * ║  These contracts form the sovereign backbone of the 9-Chamber Ecosystem   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// ═════════════════════════════════════════════════════════════════════════════
// CONTRACT ADDRESSES - Terracare Local Deployment
// ═════════════════════════════════════════════════════════════════════════════

export const CONTRACT_ADDRESSES = {
  // Core Identity & Governance
  SovereignIdentity: process.env.REACT_APP_SOVEREIGN_IDENTITY || '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
  AccessGovernor: process.env.REACT_APP_ACCESS_GOVERNOR || '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
  AuditTrail: process.env.REACT_APP_AUDIT_TRAIL || '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
  
  // Chamber Adapters (9-System Integration)
  TholosAdapter: process.env.REACT_APP_THOLOS_ADAPTER || '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
  HarmonicAdapter: process.env.REACT_APP_HARMONIC_ADAPTER || '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
  TerratoneAdapter: process.env.REACT_APP_TERRATONE_ADAPTER || '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
  SofieOSAdapter: process.env.REACT_APP_SOFIE_OS_ADAPTER || '0x59b670e9fA9D0A427751Af201D676719a970857b',
  LlamaAdapter: process.env.REACT_APP_LLAMA_ADAPTER || '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1',
  MapAdapter: process.env.REACT_APP_MAP_ADAPTER || '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
};

// ═════════════════════════════════════════════════════════════════════════════
// CONTRACT ABIs - Minimal Interface for Gas Optimization
// ═════════════════════════════════════════════════════════════════════════════

// SovereignIdentity - Core identity registry
export const SovereignIdentityABI = [
  // View functions
  'function getSystemId(address patient, bytes32 systemHash) external view returns (string memory)',
  'function isSystemLinked(address patient, bytes32 systemHash) external view returns (bool)',
  'function getLinkedSystems(address patient) external view returns (bytes32[] memory)',
  'function owner() external view returns (address)',
  
  // State-changing functions
  'function linkSystem(bytes32 systemHash, string calldata systemId) external',
  'function unlinkSystem(bytes32 systemHash) external',
  'function linkSystemWithMeta(address patient, bytes32 systemHash, string calldata systemId, bytes calldata signature) external',
  
  // Events
  'event SystemLinked(address indexed patient, bytes32 indexed systemHash, string systemId, uint256 timestamp)',
  'event SystemUnlinked(address indexed patient, bytes32 indexed systemHash, uint256 timestamp)',
];

// AccessGovernor - Permission management
export const AccessGovernorABI = [
  // View functions
  'function hasAccess(address patient, address caregiver, bytes32 systemHash) external view returns (bool)',
  'function getAccessExpiry(address patient, address caregiver, bytes32 systemHash) external view returns (uint256)',
  'function getActiveGrants(address patient) external view returns (tuple(address caregiver, bytes32 systemHash, uint256 expiry, string memo)[] memory)',
  
  // State-changing functions
  'function grantAccess(address caregiver, bytes32 systemHash, uint256 duration, string calldata memo) external',
  'function revokeAccess(address caregiver, bytes32 systemHash) external',
  'function grantAccessWithMeta(address patient, address caregiver, bytes32 systemHash, uint256 duration, string calldata memo, bytes calldata signature) external',
  
  // Events
  'event AccessGranted(address indexed patient, address indexed caregiver, bytes32 indexed systemHash, uint256 expiry, string memo)',
  'event AccessRevoked(address indexed patient, address indexed caregiver, bytes32 indexed systemHash)',
];

// AuditTrail - Immutable record anchoring
export const AuditTrailABI = [
  // View functions
  'function getHistory(address patient, bytes32 dataType) external view returns (tuple(bytes32 dataHash, uint256 blockNumber, uint256 timestamp, address source, bytes metadata)[] memory)',
  'function verifyAnchoring(address patient, bytes32 dataType, bytes32 dataHash) external view returns (bool, uint256)',
  'function getLatestHash(address patient, bytes32 dataType) external view returns (bytes32, uint256)',
  
  // State-changing functions
  'function anchorRecord(bytes32 dataType, bytes32 dataHash, bytes calldata metadata) external',
  'function anchorWithMeta(address patient, bytes32 dataType, bytes32 dataHash, bytes calldata metadata, bytes calldata signature) external',
  
  // Events
  'event RecordAnchored(address indexed patient, bytes32 indexed dataType, bytes32 indexed dataHash, uint256 blockNumber, uint256 timestamp)',
];

// TholosAdapter - Clinical records integration
export const TholosAdapterABI = [
  // View functions
  'function getRecordPointers(address patient) external view returns (bytes32[] memory)',
  'function getRecordMetadata(address patient, bytes32 recordId) external view returns (tuple(string recordType, uint256 timestamp, address provider, bool encrypted) memory)',
  
  // State-changing functions
  'function registerRecord(bytes32 recordId, string calldata recordType, bool encrypted) external',
  'function requestEmergencyAccess(address patient) external',
  
  // Events
  'event RecordRegistered(address indexed patient, bytes32 indexed recordId, string recordType)',
  'event EmergencyAccessRequested(address indexed patient, address indexed requester, uint256 timestamp)',
];

// HarmonicAdapter - Biofeedback integration
export const HarmonicAdapterABI = [
  // View functions
  'function getLatestReading(address patient) external view returns (tuple(uint256 hrv, uint256 eegAlpha, uint256 eegTheta, uint256 timestamp) memory)',
  'function getReadingHistory(address patient, uint256 fromTimestamp) external view returns (tuple(uint256 hrv, uint256 eegAlpha, uint256 eegTheta, uint256 timestamp)[] memory)',
  
  // State-changing functions
  'function submitReading(uint256 hrv, uint256 eegAlpha, uint256 eegTheta) external',
  'function submitReadingWithMeta(address patient, uint256 hrv, uint256 eegAlpha, uint256 eegTheta, bytes calldata signature) external',
  
  // Events
  'event ReadingSubmitted(address indexed patient, uint256 hrv, uint256 timestamp)',
];

// TerratoneAdapter - Frequency session anchoring
export const TerratoneAdapterABI = [
  // View functions
  'function getSessionCount(address patient) external view returns (uint256)',
  'function getSession(address patient, uint256 index) external view returns (tuple(uint256 duration, uint256 frequency, bytes32 sessionHash, uint256 timestamp) memory)',
  
  // State-changing functions
  'function logSession(uint256 duration, uint256 frequency, bytes32 sessionHash) external',
  'function logSessionWithMeta(address patient, uint256 duration, uint256 frequency, bytes32 sessionHash, bytes calldata signature) external',
  
  // Events
  'event SessionLogged(address indexed patient, uint256 duration, uint256 frequency, bytes32 sessionHash)',
];

// LlamaAdapter - AI recommendation anchoring
export const LlamaAdapterABI = [
  // View functions
  'function getRecommendationCount(address patient) external view returns (uint256)',
  'function getRecommendation(address patient, uint256 index) external view returns (tuple(bytes32 modelHash, bytes32 inputHash, bytes32 outputHash, uint256 timestamp) memory)',
  
  // State-changing functions
  'function logRecommendation(bytes32 modelHash, bytes32 inputHash, bytes32 outputHash) external',
  'function logRecommendationWithMeta(address patient, bytes32 modelHash, bytes32 inputHash, bytes32 outputHash, bytes calldata signature) external',
  
  // Events
  'event RecommendationLogged(address indexed patient, bytes32 modelHash, bytes32 outputHash, uint256 timestamp)',
];

// MapAdapter - Geofenced access control
export const MapAdapterABI = [
  // View functions
  'function isWithinAllowedZone(address patient, uint256 lat, uint256 lon) external view returns (bool)',
  'function getAccessZones(address patient) external view returns (tuple(uint256 lat, uint256 lon, uint256 radius, string name)[] memory)',
  
  // State-changing functions
  'function addAccessZone(uint256 lat, uint256 lon, uint256 radius, string calldata name) external',
  'function removeAccessZone(uint256 index) external',
  
  // Events
  'event ZoneAdded(address indexed patient, uint256 lat, uint256 lon, uint256 radius)',
  'event ZoneRemoved(address indexed patient, uint256 index)',
];

// SofieOSAdapter - Hardware control integration
export const SofieOSAdapterABI = [
  // View functions
  'function getDeviceStatus(bytes32 deviceId) external view returns (tuple(bool active, uint256 lastPing, string memory deviceType) memory)',
  'function getPatientDevices(address patient) external view returns (bytes32[] memory)',
  
  // State-changing functions
  'function registerDevice(bytes32 deviceId, string calldata deviceType) external',
  'function sendCommand(bytes32 deviceId, string calldata command, bytes calldata params) external',
  'function sendCommandWithMeta(address patient, bytes32 deviceId, string calldata command, bytes calldata params, bytes calldata signature) external',
  
  // Events
  'event DeviceRegistered(address indexed patient, bytes32 indexed deviceId)',
  'event CommandSent(address indexed patient, bytes32 indexed deviceId, string command)',
];

// ═════════════════════════════════════════════════════════════════════════════
// SYSTEM HASH CONSTANTS - For linking to different chambers
// ═════════════════════════════════════════════════════════════════════════════

export const SYSTEM_HASHES = {
  // 9 Chamber System Identifiers (bytes32)
  THOLOS_MEDICA: '0x74686f6c6f732d6d656469636100000000000000000000000000000000000000', // tholos-medica
  HARMONIC_BALANCE: '0x6861726d6f6e69632d62616c616e636500000000000000000000000000000000', // harmonic-balance
  TERRATONE: '0x7465727261746f6e650000000000000000000000000000000000000000000000', // terratone
  SOFIE_SYSTEMS: '0x736f6669652d73797374656d7300000000000000000000000000000000000000', // sofie-systems
  SOFIE_LLM: '0x736f6669652d6c6c6d0000000000000000000000000000000000000000000000', // sofie-llm
  SOFIE_MAP: '0x736f6669652d6d61700000000000000000000000000000000000000000000000', // sofie-map
  SANDIRONRATIO: '0x73616e6469726f6e726174696f00000000000000000000000000000000000000', // sandironratio-node
  TERRACARE_LEDGER: '0x7465727261636172652d6c6564676572000000000000000000000000000000', // terracare-ledger
  HEARTWARE: '0x6865617274776172650000000000000000000000000000000000000000000000', // heartware
};

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Generate a bytes32 hash from a string (for data anchoring)
 */
export function generateDataHash(data) {
  if (typeof data === 'string') {
    return `0x${Buffer.from(data).toString('hex').padEnd(64, '0').slice(0, 64)}`;
  }
  return data;
}

/**
 * Shorten address for display
 */
export function shortenAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format timestamp to human-readable date
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown';
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get system name from hash
 */
export function getSystemName(systemHash) {
  const entries = Object.entries(SYSTEM_HASHES);
  const found = entries.find(([_, hash]) => hash === systemHash);
  return found ? found[0].replace(/_/g, ' ').toLowerCase() : 'Unknown System';
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTRACT CONFIGURATION OBJECT
// ═════════════════════════════════════════════════════════════════════════════

export const CONTRACTS = {
  SovereignIdentity: {
    address: CONTRACT_ADDRESSES.SovereignIdentity,
    abi: SovereignIdentityABI,
  },
  AccessGovernor: {
    address: CONTRACT_ADDRESSES.AccessGovernor,
    abi: AccessGovernorABI,
  },
  AuditTrail: {
    address: CONTRACT_ADDRESSES.AuditTrail,
    abi: AuditTrailABI,
  },
  TholosAdapter: {
    address: CONTRACT_ADDRESSES.TholosAdapter,
    abi: TholosAdapterABI,
  },
  HarmonicAdapter: {
    address: CONTRACT_ADDRESSES.HarmonicAdapter,
    abi: HarmonicAdapterABI,
  },
  TerratoneAdapter: {
    address: CONTRACT_ADDRESSES.TerratoneAdapter,
    abi: TerratoneAdapterABI,
  },
  LlamaAdapter: {
    address: CONTRACT_ADDRESSES.LlamaAdapter,
    abi: LlamaAdapterABI,
  },
  MapAdapter: {
    address: CONTRACT_ADDRESSES.MapAdapter,
    abi: MapAdapterABI,
  },
  SofieOSAdapter: {
    address: CONTRACT_ADDRESSES.SofieOSAdapter,
    abi: SofieOSAdapterABI,
  },
};

export default CONTRACTS;
