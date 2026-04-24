import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth/admin';

const BLOCKED_DOMAINS = new Set([
  'facebook.com', 'youtube.com', 'twitter.com', 'x.com', 'instagram.com',
  'tiktok.com', 'tripadvisor.com', 'booking.com', 'agoda.com', 'expedia.com',
  'hotels.com', 'airbnb.com', 'pinterest.com', 'reddit.com', 'wikipedia.org',
  'amazon.com', 'linkedin.com', 'yelp.com', 'google.com', 'maps.google.com',
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

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BRAVE_SEARCH_API_KEY missing' });
  }

  const query = 'rooftop bar Bangkok skyline best cocktails';
  // Match production search params exactly
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10&country=ALL&safesearch=moderate`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey,
      },
      signal: AbortSignal.timeout(10_000),
    });

    const status = response.status;
    const text = await response.text();
    let data: { web?: { results?: { url: string; title?: string }[] } } = {};
    try { data = JSON.parse(text); } catch {}

    const rawResults = data.web?.results ?? [];
    const urls = rawResults.map((r) => r.url);
    const blocked: string[] = [];
    const allowed: string[] = [];
    for (const u of urls) {
      if (isBlockedUrl(u)) blocked.push(u);
      else allowed.push(u);
    }

    return NextResponse.json({
      status,
      rawResultCount: rawResults.length,
      allowedCount: allowed.length,
      blockedCount: blocked.length,
      allowed,
      blocked,
      errorBodyFirst500: status !== 200 ? text.slice(0, 500) : undefined,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
