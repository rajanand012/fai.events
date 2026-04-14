import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local since we're outside Next.js
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
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch {
  console.warn('Warning: Could not read .env.local');
}

import { db } from '../src/lib/db';
import { experiences } from '../src/lib/db/schema';
import { eq, like } from 'drizzle-orm';

async function main() {
  const now = new Date().toISOString();

  // ============================================================
  // STEP 1: Add Dan Remon Workshop
  // ============================================================
  console.log('=== Step 1: Adding Dan Remon Workshop ===');

  // Check if already exists
  const existingDan = await db.select().from(experiences).where(like(experiences.title, '%Dan Remon%')).limit(1);
  if (existingDan.length > 0) {
    console.log('Dan Remon workshop already exists, skipping.');
  } else {
    await db.insert(experiences).values({
      slug: 'high-performance-life-coaching-with-dan-remon',
      title: 'High Performance Life Coaching with Dan Remon',
      destination: 'Available Across Thailand',
      province: 'Bangkok',
      category: 'workshops',
      summaryShort: 'Transform your life with high-performance coaching from Dan Remon, an expert life coach based in Bangkok specializing in personal breakthroughs and peak performance.',
      summaryLong: 'Dan Remon is a high-performance life coach based in the heart of Bangkok on Sukhumvit Road. His coaching practice focuses on helping ambitious individuals unlock their full potential through proven methodologies that address mindset, emotional resilience, and goal achievement.\n\nWhether you are navigating career transitions, seeking personal transformation, or looking to break through psychological barriers, Dan brings a unique blend of psychotherapy-informed techniques and performance coaching to every session. His approach integrates mental health awareness with actionable strategies for sustainable growth.\n\nAvailable for both in-person sessions in Bangkok and intensive workshops across Thailand, Dan works with entrepreneurs, executives, and high-achievers who demand more from themselves and their lives.',
      whySpecial: 'Dan Remon combines psychotherapy-informed coaching with high-performance methodologies, offering a rare depth of expertise for those seeking genuine transformation in a stunning Thai setting.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
      sourceUrl: 'https://danremon.com/',
      websiteUrl: 'https://danremon.com/',
      priceRange: '$',
      priceNote: 'Contact for session rates and workshop packages',
      aiScore: 82,
      aiReasoning: 'High-performance life coaching with a Bangkok-based expert. Strong appeal for visiting professionals and entrepreneurs seeking personal development during their Thailand experience.',
      uniquenessScore: 78,
      luxuryScore: 70,
      authenticityScore: 85,
      status: 'approved',
      isFeatured: 0,
      tags: 'coaching, life coaching, high performance, personal development, wellness, transformation',
      bestTimeToVisit: 'Year-round',
      duration: '1-3 hours per session',
      discoveredAt: now,
      publishedAt: now,
      updatedAt: now,
    }).run();
    console.log('Added: High Performance Life Coaching with Dan Remon');
  }

  // ============================================================
  // STEP 2: Make all workshops available across all cities
  // ============================================================
  console.log('\n=== Step 2: Making all workshops available across Thailand ===');

  const allWorkshops = await db.select().from(experiences).where(eq(experiences.category, 'workshops'));
  console.log(`Found ${allWorkshops.length} workshops`);

  for (const workshop of allWorkshops) {
    if (workshop.destination !== 'Available Across Thailand') {
      await db.update(experiences)
        .set({
          destination: 'Available Across Thailand',
          updatedAt: now,
        })
        .where(eq(experiences.id, workshop.id))
        .run();
      console.log(`Updated: "${workshop.title}" - destination changed from "${workshop.destination}" to "Available Across Thailand"`);
    } else {
      console.log(`Already set: "${workshop.title}"`);
    }
  }

  // ============================================================
  // STEP 3: Add 10 Bangkok experiences
  // ============================================================
  console.log('\n=== Step 3: Adding 10 Bangkok experiences ===');

  const bangkokExperiences = [
    {
      slug: 'bangkok-floating-markets-sunrise-tour',
      title: 'Bangkok Floating Markets Sunrise Tour',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'cultural',
      summaryShort: 'Experience the magic of Bangkok\'s iconic floating markets at dawn, navigating canal-side vendors selling fresh produce, street food, and handmade crafts from traditional longboats.',
      summaryLong: 'Step back in time with a sunrise visit to Bangkok\'s legendary floating markets, where Thai commerce has thrived on waterways for centuries. This early morning experience takes you through a network of canals where vendors in wooden boats sell tropical fruits, sizzling pad thai, and hand-carved souvenirs.\n\nThe tour begins before the crowds arrive, offering an intimate glimpse into daily life along Bangkok\'s historic khlongs. Watch as locals trade goods from boat to boat, sample freshly grilled seafood, and photograph scenes that have remained unchanged for generations.\n\nYour guide provides cultural context about the significance of water-based commerce in Thai history, making this more than a sightseeing trip.',
      whySpecial: 'An authentic glimpse into Thailand\'s water-based trading heritage, experienced at the magical golden hour before tourist crowds arrive.',
      imageUrl: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.tourismthailand.org/Attraction/floating-markets',
      priceRange: '$$',
      priceNote: 'From 1,500 THB per person including boat and guide',
      aiScore: 88,
      uniquenessScore: 85,
      luxuryScore: 72,
      authenticityScore: 92,
      tags: 'floating market, cultural, sunrise, traditional, food, photography',
    },
    {
      slug: 'bangkok-muay-thai-vip-ringside-experience',
      title: 'VIP Ringside Muay Thai at Rajadamnern Stadium',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'adventure',
      summaryShort: 'Witness the art of eight limbs from VIP ringside seats at Rajadamnern Stadium, Thailand\'s most prestigious Muay Thai venue, with premium hospitality and expert commentary.',
      summaryLong: 'Rajadamnern Stadium is the cathedral of Muay Thai, hosting championship bouts since 1945. The VIP ringside experience places you mere feet from the action, where you can feel the intensity of every strike and hear the rhythmic wai kru music that precedes each fight.\n\nYour evening includes premium seating, complimentary drinks, and an English-speaking Muay Thai expert who explains the techniques, scoring, and rich traditions behind each bout. The atmosphere is electric as locals and visitors alike cheer for their fighters.\n\nThis is not a tourist show. These are real competitive bouts featuring Thailand\'s best fighters, making it a genuine cultural experience.',
      whySpecial: 'VIP access to Thailand\'s most historic Muay Thai stadium with expert commentary, offering an authentic and thrilling sporting experience.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.rajadamnern.com/',
      priceRange: '$$$',
      priceNote: 'VIP ringside from 3,000 THB',
      aiScore: 86,
      uniquenessScore: 88,
      luxuryScore: 80,
      authenticityScore: 95,
      tags: 'muay thai, sports, cultural, nightlife, VIP, historic',
    },
    {
      slug: 'bangkok-jim-thompson-house-private-tour',
      title: 'Private Tour of Jim Thompson House & Silk Heritage',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'cultural',
      summaryShort: 'Explore the stunning teak mansion of the legendary American silk king with a private guide, then visit working silk looms to see master weavers create exquisite Thai silk.',
      summaryLong: 'The Jim Thompson House is one of Bangkok\'s most treasured cultural landmarks: a collection of six traditional Thai teak houses reassembled along a scenic canal in the heart of the city. Jim Thompson, the American businessman who revived Thailand\'s silk industry, filled this home with Southeast Asian art and antiques before his mysterious disappearance in 1967.\n\nA private guide leads you through rooms filled with Burmese carvings, Chinese porcelain, and Khmer sculptures, sharing the fascinating story of Thompson\'s life and legacy. The lush tropical gardens provide a peaceful escape from the city.\n\nThe experience extends to a nearby silk weaving workshop where artisans demonstrate centuries-old techniques, and you can purchase authentic Thai silk directly from the weavers.',
      whySpecial: 'A private, unhurried exploration of one of Asia\'s finest collections of traditional art, combined with living silk-weaving heritage.',
      imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.jimthompsonhouse.com/',
      priceRange: '$$',
      priceNote: 'Private tours from 2,500 THB per person',
      aiScore: 87,
      uniquenessScore: 82,
      luxuryScore: 85,
      authenticityScore: 90,
      tags: 'silk, art, museum, cultural heritage, private tour, architecture',
    },
    {
      slug: 'bangkok-chinatown-street-food-after-dark',
      title: 'Chinatown Street Food After Dark',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'fine-dining',
      summaryShort: 'Dive into Bangkok\'s legendary Yaowarat Road after sunset for a guided street food crawl through Chinatown\'s most celebrated stalls, tasting dishes passed down through generations.',
      summaryLong: 'Bangkok\'s Chinatown transforms after dark into a neon-lit wonderland of sizzling woks, bubbling soups, and aromatic grills. Yaowarat Road, the pulsing artery of this district, comes alive with food carts and shophouse restaurants that have been serving legendary dishes for decades.\n\nYour guide navigates the labyrinth of sois (alleyways) to find the best of the best: Michelin-recognized street stalls serving pad thai cooked over charcoal, century-old shops ladling shark fin soup alternatives, vendors grilling jumbo prawns over open flames, and hidden dessert spots crafting traditional Thai sweets.\n\nAlong the way, discover the history of Bangkok\'s Chinese-Thai community, visit gold shops and herbal medicine stores, and experience the organized chaos that makes Yaowarat one of the world\'s greatest food streets.',
      whySpecial: 'One of the world\'s greatest street food districts experienced after dark when the energy peaks, guided by a local who knows every hidden stall.',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.tourismthailand.org/Attraction/yaowarat',
      priceRange: '$$',
      priceNote: 'Guided tours from 1,800 THB including tastings',
      aiScore: 91,
      uniquenessScore: 86,
      luxuryScore: 68,
      authenticityScore: 96,
      tags: 'street food, chinatown, night tour, culinary, local cuisine, Michelin',
    },
    {
      slug: 'bangkok-grand-palace-and-emerald-buddha-dawn',
      title: 'Grand Palace & Emerald Buddha at Dawn',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'cultural',
      summaryShort: 'Visit Thailand\'s most sacred temple and the dazzling Grand Palace complex with an early morning guided tour, experiencing these national treasures before the midday crowds.',
      summaryLong: 'The Grand Palace has been the spiritual and political heart of Thailand since 1782, a sprawling 218,000 square meter complex of ornate buildings, gilded spires, and sacred temples that remains the country\'s most important landmark.\n\nAn early morning visit transforms the experience entirely. Arriving as the gates open, you explore the intricate murals of the Ramakien epic, the gleaming golden chedi, and the revered Emerald Buddha in Wat Phra Kaew with space to absorb the magnificence.\n\nYour expert guide decodes the symbolism in every detail: the mythical garuda guardians, the demon statues, the significance of the three seasonal robes worn by the Emerald Buddha, and the architectural fusion of Thai, Chinese, and European influences that make this complex unique in the world.',
      whySpecial: 'Thailand\'s most important cultural site experienced in the tranquil morning hours with expert interpretation of its deep spiritual and historical significance.',
      imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.royalgrandpalace.th/',
      priceRange: '$$',
      priceNote: 'Entry 500 THB, guided tours from 2,000 THB',
      aiScore: 89,
      uniquenessScore: 80,
      luxuryScore: 78,
      authenticityScore: 98,
      tags: 'grand palace, temple, cultural heritage, history, architecture, sacred',
    },
    {
      slug: 'bangkok-rooftop-cocktails-lebua-sky-bar',
      title: 'Sunset Cocktails at Lebua Sky Bar',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'nightlife',
      summaryShort: 'Sip craft cocktails 820 feet above the city at the world-famous Sky Bar atop Lebua State Tower, watching Bangkok\'s skyline transform from golden sunset to glittering nightscape.',
      summaryLong: 'Made famous by The Hangover Part II, Lebua Sky Bar is far more than a movie set. Perched on the 63rd floor of the State Tower, it is one of the world\'s highest open-air rooftop bars, offering 360-degree views of the Chao Phraya River winding through Bangkok\'s dramatic skyline.\n\nTime your visit for sunset and watch the sky ignite in shades of orange and purple as the city\'s lights begin to twinkle below. The bar\'s signature Hangovertini is a spectacle in itself, mixed and served with theatrical flair.\n\nThe dress code is smart casual, and the atmosphere strikes a balance between exclusive and welcoming. For the full experience, follow drinks with dinner at Sirocco, the adjacent open-air Mediterranean restaurant on the same sky-high terrace.',
      whySpecial: 'One of the world\'s most iconic rooftop bars offering unmatched panoramic views of Bangkok during the magical transition from sunset to city lights.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.lebua.com/sky-bar',
      priceRange: '$$$',
      priceNote: 'Cocktails from 600 THB, no cover charge',
      aiScore: 88,
      uniquenessScore: 84,
      luxuryScore: 92,
      authenticityScore: 75,
      tags: 'rooftop bar, cocktails, sunset, nightlife, luxury, skyline',
    },
    {
      slug: 'bangkok-traditional-thai-massage-wat-pho',
      title: 'Traditional Thai Massage at Wat Pho',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'wellness',
      summaryShort: 'Experience an authentic Thai massage at the birthplace of the art: Wat Pho temple, where the tradition has been taught and practiced for over two centuries.',
      summaryLong: 'Wat Pho is not only home to the magnificent Reclining Buddha; it is the birthplace of traditional Thai massage, recognized by UNESCO as an Intangible Cultural Heritage of Humanity. The temple\'s massage school has been training practitioners since the reign of King Rama III in the 1830s.\n\nReceiving a massage here is a profoundly different experience from a spa visit. Practitioners trained at the Wat Pho school apply techniques passed down through generations: a combination of acupressure, energy line work, and assisted yoga stretches performed on a mat in a serene pavilion within the temple grounds.\n\nAfter your session, take time to explore the temple complex, admire the 46-meter Reclining Buddha, and study the marble inscriptions detailing the principles of Thai traditional medicine that line the courtyards.',
      whySpecial: 'Thai massage at its literal birthplace, performed by practitioners trained in the original temple school with a 200-year lineage.',
      imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.watpho.com/',
      priceRange: '$',
      priceNote: 'From 260 THB for 30 minutes, 420 THB for one hour',
      aiScore: 90,
      uniquenessScore: 90,
      luxuryScore: 65,
      authenticityScore: 99,
      tags: 'thai massage, wellness, temple, UNESCO, traditional, healing',
    },
    {
      slug: 'bangkok-chao-phraya-dinner-cruise-luxury',
      title: 'Luxury Chao Phraya River Dinner Cruise',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'fine-dining',
      summaryShort: 'Glide along the Chao Phraya River on an elegant dinner cruise, savoring a gourmet Thai menu while Bangkok\'s illuminated temples and palaces drift past under the stars.',
      summaryLong: 'The Chao Phraya River has been Bangkok\'s lifeline for centuries, and a luxury dinner cruise offers the most magical perspective on the city. As your beautifully converted rice barge glides upriver, landmark after landmark appears in golden illumination: Wat Arun\'s porcelain-studded spires, the Grand Palace glowing against the night sky, and the silhouettes of historic bridges framing the skyline.\n\nOnboard, a gourmet Thai menu showcases the finest flavors: tom yum with river prawns, massaman curry with slow-cooked beef, and delicate mango sticky rice. Live traditional Thai music accompanies the meal as the warm evening breeze carries the scent of jasmine.\n\nThe intimate setting (most premium cruises limit guests) creates an atmosphere of romance and refinement that makes this a highlight of any Bangkok visit.',
      whySpecial: 'Bangkok\'s most romantic evening experience, combining world-class Thai cuisine with a floating front-row seat to the city\'s illuminated historic landmarks.',
      imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.chaophrayacruise.com/',
      priceRange: '$$$',
      priceNote: 'Premium cruises from 3,500 THB per person',
      aiScore: 87,
      uniquenessScore: 78,
      luxuryScore: 90,
      authenticityScore: 82,
      tags: 'dinner cruise, river, romantic, fine dining, nightlife, temples',
    },
    {
      slug: 'bangkok-hidden-speakeasy-bar-hopping',
      title: 'Bangkok Hidden Speakeasy Bar Crawl',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'nightlife',
      summaryShort: 'Discover Bangkok\'s award-winning hidden bar scene, from secret entrances behind barbershops to cocktail labs ranked among the world\'s best, guided by a local nightlife insider.',
      summaryLong: 'Bangkok has quietly become one of the world\'s great cocktail cities, with multiple bars on the World\'s 50 Best list. But the best ones are nearly impossible to find without insider knowledge, hidden behind unmarked doors, inside vintage barbershops, or through secret phone booths.\n\nYour guide is a local nightlife journalist who has mapped every hidden gem. The evening takes you through 4-5 of the city\'s most creative bars: from a prohibition-era speakeasy in a Chinatown shophouse to a molecular cocktail lab in Thonglor, from a jazz-filled living room bar to a rooftop hidden behind a laundromat facade.\n\nAt each stop, meet the bartenders (many are award-winning), learn about Thai-inspired ingredients like pandan, lemongrass, and butterfly pea flower, and taste cocktails you simply cannot find anywhere else in the world.',
      whySpecial: 'Access to Bangkok\'s world-ranked hidden bar scene with a local nightlife expert, discovering secret entrances and award-winning cocktail artistry.',
      imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.timeout.com/bangkok/bars/best-speakeasy-bars',
      priceRange: '$$$',
      priceNote: 'Guided experiences from 4,000 THB including select drinks',
      aiScore: 89,
      uniquenessScore: 91,
      luxuryScore: 85,
      authenticityScore: 80,
      tags: 'speakeasy, cocktails, nightlife, hidden bars, craft drinks, world best',
    },
    {
      slug: 'bangkok-lumpini-park-tai-chi-morning',
      title: 'Tai Chi & Morning Wellness in Lumpini Park',
      destination: 'Bangkok',
      province: 'Bangkok',
      category: 'wellness',
      summaryShort: 'Join locals for a serene morning of tai chi in Bangkok\'s green heart, Lumpini Park, followed by a healthy breakfast at a nearby wellness cafe.',
      summaryLong: 'Every morning before the city awakens, Lumpini Park transforms into an open-air wellness sanctuary. Hundreds of Bangkok residents gather among the towering trees and tranquil lakes to practice tai chi, yoga, and aerobics in a tradition that has continued for decades.\n\nThis experience invites you to join an English-speaking tai chi instructor who practices daily in the park. Learn the flowing movements of this ancient Chinese martial art alongside Thai locals, breathing in the fresh morning air as monitor lizards sun themselves by the lake and birds fill the canopy with song.\n\nAfterward, walk to a nearby wellness cafe for a nutritious Thai-fusion breakfast: think coconut chia bowls, butterfly pea lattes, and fresh tropical fruit platters. It is the most peaceful way to start a Bangkok day, and a beautiful contrast to the city\'s famous energy.',
      whySpecial: 'An authentic local morning ritual in Bangkok\'s most beautiful park, offering a rare moment of tranquility and cultural immersion.',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop',
      sourceUrl: 'https://www.tourismthailand.org/Attraction/lumpini-park',
      priceRange: '$',
      priceNote: 'From 800 THB including instruction and breakfast',
      aiScore: 84,
      uniquenessScore: 82,
      luxuryScore: 55,
      authenticityScore: 93,
      tags: 'tai chi, wellness, morning, park, local culture, peaceful',
    },
  ];

  for (const exp of bangkokExperiences) {
    // Check if slug already exists
    const existing = await db.select().from(experiences).where(eq(experiences.slug, exp.slug)).limit(1);
    if (existing.length > 0) {
      console.log(`Already exists: "${exp.title}", skipping.`);
      continue;
    }

    await db.insert(experiences).values({
      ...exp,
      aiReasoning: `Curated Bangkok experience offering exceptional quality and authenticity for discerning travelers.`,
      status: 'approved',
      isFeatured: 0,
      discoveredAt: now,
      publishedAt: now,
      updatedAt: now,
    }).run();
    console.log(`Added: "${exp.title}" (score: ${exp.aiScore})`);
  }

  // ============================================================
  // Final summary
  // ============================================================
  console.log('\n=== Summary ===');
  const totalApproved = await db.select().from(experiences).where(eq(experiences.status, 'approved'));
  const totalWorkshops = await db.select().from(experiences).where(eq(experiences.category, 'workshops'));
  console.log(`Total approved experiences: ${totalApproved.length}`);
  console.log(`Total workshops: ${totalWorkshops.length}`);
  console.log('Done! No existing experiences were removed.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
