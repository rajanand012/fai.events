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

  const now = new Date().toISOString();

  // Use the Worlds 50 Best Bars page for Bangkok - a reliable, authoritative source
  await db.update(experiences)
    .set({
      sourceUrl: 'https://www.worlds50bestbars.com/asia/bangkok.html',
      websiteUrl: 'https://www.worlds50bestbars.com/asia/bangkok.html',
      updatedAt: now,
    })
    .where(eq(experiences.slug, 'bangkok-hidden-speakeasy-bar-hopping'))
    .run();
  console.log('Fixed speakeasy bar crawl source URL');
}

main().catch(console.error);
