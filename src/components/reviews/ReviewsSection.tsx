"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Review, getSavedReviews, fetchReviews, incrementHelpful } from "@/data/reviews";
import WriteReviewModal from "./WriteReviewModal";
import {
  Star,
  Sparkles,
  MessageSquareQuote,
  CheckCircle2,
  ThumbsUp,
  Plus,
  Heart,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  // Sync reviews from storage and listen to custom updates
  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      // 1. Immediate render from cached reviews
      const cached = getSavedReviews();
      if (isMounted) setReviews(cached);

      // 2. Fetch live updates from Supabase cloud
      const live = await fetchReviews();
      if (isMounted && live) {
        setReviews(live);
      }
    };
    loadReviews();

    const handleUpdate = () => {
      loadReviews();
    };

    window.addEventListener("amoristartsy_reviews_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("amoristartsy_reviews_updated", handleUpdate);
    };
  }, []);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedFilter === "All") return true;
      if (selectedFilter === "5 Stars") return r.rating === 5;
      if (selectedFilter === "Custom Orders") {
        return (
          r.category?.toLowerCase().includes("custom") ||
          r.artworkTitle.toLowerCase().includes("custom") ||
          r.artworkTitle.toLowerCase().includes("commission")
        );
      }
      if (selectedFilter === "Pop Culture") {
        return r.category === "Pop Culture";
      }
      if (selectedFilter === "Landscapes") {
        return r.category?.toLowerCase().includes("landscape");
      }
      return true;
    });
  }, [reviews, selectedFilter]);

  // Aggregate stats
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleHelpfulClick = (reviewId: string) => {
    if (votedReviews[reviewId]) return;
    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
    incrementHelpful(reviewId);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Background soft ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/5 filter blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs mb-3">
            <Heart className="w-3.5 h-3.5 text-accent-terracotta" />
            <span className="font-calligraphy text-base sm:text-lg font-bold text-amber-900">
              Collector Stories &amp; Testimonials
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-ink-main tracking-tight font-normal">
            Loved by <span className="font-calligraphy text-4xl sm:text-6xl text-amber-600 italic">Art Collectors</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl font-sans leading-relaxed mt-2">
            Real feedback from collectors who received Guna&apos;s hand-painted canvases across India.
            Each parcel is packed safely with love, eco-friendly wrappings, and a handwritten note.
          </p>
        </div>

        {/* Write a Review Button */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-warm-amber active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Banner (Only shown when there are real collector reviews) */}
      {reviews.length > 0 && (
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white/80 border border-amber-900/15 shadow-sm relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6 text-center md:text-left">
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-ink-main">
                {averageRating}
              </span>
              <div className="flex items-center gap-1 mt-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(averageRating))
                        ? "fill-amber-500 text-amber-500"
                        : "text-amber-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-sans text-ink-muted mt-1">
                Overall Rating
              </span>
            </div>

            <div className="h-12 w-px bg-amber-900/10 hidden sm:block" />

            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-serif font-semibold text-ink-main">
                Handcrafted Praise
              </h4>
              <p className="text-xs text-ink-muted font-sans max-w-md">
                {reviews.length} authentic collector {reviews.length === 1 ? "review" : "reviews"} from art lovers across India.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-sans font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Orders</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-sans font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Handmade in Studio</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs (Shown only when multiple reviews exist) */}
      {reviews.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted mr-2 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {["All", "5 Stars", "Custom Orders", "Pop Culture", "Landscapes"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
                selectedFilter === filter
                  ? "bg-amber-500 text-white shadow-warm-amber"
                  : "bg-white/80 border border-amber-900/15 text-ink-muted hover:text-ink-main hover:border-amber-400"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Reviews Cards Grid */}
      {filteredReviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <AnimatePresence>
            {filteredReviews.map((rev) => (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-3xl bg-white/90 border border-amber-900/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header: Author & Star Rating */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center font-serif font-bold text-xs shrink-0 ${
                          rev.avatarBg || "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        {getInitials(rev.author)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-ink-main text-sm sm:text-base">
                            {rev.author}
                          </span>
                          {rev.verified && (
                            <span
                              title="Verified Collector"
                              className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 font-sans font-medium"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-sans text-ink-muted block">
                          {rev.location || "India"} &bull; {rev.date}
                        </span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center text-amber-500 shrink-0">
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
                  </div>

                  {/* Artwork Tag */}
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-medium font-sans">
                      🎨 {rev.artworkTitle}
                    </span>
                  </div>

                  {/* Review Text Body */}
                  <p className="text-xs sm:text-sm text-ink-main/90 font-sans leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Footer: Helpful Vote */}
                <div className="mt-5 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs font-sans text-ink-muted">
                  <span className="text-[11px] text-amber-900/70 font-medium">
                    Collector Review
                  </span>

                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    disabled={votedReviews[rev.id]}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-xs ${
                      votedReviews[rev.id]
                        ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                        : "bg-white text-ink-muted border-amber-900/15 hover:border-amber-500 hover:text-amber-800"
                    }`}
                    title="Mark this review as helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>
                      Helpful ({rev.helpfulCount})
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State when no reviews exist at all */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/70 backdrop-blur-xs rounded-3xl border border-dashed border-amber-900/20 relative z-10 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <MessageSquareQuote className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-semibold text-ink-main mb-2">
            No Collector Reviews Yet
          </h4>
          <p className="text-xs sm:text-sm text-ink-muted font-sans max-w-md mx-auto mb-6 leading-relaxed">
            Have you received a hand-painted canvas or commissioned custom artwork from Guna? Be the first collector to share your experience!
          </p>
          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-warm-amber active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write the First Review</span>
          </button>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/50 rounded-3xl border border-dashed border-amber-900/20 relative z-10">
          <MessageSquareQuote className="w-10 h-10 text-amber-600/50 mx-auto mb-3" />
          <h4 className="font-serif text-lg font-semibold text-ink-main mb-1">
            No reviews yet for &ldquo;{selectedFilter}&rdquo;
          </h4>
          <p className="text-xs text-ink-muted font-sans mb-4">
            Be the first collector to review this category!
          </p>
          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold text-xs shadow-warm-amber active:scale-95"
          >
            Leave a Review
          </button>
        </div>
      ) : null}

      {/* Write a Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onReviewSubmitted={(newRev) => {
          setReviews((prev) => [newRev, ...prev]);
        }}
      />
    </section>
  );
}
