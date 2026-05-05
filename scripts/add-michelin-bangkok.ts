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

// Bulk-add 35 currently Michelin-starred Bangkok restaurants. Sourced from
// guide.michelin.com Bangkok 2025/2026 listings, each with a verified-live
// booking URL (Chope, TableCheck, SevenRooms, or hotel reservation page) and
// a working image. Mix of 1, 2, and 3-star across Thai, Japanese, French,
// Indian, Chinese-Thai, Mediterranean, and Korean cuisines so visitors get
// breadth across tastes and budgets.

type RawRow = {
  slug: string;
  title: string;
  stars: number;
  cuisine: string;
  neighborhood: string;
  summaryShort: string;
  summaryLong: string;
  whySpecial: string;
  imageUrl: string;
  bookingUrl: string;
  websiteUrl: string;
  sourceUrl: string;
  priceRange: string;
  priceNote: string;
  tags: string;
  aiScore: number;
  uniquenessScore: number;
  luxuryScore: number;
  authenticityScore: number;
};

const dataPath = resolve(process.cwd(), 'scripts', '_michelin-final.json');
const rows: RawRow[] = JSON.parse(readFileSync(dataPath, 'utf-8'));

async function main() {
  console.log('DB URL:', process.env.TURSO_DATABASE_URL ? 'TURSO' : 'LOCAL');
  console.log(`Inserting ${rows.length} Michelin restaurants...`);

  const { db } = await import('../src/lib/db');
  const { experiences } = await import('../src/lib/db/schema');
  const { eq } = await import('drizzle-orm');

  const now = new Date().toISOString();
  let inserted = 0;
  let skipped = 0;

  for (const r of rows) {
    const existing = await db
      .select()
      .from(experiences)
      .where(eq(experiences.slug, r.slug))
      .limit(1);
    if (existing.length > 0) {
      skipped++;
      console.log(`SKIP (exists): ${r.title}`);
      continue;
    }

    const starsLabel = r.stars === 1 ? '1 Michelin star' : `${r.stars} Michelin stars`;
    const aiReasoning = `${starsLabel} per the Michelin Guide Bangkok. ${r.cuisine} in ${r.neighborhood}. ${r.whySpecial}`;

    await db
      .insert(experiences)
      .values({
        slug: r.slug,
        title: r.title,
        destination: 'Bangkok',
        province: 'Bangkok',
        category: 'fine-dining',
        summaryShort: r.summaryShort,
        summaryLong: r.summaryLong,
        whySpecial: r.whySpecial,
        imageUrl: r.imageUrl,
        sourceUrl: r.sourceUrl,
        websiteUrl: r.websiteUrl,
        bookingUrl: r.bookingUrl,
        socialLink: null,
        contactLink: null,
        priceRange: r.priceRange,
        priceNote: r.priceNote,
        aiScore: r.aiScore,
        aiReasoning,
        uniquenessScore: r.uniquenessScore,
        luxuryScore: r.luxuryScore,
        authenticityScore: r.authenticityScore,
        status: 'approved',
        isFeatured: 0,
        tags: r.tags,
        bestTimeToVisit: 'Year-round (book well in advance)',
        duration: 'Tasting menus typically 2-3 hours',
        discoveredAt: now,
        publishedAt: now,
        updatedAt: now,
      })
      .run();

    inserted++;
    console.log(`Added: ${r.stars}* ${r.title}`);
  }

  console.log(`\nDone. Inserted ${inserted}, skipped ${skipped}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
