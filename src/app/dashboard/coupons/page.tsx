"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, RefreshCw, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "fixed" as "fixed" | "percentage",
    discount_value: "",
    min_order_amount: "",
    max_uses: "",
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
        toast.success(`Coupon "${formData.code.toUpperCase()}" created!`);
        setIsAddOpen(false);
        setFormData({
          code: "",
          discount_type: "fixed",
          discount_value: "",
          min_order_amount: "",
          max_uses: "",
          is_active: true,
        });
        fetchCoupons();
      } else {
        toast.error("Failed to create coupon.");
      }
    } catch (err) {
      toast.error("Error creating coupon.");
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
      toast.success(`Coupon "${coupon.code}" status updated.`);
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to update coupon status.");
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDeleteCoupon = async () => {
    if (!deleteId) return;
    const targetId = deleteId;
    setCoupons((prev) => prev.filter((c) => String(c.id) !== String(targetId)));
    try {
      await fetch(`/api/coupons?id=${targetId}`, { method: "DELETE" });
      toast.success("Coupon deleted successfully.");
    } catch {
      toast.error("Failed to delete coupon.");
    }
  };

  // Helper preset to set 100% Free Coupon
  const apply100PercentPreset = () => {
    setFormData((prev) => ({
      ...prev,
      discount_type: "percentage",
      discount_value: "100",
      min_order_amount: "0",
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coupons & Discounts</h1>
          <p className="text-neutral-400">Create promo codes, set claim limits (e.g. WinnerPMC), and 100% free discounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors text-xs uppercase"
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
            <table className="w-full min-w-[700px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 font-bold text-neutral-400">Code</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Discount</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Claim Usage Limit</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Min. Order</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Status</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon) => {
                  const maxUses = Number(coupon.max_uses || 0);
                  const usesCount = Number(coupon.uses_count || 0);
                  const isLimitReached = maxUses > 0 && usesCount >= maxUses;
                  const is100Percent = coupon.discount_type === "percentage" && Number(coupon.discount_value) >= 100;

                  return (
                    <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary text-base flex items-center gap-2">
                        {coupon.code}
                        {is100Percent && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] uppercase font-sans">
                            FREE (৳0)
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {is100Percent
                          ? "100% OFF (FULL PRICE FREE)"
                          : coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% OFF`
                          : `৳${coupon.discount_value} OFF`}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {maxUses > 0 ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                              isLimitReached
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-white/5 text-neutral-300 border border-white/10"
                            }`}
                          >
                            {usesCount} / {maxUses} claims {isLimitReached && "(Limit Reached)"}
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-xs uppercase tracking-wider font-bold">
                            Unlimited ({usesCount} used)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-neutral-300 font-medium">
                        {coupon.min_order_amount > 0 ? `৳${coupon.min_order_amount}` : "No Limit"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                            coupon.is_active && !isLimitReached
                              ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                              : "bg-neutral-800 text-neutral-400 border border-white/10 hover:bg-neutral-700"
                          }`}
                        >
                          {coupon.is_active && !isLimitReached ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {isLimitReached ? "Limit Reached" : coupon.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setDeleteId(coupon.id)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
            {/* Quick Preset */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-2">
              <div className="text-xs text-purple-200">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles size={14} className="text-primary" /> 100% Free Product Coupon
                </span>
                <span className="text-[10px] text-purple-300 block">Makes price ৳0 for full product purchase</span>
              </div>
              <button
                type="button"
                onClick={apply100PercentPreset}
                className="px-3 py-1 bg-primary text-black font-black rounded-lg text-[10px] uppercase tracking-wider shrink-0 hover:bg-primary/90"
              >
                Apply Preset
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. WinnerPMC"
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
                  placeholder="100 for 100% Free"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Claim Limit (Max Uses)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 3 (0 for unlimited)"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                />
                <span className="text-[10px] text-neutral-500 block mt-1">Total times code can be claimed</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Min. Order Total (BDT)
                </label>
                <input
                  type="number"
                  placeholder="0 for no minimum"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                />
              </div>
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
      {/* Delete Confirm Popup */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDeleteCoupon}
        title="Delete Promo Coupon"
        description="Are you sure you want to delete this coupon code? Customers will no longer be able to use it during checkout."
      />
    </div>
  );
}
