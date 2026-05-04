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

  // Round 2 of image fixes — replacements for entries the user flagged
  // as wrong or broken on the live site.
  const fixes: Record<string, string> = {
    // Was a glass-dome ceiling photo (off-topic). Use Wikimedia Commons
    // photo of a Damnoen Saduak floating market vendor.
    'bangkok-floating-markets-sunrise-tour':
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Understanding_the_%22floating_market%22_%2815801439261%29.jpg/1200px-Understanding_the_%22floating_market%22_%2815801439261%29.jpg',

    // Was a Yosemite-style mountain landscape (off-topic). Use Wikimedia
    // photo of Lebua at State Tower itself.
    'bangkok-rooftop-cocktails-lebua-sky-bar':
      'https://upload.wikimedia.org/wikipedia/commons/5/5a/Lebua_at_State_Tower_IMG_1402_01.jpg',

    // Was Krabi sea longtails (off-topic for a Bangkok river dinner cruise).
    // chaophrayacruise.com hosts a hero image we verified loads.
    'bangkok-chao-phraya-dinner-cruise-luxury':
      'https://chaophrayacruise.com/wp-content/uploads/2017/02/1.jpg',

    // The previous Flora Creek URL stopped serving a usable image. Replace
    // with a different image from the same property.
    'flora-creek-chiang-mai-5-star-nature-wellness-retreat':
      'https://floracreekchiangmai.com/wp-content/uploads/2021/02/front-about-02.jpg',

    // The previous justclimbthailand.com cover image was broken. Reuse the
    // verified Krabi-rock-climbing photo from the same area.
    'rock-climbing-in-krabi-railay-tonsai-courses-guides':
      'https://krabirockclimbing.com/wp-content/uploads/2015/05/DSC_5733-687x1024.jpg',
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
