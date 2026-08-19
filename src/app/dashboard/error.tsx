"use client";

import { useEffect } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Boundary Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-md text-center space-y-5">
        <div className="h-12 w-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Admin Section Error</h3>
          <p className="text-xs text-neutral-400">
            Failed to render dashboard view. Check network connection or Supabase status.
          </p>
        </div>

        <Button
          onClick={() => reset()}
          className="bg-primary text-black font-bold hover:bg-primary/90 transition-colors w-full"
        >
          <RefreshCw size={16} className="mr-2" /> Reload Section
        </Button>
      </div>
    </div>
  );
}
