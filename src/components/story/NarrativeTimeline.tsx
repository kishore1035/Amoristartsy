"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Heart, Quote } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STORY_STAGES = [
  {
    step: "01",
    label: "THE FIRST STROKE",
    quoteSnippet: "I never thought a paintbrush would become my favorite way to say things I couldn’t put into words.",
    body: "It started as just a little hobby, something I did for fun. But somewhere along the way, painting became my escape. A place where I could slow everything down, clear my head, and just vibe with the colors.",
    image: "/artworks/luffy.jpg",
    bgColor: "#0d0c0a",
    accent: "#e69c24",
  },
  {
    step: "02",
    label: "STORIES IN COLOR",
    quoteSnippet: "Every canvas became its own little story.",
    body: "Sometimes it was a dreamy place I wanted to be, sometimes a character I loved, sometimes just a face with no name. Other times, it was some random thought or moment that stayed in my head.",
    image: "/artworks/raincoat_duo.jpg",
    bgColor: "#14100c",
    accent: "#d97a5b",
  },
  {
    step: "03",
    label: "SHARED JOY",
    quoteSnippet: "I guess I started painting the things that made me happy, hoping they’d make somebody else feel something too.",
    body: "Transforming favorite pop culture icons and cozy moments onto mini physical canvases that bring warmth to desks and cozy corners.",
    image: "/artworks/lightning_mcqueen.jpg",
    bgColor: "#0c120e",
    accent: "#7a8b7b",
  },
  {
    step: "04",
    label: "PIECES OF JOY",
    quoteSnippet: "Maybe someday, it’ll sit in someone’s home, and become a little part of a memory they never wanna forget.",
    body: "Every piece I make has the same kinda hope behind it—a handmade piece of joy crafted with love by Guna.",
    image: "/artworks/kawaii_avocado.jpg",
    bgColor: "#140c10",
    accent: "#e07a93",
  },
];

export default function NarrativeTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !bgRef.current) return;

    const sections = containerRef.current.querySelectorAll(".story-panel");

    const timelineTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${sections.length * 100}%`,
      pin: true,
      scrub: 0.8,
    });

    sections.forEach((section, idx) => {
      const milestone = STORY_STAGES[idx];

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: () => {
          if (bgRef.current) {
            bgRef.current.style.backgroundColor = milestone.bgColor;
          }
        },
      });
    });

    return () => {
      timelineTrigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="story" ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-background">
      <div
        ref={bgRef}
        className="absolute inset-0 transition-colors duration-700 ease-out pointer-events-none"
        style={{ backgroundColor: STORY_STAGES[0].bgColor }}
      />

      <div className="relative z-10 w-full h-screen flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-terracotta/10 border border-accent-terracotta/30 text-accent-terracotta font-mono text-xs mb-8 w-max">
          <Heart className="w-3.5 h-3.5" />
          <span>FROM CANVAS TO SCREEN // GUNA&apos;S ORIGIN STORY</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Story Quotes */}
          <div className="lg:col-span-7 space-y-6">
            {STORY_STAGES.map((s) => (
              <div key={s.step} className="story-panel group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-mono font-bold" style={{ color: s.accent }}>
                    {s.step}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-mono text-ink-muted">{s.label}</span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-light/50 border border-white/5 backdrop-blur-md mb-3">
                  <Quote className="w-5 h-5 text-ink-muted mb-2" />
                  <p className="text-base sm:text-lg font-serif italic text-ink-main leading-relaxed">
                    &quot;{s.quoteSnippet}&quot;
                  </p>
                </div>

                <p className="text-sm text-ink-muted font-sans leading-relaxed pl-2">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Physical Artwork Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden glass-panel border border-white/10 p-2 shadow-2xl">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={STORY_STAGES[0].image}
                  alt="Guna Mini Canvas Painting"
                  fill
                  className="object-cover"
                  sizes="500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-ink-muted">
                  <span>HANDMADE WITH LOVE</span>
                  <span className="text-amber-800 font-bold">SCRUB TO SCROLL ↓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
