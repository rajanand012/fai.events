/**
 * Compose the hero image for Art Battle Bangkok by layering Noel Nedli's
 * portrait onto a generated paint-splash background. We do the composite
 * locally with sharp because the OpenAI image-edit tool kept failing on
 * the wrapper level.
 *
 * Final layout:
 *   - 1600 x 1000 background (paint splashes, easel + crowd silhouettes)
 *   - Circular Noel portrait, ~640px, positioned center-left
 *   - Brand-yellow ring around the portrait
 *   - Slight outer drop-shadow so the portrait sits above the splashes
 */
import sharp from 'sharp';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const BG = resolve(ROOT, 'scripts', '_art-battle-bg.png');
const NOEL = resolve(ROOT, 'scripts', '_noel.png');
const OUT = resolve(ROOT, 'public', 'images', 'from-founders', 'art-battle.jpg');

const FINAL_W = 1600;
const FINAL_H = 1000;
const PORTRAIT_SIZE = 640; // diameter of circular portrait
const RING_THICKNESS = 14;
const RING_COLOR = '#FACC15'; // brand yellow-ish

async function main() {
  // 1. Background — resize/crop to 1600x1000, then darken slightly so the
  //    portrait stands out without losing the colour energy.
  const bg = sharp(BG).resize(FINAL_W, FINAL_H, { fit: 'cover' }).modulate({
    brightness: 0.92,
    saturation: 1.15,
  });

  // 2. Circular mask SVG matching the portrait diameter (with a small
  //    inset so the ring appears around the photo, not on top of it).
  const innerSize = PORTRAIT_SIZE - RING_THICKNESS * 2;
  const circleMaskSvg = Buffer.from(
    `<svg width="${innerSize}" height="${innerSize}">
       <circle cx="${innerSize / 2}" cy="${innerSize / 2}" r="${innerSize / 2}" fill="white"/>
     </svg>`
  );

  const portraitCircular = await sharp(NOEL)
    .resize(innerSize, innerSize, { fit: 'cover', position: 'top' })
    .composite([{ input: circleMaskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 3. Yellow ring as an SVG circle the size of PORTRAIT_SIZE with a
  //    transparent inner cut-out via stroke-only, plus a soft outer
  //    shadow that gets baked into the ring image.
  const ringSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT_SIZE + 40}" height="${PORTRAIT_SIZE + 40}">
       <defs>
         <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
           <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.45"/>
         </filter>
       </defs>
       <circle cx="${(PORTRAIT_SIZE + 40) / 2}" cy="${(PORTRAIT_SIZE + 40) / 2}" r="${PORTRAIT_SIZE / 2}"
               fill="none" stroke="${RING_COLOR}" stroke-width="${RING_THICKNESS}" filter="url(#shadow)"/>
     </svg>`
  );

  // 4. Position: center-left so the right side keeps the easel/crowd
  //    silhouettes visible.
  const portraitLeft = 120; // padding from left
  const portraitTop = Math.round((FINAL_H - PORTRAIT_SIZE) / 2);

  // 5. Compose final image
  await bg
    .composite([
      // ring (with shadow, slightly larger box than portrait)
      {
        input: ringSvg,
        left: portraitLeft - 20,
        top: portraitTop - 20,
      },
      // portrait inside the ring
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
