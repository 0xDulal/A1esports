"use client";

import { teams } from "@/lib/teams";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminTeams() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-neutral-400">Manage your teams and players</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={20} />
          Add Team
        </button>
      </div>

      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-800">
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{team.name}</h2>
                  <p className="text-sm text-neutral-400">{team.game}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {team.players.map((player) => (
                <div
                  key={player.ign}
                  className="bg-neutral-800 rounded-lg p-3 text-center"
                >
                  <div className="relative h-16 w-16 rounded-full mx-auto mb-2 overflow-hidden">
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-bold text-sm">{player.ign}</p>
                  <p className="text-xs text-neutral-400">{player.role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
