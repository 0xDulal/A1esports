"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlowBar } from "./GlowBar";

interface PageHeroProps {
  subtitle: string;
  title: string;
  dotColor?: string;
  icon?: LucideIcon;
  topGlow?: boolean;
  className?: string;
}

export function PageHero({
  subtitle,
  title,
  icon: Icon,
  topGlow = true,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`relative h-[40vh] min-h-[300px] w-full overflow-hidden flex items-center justify-center ${className}`}
    >
      {topGlow && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,102,0.18),rgba(0,0,0,0))] pointer-events-none" />
      )}

      {Icon && (
        <div className="absolute inset-0 z-0 text-white/5 flex items-center justify-center pointer-events-none select-none">
          <Icon size={400} strokeWidth={0.5} className="opacity-10" />
        </div>
      )}

      <div className="relative z-20 text-center px-4">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base"
        >
          {subtitle}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-michroma uppercase tracking-tighter"
        >
          {title}
          <span className="text-primary">.</span>
        </motion.h1>
      </div>

      <GlowBar position="bottom" />
    </section>
  );
}
