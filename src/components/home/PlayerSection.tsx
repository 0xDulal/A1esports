"use client";

import { motion } from "framer-motion";
import { Facebook } from "lucide-react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const players = [
  {
    ign: "SiNiSTER",
    name: "MD Abdul Jabbar Shakil",
    role: "IGL",
    image: "/images/players/SiNiSTER.png", // Using team photo as placeholder for now
    customImage: true, // Flag to handle placeholder cropping/positioning if needed
  },
  {
    ign: "ROWDY",
    name: "Emon Sheikh",
    role: "FRAGGER",
    image: "/images/players/ROWDY.png",
  },
  {
    ign: "DEATHSTORM",
    name: "Hasan Mahmood",
    role: "SNIPER",
    image: "/images/players/DEATHSTORM.png",
  },
  {
    ign: "CJBOYY",
    name: "Tahmid Aronno",
    role: "RUSHER",
    image: "/images/players/CJBOYY.png",
  },
  {
    ign: "FLASH",
    name: "Tausif Rahman",
    role: "SUPPORT",
    image: "/images/players/FLASH.png",
  },
];

export function PlayerSection() {
  return (
    <section className="w-full bg-black py-24">
      <div className="mx-auto max-w-[1800px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <span className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
            Active Roster
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Meet The <span className="text-primary">Squad</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {players.map((player, i) => (
            <PlayerCard key={player.ign} player={player} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlayerCard({ player, index }: { player: typeof players[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group relative h-[600px] w-full max-w-[300px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[40px] border border-white/10 transition-colors duration-500 hover:border-primary"
    >
      {/* Background Gradient/Texture */}
      <div className="absolute top-2/6 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] opacity-5 pointer-events-none select-none">
        <Image
          src="/A1esports_logo_white.svg"
          alt="A1 Esports Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-radial-gradient from-primary/20 via-transparent to-green-700/40" />

      {/* Top Name (IGN) */}
      <div className="flex justify-center mt-6 z-20 opacity-50 blur-[0.7px] ">
        <h3 className="text-3xl font-bold uppercase tracking-widest text-primary transition-colors  group-hover:text-white/80">
          {player.ign}
        </h3>
      </div>

      {/* Player Image */}
      <div className="absolute inset-0 z-10 flex items-end justify-center">
        <div className="relative h-[80%] w-full transition-all duration-500 group-hover:scale-105">
          {/* Placeholder handling - in real usage, these would be transparent PNGs of players */}
          <Image
            src={player.image}
            alt={player.ign}
            fill
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-32">
        {/* Country & Real Name */}
        <div className="mb-4">
          <h4 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
            {player.name}
          </h4>
        </div>

        {/* Role */}
        <div className="flex items-center justify-between border-t border-white/20 pt-4">
          <div className="flex justify-strat gap-4">
            <FaFacebook size={24}/>
        <FaInstagram size={24}/>
        <FaYoutube size={24}/>
          </div>

          <Image
            src="/A1esports_logo_white.svg"
            alt="A1 Esports Logo"
            width={16}
            height={16}
            className="object-contain opacity-80"
          />
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none mix-blend-overlay" />
    </motion.div>
  );
}
