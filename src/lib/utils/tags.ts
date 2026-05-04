/**
 * Parse a tags field that may be stored as either:
 *   - a JSON array string  -> '["luxury","wellness","spa"]'
 *   - a comma-separated string -> 'luxury, wellness, spa'
 *   - null / empty -> []
 *
 * Returns a clean array of trimmed, non-empty tag strings.
 */
export function parseTags(value: string | null | undefined): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];

  // JSON-array form
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((t) => (typeof t === 'string' ? t.trim() : ''))
          .filter((t) => t.length > 0);
      }
    } catch {
      // fall through to CSV split
    }
  }

  // CSV form
  return trimmed
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
