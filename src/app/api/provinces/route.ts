import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { provinces } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import type { Province } from '@/lib/db/schema';

export async function GET() {
  const results = db
    .select()
    .from(provinces)
    .orderBy(asc(provinces.name))
    .all();

  const byRegion: Record<string, Province[]> = {};
  for (const province of results) {
    if (!byRegion[province.region]) {
      byRegion[province.region] = [];
    }
    byRegion[province.region].push(province);
  }

  return NextResponse.json({ provinces: results, byRegion });
}
