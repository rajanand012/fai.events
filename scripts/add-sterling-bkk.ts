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
  const { like } = await import('drizzle-orm');

  const now = new Date().toISOString();
  const slug = 'sterling-sport-and-wellness-club-bangkok';

  const existing = await db.select().from(experiences).where(like(experiences.slug, slug)).limit(1);
  if (existing.length > 0) {
    console.log('Sterling BKK entry already exists. Updating...');
    const { eq } = await import('drizzle-orm');
    await db.update(experiences).set({
      sourceUrl: 'https://sterlingbkk.com/sterling-experience',
      websiteUrl: 'https://sterlingbkk.com/',
      bookingUrl: 'https://www.instagram.com/p/DXJs7raAfzH/?igsh=MW5pcmU3MzdlaTlxaw==',
      updatedAt: now,
    }).where(eq(experiences.slug, slug)).run();
    console.log('Updated existing Sterling entry.');
    return;
  }

  await db.insert(experiences).values({
    slug,
    title: 'Sterling Sport & Wellness Club Bangkok',
    destination: 'Bangkok',
    province: 'Bangkok',
    category: 'workshops',
    summaryShort:
      'Elite sport, recovery, and wellness under one roof in Sukhumvit. Train Muay Thai with Superbon, play padel on competition-grade courts, and recover at FORM.',
    summaryLong:
      "Sterling Sport & Wellness is Bangkok's most ambitious sport-and-wellness destination, combining elite training facilities, recovery clinics, and lifestyle amenities in a single Sukhumvit 24 address. The venue is fully air-conditioned and built for serious performance.\n\nThe sport offering includes 5 competition-grade padel courts, 6 pickleball courts, 3 tennis courts with structured coaching, a barre and fitness studio by Physique 57, and the Superbon Training Camp, a chance to train Muay Thai where one of the world's top fighters trains.\n\nWellness is anchored by FORM, a recovery and wellness center featuring sauna, cold plunge, and recovery clinic services. Hair House by Nikki Bscherer rounds out the lifestyle offering. Whether you are visiting Bangkok for a weekend or based in the city, Sterling is the kind of single-stop destination that makes high-performance living effortless.",
    whySpecial:
      "No other Bangkok venue combines world-champion-level Muay Thai training, competition-grade padel, recovery science, and boutique fitness studios in a single integrated facility. It is purpose-built for visitors and residents who refuse to choose between performance and lifestyle.",
    imageUrl:
      'https://images.squarespace-cdn.com/content/6942399c94bdba06bcb70d53/43ee23fc-fb4c-4774-bc88-3aad8f460503/260326_Sterling_Landing+Page-01.png',
    sourceUrl: 'https://sterlingbkk.com/sterling-experience',
    websiteUrl: 'https://sterlingbkk.com/',
    bookingUrl: 'https://www.instagram.com/p/DXJs7raAfzH/?igsh=MW5pcmU3MzdlaTlxaw==',
    priceRange: '$$$',
    priceNote: 'Membership and pay-per-session options available',
    aiScore: 86,
    aiReasoning:
      'Premium integrated sport-and-wellness facility with marquee offerings including Superbon Muay Thai Camp, competition-grade padel, FORM recovery, and Physique 57 barre. Strong appeal for affluent visitors and EO/YPO members who want elite training during a Bangkok stay.',
    uniquenessScore: 88,
    luxuryScore: 90,
    authenticityScore: 82,
    status: 'approved',
    isFeatured: 0,
    tags: 'sport, wellness, muay thai, padel, pickleball, tennis, recovery, fitness, bangkok, sukhumvit, club',
    bestTimeToVisit: 'Year-round',
    duration: 'Single sessions to ongoing membership',
    discoveredAt: now,
    publishedAt: now,
    updatedAt: now,
  }).run();

  console.log('Added: Sterling Sport & Wellness Club Bangkok');
}

main().catch(console.error);
