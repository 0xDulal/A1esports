"use client";

import { useState, useMemo } from "react";
import { Trophy, Calendar, Medal, ExternalLink, Filter, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LIQUIPEDIA_URL = "https://liquipedia.net/pubgmobile/A1_RG_Esports/Results";

export function Achievements({ achievements }: { achievements: any[] }) {
  const [selectedTier, setSelectedTier] = useState<string>("ALL");

  const filteredAchievements = useMemo(() => {
    if (!Array.isArray(achievements)) return [];

    return [...achievements]
      .filter((item) => {
        if (!item) return false;
        if (selectedTier === "ALL") return true;

        const tierStr = (item.tier || "").trim().toUpperCase();
        const targetTier = selectedTier.trim().toUpperCase();

        if (tierStr === targetTier) return true;

        const cleanTarget = targetTier.replace(/[^A-Z0-9]/g, "");
        const cleanItem = tierStr.replace(/[^A-Z0-9]/g, "");

        if (cleanTarget === "STIER") {
          return cleanItem === "STIER" || cleanItem === "S" || tierStr.startsWith("S-TIER") || tierStr.startsWith("S TIER");
        }
        if (cleanTarget === "ATIER") {
          return cleanItem === "ATIER" || cleanItem === "A" || tierStr.startsWith("A-TIER") || tierStr.startsWith("A TIER");
        }
        if (cleanTarget === "BTIER") {
          return cleanItem === "BTIER" || cleanItem === "B" || tierStr.startsWith("B-TIER") || tierStr.startsWith("B TIER");
        }
        if (cleanTarget === "CTIER") {
          return cleanItem === "CTIER" || cleanItem === "C" || tierStr.startsWith("C-TIER") || tierStr.startsWith("C TIER");
        }

        return cleanItem.includes(cleanTarget);
      })
      .sort((a, b) => {
        const timeA = a.date ? new Date(a.date).getTime() : 0;
        const timeB = b.date ? new Date(b.date).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 6);
  }, [achievements, selectedTier]);

  return (
    <section className="bg-[#050505] text-neutral-400 py-24 px-4 md:px-8 font-mono border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-widest text-white uppercase">Tournament Records</h2>
            <div className="hidden md:block w-32 h-px bg-neutral-800 ml-4" />
          </div>
          
          <Button asChild variant="outline">
            <Link
              href={LIQUIPEDIA_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Liquipedia Results <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        </div>

        {/* Filter Controls Bar */}
        <div className="border border-neutral-800 bg-neutral-900/30 p-4 mb-8 flex flex-wrap items-center gap-6">
          <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
            <Filter size={12} className="text-primary" /> Filter Tier:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "S-Tier", "A-Tier", "B-Tier"].map((t) => (
              <Button
                key={t}
                variant={selectedTier === t ? "primary" : "secondary"}
                size="xs"
                onClick={() => setSelectedTier(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        {filteredAchievements.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((item, i) => (
                <AchievementCard key={`${item.tournament}-${item.date}-${i}`} item={item} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="border border-neutral-800 bg-neutral-900/20 p-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">
              No tournament records found for {selectedTier}
            </p>
            <Button variant="outline" size="sm" onClick={() => setSelectedTier("ALL")}>
              Reset Filter
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function AchievementCard({ item, index }: { item: any; index: number }) {
  const placeStr = String(item?.place || "");
  const isFirst = placeStr.includes("1st") || placeStr === "1";
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex flex-col justify-between border bg-neutral-900/30 p-6 h-64 group transition-colors ${isFirst ? 'border-primary/50 hover:border-primary' : 'border-neutral-800 hover:border-neutral-600'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2 py-1 text-xs font-bold tracking-widest uppercase border ${isFirst ? 'bg-primary/10 text-primary border-primary/30' : 'bg-neutral-800 text-white border-neutral-700'}`}>
          {item.place}
        </div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-500">
          <Medal className="h-3 w-3 text-neutral-600" />
          {item.tier}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold uppercase leading-tight text-white line-clamp-3 group-hover:text-primary transition-colors">
          {item.tournament}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <Calendar className="h-3 w-3" />
          {item.date}
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-800 flex justify-between items-center mt-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
          Prize Money
        </div>
        <div className="text-white font-mono font-bold">
          {item.prize}
        </div>
      </div>
      
      {/* Schematic corner accent */}
      {isFirst && (
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary m-2 opacity-50" />
      )}
    </motion.div>
  );
}
