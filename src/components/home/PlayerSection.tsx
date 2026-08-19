"use client";

import { useEffect, useState } from "react";
import { teams as fallbackTeams, Team, Player } from "@/lib/teams";
import { getTeamsFromSupabase } from "@/lib/supabase/db";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Users } from "lucide-react";

export function PlayerSection() {
  const [teamList, setTeamList] = useState<Team[]>(fallbackTeams);

  useEffect(() => {
    getTeamsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setTeamList(data);
      }
    });
  }, []);

  const proTeam = teamList.find((t) => t.id === "pubgm-pro") || teamList[0];
  const players: Player[] = proTeam ? proTeam.players : [];

  return (
    <Section className="py-12 sm:py-24">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {players.map((player, i) => (
          <PlayerCard key={player.ign} player={player} index={i} />
        ))}
      </div>
    </Section>
  );
}
