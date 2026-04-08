import * as cheerio from 'cheerio';
import type { RawCandidate, ScrapedContent } from './types';
import { getSearchUrl } from './sources';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const FETCH_TIMEOUT = 10_000;

/** Domains that won't have scrapeable unique experience content. */
const BLOCKED_DOMAINS = new Set([
  'facebook.com',
  'youtube.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'tiktok.com',
  'tripadvisor.com',
  'booking.com',
  'agoda.com',
  'expedia.com',
  'hotels.com',
  'airbnb.com',
  'pinterest.com',
  'reddit.com',
  'wikipedia.org',
  'amazon.com',
  'linkedin.com',
  'yelp.com',
  'google.com',
  'maps.google.com',
]);

function isBlockedUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return Array.from(BLOCKED_DOMAINS).some(
      (domain) => hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return true;
  }
}

/**
 * Search DuckDuckGo HTML for a query and return raw candidate URLs.
 * Returns up to 10 results per query.
 */
export async function searchWeb(query: string): Promise<RawCandidate[]> {
  const searchUrl = getSearchUrl(query);

  try {
    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      console.error(
        `[scraper] Search failed for "${query}": HTTP ${response.status}`
      );
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const candidates: RawCandidate[] = [];

    // DuckDuckGo HTML results use .result__a for links
    $('a.result__a').each((_i, el) => {
      if (candidates.length >= 10) return false;

      const rawHref = $(el).attr('href') || '';
      const title = $(el).text().trim();

      // DuckDuckGo wraps links through a redirect; extract the actual URL
      let url = rawHref;
      try {
        const parsed = new URL(rawHref, 'https://duckduckgo.com');
        const uddg = parsed.searchParams.get('uddg');
        if (uddg) {
          url = decodeURIComponent(uddg);
        }
      } catch {
        // Use rawHref as-is if parsing fails
      }

      // Validate URL
      try {
        new URL(url);
      } catch {
        return; // skip invalid URLs
      }

      if (isBlockedUrl(url)) return;

      const snippet =
        $(el).closest('.result').find('.result__snippet').text().trim() || '';

      candidates.push({
        url,
        title: title || undefined,
        snippet: snippet || undefined,
        source: query,
      });
    });

    return candidates;
  } catch (error) {
    console.error(`[scraper] Search error for "${query}":`, error);
    return [];
  }
}

/**
 * Scrape a URL and extract structured content for AI evaluation.
 * Returns null on any failure.
 */
export async function scrapeUrl(url: string): Promise<ScrapedContent | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`[scraper] Scrape failed for ${url}: HTTP ${response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('xhtml')) {
      console.error(`[scraper] Non-HTML content at ${url}: ${contentType}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $('nav, footer, sidebar, script, style, aside, .sidebar, .nav, .footer, .menu, .advertisement, .ad, noscript, iframe').remove();

    // Extract metadata
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text().trim() ||
      '';

    const ogImage = $('meta[property="og:image"]').attr('content') || undefined;
    const ogTitle = $('meta[property="og:title"]').attr('content') || undefined;
    const ogDescription =
      $('meta[property="og:description"]').attr('content') || undefined;

    const description =
      ogDescription ||
      $('meta[name="description"]').attr('content') ||
      '';

    // Extract body text from the most relevant container
    let bodyText = '';
    const contentSelectors = [
      'article',
      'main',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-body',
      '.post-body',
      '#content',
      '#main-content',
    ];

    for (const selector of contentSelectors) {
      const el = $(selector);
      if (el.length > 0) {
        bodyText = el.text().replace(/\s+/g, ' ').trim();
        if (bodyText.length > 100) break;
      }
    }

    // Fallback to body
    if (bodyText.length < 100) {
      bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    }

    // Truncate body text to 5000 characters
    if (bodyText.length > 5000) {
      bodyText = bodyText.slice(0, 5000);
    }

    // Extract images
    const images: { src: string; alt: string }[] = [];
    $('img').each((_i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      const alt = $(el).attr('alt') || '';
      if (src && !src.startsWith('data:') && images.length < 20) {
        // Resolve relative URLs
        try {
          const absoluteSrc = new URL(src, url).href;
          images.push({ src: absoluteSrc, alt });
        } catch {
          images.push({ src, alt });
        }
      }
    });

    // Extract links
    const links: string[] = [];
    $('a[href]').each((_i, el) => {
      const href = $(el).attr('href') || '';
      if (href && !href.startsWith('#') && !href.startsWith('javascript:') && links.length < 50) {
        try {
          const absoluteHref = new URL(href, url).href;
          links.push(absoluteHref);
        } catch {
          // skip invalid URLs
        }
      }
    });

    return {
      url,
      title,
      description,
      bodyText,
      images,
      ogImage,
      ogTitle,
      ogDescription,
      links,
    };
  } catch (error) {
    console.error(`[scraper] Scrape error for ${url}:`, error);
    return null;
  }
}
