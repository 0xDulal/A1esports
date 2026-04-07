"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { A1Button } from "@/components/ui/A1Button";
import { ProductCard, Product } from "@/components/ui/ProductCard";

const products: Product[] = [
  {
    id: 1,
    title: "Away Kit | Beauty Red – Player Eddition",
    price: 850,
    price2: 899,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png",
    category: "JERSEYS",
    isSoldOut: false,
  },
  {
    id: 2,
    title: "Away Kit | Beauty Red – Fan Edition",
    price: 650,
    price2: 699,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-2-1024x1024.png",
    category: "JERSEYS",
    isSoldOut: false,
  },
  {
    id: 3,
    title: "Home Kit | Signature Purple – Player Eddition",
    price: 800,
    price2: 899,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-8-1024x1024.png",
    category: "JERSEYS",
    isSoldOut: false,
  },
  {
    id: 4,
    title: "Home Kit | Signature Purple – Fan Edition",
    price: 600,
    price2: 699,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-9-1024x1024.png",
    category: "JERSEYS",
    isSoldOut: false,
  },
];

export function Merchandise() {
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </Section>
  );
}
