"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { ArrowUpRight, Share2 } from "lucide-react";
import { FaDiscord, FaYoutube, FaFacebookF, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowBar } from "@/components/ui/GlowBar";

type Stats = {
  youtube: string;
  facebook: string;
  instagram: string;
  discord: string;
};

const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  
  const numValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (current) => {
    if (Math.floor(current) === current) return Math.floor(current).toString() + suffix;
    return current.toFixed(value.includes(".") ? 1 : 0) + suffix;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(numValue);
    }
  }, [isInView, numValue, spring]);

  return (
    <div ref={ref}>
      <motion.div className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
        {display}
      </motion.div>
      <div className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300">
        {label}
      </div>
    </div>
  );
};

export function SocialGrid({ stats }: { stats?: Stats }) {
  const socials = [
    {
      name: "Discord",
      icon: FaDiscord,
      followers: stats?.discord || "15.2K",
      label: "Members",
      href: "https://discord.gg/EKRQMA83",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      followers: stats?.youtube || "15.1K",
      label: "Subscribers",
      href: "https://youtube.com/@a1esportsbd",
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      followers: stats?.facebook || "1.2M",
      label: "Followers",
      href: "https://facebook.com/a1esportsbd",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      followers: stats?.instagram || "512K",
      label: "Followers",
      href: "https://www.instagram.com/a1esports.bd",
    },
  ];

  return (
    <Section className="pb-24" containerClassName="max-w-7xl">
      <GlowBar position="top" className="-top-[1px]" />

      <SectionHeader
        title={
          <>
            Connect <span className="text-primary">With Us</span>
          </>
        }
        subtitle="Social Presence"
        icon={Share2}
        align="center"
        className="mb-20 pt-20"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {socials.map((social, i) => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/5 bg-neutral-900/50 p-8 transition-all duration-500 hover:border-primary/50 hover:bg-neutral-900/80 hover:shadow-[0_0_40px_rgba(255,0,102,0.1)]"
          >
            {/* Background Icon Watermark */}
            <div className="absolute -right-8 -top-8 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-10">
              <social.icon size={200} />
            </div>

            {/* Top Row: Icon & Arrow */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:ring-primary/50">
                <social.icon size={24} />
              </div>
              
              <div className="h-10 w-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 text-neutral-500 transition-all duration-300 group-hover:border-primary/50 group-hover:text-white">
                <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 mt-16">
              <AnimatedCounter value={social.followers} label={social.label} />
              
              {/* Hover Indicator */}
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                <span>Follow {social.name}</span>
                <ArrowUpRight size={10} />
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          </Link>
        ))}
      </div>
    </Section>
  );
}
