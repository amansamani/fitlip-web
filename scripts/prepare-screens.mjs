import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const source = process.argv[2];
if (!source) throw new Error('Pass the screenshot source directory.');
const mapping = {home:'1791475219838',coach:'1791475219800',nutrition:'1791475219791',workouts:'1791475219773',tracking:'1791475219755',camera:'1791475219782',run:'1791475219746'};
for (const [name,id] of Object.entries(mapping)) {
  await sharp(path.join(source,`${id}.jpg`)).resize({width:810,withoutEnlargement:true}).webp({quality:87}).toFile(fileURLToPath(new URL(`../public/screens/${name}.webp`,import.meta.url)));
}
console.log('App screenshots converted to optimized WebP. Originals unchanged.');
