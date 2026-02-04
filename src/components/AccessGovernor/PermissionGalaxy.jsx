/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  PERMISSION GALAXY                                                        ║
 * ║  Visual: Galaxy particles represent active access grants                  ║
 * ║                                                                           ║
 * ║  Each particle = one doctor/caregiver with access                         ║
 * ║  Radial timeline showing who has access until when                        ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS, SYSTEM_HASHES, getSystemName, formatTimestamp } from '../../web3/contracts';

export function PermissionGalaxy() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const [revoking, setRevoking] = useState(null);
  const [selectedGrant, setSelectedGrant] = useState(null);

  // Read active grants from AccessGovernor
  const { data: activeGrants, refetch } = useReadContract({
    address: CONTRACTS.AccessGovernor.address,
    abi: CONTRACTS.AccessGovernor.abi,
    functionName: 'getActiveGrants',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address,
  });

  const grants = useMemo(() => {
    if (!activeGrants) return [];
    return activeGrants.map((grant, index) => ({
      id: index,
      caregiver: grant.caregiver,
      systemHash: grant.systemHash,
      expiry: Number(grant.expiry),
      memo: grant.memo,
      systemName: getSystemName(grant.systemHash),
    }));
  }, [activeGrants]);

  const handleRevoke = async (grant) => {
    if (!isConnected) return;
    
    setRevoking(grant.id);
    try {
      await writeContract({
        address: CONTRACTS.AccessGovernor.address,
        abi: CONTRACTS.AccessGovernor.abi,
        functionName: 'revokeAccess',
        args: [grant.caregiver, grant.systemHash],
      });
      await refetch();
    } catch (err) {
      console.error('Failed to revoke access:', err);
    } finally {
      setRevoking(null);
      setSelectedGrant(null);
    }
  };

  const getTimeRemaining = (expiry) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = expiry - now;
    
    if (remaining <= 0) return 'Expired';
    if (remaining < 3600) return `${Math.floor(remaining / 60)}m remaining`;
    if (remaining < 86400) return `${Math.floor(remaining / 3600)}h remaining`;
    return `${Math.floor(remaining / 86400)}d remaining`;
  };

  const getGrantColor = (systemHash) => {
    const colors = {
      [SYSTEM_HASHES.THOLOS_MEDICA]: '#FF6B6B',
      [SYSTEM_HASHES.HARMONIC_BALANCE]: '#4ECDC4',
      [SYSTEM_HASHES.TERRATONE]: '#95E1D3',
      [SYSTEM_HASHES.SOFIE_SYSTEMS]: '#FF1493',
      [SYSTEM_HASHES.SOFIE_LLM]: '#A8E6CF',
    };
    return colors[systemHash] || '#9370DB';
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <p style={{ opacity: 0.6 }}>Connect wallet to view access permissions</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px',
      padding: '24px',
      position: 'relative',
      minHeight: '400px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'white' }}>
            🌌 Permission Galaxy
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            {grants.length} active access grant{grants.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Galaxy Visualization */}
      <div style={{
        position: 'relative',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Central Hub (Patient) */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF1493, #9370DB)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 0 40px rgba(255,20,147,0.5)',
          zIndex: 10,
        }}>
          👤
        </div>

        {/* Orbiting Grants */}
        {grants.map((grant, index) => {
          const angle = (index / Math.max(grants.length, 1)) * 2 * Math.PI;
          const radius = 100;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const color = getGrantColor(grant.systemHash);
          const isSelected = selectedGrant?.id === grant.id;
          
          return (
            <div
              key={grant.id}
              onClick={() => setSelectedGrant(isSelected ? null : grant)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: isSelected ? '70px' : '50px',
                height: isSelected ? '70px' : '50px',
                borderRadius: '50%',
                background: `${color}30`,
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isSelected ? `0 0 30px ${color}` : `0 0 10px ${color}50`,
                zIndex: isSelected ? 20 : 5,
              }}
            >
              <span style={{ fontSize: isSelected ? '28px' : '20px' }}>
                {grant.systemHash === SYSTEM_HASHES.THOLOS_MEDICA ? '🏥' :
                 grant.systemHash === SYSTEM_HASHES.HARMONIC_BALANCE ? '💓' :
                 grant.systemHash === SYSTEM_HASHES.TERRATONE ? '🎵' :
                 grant.systemHash === SYSTEM_HASHES.SOFIE_SYSTEMS ? '🤖' : '🔑'}
              </span>
            </div>
          );
        })}

        {/* Connecting Lines */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}>
          {grants.map((grant, index) => {
            const angle = (index / Math.max(grants.length, 1)) * 2 * Math.PI;
            const radius = 100;
            const x = Math.cos(angle) * radius + 140; // Center offset
            const y = Math.sin(angle) * radius + 140;
            const color = getGrantColor(grant.systemHash);
            
            return (
              <line
                key={grant.id}
                x1="140"
                y1="140"
                x2={x}
                y2={y}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Selected Grant Detail */}
      {selectedGrant && (
        <div style={{
          background: `${getGrantColor(selectedGrant.systemHash)}10`,
          border: `1px solid ${getGrantColor(selectedGrant.systemHash)}40`,
          borderRadius: '16px',
          padding: '16px',
          marginTop: '16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                {selectedGrant.systemName}
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                color: 'white',
              }}>
                {selectedGrant.caregiver.slice(0, 6)}...{selectedGrant.caregiver.slice(-4)}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              color: getTimeRemaining(selectedGrant.expiry) === 'Expired' ? '#FF6B6B' : '#00FF88',
            }}>
              {getTimeRemaining(selectedGrant.expiry)}
            </div>
          </div>
          
          {selectedGrant.memo && (
            <div style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '12px',
              fontStyle: 'italic',
            }}>
              "{selectedGrant.memo}"
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleRevoke(selectedGrant)}
              disabled={revoking === selectedGrant.id}
              style={{
                flex: 1,
                background: 'rgba(255,0,0,0.2)',
                border: '1px solid rgba(255,0,0,0.4)',
                color: '#FF6B6B',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              {revoking === selectedGrant.id ? 'Revoking...' : '🔒 Revoke Access'}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {grants.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          opacity: 0.5,
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌌</div>
          <p style={{ fontSize: '14px' }}>No active access grants</p>
          <p style={{ fontSize: '11px' }}>Your health data is private</p>
        </div>
      )}
    </div>
  );
}

export default PermissionGalaxy;
