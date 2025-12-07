'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VideoRoom } from '@/components/classroom/VideoRoom';
import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/sessionStore';
import { Button, Card, CardContent } from '@/components/ui';
import { Loader2, AlertCircle, Video } from 'lucide-react';

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const { profile, user, isInitialized } = useAuthStore();
  const { currentSession, fetchSession, isLoading, error } = useSessionStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (sessionId && isInitialized) {
      fetchSession(sessionId);
    }
  }, [sessionId, isInitialized, fetchSession]);

  const handleEndSession = () => {
    router.push(profile?.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/student');
  };

  // Loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-savanna-earth-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-savanna-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading classroom...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentSession) {
    return (
      <div className="min-h-screen bg-savanna-cream-100 flex items-center justify-center p-4">
        <Card variant="elevated" className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-serif text-xl font-bold text-savanna-earth-800 mb-2">
              Session Not Found
            </h2>
            <p className="text-savanna-earth-600 mb-6">
              {error || 'This session may have ended or does not exist.'}
            </p>
            <Button onClick={() => router.push('/dashboard/student')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-join screen
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-savanna-earth-800 to-savanna-earth-900 flex items-center justify-center p-4">
        <Card variant="elevated" className="max-w-lg w-full">
          <CardContent className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-savanna-gold-100 flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-savanna-gold-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-savanna-earth-800 mb-2">
              Ready to Join?
            </h2>
            <p className="text-savanna-earth-600 mb-6">
              You&apos;re about to join a Swahili lesson. Make sure your camera and
              microphone are ready.
            </p>

            <div className="bg-savanna-cream-100 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-savanna-earth-800 mb-2">Session Details</h3>
              <div className="space-y-2 text-sm">
                <p className="text-savanna-earth-600">
                  <strong>Room:</strong> {currentSession.room_name}
                </p>
                <p className="text-savanna-earth-600">
                  <strong>Rate:</strong> ${(currentSession.price_per_minute_snapshot / 100).toFixed(2)}/minute
                </p>
                <p className="text-savanna-earth-600">
                  <strong>Status:</strong>{' '}
                  <span className="capitalize">{currentSession.status}</span>
                </p>
              </div>
            </div>

            <div className="bg-savanna-gold-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-savanna-gold-800">
                <strong>💡 Reminder:</strong> You will be charged per minute during this
                session. Make sure you have sufficient balance in your wallet.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={() => setIsReady(true)} leftIcon={<Video className="w-4 h-4" />}>
                Join Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Video room
  return (
    <VideoRoom
      sessionId={currentSession.id}
      roomName={currentSession.room_name}
      pricePerMinuteCents={currentSession.price_per_minute_snapshot}
      studentWalletId={currentSession.student_id} // In production, this would be the wallet ID
      tutorName="Mwalimu" // Would come from session data
      studentName={profile?.full_name || 'Student'}
      isStudent={profile?.role === 'student'}
      onEndSession={handleEndSession}
    />
  );
}
