"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import { A1Button } from "@/components/ui/A1Button";
import { Trophy, CheckCircle2, UserCheck, Gamepad2, FileText, Send } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    ign: "",
    role: "Pro Player",
    game: "PUBG Mobile",
    phone: "",
    email: "",
    age: "",
    experience: "",
    portfolioUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden flex items-center justify-center">
        <div className="relative z-20 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm italic"
          >
            Join A1 Esports
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter"
          >
            Applications<span className="text-primary italic">.</span>
          </motion.h1>
        </div>
        <GlowBar position="bottom" />
      </section>

      <Section containerClassName="max-w-4xl">
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 md:p-14 space-y-8 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 bg-primary/20 text-primary font-black text-xs uppercase tracking-widest rounded-full inline-block">
              Talent Acquisition
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Think You Have What It Takes?
            </h2>
            <p className="text-neutral-400 text-sm max-w-lg mx-auto">
              Whether you are an aspiring pro player, content creator, shoutcaster, or analyst — submit your application below to join the A1 family.
            </p>
          </div>

          {submitted ? (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-10 text-center space-y-4 my-8">
              <CheckCircle2 size={56} className="text-primary mx-auto animate-bounce" />
              <h3 className="text-3xl font-black uppercase tracking-tight">Application Submitted!</h3>
              <p className="text-neutral-300 text-sm max-w-md mx-auto">
                Thank you for applying. Our talent management team will review your submission and contact shortlisted candidates via email/Discord.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <Link href="/teams">
                  <A1Button variant="primary">View Current Rosters</A1Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MD Shakil"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    In-Game Name (IGN) / Alias *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SiNiSTER"
                    value={form.ign}
                    onChange={(e) => setForm({ ...form, ign: e.target.value })}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Applying Category *
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-white"
                  >
                    <option value="Pro Player">Pro Player (Esports)</option>
                    <option value="Academy Player">Academy Player</option>
                    <option value="Content Creator">Content Creator / Streamer</option>
                    <option value="Coach / Analyst">Coach / Analyst</option>
                    <option value="Management / Staff">Management / Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Primary Title / Game *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PUBG Mobile, Free Fire..."
                    value={form.game}
                    onChange={(e) => setForm({ ...form, game: e.target.value })}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="18"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="player@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01700000000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Portfolio / Gameplay Highlights Link (YouTube, Liquipedia, Drive)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.portfolioUrl}
                  onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                  className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Competitive Achievements & Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="List tournaments played, past teams, achievements, and why you want to join A1 Esports..."
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <A1Button variant="primary" type="submit" className="w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Send size={16} /> Submit Application
              </A1Button>
            </form>
          )}
        </div>
      </Section>
    </main>
  );
}
