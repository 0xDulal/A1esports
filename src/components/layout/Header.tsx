import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function Header() {
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
            />
          </div>
          <span className="hidden text-xl font-bold tracking-[0.2em] lg:block font-sans">
            A1Esports
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex flex-1 flex-col">
          {/* Top Bar */}
          <div className="hidden h-10 items-center justify-between border-b border-border px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground lg:flex">
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-bold text-foreground">LIVE NOW</span>
              </div>
              <span className="text-muted-foreground">Playing Champions Tokyo 2023</span>
              <Link href="#" className="font-bold text-primary hover:text-primary/80 ml-2">
                WATCH
              </Link>
            </div>
          </div>

          {/* Main Nav Bar */}
          <div className="flex flex-1 items-center justify-between px-6">
            {/* Desktop Nav */}
            <nav className="hidden h-full items-center gap-10 lg:flex">
              <Link
                href="/"
                className="relative flex h-full items-center text-sm font-bold uppercase tracking-widest text-primary"
              >
                HOME
                <span className="absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 bg-primary"></span>
              </Link>
              {["TEAMS", "CREATORS", "SEN SOCIETY", "NEWS", "SHOP"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="flex h-full items-center text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                )
              )}
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
                    />
                  </div>
                </div>

                <nav className="flex flex-col p-6 gap-8">
                  {/* Primary Navigation */}
                  <div className="flex flex-col gap-6">
                    <Link 
                      href="/" 
                      className="text-2xl font-bold text-primary tracking-widest hover:pl-2 transition-all duration-300"
                    >
                      HOME
                    </Link>
                    {["TEAMS", "CREATORS", "SEN SOCIETY", "NEWS", "SHOP"].map(
                      (item) => (
                        <Link
                          key={item}
                          href="#"
                          className="text-2xl font-bold tracking-widest hover:text-primary hover:pl-2 transition-all duration-300"
                        >
                          {item}
                        </Link>
                      )
                    )}
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
              className="lg:hidden text-xl font-bold tracking-[0.2em] font-sans"
            >
              A1Esports
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-6 lg:border-l lg:border-border lg:pl-8 h-full">
              <button className="text-foreground hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-foreground hover:text-primary transition-colors hidden sm:block">
                <User className="h-5 w-5" />
              </button>
              <button className="relative text-foreground hover:text-primary transition-colors">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
