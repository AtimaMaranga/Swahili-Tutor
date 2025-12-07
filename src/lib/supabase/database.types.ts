export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'student' | 'tutor' | 'admin'
          timezone: string
          bio: string | null
          video_intro_url: string | null
          id_verified: boolean
          internet_speed_verified: boolean
          is_approved: boolean
          price_per_minute: number
          accent: 'kenyan' | 'tanzanian' | 'standard' | null
          languages_spoken: string[]
          total_sessions: number
          average_rating: number
          is_online: boolean
          country: 'KE' | 'TZ' | 'UG' | null
          mobile_money_number: string | null
          bank_account: string | null
          preferred_accent: 'kenyan' | 'tanzanian' | 'standard' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role: 'student' | 'tutor' | 'admin'
          timezone?: string
          bio?: string | null
          video_intro_url?: string | null
          id_verified?: boolean
          internet_speed_verified?: boolean
          is_approved?: boolean
          price_per_minute?: number
          accent?: 'kenyan' | 'tanzanian' | 'standard' | null
          languages_spoken?: string[]
          total_sessions?: number
          average_rating?: number
          is_online?: boolean
          country?: 'KE' | 'TZ' | 'UG' | null
          mobile_money_number?: string | null
          bank_account?: string | null
          preferred_accent?: 'kenyan' | 'tanzanian' | 'standard' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'student' | 'tutor' | 'admin'
          timezone?: string
          bio?: string | null
          video_intro_url?: string | null
          id_verified?: boolean
          internet_speed_verified?: boolean
          is_approved?: boolean
          price_per_minute?: number
          accent?: 'kenyan' | 'tanzanian' | 'standard' | null
          languages_spoken?: string[]
          total_sessions?: number
          average_rating?: number
          is_online?: boolean
          country?: 'KE' | 'TZ' | 'UG' | null
          mobile_money_number?: string | null
          bank_account?: string | null
          preferred_accent?: 'kenyan' | 'tanzanian' | 'standard' | null
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance_cents: number
          currency: 'USD' | 'GBP' | 'EUR'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance_cents?: number
          currency?: 'USD' | 'GBP' | 'EUR'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance_cents?: number
          currency?: 'USD' | 'GBP' | 'EUR'
          created_at?: string
          updated_at?: string
        }
      }
      transactions_ledger: {
        Row: {
          id: string
          wallet_id: string
          type: 'deposit' | 'withdrawal' | 'session_charge' | 'session_credit' | 'refund' | 'commission'
          amount_cents: number
          balance_before_cents: number
          balance_after_cents: number
          description: string
          reference_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          wallet_id: string
          type: 'deposit' | 'withdrawal' | 'session_charge' | 'session_credit' | 'refund' | 'commission'
          amount_cents: number
          balance_before_cents: number
          balance_after_cents: number
          description: string
          reference_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          wallet_id?: string
          type?: 'deposit' | 'withdrawal' | 'session_charge' | 'session_credit' | 'refund' | 'commission'
          amount_cents?: number
          balance_before_cents?: number
          balance_after_cents?: number
          description?: string
          reference_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          student_id: string
          tutor_id: string
          room_name: string
          scheduled_at: string | null
          started_at: string | null
          ended_at: string | null
          duration_minutes: number
          price_per_minute_snapshot: number
          total_cost_cents: number
          status: 'scheduled' | 'waiting' | 'active' | 'paused' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          tutor_id: string
          room_name: string
          scheduled_at?: string | null
          started_at?: string | null
          ended_at?: string | null
          duration_minutes?: number
          price_per_minute_snapshot: number
          total_cost_cents?: number
          status?: 'scheduled' | 'waiting' | 'active' | 'paused' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          tutor_id?: string
          room_name?: string
          scheduled_at?: string | null
          started_at?: string | null
          ended_at?: string | null
          duration_minutes?: number
          price_per_minute_snapshot?: number
          total_cost_cents?: number
          status?: 'scheduled' | 'waiting' | 'active' | 'paused' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      session_logs: {
        Row: {
          id: string
          session_id: string
          event_type: 'join' | 'leave' | 'pause' | 'resume' | 'charge' | 'warning' | 'terminate'
          user_id: string
          timestamp: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          session_id: string
          event_type: 'join' | 'leave' | 'pause' | 'resume' | 'charge' | 'warning' | 'terminate'
          user_id: string
          timestamp?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          session_id?: string
          event_type?: 'join' | 'leave' | 'pause' | 'resume' | 'charge' | 'warning' | 'terminate'
          user_id?: string
          timestamp?: string
          metadata?: Json | null
        }
      }
      reviews: {
        Row: {
          id: string
          session_id: string
          student_id: string
          tutor_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          student_id: string
          tutor_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          tutor_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      tutor_availability: {
        Row: {
          id: string
          tutor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
        }
        Insert: {
          id?: string
          tutor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
        }
        Update: {
          id?: string
          tutor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
        }
      }
      payouts: {
        Row: {
          id: string
          tutor_id: string
          amount_cents: number
          currency: 'KES' | 'TZS' | 'UGX'
          status: 'pending' | 'processing' | 'completed' | 'failed'
          payout_method: 'mpesa' | 'bank' | 'mobile_money'
          payout_reference: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          amount_cents: number
          currency: 'KES' | 'TZS' | 'UGX'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          payout_method: 'mpesa' | 'bank' | 'mobile_money'
          payout_reference?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          amount_cents?: number
          currency?: 'KES' | 'TZS' | 'UGX'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          payout_method?: 'mpesa' | 'bank' | 'mobile_money'
          payout_reference?: string | null
          processed_at?: string | null
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          file_type: 'pdf' | 'image' | 'document'
          category: 'grammar' | 'vocabulary' | 'culture' | 'exercises'
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          file_type: 'pdf' | 'image' | 'document'
          category: 'grammar' | 'vocabulary' | 'culture' | 'exercises'
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_type?: 'pdf' | 'image' | 'document'
          category?: 'grammar' | 'vocabulary' | 'culture' | 'exercises'
          created_by?: string
          created_at?: string
        }
      }
      platform_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
