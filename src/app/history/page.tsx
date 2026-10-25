"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History as HistoryIcon,
  Trophy,
  Flag,
  Star,
  Globe,
  Shield,
  Sparkles,
  ChevronRight,
  Zap,
  Medal,
  ExternalLink,
  Target,
  Flame,
  Clock,
  Layers,
  Award,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { A1Button } from "@/components/ui/A1Button";

// ponytail: Static milestone list; upgrade to CMS/Liquipedia API scraper when dynamic seasons require it.
interface Milestone {
  id: string;
  year: string;
  era: string;
  eraKey: "breakthrough" | "pro-league" | "dynasty";
  title: string;
  badge: string;
  isChampion: boolean;
  prize: string;
  tournament: string;
  location: string;
  tier: string;
  description: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  icon: typeof Trophy;
}

const MILESTONES: Milestone[] = [
  {
    id: "m-2020",
    year: "2020",
    era: "2020-2021: BREAKTHROUGH",
    eraKey: "breakthrough",
    title: "South Asian Championship & PMCO Victory",
    badge: "1st Place Champions",
    isChampion: true,
    prize: "$11,500",
    tournament: "PUBG Mobile Club Open Fall 2020: South Asia",
    location: "Online / Regional",
    tier: "Regional S-Tier",
    description:
      "A1 Esports exploded onto the international esports stage by capturing the PMCO South Asia Fall Split title, securing the region's #1 seed and putting Bangladesh on the global esports radar.",
    stats: [
      { label: "Matches", value: "18" },
      { label: "Placement", value: "#1 Seed" },
      { label: "WWCDs", value: "4 Wins" },
    ],
    highlights: [
      "Dominated Grand Finals across 18 matches with top elimination rating",
      "Official Bangladesh flag bearer at international PMCO Global Showcase",
      "Established the core tactical roster that propelled South Asia into global circuits",
    ],
    icon: Trophy,
  },
  {
    id: "m-2021",
    year: "2021",
    era: "2020-2021: BREAKTHROUGH",
    eraKey: "breakthrough",
    title: "PMGC Global Championship Representation",
    badge: "World Finals (4th / 15th)",
    isChampion: false,
    prize: "$51,500 Total",
    tournament: "PUBG Mobile Global Championship 2020 Finals",
    location: "Coca-Cola Arena, Dubai, UAE",
    tier: "Global S-Tier",
    description:
      "Battled against the world's 16 elite PUBG Mobile squads live on stage in Dubai. Finished 4th in League Super Weekends and stood shoulder-to-shoulder with the world's best.",
    stats: [
      { label: "League Finish", value: "4th Place" },
      { label: "World Final", value: "15th Global" },
      { label: "Stage", value: "Dubai Arena" },
    ],
    highlights: [
      "First South Asian roster to score chicken dinners at the PMGC World Stage",
      "Secured $51,500 in total international earnings across tournament stages",
      "Defeated multiple powerhouse teams from China, Europe, and Southeast Asia",
    ],
    icon: Globe,
  },
  {
    id: "m-2022",
    year: "2022",
    era: "2022-2023: PRO LEAGUE",
    eraKey: "pro-league",
    title: "PMPL Podium Streak & Regional Powerhouse",
    badge: "3rd Place Podium",
    isChampion: false,
    prize: "$6,000",
    tournament: "PUBG Mobile Pro League - South Asia Spring 2022",
    location: "South Asia Regional",
    tier: "PMPL Pro League",
    description:
      "Maintained consistent podium rankings across all Pro League seasons, establishing a reputation for high-elimination tactical rotations and unmatched circle mastery.",
    stats: [
      { label: "Avg Kills", value: "6.8 / match" },
      { label: "Podium", value: "Top 3" },
      { label: "Consistency", value: "100% Finals" },
    ],
    highlights: [
      "Highest average kills per match among South Asian contenders",
      "Maintained 100% Grand Finals qualification streak across all seasons",
      "Consolidated multi-roster depth and academy scouting pipeline",
    ],
    icon: Star,
  },
  {
    id: "m-2023",
    year: "2023",
    era: "2022-2023: PRO LEAGUE",
    eraKey: "pro-league",
    title: "Pro League Grand Champions",
    badge: "1st Place Champions",
    isChampion: true,
    prize: "$10,000",
    tournament: "PUBG Mobile Pro League - South Asia Fall 2023",
    location: "South Asia Regional",
    tier: "PMPL Pro League",
    description:
      "Crowned Grand Champions of PMPL South Asia Fall 2023, dominating the leaderboard from Match 1 to the final circle with historic points gap over second place.",
    stats: [
      { label: "Point Lead", value: "+38 pts" },
      { label: "Trophy", value: "Champions" },
      { label: "Seeding", value: "#1 Seed" },
    ],
    highlights: [
      "Hoisted the prestigious PMPL South Asia Championship Trophy",
      "Qualified directly for PMGC Regional Finals as reigning titleholders",
      "Set regional record for most points accumulated in a single finals weekend",
    ],
    icon: Flag,
  },
  {
    id: "m-2024",
    year: "2024",
    era: "2024-2026: DYNASTY",
    eraKey: "dynasty",
    title: "PMNC National Title Reign Begins",
    badge: "1st Place Champions",
    isChampion: true,
    prize: "$10,000",
    tournament: "PUBG Mobile National Championship BD 2024",
    location: "Dhaka, Bangladesh",
    tier: "National S-Tier",
    description:
      "Initiated an undefeated national championship streak by conquering the PMNC Bangladesh Grand Finals with overwhelming match point leads and zero map losses in upper bracket.",
    stats: [
      { label: "Bracket", value: "Undefeated" },
      { label: "Prize", value: "$10,000" },
      { label: "Kill Lead", value: "+42 Kills" },
    ],
    highlights: [
      "Back-to-back Winner Bracket sweeps with clinical zone controls",
      "First-place championship cash award and regional MVP accolades",
      "Ushered in a new tactical era with next-gen Bangladeshi sharpshooters",
    ],
    icon: Shield,
  },
  {
    id: "m-2025-2026",
    year: "2025-26",
    era: "2024-2026: DYNASTY",
    eraKey: "dynasty",
    title: "Undefeated 4-Peat Dynasty & PMGO Contenders",
    badge: "4x Consecutive Titles",
    isChampion: true,
    prize: "$12,000+",
    tournament: "PMNC Spring 2025, Fall 2025 & Spring 2026",
    location: "South Asia Pro Circuit",
    tier: "Dynasty Era",
    description:
      "Cemented an unrivaled legacy with 4 consecutive PUBG Mobile National Championship crowns, solidifying A1 Esports as South Asia's defining esports organization.",
    stats: [
      { label: "Dynasty", value: "4-Peat" },
      { label: "Win Rate", value: "78% Podium" },
      { label: "Status", value: "Active Reign" },
    ],
    highlights: [
      "Historic 4-Peat: Conquered four straight National Championships without dropping a final",
      "Active South Asia Contenders for PUBG Mobile Global Open 2026",
      "Maintained undisputed #1 national ranking across 3 consecutive years",
    ],
    icon: Medal,
  },
];

