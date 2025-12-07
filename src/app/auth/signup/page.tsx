'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { BookOpen, Mail, Lock, User, AlertCircle, GraduationCap, Users } from 'lucide-react';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await signUpWithEmail(email, password, fullName, role);
      router.push(role === 'tutor' ? '/dashboard/tutor/onboarding' : '/dashboard/student');
    } catch {
      // Error is handled by the store
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    try {
      await signInWithGoogle();
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-savanna-cream-100 via-white to-savanna-gold-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-savanna-gold-500 to-savanna-teal-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-savanna-earth-800">
              Learn Swahili
            </span>
          </Link>
        </div>

        <Card variant="elevated" padding="lg">
          <CardContent>
            <div className="text-center mb-6">
              <h1 className="font-serif text-2xl font-bold text-savanna-earth-800 mb-2">
                Create Your Account
              </h1>
              <p className="text-savanna-earth-600">
                Join our community of Swahili learners
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-savanna-earth-700 mb-3">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-left',
                    role === 'student'
                      ? 'border-savanna-gold-500 bg-savanna-gold-50'
                      : 'border-savanna-cream-300 hover:border-savanna-gold-300'
                  )}
                >
                  <GraduationCap
                    className={cn(
                      'w-8 h-8 mb-2',
                      role === 'student' ? 'text-savanna-gold-600' : 'text-savanna-earth-400'
                    )}
                  />
                  <p className="font-semibold text-savanna-earth-800">Learn Swahili</p>
                  <p className="text-sm text-savanna-earth-500">
                    Connect with native tutors
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('tutor')}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-left',
                    role === 'tutor'
                      ? 'border-savanna-teal-500 bg-savanna-teal-50'
                      : 'border-savanna-cream-300 hover:border-savanna-teal-300'
                  )}
                >
                  <Users
                    className={cn(
                      'w-8 h-8 mb-2',
                      role === 'tutor' ? 'text-savanna-teal-600' : 'text-savanna-earth-400'
                    )}
                  />
                  <p className="font-semibold text-savanna-earth-800">Teach Swahili</p>
                  <p className="text-sm text-savanna-earth-500">
                    Share your language skills
                  </p>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                leftAddon={<User className="w-5 h-5" />}
                required
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                leftAddon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                helperText="At least 8 characters with a mix of letters and numbers"
                leftAddon={<Lock className="w-5 h-5" />}
                required
              />

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-savanna-cream-400 text-savanna-gold-500 focus:ring-savanna-gold-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-savanna-earth-600">
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-savanna-gold-600 hover:text-savanna-gold-700"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-savanna-gold-600 hover:text-savanna-gold-700"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                variant={role === 'tutor' ? 'secondary' : 'primary'}
              >
                {role === 'tutor' ? 'Apply as Tutor' : 'Create Account'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-savanna-cream-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-savanna-earth-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-sm text-savanna-earth-600">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-savanna-gold-600 hover:text-savanna-gold-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
