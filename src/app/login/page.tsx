"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      try {
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 800));
        const userPromise = supabase.auth.getUser();
        const res: any = await Promise.race([userPromise, timeoutPromise]);

        if (mounted && res?.data?.user) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Auth session check error:", err);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    };

    checkUser();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Checking Auth Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-950/80 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl relative z-10 shadow-[0_0_50px_rgba(255,0,102,0.1)] space-y-6">
        <div className="text-center space-y-3">
          <div className="relative h-16 w-16 mx-auto">
            <Image
              src="/A1esports_logo_white.svg"
              alt="A1ESPORTS"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-widest mb-2">
              <ShieldCheck size={12} />
              A1 Admin Control Center
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Sign In</h1>
            <p className="text-neutral-400 text-xs mt-1">
              Enter your official admin credentials to access the dashboard
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block font-bold mb-1.5 text-neutral-300 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@a1esportsbd.com"
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary text-sm font-medium"
                required
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-neutral-500" />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1.5 text-neutral-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary text-sm font-medium"
                required
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-neutral-500" />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-xs font-bold p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,0,102,0.2)] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In To Dashboard"}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}
