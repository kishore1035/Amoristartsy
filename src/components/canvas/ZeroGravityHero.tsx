"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Image from "next/image";
import { ARTWORKS, Artwork } from "@/data/artworks";
import { Sparkles, Maximize2, RefreshCw, Zap, Compass, Heart } from "lucide-react";

interface ZeroGravityHeroProps {
  onSelectArtwork: (artwork: Artwork) => void;
}

interface PhysicsCardState {
  id: string;
  x: number;
  y: number;
  angle: number;
  artwork: Artwork;
}

export default function ZeroGravityHero({ onSelectArtwork }: ZeroGravityHeroProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesMapRef = useRef<Map<string, Matter.Body>>(new Map());
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  const [cardStates, setCardStates] = useState<PhysicsCardState[]>([]);
  const [activeRepulsion, setActiveRepulsion] = useState<boolean>(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 },
    });
    engineRef.current = engine;

    const world = engine.world;

    const wallThickness = 100;
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true }),
    ];
    Matter.Composite.add(world, walls);

    const cardWidth = Math.min(width * 0.24, 210);
    const cardHeight = cardWidth;
    const newBodiesMap = new Map<string, Matter.Body>();

    ARTWORKS.forEach((art, index) => {
      const spawnX = (index % 3 === 0 ? width * 0.2 : index % 3 === 1 ? width * 0.5 : width * 0.8) + (Math.random() * 60 - 30);
      const spawnY = (index < 3 ? height * 0.3 : height * 0.65) + (Math.random() * 50 - 25);

      const cardBody = Matter.Bodies.rectangle(spawnX, spawnY, cardWidth, cardHeight, {
        chamfer: { radius: art.canvasShape === "circle" ? cardWidth * 0.45 : 16 },
        frictionAir: 0.035,
        restitution: 0.85,
        density: 0.002,
        angle: (Math.random() - 0.5) * 0.3,
        label: art.id,
      });

      Matter.Body.setVelocity(cardBody, {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
      });
      Matter.Body.setAngularVelocity(cardBody, (Math.random() - 0.5) * 0.02);

      newBodiesMap.set(art.id, cardBody);
    });

    bodiesMapRef.current = newBodiesMap;
    Matter.Composite.add(world, Array.from(newBodiesMap.values()));

    const mouse = Matter.Mouse.create(sceneRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15,
        damping: 0.1,
        render: { visible: false },
      },
    });
    Matter.Composite.add(world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "startdrag", (evt: any) => {
      if (evt && evt.body && evt.body.label) {
        setDraggedId(evt.body.label);
      }
    });
    Matter.Events.on(mouseConstraint, "enddrag", () => {
      setDraggedId(null);
    });

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    let animationFrameId: number;

    const updatePhysicsSync = () => {
      const mousePos = mousePosRef.current;
      const repulsionRadius = 250;
      const repulsionForce = 0.00045;

      newBodiesMap.forEach((body) => {
        const dx = body.position.x - mousePos.x;
        const dy = body.position.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0 && dist < repulsionRadius && activeRepulsion) {
          const forceFactor = (1 - dist / repulsionRadius) * repulsionForce;
          const forceX = (dx / dist) * forceFactor * body.mass;
          const forceY = (dy / dist) * forceFactor * body.mass;

          Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
        }
      });

      const updatedStates: PhysicsCardState[] = [];
      newBodiesMap.forEach((body, id) => {
        const artwork = ARTWORKS.find((a) => a.id === id);
        if (artwork) {
          updatedStates.push({
            id,
            x: body.position.x,
            y: body.position.y,
            angle: body.angle,
            artwork,
          });
        }
      });

      setCardStates(updatedStates);
      animationFrameId = requestAnimationFrame(updatePhysicsSync);
    };

    animationFrameId = requestAnimationFrame(updatePhysicsSync);

    const handleResize = () => {
      if (!sceneRef.current || !engineRef.current) return;
      const newW = sceneRef.current.clientWidth;
      const newH = sceneRef.current.clientHeight;

      Matter.Body.setPosition(walls[0], { x: newW / 2, y: -wallThickness / 2 });
      Matter.Body.setPosition(walls[1], { x: newW / 2, y: newH + wallThickness / 2 });
      Matter.Body.setPosition(walls[2], { x: -wallThickness / 2, y: newH / 2 });
      Matter.Body.setPosition(walls[3], { x: newW + wallThickness / 2, y: newH / 2 });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [activeRepulsion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000 };
  };

  const handleShuffleImpulse = () => {
    bodiesMapRef.current.forEach((body) => {
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
    });
  };

  return (
    <section
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-screen min-h-[720px] overflow-hidden bg-background select-none flex items-center justify-center"
    >
      {/* Background Warm Radial Glow */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      {/* Floating Physics Art Cards Layer */}
      {cardStates.map((state) => {
        const isDragged = draggedId === state.id;
        const shape = state.artwork.canvasShape;

        let shapeRadiusClass = "rounded-2xl";
        if (shape === "circle") shapeRadiusClass = "rounded-full aspect-square";

        return (
          <div
            key={state.id}
            onClick={() => onSelectArtwork(state.artwork)}
            className={`absolute top-0 left-0 w-[180px] sm:w-[210px] h-[180px] sm:h-[210px] -ml-[90px] sm:-ml-[105px] -mt-[90px] sm:-mt-[105px] p-1.5 glass-panel border border-white/10 cursor-grab active:cursor-grabbing transition-shadow duration-300 z-20 group ${shapeRadiusClass} ${
              isDragged ? "ring-2 ring-primary-500 shadow-warm-amber scale-105" : "hover:shadow-warm-amber"
            }`}
            style={{
              transform: `translate3d(${state.x}px, ${state.y}px, 0px) rotate(${state.angle}rad)`,
              touchAction: "none",
            }}
          >
            <div className={`relative w-full h-full overflow-hidden pointer-events-none ${shapeRadiusClass}`}>
              <Image
                src={state.artwork.image}
                alt={state.artwork.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="210px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-amber-800 block">
                    {state.artwork.sizeDimensions}
                  </span>
                  <h4 className="text-xs font-semibold text-ink-main truncate max-w-[120px]">
                    {state.artwork.title}
                  </h4>
                </div>
                <div className="w-6 h-6 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-black transition-colors">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Hero Typography Foreground */}
      <div className="relative z-10 text-center max-w-4xl px-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-light/70 border border-primary-500/30 text-amber-800 font-mono text-xs mb-6 backdrop-blur-md shadow-glass pointer-events-auto">
          <Heart className="w-3.5 h-3.5 text-accent-terracotta" />
          <span>AMORISTARTSY // HANDMADE PIECES OF JOY</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink-main font-display uppercase leading-tight mb-6">
          HAND-PAINTED MINI CANVASES & <br />
          <span className="bg-gradient-to-r from-primary-500 via-accent-terracotta to-accent-rose bg-clip-text text-transparent">
            ARTISTIC ESCAPES
          </span>
        </h1>

        <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto mb-8 font-sans font-light leading-relaxed">
          Step into Guna&apos;s zero-gravity mini-canvas studio. Experience physical mini canvases floating in zero gravity with tactile acrylic grain bump shaders.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
          <button
            onClick={handleShuffleImpulse}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-500 text-black font-semibold text-sm hover:bg-primary-400 transition-all shadow-warm-amber active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Zero-G Float Impulse
          </button>

          <button
            onClick={() => setActiveRepulsion(!activeRepulsion)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all backdrop-blur-md active:scale-95 ${
              activeRepulsion
                ? "border-primary-500/50 bg-primary-500/10 text-primary-500 hover:bg-primary-500/20"
                : "border-gray-700 bg-surface/50 text-ink-muted hover:text-ink-main"
            }`}
          >
            <Zap className="w-4 h-4" />
            Cursor Repulsion: {activeRepulsion ? "ON" : "OFF"}
          </button>

          <a
            href="#gallery"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-light/80 border border-white/10 text-ink-main hover:border-white/30 text-sm font-medium transition-all backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-accent-terracotta" />
            Explore Mini Canvases
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10 hidden sm:flex items-center gap-3 text-xs font-mono text-ink-muted bg-surface/40 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-primary-500 animate-ping" />
        <span>Hover cursor to push floating mini-canvases • Drag to throw • Click for GLSL acrylic shader</span>
      </div>
    </section>
  );
}
