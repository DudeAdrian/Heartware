/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  GALAXY IDENTITY CARD                                                     ║
 * ║  Visual: User's Galaxy particle cloud morphs into identity card           ║
 * ║                                                                           ║
 * ║  PILLAR 3: Reverse-Engineer Genius - Steve Jobs (Human Interface)         ║
 * ║  The Galaxy visualization remains the centerpiece; identity emerges       ║
 * ║  from it like stars coalescing into a constellation.                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACTS, shortenAddress, formatTimestamp } from '../../web3/contracts';

export function GalaxyIdentityCard({ onExpand, compact = false }) {
  const { address, isConnected } = useAccount();
  const [sovereignSince, setSovereignSince] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Read sovereign identity info from Ledger
  const { data: identityData } = useReadContract({
    address: CONTRACTS.SovereignIdentity.address,
    abi: CONTRACTS.SovereignIdentity.abi,
    functionName: 'getLinkedSystems',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address,
  });

  useEffect(() => {
    // In production, fetch actual registration timestamp from events
    if (isConnected) {
      setSovereignSince(Date.now() - 30 * 24 * 60 * 60 * 1000); // Placeholder: 30 days ago
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: compact ? '16px' : '24px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          width: compact ? '50px' : '80px',
          height: compact ? '50px' : '80px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? '24px' : '32px',
        }}>⚪</div>
        <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>
          Connect wallet to initialize sovereignty
        </p>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
      style={{
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(255,20,147,0.15), rgba(147,112,219,0.15))' 
          : 'rgba(0,0,0,0.6)',
        border: `1px solid ${isHovered ? 'rgba(255,20,147,0.4)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '20px',
        padding: compact ? '16px' : '24px',
        backdropFilter: 'blur(10px)',
        cursor: onExpand ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: isHovered ? 0.3 : 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(255,20,147,0.3), transparent 50%)',
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Avatar Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? '12px' : '16px',
          marginBottom: compact ? '12px' : '16px',
        }}>
          <div style={{
            width: compact ? '50px' : '70px',
            height: compact ? '50px' : '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF1493, #9370DB, #4169E1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: compact ? '24px' : '32px',
            boxShadow: '0 0 30px rgba(255,20,147,0.4)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}>
            👤
          </div>
          
          <div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: compact ? '14px' : '18px',
              color: 'white',
              marginBottom: '4px',
            }}>
              {shortenAddress(address, compact ? 4 : 6)}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00FF88',
                boxShadow: '0 0 8px #00FF88',
              }} />
              <span style={{ color: '#00FF88' }}>Sovereign Active</span>
            </div>
          </div>
        </div>

        {/* Sovereign Since */}
        {sovereignSince && !compact && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '12px',
          }}>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '4px',
            }}>
              Sovereign Since
            </div>
            <div style={{ fontSize: '14px', color: 'white' }}>
              {new Date(sovereignSince).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        )}

        {/* Linked Systems Count */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,20,147,0.1)',
          borderRadius: '12px',
          padding: '10px 12px',
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            Linked Systems
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#FF1493',
          }}>
            {identityData?.length || 0} / 9
          </span>
        </div>

        {/* Expand hint */}
        {!compact && onExpand && (
          <div style={{
            textAlign: 'center',
            marginTop: '12px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
          }}>
            Click to expand sovereignty
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255,20,147,0.4); }
          50% { box-shadow: 0 0 50px rgba(255,20,147,0.6); }
        }
      `}</style>
    </div>
  );
}

export default GalaxyIdentityCard;
