export interface DiscoverySource {
  id?: number;
  name: string;
  searchQuery: string;
  type: 'search' | 'blog' | 'directory';
  isActive: boolean;
}

export interface RawCandidate {
  url: string;
  title?: string;
  snippet?: string;
  source: string;
}

export interface ScrapedContent {
  url: string;
  title: string;
  description: string;
  bodyText: string;
  images: { src: string; alt: string }[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  links: string[];
}

export interface AiEvaluation {
  isRelevant: boolean;
  title: string;
  destination: string;
  province: string;
  category: string;
  summaryShort: string;
  summaryLong: string;
  whySpecial: string;
  priceRange: string;
  priceNote: string;
  bestTimeToVisit: string;
  duration: string;
  tags: string[];
  websiteUrl: string;
  bookingUrl: string;
  socialLink: string;
  contactLink: string;
  scores: {
    overall: number;
    uniqueness: number;
    luxury: number;
    authenticity: number;
  };
  reasoning: string;
}

export interface PipelineRunResult {
  runId: number;
  sourcesSearched: number;
  candidatesFound: number;
  evaluated: number;
  duplicatesSkipped: number;
  published: number;
  errors: string[];
  duration: number;
}
