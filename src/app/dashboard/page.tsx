"use client";

import { ShoppingBag, Users, Trophy, DollarSign } from "lucide-react";
import { shopProducts } from "@/lib/data/shop";
import { teams } from "@/lib/teams";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-neutral-400">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="text-primary" size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{shopProducts.length}</h3>
          <p className="text-neutral-400 text-sm">Products</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="text-green-500" size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold">
            {teams.reduce((acc, team) => acc + team.players.length, 0)}
          </h3>
          <p className="text-neutral-400 text-sm">Players</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Trophy className="text-yellow-500" size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{teams.length}</h3>
          <p className="text-neutral-400 text-sm">Teams</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="text-blue-500" size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold">$0</h3>
          <p className="text-neutral-400 text-sm">Revenue (Today)</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">
              Add Product
            </button>
            <button className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
              Add Team
            </button>
            <button className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
              Add Achievement
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-neutral-400">No recent activity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
