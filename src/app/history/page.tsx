"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History as HistoryIcon, Trophy, Flag, Star, Globe, Shield, Sparkles, ChevronRight, Zap, Medal } from "lucide-react";
import Link from "next/link";

interface Milestone {
  year: string;
  era: string;
  title: string;
  badge: string;
  prize: string;
  tournament: string;
  description: string;
  highlights: string[];
  icon: any;
}

const MILESTONES: Milestone[] = [
  {
    year: "2020",
    era: "2020-2021 BREAKTHROUGH",
    title: "South Asian Championship & PMCO Victory",
    badge: "1st Place Champions",
    prize: "$11,500",
    tournament: "PUBG Mobile Club Open Fall 2020: South Asia",
    description: "A1 Esports exploded onto the international esports stage by capturing the PMCO South Asia Fall Split title, securing the region's top seed.",
    highlights: ["Dominated Grand Finals across 18 matches", "Represented Bangladesh at International PMCO"],
    icon: Trophy,
  },
  {
    year: "2021",
    title: "PMGC Global Championship Representation",
    era: "2020-2021 BREAKTHROUGH",
    badge: "World Finals (4th / 15th)",
    prize: "$51,500 Total",
    tournament: "PUBG Mobile Global Championship 2020 Finals (Dubai)",
    description: "Battled against the world's 16 elite PUBG Mobile squads live at the Coca-Cola Arena in Dubai, proving South Asian talent on the global stage.",
    highlights: ["Qualified for World Finals in Dubai", "4th Place League Stage Finish"],
    icon: Globe,
  },
  {
    year: "2022",
    title: "PMPL Podium Streak & Regional Powerhouse",
    era: "2022-2023 PRO LEAGUE",
    badge: "3rd Place PMPL Spring",
    prize: "$6,000",
    tournament: "PUBG Mobile Pro League - South Asia Spring 2022",
    description: "Maintained consistent podium rankings across all Pro League seasons, establishing a reputation for high-elimination tactical play.",
    highlights: ["Highest Average Kills per Match", "Consistent Top 3 Placement"],
    icon: Star,
  },
  {
    year: "2023",
    title: "Pro League Grand Champions",
    era: "2022-2023 PRO LEAGUE",
    badge: "1st Place Champions",
    prize: "$10,000",
    tournament: "PUBG Mobile Pro League - South Asia Fall 2023",
    description: "Crowned Grand Champions of PMPL South Asia Fall 2023, dominating the leaderboard from Match 1 to the final circle.",
    highlights: ["Claimed PMPL Championship Trophy", "Qualified for PMGC Regional Finals"],
    icon: Flag,
  },
  {
    year: "2024",
    title: "PMNC National Title Reign Begins",
    era: "2024-2026 DYNASTY",
    badge: "1st Place Champions",
    prize: "$10,000",
    tournament: "PUBG Mobile National Championship BD 2024",
    description: "Initiated an undefeated national title streak by conquering the PMNC Bangladesh Grand Finals with overwhelming match point leads.",
    highlights: ["Back-to-back Winner Bracket sweeps", "First-place prize award of $10,000"],
    icon: Shield,
  },
  {
    year: "2025 - 2026",
    title: "Undefeated Regional Era & National Dynasty",
    era: "2024-2026 DYNASTY",
    badge: "4 Consecutive Titles",
    prize: "$12,000+",
    tournament: "PMNC Spring 2025, Fall 2025 & Spring 2026",
    description: "Cemented an unrivaled legacy with 4 consecutive PUBG Mobile National Championship titles, solidifying A1 Esports as South Asia's defining esports organization.",
    highlights: ["4 Consecutive National Championship Crowns", "Active PMGO 2026 South Asia Contenders"],
    icon: Medal,
  },
];

export default function HistoryPage() {
  const [selectedEra, setSelectedEra] = useState<string>("ALL");

  const filteredMilestones = useMemo(() => {
    if (selectedEra === "ALL") return MILESTONES;
    return MILESTONES.filter((m) => m.era === selectedEra);
  }, [selectedEra]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-32 pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,102,0.18),rgba(0,0,0,0))]" />

        <div className="relative max-w-7xl mx-auto px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase"
          >
            <HistoryIcon size={14} /> Interactive Legacy Roadmap
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-7xl font-black uppercase tracking-tight font-sans italic"
          >
            THE CHRONICLES OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">A1 ESPORTS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-2xl mx-auto font-medium text-base sm:text-lg leading-relaxed"
          >
            Trace six years of competitive dominance, global world finals, and unbroken championship streaks across South Asia.
          </motion.p>
        </div>
      </section>

      {/* Era Filter Selector */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-3 bg-neutral-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          {[
            { id: "ALL", label: "ALL ERAS (2020-2026)" },
            { id: "2020-2021 BREAKTHROUGH", label: "2020-2021: BREAKTHROUGH & PMGC" },
            { id: "2022-2023 PRO LEAGUE", label: "2022-2023: PRO LEAGUE DOMINANCE" },
            { id: "2024-2026 DYNASTY", label: "2024-2026: PMNC DYNASTY" },
          ].map((era) => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedEra === era.id
                  ? "bg-primary text-black shadow-[0_0_20px_rgba(255,0,102,0.4)]"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </section>

      {/* Futuristic Timeline Grid */}
      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="relative border-l-2 border-primary/40 pl-6 sm:pl-12 space-y-16">
          <AnimatePresence mode="popLayout">
            {filteredMilestones.map((m, i) => (
              <motion.div
                key={m.year + m.title}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative group"
              >
                {/* Node Marker */}
                <div className="absolute -left-[37px] sm:-left-[61px] top-0 w-10 h-10 rounded-2xl bg-black border-2 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,102,0.6)]">
                  <m.icon size={18} />
                </div>

                <div className="p-8 sm:p-10 rounded-[2.5rem] bg-neutral-900/70 border border-white/10 hover:border-primary/50 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(255,0,102,0.2)] space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl font-black text-primary font-sans italic">
                        {m.year}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-wider">
                        {m.badge}
                      </span>
                    </div>

                    <div className="text-sm font-black text-white px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                      Prize: {m.prize}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap size={14} className="text-primary" /> {m.tournament}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
                      {m.title}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Highlights Bullet Cards */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    {m.highlights.map((hl) => (
                      <div
                        key={hl}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-neutral-300"
                      >
                        <ChevronRight size={14} className="text-primary shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Liquipedia Archive Footer Callout */}
        <div className="mt-24 p-10 rounded-[2.5rem] bg-gradient-to-r from-primary/10 via-purple-900/20 to-primary/10 border border-primary/30 text-center space-y-4">
          <Sparkles className="w-10 h-10 text-primary mx-auto" />
          <h3 className="text-2xl font-black uppercase">Verified Liquipedia Tournament Archives</h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto font-medium">
            Explore 100+ match placement records, player rosters, and historical stats on the official PUBG Mobile Liquipedia page.
          </p>
          <Link
            href="https://liquipedia.net/pubgmobile/A1_RG_Esports/Results"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(255,0,102,0.4)]"
          >
            Access Liquipedia Matches
          </Link>
        </div>
      </section>
    </div>
  );
}
