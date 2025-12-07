import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Session, SessionLog, BillingHeartbeat } from '@/types';

interface SessionState {
  currentSession: Session | null;
  sessionLogs: SessionLog[];
  isLoading: boolean;
  error: string | null;

  // Billing state
  billingActive: boolean;
  minutesElapsed: number;
  lastHeartbeat: BillingHeartbeat | null;

  // Connection state
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';

  // Actions
  startSession: (studentId: string, tutorId: string, pricePerMinute: number) => Promise<Session | null>;
  endSession: (sessionId: string) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  updateSessionStatus: (status: Session['status']) => void;
  logEvent: (eventType: SessionLog['event_type'], metadata?: Record<string, unknown>) => Promise<void>;
  setConnectionQuality: (quality: SessionState['connectionQuality']) => void;
  incrementMinutes: () => void;
  setLastHeartbeat: (heartbeat: BillingHeartbeat) => void;
  fetchSession: (sessionId: string) => Promise<void>;
  subscribeToSession: (sessionId: string) => () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  sessionLogs: [],
  isLoading: false,
  error: null,
  billingActive: false,
  minutesElapsed: 0,
  lastHeartbeat: null,
  isConnected: false,
  connectionQuality: 'disconnected',

  startSession: async (studentId: string, tutorId: string, pricePerMinute: number) => {
    set({ isLoading: true, error: null });

    try {
      const roomName = `swahili-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          student_id: studentId,
          tutor_id: tutorId,
          room_name: roomName,
          price_per_minute_snapshot: pricePerMinute,
          status: 'waiting',
          duration_minutes: 0,
          total_cost_cents: 0,
        })
        .select()
        .single();

      if (error) throw error;

      set({
        currentSession: data,
        isLoading: false,
        billingActive: false,
        minutesElapsed: 0,
      });

      // Log session creation
      await get().logEvent('join', { role: 'initiator' });

      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to start session',
        isLoading: false
      });
      return null;
    }
  },

  endSession: async (sessionId: string) => {
    set({ isLoading: true });

    try {
      const { currentSession, minutesElapsed } = get();

      const { error } = await supabase
        .from('sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          duration_minutes: minutesElapsed,
          total_cost_cents: currentSession
            ? minutesElapsed * currentSession.price_per_minute_snapshot
            : 0,
        })
        .eq('id', sessionId);

      if (error) throw error;

      await get().logEvent('leave', { reason: 'session_ended' });

      set({
        currentSession: null,
        billingActive: false,
        isConnected: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to end session',
        isLoading: false
      });
    }
  },

  pauseSession: () => {
    set({ billingActive: false });
    get().logEvent('pause');
  },

  resumeSession: () => {
    set({ billingActive: true });
    get().logEvent('resume');
  },

  updateSessionStatus: (status: Session['status']) => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: { ...currentSession, status },
        billingActive: status === 'active',
        isConnected: status === 'active' || status === 'paused',
      });
    }
  },

  logEvent: async (eventType: SessionLog['event_type'], metadata?: Record<string, unknown>) => {
    const { currentSession } = get();
    if (!currentSession) return;

    try {
      const { data, error } = await supabase
        .from('session_logs')
        .insert({
          session_id: currentSession.id,
          event_type: eventType,
          user_id: currentSession.student_id, // Will be updated based on actual user
          metadata,
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        sessionLogs: [...state.sessionLogs, data],
      }));
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  },

  setConnectionQuality: (quality: SessionState['connectionQuality']) => {
    set({ connectionQuality: quality });
  },

  incrementMinutes: () => {
    set((state) => ({ minutesElapsed: state.minutesElapsed + 1 }));
  },

  setLastHeartbeat: (heartbeat: BillingHeartbeat) => {
    set({ lastHeartbeat: heartbeat });
  },

  fetchSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      const { data: logs } = await supabase
        .from('session_logs')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      set({
        currentSession: data,
        sessionLogs: logs ?? [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch session',
        isLoading: false
      });
    }
  },

  subscribeToSession: (sessionId: string) => {
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          set({ currentSession: payload.new as Session });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_logs',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          set((state) => ({
            sessionLogs: [...state.sessionLogs, payload.new as SessionLog],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  reset: () => {
    set({
      currentSession: null,
      sessionLogs: [],
      isLoading: false,
      error: null,
      billingActive: false,
      minutesElapsed: 0,
      lastHeartbeat: null,
      isConnected: false,
      connectionQuality: 'disconnected',
    });
  },
}));

// Selector hooks
export const useCurrentSession = () => useSessionStore((state) => state.currentSession);
export const useBillingActive = () => useSessionStore((state) => state.billingActive);
export const useMinutesElapsed = () => useSessionStore((state) => state.minutesElapsed);
export const useConnectionQuality = () => useSessionStore((state) => state.connectionQuality);
