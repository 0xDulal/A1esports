"use client";

import { useEffect, useState } from "react";
import { NewsArticle } from "@/types/domain";
import { getNewsFromSupabase } from "@/services/supabase/db.service";
import { supabase, uploadImageToSupabase } from "@/lib/supabase/client";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Newspaper,
  Plus,
  Trash2,
  Edit,
  Upload,
  Calendar,
  Clock,
  User,
  Tag as TagIcon,
  Eye,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<NewsArticle["category"]>("ANNOUNCEMENT");
  const [author, setAuthor] = useState("A1 Esports");
  const [readTime, setReadTime] = useState("3 min read");
  const [image, setImage] = useState("");
  const [summary, setSummary] = useState("");
  const [contentRaw, setContentRaw] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Confirm delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const data = await getNewsFromSupabase();
    setArticles(data);
    setLoading(false);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticle) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleOpenAddModal = () => {
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setCategory("ANNOUNCEMENT");
    setAuthor("A1 Esports");
    setReadTime("3 min read");
    setImage("");
    setSummary("");
    setContentRaw("");
    setTagsRaw("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (art: NewsArticle) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSlug(art.slug);
    setCategory(art.category);
    setAuthor(art.author);
    setReadTime(art.readTime);
    setImage(art.image);
    setSummary(art.summary);
    setContentRaw(Array.isArray(art.content) ? art.content.join("\n\n") : art.content || "");
    setTagsRaw(Array.isArray(art.tags) ? art.tags.join(", ") : "");
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImageToSupabase(file);
      setImage(url);
      toast.success("Cover image uploaded & WebP compressed!");
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Article title is required.");
      return;
    }

    setSaving(true);
    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const contentArray = contentRaw
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const tagsArray = tagsRaw
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const payload = {
      title,
      slug: finalSlug,
      category,
      author,
      read_time: readTime,
      image,
      summary,
      content: contentArray,
      tags: tagsArray,
      date: editingArticle?.date || new Date().toISOString().split("T")[0],
    };

    try {
      if (editingArticle) {
        const { error } = await supabase
          .from("news_articles")
          .update(payload)
          .eq("id", editingArticle.id);

        if (error) throw error;
        toast.success("Article updated successfully!");
      } else {
        const { error } = await supabase
          .from("news_articles")
          .insert([payload]);

        if (error) throw error;
        toast.success("New article published!");
      }

      setModalOpen(false);
      fetchArticles();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    // Optimistic UI update
    setArticles((prev) => prev.filter((a) => a.id !== deleteTargetId));

    try {
      const { error } = await supabase
        .from("news_articles")
        .delete()
        .eq("id", deleteTargetId);

      if (error) throw error;
      toast.success("Article deleted successfully.");
    } catch (err: any) {
      toast.error("Failed to delete article from database.");
      fetchArticles();
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Newspaper className="text-primary" size={28} /> News & Articles CMS
          </h1>
          <p className="text-neutral-400 text-sm">
            Publish announcements, tournament recaps, and roster news
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,0,102,0.2)]"
        >
          <Plus size={16} /> Create Article
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Loading news articles...
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <Newspaper size={48} className="mx-auto text-neutral-600" />
          <h3 className="text-xl font-bold text-white">No Articles Published Yet</h3>
          <p className="text-neutral-400 text-sm">
            Create your first news story to engage fans and improve site SEO.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Publish First Article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition-all"
            >
              <div className="space-y-4">
                <div className="relative h-48 w-full bg-neutral-950 overflow-hidden">
                  {art.image ? (
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-700">
                      <Newspaper size={40} />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-primary text-black font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {art.category}
                  </span>
                </div>

                <div className="px-5 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-primary" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                <Link
                  href={`/news/${art.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-primary transition-colors"
                >
                  <Eye size={14} /> Preview
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(art)}
                    className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(art.id)}
                    className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Newspaper className="text-primary" size={22} />
                {editingArticle ? "Edit News Article" : "Create New Article"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. A1 Esports Crowned PMNC Bangladesh 2026 Champions"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary text-sm font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="a1-esports-crowned-pmnc-2026"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-neutral-300 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary font-bold"
                  >
                    <option value="TOURNAMENT">TOURNAMENT</option>
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="ROSTER">ROSTER</option>
                    <option value="COMMUNITY">COMMUNITY</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="3 min read"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                  Cover Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL or upload below..."
                    className="flex-1 px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary text-xs"
                  />
                  <label className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl cursor-pointer transition-colors shrink-0 flex items-center gap-2">
                    <Upload size={14} />
                    {uploadingImage ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                  Short Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="Brief 1-2 sentence teaser summary for news cards..."
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                  Article Content (separate paragraphs with blank lines)
                </label>
                <textarea
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  rows={6}
                  placeholder="First paragraph...&#10;&#10;Second paragraph...&#10;&#10;Third paragraph..."
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1.5 uppercase tracking-wider">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsRaw}
                  onChange={(e) => setTagsRaw(e.target.value)}
                  placeholder="PUBGM, PMNC, Champions, Esports"
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingArticle ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete News Article"
        description="Are you sure you want to permanently delete this news article? This action cannot be undone."
        variant="danger"
        confirmText="Delete Article"
      />
    </div>
  );
}
