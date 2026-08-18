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

      // Check max usage / claim limit
      const maxUses = Number(coupon.max_uses || 0);
      const usesCount = Number(coupon.uses_count || 0);

      if (maxUses > 0 && usesCount >= maxUses) {
        return NextResponse.json(
          { error: `Coupon "${cleanCode}" has reached its maximum claim limit (${usesCount}/${maxUses} used).` },
          { status: 400 }
        );
      }

      if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
        return NextResponse.json(
          { error: `Minimum order total of ৳${coupon.min_order_amount} required for coupon ${cleanCode}.` },
          { status: 400 }
        );
      }

      let discount = 0;
      const isPercentage100 = coupon.discount_type === "percentage" && Number(coupon.discount_value) >= 100;

      if (isPercentage100) {
        discount = orderTotal; // 100% full discount, price becomes 0
      } else if (coupon.discount_type === "percentage") {
        discount = Math.round((orderTotal * Number(coupon.discount_value)) / 100);
      } else {
        discount = Math.min(orderTotal, Number(coupon.discount_value));
      }

      const isFullDiscount = discount >= orderTotal || isPercentage100;

      return NextResponse.json({
        success: true,
        coupon: {
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: Number(coupon.discount_value),
          calculated_discount: discount,
          is_full_discount: isFullDiscount,
          max_uses: maxUses > 0 ? maxUses : null,
          uses_count: usesCount,
        },
      });
    }

    // Admin: Create new coupon
    const { code, discount_type, discount_value, min_order_amount, max_uses, is_active } = body;
    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json({ error: "Code, discount type, and value are required." }, { status: 400 });
    }

    const newCoupon = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discount_type,
      discount_value: Number(discount_value),
      min_order_amount: Number(min_order_amount || 0),
      max_uses: max_uses ? Number(max_uses) : null,
      uses_count: 0,
      is_active: is_active ?? true,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from("coupons").insert([newCoupon]);
    } catch (e: any) {
      console.warn("Supabase insert warning:", e);
    }

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process coupon request" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, is_active, discount_value, min_order_amount, max_uses } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    try {
      await supabase
        .from("coupons")
        .update({
          ...(is_active !== undefined && { is_active }),
          ...(discount_value !== undefined && { discount_value: Number(discount_value) }),
          ...(min_order_amount !== undefined && { min_order_amount: Number(min_order_amount) }),
          ...(max_uses !== undefined && { max_uses: max_uses ? Number(max_uses) : null }),
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
