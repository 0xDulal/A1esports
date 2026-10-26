<div align="center">

  <img src="public/A1esports_logo_white.svg" alt="A1 Esports Logo" width="96" height="96" />

  # A1 ESPORTS
  ### South Asia's Premier Esports Powerhouse

  [![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React-19-black?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-black?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-black?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-black?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)

  <p align="center">
    A high-precision web platform engineered with a tactical hardware aesthetic. Built for competitive telemetry, official merchandise customization, live tournament data, and full-spectrum organizational operations.
  </p>

</div>

---

## ⚡ System Highlights

- **Hardware Spec Aesthetic:** Precision-engineered cyber-tactical layout inspired by high-end hardware spec sheets — matte carbon backdrops, micro-grid schematics, and reactive UV glow accents.
- **Liquipedia Tournament Engine:** Direct integration with official Liquipedia records, featuring real-time placement filters, tier breakdowns (S/A/B-Tier), and verified prize records.
- **Kit Customizer & Storefront:** Custom esports jersey configuration engine with live IGN name-tagger, half/full-sleeve dynamic pricing, and mobile checkout with payment slip upload.
- **Broadcast Telemetry HUD:** Automated background polling for YouTube Live streams with a real-time header broadcast ticker.
- **Mission Control CMS:** Secure Supabase-backed admin suite to orchestrate team rosters, product drops, tournament logs, media vault assets, and coupon engines.

---

## 🎛️ Core Systems

```
                              ┌──  Public Portal  ────────┐
                              │  /          • Homepage    │
                              │  /teams     • Divisions   │
                              │  /history   • Bento Grid  │
                              │  /shop      • Storefront  │
                              │  /apply     • Scouting    │
                              └───────────────────────────┘
                                            │
                                            ▼
┌──  Telemetry & APIs  ──┐       ┌──  Application Core  ──┐       ┌──  Command Center  ──┐
│  • YouTube Live Ping   │  ──▶  │  Next.js 15 (App Router│  ◀──  │  /dashboard (Auth)   │
│  • Liquipedia Engine   │       │  Tailwind CSS v4       │       │  • Orders & Inventory│
│  • Supabase RLS API    │       │  Framer Motion Engine  │       │  • Rosters & CMS     │
└────────────────────────┘       └────────────────────────┘       └───────────────────────┘
```

### 1. Competitive Databanks
- **Interactive Legacy Roadmap:** Bento-grid architecture cataloging 6+ years of dynasty achievements, PMNC national championships, and PMGC World Finals milestones.
- **Active Divisions Showcase:** High-impact tactical player roster cards with live status monitors, role indicators (IGL, Fragger, Sniper), and player social links.

### 2. Official Commerce & Customizer
- **Jersey Personalization Protocol:** In-browser nameplate applicator for customized team jerseys with size matrices (XS–3XL) and sleeve toggle pricing.
- **Localized Checkout Pipeline:** Built for South Asian logistics with district-level shipping calculators and multi-channel payment verification (bKash / Nagad / COD).

### 3. Broadcast & Telemetry
- **Channel Health Poller:** Server-side YouTube API poller alerting fans when A1 broadcast units go live worldwide.

---

## 🛠️ Tech Stack & Specs

| Subsystem | Stack |
|---|---|
| **Core Runtime** | Next.js 15 (React 19, Server Components & Actions) |
| **Styling & Tokens** | Tailwind CSS v4, OKLCH color spaces, custom CSS hardware grids |
| **Typography** | `Michroma` (Display Headers), `Geist Sans` (UI), `Geist Mono` (Telemetry & Specs) |
| **Motion Engine** | Framer Motion (Hardware reveal transitions, smooth layout orchestration) |
| **Persistence & Auth** | Supabase PostgreSQL, Row Level Security (RLS), Supabase Storage |
| **State & Notifications** | React Context (`CartContext`), Sonner Toasts |

---

## 🚀 Deployment & Operations

### 1. Prerequisites
- **Node.js:** `^18.17.0` or `>=20.0.0`
- **Package Manager:** `npm` (or `pnpm`)

### 2. Environment Setup

Create `.env.local` in project root:

```ini
# Supabase Backend
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# YouTube Telemetry API
YOUTUBE_API_KEY=your-google-api-key
YOUTUBE_CHANNEL_IDS=https://www.youtube.com/@a1esportsbd
```

### 3. Execution Commands

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Compile optimized production artifact
npm run build

# Start production server
npm run start
```

---

<div align="center">
  <sub>Engineered for high performance. © 2026 A1 Esports. All rights reserved.</sub>
</div>
