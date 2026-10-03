import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Minimal 1x1 valid blush JPEG base64
// We can provide romantic aesthetic SVG and valid JPEG files
const sampleJpgBase64 = 
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

const buffer = Buffer.from(sampleJpgBase64, 'base64');

['her1.jpg', 'her2.jpg', 'us1.jpg', 'us2.jpg'].forEach(filename => {
  const filePath = path.join(outDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, buffer);
  }
});

console.log('Created placeholder image files in public/images');
