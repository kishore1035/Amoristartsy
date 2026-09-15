"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { acrylicCanvasVertexShader, acrylicCanvasFragmentShader } from "@/shaders/acrylicCanvasShader";
import { CanvasShape } from "@/data/artworks";
import CanvasShapeMesh from "./CanvasShapeMesh";
import { isWebGLAvailable } from "@/utils/webglCheck";
import CSSParallaxFallback from "./CSSParallaxFallback";

interface DepthMeshProps {
  imageSrc: string;
  depthMapSrc: string;
  shape?: CanvasShape;
  intensity?: number;
  isInteractive?: boolean;
}

function DepthMesh({
  imageSrc,
  depthMapSrc,
  shape = "square",
  intensity = 1.0,
  isInteractive = true,
}: DepthMeshProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Load textures
  const [texture, depthMap] = useTexture([imageSrc, depthMapSrc]);

  // Target and current mouse position for smooth lerp interpolation
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const hoverState = useRef(0);

  const { viewport } = useThree();

  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
    if (depthMap) {
      depthMap.minFilter = THREE.LinearFilter;
      depthMap.magFilter = THREE.LinearFilter;
    }
  }, [texture, depthMap]);

  // Shader Uniforms definition
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDepthMap: { value: depthMap },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 1.0 },
      uIntensity: { value: intensity },
      uTime: { value: 0 },
    }),
    [texture, depthMap, intensity]
  );

  useEffect(() => {
    if (!isInteractive) return;

    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouse.current = { x, y };
      hoverState.current = 1.0;
    };

    const handlePointerLeave = () => {
      targetMouse.current = { x: 0, y: 0 };
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isInteractive]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    const lerpFactor = Math.min(delta * 6, 0.2);
    currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * lerpFactor;
    currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * lerpFactor;

    materialRef.current.uniforms.uMouse.value.set(
      currentMouse.current.x,
      currentMouse.current.y
    );
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  const aspect = texture?.image ? texture.image.width / texture.image.height : 1.0;
  const planeWidth = Math.min(viewport.width * 0.85, 4.2);
  const planeHeight = planeWidth / aspect;

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: acrylicCanvasVertexShader,
        fragmentShader: acrylicCanvasFragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [uniforms]
  );

  return (
    <CanvasShapeMesh
      shape={shape}
      width={planeWidth}
      height={planeHeight}
      material={shaderMaterial}
    />
  );
}

interface DepthMapCanvasProps {
  imageSrc: string;
  depthMapSrc: string;
  shape?: CanvasShape;
  intensity?: number;
  className?: string;
  altText?: string;
}

export default function DepthMapCanvas({
  imageSrc,
  depthMapSrc,
  shape = "square",
  intensity = 1.0,
  className = "w-full h-full min-h-[350px]",
  altText = "Handmade Mini Canvas",
}: DepthMapCanvasProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (hasWebGL === false) {
    return (
      <CSSParallaxFallback
        imageSrc={imageSrc}
        altText={altText}
        className={className}
      />
    );
  }

  if (hasWebGL === null) {
    return (
      <div className={`flex items-center justify-center bg-surface/50 rounded-2xl animate-pulse ${className}`}>
        <div className="text-primary-500/70 text-xs font-mono">Initializing Acrylic Shader...</div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <React.Suspense fallback={null}>
          <DepthMesh
            imageSrc={imageSrc}
            depthMapSrc={depthMapSrc}
            shape={shape}
            intensity={intensity}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
