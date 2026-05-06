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

  // Round 2 of Michelin image fixes — same pattern as round 1: the bulk
  // import had assigned generic Unsplash placeholders. Both replacements
  // were downloaded and visually verified to match the actual subjects.
  const fixes: Record<string, string> = {
    // The Wikipedia/Wikimedia photo of Jay Fai cooking in her trademark
    // ski goggles and black beanie over the wok — the single most
    // recognisable image associated with the restaurant.
    'jay-fai-michelin-1-star':
      'https://upload.wikimedia.org/wikipedia/commons/2/22/Jay_Fai%2C_bangkok_20180406.jpg',

    // Chef Garima Arora at Gaa from World's 50 Best's discovery filestore.
    // She is the first Indian woman to win two Michelin stars, and the
    // burgundy-banquette dining room behind her is signature Gaa.
    'gaa-michelin-2-stars':
      'https://www.theworlds50best.com/discovery/filestore/jpg/Gaa-Bangkok-Thailand-1.jpg',
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
