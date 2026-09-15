const fs = require('fs');

const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array.");
  process.exit(1);
}

let artworks = JSON.parse(jsonMatch[1]);
console.log(`Original artwork count: ${artworks.length}`);

// Deduplicate based on image path & title
const seenImages = new Set();
const seenIds = new Set();
const deduplicated = [];
const removed = [];

artworks.forEach((art, index) => {
  const normImage = art.image.trim().toLowerCase();
  const normId = art.id.trim();

  if (seenImages.has(normImage)) {
    removed.push({ reason: 'Duplicate Image', item: art });
  } else if (seenIds.has(normId)) {
    // If ID is duplicate, generate a unique ID
    art.id = `${normId}_${index}`;
    seenImages.add(normImage);
    seenIds.add(art.id);
    deduplicated.push(art);
  } else {
    seenImages.add(normImage);
    seenIds.add(normId);
    deduplicated.push(art);
  }
});

console.log(`Deduplicated artwork count: ${deduplicated.length}`);
console.log(`Removed ${removed.length} duplicates:`);
removed.forEach((r) => console.log(` - [${r.reason}] ${r.item.title} (${r.item.image})`));

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

export const ARTWORKS: Artwork[] = ${JSON.stringify(deduplicated, null, 2)};
`;

fs.writeFileSync(datasetPath, updatedTsContent);
console.log(`\nSuccessfully cleaned and saved deduplicated dataset with ${deduplicated.length} unique artworks!`);
