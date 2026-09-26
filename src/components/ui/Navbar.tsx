"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SoundController from "./SoundController";
import { Layers, Compass, ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/95 backdrop-blur-xl border-b border-amber-900/10 shadow-sm"
          : "py-4 sm:py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        {/* Artist Brand Logo & Name */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-amber-900/15 shadow-sm group-hover:scale-105 transition-transform bg-amber-50 shrink-0">
            <Image
              src="/logo.png"
              alt="amoristartsy - Guna"
              fill
              priority
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-ink-main text-lg sm:text-xl tracking-normal block leading-tight">
              Guna <span className="text-amber-600 font-calligraphy text-2xl sm:text-3xl font-normal">&bull; amoristartsy</span>
            </span>
            <span className="font-sans text-[11px] sm:text-xs text-amber-800/80 block font-medium tracking-wide">
              Handmade Pieces of Joy
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans text-ink-main font-medium">
          <Link
            href="/#gallery"
            className="hover:text-amber-700 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Artworks Gallery</span>
          </Link>

          <Link
            href="/#custom"
            className="hover:text-amber-700 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Custom Orders</span>
          </Link>

          <Link
            href="/#story"
            className="hover:text-amber-700 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-accent-terracotta" />
            <span>Bio & Story</span>
          </Link>
        </nav>

        {/* Right Actions: Sound Synthesizer, Desktop Order Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <SoundController />

          <Link
            href="/order"
            className="hidden sm:inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-amber-500 text-white font-sans font-semibold text-xs sm:text-sm hover:bg-amber-600 transition-all shadow-warm-amber active:scale-95 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-white shrink-0" />
            <span>Order Paintings</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/80 border border-amber-900/15 text-ink-main hover:bg-amber-50 transition-colors shadow-sm"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-2xl border-b border-amber-900/15 overflow-hidden shadow-lg"
          >
            <div className="px-6 py-5 space-y-4 font-sans text-sm">
              <Link
                href="/#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-ink-main hover:text-amber-700 py-2 border-b border-amber-900/10"
              >
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Artworks Gallery</span>
              </Link>

              <Link
                href="/#custom"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-ink-main hover:text-amber-700 py-2 border-b border-amber-900/10"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Custom Orders</span>
              </Link>

              <Link
                href="/#story"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-ink-main hover:text-amber-700 py-2 border-b border-amber-900/10"
              >
                <Compass className="w-4 h-4 text-accent-terracotta" />
                <span>Bio & Story</span>
              </Link>

              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-white font-semibold shadow-warm-amber"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Paintings</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
