import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  // Fetch site appearance settings for dynamic primary color
  const { data: appearanceSettings } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "site_appearance")
    .single();

  const primaryColor = appearanceSettings?.value?.primary_color;
  const secondaryColor = appearanceSettings?.value?.secondary_color;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
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
