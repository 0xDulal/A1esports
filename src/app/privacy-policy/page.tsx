"use client";

import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={28} />
            <span className="font-bold text-xs uppercase tracking-[0.3em] italic">Legal & Compliance</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
            Last Updated: August 2026
          </p>

          <div className="space-y-6 text-neutral-300 text-sm leading-relaxed border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white uppercase">1. Information We Collect</h2>
            <p>
              When you visit the official A1 Esports website, purchase merchandise, or apply for roster tryouts, we collect personal information necessary to provide our services. This includes your name, email address, phone number, shipping address, and payment choice for store orders.
            </p>

            <h2 className="text-xl font-bold text-white uppercase">2. How We Use Your Information</h2>
            <p>
              Your information is strictly used for order processing, delivery fulfillment, customer support, and talent scouting communication. We do not sell or lease your personal data to third parties.
            </p>

            <h2 className="text-xl font-bold text-white uppercase">3. Cookies & Local Storage</h2>
            <p>
              We use standard browser local storage and cookies to maintain your shopping cart state and remember your theme preferences. No invasive tracking cookies are used.
            </p>

            <h2 className="text-xl font-bold text-white uppercase">4. Data Protection</h2>
            <p>
              We implement industry-standard encryption and security protocols via Supabase to safeguard your data against unauthorized access.
            </p>

            <h2 className="text-xl font-bold text-white uppercase">5. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at <span className="text-primary font-bold">privacy@a1esportsbd.com</span>.
            </p>
          </div>
        </div>
      </Section>
      <GlowBar />
    </main>
  );
}
