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
  const fixes: Record<string, { sourceUrl: string; websiteUrl?: string }> = {
    'bangkok-floating-markets-sunrise-tour': {
      // bangkok.com redirects to hotels.com (broken)
      // Wikipedia is reliable and authoritative
      sourceUrl: 'https://en.wikipedia.org/wiki/Damnoen_Saduak_floating_market',
      websiteUrl: 'https://en.wikipedia.org/wiki/Damnoen_Saduak_floating_market',
    },
    'bangkok-muay-thai-vip-ringside-experience': {
      // rajadamnern.com - verified working
      sourceUrl: 'https://www.rajadamnern.com/',
      websiteUrl: 'https://www.rajadamnern.com/',
    },
    'bangkok-jim-thompson-house-private-tour': {
      // jimthompsonhouse.com has SSL error, .org version works
      sourceUrl: 'https://www.jimthompsonhouse.org',
      websiteUrl: 'https://www.jimthompsonhouse.org',
    },
    'bangkok-chinatown-street-food-after-dark': {
      // bangkok.com redirects to hotels.com (broken)
      sourceUrl: 'https://en.wikipedia.org/wiki/Yaowarat_Road',
      websiteUrl: 'https://en.wikipedia.org/wiki/Yaowarat_Road',
    },
    'bangkok-grand-palace-and-emerald-buddha-dawn': {
      // royalgrandpalace.th - verified working
      sourceUrl: 'https://www.royalgrandpalace.th/en/home',
      websiteUrl: 'https://www.royalgrandpalace.th/en/home',
    },
    'bangkok-rooftop-cocktails-lebua-sky-bar': {
      // lebua.com is completely down (ECONNREFUSED)
      // Wikipedia article about the property includes Sky Bar info
      sourceUrl: 'https://en.wikipedia.org/wiki/Lebua_at_State_Tower',
      websiteUrl: 'https://en.wikipedia.org/wiki/Lebua_at_State_Tower',
    },
    'bangkok-traditional-thai-massage-wat-pho': {
      // watpho.com - verified working
      sourceUrl: 'https://www.watpho.com/',
      websiteUrl: 'https://www.watpho.com/',
    },
    'bangkok-chao-phraya-dinner-cruise-luxury': {
      // bangkok.com redirects to hotels.com (broken)
      // chaophrayacruise.com is an actual cruise operator, verified working
      sourceUrl: 'https://www.chaophrayacruise.com/',
      websiteUrl: 'https://www.chaophrayacruise.com/',
    },
    'bangkok-hidden-speakeasy-bar-hopping': {
      // timeout.com returns 400, worlds50bestbars.com 404
      // Vesper is a real, acclaimed Bangkok cocktail bar, verified working
      sourceUrl: 'https://www.vesperbar.co/',
      websiteUrl: 'https://www.vesperbar.co/',
    },
    'bangkok-lumpini-park-tai-chi-morning': {
      // bangkok.com redirects to hotels.com (broken)
      sourceUrl: 'https://en.wikipedia.org/wiki/Lumphini_Park',
      websiteUrl: 'https://en.wikipedia.org/wiki/Lumphini_Park',
    },
  };

  for (const [slug, fix] of Object.entries(fixes)) {
    await db.update(experiences)
      .set({ sourceUrl: fix.sourceUrl, websiteUrl: fix.websiteUrl, updatedAt: now })
      .where(eq(experiences.slug, slug))
      .run();
    console.log(`Fixed: ${slug} -> ${fix.sourceUrl}`);
  }

  console.log('\nDone! All source URLs updated with verified working links.');
}

main().catch(console.error);
