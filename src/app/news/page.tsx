"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { newsArticles } from "@/lib/data/news";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import { Newspaper, Calendar, Clock, ArrowUpRight } from "lucide-react";

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 text-white/5 flex items-center justify-center pointer-events-none select-none">
          <Newspaper size={400} strokeWidth={0.5} className="opacity-10" />
        </div>

        <div className="relative z-20 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base italic"
          >
            Latest Updates & Coverage
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter"
          >
            News<span className="text-primary italic">.</span>
          </motion.h1>
        </div>
        <GlowBar position="bottom" />
      </section>

      <Section className="pt-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(255,0,102,0.15)]"
            >
              <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {article.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-neutral-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-neutral-500" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-black uppercase leading-tight text-white group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    By {article.author}
                  </span>
                  <Link
                    href={`/news/${article.slug}`}
                    className="flex items-center gap-1 text-xs font-black uppercase text-primary tracking-widest hover:underline"
                  >
                    Read Article <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </main>
  );
}
