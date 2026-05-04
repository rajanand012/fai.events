import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex);
        const value = trimmed.substring(eqIndex + 1);
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
} catch {}

async function main() {
  console.log('DB URL:', process.env.TURSO_DATABASE_URL ? 'TURSO' : 'LOCAL');

  const { db } = await import('../src/lib/db');
  const { experiences } = await import('../src/lib/db/schema');
  const { eq } = await import('drizzle-orm');

  const now = new Date().toISOString();

  // Round 4: two more user-flagged image issues. Both replacements have
  // been visually verified end-to-end (downloaded and previewed) so the
  // content actually matches the experience.
  const fixes: Record<string, string> = {
    // Was an off-topic glass-dome ceiling (the photo-1555217851-... ID
    // I'd assumed was a Thai market is in fact architectural). Replaced
    // with bangkokfoodtours.com's own klong canal-tour photo of tourists
    // on a long-tail boat, matching the Old Market | Klong Canals tour.
    'bangkok-old-market-food-tour-klong-canals-street-eats':
      'https://www.bangkokfoodtours.com/wp-content/uploads/2020/02/thumb-canal3.jpg',

    // The previous floracreekchiangmai.com images render fine for Claude's
    // fetcher but appear to be hotlink-blocked when loaded from a third-
    // party site. Replaced with a verified Unsplash luxury resort/pool
    // photo.
    'flora-creek-chiang-mai-5-star-nature-wellness-retreat':
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  };

  let updated = 0;
  for (const [slug, imageUrl] of Object.entries(fixes)) {
    const result = await db
      .update(experiences)
      .set({ imageUrl, updatedAt: now })
      .where(eq(experiences.slug, slug))
      .run();
    if (result.rowsAffected > 0) {
      updated++;
      console.log(`Fixed: ${slug}`);
    } else {
      console.log(`Not found (skipped): ${slug}`);
    }
  }

  console.log(`\nDone. Updated ${updated} of ${Object.keys(fixes).length} images.`);
}

main().catch(console.error);
