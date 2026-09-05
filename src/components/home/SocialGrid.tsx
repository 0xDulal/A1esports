"use client";

import { Share2, ArrowUpRight } from "lucide-react";
import { FaDiscord, FaYoutube, FaFacebookF, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

type Stats = {
  youtube: string;
  facebook: string;
  instagram: string;
  discord: string;
};

export function SocialGrid({ stats }: { stats?: Stats }) {
  const socials = [
    { name: "Discord", icon: FaDiscord, followers: stats?.discord || "15.2K", label: "Members", href: "https://discord.gg/EKRQMA83" },
    { name: "YouTube", icon: FaYoutube, followers: stats?.youtube || "15.1K", label: "Subscribers", href: "https://youtube.com/@a1esportsbd" },
    { name: "Facebook", icon: FaFacebookF, followers: stats?.facebook || "1.2M", label: "Followers", href: "https://facebook.com/a1esportsbd" },
    { name: "Instagram", icon: FaInstagram, followers: stats?.instagram || "512K", label: "Followers", href: "https://www.instagram.com/a1esports.bd" },
  ];

  return (
    <section className="bg-[#0a0a0a] text-neutral-400 py-24 px-4 md:px-8 font-mono border-t border-neutral-800">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Share2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-widest text-white uppercase">Connect With Us</h2>
          <div className="flex-1 h-px bg-neutral-800 ml-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socials.map((social, i) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between border border-neutral-800 bg-neutral-900/30 p-6 h-48 hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start z-10">
                <div className="text-white bg-neutral-800 p-2 border border-neutral-700 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <social.icon size={20} />
                </div>
                <div className="text-neutral-600 group-hover:text-primary transition-colors">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors">
                  {social.followers}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-500">
                  <span>{social.name}</span>
                  <span className="text-[10px] text-neutral-600">[{social.label}]</span>
                </div>
              </div>
              
              {/* Hardware crosshair accent */}
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-600 m-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
