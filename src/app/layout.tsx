import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "A1ESPORTS - South Asia's Premier Esports Powerhouse",
  description: "Official website of A1ESPORTS. High-performance gaming, elite rosters, and exclusive merchandise.",
};

import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CustomizationModal } from "@/components/shop/CustomizationModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Header />
            {children}
            <CartDrawer />
            <CustomizationModal />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
