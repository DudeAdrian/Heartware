/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  SENSITIVE TEXT COMPONENT                                                 ║
 * ║  Privacy-Protected Text Display                                           ║
 * ║                                                                           ║
 * ║  Automatically blurs when privacy mode is active.                         ║
 * ║  Click to temporarily reveal.                                             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { usePrivacy } from './PrivacyModeToggle';

export function SensitiveText({ 
  children, 
  className = '',
  blurStrength = 8,
  itemId,
}) {
  const { privacyMode, revealedItems, setRevealedItems } = usePrivacy();
  const [isHovered, setIsHovered] = useState(false);
  
  const isRevealed = itemId && revealedItems.has(itemId);
  const shouldBlur = privacyMode && !isRevealed;

  const handleClick = useCallback(() => {
    if (!privacyMode || !itemId) return;
    
    const newRevealed = new Set(revealedItems);
    if (newRevealed.has(itemId)) {
      newRevealed.delete(itemId);
    } else {
      newRevealed.add(itemId);
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setRevealedItems(prev => {
          const updated = new Set(prev);
          updated.delete(itemId);
          return updated;
        });
      }, 5000);
    }
    setRevealedItems(newRevealed);
  }, [privacyMode, itemId, revealedItems, setRevealedItems]);

  return (
    <span
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: shouldBlur ? `blur(${blurStrength}px)` : 'none',
        cursor: privacyMode ? 'pointer' : 'default',
        transition: 'filter 0.2s ease',
        userSelect: shouldBlur ? 'none' : 'auto',
        position: 'relative',
      }}
      title={privacyMode ? 'Click to reveal (5s)' : ''}
    >
      {children}
      {shouldBlur && isHovered && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          🔒 Click to reveal
        </span>
      )}
    </span>
  );
}

export default SensitiveText;
