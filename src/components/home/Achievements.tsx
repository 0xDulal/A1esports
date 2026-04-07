"use client";

import { Trophy, Calendar, Medal } from "lucide-react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

function AnimatedPrize({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  
  const spring = useSpring(0, { mass: 1, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => {
    return Math.floor(current).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      spring.set(numericValue);
    }
  }, [isInView, numericValue, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function Achievements({ achievements }: { achievements: any[] }) {
  return (
    <Section withGlow className="py-24">
      <SectionHeader
        title={
          <>
            Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Achievements</span>
          </>
        }
        subtitle="Hall of Fame"
        icon={Trophy}
        align="center"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item, i) => (
          <AchievementCard key={i} item={item} index={i} />
        ))}
      </div>
    </Section>
  );
}

function AchievementCard({ item, index }: { item: any, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-black p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-[0_10px_40px_-10px_rgba(255,0,102,0.3)]"
    >
      {/* Top Row: Rank & Tier */}
      <div className="mb-6 flex items-start justify-between">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-black text-xl shadow-lg ${
          item.place.includes('1st') ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-yellow-500/20' :
          item.place.includes('2nd') ? 'border-gray-400 bg-gray-400/10 text-gray-300 shadow-gray-400/20' :
          item.place.includes('3rd') ? 'border-amber-700 bg-amber-700/10 text-amber-600 shadow-amber-700/20' :
          'border-primary/50 bg-primary/10 text-primary'
        }`}>
          {item.place}
        </motion.div>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Medal className="h-3 w-3" />
          {item.tier}
        </div>
      </div>

      {/* Middle: Tournament Name */}
      <div className="mb-8 flex-1">
        <h3 className="text-xl font-black uppercase leading-tight text-white group-hover:text-primary transition-colors line-clamp-3">
          {item.tournament}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {item.date}
        </div>
      </div>

      {/* Bottom: Prize */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Prize Money</span>
          <div className="text-xl font-black text-white">
            $<AnimatedPrize value={item.prize} />
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <Trophy size={14} />
        </div>
      </div>
    </motion.div>
  );
}
