"use client";

import { useEffect, useState, use } from "react";
import { NewsArticle } from "@/types/domain";
import { getNewsBySlugFromSupabase } from "@/services/supabase/db.service";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import { ArrowLeft, Calendar, Clock, User, Tag, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function SingleNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsBySlugFromSupabase(resolvedParams.slug).then((data) => {
      setArticle(data);
      setLoading(false);
    });
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-10 max-w-md text-center space-y-4">
          <Newspaper size={48} className="mx-auto text-neutral-600" />
          <h2 className="text-2xl font-black uppercase">Article Not Found</h2>
          <p className="text-sm text-neutral-400">The news story you are looking for does not exist or has been removed.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={16} /> Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Header Banner */}
      <section className="relative min-h-[400px] md:min-h-[500px] w-full overflow-hidden flex flex-col justify-end p-6 md:p-16">
        {article.image && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover opacity-40 blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

        <div className="relative z-20 max-w-4xl mx-auto w-full space-y-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-primary transition-colors uppercase tracking-widest mb-4"
          >
            <ArrowLeft size={14} /> Back to All News
          </Link>

          <div className="inline-block bg-primary text-black font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
            {article.category}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-bold border-t border-white/10 pt-4">
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
        <GlowBar position="bottom" />
      </section>

      {/* Article Content */}
      <Section className="pt-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {article.image && (
            <div className="relative h-[300px] sm:h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {article.summary && (
            <div className="p-6 bg-neutral-900/60 border border-primary/20 rounded-2xl text-lg font-medium text-neutral-200 leading-relaxed italic">
              "{article.summary}"
            </div>
          )}

          <div className="prose prose-invert max-w-none space-y-6 text-neutral-300 text-base leading-relaxed">
            {article.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 border-t border-white/10 flex items-center gap-3 flex-wrap">
              <Tag size={16} className="text-primary" />
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-neutral-900 border border-white/10 text-neutral-400 text-xs font-bold rounded-lg uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
