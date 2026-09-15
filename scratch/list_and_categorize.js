const fs = require('fs');
const path = require('path');

const collectionDir = 'c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/public/artworks/collection';
const files = fs.readdirSync(collectionDir).filter(f => f.endsWith('.jpg')).sort();

console.log(`Total collection images: ${files.length}`);
files.forEach((f, idx) => {
  console.log(`${idx + 1}: ${f}`);
});
