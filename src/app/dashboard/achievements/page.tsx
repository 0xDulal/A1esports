"use client";

import { useState } from "react";
import { teams } from "@/lib/teams";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type AchievementEntry = {
  id?: string;
  title: string;
  rank: string;
  event: string;
  year: string;
  team: string;
};

export default function AdminAchievements() {
  const initialAchievements: AchievementEntry[] = teams
    .filter((t) => t.achievements)
    .flatMap((t) =>
      t.achievements!.map((ach, idx) => ({
        id: `ach-${t.id}-${idx}`,
        title: ach.title,
        rank: ach.rank,
        event: ach.event,
        year: ach.year,
        team: t.name,
      }))
    );

  const [achievements, setAchievements] = useState<AchievementEntry[]>(initialAchievements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<AchievementEntry | null>(null);

  const [form, setForm] = useState<Partial<AchievementEntry>>({
    title: "Champions",
    rank: "1st",
    event: "",
    year: new Date().getFullYear().toString(),
    team: teams[0]?.name || "A1 Esports Professional",
  });

  const handleOpenAdd = () => {
    setEditingAch(null);
    setForm({
      title: "Champions",
      rank: "1st",
      event: "",
      year: "2026",
      team: teams[0]?.name || "A1 Esports Professional",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AchievementEntry) => {
    setEditingAch(item);
    setForm(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id?: string) => {
    if (confirm("Delete this achievement?")) {
      setAchievements(achievements.filter((a) => a.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAch) {
      setAchievements(
        achievements.map((a) =>
          a.id === editingAch.id ? ({ ...a, ...form } as AchievementEntry) : a
        )
      );
    } else {
      const newAch: AchievementEntry = {
        id: `ach-${Date.now()}`,
        title: form.title || "Champions",
        rank: form.rank || "1st",
        event: form.event || "Tournament",
        year: form.year || "2026",
        team: form.team || "A1 Esports Professional",
      };
      setAchievements([newAch, ...achievements]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-neutral-400">Manage tournament trophies and official placements</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add Achievement
        </button>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
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
              {achievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{achievement.title}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold">
                      {achievement.rank}
                    </span>
                  </td>
                  <td className="p-4 text-white font-bold">{achievement.event}</td>
                  <td className="p-4 text-neutral-400">{achievement.year}</td>
                  <td className="p-4 text-neutral-300">{achievement.team}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(achievement)}
                        className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(achievement.id)}
                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                      >
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


      {/* Form Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingAch ? "Edit Achievement" : "Add New Achievement"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Champions, Finalists, 1st Runner Up"
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Rank / Placement</label>
                  <input
                    type="text"
                    required
                    placeholder="1st, 2nd, Top 16..."
                    value={form.rank || ""}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Year</label>
                  <input
                    type="text"
                    required
                    value={form.year || ""}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Event / Tournament Name</label>
                <input
                  type="text"
                  required
                  placeholder="PMPL South Asia Spring..."
                  value={form.event || ""}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
