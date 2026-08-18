import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { DEFAULT_COUPONS } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ coupons: DEFAULT_COUPONS });
    }

    return NextResponse.json({ coupons: data });
  } catch (err) {
    return NextResponse.json({ coupons: DEFAULT_COUPONS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if validating a coupon
    if (body.action === "validate") {
      const { code, orderTotal } = body;
      if (!code) {
        return NextResponse.json({ error: "Please enter a coupon code." }, { status: 400 });
      }

      const cleanCode = code.trim().toUpperCase();
      let coupon: any = null;

      try {
        const { data } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", cleanCode)
          .eq("is_active", true)
          .single();
        coupon = data;
      } catch {}

      if (!coupon) {
        coupon = DEFAULT_COUPONS.find(
          (c) => c.code.toUpperCase() === cleanCode && c.is_active
        );
      }

      if (!coupon) {
        return NextResponse.json({ error: "Invalid or expired coupon code." }, { status: 400 });
      }

      if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
        return NextResponse.json(
          { error: `Minimum order total of ৳${coupon.min_order_amount} required for coupon ${cleanCode}.` },
          { status: 400 }
        );
      }

      let discount = 0;
      if (coupon.discount_type === "percentage") {
        discount = Math.round((orderTotal * coupon.discount_value) / 100);
      } else {
        discount = coupon.discount_value;
      }

      return NextResponse.json({
        success: true,
        coupon: {
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          calculated_discount: discount,
        },
      });
    }

    // Admin: Create new coupon
    const { code, discount_type, discount_value, min_order_amount, is_active } = body;
    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json({ error: "Code, discount type, and value are required." }, { status: 400 });
    }

    const newCoupon = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discount_type,
      discount_value: Number(discount_value),
      min_order_amount: Number(min_order_amount || 0),
      is_active: is_active ?? true,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from("coupons").insert([newCoupon]);
    } catch {}

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process coupon request" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, is_active, discount_value, min_order_amount } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    try {
      await supabase
        .from("coupons")
        .update({
          ...(is_active !== undefined && { is_active }),
          ...(discount_value !== undefined && { discount_value }),
          ...(min_order_amount !== undefined && { min_order_amount }),
        })
        .eq("id", id);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    try {
      await supabase.from("coupons").delete().eq("id", id);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete coupon" }, { status: 500 });
  }
}
