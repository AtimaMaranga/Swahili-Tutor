import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Wallet, WalletWarning, Transaction } from '@/types';

interface WalletState {
  wallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
  warning: WalletWarning | null;
  recentTransactions: Transaction[];

  // Actions
  fetchWallet: (userId: string) => Promise<void>;
  updateBalance: (newBalanceCents: number) => void;
  setWarning: (warning: WalletWarning | null) => void;
  subscribeToWalletChanges: (userId: string) => () => void;
  addTransaction: (transaction: Transaction) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,
  isLoading: false,
  error: null,
  warning: null,
  recentTransactions: [],

  fetchWallet: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      set({ wallet: data, isLoading: false });

      // Fetch recent transactions
      const { data: transactions } = await supabase
        .from('transactions_ledger')
        .select('*')
        .eq('wallet_id', data.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactions) {
        set({ recentTransactions: transactions });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch wallet',
        isLoading: false
      });
    }
  },

  updateBalance: (newBalanceCents: number) => {
    const { wallet } = get();
    if (wallet) {
      set({
        wallet: { ...wallet, balance_cents: newBalanceCents, updated_at: new Date().toISOString() }
      });
    }
  },

  setWarning: (warning: WalletWarning | null) => {
    set({ warning });
  },

  subscribeToWalletChanges: (userId: string) => {
    const channel = supabase
      .channel(`wallet:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          set({ wallet: payload.new as Wallet });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions_ledger',
        },
        (payload) => {
          const transaction = payload.new as Transaction;
          const { wallet, recentTransactions } = get();
          if (wallet && transaction.wallet_id === wallet.id) {
            set({
              recentTransactions: [transaction, ...recentTransactions.slice(0, 9)]
            });
          }
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  },

  addTransaction: (transaction: Transaction) => {
    const { recentTransactions } = get();
    set({
      recentTransactions: [transaction, ...recentTransactions.slice(0, 9)]
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks for optimized re-renders
export const useWalletBalance = () => useWalletStore((state) => state.wallet?.balance_cents ?? 0);
export const useWalletWarning = () => useWalletStore((state) => state.warning);
export const useWalletCurrency = () => useWalletStore((state) => state.wallet?.currency ?? 'USD');
