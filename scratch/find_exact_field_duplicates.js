const fs = require('fs');

const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array.");
  process.exit(1);
}

let artworks = JSON.parse(jsonMatch[1]);
console.log(`Checking exact image path & title duplicates across ${artworks.length} artworks...`);

const seenImages = new Map();
const seenTitles = new Map();
const duplicatesToRemove = new Set();

artworks.forEach((art) => {
  const normTitle = art.title.trim().toLowerCase();
  const normImage = art.image.trim().toLowerCase();

  if (seenImages.has(normImage)) {
    console.log(`[Duplicate Image Path] Keeping "${seenImages.get(normImage).title}" (ID: ${seenImages.get(normImage).id}), Removing "${art.title}" (ID: ${art.id})`);
    duplicatesToRemove.add(art.id);
  } else {
    seenImages.set(normImage, art);
  }

  if (!duplicatesToRemove.has(art.id)) {
    if (seenTitles.has(normTitle)) {
      console.log(`[Duplicate Title] Keeping "${seenTitles.get(normTitle).title}" (ID: ${seenTitles.get(normTitle).id}), Removing "${art.title}" (ID: ${art.id})`);
      duplicatesToRemove.add(art.id);
    } else {
      seenTitles.set(normTitle, art);
    }
  }
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
console.log(`Dataset verified and updated with ${cleanArtworks.length} 100% unique items!`);
