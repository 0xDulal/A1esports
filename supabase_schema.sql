-- ====================================================================
-- A1 ESPORTS — COMPLETE RESET, SCHEMA RECREATION & INITIAL SEED DATA
-- Copy and paste this script directly into Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP ALL EXISTING TABLES FOR CLEAN RE-CREATION
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.sponsors CASCADE;
DROP TABLE IF EXISTS public.investors CASCADE;
DROP TABLE IF EXISTS public.news_articles CASCADE;

-- 3. PRODUCTS TABLE
CREATE TABLE public.products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || gen_random_uuid()),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  half_sleeve_price NUMERIC,
  full_sleeve_price NUMERIC,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('JERSEYS', 'HOODIES', 'LIFESTYLE', 'ACCESSORIES')),
  is_sold_out BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  can_customise BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  customer_phone TEXT NOT NULL,
  country TEXT DEFAULT 'Bangladesh',
  shipping_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'COD',
  payment_number TEXT DEFAULT '',
  transaction_id TEXT DEFAULT '',
  payment_proof_url TEXT DEFAULT '',
  coupon_code TEXT DEFAULT '',
  discount_amount NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'Pending',
  order_status TEXT DEFAULT 'Processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENT METHODS TABLE
CREATE TABLE public.payment_methods (
  id TEXT PRIMARY KEY DEFAULT ('pm-' || gen_random_uuid()),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'digital',
  account_number TEXT DEFAULT '',
  instructions TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COUPONS TABLE
CREATE TABLE public.coupons (
  id TEXT PRIMARY KEY DEFAULT ('cpn-' || gen_random_uuid()),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  max_uses INTEGER DEFAULT 0,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEAMS TABLE
CREATE TABLE public.teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  logo TEXT NOT NULL,
  banner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PLAYERS TABLE
CREATE TABLE public.players (
  id TEXT PRIMARY KEY DEFAULT ('player-' || gen_random_uuid()),
  team_id TEXT REFERENCES public.teams(id) ON DELETE CASCADE,
  ign TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT NOT NULL,
  socials JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ACHIEVEMENTS TABLE
CREATE TABLE public.achievements (
  id TEXT PRIMARY KEY DEFAULT ('ach-' || gen_random_uuid()),
  team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  rank TEXT NOT NULL,
  event TEXT NOT NULL,
  year TEXT NOT NULL,
  date DATE,
  tier TEXT DEFAULT 'A-Tier',
  prize TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SPONSORS TABLE
CREATE TABLE public.sponsors (
  id TEXT PRIMARY KEY DEFAULT ('sp-' || gen_random_uuid()),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'PARTNER',
  logo TEXT NOT NULL,
  website_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. INVESTORS TABLE
CREATE TABLE public.investors (
  id TEXT PRIMARY KEY DEFAULT ('inv-' || gen_random_uuid()),
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Investor',
  logo TEXT NOT NULL,
  bio TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 13. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ POLICIES
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Products" ON public.products;
CREATE POLICY "All Access Products" ON public.products FOR ALL USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "All Access Orders" ON public.orders;
CREATE POLICY "All Access Orders" ON public.orders FOR ALL USING (true);

-- Payment Methods Policies
DROP POLICY IF EXISTS "Public Read Payment Methods" ON public.payment_methods;
CREATE POLICY "Public Read Payment Methods" ON public.payment_methods FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Payment Methods" ON public.payment_methods;
CREATE POLICY "All Access Payment Methods" ON public.payment_methods FOR ALL USING (true);

-- Coupons Policies
DROP POLICY IF EXISTS "Public Read Coupons" ON public.coupons;
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Coupons" ON public.coupons;
CREATE POLICY "All Access Coupons" ON public.coupons FOR ALL USING (true);

-- Site Settings Policies
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Settings" ON public.site_settings;
CREATE POLICY "All Access Settings" ON public.site_settings FOR ALL USING (true);

-- Teams Policies
DROP POLICY IF EXISTS "Public Read Teams" ON public.teams;
CREATE POLICY "Public Read Teams" ON public.teams FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Teams" ON public.teams;
CREATE POLICY "All Access Teams" ON public.teams FOR ALL USING (true);

-- Players Policies
DROP POLICY IF EXISTS "Public Read Players" ON public.players;
CREATE POLICY "Public Read Players" ON public.players FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Players" ON public.players;
CREATE POLICY "All Access Players" ON public.players FOR ALL USING (true);

-- Achievements Policies
DROP POLICY IF EXISTS "Public Read Achievements" ON public.achievements;
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Achievements" ON public.achievements;
CREATE POLICY "All Access Achievements" ON public.achievements FOR ALL USING (true);

-- Sponsors Policies
DROP POLICY IF EXISTS "Public Read Sponsors" ON public.sponsors;
CREATE POLICY "Public Read Sponsors" ON public.sponsors FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Sponsors" ON public.sponsors;
CREATE POLICY "All Access Sponsors" ON public.sponsors FOR ALL USING (true);

-- Investors Policies
DROP POLICY IF EXISTS "Public Read Investors" ON public.investors;
CREATE POLICY "Public Read Investors" ON public.investors FOR SELECT USING (true);
DROP POLICY IF EXISTS "All Access Investors" ON public.investors;
CREATE POLICY "All Access Investors" ON public.investors FOR ALL USING (true);

-- ====================================================================
-- 14. SUPABASE STORAGE BUCKETS SETUP FOR IMAGES
-- ====================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- ====================================================================
-- 15. INITIAL SEED DATA
-- ====================================================================

-- Insert Products
INSERT INTO public.products (id, slug, title, price, half_sleeve_price, full_sleeve_price, image, category, is_sold_out, description, can_customise) VALUES
('jer-001', 'a1-away-kit-beauty-red-player-edition', 'A1 Away Kit | Beauty Red – Player Edition', 850, 850, 899, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png', 'JERSEYS', false, 'Official 2026 Season Away Kit. Lightweight, breathable, and optimized for extreme performance.', true),
('jer-002', 'a1-away-kit-beauty-red-fan-edition', 'A1 Away Kit | Beauty Red – Fan Edition', 650, 650, 699, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-2-1024x1024.png', 'JERSEYS', false, 'Support the team in style with the official fan edition jersey.', true),
('jer-003', 'a1-home-kit-signature-purple-player-edition', 'A1 Home Kit | Signature Purple – Player Edition', 800, 800, 849, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-8-1024x1024.png', 'JERSEYS', false, 'The iconic purple home kit worn by pros on stage.', true),
('jer-004', 'a1-home-kit-signature-purple-fan-edition', 'A1 Home Kit | Signature Purple – Fan Edition', 600, 600, 649, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-9-1024x1024.png', 'JERSEYS', false, 'Premium comfort for the ultimate A1ESPORTS fan.', true),
('acc-001', 'a1-pro-gaming-mousepad-xl', 'A1 Pro Gaming Mousepad – XL', 350, NULL, NULL, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-6-1024x1024.png', 'ACCESSORIES', false, 'Ultra-smooth tracking surface for precision gaming.', false),
('life-001', 'a1-stealth-tee-midnight-black', 'A1 Stealth Tee – Midnight Black', 450, NULL, NULL, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-10-1024x1024.png', 'LIFESTYLE', false, 'Minimalist brand logo on premium 100% cotton tee.', false);

-- Insert Teams
INSERT INTO public.teams (id, name, game, logo) VALUES
('pubgm-pro', 'A1 Esports Professional', 'PUBG Mobile', '/A1esports_logo_white.svg'),
('management', 'Management Team', 'Owner & Management', '/A1esports_logo_white.svg');

-- Insert Players
INSERT INTO public.players (id, team_id, ign, name, role, image, socials) VALUES
('p-1', 'pubgm-pro', 'SiNiSTER', 'MD Abdul Jabbar Shakil', 'IGL', '/images/players/SiNiSTER.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-2', 'pubgm-pro', 'ROWDY', 'Emon Sheikh', 'FRAGGER', '/images/players/ROWDY.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-3', 'pubgm-pro', 'DEATHSTORM', 'Hasan Mahmood', 'SNIPER', '/images/players/DEATHSTORM.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-4', 'pubgm-pro', 'CJBOYY', 'Tahmid Aronno', 'RUSHER', '/images/players/CJBOYY.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-5', 'pubgm-pro', 'FLASH', 'Tausif Rahman', 'SUPPORT', '/images/players/FLASH.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-6', 'management', 'MD Abdul Jabbar Shakil', 'SiNiSTER', 'Owner of A1 Esports', '/images/management/shakil.jpg', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-7', 'management', 'Srabon Shanto', 'Manager', 'Manager', '/images/management/srabon.jpg', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-8', 'management', 'Dulal Shikdar', 'Owner of Zer0byte', 'Lead Developer', '/images/management/dulal.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb);

-- Insert Achievements
INSERT INTO public.achievements (id, team_id, title, rank, event, year, date, tier, prize) VALUES
('ach-1', 'pubgm-pro', 'Champions', '1st', 'PMPL South Asia Spring 2023', '2023', '2023-05-10', 'A-Tier', '$10,000'),
('ach-2', 'pubgm-pro', 'Finalists', 'Top 16', 'PMGC 2022', '2022', '2022-12-15', 'S-Tier', '$25,000');

-- Insert Payment Methods
INSERT INTO public.payment_methods (id, name, type, account_number, instructions, is_active) VALUES
('pm-cod', 'Cash on Delivery', 'cod', '', 'Pay in cash upon delivery to your doorstep', true),
('pm-bkash', 'bKash', 'digital', '01700000000', 'Send Money (Personal) to 01700000000', true),
('pm-nagad', 'Nagad', 'digital', '01700000000', 'Send Money (Personal) to 01700000000', true),
('pm-rocket', 'Rocket', 'digital', '01700000000-7', 'Send Money (Personal) to 01700000000-7', true);

-- Insert Sample Coupons
INSERT INTO public.coupons (id, code, discount_type, discount_value, min_order_amount, max_uses, uses_count, is_active) VALUES
('cpn-winnerpmc', 'WINNERPMC', 'percentage', 100, 0, 3, 0, true),
('cpn-a1welcome', 'A1WELCOME', 'fixed', 100, 500, 0, 0, true),
('cpn-a1esports10', 'A1ESPORTS10', 'percentage', 10, 1000, 0, 0, true);

-- Insert Default Site Settings
INSERT INTO public.site_settings (key, value) VALUES
('delivery_charges', '{"inside_dhaka": 60, "outside_dhaka": 120}'::jsonb);

-- Insert Sample Orders
INSERT INTO public.orders (id, customer_name, customer_email, customer_phone, country, shipping_address, items, total_amount, payment_method, payment_number, transaction_id, coupon_code, discount_amount, payment_status, order_status) VALUES
('A1-915711-860', 'Test Buyer Shakil', 'test@a1esports.com', '01700000000', 'Bangladesh', 'House 10, Road 2, Dhaka', '[{"id":"jer-001","title":"A1 Away Kit | Beauty Red – Player Edition","price":850,"quantity":1,"size":"M"}]'::jsonb, 0, 'Free Coupon (100% OFF)', '', '', 'WINNERPMC', 850, 'Paid (100% Coupon)', 'Processing'),
('A1-842109-105', 'MD Emon Sheikh', 'emon@example.com', '01811223344', 'Bangladesh', 'Sector 4, Uttara, Dhaka', '[{"id":"jer-003","title":"A1 Home Kit | Signature Purple","price":800,"quantity":1,"size":"L"}]'::jsonb, 860, 'bKash', '01811223344', '9J47A821', '', 0, 'Paid', 'Delivered');
