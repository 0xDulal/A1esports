"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-neutral-400">Configure your website and organization settings</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg text-sm">
            <CheckCircle2 size={18} /> Settings saved successfully!
          </div>
        )}
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
                defaultValue="contact@a1esportsbd.com"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Headquarters Address</label>
              <input
                type="text"
                defaultValue="Dhaka, Bangladesh"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Social Media Links</h2>
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
                defaultValue="https://www.instagram.com/a1esports.bd"
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
            <div>
              <label className="block text-sm font-medium mb-2">Discord Server</label>
              <input
                type="url"
                defaultValue="https://discord.gg/EKRQMA83"
                className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
