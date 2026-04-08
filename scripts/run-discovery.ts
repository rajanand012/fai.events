import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local since we're outside Next.js
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

import { runDiscoveryPipeline } from '../src/lib/discovery/engine';

async function main() {
  console.log('Starting discovery pipeline (manual trigger)...');
  console.log('');

  try {
    const result = await runDiscoveryPipeline('manual');

    console.log('');
    console.log('=== Pipeline Complete ===');
    console.log(`Run ID: ${result.runId}`);
    console.log(`Sources searched: ${result.sourcesSearched}`);
    console.log(`Candidates found: ${result.candidatesFound}`);
    console.log(`Evaluated: ${result.evaluated}`);
    console.log(`Duplicates skipped: ${result.duplicatesSkipped}`);
    console.log(`Published: ${result.published}`);
    console.log(`Duration: ${(result.duration / 1000).toFixed(1)}s`);

    if (result.errors.length > 0) {
      console.log(`\nErrors (${result.errors.length}):`);
      result.errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }
  } catch (error) {
    console.error('Pipeline failed:', error);
    process.exit(1);
  }
}

main();
