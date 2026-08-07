import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/rest";

export const dynamic = "force-dynamic";

export async function GET() {
  const { url, key } = getSupabaseConfig();
  const configured = Boolean(url && key);
  return NextResponse.json({ configured });
}

