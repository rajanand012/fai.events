import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pipelineRuns } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { isAdmin } from '@/lib/auth/admin';
import { runDiscoveryPipeline } from '@/lib/discovery/engine';

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runDiscoveryPipeline('manual');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error running pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to run pipeline' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const runs = await db
    .select()
    .from(pipelineRuns)
    .orderBy(desc(pipelineRuns.startedAt))
    .limit(20)
    .all();

  return NextResponse.json({ runs });
}
