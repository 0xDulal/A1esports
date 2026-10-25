"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Package } from "lucide-react";
import { Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

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
    <section className="bg-[#0a0a0a] text-neutral-400 py-24 px-4 md:px-8 font-mono border-t border-neutral-800">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-widest text-white uppercase">Official Merchandise</h2>
            <div className="hidden md:block w-32 h-px bg-neutral-800 ml-4" />
          </div>
          
          <Button asChild variant="outline">
            <Link href="/shop">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProducts.map((product, index) => (
            <HardwareProductCard key={product.id || product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HardwareProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, toggleCart, openCustomModal } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.canCustomise) {
      openCustomModal(product);
    } else {
      addItem(product, 1);
      toggleCart();
    }
  };

  const displayImage = product.image || (product.images && product.images[0]) || "";
  const displayTitle = product.title || product.name || "A1 Official Item";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative border border-neutral-800 bg-neutral-900/40 overflow-hidden hover:border-primary/50 transition-colors flex flex-col h-full rounded-sm"
    >
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square bg-neutral-950 overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,102,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,102,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity" />
        
        {displayImage ? (
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-neutral-800" />
          </div>
        )}
        
        {product.isNew && (
          <div className="absolute top-0 left-0 bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-widest z-10">
            NEW
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {displayTitle}
            </h3>
          </Link>
          <div className="text-lg font-bold text-white shrink-0 ml-4 pt-1">
            {product.halfSleevePrice && product.fullSleevePrice ? (
              <span>{product.halfSleevePrice.toLocaleString()} - {product.fullSleevePrice.toLocaleString()} BDT</span>
            ) : (
              <span>{product.price?.toLocaleString()} BDT</span>
            )}
          </div>
        </div>
        
        <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mt-1 mb-6">
          {product.category || "Merch"}
        </div>
        
        <Button 
          onClick={handleAddToCart}
          variant="primary"
          size="md"
          className="w-full mt-auto"
        >
          {product.canCustomise ? "Personalize" : "Add to Cart"}
        </Button>
      </div>
    </motion.div>
  );
}
