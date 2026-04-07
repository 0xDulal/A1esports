"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface SectionProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  withGlow?: boolean;
  glowColor?: string;
}

export function Section({
  children,
  className,
  containerClassName,
  withGlow = false,
  glowColor = "bg-primary",
  ...props
}: SectionProps) {
  return (
    <motion.section
      className={cn("relative w-full bg-black py-0 overflow-hidden", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      {...props}
    >
      {withGlow && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
          <div className={cn("absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px]", glowColor)} />
          <div className={cn("absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px]", glowColor)} />
        </div>
      )}
      <div className={cn("relative z-10 mx-auto max-w-7xl px-4", containerClassName)}>
        {children}
      </div>
    </motion.section>
  );
}
