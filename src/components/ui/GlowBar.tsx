"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowBarProps {
  position?: "top" | "bottom";
  className?: string;
}

export function GlowBar({ position = "top", className }: GlowBarProps) {
  return (
    <motion.div 
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        boxShadow: [
          "0 0 0px var(--primary)",
          "0 0 20px var(--primary)",
          "0 0 0px var(--primary)"
        ]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={cn(
        "absolute w-full h-[1px] bg-primary/30 z-40",
        position === "top" ? "top-0" : "bottom-0",
        className
      )} 
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </motion.div>
  );
}
