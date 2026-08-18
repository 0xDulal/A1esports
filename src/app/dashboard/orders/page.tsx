"use client";

import { useEffect, useState } from "react";
import {
  Package,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  ExternalLink,
  DollarSign,
  Tag,
  CreditCard,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "ALL") return true;
    return (o.order_status || "Processing").toUpperCase() === statusFilter;
  });

  // Handle Single Delete
  const handleDeleteOrder = async (id: string) => {
    if (!confirm(`Are you sure you want to delete order #${id}?`)) return;
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (e) {
      console.error("Failed to delete order", e);
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected orders?`)) return;

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        setSelectedIds([]);
        fetchOrders();
      }
    } catch (e) {
      console.error("Failed bulk deletion", e);
    }
  };

  // Handle Select All
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle Update Order (All Information)
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingOrder.id,
          order_status: editingOrder.order_status,
          payment_status: editingOrder.payment_status,
          customer_name: editingOrder.customer_name,
          customer_email: editingOrder.customer_email,
          customer_phone: editingOrder.customer_phone,
          shipping_address: editingOrder.shipping_address,
          payment_method: editingOrder.payment_method,
          payment_number: editingOrder.payment_number,
          transaction_id: editingOrder.transaction_id,
          payment_proof_url: editingOrder.payment_proof_url,
          total_amount: editingOrder.total_amount,
        }),
      });

      if (res.ok) {
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (e) {
      console.error("Failed to update order", e);
    }
  };

  // Export Orders to CSV / Sheet
  const handleExportCSV = () => {
    const ordersToExport = selectedIds.length > 0
      ? orders.filter((o) => selectedIds.includes(o.id))
      : filteredOrders;

    if (ordersToExport.length === 0) {
      alert("No orders available to export.");
      return;
    }

    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "Country",
      "Shipping Address",
      "Total Amount (BDT)",
      "Payment Method",
      "Payment Number",
      "Transaction ID",
      "Coupon Code",
      "Discount Amount",
      "Payment Status",
      "Order Status",
      "Date",
      "Items Breakdown",
    ];

    const rows = ordersToExport.map((o) => {
      const itemsFormatted = (o.items || [])
        .map(
          (i: any) =>
            `${i.title} (${i.quantity}x${i.price}) ${i.size ? `Size:${i.size}` : ""} ${i.customName ? `Custom:${i.customName}` : ""}`
        )
        .join(" | ");

      return [
        `"${o.id}"`,
        `"${o.customer_name || ""}"`,
        `"${o.customer_phone || ""}"`,
        `"${o.country || "Bangladesh"}"`,
        `"${(o.shipping_address || "").replace(/"/g, '""')}"`,
        `"${o.total_amount || 0}"`,
        `"${o.payment_method || ""}"`,
        `"${o.payment_number || ""}"`,
        `"${o.transaction_id || ""}"`,
        `"${o.coupon_code || ""}"`,
        `"${o.discount_amount || 0}"`,
        `"${o.payment_status || "Pending"}"`,
        `"${o.order_status || "Processing"}"`,
        `"${o.created_at ? new Date(o.created_at).toISOString().split("T")[0] : ""}"`,
        `"${itemsFormatted.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `A1_Orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
          <p className="text-neutral-400">View, edit, delete, and export customer merchandise orders</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-xs uppercase"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl hover:bg-red-500/30 transition-colors text-xs uppercase"
            >
              <Trash2 size={16} /> Delete ({selectedIds.length})
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-black rounded-xl hover:bg-primary/90 transition-colors text-xs uppercase tracking-wider"
          >
            <Download size={16} /> Export to CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              statusFilter === st
                ? "bg-primary text-black"
                : "bg-white/5 text-neutral-400 hover:text-white"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 flex flex-col items-center gap-3">
            <Package size={40} className="text-neutral-600" />
            <p className="font-bold text-lg">No orders found</p>
            <p className="text-sm text-neutral-500">Orders placed through checkout will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 w-10">
                    <button onClick={toggleSelectAll} className="text-neutral-400 hover:text-white">
                      {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? (
                        <CheckSquare size={18} className="text-primary" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Order ID</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Customer</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Total</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Payment Method</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Payment Number</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Transaction ID</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Order Status</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Date</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  return (
                    <tr key={order.id} className={`hover:bg-white/5 transition-colors ${isSelected ? "bg-primary/5" : ""}`}>
                      <td className="p-4">
                        <button onClick={() => toggleSelectOne(order.id)} className="text-neutral-400 hover:text-white">
                          {isSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                        </button>
                      </td>
                      <td className="p-4 font-mono font-bold text-primary text-xs">{order.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-white text-xs">{order.customer_name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{order.customer_phone}</p>
                      </td>
                      <td className="p-4 font-bold text-white text-xs whitespace-nowrap">
                        ৳{order.total_amount}
                        {order.coupon_code && (
                          <span className="block text-[9px] text-primary font-bold uppercase">
                            {order.coupon_code} (-৳{order.discount_amount})
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-neutral-300 rounded-full text-[10px] font-bold uppercase whitespace-nowrap">
                          {order.payment_method || "COD"}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-neutral-300 whitespace-nowrap">
                        {order.payment_number ? order.payment_number : <span className="text-neutral-600">—</span>}
                      </td>
                      <td className="p-4 text-xs font-mono font-bold text-primary whitespace-nowrap">
                        {order.transaction_id ? order.transaction_id : <span className="text-neutral-600 font-normal">—</span>}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${
                            order.order_status === "Delivered"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : order.order_status === "Cancelled"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : order.order_status === "Shipped"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-primary/20 text-primary border border-primary/30"
                          }`}
                        >
                          {order.order_status || "Processing"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-neutral-400 whitespace-nowrap">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                            title="View Order Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-2 hover:bg-white/10 text-neutral-300 rounded-lg transition-colors"
                            title="Edit Order Status"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase flex justify-between items-center pr-6">
                <span>Order #{selectedOrder.id}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="bg-neutral-800/80 p-4 rounded-xl space-y-2 text-sm">
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Customer Name:</span> {selectedOrder.customer_name}</p>
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Phone Number:</span> {selectedOrder.customer_phone}</p>
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Country:</span> {selectedOrder.country || "Bangladesh"}</p>
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Full Address:</span> {selectedOrder.shipping_address}</p>
              </div>

              {/* Payment Details Box */}
              <div className="bg-neutral-800/80 p-4 rounded-xl space-y-2 text-sm">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={16} /> Payment & Billing Information
                </h4>
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Payment Method:</span> {selectedOrder.payment_method || "COD"}</p>
                {selectedOrder.payment_number && (
                  <p><span className="text-neutral-400 font-bold uppercase text-xs">Sender Number:</span> {selectedOrder.payment_number}</p>
                )}
                {selectedOrder.transaction_id && (
                  <p><span className="text-neutral-400 font-bold uppercase text-xs">Transaction ID:</span> <span className="font-mono text-primary font-bold">{selectedOrder.transaction_id}</span></p>
                )}
                {selectedOrder.payment_proof_url && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-neutral-400 font-bold uppercase text-xs">Payment Proof Screenshot:</p>
                      <a
                        href={selectedOrder.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary font-bold hover:underline"
                      >
                        <ExternalLink size={12} /> Open Full High-Res Image
                      </a>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/50 p-2 group">
                      <a href={selectedOrder.payment_proof_url} target="_blank" rel="noopener noreferrer" className="block">
                        <img
                          src={selectedOrder.payment_proof_url}
                          alt="Payment Proof Screenshot"
                          className="w-full max-h-96 object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon Details */}
              {selectedOrder.coupon_code && (
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-primary uppercase flex items-center gap-1.5">
                    <Tag size={14} /> Coupon Applied: {selectedOrder.coupon_code}
                  </span>
                  <span className="font-black text-white">-৳{selectedOrder.discount_amount}</span>
                </div>
              )}

              {/* Ordered Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ordered Items</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg text-sm">
                      <div>
                        <p className="font-bold text-white">{item.title}</p>
                        {item.customName && <p className="text-xs text-primary font-bold">Custom Name: {item.customName}</p>}
                        <p className="text-xs text-neutral-400">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.sleeveType && `• ${item.sleeveType}`}
                        </p>
                      </div>
                      <span className="font-bold">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/10 font-bold">
                <span>Total Amount</span>
                <span className="text-xl text-primary font-black">৳{selectedOrder.total_amount}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase">Edit Order Details #{editingOrder.id}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Order Status
                  </label>
                  <select
                    value={editingOrder.order_status || "Processing"}
                    onChange={(e) => setEditingOrder({ ...editingOrder, order_status: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={editingOrder.payment_status || "Pending"}
                    onChange={(e) => setEditingOrder({ ...editingOrder, payment_status: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Awaiting Verification">Awaiting Verification</option>
                    <option value="Paid">Paid</option>
                    <option value="Paid (100% Coupon)">Paid (100% Coupon)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOrder.customer_name || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_name: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Customer Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOrder.customer_phone || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_phone: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={editingOrder.customer_email || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_email: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Total Amount (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingOrder.total_amount ?? 0}
                    onChange={(e) => setEditingOrder({ ...editingOrder, total_amount: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Payment Method
                </label>
                <input
                  type="text"
                  placeholder="COD, bKash, Nagad, Rocket, Free Coupon (100% OFF)"
                  value={editingOrder.payment_method || ""}
                  onChange={(e) => setEditingOrder({ ...editingOrder, payment_method: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Payment Number (Sender Mobile)
                  </label>
                  <input
                    type="text"
                    placeholder="01700000000"
                    value={editingOrder.payment_number || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, payment_number: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9J47A821"
                    value={editingOrder.transaction_id || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, transaction_id: e.target.value })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-primary font-bold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Delivery Address
                </label>
                <textarea
                  rows={3}
                  value={editingOrder.shipping_address || ""}
                  onChange={(e) => setEditingOrder({ ...editingOrder, shipping_address: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-black font-black rounded-xl hover:bg-primary/90 text-xs uppercase tracking-wider"
                >
                  Save All Changes
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
