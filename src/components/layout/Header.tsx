'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useWalletStore } from '@/stores/walletStore';
import { Button, Avatar, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
  Menu,
  X,
  Wallet,
  User,
  LogOut,
  Settings,
  BookOpen,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, profile, signOut } = useAuthStore();
  const { wallet } = useWalletStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!profile) return '/dashboard';
    switch (profile.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'tutor':
        return '/dashboard/tutor';
      default:
        return '/dashboard/student';
    }
  };

  return (
    <header className="bg-white border-b border-savanna-cream-200 sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-savanna-gold-500 to-savanna-teal-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-savanna-earth-800">
                Learn Swahili
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/tutors"
              className="text-savanna-earth-600 hover:text-savanna-gold-600 font-medium transition-colors"
            >
              Find Tutors
            </Link>
            <Link
              href="/how-it-works"
              className="text-savanna-earth-600 hover:text-savanna-gold-600 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-savanna-earth-600 hover:text-savanna-gold-600 font-medium transition-colors"
            >
              Pricing
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {/* Wallet Balance (Students only) */}
                {profile?.role === 'student' && wallet && (
                  <Link
                    href="/dashboard/student/wallet"
                    className="flex items-center gap-2 px-3 py-1.5 bg-savanna-cream-100 rounded-lg hover:bg-savanna-cream-200 transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-savanna-gold-600" />
                    <span className="font-medium text-savanna-earth-700">
                      {formatCurrency(wallet.balance_cents, wallet.currency)}
                    </span>
                  </Link>
                )}

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <Avatar
                      src={profile?.avatar_url}
                      name={profile?.full_name || 'User'}
                      size="sm"
                      isOnline={profile?.role === 'tutor' ? profile?.is_online : undefined}
                    />
                  </button>

                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-savanna-cream-200 z-20 py-2">
                        <div className="px-4 py-2 border-b border-savanna-cream-200">
                          <p className="font-medium text-savanna-earth-800">
                            {profile?.full_name}
                          </p>
                          <p className="text-sm text-savanna-earth-500">
                            {profile?.email}
                          </p>
                          <Badge
                            variant={
                              profile?.role === 'admin'
                                ? 'danger'
                                : profile?.role === 'tutor'
                                ? 'info'
                                : 'default'
                            }
                            size="sm"
                            className="mt-1"
                          >
                            {profile?.role}
                          </Badge>
                        </div>

                        <Link
                          href={getDashboardLink()}
                          className="flex items-center gap-3 px-4 py-2 text-savanna-earth-700 hover:bg-savanna-cream-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-savanna-earth-700 hover:bg-savanna-cream-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>

                        <hr className="my-2 border-savanna-cream-200" />

                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            signOut();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-savanna-earth-600"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-savanna-cream-200">
            <div className="flex flex-col gap-2">
              <Link
                href="/tutors"
                className="px-4 py-2 text-savanna-earth-600 hover:bg-savanna-cream-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Tutors
              </Link>
              <Link
                href="/how-it-works"
                className="px-4 py-2 text-savanna-earth-600 hover:bg-savanna-cream-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-savanna-earth-600 hover:bg-savanna-cream-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              {user ? (
                <>
                  <hr className="my-2 border-savanna-cream-200" />
                  <Link
                    href={getDashboardLink()}
                    className="px-4 py-2 text-savanna-earth-600 hover:bg-savanna-cream-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2 border-savanna-cream-200" />
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
