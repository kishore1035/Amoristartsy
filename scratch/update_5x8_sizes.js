const fs = require('fs');

const datasetPath = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts';
const datasetContent = fs.readFileSync(datasetPath, 'utf8');

const jsonMatch = datasetContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse ARTWORKS array.");
  process.exit(1);
}

const artworks = JSON.parse(jsonMatch[1]);

console.log(`Updating rectangular mini canvases to 5 x 8 inch Mini Canvas for matching items...\n`);

let updatedCount = 0;

artworks.forEach((art) => {
  if (art.canvasShape === 'rectangle') {
    // If it's a portrait rectangle (e.g., 4 x 5 inch, 4 x 6 inch, 5 x 4 inch)
    if (art.sizeDimensions.includes('4 x 5') || art.sizeDimensions.includes('4 x 6') || art.sizeDimensions.includes('5 x 4')) {
      if (art.sizeDimensions.startsWith('5 x 4')) {
        art.sizeDimensions = "8 x 5 inch Mini Canvas";
      } else {
        art.sizeDimensions = "5 x 8 inch Mini Canvas";
      }
      updatedCount++;
      console.log(`Updated [${art.title}] -> ${art.sizeDimensions}`);
    }
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
console.log(`\nSuccessfully updated ${updatedCount} rectangular artworks to 5 x 8 inch Mini Canvas!`);
