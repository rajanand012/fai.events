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
  const slug = 'latin-dance-workshops-at-bangkok-bachata-gang';

  const existing = await db.select().from(experiences).where(eq(experiences.slug, slug)).limit(1);
  if (existing.length > 0) {
    console.log('Bangkok Bachata entry already exists. Updating...');
    await db.update(experiences).set({
      sourceUrl: 'https://bangkokbachata.com/#about',
      websiteUrl: 'https://bangkokbachata.com/',
      bookingUrl: 'https://bangkokbachata.com/',
      updatedAt: now,
    }).where(eq(experiences.slug, slug)).run();
    console.log('Updated existing Bangkok Bachata entry.');
    return;
  }

  await db.insert(experiences).values({
    slug,
    title: 'Latin Dance Workshops at Bangkok Bachata Gang',
    destination: 'Bangkok',
    province: 'Bangkok',
    category: 'workshops',
    summaryShort:
      "Thailand's largest Latin dance community: drop-in classes in Bachata, Salsa, and Kizomba, plus guest-artist workshops, practicas, and dance parties. No experience needed.",
    summaryLong:
      "Bangkok Bachata Gang is Thailand's largest Latin partner-dance community. Founded in 2023 and based on the 5th floor of the Trendy Building on Sukhumvit 13, the studio runs 120+ active monthly students through a roster of professional instructors trained in Europe and the Americas.\n\nThe school covers the full spectrum of Latin partner dance: Bachata, Salsa, and Kizomba partnerwork, plus Lady Styling, Salsa Shines, choreography bootcamps, and regular studio practicas where students apply what they have learned. Recurring guest-artist workshops bring in international names for premium drop-in sessions.\n\nThe vibe is community-first, with the tagline 'we're cheaper than therapy' capturing the lighthearted, ego-free atmosphere. Beginners are welcome with no prior experience required, and the school hosts monthly bonding events, dance parties, and social practicas where the community comes together. For a visitor, it is one of the most authentic ways to meet locals, learn a skill, and have a real night out — all in one ecosystem.",
    whySpecial:
      "The only entry in our workshops mix focused on culture, music, and human connection rather than coaching or sport. For a Bangkok visitor, an evening at Bangkok Bachata Gang is a real local experience: you learn, you dance, you meet people, you go out — all in a single welcoming space.",
    imageUrl: 'https://bangkokbachata.com/images/c1.jpg',
    sourceUrl: 'https://bangkokbachata.com/#about',
    websiteUrl: 'https://bangkokbachata.com/',
    bookingUrl: 'https://bangkokbachata.com/',
    priceRange: '$',
    priceNote: 'Drop-in classes; contact for current rates',
    aiScore: 84,
    aiReasoning:
      'Authentic Bangkok-based community offering distinctive cultural and social workshops. Strong fit for visitors seeking immersive, beginner-friendly experiences beyond typical tourist activities.',
    uniquenessScore: 90,
    luxuryScore: 65,
    authenticityScore: 92,
    status: 'approved',
    isFeatured: 0,
    tags: 'dance, bachata, salsa, kizomba, latin, community, social, workshops, bangkok, sukhumvit',
    bestTimeToVisit: 'Year-round',
    duration: 'Single drop-in classes to ongoing membership',
    discoveredAt: now,
    publishedAt: now,
    updatedAt: now,
  }).run();

  console.log('Added: Latin Dance Workshops at Bangkok Bachata Gang');
}

main().catch(console.error);
