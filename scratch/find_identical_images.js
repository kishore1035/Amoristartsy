const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array.");
  process.exit(1);
}

let artworks = JSON.parse(jsonMatch[1]);
console.log(`Checking file hashes for ${artworks.length} artworks...`);

const hashMap = {};
const duplicatesToRemove = new Set();

artworks.forEach((art) => {
  const fullPath = path.join('c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public', art.image);
  if (fs.existsSync(fullPath)) {
    const fileBuffer = fs.readFileSync(fullPath);
    const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');

    if (hashMap[hash]) {
      console.log(`Found duplicate image file: ${art.title} (${art.image}) matches ${hashMap[hash].title} (${hashMap[hash].image})`);
      duplicatesToRemove.add(art.id);
    } else {
      hashMap[hash] = art;
    }
  }
});

const cleanArtworks = artworks.filter((art) => !duplicatesToRemove.has(art.id));
console.log(`\nRemaining unique artworks count: ${cleanArtworks.length}`);

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

export const ARTWORKS: Artwork[] = ${JSON.stringify(cleanArtworks, null, 2)};
`;

fs.writeFileSync(datasetPath, updatedTsContent);
console.log(`Successfully saved 100% unique artwork dataset with ${cleanArtworks.length} items!`);
