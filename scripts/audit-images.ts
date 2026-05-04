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
  const { db } = await import('../src/lib/db');
  const { experiences } = await import('../src/lib/db/schema');
  const { eq, asc } = await import('drizzle-orm');

  const all = await db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      title: experiences.title,
      category: experiences.category,
      imageUrl: experiences.imageUrl,
      discoveredAt: experiences.discoveredAt,
    })
    .from(experiences)
    .where(eq(experiences.status, 'approved'))
    .orderBy(asc(experiences.id));

  console.log(`Total approved: ${all.length}\n`);

  for (const e of all) {
    const status = !e.imageUrl ? 'MISSING' : 'set';
    console.log(`[${e.id}] ${status} | ${e.category} | ${e.slug}`);
    console.log(`    title: ${e.title}`);
    console.log(`    img:   ${e.imageUrl || '(none)'}`);
    console.log('');
  }
}

main().catch(console.error);
