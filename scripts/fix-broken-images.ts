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

  // Replacements for entries that previously had a logo, generic
  // placeholder, or topic-mismatched image. Where the venue's own site
  // had a usable hero image, we use that. Otherwise we fall back to a
  // proven Unsplash photo ID that's already in the DB and known to load.
  const fixes: Record<string, string> = {
    // Wrong topic (had Thai temple photo on an elephant page)
    'ethical-elephant-sanctuary-experience-in-phuket':
      'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800&q=80',

    // Wrong topic (had Thai temple photo on Jim Thompson silk-house page)
    'bangkok-jim-thompson-house-private-tour':
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80',

    // Was a generic logo
    'farm-to-table-experience-at-meli-chiang-mai':
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',

    // Was a generic logo, swapped for venue's own floating-market photo
    'offbeat-floating-markets-food-tour-from-bangkok':
      'https://www.bangkokfoodtours.com/wp-content/themes/bft_v2-theme/img/tours/floating/floatingmarket-video.jpg',

    // Were tiny user-icons, swapped for known Asian-food photos
    'bangkok-s-1-food-tour-street-food-hidden-gems':
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'bangkok-old-market-food-tour-klong-canals-street-eats':
      'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&q=80',

    // Were the operator's logo, swapped for their actual climbing photo
    'krabi-rock-climbing-school-at-railay-beach':
      'https://krabirockclimbing.com/wp-content/uploads/2015/05/DSC_5733-687x1024.jpg',
    'rock-climbing-expeditions-in-krabi':
      'https://krabirockclimbing.com/wp-content/uploads/2015/05/DSC_5733-687x1024.jpg',

    // Was the operator's logo; using mountain/landscape image
    'real-rocks-climbing-railay-beach-rock-climbing':
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',

    // Were resort logos, swapped for the resort's own slider hero image
    'master-herbal-detox-weight-loss-retreat':
      'https://www.thesourcesamui.com/asset/images/slider/source1.jpg',
    'master-herbal-detox-retreat-koh-samui':
      'https://www.thesourcesamui.com/asset/images/slider/source1.jpg',
    'absolute-sanctuary-wellness-longevity-resort':
      'https://www.absolutesanctuary.com/wp-content/uploads/2023/07/mainslide-absolutesanctuary-1.jpg',

    // Was a logo, swapped for an Asian-food photo
    'thai-farm-cooking-school-full-day-class':
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
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
