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

  const slug = 'latin-dance-workshops-at-bangkok-bachata-gang';
  const now = new Date().toISOString();

  // Refreshed hero composite at /images/from-founders/bangkok-bachata.jpg
  // (Pei Kuo's portrait overlaid on the dance-class photo). Same
  // From Founders pattern as Art Battle / Soma Health / Sketch.
  const imageUrl = '/images/from-founders/bangkok-bachata.jpg';

  const summaryShort =
    "Thailand's largest Latin partner-dance community, founded by EO Bangkok Metropolitan member Pei Kuo. Drop-in classes in Bachata, Salsa, and Kizomba on Sukhumvit 13, plus Bachata Fever — Thailand's biggest weekly social.";

  const summaryLong = [
    "Bangkok Bachata Gang is the city's premier destination for Latin partner dance: Bachata, Salsa, and Kizomba, taught from absolute beginner through advanced. The school sits on the 5th floor of the Trendy Building on Sukhumvit 13, with 120+ active monthly students and instructors trained in Europe and the Americas.",
    "Class formats cover everything you'd expect of a serious dance school: partnerwork, Lady Styling, Shines, choreography bootcamps, regular studio practicas, and a steady stream of guest-artist workshops bringing in international talent. The atmosphere is community-first and beginner-friendly — the studio's ground rule is 'no egos.'",
    "Beyond classes, the Gang runs the social scene too. Bachata Fever, hosted every Sunday, is described by Pei as easily the largest weekly party in Thailand. They also host SaturDAY Social, Thailand's first and only daytime dance social. The whole ecosystem — school, parties, guest artists — is built and run by Pei Kuo, an EO Bangkok Metropolitan member who founded the Gang in 2023.",
  ].join('\n\n');

  const whySpecial =
    "The only entry in From Founders that's about culture, music, and human connection rather than coaching, sport, or fine dining. For a Bangkok visitor, it's one of the most authentic ways to meet locals, learn a skill, and have a real night out — all in one ecosystem, all built by one EO member from a standing start in 2023.";

  const aiReasoning =
    'Bangkok-based Latin dance school and social scene founded by Pei Kuo, an EO Bangkok Metropolitan member. Bachata, Salsa, Kizomba classes plus Bachata Fever (largest weekly social party in Thailand). Distinctive in the From Founders mix as a community / culture entry rather than coaching, sport, fine dining, or product.';

  const tags =
    'dance, bachata, salsa, kizomba, latin, community, social, EO, founders, bangkok, sukhumvit';

  const result = await db
    .update(experiences)
    .set({
      summaryShort,
      summaryLong,
      whySpecial,
      imageUrl,
      aiReasoning,
      tags,
      updatedAt: now,
    })
    .where(eq(experiences.slug, slug))
    .run();

  console.log(`Updated rows: ${result.rowsAffected}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
