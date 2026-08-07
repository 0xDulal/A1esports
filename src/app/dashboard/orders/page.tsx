"use client";

import { useEffect, useState } from "react";
import { Package, RefreshCw, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-neutral-400">View and manage customer merchandise orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 flex flex-col items-center gap-3">
            <Package size={40} className="text-neutral-600" />
            <p className="font-bold text-lg">No orders placed yet</p>
            <p className="text-sm text-neutral-500">Orders placed through checkout will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 font-bold text-neutral-400">Order ID</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Customer</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Total</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Payment</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Status</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Date</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{order.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{order.customer_name}</p>
                      <p className="text-xs text-neutral-400">{order.customer_phone}</p>
                    </td>
                    <td className="p-4 font-bold text-white">৳{order.total_amount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-full text-xs font-bold uppercase">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase">
                        {order.order_status || "Processing"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-neutral-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <Eye size={16} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase flex justify-between items-center pr-6">
                <span>Order #{selectedOrder.id}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="bg-neutral-800/80 p-4 rounded-xl space-y-2 text-sm">
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Customer:</span> {selectedOrder.customer_name}</p>
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Phone:</span> {selectedOrder.customer_phone}</p>
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Email:</span> {selectedOrder.customer_email}</p>
                <p><span className="text-neutral-400 font-bold uppercase text-xs">Address:</span> {selectedOrder.shipping_address}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ordered Items</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg text-sm">
                      <div>
                        <p className="font-bold text-white">{item.title}</p>
                        {item.customName && <p className="text-xs text-primary font-bold">Custom Name: {item.customName}</p>}
                        <p className="text-xs text-neutral-400">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
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
    </div>
  );
}
