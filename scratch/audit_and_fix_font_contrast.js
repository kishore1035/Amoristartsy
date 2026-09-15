const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('c:/Users/Padmajaa/OneDrive/Desktop/portfolio artt/src');
console.log(`Auditing text contrast in ${files.length} files...`);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix white/light text on light pastel backgrounds
  content = content.replace(/text-white/g, 'text-ink-main');
  content = content.replace(/text-gray-200/g, 'text-ink-main');
  content = content.replace(/text-gray-300/g, 'text-ink-muted');
  content = content.replace(/text-gray-400/g, 'text-ink-muted');
  content = content.replace(/text-gray-500/g, 'text-ink-muted');
  content = content.replace(/text-primary-400/g, 'text-amber-800');
  content = content.replace(/text-blue-200/g, 'text-blue-900');
  content = content.replace(/text-blue-300/g, 'text-blue-900');

  // Fix buttons that need high contrast (e.g. Amber buttons should have text-white or text-amber-950)
  // Let's ensure amber buttons have text-white or text-amber-950 font-bold
  content = content.replace(/bg-amber-500 text-ink-main/g, 'bg-amber-500 text-white font-semibold');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed contrast in: ${path.basename(filePath)}`);
  }
});

console.log("Font visibility audit complete!");
