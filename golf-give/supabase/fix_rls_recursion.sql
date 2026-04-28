-- ============================================================
-- FIX: Infinite recursion in profiles RLS policy
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Create a SECURITY DEFINER function that checks admin role
-- This runs with the function owner's privileges, bypassing RLS,
-- which prevents the recursive policy loop.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Step 2: Drop the recursive admin policy on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Step 3: Recreate it using the safe function (no recursion)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (is_admin());

-- Step 4: Fix all other tables that have the same recursive pattern
DROP POLICY IF EXISTS "Admins can manage all scores" ON public.scores;
CREATE POLICY "Admins can manage all scores" ON public.scores
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage charities" ON public.charities;
CREATE POLICY "Admins can manage charities" ON public.charities
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage draws" ON public.draws;
CREATE POLICY "Admins can manage draws" ON public.draws
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage draw entries" ON public.draw_entries;
CREATE POLICY "Admins can manage draw entries" ON public.draw_entries
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage prize pools" ON public.prize_pools;
CREATE POLICY "Admins can manage prize pools" ON public.prize_pools
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage all results" ON public.draw_results;
CREATE POLICY "Admins can manage all results" ON public.draw_results
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage all verifications" ON public.winner_verifications;
CREATE POLICY "Admins can manage all verifications" ON public.winner_verifications
  FOR ALL USING (is_admin());
