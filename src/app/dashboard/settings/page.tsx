"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-400">Configure your admin panel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                defaultValue="A1ESPORTS"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="contact@a1esports.com"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Social Media</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <input
                type="url"
                defaultValue="https://facebook.com/a1esportsbd"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="url"
                defaultValue="https://instagram.com/a1esportsbd"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube</label>
              <input
                type="url"
                defaultValue="https://youtube.com/@a1esportsbd"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
