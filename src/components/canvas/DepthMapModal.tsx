"use client";

import React, { useState } from "react";
import { Artwork } from "@/data/artworks";
import DepthMapCanvas from "./DepthMapCanvas";
import Image from "next/image";
import { X, Layers, Sparkles, Copy, Check, Info, Maximize, Heart } from "lucide-react";

interface DepthMapModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export default function DepthMapModal({ artwork, onClose }: DepthMapModalProps) {
  const [viewMode, setViewMode] = useState<"shader" | "2d" | "depth">("shader");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!artwork) return null;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Container Card */}
      <div className="relative w-full max-w-5xl bg-surface/90 border border-primary-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-ink-muted hover:text-ink-main hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: WebGL Shader / Media Preview Viewport */}
        <div className="w-full lg:w-3/5 h-[350px] sm:h-[450px] lg:h-auto relative bg-black flex items-center justify-center p-4">
          {viewMode === "shader" && (
            <DepthMapCanvas
              imageSrc={artwork.image}
              depthMapSrc={artwork.depthMap}
              shape={artwork.canvasShape}
              intensity={1.2}
              className="w-full h-full min-h-[300px]"
              altText={artwork.title}
            />
          )}

          {viewMode === "2d" && (
            <div className="relative w-full h-full">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-contain"
                sizes="800px"
              />
            </div>
          )}

          {viewMode === "depth" && (
            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
              <Image
                src={artwork.depthMap}
                alt={`${artwork.title} Depth Map`}
                fill
                className="object-contain filter invert opacity-90"
                sizes="800px"
              />
            </div>
          )}

          {/* View Mode Selector Switch */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 bg-black/75 border border-white/10 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setViewMode("shader")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                viewMode === "shader" ? "bg-primary-500 text-black font-semibold" : "text-ink-muted hover:text-ink-main"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Acrylic 3D Shader
            </button>

            <button
              onClick={() => setViewMode("2d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                viewMode === "2d" ? "bg-primary-500 text-black font-semibold" : "text-ink-muted hover:text-ink-main"
              }`}
            >
              <Maximize className="w-3.5 h-3.5" />
              Original Painting
            </button>

            <button
              onClick={() => setViewMode("depth")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                viewMode === "depth" ? "bg-primary-500 text-black font-semibold" : "text-ink-muted hover:text-ink-main"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Depth Map
            </button>
          </div>
        </div>

        {/* Right: Artwork Metadata & Lore Sidebar */}
        <div className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-surface/50 border-t lg:border-t-0 lg:border-l border-white/10">
          <div>
            {/* Category & Canvas Shape */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-primary-500/10 border border-primary-500/30 text-amber-800 text-xs font-mono uppercase tracking-wider">
                {artwork.category}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-accent-magenta/10 border border-accent-magenta/30 text-accent-magenta text-xs font-mono capitalize">
                {artwork.canvasShape} Canvas
              </span>
              <span className="text-xs font-mono text-ink-muted">• {artwork.sizeDimensions}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink-main mb-4">
              {artwork.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-ink-muted leading-relaxed mb-6 font-sans">
              {artwork.description}
            </p>

            {/* Artist Story */}
            <div className="p-4 rounded-xl bg-surface-light/60 border border-white/5 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-gold mb-1">
                <Heart className="w-3.5 h-3.5 text-accent-gold" />
                <span>GUNA&apos;S CANVAS STORY</span>
              </div>
              <p className="text-xs text-ink-muted italic leading-relaxed">
                &quot;{artwork.story}&quot;
              </p>
            </div>

            {/* Medium & Canvas Frame */}
            <div className="mb-6">
              <h4 className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2.5">
                Physical Canvas Medium
              </h4>
              <span className="px-3 py-1.5 rounded-lg bg-surface-light text-ink-main text-xs border border-white/10 font-mono inline-block">
                {artwork.medium}
              </span>
            </div>

            {/* Color Swatch Palette */}
            <div>
              <h4 className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2.5">
                Acrylic Color Palette
              </h4>
              <div className="flex items-center gap-3">
                {artwork.colorPalette.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => handleCopyColor(hex)}
                    title={`Click to copy ${hex}`}
                    className="group relative w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform hover:scale-110"
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

          <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-ink-muted flex items-center justify-between">
            <span>amoristartsy — handmade pieces of joy</span>
            <span>60 FPS GLSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
