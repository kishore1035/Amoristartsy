"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export default function SoundController() {
  const { isPlaying, toggleSound } = useAudio();

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? "Mute Studio Music" : "Play Studio Music"}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-mono transition-all backdrop-blur-md whitespace-nowrap ${
        isPlaying
          ? "border-amber-500 bg-amber-500/15 text-amber-900 shadow-warm-amber font-semibold"
          : "border-amber-900/15 bg-white/80 text-ink-muted hover:text-ink-main hover:border-amber-900/30 shadow-sm"
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-amber-700 animate-pulse shrink-0" />
          <span className="hidden sm:inline">MUSIC: ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="hidden sm:inline">MUSIC: OFF</span>
        </>
      )}
    </button>
  );
}
