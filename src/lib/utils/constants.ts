export const BRAND_COLORS = {
  yellow: '#f3af00',
  blue: '#207796',
  lightBlue: '#dff3fa',
  charcoal: '#201600',
  white: '#ffffff',
} as const;

export const SITE_NAME = 'fai.events';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://fai.events';

export const SITE_DESCRIPTION =
  'AI-curated once-in-a-lifetime experiences across Thailand';

export const AUTO_PUBLISH_THRESHOLD = 85;

export const PENDING_THRESHOLD = 70;

export const CATEGORIES = [
  { name: 'Wellness & Spa', slug: 'wellness-spa', icon: 'spa' },
  { name: 'Fine Dining', slug: 'fine-dining', icon: 'utensils' },
  { name: 'Adventure & Outdoors', slug: 'adventure-outdoors', icon: 'mountain' },
  { name: 'Cultural Heritage', slug: 'cultural-heritage', icon: 'landmark' },
  { name: 'Island & Beach', slug: 'island-beach', icon: 'palmtree' },
  { name: 'Nightlife & Entertainment', slug: 'nightlife-entertainment', icon: 'moon' },
  { name: 'Eco & Nature', slug: 'eco-nature', icon: 'leaf' },
  { name: 'Luxury Stays', slug: 'luxury-stays', icon: 'building' },
  { name: 'Romantic Escapes', slug: 'romantic-escapes', icon: 'heart' },
  { name: 'Hidden Gems', slug: 'hidden-gems', icon: 'gem' },
] as const;

export const PROVINCES = [
  { name: 'Bangkok', slug: 'bangkok', region: 'Central' },
  { name: 'Chiang Mai', slug: 'chiang-mai', region: 'North' },
  { name: 'Chiang Rai', slug: 'chiang-rai', region: 'North' },
  { name: 'Phuket', slug: 'phuket', region: 'South' },
  { name: 'Krabi', slug: 'krabi', region: 'South' },
  { name: 'Koh Samui / Surat Thani', slug: 'koh-samui-surat-thani', region: 'South' },
  { name: 'Pattaya / Chonburi', slug: 'pattaya-chonburi', region: 'East' },
  { name: 'Hua Hin / Prachuap Khiri Khan', slug: 'hua-hin-prachuap-khiri-khan', region: 'West' },
  { name: 'Kanchanaburi', slug: 'kanchanaburi', region: 'West' },
  { name: 'Ayutthaya', slug: 'ayutthaya', region: 'Central' },
  { name: 'Sukhothai', slug: 'sukhothai', region: 'North' },
  { name: 'Pai / Mae Hong Son', slug: 'pai-mae-hong-son', region: 'North' },
  { name: 'Khao Lak / Phang Nga', slug: 'khao-lak-phang-nga', region: 'South' },
  { name: 'Koh Chang / Trat', slug: 'koh-chang-trat', region: 'East' },
  { name: 'Koh Phangan / Surat Thani', slug: 'koh-phangan-surat-thani', region: 'South' },
  { name: 'Koh Lipe / Satun', slug: 'koh-lipe-satun', region: 'South' },
  { name: 'Lopburi', slug: 'lopburi', region: 'Central' },
  { name: 'Nakhon Ratchasima / Korat', slug: 'nakhon-ratchasima-korat', region: 'Northeast' },
  { name: 'Udon Thani', slug: 'udon-thani', region: 'Northeast' },
  { name: 'Rayong', slug: 'rayong', region: 'East' },
] as const;

export const DESTINATIONS = [
  'Bangkok',
  'Phuket',
  'Chiang Mai',
  'Koh Samui',
  'Krabi',
  'Pattaya',
  'Hua Hin',
  'Chiang Rai',
  'Kanchanaburi',
  'Khao Lak',
  'Koh Phangan',
  'Koh Chang',
  'Pai',
  'Ayutthaya',
  'Koh Lipe',
] as const;
