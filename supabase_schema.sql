-- ====================================================================
-- A1 ESPORTS — COMPLETE SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- Copy and paste this script directly into Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
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

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
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

-- 3B. PAYMENT METHODS TABLE
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id TEXT PRIMARY KEY DEFAULT ('pm-' || gen_random_uuid()),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'digital',
  account_number TEXT DEFAULT '',
  instructions TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3C. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
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

-- 3D. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  logo TEXT NOT NULL,
  banner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY DEFAULT ('player-' || gen_random_uuid()),
  team_id TEXT REFERENCES public.teams(id) ON DELETE CASCADE,
  ign TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT NOT NULL,
  socials JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY DEFAULT ('ach-' || gen_random_uuid()),
  team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  rank TEXT NOT NULL,
  event TEXT NOT NULL,
  year TEXT NOT NULL,
  date DATE,
  tier TEXT DEFAULT 'A-Tier',
  prize TEXT DEFAULT '$0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NEWS ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.news_articles (
  id TEXT PRIMARY KEY DEFAULT ('news-' || gen_random_uuid()),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('TOURNAMENT', 'ANNOUNCEMENT', 'ROSTER', 'COMMUNITY')),
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  author TEXT NOT NULL,
  image TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS and grant public read/insert access
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access on products, teams, players, achievements, news, payment_methods, coupons, site_settings
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public Read Players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public Read News" ON public.news_articles FOR SELECT USING (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Read Payment Methods" ON public.payment_methods FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public access for admin and checkout operations
CREATE POLICY "Public Insert Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public Insert Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public Insert Teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Public Insert Players" ON public.players FOR ALL USING (true);
CREATE POLICY "Public Insert Achievements" ON public.achievements FOR ALL USING (true);
CREATE POLICY "Public Access Payment Methods" ON public.payment_methods FOR ALL USING (true);
CREATE POLICY "Public Access Coupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Public Access Site Settings" ON public.site_settings FOR ALL USING (true);

-- ====================================================================
-- 9. SUPABASE STORAGE BUCKETS SETUP FOR IMAGES
-- ====================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- ====================================================================
-- 10. INITIAL SEED DATA
-- ====================================================================

-- Insert Products
INSERT INTO public.products (id, slug, title, price, half_sleeve_price, full_sleeve_price, image, category, is_sold_out, description, can_customise) VALUES
('jer-001', 'a1-away-kit-beauty-red-player-edition', 'A1 Away Kit | Beauty Red – Player Edition', 850, 850, 899, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png', 'JERSEYS', false, 'Official 2026 Season Away Kit. Lightweight, breathable, and optimized for extreme performance.', true),
('jer-002', 'a1-away-kit-beauty-red-fan-edition', 'A1 Away Kit | Beauty Red – Fan Edition', 650, 650, 699, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-2-1024x1024.png', 'JERSEYS', false, 'Support the team in style with the official fan edition jersey.', true),
('jer-003', 'a1-home-kit-signature-purple-player-edition', 'A1 Home Kit | Signature Purple – Player Edition', 800, 800, 849, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-8-1024x1024.png', 'JERSEYS', false, 'The iconic purple home kit worn by pros on stage.', true),
('jer-004', 'a1-home-kit-signature-purple-fan-edition', 'A1 Home Kit | Signature Purple – Fan Edition', 600, 600, 649, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-9-1024x1024.png', 'JERSEYS', false, 'Premium comfort for the ultimate A1ESPORTS fan.', true),
('acc-001', 'a1-pro-gaming-mousepad-xl', 'A1 Pro Gaming Mousepad – XL', 350, NULL, NULL, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-6-1024x1024.png', 'ACCESSORIES', false, 'Ultra-smooth tracking surface for precision gaming.', false),
('life-001', 'a1-stealth-tee-midnight-black', 'A1 Stealth Tee – Midnight Black', 450, NULL, NULL, 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-10-1024x1024.png', 'LIFESTYLE', false, 'Minimalist brand logo on premium 100% cotton tee.', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Teams
INSERT INTO public.teams (id, name, game, logo) VALUES
('pubgm-pro', 'A1 Esports Professional', 'PUBG Mobile', '/A1esports_logo_white.svg'),
('management', 'Management Team', 'Owner & Management', '/A1esports_logo_white.svg')
ON CONFLICT (id) DO NOTHING;

-- Insert Players
INSERT INTO public.players (id, team_id, ign, name, role, image, socials) VALUES
('p-1', 'pubgm-pro', 'SiNiSTER', 'MD Abdul Jabbar Shakil', 'IGL', '/images/players/SiNiSTER.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-2', 'pubgm-pro', 'ROWDY', 'Emon Sheikh', 'FRAGGER', '/images/players/ROWDY.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-3', 'pubgm-pro', 'DEATHSTORM', 'Hasan Mahmood', 'SNIPER', '/images/players/DEATHSTORM.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-4', 'pubgm-pro', 'CJBOYY', 'Tahmid Aronno', 'RUSHER', '/images/players/CJBOYY.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-5', 'pubgm-pro', 'FLASH', 'Tausif Rahman', 'SUPPORT', '/images/players/FLASH.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-6', 'management', 'MD Abdul Jabbar Shakil', 'SiNiSTER', 'Owner of A1 Esports', '/images/management/shakil.jpg', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-7', 'management', 'Srabon Shanto', 'Manager', 'Manager', '/images/management/srabon.jpg', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb),
('p-8', 'management', 'Dulal Shikdar', 'Owner of Zer0byte', 'Lead Developer', '/images/management/dulal.png', '{"facebook":"https://facebook.com/a1esportsbd"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert Achievements
INSERT INTO public.achievements (id, team_id, title, rank, event, year, date, tier, prize) VALUES
('ach-1', 'pubgm-pro', 'Champions', '1st', 'PMPL South Asia Spring 2023', '2023', '2023-05-10', 'A-Tier', '$10,000'),
('ach-2', 'pubgm-pro', 'Finalists', 'Top 16', 'PMGC 2022', '2022', '2022-12-15', 'S-Tier', '$25,000')
ON CONFLICT (id) DO NOTHING;

-- Insert Payment Methods
INSERT INTO public.payment_methods (id, name, type, account_number, instructions, is_active) VALUES
('pm-cod', 'Cash on Delivery', 'cod', '', 'Pay in cash upon delivery to your doorstep', true),
('pm-bkash', 'bKash', 'digital', '01700000000', 'Send Money (Personal) to 01700000000', true),
('pm-nagad', 'Nagad', 'digital', '01700000000', 'Send Money (Personal) to 01700000000', true),
('pm-rocket', 'Rocket', 'digital', '01700000000-7', 'Send Money (Personal) to 01700000000-7', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Coupon
INSERT INTO public.coupons (id, code, discount_type, discount_value, min_order_amount, is_active) VALUES
('cpn-a1welcome', 'A1WELCOME', 'fixed', 100, 500, true),
('cpn-a1esports10', 'A1ESPORTS10', 'percentage', 10, 1000, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Default Site Settings
INSERT INTO public.site_settings (key, value) VALUES
('delivery_charges', '{"inside_dhaka": 60, "outside_dhaka": 120}'::jsonb)
ON CONFLICT (key) DO NOTHING;

