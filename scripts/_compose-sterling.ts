/**
 * Refresh the hero image for Sterling Sport & Wellness Club Bangkok
 * by overlaying Sanan Phanichkrivalkosil's portrait onto the existing
 * Sterling building photo. Same compositional pattern as the other
 * From Founders heroes: brand-yellow ring, soft drop shadow, portrait
 * sits on the left so the venue stays visible on the right.
 */
import sharp from 'sharp';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const BG = resolve(ROOT, 'scripts', '_sterling-bg.png');
const PORTRAIT_SRC = resolve(ROOT, 'scripts', '_sanan.png');
const OUT = resolve(ROOT, 'public', 'images', 'from-founders', 'sterling-bkk.jpg');

const FINAL_W = 1600;
const FINAL_H = 1000;
const PORTRAIT_SIZE = 620;
const RING_THICKNESS = 14;
const RING_COLOR = '#FACC15';

async function main() {
  const bg = sharp(BG)
    .resize(FINAL_W, FINAL_H, { fit: 'cover' })
    .modulate({ brightness: 0.95, saturation: 1.05 });

  const innerSize = PORTRAIT_SIZE - RING_THICKNESS * 2;
  const circleMaskSvg = Buffer.from(
    `<svg width="${innerSize}" height="${innerSize}">
       <circle cx="${innerSize / 2}" cy="${innerSize / 2}" r="${innerSize / 2}" fill="white"/>
     </svg>`
  );

  const portraitCircular = await sharp(PORTRAIT_SRC)
    .resize(innerSize, innerSize, { fit: 'cover', position: 'top' })
    .composite([{ input: circleMaskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const ringSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT_SIZE + 40}" height="${PORTRAIT_SIZE + 40}">
       <defs>
         <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
           <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000" flood-opacity="0.55"/>
         </filter>
       </defs>
       <circle cx="${(PORTRAIT_SIZE + 40) / 2}" cy="${(PORTRAIT_SIZE + 40) / 2}" r="${PORTRAIT_SIZE / 2}"
               fill="none" stroke="${RING_COLOR}" stroke-width="${RING_THICKNESS}" filter="url(#shadow)"/>
     </svg>`
  );

  const portraitLeft = 130;
  const portraitTop = Math.round((FINAL_H - PORTRAIT_SIZE) / 2);

  await bg
    .composite([
      { input: ringSvg, left: portraitLeft - 20, top: portraitTop - 20 },
      {
        input: portraitCircular,
        left: portraitLeft + RING_THICKNESS,
        top: portraitTop + RING_THICKNESS,
      },
    ])
    .jpeg({ quality: 88 })
    .toFile(OUT);

  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
