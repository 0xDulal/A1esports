"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { teams, Team } from "@/lib/teams";
import { Trophy } from "lucide-react";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import { A1Button } from "@/components/ui/A1Button";

export default function TeamsPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
          <Image
            src="/images/regular/a1team.jpg"
            alt="A1 Esports Teams"
            fill
            className="object-cover bg-center opacity-50"
            priority
            sizes="100vw"
          />
        </div>

        <div className="relative z-20 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base"
          >
            Elite Performance
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter"
          >
            Our <span className="text-primary">Teams</span>
          </motion.h1>
        </div>

        <GlowBar position="bottom" />
      </section>

      {/* Teams List */}
      <div className="mx-auto max-w-[1800px] px-4 -mt-20 relative z-30">
        <div className="flex flex-col gap-32">
          {teams
            .filter((team) => team.id !== "pubgm-academy")
            .map((team, index) => (
              <TeamSection key={team.id} team={team} index={index} />
            ))}
        </div>
      </div>

      {/* Join CTA */}
      <Section containerClassName="max-w-4xl" className="py-16 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl p-12 text-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Image
              src="/A1esports_logo_white.svg"
              alt=""
              fill
              className="object-contain scale-150 rotate-12"
            />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white italic">
              Think you have <br /> what it takes?
            </h2>
            <p className="text-neutral-400 text-lg font-medium max-w-xl mx-auto">
              We're always looking for the next generation of talent. Whether you're a pro player, content creator, or staff member.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="#">
                <A1Button variant="primary" size="lg">
                  Apply Now
                </A1Button>
              </Link>
              <Link href="#">
                <A1Button variant="outline" size="lg">
                  Contact Management
                </A1Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Section>
    </main>
  );
}

function TeamSection({ team, index }: { team: Team; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col gap-12"
    >
      {/* Team Header */}
      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="relative h-12 w-12 grayscale brightness-200">
              <Image
                src={team.logo}
                alt={team.game}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <span className="text-primary font-black uppercase tracking-widest text-xl">
              {team.game}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white">
            {team.name}
          </h2>

          {team.achievements && team.achievements.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {team.achievements.slice(0, 2).map((ach, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <Trophy size={14} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {ach.rank} {ach.event}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 w-full aspect-video relative rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-900 shadow-2xl">
          {team.banner && (
            <Image
              src={team.banner}
              alt={team.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          )}
          
          {/* Fallback Background / Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black/80 to-black -z-10" />
          
          {/* Fallback Logo for missing image context */}
          {!team.banner && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
               <div className="relative h-48 w-48">
                <Image
                  src="/A1esports_logo_white.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        </div>
      </div>

      {/* Roster Grid */}
      <div className="flex flex-wrap justify-center gap-8">
        {team.players.map((player, i) => (
          <PlayerCard key={player.ign} player={player} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
