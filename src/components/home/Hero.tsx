"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { GlowBar } from "@/components/ui/GlowBar";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative h-[92vh] min-h-[700px] w-full overflow-hidden bg-[#050505] flex flex-col items-center justify-end pb-12">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      >
        <source src="/videos/bgvideo.mp4" type="video/mp4" />
      </video>
      {/* Background Gradient/Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      {/* Background Large Logo */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] lg:w-[60vw] h-[80vw] lg:h-[60vw] opacity-[0.03] pointer-events-none select-none filter blur-[2px]">
        <Image
          src="/A1esports_logo_white.svg"
          alt="A1 Esports Logo"
          fill
          className="object-contain"
          priority
          sizes="60vw"
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
           
           
           <div 
            className="relative w-full h-full translate-y-[10%] sm:translate-y-[15%]"
            style={{
              maskImage: 'linear-gradient(to top, transparent 5%, black 40%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 40%)'
            }}
           >
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
      <div className="relative z-30 w-full text-center px-4 mb-2 sm:mb-4">
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
      <GlowBar position="bottom" />
    </section>
  );
}
