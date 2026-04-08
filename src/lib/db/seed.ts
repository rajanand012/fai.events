import { db } from './index';
import { categories, provinces } from './schema';

const CATEGORIES_DATA = [
  {
    name: 'Wellness & Spa',
    slug: 'wellness-spa',
    description: 'Luxury spas, healing retreats, and holistic wellness',
    iconName: 'spa',
    displayOrder: 1,
  },
  {
    name: 'Fine Dining',
    slug: 'fine-dining',
    description: 'Exceptional restaurants, private chefs, and culinary experiences',
    iconName: 'utensils',
    displayOrder: 2,
  },
  {
    name: 'Adventure & Outdoors',
    slug: 'adventure-outdoors',
    description: 'Thrilling activities, extreme sports, and outdoor expeditions',
    iconName: 'mountain',
    displayOrder: 3,
  },
  {
    name: 'Cultural Heritage',
    slug: 'cultural-heritage',
    description: 'Temples, traditions, ceremonies, and immersive cultural encounters',
    iconName: 'landmark',
    displayOrder: 4,
  },
  {
    name: 'Island & Beach',
    slug: 'island-beach',
    description: 'Private islands, secluded beaches, and coastal escapes',
    iconName: 'palmtree',
    displayOrder: 5,
  },
  {
    name: 'Nightlife & Entertainment',
    slug: 'nightlife-entertainment',
    description: 'Exclusive clubs, shows, rooftop bars, and evening experiences',
    iconName: 'moon',
    displayOrder: 6,
  },
  {
    name: 'Eco & Nature',
    slug: 'eco-nature',
    description: 'Wildlife encounters, national parks, and sustainable tourism',
    iconName: 'leaf',
    displayOrder: 7,
  },
  {
    name: 'Luxury Stays',
    slug: 'luxury-stays',
    description: 'Boutique hotels, private villas, and extraordinary accommodations',
    iconName: 'building',
    displayOrder: 8,
  },
  {
    name: 'Romantic Escapes',
    slug: 'romantic-escapes',
    description: 'Couples retreats, sunset cruises, and intimate experiences',
    iconName: 'heart',
    displayOrder: 9,
  },
  {
    name: 'Hidden Gems',
    slug: 'hidden-gems',
    description: 'Off-the-beaten-path discoveries and local secrets',
    iconName: 'gem',
    displayOrder: 10,
  },
];

const PROVINCES_DATA = [
  { name: 'Bangkok', region: 'Central', slug: 'bangkok' },
  { name: 'Chiang Mai', region: 'North', slug: 'chiang-mai' },
  { name: 'Chiang Rai', region: 'North', slug: 'chiang-rai' },
  { name: 'Phuket', region: 'South', slug: 'phuket' },
  { name: 'Krabi', region: 'South', slug: 'krabi' },
  { name: 'Koh Samui / Surat Thani', region: 'South', slug: 'koh-samui-surat-thani' },
  { name: 'Pattaya / Chonburi', region: 'East', slug: 'pattaya-chonburi' },
  { name: 'Hua Hin / Prachuap Khiri Khan', region: 'West', slug: 'hua-hin-prachuap-khiri-khan' },
  { name: 'Kanchanaburi', region: 'West', slug: 'kanchanaburi' },
  { name: 'Ayutthaya', region: 'Central', slug: 'ayutthaya' },
  { name: 'Sukhothai', region: 'North', slug: 'sukhothai' },
  { name: 'Pai / Mae Hong Son', region: 'North', slug: 'pai-mae-hong-son' },
  { name: 'Khao Lak / Phang Nga', region: 'South', slug: 'khao-lak-phang-nga' },
  { name: 'Koh Chang / Trat', region: 'East', slug: 'koh-chang-trat' },
  { name: 'Koh Phangan / Surat Thani', region: 'South', slug: 'koh-phangan-surat-thani' },
  { name: 'Koh Lipe / Satun', region: 'South', slug: 'koh-lipe-satun' },
  { name: 'Lopburi', region: 'Central', slug: 'lopburi' },
  { name: 'Nakhon Ratchasima / Korat', region: 'Northeast', slug: 'nakhon-ratchasima-korat' },
  { name: 'Udon Thani', region: 'Northeast', slug: 'udon-thani' },
  { name: 'Rayong', region: 'East', slug: 'rayong' },
];

export async function seedDatabase(): Promise<void> {
  console.log('Seeding categories...');
  for (const category of CATEGORIES_DATA) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }

  console.log('Seeding provinces...');
  for (const province of PROVINCES_DATA) {
    await db.insert(provinces).values(province).onConflictDoNothing();
  }

  console.log('Seed complete.');
}
