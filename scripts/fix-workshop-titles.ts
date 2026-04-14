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
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch {
  console.warn('Warning: Could not read .env.local');
}

import { db } from '../src/lib/db';
import { experiences } from '../src/lib/db/schema';
import { like } from 'drizzle-orm';

async function main() {
  const now = new Date().toISOString();

  // Fix Raj's workshop title - remove "in Bangkok"
  const rajWorkshop = await db.select().from(experiences).where(like(experiences.title, '%Raj Goodman in Bangkok%')).limit(1);
  if (rajWorkshop.length > 0) {
    await db.update(experiences)
      .set({
        title: 'AI Workshop with Raj Goodman',
        slug: 'ai-workshop-with-raj-goodman',
        summaryShort: rajWorkshop[0].summaryShort.replace(/in Bangkok/g, 'across Thailand'),
        updatedAt: now,
      })
      .where(like(experiences.title, '%Raj Goodman in Bangkok%'))
      .run();
    console.log('Updated Raj Goodman workshop title (removed "in Bangkok")');
  }

  // Fix Itamar's workshop title - remove "in Phuket"
  const itamarWorkshop = await db.select().from(experiences).where(like(experiences.title, '%Itamar Marani in Phuket%')).limit(1);
  if (itamarWorkshop.length > 0) {
    await db.update(experiences)
      .set({
        title: 'Elite Performance Intensive with Itamar Marani',
        slug: 'elite-performance-intensive-with-itamar-marani',
        summaryShort: itamarWorkshop[0].summaryShort.replace(/in Phuket/g, 'across Thailand'),
        updatedAt: now,
      })
      .where(like(experiences.title, '%Itamar Marani in Phuket%'))
      .run();
    console.log('Updated Itamar Marani workshop title (removed "in Phuket")');
  }

  console.log('Done!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
