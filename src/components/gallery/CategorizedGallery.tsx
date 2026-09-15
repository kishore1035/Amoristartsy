"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ARTWORKS, Artwork } from "@/data/artworks";
import ArtworkCard from "./ArtworkCard";
import { Filter } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

const CATEGORIES = ["All", "Pop Culture", "Cute & Illustrative"] as const;

interface CategorizedGalleryProps {
  onSelectArtwork: (artwork: Artwork) => void;
}

export default function CategorizedGallery({ onSelectArtwork }: CategorizedGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const lastStateRef = useRef<any>(null);

  const filteredArtworks = ARTWORKS.filter(
    (art) => selectedCategory === "All" || art.category === selectedCategory
  );

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".gallery-card");
    lastStateRef.current = Flip.getState(cards);

    setSelectedCategory(category);
  };

  useLayoutEffect(() => {
    if (!lastStateRef.current || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".gallery-card");
    Flip.from(lastStateRef.current, {
      targets: cards,
      duration: 0.6,
      ease: "power3.inOut",
      stagger: 0.05,
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4 }
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.3 }),
    });

    lastStateRef.current = null;
  }, [selectedCategory]);

  return (
    <section id="gallery" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-terracotta/10 border border-accent-terracotta/30 text-accent-terracotta font-mono text-xs mb-3">
            <Filter className="w-3.5 h-3.5" />
            <span>HANDPAINTED MINI-CANVAS ARCHIVE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display uppercase tracking-tight text-ink-main">
            PHYSICAL <span className="text-primary-500">CANVAS COLLECTION</span>
          </h2>
        </div>

        <p className="text-sm text-ink-muted max-w-md font-sans leading-relaxed">
          Every physical mini canvas is individually hand-painted with acrylic paints, sealed with protective varnish, and captured in natural sunlight.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-4 border-b border-white/10">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all duration-300 ${
                isActive
                  ? "bg-primary-500 text-black font-semibold shadow-warm-amber scale-105"
                  : "bg-surface-light/60 text-ink-muted hover:text-ink-main border border-white/5 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* GSAP FLIP Grid Container */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[400px]"
      >
        {filteredArtworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onSelect={onSelectArtwork}
          />
        ))}
      </div>
    </section>
  );
}
