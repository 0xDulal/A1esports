"use client";

import { motion } from "framer-motion";
import { teams } from "@/lib/teams";
import { PlayerCard } from "@/components/ui/PlayerCard";

export function PlayerSection() {
  // Get the main professional team (PUBG Mobile Pro) for the homepage
  const proTeam = teams.find(t => t.id === "pubgm-pro");
  const players = proTeam ? proTeam.players : [];

  return (
    <section className="w-full bg-black py-24">
      <div className="mx-auto max-w-[1800px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <span className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
            Active Roster
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Meet The <span className="text-primary">Squad</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {players.map((player, i) => (
            <PlayerCard key={player.ign} player={player} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
