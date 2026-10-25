"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Team } from "@/types/domain";
import { getTeamsFromSupabase } from "@/services/supabase/db.service";
import { Trophy, Crosshair, Users } from "lucide-react";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { PageHero } from "@/components/ui/PageHero";

export default function TeamsPage() {
  const [teamsList, setTeamsList] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTeamsFromSupabase().then((data) => {
      setTeamsList(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-primary/30">
      {/* Hero Header */}
      <PageHero
        subtitle="Active Divisions"
        title="Teams"
        icon={Users}
      />

      {/* ROSTER DATAGRID */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 space-y-24">
        {loading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center gap-4 border border-white/10 bg-[#0a0a0a] rounded-sm">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-primary font-bold tracking-[0.3em] uppercase animate-pulse">
              SYNCING_DATABANKS...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {teamsList.map((team, index) => (
              <DivisionBlock key={team.id} team={team} index={index} />
            ))}
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}

function DivisionBlock({ team, index }: { team: Team; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Hardware Panel Header */}
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-sm flex flex-col md:flex-row md:items-center justify-between overflow-hidden">
        
        {/* Left Side: Game & Team Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 md:p-8 relative z-10">
          {/* Logo Box */}
          <div className="w-20 h-20 bg-black border border-white/10 rounded-sm flex items-center justify-center p-3 shrink-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <div className="relative w-full h-full">
              <Image src={team.logo || "/A1esports_logo_white.svg"} alt={team.name} fill className="object-contain filter grayscale contrast-125" />
            </div>
          </div>
          
          {/* Title Area */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crosshair size={14} className="text-primary" />
              <span className="text-xs text-primary font-bold tracking-[0.2em] uppercase">
                {team.game}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-michroma uppercase text-white tracking-tight">
              {team.name}
            </h2>
          </div>
        </div>

        {/* Diagonal Separator line (CSS trick) hidden on mobile */}
        <div className="hidden md:block absolute top-0 bottom-0 left-[60%] w-[1px] bg-white/10 -skew-x-12" />

        {/* Right Side: Stats & Accolades */}
        <div className="p-6 md:p-8 md:pl-16 bg-black/40 flex-1 flex flex-col justify-center relative z-10 border-t md:border-t-0 border-white/5">
          <div className="flex items-center gap-6 justify-start md:justify-end">
            
            <div className="text-left md:text-right">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">
                UNIT_SIZE
              </p>
              <p className="text-2xl font-michroma text-white">
                0{team.players ? team.players.length : 0}
              </p>
            </div>

            <div className="w-px h-10 bg-white/10" />

            <div className="text-left md:text-right">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">
                ACCOLADES
              </p>
              <div className="flex items-center gap-2 md:justify-end">
                <Trophy size={16} className="text-primary" />
                <span className="text-2xl font-michroma text-white">
                  0{team.achievements ? team.achievements.length : 0}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Operative Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {team.players && team.players.length > 0 ? (
          team.players.map((player, i) => (
            <PlayerCard key={player.ign} player={player} index={i} />
          ))
        ) : (
          <div className="col-span-full py-12 border border-dashed border-white/10 rounded-sm flex items-center justify-center text-neutral-500 text-xs font-bold tracking-[0.2em] uppercase bg-[#0a0a0a]">
            [ NO_OPERATIVES_FOUND ]
          </div>
        )}
      </div>
    </motion.div>
  );
}
