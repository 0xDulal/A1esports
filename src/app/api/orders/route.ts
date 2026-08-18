import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

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
      payment_status: paymentMethod === "COD" ? "Pending" : "Awaiting Verification",
      order_status: "Processing",
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("orders")
        .insert([newOrder])
        .select();

      if (error) {
        console.warn("Supabase order insert warning:", error.message);
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

    if (error || !data) {
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    return NextResponse.json({ orders: [] });
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

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: data?.[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const singleId = searchParams.get("id");

    let idsToDelete: string[] = [];

    if (singleId) {
      idsToDelete = [singleId];
    } else {
      const body = await req.json().catch(() => ({}));
      if (Array.isArray(body.ids) && body.ids.length > 0) {
        idsToDelete = body.ids;
      }
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: "No order IDs specified for deletion" }, { status: 400 });
    }

    const { error } = await supabase
      .from("orders")
      .delete()
      .in("id", idsToDelete);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: idsToDelete.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete orders" }, { status: 500 });
  }
}
