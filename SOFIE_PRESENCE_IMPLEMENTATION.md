# Sofie Presence System Implementation

## Overview
Complete implementation of the Sofie Presence System for Heartware, providing real-time AI conversation capabilities with biometric integration and galaxy visualization.

## Architecture
The system follows the established Heartware architectural patterns:
- **RegionContext pattern** for AIContext (clear value object, useAI hook, service integration)
- **SofieContext preserved** for error handling and global state
- **Glassmorphic UI** consistency maintained throughout
- **WebSocket-based** real-time communication via BridgeService

---

## Files Created/Modified

### 1. src/services/BridgeService.js
**Purpose:** Singleton WebSocket manager for real-time AI conversation

**Key Features:**
- Connection to `ws://localhost:3000/heartware-stream`
- Status management: `disconnected` → `connecting` → `connected` → `authenticated`
- Exponential backoff reconnection (max 5 attempts)
- Message queuing for offline resilience
- Event-driven architecture with subscribe/unsubscribe pattern

**API:**
```javascript
bridgeService.connect()              // Establish connection
bridgeService.send(type, data)       // Send generic message
bridgeService.sendChat(message, context, streaming)  // Send chat
bridgeService.sendBiometric(data)    // Send biometric data
bridgeService.sendInterruption()     // Interrupt AI speaking
bridgeService.on(event, callback)    // Subscribe to events
bridgeService.off(event, callback)   // Unsubscribe
bridgeService.disconnect()           // Clean shutdown
```

**Events:** `status`, `authenticated`, `message`, `stream_chunk`, `stream_end`, `biometric-request`, `error`

---

### 2. src/services/SofieLlamaApi.js
**Purpose:** AI API service with streaming support

**Key Features:**
- Legacy blocking API maintained for backward compatibility (`sendSofieMessage`)
- New WebSocket streaming (`streamSofiePrompt`)
- SSE fallback for HTTP-only scenarios (`streamSofiePromptSSE`)
- Connection status checking

**API:**
```javascript
sendSofieMessage(message, context)           // Legacy blocking
streamSofiePrompt(prompt, context, onChunk)  // WebSocket streaming
streamSofiePromptSSE(prompt, context)        // SSE fallback (async generator)
isStreamingAvailable()                        // Check connection
getConnectionStatus()                         // Get status
abortStream()                                 // Cancel streaming
```

---

### 3. src/context/AIContext.jsx
**Purpose:** React Context for AI Presence System following RegionContext pattern

**State:**
```javascript
sofieState           // 'dormant'|'listening'|'processing'|'speaking'|'entrainment'
userBiometrics       // {pulseRate, breathPhase, emotionalValence, timestamp, source, confidence}
currentResponse      // Streaming AI response text
conversationHistory  // Array of {role, content, timestamp, conversationId}
isListening          // VAD active
isUserSpeaking       // User currently speaking
connectionStatus     // 'offline'|'online'
conversationId       // Current conversation identifier
```

**Actions:**
```javascript
startListening()           // Start voice recognition
stopListening()            // Stop and process audio
abortSpeaking()            // Interrupt AI
sendMessage(text)          // Send text without voice
captureBiometricSnapshot() // Manual biometric capture
clearConversation()        // Reset history
```

**Hooks:**
```javascript
useAI()           // Full context access
useSofieState()   // Sofie state only
useBiometrics()   // Biometrics + capture
useConversation() // Conversation management
```

---

### 4. src/services/VoicePipeline.js
**Purpose:** STT/TTS coordination with interruption support

**Features:**
- Web Speech API integration (STT + TTS)
- Silence detection for auto-stop
- Sentence-level TTS chunking
- Interruption support (cancel speaking)
- Voice selection preferences

**API:**
```javascript
VoicePipeline.initialize()           // Setup
VoicePipeline.startRecording({onInterim, onFinal, onSilence, onError})
VoicePipeline.stopRecording()        // Returns Promise<string>
VoicePipeline.abortRecording()       // Immediate abort
VoicePipeline.speak(text, onChunk, options)
VoicePipeline.stopSpeaking()         // Cancel TTS
VoicePipeline.pauseSpeaking()
VoicePipeline.resumeSpeaking()
```

