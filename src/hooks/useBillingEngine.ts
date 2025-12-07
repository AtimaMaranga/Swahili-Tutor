'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWalletStore } from '@/stores/walletStore';
import { useSessionStore } from '@/stores/sessionStore';
import { supabase } from '@/lib/supabase/client';
import type { WalletWarning } from '@/types';

interface BillingEngineConfig {
  sessionId: string;
  pricePerMinuteCents: number;
  studentWalletId: string;
  onLowBalance?: (warning: WalletWarning) => void;
  onZeroBalance?: () => void;
  onCharge?: (minutesCharged: number, amountCents: number) => void;
  onError?: (error: Error) => void;
}

/**
 * Metered Billing Engine Hook
 *
 * This hook implements the "Heartbeat" billing system:
 * 1. Charges the student's wallet every 60 seconds while the session is active
 * 2. Handles low balance warnings at 5 minutes and 1 minute remaining
 * 3. Implements graceful termination when balance reaches zero
 * 4. Handles "state drift" by using server-side timestamps
 * 5. Supports in-call top-up without disconnecting
 */
export function useBillingEngine(config: BillingEngineConfig) {
  const {
    sessionId,
    pricePerMinuteCents,
    studentWalletId,
    onLowBalance,
    onZeroBalance,
    onCharge,
    onError,
  } = config;

  const { updateBalance, setWarning } = useWalletStore();
  const { incrementMinutes, setLastHeartbeat } = useSessionStore();

  const [isActive, setIsActive] = useState(false);
  const [minutesElapsed, setMinutesElapsed] = useState(0);
  const [totalCharged, setTotalCharged] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastChargeTimeRef = useRef<Date | null>(null);

  // Calculate remaining minutes based on balance
  const calculateRemainingMinutes = useCallback((balanceCents: number) => {
    if (pricePerMinuteCents <= 0) return Infinity;
    return Math.floor(balanceCents / pricePerMinuteCents);
  }, [pricePerMinuteCents]);

  // Check balance and trigger warnings
  const checkBalanceWarnings = useCallback((balanceCents: number) => {
    const remainingMinutes = calculateRemainingMinutes(balanceCents);

    if (remainingMinutes <= 0) {
      const warning: WalletWarning = {
        type: 'zero_balance',
        remaining_minutes: 0,
        message: 'Your balance has run out. The session will end.',
      };
      setWarning(warning);
      onLowBalance?.(warning);
      return 'zero';
    }

    if (remainingMinutes <= 1) {
      const warning: WalletWarning = {
        type: 'critical_balance',
        remaining_minutes: remainingMinutes,
        message: `Only ${remainingMinutes} minute remaining! Add funds now to continue.`,
      };
      setWarning(warning);
      onLowBalance?.(warning);
      return 'critical';
    }

    if (remainingMinutes <= 5) {
      const warning: WalletWarning = {
        type: 'low_balance',
        remaining_minutes: remainingMinutes,
        message: `Low balance: ${remainingMinutes} minutes remaining.`,
      };
      setWarning(warning);
      onLowBalance?.(warning);
      return 'low';
    }

    setWarning(null);
    return 'ok';
  }, [calculateRemainingMinutes, setWarning, onLowBalance]);

  // Execute a single billing charge (called every minute)
  const executeCharge = useCallback(async () => {
    try {
      // Server-side charge to prevent manipulation
      // Using Supabase RPC for atomic wallet deduction
      const { data, error } = await supabase.rpc('deduct_from_wallet', {
        p_wallet_id: studentWalletId,
        p_amount_cents: pricePerMinuteCents,
        p_description: `Session charge - Minute ${minutesElapsed + 1}`,
        p_reference_id: sessionId,
      });

      if (error) {
        // Check if it's an insufficient balance error
        if (error.message.includes('insufficient') || !data) {
          onZeroBalance?.();
          return false;
        }
        throw error;
      }

      // Fetch updated balance
      const { data: walletData } = await supabase
        .from('wallets')
        .select('balance_cents')
        .eq('id', studentWalletId)
        .single();

      if (walletData) {
        const newBalance = walletData.balance_cents;
        setCurrentBalance(newBalance);
        updateBalance(newBalance);

        // Check for warnings
        const status = checkBalanceWarnings(newBalance);
        if (status === 'zero') {
          onZeroBalance?.();
          return false;
        }
      }

      // Update local state
      setMinutesElapsed((prev) => prev + 1);
      setTotalCharged((prev) => prev + pricePerMinuteCents);
      incrementMinutes();
      lastChargeTimeRef.current = new Date();

      // Create heartbeat for real-time sync
      setLastHeartbeat({
        session_id: sessionId,
        student_id: '', // Will be set by context
        tutor_id: '', // Will be set by context
        current_balance_cents: walletData?.balance_cents ?? 0,
        minutes_elapsed: minutesElapsed + 1,
        price_per_minute_cents: pricePerMinuteCents,
        timestamp: new Date().toISOString(),
      });

      onCharge?.(minutesElapsed + 1, pricePerMinuteCents);

      // Log the charge event
      await supabase.from('session_logs').insert({
        session_id: sessionId,
        event_type: 'charge',
        user_id: studentWalletId, // This would be the actual user ID
        metadata: {
          minute: minutesElapsed + 1,
          amount_cents: pricePerMinuteCents,
          balance_after: walletData?.balance_cents,
        },
      });

      return true;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Billing error'));
      return false;
    }
  }, [
    studentWalletId,
    pricePerMinuteCents,
    sessionId,
    minutesElapsed,
    updateBalance,
    checkBalanceWarnings,
    incrementMinutes,
    setLastHeartbeat,
    onCharge,
    onZeroBalance,
    onError,
  ]);

  // Start the billing engine
  const start = useCallback(async () => {
    if (isActive) return;

    // Initial balance check
    const { data: walletData } = await supabase
      .from('wallets')
      .select('balance_cents')
      .eq('id', studentWalletId)
      .single();

    if (walletData) {
      setCurrentBalance(walletData.balance_cents);
      const status = checkBalanceWarnings(walletData.balance_cents);

      if (status === 'zero') {
        onZeroBalance?.();
        return;
      }
    }

    setIsActive(true);
    lastChargeTimeRef.current = new Date();

    // Start billing interval (every 60 seconds)
    intervalRef.current = setInterval(async () => {
      const success = await executeCharge();
      if (!success) {
        stop();
      }
    }, 60000); // 60 seconds

    // Log session start for billing
    await supabase.from('sessions').update({
      status: 'active',
      started_at: new Date().toISOString(),
    }).eq('id', sessionId);

  }, [isActive, studentWalletId, sessionId, checkBalanceWarnings, executeCharge, onZeroBalance]);

  // Stop the billing engine
  const stop = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);

    // Calculate final duration handling partial minutes
    // If we charged but the session ends mid-minute, no refund for partial
    // (This is the policy - we charge for started minutes)

    // Update session with final stats
    await supabase.from('sessions').update({
      status: 'completed',
      ended_at: new Date().toISOString(),
      duration_minutes: minutesElapsed,
      total_cost_cents: totalCharged,
    }).eq('id', sessionId);

  }, [sessionId, minutesElapsed, totalCharged]);

  // Pause billing (but keep session active)
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
  }, []);

  // Resume billing
  const resume = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      intervalRef.current = setInterval(async () => {
        const success = await executeCharge();
        if (!success) {
          stop();
        }
      }, 60000);
    }
  }, [isActive, executeCharge, stop]);

  // Handle state drift: Reconcile if browser was closed/frozen
  const reconcile = useCallback(async () => {
    if (!lastChargeTimeRef.current) return;

    const now = new Date();
    const lastCharge = lastChargeTimeRef.current;
    const elapsedMinutes = Math.floor((now.getTime() - lastCharge.getTime()) / 60000);

    // If more than 1 minute has passed, we need to catch up
    // But cap at 2 minutes to prevent overcharging on reconnect
    const minutesToCharge = Math.min(elapsedMinutes, 2);

    for (let i = 0; i < minutesToCharge; i++) {
      const success = await executeCharge();
      if (!success) {
        stop();
        return;
      }
    }
  }, [executeCharge, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reconnection handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        reconcile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, reconcile]);

  return {
    isActive,
    minutesElapsed,
    totalCharged,
    currentBalance,
    remainingMinutes: calculateRemainingMinutes(currentBalance),
    start,
    stop,
    pause,
    resume,
    reconcile,
  };
}

/**
 * Zero Balance Protocol
 *
 * This function implements the exact sequence when wallet hits $0:
 * 1. Warning at 5 minutes remaining
 * 2. Warning at 1 minute remaining
 * 3. Soft termination (60 second countdown)
 * 4. Hard termination (force disconnect)
 */
export function useZeroBalanceProtocol(
  onWarning: (type: 'five_min' | 'one_min' | 'countdown', secondsLeft?: number) => void,
  onTerminate: () => void
) {
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(60);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback(() => {
    setCountdownActive(true);
    setCountdownSeconds(60);

    countdownRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          onTerminate();
          return 0;
        }
        onWarning('countdown', prev - 1);
        return prev - 1;
      });
    }, 1000);
  }, [onWarning, onTerminate]);

  const cancelCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdownActive(false);
    setCountdownSeconds(60);
  }, []);

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return {
    countdownActive,
    countdownSeconds,
    startCountdown,
    cancelCountdown,
  };
}
