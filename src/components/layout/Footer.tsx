"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaDiscord, FaYoutube, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/#about" },
    { name: "Our History", href: "#" },
    { name: "Teams", href: "/teams" },
    { name: "Careers", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Tryouts / Apply", href: "/apply" },
  ],
  shop: [
    { name: "New Arrivals", href: "/shop" },
    { name: "Jerseys", href: "/shop" },
    { name: "Accessories", href: "/shop" },
    { name: "Shipping Info", href: "#" },
  ],
};

const socialLinks = [
  { icon: FaFacebookF, href: "https://facebook.com/a1esportsbd", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com/a1esports.bd", label: "Instagram" },
  { icon: FaYoutube, href: "https://youtube.com/@a1esportsbd", label: "YouTube" },
  { icon: FaDiscord, href: "https://discord.gg/EKRQMA83", label: "Discord" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
];

export function Footer() {
  const pathname = usePathname();

  // Hide Footer completely on Admin Dashboard & Login routes
  if (pathname?.startsWith("/dashboard") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="relative w-full bg-[#0a0a0a] border-t border-neutral-800 pt-16 sm:pt-24 pb-8 sm:pb-12 overflow-hidden font-mono">
      {/* Hardware Schematic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,102,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,102,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/A1esports_logo_white.svg"
                  alt="A1 Esports Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <span className="text-2xl font-black tracking-widest text-white uppercase">
                A1ESPORTS
              </span>
            </Link>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-xs uppercase tracking-wider">
              South Asia's premier esports powerhouse. Redefining competitive gaming with precision, performance, and excellence.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center bg-black border border-neutral-800 text-neutral-500 hover:border-primary/50 hover:text-primary transition-all duration-300 rounded-sm"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Organization</h4>
            </div>
            <ul className="flex flex-col gap-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-neutral-500 hover:text-primary transition-colors text-xs uppercase tracking-widest flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Commerce</h4>
            </div>
            <ul className="flex flex-col gap-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-neutral-500 hover:text-primary transition-colors text-xs uppercase tracking-widest flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Comms Link</h4>
            </div>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-black border border-neutral-800 text-primary rounded-sm">
                  <MapPin size={16} />
                </div>
                <div className="pt-1">
                  <div className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">HQ Location</div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider">Dhaka, Bangladesh</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-black border border-neutral-800 text-primary rounded-sm">
                  <Mail size={16} />
                </div>
                <div className="pt-1">
                  <div className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">Direct Line</div>
                  <p className="text-neutral-500 text-xs tracking-wider">contact@a1esportsbd.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} A1 ESPORTS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy-policy" className="text-neutral-600 hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-neutral-600 hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
          <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
            DEV: ZER0BYTE
          </p>
        </div>
      </div>
    </footer>
  );
}
