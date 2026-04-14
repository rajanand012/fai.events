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

  // Fix privateguidechiangmai.com 404
  const fixes: Record<string, { sourceUrl: string; websiteUrl?: string }> = {
    'sunrise-at-doi-suthep-temple-cultural-immersion': {
      sourceUrl: 'https://en.wikipedia.org/wiki/Wat_Phra_That_Doi_Suthep',
      websiteUrl: 'https://en.wikipedia.org/wiki/Wat_Phra_That_Doi_Suthep',
    },
  };

  for (const [slug, fix] of Object.entries(fixes)) {
    const result = await db.update(experiences)
      .set({ sourceUrl: fix.sourceUrl, websiteUrl: fix.websiteUrl, updatedAt: now })
      .where(eq(experiences.slug, slug))
      .run();
    console.log(`Fixed: ${slug} -> ${fix.sourceUrl} (rows affected: ${result.rowsAffected})`);
  }

  console.log('\nDone!');
}

main().catch(console.error);
