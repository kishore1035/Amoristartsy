"use client";

import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const handlePointerMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest(".gallery-card") ||
          target.closest("button") ||
          target.closest("a"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let animationFrameId: number;

    const animateTrail = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22,
      }));
      animationFrameId = requestAnimationFrame(animateTrail);
    };

    animationFrameId = requestAnimationFrame(animateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos, isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-primary-500 rounded-full pointer-events-none z-50 -ml-1 -mt-1 shadow-warm-amber"
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0px)` }}
      />

      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-50 transition-all duration-200 ease-out border ${
          isHovered
            ? "w-12 h-12 -ml-6 -mt-6 border-accent-terracotta bg-accent-terracotta/10 shadow-warm-terracotta scale-125"
            : "w-8 h-8 -ml-4 -mt-4 border-primary-500/60 bg-primary-500/5 shadow-warm-amber"
        }`}
        style={{ transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0px)` }}
      />
    </>
  );
}
