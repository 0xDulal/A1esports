"use client";

import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { A1Button } from "@/components/ui/A1Button";
import Link from "next/link";

export function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-black border-l border-white/5 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <ShoppingBag className="text-primary" size={24} />
              Your Cart
              {itemCount > 0 && (
                <span className="text-sm font-bold text-neutral-500 lowercase tracking-normal">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-neutral-600">
                <ShoppingBag size={40} />
              </div>
              <div>
                <p className="text-white font-bold text-lg uppercase tracking-tight">Your cart is empty</p>
                <p className="text-neutral-500 text-sm">Looks like you haven't added anything yet.</p>
              </div>
              <A1Button 
                variant="primary" 
                onClick={() => setIsOpen(false)}
                className="mt-4"
              >
                Start Shopping
              </A1Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.customName || 'standard'}`} className="flex gap-4 group">
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">
                            {item.title}
                          </h4>
                          {item.customName && (
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[9px] font-black uppercase tracking-widest text-primary italic">
                                NAME: {item.customName}
                              </span>
                              {item.size && (
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-black uppercase tracking-widest text-neutral-400">
                                  SIZE: {item.size}
                                </span>
                              )}
                              {item.sleeveType && (
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-black uppercase tracking-widest text-neutral-400">
                                  {item.sleeveType === 'full' ? 'FULL SLEEVE' : 'HALF SLEEVE'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => removeItem(item.id, item.customName, item.size, item.sleeveType)}
                          className="text-neutral-600 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">
                        {item.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/10">
                        <button 
                          onClick={() => updateQuantity(item.id, -1, item.customName, item.size, item.sleeveType)}
                          className="h-6 w-6 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1, item.customName, item.size, item.sleeveType)}
                          className="h-6 w-6 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {((item.sleeveType === 'full' && item.fullSleevePrice) 
                          ? item.fullSleevePrice 
                          : (item.sleeveType === 'half' && item.halfSleevePrice) 
                            ? item.halfSleevePrice 
                            : item.price
                        ) * item.quantity} BDT
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 space-y-4 bg-neutral-950/50 backdrop-blur-xl">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-neutral-400 font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-white">{total} BDT</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-400 font-bold uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
              <div className="pt-4 flex justify-between items-end border-t border-white/5">
                <span className="text-lg font-black text-white uppercase tracking-tighter">Total</span>
                <span className="text-2xl font-black text-primary tracking-tighter">{total} BDT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <A1Button variant="primary" className="py-4 text-sm">
                Proceed to Checkout
              </A1Button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
