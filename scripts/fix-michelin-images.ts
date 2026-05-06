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

  // Round 1 of Michelin image fixes. The bulk import re-used the same
  // generic Unsplash plate-of-food shot for both Gaggan and Haoma. Both
  // restaurants are visually distinctive enough that they deserve their
  // own imagery, and both have publicly-served, hotlinkable hero assets
  // on their official sites that I downloaded and verified end-to-end.
  const fixes: Record<string, string> = {
    // Gaggan's iconic hand-illustrated 'shopping list' menu artwork from
    // gaggan.com — instantly recognisable, wide 1920x756 hero crop.
    'gaggan-michelin-1-star':
      'https://gaggan.com/wp-content/uploads/2023/09/Menu-1920x756-1-1.png',

    // Haoma's signature plated dish from haoma.dk: orange sauce, lattice
    // tuile, dollop of caviar, with the Michelin 2024 / 50 Best / Sustainable
    // Gastronomy / OAD badges baked into the image.
    'haoma-michelin-1-star':
      'https://i0.wp.com/www.haoma.dk/wp-content/uploads/2024/06/Untitled-Your-Story-2.png?fit=1080%2C1920&ssl=1',
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
