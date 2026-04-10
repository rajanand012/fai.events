import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { experiences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isAdmin } from '@/lib/auth/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const numericId = parseInt(id, 10);
  const isNumeric = !isNaN(numericId) && String(numericId) === id;

  const result = isNumeric
    ? await db.select().from(experiences).where(eq(experiences.id, numericId)).get()
    : await db.select().from(experiences).where(eq(experiences.slug, id)).get();

  if (!result) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  }

  return NextResponse.json({ experience: result });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid experience ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const updateData: Record<string, unknown> = { updatedAt: now };

    const allowedFields = [
      'title', 'destination', 'province', 'category', 'summaryShort',
      'summaryLong', 'whySpecial', 'imageUrl', 'sourceUrl', 'websiteUrl',
      'bookingUrl', 'socialLink', 'contactLink', 'priceRange', 'priceNote',
      'aiScore', 'aiReasoning', 'uniquenessScore', 'luxuryScore',
      'authenticityScore', 'status', 'tags', 'bestTimeToVisit', 'duration',
      'publishedAt',
    ];

    for (const field of allowedFields) {
      if (field in body) {
        if (field === 'tags' && Array.isArray(body.tags)) {
          updateData[field] = JSON.stringify(body.tags);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if ('isFeatured' in body) {
      updateData.isFeatured = body.isFeatured ? 1 : 0;
    }

    if (body.status === 'approved' && !body.publishedAt) {
      updateData.publishedAt = now;
    }

    await db.update(experiences)
      .set(updateData)
      .where(eq(experiences.id, numericId))
      .run();

    const updated = await db.select().from(experiences).where(eq(experiences.id, numericId)).get();

    if (!updated) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ experience: updated });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid experience ID' }, { status: 400 });
  }

  await db.update(experiences)
    .set({ status: 'archived', updatedAt: new Date().toISOString() })
    .where(eq(experiences.id, numericId))
    .run();

  const archived = await db.select().from(experiences).where(eq(experiences.id, numericId)).get();

  if (!archived) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  }

  return NextResponse.json({ experience: archived });
}
