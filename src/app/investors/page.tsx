"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, ShieldCheck, Mail, Globe2, Building } from "lucide-react";
import Link from "next/link";
import { InvestorHighlight, getInvestors } from "@/lib/investors";
import { PageHero } from "@/components/ui/PageHero";

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<InvestorHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvestors().then((data) => {
      setInvestors(data || []);
      setLoading(false);
    });
  }, []);

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("/") || url.startsWith("data:image");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Hero Header */}
      <PageHero
        subtitle="Investor Relations"
        title="Investors"
        icon={TrendingUp}
      />

      {/* Investment Highlights */}
      <section className="py-24 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Strategic Growth</span>
          <h2 className="text-3xl font-michroma uppercase">Why Invest In A1 Esports</h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
            Loading investment highlights...
          </div>
        ) : investors.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 font-bold uppercase tracking-wider bg-[#0a0a0a] border border-white/10 rounded-sm p-12">
            No investor highlights currently listed.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {investors.map((inv, i) => (
              <motion.div
                key={inv.id || inv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-sm bg-neutral-900/60 border border-white/10 hover:border-primary/40 backdrop-blur-xl transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  {isImageUrl(inv.logo) ? (
                    <div className="relative h-12 w-32 rounded-sm bg-white/5 border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={inv.logo}
                        alt={inv.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      {i % 3 === 0 ? <Globe2 size={24} /> : i % 3 === 1 ? <PieChart size={24} /> : <Building size={24} />}
                    </div>
                  )}

                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-xs font-black text-primary uppercase">
                    {inv.metric}
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                  {inv.category}
                </span>
                <h3 className="text-xl font-michroma uppercase text-white">{inv.title}</h3>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed">{inv.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Investor Inquiry Callout */}
      <section className="py-16 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 text-center">
        <div className="p-12 rounded-sm bg-neutral-900 border border-white/10 backdrop-blur-xl space-y-6">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-3xl font-michroma uppercase">Request Investor Deck</h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
            Interested institutional investors, venture funds, or strategic partners can connect with our executive board for financial metrics and pitch presentations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(255,0,102,0.4)]"
          >
            <Mail size={16} /> Contact Investor Relations
          </Link>
        </div>
      </section>
    </div>
  );
}
