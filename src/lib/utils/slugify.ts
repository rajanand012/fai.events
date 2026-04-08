import { eq } from 'drizzle-orm';
import { db } from '../db';
import { experiences } from '../db/schema';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: experiences.id })
      .from(experiences)
      .where(eq(experiences.slug, candidate))
      .limit(1);

    if (existing.length === 0) {
      return candidate;
    }

    counter++;
    candidate = `${base}-${counter}`;
  }
}
