/**
 * P74 / Track B / A4 — Highlight extractor.
 *
 * For chat + listen surfaces: condense bradley replies (and optionally
 * user inputs) to a 5-25 word highlight. Full text remains in the
 * ConversationLogTab (A5's surface).
 *
 * Strategy:
 * 1. Trim + collapse whitespace.
 * 2. If text shorter than minWords, return as-is (don't pad).
 * 3. If text already ≤ maxWords, return as-is.
 * 4. Try to truncate at sentence boundary (`. ` / `! ` / `? `) within
 *    [minWords..maxWords] window. Prefer the LATEST boundary in window.
 * 5. If no sentence boundary in window, truncate at maxWords + add "…".
 *
 * Pure function. No deps. TypeScript-strict.
 */

export interface HighlightOptions {
  minWords?: number
  maxWords?: number
}

/** Word-count helper. Strips, collapses whitespace, splits on \s+. */
export function countWords(text: string): number {
  const t = text.trim()
  if (!t) return 0
  return t.split(/\s+/).length
}

export function extractHighlight(
  text: string,
  opts: HighlightOptions = {},
): string {
  const minWords = opts.minWords ?? 5
  const maxWords = opts.maxWords ?? 25

  const cleaned = text.trim().replace(/\s+/g, ' ')
  if (!cleaned) return cleaned

  const words = cleaned.split(' ')
  const count = words.length

  // Under min — return as-is, don't pad.
  if (count < minWords) return cleaned
  // Within window — return as-is.
  if (count <= maxWords) return cleaned

  // Search for the LATEST sentence-boundary terminator within the
  // [minWords..maxWords] window of the windowed slice.
  const windowed = words.slice(0, maxWords).join(' ')
  const terminators = ['. ', '! ', '? ']
  let bestCut = -1
  for (const term of terminators) {
    // search across the windowed slice for the LAST terminator occurrence
    let idx = windowed.lastIndexOf(term)
    if (idx > 0) {
      // ensure the cut point lies on/after minWords boundary
      const prefixWords = windowed.slice(0, idx + 1).trim().split(/\s+/).length
      if (prefixWords >= minWords && idx + 1 > bestCut) {
        bestCut = idx + 1
      }
    }
  }
  // Also check trailing terminator without space (end-of-string case in window)
  if (bestCut === -1) {
    for (const ch of ['.', '!', '?']) {
      const idx = windowed.lastIndexOf(ch)
      if (idx > 0) {
        const prefixWords = windowed.slice(0, idx + 1).trim().split(/\s+/).length
        if (prefixWords >= minWords && idx + 1 > bestCut) {
          bestCut = idx + 1
        }
      }
    }
  }

  if (bestCut > 0) return windowed.slice(0, bestCut).trim()
  // No usable boundary — hard truncate + ellipsis.
  return words.slice(0, maxWords).join(' ') + '…'
}
