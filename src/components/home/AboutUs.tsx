"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Trophy, Globe, Zap, CircuitBoard } from "lucide-react";

const stats = [
  { label: "Founded", value: "2020", icon: Zap },
  { label: "Pro Players", value: "25+", icon: Users },
  { label: "Championships", value: "15+", icon: Trophy },
  { label: "Global Reach", value: "Millions", icon: Globe },
];

export function AboutUs() {
  return (
    <section id="about" className="bg-[#0a0a0a] text-neutral-400 py-24 px-4 md:px-8 font-mono border-t border-neutral-800">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <CircuitBoard className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-widest text-white uppercase">About Us</h2>
          <div className="flex-1 h-px bg-neutral-800 ml-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Mission Spec Sheet */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 border border-neutral-800 bg-neutral-900/30 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-neutral-800 text-xs font-bold uppercase tracking-widest mb-8">
                <span className="text-primary">Our Story</span>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                South Asia's <br/> Premier <span className="text-primary">Powerhouse</span>
              </h3>
              
              <div className="space-y-6 text-sm leading-relaxed max-w-md text-neutral-400">
                <p>
                  Founded in 2020, <span className="text-white">A1 Esports</span> operates as a high-performance organization dedicated to excellence, precision, and the systemic growth of the competitive gaming ecosystem.
                </p>
                <p>
                  Deploying top-tier professional rosters and world-class analytical coaching staff, we execute at the highest level in global tournaments, consistently optimizing the boundaries of competitive mechanics.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual Hardware Schematic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 border border-primary/50 bg-neutral-900/30 p-2 relative overflow-hidden transition-colors"
          >
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] text-white bg-black/50 px-2 py-1 uppercase tracking-widest">Live Feed</span>
            </div>
            <div className="relative h-full min-h-[300px] w-full border border-neutral-800 bg-black overflow-hidden flex items-center justify-center">
              {/* Technical schematic overlay */}
              <div className="absolute inset-0 bg-[url('/images/regular/a1team.jpg')] bg-cover bg-center opacity-90 transition-all duration-700" />
              <div className="absolute inset-0 border border-primary/20 m-4 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(138,43,226, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(138,43,226, 0.15) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.8 }} />
            </div>
          </motion.div>

          {/* Telemetry Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 grid grid-rows-4 gap-4"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="border border-neutral-800 bg-neutral-900/30 p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                </div>
                <stat.icon className="w-5 h-5 text-neutral-700 group-hover:text-primary/70 transition-colors" />
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
