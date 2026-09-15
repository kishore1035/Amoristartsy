const fs = require('fs');
const path = require('path');

const initialArtworks = [
  {
    id: "luffy-one-piece",
    title: "Monkey D. Luffy",
    category: "Pop Culture",
    canvasShape: "rectangle",
    sizeDimensions: "4 x 6 inch Mini Canvas",
    medium: "Hand-Painted Acrylic on Woven Canvas",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Hand-painted acrylic portrait of Luffy smiling in his straw hat against a vibrant ultramarine blue background. Styled alongside paint bottles & detail brush.",
    image: "/artworks/luffy.jpg",
    depthMap: "/artworks/cyber_samurai_depth.svg",
    colorPalette: ["#0044cc", "#ffaa00", "#cc0000", "#ffffff"],
    story: "Painted on a bright morning using rich ultramarine and vermilion acrylic pigments.",
    featured: true,
  },
  {
    id: "raincoat-duo",
    title: "Raincoat Duo (Stranger Things)",
    category: "Pop Culture",
    canvasShape: "heart",
    sizeDimensions: "5 x 5 inch Heart Canvas",
    medium: "Acrylic on Custom Heart Canvas",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Handmade heart-shaped mini acrylic canvas depicting Eleven & Mike in red & yellow raincoats under blue rain, painted on deep forest green canvas.",
    image: "/artworks/raincoat_duo.jpg",
    depthMap: "/artworks/crystal_forest_depth.svg",
    colorPalette: ["#005533", "#cc0000", "#ffcc00", "#0044aa"],
    story: "Custom heart canvas cut & stretched to capture the warm bond between Mike & Eleven.",
    featured: true,
  },
  {
    id: "demogorgon-round",
    title: "Demogorgon Bloom",
    category: "Pop Culture",
    canvasShape: "circle",
    sizeDimensions: "4.5 inch Round Circular Canvas",
    medium: "Acrylic on Circular Canvas Board",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Striking hand-painted circular mini canvas featuring the open flower-petal head of the Stranger Things Demogorgon with crimson teeth motifs.",
    image: "/artworks/demogorgon.jpg",
    depthMap: "/artworks/cyber_samurai_depth.svg",
    colorPalette: ["#0066aa", "#cc0022", "#331122", "#ffffff"],
    story: "Turning Hawkins monster lore into a handcrafted round desk display.",
    featured: true,
  },
  {
    id: "lightning-mcqueen",
    title: "Lightning McQueen 95",
    category: "Pop Culture",
    canvasShape: "square",
    sizeDimensions: "4 x 4 inch Mini Canvas",
    medium: "Vibrant Gloss Acrylic",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Hand-painted mini square canvas featuring Pixar's Lightning McQueen with his yellow lightning bolt decal against a sky blue backdrop.",
    image: "/artworks/lightning_mcqueen.jpg",
    depthMap: "/artworks/neon_metropolis_depth.svg",
    colorPalette: ["#0066ff", "#dd0000", "#ffcc00", "#ffffff"],
    story: "Ka-Chow! Pure childhood nostalgia painted outdoors under the open sky.",
    featured: true,
  },
  {
    id: "batman-emblem",
    title: "The Dark Knight Emblem",
    category: "Pop Culture",
    canvasShape: "diamond",
    sizeDimensions: "4 x 4 inch Diamond Canvas",
    medium: "Matte Acrylic on Diamond Board",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Classic yellow and matte black Batman logo emblem hand-painted on a diamond-oriented mini canvas frame.",
    image: "/artworks/batman.jpg",
    depthMap: "/artworks/neon_metropolis_depth.svg",
    colorPalette: ["#ffcc00", "#111116", "#ffffff", "#333333"],
    story: "The diamond canvas orientation adds dynamic architectural angles to Gotham's iconic silhouette.",
    featured: true,
  },
  {
    id: "pichwai-elephant",
    title: "Pichwai Blue Elephant",
    category: "Traditional",
    canvasShape: "rectangle",
    sizeDimensions: "5 x 4 inch Mini Canvas",
    medium: "Handcrafted Acrylic & Gold Detailing",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Traditional Indian Pichwai-style blue elephant adorned with gold lotus patterns on a bright yellow acrylic canvas, held amidst lush green foliage.",
    image: "/artworks/pichwai_elephant.jpg",
    depthMap: "/artworks/cosmic_goddess_depth.svg",
    colorPalette: ["#ffcc00", "#0088ff", "#ffd700", "#006633"],
    story: "Inspired by the sacred temple arts of Rajasthan. Every gold motif is painted with a single-hair detail brush.",
    featured: true,
  },
  {
    id: "love-yourself-disco",
    title: "Love Yourself Groovy Disco",
    category: "Typography",
    canvasShape: "rectangle",
    sizeDimensions: "6 x 4 inch Mini Canvas",
    medium: "70s Retro Acrylic & Rhinestone Disc",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Vibrant retro 70s groovy disco typography painted with warm red on lavender acrylic, featuring a glittering center disco ball & paint bottles.",
    image: "/artworks/love_yourself.jpg",
    depthMap: "/artworks/cosmic_goddess_depth.svg",
    colorPalette: ["#aa88ff", "#ee0044", "#ffcc00", "#ffffff"],
    story: "A daily reminder painted to slow down and appreciate oneself.",
    featured: true,
  },
  {
    id: "red-floral-study",
    title: "Vibrant Red Florals",
    category: "Landscapes & Illustrative",
    canvasShape: "rectangle",
    sizeDimensions: "5 x 3.5 inch Mini Canvas",
    medium: "Acrylic on Woven Canvas",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Hand-painted vibrant red poppies on a bright marigold orange canvas board, featuring intricate stippled flower centers.",
    image: "/artworks/red_floral.jpg",
    depthMap: "/artworks/crystal_forest_depth.svg",
    colorPalette: ["#ffaa00", "#ee0000", "#332211", "#ffffff"],
    story: "Inspired by sunny garden blooms and bold graphic botanical shapes.",
    featured: true,
  },
  {
    id: "vaporwave-sunset-palms",
    title: "Vaporwave Twilight Palms",
    category: "Landscapes & Illustrative",
    canvasShape: "square",
    sizeDimensions: "4 x 4 inch Mini Canvas",
    medium: "Gradient Acrylic Blend",
    year: "2026",
    price: 200,
    inStock: true,
    description: "Retro synthwave sunset landscape with silhouette palm trees, streetlights, and crescent moon over a purple & pink cloud twilight.",
    image: "/artworks/vaporwave_sunset.jpg",
    depthMap: "/artworks/neon_metropolis_depth.svg",
    colorPalette: ["#8844cc", "#ff3366", "#ffcc00", "#111122"],
    story: "Smooth gradient blending created using soft fan brushes and twilight pigments.",
    featured: true,
  },
  {
    id: "kawaii-avocado",
    title: "Kawaii Mini Avocado",
    category: "Landscapes & Illustrative",
    canvasShape: "square",
    sizeDimensions: "3.5 x 3.5 inch Pink Mini Canvas",
    medium: "Matte Acrylic on Pink Canvas",
    year: "2025",
    price: 200,
    inStock: true,
    description: "Cute smiling kawaii avocado slice hand-painted on a vibrant hot pink mini square canvas, photographed amidst garden flora.",
    image: "/artworks/kawaii_avocado.jpg",
    depthMap: "/artworks/crystal_forest_depth.svg",
    colorPalette: ["#ff0066", "#33cc33", "#663300", "#ffffff"],
    story: "One of the favorite mini pieces that brings an instant smile to everyone who sees it!",
    featured: true,
  },
];

