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

  const slug = 'sterling-sport-and-wellness-club-bangkok';
  const now = new Date().toISOString();

  // Refreshed hero composite at /images/from-founders/sterling-bkk.jpg —
  // Sanan Phanichkrivalkosil's portrait inside a brand-yellow ring on
  // the left, layered onto the existing Sterling building photo. Same
  // From Founders pattern as Art Battle / Soma Health / Sketch /
  // Bangkok Bachata.
  const imageUrl = '/images/from-founders/sterling-bkk.jpg';

  const result = await db
    .update(experiences)
    .set({
      imageUrl,
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
