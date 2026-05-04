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

  // Round 3: replace URLs that didn't actually render in browsers.
  // - Floating market: previous Wikimedia URL had %22/%29 encoded chars
  //   (quote + paren) in the filename which some setups choke on. New URL
  //   has a clean filename.
  // - Flora Creek: previous front-about-02.jpg was unreliable; switching
  //   to a verified 985KB property photo from the same site.
  const fixes: Record<string, string> = {
    'bangkok-floating-markets-sunrise-tour':
      'https://upload.wikimedia.org/wikipedia/commons/c/c0/Damnoen_Saduak_Floating_Market.jpg',
    'flora-creek-chiang-mai-5-star-nature-wellness-retreat':
      'https://floracreekchiangmai.com/wp-content/uploads/2023/12/ccccFlora-Creek1616-scaled.jpg',
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
