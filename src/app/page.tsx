"use client";

import React, { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import MinimalHero from "@/components/hero/MinimalHero";
import MinimalGallery from "@/components/gallery/MinimalGallery";
import ArtworkModal from "@/components/gallery/ArtworkModal";
import MinimalStory from "@/components/story/MinimalStory";
import Footer from "@/components/ui/Footer";
import { Artwork } from "@/data/artworks";

export default function Home() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <main className="relative min-h-screen bg-background text-ink-main selection:bg-amber-200 selection:text-amber-950 overflow-x-hidden">
      {/* Header Navbar */}
      <Navbar />

      {/* Ultra-Minimal Hero Header */}
      <MinimalHero />

      {/* Minimal Gallery */}
      <MinimalGallery onSelectArtwork={(art) => setSelectedArtwork(art)} />

      {/* Guna's Bio Story Section */}
      <MinimalStory />

      {/* Artwork Inspection Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />

      {/* Minimal Footer */}
      <Footer />
    </main>
  );
}
