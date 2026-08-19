-- ====================================================================
-- A1 ESPORTS — SAFE TRUNCATE ALL DATABASE TABLES & RESET SEED DATA
-- Copy and paste this script in Supabase Dashboard -> SQL Editor to clear existing data safely
-- ====================================================================

DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'orders', 'products', 'players', 'achievements', 'teams', 
            'news_articles', 'payment_methods', 'coupons', 'site_settings', 
            'sponsors', 'investors'
          )
    ) LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
