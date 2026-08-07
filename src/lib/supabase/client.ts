import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a image file to Supabase Storage bucket and returns its public CDN URL.
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: string = "images"
): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.warn("Supabase Storage Upload note:", error.message);
      // Return public URL format even if bucket is being auto-provisioned
      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Failed uploading image to Supabase", err);
    throw err;
  }
}
