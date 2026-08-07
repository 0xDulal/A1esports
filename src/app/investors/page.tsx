"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, ShieldCheck, Mail, Globe2, Building } from "lucide-react";
import Link from "next/link";
import { InvestorHighlight, getInvestors, defaultInvestors } from "@/lib/investors";

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<InvestorHighlight[]>(defaultInvestors);

  useEffect(() => {
    getInvestors().then((data) => {
      if (data && data.length > 0) setInvestors(data);
    });
  }, []);

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("/") || url.startsWith("data:image");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-32 pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,0,102,0.15),rgba(255,255,255,0))]" />

        <div className="relative max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase">
            <TrendingUp size={14} /> Investor Relations
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-sans italic">
            INVEST IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">THE FUTURE OF ESPORTS</span>
          </h1>

          <p className="text-neutral-400 max-w-2xl mx-auto font-medium text-base">
            Capitalize on South Asia&apos;s fastest-growing mobile esports organization. High engagement, global brand expansion, and merchandise monetization.
          </p>
        </div>
      </section>

      {/* Investment Highlights */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Strategic Growth</span>
          <h2 className="text-3xl font-black uppercase">Why Invest In A1 Esports</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {investors.map((inv, i) => (
            <motion.div
              key={inv.id || inv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-neutral-900/60 border border-white/10 hover:border-primary/40 backdrop-blur-xl transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                {isImageUrl(inv.logo) ? (
                  <div className="relative h-12 w-32 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={inv.logo}
                      alt={inv.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {i % 3 === 0 ? <Globe2 size={24} /> : i % 3 === 1 ? <PieChart size={24} /> : <Building size={24} />}
                  </div>
                )}

                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-black text-primary uppercase">
                  {inv.metric}
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                {inv.category}
              </span>
              <h3 className="text-xl font-black uppercase text-white">{inv.title}</h3>
              <p className="text-sm text-neutral-400 font-medium leading-relaxed">{inv.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Investor Inquiry Callout */}
      <section className="py-16 max-w-4xl mx-auto px-6 text-center">
        <div className="p-12 rounded-[2.5rem] bg-neutral-900 border border-white/10 backdrop-blur-xl space-y-6">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-3xl font-black uppercase">Request Investor Deck</h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
            Interested institutional investors, venture funds, or strategic partners can connect with our executive board for financial metrics and pitch presentations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(255,0,102,0.4)]"
          >
            <Mail size={16} /> Contact Investor Relations
          </Link>
        </div>
      </section>
    </div>
  );
}
