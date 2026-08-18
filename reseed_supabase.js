const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fuzjxdnpxqpxvxjffykw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1emp4ZG5weHFweHZ4amZmeWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNTA2NDIsImV4cCI6MjA1NTkyNjY0Mn0.2rLw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function reseed() {
  console.log("Starting Supabase database reset & reseed...");

  const tables = [
    "orders",
    "products",
    "players",
    "achievements",
    "teams",
    "news_articles",
    "payment_methods",
    "coupons",
    "site_settings"
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).delete().neq("id", "none_never_match");
      if (error) {
        console.warn(`Note on truncating ${table}:`, error.message);
      } else {
        console.log(`Cleared table: ${table}`);
      }
    } catch (err) {
      console.warn(`Error truncating ${table}:`, err.message);
    }
  }

  // 1. Reseed Products
  console.log("Reseeding Products...");
  const products = [
    {
      id: 'jer-001',
      slug: 'a1-away-kit-beauty-red-player-edition',
      title: 'A1 Away Kit | Beauty Red – Player Edition',
      price: 850,
      half_sleeve_price: 850,
      full_sleeve_price: 899,
      image: 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png',
      images: ['https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png'],
      category: 'JERSEYS',
      is_sold_out: false,
      description: 'Official 2026 Season Away Kit. Lightweight, breathable, and optimized for extreme performance.',
      can_customise: true,
    },
    {
      id: 'jer-002',
      slug: 'a1-away-kit-beauty-red-fan-edition',
      title: 'A1 Away Kit | Beauty Red – Fan Edition',
      price: 650,
      half_sleeve_price: 650,
      full_sleeve_price: 699,
      image: 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-2-1024x1024.png',
      images: ['https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-2-1024x1024.png'],
      category: 'JERSEYS',
      is_sold_out: false,
      description: 'Support the team in style with the official fan edition jersey.',
      can_customise: true,
    },
    {
      id: 'jer-003',
      slug: 'a1-home-kit-signature-purple-player-edition',
      title: 'A1 Home Kit | Signature Purple – Player Edition',
      price: 800,
      half_sleeve_price: 800,
      full_sleeve_price: 849,
      image: 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-8-1024x1024.png',
      images: ['https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-8-1024x1024.png'],
      category: 'JERSEYS',
      is_sold_out: false,
      description: 'The iconic purple home kit worn by pros on stage.',
      can_customise: true,
    },
    {
      id: 'jer-004',
      slug: 'a1-home-kit-signature-purple-fan-edition',
      title: 'A1 Home Kit | Signature Purple – Fan Edition',
      price: 600,
      half_sleeve_price: 600,
      full_sleeve_price: 649,
      image: 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-9-1024x1024.png',
      images: ['https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-9-1024x1024.png'],
      category: 'JERSEYS',
      is_sold_out: false,
      description: 'Premium comfort for the ultimate A1ESPORTS fan.',
      can_customise: true,
    },
    {
      id: 'acc-001',
      slug: 'a1-pro-gaming-mousepad-xl',
      title: 'A1 Pro Gaming Mousepad – XL',
      price: 350,
      image: 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-6-1024x1024.png',
      images: ['https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-6-1024x1024.png'],
      category: 'ACCESSORIES',
      is_sold_out: false,
      description: 'Ultra-smooth tracking surface for precision gaming.',
      can_customise: false,
    },
    {
      id: 'life-001',
      slug: 'a1-stealth-tee-midnight-black',
      title: 'A1 Stealth Tee – Midnight Black',
      price: 450,
      image: 'https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-10-1024x1024.png',
      images: ['https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-10-1024x1024.png'],
      category: 'LIFESTYLE',
      is_sold_out: false,
      description: 'Minimalist brand logo on premium 100% cotton tee.',
      can_customise: false,
    }
  ];

  await supabase.from("products").upsert(products);

  // 2. Reseed Teams & Players
  console.log("Reseeding Teams & Players...");
  const teams = [
    { id: 'pubgm-pro', name: 'A1 Esports Professional', game: 'PUBG Mobile', logo: '/A1esports_logo_white.svg' },
    { id: 'management', name: 'Management Team', game: 'Owner & Management', logo: '/A1esports_logo_white.svg' }
  ];
  await supabase.from("teams").upsert(teams);

  const players = [
    { id: 'p-1', team_id: 'pubgm-pro', ign: 'SiNiSTER', name: 'MD Abdul Jabbar Shakil', role: 'IGL', image: '/images/players/SiNiSTER.png' },
    { id: 'p-2', team_id: 'pubgm-pro', ign: 'ROWDY', name: 'Emon Sheikh', role: 'FRAGGER', image: '/images/players/ROWDY.png' },
    { id: 'p-3', team_id: 'pubgm-pro', ign: 'DEATHSTORM', name: 'Hasan Mahmood', role: 'SNIPER', image: '/images/players/DEATHSTORM.png' },
    { id: 'p-4', team_id: 'pubgm-pro', ign: 'CJBOYY', name: 'Tahmid Aronno', role: 'RUSHER', image: '/images/players/CJBOYY.png' },
    { id: 'p-5', team_id: 'pubgm-pro', ign: 'FLASH', name: 'Tausif Rahman', role: 'SUPPORT', image: '/images/players/FLASH.png' },
    { id: 'p-6', team_id: 'management', ign: 'SiNiSTER', name: 'MD Abdul Jabbar Shakil', role: 'Owner of A1 Esports', image: '/images/management/shakil.jpg' },
    { id: 'p-7', team_id: 'management', ign: 'Manager', name: 'Srabon Shanto', role: 'Manager', image: '/images/management/srabon.jpg' },
    { id: 'p-8', team_id: 'management', ign: 'Lead Developer', name: 'Dulal Shikdar', role: 'Owner of Zer0byte', image: '/images/management/dulal.png' }
  ];
  await supabase.from("players").upsert(players);

  // 3. Reseed Payment Methods
  console.log("Reseeding Payment Methods...");
  const paymentMethods = [
    { id: 'pm-cod', name: 'Cash on Delivery', type: 'cod', account_number: '', instructions: 'Pay in cash upon delivery to your doorstep', is_active: true },
    { id: 'pm-bkash', name: 'bKash', type: 'digital', account_number: '01700000000', instructions: 'Send Money (Personal) to 01700000000', is_active: true },
    { id: 'pm-nagad', name: 'Nagad', type: 'digital', account_number: '01700000000', instructions: 'Send Money (Personal) to 01700000000', is_active: true },
    { id: 'pm-rocket', name: 'Rocket', type: 'digital', account_number: '01700000000-7', instructions: 'Send Money (Personal) to 01700000000-7', is_active: true }
  ];
  await supabase.from("payment_methods").upsert(paymentMethods);

  // 4. Reseed Coupons
  console.log("Reseeding Coupons...");
  const coupons = [
    { id: 'cpn-winnerpmc', code: 'WINNERPMC', discount_type: 'percentage', discount_value: 100, min_order_amount: 0, max_uses: 3, uses_count: 0, is_active: true },
    { id: 'cpn-a1welcome', code: 'A1WELCOME', discount_type: 'fixed', discount_value: 100, min_order_amount: 500, max_uses: null, uses_count: 0, is_active: true },
    { id: 'cpn-a1esports10', code: 'A1ESPORTS10', discount_type: 'percentage', discount_value: 10, min_order_amount: 1000, max_uses: null, uses_count: 0, is_active: true }
  ];
  await supabase.from("coupons").upsert(coupons);

  // 5. Reseed Site Settings
  console.log("Reseeding Site Settings...");
  await supabase.from("site_settings").upsert([
    { key: "delivery_charges", value: { inside_dhaka: 60, outside_dhaka: 120 } }
  ]);

  console.log("Successfully reset and reseeded all Supabase tables!");
}

reseed().catch(err => console.error("Reseed failed:", err));
