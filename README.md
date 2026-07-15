# A1Esports

A modern, feature-rich esports organization website built with Next.js, featuring player showcases, team management, merchandise shop, and real-time content integration.

## Overview

A1Esports is a comprehensive web platform for esports organizations to showcase their teams, achievements, merchandise, and content. The platform integrates multiple external services to provide a seamless experience for fans and team members.

### Key Features

- **🏠 Home Page** - Hero section with featured content, social media statistics, player highlights, merchandise showcase, and competitive achievements
- **👥 Team Management** - View and manage esports teams with detailed player information
- **🛍️ Merchandise Shop** - Browse and manage team merchandise with product details and pricing
- **📊 Dashboard** - Admin panel for managing teams, products, achievements, and settings
- **🎮 Player Section** - Featured player profiles and statistics
- **📈 Social Integration** - Real-time social media statistics from YouTube and other platforms
- **🏆 Achievements** - Display competitive achievements fetched from Liquipedia
- **🎨 Dark/Light Mode** - Theme switching support for better user experience
- **⚡ Smooth Animations** - Modern UI interactions with Framer Motion

## Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router for modern, efficient server-side rendering
- **React 19** - Latest React for component-based UI
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, reusable React components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Icon library for UI elements
- **next-themes** - Easy theme switching (dark/light mode)

### Backend & Data
- **Supabase** - Backend-as-a-Service for database and authentication
- **Cheerio** - HTML parsing for web scraping
- **Liquipedia API** - Esports achievement data integration
- **YouTube API** - Social media statistics integration

### Development Tools
- **ESLint** - Code quality and consistency
- **Tailwind Merge** - Utility class merging
- **Class Variance Authority** - Component styling patterns

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0xDulal/A1esports.git
   cd A1esports
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env.local` file:
   ```env
   # YouTube API Configuration
   YOUTUBE_API_KEY=your_youtube_api_key_here
   YOUTUBE_CHANNEL_IDS=channel_url_1,channel_url_2

   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

Build for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### Linting

Check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Admin dashboard
│   │   ├── teams/               # Team management
│   │   ├── products/            # Merchandise management
│   │   ├── achievements/        # Achievement management
│   │   └── settings/            # Dashboard settings
│   ├── shop/                     # Merchandise shop
│   │   └── [slug]/              # Product detail page
│   ├── teams/                    # Teams showcase
│   ├── creators/                 # Creator profiles
│   ├── login/                    # Authentication page
│   ├── api/                      # API routes
│   │   ├── supabase/            # Database operations
│   │   └── youtube/             # YouTube API integration
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── home/                     # Homepage components
│   │   ├── Hero.tsx            # Hero section
│   │   ├── SocialGrid.tsx       # Social stats display
│   │   ├── Achievements.tsx     # Achievements section
│   │   ├── PlayerSection.tsx    # Player showcase
│   │   ├── Merchandise.tsx      # Merchandise preview
│   │   └── AboutUs.tsx          # About section
│   ├── layout/                   # Layout components
│   ├── shop/                     # Shop components
│   ├── ui/                       # shadcn/ui components
│   └── theme-provider.tsx        # Theme configuration
├── context/                      # React Context providers
├── lib/                          # Utility functions
│   ├── get-social-stats.ts      # Fetch social statistics
│   ├── liquipedia.ts            # Liquipedia API integration
│   └── [other utilities]
└── styles/                       # Additional stylesheets
```

## Key Features Explained

### Home Page (`src/app/page.tsx`)
- Displays hero banner with call-to-action
- Shows social media statistics (YouTube subscribers, followers)
- Features player highlights and profiles
- Showcases team merchandise
- Displays recent competitive achievements from Liquipedia

### Dashboard (`src/app/dashboard/`)
- Secure admin panel for team management
- Product/merchandise management
- Achievement tracking and updates
- User settings and configuration

### Shop (`src/app/shop/`)
- Browse merchandise products
- Product filtering and search
- Detailed product pages with images and pricing
- Integration with Supabase for inventory management

### API Routes (`src/app/api/`)
- Supabase integration endpoints
- YouTube channel statistics fetching
- Data aggregation and processing

## Environment Variables

Required environment variables for proper functionality:

| Variable | Description |
|----------|-------------|
| `YOUTUBE_API_KEY` | YouTube Data API key for fetching channel statistics |
| `YOUTUBE_CHANNEL_IDS` | Comma-separated list of YouTube channel URLs to track |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase URL (exposed to client) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key (exposed to client) |

## Integrations

### YouTube API
Fetches real-time channel statistics including:
- Subscriber counts
- Video view counts
- Channel activity metrics

### Liquipedia API
Retrieves esports achievements:
- Tournament results
- Team rankings
- Historical performance data

### Supabase
Handles:
- Database storage for teams, products, users
- Authentication and authorization
- Real-time data updates

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is private and owned by A1Esports organization.

## Support

For issues, questions, or suggestions, please reach out to the development team or create an issue in the repository.

## Roadmap

- [ ] Enhanced player statistics dashboard
- [ ] Real-time tournament tracking
- [ ] Community forums and discussion boards
- [ ] Fan engagement features
- [ ] Mobile app
- [ ] Advanced analytics and reporting

## Related Links

- [A1Esports Official Website](https://a1esportsbd.com)
- [YouTube Channel](https://www.youtube.com/@a1esportsbd)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)
