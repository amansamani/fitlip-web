import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const source = process.argv[2];
if (!source) throw new Error('Pass the screenshot source directory.');
const mapping = {
  home: '1791820322173',
  progress: '1791820322166',
  nutrition: '1791820322158',
  camera: '1791820322151',
  workouts: '1791820322144',
  tracking: '1791820322133',
  run: '1791820322123',
  coach: '1791820322115',
};
for (const [name,id] of Object.entries(mapping)) {
  await sharp(path.join(source,`${id}.jpg`)).resize({width:810,withoutEnlargement:true}).webp({quality:87}).toFile(fileURLToPath(new URL(`../public/screens/${name}.webp`,import.meta.url)));
}
console.log('App screenshots converted to optimized WebP. Originals unchanged.');
