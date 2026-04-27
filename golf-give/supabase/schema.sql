-- Golf & Give - Complete Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHARITIES TABLE
-- ============================================
CREATE TABLE public.charities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  charity_percentage NUMERIC(5,2) DEFAULT 10.00 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  selected_charity_id UUID REFERENCES public.charities(id),
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCORES TABLE
-- ============================================
CREATE TABLE public.scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- ============================================
-- DRAWS TABLE
-- ============================================
CREATE TABLE public.draws (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'simulation', 'published', 'completed')),
  draw_numbers INTEGER[] DEFAULT '{}',
  algorithm_type TEXT NOT NULL DEFAULT 'random' CHECK (algorithm_type IN ('random', 'algorithmic')),
  jackpot_amount NUMERIC(12,2) DEFAULT 0,
  jackpot_carried_forward BOOLEAN DEFAULT FALSE,
  simulation_results JSONB,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month, year)
);

-- ============================================
-- DRAW ENTRIES TABLE
-- ============================================
CREATE TABLE public.draw_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scores_snapshot JSONB NOT NULL,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draw_id, user_id)
);

-- ============================================
-- PRIZE POOLS TABLE
-- ============================================
CREATE TABLE public.prize_pools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_pool NUMERIC(12,2) DEFAULT 0,
  five_match_pool NUMERIC(12,2) DEFAULT 0,
  four_match_pool NUMERIC(12,2) DEFAULT 0,
  three_match_pool NUMERIC(12,2) DEFAULT 0,
  jackpot_rollover NUMERIC(12,2) DEFAULT 0,
  active_subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DRAW RESULTS TABLE
-- ============================================
CREATE TABLE public.draw_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  match_type INTEGER NOT NULL CHECK (match_type IN (3, 4, 5)),
  matched_numbers INTEGER[] DEFAULT '{}',
  prize_amount NUMERIC(12,2) DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'paid', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WINNER VERIFICATIONS TABLE
-- ============================================
CREATE TABLE public.winner_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_result_id UUID REFERENCES public.draw_results(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  screenshot_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_scores_user_id ON public.scores(user_id);
CREATE INDEX idx_scores_date ON public.scores(score_date DESC);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_draw_entries_draw_id ON public.draw_entries(draw_id);
CREATE INDEX idx_draw_results_draw_id ON public.draw_results(draw_id);
CREATE INDEX idx_draw_results_user_id ON public.draw_results(user_id);
CREATE INDEX idx_winner_verifications_status ON public.winner_verifications(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winner_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Scores policies
CREATE POLICY "Users can manage own scores" ON public.scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all scores" ON public.scores FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Charities - public read
CREATE POLICY "Anyone can view active charities" ON public.charities FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage charities" ON public.charities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Draws - public read for published
CREATE POLICY "Anyone can view published draws" ON public.draws FOR SELECT USING (status = 'published' OR status = 'completed');
CREATE POLICY "Admins can manage draws" ON public.draws FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Draw entries
CREATE POLICY "Users can view own entries" ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage draw entries" ON public.draw_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Prize pools - public read
CREATE POLICY "Anyone can view prize pools" ON public.prize_pools FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage prize pools" ON public.prize_pools FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Draw results
CREATE POLICY "Users can view own results" ON public.draw_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all results" ON public.draw_results FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Winner verifications
CREATE POLICY "Users can manage own verifications" ON public.winner_verifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all verifications" ON public.winner_verifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'subscriber')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: Keep only 5 scores per user
-- ============================================
CREATE OR REPLACE FUNCTION public.enforce_score_limit()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.scores
  WHERE id IN (
    SELECT id FROM public.scores
    WHERE user_id = NEW.user_id
    ORDER BY score_date DESC
    OFFSET 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_five_scores
  AFTER INSERT ON public.scores
  FOR EACH ROW EXECUTE FUNCTION public.enforce_score_limit();

-- ============================================
-- SEED: Sample Charities
-- ============================================
INSERT INTO public.charities (name, description, long_description, is_featured, events) VALUES
(
  'Golf for Good Foundation',
  'Connecting golf communities with local charities through sport and giving.',
  'The Golf for Good Foundation believes that sport can be a powerful vehicle for social change. We partner with golf clubs and communities across the country to raise funds for local charities, community projects, and youth development programs. Every swing counts.',
  TRUE,
  '[{"name": "Annual Charity Golf Day", "date": "2025-06-15", "location": "Royal Links Golf Club", "description": "Our flagship annual event raising funds for youth education programs."}, {"name": "Summer Scramble", "date": "2025-08-10", "location": "Parkside Golf Course", "description": "A fun 18-hole scramble format open to all skill levels."}]'
),
(
  'Youth Sports Initiative',
  'Providing underprivileged youth with access to sports and mentorship programs.',
  'We believe every child deserves the opportunity to play, learn, and grow through sport. Our programs provide equipment, coaching, and mentorship to young people in underserved communities. From golf clinics to multi-sport camps, we''re building the next generation of champions — on and off the course.',
  TRUE,
  '[{"name": "Summer Golf Academy", "date": "2025-07-20", "location": "Various Locations", "description": "Free golf lessons for ages 8-16 in partnership with local clubs."}]'
),
(
  'Mental Health Through Sport',
  'Harnessing the therapeutic power of golf to support mental health recovery.',
  'Golf has an extraordinary ability to calm the mind, build confidence, and foster human connection. Our charity works with mental health practitioners to design golf-based therapeutic programs for people experiencing anxiety, depression, and trauma. We run weekly sessions at partner clubs and offer scholarships for those who cannot afford participation.',
  FALSE,
  '[{"name": "Awareness Golf Day", "date": "2025-09-05", "location": "Greenway Golf Club", "description": "Raising awareness and funds for mental health programs through golf."}]'
),
(
  'Veterans on the Fairway',
  'Supporting military veterans through the healing power of golf and community.',
  'Veterans face unique challenges when returning to civilian life. Golf provides structure, camaraderie, and a sense of achievement. We partner with VA hospitals and veteran support organizations to offer free golf programs, equipment donations, and community events specifically for veterans and their families.',
  FALSE,
  '[{"name": "Veterans Cup", "date": "2025-11-11", "location": "Eagle Ridge Golf Club", "description": "Annual tournament honouring our veterans with prizes and celebration."}]'
),
(
  'Environmental Greens Project',
  'Protecting natural ecosystems through sustainable golf course management.',
  'Golf courses cover millions of acres globally. We partner with courses to transform them into biodiversity hotspots — planting native species, eliminating harmful pesticides, creating wildlife corridors, and educating golfers about environmental stewardship. Every round played at a partner course contributes to our conservation fund.',
  FALSE,
  '[]'
);
