"use client";

import { useCart } from "@/context/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { A1Button } from "@/components/ui/A1Button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle2 } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;
const SLEEVE_TYPES = [
  { id: "half", label: "Half Sleeve", price: 0 },
  { id: "full", label: "Full Sleeve", price: 150 },
] as const;

export function CustomizationModal() {
  const { customModalConfig, closeCustomModal, addItem } = useCart();
  const { product, isOpen } = customModalConfig;
  const [customName, setCustomName] = useState("");
  const [selectedSize, setSelectedSize] = useState<typeof SIZES[number] | null>(null);
  const [selectedSleeve, setSelectedSleeve] = useState<"half" | "full">("half");

  if (!product) return null;

  const handleAdd = () => {
    if (customName.trim() && selectedSize) {
      addItem(product, customName.trim().toUpperCase(), selectedSize, selectedSleeve);
      setCustomName("");
      setSelectedSize(null);
      setSelectedSleeve("half");
      closeCustomModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeCustomModal}>
      <DialogContent className="sm:max-w-2xl bg-black border border-white/10 p-0 overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Product Preview */}
          <div className="w-full md:w-5/12 bg-neutral-900 relative min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 z-10" />
            <Image 
              src={product.image} 
              alt={product.title} 
              fill 
              className="object-cover"
            />
            
            {/* Backside Overlay Mockup */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-20">
              <div className="bg-black/40 backdrop-blur-md py-6 w-full border-y border-white/5">
                <span className="text-[22px] font-black text-white uppercase tracking-[0.5em] select-none break-all px-4 block drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  {customName || "YOUR NAME"}
                </span>
                <div className="flex items-center justify-center gap-3 mt-3">
                  {selectedSize && (
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-2 py-0.5 bg-primary/10 rounded">
                      SIZE: {selectedSize}
                    </span>
                  )}
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-2 py-0.5 bg-primary/10 rounded">
                    {selectedSleeve === "half" ? "HALF SLEEVE" : "FULL SLEEVE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Input */}
          <div className="flex-1 p-8 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-6">
              <div className="text-primary font-bold text-[10px] tracking-[0.3em] uppercase mb-2 italic">
                Personalize Item
              </div>
              <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                Customize <span className="text-primary italic">Your</span> GEAR<span className="text-primary">.</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Sleeve Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  Select Sleeve Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "half", label: "Half Sleeve", price: product.halfSleevePrice || product.price },
                    { id: "full", label: "Full Sleeve", price: product.fullSleevePrice || (product.price + 150) },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedSleeve(type.id as any)}
                      className={`relative p-4 rounded-xl border text-left transition-all group ${
                        selectedSleeve === type.id
                          ? "bg-primary/10 border-primary text-white"
                          : "bg-white/5 border-white/10 text-neutral-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-widest">{type.label}</div>
                      <div className={`text-[9px] font-bold mt-1 ${selectedSleeve === type.id ? 'text-primary' : 'text-neutral-600'}`}>
                        {type.price} BDT
                      </div>
                      {selectedSleeve === type.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 size={12} className="text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  Select Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                        selectedSize === size
                          ? "bg-primary border-primary text-white"
                          : "bg-white/5 border-white/10 text-neutral-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  Backside Name
                </label>
                <div className="relative">
                  <Input
                    placeholder="e.g. SHAKIL"
                    value={customName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value.toUpperCase())}
                    maxLength={12}
                    className="bg-white/5 border-white/10 text-white font-black uppercase tracking-widest py-6 px-4 focus:ring-primary focus:border-primary placeholder:text-neutral-700"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-600">
                    {customName.length}/12
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <A1Button 
                  variant="primary" 
                  className="w-full py-4 text-xs"
                  onClick={handleAdd}
                  disabled={!customName.trim() || !selectedSize}
                >
                  Confirm & Add to Cart
                </A1Button>
                <button 
                  onClick={closeCustomModal}
                  className="w-full text-neutral-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
