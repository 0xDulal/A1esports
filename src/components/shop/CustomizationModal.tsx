"use client";

import { useCart } from "@/context/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const displayImage = product.image || (product.images && product.images[0]) || "";
  const displayTitle = product.title || product.name || "Product";

  return (
    <Dialog open={isOpen} onOpenChange={closeCustomModal}>
      <DialogContent className="sm:max-w-4xl bg-[#0a0a0a] border border-neutral-800 p-0 overflow-hidden shadow-2xl rounded-sm font-mono">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Product Preview */}
          <div className="w-full md:w-1/2 bg-neutral-950 relative min-h-[500px] border-r border-neutral-800">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,102,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,102,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none z-10" />
            
            {displayImage && (
              <Image 
                src={displayImage} 
                alt={product.title || product.name || "Product"} 
                fill 
                className="object-cover opacity-90"
              />
            )}
            
            {/* Backside Overlay Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-20">
              <div className="bg-[#0a0a0a]/90 backdrop-blur-md py-6 w-full border-y border-primary/50">
                <span className="text-[22px] font-bold text-white uppercase tracking-[0.3em] select-none break-all px-4 block">
                  {customName || "YOUR NAME"}
                </span>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {selectedSize && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-1 bg-primary/10 border border-primary/20 rounded-sm">
                      {selectedSize}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-1 bg-primary/10 border border-primary/20 rounded-sm">
                    {selectedSleeve === "half" ? "HALF SLEEVE" : "FULL SLEEVE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Input */}
          <div className="flex-1 p-8 flex flex-col justify-center max-h-[90vh] overflow-y-auto bg-[#0a0a0a]">
            <DialogHeader className="mb-8">
              <div className="text-primary font-semibold text-xs tracking-widest uppercase mb-2 bg-primary/10 inline-block px-2 py-0.5 rounded-sm self-start">
                Personalization
              </div>
              <DialogTitle className="text-3xl font-bold text-white uppercase tracking-tight leading-none mt-2">
                {displayTitle}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              {/* Sleeve Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Sleeve Format
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "half", label: "Half Sleeve", price: product.halfSleevePrice || product.price },
                    { id: "full", label: "Full Sleeve", price: product.fullSleevePrice || (product.price ? product.price + 150 : 0) },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedSleeve(type.id as any)}
                      className={`relative p-4 rounded-sm border text-left transition-all ${
                        selectedSleeve === type.id
                          ? "bg-primary/10 border-primary text-white"
                          : "bg-neutral-900/50 border-neutral-800 text-neutral-300 hover:text-white hover:border-primary/50 hover:bg-neutral-900"
                      }`}
                    >
                      <div className="text-sm font-bold uppercase tracking-widest">{type.label}</div>
                      <div className={`text-xs font-semibold mt-1 ${selectedSleeve === type.id ? 'text-primary' : 'text-neutral-500'}`}>
                        {type.price} BDT
                      </div>
                      {selectedSleeve === type.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 size={16} className="text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Chassis Size
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-[11px] font-mono font-bold uppercase tracking-widest border transition-all rounded-none ${
                        selectedSize === size
                          ? "bg-primary border-primary text-black"
                          : "bg-black border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Callsign / Name
                  </label>
                </div>
                <div className="relative">
                  <Input
                    placeholder="ENTER NAME"
                    value={customName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value.toUpperCase())}
                    maxLength={12}
                    className="bg-black border-neutral-800 text-white font-bold uppercase tracking-widest py-6 px-4 rounded-none focus:ring-0 focus-visible:ring-0 focus:border-primary focus-visible:border-primary placeholder:text-neutral-700"
                  />
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold ${customName.length > 0 ? 'text-primary' : 'text-neutral-600'}`}>
                    {customName.length}/12
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <Button 
                  onClick={handleAdd}
                  disabled={!customName.trim() || !selectedSize}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </Button>
                <Button 
                  onClick={closeCustomModal}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
