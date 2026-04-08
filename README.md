# fai.events

AI-powered discovery and curation platform for once-in-a-lifetime experiences across Thailand. Built with Claude AI and Claude Code by [Raj Goodman](https://rajgoodman.com/).

## Overview

fai.events uses artificial intelligence to continuously discover, evaluate, and curate extraordinary experiences across Thailand. The platform:

- **Discovers** new experiences daily by searching hundreds of web sources
- **Evaluates** each find using Claude AI for uniqueness, luxury, and authenticity
- **Publishes** only the highest-quality experiences that meet strict quality thresholds
- **Presents** everything in a premium, filterable, searchable interface

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: SQLite via better-sqlite3 + Drizzle ORM
- **Styling**: Tailwind CSS v4, Mulish font
- **AI**: Anthropic Claude (via @anthropic-ai/sdk)
- **Scraping**: Cheerio + native fetch
- **Scheduling**: External cron or manual trigger

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values
```

### Database Setup

```bash
# Generate migrations (if schema changes)
npx drizzle-kit generate

# Run migrations
npx tsx scripts/migrate.ts

# Seed categories and provinces
npx tsx scripts/seed.ts
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/                    # Next.js pages and API routes
    page.tsx              # Homepage
    explore/              # Searchable experience listings
    experience/[slug]/    # Individual experience pages
    about/                # About / Built by Raj
    workshops/            # AI Workshops lead generation
    admin/                # Admin panel (auth, moderation, pipeline)
    api/                  # REST API endpoints
  components/             # React components
  lib/
    db/                   # Database schema, connection, seed
    discovery/            # AI discovery engine
      engine.ts           # Pipeline orchestrator
      scraper.ts          # Web scraping
      evaluator.ts        # Claude AI evaluation
      deduplicator.ts     # Duplicate detection
      sources.ts          # Search query configuration
    ai/                   # Anthropic SDK client
    auth/                 # Admin authentication
    utils/                # Helpers
scripts/                  # CLI scripts (seed, migrate, run-discovery)
```

## Discovery Engine

The discovery pipeline runs daily:

1. Selects 8 random search queries from 40+ patterns
2. Searches DuckDuckGo for each query
3. Deduplicates candidates against seen URLs and existing titles
4. Scrapes each candidate page for structured content
5. Sends content to Claude AI for evaluation and scoring
6. Publishes experiences scoring 85+ automatically
7. Queues experiences scoring 70-84 for admin review
8. Discards anything below 70

### Running the Pipeline

```bash
# Manual run via CLI
npx tsx scripts/run-discovery.ts

# Scheduled via cron (runs daily at 6 AM)
0 6 * * * curl -X POST https://fai.events/api/cron/discovery -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Admin Panel

Visit `/admin` and log in with your `ADMIN_SECRET`.

Features: dashboard with stats, experience moderation, experience editor, manual pipeline trigger.

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/experiences | List with search, filter, pagination |
| GET | /api/experiences/:id | Single experience by ID or slug |
| GET | /api/categories | All categories |
| GET | /api/provinces | All provinces by region |
| POST | /api/admin/auth | Admin login |
| POST | /api/admin/moderate | Bulk approve/reject |
| POST | /api/admin/pipeline | Trigger discovery |
| POST | /api/cron/discovery | Protected daily cron trigger |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| ANTHROPIC_API_KEY | Yes | Anthropic API key for Claude |
| ADMIN_SECRET | Yes | Admin panel password |
| CRON_SECRET | Yes | Cron endpoint bearer token |
| NEXT_PUBLIC_SITE_URL | No | Site URL (default: https://fai.events) |

## Deployment

### Vercel

Add environment variables in the Vercel dashboard. For scheduled discovery, add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/discovery",
    "schedule": "0 6 * * *"
  }]
}
```

### Self-Hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Set up a system cron job for daily discovery
4. Ensure the `data/` directory is persistent

## Created By

[Raj Goodman](https://rajgoodman.com/) - AI innovator, workshop facilitator, and creator of fai.events. Raj delivers hands-on AI workshops in Bangkok, Phuket, and across the region, both online and in person.

Built with [Claude AI](https://claude.ai) and [Claude Code](https://claude.ai/claude-code) by Anthropic.
