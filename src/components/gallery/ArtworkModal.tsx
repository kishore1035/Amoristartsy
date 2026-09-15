"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/data/artworks";
import { X, Heart, Copy, Check, ShoppingBag, Plus } from "lucide-react";

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onToggleOrder?: (artwork: Artwork) => void;
  isOrdered?: boolean;
}

export default function ArtworkModal({
  artwork,
  onClose,
  onToggleOrder,
  isOrdered = false,
}: ArtworkModalProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!artwork) return null;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl bg-surface border border-amber-900/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] sm:max-h-[85vh]">
        {/* Close Button - Positioned safely with high z-index */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-amber-900/15 flex items-center justify-center text-ink-main hover:text-black hover:bg-white transition-all shadow-md active:scale-95"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Full Photo Display */}
        <div className="w-full md:w-1/2 h-[220px] sm:h-[320px] md:h-auto relative bg-amber-50 flex items-center justify-center p-3 sm:p-6 shrink-0">
          <div className="relative w-full h-full min-h-[180px] sm:min-h-[280px] md:min-h-[380px] rounded-2xl overflow-hidden shadow-md border border-amber-900/10">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Right: Artwork Metadata, Story & Fixed Action Footer */}
        <div className="w-full md:w-1/2 flex flex-col justify-between min-h-0 bg-surface border-t md:border-t-0 md:border-l border-amber-900/15">
          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-4 sm:p-8 pt-10 sm:pt-8 pr-12 sm:pr-16 space-y-4 sm:space-y-6">
            {/* Tags & Price */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-900 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-semibold">
                  {artwork.category}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-accent-terracotta text-[10px] sm:text-xs font-mono capitalize font-semibold">
                  {artwork.canvasShape} Canvas
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-mono font-bold text-[11px] sm:text-xs shadow-sm">
                ₹{artwork.price} ({artwork.inStock ? "In Stock" : "Custom Order"})
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-3xl font-bold font-display text-ink-main mb-1.5 sm:mb-2 leading-tight">
                {artwork.title}
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                {artwork.description}
              </p>
            </div>

            {/* Guna's Story Note */}
            <div className="p-3 sm:p-4 rounded-xl bg-white/80 border border-amber-900/10 shadow-sm">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-accent-terracotta mb-1 font-semibold">
                <Heart className="w-3.5 h-3.5 shrink-0" />
                <span>GUNA&apos;S STORY BEHIND THIS PIECE</span>
              </div>
              <p className="text-xs text-ink-main italic leading-relaxed">
                &quot;{artwork.story}&quot;
              </p>
            </div>

            {/* Medium & Size */}
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-mono text-ink-muted uppercase tracking-widest mb-1.5 sm:mb-2 font-semibold">
                Physical Canvas Details
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono">
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white text-ink-main border border-amber-900/10 shadow-sm">
                  {artwork.medium}
                </span>
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white text-amber-700 font-semibold border border-amber-900/10 shadow-sm">
                  {artwork.sizeDimensions}
                </span>
              </div>
            </div>

            {/* Color Palette Swatches */}
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-mono text-ink-muted uppercase tracking-widest mb-1.5 sm:mb-2 font-semibold">
                Acrylic Color Palette
              </h4>
              <div className="flex items-center gap-2.5 sm:gap-3">
                {artwork.colorPalette.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleCopyColor(hex)}
                    title={`Click to copy ${hex}`}
                    className="group relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-900/20 flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                    style={{ backgroundColor: hex }}
                  >
                    {copiedHex === hex ? (
                      <Check className="w-3.5 h-3.5 text-black" />
                    ) : (
                      <Copy className="w-3 h-3 text-ink-main opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Order Button */}
          <div className="p-3.5 sm:p-6 bg-white/80 border-t border-amber-900/10 shrink-0">
            {onToggleOrder ? (
              <button
                type="button"
                onClick={() => onToggleOrder(artwork)}
                className={`w-full py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  isOrdered
                    ? "bg-amber-500 text-white font-semibold shadow-warm-amber active:scale-95"
                    : "bg-white text-ink-main border border-amber-900/20 hover:border-amber-500 hover:text-amber-700 active:scale-95 shadow-sm"
                }`}
              >
                {isOrdered ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Order (₹{artwork.price})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Order (₹{artwork.price})</span>
                  </>
                )}
              </button>
            ) : (
              <Link
                href={`/order?item=${artwork.id}`}
                onClick={onClose}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-amber-500 text-white font-semibold text-xs sm:text-sm hover:bg-amber-600 transition-all shadow-warm-amber flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order This Mini Canvas (₹{artwork.price})</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
