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

  const slug = 'growth-coaching-with-shivani-gupta';
  const now = new Date().toISOString();

  const existing = await db.select().from(experiences).where(eq(experiences.slug, slug)).limit(1);
  if (existing.length > 0) {
    console.log('Shivani Gupta entry already exists. Updating...');
    await db.update(experiences).set({
      sourceUrl: 'https://www.askshivani.com/',
      websiteUrl: 'https://www.askshivani.com/',
      bookingUrl: 'https://www.askshivani.com/',
      updatedAt: now,
    }).where(eq(experiences.slug, slug)).run();
    console.log('Updated existing entry.');
    return;
  }

  await db.insert(experiences).values({
    slug,
    title: 'Growth Coaching with Shivani Gupta',
    destination: 'Available Across Thailand',
    province: 'Bangkok',
    category: 'workshops',
    summaryShort:
      'Help your leadership team grow faster and lead better with Shivani Gupta: TEDx speaker, eight-time author, and growth coach across 21 countries.',
    summaryLong: [
      "Shivani Gupta is a global speaker, growth coach, and author who has presented in 21 countries and delivered a TEDx talk. She holds the CSP (Certified Speaking Professional) accreditation, is a member of the Golden Key Society, and has authored eight leadership books, with a track record of awards from business women's and entrepreneurship organisations.",
      "Her work is built around one idea: helping leadership teams grow faster and lead better. The mechanism is two-sided. She helps founders make their business less dependent on them, while at the same time developing the people inside the business into leaders who can carry more. For EO and YPO members, that is the highest-leverage problem there is.",
      "Engagements range from one-on-one Growth Calls to deeper work with leadership teams, plus keynote and breakout speaking for chapters and forums. Shivani also publishes a free 'Getting Your People to Step Up' guide that captures the core of her approach to engagement and retention.",
      "If your forum or company is at the inflection point where the founder is the bottleneck, Shivani is one of the most experienced people in the world at moving you past it.",
    ].join('\n\n'),
    whySpecial:
      "Shivani's speciality is the founder-as-bottleneck problem: she helps businesses become less dependent on the founder while their people grow into leaders who can carry more. With a 21-country, eight-book, TEDx-validated track record, few coaches bring this much depth to a single, high-leverage outcome.",
    imageUrl:
      'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2153156104/settings_images/16ab11a-5cfa-f04a-db75-738a724bf_shivani_portrait_picture.png',
    sourceUrl: 'https://www.askshivani.com/',
    websiteUrl: 'https://www.askshivani.com/',
    bookingUrl: 'https://www.askshivani.com/',
    socialLink: null,
    contactLink: null,
    priceRange: '$$$',
    priceNote: 'Custom pricing for one-on-one coaching, team work, and speaking',
    aiScore: 86,
    aiReasoning:
      'Globally recognised growth coach with eight authored leadership books, a TEDx talk, CSP accreditation, and engagements across 21 countries. Strong fit for EO and YPO forums working through the founder-as-bottleneck problem.',
    uniquenessScore: 86,
    luxuryScore: 78,
    authenticityScore: 92,
    status: 'approved',
    isFeatured: 0,
    tags: 'coaching, growth, leadership, TEDx, speaker, author, EO, YPO, founder, business',
    bestTimeToVisit: 'Year-round',
    duration: 'Single Growth Call to multi-session engagements',
    discoveredAt: now,
    publishedAt: now,
    updatedAt: now,
  }).run();

  console.log('Added: Growth Coaching with Shivani Gupta');
}

main().catch(console.error);
