"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/data/artworks";
import { X, Heart, Copy, Check, ShoppingBag, Plus, Star, MessageSquarePlus } from "lucide-react";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import { getSavedReviews, fetchReviews, Review } from "@/data/reviews";

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
  const [mounted, setMounted] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (artwork) {
      setReviews(getSavedReviews());
      fetchReviews().then((cloudReviews) => {
        if (isMounted && cloudReviews) {
          setReviews(cloudReviews);
        }
      });
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        isMounted = false;
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [artwork]);

  if (!mounted || !artwork) return null;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-sans font-medium">
                  {artwork.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-accent-terracotta text-sm font-calligraphy font-bold">
                  {artwork.canvasShape} canvas
                </span>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-amber-500 text-white font-sans font-bold text-xs shadow-warm-amber">
                ₹{artwork.price} &bull; {artwork.inStock ? "Ready to ship" : "Made to order"}
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-ink-main mb-2 leading-tight font-semibold">
                {artwork.title}
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                {artwork.description}
              </p>
            </div>

            {/* Guna's Story Note */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-900/10 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-calligraphy font-bold text-accent-terracotta mb-1.5">
                <Heart className="w-4 h-4 shrink-0" />
                <span className="text-base sm:text-lg">The Artist&apos;s Note &bull; Guna</span>
              </div>
              <p className="text-base sm:text-xl font-handwriting text-ink-main leading-relaxed">
                &ldquo;{artwork.story}&rdquo;
              </p>
            </div>

            {/* Medium & Size */}
            <div>
              <h4 className="text-xs font-sans font-semibold text-amber-900/80 mb-2">
                Physical Canvas Details
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-sans">
                <span className="px-3 py-1.5 rounded-xl bg-white text-ink-main border border-amber-900/10 shadow-xs">
                  {artwork.medium}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white text-amber-800 font-semibold border border-amber-900/10 shadow-xs">
                  {artwork.sizeDimensions}
                </span>
              </div>
            </div>

            {/* Color Palette Swatches */}
            <div>
              <h4 className="text-xs font-sans font-semibold text-amber-900/80 mb-2">
                Hand-Mixed Acrylic Palette
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

            {/* Collector Reviews & Review Option */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-900/10">
              {(() => {
                const specific = reviews.filter(
                  (r) =>
                    r.artworkId === artwork.id ||
                    (r.artworkTitle && artwork.title && r.artworkTitle.toLowerCase() === artwork.title.toLowerCase())
                );
                const avgRating =
                  specific.length > 0
                    ? (specific.reduce((acc, cur) => acc + cur.rating, 0) / specific.length).toFixed(1)
                    : null;
                const displayRev = specific[0];

                return (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-500">
                          {avgRating ? (
                            [...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.round(Number(avgRating))
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-amber-200"
                                }`}
                              />
                            ))
                          ) : (
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </div>
                        <span className="text-xs font-serif font-bold text-ink-main">
                          {avgRating
                            ? `${avgRating} • Collector Praise (${specific.length})`
                            : "Collector Reviews"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsWriteReviewOpen(true)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-900/20 hover:border-amber-500 text-amber-900 text-xs font-medium font-sans transition-all active:scale-95 shadow-xs"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5 text-amber-600" />
                        <span>Write a Review</span>
                      </button>
                    </div>

                    {displayRev ? (
                      <div className="mt-2 text-xs font-sans text-ink-muted">
                        <p className="italic line-clamp-2">
                          &ldquo;{displayRev.comment}&rdquo;
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-amber-900/80">
                          <span>
                            &mdash; {displayRev.author} ({displayRev.location || "Verified Collector"})
                          </span>
                          {displayRev.verified && (
                            <span className="text-emerald-700 font-medium">Verified Order</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-sans text-ink-muted mt-1">
                        Have you collected this artwork? Be the first to share your experience with fellow collectors!
                      </p>
                    )}
                  </>
                );
              })()}
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
                <span>Order This Painting (₹{artwork.price})</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Write a Review Modal for this specific artwork */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        defaultArtworkId={artwork.id}
        defaultArtworkTitle={artwork.title}
        onReviewSubmitted={(newRev) => {
          setReviews((prev) => [newRev, ...prev]);
        }}
      />
    </div>,
    document.body
  );
}


