/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  GRANT ACCESS CEREMONY                                                    ║
 * ║  A ritual interface for granting access—not a form                        ║
 * ║                                                                           ║
 * ║  Step 1: Select System (Tholos/Harmonic/Terratone)                        ║
 * ║  Step 2: Select Caregiver (ENS name or address)                           ║
 * ║  Step 3: Set Duration (slider: 1 hour to Lifetime)                        ║
 * ║  Step 4: Confirm (meta-transaction via relayer)                           ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { CONTRACTS, SYSTEM_HASHES, getSystemName } from '../../web3/contracts';

const SYSTEMS = [
  { hash: SYSTEM_HASHES.THOLOS_MEDICA, name: 'Tholos Medica', emoji: '🏥', desc: 'Clinical records' },
  { hash: SYSTEM_HASHES.HARMONIC_BALANCE, name: 'Harmonic Balance', emoji: '💓', desc: 'Biofeedback data' },
  { hash: SYSTEM_HASHES.TERRATONE, name: 'Terratone', emoji: '🎵', desc: 'Frequency sessions' },
  { hash: SYSTEM_HASHES.SOFIE_SYSTEMS, name: 'Sofie Systems', emoji: '🤖', desc: 'Device control' },
  { hash: SYSTEM_HASHES.SOFIE_LLM, name: 'Sofie LLM', emoji: '🧠', desc: 'AI conversations' },
];

const DURATION_OPTIONS = [
  { label: '1 Hour', value: 3600 },
  { label: '1 Day', value: 86400 },
  { label: '1 Week', value: 604800 },
  { label: '1 Month', value: 2592000 },
  { label: '1 Year', value: 31536000 },
  { label: 'Lifetime', value: 0 },
];

export function GrantAccessCeremony({ onComplete }) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  const [step, setStep] = useState(1);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [caregiverAddress, setCaregiverAddress] = useState('');
  const [duration, setDuration] = useState(86400); // Default 1 day
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!isConnected || !caregiverAddress || !selectedSystem) return;
    
    setIsSubmitting(true);
    try {
      await writeContract({
        address: CONTRACTS.AccessGovernor.address,
        abi: CONTRACTS.AccessGovernor.abi,
        functionName: 'grantAccess',
        args: [caregiverAddress, selectedSystem.hash, duration, memo],
      });
      onComplete?.();
    } catch (err) {
      console.error('Failed to grant access:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAddress = (addr) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  if (!isConnected) {
    return (
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <p style={{ opacity: 0.6 }}>Connect wallet to grant access</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(0,0,0,0.8)',
      border: '1px solid rgba(255,20,147,0.3)',
      borderRadius: '24px',
      padding: '32px',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '32px',
      }}>
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            style={{
              width: '32px',
              height: '4px',
              borderRadius: '2px',
              background: s <= step ? '#FF1493' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Step 1: Select System */}
      {step === 1 && (
        <div>
          <h3 style={{
            textAlign: 'center',
            fontSize: '18px',
            marginBottom: '24px',
            color: 'white',
          }}>
            🌐 Select System
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SYSTEMS.map((system) => (
              <button
                key={system.hash}
                onClick={() => setSelectedSystem(system)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: selectedSystem?.hash === system.hash 
                    ? 'rgba(255,20,147,0.2)' 
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedSystem?.hash === system.hash 
                    ? '#FF1493' 
                    : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'white',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '32px' }}>{system.emoji}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{system.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{system.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Caregiver */}
      {step === 2 && (
        <div>
          <h3 style={{
            textAlign: 'center',
            fontSize: '18px',
            marginBottom: '24px',
            color: 'white',
          }}>
            👤 Select Caregiver
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '8px',
            }}>
              Wallet Address or ENS
            </label>
            <input
              type="text"
              value={caregiverAddress}
              onChange={(e) => setCaregiverAddress(e.target.value)}
              placeholder="0x... or name.eth"
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${validateAddress(caregiverAddress) ? '#00FF88' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {validateAddress(caregiverAddress) && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#00FF88' }}>
                ✓ Valid address
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Set Duration */}
      {step === 3 && (
        <div>
          <h3 style={{
            textAlign: 'center',
            fontSize: '18px',
            marginBottom: '24px',
            color: 'white',
          }}>
            ⏱️ Set Duration
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={DURATION_OPTIONS.findIndex(opt => opt.value === duration)}
              onChange={(e) => setDuration(DURATION_OPTIONS[parseInt(e.target.value)].value)}
              style={{
                width: '100%',
                marginBottom: '16px',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {DURATION_OPTIONS.map((opt, idx) => (
                <span
                  key={idx}
                  style={{
                    color: opt.value === duration ? '#FF1493' : 'inherit',
                    fontWeight: opt.value === duration ? 'bold' : 'normal',
                  }}
                >
                  {opt.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{
            background: 'rgba(255,20,147,0.1)',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF1493' }}>
              {DURATION_OPTIONS.find(opt => opt.value === duration)?.label}
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '8px',
            }}>
              Memo (Optional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g., Dr. Sarah - Annual checkup"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div>
          <h3 style={{
            textAlign: 'center',
            fontSize: '18px',
            marginBottom: '24px',
            color: 'white',
          }}>
            ✨ Confirm Ceremony
          </h3>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>System</div>
              <div style={{ fontSize: '16px', color: 'white' }}>{selectedSystem?.emoji} {selectedSystem?.name}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Caregiver</div>
              <div style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace' }}>{caregiverAddress}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Duration</div>
              <div style={{ fontSize: '16px', color: '#FF1493' }}>{DURATION_OPTIONS.find(opt => opt.value === duration)?.label}</div>
            </div>
            {memo && (
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Memo</div>
                <div style={{ fontSize: '14px', color: 'white', fontStyle: 'italic' }}>"{memo}"</div>
              </div>
            )}
          </div>
          
          {/* Sacred Geometry Animation Placeholder */}
          <div style={{
            textAlign: 'center',
            padding: '20px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto',
              borderRadius: '50%',
              border: '2px solid rgba(255,20,147,0.5)',
              animation: 'spin 4s linear infinite',
            }} />
            <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              Sealing permission in the Ledger...
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '32px',
      }}>
        {step > 1 && (
          <button
            onClick={handleBack}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !selectedSystem) ||
              (step === 2 && !validateAddress(caregiverAddress))
            }
            style={{
              flex: 1,
              padding: '14px',
              background: '#FF1493',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: (step === 1 && !selectedSystem) || (step === 2 && !validateAddress(caregiverAddress)) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: (step === 1 && !selectedSystem) || (step === 2 && !validateAddress(caregiverAddress)) ? 0.5 : 1,
            }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isPending || isSubmitting}
            style={{
              flex: 1,
              padding: '14px',
              background: '#00FF88',
              border: 'none',
              borderRadius: '12px',
              color: 'black',
              cursor: isPending || isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: isPending || isSubmitting ? 0.5 : 1,
            }}
          >
            {isPending || isSubmitting ? 'Sealing...' : '🔒 Seal Permission'}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default GrantAccessCeremony;
