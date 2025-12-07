import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency from cents
export function formatCurrency(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format minutes to human readable duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMins} min`;
}

// Calculate remaining minutes based on balance and price
export function calculateRemainingMinutes(balanceCents: number, pricePerMinuteCents: number): number {
  if (pricePerMinuteCents <= 0) return 0;
  return Math.floor(balanceCents / pricePerMinuteCents);
}

// Convert timezone
export function convertToLocalTime(utcTime: string, timezone: string): Date {
  const date = new Date(utcTime);
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}

// Convert EAT time to user's local time
export function eatToLocal(eatTime: string, userTimezone: string): string {
  const [hours, minutes] = eatTime.split(':').map(Number);
  const now = new Date();
  const eatDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  // EAT is UTC+3
  const utcDate = new Date(eatDate.getTime() - 3 * 60 * 60 * 1000);

  return utcDate.toLocaleTimeString('en-US', {
    timeZone: userTimezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Detect user timezone from browser
export function detectTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Generate unique room name for Daily.co
export function generateRoomName(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `swahili-${timestamp}-${randomPart}`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Format relative time
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return then.toLocaleDateString();
}

// Connection quality indicator
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'disconnected';

export function getConnectionQuality(rtt?: number, packetLoss?: number): ConnectionQuality {
  if (rtt === undefined) return 'disconnected';
  if (rtt < 150 && (packetLoss ?? 0) < 1) return 'excellent';
  if (rtt < 300 && (packetLoss ?? 0) < 5) return 'good';
  return 'poor';
}

export function getConnectionColor(quality: ConnectionQuality): string {
  switch (quality) {
    case 'excellent': return 'bg-green-500';
    case 'good': return 'bg-yellow-500';
    case 'poor': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}
