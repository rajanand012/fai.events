import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth/admin';

/**
 * Diagnostic endpoint: calls Brave Search directly and returns
 * the raw response details so we can see what's actually happening.
 * Admin-gated.
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  const keyPresent = !!apiKey;
  const keyLength = apiKey?.length ?? 0;
  const keyPrefix = apiKey ? apiKey.slice(0, 4) : null;

  if (!apiKey) {
    return NextResponse.json({
      keyPresent,
      error: 'BRAVE_SEARCH_API_KEY env var is missing in this runtime',
    });
  }

  const query = 'rooftop bar Bangkok skyline best cocktails';
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;

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
    const statusText = response.statusText;
    const text = await response.text();

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // leave as null
    }

    const resultsCount = (parsed as { web?: { results?: unknown[] } })?.web?.results?.length ?? 0;

    return NextResponse.json({
      keyPresent,
      keyLength,
      keyPrefix,
      query,
      status,
      statusText,
      resultsCount,
      bodyFirst500: text.slice(0, 500),
    });
  } catch (error) {
    return NextResponse.json({
      keyPresent,
      keyLength,
      keyPrefix,
      error: String(error),
    });
  }
}
