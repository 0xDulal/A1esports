"use client";

import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
              <Button 
                variant="primary" 
                onClick={() => setIsOpen(false)}
                className="mt-4"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.customName || 'standard'}-${item.size || 'nosize'}-${item.sleeveType || 'nosleeve'}`} className="flex gap-4 group bg-neutral-950 p-2 border border-neutral-900">
                  <div className="relative h-24 w-24 shrink-0 border border-neutral-800 bg-neutral-900">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">
                          {item.title}
                        </h4>
                        <div className="flex flex-col gap-0.5 mt-2">
                          {item.customName && (
                            <span className="text-xs font-mono text-neutral-500 tracking-wide">
                              IGN: <span className="text-white font-black">{item.customName}</span>
                            </span>
                          )}
                          {item.size && (
                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wide">
                              SIZE: <span className="text-white font-black">{item.size}</span>
                            </span>
                          )}
                          {item.sleeveType && (
                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wide">
                              SLEEVE: <span className="text-white font-black">{item.sleeveType === 'full' ? 'FULL' : 'HALF'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.customName, item.size, item.sleeveType)}
                        className="text-neutral-600 hover:text-primary transition-colors shrink-0 mt-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <span className="text-xs font-mono text-neutral-500 uppercase tracking-wide">
                        QTY: <span className="text-white font-black">{item.quantity}</span>
                      </span>
                      <span className="text-sm font-mono font-bold text-white tracking-tight">
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
              <Button asChild variant="primary" size="lg" className="w-full text-xs font-mono font-black tracking-widest uppercase py-6">
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  Proceed to Checkout
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setIsOpen(false)}
                className="w-full text-xs font-mono font-bold tracking-widest uppercase py-6"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
