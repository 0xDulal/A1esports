export const revalidate = 0;
import type { Metadata } from "next";
import { Geist, Geist_Mono, Michroma } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const michroma = Michroma({
  weight: "400",
  variable: "--font-michroma",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://a1esportsbd.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "A1 ESPORTS | South Asia's Premier Esports Powerhouse",
    template: "%s | A1 ESPORTS",
  },
  description:
    "Official digital headquarters of A1 Esports BD. Follow professional PUBG Mobile rosters, Liquipedia tournament records, live streams, and buy official jerseys & merchandise.",
  keywords: [
    "A1 Esports",
    "A1 Esports BD",
    "PUBG Mobile Bangladesh",
    "PMNC Champions",
    "Esports South Asia",
    "A1 Jersey",
    "Esports Merchandise Bangladesh",
    "PUBG Mobile Pro Team",
  ],
  authors: [{ name: "A1 Esports", url: siteUrl }],
  creator: "A1 Esports",
  publisher: "A1 Esports BD",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "A1 ESPORTS | South Asia's Premier Esports Powerhouse",
    description:
      "Official digital headquarters of A1 Esports BD. Pro rosters, championship records, official merchandise, and live broadcasts.",
    url: siteUrl,
    siteName: "A1 ESPORTS",
    images: [
      {
        url: "/images/regular/a1team.jpg",
        width: 1200,
        height: 630,
        alt: "A1 Esports Championship Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A1 ESPORTS | South Asia's Premier Esports Powerhouse",
    description:
      "Official website of A1 Esports BD. High-performance gaming, elite rosters, and official merchandise.",
    images: ["/images/regular/a1team.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CustomizationModal } from "@/components/shop/CustomizationModal";
import { Toaster } from "sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site appearance settings for dynamic primary color safely
  let appearanceSettings = null;
  try {
    const res = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "site_appearance")
      .single();
    appearanceSettings = res.data;
  } catch {
    // Graceful fallback during build or offline
  }

  const primaryColor = appearanceSettings?.value?.primary_color;
  const secondaryColor = appearanceSettings?.value?.secondary_color;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "A1 Esports",
    alternateName: ["A1 Esports BD", "A1 RG Esports"],
    url: siteUrl,
    logo: `${siteUrl}/A1esports_logo_white.svg`,
    image: `${siteUrl}/images/regular/a1team.jpg`,
    description:
      "South Asia's premier esports powerhouse competing in Tier-1 PUBG Mobile tournaments globally.",
    foundingDate: "2020",
    sport: "PUBG Mobile",
    sameAs: [
      "https://facebook.com/a1esportsbd",
      "https://instagram.com/a1esports.bd",
      "https://youtube.com/@a1esportsbd",
      "https://discord.gg/EKRQMA83",
      "https://liquipedia.net/pubgmobile/A1_RG_Esports",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@a1esportsbd.com",
      contactType: "customer service",
      availableLanguage: ["English", "Bengali"],
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${michroma.variable} antialiased`}
        suppressHydrationWarning
      >
        <div dangerouslySetInnerHTML={{ __html: `<!--
THESIS: A premium, precision-engineered esports experience treating the team as high-end hardware, avoiding generic templates entirely.
OWN-WORLD: Matte dark charcoal ground, rigid grids, technical schematics, and precise UV spot gloss (Purple) for interactive states and highlights.
STORY: Fans explore the organization's roster, achievements, and merchandise with the reverence of unboxing top-tier technical equipment.
FIRST VIEWPORT: The existing hero section is preserved, while all subsequent sections use a strict, high-end hardware spec-sheet grid.
FORM: The High-End Hardware Box (Option 1)
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->` }} />
        {(primaryColor || secondaryColor) && (
          <style dangerouslySetInnerHTML={{ __html: `
            :root, .dark {
              ${primaryColor ? `--primary: ${primaryColor} !important;` : ''}
              ${secondaryColor ? `--secondary: ${secondaryColor} !important;` : ''}
            }
          `}} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <CartDrawer />
            <CustomizationModal />
            <Toaster theme="dark" position="bottom-right" richColors />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
