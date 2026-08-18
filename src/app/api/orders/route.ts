import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

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

    const isFreeOrder = total === 0 || (paymentMethod && paymentMethod.includes("100%"));
    const orderId = `A1-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderId,
      customer_name: customer.name,
      customer_email: customer.email || "",
      customer_phone: customer.phone,
      country: customer.country || "Bangladesh",
      shipping_address: `${customer.address}, ${customer.city}${customer.district ? `, ${customer.district}` : ""}`,
      items: items,
      total_amount: total,
      payment_method: paymentMethod || "COD",
      payment_number: paymentNumber || "",
      transaction_id: transactionId || "",
      payment_proof_url: paymentProofUrl || "",
      coupon_code: couponCode || "",
      discount_amount: discountAmount || 0,
      payment_status: isFreeOrder ? "Paid (100% Coupon)" : paymentMethod === "COD" ? "Pending" : "Awaiting Verification",
      order_status: "Processing",
      created_at: new Date().toISOString(),
    };

    // Store in local cache
    localOrdersCache.unshift(newOrder);

    try {
      const { error } = await supabase
        .from("orders")
        .insert([newOrder])
        .select();

      if (error) {
        console.warn("Supabase order insert warning:", error.message);
      }

      // Increment Coupon Uses Counter if couponCode was used
      if (couponCode) {
        const cleanCode = couponCode.trim().toUpperCase();
        const { data: cpnData } = await supabase
          .from("coupons")
          .select("id, uses_count, max_uses")
          .eq("code", cleanCode)
          .single();

        if (cpnData) {
          const currentCount = Number(cpnData.uses_count || 0);
          const newCount = currentCount + 1;
          const maxUses = Number(cpnData.max_uses || 0);

          const updates: any = { uses_count: newCount };
          if (maxUses > 0 && newCount >= maxUses) {
            updates.is_active = false;
          }

          await supabase.from("coupons").update(updates).eq("id", cpnData.id);
        }
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

export async function GET() {
  try {
    const { data, error } = await supabase
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
  try {
    const body = await req.json();
    const { id, order_status, payment_status, customer_name, customer_phone, shipping_address } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updates: any = {};
    if (order_status !== undefined) updates.order_status = order_status;
    if (payment_status !== undefined) updates.payment_status = payment_status;
    if (customer_name !== undefined) updates.customer_name = customer_name;
    if (customer_phone !== undefined) updates.customer_phone = customer_phone;
    if (shipping_address !== undefined) updates.shipping_address = shipping_address;

    // Update in local cache
    localOrdersCache = localOrdersCache.map((o) => (o.id === id ? { ...o, ...updates } : o));

    try {
      await supabase.from("orders").update(updates).eq("id", id);
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
        await supabase.from("orders").delete().in("id", idsToDelete);
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
