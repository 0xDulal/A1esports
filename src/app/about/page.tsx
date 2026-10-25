"use client";

import { motion } from "framer-motion";
import { Target, Flame, Users, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Section */}
      <PageHero
        subtitle="Organization Overview"
        title="About Us"
        icon={Sparkles}
      />

      {/* Core Values / Pillar Cards */}
      <section className="py-12 sm:py-24 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Core Pillars</span>
          <h2 className="text-2xl sm:text-3xl font-michroma uppercase tracking-tight">What Drives Our Empire</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
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
              className="p-6 sm:p-8 rounded-sm bg-neutral-900/60 border border-white/10 hover:border-primary/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <pillar.icon size={26} />
              </div>
              <h3 className="text-lg sm:text-xl font-michroma uppercase mb-3 text-white">{pillar.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-12 sm:py-16 border-y border-white/10 bg-neutral-950">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { label: "Major Titles", val: "15+" },
            { label: "Prize Money Won", val: "$150K+" },
            { label: "Global Fanbase", val: "1.5M+" },
            { label: "Years Dominating", val: "6+" },
          ].map((st) => (
            <div key={st.label} className="space-y-1">
              <div className="text-3xl sm:text-5xl font-michroma text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {st.val}
              </div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{st.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
