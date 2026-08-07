"use client";

import { motion } from "framer-motion";
import { Shield, Target, Trophy, Flame, Users, Sparkles, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,102,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase">
              <Sparkles size={14} /> Organization Overview
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-sans italic">
              WE ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">A1 ESPORTS</span>
            </h1>

            <p className="text-lg text-neutral-400 font-medium leading-relaxed">
              Founded in Bangladesh, A1 Esports has grown into one of South Asia&apos;s premier esports organizations. Dominating battlegrounds globally, we build champions, foster talent, and deliver unforgettable competitive experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values / Pillar Cards */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Core Pillars</span>
          <h2 className="text-3xl font-black uppercase tracking-tight">What Drives Our Empire</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Relentless Excellence",
              desc: "From strict tactical preparation to high-intensity bootcamp sessions, we aim for podium finishes in every global tournament.",
            },
            {
              icon: Users,
              title: "Player First Culture",
              desc: "We empower athletes with world-class bootcamps, psychological coaching, physical wellness, and long-term career growth.",
            },
            {
              icon: Flame,
              title: "Fanatic Community",
              desc: "Over 1.5M+ passionate gaming fans stand behind the A1 banner across YouTube, Facebook, and Instagram worldwide.",
            },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-primary/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <pillar.icon size={26} />
              </div>
              <h3 className="text-xl font-black uppercase mb-3 text-white">{pillar.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-16 border-y border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Major Titles", val: "15+" },
            { label: "Prize Money Won", val: "$150K+" },
            { label: "Global Fanbase", val: "1.5M+" },
            { label: "Years Dominating", val: "6+" },
          ].map((st) => (
            <div key={st.label} className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 font-sans italic">
                {st.val}
              </div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Join / CTA Section */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <div className="p-12 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl space-y-6">
          <Shield className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black uppercase">Ready to Join The Movement?</h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm leading-relaxed">
            Whether you want to represent A1 Esports as a pro player, content creator, or brand partner, we welcome elite talent.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/apply"
              className="px-8 py-3.5 rounded-full bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(255,0,102,0.4)]"
            >
              Apply For Roster
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              Contact Leadership
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
