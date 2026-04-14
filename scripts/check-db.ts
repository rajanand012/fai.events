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
import { eq } from 'drizzle-orm';

async function main() {
  console.log('=== Workshops ===');
  const workshops = await db.select().from(experiences).where(eq(experiences.category, 'workshops'));
  for (const w of workshops) {
    console.log(`  Title: ${w.title}`);
    console.log(`  Slug: ${w.slug}`);
    console.log(`  Destination: ${w.destination}`);
    console.log('');
  }

  console.log('=== Bangkok Experiences ===');
  const bangkok = await db.select().from(experiences).where(eq(experiences.province, 'Bangkok'));
  console.log(`Total Bangkok: ${bangkok.length}`);
  for (const b of bangkok) {
    console.log(`  - ${b.title} (${b.category}, score: ${b.aiScore})`);
  }

  console.log(`\n=== Total Approved ===`);
  const all = await db.select().from(experiences).where(eq(experiences.status, 'approved'));
  console.log(`Total: ${all.length}`);
}

main().catch(console.error);
