'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { useWalletStore } from '@/stores/walletStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Modal, ModalFooter } from '@/components/ui';
import { formatCurrency, calculateRemainingMinutes, getRelativeTime } from '@/lib/utils';
import {
  Wallet,
  Plus,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const topUpAmounts = [
  { value: 1000, label: '$10', popular: false },
  { value: 2500, label: '$25', popular: true },
  { value: 5000, label: '$50', popular: false },
  { value: 10000, label: '$100', popular: false },
];

export default function WalletPage() {
  const { user } = useAuthStore();
  const { wallet, recentTransactions, fetchWallet, subscribeToWalletChanges } = useWalletStore();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id);
      const unsubscribe = subscribeToWalletChanges(user.id);
      return unsubscribe;
    }
  }, [user?.id, fetchWallet, subscribeToWalletChanges]);

  const handleTopUp = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowTopUpModal(false);
    // In production, this would redirect to Stripe checkout
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'session_charge':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-savanna-earth-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return 'text-green-600';
      case 'session_charge':
        return 'text-red-600';
      default:
        return 'text-savanna-earth-600';
    }
  };

  const avgPricePerMinute = 50; // cents

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-savanna-earth-800">
              My Wallet
            </h1>
            <p className="text-savanna-earth-600 mt-1">
              Manage your learning credits
            </p>
          </div>
          <Button
            onClick={() => setShowTopUpModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Funds
          </Button>
        </div>

        {/* Balance Card */}
        <Card variant="elevated" className="bg-gradient-to-br from-savanna-gold-500 via-savanna-gold-600 to-savanna-teal-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="relative z-10 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Available Balance</p>
                <p className="text-4xl sm:text-5xl font-bold">
                  {wallet ? formatCurrency(wallet.balance_cents, wallet.currency) : '$0.00'}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/80" />
                    <span className="text-white/80">
                      ≈ {wallet ? calculateRemainingMinutes(wallet.balance_cents, avgPricePerMinute) : 0} minutes of lessons
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                <Wallet className="w-10 h-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Top-Up */}
          <Card variant="bordered" className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-savanna-gold-600" />
                Quick Top-Up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topUpAmounts.map((amount) => (
                <button
                  key={amount.value}
                  onClick={() => {
                    setSelectedAmount(amount.value);
                    setShowTopUpModal(true);
                  }}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all',
                    'hover:border-savanna-gold-400 hover:bg-savanna-gold-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-savanna-earth-800">
                      {amount.label}
                    </span>
                    {amount.popular && (
                      <Badge variant="success" size="sm">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-savanna-earth-500">
                    ≈ {calculateRemainingMinutes(amount.value, avgPricePerMinute)} min
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card variant="bordered" className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Transaction History</CardTitle>
              <Badge variant="outline">{recentTransactions.length} transactions</Badge>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-savanna-cream-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium text-savanna-earth-800">
                            {tx.description}
                          </p>
                          <p className="text-sm text-savanna-earth-500">
                            {getRelativeTime(tx.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn('font-semibold', getTransactionColor(tx.type))}>
                          {tx.amount_cents > 0 ? '+' : ''}
                          {formatCurrency(tx.amount_cents)}
                        </p>
                        <p className="text-sm text-savanna-earth-500">
                          Balance: {formatCurrency(tx.balance_after_cents)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-savanna-earth-500">
                  <Wallet className="w-12 h-12 mx-auto mb-3 text-savanna-cream-400" />
                  <p>No transactions yet</p>
                  <p className="text-sm mt-1">Add funds to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Info */}
        <Card variant="bordered" className="bg-savanna-cream-50">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-savanna-earth-800">
                  Secure Payments by Stripe
                </h3>
                <p className="text-savanna-earth-600 text-sm mt-1">
                  All payments are processed securely through Stripe. We accept Visa,
                  Mastercard, American Express, and more. Your credits never expire.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top-Up Modal */}
      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Add Funds to Wallet"
        description="Choose an amount to add to your learning wallet"
      >
        <div className="space-y-6">
          {/* Amount Selection */}
          <div className="grid grid-cols-2 gap-3">
            {topUpAmounts.map((amount) => (
              <button
                key={amount.value}
                onClick={() => setSelectedAmount(amount.value)}
                className={cn(
                  'p-4 rounded-lg border-2 text-center transition-all',
                  selectedAmount === amount.value
                    ? 'border-savanna-gold-500 bg-savanna-gold-50'
                    : 'border-savanna-cream-300 hover:border-savanna-gold-300'
                )}
              >
                <p className="text-xl font-bold text-savanna-earth-800">
                  {amount.label}
                </p>
                <p className="text-sm text-savanna-earth-500">
                  ≈ {calculateRemainingMinutes(amount.value, avgPricePerMinute)} min
                </p>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <Input
              label="Or enter custom amount"
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) {
                  setSelectedAmount(parseInt(e.target.value) * 100);
                }
              }}
              placeholder="Enter amount in USD"
              leftAddon={<span className="text-savanna-earth-600">$</span>}
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-savanna-cream-100 rounded-lg">
            <div className="flex justify-between text-savanna-earth-600 mb-2">
              <span>Amount</span>
              <span>{formatCurrency(selectedAmount)}</span>
            </div>
            <div className="flex justify-between text-savanna-earth-600 mb-2">
              <span>Processing fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-semibold text-savanna-earth-800 pt-2 border-t border-savanna-cream-300">
              <span>Total</span>
              <span>{formatCurrency(selectedAmount)}</span>
            </div>
          </div>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowTopUpModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleTopUp}
              isLoading={isProcessing}
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              Pay {formatCurrency(selectedAmount)}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
