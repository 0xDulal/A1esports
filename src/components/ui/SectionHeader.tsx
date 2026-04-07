"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React from "react";

interface SectionHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  align = "left",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center mx-auto",
    right: "items-end text-right ml-auto",
  }[align];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("flex flex-col mb-12", alignClass, className)}
    >
      {subtitle && (
        <div className={cn("flex items-center gap-2 text-primary mb-4", subtitleClassName)}>
          {Icon && <Icon className="h-5 w-5" />}
          <span className="text-sm font-bold uppercase tracking-widest">{subtitle}</span>
        </div>
      )}
      <h2 className={cn("text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none", titleClassName)}>
        {title}
      </h2>
    </motion.div>
  );
}