---

### 5. src/services/BiometricAdapter.js
**Purpose:** Factory for multiple biometric input methods

**Capture Methods:**
- **Webcam PPG:** Face detection + color analysis for heart rate estimation
- **WebBluetooth:** Direct connection to HR monitors (Polar, WHOOP, Garmin)
- **Manual:** Fallback for demo/testing

**Features:**
- Auto-detection of available methods
- Data encryption via WebCrypto API before transmission
- Confidence scoring per method

**API:**
```javascript
BiometricAdapter.capture('auto')           // Best available
BiometricAdapter.capture('webcam')         // Force webcam
BiometricAdapter.capture('wearable')       // Force BLE
BiometricAdapter.capture('manual')         // Manual fallback
encryptBiometricData(data, userId)         // Encryption utility
BiometricAdapter.isWebcamAvailable()
BiometricAdapter.isWebBluetoothAvailable()
BiometricAdapter.getAvailableMethods()
```

---

### 6. src/services/LedgerAnchor.js
**Purpose:** Interface to Terracare-Ledger via sofie-backend

**Note:** No direct blockchain calls from frontend - all operations proxy through backend API at `http://localhost:3000/api/ledger`

**API:**
```javascript
anchorConversation(conversationId, hash, metadata)  // Anchor to ledger
verifyAnchor(conversationId, hash)                  // Verify anchor
getAnchorStatus(conversationId)                     // Check status
generateConversationHash(data)                      // SHA-256 hash
anchorConversationHistory(id, history, metadata)    // Convenience method
isLedgerAvailable()                                 // Health check
```

---

### 7. src/components/GalaxySofie.jsx
**Purpose:** React-Three-Fiber galaxy visualization responding to AI state

**Visual Features:**
- 50,000 particles in spiral arms
- Color gradient (gold core → cyan → deep blue outer)
- State-based animations:
  - **Dormant:** Slow rotation
  - **Listening:** Faster rotation, gentle scale up
  - **Processing:** Chaotic spin, pulsing
  - **Speaking:** Breathing animation, purple glow
  - **Entrainment:** Syncs with user's pulse rate

**Components:**
- `GalaxyParticles` - Core visualization
- `BiometricIndicator` - Pulse ring matching heart rate
- `Scene` - Three.js scene setup
- `StatusIndicator` - Glassmorphic status overlay
- `ResponseOverlay` - AI text display
- `BiometricDisplay` - Heart rate/emotion display

**Route:** `/galaxy`

---

### 8. src/components/AIStatusBar.jsx
**Purpose:** Persistent bottom bar with connection status and controls

**Features:**
- Connection indicator (red/yellow/green)
- Sofie state badge
- Biometric quick view (heart rate, emotion)
- "Talk to Sofie" button with recording states
- Interrupt button (visible when AI speaking)
- Galaxy view link

**Variants:**
- `AIStatusBar` - Full width with glassmorphic card
- `AIStatusBarCompact` - Compact floating button (bottom-right)

---

### 9. src/App.js (Updated)
**Changes:**
- Added `AIProvider` wrapper (inside SofieProvider, outside RegionProvider)
- Added `/galaxy` route for GalaxySofie
- Added persistent `<AIStatusBar />` component

**Provider Hierarchy:**
```jsx
<SofieProvider>
  <AIProvider>
    <RegionProvider>
      <Router>
        <SystemShell>
          {/* Routes */}
          <AIStatusBar />
        </SystemShell>
      </Router>
    </RegionProvider>
  </AIProvider>
</SofieProvider>
```

---

### 10. src/context/SofieContext.js (Updated)
**Changes:**
- Added `useSofie()` hook export for AIContext integration
- Maintains backward compatibility

---

### 11. src/index.css (Updated)
**Additions:**
- `.glassmorphic` utility class for backdrop blur cards
- `@keyframes galaxy-pulse` animation
- `@keyframes listening-pulse` animation
- Animation utility classes

---

## Data Flow

