/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  DEAD MAN'S SWITCH HOOK                                                   ║
 * ║  Sovereignty Preservation Through Automated Emergency Access              ║
 * ║                                                                           ║
 * ║  PILLAR 5: Black Market Tactics - Security Through Obscurity              ║
 * ║  - "If I don't check in for X days, release records to Dr. Y"             ║
 * ║  - Configurable check-in period (30/60/90 days)                           ║
 * ║  - Grace period notifications before trigger                              ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS } from '../web3/contracts';

const CHECK_IN_PERIODS = {
  THIRTY_DAYS: 30 * 24 * 60 * 60,      // 30 days in seconds
  SIXTY_DAYS: 60 * 24 * 60 * 60,       // 60 days in seconds
  NINETY_DAYS: 90 * 24 * 60 * 60,      // 90 days in seconds
};

const GRACE_PERIOD = 7 * 24 * 60 * 60; // 7 days warning before trigger

export function useDeadMansSwitch() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  
  const [selectedPeriod, setSelectedPeriod] = useState(CHECK_IN_PERIODS.NINETY_DAYS);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const [gracePeriodActive, setGracePeriodActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Read current check-in status from Ledger
  const { data: checkInData, refetch } = useReadContract({
    address: CONTRACTS.AccessGovernor.address,
    abi: CONTRACTS.AccessGovernor.abi,
    functionName: 'getDeadMansSwitch',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address,
  });

  // Update local state from contract data
  useEffect(() => {
    if (checkInData) {
      setLastCheckIn(Number(checkInData.lastCheckIn));
      setEmergencyContact(checkInData.emergencyContact);
      setSelectedPeriod(Number(checkInData.checkInPeriod));
      setIsTriggered(checkInData.triggered);
    }
  }, [checkInData]);

  // Countdown timer
  useEffect(() => {
    if (!lastCheckIn || !selectedPeriod) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const deadline = lastCheckIn + selectedPeriod;
      const remaining = deadline - now;
      
      setTimeRemaining(Math.max(0, remaining));
      
      // Check if in grace period (last 7 days)
      if (remaining > 0 && remaining <= GRACE_PERIOD) {
        setGracePeriodActive(true);
      } else {
        setGracePeriodActive(false);
      }
      
      // Check if triggered
      if (remaining <= 0 && !isTriggered) {
        setIsTriggered(true);
        // Trigger emergency access
        triggerEmergencyAccess();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastCheckIn, selectedPeriod, isTriggered]);

  /**
   * Perform a check-in (reset the timer)
   */
  const performCheckIn = useCallback(async () => {
    if (!isConnected) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: CONTRACTS.AccessGovernor.address,
        abi: CONTRACTS.AccessGovernor.abi,
        functionName: 'checkIn',
      });
      
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Check-in failed:', err);
      throw err;
    }
  }, [isConnected, writeContract, refetch]);

  /**
   * Configure the dead man's switch
   */
  const configureSwitch = useCallback(async ({
    checkInPeriod,
    emergencyContactAddress,
  }) => {
    if (!isConnected) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: CONTRACTS.AccessGovernor.address,
        abi: CONTRACTS.AccessGovernor.abi,
        functionName: 'configureDeadMansSwitch',
        args: [checkInPeriod, emergencyContactAddress],
      });
      
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Configuration failed:', err);
      throw err;
    }
  }, [isConnected, writeContract, refetch]);

  /**
   * Trigger emergency access (called automatically or manually)
   */
  const triggerEmergencyAccess = useCallback(async () => {
    if (!isConnected || !emergencyContact) return;

    try {
      await writeContract({
        address: CONTRACTS.AccessGovernor.address,
        abi: CONTRACTS.AccessGovernor.abi,
        functionName: 'triggerEmergencyAccess',
        args: [address],
      });
      
      // Notify UI
      window.dispatchEvent(new CustomEvent('heartware-emergency-triggered', {
        detail: { 
          emergencyContact, 
          timestamp: Date.now(),
          reason: 'Dead Man\'s Switch Activated',
        },
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Emergency access trigger failed:', err);
      throw err;
    }
  }, [isConnected, emergencyContact, address, writeContract]);

  /**
   * Format remaining time for display
   */
  const formatTimeRemaining = useCallback(() => {
    if (timeRemaining === null) return 'Not configured';
    if (timeRemaining <= 0) return 'TRIGGERED';
    
    const days = Math.floor(timeRemaining / 86400);
    const hours = Math.floor((timeRemaining % 86400) / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  }, [timeRemaining]);

  return {
    // State
    isConfigured: !!lastCheckIn,
    lastCheckIn,
    emergencyContact,
    selectedPeriod,
    isTriggered,
    gracePeriodActive,
    timeRemaining,
    
    // Constants
    CHECK_IN_PERIODS,
    
    // Actions
    performCheckIn,
    configureSwitch,
    triggerEmergencyAccess,
    formatTimeRemaining,
    refresh: refetch,
  };
}

export default useDeadMansSwitch;
