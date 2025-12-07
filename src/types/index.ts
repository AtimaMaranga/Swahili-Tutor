// User Roles
export type UserRole = 'student' | 'tutor' | 'admin';

// Profile Types
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile extends Profile {
  role: 'student';
  preferred_accent?: 'kenyan' | 'tanzanian' | 'standard';
}

export interface TutorProfile extends Profile {
  role: 'tutor';
  bio?: string;
  video_intro_url?: string;
  id_verified: boolean;
  internet_speed_verified: boolean;
  is_approved: boolean;
  price_per_minute: number; // in USD cents
  accent: 'kenyan' | 'tanzanian' | 'standard';
  languages_spoken: string[];
  total_sessions: number;
  average_rating: number;
  is_online: boolean;
  country: 'KE' | 'TZ' | 'UG';
  mobile_money_number?: string;
  bank_account?: string;
}

// Wallet Types
export interface Wallet {
  id: string;
  user_id: string;
  balance_cents: number; // in USD cents
  currency: 'USD' | 'GBP' | 'EUR';
  created_at: string;
  updated_at: string;
}

// Transaction Types
export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'session_charge'
  | 'session_credit'
  | 'refund'
  | 'commission';

export interface Transaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount_cents: number;
  balance_before_cents: number;
  balance_after_cents: number;
  description: string;
  reference_id?: string; // session_id, payment_id, etc.
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Session Types
export type SessionStatus =
  | 'scheduled'
  | 'waiting'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Session {
  id: string;
  student_id: string;
  tutor_id: string;
  room_name: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  duration_minutes: number;
  price_per_minute_snapshot: number; // Price locked at session start
  total_cost_cents: number;
  status: SessionStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Session Log for detailed tracking
export interface SessionLog {
  id: string;
  session_id: string;
  event_type: 'join' | 'leave' | 'pause' | 'resume' | 'charge' | 'warning' | 'terminate';
  user_id: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Review Types
export interface Review {
  id: string;
  session_id: string;
  student_id: string;
  tutor_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  created_at: string;
}

// Availability Types
export interface TutorAvailability {
  id: string;
  tutor_id: string;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  start_time: string; // HH:MM in EAT
  end_time: string;   // HH:MM in EAT
  is_active: boolean;
}

// Payout Types
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payout {
  id: string;
  tutor_id: string;
  amount_cents: number;
  currency: 'KES' | 'TZS' | 'UGX';
  status: PayoutStatus;
  payout_method: 'mpesa' | 'bank' | 'mobile_money';
  payout_reference?: string;
  processed_at?: string;
  created_at: string;
}

// Admin Resource Types
export interface Resource {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: 'pdf' | 'image' | 'document';
  category: 'grammar' | 'vocabulary' | 'culture' | 'exercises';
  created_by: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Real-time Billing Types
export interface BillingHeartbeat {
  session_id: string;
  student_id: string;
  tutor_id: string;
  current_balance_cents: number;
  minutes_elapsed: number;
  price_per_minute_cents: number;
  timestamp: string;
}

export interface WalletWarning {
  type: 'low_balance' | 'critical_balance' | 'zero_balance';
  remaining_minutes: number;
  message: string;
}

// Search & Filter Types
export interface TutorSearchFilters {
  accent?: 'kenyan' | 'tanzanian' | 'standard';
  maxPricePerMinute?: number;
  minRating?: number;
  isOnlineNow?: boolean;
  searchQuery?: string;
}
