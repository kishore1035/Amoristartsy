"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface AudioContextType {
  isPlaying: boolean;
  toggleSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Single global audio instance mounted across root layout
    if (typeof window !== "undefined" && !audioRef.current) {
      const audio = new Audio("/ambient-lofi.mp3");
      audio.loop = true;
      audio.volume = 0.45;
      audioRef.current = audio;

      // 1. Attempt immediate autoplay upon page load
      const startAudio = () => {
        if (!audioRef.current) return;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch(() => {
            // Autoplay blocked by browser policy until first gesture
            setIsPlaying(false);
          });
      };

      // 2. Global gesture listeners to start audio immediately on first click/touch/scroll
      const handleFirstGesture = () => {
        if (audioRef.current && audioRef.current.paused) {
          startAudio();
        }
      };

      const removeInteractionListeners = () => {
        window.removeEventListener("click", handleFirstGesture);
        window.removeEventListener("touchstart", handleFirstGesture);
        window.removeEventListener("keydown", handleFirstGesture);
        window.removeEventListener("pointerdown", handleFirstGesture);
      };

      // Try playing immediately
      startAudio();

      // Listen for first interaction if initial autoplay was restricted by browser
      window.addEventListener("click", handleFirstGesture, { once: true });
      window.addEventListener("touchstart", handleFirstGesture, { once: true });
      window.addEventListener("keydown", handleFirstGesture, { once: true });
      window.addEventListener("pointerdown", handleFirstGesture, { once: true });

      return () => {
        removeInteractionListeners();
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio playback issue:", err);
        });
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
