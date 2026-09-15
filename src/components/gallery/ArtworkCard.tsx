"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/data/artworks";
import { Eye, Sparkles, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface ArtworkCardProps {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
  priority?: boolean;
}

export default function ArtworkCard({ artwork, onSelect, priority = false }: ArtworkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
    );
    setGlareStyle({ opacity: 0.25, x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setTransformStyle(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    setGlareStyle({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gallery-card relative group rounded-2xl overflow-hidden glass-panel border border-amber-900/10 hover:border-amber-500/50 transition-shadow duration-300 cursor-pointer shadow-sm hover:shadow-warm-amber"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="w-full h-full transition-transform duration-150 ease-out"
        style={{ transform: transformStyle }}
      >
        {/* Photo Container */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50"
          onClick={() => onSelect(artwork)}
        >
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Glare Sheen Overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-10"
            style={{
              opacity: glareStyle.opacity,
              background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 75%)`,
            }}
          />

          {/* Hover / Tap Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={() => onSelect(artwork)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-ink-main font-semibold text-xs shadow-sm hover:bg-amber-50 transition-all transform translate-y-2 group-hover:translate-y-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </button>

            <Link
              href={`/order?item=${artwork.id}`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-white font-semibold text-xs shadow-warm-amber hover:bg-amber-600 transition-all transform translate-y-2 group-hover:translate-y-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order ₹{artwork.price}</span>
            </Link>
          </div>

          {/* Shape & Category Tags */}
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-20 flex flex-wrap gap-1 sm:gap-1.5">
            <span className="px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 border border-amber-900/10 backdrop-blur-md text-[10px] sm:text-[11px] font-sans text-amber-900 font-semibold shadow-xs">
              {artwork.category}
            </span>
            <span className="px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 border border-amber-900/10 backdrop-blur-md text-xs font-calligraphy text-accent-terracotta font-bold shadow-xs">
              {artwork.canvasShape} canvas
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-20">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-sans font-bold text-xs shadow-warm-amber">
              ₹{artwork.price}
            </span>
          </div>
        </div>

        {/* Card Footer Info */}
        <div className="p-4 sm:p-5 flex flex-col justify-between" onClick={() => onSelect(artwork)}>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-ink-main truncate group-hover:text-amber-700 transition-colors">
              {artwork.title}
            </h3>
            <p className="text-xs text-ink-muted line-clamp-2 mt-1.5 font-sans leading-relaxed">
              {artwork.description}
            </p>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {artwork.colorPalette.slice(0, 4).map((hex) => (
                <span
                  key={hex}
                  className="w-2.5 h-2.5 rounded-full border border-amber-900/20"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs font-calligraphy text-amber-900/80 font-bold">
              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate max-w-[130px]">{artwork.sizeDimensions}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
