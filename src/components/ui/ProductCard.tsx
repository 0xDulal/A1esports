"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Product {
  id: number | string;
  title: string;
  price: number;
  price2: number;
  image: string;
  category: string;
  isSoldOut: boolean;
}

interface ProductCardProps {
  product: Product;
  index: number;
  className?: string;
}

export function ProductCard({ product, index, className }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn("group w-full flex", className)}
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
              className={cn(
                "flex-1 font-bold py-2.5 text-[11px] uppercase tracking-widest rounded-lg transition-all duration-200",
                product.isSoldOut 
                ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 text-white'
              )}
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
