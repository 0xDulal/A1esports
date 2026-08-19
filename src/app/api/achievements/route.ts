import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return NextResponse.json({ achievements: [] });
    }

    return NextResponse.json({ achievements: data });
  } catch (err) {
    return NextResponse.json({ achievements: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, rank, event, year, date, tier, prize } = body;

    if (!event && !title) {
      return NextResponse.json({ error: "Tournament event title is required." }, { status: 400 });
    }

    const newAch = {
      id: `ach-${Date.now()}`,
      title: title || event || "Tournament Achievement",
      rank: rank || "1st",
      event: event || title || "Event",
      year: year || new Date().getFullYear().toString(),
      date: date || new Date().toISOString().split("T")[0],
      tier: tier || "B-Tier",
      prize: prize || "$0",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("achievements")
      .insert([newAch])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, achievement: data?.[0] || newAch });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create achievement" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, rank, event, year, date, tier, prize } = body;

    if (!id) {
      return NextResponse.json({ error: "Achievement ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("achievements")
      .update({
        ...(title && { title }),
        ...(rank && { rank }),
        ...(event && { event }),
        ...(year && { year }),
        ...(date && { date }),
        ...(tier && { tier }),
        ...(prize && { prize }),
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, achievement: data?.[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Achievement ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete achievement" }, { status: 500 });
  }
}
