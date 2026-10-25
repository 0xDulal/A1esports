"use client";

import { motion } from "framer-motion";
import {
  History as HistoryIcon,
  Trophy,
  Star,
  Globe,
  Shield,
  Sparkles,
  Zap,
  ExternalLink,
  Target,
  Flame,
  Clock,
  Award,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { A1Button } from "@/components/ui/A1Button";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Header */}
      <PageHero
        subtitle="Interactive Legacy Roadmap"
        title="History"
        icon={HistoryIcon}
      />

      {/* Legacy Telemetry HUD Strip */}
      <section className="relative border-y border-white/10 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            <div className="flex items-center gap-4 pt-3 lg:pt-0">
              <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(255,0,102,0.25)]">
                <Trophy size={22} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-michroma text-white tracking-tight">
                  4× CROWNS
                </div>
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                  Consecutive PMNC Dynasty
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(255,0,102,0.25)]">
                <Award size={22} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-michroma text-white tracking-tight">
                  $91K+
                </div>
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                  Verified Circuit Prize Won
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(255,0,102,0.25)]">
                <Globe size={22} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-michroma text-white tracking-tight">
                  PMGC DUBAI
                </div>
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                  World Finals Elite 16
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(255,0,102,0.25)]">
                <Clock size={22} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-michroma text-white tracking-tight">
                  6+ YEARS
                </div>
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                  Undisputed Tier-1 Hegemony
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
          {/* Card 1: 2025-2026 Dynasty (Hero Large Bento - 2 cols, 2 rows on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-2 xl:col-span-2 xl:row-span-2 relative rounded-sm p-6 sm:p-8 bg-gradient-to-br from-neutral-900/90 via-black to-neutral-950 border border-primary/50 hover:border-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,0,102,0.25)] flex flex-col justify-between overflow-hidden group"
          >
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/25 transition-all" />
            <div className="absolute right-4 bottom-2 font-michroma text-8xl sm:text-9xl text-white/[0.03] select-none pointer-events-none leading-none font-black">
              25-26
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-xs bg-primary text-black font-michroma text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,102,0.4)]">
                  2025 - 2026
                </span>
                <span className="px-2.5 py-1 rounded-xs bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                  $12,000+ Prize
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-primary flex items-center gap-1.5 mb-1.5">
                  <Flame size={13} /> PMNC Spring 2025, Fall 2025 & Spring 2026
                </span>
                <h3 className="text-2xl sm:text-3xl font-michroma uppercase text-white leading-tight">
                  Undefeated 4-Peat Dynasty
                </h3>
              </div>

              <p className="text-neutral-300 text-sm leading-relaxed">
                Cemented an unrivaled legacy with 4 consecutive PUBG Mobile National Championship crowns, solidifying A1 Esports as South Asia&apos;s defining esports organization.
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 rounded-sm bg-white/5 border border-white/10 text-center">
                  <div className="text-xl sm:text-2xl font-michroma text-white">4-Peat</div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Titles</div>
                </div>
                <div className="p-3 rounded-sm bg-white/5 border border-white/10 text-center">
                  <div className="text-xl sm:text-2xl font-michroma text-white">78%</div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Podium Rate</div>
                </div>
                <div className="p-3 rounded-sm bg-white/5 border border-white/10 text-center">
                  <div className="text-xl sm:text-2xl font-michroma text-primary">#1</div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">National Rank</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Target size={14} className="text-primary" /> Active PMGO 2026 Contenders
              </span>
              <span className="text-primary font-bold uppercase tracking-wider">Dynasty Era</span>
            </div>
          </motion.div>

          {/* Card 2: 2021 PMGC Dubai World Championship (Wide 2-col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="md:col-span-2 lg:col-span-1 xl:col-span-2 relative rounded-sm p-6 sm:p-7 bg-neutral-900/70 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,102,0.15)] flex flex-col justify-between overflow-hidden group"
          >
            <div className="absolute right-3 bottom-0 font-michroma text-7xl text-white/[0.03] select-none pointer-events-none font-black">
              2021
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xs bg-white/10 text-white font-michroma text-xs font-bold uppercase tracking-wider">
                  2021
                </span>
                <span className="px-2.5 py-1 rounded-xs bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                  $51,500 Total
                </span>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-widest text-primary flex items-center gap-1.5">
                <Globe size={13} /> Coca-Cola Arena, Dubai (UAE)
              </div>

              <h4 className="text-xl sm:text-2xl font-michroma uppercase text-white leading-snug">
                PMGC Global Finals Top 16
              </h4>

              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Battled against the world&apos;s 16 elite PUBG Mobile squads live in Dubai, securing 4th in League Super Weekends and proving South Asian power globally.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>World Stage Debut</span>
              <span className="text-white font-bold">4th Place League</span>
            </div>
          </motion.div>

          {/* Card 3: 2023 PMPL Grand Champions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-1 relative rounded-sm p-6 bg-neutral-900/70 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,102,0.15)] flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xs bg-white/10 text-white font-michroma text-xs font-bold">
                  2023
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">$10,000</span>
              </div>

              <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Trophy size={18} />
              </div>

              <h4 className="text-lg font-michroma uppercase text-white leading-snug">
                PMPL Grand Champions
              </h4>

              <p className="text-neutral-400 text-xs leading-relaxed">
                Grand Champions of PMPL South Asia Fall 2023 with a historic +38 point lead over 2nd place.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 text-[11px] font-mono text-primary font-bold uppercase tracking-wider">
              1st Place Champions
            </div>
          </motion.div>

          {/* Card 4: 2020 Breakthrough */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="col-span-1 relative rounded-sm p-6 bg-neutral-900/70 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,102,0.15)] flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xs bg-white/10 text-white font-michroma text-xs font-bold">
                  2020
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">$11,500</span>
              </div>

              <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Zap size={18} />
              </div>

              <h4 className="text-lg font-michroma uppercase text-white leading-snug">
                PMCO South Asia Champions
              </h4>

              <p className="text-neutral-400 text-xs leading-relaxed">
                Captured the PMCO Fall Split title across 18 matches, securing South Asia&apos;s #1 seed.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 text-[11px] font-mono text-primary font-bold uppercase tracking-wider">
              First Major Trophy
            </div>
          </motion.div>

          {/* Card 5: 2024 PMNC National Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-1 relative rounded-sm p-6 bg-neutral-900/70 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,102,0.15)] flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xs bg-white/10 text-white font-michroma text-xs font-bold">
                  2024
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">$10,000</span>
              </div>

              <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Shield size={18} />
              </div>

              <h4 className="text-lg font-michroma uppercase text-white leading-snug">
                PMNC National Crown
              </h4>

              <p className="text-neutral-400 text-xs leading-relaxed">
                Conquered PMNC Bangladesh Grand Finals with back-to-back Winner Bracket sweeps.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 text-[11px] font-mono text-primary font-bold uppercase tracking-wider">
              Undefeated Bracket
            </div>
          </motion.div>

          {/* Card 6: 2022 PMPL Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="col-span-1 relative rounded-sm p-6 bg-neutral-900/70 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,102,0.15)] flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xs bg-white/10 text-white font-michroma text-xs font-bold">
                  2022
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">$6,000</span>
              </div>

              <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Star size={18} />
              </div>

              <h4 className="text-lg font-michroma uppercase text-white leading-snug">
                PMPL Podium Streak
              </h4>

              <p className="text-neutral-400 text-xs leading-relaxed">
                Maintained 6.8 average kills per match and consistent top 3 Pro League placement.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 text-[11px] font-mono text-primary font-bold uppercase tracking-wider">
              Top 3 Regional
            </div>
          </motion.div>

          {/* Card 7: Liquipedia Verification Hub (Wide 2-col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 lg:col-span-2 xl:col-span-2 relative rounded-sm p-6 sm:p-7 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-primary/30 hover:border-primary/60 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-primary/10 border border-primary/30 text-primary font-mono text-xs uppercase tracking-wider">
                <Sparkles size={12} /> Liquipedia Archives
              </div>

              <h4 className="text-xl sm:text-2xl font-michroma uppercase text-white">
                100+ Verified Match Records
              </h4>

              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Cross-reference player rosters, map scores, kill ratings, and verified prize records directly on the official PUBG Mobile Liquipedia page.
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
              <Link
                href="https://liquipedia.net/pubgmobile/A1_RG_Esports/Results"
                target="_blank"
                rel="noopener noreferrer"
              >
                <A1Button variant="primary" size="md">
                  Liquipedia Matches <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </A1Button>
              </Link>
              <Link href="/championships">
                <A1Button variant="outline" size="md">
                  Trophy Cabinet
                </A1Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
