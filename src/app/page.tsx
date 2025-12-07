'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Card, CardContent, Avatar, Badge } from '@/components/ui';
import {
  Video,
  Wallet,
  Clock,
  Globe,
  Star,
  Users,
  Zap,
  ChevronRight,
  Play,
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Wallet className="w-6 h-6 text-savanna-gold-600" />,
      title: 'Pay-Per-Minute',
      description:
        'Load credits and only pay for the minutes you actually learn. No wasted hour blocks.',
    },
    {
      icon: <Video className="w-6 h-6 text-savanna-teal-600" />,
      title: 'Live Video Lessons',
      description:
        'Browser-based video calls with integrated whiteboard and Swahili grammar tools.',
    },
    {
      icon: <Globe className="w-6 h-6 text-savanna-gold-600" />,
      title: 'Native Speakers',
      description:
        'All tutors are verified native East African speakers of Kiswahili Sanifu.',
    },
    {
      icon: <Clock className="w-6 h-6 text-savanna-teal-600" />,
      title: 'Instant Scheduling',
      description:
        'Book lessons in your timezone. Connect immediately with online tutors.',
    },
  ];

  const tutors = [
    {
      name: 'Grace Wanjiku',
      avatar: null,
      country: 'Kenya',
      accent: 'Kenyan',
      rating: 4.9,
      sessions: 234,
      pricePerMin: 0.45,
      isOnline: true,
    },
    {
      name: 'Joseph Mwamba',
      avatar: null,
      country: 'Tanzania',
      accent: 'Tanzanian',
      rating: 4.8,
      sessions: 189,
      pricePerMin: 0.40,
      isOnline: true,
    },
    {
      name: 'Amina Hassan',
      avatar: null,
      country: 'Kenya',
      accent: 'Standard',
      rating: 5.0,
      sessions: 312,
      pricePerMin: 0.55,
      isOnline: false,
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Account',
      description: 'Sign up free with email or Google. No credit card required.',
    },
    {
      step: '02',
      title: 'Load Your Wallet',
      description: 'Add funds in USD, GBP, or EUR. Your credits never expire.',
    },
    {
      step: '03',
      title: 'Find Your Tutor',
      description: 'Browse tutors by accent, price, availability, and reviews.',
    },
    {
      step: '04',
      title: 'Start Learning',
      description: 'Join video lessons. Pay only for the minutes you use.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-savanna-cream-100 via-white to-savanna-gold-50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-savanna-gold-100 rounded-full">
                  <Zap className="w-4 h-4 text-savanna-gold-600" />
                  <span className="text-sm font-medium text-savanna-gold-700">
                    Pay only for minutes you learn
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-savanna-earth-800 leading-tight">
                  Master{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-savanna-gold-500 to-savanna-teal-500">
                    Swahili
                  </span>
                  <br />
                  with Native Tutors
                </h1>

                <p className="text-lg text-savanna-earth-600 max-w-lg">
                  Connect with verified East African tutors for personalized
                  Kiswahili Sanifu lessons. Our metered billing means you pay by
                  the minute—no wasted credits.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/auth/signup">
                    <Button size="lg" rightIcon={<ChevronRight className="w-5 h-5" />}>
                      Start Learning Free
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button variant="outline" size="lg" leftIcon={<Play className="w-5 h-5" />}>
                      Watch Demo
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-savanna-gold-400 to-savanna-teal-500 border-2 border-white flex items-center justify-center text-white text-sm font-medium"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-savanna-gold-500 text-savanna-gold-500"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-savanna-earth-600">
                      <strong>500+</strong> students learning daily
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6">
                  <div className="aspect-video bg-savanna-earth-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-savanna-gold-500/20 to-savanna-teal-500/20" />
                    <div className="text-center z-10">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <p className="text-white font-medium">Live Lesson Preview</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name="Grace W" size="md" isOnline />
                      <div>
                        <p className="font-medium text-savanna-earth-800">
                          Grace Wanjiku
                        </p>
                        <p className="text-sm text-savanna-earth-500">
                          Nairobi, Kenya
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Live Now</Badge>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-savanna-gold-200 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-savanna-teal-200 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-savanna-earth-800 mb-4">
                Why Choose Learn Swahili?
              </h2>
              <p className="text-lg text-savanna-earth-600">
                We&apos;ve built the most flexible and effective way to learn
                Kiswahili online.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} variant="bordered" className="text-center">
                  <CardContent className="pt-2">
                    <div className="w-14 h-14 rounded-xl bg-savanna-cream-100 flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-savanna-earth-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-savanna-earth-600 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-savanna-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-savanna-earth-800 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-savanna-earth-600">
                Start learning Swahili in four simple steps.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-6xl font-serif font-bold text-savanna-gold-200 mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-savanna-earth-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-savanna-earth-600">{item.description}</p>
                  {index < howItWorks.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-savanna-gold-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tutors */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-savanna-earth-800 mb-2">
                  Meet Our Tutors
                </h2>
                <p className="text-lg text-savanna-earth-600">
                  Verified native speakers ready to help you learn.
                </p>
              </div>
              <Link href="/tutors">
                <Button variant="outline" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  View All Tutors
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.map((tutor, index) => (
                <Card key={index} variant="elevated" className="hover:scale-[1.02] transition-transform">
                  <CardContent>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={tutor.name}
                          size="lg"
                          isOnline={tutor.isOnline}
                        />
                        <div>
                          <h3 className="font-semibold text-savanna-earth-800">
                            {tutor.name}
                          </h3>
                          <p className="text-sm text-savanna-earth-500">
                            {tutor.country}
                          </p>
                        </div>
                      </div>
                      {tutor.isOnline && (
                        <Badge variant="success" size="sm">
                          Online
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" size="sm">
                        {tutor.accent}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-savanna-gold-500 text-savanna-gold-500" />
                        <span className="font-medium text-savanna-earth-700">
                          {tutor.rating}
                        </span>
                      </div>
                      <span className="text-sm text-savanna-earth-500">
                        {tutor.sessions} sessions
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-savanna-cream-200">
                      <div>
                        <span className="text-2xl font-bold text-savanna-earth-800">
                          ${tutor.pricePerMin.toFixed(2)}
                        </span>
                        <span className="text-savanna-earth-500">/min</span>
                      </div>
                      <Button variant="secondary" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-savanna-gold-500 to-savanna-teal-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Swahili Journey?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of students learning Kiswahili with native tutors.
              Create your free account and get started today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-savanna-gold-600 hover:bg-savanna-cream-100"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link href="/tutors">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Tutors
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8">
              {[
                'No subscription required',
                'Credits never expire',
                '100% secure payments',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
