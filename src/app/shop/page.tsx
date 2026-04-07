"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shopProducts, Product } from "@/lib/data/shop";
import { ProductCard } from "@/components/ui/ProductCard";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["ALL", "JERSEYS", "HOODIES", "LIFESTYLE", "ACCESSORIES"] as const;

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");

  const filteredProducts = useMemo(() => {
    console.log("Sorting products by:", sortBy, "in category:", activeCategory);
    return [...shopProducts]
      .filter((product) => activeCategory === "ALL" || product.category === activeCategory)
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0; // Maintain original array order
      });
  }, [activeCategory, sortBy]);

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 text-white/5 flex items-center justify-center pointer-events-none select-none">
          <ShoppingBag size={400} strokeWidth={0.5} className="opacity-10" />
        </div>

        <div className="relative z-20 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base italic"
          >
            Official Merchandise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter"
          >
            Store<span className="text-primary italic">.</span>
          </motion.h1>
        </div>
        <GlowBar position="bottom" />
      </section>

      {/* Shop Controls */}
      <div className="sticky top-24 z-40 bg-black/80 backdrop-blur-md border-y border-white/5 py-4 mb-12">
        <div className="mx-auto max-w-[1800px] px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-primary border-primary text-white"
                    : "bg-white/5 border-white/10 text-neutral-500 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                {filteredProducts.length} Products
              </div>
              
              {/* Custom Sort Dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:border-primary/50 transition-all cursor-pointer">
                  <SlidersHorizontal size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white min-w-[120px]">
                    {sortBy === "newest" ? "Featured" : sortBy === "price-low" ? "Price: Low to High" : "Price: High to Low"}
                  </span>
                </div>
                
                <div className="absolute top-full right-0 mt-2 w-52 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl">
                  {[
                    { id: "newest", label: "Featured" },
                    { id: "price-low", label: "Price: Low to High" },
                    { id: "price-high", label: "Price: High to Low" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id as any)}
                      className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                        sortBy === option.id 
                          ? "bg-primary text-white" 
                          : "text-neutral-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Product Grid */}
      <Section className="py-0">
        <div className="mx-auto max-w-[1800px]">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <p className="text-4xl font-black text-white/20 uppercase tracking-tighter">No items found</p>
              <button 
                onClick={() => setActiveCategory("ALL")}
                className="text-primary font-bold uppercase tracking-widest text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
