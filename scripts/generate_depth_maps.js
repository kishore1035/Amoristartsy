const fs = require('fs');
const path = require('path');

// Generates procedural radial/vignette/depth heightmap buffer saved as SVG/Canvas or BMP/PNG data url for depth map assets
function generateProceduralDepthSVG(width, height, centerBias = 0.5, focalRadius = 0.4) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="depthGrad" cx="${centerBias * 100}%" cy="45%" r="${focalRadius * 100}%" fx="${centerBias * 100}%" fy="40%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="35%" stop-color="#cccccc" />
        <stop offset="70%" stop-color="#666666" />
        <stop offset="100%" stop-color="#111111" />
      </radialGradient>
      <linearGradient id="verticalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#depthGrad)" />
    <rect width="100%" height="100%" fill="url(#verticalGrad)" mix-blend-mode="multiply" />
  </svg>`;
}

const targetDir = path.join(__dirname, '../public/artworks');

const maps = [
  { name: 'cyber_samurai_depth.svg', cx: 0.5, r: 0.5 },
  { name: 'cosmic_goddess_depth.svg', cx: 0.48, r: 0.55 },
  { name: 'crystal_forest_depth.svg', cx: 0.52, r: 0.6 },
  { name: 'neon_metropolis_depth.svg', cx: 0.5, r: 0.45 },
];

maps.forEach(m => {
  const svg = generateProceduralDepthSVG(800, 600, m.cx, m.r);
  fs.writeFileSync(path.join(targetDir, m.name), svg);
  console.log(`Created ${m.name}`);
});
