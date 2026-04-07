"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/data/shop";

export interface CartItem extends Product {
  quantity: number;
  customName?: string;
  size?: string;
  sleeveType?: "half" | "full";
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, customName?: string, size?: string, sleeveType?: "half" | "full") => void;
  removeItem: (id: string, customName?: string, size?: string, sleeveType?: "half" | "full") => void;
  updateQuantity: (id: string, delta: number, customName?: string, size?: string, sleeveType?: "half" | "full") => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // Customization modal state
  customModalConfig: { product: Product | null; isOpen: boolean };
  openCustomModal: (product: Product) => void;
  closeCustomModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [customModalConfig, setCustomModalConfig] = useState<{ product: Product | null; isOpen: boolean }>({
    product: null,
    isOpen: false,
  });

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("a1esports_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("a1esports_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (product: Product, customName?: string, size?: string, sleeveType: "half" | "full" = "half") => {
    setItems((prev) => {
      // Find item with same ID AND same custom name AND same size AND same sleeve type
      const existing = prev.find((item) => 
        item.id === product.id && 
        item.customName === customName && 
        item.size === size &&
        item.sleeveType === sleeveType
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.customName === customName && item.size === size && item.sleeveType === sleeveType
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, customName, size, sleeveType }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string, customName?: string, size?: string, sleeveType?: "half" | "full") => {
    setItems((prev) => prev.filter((item) => 
      !(item.id === id && item.customName === customName && item.size === size && item.sleeveType === sleeveType)
    ));
  };

  const updateQuantity = (id: string, delta: number, customName?: string, size?: string, sleeveType?: "half" | "full") => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.customName === customName && item.size === size && item.sleeveType === sleeveType
            ? { ...item, quantity: Math.max(0, item.quantity + delta) } 
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCustomModal = (product: Product) => {
    setCustomModalConfig({ product, isOpen: true });
  };

  const closeCustomModal = () => {
    setCustomModalConfig({ product: null, isOpen: false });
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => {
    let itemPrice = item.price;
    if (item.sleeveType === "full" && item.fullSleevePrice) {
      itemPrice = item.fullSleevePrice;
    } else if (item.sleeveType === "half" && item.halfSleevePrice) {
      itemPrice = item.halfSleevePrice;
    }
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isOpen,
        setIsOpen,
        customModalConfig,
        openCustomModal,
        closeCustomModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
