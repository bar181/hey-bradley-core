/**
 * P24 Sprint B Phase 2 — Section Targeting via /<type>-<index> keyword scoping.
 *
 * Parses user input for `/hero-1`, `/blog-2`, `/footer` style tokens.
 * Examples:
 *   "change /hero-1 to 'Welcome'" → { type: 'hero', index: 0, cleanText: "change to 'Welcome'" }
 *   "hide /footer"                 → { type: 'footer', index: null, cleanText: "hide" }
 *   "make it brighter"             → null (no scope token)
 *
 * - Index in scope token is 1-based (user-facing); resolved to 0-based array index
 * - When index is omitted (`/footer`), scope.index is null → use first-by-type
 * - When ambiguous (multiple scope tokens), uses FIRST match; remainder kept in cleanText
 *
 * ADR-051 (Section Targeting Syntax).
 */

export interface SectionScope {
  /** Lowercase section type (e.g. 'hero', 'blog', 'footer'). */
  type: string
  /** 0-based array index, or null when user omitted the index suffix. */
  index: number | null
}

export interface ScopedInput {
  scope: SectionScope | null
  /** Original text minus the scope token (with surrounding whitespace collapsed). */
  cleanText: string
}

const SCOPE_TOKEN_RE = /\/([a-z][a-z-]*?)(?:-(\d+))?\b/i

/**
 * Extract first `/type-N` token from text. Returns scope (1-based index → 0-based)
 * + cleaned text. Returns `null` scope when no token found.
 */
export function parseSectionScope(text: string): ScopedInput {
  const m = SCOPE_TOKEN_RE.exec(text)
  if (!m) return { scope: null, cleanText: text }
  const type = m[1].toLowerCase()
  const indexRaw = m[2] ? parseInt(m[2], 10) : null
  // 1-based → 0-based; clamp to non-negative
  const index = indexRaw !== null && indexRaw >= 1 ? indexRaw - 1 : null
  // strip the matched token + surrounding whitespace; collapse double spaces
  const cleanText = (text.slice(0, m.index) + text.slice(m.index + m[0].length))
    .replace(/\s{2,}/g, ' ')
    .trim()
  return { scope: { type, index }, cleanText }
}

/**
 * Resolve a scope to an absolute section array index.
 * Returns -1 if scope cannot resolve (no matching enabled section, or
 * index out of range).
 *
 * Strategy:
 *   - When scope.index is null → first ENABLED section of that type
 *   - When scope.index is set → Nth ENABLED section of that type (0-based)
 */
export function resolveScopedSectionIndex(
  config: { sections: ReadonlyArray<{ type: string; enabled?: boolean }> },
  scope: SectionScope,
): number {
  let nth = 0
  for (let i = 0; i < config.sections.length; i++) {
    const s = config.sections[i]
    if (s.type !== scope.type || s.enabled === false) continue
    if (scope.index === null || nth === scope.index) {
      return i
    }
    nth++
  }
  return -1
}
