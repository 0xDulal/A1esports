"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { A1Button } from "@/components/ui/A1Button";
import { ArrowLeft, CheckCircle2, ShoppingBag, Truck, ShieldCheck, CreditCard, Banknote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Dhaka",
    district: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BKASH" | "NAGAD">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = formData.city.toLowerCase().includes("dhaka") ? 60 : 120;
  const grandTotal = total + (items.length > 0 ? shippingCost : 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items,
          total: grandTotal,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderResult({ orderId: data.orderId });
        clearCart();
      } else {
        setError(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <main className="min-h-screen bg-black text-white pt-28 pb-24 flex items-center justify-center">
        <Section containerClassName="max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900/80 border border-white/10 rounded-3xl p-10 md:p-14 space-y-6 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
              <CheckCircle2 size={48} />
            </div>

            <div className="space-y-2">
              <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] italic">Order Confirmed</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Thank You!</h1>
              <p className="text-neutral-400 text-sm max-w-md mx-auto">
                Your order has been received and is being processed by our team.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3 my-6">
              <div className="flex justify-between items-center text-xs text-neutral-400 uppercase font-bold tracking-wider">
                <span>Order Reference:</span>
                <span className="text-primary text-base font-black tracking-tight">{orderResult.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-400 uppercase font-bold tracking-wider">
                <span>Payment Method:</span>
                <span className="text-white">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-400 uppercase font-bold tracking-wider pt-2 border-t border-white/10">
                <span>Estimated Delivery:</span>
                <span className="text-white">2 - 4 Business Days</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/shop">
                <A1Button variant="primary" size="lg">
                  Continue Shopping
                </A1Button>
              </Link>
              <Link href="/">
                <A1Button variant="outline" size="lg">
                  Back to Home
                </A1Button>
              </Link>
            </div>
          </motion.div>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-24">
      <Section>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Shop</span>
        </Link>

        <div className="mb-10">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] italic">Official Store</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Checkout</h1>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-6 bg-neutral-900/40 border border-white/5 rounded-3xl">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-600">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Your Cart is Empty</h2>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Link href="/shop">
              <A1Button variant="primary">Explore Store</A1Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-8">
              <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-8">
                <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-3">
                    <Truck size={20} className="text-primary" /> Delivery Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01700000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        City / Region *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dhaka, Chittagong, Sylhet..."
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        District / Thana
                      </label>
                      <input
                        type="text"
                        placeholder="Gulshan, Uttara, Mirpur..."
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Full Street Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="House No, Road No, Area details..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Special Delivery Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Call before delivery, drop at reception..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-3">
                    <CreditCard size={20} className="text-primary" /> Payment Method
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "COD", label: "Cash on Delivery", icon: Banknote },
                      { id: "BKASH", label: "bKash", icon: CreditCard },
                      { id: "NAGAD", label: "Nagad", icon: CreditCard },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          paymentMethod === method.id
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        <method.icon size={20} className={paymentMethod === method.id ? "text-primary" : "text-neutral-500"} />
                        <span className="text-xs font-black uppercase tracking-wider mt-4">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 text-sm font-bold">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 sticky top-28 space-y-6">
                <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-3">
                  <ShoppingBag size={20} className="text-primary" /> Summary ({items.length} items)
                </h2>

                <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white uppercase truncate">{item.title}</p>
                        {item.customName && (
                          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Name: {item.customName}</p>
                        )}
                        <p className="text-[10px] text-neutral-500 font-bold uppercase">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.sleeveType && `• ${item.sleeveType}`}
                        </p>
                      </div>
                      <span className="text-xs font-black text-white shrink-0">
                        {((item.sleeveType === "full" && item.fullSleevePrice)
                          ? item.fullSleevePrice
                          : (item.sleeveType === "half" && item.halfSleevePrice)
                          ? item.halfSleevePrice
                          : item.price) * item.quantity}{" "}
                        BDT
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-xs text-neutral-400 uppercase font-bold tracking-wider">
                    <span>Subtotal</span>
                    <span className="text-white">{total} BDT</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400 uppercase font-bold tracking-wider">
                    <span>Delivery Charge</span>
                    <span className="text-white">{shippingCost} BDT</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-white/10">
                    <span className="text-sm font-black uppercase text-white tracking-wider">Total Payable</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">{grandTotal} BDT</span>
                  </div>
                </div>

                <A1Button
                  form="checkout-form"
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-sm uppercase tracking-widest font-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing Order..." : `Confirm Order • ${grandTotal} BDT`}
                </A1Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest pt-2">
                  <ShieldCheck size={14} className="text-primary" /> Guaranteed Safe & Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </Section>
      <GlowBar />
    </main>
  );
}
