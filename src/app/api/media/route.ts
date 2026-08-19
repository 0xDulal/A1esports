import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

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

export async function GET() {
  try {
    const bucket = "images";

    // 1. Fetch files from bucket root and subfolders
    const rootFiles = await listStorageFiles(bucket, "");
    const uploadFiles = await listStorageFiles(bucket, "uploads");

    const allStorageFiles = [...rootFiles, ...uploadFiles];

    // 2. Fetch image URLs in database to check usage
    const usedUrlMap = new Map<string, string[]>();

    const addUsage = (url: string | null | undefined, label: string) => {
      if (!url) return;
      const cleanUrl = url.trim().toLowerCase();
      const existing = usedUrlMap.get(cleanUrl) || [];
      usedUrlMap.set(cleanUrl, [...existing, label]);
    };

    // Query Products
    const { data: products } = await supabase.from("products").select("title, image, images");
    (products || []).forEach((p: any) => {
      addUsage(p.image, `Product: ${p.title}`);
      if (Array.isArray(p.images)) {
        p.images.forEach((img: string) => addUsage(img, `Product Gallery: ${p.title}`));
      }
    });

    // Query Players
    const { data: players } = await supabase.from("players").select("ign, name, image");
    (players || []).forEach((p: any) => {
      addUsage(p.image, `Player: ${p.ign} (${p.name})`);
    });

    // Query Teams
    const { data: teams } = await supabase.from("teams").select("name, logo, banner");
    (teams || []).forEach((t: any) => {
      addUsage(t.logo, `Team Logo: ${t.name}`);
      addUsage(t.banner, `Team Banner: ${t.name}`);
    });

    // Query News Articles
    const { data: news } = await supabase.from("news_articles").select("title, image");
    (news || []).forEach((n: any) => {
      addUsage(n.image, `News Article: ${n.title}`);
    });

    // 3. Map storage files to MediaFile format with usage details
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

    const mediaList: MediaFile[] = allStorageFiles.map((file) => {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${file.path}`;

      // Match public URL or path substring against DB usage
      const matchingUsages: string[] = [];
      usedUrlMap.forEach((labels, usedUrl) => {
        if (usedUrl.includes(file.path.toLowerCase()) || publicUrl.toLowerCase().includes(usedUrl)) {
          matchingUsages.push(...labels);
        }
      });

      const uniqueUsages = Array.from(new Set(matchingUsages));

      return {
        id: file.id || file.path,
        name: file.name,
        path: file.path,
        url: publicUrl,
        size: file.metadata?.size || 0,
        created_at: file.created_at || new Date().toISOString(),
        is_used: uniqueUsages.length > 0,
        used_by: uniqueUsages,
      };
    });

    return NextResponse.json({ success: true, media: mediaList });
  } catch (error: any) {
    console.error("Failed to list storage media:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bucket = "images";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const singlePath = searchParams.get("path");
    const body = await req.json().catch(() => ({}));

    const pathsToDelete: string[] = body.paths || (singlePath ? [singlePath] : []);

    if (pathsToDelete.length === 0) {
      return NextResponse.json({ error: "No media paths provided to delete" }, { status: 400 });
    }

    const bucket = "images";
    const { error, data } = await supabase.storage.from(bucket).remove(pathsToDelete);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Helper to recursively/folder list storage files from Supabase Storage
 */
async function listStorageFiles(bucket: string, folder: string) {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 1000,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error || !data) return [];

  const files: any[] = [];
  for (const item of data) {
    // If placeholder or folder, skip or recurse if needed
    if (item.name === ".emptyFolderPlaceholder") continue;

    const fullPath = folder ? `${folder}/${item.name}` : item.name;

    if (item.metadata) {
      files.push({ ...item, path: fullPath });
    }
  }

  return files;
}
