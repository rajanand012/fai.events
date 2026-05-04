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

  const slug = 'elite-performance-intensive-with-itamar-marani';
  const now = new Date().toISOString();

  // Per-Itamar revised copy. Slug and image are intentionally preserved;
  // external links move to the dedicated EO/YPO landing page.
  const summaryShort =
    "Is somebody else with your exact skillset accomplishing more than you currently are? A half-day forum intensive that unlocks your best self.";

  const summaryLong = [
    "Is somebody else with your exact skillset accomplishing more than you currently are? If you said yes, your best self is waiting to be unlocked.",
    "Itamar Marani is an ex-Israeli Special Forces operative, former undercover agent, Brazilian Jiu-Jitsu black belt, and mentee of the Mossad's top psychologist. He is now a performance coach to hundreds of seven-to-nine-figure founders, including a handful of billionaires.",
    "Drawing from these high-stakes, high-pressure arenas, he brings a field-tested system that goes deeper than tactics and strategy.",
    "In this half-day intensive, you will gain clarity, confidence, and the ability to go far beyond your perceived limits. The workshop includes live coaching where every member walks away operating closer to their true level.",
    "Beyond the day itself, the shared systems and frameworks stay with your forum. Members leave with the tools to recognize what is holding each other back and the ability to help each other break through it. A force multiplier for your forum experience for years to come.",
  ].join('\n\n');

  const whySpecial =
    "Most performance coaches deliver tactics. Itamar's system, forged in environments where getting it wrong had real consequences, gives EO and YPO forums something rare: a shared language and a set of frameworks the group keeps using long after the day ends. That is the force multiplier.";

  const aiReasoning =
    "Genuinely distinctive credentials — ex-Israeli Special Forces, former undercover agent, Mossad-mentored, BJJ black belt — applied to performance coaching for seven-to-nine-figure founders and billionaires. The half-day forum format leaves shared frameworks behind, making it a force multiplier for EO and YPO chapters.";

  const tags = 'performance, coaching, mindset, leadership, EO, YPO, forum, intensive, special-forces';

  const result = await db
    .update(experiences)
    .set({
      summaryShort,
      summaryLong,
      whySpecial,
      aiReasoning,
      tags,
      sourceUrl: 'https://itamarmarani.com/eo-ypo/',
      websiteUrl: 'https://itamarmarani.com/eo-ypo/',
      bookingUrl: 'https://itamarmarani.com/eo-ypo/',
      updatedAt: now,
    })
    .where(eq(experiences.slug, slug))
    .run();

  console.log(`Updated rows: ${result.rowsAffected}`);
}

main().catch(console.error);
