import Anthropic from '@anthropic-ai/sdk';

declare global {
  // eslint-disable-next-line no-var
  var _anthropicClient: Anthropic | undefined;
}

export function getAnthropicClient(): Anthropic {
  if (process.env.NODE_ENV === 'production') {
    if (!globalThis._anthropicClient) {
      globalThis._anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || '',
      });
    }
    return globalThis._anthropicClient;
  }

  if (!globalThis._anthropicClient) {
    globalThis._anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }
  return globalThis._anthropicClient;
}
