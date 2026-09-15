"use client";

import React from "react";
import Image from "next/image";
import { Heart, Quote, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function MinimalStory() {
  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="story" className="py-28 px-6 md:px-12 max-w-5xl mx-auto relative overflow-hidden">
      {/* Background Soft Glows - Warm Amber at top, Pastel Blue at bottom */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-300/20 filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[300px] bg-blue-200/40 filter blur-[120px] pointer-events-none" />

      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-accent-terracotta font-mono text-xs mb-4 font-semibold">
          <Heart className="w-3.5 h-3.5 text-accent-terracotta" />
          <span>FROM CANVAS TO SCREEN // GUNA&apos;S ORIGIN STORY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display uppercase tracking-tight text-ink-main">
          THE STORY BEHIND <span className="text-amber-600">THE BRUSH</span>
        </h2>
      </motion.div>

      {/* Guna's Bio Quote Cards with Motion Scroll Reveal */}
      <div className="space-y-12 relative z-10">
        {/* Paragraph 1 */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="p-8 sm:p-10 rounded-3xl glass-panel border border-amber-900/10 relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-sm"
        >
          <Quote className="w-8 h-8 text-amber-500/40 mb-4" />
          <p className="text-lg sm:text-xl font-serif italic text-ink-main leading-relaxed mb-4">
            &quot;I never thought a paintbrush would become my favorite way to say things I couldn’t put into words. It started as just a little hobby, something I did for fun. But somewhere along the way, painting became my escape. A place where I could slow everything down, clear my head, and just vibe with the colors.&quot;
          </p>
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted pt-4 border-t border-amber-900/10 font-medium">
            <span>01 / THE BEGINNING</span>
            <span className="text-amber-700 font-semibold">Guna</span>
          </div>
        </motion.div>

        {/* Paragraph 2 & Image Dual Showcase */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-7 p-8 sm:p-10 rounded-3xl glass-panel border border-amber-900/10 hover:border-rose-400/40 transition-colors shadow-sm">
            <Quote className="w-8 h-8 text-accent-terracotta/40 mb-4" />
            <p className="text-lg sm:text-xl font-serif italic text-ink-main leading-relaxed mb-4">
              &quot;Every canvas became its own little story. Sometimes it was a dreamy place I wanted to be, sometimes a character I loved, sometimes just a face with no name. Other times, it was some random thought or moment that stayed in my head.&quot;
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted pt-4 border-t border-amber-900/10 font-medium">
              <span>02 / STORIES IN COLOR</span>
              <span className="text-accent-terracotta font-semibold">Guna</span>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.03, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="md:col-span-5 relative aspect-square rounded-3xl overflow-hidden glass-panel border border-amber-900/10 p-2 shadow-md cursor-pointer"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src="/artworks/raincoat_duo.jpg"
                alt="Raincoat Duo Mini Canvas"
                fill
                priority
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-ink-main flex items-center justify-between font-medium">
                <span>HEART CANVAS</span>
                <span className="text-amber-300">amoristartsy</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Paragraph 3 & 4 Final Note */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-surface via-amber-50/60 to-blue-50/60 border border-blue-200 relative overflow-hidden shadow-md"
        >
          <Quote className="w-8 h-8 text-blue-500/50 mb-4" />
          <p className="text-lg sm:text-xl font-serif italic text-ink-main leading-relaxed mb-6">
            &quot;I guess I started painting the things that made me happy, hoping they’d make somebody else feel something too. And now, every piece I make has the same kinda hope behind it—maybe someday, it’ll sit in someone’s home, and become a little part of a memory they never wanna forget.&quot;
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-blue-200">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>HANDMADE PIECES OF JOY</span>
            </div>
            <span className="font-display font-bold text-ink-main tracking-widest text-sm">
              — GUNA
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
