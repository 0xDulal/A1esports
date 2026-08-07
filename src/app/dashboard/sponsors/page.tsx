"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Handshake, Save, X, ExternalLink, Upload } from "lucide-react";
import { Sponsor, defaultSponsors } from "@/lib/sponsors";
import { sbInsert, sbUpdate, sbDelete, sbSelect } from "@/lib/supabase/rest";

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(defaultSponsors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [badge, setBadge] = useState("Official Partner");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    const data = await sbSelect<Sponsor>("sponsors");
    if (data && data.length > 0) {
      setSponsors(data);
    }
  };

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("/") || url.startsWith("data:image");
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setBadge("Official Partner");
    setDescription("");
    setLogo("");
    setWebsiteUrl("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setName(sponsor.name);
    setCategory(sponsor.category);
    setBadge(sponsor.badge);
    setDescription(sponsor.description);
    setLogo(sponsor.logo);
    setWebsiteUrl(sponsor.websiteUrl || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      badge,
      description,
      logo: logo || name.toUpperCase(),
      websiteUrl,
    };

    if (editingId) {
      await sbUpdate("sponsors", editingId, payload);
      setSponsors((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s))
      );
    } else {
      const newId = `sp-${Date.now()}`;
      const newSponsor = { id: newId, ...payload };
      await sbInsert("sponsors", newSponsor);
      setSponsors((prev) => [newSponsor, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;
    await sbDelete("sponsors", id);
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white flex items-center gap-2">
            <Handshake className="text-primary" /> Sponsor Management
          </h1>
          <p className="text-sm text-neutral-400">
            Manage partners, equipment sponsors, and brand logos
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,0,102,0.3)]"
        >
          <Plus size={16} /> Add Sponsor
        </button>
      </div>

      {/* Sponsors Table */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 font-bold text-neutral-400">Sponsor Logo</th>
                <th className="text-left p-4 font-bold text-neutral-400">Name</th>
                <th className="text-left p-4 font-bold text-neutral-400">Category</th>
                <th className="text-left p-4 font-bold text-neutral-400">Badge</th>
                <th className="text-left p-4 font-bold text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sponsors.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    {isImageUrl(s.logo) ? (
                      <div className="relative h-10 w-24 rounded-lg bg-neutral-800 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                        <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-xs font-black text-primary font-sans italic">
                        {s.logo}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      {s.name}
                      {s.websiteUrl && (
                        <a
                          href={s.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-primary"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-neutral-300 text-sm">{s.category}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                      {s.badge}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase text-white">
                {editingId ? "Edit Sponsor" : "Add Sponsor"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Sponsor Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                  placeholder="e.g. Red Bull"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                    placeholder="e.g. Energy Drink Partner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                    placeholder="e.g. Official Partner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Sponsor Logo (File Upload or Image URL)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingLogo(true);
                        try {
                          const { uploadImageToSupabase } = await import("@/lib/supabase/client");
                          const url = await uploadImageToSupabase(file, "images");
                          setLogo(url);
                        } catch (err) {
                          alert("Upload note: Using URL input");
                        } finally {
                          setUploadingLogo(false);
                        }
                      }}
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-black hover:file:bg-primary/90 cursor-pointer"
                    />
                    {uploadingLogo && <span className="text-xs text-primary animate-pulse">Uploading...</span>}
                  </div>

                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none text-sm"
                    placeholder="https://... or logo initials (e.g. RED BULL)"
                  />
                </div>

                {isImageUrl(logo) && (
                  <div className="mt-2 p-2 bg-neutral-950 border border-white/10 rounded-lg flex items-center gap-3">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase">Preview:</span>
                    <img src={logo} alt="Preview" className="h-8 object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                  placeholder="https://redbull.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none resize-none"
                  placeholder="Sponsor partnership details..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-black rounded-xl font-black uppercase flex items-center gap-2 hover:bg-primary/90"
                >
                  <Save size={16} /> Save Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
