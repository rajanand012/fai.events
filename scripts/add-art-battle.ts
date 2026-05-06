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

  const slug = 'art-battle-bangkok-live-painting-tournament';
  const now = new Date().toISOString();

  // Hero image is a creative composite (Noel's portrait + AI-generated
  // paint-splash background) committed to the repo at
  // public/images/from-founders/art-battle.jpg, served from the same
  // origin as the site.
  const imageUrl = '/images/from-founders/art-battle.jpg';

  const summaryShort =
    "Bangkok's live painting tournament: 3 fast rounds, 20 minutes each, painters battle for the crowd's vote. Produced by EO Bangkok Metropolitan member Noel Nedli.";

  const summaryLong = [
    "Art Battle is a global live painting competition where artists each get 20 minutes to create their best work in front of a roving audience. The crowd watches the canvases come to life from blank to finished, then votes for the winner. Three rounds, increasing intensity, one champion at the end of the night.",
    "Bangkok's franchise is produced by Noel Nedli, an EO Bangkok Metropolitan member who has staged 12 successful editions in the city since 2023. Recent shows have run at venues like The Fig Lobby at Public House Hotel, drawing a young, mixed crowd of art collectors, casual fans, and friends of the painters.",
    "All artwork from the night is auctioned live, so you can leave with the piece you watched get made. Doors typically open at 7pm, painting starts at 8pm, and tickets go through Ticketmelon. It's the most fun, least intimidating way to engage with Bangkok's contemporary art scene: the work is being made live, the artists are right there, and the crowd is the jury.",
  ].join('\n\n');

  const whySpecial =
    "Most ways to experience contemporary art put a wall between you and the work. Art Battle puts you ten feet from the easel while the paint is still wet, and lets you vote on what wins. For a Bangkok visitor, it's a uniquely social, time-boxed window into the city's young art community.";

  const aiReasoning =
    'Bangkok-based franchise of the global Art Battle live painting competition, produced by EO Bangkok Metropolitan member Noel Nedli. 12 editions since 2023, ticketed via Ticketmelon, audience votes the winner. Rare in the From Founders mix because it is event-based culture rather than coaching or sport.';

  const tags =
    'art, live-painting, competition, culture, community, social, EO, founders, bangkok, ticketed-event';

  const existing = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log('Art Battle entry already exists. Updating...');
    await db
      .update(experiences)
      .set({
        title: 'Art Battle Bangkok',
        summaryShort,
        summaryLong,
        whySpecial,
        imageUrl,
        sourceUrl: 'https://www.instagram.com/artbattlebkk/',
        websiteUrl: 'https://www.instagram.com/artbattlebkk/',
        bookingUrl: 'https://www.ticketmelon.com/art-battle-bangkok',
        aiReasoning,
        tags,
        updatedAt: now,
      })
      .where(eq(experiences.slug, slug))
      .run();
    console.log('Updated existing entry.');
    return;
  }

  await db
    .insert(experiences)
    .values({
      slug,
      title: 'Art Battle Bangkok',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'workshops', // surfaces in the From Founders section
      summaryShort,
      summaryLong,
      whySpecial,
      imageUrl,
      sourceUrl: 'https://www.instagram.com/artbattlebkk/',
      websiteUrl: 'https://www.instagram.com/artbattlebkk/',
      bookingUrl: 'https://www.ticketmelon.com/art-battle-bangkok',
      socialLink: 'https://www.instagram.com/artbattlebkk/',
      contactLink: null,
      priceRange: '$',
      priceNote: 'Tickets via Ticketmelon (event-by-event)',
      aiScore: 87,
      aiReasoning,
      uniquenessScore: 92,
      luxuryScore: 60,
      authenticityScore: 88,
      status: 'approved',
      isFeatured: 0,
      tags,
      bestTimeToVisit: 'Year-round (events run roughly every 1-2 months)',
      duration: 'One evening (~3 hours including auction)',
      discoveredAt: now,
      publishedAt: now,
      updatedAt: now,
    })
    .run();

  console.log('Added: Art Battle Bangkok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
