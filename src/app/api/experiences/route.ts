import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { experiences } from '@/lib/db/schema';
import { eq, desc, asc, like, and, or, sql, count } from 'drizzle-orm';
import { isAdmin } from '@/lib/auth/admin';
import { generateUniqueSlug } from '@/lib/utils/slugify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const province = searchParams.get('province');
  const status = searchParams.get('status') || 'approved';
  const sort = searchParams.get('sort') || 'score';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
  const featured = searchParams.get('featured');

  const conditions = [];

  if (status !== 'all') {
    conditions.push(eq(experiences.status, status));
  }

  if (q) {
    const searchTerm = `%${q}%`;
    conditions.push(
      or(
        like(experiences.title, searchTerm),
        like(experiences.destination, searchTerm),
        like(experiences.summaryShort, searchTerm)
      )!
    );
  }

  if (category) {
    conditions.push(eq(experiences.category, category));
  }

  if (province) {
    conditions.push(eq(experiences.province, province));
  }

  if (featured === 'true') {
    conditions.push(eq(experiences.isFeatured, 1));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const [totalResult] = db
    .select({ value: count() })
    .from(experiences)
    .where(whereClause)
    .all();

  const total = totalResult?.value ?? 0;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  // Determine sort order
  let orderBy;
  switch (sort) {
    case 'newest':
      orderBy = desc(experiences.discoveredAt);
      break;
    case 'title':
      orderBy = asc(experiences.title);
      break;
    case 'score':
    default:
      orderBy = desc(experiences.aiScore);
      break;
  }

  const results = db
    .select()
    .from(experiences)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)
    .all();

  return NextResponse.json({
    experiences: results,
    total,
    page,
    totalPages,
  });
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const slug = await generateUniqueSlug(body.title);

    db.insert(experiences)
      .values({
        slug,
        title: body.title,
        destination: body.destination,
        province: body.province,
        category: body.category,
        summaryShort: body.summaryShort,
        summaryLong: body.summaryLong,
        whySpecial: body.whySpecial || null,
        imageUrl: body.imageUrl || null,
        sourceUrl: body.sourceUrl,
        websiteUrl: body.websiteUrl || null,
        bookingUrl: body.bookingUrl || null,
        socialLink: body.socialLink || null,
        contactLink: body.contactLink || null,
        priceRange: body.priceRange || null,
        priceNote: body.priceNote || null,
        aiScore: body.aiScore || 0,
        aiReasoning: body.aiReasoning || null,
        uniquenessScore: body.uniquenessScore || 0,
        luxuryScore: body.luxuryScore || 0,
        authenticityScore: body.authenticityScore || 0,
        status: body.status || 'pending',
        isFeatured: body.isFeatured ? 1 : 0,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        bestTimeToVisit: body.bestTimeToVisit || null,
        duration: body.duration || null,
        discoveredAt: now,
        publishedAt: body.status === 'approved' ? now : null,
        updatedAt: now,
      })
      .run();

    const created = db.select().from(experiences).where(eq(experiences.slug, slug)).get();

    return NextResponse.json({ experience: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
