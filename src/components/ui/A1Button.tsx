"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface A1ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  className?: string;
}

export function A1Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: A1ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none group";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(255,0,102,0.3)] hover:shadow-[0_0_30px_rgba(255,0,102,0.5)]",
    secondary: "bg-white text-black hover:bg-neutral-100",
    outline: "border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm",
    ghost: "text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "h-10 px-6 text-xs",
    md: "h-12 px-8 text-sm",
    lg: "h-14 px-10 text-lg",
    xl: "h-16 px-12 text-xl",
  };

  const clipPath = variant !== "ghost" ? "[clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]" : "";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], clipPath, className)}
      {...props}
    >
      {children}
      
      {/* Glow Effect for Primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.button>
  );
}
