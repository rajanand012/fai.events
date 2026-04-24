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
  const { eq } = await import('drizzle-orm');

  // Mark any stuck "running" rows as failed (they hit the Vercel timeout)
  const now = new Date().toISOString();
  const result = await db
    .update(pipelineRuns)
    .set({
      status: 'timeout',
      completedAt: now,
      errors: JSON.stringify(['Function hit Vercel serverless timeout before completing']),
    })
    .where(eq(pipelineRuns.status, 'running'))
    .run();

  console.log(`Marked ${result.rowsAffected} stuck runs as timeout`);
}

main().catch(console.error);
