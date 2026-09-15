export function createFallbackDepthTexture(): string {
  if (typeof window === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Radial gradient: white in center (high depth/near), black at edges (low depth/far)
  const grad = ctx.createRadialGradient(256, 230, 20, 256, 256, 300);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.4, "#cccccc");
  grad.addColorStop(0.7, "#666666");
  grad.addColorStop(1, "#111111");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  return canvas.toDataURL("image/png");
}
