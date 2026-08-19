"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Truck, CreditCard, Plus, Trash2, Edit2, RefreshCw } from "lucide-react";
import { PaymentMethod, DeliveryCharges, DEFAULT_DELIVERY_CHARGES, DEFAULT_PAYMENT_METHODS } from "@/lib/supabase/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

export default function AdminSettings() {
  const [delivery, setDelivery] = useState<DeliveryCharges>(DEFAULT_DELIVERY_CHARGES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);
  const [loading, setLoading] = useState(true);
  const [savingDelivery, setSavingDelivery] = useState(false);
  const [deliverySaved, setDeliverySaved] = useState(false);

  // Add PM modal
  const [isAddPmOpen, setIsAddPmOpen] = useState(false);
  const [newPm, setNewPm] = useState({
    name: "",
    type: "digital" as "digital" | "cod",
    account_number: "",
    instructions: "",
    is_active: true,
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.deliveryCharges) setDelivery(data.deliveryCharges);
      if (data.paymentMethods) setPaymentMethods(data.paymentMethods);
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Save Delivery Charges
  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDelivery(true);
    setDeliverySaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_delivery",
          inside_dhaka: delivery.inside_dhaka,
          outside_dhaka: delivery.outside_dhaka,
        }),
      });

      if (res.ok) {
        setDeliverySaved(true);
        toast.success("Delivery charges saved!");
        setTimeout(() => setDeliverySaved(false), 3000);
      }
    } catch (err) {
      toast.error("Failed to save delivery charges");
    } finally {
      setSavingDelivery(false);
    }
  };

  // Toggle Payment Method Active
  const handleTogglePmStatus = async (pm: PaymentMethod) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pm.id,
          is_active: !pm.is_active,
        }),
      });
      toast.success(`Payment method "${pm.name}" status updated.`);
      fetchSettings();
    } catch (err) {
      toast.error("Failed to update payment method status");
    }
  };

  // Update Payment Method details
  const handleUpdatePm = async (id: string, account_number: string, instructions: string) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, account_number, instructions }),
      });
      toast.success("Payment method details updated.");
      fetchSettings();
    } catch (err) {
      toast.error("Failed to update payment method details");
    }
  };

  // Add Payment Method
  const handleAddPm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_payment_method",
          ...newPm,
        }),
      });

      if (res.ok) {
        toast.success(`Payment method "${newPm.name}" added!`);
        setIsAddPmOpen(false);
        setNewPm({
          name: "",
          type: "digital",
          account_number: "",
          instructions: "",
          is_active: true,
        });
        fetchSettings();
      }
    } catch (err) {
      toast.error("Failed to add payment method");
    }
  };

  const [deletePmId, setDeletePmId] = useState<string | null>(null);

  // Delete Payment Method
  const handleConfirmDeletePm = async () => {
    if (!deletePmId) return;
    const targetId = deletePmId;
    setPaymentMethods((prev) => prev.filter((p) => String(p.id) !== String(targetId)));
    try {
      await fetch(`/api/settings?id=${targetId}`, { method: "DELETE" });
      toast.success("Payment method deleted.");
    } catch (err) {
      toast.error("Failed to delete payment method");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Store Settings</h1>
          <p className="text-neutral-400">Configure delivery charges, payment options, and store preferences</p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Delivery Charges Settings Box */}
      <form onSubmit={handleSaveDelivery} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Truck size={20} className="text-primary" /> Delivery Charges Configuration
          </h2>
          {deliverySaved && (
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} /> Charges Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Inside Dhaka Delivery Charge (BDT) *
            </label>
            <input
              type="number"
              required
              value={delivery.inside_dhaka}
              onChange={(e) => setDelivery({ ...delivery, inside_dhaka: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Outside Dhaka Delivery Charge (BDT) *
            </label>
            <input
              type="number"
              required
              value={delivery.outside_dhaka}
              onChange={(e) => setDelivery({ ...delivery, outside_dhaka: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingDelivery}
            className="px-6 py-2.5 bg-primary text-black font-black rounded-xl hover:bg-primary/90 transition-colors uppercase text-xs tracking-wider disabled:opacity-50"
          >
            {savingDelivery ? "Saving Charges..." : "Save Delivery Fees"}
          </button>
        </div>
      </form>

      {/* Payment Methods Management Section */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard size={20} className="text-primary" /> Payment Methods Manager
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Enable/disable payment methods or update account numbers & instructions</p>
          </div>
          <button
            onClick={() => setIsAddPmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-black rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider text-xs"
          >
            <Plus size={16} /> Add Payment Method
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className={`p-5 rounded-2xl border transition-all ${
                pm.is_active
                  ? "bg-neutral-800/80 border-white/10"
                  : "bg-neutral-950/60 border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-white">{pm.name}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                    {pm.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePmStatus(pm)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                      pm.is_active
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-neutral-800 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {pm.is_active ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => setDeletePmId(pm.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {pm.type === "digital" && (
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Payment Account / Phone Number
                    </label>
                    <input
                      type="text"
                      defaultValue={pm.account_number}
                      onBlur={(e) => handleUpdatePm(pm.id, e.target.value, pm.instructions)}
                      placeholder="01700000000"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Instructions for Customer
                    </label>
                    <input
                      type="text"
                      defaultValue={pm.instructions}
                      onBlur={(e) => handleUpdatePm(pm.id, pm.account_number, e.target.value)}
                      placeholder="e.g. Send Money (Personal)"
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <Dialog open={isAddPmOpen} onOpenChange={setIsAddPmOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase">Add Payment Method</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddPm} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Payment Method Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Upay, CellFin, Rocket"
                value={newPm.name}
                onChange={(e) => setNewPm({ ...newPm, name: e.target.value })}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Method Type *
              </label>
              <select
                value={newPm.type}
                onChange={(e) => setNewPm({ ...newPm, type: e.target.value as any })}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
              >
                <option value="digital">Mobile Transfer / Digital</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {newPm.type === "digital" && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Account / Mobile Number *
                  </label>
                  <input
                    type="text"
                    placeholder="01700000000"
                    value={newPm.account_number}
                    onChange={(e) => setNewPm({ ...newPm, account_number: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Payment Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="Send Money (Personal) to..."
                    value={newPm.instructions}
                    onChange={(e) => setNewPm({ ...newPm, instructions: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-white"
                  />
                </div>
              </>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddPmOpen(false)}
                className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-black font-black rounded-xl hover:bg-primary/90 text-xs uppercase tracking-wider"
              >
                Save Payment Method
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deletePmId}
        onClose={() => setDeletePmId(null)}
        onConfirm={handleConfirmDeletePm}
        title="Delete Payment Method"
        description="Are you sure you want to delete this payment method from checkout options?"
      />
    </div>
  );
}
