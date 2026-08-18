-- ====================================================================
-- A1 ESPORTS — TRUNCATE ALL DATABASE TABLES & RESET SEED DATA
-- Copy and paste this script in Supabase Dashboard -> SQL Editor to clear all data
-- ====================================================================

TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.players CASCADE;
TRUNCATE TABLE public.achievements CASCADE;
TRUNCATE TABLE public.teams CASCADE;
TRUNCATE TABLE public.news_articles CASCADE;
TRUNCATE TABLE public.payment_methods CASCADE;
TRUNCATE TABLE public.coupons CASCADE;
TRUNCATE TABLE public.site_settings CASCADE;
