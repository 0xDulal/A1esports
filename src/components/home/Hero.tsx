"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-background flex flex-col items-center justify-end pb-0 sm:pb-12">
      {/* Background Gradient/Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      {/* Background Large Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] opacity-5 pointer-events-none select-none">
        <Image
          src="/A1esports_logo_white.svg"
          alt="A1 Esports Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Hero Image Composition */}
      <div className="relative z-10 flex items-end justify-center w-full max-w-[1600px] h-full mx-auto px-4 mt-16 sm:mt-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-full max-h-[85vh] flex items-end justify-center"
        >
           {/* Glow effect behind the team */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-primary/20 blur-[100px] rounded-full" />
           
           <div className="relative w-full h-full translate-y-[15%] sm:translate-y-[20%]">
            <Image 
                src="/images/HeroImage.png" 
                fill 
                className="object-contain object-bottom drop-shadow-2xl"
                alt="A1 Esports Team"
                priority
                sizes="(max-width: 1300px) 100vw, 90vw"
            />
           </div>
        </motion.div>
      </div>

      {/* Foreground Overlay Gradient for Text Readability */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent z-20" />

      {/* Main Headline Text */}
      <div className="relative z-30 w-full text-center px-4 mb-8 sm:mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.9]"
        >
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">#Be The One,</span>
          <span className="mx-2 sm:mx-6 inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">Be</span>
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/60">A1</span>
        </motion.h2>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 z-40" />
    </section>
  );
}
