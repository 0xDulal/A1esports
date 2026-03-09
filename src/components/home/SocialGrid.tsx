"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Instagram, Youtube, Facebook, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const socials = [
  {
    name: "Discord",
    icon: Gamepad2,
    followers: "15.2K",
    label: "Members",
    href: "https://discord.gg/a1esports",
  },
  {
    name: "YouTube",
    icon: Youtube,
    followers: "692K",
    label: "Subscribers",
    href: "https://youtube.com/@a1esportsbd",
  },
  {
    name: "Facebook",
    icon: Facebook,
    followers: "1.2M",
    label: "Followers",
    href: "https://facebook.com/a1esportsbd",
  },
  {
    name: "Instagram",
    icon: Instagram,
    followers: "512K",
    label: "Followers",
    href: "https://instagram.com/a1esportsbd",
  },
];

export function SocialGrid() {
  return (
    <section className="w-full bg-black text-white">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid lg:grid-cols-2">
          {/* Left Content - "Join The Society" style */}
          <div className="relative flex min-h-[500px] flex-col justify-center overflow-hidden bg-black p-12 lg:p-24 border-r border-white/10">
            {/* Logo Watermark/Top Right - REMOVED */}
            {/* <div className="absolute top-12 right-12 opacity-100">
               <div className="flex items-center gap-2">
                 <div className="h-8 w-8 bg-primary/20" /> 
                 <span className="font-bold tracking-widest uppercase text-lg">A1 Family</span>
               </div>
            </div> */}

            <div className="relative z-10 flex flex-col items-start gap-6">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.9] sm:text-7xl lg:text-8xl">
                Join The <br />
                <span className="text-white">A1 Family</span>
              </h2>
              <p className="max-w-md text-sm font-bold tracking-widest uppercase text-neutral-400">
                Exclusive content, merch, and more for fans!
              </p>
              
              <Link href="/community">
                <Button className="h-14 px-10 text-lg font-bold tracking-widest uppercase bg-primary hover:bg-primary/90 text-white rounded-none [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]">
                  See More
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Background Graphic Effect (simulating the box) */}
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-20 pointer-events-none">
              <div className="w-[500px] h-[500px] bg-gradient-to-br from-primary via-transparent to-transparent rounded-full blur-[100px]" />
            </div>
            
             {/* Tech lines */}
            <div className="absolute bottom-0 left-0 w-24 h-1 bg-primary" />
          </div>

          {/* Right Grid - 2x2 Social Stats */}
          <div className="grid grid-cols-2">
            {socials.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex aspect-square flex-col justify-between border-b border-r border-white/10 bg-black p-8 sm:p-12 transition-colors hover:bg-neutral-900/50"
              >
                {/* Top Icon */}
                <div className="flex justify-between items-start">
                  <social.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                {/* Bottom Stats */}
                <div>
                  <div className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                    {social.followers}
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300">
                    {social.label}
                  </div>
                </div>

                {/* Hover Line */}
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
