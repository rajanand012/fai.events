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

  const slug = 'soma-health-longevity-clinic-bangkok';
  const now = new Date().toISOString();

  // Custom hero composite at /images/from-founders/soma-health.jpg —
  // Joey's portrait inside a brand-yellow ring on a navy/teal/gold
  // longevity-themed background (DNA helix, floating cells).
  const imageUrl = '/images/from-founders/soma-health.jpg';

  const summaryShort =
    "Bangkok longevity clinic by Soma Health: 90-minute biological assessments, stem-cell and IV protocols, partnerships with Karolinska Institute and Siriraj Hospital. Founded by EO Bangkok Metropolitan member Joey Kittichaiwong.";

  const summaryLong = [
    "Soma Health is a longevity and regenerative-medicine clinic on the 4th floor of Erawan Bangkok at Phloen Chit. The brand promise is the shift 'from reaction to prevention': identify the biological triggers of disease and decline before symptoms emerge, then build a personalised protocol around them.",
    "The clinical engagement starts with a 90-minute comprehensive biological assessment covering biomarkers, imaging, and genetic testing. From there, members move into one of three programmes: the Centura signature programme (stem-cell infusion plus diagnostics), the Engage annual membership (weekly treatments and ongoing physician consultations), or the Bonura joint-health protocol (mesenchymal stem-cell injections). Quarterly reviews keep the plan current.",
    "Soma was founded by Nutchaphon 'Joey' Kittichaiwong, a member of EO Bangkok Metropolitan. The clinic partners with the Karolinska Institute and Siriraj Hospital, lists 'Truth Above Transaction' as a published value (they will turn patients away when a treatment is not appropriate), and is built explicitly for founders, operators, and pre-symptomatic adults over 40 who want longevity care without the 'wellness' fluff.",
  ].join('\n\n');

  const whySpecial =
    "Most Bangkok 'wellness' offerings sit at the spa end of the spectrum. Soma sits at the medical end: FDA-aligned diagnostics, named institutional partners (Karolinska, Siriraj), and a willingness to decline treatments that don't fit. For an EO/YPO member doing an annual physical with a longevity lens, this is the most clinically credible option in the city.";

  const aiReasoning =
    'Bangkok longevity clinic founded by EO Bangkok Metropolitan member Joey Kittichaiwong, with named partnerships at Karolinska Institute and Siriraj Hospital. Sits at the medical end of the wellness spectrum (stem cells, biomarker diagnostics, FDA-aligned protocols) — distinct from the spa-style entries already in the directory. Strong fit for the From Founders mix as a peer-built, peer-targeted offering.';

  const tags =
    'longevity, regenerative-medicine, stem-cells, diagnostics, healthspan, wellness, EO, founders, bangkok, phloen-chit';

  const existing = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log('Soma Health entry already exists. Updating...');
    await db
      .update(experiences)
      .set({
        title: 'Soma Health',
        summaryShort,
        summaryLong,
        whySpecial,
        imageUrl,
        sourceUrl: 'https://somahealth.co.th/',
        websiteUrl: 'https://somahealth.co.th/',
        bookingUrl: 'https://somahealth.co.th/',
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
      title: 'Soma Health',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'workshops', // surfaces in the From Founders section
      summaryShort,
      summaryLong,
      whySpecial,
      imageUrl,
      sourceUrl: 'https://somahealth.co.th/',
      websiteUrl: 'https://somahealth.co.th/',
      bookingUrl: 'https://somahealth.co.th/',
      socialLink: null,
      contactLink: null,
      priceRange: '$$$$',
      priceNote: 'Programme pricing on consultation; assessment and protocols vary by member',
      aiScore: 89,
      aiReasoning,
      uniquenessScore: 88,
      luxuryScore: 90,
      authenticityScore: 90,
      status: 'approved',
      isFeatured: 0,
      tags,
      bestTimeToVisit: 'Year-round',
      duration: '90-minute assessment to multi-quarter membership programmes',
      discoveredAt: now,
      publishedAt: now,
      updatedAt: now,
    })
    .run();

  console.log('Added: Soma Health');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
