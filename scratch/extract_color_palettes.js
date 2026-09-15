const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

// Function to convert RGB to HSV for precise saturation & brightness filtering
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, v };
}

// Function to extract 4 vibrant distinct hex colors from the canvas area of an artwork image
function getVibrantArtworkColors(imagePath) {
  try {
    const fullPath = path.join('c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public', imagePath);
    if (!fs.existsSync(fullPath)) {
      return ["#e69c24", "#d97a5b", "#7a8b7b", "#ffcc00"];
    }

    const jpegData = fs.readFileSync(fullPath);
    const rawImageData = jpeg.decode(jpegData, { useTolerant: true });
    const { width, height, data } = rawImageData;

    // Focus sampling on the inner 65% region of interest (where the mini canvas sits)
    const minX = Math.floor(width * 0.18);
    const maxX = Math.floor(width * 0.82);
    const minY = Math.floor(height * 0.18);
    const maxY = Math.floor(height * 0.82);

    const vibrantBuckets = {};

    for (let y = minY; y < maxY; y += 3) {
      for (let x = minX; x < maxX; x += 3) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        const { s, v } = rgbToHsv(r, g, b);

        // Filter out dull background fabric grays, pure whites, and deep black shadows
        // Keep pixels with noticeable color saturation or distinct bright/dark canvas tones
        if (s < 0.12 && (v > 0.82 || v < 0.18)) continue;

        // Quantize colors to 16-step RGB grid to group artwork hues
        const qR = Math.round(r / 20) * 20;
        const qG = Math.round(g / 20) * 20;
        const qB = Math.round(b / 20) * 20;

        const hex = `#${((1 << 24) + (qR << 16) + (qG << 8) + qB).toString(16).slice(1)}`;
        
        // Weight vibrant saturated pixels higher than dull gray background pixels
        const weight = Math.round(s * 10) + 1;
        vibrantBuckets[hex] = (vibrantBuckets[hex] || 0) + weight;
      }
    }

    // Sort by weighted frequency
    const sortedHexes = Object.keys(vibrantBuckets).sort(
      (a, b) => vibrantBuckets[b] - vibrantBuckets[a]
    );

    // Pick top 4 distinct vibrant colors
    const result = [];
    for (const hex of sortedHexes) {
      if (result.length >= 4) break;

      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      // Ensure distinctness from already selected colors (color distance > 55)
      const isDistinct = result.every((existingHex) => {
        const eR = parseInt(existingHex.slice(1, 3), 16);
        const eG = parseInt(existingHex.slice(3, 5), 16);
        const eB = parseInt(existingHex.slice(5, 7), 16);
        const dist = Math.abs(r - eR) + Math.abs(g - eG) + Math.abs(b - eB);
        return dist > 55;
      });

      if (isDistinct) {
        result.push(hex);
      }
    }

    // Fallback defaults if sampling returned fewer than 4 distinct vibrant colors
    const fallbackPalette = ["#ff3366", "#0088ff", "#ffcc00", "#33cc66"];
    while (result.length < 4) {
      result.push(fallbackPalette[result.length]);
    }

    return result;
  } catch (err) {
    console.error(`Error processing ${imagePath}:`, err.message);
    return ["#ff3366", "#0088ff", "#ffcc00", "#33cc66"];
  }
}

// Main execution
const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);

if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array from dataset file.");
  process.exit(1);
}

const artworks = JSON.parse(jsonMatch[1]);
console.log(`Recalculating vibrant canvas paint color palettes for all ${artworks.length} artworks...`);

artworks.forEach((art, index) => {
  const newPalette = getVibrantArtworkColors(art.image);
  art.colorPalette = newPalette;
  console.log(`[${index + 1}/${artworks.length}] ${art.title} -> ${newPalette.join(', ')}`);
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
console.log(`Successfully updated vibrant canvas paint color palettes for all ${artworks.length} artworks!`);
