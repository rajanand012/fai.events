/**
 * Refresh the hero image for Bangkok Bachata Gang by overlaying a
 * portrait of Pei Kuo (President of EO Bangkok Metropolitan) onto the
 * existing dance-class photo. The source portrait already arrives
 * pre-masked with a pink EO-style ring, so we keep that ring rather
 * than re-stroking it in brand-yellow — it visually anchors Pei to
 * EO Bangkok Metropolitan, which is exactly the From Founders thread.
 *
 * Same compositional shape as the other From Founders heroes: portrait
 * sits on the left, the rest of the background stays visible on the
 * right.
 */
import sharp from 'sharp';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const BG = resolve(ROOT, 'scripts', '_bachata-bg.jpg');
const PORTRAIT_SRC = resolve(ROOT, 'scripts', '_pei.webp');
const OUT = resolve(ROOT, 'public', 'images', 'from-founders', 'bangkok-bachata.jpg');

const FINAL_W = 1600;
const FINAL_H = 1000;
const PORTRAIT_SIZE = 620;

async function main() {
  // Slightly darken the dance-floor photo so the portrait pops.
  const bg = sharp(BG)
    .resize(FINAL_W, FINAL_H, { fit: 'cover' })
    .modulate({ brightness: 0.85, saturation: 1.05 });

  // Pei's source is small (299x288) and already round with a pink ring.
  // Resize up with sharp's high-quality kernel and apply a soft drop
  // shadow via an SVG circle behind it.
  const portrait = await sharp(PORTRAIT_SRC)
    .resize(PORTRAIT_SIZE, PORTRAIT_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const shadowSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT_SIZE + 60}" height="${PORTRAIT_SIZE + 60}">
       <defs>
         <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
           <feGaussianBlur stdDeviation="14"/>
         </filter>
       </defs>
       <circle cx="${(PORTRAIT_SIZE + 60) / 2}" cy="${(PORTRAIT_SIZE + 60) / 2}" r="${PORTRAIT_SIZE / 2}"
               fill="rgba(0,0,0,0.55)" filter="url(#shadow)"/>
     </svg>`
  );

  const portraitLeft = 140;
  const portraitTop = Math.round((FINAL_H - PORTRAIT_SIZE) / 2);

  await bg
    .composite([
      // soft shadow behind
      { input: shadowSvg, left: portraitLeft - 30, top: portraitTop - 20 },
      // portrait (already round + ringed)
      { input: portrait, left: portraitLeft, top: portraitTop },
    ])
    .jpeg({ quality: 88 })
    .toFile(OUT);

  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
