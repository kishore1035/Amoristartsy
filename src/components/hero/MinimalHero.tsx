"use client";

import React from "react";
import { Heart, ArrowDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function MinimalHero() {
  // Staggered motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto">
      {/* Background Soft Pastel Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] h-[220px] sm:h-[320px] bg-amber-400/20 filter blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Hero Header Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-3xl mx-auto relative z-10"
      >
        {/* Brand Tag */}
        <motion.div variants={itemVariants} className="inline-block">
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/90 border border-amber-900/15 text-amber-800 shadow-sm mb-5 sm:mb-6">
            <Heart className="w-4 h-4 text-accent-terracotta shrink-0" />
            <span className="font-sans text-xs sm:text-sm font-medium text-accent-terracotta tracking-wide">
              amoristartsy &bull; handcrafted pieces of joy
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-serif text-ink-main leading-[1.15] mb-5 sm:mb-7 font-normal"
        >
          Handpainted <br />
          <span className="font-calligraphy text-5xl sm:text-7xl md:text-8xl bg-gradient-to-r from-amber-600 via-accent-terracotta to-amber-700 bg-clip-text text-transparent inline-block pt-1">
            Artworks
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-lg text-ink-muted font-sans font-light leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto px-2"
        >
          Handcrafted acrylic artworks painted with pastel warmth, color, and love by Guna. Bringing pop culture, traditional motifs, and cozy moments to your favorite spaces.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
        >
          <a
            href="#gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-all shadow-warm-amber active:scale-95 hover:scale-105"
          >
            <span>Explore Collection</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#story"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-white border border-amber-900/15 text-ink-main hover:border-amber-900/30 text-sm font-medium transition-all backdrop-blur-md hover:scale-105 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-accent-terracotta" />
            <span>Read Guna&apos;s Story</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
