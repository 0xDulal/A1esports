"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { teams as fallbackTeams, Team } from "@/lib/teams";
import { getTeamsFromSupabase } from "@/lib/supabase/db";
import { Trophy, Users, Zap, Sparkles, Award, ArrowUpRight } from "lucide-react";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import { A1Button } from "@/components/ui/A1Button";

const TABS = [
  { id: "ALL", label: "ALL DIVISIONS" },
  { id: "pubgm-pro", label: "PUBG MOBILE PRO" },
  { id: "management", label: "MANAGEMENT & LEADERSHIP" },
] as const;

export default function TeamsPage() {
  const [teamsList, setTeamsList] = useState<Team[]>(fallbackTeams);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTeamsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setTeamsList(data);
      }
      setLoading(false);
    });
  }, []);

  const filteredTeams = useMemo(() => {
    if (activeTab === "ALL") return teamsList;
    return teamsList.filter((t) => t.id === activeTab);
  }, [teamsList, activeTab]);

  const totalPlayers = useMemo(() => {
    return teamsList.reduce((sum, t) => sum + (t.players ? t.players.length : 0), 0);
  }, [teamsList]);

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Dynamic Hero Section */}
      <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/regular/a1team.jpg"
            alt="A1 Esports Squad"
            fill
            className="object-cover object-center opacity-40 filter brightness-75 contrast-125"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-black/90 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.3em]"
          >
            <Sparkles size={14} className="animate-pulse" /> South Asia&apos;s Premier Roster
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter italic leading-none"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary">Teams</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-300 text-sm md:text-base font-medium max-w-2xl mx-auto uppercase tracking-wider"
          >
            Meet the champions, strategists, and leaders defining competitive gaming excellence across South Asia.
          </motion.p>

          {/* Quick Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                <Trophy size={18} />
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white">15+</div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Trophies</div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                <Users size={18} />
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white">{totalPlayers}</div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Active Roster</div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                <Zap size={18} />
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white">$50K+</div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Prize Earnings</div>
              </div>
            </div>
          </motion.div>
        </div>

        <GlowBar position="bottom" />
      </section>

      {/* Division Navigation Tabs */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-y border-white/10 py-4 mb-16">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap justify-center gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 border ${
                activeTab === tab.id
                  ? "bg-primary border-primary text-black shadow-[0_0_20px_rgba(255,0,102,0.4)]"
                  : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Showcase Grid */}
      <div className="mx-auto max-w-[1700px] px-4 space-y-32 relative z-30">
        {loading ? (
          <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
            Loading teams roster...
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredTeams.map((team, index) => (
              <TeamBlock key={team.id} team={team} index={index} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Join CTA */}
      <Section containerClassName="max-w-5xl" className="py-24 mt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-neutral-900/90 via-black to-neutral-900/80 backdrop-blur-2xl p-12 md:p-16 text-center shadow-2xl"
        >
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-96 w-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Award size={14} /> Open Recruitment
            </div>

            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic leading-tight">
              Think You Have What It Takes?
            </h2>

            <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We are constantly scouting for rising competitive players, content creators, shoutcasters, and analysts.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Link href="/apply">
                <A1Button variant="primary" size="lg" className="px-8 py-5 text-sm uppercase tracking-widest font-black">
                  Apply for Tryouts <ArrowUpRight size={18} />
                </A1Button>
              </Link>
              <Link href="/contact">
                <A1Button variant="outline" size="lg" className="px-8 py-5 text-sm uppercase tracking-widest font-black">
                  Contact Management
                </A1Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Section>
    </main>
  );
}

function TeamBlock({ team, index }: { team: Team; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-12"
    >
      {/* Division Header Banner */}
      <div className="relative bg-neutral-900/60 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

        <div className="space-y-4 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <div className="relative h-6 w-6">
              <Image src={team.logo || "/A1esports_logo_white.svg"} alt="" fill className="object-contain" />
            </div>
            <span className="text-primary font-black uppercase tracking-widest text-xs">
              {team.game}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
            {team.name}
          </h2>

          {team.achievements && team.achievements.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              {team.achievements.map((ach, i) => (
                <div key={i} className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full">
                  <Trophy size={14} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {ach.rank} {ach.event} ({ach.year})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-right z-10 shrink-0">
          <span className="text-5xl font-black text-white/10 uppercase tracking-tighter block font-mono">
            ROSTER #{index + 1}
          </span>
          <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
            {team.players ? team.players.length : 0} Active Operatives
          </span>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
        {team.players &&
          team.players.map((player, i) => (
            <PlayerCard key={player.ign} player={player} index={i} />
          ))}
      </div>
    </motion.section>
  );
}
