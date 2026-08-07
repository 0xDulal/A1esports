"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, ExternalLink, Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { Achievement, getLiquipediaAchievements } from "@/lib/liquipedia";

const LIQUIPEDIA_URL = "https://liquipedia.net/pubgmobile/A1_RG_Esports/Results";

export default function ChampionshipsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getLiquipediaAchievements().then((data) => {
      setAchievements(data || []);
      setLoading(false);
    });
  }, []);

  const filteredAchievements = useMemo(() => {
    const isDefault = selectedPlace === "ALL" && selectedTier === "ALL";

    return [...achievements].filter((item) => {
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
    }).sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeB - timeA;
    });
  }, [achievements, selectedPlace, selectedTier]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-32 pb-20 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,102,0.15),rgba(255,255,255,0))]" />

        <div className="relative max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase">
            <Trophy size={14} /> Trophy Cabinet
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-sans italic">
            HALL OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">CHAMPIONSHIPS</span>
          </h1>

          <p className="text-neutral-400 max-w-2xl mx-auto font-medium text-base">
            Explore the trophy cabinet, major titles, and prize achievements won by A1 Esports across official global and regional leagues.
          </p>
        </div>
      </section>

      {/* Filter Bar Section */}
      <section className="py-12 max-w-7xl mx-auto px-6">
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

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
            Loading Live Liquipedia Tournament Data...
          </div>
        )}

        {/* Championships Grid */}
        {!loading && (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((item, i) => (
                <motion.div
                  key={item.tournament + item.date + i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="p-8 rounded-[2rem] bg-neutral-900/60 border border-white/10 hover:border-primary/40 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                        item.place.includes("1st")
                          ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-500"
                          : item.place.includes("2nd")
                          ? "border-gray-400/40 bg-gray-400/10 text-gray-300"
                          : item.place.includes("3rd")
                          ? "border-amber-700/40 bg-amber-700/10 text-amber-600"
                          : "border-primary/40 bg-primary/10 text-primary"
                      }`}>
                        {item.place}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-xs font-bold uppercase flex items-center gap-1">
                        <Medal size={12} className="text-primary" />
                        {item.tier}
                      </span>
                    </div>

                    <h3 className="text-xl font-black uppercase leading-tight text-white group-hover:text-primary transition-colors line-clamp-3">
                      {item.tournament}
                    </h3>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-bold">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                    <div className="text-lg font-black text-white">
                      {item.prize}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredAchievements.length === 0 && (
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

        {/* Liquipedia Link */}
        <div className="mt-16 text-center">
          <Link
            href={LIQUIPEDIA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 text-white hover:text-primary text-xs font-black uppercase tracking-widest transition-all"
          >
            <span>View All Live Liquipedia Match Statistics</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
