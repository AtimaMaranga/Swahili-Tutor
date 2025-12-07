-- ============================================
-- Learn Swahili - Database Schema
-- Premium Swahili Tutoring Platform
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('student', 'tutor', 'admin');
CREATE TYPE accent_type AS ENUM ('kenyan', 'tanzanian', 'standard');
CREATE TYPE country_code AS ENUM ('KE', 'TZ', 'UG');
CREATE TYPE currency_code AS ENUM ('USD', 'GBP', 'EUR');
CREATE TYPE local_currency AS ENUM ('KES', 'TZS', 'UGX');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'session_charge', 'session_credit', 'refund', 'commission');
CREATE TYPE session_status AS ENUM ('scheduled', 'waiting', 'active', 'paused', 'completed', 'cancelled', 'no_show');
CREATE TYPE event_type AS ENUM ('join', 'leave', 'pause', 'resume', 'charge', 'warning', 'terminate');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE payout_method AS ENUM ('mpesa', 'bank', 'mobile_money');
CREATE TYPE file_type AS ENUM ('pdf', 'image', 'document');
CREATE TYPE resource_category AS ENUM ('grammar', 'vocabulary', 'culture', 'exercises');

-- ============================================
-- PROFILES TABLE
-- Unified table for all user types
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    timezone TEXT NOT NULL DEFAULT 'UTC',

    -- Tutor-specific fields (NULL for students)
    bio TEXT,
    video_intro_url TEXT,
    id_verified BOOLEAN DEFAULT FALSE,
    internet_speed_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    price_per_minute INTEGER DEFAULT 0, -- in USD cents (e.g., 50 = $0.50/min)
    accent accent_type,
    languages_spoken TEXT[] DEFAULT ARRAY['Swahili', 'English'],
    total_sessions INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2) DEFAULT 0.00,
    is_online BOOLEAN DEFAULT FALSE,
    country country_code,
    mobile_money_number TEXT,
    bank_account TEXT,

    -- Student-specific fields
    preferred_accent accent_type,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast tutor searches
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_online ON profiles(is_online) WHERE role = 'tutor';
CREATE INDEX idx_profiles_is_approved ON profiles(is_approved) WHERE role = 'tutor';
CREATE INDEX idx_profiles_price ON profiles(price_per_minute) WHERE role = 'tutor';

-- ============================================
-- WALLETS TABLE
-- Student digital wallets for prepaid credits
-- ============================================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    balance_cents INTEGER NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
    currency currency_code NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast balance lookups
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- ============================================
-- TRANSACTIONS LEDGER (Double-Entry Bookkeeping)
-- Immutable record of every financial transaction
-- ============================================

CREATE TABLE transactions_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT NOT NULL,
    type transaction_type NOT NULL,
    amount_cents INTEGER NOT NULL, -- Positive = credit, Negative = debit
    balance_before_cents INTEGER NOT NULL,
    balance_after_cents INTEGER NOT NULL,
    description TEXT NOT NULL,
    reference_id UUID, -- Links to session_id, payout_id, or payment_id
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prevent updates/deletes on ledger (immutable)
CREATE OR REPLACE FUNCTION prevent_ledger_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Transaction ledger entries cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_ledger_update
    BEFORE UPDATE ON transactions_ledger
    FOR EACH ROW EXECUTE FUNCTION prevent_ledger_modification();

CREATE TRIGGER prevent_ledger_delete
    BEFORE DELETE ON transactions_ledger
    FOR EACH ROW EXECUTE FUNCTION prevent_ledger_modification();

-- Index for transaction history queries
CREATE INDEX idx_transactions_wallet_id ON transactions_ledger(wallet_id);
CREATE INDEX idx_transactions_created_at ON transactions_ledger(created_at DESC);
CREATE INDEX idx_transactions_reference ON transactions_ledger(reference_id);

-- ============================================
-- SESSIONS TABLE
-- Video tutoring sessions
-- ============================================

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
    tutor_id UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
    room_name TEXT NOT NULL UNIQUE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 0,
    price_per_minute_snapshot INTEGER NOT NULL, -- Price locked at session start
    total_cost_cents INTEGER DEFAULT 0,
    status session_status NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_duration CHECK (duration_minutes >= 0),
    CONSTRAINT valid_cost CHECK (total_cost_cents >= 0)
);

-- Indexes for session queries
CREATE INDEX idx_sessions_student_id ON sessions(student_id);
CREATE INDEX idx_sessions_tutor_id ON sessions(tutor_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_sessions_room_name ON sessions(room_name);

-- ============================================
-- SESSION LOGS TABLE
-- Detailed event logging for disputes/auditing
-- ============================================

CREATE TABLE session_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    event_type event_type NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Index for log queries
CREATE INDEX idx_session_logs_session_id ON session_logs(session_id);
CREATE INDEX idx_session_logs_timestamp ON session_logs(timestamp);

-- ============================================
-- REVIEWS TABLE
-- Post-session ratings and feedback
-- ============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL UNIQUE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for review queries
CREATE INDEX idx_reviews_tutor_id ON reviews(tutor_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Function to update tutor average rating
CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE tutor_id = NEW.tutor_id
    ),
    total_sessions = (
        SELECT COUNT(*)
        FROM sessions
        WHERE tutor_id = NEW.tutor_id AND status = 'completed'
    )
    WHERE id = NEW.tutor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tutor_rating_trigger
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_tutor_rating();

-- ============================================
-- TUTOR AVAILABILITY TABLE
-- Weekly recurring availability slots
-- ============================================

CREATE TABLE tutor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL, -- In East Africa Time (EAT/UTC+3)
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    -- Ensure end time is after start time
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    -- Unique constraint to prevent duplicate slots
    CONSTRAINT unique_availability UNIQUE (tutor_id, day_of_week, start_time, end_time)
);

