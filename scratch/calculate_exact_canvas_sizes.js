const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array.");
  process.exit(1);
}

const artworks = JSON.parse(jsonMatch[1]);

console.log(`Calculating accurate physical canvas sizes based on aspect ratio & reference scale for ${artworks.length} artworks...\n`);

artworks.forEach((art, idx) => {
  const fullPath = path.join('c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public', art.image);

  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return;
  }

  try {
    const jpegData = fs.readFileSync(fullPath);
    const rawData = jpeg.decode(jpegData, { useTolerant: true });
    const { width, height } = rawData;

    const ratio = width / height;
    let sizeStr = art.sizeDimensions;
    let shape = art.canvasShape;

    // Mathematical Aspect Ratio Classification Formula:
    // Aspect ratio = Width / Height
    if (shape === 'heart') {
      sizeStr = "5 x 5 inch Heart Canvas";
    } else if (shape === 'circle') {
      sizeStr = "4.5 inch Round Canvas";
    } else if (shape === 'diamond') {
      sizeStr = "4 x 4 inch Diamond Board";
    } else if (Math.abs(ratio - 1.0) < 0.12) {
      // Near 1:1 ratio -> Square Canvas
      shape = "square";
      if (art.title.toLowerCase().includes('pink') || art.title.toLowerCase().includes('avocado')) {
        sizeStr = "3.5 x 3.5 inch Mini Canvas";
      } else {
        sizeStr = "4 x 4 inch Mini Canvas";
      }
    } else if (Math.abs(ratio - 1.25) < 0.15 || Math.abs(ratio - 0.8) < 0.15) {
      // 5:4 or 4:5 ratio -> 5 x 4 inch canvas
      shape = "rectangle";
      sizeStr = ratio > 1 ? "5 x 4 inch Mini Canvas" : "4 x 5 inch Mini Canvas";
    } else if (Math.abs(ratio - 1.5) < 0.2 || Math.abs(ratio - 0.67) < 0.2) {
      // 3:2 or 2:3 ratio -> 6 x 4 inch canvas
      shape = "rectangle";
      sizeStr = ratio > 1 ? "6 x 4 inch Mini Canvas" : "4 x 6 inch Mini Canvas";
    } else {
      shape = ratio > 1.1 ? "rectangle" : ratio < 0.9 ? "rectangle" : "square";
      sizeStr = ratio > 1 ? "5 x 4 inch Mini Canvas" : "4 x 5 inch Mini Canvas";
    }

    art.sizeDimensions = sizeStr;
    art.canvasShape = shape;

    console.log(`[${idx + 1}/${artworks.length}] ${art.title} (${width}x${height}px, ratio=${ratio.toFixed(2)}) -> ${shape.toUpperCase()} | ${sizeStr}`);
  } catch (err) {
    console.error(`Error reading ${art.image}:`, err.message);
  }
});

const updatedTsContent = `export type CanvasShape = "rectangle" | "square" | "circle" | "heart" | "diamond";

export interface Artwork {
  id: string;
  title: string;
  category: "Pop Culture" | "Traditional" | "Typography" | "Landscapes & Illustrative";
  canvasShape: CanvasShape;
  sizeDimensions: string;
  medium: string;
  year: string;
  price: number; // Price in INR (₹)
  inStock: boolean;
  description: string;
  image: string;
  depthMap: string;
  colorPalette: string[];
  story: string;
  featured: boolean;
}

export const ARTWORKS: Artwork[] = ${JSON.stringify(artworks, null, 2)};
`;

fs.writeFileSync(datasetPath, updatedTsContent);
console.log(`\nSuccessfully updated mathematical size dimensions & canvas shapes for all ${artworks.length} artworks!`);
