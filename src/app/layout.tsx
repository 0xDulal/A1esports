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

export const metadata: Metadata = {
  title: "A1ESPORTS - South Asia's Premier Esports Powerhouse",
  description: "Official website of A1ESPORTS. High-performance gaming, elite rosters, and exclusive merchandise.",
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

  return (
    <html lang="en" suppressHydrationWarning>
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
