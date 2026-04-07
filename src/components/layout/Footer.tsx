"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaDiscord, FaYoutube, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/#about" },
    { name: "Our History", href: "#" },
    { name: "Teams", href: "/teams" },
    { name: "Careers", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "FAQ", href: "#" },
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
  return (
    <footer className="relative w-full bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
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
              <span className="text-2xl font-black tracking-[0.2em] text-white">
                A1ESPORTS
              </span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              South Asia's premier esports powerhouse. Redefining competitive gaming with passion, performance, and excellence since 2020.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Company</h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-neutral-500 hover:text-primary transition-colors text-sm flex items-center group">
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Shop</h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-neutral-500 hover:text-primary transition-colors text-sm flex items-center group">
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Contact</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold uppercase tracking-wider mb-1">Office</div>
                  <p className="text-neutral-500 text-sm">Dhaka, Bangladesh</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold uppercase tracking-wider mb-1">Email</div>
                  <p className="text-neutral-500 text-sm">contact@a1esportsbd.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-600 text-xs font-medium">
            © {new Date().getFullYear()} A1 Esports. All rights reserved.
          </p>
          <p className="text-neutral-600 text-xs font-medium">
            Developed by Zer0byte
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