### Conversation Flow:
```
User Speech → VoicePipeline → AIContext → BridgeService → sofie-backend → LLM
                                                  ↓
Response Stream ← AIContext ← BridgeService ← WebSocket chunks
       ↓
GalaxySofie (visualization) + AIStatusBar (UI)
       ↓
BiometricAdapter (parallel capture)
       ↓
LedgerAnchor (optional anchoring)
```

### State Transitions:
```
dormant → startListening() → listening → stopListening() → processing → stream_start → speaking → stream_end → dormant
                                                                   ↓
                                                            abortSpeaking() → dormant
```

---

## Environment Variables

```bash
# WebSocket connection
REACT_APP_BRIDGE_WS_URL=ws://localhost:3000/heartware-stream

# Backend API
REACT_APP_BACKEND_URL=http://localhost:3000

# Legacy AI API (fallback)
REACT_APP_SOFIE_API_URL=http://localhost:8000/v1/chat/completions
REACT_APP_SOFIE_API_KEY=sk-dummy
```

---

## Usage Examples

### Basic Usage in Component:
```jsx
import { useAI } from './context/AIContext';

function MyComponent() {
  const { sofieState, sendMessage, currentResponse } = useAI();
  
  return (
    <div>
      <p>Status: {sofieState}</p>
      <p>Response: {currentResponse}</p>
      <button onClick={() => sendMessage('Hello Sofie')}>
        Send Message
      </button>
    </div>
  );
}
```

### Access Biometrics:
```jsx
import { useBiometrics } from './context/AIContext';

function HealthWidget() {
  const { userBiometrics, captureBiometricSnapshot } = useBiometrics();
  
  return (
    <div>
      <p>Heart Rate: {userBiometrics.pulseRate} BPM</p>
      <button onClick={captureBiometricSnapshot}>
        Measure
      </button>
    </div>
  );
}
```

### Navigate to Galaxy View:
```jsx
// Navigate to full-screen galaxy
window.location.href = '/galaxy';
```

---

## Integration Points

### Existing Extensions:
All existing Heartware extensions remain fully functional. The AIStatusBar provides a persistent AI interface across all pages.

### Error Handling:
Critical errors flow to `SofieContext.addError()` for centralized error management.

### Authentication:
User ID retrieved from `localStorage.getItem('heartware_user_id')` and passed to BridgeService during auth handshake.

### Data Encryption:
Biometric data encrypted using WebCrypto API (AES-GCM-256) before transmission.

---

## Browser Requirements

- **Modern browsers** with WebSocket support
- **Web Speech API** for voice features (Chrome, Edge, Safari)
- **WebBluetooth** for wearable integration (Chrome, Edge)
- **WebCrypto API** for encryption (all modern browsers)
- **WebGL** for galaxy visualization (Three.js)

---

## Future Enhancements

1. **Voice Activity Detection (VAD)** - Replace Web Speech API with custom VAD for better silence detection
2. **Face-api.js Integration** - More accurate PPG-based heart rate from webcam
3. **Multi-language Support** - Extend STT/TTS to additional languages
4. **Offline Mode** - Queue messages when disconnected, sync on reconnect
5. **Conversation Persistence** - Store conversation history in localStorage/IndexedDB

---

## File Statistics

| File | Lines | Purpose |
|------|-------|---------|
| BridgeService.js | 350 | WebSocket manager |
| SofieLlamaApi.js | 284 | AI API with streaming |
| AIContext.jsx | 487 | React Context |
| VoicePipeline.js | 401 | STT/TTS coordination |
| BiometricAdapter.js | 434 | Biometric capture factory |
| LedgerAnchor.js | 208 | Blockchain anchoring |
| GalaxySofie.jsx | 545 | 3D galaxy visualization |
| AIStatusBar.jsx | 430 | Status bar component |
| App.js | 157 | Updated app entry |
| SofieContext.js | 60 | Added useSofie hook |
| **Total** | **~3,356** | **New code** |

---

**Implementation Date:** February 1, 2026  
**Status:** ✅ Complete - Ready for Integration Testing
