import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, total, paymentMethod } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    const orderId = `A1-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderId,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: `${customer.address}, ${customer.city}, ${customer.district || ""}`,
      items: items,
      total_amount: total,
      payment_method: paymentMethod || "COD",
      payment_status: paymentMethod === "COD" ? "Pending" : "Paid",
      order_status: "Processing",
      created_at: new Date().toISOString(),
    };

    // Try saving to Supabase if configured
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([newOrder])
        .select();

      if (error) {
        console.warn("Supabase order insert notice:", error.message);
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
