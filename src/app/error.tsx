"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg text-center space-y-6 shadow-2xl">
        <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-500">
          <AlertTriangle size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-red-400 font-bold text-xs uppercase tracking-widest">Application Error</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Something Went Wrong</h2>
          <p className="text-sm text-neutral-400">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={() => reset()}>
            <RefreshCw size={14} /> Try Again
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/">
              <Home size={14} /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
