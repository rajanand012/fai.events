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
  console.log('DB URL:', process.env.TURSO_DATABASE_URL ? 'TURSO' : 'LOCAL');

  const { db } = await import('../src/lib/db');
  const { experiences } = await import('../src/lib/db/schema');
  const { eq } = await import('drizzle-orm');

  const now = new Date().toISOString();

  // All URLs verified working as of 2026-04-14
  // Each experience has: websiteUrl (official site), bookingUrl (where to book), sourceUrl (reference)
  const fixes: Record<string, { sourceUrl: string; websiteUrl: string; bookingUrl: string }> = {
    'bangkok-floating-markets-sunrise-tour': {
      // Official floating market tour site with booking integration
      sourceUrl: 'https://damnoensaduak.com/en/',
      websiteUrl: 'https://damnoensaduak.com/en/',
      bookingUrl: 'https://www.viator.com/tours/Bangkok/Floating-Markets-of-Damnoen-Saduak-Cruise-Day-Trip-from-Bangkok/d343-3685BKK21C',
    },
    'bangkok-muay-thai-vip-ringside-experience': {
      // Official Rajadamnern Stadium site + ticket page
      sourceUrl: 'https://www.rajadamnern.com/',
      websiteUrl: 'https://www.rajadamnern.com/',
      bookingUrl: 'https://rajadamnern.com/tickets/',
    },
    'bangkok-jim-thompson-house-private-tour': {
      // Official museum site + Viator booking page
      sourceUrl: 'https://www.jimthompsonhouse.org',
      websiteUrl: 'https://www.jimthompsonhouse.org',
      bookingUrl: 'https://www.viator.com/Bangkok-attractions/Jim-Thompson-House-Museum/d343-a8537',
    },
    'bangkok-chinatown-street-food-after-dark': {
      // Bangkok Food Tours: actual bookable Yaowarat food tour
      sourceUrl: 'https://www.bangkokfoodtours.com/chinatown/',
      websiteUrl: 'https://www.bangkokfoodtours.com/chinatown/',
      bookingUrl: 'https://www.bangkokfoodtours.com/chinatown/',
    },
    'bangkok-grand-palace-and-emerald-buddha-dawn': {
      // Official Grand Palace site + ticket purchasing page
      sourceUrl: 'https://www.royalgrandpalace.th/en/home',
      websiteUrl: 'https://www.royalgrandpalace.th/en/home',
      bookingUrl: 'https://www.royalgrandpalace.th/en/buy-ticket',
    },
    'bangkok-rooftop-cocktails-lebua-sky-bar': {
      // lebua.com is down, using Rooftop Guide as reference + GetYourGuide booking
      sourceUrl: 'https://www.therooftopguide.com/rooftop-bars-in-bangkok/sky-bar-lebua-at-state-tower.html',
      websiteUrl: 'https://www.therooftopguide.com/rooftop-bars-in-bangkok/sky-bar-lebua-at-state-tower.html',
      bookingUrl: 'https://www.getyourguide.com/bangkok-l169/bangkok-lebua-rooftop-bar-reservation-round-trip-transfer-t300586/',
    },
    'bangkok-traditional-thai-massage-wat-pho': {
      // Official Wat Pho site + visit planning page with massage booking info
      sourceUrl: 'https://www.watpho.com/',
      websiteUrl: 'https://www.watpho.com/',
      bookingUrl: 'https://www.watpho.com/en/contact/plan',
    },
    'bangkok-chao-phraya-dinner-cruise-luxury': {
      // Chao Phraya Cruise: actual cruise operator with online booking
      sourceUrl: 'https://www.chaophrayacruise.com/',
      websiteUrl: 'https://www.chaophrayacruise.com/',
      bookingUrl: 'https://www.chaophrayacruise.com/',
    },
    'bangkok-hidden-speakeasy-bar-hopping': {
      // TUK ME: actual bookable speakeasy bar hopping tour by electric tuk tuk
      sourceUrl: 'https://www.tukme.co/products/speakeasy-bar-hopping',
      websiteUrl: 'https://www.tukme.co/products/speakeasy-bar-hopping',
      bookingUrl: 'https://www.tukme.co/products/speakeasy-bar-hopping',
    },
    'bangkok-lumpini-park-tai-chi-morning': {
      // Viator: bookable Tai Chi in Lumpini Park experience
      sourceUrl: 'https://www.viator.com/tours/Bangkok/Tai-Chi-in-Lumpini-Park/d343-9566P117',
      websiteUrl: 'https://www.viator.com/tours/Bangkok/Tai-Chi-in-Lumpini-Park/d343-9566P117',
      bookingUrl: 'https://www.viator.com/tours/Bangkok/Tai-Chi-in-Lumpini-Park/d343-9566P117',
    },
  };

  for (const [slug, fix] of Object.entries(fixes)) {
    await db.update(experiences)
      .set({
        sourceUrl: fix.sourceUrl,
        websiteUrl: fix.websiteUrl,
        bookingUrl: fix.bookingUrl,
        updatedAt: now,
      })
      .where(eq(experiences.slug, slug))
      .run();
    console.log(`Fixed: ${slug}`);
    console.log(`  Website: ${fix.websiteUrl}`);
    console.log(`  Booking: ${fix.bookingUrl}`);
  }

  console.log('\nDone! All URLs updated with verified booking links.');
}

main().catch(console.error);
