"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

export interface A1ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost" | "secondary" | "destructive" | "default";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "default";
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
  const baseStyles =
    "font-mono uppercase tracking-widest inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 outline-none select-none cursor-pointer rounded-none";

  const variants = {
    default:
      "border border-neutral-700 hover:border-primary text-white bg-neutral-900/50 hover:bg-neutral-900/90 hover:shadow-[0_0_15px_rgba(255,0,102,0.25)]",
    outline:
      "border border-neutral-700 hover:border-primary text-white bg-neutral-900/50 hover:bg-neutral-900/90 hover:shadow-[0_0_15px_rgba(255,0,102,0.25)]",
    primary:
      "border border-primary bg-primary text-black font-black hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(255,0,102,0.45)]",
    secondary:
      "border border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:text-white hover:border-neutral-600 hover:bg-neutral-800/60",
    destructive:
      "border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    ghost:
      "border border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900/50",
  };

  const sizes = {
    xs: "h-7 px-2.5 py-1 text-[10px]",
    sm: "h-8 px-3 py-1.5 text-xs",
    md: "h-9 px-4 py-2 text-xs",
    default: "h-9 px-4 py-2 text-xs",
    lg: "h-11 px-6 py-2.5 text-sm",
    xl: "h-13 px-8 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

