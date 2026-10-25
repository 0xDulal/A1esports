"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shopProducts as fallbackProducts, Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["ALL", "JERSEYS", "HOODIES", "LIFESTYLE", "ACCESSORIES"] as const;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProductsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((product) => activeCategory === "ALL" || product.category === activeCategory)
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [products, activeCategory, sortBy]);

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Hero Section */}
      <PageHero
        subtitle="Official Merchandise"
        title="Store"
        icon={ShoppingBag}
      />

      {/* Shop Controls */}
      <div className="sticky top-24 z-40 bg-black/80 backdrop-blur-md border-y border-white/5 py-4 mb-12">
        <div className="mx-auto max-w-[1800px] px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "primary" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
              {filteredProducts.length} Products
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-sm px-4 py-2 hover:border-primary/50 transition-all cursor-pointer">
                <SlidersHorizontal size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white min-w-[120px]">
                  {sortBy === "newest" ? "Featured" : sortBy === "price-low" ? "Price: Low to High" : "Price: High to Low"}
                </span>
              </div>

              <div className="absolute top-full right-0 mt-2 w-52 bg-neutral-900 border border-white/10 rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl">
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
                        ? "bg-primary text-black"
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
          {loading ? (
            <div className="py-24 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
              Loading Products...
            </div>
          ) : (
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
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <p className="text-4xl font-michroma text-white/20 uppercase tracking-tighter">No items found</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory("ALL")}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
