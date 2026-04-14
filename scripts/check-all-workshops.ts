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

import { db } from '../src/lib/db';
import { experiences } from '../src/lib/db/schema';
import { like, or } from 'drizzle-orm';

async function main() {
  // Find ALL records that could be workshops or contain relevant names
  const all = await db.select().from(experiences).where(
    or(
      like(experiences.category, '%workshop%'),
      like(experiences.title, '%Raj Goodman%'),
      like(experiences.title, '%Itamar%'),
      like(experiences.title, '%Dan Remon%'),
      like(experiences.slug, '%workshop%'),
      like(experiences.slug, '%itamar%'),
      like(experiences.slug, '%raj-goodman%'),
      like(experiences.slug, '%dan-remon%')
    )
  );

  console.log(`Total matching records: ${all.length}`);
  for (const r of all) {
    console.log(`\n  ID: ${r.id}`);
    console.log(`  Title: ${r.title}`);
    console.log(`  Slug: ${r.slug}`);
    console.log(`  Category: ${r.category}`);
    console.log(`  Status: ${r.status}`);
    console.log(`  Destination: ${r.destination}`);
    console.log(`  Score: ${r.aiScore}`);
  }
}

main().catch(console.error);
