const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

// Function to compute a 16x16 average hash (aHash) for perceptual image similarity
function computeImageHash(imagePath) {
  try {
    const fullPath = path.join('c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public', imagePath);
    if (!fs.existsSync(fullPath)) return null;

    const jpegData = fs.readFileSync(fullPath);
    const rawData = jpeg.decode(jpegData, { useTolerant: true });
    const { width, height, data } = rawData;

    // Sample down to 16x16 grid
    const grid = new Float32Array(256);
    let totalGray = 0;

    for (let gy = 0; gy < 16; gy++) {
      for (let gx = 0; gx < 16; gx++) {
        const startX = Math.floor((gx / 16) * width);
        const endX = Math.floor(((gx + 1) / 16) * width);
        const startY = Math.floor((gy / 16) * height);
        const endY = Math.floor(((gy + 1) / 16) * height);

        let sumGray = 0;
        let count = 0;

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            sumGray += gray;
            count++;
          }
        }

        const avgPixelGray = count > 0 ? sumGray / count : 0;
        grid[gy * 16 + gx] = avgPixelGray;
        totalGray += avgPixelGray;
      }
    }

    const avgGridGray = totalGray / 256;
    let bitHash = '';
    for (let i = 0; i < 256; i++) {
      bitHash += grid[i] >= avgGridGray ? '1' : '0';
    }

    return bitHash;
  } catch (err) {
    console.error(`Error hashing ${imagePath}:`, err.message);
    return null;
  }
}

// Calculate Hamming distance between two 256-bit hashes
function hammingDistance(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 999;
  let dist = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) dist++;
  }
  return dist;
}

// Main execution
const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array.");
  process.exit(1);
}

let artworks = JSON.parse(jsonMatch[1]);
console.log(`Analyzing visual perceptual similarity for ${artworks.length} artworks...\n`);

const hashes = [];
artworks.forEach((art) => {
  const hash = computeImageHash(art.image);
  hashes.push({ art, hash });
});

const duplicatesToRemove = new Set();
const duplicatePairs = [];

for (let i = 0; i < hashes.length; i++) {
  if (duplicatesToRemove.has(hashes[i].art.id)) continue;

  for (let j = i + 1; j < hashes.length; j++) {
    if (duplicatesToRemove.has(hashes[j].art.id)) continue;

    const dist = hammingDistance(hashes[i].hash, hashes[j].hash);
    // Hamming distance < 18 out of 256 indicates visually identical photo!
    if (dist < 18) {
      duplicatePairs.push({
        keeper: hashes[i].art,
        duplicate: hashes[j].art,
        dist,
      });
      duplicatesToRemove.add(hashes[j].art.id);
    }
  }
}

console.log(`Found ${duplicatePairs.length} visually identical artwork photo pairs:`);
duplicatePairs.forEach((pair) => {
  console.log(` - KEEPING: "${pair.keeper.title}" (${pair.keeper.image})`);
  console.log(`   REMOVING VISUAL DUPLICATE: "${pair.duplicate.title}" (${pair.duplicate.image}) [Distance: ${pair.dist}]`);
});

const cleanArtworks = artworks.filter((art) => !duplicatesToRemove.has(art.id));
console.log(`\nOriginal: ${artworks.length} -> Cleaned Unique Artworks: ${cleanArtworks.length}`);

const updatedTsContent = `export type CanvasShape = "rectangle" | "square" | "circle" | "heart" | "diamond" | "star";

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

export const ARTWORKS: Artwork[] = ${JSON.stringify(cleanArtworks, null, 2)};
`;

fs.writeFileSync(datasetPath, updatedTsContent);
console.log(`Successfully saved dataset with ${cleanArtworks.length} 100% distinct mini-canvas artworks!`);
