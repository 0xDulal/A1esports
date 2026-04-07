"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Trophy, Globe, Zap } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

const stats = [
  {
    label: "Founded",
    value: "2020",
    icon: Zap,
  },
  {
    label: "Pro Players",
    value: "25+",
    icon: Users,
  },
  {
    label: "Championships",
    value: "15+",
    icon: Trophy,
  },
  {
    label: "Global Reach",
    value: "Millions",
    icon: Globe,
  },
];

export function AboutUs() {
  return (
    <Section id="about" className="pt-32 pb-24">
      {/* Background Decorative Logo */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 opacity-5 pointer-events-none select-none z-0">
        <Image
          src="/A1esports_logo_white.svg"
          alt=""
          width={800}
          height={800}
          className="object-contain"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10 pt-12">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Our Story
          </div>
          
          <SectionHeader
            title={
              <>
                Redefining <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  South Asian
                </span> <br />
                Esports
              </>
            }
            className="mb-8"
          />

          <div className="space-y-6 text-neutral-400 text-lg leading-relaxed max-w-xl">
            <p>
              Founded in 2020, <span className="text-white font-bold">A1 Esports</span> has rapidly ascended to become South Asia's premier esports powerhouse. We are more than just a team; we are a visionary movement dedicated to excellence, performance, and the growth of the gaming ecosystem.
            </p>
            <p>
              With a roster of top-tier professional players and world-class coaching staff, we compete at the highest level in global tournaments, consistently pushing the boundaries of what's possible in competitive gaming.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12 pt-12 pb-12 border-t border-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-2xl md:text-3xl font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Visual Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-600/20 rounded-[3rem] blur-3xl opacity-50" />
          <div className="relative h-full w-full rounded-[3rem] overflow-hidden border border-white/10">
            <Image
              src="/images/regular/a1team.jpg"
              alt="A1 Esports Team"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
