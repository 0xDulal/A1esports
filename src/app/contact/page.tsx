"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { GlowBar } from "@/components/ui/GlowBar";
import { A1Button } from "@/components/ui/A1Button";
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare, Globe } from "lucide-react";
import { FaDiscord, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Business / Sponsorship",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "Business / Sponsorship", message: "" });
  };

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Hero Section */}
      <section className="relative h-[35vh] min-h-[250px] w-full overflow-hidden flex items-center justify-center">
        <div className="relative z-20 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm italic"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter"
          >
            Contact<span className="text-primary italic">.</span>
          </motion.h1>
        </div>
        <GlowBar position="bottom" />
      </section>

      <Section containerClassName="max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          {/* Left Side Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase text-xs tracking-[0.3em] italic">Reach Out</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                Let's Build Something Extraordinary Together
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Have a question about partnerships, merchandise orders, press inquiries, or roster tryouts? Fill out the form or contact us directly.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex gap-4 items-start bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Headquarters</h4>
                  <p className="text-white font-bold text-base mt-1">Dhaka, Bangladesh</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Global Operations Center</p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email Address</h4>
                  <p className="text-white font-bold text-base mt-1">contact@a1esportsbd.com</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Sponsorships: biz@a1esportsbd.com</p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Official Channels</h4>
              <div className="flex gap-3">
                {[
                  { icon: FaFacebookF, href: "https://facebook.com/a1esportsbd" },
                  { icon: FaInstagram, href: "https://www.instagram.com/a1esports.bd" },
                  { icon: FaYoutube, href: "https://youtube.com/@a1esportsbd" },
                  { icon: FaDiscord, href: "https://discord.gg/EKRQMA83" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary transition-all duration-300"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 md:p-12 space-y-6 backdrop-blur-xl">
              <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <MessageSquare className="text-primary" size={24} /> Send Us a Message
              </h3>

              {submitted ? (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center space-y-4 my-8">
                  <CheckCircle2 size={48} className="text-primary mx-auto animate-bounce" />
                  <h4 className="text-2xl font-black uppercase tracking-tight">Message Received!</h4>
                  <p className="text-neutral-300 text-sm max-w-sm mx-auto">
                    Thank you for reaching out to A1 Esports. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-bold uppercase tracking-widest text-xs hover:underline pt-2 inline-block"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-white"
                    >
                      <option value="Business / Sponsorship">Business & Sponsorship</option>
                      <option value="Merchandise / Order">Merchandise Order Question</option>
                      <option value="Media & Press">Media & Press Inquiries</option>
                      <option value="Team Tryout">Team Tryout Query</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your message details here..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-neutral-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <A1Button variant="primary" type="submit" className="w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <Send size={16} /> Submit Inquiry
                  </A1Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