-- Index for availability queries
CREATE INDEX idx_availability_tutor_id ON tutor_availability(tutor_id);
CREATE INDEX idx_availability_day ON tutor_availability(day_of_week);

-- ============================================
-- PAYOUTS TABLE
-- Tutor withdrawal requests (M-Pesa, Bank)
-- ============================================

CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    currency local_currency NOT NULL DEFAULT 'KES',
    status payout_status NOT NULL DEFAULT 'pending',
    payout_method payout_method NOT NULL,
    payout_reference TEXT, -- External payment provider reference
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for payout queries
CREATE INDEX idx_payouts_tutor_id ON payouts(tutor_id);
CREATE INDEX idx_payouts_status ON payouts(status);

-- ============================================
-- RESOURCES TABLE
-- Admin-uploaded learning materials
-- ============================================

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type file_type NOT NULL,
    category resource_category NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for resource queries
CREATE INDEX idx_resources_category ON resources(category);

-- ============================================
-- PLATFORM SETTINGS TABLE
-- Global configuration (commission rates, etc.)
-- ============================================

CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO platform_settings (key, value) VALUES
    ('commission_rate', '{"percentage": 15}'),
    ('min_withdrawal', '{"KES": 50000, "TZS": 100000, "UGX": 200000}'),
    ('session_no_show_penalty_minutes', '{"minutes": 15}'),
    ('low_balance_warning_minutes', '{"minutes": 5}'),
    ('critical_balance_warning_minutes', '{"minutes": 1}');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all approved tutor profiles"
    ON profiles FOR SELECT
    USING (role = 'tutor' AND is_approved = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Wallets policies
CREATE POLICY "Users can view their own wallet"
    ON wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can update wallets"
    ON wallets FOR UPDATE
    USING (TRUE);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
    ON transactions_ledger FOR SELECT
    USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all transactions"
    ON transactions_ledger FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Sessions policies
CREATE POLICY "Users can view their own sessions"
    ON sessions FOR SELECT
    USING (student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        OR tutor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all sessions"
    ON sessions FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    USING (TRUE);

CREATE POLICY "Students can create reviews for their sessions"
    ON reviews FOR INSERT
    WITH CHECK (student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Tutor availability policies
CREATE POLICY "Anyone can view tutor availability"
    ON tutor_availability FOR SELECT
    USING (TRUE);

CREATE POLICY "Tutors can manage their own availability"
    ON tutor_availability FOR ALL
    USING (tutor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'tutor'));

-- Payouts policies
CREATE POLICY "Tutors can view their own payouts"
    ON payouts FOR SELECT
    USING (tutor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all payouts"
    ON payouts FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Resources policies
CREATE POLICY "Anyone can view resources"
    ON resources FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins can manage resources"
    ON resources FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Platform settings policies
CREATE POLICY "Admins can manage platform settings"
    ON platform_settings FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- Enable realtime for wallet and session updates
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions_ledger;
ALTER PUBLICATION supabase_realtime ADD TABLE session_logs;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to safely deduct from wallet (atomic operation)
CREATE OR REPLACE FUNCTION deduct_from_wallet(
    p_wallet_id UUID,
    p_amount_cents INTEGER,
    p_description TEXT,
    p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Lock the wallet row for update
    SELECT balance_cents INTO v_current_balance
    FROM wallets
    WHERE id = p_wallet_id
    FOR UPDATE;

    IF v_current_balance IS NULL THEN
        RETURN FALSE;
    END IF;

    v_new_balance := v_current_balance - p_amount_cents;

    IF v_new_balance < 0 THEN
        RETURN FALSE;
    END IF;

    -- Update wallet balance
    UPDATE wallets
    SET balance_cents = v_new_balance, updated_at = NOW()
    WHERE id = p_wallet_id;

    -- Create ledger entry
    INSERT INTO transactions_ledger (
        wallet_id, type, amount_cents,
        balance_before_cents, balance_after_cents,
        description, reference_id
    ) VALUES (
        p_wallet_id, 'session_charge', -p_amount_cents,
        v_current_balance, v_new_balance,
        p_description, p_reference_id
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to add funds to wallet
CREATE OR REPLACE FUNCTION add_to_wallet(
    p_wallet_id UUID,
    p_amount_cents INTEGER,
    p_description TEXT,
    p_type transaction_type DEFAULT 'deposit',
    p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    SELECT balance_cents INTO v_current_balance
    FROM wallets
    WHERE id = p_wallet_id
    FOR UPDATE;

    IF v_current_balance IS NULL THEN
        RETURN FALSE;
    END IF;

    v_new_balance := v_current_balance + p_amount_cents;

    UPDATE wallets
    SET balance_cents = v_new_balance, updated_at = NOW()
    WHERE id = p_wallet_id;

    INSERT INTO transactions_ledger (
        wallet_id, type, amount_cents,
        balance_before_cents, balance_after_cents,
        description, reference_id
    ) VALUES (
        p_wallet_id, p_type, p_amount_cents,
        v_current_balance, v_new_balance,
        p_description, p_reference_id
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
