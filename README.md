# A1 Esports — Official Website

> **South Asia's Premier Esports Powerhouse**
> Official website for A1 Esports BD — featuring team rosters, official merchandise, live stream integration, and an admin dashboard.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React, React Icons |
| **Database / Auth** | [Supabase](https://supabase.com/) |
| **UI Components** | Radix UI / Shadcn |
| **Font** | Geist (Next.js built-in) |

---

## 📁 Project Structure

```
d:/A1esports/
├── public/
│   ├── A1esports_logo_white.svg        # Main brand logo
│   ├── images/
│   │   ├── HeroImage.png               # Hero section team image
│   │   ├── players/                    # Player profile images (SiNiSTER, ROWDY, etc.)
│   │   ├── management/                 # Management team photos
│   │   └── regular/                    # General images (a1team.jpg)
│   └── videos/
│       └── bgvideo.mp4                 # Hero section background video
│
├── src/
│   ├── app/                            # Next.js App Router pages
│   │   ├── page.tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout (Header, Footer, Cart)
│   │   ├── globals.css                 # Global styles + Tailwind tokens
│   │   ├── login/page.tsx              # Admin login
│   │   ├── teams/page.tsx              # Teams showcase page
│   │   ├── shop/
│   │   │   ├── page.tsx                # Shop listing
│   │   │   └── [slug]/page.tsx         # Product detail
│   │   ├── dashboard/                  # Protected admin dashboard
│   │   │   ├── layout.tsx              # Dashboard sidebar layout
│   │   │   ├── page.tsx                # Dashboard overview
│   │   │   ├── products/page.tsx       # Manage products
│   │   │   ├── teams/page.tsx          # Manage teams
│   │   │   ├── achievements/page.tsx   # Manage achievements
│   │   │   └── settings/page.tsx       # Admin settings
│   │   └── api/
│   │       ├── youtube/live/route.ts   # YouTube live stream API
│   │       └── supabase/health/route.ts # Supabase health check
│   │
│   ├── components/
│   │   ├── home/                       # Homepage section components
│   │   │   ├── Hero.tsx
│   │   │   ├── AboutUs.tsx
│   │   │   ├── SocialGrid.tsx
│   │   │   ├── PlayerSection.tsx
│   │   │   ├── Merchandise.tsx
│   │   │   └── Achievements.tsx
│   │   ├── layout/                     # Global layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── shop/                       # Shop-specific components
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CustomizationModal.tsx
│   │   └── ui/                         # Reusable UI components
│   │       ├── A1Button.tsx
│   │       ├── PlayerCard.tsx
│   │       ├── ProductCard.tsx
│   │       ├── Section.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── GlowBar.tsx
│   │       ├── button.tsx              # Shadcn Button
│   │       ├── dialog.tsx              # Shadcn Dialog
│   │       ├── input.tsx               # Shadcn Input
│   │       └── sheet.tsx               # Shadcn Sheet (drawer)
│   │
│   ├── context/
│   │   └── CartContext.tsx             # Global cart state
│   │
│   └── lib/
│       ├── teams.ts                    # Team & player static data + types
│       ├── liquipedia.ts               # Achievements data (static)
│       ├── get-social-stats.ts         # YouTube API subscriber fetch
│       ├── utils.ts                    # `cn()` utility
│       ├── data/
│       │   └── shop.ts                 # Product data + types
│       └── supabase/
│           ├── client.ts               # Supabase browser client
│           └── rest.ts                 # Supabase REST helpers
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd A1esports

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file (or edit `.env`) with the following:

```env
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_IDS=https://www.youtube.com/@a1esportsbd

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **Note:** The current `.env` uses `SUPABASE_PUBLISHABLE_KEY` instead of `SUPABASE_ANON_KEY`. The Supabase JS SDK requires `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This must be corrected for authentication to work.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Pages & Routes

| Route | Description | Status |
|---|---|---|
| `/` | Homepage with hero, about, social, players, merch, achievements | ✅ Live |
| `/teams` | Full team roster showcase (PUBG Mobile Pro + Management) | ✅ Live |
| `/shop` | Merchandise shop with category filters | ✅ Live |
| `/shop/[slug]` | Individual product detail page | ✅ Live |
| `/login` | Admin login (Supabase auth) | ✅ Live |
| `/dashboard` | Admin dashboard overview | ✅ Live |
| `/dashboard/products` | Manage shop products | ⚠️ Display only |
| `/dashboard/teams` | Manage teams & players | ⚠️ Display only |
| `/dashboard/achievements` | Manage tournament achievements | ⚠️ Display only |
| `/dashboard/settings` | Admin settings | ⚠️ UI only |
| `/checkout` | Order checkout | ❌ Not built |
| `/news` | News & blog | ❌ Not built |
| `/contact` | Contact form | ❌ Not built |

---

## 🛒 Shop Features

- **Product Categories:** Jerseys, Hoodies, Lifestyle, Accessories
- **Sorting:** Featured, Price Low-to-High, Price High-to-Low
- **Customization:** Add player name on jerseys (free customization)
- **Sleeve Variants:** Half sleeve / Full sleeve pricing
- **Cart:** Persistent localStorage cart with quantity management
- **Currency:** BDT (Bangladeshi Taka)

---

## 🔐 Admin Dashboard

Access the admin panel at `/login`.

**Capabilities:**
- View overview stats (products, players, teams, revenue)
- Browse product listings
- Browse team rosters
- View achievement records
- ⚠️ *CRUD operations (Add/Edit/Delete) are not yet wired to the database*

---

## 🌐 API Endpoints

### `GET /api/youtube/live`

Checks if a configured YouTube channel is currently live streaming.

**Response:**
```json
{
  "live": false,
  "stream": null,
  "latest": [
    { "title": "...", "url": "...", "videoId": "..." }
  ]
}
```

Configure the channel via `YOUTUBE_CHANNEL_IDS` env var (supports handles like `@a1esportsbd` or full URLs).

### `GET /api/supabase/health`

Returns Supabase connection status.

---

## 🎨 Design System

The site uses a custom design system built on Tailwind CSS v4 with the following tokens:

- **Primary Color:** `var(--primary)` — A1 Red/Crimson
- **Background:** Pure black `#050505`
- **Typography:** Geist Sans / Geist Mono
- **Theme:** Dark mode (default), supports system preference

Key design patterns:
- Glassmorphism cards (`backdrop-blur`, `bg-white/10`)
- Animated counters (Framer Motion springs)
- Scroll-reveal animations (`whileInView`)
- Glow effects (`shadow-[0_0_40px_rgba(255,0,102,0.1)]`)

---

## 🧩 Key Components

### `CartContext`
Global cart state provider. Manages items, quantities, totals, and the customization modal state. Persists to `localStorage`.

### `Header`
Sticky navigation with:
- Desktop multi-level nav
- Mobile sheet menu
- YouTube live/latest video ticker
- Cart item count badge

### `ProductCard`
Displays product with hover effects, sold-out state, price, and Add to Cart / Customize buttons.

### `CustomizationModal`
Jersey personalization flow — select size (XS–3XL), sleeve type (half/full), and custom name.

### `CartDrawer`
Side panel cart with line items, quantity controls, subtotal, and checkout button.

---

## 👥 Teams

### A1 Esports Professional (PUBG Mobile)
| IGN | Real Name | Role |
|---|---|---|
| SiNiSTER | MD Abdul Jabbar Shakil | IGL |
| ROWDY | Emon Sheikh | Fragger |
| DEATHSTORM | Hasan Mahmood | Sniper |
| CJBOYY | Tahmid Aronno | Rusher |
| FLASH | Tausif Rahman | Support |

### Management
| Name | Role |
|---|---|
| MD Abdul Jabbar Shakil | Owner |
| Srabon Shanto | Manager |
| Dulal Shikdar | Lead Developer |

---

## 🔗 Social Media

| Platform | Handle |
|---|---|
| Facebook | [@a1esportsbd](https://facebook.com/a1esportsbd) |
| Instagram | [@a1esports.bd](https://www.instagram.com/a1esports.bd) |
| YouTube | [@a1esportsbd](https://youtube.com/@a1esportsbd) |
| Discord | [discord.gg/EKRQMA83](https://discord.gg/EKRQMA83) |

---

## 🗓️ Roadmap

### Phase 1 — Critical (In Progress)
- [ ] Fix Supabase ANON key configuration
- [ ] Create Supabase database tables
- [ ] Build `/checkout` page with order form
- [ ] Wire Admin dashboard to Supabase (CRUD)

### Phase 2 — Important
- [ ] Order management in Admin dashboard
- [ ] News / Blog pages
- [ ] Contact page
- [ ] Player application / tryout form

### Phase 3 — Polish
- [ ] More product listings (hoodies category)
- [ ] SEO metadata per page
- [ ] Custom 404 page
- [ ] Search functionality
- [ ] Privacy Policy and Terms of Service pages

---

## 👨‍💻 Development

Built by **Zer0byte** for A1 Esports BD.

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

*© 2026 A1 Esports. All rights reserved.*
