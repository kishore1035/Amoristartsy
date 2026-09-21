"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ARTWORKS } from "@/data/artworks";
import { Instagram, ArrowUpRight, Heart, Sparkles, ShoppingBag, MessageCircle } from "lucide-react";

export default function Footer() {
  const featuredArtworks = ARTWORKS.slice(0, 10);

  return (
    <footer className="relative bg-gradient-to-b from-[#faf7f2] via-[#eaf2ff] to-[#d6e4ff] border-t border-blue-200/60 pt-16 sm:pt-20 pb-12 px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Glowing Soft Pastel Blue & Periwinkle Orbs at the Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[550px] h-64 bg-blue-300/35 filter blur-[90px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-sky-200/40 filter blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 md:gap-12 mb-12 sm:mb-16 relative z-10">
        {/* Left Column */}
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-blue-300 shadow-sm bg-amber-50 shrink-0">
              <Image src="/logo.png" alt="amoristartsy" fill className="object-contain p-0.5" />
            </div>
            <div>
              <span className="font-serif font-bold text-ink-main text-xl sm:text-2xl block leading-tight">
                amoristartsy
              </span>
              <span className="font-sans text-xs sm:text-sm text-blue-900/80 block font-medium">
                Handmade pieces of joy by Guna
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed mb-6">
            Handcrafted mini acrylic canvases painted with hope, warm pastel colors, and love. Each piece is unique and ready to bring a smile to your space.
          </p>

          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-xs sm:text-sm hover:bg-amber-600 transition-all shadow-warm-amber active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Order Paintings</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-sans font-semibold text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Featured Mini Canvases</span>
            </h4>
            <div className="flex flex-wrap gap-2 max-w-sm">
              {featuredArtworks.map((item) => (
                <Link
                  key={item.id}
                  href={`/order?item=${item.id}`}
                  className="px-3 py-1 rounded-full bg-white/90 border border-blue-200 text-xs font-sans text-blue-950 hover:text-amber-700 hover:border-amber-400 transition-colors shadow-xs"
                >
                  {item.title} <span className="font-bold text-amber-800">(₹{item.price})</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-sans font-semibold text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-accent-terracotta" />
              <span>Direct Order & Custom Inquiries</span>
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://instagram.com/amoristartsy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 text-white font-semibold text-xs font-sans hover:opacity-95 transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>DM @amoristartsy on Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-t border-blue-200/60 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-blue-950/70 font-medium gap-3 text-center sm:text-left">
        <span>© {new Date().getFullYear()} amoristartsy &bull; handcrafted with love by Guna</span>
        <span className="font-calligraphy text-base text-blue-900 font-bold">Every canvas tells a story</span>
      </div>
    </footer>
  );
}
