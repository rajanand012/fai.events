import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { experiences } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { isAdmin } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids, action } = body as {
      ids: number[];
      action: 'approve' | 'reject' | 'archive' | 'feature' | 'unfeature';
    };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    let updated = 0;

    for (const id of ids) {
      let updateData: Record<string, unknown> = { updatedAt: now };

      switch (action) {
        case 'approve':
          updateData.status = 'approved';
          updateData.publishedAt = now;
          break;
        case 'reject':
          updateData.status = 'rejected';
          break;
        case 'archive':
          updateData.status = 'archived';
          break;
        case 'feature':
          updateData.isFeatured = 1;
          break;
        case 'unfeature':
          updateData.isFeatured = 0;
          break;
        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }

      const result = await db
        .update(experiences)
        .set(updateData)
        .where(eq(experiences.id, id))
        .run();

      updated += result.rowsAffected;
    }

    return NextResponse.json({ updated });
  } catch (error) {
    console.error('Error moderating experiences:', error);
    return NextResponse.json(
      { error: 'Failed to moderate experiences' },
      { status: 500 }
    );
  }
}