const shapes = ['square', 'rectangle', 'circle', 'heart', 'diamond'];
const categories = ['Pop Culture', 'Traditional', 'Typography', 'Landscapes & Illustrative'];
const titlePrefixes = ['Studio Mini Canvas', 'Handpainted Acrylic Piece', 'Custom Desk Canvas', 'Acrylic Studio Artwork'];

const collectionDir = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public/artworks/collection';
const files = fs.readdirSync(collectionDir).filter(f => f.endsWith('.jpg'));

const fullList = [...initialArtworks];

files.forEach((file, idx) => {
  const num = (idx + 1).toString().padStart(2, '0');
  const shape = shapes[idx % shapes.length];
  const category = categories[idx % categories.length];
  const prefix = titlePrefixes[idx % titlePrefixes.length];

  fullList.push({
    id: `canvas-piece-${num}`,
    title: `${prefix} #${num}`,
    category: category,
    canvasShape: shape,
    sizeDimensions: shape === 'square' ? '4 x 4 inch Mini Canvas' : shape === 'circle' ? '4.5 inch Round Canvas' : shape === 'heart' ? '5 x 5 inch Heart Canvas' : shape === 'diamond' ? '4 x 4 inch Diamond Board' : '5 x 4 inch Mini Canvas',
    medium: 'Hand-Painted Acrylic on Canvas',
    year: '2026',
    price: 200,
    inStock: true,
    description: `Handmade physical mini canvas acrylic piece #${num} painted with vibrant pigments by Guna.`,
    image: `/artworks/collection/${file}`,
    depthMap: '/artworks/cyber_samurai_depth.svg',
    colorPalette: ['#e69c24', '#d97a5b', '#7a8b7b', '#ffffff'],
    story: `Handcrafted with care in Guna's studio workspace.`,
    featured: false,
  });
});

const tsContent = `export type CanvasShape = "rectangle" | "square" | "circle" | "heart" | "diamond";

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

export const ARTWORKS: Artwork[] = ${JSON.stringify(fullList, null, 2)};
`;

fs.writeFileSync('c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src/data/artworks.ts', tsContent);
console.log(`Generated artworks.ts dataset with ${fullList.length} items.`);
