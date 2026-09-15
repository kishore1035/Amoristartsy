"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

interface CSSParallaxFallbackProps {
  imageSrc: string;
  altText: string;
  className?: string;
}

export default function CSSParallaxFallback({
  imageSrc,
  altText,
  className = "w-full h-full min-h-[350px]",
}: CSSParallaxFallbackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // Rotate up/down max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12;  // Rotate left/right max 12 deg

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlareStyle({ opacity: 0.35, x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlareStyle({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="w-full h-full transition-transform duration-150 ease-out relative"
        style={{ transform: transformStyle }}
      >
        <Image
          src={imageSrc}
          alt={altText}
          fill
          className="object-cover rounded-2xl"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Dynamic Sheen / Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
          style={{
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(0, 240, 255, 0.15) 35%, transparent 70%)`,
          }}
        />

        <div className="absolute inset-0 rounded-2xl border border-primary-500/20 group-hover:border-primary-500/50 transition-colors pointer-events-none" />
      </div>
    </div>
  );
}
