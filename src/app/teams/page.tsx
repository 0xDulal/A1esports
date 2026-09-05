"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Team } from "@/types/domain";
import { getTeamsFromSupabase } from "@/services/supabase/db.service";
import { Trophy, Crosshair, ArrowRight } from "lucide-react";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { A1Button } from "@/components/ui/A1Button";
import { GlowBar } from "@/components/ui/GlowBar";

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
      
      {/* HARDWARE HUD HERO SECTION */}
      <section className="relative w-full pt-32 pb-16 px-4 md:px-8 border-b border-white/5 bg-[#0a0a0a] overflow-hidden">
        {/* Schematic Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20"
             style={{
               backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}
        />
        
        {/* Ambient Purple UV Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1700px] mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          
          {/* Hero Left: Title & Designation */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-michroma uppercase tracking-tighter text-white leading-[0.9]">
              ACTIVE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">DIVISIONS</span>
            </h1>
            
            <p className="text-neutral-400 max-w-xl text-sm md:text-base tracking-wide border-l-2 border-primary/50 pl-4 py-1">
              Browse the official operational units and elite operatives commanding the competitive grid under the A1 banner.
            </p>
          </div>

          {/* Hero Right: Tactical Image Display */}
          <div className="hidden md:block w-full max-w-lg lg:max-w-xl xl:max-w-2xl relative h-48 lg:h-64 border border-white/10 rounded-sm bg-black/40 p-2 backdrop-blur-md shadow-2xl shrink-0">
            <div className="relative w-full h-full border border-white/5 rounded-sm overflow-hidden group">
               <Image 
                 src="/images/regular/a1team.jpg" 
                 alt="A1 Esports Active Roster" 
                 fill 
                 className="object-cover object-center filter grayscale-[50%] contrast-125 group-hover:grayscale-0 transition-all duration-700" 
                 priority
               />
               
               {/* Overlays for tactical feel */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
               <div className="absolute inset-0 bg-primary/10 mix-blend-color-burn" />
               
               {/* Technical Corner Accents */}
               <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
               <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />
               
               {/* Status Indicator */}
               <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-sm">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Live Roster Feed</span>
               </div>
            </div>
          </div>
        </div>
        
        <GlowBar position="bottom" />
      </section>

      {/* ROSTER DATAGRID */}
      <section className="max-w-[1700px] mx-auto px-4 md:px-8 py-16 space-y-24">
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

      {/* HARDWARE FOOTER CTA */}
      <section className="max-w-[1700px] mx-auto px-4 md:px-8 mb-12">
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-sm p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(255,0,102,0.1),transparent_50%)]" />
          
          <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-michroma uppercase text-white">
              INITIALIZE YOUR <br/><span className="text-primary">CAREER</span>
            </h2>
            <p className="text-neutral-400 text-sm md:text-base">
              A1 Esports is constantly scouting for prodigies. If your mechanical skill and tactical IQ exceed operational standard, execute the application protocol.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link href="/apply">
              <A1Button variant="primary" size="lg" className="px-10 py-5 text-sm uppercase tracking-widest font-bold group">
                SUBMIT_APPLICATION <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </A1Button>
            </Link>
          </div>
        </div>
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
