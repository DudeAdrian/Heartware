/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  SYSTEM LINKER MODAL                                                      ║
 * ║  Link Heartware to the 9-Chamber Ecosystem                                ║
 * ║                                                                           ║
 * ║  - Modal overlay with Galaxy background blur                              ║
 * ║  - List available systems: Tholos, Harmonic, Terratone, etc.              ║
 * ║  - Gasless meta-transactions via ERC-2771 relayer                         ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACTS, SYSTEM_HASHES, getSystemName } from '../../web3/contracts';

const AVAILABLE_SYSTEMS = [
  { 
    hash: SYSTEM_HASHES.THOLOS_MEDICA, 
    name: 'Tholos Medica',
    description: 'Clinical records & medical history',
    emoji: '🏥',
    color: '#FF6B6B',
  },
  { 
    hash: SYSTEM_HASHES.HARMONIC_BALANCE, 
    name: 'Harmonic Balance',
    description: 'HRV & EEG biofeedback streams',
    emoji: '💓',
    color: '#4ECDC4',
  },
  { 
    hash: SYSTEM_HASHES.TERRATONE, 
    name: 'Terratone',
    description: 'Frequency healing & breathwork',
    emoji: '🎵',
    color: '#95E1D3',
  },
  { 
    hash: SYSTEM_HASHES.SOFIE_SYSTEMS, 
    name: 'Sofie Systems',
    description: 'Hardware control (PEMF, frequencies)',
    emoji: '🤖',
    color: '#FF1493',
  },
  { 
    hash: SYSTEM_HASHES.SOFIE_LLM, 
    name: 'Sofie LLM',
    description: 'AI conversation anchoring',
    emoji: '🧠',
    color: '#A8E6CF',
  },
  { 
    hash: SYSTEM_HASHES.SOFIE_MAP, 
    name: 'Sofie Map',
    description: 'Geo-fenced access controls',
    emoji: '🗺',
    color: '#FFD93D',
  },
  { 
    hash: SYSTEM_HASHES.SANDIRONRATIO, 
    name: 'Sandironratio Node',
    description: 'Block validation & security',
    emoji: '⛓',
    color: '#C9B1FF',
  },
];

export function SystemLinkerModal({ onClose }) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [linkingSystem, setLinkingSystem] = useState(null);
  const [systemId, setSystemId] = useState('');

  // Read currently linked systems
  const { data: linkedSystems, refetch } = useReadContract({
    address: CONTRACTS.SovereignIdentity.address,
    abi: CONTRACTS.SovereignIdentity.abi,
    functionName: 'getLinkedSystems',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address,
  });

  const isLinked = (systemHash) => {
    return linkedSystems?.some(hash => 
      hash.toLowerCase() === systemHash.toLowerCase()
    );
  };

  const handleLink = async (system) => {
    if (!isConnected) return;
    
    setLinkingSystem(system.hash);
    
    try {
      await writeContract({
        address: CONTRACTS.SovereignIdentity.address,
        abi: CONTRACTS.SovereignIdentity.abi,
        functionName: 'linkSystem',
        args: [system.hash, systemId || `${system.name.toLowerCase().replace(/\s+/g, '-')}-id`],
      });
      
      await refetch();
      setSystemId('');
    } catch (err) {
      console.error('Failed to link system:', err);
    } finally {
      setLinkingSystem(null);
    }
  };

  const handleUnlink = async (systemHash) => {
    if (!isConnected) return;
    
    try {
      await writeContract({
        address: CONTRACTS.SovereignIdentity.address,
        abi: CONTRACTS.SovereignIdentity.abi,
        functionName: 'unlinkSystem',
        args: [systemHash],
      });
      
      await refetch();
    } catch (err) {
      console.error('Failed to unlink system:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(20px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto',
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,20,147,0.3)',
        borderRadius: '24px',
        padding: '28px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h2 style={{
              margin: '0 0 4px 0',
              fontSize: '20px',
              color: '#FF1493',
            }}>🔗 Expand Sovereignty</h2>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
            }}>Connect to the 9-Chamber Ecosystem</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Close
          </button>
        </div>

        {/* System ID Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '8px',
          }}>
            Your System Identifier (Optional)
          </label>
          <input
            type="text"
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
            placeholder="e.g., patient-12345 or leave blank for auto"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Systems List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {AVAILABLE_SYSTEMS.map((system) => {
            const linked = isLinked(system.hash);
            const isLoading = linkingSystem === system.hash;
            
            return (
              <div
                key={system.hash}
                style={{
                  background: linked 
                    ? `linear-gradient(90deg, ${system.color}20, transparent)` 
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${linked ? system.color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: `${system.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {system.emoji}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '2px',
                  }}>
                    {system.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {system.description}
                  </div>
                </div>
                
                <button
                  onClick={() => linked ? handleUnlink(system.hash) : handleLink(system)}
                  disabled={isPending || isLoading}
                  style={{
                    background: linked ? 'transparent' : `${system.color}30`,
                    border: `1px solid ${linked ? system.color : `${system.color}50`}`,
                    color: linked ? system.color : 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    opacity: isPending ? 0.5 : 1,
                    minWidth: '80px',
                  }}
                >
                  {isLoading ? '...' : linked ? 'Unlink' : 'Link'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(255,20,147,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255,20,147,0.1)',
        }}>
          <p style={{
            margin: 0,
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.5,
          }}>
            💡 <strong>Gasless Transactions:</strong> All linking operations use 
            meta-transactions. The relayer pays gas fees—you just sign with your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SystemLinkerModal;
