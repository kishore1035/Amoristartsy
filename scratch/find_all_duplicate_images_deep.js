const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

// Function to compute a 16x16 Difference Hash (dHash) & Average Hash (aHash) for high-accuracy image deduplication
function getGrayscaleGrid(imagePath) {
  try {
    const fullPath = path.join('c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public', imagePath);
    if (!fs.existsSync(fullPath)) return null;

    const jpegData = fs.readFileSync(fullPath);
    const rawData = jpeg.decode(jpegData, { useTolerant: true });
    const { width, height, data } = rawData;

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

    return { grid, avgGray: totalGray / 256 };
  } catch (err) {
    console.error(`Error decoding ${imagePath}:`, err.message);
    return null;
  }
}

function computeHashes(imagePath) {
  const res = getGrayscaleGrid(imagePath);
  if (!res) return null;

  const { grid, avgGray } = res;

  // 1. Average Hash (aHash)
  let aHash = '';
  for (let i = 0; i < 256; i++) {
    aHash += grid[i] >= avgGray ? '1' : '0';
  }

  // 2. Difference Hash (dHash)
  let dHash = '';
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 15; x++) {
      dHash += grid[y * 16 + x] < grid[y * 16 + x + 1] ? '1' : '0';
    }
  }

  return { aHash, dHash };
}

function hammingDistance(h1, h2) {
  if (!h1 || !h2 || h1.length !== h2.length) return 999;
  let dist = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) dist++;
  }
  return dist;
}

const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array.");
  process.exit(1);
}

let artworks = JSON.parse(jsonMatch[1]);
console.log(`Analyzing perceptual similarity across all ${artworks.length} artworks...\n`);

const itemsWithHashes = artworks.map((art) => {
  const hashes = computeHashes(art.image);
  return { art, hashes };
});

const duplicatesToRemove = new Set();
const duplicatePairs = [];

for (let i = 0; i < itemsWithHashes.length; i++) {
  if (duplicatesToRemove.has(itemsWithHashes[i].art.id)) continue;

  for (let j = i + 1; j < itemsWithHashes.length; j++) {
    if (duplicatesToRemove.has(itemsWithHashes[j].art.id)) continue;

    const itemA = itemsWithHashes[i];
    const itemB = itemsWithHashes[j];

    if (!itemA.hashes || !itemB.hashes) continue;

    const aDist = hammingDistance(itemA.hashes.aHash, itemB.hashes.aHash);
    const dDist = hammingDistance(itemA.hashes.dHash, itemB.hashes.dHash);

    // If aHash distance < 25 OR dHash distance < 25 OR exact title match, it's a visual duplicate!
    const isTitleMatch = itemA.art.title.trim().toLowerCase() === itemB.art.title.trim().toLowerCase();

    if (aDist < 25 || dDist < 25 || isTitleMatch) {
      duplicatePairs.push({
        keeper: itemA.art,
        duplicate: itemB.art,
        aDist,
        dDist,
        reason: isTitleMatch ? "Title match" : `Perceptual distance (aHash:${aDist}, dHash:${dDist})`
      });
      duplicatesToRemove.add(itemB.art.id);
    }
  }
}

console.log(`Found ${duplicatePairs.length} duplicate artwork pairs:`);
duplicatePairs.forEach((pair, idx) => {
  console.log(`\n[${idx + 1}] KEEPING: "${pair.keeper.title}" (ID: ${pair.keeper.id}, Image: ${pair.keeper.image})`);
  console.log(`     REMOVING DUPLICATE: "${pair.duplicate.title}" (ID: ${pair.duplicate.id}, Image: ${pair.duplicate.image}) [${pair.reason}]`);
});

const cleanArtworks = artworks.filter((art) => !duplicatesToRemove.has(art.id));
console.log(`\nOriginal Catalog: ${artworks.length} -> Cleaned Catalog: ${cleanArtworks.length} artworks`);

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
console.log(`Successfully saved clean dataset into src/data/artworks.ts!`);
