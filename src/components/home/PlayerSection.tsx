"use client";

import { motion } from "framer-motion";
import { teams } from "@/lib/teams";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Users } from "lucide-react";

export function PlayerSection() {
  // Get the main professional team (PUBG Mobile Pro) for the homepage
  const proTeam = teams.find(t => t.id === "pubgm-pro");
  const players = proTeam ? proTeam.players : [];

  return (
    <Section className="py-24">
      <SectionHeader
        title={
          <>
            Meet The <span className="text-primary">Squad</span>
          </>
        }
        subtitle="Active Roster"
        icon={Users}
        align="center"
      />

      <div className="flex flex-wrap justify-center gap-6">
        {players.map((player, i) => (
          <PlayerCard key={player.ign} player={player} index={i} />
        ))}
      </div>
    </Section>
  );
}
