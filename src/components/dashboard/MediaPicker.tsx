"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Image as ImageIcon,
  Check,
  Loader2,
  UploadCloud,
  CheckSquare,
  Square,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { uploadImageToSupabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  multiple?: boolean;
}

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
    cacheControl: string;
  };
}

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  onSelectMultiple,
  multiple = false,
}: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelectedNames(new Set());
    }
  }, [open]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .list("uploads", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error fetching media:", error);
      } else {
        setFiles(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from("images").getPublicUrl(`uploads/${fileName}`);
    return data.publicUrl;
  };

  const handleCardClick = (fileName: string) => {
    if (multiple) {
      setSelectedNames((prev) => {
        const next = new Set(prev);
        if (next.has(fileName)) {
          next.delete(fileName);
        } else {
          next.add(fileName);
        }
        return next;
      });
    } else {
      if (onSelect) {
        onSelect(getPublicUrl(fileName));
      }
      onOpenChange(false);
    }
  };

  const handleSelectAllVisible = () => {
    const validFiles = files.filter((f) => f.name !== ".emptyFolderPlaceholder");
    setSelectedNames(new Set(validFiles.map((f) => f.name)));
  };

  const handleClearSelection = () => {
    setSelectedNames(new Set());
  };

  const handleConfirmMultiple = () => {
    if (selectedNames.size === 0) return;
    const urls = Array.from(selectedNames).map((name) => getPublicUrl(name));
    if (onSelectMultiple) {
      onSelectMultiple(urls);
    } else if (onSelect && urls.length > 0) {
      onSelect(urls[0]);
    }
    toast.success(`Imported ${urls.length} asset${urls.length > 1 ? "s" : ""}`);
    onOpenChange(false);
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async (e: any) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;
      const fileArr: File[] = Array.from(fileList);

      setUploading(true);
      const toastId = toast.loading(`Uploading ${fileArr.length} image${fileArr.length > 1 ? "s" : ""}...`);

      try {
        const uploadedUrls: string[] = [];
        const uploadedNames: string[] = [];

        for (const file of fileArr) {
          const url = await uploadImageToSupabase(file, "images");
          if (url) {
            uploadedUrls.push(url);
            // Extract filename from URL
            const name = url.split("/").pop();
            if (name) uploadedNames.push(name);
          }
        }

        await fetchMedia();

        if (multiple) {
          // Add uploaded names to current selection
          setSelectedNames((prev) => {
            const next = new Set(prev);
            uploadedNames.forEach((n) => next.add(n));
            return next;
          });
          toast.success(`Uploaded ${uploadedUrls.length} file(s)`, { id: toastId });
        } else {
          if (onSelect && uploadedUrls.length > 0) {
            onSelect(uploadedUrls[0]);
            toast.success("Image uploaded & selected", { id: toastId });
            onOpenChange(false);
          }
        }
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Upload failed for one or more files", { id: toastId });
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const validFiles = files.filter((f) => f.name !== ".emptyFolderPlaceholder");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-[#0a0a0a] border border-neutral-800 text-white rounded-none h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-primary/30 bg-primary/10 text-primary">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-mono font-bold uppercase tracking-wider text-white m-0 leading-none">
                  Supabase Media Library
                </DialogTitle>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase">
                  {multiple ? "Batch Multi-Select" : "Single Asset Select"}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-500 mt-1">
                {multiple
                  ? "Select multiple photos to batch import into your product gallery"
                  : "Click any image to select it as the primary asset"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {multiple && validFiles.length > 0 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllVisible}
                  className="hidden sm:flex"
                >
                  <CheckSquare size={13} /> Select All
                </Button>
                {selectedNames.size > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                    className="text-neutral-400 hover:text-white"
                  >
                    Clear ({selectedNames.size})
                  </Button>
                )}
              </>
            )}

            <Button
              onClick={handleUploadClick}
              disabled={uploading}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>Upload New</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-black relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Loading assets from storage...
              </span>
            </div>
          ) : validFiles.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
              <ImageIcon className="w-12 h-12 mb-3 opacity-40 text-neutral-600" />
              <p className="font-mono text-sm uppercase tracking-widest text-neutral-400">
                No media found in storage
              </p>
              <p className="font-mono text-xs text-neutral-600 mt-1">
                Click &quot;Upload New&quot; above to add images
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {validFiles.map((file) => {
                const isSelected = selectedNames.has(file.name);
                return (
                  <div
                    key={file.id}
                    onClick={() => handleCardClick(file.name)}
                    className={`group relative aspect-square bg-[#0c0c0c] border transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/40 bg-primary/10 shadow-[0_0_15px_rgba(255,0,102,0.25)]"
                        : "border-neutral-800 hover:border-primary/80"
                    }`}
                  >
                    <Image
                      src={getPublicUrl(file.name)}
                      alt={file.name}
                      fill
                      className={`object-cover transition-all duration-300 ${
                        isSelected
                          ? "opacity-100 scale-105"
                          : "opacity-75 group-hover:opacity-100 group-hover:scale-105"
                      }`}
                      sizes="200px"
                    />

                    {/* Selection Indicator */}
                    {multiple ? (
                      <div className="absolute top-2 right-2 z-10">
                        {isSelected ? (
                          <div className="bg-primary text-black p-1 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="bg-black/60 border border-neutral-600 group-hover:border-primary p-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Hover Check for single mode */
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-primary text-black p-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                    )}

                    {/* Filename Badge */}
                    <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black via-black/80 to-transparent text-[10px] font-mono text-neutral-300 truncate">
                      {file.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Multi-select Floating / Sticky Bottom Bar */}
        {multiple && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 bg-primary/10 border border-primary/30 text-primary font-mono font-bold text-xs">
                {selectedNames.size} SELECTED
              </div>
              <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                {selectedNames.size === 0
                  ? "Click photos to select them for import"
                  : `${selectedNames.size} photos ready to import`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={selectedNames.size === 0}
                onClick={handleConfirmMultiple}
                className="min-w-[160px]"
              >
                <Layers size={13} />
                <span>Import ({selectedNames.size})</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
