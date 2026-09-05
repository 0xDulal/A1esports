"use client";

import { useEffect, useState } from "react";
import { Team, Player } from "@/types/domain";
import { getTeamsFromSupabase } from "@/services/supabase/db.service";
import { Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { PlayerCard } from "@/components/ui/PlayerCard";

export function PlayerSection() {
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeamsFromSupabase().then((data) => {
      setTeamList(data);
      setLoading(false);
    });
  }, []);

  const activeTeam =
    teamList.find((t) => t.players && t.players.length > 0 && (t.game?.toLowerCase().includes("pubg") || t.name?.toLowerCase().includes("pro"))) ||
    teamList.find((t) => t.players && t.players.length > 0) ||
    teamList[0];

  const players: Player[] = activeTeam ? activeTeam.players : [];

  if (!loading && players.length === 0) {
    return null;
  }

  return (
    <section className="bg-black text-neutral-400 py-24 px-4 md:px-8 font-mono border-t border-neutral-800">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-widest text-white uppercase">Active Roster</h2>
          <div className="flex-1 h-px bg-neutral-800 ml-4" />
          <div className="text-xs uppercase tracking-widest text-neutral-500 hidden md:block">
            {activeTeam?.name || "Squad"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
          {players.map((player, i) => (
            <PlayerCard key={player.ign || i} player={player} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
