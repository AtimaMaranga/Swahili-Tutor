'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Avatar, Badge } from '@/components/ui';
import { formatCurrency, formatDuration } from '@/lib/utils';
import {
  Users,
  Video,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { profile } = useAuthStore();

  const stats = {
    totalUsers: 1234,
    totalTutors: 45,
    pendingApprovals: 3,
    activeSessions: 12,
    totalRevenue: 5000000, // cents
    escrowBalance: 250000,
    todayRevenue: 45000,
    commissionRate: 15,
  };

  const activeSessions = [
    {
      id: '1',
      studentName: 'John Smith',
      tutorName: 'Grace Wanjiku',
      duration: 23,
      revenue: 1035,
      status: 'active',
    },
    {
      id: '2',
      studentName: 'Maria Garcia',
      tutorName: 'Joseph Mwamba',
      duration: 15,
      revenue: 600,
      status: 'active',
    },
    {
      id: '3',
      studentName: 'Alex Johnson',
      tutorName: 'Amina Hassan',
      duration: 8,
      revenue: 440,
      status: 'active',
    },
  ];

  const pendingApprovals = [
    {
      id: '1',
      name: 'Peter Omondi',
      email: 'peter@email.com',
      country: 'Kenya',
      submittedAt: '2024-12-05',
    },
    {
      id: '2',
      name: 'Sarah Mkwawa',
      email: 'sarah@email.com',
      country: 'Tanzania',
      submittedAt: '2024-12-06',
    },
  ];

  const recentDisputes = [
    {
      id: '1',
      studentName: 'Mike Brown',
      tutorName: 'Grace Wanjiku',
      reason: 'Connection issues',
      amount: 1500,
      status: 'pending',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-savanna-earth-800">
              Admin Dashboard
            </h1>
            <p className="text-savanna-earth-600 mt-1">
              Platform overview and controls
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin/live">
              <Button variant="secondary" leftIcon={<Activity className="w-4 h-4" />}>
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                {stats.activeSessions} Live
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <Card variant="elevated" className="bg-gradient-to-br from-savanna-gold-500 to-savanna-gold-600 text-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <p className="text-white/80 text-sm mt-1">
                    +{formatCurrency(stats.todayRevenue)} today
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escrow Balance */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Escrow Balance</p>
                  <p className="text-2xl font-bold text-savanna-earth-800 mt-1">
                    {formatCurrency(stats.escrowBalance)}
                  </p>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    Held funds
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-savanna-teal-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-savanna-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-savanna-earth-800 mt-1">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    {stats.totalTutors} tutors
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Pending Approvals</p>
                  <p className="text-2xl font-bold text-savanna-earth-800 mt-1">
                    {stats.pendingApprovals}
                  </p>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    Tutor applications
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live Sessions */}
          <Card variant="bordered" className="border-green-200">
            <CardHeader className="flex-row items-center justify-between bg-green-50 -m-6 mb-4 p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <CardTitle className="text-green-800">Live Sessions</CardTitle>
              </div>
              <Link href="/dashboard/admin/live">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-savanna-cream-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={session.studentName} size="sm" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <Video className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-savanna-earth-800 text-sm">
                        {session.studentName} ↔ {session.tutorName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-savanna-earth-500">
                        <Clock className="w-3 h-3" />
                        <span>{session.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 text-sm">
                      {formatCurrency(session.revenue)}
                    </p>
                    <Badge variant="success" size="sm">
                      Live
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Tutor Approvals */}
          <Card variant="bordered">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-savanna-gold-600" />
                Pending Approvals
              </CardTitle>
              <Link href="/dashboard/admin/tutors">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-100"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={tutor.name} size="md" />
                    <div>
                      <p className="font-medium text-savanna-earth-800">
                        {tutor.name}
                      </p>
                      <p className="text-sm text-savanna-earth-500">
                        {tutor.country} • Applied {tutor.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Disputes */}
        {recentDisputes.length > 0 && (
          <Card variant="bordered" className="border-red-200">
            <CardHeader className="flex-row items-center justify-between bg-red-50 -m-6 mb-4 p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-red-800">Open Disputes</CardTitle>
              </div>
              <Link href="/dashboard/admin/disputes">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-red-50"
                >
                  <div>
                    <p className="font-medium text-savanna-earth-800">
                      {dispute.studentName} vs {dispute.tutorName}
                    </p>
                    <p className="text-sm text-savanna-earth-600 mt-1">
                      Reason: {dispute.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      {formatCurrency(dispute.amount)}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Platform Settings */}
        <Card variant="bordered" className="bg-savanna-cream-50">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-savanna-gold-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-savanna-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-savanna-earth-800">
                    Platform Commission: {stats.commissionRate}%
                  </h3>
                  <p className="text-savanna-earth-600 text-sm">
                    Applied to all session transactions
                  </p>
                </div>
              </div>
              <Link href="/dashboard/admin/settings">
                <Button variant="outline">
                  Configure
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
