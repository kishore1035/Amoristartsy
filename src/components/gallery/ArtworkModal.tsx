"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/data/artworks";
import {
  X,
  Heart,
  Copy,
  Check,
  ShoppingBag,
  Plus,
  Star,
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
} from "lucide-react";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import { getSavedReviews, fetchReviews, Review, incrementHelpful } from "@/data/reviews";

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
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (artwork) {
      setIsReviewExpanded(false);
      setCurrentReviewIdx(0);
      setIsAllReviewsModalOpen(false);
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

  const handleHelpfulClick = (reviewId: string) => {
    if (votedReviews[reviewId]) return;
    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
    incrementHelpful(reviewId);
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
                const safeIdx = Math.min(currentReviewIdx, Math.max(0, specific.length - 1));
                const displayRev = specific[safeIdx] || specific[0];

                return (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (specific.length > 0) {
                            setIsAllReviewsModalOpen(true);
                          }
                        }}
                        className={`flex items-center gap-2 text-left transition-all ${
                          specific.length > 0 ? "cursor-pointer hover:opacity-80" : "cursor-default"
                        }`}
                        title={specific.length > 0 ? "Click to view all reviews" : undefined}
                      >
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
                        <span className="text-xs font-serif font-bold text-ink-main hover:text-amber-800 transition-colors">
                          {avgRating
                            ? `${avgRating} • Collector Praise (${specific.length})`
                            : "Collector Reviews"}
                        </span>
                      </button>

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
                      <div className="mt-2">
                        {/* Interactive Clickable Review Box - Expands to view the whole review */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setIsReviewExpanded(!isReviewExpanded)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setIsReviewExpanded(!isReviewExpanded);
                            }
                          }}
                          className="text-xs font-sans text-ink-muted cursor-pointer hover:bg-amber-100/60 p-2.5 -mx-2.5 rounded-xl transition-all border border-transparent hover:border-amber-900/10 active:scale-[0.99] group focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          title={isReviewExpanded ? "Click to collapse" : "Click to view whole review"}
                        >
                          <p
                            className={`italic text-ink-main/90 transition-all ${
                              isReviewExpanded ? "whitespace-pre-line leading-relaxed" : "line-clamp-2"
                            }`}
                          >
                            &ldquo;{displayRev.comment}&rdquo;
                          </p>

                          <div className="mt-2 flex items-center justify-between text-[11px] text-amber-900/80">
                            <span className="font-medium truncate max-w-[200px]">
                              &mdash; {displayRev.author} ({displayRev.location || "Verified Collector"})
                            </span>

                            <div className="flex items-center gap-2 shrink-0">
                              {displayRev.verified && (
                                <span className="text-emerald-700 font-medium">Verified Order</span>
                              )}
                              <span className="text-amber-800 font-semibold group-hover:text-amber-950 flex items-center gap-0.5 text-[11px] underline underline-offset-2 transition-colors ml-1">
                                {isReviewExpanded ? (
                                  <>
                                    Show less <ChevronUp className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    Read more <ChevronDown className="w-3 h-3" />
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pagination if multiple reviews for this artwork */}
                        {specific.length > 1 && (
                          <div className="mt-2 pt-2 border-t border-amber-900/10 flex items-center justify-between text-[11px]">
                            <span className="text-ink-muted">
                              Review {safeIdx + 1} of {specific.length}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentReviewIdx((prev) => (prev > 0 ? prev - 1 : specific.length - 1));
                                  setIsReviewExpanded(false);
                                }}
                                className="p-1 rounded-md bg-white border border-amber-900/15 hover:bg-amber-100 text-amber-900 transition-colors"
                                title="Previous review"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentReviewIdx((prev) => (prev < specific.length - 1 ? prev + 1 : 0));
                                  setIsReviewExpanded(false);
                                }}
                                className="p-1 rounded-md bg-white border border-amber-900/15 hover:bg-amber-100 text-amber-900 transition-colors"
                                title="Next review"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAllReviewsModalOpen(true);
                                }}
                                className="ml-1 text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2"
                              >
                                View all ({specific.length})
                              </button>
                            </div>
                          </div>
                        )}
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

      {/* All Reviews Modal for this specific artwork */}
      {isAllReviewsModalOpen && (
        <div className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsAllReviewsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-surface border border-amber-900/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-amber-900/10 flex items-center justify-between bg-amber-50/50">
              <div>
                <h3 className="font-serif font-bold text-lg text-ink-main flex items-center gap-2">
                  <span>Collector Praise</span>
                </h3>
                <p className="text-xs text-ink-muted truncate max-w-xs sm:max-w-sm">
                  {artwork.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-amber-900/15 flex items-center justify-center text-ink-main hover:bg-amber-100 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reviews List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {(() => {
                const specific = reviews.filter(
                  (r) =>
                    r.artworkId === artwork.id ||
                    (r.artworkTitle &&
                      artwork.title &&
                      r.artworkTitle.toLowerCase() === artwork.title.toLowerCase())
                );

                if (specific.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-sm text-ink-muted">
                        No reviews yet for this artwork.
                      </p>
                    </div>
                  );
                }

                return specific.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-amber-50/70 border border-amber-900/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "fill-amber-500 text-amber-500"
                                : "text-amber-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-ink-muted">{rev.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-main font-sans italic leading-relaxed whitespace-pre-line">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-amber-950">
                          {rev.author}
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          ({rev.location || "Verified Collector"})
                        </span>
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                            Verified Order
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(rev.id)}
                        disabled={votedReviews[rev.id]}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] transition-all ${
                          votedReviews[rev.id]
                            ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                            : "bg-white text-ink-muted border-amber-900/15 hover:border-amber-500 hover:text-amber-800"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({rev.helpfulCount || 0})</span>
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-amber-900/10 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsAllReviewsModalOpen(false);
                  setIsWriteReviewOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium font-sans transition-all active:scale-95 shadow-sm"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-ink-main text-xs font-medium font-sans border border-amber-900/15 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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


