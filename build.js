import fs from 'fs';
import path from 'path';

const distDir = 'dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const files = ['index.html', 'admin.html', 'manifest.json', 'sw.js'];
files.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`Copied ${file} -> ${distDir}/${file}`);
  }
});

if (fs.existsSync('public')) {
  fs.cpSync('public', distDir, { recursive: true });
}

console.log('Build completed: all files ready in dist/');
