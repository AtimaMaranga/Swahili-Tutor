'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useWalletStore } from '@/stores/walletStore';
import { Avatar, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  Settings,
  Video,
  FileText,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  Clock,
  Star,
  CreditCard,
  Bell,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuthStore();
  const { wallet } = useWalletStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        label: 'Dashboard',
        href: `/dashboard/${profile?.role}`,
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
    ];

    if (profile?.role === 'student') {
      return [
        ...baseItems,
        {
          label: 'Find Tutors',
          href: '/dashboard/student/tutors',
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: 'My Sessions',
          href: '/dashboard/student/sessions',
          icon: <Video className="w-5 h-5" />,
        },
        {
          label: 'Schedule',
          href: '/dashboard/student/schedule',
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: 'Wallet',
          href: '/dashboard/student/wallet',
          icon: <Wallet className="w-5 h-5" />,
        },
        {
          label: 'Resources',
          href: '/dashboard/student/resources',
          icon: <FileText className="w-5 h-5" />,
        },
      ];
    }

    if (profile?.role === 'tutor') {
      return [
        ...baseItems,
        {
          label: 'My Sessions',
          href: '/dashboard/tutor/sessions',
          icon: <Video className="w-5 h-5" />,
        },
        {
          label: 'Availability',
          href: '/dashboard/tutor/availability',
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: 'Earnings',
          href: '/dashboard/tutor/earnings',
          icon: <CreditCard className="w-5 h-5" />,
        },
        {
          label: 'Reviews',
          href: '/dashboard/tutor/reviews',
          icon: <Star className="w-5 h-5" />,
        },
        {
          label: 'Resources',
          href: '/dashboard/tutor/resources',
          icon: <FileText className="w-5 h-5" />,
        },
      ];
    }

    if (profile?.role === 'admin') {
      return [
        ...baseItems,
        {
          label: 'Live Sessions',
          href: '/dashboard/admin/live',
          icon: <Video className="w-5 h-5" />,
          badge: 'Live',
        },
        {
          label: 'Users',
          href: '/dashboard/admin/users',
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: 'Tutors',
          href: '/dashboard/admin/tutors',
          icon: <Shield className="w-5 h-5" />,
        },
        {
          label: 'Finances',
          href: '/dashboard/admin/finances',
          icon: <BarChart3 className="w-5 h-5" />,
        },
        {
          label: 'Disputes',
          href: '/dashboard/admin/disputes',
          icon: <Clock className="w-5 h-5" />,
        },
        {
          label: 'Resources',
          href: '/dashboard/admin/resources',
          icon: <FileText className="w-5 h-5" />,
        },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-savanna-cream-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-savanna-cream-200 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-savanna-cream-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-savanna-gold-500 to-savanna-teal-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-lg font-bold text-savanna-earth-800">
                Learn Swahili
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-savanna-earth-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-savanna-cream-200">
            <div className="flex items-center gap-3">
              <Avatar
                src={profile?.avatar_url}
                name={profile?.full_name || 'User'}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-savanna-earth-800 truncate">
                  {profile?.full_name}
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
                >
                  {profile?.role}
                </Badge>
              </div>
            </div>

            {/* Wallet Balance (Students) */}
            {profile?.role === 'student' && wallet && (
              <Link
                href="/dashboard/student/wallet"
                className="mt-4 flex items-center justify-between p-3 bg-savanna-cream-100 rounded-lg hover:bg-savanna-cream-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-savanna-gold-600" />
                  <span className="text-sm text-savanna-earth-600">Balance</span>
                </div>
                <span className="font-semibold text-savanna-earth-800">
                  {formatCurrency(wallet.balance_cents, wallet.currency)}
                </span>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors',
                    isActive
                      ? 'bg-savanna-gold-100 text-savanna-gold-700'
                      : 'text-savanna-earth-600 hover:bg-savanna-cream-100'
                  )}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="danger" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-savanna-cream-200 space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-savanna-earth-600 hover:bg-savanna-cream-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-savanna-cream-200">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-savanna-earth-600"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-4">
              <button className="p-2 text-savanna-earth-600 hover:bg-savanna-cream-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
