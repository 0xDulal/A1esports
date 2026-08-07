"use client";

import { useParams } from "next/navigation";
import { newsArticles } from "@/lib/data/news";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";

export default function ArticleDetailPage() {
  const params = useParams();
  const article = newsArticles.find((a) => a.slug === params.slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Article Not Found</h1>
        <Link href="/news" className="text-primary hover:underline font-bold uppercase tracking-widest text-sm">
          Return to News Listing
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-24">
      <Section containerClassName="max-w-4xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to All News</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="px-3.5 py-1 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-full inline-block">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-bold border-y border-white/10 py-4">
              <span className="flex items-center gap-2">
                <User size={14} className="text-primary" /> {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" /> {article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-neutral-500" /> {article.readTime}
              </span>
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/10">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6 text-neutral-300 text-lg leading-relaxed pt-4">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Tag size={16} className="text-neutral-500" />
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-neutral-400">
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Article link copied to clipboard!");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-colors"
            >
              <Share2 size={14} /> Share Article
            </button>
          </div>
        </motion.div>
      </Section>
      <GlowBar />
    </main>
  );
}
