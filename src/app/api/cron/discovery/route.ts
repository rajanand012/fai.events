import { NextRequest, NextResponse } from 'next/server';
import { runDiscoveryPipeline } from '@/lib/discovery/engine';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runDiscoveryPipeline('cron');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error running cron pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to run pipeline' },
      { status: 500 }
    );
  }
}
