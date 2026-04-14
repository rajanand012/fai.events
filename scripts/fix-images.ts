import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex);
        const value = trimmed.substring(eqIndex + 1);
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
} catch {}

async function main() {
  const { db } = await import('../src/lib/db');
  const { experiences } = await import('../src/lib/db/schema');
  const { like } = await import('drizzle-orm');

  const now = new Date().toISOString();

  // Update Dan Remon's image
  await db.update(experiences)
    .set({ imageUrl: 'https://danremon.com/storage/2022/03/dan-remon-1.jpg', updatedAt: now })
    .where(like(experiences.title, '%Dan Remon%'))
    .run();
  console.log('Updated Dan Remon image');

  // Update Raj Goodman's image - use object-top positioning via a different image or use the local image with better framing
  // The current image is /images/raj-goodman-workshop.jpg - let's check what it is
  const raj = await db.select().from(experiences).where(like(experiences.title, '%Raj Goodman%'));
  console.log('Raj current image:', raj[0]?.imageUrl);

  // Use a professional headshot-style Unsplash image that shows full head
  await db.update(experiences)
    .set({ imageUrl: '/images/raj-goodman-workshop.jpg', updatedAt: now })
    .where(like(experiences.title, '%Raj Goodman%'))
    .run();
  console.log('Raj image stays as local file - will fix CSS cropping instead');
}

main().catch(console.error);
