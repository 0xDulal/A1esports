"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Users, Trophy, DollarSign, ArrowRight, Package, Sparkles } from "lucide-react";
import { getProductsFromSupabase, getTeamsFromSupabase } from "@/services/supabase/db.service";
import { supabase } from "@/lib/supabase/client";
import { Order } from "@/types/domain";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [playersCount, setPlayersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const { data: ordsData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      const [prods, tms] = await Promise.all([
        getProductsFromSupabase(),
        getTeamsFromSupabase(),
      ]);

      const ords: Order[] = ordsData || [];

      setProductsCount(prods?.length || 0);
      setTeamsCount(tms?.length || 0);

      const totalP = (tms || []).reduce(
        (sum, t) => sum + (t.players ? t.players.length : 0),
        0
      );
      setPlayersCount(totalP);

      const validOrders = ords.filter(
        (o) => o.order_status !== "Cancelled" && (o as any).status !== "Cancelled"
      );
      const rev = validOrders.reduce(
        (sum, o) => sum + (Number(o.total_amount) || Number((o as any).total) || 0),
        0
      );
      setTotalRevenue(rev);
      setOrdersCount(ords.length);
      setRecentOrders(ords.slice(0, 5));
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-neutral-400">Live organization metrics and system overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="text-primary" size={24} />
            </div>
            <Link href="/dashboard/products" className="text-neutral-500 hover:text-white transition-colors">
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-3xl font-bold">{loading ? "..." : productsCount}</h3>
          <p className="text-neutral-400 text-sm">Products Inventory</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="text-green-500" size={24} />
            </div>
            <Link href="/dashboard/teams" className="text-neutral-500 hover:text-white transition-colors">
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-3xl font-bold">{loading ? "..." : playersCount}</h3>
          <p className="text-neutral-400 text-sm">Active Players</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Trophy className="text-yellow-500" size={24} />
            </div>
            <Link href="/dashboard/teams" className="text-neutral-500 hover:text-white transition-colors">
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-3xl font-bold">{loading ? "..." : teamsCount}</h3>
          <p className="text-neutral-400 text-sm">Active Teams & Divisions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="text-blue-500" size={24} />
            </div>
            <Link href="/dashboard/orders" className="text-neutral-500 hover:text-white transition-colors">
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-3xl font-bold">
            {loading ? "..." : `৳${totalRevenue.toLocaleString()}`}
          </h3>
          <p className="text-neutral-400 text-sm">Total Revenue ({ordersCount} orders)</p>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-primary" /> Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/products"
              className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors inline-block text-sm"
            >
              Add Product
            </Link>
            <Link
              href="/dashboard/teams"
              className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors inline-block text-sm"
            >
              Add Team / Player
            </Link>
            <Link
              href="/dashboard/achievements"
              className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors inline-block text-sm"
            >
              Add Achievement
            </Link>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package size={18} className="text-primary" /> Recent Orders & Activity
          </h2>
          {recentOrders.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">No recent orders recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                  <div>
                    <span className="font-bold text-white block">#{ord.id} - {ord.customer_name}</span>
                    <span className="text-xs text-neutral-400">
                      {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary block">
                      ৳{(Number(ord.total_amount) || Number((ord as any).total) || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-400">{ord.order_status || (ord as any).status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
