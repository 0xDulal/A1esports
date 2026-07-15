"use client";

import { teams } from "@/lib/teams";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminAchievements() {
  const allAchievements = teams
    .filter((team) => team.achievements)
    .flatMap((team) =>
      team.achievements!.map((achievement) => ({ ...achievement, team: team.name }))
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-neutral-400">Manage team achievements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={20} />
          Add Achievement
        </button>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-bold text-neutral-400">Title</th>
              <th className="text-left p-4 font-bold text-neutral-400">Rank</th>
              <th className="text-left p-4 font-bold text-neutral-400">Event</th>
              <th className="text-left p-4 font-bold text-neutral-400">Year</th>
              <th className="text-left p-4 font-bold text-neutral-400">Team</th>
              <th className="text-left p-4 font-bold text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {allAchievements.map((achievement, index) => (
              <tr key={index} className="hover:bg-white/5">
                <td className="p-4 font-medium">{achievement.title}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold">
                    {achievement.rank}
                  </span>
                </td>
                <td className="p-4">{achievement.event}</td>
                <td className="p-4">{achievement.year}</td>
                <td className="p-4">{achievement.team}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
