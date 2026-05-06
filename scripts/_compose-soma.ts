/**
 * Compose the hero image for Soma Health by layering Nutchaphon
 * Kittichaiwong (Joey)'s portrait onto an AI-generated longevity-clinic
 * background (DNA helix, floating cells, navy + gold palette). Same
 * pattern as scripts/_compose-art-battle.ts — keeps the From Founders
 * imagery visually consistent (yellow ring, soft drop shadow) while
 * giving each entry its own distinctive backdrop.
 */
import sharp from 'sharp';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const BG = resolve(ROOT, 'scripts', '_soma-bg.png');
const PORTRAIT_SRC = resolve(ROOT, 'scripts', '_nutchaphon.png');
const OUT = resolve(ROOT, 'public', 'images', 'from-founders', 'soma-health.jpg');

const FINAL_W = 1600;
const FINAL_H = 1000;
const PORTRAIT_SIZE = 640;
const RING_THICKNESS = 14;
const RING_COLOR = '#FACC15'; // brand yellow

async function main() {
  const bg = sharp(BG).resize(FINAL_W, FINAL_H, { fit: 'cover' }).modulate({
    brightness: 0.96,
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
           <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000" flood-opacity="0.55"/>
         </filter>
       </defs>
       <circle cx="${(PORTRAIT_SIZE + 40) / 2}" cy="${(PORTRAIT_SIZE + 40) / 2}" r="${PORTRAIT_SIZE / 2}"
               fill="none" stroke="${RING_COLOR}" stroke-width="${RING_THICKNESS}" filter="url(#shadow)"/>
     </svg>`
  );

  const portraitLeft = 120;
  const portraitTop = Math.round((FINAL_H - PORTRAIT_SIZE) / 2);

  await bg
    .composite([
      {
        input: ringSvg,
        left: portraitLeft - 20,
        top: portraitTop - 20,
      },
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
