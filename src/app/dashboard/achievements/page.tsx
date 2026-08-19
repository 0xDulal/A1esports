"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Trophy, RefreshCw, Layers, Globe, Database, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type AchievementEntry = {
  id?: string;
  title: string;
  rank: string;
  event: string;
  year: string;
  date?: string;
  tier?: string;
  prize?: string;
};

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<AchievementEntry[]>([]);
  const [sourceMode, setSourceMode] = useState<"merged" | "liquipedia" | "custom">("merged");
  const [loading, setLoading] = useState(true);
  const [savingSource, setSavingSource] = useState(false);
  const [sourceSaved, setSourceSaved] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<AchievementEntry | null>(null);

  const [form, setForm] = useState<Partial<AchievementEntry>>({
    title: "Champions",
    rank: "1st",
    event: "",
    year: new Date().getFullYear().toString(),
    tier: "B-Tier",
    prize: "$1,000",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [achRes, settingsRes] = await Promise.all([
        fetch("/api/achievements"),
        fetch("/api/settings"),
      ]);

      const achData = await achRes.json();
      const settingsData = await settingsRes.json();

      setAchievements(achData.achievements || []);
      if (settingsData.achievementSource) {
        setSourceMode(settingsData.achievementSource);
      }
    } catch (e) {
      console.error("Failed to load achievements", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSourceMode = async (mode: "merged" | "liquipedia" | "custom") => {
    setSourceMode(mode);
    setSavingSource(true);
    setSourceSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_achievement_source",
          mode,
        }),
      });

      if (res.ok) {
        setSourceSaved(true);
        setTimeout(() => setSourceSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save achievement priority mode", err);
    } finally {
      setSavingSource(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAch(null);
    setForm({
      title: "Champions",
      rank: "1st",
      event: "",
      year: new Date().getFullYear().toString(),
      tier: "B-Tier",
      prize: "$1,000",
    });
    setIsModalOpen(true);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpenEdit = (item: AchievementEntry) => {
    setEditingAch(item);
    setForm(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const targetId = deleteId;
    setAchievements((prev) => prev.filter((a) => String(a.id) !== String(targetId)));
    try {
      await fetch(`/api/achievements?id=${targetId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete achievement", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.event || form.title || "Champions",
      rank: form.rank || "1st",
      event: form.event || form.title || "Tournament",
      year: form.year || "2026",
      tier: form.tier || "B-Tier",
      prize: form.prize || "$0",
    };

    try {
      if (editingAch && editingAch.id) {
        await fetch("/api/achievements", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAch.id, ...payload }),
        });
      } else {
        await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save achievement", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tournament Achievements</h1>
          <p className="text-neutral-400">Configure homepage source priority and manage custom tournament records</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-xs uppercase"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-black rounded-xl hover:bg-primary/90 transition-colors text-xs uppercase tracking-wider"
          >
            <Plus size={16} /> Add Achievement
          </button>
        </div>
      </div>

      {/* Priority Toggle Card */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers size={20} className="text-primary" /> Homepage Source Priority Mode
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Select how tournament achievements are compiled and rendered on the storefront
            </p>
          </div>
          {sourceSaved && (
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} /> Source Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            {
              id: "merged",
              title: "Merged Mode (Recommended)",
              desc: "Combines Liquipedia live wiki records + Custom DB entries",
              icon: Layers,
            },
            {
              id: "liquipedia",
              title: "Liquipedia Only",
              desc: "Fetches strictly from the official PUBG Mobile Liquipedia wiki API",
              icon: Globe,
            },
            {
              id: "custom",
              title: "Custom Database Only",
              desc: "Displays only achievements entered in this admin dashboard",
              icon: Database,
            },
          ].map((modeItem) => {
            const isSelected = sourceMode === modeItem.id;
            return (
              <button
                key={modeItem.id}
                type="button"
                onClick={() => handleUpdateSourceMode(modeItem.id as any)}
                disabled={savingSource}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? "bg-primary/15 border-primary text-white shadow-[0_0_25px_rgba(255,0,102,0.15)]"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20"
                }`}
              >
                <modeItem.icon size={22} className={isSelected ? "text-primary" : "text-neutral-500"} />
                <div className="mt-4">
                  <span className="text-sm font-black uppercase tracking-wider block">{modeItem.title}</span>
                  <span className="text-[11px] text-neutral-400 font-medium leading-relaxed block mt-1">
                    {modeItem.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Database Achievements Table */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy size={20} className="text-primary" /> Custom Database Records ({achievements.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading custom achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 flex flex-col items-center gap-3">
            <Trophy size={40} className="text-neutral-600" />
            <p className="font-bold text-lg">No Custom Achievements Found</p>
            <p className="text-sm text-neutral-500">Add local, national, or unlisted tournaments to display them on the storefront.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Event / Tournament</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Rank</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Tier</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Prize</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Year / Date</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {achievements.map((achievement) => (
                  <tr key={achievement.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white text-sm">{achievement.event || achievement.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold">
                        {achievement.rank || achievement.title || "1st"}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-neutral-300">
                      {achievement.tier || "B-Tier"}
                    </td>
                    <td className="p-4 font-mono text-sm text-primary font-bold">
                      {achievement.prize || "$0"}
                    </td>
                    <td className="p-4 text-xs text-neutral-400">
                      {achievement.date || achievement.year || "2026"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(achievement)}
                          className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                          title="Edit Achievement"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(achievement.id || null)}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Delete Achievement"
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
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase">
                {editingAch ? "Edit Achievement" : "Add New Achievement"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Event / Tournament Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PUBG Mobile National Championship BD 2026"
                  value={form.event || ""}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Rank / Placement *</label>
                  <input
                    type="text"
                    required
                    placeholder="1st, 2nd, Top 16..."
                    value={form.rank || ""}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Event Tier *</label>
                  <select
                    value={form.tier || "B-Tier"}
                    onChange={(e) => setForm({ ...form, tier: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                  >
                    <option value="S-Tier">S-Tier (Global)</option>
                    <option value="A-Tier">A-Tier (Regional Pro)</option>
                    <option value="B-Tier">B-Tier (National)</option>
                    <option value="C-Tier">C-Tier (Community/Local)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Prize Money</label>
                  <input
                    type="text"
                    placeholder="$2,500 or ৳2,00,000"
                    value={form.prize || ""}
                    onChange={(e) => setForm({ ...form, prize: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Year / Date</label>
                  <input
                    type="text"
                    placeholder="2026-05-15 or 2026"
                    value={form.year || ""}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold uppercase hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {/* Confirm Delete Popup */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Achievement"
        description="Are you sure you want to delete this tournament achievement record from Supabase?"
      />
    </div>
  );
}
