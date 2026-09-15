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

// Group by normalized title
const titleMap = {};
artworks.forEach((art) => {
  const normTitle = art.title.trim().toLowerCase();
  if (!titleMap[normTitle]) titleMap[normTitle] = [];
  titleMap[normTitle].push(art);
});

console.log("\nDuplicate Titles Found:");
Object.keys(titleMap).forEach((title) => {
  if (titleMap[title].length > 1) {
    console.log(`\nTitle: "${titleMap[title][0].title}" (${titleMap[title].length} occurrences):`);
    titleMap[title].forEach((item) => {
      console.log(` - ID: ${item.id} | Image: ${item.image}`);
    });
  }
});

// Remove duplicate title entries, keeping the best/first entry
const uniqueTitleArtworks = [];
const seenTitles = new Set();

artworks.forEach((art) => {
  const normTitle = art.title.trim().toLowerCase();
  if (!seenTitles.has(normTitle)) {
    seenTitles.add(normTitle);
    uniqueTitleArtworks.push(art);
  } else {
    console.log(`Removing duplicate title entry: ${art.title} (${art.image})`);
  }
});

console.log(`\nCleaned dataset count: ${uniqueTitleArtworks.length}`);

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

export const ARTWORKS: Artwork[] = ${JSON.stringify(uniqueTitleArtworks, null, 2)};
`;

fs.writeFileSync(datasetPath, updatedTsContent);
console.log(`\nSuccessfully saved cleaned dataset with ${uniqueTitleArtworks.length} unique artworks!`);
