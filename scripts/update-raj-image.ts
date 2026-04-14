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
  const { like } = await import('drizzle-orm');

  await db.update(experiences)
    .set({
      imageUrl: 'https://rajgoodman.com/wp-content/uploads/2024/06/raj-1.webp',
      updatedAt: new Date().toISOString(),
    })
    .where(like(experiences.title, '%Raj Goodman%'))
    .run();
  console.log('Updated Raj Goodman image to rajgoodman.com headshot');
}

main().catch(console.error);
