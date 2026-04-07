"use client";
import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function Header() {
  const pathname = usePathname();
  const { itemCount, setIsOpen } = useCart();
  const [liveData, setLiveData] = useState<{
    live: boolean;
    stream: { title: string; url: string } | null;
    latest?: { title: string; url: string }[];
  }>({ live: false, stream: null, latest: [] });
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    let mounted = true;
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/youtube/live", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setLiveData(json);
      } catch {}
    };
    fetchLive();
    const id = setInterval(fetchLive, 60000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);
  useEffect(() => {
    if (!liveData?.latest || liveData.latest.length < 2 || liveData.live) return;
    const id = setInterval(() => {
      setIdx((v) => (v + 1) % (liveData.latest?.length || 1));
    }, 30000);
    return () => clearInterval(id);
  }, [liveData.live, liveData.latest]);
  const currentLatest = useMemo(() => {
    const list = liveData?.latest || [];
    if (list.length === 0) return null;
    return list[idx % list.length];
  }, [liveData.latest, idx]);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background text-foreground">
      <div className="flex h-16 lg:h-24">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex w-20 shrink-0 items-center justify-center border-r border-border bg-background lg:w-64 lg:justify-center lg:gap-2"
        >
          <div className="relative h-10 w-10 lg:h-12 lg:w-12">
            <Image
              src="/A1esports_logo_white.svg"
              alt="A1 Esports Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 40px, 48px"
            />
          </div>
          <span className="hidden text-xl font-black tracking-[0.2em] lg:block font-sans italic">
            A1ESPORTS
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex flex-1 flex-col">
          {/* Top Bar */}
          <div className="hidden h-10 items-center justify-between border-b border-border px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground lg:flex">
            <nav className="flex gap-8">
              <Link href="#" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                History
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Championships
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Sponsors
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Investors
              </Link>
            </nav>
            {liveData.live && liveData.stream ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-bold text-foreground">LIVE NOW</span>
                </div>
                <span className="text-muted-foreground truncate max-w-[200px] xl:max-w-[400px]">
                  {liveData.stream.title}
                </span>
                <Link href={liveData.stream.url} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:text-primary/80 ml-2">
                  WATCH
                </Link>
              </div>
            ) : currentLatest ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                  <span className="font-bold text-foreground">LATEST</span>
                </div>
                <span className="text-muted-foreground truncate max-w-[200px] xl:max-w-[400px]">
                  {currentLatest.title}
                </span>
                <Link href={currentLatest.url} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:text-primary/80 ml-2">
                  WATCH
                </Link>
              </div>
            ) : null}
          </div>

          {/* Main Nav Bar */}
          <div className="flex flex-1 items-center justify-between px-6">
            {/* Desktop Nav */}
            <nav className="hidden h-full items-center gap-10 lg:flex">
              <Link
                href="/"
                className={cn(
                  "relative flex h-full items-center text-sm font-bold uppercase tracking-widest transition-colors",
                  pathname === "/" ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                HOME
                {pathname === "/" && (
                  <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 bg-primary"></span>
                )}
              </Link>
              <Link
                href="/teams"
                className={cn(
                  "relative flex h-full items-center text-sm font-bold uppercase tracking-widest transition-colors",
                  pathname === "/teams" ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                TEAMS
                {pathname === "/teams" && (
                  <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 bg-primary"></span>
                )}
              </Link>
              {["NEWS", "SHOP"].map((item) => {
                const href = item === "SHOP" ? "/shop" : "#";
                const isActive = pathname === href && href !== "#";
                return (
                  <Link
                    key={item}
                    href={href}
                    className={cn(
                      "relative flex h-full items-center text-sm font-bold uppercase tracking-widest transition-colors",
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    )}
                  >
                    {item}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 bg-primary"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background text-foreground border-r border-border w-[300px] sm:w-[400px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu for mobile devices</SheetDescription>
                
                {/* Mobile Header Logo Area */}
                <div className="flex h-24 items-center justify-center border-b border-border">
                   <div className="relative h-16 w-16">
                    <Image
                      src="/A1esports_logo_white.svg"
                      alt="A1 Esports Logo"
                      fill
                      className="object-contain"
                      priority
                      sizes="48px"
                    />
                  </div>
                </div>

                <nav className="flex flex-col p-6 gap-8">
                  {/* Primary Navigation */}
                  <div className="flex flex-col gap-6">
                    <Link 
                      href="/" 
                      className={cn(
                        "text-2xl font-black italic tracking-widest transition-all duration-300",
                        pathname === "/" ? "text-primary pl-2 border-l-4 border-primary" : "text-white"
                      )}
                    >
                      HOME
                    </Link>
                    <Link 
                      href="/teams" 
                      className={cn(
                        "text-2xl font-black italic tracking-widest transition-all duration-300",
                        pathname === "/teams" ? "text-primary pl-2 border-l-4 border-primary" : "text-white"
                      )}
                    >
                      TEAMS
                    </Link>
                    {["NEWS", "SHOP"].map((item) => {
                      const href = item === "SHOP" ? "/shop" : "#";
                      const isActive = pathname === href && href !== "#";
                      return (
                        <Link
                          key={item}
                          href={href}
                          className={cn(
                            "text-2xl font-black italic tracking-widest transition-all duration-300",
                            isActive ? "text-primary pl-2 border-l-4 border-primary" : "text-white"
                          )}
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="h-px bg-border/50 w-full" />

                  {/* Secondary Navigation */}
                  <div className="flex flex-col gap-4">
                    {["About", "History", "Championships", "Sponsors", "Investors"].map((item) => (
                      <Link 
                        key={item}
                        href="#" 
                        className="text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground hover:translate-x-1 transition-all"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile Social/Extra (Optional placeholder) */}
                  <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span>Live Now: Champions Tokyo</span>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Mobile Logo Text */}
            <Link
              href="/"
              className="lg:hidden text-xl font-black italic tracking-[0.2em] font-sans"
            >
              A1ESPORTS
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-6 lg:border-l lg:border-border lg:pl-8 h-full">
              <button className="text-foreground hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-foreground hover:text-primary transition-colors hidden sm:block">
                <User className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsOpen(true)}
                className="relative text-foreground hover:text-primary transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in duration-300">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
