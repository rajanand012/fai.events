import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { experiences, pipelineRuns, seenUrls } from '../db/schema';
import { generateUniqueSlug } from '../utils/slugify';
import { getRotatedQueries } from './sources';
import { searchWeb, scrapeUrl } from './scraper';
import { evaluateExperience } from './evaluator';
import { isDuplicate, recordUrl } from './deduplicator';
import type { PipelineRunResult, RawCandidate } from './types';

/** Small delay between candidate processing to be polite to servers. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run the full discovery pipeline:
 * 1. Pick random search queries
 * 2. Search the web for candidates
 * 3. Deduplicate against previously seen URLs and titles
 * 4. Scrape each candidate page
 * 5. Evaluate with AI
 * 6. Publish high-scoring experiences to the database
 *
 * Individual candidate failures are caught and logged without stopping
 * the entire pipeline.
 */
export async function runDiscoveryPipeline(
  triggerType: 'cron' | 'manual' = 'cron'
): Promise<PipelineRunResult> {
  const startTime = Date.now();
  const errors: string[] = [];

  let sourcesSearched = 0;
  let candidatesFound = 0;
  let evaluated = 0;
  let duplicatesSkipped = 0;
  let published = 0;

  // 1. Create a pipeline_runs record
  await db.insert(pipelineRuns)
    .values({
      startedAt: new Date().toISOString(),
      status: 'running',
      triggerType,
    })
    .run();

  const latestRun = await db.select().from(pipelineRuns).orderBy(desc(pipelineRuns.id)).limit(1).get();
  const runId = latestRun!.id;

  try {
    // 2. Get rotated queries (8 random queries per run)
    const queries = getRotatedQueries(8);

    // 3. Process each query
    for (const query of queries) {
      sourcesSearched++;
      let candidates: RawCandidate[] = [];

      try {
        candidates = await searchWeb(query);
        candidatesFound += candidates.length;
      } catch (error) {
        const msg = `Search failed for "${query}": ${error}`;
        console.error(`[engine] ${msg}`);
        errors.push(msg);
        continue;
      }

      // 4. Process each candidate
      for (const candidate of candidates) {
        try {
          // Check for duplicates
          if (await isDuplicate(candidate.url, candidate.title)) {
            duplicatesSkipped++;
            continue;
          }

          // Scrape the page
          const scraped = await scrapeUrl(candidate.url);
          if (!scraped) {
            errors.push(`Scrape failed: ${candidate.url}`);
            continue;
          }

          // Evaluate with AI
          const evaluation = await evaluateExperience(scraped);
          if (!evaluation) {
            errors.push(`Evaluation failed: ${candidate.url}`);
            continue;
          }

          evaluated++;

          // Check score threshold
          if (evaluation.scores.overall >= 70) {
            // Validate required fields before inserting
            if (!evaluation.title || !evaluation.destination || !evaluation.province ||
                !evaluation.category || !evaluation.summaryShort || !evaluation.summaryLong) {
              errors.push(`Skipping ${candidate.url}: missing required fields (title/destination/province/category/summary)`);
              await recordUrl(candidate.url);
              continue;
            }

            const slug = await generateUniqueSlug(evaluation.title);
            const now = new Date().toISOString();
            const autoApprove = evaluation.scores.overall >= 70;

            // Use a fallback image if none found from scraping
            const imageUrl = scraped.ogImage ||
              (scraped.images && scraped.images.length > 0 ? scraped.images[0].src : null) ||
              `https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop`;

            await db.insert(experiences)
              .values({
                slug,
                title: evaluation.title,
                destination: evaluation.destination,
                province: evaluation.province,
                category: evaluation.category,
                summaryShort: evaluation.summaryShort,
                summaryLong: evaluation.summaryLong,
                whySpecial: evaluation.whySpecial,
                imageUrl,
                sourceUrl: candidate.url,
                websiteUrl: evaluation.websiteUrl || null,
                bookingUrl: evaluation.bookingUrl || evaluation.websiteUrl || null,
                socialLink: evaluation.socialLink || null,
                contactLink: evaluation.contactLink || null,
                priceRange: evaluation.priceRange,
                priceNote: evaluation.priceNote,
                aiScore: evaluation.scores.overall,
                aiReasoning: evaluation.reasoning,
                uniquenessScore: evaluation.scores.uniqueness,
                luxuryScore: evaluation.scores.luxury,
                authenticityScore: evaluation.scores.authenticity,
                status: autoApprove ? 'approved' : 'pending',
                tags: JSON.stringify(evaluation.tags),
                bestTimeToVisit: evaluation.bestTimeToVisit,
                duration: evaluation.duration,
                discoveredAt: now,
                publishedAt: autoApprove ? now : null,
                updatedAt: now,
                pipelineRunId: runId,
              })
              .run();

            const inserted = await db.select().from(experiences).where(eq(experiences.slug, slug)).get();
            // Record URL with experience ID
            await recordUrl(candidate.url, inserted?.id);
            published++;
          } else {
            // Record URL to avoid re-processing, but don't publish
            await recordUrl(candidate.url);
          }
        } catch (error) {
          const msg = `Candidate error (${candidate.url}): ${error}`;
          console.error(`[engine] ${msg}`);
          errors.push(msg);
        }

        // Be polite: small delay between candidates
        await delay(500);
      }
    }
  } catch (error) {
    const msg = `Pipeline error: ${error}`;
    console.error(`[engine] ${msg}`);
    errors.push(msg);
  }

  const duration = Date.now() - startTime;

  // Update pipeline_runs record with final stats
  await db.update(pipelineRuns)
    .set({
      completedAt: new Date().toISOString(),
      status: errors.length > 0 && published === 0 ? 'failed' : 'completed',
      sourcesSearched,
      candidatesFound,
      evaluated,
      duplicatesSkipped,
      published,
      errors: errors.length > 0 ? JSON.stringify(errors) : null,
    })
    .where(eq(pipelineRuns.id, runId))
    .run();

  return {
    runId,
    sourcesSearched,
    candidatesFound,
    evaluated,
    duplicatesSkipped,
    published,
    errors,
    duration,
  };
}
