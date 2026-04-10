import { db } from '../db';
import { seenUrls, experiences } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Normalize a URL for deduplication:
 * - Lowercase
 * - Remove www. prefix
 * - Strip tracking parameters (utm_*, fbclid, gclid, etc.)
 * - Remove trailing slash
 * - Remove fragment
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url.toLowerCase());

    // Remove www. prefix
    parsed.hostname = parsed.hostname.replace(/^www\./, '');

    // Strip tracking and analytics parameters
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
      'msclkid',
      'ref',
      'source',
      '_ga',
      '_gl',
      'mc_cid',
      'mc_eid',
    ];

    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }

    // Remove fragment
    parsed.hash = '';

    // Build the URL and remove trailing slash
    let normalized = parsed.toString();
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  } catch {
    // If URL parsing fails, do basic normalization
    return url.toLowerCase().replace(/\/$/, '').replace(/#.*$/, '');
  }
}

/**
 * Compute the Dice coefficient (bigram similarity) between two strings.
 * Returns a value between 0 (no similarity) and 1 (identical).
 */
export function diceCoefficient(a: string, b: string): number {
  const strA = a.toLowerCase().trim();
  const strB = b.toLowerCase().trim();

  if (strA === strB) return 1;
  if (strA.length < 2 || strB.length < 2) return 0;

  const bigramsA = new Map<string, number>();
  for (let i = 0; i < strA.length - 1; i++) {
    const bigram = strA.slice(i, i + 2);
    bigramsA.set(bigram, (bigramsA.get(bigram) || 0) + 1);
  }

  const bigramsB = new Map<string, number>();
  for (let i = 0; i < strB.length - 1; i++) {
    const bigram = strB.slice(i, i + 2);
    bigramsB.set(bigram, (bigramsB.get(bigram) || 0) + 1);
  }

  let intersection = 0;
  for (const [bigram, countA] of bigramsA) {
    const countB = bigramsB.get(bigram) || 0;
    intersection += Math.min(countA, countB);
  }

  const totalBigrams = (strA.length - 1) + (strB.length - 1);
  return (2 * intersection) / totalBigrams;
}

const TITLE_SIMILARITY_THRESHOLD = 0.8;

/**
 * Check whether a URL (or a very similar title) has already been processed.
 *
 * 1. Normalize the URL and check the seen_urls table for an exact match.
 * 2. If no URL match and a title is provided, check the experiences table
 *    for similar titles using Dice coefficient similarity (threshold: 0.8).
 */
export async function isDuplicate(url: string, title?: string): Promise<boolean> {
  const normalized = normalizeUrl(url);

  // Check seen_urls for exact normalized URL match
  const urlMatch = await db
    .select()
    .from(seenUrls)
    .where(eq(seenUrls.url, normalized))
    .get();

  if (urlMatch) return true;

  // If title is provided, check experiences for similar titles
  if (title && title.trim().length > 0) {
    const allExperiences = await db
      .select({ title: experiences.title })
      .from(experiences)
      .all();

    for (const exp of allExperiences) {
      if (diceCoefficient(title, exp.title) >= TITLE_SIMILARITY_THRESHOLD) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Record a URL in the seen_urls table to prevent re-processing.
 * If the URL already exists (conflict), the insert is silently skipped.
 */
export async function recordUrl(url: string, experienceId?: number): Promise<void> {
  const normalized = normalizeUrl(url);

  try {
    await db.insert(seenUrls)
      .values({
        url: normalized,
        firstSeenAt: new Date().toISOString(),
        experienceId: experienceId ?? null,
      })
      .onConflictDoNothing()
      .run();
  } catch (error) {
    console.error('[deduplicator] Error recording URL:', error);
  }
}
