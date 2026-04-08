import { createHash } from 'crypto';

const COOKIE_NAME = 'fai_admin_session';

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SECRET environment variable is not set');
  }
  return secret;
}

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

export function isAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return false;

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...rest] = c.trim().split('=');
      return [key, rest.join('=')];
    })
  );

  const sessionValue = cookies[COOKIE_NAME];
  if (!sessionValue) return false;

  try {
    const expected = hashSecret(getAdminSecret());
    return sessionValue === expected;
  } catch {
    return false;
  }
}

export function createAdminCookie(): string {
  const value = hashSecret(getAdminSecret());
  return `${COOKIE_NAME}=${value}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearAdminCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`;
}
