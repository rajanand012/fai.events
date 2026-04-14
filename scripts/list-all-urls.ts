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
  const { eq } = await import('drizzle-orm');

  const all = await db
    .select({
      slug: experiences.slug,
      sourceUrl: experiences.sourceUrl,
      websiteUrl: experiences.websiteUrl,
    })
    .from(experiences)
    .where(eq(experiences.status, 'approved'));

  for (const e of all) {
    console.log(`${e.slug} | ${e.sourceUrl} | ${e.websiteUrl}`);
  }
  console.log(`\nTotal: ${all.length} approved experiences`);
}

main().catch(console.error);
