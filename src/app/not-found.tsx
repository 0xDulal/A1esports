"use client";

import Link from "next/link";
import { ShieldAlert, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black pointer-events-none" />

      <div className="relative z-10 max-w-md text-center space-y-6 bg-neutral-900/80 border border-white/10 p-10 md:p-14 rounded-3xl backdrop-blur-xl">
        <div className="h-20 w-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
          <ShieldAlert size={44} />
        </div>

        <div className="space-y-2">
          <span className="text-primary font-black text-xs uppercase tracking-[0.3em] italic">404 Error</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Page Not Found</h1>
          <p className="text-neutral-400 text-sm">
            The page or match you are looking for has expired, moved, or does not exist.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild variant="primary" size="md">
            <Link href="/">
              <Home size={14} /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/shop">
              <ShoppingBag size={14} /> Visit Store
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
