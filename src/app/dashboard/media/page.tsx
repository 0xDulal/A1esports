"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Search,
  Grid,
  List,
  ExternalLink,
  CheckSquare,
  Square,
  AlertCircle,
  ImageIcon,
  HardDrive,
  Eye,
  Zap,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { compressAndOptimizeImage } from "@/lib/utils/image-optimizer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type MediaFile = {
  id: string;
  name: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
  is_used: boolean;
  used_by: string[];
};

export default function AdminMediaLibrary() {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optMessage, setOptMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "used" | "unused" | "unoptimized">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Selection state
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

  // Copy feedback state
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error("Failed to load media assets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Filtered list based on search query & status filter
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === "used") return item.is_used;
      if (statusFilter === "unused") return !item.is_used;
      if (statusFilter === "unoptimized") {
        const isWebp = item.name.toLowerCase().endsWith(".webp");
        return !isWebp || item.size > 400 * 1024;
      }
      return true;
    });
  }, [mediaList, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalFiles = mediaList.length;
    const totalBytes = mediaList.reduce((sum, item) => sum + (item.size || 0), 0);
    const usedCount = mediaList.filter((m) => m.is_used).length;
    const unusedCount = mediaList.filter((m) => !m.is_used).length;
    const unoptimizedCount = mediaList.filter((m) => {
      const isWebp = m.name.toLowerCase().endsWith(".webp");
      return !isWebp || m.size > 400 * 1024;
    }).length;

    const formattedSize =
      totalBytes > 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(totalBytes / 1024).toFixed(1)} KB`;

    return { totalFiles, formattedSize, usedCount, unusedCount, unoptimizedCount };
  }, [mediaList]);

  // Copy URL handler
  const handleCopyUrl = (url: string, path: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  // Selection handlers
  const toggleSelect = (path: string) => {
    const next = new Set(selectedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    setSelectedPaths(next);
  };

  const handleSelectAllUnused = () => {
    const unusedPaths = mediaList.filter((m) => !m.is_used).map((m) => m.path);
    setSelectedPaths(new Set(unusedPaths));
  };

  const handleClearSelection = () => {
    setSelectedPaths(new Set());
  };

  const [deleteSingleItem, setDeleteSingleItem] = useState<MediaFile | null>(null);
  const [deleteBulkOpen, setDeleteBulkOpen] = useState(false);

  // Single Delete Exec
  const handleConfirmSingleDelete = async () => {
    if (!deleteSingleItem) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: [deleteSingleItem.path] }),
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.path !== deleteSingleItem.path));
        selectedPaths.delete(deleteSingleItem.path);
        setSelectedPaths(new Set(selectedPaths));
      }
    } catch (err) {
      console.error("Failed to delete media", err);
    } finally {
      setDeleting(false);
      setDeleteSingleItem(null);
    }
  };

  // Bulk Delete Exec
  const handleConfirmBulkDelete = async () => {
    const pathsArray = Array.from(selectedPaths);
    if (pathsArray.length === 0) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: pathsArray }),
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => !selectedPaths.has(m.path)));
        setSelectedPaths(new Set());
      }
    } catch (err) {
      console.error("Failed bulk deletion", err);
    } finally {
      setDeleting(false);
      setDeleteBulkOpen(false);
    }
  };

  // Single Image Optimization Action
  const handleOptimizeSingle = async (item: MediaFile) => {
    setOptimizing(true);
    setOptMessage(`Downloading & optimizing "${item.name}"...`);

    try {
      // 1. Fetch current image blob
      const imgRes = await fetch(item.url);
      const blob = await imgRes.blob();
      const rawFile = new File([blob], item.name, { type: blob.type });

      // 2. Compress client side to WebP
      const optResult = await compressAndOptimizeImage(rawFile, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.82,
        format: "image/webp",
      });

      if (optResult.savedBytes <= 0) {
        alert(`"${item.name}" is already fully optimized!`);
        setOptimizing(false);
        setOptMessage(null);
        return;
      }

      setOptMessage(
        `Uploading WebP version... Saved ${(optResult.savedBytes / 1024).toFixed(1)} KB (${optResult.savedPercent}%)`
      );

      // 3. Upload new optimized file to Supabase Storage
      const formData = new FormData();
      formData.append("file", optResult.file);

      const uploadRes = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.success) {
        setOptMessage(`Optimization complete! Reloading assets...`);
        setTimeout(() => {
          fetchMedia();
          setOptimizing(false);
          setOptMessage(null);
        }, 1000);
      }
    } catch (err) {
      console.error("Optimization failed", err);
      alert("Failed to optimize image");
      setOptimizing(false);
      setOptMessage(null);
    }
  };

  // Direct File Upload with Automatic WebP Compression
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Compress and optimize before upload
      const { file: optimizedFile, savedPercent } = await compressAndOptimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.82,
        format: "image/webp",
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setIsUploadOpen(false);
        fetchMedia();
      } else {
        alert(`Upload error: ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to upload image", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ImageIcon size={28} className="text-primary" /> Media Storage Library
          </h1>
          <p className="text-neutral-400 text-sm">
            Inspect, filter, compress with WebP, copy CDN links, and clear unused assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-xs uppercase"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-black rounded-xl hover:bg-primary/90 transition-colors text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,0,102,0.3)]"
          >
            <Upload size={16} /> Upload Media
          </button>
        </div>
      </div>

      {/* Optimization Banner Notice if unoptimized images exist */}
      {stats.unoptimizedCount > 0 && (
        <div className="bg-gradient-to-r from-purple-900/40 via-neutral-900 to-primary/20 border border-purple-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Zap size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={14} className="text-primary" /> Image Optimization Available
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {stats.unoptimizedCount} files can be converted to WebP to save up to 80%–90% storage space & speed up site load times.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStatusFilter("unoptimized")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            View {stats.unoptimizedCount} Large Assets
          </button>
        </div>
      )}

      {optMessage && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl text-xs font-bold text-primary flex items-center gap-3 animate-pulse">
          <RefreshCw size={16} className="animate-spin" /> {optMessage}
        </div>
      )}

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">Total Assets</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.totalFiles}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
            <ImageIcon size={20} />
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">Storage Space</span>
            <span className="text-2xl font-black text-white mt-1 block font-mono">{stats.formattedSize}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
            <HardDrive size={20} />
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">In Use</span>
            <span className="text-2xl font-black text-green-400 mt-1 block">{stats.usedCount}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <Check size={20} />
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">Unused Assets</span>
            <span className="text-2xl font-black text-yellow-400 mt-1 block">{stats.unusedCount}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Status Filters, View Mode, Selection Controls */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search file name or path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Status Tabs & View Modes */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-neutral-800 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                  statusFilter === "all" ? "bg-primary text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                All ({mediaList.length})
              </button>
              <button
                onClick={() => setStatusFilter("used")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                  statusFilter === "used" ? "bg-green-500 text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                In Use ({stats.usedCount})
              </button>
              <button
                onClick={() => setStatusFilter("unused")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                  statusFilter === "unused" ? "bg-yellow-500 text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                Unused ({stats.unusedCount})
              </button>
              <button
                onClick={() => setStatusFilter("unoptimized")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                  statusFilter === "unoptimized" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                ⚡ Large ({stats.unoptimizedCount})
              </button>
            </div>

            <div className="flex items-center bg-neutral-800 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                }`}
                title="List Table View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs font-medium">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllUnused}
              className="flex items-center gap-1.5 text-yellow-400 font-bold hover:underline"
            >
              <CheckSquare size={14} /> Select All Unused ({stats.unusedCount})
            </button>
            {selectedPaths.size > 0 && (
              <button onClick={handleClearSelection} className="text-neutral-400 hover:text-white">
                Clear Selection ({selectedPaths.size})
              </button>
            )}
          </div>

          {selectedPaths.size > 0 && (
            <button
              onClick={() => setDeleteBulkOpen(true)}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors uppercase text-[11px]"
            >
              <Trash2 size={14} /> Delete Selected ({selectedPaths.size} Files)
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Grid View vs List View */}
      {loading ? (
        <div className="p-16 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Scanning Supabase Storage bucket...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-16 text-center text-neutral-400 bg-neutral-900 border border-white/10 rounded-2xl flex flex-col items-center gap-3">
          <ImageIcon size={48} className="text-neutral-600" />
          <p className="font-bold text-lg text-white">No Storage Media Found</p>
          <p className="text-sm text-neutral-500 max-w-sm">
            {searchQuery || statusFilter !== "all"
              ? "No files match your current search query or status filter."
              : "Upload images to populate your Supabase Storage media library."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredMedia.map((item) => {
            const isSelected = selectedPaths.has(item.path);
            const isWebp = item.name.toLowerCase().endsWith(".webp");

            return (
              <div
                key={item.path}
                className={`group relative bg-neutral-900 border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 bg-primary/5"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                {/* Checkbox Overlay */}
                <button
                  type="button"
                  onClick={() => toggleSelect(item.path)}
                  className="absolute top-2.5 left-2.5 z-20 p-1 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-black/90 transition-colors"
                >
                  {isSelected ? (
                    <CheckSquare size={16} className="text-primary" />
                  ) : (
                    <Square size={16} className="text-neutral-400" />
                  )}
                </button>

                {/* Status Badges Overlay */}
                <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1">
                  {item.is_used ? (
                    <span
                      className="px-2 py-0.5 bg-green-500/90 text-black font-black rounded-md text-[9px] uppercase tracking-wider shadow"
                      title={`Used by: ${item.used_by.join(", ")}`}
                    >
                      In Use
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-neutral-800/90 text-neutral-400 font-bold rounded-md text-[9px] uppercase tracking-wider border border-white/10">
                      Unused
                    </span>
                  )}

                  {isWebp ? (
                    <span className="px-1.5 py-0.5 bg-purple-500/90 text-white font-black rounded text-[8px] uppercase tracking-wider">
                      WEBP
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-yellow-500/90 text-black font-black rounded text-[8px] uppercase tracking-wider">
                      ORIGINAL
                    </span>
                  )}
                </div>

                {/* Thumbnail Container */}
                <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-10">
                    <button
                      onClick={() => setPreviewMedia(item)}
                      className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-colors"
                      title="Preview Details"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => handleOptimizeSingle(item)}
                      disabled={optimizing}
                      className="p-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-xl backdrop-blur-md transition-colors"
                      title="Compress & Convert to WebP"
                    >
                      <Zap size={15} />
                    </button>

                    <button
                      onClick={() => handleCopyUrl(item.url, item.path)}
                      className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-colors"
                      title="Copy Public URL"
                    >
                      {copiedPath === item.path ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                    </button>

                    <button
                      onClick={() => setDeleteSingleItem(item)}
                      className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl backdrop-blur-md transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3 bg-neutral-900 border-t border-white/5 space-y-1">
                  <p className="text-xs font-bold text-white truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>
                      {item.size ? (item.size / 1024).toFixed(0) + " KB" : "Unknown"}
                    </span>
                    <span>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {item.is_used && (
                    <p className="text-[10px] text-green-400/90 truncate font-medium pt-0.5">
                      {item.used_by[0]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead className="bg-white/5 text-xs text-neutral-400 uppercase">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <button
                      onClick={handleSelectAllUnused}
                      className="text-neutral-400 hover:text-white"
                    >
                      <Square size={16} />
                    </button>
                  </th>
                  <th className="p-4 text-left font-bold">Preview</th>
                  <th className="p-4 text-left font-bold">File Path</th>
                  <th className="p-4 text-left font-bold">Usage Status</th>
                  <th className="p-4 text-left font-bold">Size & Format</th>
                  <th className="p-4 text-left font-bold">Date Added</th>
                  <th className="p-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredMedia.map((item) => {
                  const isSelected = selectedPaths.has(item.path);
                  const isWebp = item.name.toLowerCase().endsWith(".webp");

                  return (
                    <tr key={item.path} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelect(item.path)}>
                          {isSelected ? (
                            <CheckSquare size={16} className="text-primary" />
                          ) : (
                            <Square size={16} className="text-neutral-500" />
                          )}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-950 border border-white/10">
                          <Image src={item.url} alt={item.name} fill className="object-cover" />
                        </div>
                      </td>

                      <td className="p-4 font-bold text-white font-mono">
                        <span className="block truncate max-w-xs">{item.path}</span>
                      </td>

                      <td className="p-4">
                        {item.is_used ? (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-bold text-[10px] uppercase">
                              In Use
                            </span>
                            <p className="text-[10px] text-neutral-400 truncate max-w-xs">
                              {item.used_by.join(", ")}
                            </p>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-white/10 rounded-full font-bold text-[10px] uppercase">
                            Unused
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono text-neutral-300">
                        <div className="flex items-center gap-2">
                          <span>{item.size ? (item.size / 1024).toFixed(1) + " KB" : "N/A"}</span>
                          {isWebp ? (
                            <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded font-black text-[9px]">
                              WEBP
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded font-black text-[9px]">
                              RAW
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-neutral-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOptimizeSingle(item)}
                            disabled={optimizing}
                            className="p-2 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                            title="Compress & Convert to WebP"
                          >
                            <Zap size={14} />
                          </button>

                          <button
                            onClick={() => handleCopyUrl(item.url, item.path)}
                            className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                            title="Copy Link"
                          >
                            {copiedPath === item.path ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                            title="Open Link"
                          >
                            <ExternalLink size={14} />
                          </a>

                          <button
                            onClick={() => setDeleteSingleItem(item)}
                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            title="Delete File"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {previewMedia && (
        <Dialog open={!!previewMedia} onOpenChange={() => setPreviewMedia(null)}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold truncate pr-6">{previewMedia.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                <Image src={previewMedia.url} alt={previewMedia.name} fill className="object-contain" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono">
                <div>
                  <span className="text-neutral-400 block uppercase font-bold text-[10px]">Storage Path</span>
                  <span className="text-white font-bold truncate block">{previewMedia.path}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block uppercase font-bold text-[10px]">File Size</span>
                  <span className="text-white font-bold">
                    {(previewMedia.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block uppercase font-bold text-[10px]">Usage Status</span>
                  <span className={previewMedia.is_used ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
                    {previewMedia.is_used ? "In Use" : "Unused"}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block uppercase font-bold text-[10px]">Uploaded Date</span>
                  <span className="text-white">{new Date(previewMedia.created_at).toLocaleString()}</span>
                </div>
              </div>

              {previewMedia.is_used && (
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-green-400 block uppercase tracking-wider text-[10px]">
                    Linked Entities:
                  </span>
                  <ul className="list-disc list-inside text-neutral-300 space-y-0.5">
                    {previewMedia.used_by.map((usage, idx) => (
                      <li key={idx}>{usage}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleOptimizeSingle(previewMedia)}
                  disabled={optimizing}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                >
                  <Zap size={14} /> Optimize to WebP
                </button>

                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <input
                    type="text"
                    readOnly
                    value={previewMedia.url}
                    className="flex-1 bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyUrl(previewMedia.url, previewMedia.path)}
                    className="px-4 py-2 bg-primary text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors shrink-0"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* --- UPLOAD MODAL --- */}
      {isUploadOpen && (
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase">Upload New Media Asset</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4 text-center">
              <div className="border-2 border-dashed border-white/20 hover:border-primary/50 rounded-2xl p-8 transition-colors flex flex-col items-center justify-center gap-3 bg-neutral-950">
                <Upload size={40} className="text-neutral-500" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Select image from your device</p>
                  <p className="text-xs text-neutral-400">
                    Automatic client-side WebP compression (80%–90% size reduction)
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadFile}
                  disabled={uploading}
                  className="w-full text-xs text-neutral-400 file:mr-3 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-primary file:text-black hover:file:bg-primary/90 cursor-pointer mt-2"
                />

                {uploading && (
                  <p className="text-xs text-primary font-bold animate-pulse pt-2">
                    Compressing & uploading WebP image to Supabase...
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Confirm Single Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteSingleItem}
        onClose={() => setDeleteSingleItem(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Delete Storage Media"
        variant={deleteSingleItem?.is_used ? "danger" : "warning"}
        description={
          deleteSingleItem?.is_used
            ? `CAUTION: "${deleteSingleItem?.name}" is currently IN USE by: ${deleteSingleItem?.used_by?.join(", ")}. Deleting this will break image links on your live site.`
            : `Are you sure you want to delete "${deleteSingleItem?.name}" from Supabase Storage?`
        }
      />

      {/* Confirm Bulk Delete Modal */}
      <ConfirmModal
        isOpen={deleteBulkOpen}
        onClose={() => setDeleteBulkOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Media Files"
        variant="danger"
        description={`Are you sure you want to permanently delete ${selectedPaths.size} selected media files from Supabase Storage?`}
      />
    </div>
  );
}
