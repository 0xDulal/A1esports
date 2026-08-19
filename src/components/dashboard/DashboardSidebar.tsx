"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Users,
  Trophy,
  Settings,
  LayoutDashboard,
  LogOut,
  Package,
  Handshake,
  TrendingUp,
  Tag,
  Image as ImageIcon,
} from "lucide-react";

interface DashboardSidebarProps {
  user: any;
  onLogout: () => void;
  onLinkClick?: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Coupons", href: "/dashboard/coupons", icon: Tag },
  { label: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { label: "Teams", href: "/dashboard/teams", icon: Users },
  { label: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { label: "Media Library", href: "/dashboard/media", icon: ImageIcon },
  { label: "Sponsors", href: "/dashboard/sponsors", icon: Handshake },
  { label: "Investors", href: "/dashboard/investors", icon: TrendingUp },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ user, onLogout, onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-neutral-950 p-6 border-r border-white/10 w-64">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="relative h-10 w-10">
          <img src="/A1esports_logo_white.svg" alt="A1 Esports" className="object-contain w-full h-full" />
        </div>
        <span className="font-black text-lg tracking-wider italic text-white">A1 ADMIN</span>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-xs font-black uppercase tracking-wider ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/10">
          <Link
            href="/"
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 hover:text-white transition-all text-xs font-black uppercase tracking-wider"
          >
            <Home size={18} />
            <span>Back to Website</span>
          </Link>
        </div>
      </nav>

      {/* User Session Footer */}
      {user && (
        <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}
