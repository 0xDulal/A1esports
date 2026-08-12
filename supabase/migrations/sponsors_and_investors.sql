-- ========================================================
-- A1 Esports Supabase Schema Migration: Sponsors & Investors
-- ========================================================

-- 1. Create Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    badge TEXT NOT NULL,
    description TEXT NOT NULL,
    logo TEXT NOT NULL,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Investors Table
CREATE TABLE IF NOT EXISTS public.investors (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    metric TEXT NOT NULL,
    description TEXT NOT NULL,
    logo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS Security Policies
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Allow all access to sponsors" ON public.sponsors;
CREATE POLICY "Allow public read sponsors" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Allow all access to sponsors" ON public.sponsors FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read investors" ON public.investors;
DROP POLICY IF EXISTS "Allow all access to investors" ON public.investors;
CREATE POLICY "Allow public read investors" ON public.investors FOR SELECT USING (true);
CREATE POLICY "Allow all access to investors" ON public.investors FOR ALL USING (true);

-- 4. Seed Initial Sponsors
INSERT INTO public.sponsors (id, name, category, badge, description, logo, website_url) VALUES
('sp-1', 'Airtel Bangladesh', 'Title & Telecom Partner', 'Official Sponsor', 'Empowering fast 4G/5G connectivity and supporting competitive esports events across Bangladesh.', 'AIRTEL', 'https://bd.airtel.com'),
('sp-2', 'ROG - Republic of Gamers', 'Hardware & Device Partner', 'Gear Partner', 'Providing high-performance gaming hardware, monitors, and laptops for A1 bootcamps and stage setups.', 'ROG', 'https://rog.asus.com'),
('sp-3', 'Red Bull', 'Energy Drink Partner', 'Official Partner', 'Fueling the focus, stamina, and training of A1 Esports pro athletes.', 'RED BULL', 'https://redbull.com'),
('sp-4', 'Logitech G', 'Peripherals Partner', 'Official Partner', 'Equipping our athletes with LIGHTSPEED wireless gaming mice and mechanical keyboards.', 'LOGITECH G', 'https://logitechg.com')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Initial Investors
INSERT INTO public.investors (id, title, category, metric, description, logo) VALUES
('inv-1', 'South Asian Market Leader', 'Market Position', '1.5M+ Fans', 'Commanding the region''s largest fan engagement in PUBG Mobile, with expanding operations in regional leagues.', ''),
('inv-2', 'Multi-Channel Revenue Model', 'Financials', '4 Revenue Streams', 'Diversified revenue model spanning e-commerce merchandise, brand sponsorships, tournament prize pools, and digital content.', ''),
('inv-3', 'Bootcamp & HQ Infrastructure', 'Assets', 'Dhaka HQ', 'Dedicated pro bootcamps, media production facilities, and strategic infrastructure in Dhaka.', '')
ON CONFLICT (id) DO NOTHING;
