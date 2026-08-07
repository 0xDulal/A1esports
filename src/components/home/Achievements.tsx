"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Trophy, Calendar, Medal, ExternalLink, Filter } from "lucide-react";
import { motion, useSpring, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";

const LIQUIPEDIA_URL = "https://liquipedia.net/pubgmobile/A1_RG_Esports/Results";

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
  const [selectedPlace, setSelectedPlace] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");

  const filteredAchievements = useMemo(() => {
    const isDefault = selectedPlace === "ALL" && selectedTier === "ALL";

    return [...achievements]
      .filter((item) => {
        const placeStr = (item.place || "").toLowerCase();
        const tierStr = (item.tier || "").toUpperCase();

        if (isDefault) {
          const isTopTier =
            tierStr.includes("S-TIER") ||
            tierStr.includes("A-TIER") ||
            tierStr.includes("B-TIER") ||
            tierStr.includes("S TIER") ||
            tierStr.includes("A TIER") ||
            tierStr.includes("B TIER");

          const isTopPlacement =
            placeStr.startsWith("1st") ||
            placeStr.startsWith("2nd") ||
            placeStr.startsWith("3rd") ||
            placeStr.startsWith("4th") ||
            placeStr.startsWith("5th") ||
            placeStr.includes("top 1") ||
            placeStr.includes("top 8") ||
            placeStr.includes("top 16");

          return isTopTier && isTopPlacement;
        }

        const matchPlace =
          selectedPlace === "ALL"
            ? true
            : selectedPlace === "1st"
            ? placeStr.includes("1st")
            : selectedPlace === "2nd"
            ? placeStr.includes("2nd")
            : selectedPlace === "3rd"
            ? placeStr.includes("3rd")
            : selectedPlace === "4th"
            ? placeStr.includes("4th") ||
              placeStr.includes("5th") ||
              placeStr.includes("th") ||
              placeStr.includes("top")
            : true;

        const cleanSelectedTier = selectedTier.replace(/[^A-Z]/g, "");
        const cleanItemTier = tierStr.replace(/[^A-Z]/g, "");

        const matchTier =
          selectedTier === "ALL"
            ? true
            : cleanItemTier.includes(cleanSelectedTier);

        return matchPlace && matchTier;
      })
      .sort((a, b) => {
        const timeA = a.date ? new Date(a.date).getTime() : Number(a.year || 0) * 10000;
        const timeB = b.date ? new Date(b.date).getTime() : Number(b.year || 0) * 10000;
        return timeB - timeA;
      })
      .slice(0, 6);
  }, [achievements, selectedPlace, selectedTier]);

  return (
    <Section withGlow className="py-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <SectionHeader
          title={
            <>
              Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Achievements</span>
            </>
          }
          subtitle="Hall of Fame"
          icon={Trophy}
          align="left"
          className="mb-0"
        />

        {/* Liquipedia Direct Results Link Button */}
        <Link
          href={LIQUIPEDIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 group shrink-0"
        >
          <span>View Liquipedia Results</span>
          <ExternalLink size={14} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-4 mb-10 space-y-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Place Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mr-2 flex items-center gap-1">
              <Filter size={12} className="text-primary" /> Filter Place:
            </span>
            {[
              { id: "ALL", label: "ALL PLACES" },
              { id: "1st", label: "1ST (CHAMPIONS)" },
              { id: "2nd", label: "2ND PLACE" },
              { id: "3rd", label: "3RD PLACE" },
              { id: "4th", label: "FINALS / TOP 4" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlace(p.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                  selectedPlace === p.id
                    ? "bg-primary text-black"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Tier Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mr-2">
              Filter Tier:
            </span>
            {["ALL", "S-Tier", "A-Tier", "B-Tier"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                  selectedTier === t
                    ? "bg-primary text-black"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((item, i) => (
            <AchievementCard key={item.tournament || i} item={item} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredAchievements.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-xl font-bold uppercase text-neutral-400">No achievements found for this filter</p>
          <button
            onClick={() => {
              setSelectedPlace("ALL");
              setSelectedTier("ALL");
            }}
            className="text-primary text-xs font-black uppercase tracking-widest hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Bottom Footer CTA Link */}
      <div className="mt-12 text-center pt-8 border-t border-white/5">
        <Link
          href={LIQUIPEDIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors group"
        >
          <span>Full Competitive Match History Available on Liquipedia</span>
          <ExternalLink size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Section>
  );
}

function AchievementCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/10 to-transparent p-8 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-[0_20px_50px_-10px_rgba(255,0,102,0.2)]"
    >
      {/* Top Row: Rank & Tier */}
      <div className="mb-6 flex items-start justify-between">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-black text-xl shadow-lg ${
            item.place.includes("1st")
              ? "border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-yellow-500/20"
              : item.place.includes("2nd")
              ? "border-gray-400 bg-gray-400/10 text-gray-300 shadow-gray-400/20"
              : item.place.includes("3rd")
              ? "border-amber-700 bg-amber-700/10 text-amber-600 shadow-amber-700/20"
              : "border-primary/50 bg-primary/10 text-primary"
          }`}
        >
          {item.place}
        </motion.div>

        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Medal className="h-3 w-3 text-primary" />
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
            <AnimatedPrize value={item.prize} />
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <Trophy size={14} />
        </div>
      </div>
    </motion.div>
  );
}
