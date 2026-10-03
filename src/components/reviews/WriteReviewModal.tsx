"use client";

import React, { useState, useEffect } from "react";
import { ARTWORKS } from "@/data/artworks";
import { saveNewReview, Review } from "@/data/reviews";
import { X, Star, Sparkles, Check, Heart, Palette } from "lucide-react";
import confetti from "canvas-confetti";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultArtworkId?: string;
  defaultArtworkTitle?: string;
  onReviewSubmitted?: (review: Review) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Needs improvement",
  2: "Fair craftsmanship",
  3: "Good painting",
  4: "Very beautiful artwork ✨",
  5: "Exceptional masterpiece! Loved it! 🎨❤️",
};

export default function WriteReviewModal({
  isOpen,
  onClose,
  defaultArtworkId,
  defaultArtworkTitle,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectedArtworkTitle, setSelectedArtworkTitle] = useState<string>(
    defaultArtworkTitle || "Custom Commission"
  );
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>(
    defaultArtworkId || ""
  );
  const [category, setCategory] = useState<string>("Hand-Painted Canvas");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string; comment?: string }>({});

  useEffect(() => {
    if (defaultArtworkTitle) {
      setSelectedArtworkTitle(defaultArtworkTitle);
    }
    if (defaultArtworkId) {
      setSelectedArtworkId(defaultArtworkId);
      const matched = ARTWORKS.find((a) => a.id === defaultArtworkId);
      if (matched) {
        setCategory(matched.category);
      }
    }
  }, [defaultArtworkTitle, defaultArtworkId]);

  if (!isOpen) return null;

  const handleArtworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setSelectedArtworkTitle("Custom Canvas Commission");
      setSelectedArtworkId("");
      setCategory("Custom Commission");
    } else {
      const art = ARTWORKS.find((a) => a.id === val);
      if (art) {
        setSelectedArtworkTitle(art.title);
        setSelectedArtworkId(art.id);
        setCategory(art.category);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; comment?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name or moniker";
    }
    if (!comment.trim() || comment.trim().length < 10) {
      newErrors.comment = "Please write at least a sentence (min 10 characters) about your experience";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const created = saveNewReview({
        author: name.trim(),
        rating,
        artworkId: selectedArtworkId || undefined,
        artworkTitle: selectedArtworkTitle,
        category,
        comment: comment.trim(),
        location: location.trim() || "India",
        verified: true,
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#aa7a50", "#c89f78", "#d0e1fd", "#a16040", "#f6ded3"],
        });
      } catch (_) {
        // Fallback gracefully if confetti fails
      }

      setIsSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(created);
      }

      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        setName("");
        setLocation("");
        setComment("");
        setRating(5);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-xl bg-surface border border-amber-900/15 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-amber-900/10 bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-800">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-ink-main font-semibold leading-tight">
                Leave a Review
              </h3>
              <p className="font-sans text-xs text-ink-muted">
                Share your thoughts on Guna&apos;s handcrafted painting
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-amber-900/15 flex items-center justify-center text-ink-main hover:text-black hover:bg-amber-50 transition-all shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="font-serif text-2xl sm:text-3xl text-ink-main font-bold">
              Thank You for Your Review!
            </h4>
            <p className="font-sans text-sm text-ink-muted max-w-sm">
              Your feedback warms Guna&apos;s heart and helps fellow art lovers choose the perfect canvas.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 text-accent-terracotta fill-accent-terracotta" />
              <span>Added to Amoristartsy Collector Stories</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Star Rating Selector */}
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-900/10">
              <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-2">
                Your Rating *
              </label>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    title={`${starValue} Stars`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        starValue <= displayRating
                          ? "text-amber-500 fill-amber-500 drop-shadow-sm"
                          : "text-amber-200 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-sans font-medium text-amber-800 mt-2">
                {RATING_LABELS[displayRating]}
              </p>
            </div>

            {/* Artwork Selection */}
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1.5">
                Artwork / Commission Ordered
              </label>
              <div className="relative">
                <select
                  value={selectedArtworkId || (selectedArtworkTitle === "Custom Canvas Commission" ? "custom" : "")}
                  onChange={handleArtworkChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/20 text-xs sm:text-sm text-ink-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="custom">Custom Canvas Commission</option>
                  <optgroup label="Original Studio Artworks">
                    {ARTWORKS.slice(0, 30).map((art) => (
                      <option key={art.id} value={art.id}>
                        {art.title} ({art.canvasShape} canvas - ₹{art.price})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Collector Name & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1.5">
                  Your Name / Moniker *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sundar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white border ${
                    errors.name ? "border-rose-500" : "border-amber-900/20"
                  } text-xs sm:text-sm text-ink-main focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1.5">
                  City / Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, Tamil Nadu"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/20 text-xs sm:text-sm text-ink-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Detailed Review Comment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-amber-900">
                  Your Review & Experience *
                </label>
                <span className="text-[11px] text-ink-muted">
                  {comment.length} characters
                </span>
              </div>
              <textarea
                rows={4}
                required
                placeholder="How does the artwork look in your home or on your desk? How did you find the acrylic color vibrancy, brushwork texture, and packaging?"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errors.comment) setErrors((prev) => ({ ...prev, comment: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-white border ${
                  errors.comment ? "border-rose-500" : "border-amber-900/20"
                } text-xs sm:text-sm text-ink-main focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed`}
              />
              {errors.comment && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.comment}</p>
              )}
            </div>

            {/* Verified Collector Promise */}
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-start gap-2 text-xs text-amber-950">
              <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                By submitting, your review will be published under Guna&apos;s verified collector stories to inspire fellow art lovers.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-ink-muted hover:text-ink-main transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-warm-amber active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? "Publishing..." : "Submit Review"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
