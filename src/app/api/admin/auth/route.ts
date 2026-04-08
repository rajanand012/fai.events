import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, createAdminCookie, clearAdminCookie } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    if (!secret) {
      return NextResponse.json({ error: 'Secret is required' }, { status: 400 });
    }

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (secret !== adminSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', createAdminCookie());
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const authenticated = isAdmin(request);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', clearAdminCookie());
  return response;
}
