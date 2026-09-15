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
              <span className="font-display font-bold text-ink-main text-lg sm:text-xl tracking-wide block">
                AMORISTARTSY
              </span>
              <span className="font-mono text-xs text-blue-700 block tracking-wider font-semibold">
                Handmade Pieces of Joy by Guna
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed mb-6">
            Handcrafted mini acrylic canvases painted with hope, warm pastel colors, and love. All physical gallery pieces are available for direct order.
          </p>

          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold text-xs sm:text-sm hover:bg-amber-600 transition-all shadow-warm-amber active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Order Mini Canvases</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-mono text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>MINI CANVAS SELECTION</span>
            </h4>
            <div className="flex flex-wrap gap-2 max-w-sm">
              {featuredArtworks.map((item) => (
                <Link
                  key={item.id}
                  href={`/order?item=${item.id}`}
                  className="px-2.5 py-1 rounded-md bg-white/80 border border-blue-200 text-[11px] font-mono text-blue-900 hover:text-amber-700 hover:border-amber-400 transition-colors shadow-sm"
                >
                  {item.title} (₹{item.price})
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bold">
              <Heart className="w-3.5 h-3.5 text-accent-terracotta" />
              <span>DIRECT ORDER & CONNECT</span>
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/918904865499"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs font-mono hover:bg-blue-700 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp: +91 89048 65499</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-xs font-mono text-ink-main hover:text-amber-600 hover:border-amber-400 transition-colors shadow-sm"
              >
                <Instagram className="w-4 h-4 text-accent-terracotta" />
                <span>@amoristartsy</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-t border-blue-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs font-mono text-blue-900/80 font-medium gap-3 text-center sm:text-left">
        <span>© {new Date().getFullYear()} AMORISTARTSY // HANDMADE PIECES OF JOY BY GUNA</span>
        <span className="text-blue-800 font-bold">WHATSAPP ORDERS: +91 89048 65499</span>
      </div>
    </footer>
  );
}
