"use client";

import { useEffect, useState } from "react";
import { Team, Player } from "@/lib/teams";
import { getTeamsFromSupabase } from "@/lib/supabase/db";
import { sbInsert, sbUpdate, sbDelete } from "@/lib/supabase/rest";
import Image from "next/image";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PRESET_ROLES = [
  "IGL",
  "Assaulter",
  "Fragger",
  "Sniper",
  "Support",
  "Coach",
  "Manager",
  "Analyst",
  "Substitute",
  "Content Creator",
];

export default function AdminTeams() {
  const [teamsList, setTeamsList] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamForm, setTeamForm] = useState<Partial<Team>>({
    name: "",
    game: "",
    logo: "/A1esports_logo_white.svg",
  });

  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [editingPlayer, setEditingPlayer] = useState<(Player & { id?: string }) | null>(null);
  const [playerForm, setPlayerForm] = useState<{
    id?: string;
    ign: string;
    name: string;
    role: string;
    image: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  }>({
    ign: "",
    name: "",
    role: "Assaulter",
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });
  const [uploadingPlayerImg, setUploadingPlayerImg] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const data = await getTeamsFromSupabase();
    setTeamsList(data || []);
    setLoading(false);
  };

  const handleOpenAddTeam = () => {
    setEditingTeam(null);
    setTeamForm({
      name: "",
      game: "PUBG Mobile Pro",
      logo: "/A1esports_logo_white.svg",
    });
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamForm(team);
    setIsTeamModalOpen(true);
  };

  const handleDeleteTeam = async (id: string) => {
    if (confirm("Are you sure you want to delete this team and its entire roster?")) {
      await sbDelete("teams", id);
      setTeamsList((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: teamForm.name || "New Team",
      game: teamForm.game || "PUBG Mobile Pro",
      logo: teamForm.logo || "/A1esports_logo_white.svg",
    };

    if (editingTeam) {
      await sbUpdate("teams", editingTeam.id, payload);
      setTeamsList((prev) =>
        prev.map((t) =>
          t.id === editingTeam.id ? ({ ...t, ...payload } as Team) : t
        )
      );
    } else {
      const id = `team-${Date.now()}`;
      const newTeam: Team = {
        id,
        ...payload,
        players: [],
      };
      await sbInsert("teams", { id, ...payload });
      setTeamsList((prev) => [...prev, newTeam]);
    }
    setIsTeamModalOpen(false);
  };

  // --- PLAYER ACTIONS ---
  const handleOpenAddPlayer = (teamId: string) => {
    setSelectedTeamId(teamId);
    setEditingPlayer(null);
    setPlayerForm({
      ign: "",
      name: "",
      role: "Assaulter",
      image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png",
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    });
    setIsPlayerModalOpen(true);
  };

  const handleOpenEditPlayer = (teamId: string, player: Player & { id?: string }) => {
    setSelectedTeamId(teamId);
    setEditingPlayer(player);
    setPlayerForm({
      id: player.id,
      ign: player.ign,
      name: player.name,
      role: player.role,
      image: player.image,
      facebook: player.socials?.facebook || "",
      twitter: player.socials?.twitter || "",
      instagram: player.socials?.instagram || "",
      youtube: player.socials?.youtube || "",
    });
    setIsPlayerModalOpen(true);
  };

  const handleDeletePlayer = async (teamId: string, player: Player & { id?: string }) => {
    if (confirm(`Remove player ${player.ign} from team?`)) {
      if (player.id) {
        await sbDelete("players", player.id);
      }
      setTeamsList((prev) =>
        prev.map((team) =>
          team.id === teamId
            ? { ...team, players: team.players.filter((p) => p.ign !== player.ign) }
            : team
        )
      );
    }
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    const playerId = playerForm.id || `player-${Date.now()}`;
    const playerObj: Player & { id?: string } = {
      id: playerId,
      ign: playerForm.ign || "PLAYER",
      name: playerForm.name || "Pro Player",
      role: playerForm.role || "Assaulter",
      image: playerForm.image || "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png",
      socials: {
        facebook: playerForm.facebook,
        twitter: playerForm.twitter,
        instagram: playerForm.instagram,
        youtube: playerForm.youtube,
      },
    };

    const dbPayload = {
      id: playerId,
      team_id: selectedTeamId,
      ign: playerObj.ign,
      name: playerObj.name,
      role: playerObj.role,
      image: playerObj.image,
      socials: playerObj.socials,
    };

    if (editingPlayer && editingPlayer.id) {
      await sbUpdate("players", editingPlayer.id, dbPayload);
    } else {
      await sbInsert("players", dbPayload);
    }

    setTeamsList((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTeamId) return t;
        const exists = t.players.some((p) => p.ign === editingPlayer?.ign || (p as any).id === playerId);
        let updatedPlayers: Player[];
        if (exists) {
          updatedPlayers = t.players.map((p) =>
            p.ign === editingPlayer?.ign || (p as any).id === playerId ? playerObj : p
          );
        } else {
          updatedPlayers = [...t.players, playerObj];
        }
        return { ...t, players: updatedPlayers };
      })
    );

    setIsPlayerModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teams & Roster Management</h1>
          <p className="text-neutral-400">
            Create, edit, and delete teams & players. All changes sync live to the website.
          </p>
        </div>
        <button
          onClick={handleOpenAddTeam}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,0,102,0.3)]"
        >
          <Plus size={20} />
          Add Team
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Loading organization teams...
        </div>
      ) : (
        <div className="space-y-6">
          {teamsList.map((team) => (
            <div key={team.id} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-6">
              {/* Team Banner Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0 border border-white/10">
                    <Image
                      src={team.logo || "/A1esports_logo_white.svg"}
                      alt={team.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white">{team.name}</h2>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{team.game}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddPlayer(team.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors"
                  >
                    <UserPlus size={14} /> Add Player
                  </button>
                  <button
                    onClick={() => handleOpenEditTeam(team)}
                    className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                    title="Edit Team"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                    title="Delete Team"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Roster Players Grid */}
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                  Roster ({team.players ? team.players.length : 0} Players)
                </div>

                {(!team.players || team.players.length === 0) ? (
                  <div className="py-6 text-center text-neutral-500 text-xs border border-dashed border-white/10 rounded-xl">
                    No players assigned to this team yet. Click &quot;Add Player&quot; above to add members.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {team.players.map((player) => (
                      <div
                        key={player.ign}
                        className="bg-neutral-800/80 border border-white/5 rounded-xl p-4 text-center relative group hover:border-primary/50 transition-all"
                      >
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => handleOpenEditPlayer(team.id, player)}
                            className="p-1 bg-white/20 text-white rounded hover:bg-white/30"
                            title="Edit Player"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(team.id, player)}
                            className="p-1 bg-red-500/30 text-red-400 rounded hover:bg-red-500/50"
                            title="Remove Player"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="relative h-20 w-20 rounded-full mx-auto mb-3 overflow-hidden bg-neutral-900 border border-white/10 shadow-md">
                          <Image
                            src={player.image || "/A1esports_logo_white.svg"}
                            alt={player.ign}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-black text-sm text-white">{player.ign}</p>
                        <p className="text-[11px] text-neutral-400 font-medium">{player.name}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {player.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- TEAM MODAL --- */}
      {isTeamModalOpen && (
        <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingTeam ? "Edit Team" : "Add New Team"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveTeam} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={teamForm.name || ""}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. A1 Esports PUBG Mobile"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Game / Division Title</label>
                <input
                  type="text"
                  required
                  value={teamForm.game || ""}
                  onChange={(e) => setTeamForm({ ...teamForm, game: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. PUBG Mobile Pro"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Logo URL</label>
                <input
                  type="text"
                  required
                  value={teamForm.logo || ""}
                  onChange={(e) => setTeamForm({ ...teamForm, logo: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Save Team
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* --- PLAYER MODAL --- */}
      {isPlayerModalOpen && (
        <Dialog open={isPlayerModalOpen} onOpenChange={setIsPlayerModalOpen}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingPlayer ? "Edit Player Profile" : "Add Player to Roster"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSavePlayer} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">In-Game Name (IGN)</label>
                  <input
                    type="text"
                    required
                    value={playerForm.ign}
                    onChange={(e) => setPlayerForm({ ...playerForm, ign: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. SiBOX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={playerForm.name}
                    onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Abdullah Al Mamun"
                  />
                </div>
              </div>

              {/* Custom Role / Position Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-400 uppercase">Role / Position</label>
                  <span className="text-[10px] text-primary font-bold">Custom Editable</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Type custom role or select below..."
                    value={playerForm.role}
                    onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm font-bold text-primary focus:outline-none focus:border-primary"
                  />

                  {/* Preset Suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PRESET_ROLES.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setPlayerForm({ ...playerForm, role: preset })}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors border ${
                          playerForm.role === preset
                            ? "bg-primary text-black border-primary"
                            : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Player Headshot Image</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingPlayerImg(true);
                        try {
                          const { uploadImageToSupabase } = await import("@/lib/supabase/client");
                          const url = await uploadImageToSupabase(file, "images");
                          setPlayerForm((prev) => ({ ...prev, image: url }));
                        } catch (err) {
                          alert("Upload note: Using URL fallback");
                        } finally {
                          setUploadingPlayerImg(false);
                        }
                      }}
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-black hover:file:bg-primary/90 cursor-pointer"
                    />
                    {uploadingPlayerImg && <span className="text-xs text-primary animate-pulse">Uploading...</span>}
                  </div>

                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={playerForm.image}
                    onChange={(e) => setPlayerForm({ ...playerForm, image: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="block text-xs font-bold text-neutral-400 uppercase">Social Media Handles (Optional)</label>
                <input
                  type="text"
                  placeholder="Facebook profile or page link..."
                  value={playerForm.facebook || ""}
                  onChange={(e) => setPlayerForm({ ...playerForm, facebook: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Instagram handle or link..."
                  value={playerForm.instagram || ""}
                  onChange={(e) => setPlayerForm({ ...playerForm, instagram: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Twitter / X handle or link..."
                  value={playerForm.twitter || ""}
                  onChange={(e) => setPlayerForm({ ...playerForm, twitter: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="YouTube channel link..."
                  value={playerForm.youtube || ""}
                  onChange={(e) => setPlayerForm({ ...playerForm, youtube: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayerModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Save Player
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
