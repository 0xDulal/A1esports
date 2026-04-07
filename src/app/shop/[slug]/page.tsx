"use client";

import { useParams, useRouter } from "next/navigation";
import { shopProducts } from "@/lib/data/shop";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { A1Button } from "@/components/ui/A1Button";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Zap, Star } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCustomModal, setIsOpen } = useCart();
  
  const product = shopProducts.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-primary hover:underline font-bold uppercase tracking-widest text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.canCustomise) {
      openCustomModal(product);
    } else {
      addItem(product);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-24">
      <Section>
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Store</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          {/* Left: Media */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            
            {/* Thumbnail Grid (Mockup for now) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-neutral-900 border border-white/5 overflow-hidden relative opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                  <Image src={product.image} alt="thumbnail" fill className="object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col h-full"
          >
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.4em] uppercase italic">
                {product.category} <span className="text-white/20">•</span> OFFICIAL MERCH
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
                {product.title.split('|')[0]}
                {product.title.includes('|') && (
                  <span className="text-primary italic block md:inline">
                    {product.title.split('|')[1]}
                  </span>
                )}
              </h1>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex text-primary">
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  (142 Reviews)
                </span>
              </div>
            </div>

            <div className="bg-neutral-900/50 rounded-2xl p-8 border border-white/5 space-y-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Retail Price</p>
                  <p className="text-4xl font-black text-white tracking-tighter">
                    {product.price.toLocaleString()} <span className="text-lg text-primary italic">BDT</span>
                  </p>
                </div>
                {product.isSoldOut ? (
                  <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest">
                    Sold Out
                  </div>
                ) : (
                  <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest animate-pulse">
                    In Stock
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-white/5">
                    Premium Polyester
                  </span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-white/5">
                    Moisture Wicking
                  </span>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <A1Button 
                  variant="primary" 
                  className="py-5 text-sm"
                  onClick={handleAddToCart}
                  disabled={product.isSoldOut}
                >
                  {product.isSoldOut ? "Out of Stock" : product.canCustomise ? "Personalize Kit" : "Add to Cart"}
                </A1Button>
                <A1Button 
                  variant="secondary" 
                  className="py-5 text-sm"
                  disabled={product.isSoldOut}
                  onClick={() => {
                    if (product.canCustomise) {
                      openCustomModal(product);
                    } else {
                      addItem(product);
                      // In a real app, this would go to /checkout
                      setIsOpen(true); 
                    }
                  }}
                >
                  Buy Now
                </A1Button>
              </div>

              {product.canCustomise && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-white">Customization Available</p>
                    <p className="text-[10px] text-neutral-500 font-medium">Add your own name to the backside for No Extra Cost!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck size={20} className="text-neutral-500" />
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">Fast<br/>Delivery</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck size={20} className="text-neutral-500" />
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">Authentic<br/>Guarantee</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShoppingBag size={20} className="text-neutral-500" />
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">Easy<br/>Returns</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
      <GlowBar />
    </main>
  );
}
