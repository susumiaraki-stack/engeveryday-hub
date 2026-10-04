import fs from 'fs';
import path from 'path';

// Clean and create dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// Files to copy
const files = ['index.html', 'admin.html', 'manifest.json', 'sw.js'];
for (const file of files) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`Copied ${file} -> dist/${file}`);
  }
}

// Copy public directory if exists
if (fs.existsSync('public')) {
  fs.cpSync('public', 'dist', { recursive: true });
  console.log('Copied public/ -> dist/');
}

console.log('✅ Static build complete!');
