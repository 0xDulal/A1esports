"use client";

import Link from "next/link";
import { Home, ShoppingBag, Users, Trophy, Settings, LayoutDashboard, LogOut, Package, Handshake, TrendingUp } from "lucide-react";
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="relative h-16 w-16 animate-pulse">
          <img src="/A1esports_logo_white.svg" alt="A1 Esports" className="object-contain" />
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
          Authenticating Admin Session...
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
