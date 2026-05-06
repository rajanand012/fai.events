/**
 * Compose the hero image for Sketch Party Shop by layering Pranika
 * Khaitan Rawat's portrait onto a celebratory pastel-and-gold party
 * background. Same composite pattern as Art Battle / Soma Health for
 * visual consistency in the From Founders section.
 *
 * One subtle change from the other two: the AI-generated background
 * leaves the rounded clear space near the center-bottom (with the cake
 * sitting just under it), so the portrait position shifts slightly to
 * land in that empty area instead of pure center-left.
 */
import sharp from 'sharp';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const BG = resolve(ROOT, 'scripts', '_sketch-bg.png');
const PORTRAIT_SRC = resolve(ROOT, 'scripts', '_pranika.png');
const OUT = resolve(ROOT, 'public', 'images', 'from-founders', 'sketch-party-shop.jpg');

const FINAL_W = 1600;
const FINAL_H = 1000;
const PORTRAIT_SIZE = 600;
const RING_THICKNESS = 14;
const RING_COLOR = '#FACC15';

async function main() {
  const bg = sharp(BG).resize(FINAL_W, FINAL_H, { fit: 'cover' }).modulate({
    brightness: 1.0,
    saturation: 1.05,
  });

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
           <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.30"/>
         </filter>
       </defs>
       <circle cx="${(PORTRAIT_SIZE + 40) / 2}" cy="${(PORTRAIT_SIZE + 40) / 2}" r="${PORTRAIT_SIZE / 2}"
               fill="none" stroke="${RING_COLOR}" stroke-width="${RING_THICKNESS}" filter="url(#shadow)"/>
     </svg>`
  );

  // The cake silhouette in the AI-generated bg sits roughly center-bottom,
  // so we place the portrait slightly off-centre to the left to leave the
  // bunting/balloons + cake compositionally visible.
  const portraitLeft = 180;
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
