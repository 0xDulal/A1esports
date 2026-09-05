"use client";

import { useParams, useRouter } from "next/navigation";
import { shopProducts as fallbackProducts, Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Zap,
  Sparkles,
  Check,
  Ruler,
  Plus,
  Minus,
  Layers,
  HelpCircle,
  Package,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, openCustomModal, setIsOpen } = useCart();

  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedSleeve, setSelectedSleeve] = useState<"half" | "full" | "">("half");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customName, setCustomName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "sizeGuide">("description");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProductsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
      setLoading(false);
    });
  }, []);

  // Find product by slug or id
  const product = products.find(
    (p) => p.slug === params.slug || String(p.id) === String(params.slug)
  );

  const productImages = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list;
  }, [product]);

  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(productImages[0]);
    }
  }, [productImages]);

  // Related products from the same category or other store items
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.slug !== product.slug)
      .slice(0, 4);
  }, [products, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin rounded-none" />
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 animate-pulse">
            LOADING PRODUCT DETAILS...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white font-mono px-4">
        <div className="border border-neutral-800 bg-neutral-900/50 p-12 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 border border-neutral-800 bg-black flex items-center justify-center mx-auto text-neutral-600">
            <Package size={28} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-2">
              ERROR: PRODUCT NOT FOUND
            </span>
            <h1 className="text-2xl font-bold font-michroma uppercase tracking-wider text-white">
              ITEM UNAVAILABLE
            </h1>
            <p className="text-xs text-neutral-400 mt-2 font-mono">
              The requested product could not be found or has been removed from the store.
            </p>
          </div>
          <Button asChild variant="primary" size="md" className="w-full">
            <Link href="/shop">
              <ArrowLeft size={14} className="mr-2" /> RETURN TO SHOP
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasVariants = Boolean(product.halfSleevePrice && product.fullSleevePrice);

  const currentUnitPrice = hasVariants && selectedSleeve
    ? selectedSleeve === "full"
      ? product.fullSleevePrice!
      : product.halfSleevePrice!
    : product.price;

  const currentTotalPrice = currentUnitPrice * quantity;

  // Actions
  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    if (product.canCustomise && !customName.trim()) {
      toast.error("Please enter your IGN Name");
      return;
    }
    if (hasVariants && !selectedSleeve) {
      toast.error("Please select a sleeve length");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem(
        product,
        product.canCustomise && customName ? customName.trim() : undefined,
        selectedSize,
        selectedSleeve as "half" | "full" | undefined
      );
    }
    setIsOpen(true);
  };

  const handleBuyNow = () => {
    if (product.isSoldOut) return;
    if (product.canCustomise && !customName.trim()) {
      toast.error("Please enter your IGN Name");
      return;
    }
    if (hasVariants && !selectedSleeve) {
      toast.error("Please select a sleeve length");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem(
        product,
        product.canCustomise && customName ? customName.trim() : undefined,
        selectedSize,
        selectedSleeve as "half" | "full" | undefined
      );
    }
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-8 sm:pt-12 pb-32 font-mono selection:bg-primary selection:text-black">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,102,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,102,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Telemetry Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="xs">
              <Link href="/shop" className="gap-2">
                <ArrowLeft size={12} />
                <span>STOREFRONT</span>
              </Link>
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-500 uppercase tracking-widest font-mono">
              <span className="text-neutral-600">/</span>
              <span>{product.category || "MERCHANDISE"}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-300 truncate max-w-[200px]">
                {product.title}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column: Media Asset Frame (5 cols on lg, 6 cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4">
            {/* Primary Display Frame */}
            <div className="relative aspect-square bg-[#0a0a0a] border border-neutral-800 overflow-hidden group">
              {/* Corner Hardware Crosshairs */}
              <div className="absolute top-2 left-2 text-[11px] text-primary/70 font-mono z-20 select-none leading-none">
                +
              </div>
              <div className="absolute top-2 right-2 text-[11px] text-primary/70 font-mono z-20 select-none leading-none">
                +
              </div>
              <div className="absolute bottom-2 left-2 text-[11px] text-primary/70 font-mono z-20 select-none leading-none">
                +
              </div>
              <div className="absolute bottom-2 right-2 text-[11px] text-primary/70 font-mono z-20 select-none leading-none">
                +
              </div>

              {/* Status Badges Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.isSoldOut && (
                  <div className="px-3 py-1 bg-red-600/90 text-white border border-red-500 text-[10px] font-mono font-bold uppercase tracking-widest shadow-md">
                    OUT OF STOCK
                  </div>
                )}
              </div>

              {/* Cyber Grid Texture Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,102,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,102,0.06)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none group-hover:opacity-40 transition-opacity z-10" />

              {/* Image Asset */}
              <Image
                src={selectedImage || product.image || "/A1esports_logo_white.svg"}
                alt={product.title}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Bottom Authentic Watermark */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-[9px] font-mono text-neutral-400 z-20">
                <span className="tracking-widest uppercase">
                  A1 ESPORTS // OFFICIAL TEAMWEAR
                </span>
                <span className="text-primary font-bold">2026 EDITION</span>
              </div>
            </div>

            {/* Thumbnail Navigation Array */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {productImages.map((img, idx) => {
                  const isActive = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square bg-[#0a0a0a] border transition-all cursor-pointer overflow-hidden p-0 group ${isActive
                        ? "border-primary ring-1 ring-primary shadow-[0_0_12px_rgba(255,0,102,0.35)]"
                        : "border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} asset ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      <span className="absolute bottom-0 right-0 bg-black/80 px-1 py-0.5 text-[8px] font-mono text-neutral-400">
                        [{String(idx + 1).padStart(2, "0")}]
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Value Guarantees (3 Hardware Cards) */}
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="p-3 border border-neutral-800 bg-neutral-900/30 flex flex-col items-center text-center space-y-1">
                <Truck size={18} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  Fast Dispatch
                </span>
                <span className="text-[9px] text-neutral-500 leading-tight">
                  Nationwide in 3-5 days
                </span>
              </div>
              <div className="p-3 border border-neutral-800 bg-neutral-900/30 flex flex-col items-center text-center space-y-1">
                <ShieldCheck size={18} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  100% Authentic
                </span>
                <span className="text-[9px] text-neutral-500 leading-tight">
                  Official team licensed
                </span>
              </div>
              <div className="p-3 border border-neutral-800 bg-neutral-900/30 flex flex-col items-center text-center space-y-1">
                <Zap size={18} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  Secure Checkout
                </span>
                <span className="text-[9px] text-neutral-500 leading-tight">
                  bKash / Nagad / COD
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry & Purchasing Terminal (6 cols) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
            {/* Header / Category / Title */}
            <div className="space-y-3 mb-6">


              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-michroma uppercase tracking-tight text-white leading-none">
                {product.title}
              </h1>
            </div>

            {/* Price & Configuration Terminal Box */}
            <div className="border border-neutral-800 bg-neutral-900/30 p-6 space-y-6 mb-6">
              {/* Price Telemetry Row */}
              <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-neutral-800/80">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                    PRICE
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-michroma font-bold text-white tracking-tight">
                      {currentUnitPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 font-bold uppercase">
                      BDT
                    </span>
                  </div>
                </div>

                {quantity > 1 && (
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                      SUBTOTAL ({quantity} UNITS)
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-primary">
                      {currentTotalPrice.toLocaleString()} BDT
                    </span>
                  </div>
                )}
              </div>

              {/* IGN Name Input */}
              {product.canCustomise && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                    IGN Name
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ENTER GAMERTAG"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      maxLength={12}
                      className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold tracking-widest py-3 px-4 focus:ring-0 focus:outline-none focus:border-primary placeholder:text-neutral-700 transition-colors"
                    />
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold ${customName.length > 0 ? 'text-primary' : 'text-neutral-600'}`}>
                      {customName.length}/12
                    </div>
                  </div>
                </div>
              )}

              {/* Sleeve Variant Selector (if applicable) */}
              {hasVariants && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                    <span className="text-neutral-400">Select Sleeve Length:</span>
                    <span className="text-primary">
                      {selectedSleeve === "full" ? "FULL SLEEVE" : "HALF SLEEVE"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedSleeve("half")}
                      className={`p-3 border text-left font-mono transition-all ${selectedSleeve === "half"
                        ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(255,0,102,0.25)] text-white"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider">Half Sleeve</span>
                        {selectedSleeve === "half" && (
                          <span className="w-2 h-2 bg-primary" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-neutral-300">
                        {product.halfSleevePrice!.toLocaleString()} BDT
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSleeve("full")}
                      className={`p-3 border text-left font-mono transition-all ${selectedSleeve === "full"
                        ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(255,0,102,0.25)] text-white"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider">Full Sleeve</span>
                        {selectedSleeve === "full" && (
                          <span className="w-2 h-2 bg-primary" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-neutral-300">
                        {product.fullSleevePrice!.toLocaleString()} BDT
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Size Selector Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="text-neutral-400">Select Size:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("sizeGuide");
                      document.getElementById("product-details-tabs")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-primary hover:underline inline-flex items-center gap-1.5 text-[11px]"
                  >
                    <Ruler size={12} /> SIZE CHART
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {SIZES.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-xs font-mono font-bold uppercase transition-all border ${isSelected
                          ? "border-primary bg-primary text-black font-black shadow-[0_0_12px_rgba(255,0,102,0.35)]"
                          : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600 hover:text-white"
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-neutral-800 bg-neutral-950">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || product.isSoldOut}
                      className="p-2.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={product.isSoldOut || product.canCustomise}
                      className="p-2.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                    {product.isSoldOut ? "OUT OF STOCK" : product.canCustomise ? "MAX 1 AT A TIME" : "MAX 10 PER ORDER"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    disabled={product.isSoldOut}
                    onClick={handleAddToCart}
                    className="w-full text-xs font-mono font-bold tracking-widest uppercase py-4 gap-2"
                  >
                    <ShoppingCart size={14} />
                    <span>{product.isSoldOut ? "Sold Out" : "Add to Cart"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={product.isSoldOut}
                    onClick={handleBuyNow}
                    className="w-full text-xs font-mono font-bold tracking-widest uppercase py-4"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Jersey Specifications Table */}
            {product.specs && product.specs.length > 0 && (
              <div className="border border-neutral-800 bg-neutral-900/20 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                  <Layers size={14} className="text-primary" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white m-0">
                    Product Specifications
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                        {spec.name}
                      </span>
                      <span className="text-neutral-200">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs (Description / Size Guide) */}
        <div id="product-details-tabs" className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex items-center gap-6 border-b border-neutral-800 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-4 text-xs font-mono font-bold uppercase tracking-widest transition-colors relative ${activeTab === "description" ? "text-primary" : "text-neutral-500 hover:text-neutral-300"
                }`}
            >
              Description
              {activeTab === "description" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sizeGuide")}
              className={`pb-4 text-xs font-mono font-bold uppercase tracking-widest transition-colors relative ${activeTab === "sizeGuide" ? "text-primary" : "text-neutral-500 hover:text-neutral-300"
                }`}
            >
              Size Guide
              {activeTab === "sizeGuide" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
          </div>

          <div className="min-h-[200px]">
            {activeTab === "description" && (
              <div className="text-neutral-400 font-mono text-sm leading-relaxed max-w-4xl whitespace-pre-line">
                {product.description || "No description available for this product."}
              </div>
            )}

            {activeTab === "sizeGuide" && (
              <div className="max-w-4xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500">
                        <th className="py-3 px-4 font-bold uppercase">Size</th>
                        <th className="py-3 px-4 font-bold uppercase">Chest (in)</th>
                        <th className="py-3 px-4 font-bold uppercase">Length (in)</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-300">
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">XS</td>
                        <td className="py-3 px-4">34 - 36</td>
                        <td className="py-3 px-4">27</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">S</td>
                        <td className="py-3 px-4">36 - 38</td>
                        <td className="py-3 px-4">28</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">M</td>
                        <td className="py-3 px-4">38 - 40</td>
                        <td className="py-3 px-4">29</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">L</td>
                        <td className="py-3 px-4">40 - 42</td>
                        <td className="py-3 px-4">30</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">XL</td>
                        <td className="py-3 px-4">42 - 44</td>
                        <td className="py-3 px-4">31</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">2XL</td>
                        <td className="py-3 px-4">44 - 46</td>
                        <td className="py-3 px-4">32</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">3XL</td>
                        <td className="py-3 px-4">46 - 48</td>
                        <td className="py-3 px-4">33</td>
                      </tr>
                      <tr className="hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">4XL</td>
                        <td className="py-3 px-4">48 - 50</td>
                        <td className="py-3 px-4">34</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-neutral-500 mt-4 uppercase tracking-widest">
                  * Measurements are approximate and may vary slightly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Official Gear ("YOU MAY ALSO LIKE") */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-michroma font-bold uppercase tracking-wider text-white">
                  Related Official Merchandise
                </h2>
              </div>

              <Button asChild variant="outline" size="sm">
                <Link href="/shop">VIEW ALL STORE GEAR</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p, idx) => (
                <div
                  key={p.id || p.slug}
                  className="group relative border border-neutral-800 bg-neutral-900/40 hover:border-primary/50 transition-colors flex flex-col h-full rounded-none"
                >
                  <Link
                    href={`/shop/${p.slug}`}
                    className="block relative aspect-square bg-neutral-950 overflow-hidden border-b border-neutral-800"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,102,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,102,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity" />

                    <Image
                      src={p.image || "/A1esports_logo_white.svg"}
                      alt={p.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />

                    {p.isSoldOut && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest z-10">
                        OUT OF STOCK
                      </div>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest mb-1">
                        {p.category}
                      </div>
                      <Link href={`/shop/${p.slug}`}>
                        <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {p.title}
                        </h3>
                      </Link>
                      <div className="mt-2 text-sm font-mono font-bold text-white">
                        {p.halfSleevePrice && p.fullSleevePrice ? (
                          <span>
                            {p.halfSleevePrice.toLocaleString()} - {p.fullSleevePrice.toLocaleString()} BDT
                          </span>
                        ) : (
                          <span>{p.price?.toLocaleString()} BDT</span>
                        )}
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/shop/${p.slug}`}>VIEW PRODUCT</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
