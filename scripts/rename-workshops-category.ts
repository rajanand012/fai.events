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
  const { categories } = await import('../src/lib/db/schema');
  const { eq } = await import('drizzle-orm');

  // Rename the display label of the 'workshops' category to 'From Founders'.
  // The slug stays as 'workshops' so existing URLs keep working; only the
  // human-facing name changes.
  const result = await db
    .update(categories)
    .set({ name: 'From Founders' })
    .where(eq(categories.slug, 'workshops'))
    .run();

  console.log(`Updated rows: ${result.rowsAffected}`);
}

main().catch(console.error);