const ERAS = [
  { id: "ALL", label: "All Eras", span: "2020-2026" },
  { id: "breakthrough", label: "Breakthrough", span: "2020-2021" },
  { id: "pro-league", label: "Pro League", span: "2022-2023" },
  { id: "dynasty", label: "Dynasty Reign", span: "2024-2026" },
];

export default function HistoryPage() {
  const [selectedEra, setSelectedEra] = useState<string>("ALL");
  const [championOnly, setChampionOnly] = useState<boolean>(false);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>("m-2025-2026");

  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter((m) => {
      const matchEra = selectedEra === "ALL" || m.eraKey === selectedEra;
      const matchChamp = championOnly ? m.isChampion : true;
      return matchEra && matchChamp;
    });
  }, [selectedEra, championOnly]);

  const activeMilestone = useMemo(() => {
    return (
      filteredMilestones.find((m) => m.id === activeMilestoneId) ||
      filteredMilestones[0] ||
      MILESTONES[0]
    );
  }, [filteredMilestones, activeMilestoneId]);

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

      {/* Main Interactive Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
        {/* Navigation Rail & Filter Command Bar */}
        <section className="bg-neutral-900/60 border border-white/10 rounded-sm p-4 sm:p-5 backdrop-blur-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Era Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 mr-2">
                <Layers size={13} className="text-primary" /> Filter Era:
              </span>
              {ERAS.map((era) => {
                const isActive = selectedEra === era.id;
                return (
                  <button
                    key={era.id}
                    onClick={() => setSelectedEra(era.id)}
                    className={`relative px-4 py-2 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-black shadow-[0_0_20px_rgba(255,0,102,0.4)]"
                        : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    <span>{era.label}</span>
                    <span
                      className={`ml-2 text-[10px] opacity-70 ${
                        isActive ? "text-black" : "text-neutral-500"
                      }`}
                    >
                      ({era.span})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChampionOnly(!championOnly)}
                className={`px-3.5 py-2 rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  championOnly
                    ? "bg-amber-400 text-black border border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                    : "bg-white/5 text-neutral-400 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                <Trophy size={13} className={championOnly ? "text-black" : "text-amber-400"} />
                <span>Champions Only</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-black/30">
                  {MILESTONES.filter((m) => m.isChampion).length}
                </span>
              </button>

              <div className="hidden sm:block text-xs font-mono text-neutral-500">
                Showing <span className="text-white font-bold">{filteredMilestones.length}</span> milestones
              </div>
            </div>
          </div>

          {/* Interactive Year Scrubber Track */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {MILESTONES.map((m) => {
                const isSelected = activeMilestone?.id === m.id;
                const isFiltered = filteredMilestones.some((fm) => fm.id === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (selectedEra !== "ALL" && m.eraKey !== selectedEra) {
                        setSelectedEra("ALL");
                      }
                      setActiveMilestoneId(m.id);
                    }}
                    className={`group flex items-center gap-2.5 px-3 py-2 rounded-sm transition-all whitespace-nowrap text-left cursor-pointer ${
                      isSelected
                        ? "bg-primary/20 border border-primary text-white shadow-[0_0_15px_rgba(255,0,102,0.25)]"
                        : isFiltered
                        ? "bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-white/20"
                        : "opacity-40 bg-white/2 border border-white/5 text-neutral-600 hover:opacity-75"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all ${
                        isSelected
                          ? "bg-primary shadow-[0_0_8px_var(--primary)] scale-125"
                          : m.isChampion
                          ? "bg-amber-400"
                          : "bg-neutral-600 group-hover:bg-neutral-400"
                      }`}
                    />
                    <div className="font-michroma text-xs font-bold tracking-tight">
                      {m.year}
                    </div>
                    <span className="hidden xl:inline text-[10px] font-mono text-neutral-500 uppercase tracking-widest truncate max-w-[120px]">
                      {m.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Moment Spotlight Card */}
        {activeMilestone && (
          <motion.section
            key={activeMilestone.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-sm border p-6 sm:p-8 lg:p-10 backdrop-blur-2xl overflow-hidden transition-all ${
              activeMilestone.isChampion
                ? "bg-gradient-to-br from-neutral-900/90 via-black to-neutral-950 border-primary/40 shadow-[0_0_50px_rgba(255,0,102,0.15)]"
                : "bg-gradient-to-br from-neutral-900/90 via-black to-neutral-950 border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            }`}
          >
            {/* Background Ambient Glow & Watermark */}
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute right-4 bottom-4 font-michroma text-8xl lg:text-9xl text-white/[0.03] select-none pointer-events-none leading-none font-black">
              {activeMilestone.year}
            </div>

            <div className="relative z-10 space-y-6">
              {/* Header Badge Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1 rounded-xs bg-primary text-black font-michroma text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,102,0.4)]">
                    {activeMilestone.year} ARCHIVE
                  </div>
                  <div className="px-3 py-1 rounded-xs bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={12} className="text-primary" /> {activeMilestone.tier}
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    Location: <span className="text-white">{activeMilestone.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Prize:</span>
                  <span className="px-3 py-1 rounded-xs bg-amber-400/10 border border-amber-400/40 text-amber-300 font-michroma text-xs font-bold">
                    {activeMilestone.prize}
                  </span>
                </div>
              </div>

              {/* Title & Core Narrative */}
              <div className="space-y-3 max-w-4xl">
                <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-widest">
                  <Flame size={14} /> {activeMilestone.tournament}
                </div>
                <h2 className="text-2xl sm:text-4xl font-michroma uppercase tracking-tight text-white leading-tight">
                  {activeMilestone.title}
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                  {activeMilestone.description}
                </p>
              </div>

              {/* Stats Chips */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl py-2">
                {activeMilestone.stats.map((st) => (
                  <div
                    key={st.label}
                    className="p-3 sm:p-4 rounded-sm bg-white/5 border border-white/10 space-y-1"
                  >
                    <div className="text-lg sm:text-2xl font-michroma text-white">
                      {st.value}
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Bullet Highlights */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <Zap size={13} className="text-primary" /> Key Tactical Milestones:
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {activeMilestone.highlights.map((hl) => (
                    <div
                      key={hl}
                      className="p-3.5 rounded-sm bg-neutral-900/80 border border-white/5 text-xs text-neutral-300 leading-normal flex items-start gap-2.5"
                    >
                      <ChevronRight size={14} className="text-primary shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Dual-Rail Chronological Timeline Stream */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-michroma uppercase tracking-tight flex items-center gap-3">
                <Clock className="text-primary" size={22} /> Chronological Record
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Verified South Asian competitive circuit placements from debut to 4-Peat dynasty
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Center Timeline Spine for desktop */}
            <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-primary/40 to-transparent -translate-x-1/2 pointer-events-none" />

            <div className="space-y-8 lg:space-y-12">
              <AnimatePresence mode="popLayout">
                {filteredMilestones.map((m, index) => {
                  const isLeft = index % 2 === 0;
                  const isActive = activeMilestone?.id === m.id;

                  return (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="relative grid lg:grid-cols-2 gap-6 lg:gap-16 items-center"
                    >
                      {/* Timeline Center Node Pin (Desktop) */}
                      <button
                        type="button"
                        onClick={() => setActiveMilestoneId(m.id)}
                        aria-label={`Select ${m.year} milestone`}
                        className={`hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 w-10 h-10 rounded-sm z-20 items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-black border-2 border-white shadow-[0_0_20px_rgba(255,0,102,0.8)] scale-110"
                            : m.isChampion
                            ? "bg-black text-amber-400 border-2 border-amber-400 hover:bg-amber-400 hover:text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                            : "bg-black text-primary border-2 border-primary/50 hover:bg-primary hover:text-black"
                        }`}
                      >
                        <m.icon size={18} />
                      </button>

                      {/* Card Container */}
                      <div
                        className={`group relative rounded-sm p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 border cursor-pointer ${
                          isLeft ? "lg:col-start-1" : "lg:col-start-2"
                        } ${
                          isActive
                            ? "bg-neutral-900/90 border-primary shadow-[0_15px_40px_rgba(255,0,102,0.2)]"
                            : "bg-neutral-900/60 border-white/10 hover:border-primary/50 hover:bg-neutral-900/80 hover:-translate-y-1"
                        }`}
                        onClick={() => setActiveMilestoneId(m.id)}
                      >
                        {/* Mobile Year & Icon Strip */}
                        <div className="flex lg:hidden items-center justify-between mb-4 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                              <m.icon size={16} />
                            </div>
                            <span className="font-michroma text-xl text-primary font-bold">
                              {m.year}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-xs bg-white/5 border border-white/10 text-xs font-mono font-bold text-neutral-300">
                            {m.badge}
                          </span>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:flex items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-michroma text-primary font-black tracking-tight">
                              {m.year}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-xs text-xs font-mono font-black uppercase tracking-wider border ${
                                m.isChampion
                                  ? "bg-amber-400/10 border-amber-400/40 text-amber-300"
                                  : "bg-primary/10 border-primary/30 text-primary"
                              }`}
                            >
                              {m.badge}
                            </span>
                          </div>

                          <span className="text-xs font-mono font-bold text-white px-3 py-1 rounded-xs bg-white/5 border border-white/10">
                            Prize: {m.prize}
                          </span>
                        </div>

                        {/* Card Tournament & Title */}
                        <div className="space-y-2 mb-4">
                          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Zap size={13} className="text-primary" /> {m.tournament}
                          </div>
                          <h4 className="text-lg sm:text-xl font-michroma uppercase text-white group-hover:text-primary transition-colors leading-snug">
                            {m.title}
                          </h4>
                          <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                            {m.description}
                          </p>
                        </div>

                        {/* Highlights Snippet */}
                        <div className="space-y-1.5 pt-3 border-t border-white/10">
                          {m.highlights.slice(0, 2).map((hl) => (
                            <div
                              key={hl}
                              className="flex items-center gap-2 text-xs font-mono text-neutral-300 truncate"
                            >
                              <ChevronRight size={13} className="text-primary shrink-0" />
                              <span className="truncate">{hl}</span>
                            </div>
                          ))}
                        </div>

                        {/* Select Cue */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                          <span>Circuit Tier: {m.tier}</span>
                          <span className="text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            {isActive ? "Spotlight Active" : "Inspect Record"} <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Liquipedia & Trophy Verification Command Hub */}
        <section className="relative rounded-sm bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-primary/30 p-8 sm:p-12 overflow-hidden shadow-[0_0_50px_rgba(255,0,102,0.15)]">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> Official Esports Record Verification
              </div>
              <h3 className="text-2xl sm:text-3xl font-michroma uppercase text-white leading-tight">
                Inspect 100+ Match Placement Logs On Liquipedia
              </h3>
              <p className="text-neutral-400 text-sm font-sans leading-relaxed max-w-2xl">
                Every trophy, match point, kill rating, and prize distribution is independently verified and archived on Liquipedia PUBG Mobile. Cross-reference player rosters, map statistics, and regional standings.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center md:items-end">
              <Link
                href="https://liquipedia.net/pubgmobile/A1_RG_Esports/Results"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <A1Button variant="primary" size="lg" className="w-full justify-center">
                  Liquipedia Matches <ExternalLink className="w-4 h-4 ml-1" />
                </A1Button>
              </Link>
              <Link href="/championships" className="w-full sm:w-auto">
                <A1Button variant="outline" size="lg" className="w-full justify-center">
                  Full Trophy Cabinet
                </A1Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

