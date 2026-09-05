"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Image as ImageIcon, Check, Loader2, UploadCloud } from "lucide-react";
import { uploadImageToSupabase } from "@/lib/supabase/client";

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
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

export function MediaPicker({ open, onOpenChange, onSelect }: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchMedia();
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

  const handleFileSelect = (fileName: string) => {
    onSelect(getPublicUrl(fileName));
    onOpenChange(false);
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const url = await uploadImageToSupabase(file, "images");
        // Re-fetch to show the new image
        await fetchMedia();
        // Automatically select the newly uploaded image
        onSelect(url);
        onOpenChange(false);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black border border-neutral-800 text-white rounded-sm h-[80vh] flex flex-col p-0 overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="p-6 border-b border-neutral-800 bg-[#0a0a0a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-primary" />
              <DialogTitle className="text-xl font-michroma uppercase font-michroma uppercase tracking-widest text-white m-0 leading-none">
                Media Library
              </DialogTitle>
            </div>
            <Button onClick={handleUploadClick} disabled={uploading} variant="primary" size="sm" className="gap-2">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              Upload New
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-black relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-mono text-sm uppercase tracking-widest">No media found in storage</p>
            </div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.filter(f => f.name !== '.emptyFolderPlaceholder').map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileSelect(file.name)}
                  className="group relative aspect-square bg-[#0a0a0a] border border-neutral-800 rounded-sm overflow-hidden cursor-pointer hover:border-primary transition-colors"
                >
                  <Image
                    src={getPublicUrl(file.name)}
                    alt={file.name}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    sizes="200px"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-primary text-black rounded-full p-2 translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Filename tooltip/label */}
                  <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent text-[10px] font-mono text-neutral-400 truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
