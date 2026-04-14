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

  const all = await db.select().from(experiences).where(eq(experiences.status, 'approved'));

  console.log(`Checking ${all.length} approved experiences...\n`);

  const issues: string[] = [];

  for (const exp of all) {
    // Check slug is valid
    if (!exp.slug || exp.slug.trim() === '') {
      issues.push(`ID ${exp.id}: Missing slug - "${exp.title}"`);
    }

    // Check for duplicate slugs
    const dupes = all.filter(e => e.slug === exp.slug);
    if (dupes.length > 1) {
      issues.push(`ID ${exp.id}: Duplicate slug "${exp.slug}" - "${exp.title}"`);
    }

    // Check slug format (no spaces, lowercase)
    if (exp.slug !== exp.slug.toLowerCase() || exp.slug.includes(' ')) {
      issues.push(`ID ${exp.id}: Bad slug format "${exp.slug}"`);
    }

    // Check required fields
    if (!exp.title) issues.push(`ID ${exp.id}: Missing title`);
    if (!exp.summaryShort) issues.push(`ID ${exp.id}: Missing summaryShort - "${exp.title}"`);
    if (!exp.summaryLong) issues.push(`ID ${exp.id}: Missing summaryLong - "${exp.title}"`);
    if (!exp.destination) issues.push(`ID ${exp.id}: Missing destination - "${exp.title}"`);
    if (!exp.province) issues.push(`ID ${exp.id}: Missing province - "${exp.title}"`);

    // Check image URL
    if (!exp.imageUrl) {
      issues.push(`ID ${exp.id}: Missing image - "${exp.title}"`);
    }

    // List all slugs for reference
    console.log(`  /experience/${exp.slug}`);
  }

  if (issues.length > 0) {
    console.log(`\n=== ISSUES FOUND (${issues.length}) ===`);
    issues.forEach(i => console.log(`  ❌ ${i}`));
  } else {
    console.log('\n✅ All experiences have valid slugs, images, and required fields.');
  }
}

main().catch(console.error);
