/**
 * Default search queries designed to find premium Thailand experiences.
 * Covers luxury, adventure, wellness, dining, cultural, and island
 * experiences across major Thai destinations.
 */
export const DEFAULT_SEARCH_QUERIES: string[] = [
  // Bangkok
  'Michelin star restaurant Bangkok fine dining',
  'rooftop bar Bangkok skyline best cocktails',
  'luxury spa Bangkok traditional Thai wellness',
  'Bangkok hidden gem experience off the beaten path',
  'private boat tour Bangkok canals floating market',

  // Phuket
  'private yacht charter Phuket luxury day trip',
  'Phuket luxury villa pool private beach',
  'best sunset dining Phuket oceanfront restaurant',
  'Phuket ethical elephant experience premium',
  'scuba diving Phuket private instructor coral reef',

  // Chiang Mai
  'elephant sanctuary Chiang Mai ethical premium',
  'Chiang Mai luxury wellness retreat mountain',
  'Thai cooking class Chiang Mai premium organic farm',
  'Chiang Mai temple tour private guide sunrise',
  'Chiang Mai night market artisan handcraft luxury',

  // Koh Samui
  'Koh Samui private beach villa luxury resort',
  'Koh Samui wellness detox retreat premium',
  'Koh Samui sunset cruise private catamaran',

  // Krabi and Phi Phi
  'Krabi rock climbing private guide premium experience',
  'Phi Phi island private speedboat snorkeling tour',
  'Krabi hidden lagoon kayak premium adventure',

  // Adventure and Nature
  'diving Similan Islands private liveaboard luxury',
  'hidden waterfall Kanchanaburi private trek',
  'Khao Sok National Park luxury floating bungalow',
  'Muay Thai training camp premium Bangkok',

  // Cultural and Unique
  'Thai silk weaving workshop luxury Isan experience',
  'premium Thai heritage tour ancient Sukhothai',
  'Ayutthaya private guided tour luxury river cruise',
  'Chiang Rai White Temple Blue Temple private tour',

  // Wellness
  'luxury meditation retreat Thailand silent',
  'Thailand holistic wellness resort detox program',
  'premium yoga retreat Koh Phangan beachfront',

  // Islands and Beaches
  'Koh Lipe private island hopping snorkeling',
  'Koh Yao Noi luxury eco resort boutique',
  'Koh Kood secluded beach luxury treehouse resort',

  // Food and Drink
  'Thai street food tour Bangkok premium guided',
  'whiskey tasting Thailand craft distillery experience',
  'farm to table dining Chiang Mai organic luxury',

  // Specialty
  'luxury train journey Thailand scenic route',
  'Thailand private helicopter tour scenic',
  'Hua Hin royal beach town luxury experience premium',
];

/**
 * Build a DuckDuckGo HTML search URL for a given query.
 * DuckDuckGo is more scrape-friendly than Google.
 */
export function getSearchUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://html.duckduckgo.com/html/?q=${encoded}`;
}

/**
 * Pick `count` random queries from the default list, ensuring variety
 * across different destinations and categories.
 *
 * Uses Fisher-Yates shuffle on a copy, then takes the first `count` items.
 */
export function getRotatedQueries(count: number): string[] {
  const pool = [...DEFAULT_SEARCH_QUERIES];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(count, pool.length));
}
