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
  const { pipelineRuns } = await import('../src/lib/db/schema');
  const { desc } = await import('drizzle-orm');

  const runs = await db
    .select()
    .from(pipelineRuns)
    .orderBy(desc(pipelineRuns.id))
    .limit(20);

  console.log(`\nTotal runs found: ${runs.length}\n`);
  for (const r of runs) {
    console.log(`[${r.id}] ${r.startedAt} | trigger=${r.triggerType} | status=${r.status} | published=${r.published ?? 0} | evaluated=${r.evaluated ?? 0} | duplicates=${r.duplicatesSkipped ?? 0} | candidates=${r.candidatesFound ?? 0}`);
    if (r.errors) {
      const errs = JSON.parse(r.errors as string);
      if (errs.length > 0) console.log(`  ERRORS (${errs.length}): ${errs.slice(0, 2).join(' | ')}`);
    }
  }
}

main().catch(console.error);
