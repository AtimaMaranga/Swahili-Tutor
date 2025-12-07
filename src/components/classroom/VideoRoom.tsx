'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Badge, Avatar, Card, CardContent } from '@/components/ui';
import { useBillingEngine, useZeroBalanceProtocol } from '@/hooks/useBillingEngine';
import { useWalletStore } from '@/stores/walletStore';
import { formatCurrency, formatDuration, cn, getConnectionColor } from '@/lib/utils';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Settings,
  Maximize,
  BookOpen,
  FileText,
  Send,
  Clock,
  Wallet,
  AlertTriangle,
  Wifi,
  WifiOff,
  Plus,
} from 'lucide-react';

interface VideoRoomProps {
  sessionId: string;
  roomName: string;
  pricePerMinuteCents: number;
  studentWalletId: string;
  tutorName: string;
  studentName: string;
  isStudent: boolean;
  onEndSession: () => void;
}

export function VideoRoom({
  sessionId,
  roomName,
  pricePerMinuteCents,
  studentWalletId,
  tutorName,
  studentName,
  isStudent,
  onEndSession,
}: VideoRoomProps) {
  // Video state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('good');

  // UI state
  const [showChat, setShowChat] = useState(false);
  const [showNounClasses, setShowNounClasses] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showTopUpPrompt, setShowTopUpPrompt] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Wallet state
  const { wallet } = useWalletStore();

  // Billing engine (only for students)
  const billing = useBillingEngine({
    sessionId,
    pricePerMinuteCents,
    studentWalletId,
    onLowBalance: (warning) => {
      if (warning.type === 'critical_balance') {
        setShowTopUpPrompt(true);
      }
    },
    onZeroBalance: () => {
      zeroBalance.startCountdown();
    },
    onCharge: (minutes, amount) => {
      console.log(`Charged ${formatCurrency(amount)} for minute ${minutes}`);
    },
    onError: (error) => {
      console.error('Billing error:', error);
    },
  });

  // Zero balance protocol
  const zeroBalance = useZeroBalanceProtocol(
    (type, seconds) => {
      if (type === 'countdown') {
        console.log(`Session ending in ${seconds} seconds`);
      }
    },
    () => {
      onEndSession();
    }
  );

  // Start billing when component mounts (for students)
  useEffect(() => {
    if (isStudent) {
      billing.start();
    }
    return () => {
      if (isStudent) {
        billing.stop();
      }
    };
  }, [isStudent]);

  // Handle end session
  const handleEndSession = useCallback(async () => {
    if (isStudent) {
      await billing.stop();
    }
    onEndSession();
  }, [isStudent, billing, onEndSession]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const chatMessages = [
    { id: 1, sender: 'tutor', text: 'Karibu! Habari yako?', time: '2:00 PM' },
    { id: 2, sender: 'student', text: 'Nzuri sana, asante!', time: '2:01 PM' },
  ];

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-savanna-earth-900">
      {/* Top Bar */}
      <div className="bg-savanna-earth-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', getConnectionColor(connectionQuality))} />
            <span className="text-white text-sm capitalize">{connectionQuality}</span>
          </div>
          <Badge variant="success" className="bg-green-600">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(billing.minutesElapsed)}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Billing Info (Students only) */}
          {isStudent && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Wallet className="w-4 h-4 text-savanna-gold-400" />
                <span className="font-medium">
                  {wallet ? formatCurrency(wallet.balance_cents) : '$0.00'}
                </span>
                <span className="text-white/60 text-sm">
                  ({billing.remainingMinutes} min left)
                </span>
              </div>
              <div className="text-white/60 text-sm">
                Rate: {formatCurrency(pricePerMinuteCents)}/min
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-savanna-gold-500 text-savanna-gold-400 hover:bg-savanna-gold-500/20"
                onClick={() => setShowTopUpPrompt(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Funds
              </Button>
            </div>
          )}

          {/* Total Charged (Tutors) */}
          {!isStudent && (
            <div className="text-white">
              <span className="text-white/60">Earning: </span>
              <span className="font-semibold text-green-400">
                {formatCurrency(billing.totalCharged)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Remote Video (Large) */}
          <div className="lg:col-span-3 relative bg-black rounded-xl overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1.5 rounded-lg">
              <span className="text-white font-medium">
                {isStudent ? tutorName : studentName}
              </span>
            </div>
            {/* Connection indicator */}
            <div className="absolute top-4 right-4">
              {connectionQuality === 'disconnected' ? (
                <WifiOff className="w-5 h-5 text-red-500" />
              ) : (
                <Wifi className={cn('w-5 h-5',
                  connectionQuality === 'excellent' ? 'text-green-500' :
                  connectionQuality === 'good' ? 'text-yellow-500' : 'text-red-500'
                )} />
              )}
            </div>
          </div>

          {/* Whiteboard / Local Video Area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Local Video (Small) */}
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={cn('w-full h-full object-cover', isVideoOff && 'hidden')}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-savanna-earth-700">
                  <Avatar name={isStudent ? studentName : tutorName} size="xl" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                You
              </div>
            </div>

            {/* Whiteboard Placeholder */}
            <div className="flex-1 bg-white rounded-xl border-2 border-savanna-cream-300 flex items-center justify-center">
              <div className="text-center text-savanna-earth-400">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p>Whiteboard</p>
                <p className="text-sm">Draw and share notes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebars */}
        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-savanna-cream-200 flex flex-col">
            <div className="p-4 border-b border-savanna-cream-200">
              <h3 className="font-semibold text-savanna-earth-800">Chat</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'max-w-[80%] p-3 rounded-lg',
                    msg.sender === 'student'
                      ? 'ml-auto bg-savanna-gold-100 text-savanna-earth-800'
                      : 'bg-savanna-cream-100 text-savanna-earth-800'
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-savanna-earth-400 mt-1">{msg.time}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-savanna-cream-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-savanna-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-savanna-gold-500"
                />
                <Button size="sm" className="px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Noun Classes Sidebar */}
        {showNounClasses && (
          <div className="w-96 bg-white border-l border-savanna-cream-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-savanna-cream-200 bg-savanna-teal-50">
              <h3 className="font-semibold text-savanna-teal-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Swahili Noun Classes
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <table className="noun-class-table w-full">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Singular</th>
                    <th>Plural</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold">M/Wa</td>
                    <td>m-</td>
                    <td>wa-</td>
                    <td>mtu/watu (person/people)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">M/Mi</td>
                    <td>m-</td>
                    <td>mi-</td>
                    <td>mti/miti (tree/trees)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Ki/Vi</td>
                    <td>ki-</td>
                    <td>vi-</td>
                    <td>kiti/viti (chair/chairs)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">N/N</td>
                    <td>n-</td>
                    <td>n-</td>
                    <td>nyumba (house/houses)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Ji/Ma</td>
                    <td>ji-/Ø</td>
                    <td>ma-</td>
                    <td>jicho/macho (eye/eyes)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">U/N</td>
                    <td>u-</td>
                    <td>n-</td>
                    <td>ukuta/kuta (wall/walls)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Ku</td>
                    <td colSpan={2}>ku-</td>
                    <td>kusoma (to read)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Pa/Ku/Mu</td>
                    <td colSpan={2}>Locative</td>
                    <td>mahali (place)</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-savanna-gold-50 rounded-lg">
                <p className="text-sm text-savanna-earth-700">
                  <strong>Tip:</strong> Noun class prefixes also affect adjectives, verbs, and pronouns in Swahili!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-savanna-earth-800 px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Mic */}
          <Button
            variant="ghost"
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              'w-12 h-12 rounded-full',
              isMuted ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-savanna-earth-700 text-white hover:bg-savanna-earth-600'
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* Video */}
          <Button
            variant="ghost"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={cn(
              'w-12 h-12 rounded-full',
              isVideoOff ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-savanna-earth-700 text-white hover:bg-savanna-earth-600'
            )}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>

          {/* Chat */}
          <Button
            variant="ghost"
            onClick={() => setShowChat(!showChat)}
            className={cn(
              'w-12 h-12 rounded-full',
              showChat ? 'bg-savanna-gold-600 text-white' : 'bg-savanna-earth-700 text-white hover:bg-savanna-earth-600'
            )}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          {/* Noun Classes */}
          <Button
            variant="ghost"
            onClick={() => setShowNounClasses(!showNounClasses)}
            className={cn(
              'w-12 h-12 rounded-full',
              showNounClasses ? 'bg-savanna-teal-600 text-white' : 'bg-savanna-earth-700 text-white hover:bg-savanna-earth-600'
            )}
          >
            <BookOpen className="w-5 h-5" />
          </Button>

          {/* Resources */}
          <Button
            variant="ghost"
            onClick={() => setShowResources(!showResources)}
            className={cn(
              'w-12 h-12 rounded-full',
              showResources ? 'bg-savanna-gold-600 text-white' : 'bg-savanna-earth-700 text-white hover:bg-savanna-earth-600'
            )}
          >
            <FileText className="w-5 h-5" />
          </Button>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-full bg-savanna-earth-700 text-white hover:bg-savanna-earth-600"
          >
            <Maximize className="w-5 h-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            className="w-12 h-12 rounded-full bg-savanna-earth-700 text-white hover:bg-savanna-earth-600"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* End Call */}
          <Button
            variant="ghost"
            onClick={handleEndSession}
            className="w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Zero Balance Warning Modal */}
      {zeroBalance.countdownActive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card variant="elevated" className="max-w-md w-full mx-4">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-savanna-earth-800 mb-2">
                Balance Depleted
              </h2>
              <p className="text-savanna-earth-600 mb-4">
                Session will end in{' '}
                <span className="font-bold text-red-600 text-2xl">
                  {zeroBalance.countdownSeconds}
                </span>{' '}
                seconds
              </p>
              <p className="text-sm text-savanna-earth-500 mb-6">
                Add funds now to continue your lesson without interruption
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleEndSession}>
                  End Session
                </Button>
                <Button onClick={() => {
                  setShowTopUpPrompt(true);
                  zeroBalance.cancelCountdown();
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
