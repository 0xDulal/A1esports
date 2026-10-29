"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ORDER_STATUSES = [
  "Payment Pending",
  "Payment Verified",
  "Processing",
  "Delivered",
  "Cancelled",
] as const;

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/orders");
      const data = await res.json();
      const found = (data.orders || []).find(
        (o: any) => String(o.id).toLowerCase() === String(orderId).toLowerCase()
      );
      setOrder(found || null);
    } catch (err) {
      console.error("Failed to load order", err);
      toast.error("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await adminFetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          order_status: newStatus,
        }),
      });

      if (res.ok) {
        setOrder((prev: any) => ({ ...prev, order_status: newStatus }));
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error while updating status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 text-neutral-400">
        <RefreshCw size={32} className="animate-spin text-primary" />
        <p className="text-xs uppercase tracking-widest font-mono">Loading order telemetry #{orderId}...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-6 bg-[#0a0a0a] border border-white/10 rounded-sm p-12 max-w-xl mx-auto">
        <Package size={48} className="mx-auto text-neutral-600" />
        <h2 className="text-2xl font-michroma uppercase text-white">Order Not Found</h2>
        <p className="text-neutral-400 text-sm">
          No order records matched ID <span className="font-mono text-primary font-bold">#{orderId}</span>.
        </p>
        <Button asChild variant="primary" size="sm">
          <Link href="/dashboard/orders">
            <ArrowLeft size={14} className="mr-2" /> Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    "Payment Verified": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    Processing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    Delivered: "bg-green-500/10 text-green-400 border-green-500/30",
    Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
    "Payment Pending": "bg-primary/10 text-primary border-primary/30",
  };

  const itemSubtotal = (order.items || []).reduce(
    (sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const deliveryCharge = Number(order.delivery_charge) ||
    (String(order.shipping_address || "").toLowerCase().includes("dhaka") ? 60 : 120);
  const calculatedTotal = Math.max(0, itemSubtotal - (Number(order.discount_amount) || 0) + deliveryCharge);

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <Button asChild variant="outline" size="xs">
            <Link href="/dashboard/orders" className="gap-2 text-neutral-400 hover:text-white">
              <ArrowLeft size={12} />
              <span>RETURN TO ORDERS</span>
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <h1 className="text-2xl sm:text-3xl font-michroma uppercase tracking-tight text-white break-all">
              Order #{order.id}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                statusColors[order.order_status] || statusColors["Payment Pending"]
              }`}
            >
              {order.order_status || "Payment Pending"}
            </span>
          </div>
        </div>

        {/* Quick Status Control Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-neutral-900/80 p-3 rounded-sm border border-white/10">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Order Status:</span>
          <select
            value={order.order_status || "Payment Pending"}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-black border border-white/20 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Right Side: Customer, Items & Payment Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customer Details */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="text-lg font-michroma uppercase flex items-center gap-2 text-white border-b border-white/10 pb-3">
                <User size={18} className="text-primary" /> Customer Details
              </h3>

              <div className="space-y-4 text-base">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase font-bold text-neutral-500">Full Name</p>
                    <p className="font-bold text-white">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase font-bold text-neutral-500">Phone</p>
                    <a href={`tel:${order.customer_phone}`} className="font-mono text-primary font-bold hover:underline">{order.customer_phone}</a>
                  </div>
                </div>
                {order.customer_email && (
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs uppercase font-bold text-neutral-500">Email</p>
                      <a href={`mailto:${order.customer_email}`} className="text-neutral-300 hover:underline">{order.customer_email}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                  <MapPin size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase font-bold text-neutral-500">Shipping Destination</p>
                    <p className="text-neutral-200 text-sm leading-relaxed">{order.shipping_address}</p>
                    <p className="text-xs text-neutral-500 font-bold uppercase mt-1">{order.country || "Bangladesh"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 space-y-4">
              <h2 className="text-lg font-michroma uppercase flex items-center gap-2 text-white border-b border-white/10 pb-3">
                <Package size={18} className="text-primary" /> Items Ordered ({(order.items || []).length})
              </h2>
              <div className="divide-y divide-white/5 space-y-2">
                {(order.items || []).map((item: any, i: number) => (
                  <div key={i} className="pt-4 first:pt-0 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-base">{item.title}</p>
                      {item.customName && <p className="text-sm font-mono font-bold text-primary">IGN Print: [{item.customName}]</p>}
                      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400 font-mono">
                        <span>QTY: {item.quantity}</span>
                        {item.size && <span>• SIZE: {item.size}</span>}
                        {item.sleeveType && <span>• {item.sleeveType.toUpperCase()} SLEEVE</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-white text-base">৳{(Number(item.price) || 0) * (Number(item.quantity) || 1)}</p>
                      <p className="text-neutral-500 font-mono">৳{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Payment Details & Payment Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Price Breakdown */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 space-y-3 font-mono">
              <h3 className="text-lg font-michroma uppercase flex items-center gap-2 text-white border-b border-white/10 pb-3">
                <CreditCard size={18} className="text-primary" /> Payment Details
              </h3>
              {(order.items || []).map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-2 text-sm border-b border-white/5">
                  <span className="text-neutral-400">{item.title} × {item.quantity}</span>
                  <span className="text-white font-bold">৳{(Number(item.price) || 0) * (Number(item.quantity) || 1)}</span>
                </div>
              ))}
              {order.coupon_code && (
                <div className="flex justify-between py-2 text-sm text-primary">
                  <span>Discount ({order.coupon_code})</span>
                  <span className="font-bold">-৳{order.discount_amount || 0}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm border-t border-white/10">
                <span className="text-neutral-400">Delivery Charge</span>
                <span className="text-white font-bold">৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="uppercase font-michroma text-sm text-white">Total</span>
                <span className="text-primary text-2xl font-black">৳{calculatedTotal}</span>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="text-lg font-michroma uppercase flex items-center gap-2 text-white border-b border-white/10 pb-3">
                <CreditCard size={18} className="text-primary" /> Payment Information
              </h3>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between py-1"><span className="text-neutral-500 uppercase">Payment Channel</span><span className="font-bold text-white uppercase">{order.payment_method || "COD"}</span></div>
                {order.payment_number && <div className="flex justify-between py-1 border-t border-white/5"><span className="text-neutral-500 uppercase">Sender Mobile</span><span className="font-bold text-white">{order.payment_number}</span></div>}
                {order.transaction_id && <div className="flex justify-between py-1 border-t border-white/5"><span className="text-neutral-500 uppercase">TrxID</span><span className="font-bold text-white">{order.transaction_id}</span></div>}
              </div>
              {order.payment_proof_url && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs"><span className="text-neutral-400 font-bold uppercase">Payment Receipt</span><a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-bold"><ExternalLink size={12} /> High-Res</a></div>
                  <div className="rounded-sm border border-white/10 bg-black p-2 overflow-hidden"><a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer"><img src={order.payment_proof_url} alt="Payment Receipt" className="w-full max-h-72 object-contain rounded-sm hover:scale-[1.02] transition-transform" /></a></div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
