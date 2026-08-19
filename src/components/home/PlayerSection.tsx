"use client";

import { useEffect, useState } from "react";
import { Team, Player } from "@/types/domain";
import { getTeamsFromSupabase } from "@/services/supabase/db.service";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Users } from "lucide-react";

export function PlayerSection() {
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeamsFromSupabase().then((data) => {
      setTeamList(data);
      setLoading(false);
    });
  }, []);

  // Dynamically find a team with players, prioritizing pro/pubgm teams
  const activeTeam =
    teamList.find((t) => t.players && t.players.length > 0 && (t.game?.toLowerCase().includes("pubg") || t.name?.toLowerCase().includes("pro"))) ||
    teamList.find((t) => t.players && t.players.length > 0) ||
    teamList[0];

  const players: Player[] = activeTeam ? activeTeam.players : [];

  if (!loading && players.length === 0) {
    return null; // Gracefully hide squad section if no roster exists in DB
  }

  return (
    <Section className="py-12 sm:py-24">
      <SectionHeader
        title={
          <>
            Meet The <span className="text-primary">Squad</span>
          </>
        }
        subtitle={activeTeam?.name ? `${activeTeam.name} Roster` : "Active Roster"}
        icon={Users}
        align="center"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {players.map((player, i) => (
          <PlayerCard key={player.ign || i} player={player} index={i} />
        ))}
      </div>
    </Section>
  );
}
