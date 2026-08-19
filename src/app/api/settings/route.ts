import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { DEFAULT_DELIVERY_CHARGES, DEFAULT_PAYMENT_METHODS } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [pmRes, settingsRes, achSourceRes] = await Promise.all([
      supabase.from("payment_methods").select("*").order("created_at", { ascending: true }),
      supabase.from("site_settings").select("value").eq("key", "delivery_charges").single(),
      supabase.from("site_settings").select("value").eq("key", "achievement_source").single(),
    ]);

    const paymentMethods = pmRes.data && pmRes.data.length > 0 ? pmRes.data : DEFAULT_PAYMENT_METHODS;
    const deliveryCharges = settingsRes.data?.value || DEFAULT_DELIVERY_CHARGES;
    const achievementSource = achSourceRes.data?.value?.mode || "merged";

    return NextResponse.json({
      paymentMethods,
      deliveryCharges,
      achievementSource,
    });
  } catch (err) {
    return NextResponse.json({
      paymentMethods: DEFAULT_PAYMENT_METHODS,
      deliveryCharges: DEFAULT_DELIVERY_CHARGES,
      achievementSource: "merged",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // Action: Update achievement source mode
    if (action === "update_achievement_source") {
      const { mode } = body;
      const payload = {
        key: "achievement_source",
        value: { mode: mode || "merged" },
        updated_at: new Date().toISOString(),
      };

      try {
        await supabase.from("site_settings").upsert(payload);
      } catch {}

      return NextResponse.json({ success: true, achievementSource: mode });
    }

    // Action: Update delivery charges
    if (action === "update_delivery") {
      const { inside_dhaka, outside_dhaka } = body;
      const payload = {
        key: "delivery_charges",
        value: {
          inside_dhaka: Number(inside_dhaka || 60),
          outside_dhaka: Number(outside_dhaka || 120),
        },
        updated_at: new Date().toISOString(),
      };

      try {
        await supabase.from("site_settings").upsert(payload);
      } catch {}

      return NextResponse.json({ success: true, deliveryCharges: payload.value });
    }

    // Action: Add new payment method
    if (action === "add_payment_method") {
      const { name, type, account_number, instructions, is_active } = body;
      if (!name) {
        return NextResponse.json({ error: "Payment method name is required." }, { status: 400 });
      }

      const newPm = {
        id: `pm-${Date.now()}`,
        name,
        type: type || "digital",
        account_number: account_number || "",
        instructions: instructions || "",
        is_active: is_active ?? true,
        created_at: new Date().toISOString(),
      };

      try {
        await supabase.from("payment_methods").insert([newPm]);
      } catch {}

      return NextResponse.json({ success: true, paymentMethod: newPm });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, account_number, instructions, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "Payment Method ID is required" }, { status: 400 });
    }

    try {
      await supabase
        .from("payment_methods")
        .update({
          ...(name && { name }),
          ...(account_number !== undefined && { account_number }),
          ...(instructions !== undefined && { instructions }),
          ...(is_active !== undefined && { is_active }),
        })
        .eq("id", id);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update payment method" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Payment Method ID is required" }, { status: 400 });
    }

    try {
      await supabase.from("payment_methods").delete().eq("id", id);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete payment method" }, { status: 500 });
  }
}
