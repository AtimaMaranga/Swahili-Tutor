'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Avatar, Badge } from '@/components/ui';
import { formatCurrency, formatDuration } from '@/lib/utils';
import {
  TrendingUp,
  Video,
  Calendar,
  Star,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function TutorDashboard() {
  const { profile } = useAuthStore();

  const stats = {
    totalEarnings: 125000, // cents
    thisMonthEarnings: 35000,
    totalSessions: 234,
    thisMonthSessions: 28,
    averageRating: 4.9,
    totalReviews: 89,
    pendingPayout: 15000,
  };

  const upcomingSessions = [
    {
      id: '1',
      studentName: 'John Smith',
      scheduledAt: '2024-12-08T14:00:00Z',
      duration: 30,
    },
    {
      id: '2',
      studentName: 'Maria Garcia',
      scheduledAt: '2024-12-08T15:30:00Z',
      duration: 45,
    },
  ];

  const recentSessions = [
    {
      id: '1',
      studentName: 'Alex Johnson',
      date: '2024-12-05',
      duration: 45,
      earnings: 2025,
      rating: 5,
    },
    {
      id: '2',
      studentName: 'Sarah Wilson',
      date: '2024-12-04',
      duration: 30,
      earnings: 1350,
      rating: 5,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-savanna-earth-800">
              Jambo, {profile?.full_name?.split(' ')[0] || 'Mwalimu'}! 👋
            </h1>
            <p className="text-savanna-earth-600 mt-1">
              Here&apos;s your teaching overview
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/tutor/availability">
              <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
                Set Availability
              </Button>
            </Link>
            {profile?.is_online ? (
              <Button variant="secondary" leftIcon={<Video className="w-4 h-4" />}>
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                Online
              </Button>
            ) : (
              <Button variant="primary" leftIcon={<Video className="w-4 h-4" />}>
                Go Online
              </Button>
            )}
          </div>
        </div>

        {/* Approval Status Banner */}
        {!profile?.is_approved && (
          <Card variant="bordered" className="bg-yellow-50 border-yellow-200">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800">
                    Profile Under Review
                  </h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Your tutor application is being reviewed. You&apos;ll be notified once approved.
                  </p>
                </div>
                <Link href="/dashboard/tutor/profile">
                  <Button variant="outline" size="sm">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* This Month Earnings */}
          <Card variant="elevated" className="bg-gradient-to-br from-savanna-gold-500 to-savanna-gold-600 text-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">This Month</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(stats.thisMonthEarnings)}
                  </p>
                  <p className="text-white/80 text-sm mt-1">
                    {stats.thisMonthSessions} sessions
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Earnings */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-savanna-earth-800 mt-1">
                    {formatCurrency(stats.totalEarnings)}
                  </p>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    All time
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Average Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-savanna-earth-800">
                      {stats.averageRating}
                    </p>
                    <Star className="w-5 h-5 fill-savanna-gold-500 text-savanna-gold-500" />
                  </div>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    {stats.totalReviews} reviews
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-savanna-gold-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-savanna-gold-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Sessions */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Total Sessions</p>
                  <p className="text-2xl font-bold text-savanna-earth-800 mt-1">
                    {stats.totalSessions}
                  </p>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    Completed
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-savanna-teal-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-savanna-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <Card variant="bordered">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Upcoming Sessions</CardTitle>
              <Link href="/dashboard/tutor/sessions">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-savanna-teal-50 border border-savanna-teal-100"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={session.studentName} size="md" />
                      <div>
                        <p className="font-medium text-savanna-earth-800">
                          {session.studentName}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-savanna-earth-500">
                          <Calendar className="w-3 h-3" />
                          <span>Dec 8, 2:00 PM</span>
                          <span>•</span>
                          <span>{session.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" leftIcon={<Video className="w-4 h-4" />}>
                      Join
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-savanna-earth-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-savanna-cream-400" />
                  <p>No upcoming sessions</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card variant="bordered">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent Sessions</CardTitle>
              <Link href="/dashboard/tutor/sessions">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-savanna-cream-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-savanna-earth-800">
                        {session.studentName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-savanna-earth-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(session.duration)}</span>
                        <span>•</span>
                        <span>{session.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      +{formatCurrency(session.earnings)}
                    </p>
                    <div className="flex items-center gap-0.5 justify-end mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < session.rating
                              ? 'fill-savanna-gold-500 text-savanna-gold-500'
                              : 'text-savanna-cream-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pending Payout */}
        {stats.pendingPayout > 0 && (
          <Card variant="bordered" className="bg-green-50 border-green-200">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">
                      Pending Payout: {formatCurrency(stats.pendingPayout)}
                    </h3>
                    <p className="text-green-700 text-sm">
                      Available for withdrawal to your M-Pesa or bank account
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/tutor/earnings">
                  <Button variant="secondary">
                    Withdraw Funds
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
