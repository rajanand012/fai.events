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

  const slug = 'sketch-party-shop-themed-party-kits-bangkok';
  const now = new Date().toISOString();

  // Custom hero composite at /images/from-founders/sketch-party-shop.jpg
  // Pranika Khaitan Rawat's portrait inside a brand-yellow ring on the
  // left, layered onto a pastel-and-gold balloons-and-bunting background
  // on the right. Same compositional pattern as the Art Battle and Soma
  // Health entries so the From Founders section reads visually consistent.
  const imageUrl = '/images/from-founders/sketch-party-shop.jpg';

  const summaryShort =
    "Themed, ready-to-use party kits delivered to your door. Bangkok-based e-commerce by EO Bangkok Metropolitan member Pranika Khaitan Rawat: unbox, set up, celebrate.";

  const summaryLong = [
    "Sketch Party Shop is an e-commerce party brand built on a single insight: party planning is still time-consuming, overwhelming, and limiting, even though everything else in a busy professional's life has been streamlined. The fix is the kit. Every Sketch box arrives ready-to-use, with bunting, cake toppers, coasters, place cards, place mats, stirrers, tent cards, and games designed to a single coherent theme. Setup takes about thirty minutes; no assembly, no last-minute trips to a craft shop.",
    "The catalogue covers life's recurring milestones: birthdays for kids and adults, anniversaries, bridal and baby showers, festive occasions. Twenty-eight party kits, nineteen party games, a separate gifts line. Customisation is available when you want a kit tuned to a specific name, age, or palette. Delivery is 72 hours within Thailand and India.",
    "The brand was launched in 2021 by Pranika Khaitan Rawat, a designer-turned-entrepreneur with twelve-plus years in graphic design and large-scale museum production. Pranika also runs Etch Design, the studio behind Sketch's design language, and has been an active EO member for ten years across the Jaipur and Bangkok Metropolitan chapters. Sketch carries that designer's eye into a category that has historically lived in cluttered birthday-aisle territory.",
  ].join('\n\n');

  const whySpecial =
    "Bangkok has plenty of party suppliers but very few brands that take the design seriously. Sketch is the rare one where the kit looks intentional, not improvised: the same sensibility you'd expect from a museum exhibit, applied to a six-year-old's birthday. For a busy founder hosting at home, the time saved alone is worth it.";

  const aiReasoning =
    'Bangkok-based e-commerce party-kit brand founded by Pranika Khaitan Rawat, an EO Bangkok Metropolitan member with a designer background. Distinctive in the From Founders mix because it is a product brand rather than a service or venue, and because the design quality is genuinely above the local category baseline.';

  const tags =
    'party, party-kits, design, e-commerce, gifting, celebrations, EO, founders, bangkok, family';

  const existing = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log('Sketch Party Shop entry already exists. Updating...');
    await db
      .update(experiences)
      .set({
        title: 'Sketch Party Shop',
        summaryShort,
        summaryLong,
        whySpecial,
        imageUrl,
        sourceUrl: 'https://sketchpartyshop.com/',
        websiteUrl: 'https://sketchpartyshop.com/',
        bookingUrl: 'https://sketchpartyshop.com/',
        socialLink: 'https://www.instagram.com/sketchpartyshop',
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
      title: 'Sketch Party Shop',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'workshops', // surfaces in the From Founders section
      summaryShort,
      summaryLong,
      whySpecial,
      imageUrl,
      sourceUrl: 'https://sketchpartyshop.com/',
      websiteUrl: 'https://sketchpartyshop.com/',
      bookingUrl: 'https://sketchpartyshop.com/',
      socialLink: 'https://www.instagram.com/sketchpartyshop',
      contactLink: null,
      priceRange: '$$',
      priceNote: 'Kit pricing varies by theme; bulk and customisation on request',
      aiScore: 84,
      aiReasoning,
      uniquenessScore: 85,
      luxuryScore: 70,
      authenticityScore: 88,
      status: 'approved',
      isFeatured: 0,
      tags,
      bestTimeToVisit: 'Year-round; 72-hour delivery in Thailand and India',
      duration: 'Order online; ~30 minutes setup at home',
      discoveredAt: now,
      publishedAt: now,
      updatedAt: now,
    })
    .run();

  console.log('Added: Sketch Party Shop');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
