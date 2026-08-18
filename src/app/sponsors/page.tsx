"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Zap, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { A1Button } from "@/components/ui/A1Button";
import { Sponsor, getSponsors, defaultSponsors } from "@/lib/sponsors";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(defaultSponsors);

  useEffect(() => {
    getSponsors().then((data) => {
      if (data && data.length > 0) setSponsors(data);
    });
  }, []);

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("/") || url.startsWith("data:image");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 sm:pt-32 pb-16 sm:pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,102,0.15),rgba(255,255,255,0))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase">
            <Handshake size={14} /> Global Alliances
          </div>

          <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight font-sans italic">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">SPONSORS & PARTNERS</span>
          </h1>

          <p className="text-neutral-400 max-w-2xl mx-auto font-medium text-sm sm:text-base">
            Backed by world-leading brands who power our athletes, bootcamps, and global competitive operations.
          </p>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {sponsors.map((s, i) => (
            <motion.div
              key={s.id || s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-neutral-900/60 border border-white/10 hover:border-primary/40 backdrop-blur-xl space-y-6 transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isImageUrl(s.logo) ? (
                  <div className="relative h-16 w-44 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="max-h-full max-w-full object-contain filter brightness-110 contrast-125 group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-black text-xl text-primary font-sans italic">
                    {s.logo || s.name.substring(0, 8).toUpperCase()}
                  </div>
                )}

                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                  {s.badge}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white group-hover:text-primary transition-colors">
                    {s.name}
                  </h3>
                  {s.websiteUrl && (
                    <Link
                      href={s.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-primary transition-colors"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">
                  {s.category}
                </span>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed pt-2">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Become a Partner Callout */}
        <div className="mt-12 sm:mt-20 p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl text-center space-y-6 max-w-4xl mx-auto">
          <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black uppercase">Partner With A1 Esports</h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
            Reach millions of passionate gaming fans across South Asia. Elevate your brand with official jersey placements, video sponsorships, and tournament activations.
          </p>
          <Link href="/contact" className="inline-block">
            <A1Button variant="primary" size="lg">
              <Mail size={16} className="mr-2" /> Partner Inquiry
            </A1Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
