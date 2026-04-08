import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const results = db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder))
    .all();

  return NextResponse.json({ categories: results });
}
