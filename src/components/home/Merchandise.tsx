"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { A1Button } from "@/components/ui/A1Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";

export function Merchandise() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setRecentProducts(data.slice(0, 4));
      }
    });
  }, []);

  return (
    <Section withGlow aria-labelledby="merch-heading" className="py-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <SectionHeader
          title={
            <>
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Merchandise</span>
            </>
          }
          subtitle="Official Shop"
          icon={ShoppingCart}
          className="mb-0"
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/shop">
            <A1Button size="lg" className="group">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </A1Button>
          </Link>
        </motion.div>
      </div>

      {/* Product Grid - Most Recent 4 Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recentProducts.map((product, index) => (
          <ProductCard key={product.id || product.slug} product={product} index={index} />
        ))}
      </div>
    </Section>
  );
}
