"use client";

import { getLiquipediaAchievements } from "@/lib/liquipedia";
import { Trophy, Calendar, Medal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function AnimatedPrize({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number, assuming format like "10,000" or "500"
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
    <section className="relative w-full bg-black py-24 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-2 text-primary mb-4">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Hall of Fame</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Achievements</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-black p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary-rgb),0.3)]"
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

              {/* Bottom: Prize & Decoration */}
              <div className="flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Prize Pool</div>
                  <div className="flex items-center gap-1 text-2xl font-black text-green-400">
                    <span className="text-lg">$</span>
                    <AnimatedPrize value={item.prize} />
                  </div>
                </div>
                
                {/* Animated Arrow Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-all duration-300 group-hover:bg-primary group-hover:text-black">
                   <Trophy className="h-5 w-5" />
                </div>
              </div>
              
              {/* Background Glow Effect */}
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-all duration-300 group-hover:bg-primary/30" />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <Link href="https://liquipedia.net/pubgmobile/A1_Esports" target="_blank" rel="noopener noreferrer">
            <Button className="group h-14 px-10 text-lg font-bold tracking-widest uppercase bg-primary hover:bg-primary/90 text-white rounded-none [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]">
              View Full History
              <Trophy className="ml-2 h-5 w-5 transition-transform group-hover:-rotate-12 group-hover:scale-110" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
