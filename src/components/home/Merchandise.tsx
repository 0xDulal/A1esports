"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
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
    <section className="relative w-full bg-black py-24 overflow-hidden" aria-labelledby="merch-heading">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="flex items-center gap-2 text-primary mb-4">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Official Shop</span>
            </div>
            <h2 id="merch-heading" className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Merchandise</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/shop">
              <Button className="group h-14 px-10 text-lg font-bold tracking-widest uppercase bg-primary hover:bg-primary/90 text-white rounded-none [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: typeof products[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group w-full flex"
    >
      {/* Product Card Container */}
      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-white/5 shadow-2xl hover:border-primary/30 transition-all duration-300 flex flex-col w-full">
        {/* Image Container */}
        <div className="bg-black aspect-square flex items-center justify-center overflow-hidden relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 30vw"
          />
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3 text-left flex flex-col flex-1">
          {/* Category */}
          <div className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase shrink-0">
            {product.category}
          </div>

          {/* Title */}
          <div className="flex-1 min-h-[3rem]">
            <h3 className="text-lg font-bold text-white tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
            <p className="text-[10px] text-neutral-500 font-medium">
              PREMIUM QUALITY OFFICIAL {product.category.slice(0, -1)}
            </p>
          </div>

          {/* Pricing Section */}
          <div className="space-y-1 border-y border-white/5 py-3 shrink-0">
            <div className="flex items-center gap-3">
              {product.isSoldOut ? (
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  Out of Stock
                </span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-neutral-500">Price:</span>
                  <span className="text-lg font-bold tracking-tighter text-white">
                    {`${product.price.toLocaleString()} - ${product.price2.toLocaleString()} BDT`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1 mt-auto shrink-0">
            <button
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 text-[11px] uppercase tracking-widest rounded-lg transition-colors duration-200"
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
            <button
              className={`flex-1 font-bold py-2.5 text-[11px] uppercase tracking-widest rounded-lg transition-all duration-200 ${
                product.isSoldOut 
                ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 text-white'
              }`}
              disabled={product.isSoldOut}
            >
              {product.isSoldOut ? 'Out of Stock' : 'Buy Now'}
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
