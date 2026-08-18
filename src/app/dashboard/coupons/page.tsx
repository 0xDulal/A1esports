"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "fixed" as "fixed" | "percentage",
    discount_value: "",
    min_order_amount: "",
    is_active: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error("Failed to load coupons", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setFormData({
          code: "",
          discount_type: "fixed",
          discount_value: "",
          min_order_amount: "",
          is_active: true,
        });
        fetchCoupons();
      }
    } catch (err) {
      console.error("Error creating coupon", err);
    }
  };

  const handleToggleStatus = async (coupon: any) => {
    try {
      await fetch("/api/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: coupon.id,
          is_active: !coupon.is_active,
        }),
      });
      fetchCoupons();
    } catch (err) {
      console.error("Failed to toggle coupon status", err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coupons & Discounts</h1>
          <p className="text-neutral-400">Create and manage promo codes for storefront checkout</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-black rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider text-xs"
          >
            <Plus size={16} /> Create Coupon
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 flex flex-col items-center gap-3">
            <Tag size={40} className="text-neutral-600" />
            <p className="font-bold text-lg">No Coupons Found</p>
            <p className="text-sm text-neutral-500">Create a coupon code to start offering discounts to customers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 font-bold text-neutral-400">Code</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Discount</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Min. Order</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Status</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary text-base">{coupon.code}</td>
                    <td className="p-4 font-bold text-white">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}% OFF`
                        : `৳${coupon.discount_value} OFF`}
                    </td>
                    <td className="p-4 text-sm text-neutral-300 font-medium">
                      {coupon.min_order_amount > 0 ? `৳${coupon.min_order_amount}` : "No Limit"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                          coupon.is_active
                            ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                            : "bg-neutral-800 text-neutral-400 border border-white/10 hover:bg-neutral-700"
                        }`}
                      >
                        {coupon.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {coupon.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase">Create New Coupon</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCoupon} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A1SUMMER"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-primary text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Discount Type *
                </label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                >
                  <option value="fixed">Fixed Amount (৳)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 100 or 15"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Minimum Order Amount (BDT)
              </label>
              <input
                type="number"
                placeholder="0 for no minimum"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-black font-black rounded-xl hover:bg-primary/90 text-xs uppercase tracking-wider"
              >
                Save Coupon
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
