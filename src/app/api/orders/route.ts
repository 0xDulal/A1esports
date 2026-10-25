import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { requireAdmin, publicClient } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";

// Global in-memory cache for orders
let localOrdersCache: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer,
      items,
      total,
      paymentMethod,
      paymentNumber,
      transactionId,
      paymentProofUrl,
      couponCode,
      discountAmount,
    } = body;

    if (!customer || !customer.name || !customer.phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order details. Name, phone number, and items are required." },
        { status: 400 }
      );
    }

    // Server-side price recompute: trust DB prices, not the client's total.
    const dbClient = publicClient();
    const productIds = [...new Set(items.map((i: any) => String(i.id)))];
    const { data: dbProducts } = await dbClient
      .from("products")
      .select("id, price, half_sleeve_price, full_sleeve_price")
      .in("id", productIds);

    const priceMap = new Map<string, any>();
    (dbProducts || []).forEach((p: any) => priceMap.set(String(p.id), p));

    let verifiedTotal = 0;
    const verifiedItems: any[] = [];
    for (const item of items) {
      const p = priceMap.get(String(item.id));
      if (!p) {
        return NextResponse.json({ error: `Unknown product: ${item.id}` }, { status: 400 });
      }
      const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
      let unitPrice = Number(p.price) || 0;
      if (p.half_sleeve_price && item.size === "Half Sleeve") {
        unitPrice = Number(p.half_sleeve_price);
      } else if (p.full_sleeve_price && item.size === "Full Sleeve") {
        unitPrice = Number(p.full_sleeve_price);
      }
      verifiedTotal += unitPrice * qty;
      verifiedItems.push({ ...item, quantity: qty, price: unitPrice });
    }

    // Server-side coupon revalidation
    let verifiedDiscount = 0;
    let couponCodeClean = "";
    if (couponCode) {
      couponCodeClean = String(couponCode).trim().toUpperCase();
      const { data: cpn } = await dbClient
        .from("coupons")
        .select("*")
        .eq("code", couponCodeClean)
        .eq("is_active", true)
        .maybeSingle();

      if (cpn) {
        const maxUses = Number(cpn.max_uses || 0);
        const usesCount = Number(cpn.uses_count || 0);
        if (!(maxUses > 0 && usesCount >= maxUses) && verifiedTotal >= Number(cpn.min_order_amount || 0)) {
          const isPercentage100 = cpn.discount_type === "percentage" && Number(cpn.discount_value) >= 100;
          if (isPercentage100) {
            verifiedDiscount = verifiedTotal;
          } else if (cpn.discount_type === "percentage") {
            verifiedDiscount = Math.round((verifiedTotal * Number(cpn.discount_value)) / 100);
          } else {
            verifiedDiscount = Math.min(verifiedTotal, Number(cpn.discount_value));
          }
          if (verifiedDiscount > verifiedTotal) verifiedDiscount = verifiedTotal;
        }
      }
    }

    const payable = Math.max(0, verifiedTotal - verifiedDiscount);
    const isFreeOrder = payable <= 0;
    const orderId = `A1-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderId,
      customer_name: customer.name,
      customer_email: customer.email || "",
      customer_phone: customer.phone,
      country: customer.country || "Bangladesh",
      shipping_address: `${customer.address}, ${customer.city}${customer.district ? `, ${customer.district}` : ""}`,
      items: verifiedItems,
      total_amount: payable,
      payment_method: paymentMethod || "COD",
      payment_number: paymentNumber || "",
      transaction_id: transactionId || "",
      payment_proof_url: paymentProofUrl || "",
      coupon_code: couponCodeClean,
      discount_amount: verifiedDiscount,
      payment_status: isFreeOrder ? "Paid (100% Coupon)" : paymentMethod === "COD" ? "Pending" : "Awaiting Verification",
      order_status: "Processing",
      created_at: new Date().toISOString(),
    };

    // Store in local cache
    localOrdersCache.unshift(newOrder);

    try {
      const { error } = await dbClient
        .from("orders")
        .insert([newOrder]);

      if (error) {
        console.warn("Supabase order insert warning:", error.message);
      }

      // Atomically count coupon redemption (bypasses admin-only RLS via RPC)
      if (couponCodeClean) {
        await dbClient.rpc("redeem_coupon", { p_code: couponCodeClean });
      }
    } catch (e) {
      console.warn("Supabase connection warning:", e);
    }

    return NextResponse.json({
      success: true,
      orderId,
      order: newOrder,
      message: "Order placed successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ orders: localOrdersCache });
    }

    // Merge Supabase orders with local cache avoiding duplicates
    const dbOrderIds = new Set(data.map((o: any) => o.id));
    const merged = [...data, ...localOrdersCache.filter((o) => !dbOrderIds.has(o.id))];

    return NextResponse.json({ orders: merged });
  } catch (err) {
    return NextResponse.json({ orders: localOrdersCache });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const {
      id,
      order_status,
      payment_status,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method,
      payment_number,
      transaction_id,
      payment_proof_url,
      total_amount,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updates: any = {};
    if (order_status !== undefined) updates.order_status = order_status;
    if (payment_status !== undefined) updates.payment_status = payment_status;
    if (customer_name !== undefined) updates.customer_name = customer_name;
    if (customer_email !== undefined) updates.customer_email = customer_email;
    if (customer_phone !== undefined) updates.customer_phone = customer_phone;
    if (shipping_address !== undefined) updates.shipping_address = shipping_address;
    if (payment_method !== undefined) updates.payment_method = payment_method;
    if (payment_number !== undefined) updates.payment_number = payment_number;
    if (transaction_id !== undefined) updates.transaction_id = transaction_id;
    if (payment_proof_url !== undefined) updates.payment_proof_url = payment_proof_url;
    if (total_amount !== undefined) updates.total_amount = Number(total_amount);

    // Update in local cache
    localOrdersCache = localOrdersCache.map((o) => (o.id === id ? { ...o, ...updates } : o));

    try {
      await auth.supabase.from("orders").update(updates).eq("id", id);
    } catch (e) {
      console.warn("Supabase update warning:", e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (req.method === "DELETE") {
      let idsToDelete: string[] = [];
      if (id) {
        idsToDelete = [id];
      } else {
        const body = await req.json().catch(() => ({}));
        idsToDelete = body.ids || [];
      }

      if (idsToDelete.length === 0) {
        return NextResponse.json({ error: "Order ID(s) required" }, { status: 400 });
      }

      // Delete from local cache
      localOrdersCache = localOrdersCache.filter((o) => !idsToDelete.includes(o.id));

      try {
        await auth.supabase.from("orders").delete().in("id", idsToDelete);
      } catch (e) {
        console.warn("Supabase delete warning:", e);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
