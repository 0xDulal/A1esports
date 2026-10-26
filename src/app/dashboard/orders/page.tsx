"use client";

import { adminFetch } from "@/lib/admin-fetch";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  CheckSquare,
  Square,
  Search,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  X,
  CreditCard,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ORDER_STATUSES = [
  "Payment Pending",
  "Payment Verified",
  "Processing",
  "Delivered",
  "Cancelled",
] as const;

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmSingleDeleteId, setConfirmSingleDeleteId] = useState<string | null>(null);
  const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error("Failed to load orders", e);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered and Searched Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status Filter
      if (statusFilter !== "ALL") {
        if ((order.order_status || "Payment Pending").toUpperCase() !== statusFilter) {
          return false;
        }
      }

      // Search Filter (Customer Name, Payment Number, Transaction ID, Order ID)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesId = String(order.id || "").toLowerCase().includes(query);
        const matchesName = String(order.customer_name || "").toLowerCase().includes(query);
        const matchesPhone = String(order.customer_phone || "").toLowerCase().includes(query);
        const matchesPaymentNumber = String(order.payment_number || "").toLowerCase().includes(query);
        const matchesTrxId = String(order.transaction_id || "").toLowerCase().includes(query);

        if (!matchesId && !matchesName && !matchesPhone && !matchesPaymentNumber && !matchesTrxId) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Handle In-line Order Status Change
  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await adminFetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          order_status: newStatus,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
        toast.success(`Order #${orderId} marked as ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error while updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!confirmSingleDeleteId) return;
    try {
      const res = await adminFetch(`/api/orders?id=${confirmSingleDeleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Order deleted successfully.");
        fetchOrders();
      }
    } catch {
      toast.error("Failed to delete order.");
    } finally {
      setConfirmSingleDeleteId(null);
    }
  };

  // Handle Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      const res = await adminFetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        toast.success(`Deleted ${selectedIds.length} selected orders.`);
        setSelectedIds([]);
        fetchOrders();
      }
    } catch {
      toast.error("Failed bulk delete.");
    } finally {
      setConfirmBulkDeleteOpen(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Export Orders to CSV
  const handleExportCSV = () => {
    const ordersToExport = selectedIds.length > 0
      ? orders.filter((o) => selectedIds.includes(o.id))
      : filteredOrders;

    if (ordersToExport.length === 0) {
      toast.error("No orders available to export.");
      return;
    }

    const headers = [
      "Date",
      "Order ID",
      "Customer Name",
      "Phone",
      "Country",
      "Shipping Address",
      "Payment Method",
      "Payment Number",
      "Transaction ID",
      "Total Amount (BDT)",
      "Item Name",
      "Custom Name",
      "Size",
      "Coupon Code",
      "Discount Amount",
      "Order Status",
    ];

    const escapeCSV = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = ordersToExport.flatMap((o) => {
      const items = Array.isArray(o.items) && o.items.length > 0 ? o.items : [{}];
      return items.flatMap((item: any) => {
        const quantity = Math.max(1, Number(item.quantity) || 1);
        return Array.from({ length: quantity }, () => [
          escapeCSV(o.created_at ? new Date(o.created_at).toISOString().split("T")[0] : ""),
          escapeCSV(o.id),
          escapeCSV(o.customer_name),
          escapeCSV(o.customer_phone),
          escapeCSV(o.country || "Bangladesh"),
          escapeCSV(o.shipping_address),
          escapeCSV(o.payment_method),
          escapeCSV(o.payment_number),
          escapeCSV(o.transaction_id),
          escapeCSV(getOrderTotal(o)),
          escapeCSV(item.title),
          escapeCSV(item.customName),
          escapeCSV(item.size),
          escapeCSV(o.coupon_code),
          escapeCSV(o.discount_amount || 0),
          escapeCSV(o.order_status || "Payment Pending"),
        ]);
      });
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.map(escapeCSV).join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const exportTimestamp = new Date()
      .toISOString()
      .replace("T", "_")
      .replace(/[:.]/g, "-")
      .replace(/Z$/, "");
    link.setAttribute("download", `A1_Orders_${exportTimestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadgeStyle = (status: string) => {
    switch (status) {
      case "Payment Verified":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "Delivered":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Payment Pending":
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  const getDeliveryCharge = (order: any) =>
    Number(order.delivery_charge) ||
    (String(order.shipping_address || "").toLowerCase().includes("dhaka") ? 60 : 120);

  const getOrderTotal = (order: any) => {
    const storedTotal = Number(order.total_amount) || 0;
    const deliveryCharge = getDeliveryCharge(order);
    const subtotal = (order.items || []).reduce(
      (sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const calculatedTotal = Math.max(0, subtotal - (Number(order.discount_amount) || 0) + deliveryCharge);
    return storedTotal < calculatedTotal ? calculatedTotal : storedTotal;
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-michroma uppercase mb-2 text-white">Orders Management</h1>
          <p className="text-neutral-400 text-sm">
            Search, filter, update live order statuses, and inspect full customer details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={fetchOrders} variant="outline" size="sm" className="gap-2">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          {selectedIds.length > 0 && (
            <Button
              onClick={() => setConfirmBulkDeleteOpen(true)}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </Button>
          )}

          <Button onClick={handleExportCSV} variant="primary" size="sm" className="gap-2">
            <Download size={14} /> Export to CSV
          </Button>
        </div>
      </div>

      {/* Search Bar & Status Filter Hub */}
      <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 justify-between">
          {/* Universal Search Input (Left) */}
          <div className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by Customer Name, Phone, TrxID, Payment Number, or Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/90 border border-white/10 rounded-sm pl-10 pr-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Badges (Right) */}
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal size={12} className="text-primary" /> Filter:
            </span>
            {["ALL", "PAYMENT PENDING", "PAYMENT VERIFIED", "PROCESSING", "DELIVERED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${
                  statusFilter === st
                    ? "bg-primary text-black font-black shadow-[0_0_12px_rgba(255,0,102,0.35)]"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {st}
              </button>
            ))}

            <span className="text-[11px] font-mono text-neutral-500 ml-2 hidden xl:inline">
              ({filteredOrders.length}/{orders.length})
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Orders Data Grid */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-neutral-400 font-mono text-xs uppercase tracking-widest flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-primary" />
            Loading orders telemetry...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-neutral-400 flex flex-col items-center gap-3">
            <Package size={44} className="text-neutral-700" />
            <p className="font-michroma text-base uppercase text-white">No Matching Orders</p>
            <p className="text-xs text-neutral-500 max-w-sm">
              {searchQuery
                ? `No orders matched your search "${searchQuery}". Try searching with a different term.`
                : "No customer orders have been placed in this category."}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline" size="xs">
                Clear Search Query
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="text-neutral-400 hover:text-white inline-flex items-center"
                    >
                      {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? (
                        <CheckSquare size={18} className="text-primary" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Customer Info</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Payment Method</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Payment Number</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Transaction ID</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Total (BDT)</th>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Order Status</th>
                  <th className="text-center p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  const isRowUpdating = updatingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/dashboard/orders/${encodeURIComponent(order.id)}`)}
                      className={`hover:bg-white/[0.04] transition-colors cursor-pointer group ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Checkbox Cell */}
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => toggleSelectOne(order.id, e)}
                          className="text-neutral-400 hover:text-white inline-flex items-center"
                        >
                          {isSelected ? (
                            <CheckSquare size={18} className="text-primary" />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>

                      {/* Order ID */}
                      <td className="p-4 font-mono font-bold text-primary text-xs whitespace-nowrap">
                        <span className="group-hover:underline">#{order.id}</span>
                      </td>

                      {/* Customer Name & Phone */}
                      <td className="p-4">
                        <p className="font-bold text-white text-xs group-hover:text-primary transition-colors">
                          {order.customer_name}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {order.customer_phone}
                        </p>
                      </td>

                      {/* Payment Method */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-sm text-[10px] font-bold uppercase font-mono">
                          {order.payment_method || "COD"}
                        </span>
                      </td>

                      {/* Payment Number */}
                      <td className="p-4 font-mono text-xs text-neutral-300 whitespace-nowrap">
                        {order.payment_number || <span className="text-neutral-600">—</span>}
                      </td>

                      {/* Transaction ID */}
                      <td className="p-4 font-mono text-xs text-primary font-bold whitespace-nowrap">
                        {order.transaction_id || <span className="text-neutral-600 font-normal">—</span>}
                      </td>

                      {/* Total Amount */}
                      <td className="p-4 whitespace-nowrap font-mono font-bold text-white text-xs">
                        ৳{getOrderTotal(order)}
                        {order.coupon_code && (
                          <span className="block text-[9px] text-primary font-bold uppercase mt-0.5">
                            {order.coupon_code} (-৳{order.discount_amount})
                          </span>
                        )}
                      </td>

                      {/* Order Status Dropdown Cell */}
                      <td className="p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={order.order_status || "Payment Pending"}
                            disabled={isRowUpdating}
                            onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${
                              statusBadgeStyle(order.order_status)
                            } ${isRowUpdating ? "opacity-50" : ""}`}
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st} className="bg-neutral-900 text-white">
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/orders/${encodeURIComponent(order.id)}`}
                            className="p-2 hover:bg-white/10 text-neutral-300 hover:text-white rounded-sm transition-colors"
                            title="Inspect Order Details"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => setConfirmSingleDeleteId(order.id)}
                            className="p-2 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-sm transition-colors"
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

      {/* Confirm Single Delete Modal */}
      <ConfirmModal
        isOpen={!!confirmSingleDeleteId}
        onClose={() => setConfirmSingleDeleteId(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Delete Order"
        description={`Are you sure you want to delete order #${confirmSingleDeleteId}?`}
      />

      {/* Confirm Bulk Delete Modal */}
      <ConfirmModal
        isOpen={confirmBulkDeleteOpen}
        onClose={() => setConfirmBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Orders"
        description={`Are you sure you want to permanently delete ${selectedIds.length} selected orders from your database?`}
      />
    </div>
  );
}
