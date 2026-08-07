"use client";

import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-24">
      <Section containerClassName="max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Home</span>
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <FileText size={28} />
            <span className="font-bold text-xs uppercase tracking-[0.3em] italic">Legal & Compliance</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Terms of Service
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
            Last Updated: August 2026
          </p>

          <div className="space-y-6 text-neutral-300 text-sm leading-relaxed border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white uppercase">1. Terms Acceptance</h2>
            <p>
              By accessing the A1 Esports website or ordering official merchandise, you agree to comply with these terms of service and all applicable laws and regulations in Bangladesh and international jurisdictions.
            </p>

            <h2 className="text-xl font-bold text-white uppercase">2. Official Merchandise & Customization</h2>
            <p>
              All customized jersey orders with custom names are final once production begins. Returns are accepted for manufacturing defects or shipping damages within 7 days of delivery.
            </p>

            <h2 className="text-xl font-bold text-white uppercase">3. Intellectual Property</h2>
            <p>
              The A1 Esports logo, team branding, graphics, and video content are the exclusive property of A1 Esports BD. Unauthorized reproduction or commercial use is prohibited.
            </p>

            <h2 className="text-xl font-bold text-white uppercase">4. Code of Conduct</h2>
            <p>
              Community members participating in tryouts or interacting on official A1 Esports channels must adhere to respectful behavior, sportsmanship, and fair play principles.
            </p>
          </div>
        </div>
      </Section>
      <GlowBar />
    </main>
  );
}
