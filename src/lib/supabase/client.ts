import { createClient } from "@supabase/supabase-js";
import { compressAndOptimizeImage } from "@/lib/utils/image-optimizer";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads an image file to Supabase Storage bucket with automatic client-side WebP compression.
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: string = "images"
): Promise<string> {
  try {
    // Automatically compress & convert to WebP before uploading
    let targetFile = file;
    try {
      const { file: optimized } = await compressAndOptimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.82,
        format: "image/webp",
      });
      targetFile = optimized;
    } catch (e) {
      console.warn("Client-side image optimization skipped/failed, using raw file:", e);
    }

    const fileExt = targetFile.name.split(".").pop() || "webp";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, targetFile, {
        cacheControl: "31536000",
        contentType: targetFile.type || "image/webp",
        upsert: true,
      });

    if (error) {
      console.warn("Supabase Storage Upload note:", error.message);
      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Failed uploading image to Supabase", err);
    throw err;
  }
}
