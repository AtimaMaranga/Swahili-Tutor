'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { useWalletStore } from '@/stores/walletStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Avatar, Badge } from '@/components/ui';
import { formatCurrency, formatDuration, calculateRemainingMinutes } from '@/lib/utils';
import {
  Wallet,
  Video,
  Calendar,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Plus,
  Users,
} from 'lucide-react';

export default function StudentDashboard() {
  const { profile, user } = useAuthStore();
  const { wallet, fetchWallet, subscribeToWalletChanges } = useWalletStore();

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id);
      const unsubscribe = subscribeToWalletChanges(user.id);
      return unsubscribe;
    }
  }, [user?.id, fetchWallet, subscribeToWalletChanges]);

  const recentSessions = [
    {
      id: '1',
      tutorName: 'Grace Wanjiku',
      date: '2024-12-05',
      duration: 45,
      cost: 2025,
      rating: 5,
    },
    {
      id: '2',
      tutorName: 'Joseph Mwamba',
      date: '2024-12-03',
      duration: 30,
      cost: 1200,
      rating: 4,
    },
  ];

  const upcomingSessions = [
    {
      id: '1',
      tutorName: 'Amina Hassan',
      scheduledAt: '2024-12-08T14:00:00Z',
      pricePerMinute: 55,
    },
  ];

  const recommendedTutors = [
    {
      id: '1',
      name: 'Grace Wanjiku',
      accent: 'Kenyan',
      rating: 4.9,
      pricePerMin: 45,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Joseph Mwamba',
      accent: 'Tanzanian',
      rating: 4.8,
      pricePerMin: 40,
      isOnline: true,
    },
    {
      id: '3',
      name: 'Fatima Omar',
      accent: 'Standard',
      rating: 5.0,
      pricePerMin: 60,
      isOnline: false,
    },
  ];

  const avgPricePerMinute = 50; // cents

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-savanna-earth-800">
              Habari, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-savanna-earth-600 mt-1">
              Ready for your next Swahili lesson?
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/student/tutors">
              <Button variant="outline" leftIcon={<Users className="w-4 h-4" />}>
                Find Tutor
              </Button>
            </Link>
            <Link href="/dashboard/student/wallet">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                Add Funds
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wallet Balance */}
          <Card variant="elevated" className="bg-gradient-to-br from-savanna-gold-500 to-savanna-gold-600 text-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Wallet Balance</p>
                  <p className="text-2xl font-bold mt-1">
                    {wallet ? formatCurrency(wallet.balance_cents, wallet.currency) : '$0.00'}
                  </p>
                  <p className="text-white/80 text-sm mt-1">
                    ≈ {wallet ? calculateRemainingMinutes(wallet.balance_cents, avgPricePerMinute) : 0} min of lessons
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
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
                  <p className="text-2xl font-bold text-savanna-earth-800 mt-1">12</p>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    {formatDuration(540)} total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-savanna-teal-100 flex items-center justify-center">
                  <Video className="w-6 h-6 text-savanna-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Streak */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Learning Streak</p>
                  <p className="text-2xl font-bold text-savanna-earth-800 mt-1">7 days 🔥</p>
                  <p className="text-savanna-earth-500 text-sm mt-1">
                    Keep it up!
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Session */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-savanna-earth-500 text-sm">Next Session</p>
                  {upcomingSessions.length > 0 ? (
                    <>
                      <p className="text-lg font-bold text-savanna-earth-800 mt-1">
                        Dec 8, 2:00 PM
                      </p>
                      <p className="text-savanna-earth-500 text-sm mt-1">
                        with {upcomingSessions[0].tutorName}
                      </p>
                    </>
                  ) : (
                    <p className="text-savanna-earth-600 mt-1">No sessions scheduled</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-full bg-savanna-cream-200 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-savanna-earth-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recommended Tutors */}
          <Card variant="bordered">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Online Tutors</CardTitle>
              <Link href="/dashboard/student/tutors">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-savanna-cream-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={tutor.name} size="md" isOnline={tutor.isOnline} />
                    <div>
                      <p className="font-medium text-savanna-earth-800">{tutor.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" size="sm">
                          {tutor.accent}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-savanna-gold-500 text-savanna-gold-500" />
                          <span className="text-savanna-earth-600">{tutor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-savanna-earth-800">
                      ${(tutor.pricePerMin / 100).toFixed(2)}
                      <span className="text-sm font-normal text-savanna-earth-500">/min</span>
                    </p>
                    <Button variant="secondary" size="sm" className="mt-1">
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card variant="bordered">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent Sessions</CardTitle>
              <Link href="/dashboard/student/sessions">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-savanna-cream-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-savanna-teal-100 flex items-center justify-center">
                        <Video className="w-5 h-5 text-savanna-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-savanna-earth-800">
                          {session.tutorName}
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
                      <p className="font-medium text-savanna-earth-800">
                        {formatCurrency(session.cost)}
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
                ))
              ) : (
                <div className="text-center py-8 text-savanna-earth-500">
                  <Video className="w-12 h-12 mx-auto mb-3 text-savanna-cream-400" />
                  <p>No sessions yet</p>
                  <Link href="/dashboard/student/tutors">
                    <Button variant="outline" size="sm" className="mt-3">
                      Book Your First Lesson
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card variant="bordered" className="bg-savanna-teal-50 border-savanna-teal-200">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-savanna-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-savanna-earth-800">
                  Swahili Tip of the Day
                </h3>
                <p className="text-savanna-earth-600 mt-1">
                  <strong>&quot;Habari&quot;</strong> is a versatile greeting! Combine it with time
                  words: <em>Habari za asubuhi</em> (Good morning), <em>Habari za mchana</em>
                  (Good afternoon), <em>Habari za jioni</em> (Good evening).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
