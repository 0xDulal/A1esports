import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/rest";

export async function GET() {
  const { url, key } = getSupabaseConfig();
  const configured = Boolean(url && key);
  return NextResponse.json({ configured });
}

