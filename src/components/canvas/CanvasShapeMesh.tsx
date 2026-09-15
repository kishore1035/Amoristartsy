import React, { useMemo } from "react";
import * as THREE from "three";
import { CanvasShape } from "@/data/artworks";

interface CanvasShapeMeshProps {
  shape: CanvasShape;
  width: number;
  height: number;
  material: THREE.Material;
}

export default function CanvasShapeMesh({ shape, width, height, material }: CanvasShapeMeshProps) {
  // Create Heart Shape geometry if shape === "heart"
  const heartGeometry = useMemo(() => {
    if (shape !== "heart") return null;

    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    const w = width * 0.45;
    const h = height * 0.45;

    heartShape.moveTo(x, y + h * 0.25);
    heartShape.bezierCurveTo(x, y + h * 0.7, x - w, y + h * 0.7, x - w, y + h * 0.25);
    heartShape.bezierCurveTo(x - w, y - h * 0.25, x - w * 0.5, y - h * 0.65, x, y - h);
    heartShape.bezierCurveTo(x + w * 0.5, y - h * 0.65, x + w, y - h * 0.25, x + w, y + h * 0.25);
    heartShape.bezierCurveTo(x + w, y + h * 0.7, x, y + h * 0.7, x, y + h * 0.25);

    return new THREE.ShapeGeometry(heartShape, 32);
  }, [shape, width, height]);

  if (shape === "circle") {
    return (
      <mesh material={material}>
        <circleGeometry args={[Math.min(width, height) * 0.5, 64]} />
      </mesh>
    );
  }

  if (shape === "heart" && heartGeometry) {
    return <mesh geometry={heartGeometry} material={material} />;
  }

  if (shape === "diamond") {
    return (
      <mesh rotation={[0, 0, Math.PI / 4]} material={material}>
        <planeGeometry args={[width * 0.85, height * 0.85, 32, 32]} />
      </mesh>
    );
  }

  // Standard Rectangle or Square Canvas
  return (
    <mesh material={material}>
      <planeGeometry args={[width, height, 64, 64]} />
    </mesh>
  );
}
