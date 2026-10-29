"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      try {
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 800));
        const userPromise = supabase.auth.getUser();
        const res: any = await Promise.race([userPromise, timeoutPromise]);
        const sbUser = res?.data?.user;

        if (!sbUser && mounted) {
          router.replace("/login");
          return;
        }
        if (mounted && sbUser) {
          setUser(sbUser);
          setLoading(false);
        }
      } catch {
        if (mounted) router.replace("/login");
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setUser(null);
          router.replace("/login");
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
    await supabase.auth.signOut();
    router.replace("/login");
  };

    if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-sm blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-sm blur-[90px] pointer-events-none" />

        {/* Preloader Glass Box */}
        <div className="relative bg-[#0a0a0a] border border-white/10 backdrop-blur-2xl rounded-sm p-10 max-w-sm w-full text-center space-y-6 shadow-[0_0_50px_rgba(255,0,102,0.15)] flex flex-col items-center">
          <div className="relative h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-sm border-2 border-primary/40 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-1 rounded-sm border border-purple-500/30 animate-[spin_3s_linear_infinite_reverse]" />
            <div className="relative h-12 w-12 animate-pulse">
              <img src="/A1esports_logo_white.svg" alt="A1 Esports" className="object-contain w-full h-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-sm text-[10px] font-black uppercase text-primary tracking-widest">
              <span className="h-1.5 w-1.5 rounded-sm bg-primary animate-ping" />
              A1 Admin Security
            </div>

            <h3 className="text-lg font-michroma uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Authenticating Session
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Verifying admin credentials & Supabase tokens...
            </p>
          </div>

          <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary w-full animate-[pulse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">
        <DashboardSidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Mobile Header Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0a0a0a] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/A1esports_logo_white.svg" alt="A1 Esports" className="h-8 w-8 object-contain" />
          <span className="font-michroma text-base tracking-wider uppercase">A1 ADMIN</span>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-sm">
              <Menu size={22} />
              <span className="sr-only">Toggle Dashboard Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#0a0a0a] border-r border-white/10 p-0 w-full sm:max-w-sm">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
            <SheetDescription className="sr-only">Admin dashboard navigation links</SheetDescription>
            <DashboardSidebar mobile user={user} onLogout={handleLogout} onLinkClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden max-w-[1600px] w-full mx-auto">{children}</main>
    </div>
  );
}
