"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaDiscord, FaYoutube, FaFacebookF, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

type Stats = {
  youtube: string;
  facebook: string;
  instagram: string;
  discord: string;
};

const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  
  // Extract number and suffix
  const numValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (current) => {
    // If value is small, just show int, otherwise keep decimal if source had it
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
    <section className="w-full bg-black text-white">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid lg:grid-cols-2">
          {/* Left Content - "Join The Society" style */}
          <div className="relative flex min-h-[400px] lg:min-h-[500px] flex-col justify-center overflow-hidden bg-black p-8 sm:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="relative z-10 flex flex-col items-start gap-4 sm:gap-6">
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9] lg:text-8xl">
                Join The <br />
                <span className="text-white">A1 Family</span>
              </h2>
              <p className="max-w-md text-xs sm:text-sm font-bold tracking-widest uppercase text-neutral-400">
                Exclusive content, merch, and more for fans!
              </p>
              
              <Link href="/community">
                <Button className="group h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold tracking-widest uppercase bg-primary hover:bg-primary/90 text-white rounded-none [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]">
                  See More
                  <ArrowUpRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-rotate-12 group-hover:scale-110" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Grid - 2x2 Social Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {socials.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex min-h-[200px] sm:aspect-square flex-col justify-between border-b border-r border-white/10 bg-black p-8 sm:p-12 transition-colors hover:bg-neutral-900/50 overflow-hidden"
              >
                {/* Background Icon Watermark */}
                <div className="absolute -right-4 -bottom-4 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                  <social.icon className="h-32 w-32 sm:h-48 sm:w-48" />
                </div>
                {/* Top Icon */}
                <div className="flex justify-between items-start">
                  <social.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                {/* Bottom Stats */}
                <AnimatedCounter value={social.followers} label={social.label} />

                {/* Hover Line */}
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
