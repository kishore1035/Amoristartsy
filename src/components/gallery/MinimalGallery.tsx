"use client";

import React, { useState, useMemo } from "react";
import { ARTWORKS, Artwork } from "@/data/artworks";
import ArtworkCard from "./ArtworkCard";
import { Search, Sparkles, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Pop Culture", "Traditional", "Typography", "Landscapes & Illustrative"] as const;

interface MinimalGalleryProps {
  onSelectArtwork: (artwork: Artwork) => void;
}

const ITEMS_PER_PAGE = 12;

export default function MinimalGallery({ onSelectArtwork }: MinimalGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Filter artworks based on category & search query
  const filteredArtworks = useMemo(() => {
    return ARTWORKS.filter((art) => {
      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.canvasShape.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.sizeDimensions.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const visibleArtworks = useMemo(() => {
    return filteredArtworks.slice(0, visibleCount);
  }, [filteredArtworks, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <section id="gallery" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-calligraphy text-base sm:text-lg font-bold text-amber-900">
              Original Studio Gallery
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-ink-main tracking-tight font-normal">
            Handmade <span className="font-calligraphy text-4xl sm:text-6xl text-amber-600 italic">Canvas Collection</span>
          </h2>
        </div>

        <p className="text-sm text-ink-muted max-w-md font-sans leading-relaxed">
          Browse Guna&apos;s collection of <strong className="text-amber-900 font-semibold">{ARTWORKS.length} hand-painted physical artworks</strong>. Each piece is crafted with acrylics on woven canvas board, ready to bring warmth to your desk or wall.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-4 border-b border-amber-900/10">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-sans transition-colors duration-200 ${
                  isActive ? "text-white font-semibold" : "text-ink-muted hover:text-ink-main font-medium"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-amber-500 rounded-xl shadow-warm-amber"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            placeholder="Search by name, shape, character..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs font-sans focus:border-amber-500 focus:outline-none transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Grid with Framer Motion AnimatePresence */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[350px]"
      >
        <AnimatePresence mode="popLayout">
          {visibleArtworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onSelect={onSelectArtwork}
              priority={index < 6}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {visibleCount < filteredArtworks.length && (
        <div className="mt-16 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white border border-amber-900/15 text-ink-main hover:border-amber-500 hover:text-amber-700 text-sm font-sans font-medium transition-all backdrop-blur-md shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Discover More Artworks ({visibleArtworks.length} of {filteredArtworks.length})</span>
          </button>
        </div>
      )}
    </section>
  );
}
