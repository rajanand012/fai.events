import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const experiences = sqliteTable(
  'experiences',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').unique().notNull(),
    title: text('title').notNull(),
    destination: text('destination').notNull(),
    province: text('province').notNull(),
    category: text('category').notNull(),
    summaryShort: text('summary_short').notNull(),
    summaryLong: text('summary_long').notNull(),
    whySpecial: text('why_special'),
    imageUrl: text('image_url'),
    sourceUrl: text('source_url').notNull(),
    websiteUrl: text('website_url'),
    bookingUrl: text('booking_url'),
    socialLink: text('social_link'),
    contactLink: text('contact_link'),
    priceRange: text('price_range'),
    priceNote: text('price_note'),
    aiScore: real('ai_score').notNull().default(0),
    aiReasoning: text('ai_reasoning'),
    uniquenessScore: real('uniqueness_score').default(0),
    luxuryScore: real('luxury_score').default(0),
    authenticityScore: real('authenticity_score').default(0),
    status: text('status').notNull().default('pending'),
    isFeatured: integer('is_featured').default(0),
    tags: text('tags'),
    bestTimeToVisit: text('best_time_to_visit'),
    duration: text('duration'),
    discoveredAt: text('discovered_at').notNull(),
    publishedAt: text('published_at'),
    updatedAt: text('updated_at').notNull(),
    pipelineRunId: integer('pipeline_run_id'),
  },
  (table) => [
    index('idx_experiences_status').on(table.status),
    index('idx_experiences_category').on(table.category),
    index('idx_experiences_province').on(table.province),
    index('idx_experiences_ai_score').on(table.aiScore),
    index('idx_experiences_slug').on(table.slug),
  ]
);

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  iconName: text('icon_name'),
  displayOrder: integer('display_order').default(0),
});

export const provinces = sqliteTable('provinces', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  region: text('region').notNull(),
  slug: text('slug').unique().notNull(),
});

export const pipelineRuns = sqliteTable('pipeline_runs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  startedAt: text('started_at').notNull(),
  completedAt: text('completed_at'),
  status: text('status').default('running'),
  sourcesSearched: integer('sources_searched').default(0),
  candidatesFound: integer('candidates_found').default(0),
  evaluated: integer('evaluated').default(0),
  duplicatesSkipped: integer('duplicates_skipped').default(0),
  published: integer('published').default(0),
  errors: text('errors'),
  triggerType: text('trigger_type').notNull(),
});

export const seenUrls = sqliteTable(
  'seen_urls',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    url: text('url').unique().notNull(),
    firstSeenAt: text('first_seen_at').notNull(),
    experienceId: integer('experience_id'),
  },
  (table) => [index('idx_seen_urls_url').on(table.url)]
);

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Province = typeof provinces.$inferSelect;
export type NewProvince = typeof provinces.$inferInsert;
export type PipelineRun = typeof pipelineRuns.$inferSelect;
export type NewPipelineRun = typeof pipelineRuns.$inferInsert;
export type SeenUrl = typeof seenUrls.$inferSelect;
export type NewSeenUrl = typeof seenUrls.$inferInsert;
