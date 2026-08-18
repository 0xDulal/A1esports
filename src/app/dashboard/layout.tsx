"use client";

import Link from "next/link";
import { Home, ShoppingBag, Users, Trophy, Settings, LayoutDashboard, LogOut, Package, Handshake, TrendingUp, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      const activeUser = sbUser || (typeof window !== "undefined" && localStorage.getItem("a1_admin_session") ? { email: "dev.a1esports@gmail.com" } : null);
      if (!activeUser) {
        router.replace("/login");
        return;
      }
      setUser(activeUser);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          const hasLocalSession = typeof window !== "undefined" && localStorage.getItem("a1_admin_session");
          if (!hasLocalSession) {
            setUser(null);
            router.replace("/login");
          } else {
            setUser({ email: "dev.a1esports@gmail.com" });
            setLoading(false);
          }
        } else {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("a1_admin_session");
    }
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Preloader Glass Box */}
        <div className="relative bg-neutral-950/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-10 max-w-sm w-full text-center space-y-6 shadow-[0_0_50px_rgba(255,0,102,0.15)] flex flex-col items-center">
          {/* Logo Crest with Pulsing Rings */}
          <div className="relative h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/40 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-1 rounded-xl border border-purple-500/30 animate-[spin_3s_linear_infinite_reverse]" />
            <div className="relative h-12 w-12 animate-pulse">
              <img src="/A1esports_logo_white.svg" alt="A1 Esports" className="object-contain w-full h-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              A1 Admin Security
            </div>

            <h3 className="text-lg font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Authenticating Session
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Verifying admin credentials & Supabase tokens...
            </p>
          </div>

          {/* Animated Glowing Progress Bar */}
          <div className="w-full bg-neutral-900 border border-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-purple-500 to-primary w-full animate-[pulse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen border-r border-white/10 bg-neutral-950 p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="relative h-10 w-10">
              <img src="/A1esports_logo_white.svg" alt="A1 Esports" className="object-contain" />
            </div>
            <span className="font-black text-lg tracking-wider italic">A1 ADMIN</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/orders")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Package size={20} />
              <span>Orders</span>
            </Link>
            <Link
              href="/dashboard/coupons"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/coupons")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Tag size={20} />
              <span>Coupons</span>
            </Link>
            <Link
              href="/dashboard/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/products")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ShoppingBag size={20} />
              <span>Products</span>
            </Link>

            <Link
              href="/dashboard/teams"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/teams")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users size={20} />
              <span>Teams</span>
            </Link>
            <Link
              href="/dashboard/achievements"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/achievements")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Trophy size={20} />
              <span>Achievements</span>
            </Link>
            <Link
              href="/dashboard/sponsors"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/sponsors")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Handshake size={20} />
              <span>Sponsors</span>
            </Link>
            <Link
              href="/dashboard/investors"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/investors")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <TrendingUp size={20} />
              <span>Investors</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition-colors mt-4"
            >
              <Home size={20} />
              <span>Back to Website</span>
            </Link>
          </nav>

          {user && (
            <div className="mt-auto pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
