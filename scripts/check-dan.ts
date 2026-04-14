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
import { like, eq, and, desc } from 'drizzle-orm';

async function main() {
  // Check Dan specifically
  const dan = await db.select().from(experiences).where(like(experiences.title, '%Dan Remon%'));
  console.log('Dan Remon records:', dan.length);
  if (dan.length > 0) {
    console.log('  Status:', dan[0].status);
    console.log('  Category:', dan[0].category);
    console.log('  Score:', dan[0].aiScore);
    console.log('  Slug:', dan[0].slug);
    console.log('  Summary:', dan[0].summaryLong?.substring(0, 50));
  }

  // Replicate the exact homepage query
  console.log('\n=== Homepage workshop query ===');
  const workshopRows = await db
    .select()
    .from(experiences)
    .where(and(eq(experiences.status, 'approved'), eq(experiences.category, 'workshops')))
    .orderBy(desc(experiences.aiScore));
  console.log(`Found ${workshopRows.length} workshops:`);
  for (const w of workshopRows) {
    console.log(`  - ${w.title} | category=${w.category} | status=${w.status} | score=${w.aiScore} | summaryLong length=${w.summaryLong?.length}`);
  }
}

main().catch(console.error);
