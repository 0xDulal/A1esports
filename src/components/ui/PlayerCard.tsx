"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Player } from "@/lib/teams";

interface PlayerCardProps {
  player: Player;
  index: number;
}

export function PlayerCard({ player, index }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative h-[450px] w-full max-w-[300px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-900/50 transition-all duration-500 hover:border-primary/50 mx-auto"
    >
      {/* Background Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] opacity-5 pointer-events-none">
        <Image
          src="/A1esports_logo_white.svg"
          alt="A1 Logo"
          fill
          className="object-contain"
          sizes="300px"
        />
      </div>

      {/* Player Image */}
      <div className="absolute inset-0 z-10 flex items-end justify-center">
        <div className="relative h-[85%] w-full transition-transform duration-500 group-hover:scale-110">
          <Image
            src={player.image || "/images/players/placeholder.png"}
            alt={player.ign}
            fill
            className="object-cover object-top"
            sizes="300px"
          />
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/40 to-transparent">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            {player.role}
          </span>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
            {player.ign}
          </h3>
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
            {player.name}
          </p>
        </motion.div>

        {/* Socials on Hover */}
        <div className="mt-4 flex gap-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {player.socials?.facebook && (
            <Link href={player.socials.facebook} target="_blank" className="text-neutral-400 hover:text-white transition-colors">
              <FaFacebook size={18} />
            </Link>
          )}
          {player.socials?.instagram && (
            <Link href={player.socials.instagram} target="_blank" className="text-neutral-400 hover:text-white transition-colors">
              <FaInstagram size={18} />
            </Link>
          )}
          {player.socials?.youtube && (
            <Link href={player.socials.youtube} target="_blank" className="text-neutral-400 hover:text-white transition-colors">
              <FaYoutube size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}
