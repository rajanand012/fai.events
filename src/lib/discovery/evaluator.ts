import { getAnthropicClient } from '../ai/client';
import type { ScrapedContent, AiEvaluation } from './types';

const EVALUATION_TOOL = {
  name: 'evaluate_experience' as const,
  description:
    'Evaluate a Thailand experience for inclusion on fai.events. ' +
    'Provide a structured assessment of quality, relevance, and appeal.',
  input_schema: {
    type: 'object' as const,
    required: [
      'isRelevant',
      'title',
      'destination',
      'province',
      'category',
      'summaryShort',
      'summaryLong',
      'whySpecial',
      'priceRange',
      'priceNote',
      'bestTimeToVisit',
      'duration',
      'tags',
      'websiteUrl',
      'bookingUrl',
      'socialLink',
      'contactLink',
      'scores',
      'reasoning',
    ],
    properties: {
      isRelevant: {
        type: 'boolean' as const,
        description:
          'Whether this content describes a genuine, premium Thailand experience worthy of featuring.',
      },
      title: {
        type: 'string' as const,
        description: 'A compelling, concise title for the experience (max 80 chars).',
      },
      destination: {
        type: 'string' as const,
        description:
          'The primary destination or city name (e.g. Bangkok, Phuket, Chiang Mai).',
      },
      province: {
        type: 'string' as const,
        description:
          'The Thai province where this experience takes place (e.g. Bangkok, Phuket, Chiang Mai, Surat Thani).',
      },
      category: {
        type: 'string' as const,
        description:
          'Category: one of "fine-dining", "wellness", "adventure", "cultural", "island", "luxury-stay", "nature", "nightlife", "shopping", "culinary", "spiritual", "water-sports".',
      },
      summaryShort: {
        type: 'string' as const,
        description: 'A one-sentence summary (max 160 chars) for card previews.',
      },
      summaryLong: {
        type: 'string' as const,
        description:
          'A detailed 2-3 paragraph description highlighting what makes this experience special.',
      },
      whySpecial: {
        type: 'string' as const,
        description:
          'One paragraph explaining what sets this apart from similar experiences.',
      },
      priceRange: {
        type: 'string' as const,
        description:
          'Price indicator: one of "$", "$$", "$$$", "$$$$", or "By request".',
      },
      priceNote: {
        type: 'string' as const,
        description:
          'Brief note on pricing (e.g. "From 5,000 THB per person" or "Varies by season").',
      },
      bestTimeToVisit: {
        type: 'string' as const,
        description:
          'When to visit for the best experience (e.g. "November to February" or "Year-round").',
      },
      duration: {
        type: 'string' as const,
        description:
          'Typical duration of the experience (e.g. "2-3 hours", "Full day", "3 nights").',
      },
      tags: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description:
          'Relevant tags for filtering (e.g. ["luxury", "beachfront", "romantic", "family-friendly"]).',
      },
      websiteUrl: {
        type: 'string' as const,
        description: 'Official website URL of the venue, tour operator, or experience provider. Must be a real, working website where users can learn more. Never use Wikipedia or generic info pages.',
      },
      bookingUrl: {
        type: 'string' as const,
        description: 'Direct booking or ticket purchase URL where users can actually book this experience. Look for links to the official booking page, or booking platforms like Viator, GetYourGuide, Klook, or the venue\'s own reservation page. This is required for publishing.',
      },
      socialLink: {
        type: 'string' as const,
        description:
          'Social media profile URL (Instagram, Facebook, etc.) if found, or empty string.',
      },
      contactLink: {
        type: 'string' as const,
        description: 'Contact or booking URL if found, or empty string.',
      },
      scores: {
        type: 'object' as const,
        required: ['overall', 'uniqueness', 'luxury', 'authenticity'],
        properties: {
          overall: {
            type: 'number' as const,
            description:
              'Overall score 0-100. 90+ truly exceptional, 80-89 excellent, 70-79 very good, below 70 not suitable.',
          },
          uniqueness: {
            type: 'number' as const,
            description: 'How unique and rare is this experience (0-100).',
          },
          luxury: {
            type: 'number' as const,
            description: 'Level of luxury and premium quality (0-100).',
          },
          authenticity: {
            type: 'number' as const,
            description:
              'How authentic and culturally genuine the experience is (0-100).',
          },
        },
      },
      reasoning: {
        type: 'string' as const,
        description:
          'Brief explanation of the scoring and relevance decision.',
      },
    },
  },
};

const SYSTEM_PROMPT = `You are an expert Thailand travel curator for fai.events, a premium platform showcasing once-in-a-lifetime experiences. Evaluate the following web page content and determine if it describes a genuine, premium, unique experience in Thailand worthy of being featured on our platform.

Be selective: only recommend experiences that are truly extraordinary, culturally rich, luxurious, or memorably unique.

Reject generic tourist activities, low-quality content, spam, outdated listings, and ordinary chain hotel offerings.

IMPORTANT: Every experience MUST have a real bookingUrl where users can actually book, reserve, or purchase tickets. Look for booking links in the page content, or identify the official booking page for the venue/operator. If the page is from a booking platform (Viator, GetYourGuide, Klook, etc.), use that URL as the bookingUrl. If no bookable link can be found, lower the overall score below 70.

Score rigorously:
- 90+ for truly exceptional experiences
- 80-89 for excellent experiences
- 70-79 for very good experiences
- Below 70 means not suitable for the platform

If the content is not about a Thailand experience, is spam, or is too generic, set isRelevant to false and give low scores.`;

/**
 * Evaluate scraped web content using Claude to determine if it describes
 * a premium Thailand experience worth featuring on fai.events.
 *
 * Uses tool_use for structured output extraction.
 * Returns null on any error.
 */
export async function evaluateExperience(
  content: ScrapedContent
): Promise<AiEvaluation | null> {
  try {
    const userMessage = [
      `URL: ${content.url}`,
      `Title: ${content.title}`,
      `Description: ${content.description}`,
      '',
      'Page content:',
      content.bodyText,
    ].join('\n');

    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [EVALUATION_TOOL],
      tool_choice: { type: 'tool', name: 'evaluate_experience' },
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract the tool use block from the response
    const toolUseBlock = response.content.find(
      (block) => block.type === 'tool_use'
    );

    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      console.error('[evaluator] No tool_use block in response');
      return null;
    }

    const evaluation = toolUseBlock.input as AiEvaluation;
    return evaluation;
  } catch (error) {
    console.error('[evaluator] Evaluation error:', error);
    return null;
  }
}
