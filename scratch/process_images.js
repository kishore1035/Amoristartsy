const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public/artworks_extracted';
const destDir = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public/artworks/collection';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));

console.log(`Found ${files.length} image files.`);

const artworkList = [];

files.forEach((file, index) => {
  const num = (index + 1).toString().padStart(2, '0');
  const newName = `art_${num}.jpg`;
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, newName);

  fs.copyFileSync(srcPath, destPath);

  // Generate varied canvas shapes and titles for Guna's collection
  const shapes = ['square', 'rectangle', 'circle', 'heart', 'diamond'];
  const categories = ['Pop Culture', 'Traditional', 'Typography', 'Landscapes & Illustrative'];

  const shape = shapes[index % shapes.length];
  const category = categories[index % categories.length];

  artworkList.push({
    id: `mini-canvas-${num}`,
    title: `Mini Canvas Edition #${num}`,
    category: category,
    canvasShape: shape,
    sizeDimensions: shape === 'square' ? '4 x 4 inch Mini Canvas' : shape === 'circle' ? '4.5 inch Round Canvas' : shape === 'heart' ? '5 x 5 inch Heart Canvas' : shape === 'diamond' ? '4 x 4 inch Diamond Board' : '5 x 4 inch Mini Canvas',
    medium: 'Hand-Painted Acrylic on Canvas',
    year: '2026',
    price: 200,
    inStock: true,
    description: `Handcrafted mini acrylic canvas piece #${num} painted with rich pigments and detail by Guna.`,
    image: `/artworks/collection/${newName}`,
    depthMap: '/artworks/cyber_samurai_depth.svg',
    colorPalette: ['#e69c24', '#d97a5b', '#7a8b7b', '#ffffff'],
    story: `Hand-painted in Guna's studio workspace with acrylic colors and love.`,
    featured: index < 6,
  });
});

console.log(`Successfully processed ${artworkList.length} artwork images.`);
