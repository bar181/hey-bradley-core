/**
 * templateApplier.ts — P72 / OC-TI / A4
 *
 * Authority: ADR-098 (Template Intelligence Architecture)
 *
 * Converts a `TemplateMatch` envelope (matcher output) into a list of
 * RFC-6902 JSON patches against the active MasterConfig. Three layers:
 *
 *   - Theme    → /theme/colors/* + /theme/typography/* + /theme/radius +
 *                /theme/shadow/style (per ADR-098 §"Output format")
 *   - Section  → per-section overrides only — NEVER full /sections array
 *                replacement (that's the SELECTION_ATOM starter-pack flow,
 *                deliberately out of scope for OC-TI per A4 hard rules)
 *   - Content  → an `add` patch to /_pendingContentStyle (transient hint
 *                consumed downstream by CONTENT_ATOM / contentGenerator)
 *
 * Strict scope (per A4 hard rules):
 *  - NO new dependencies
 *  - TypeScript-strict; no `any`
 *  - ≤ 250 LOC total
 */

import type { TemplateMatch } from './templateMatcher'
import type { MasterConfig, SectionType } from '@/lib/schemas'
import type { JSONPatch } from '@/lib/schemas/patches'
import type { SectionOverride } from './sectionLibrary'

// ─────────────────────────────────────────────────────────────────────────────
// Theme layer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Emit theme-token patches. Paths align with ADR-098 §"Output format" and the
 * STATIC_ALLOWED_PATHS allow-list in src/lib/schemas/patchPaths.ts (theme
 * narrowed-schema half). `shadowStyle` is emitted under `/theme/shadow/style`
 * per the ADR; consumer-side rendering may ignore unknown keys safely.
 */
function applyThemeLayer(match: TemplateMatch): JSONPatch[] {
  if (!match.theme) return []
  const t = match.theme.theme
  return [
    { op: 'replace', path: '/theme/colors/primary', value: t.primaryColor },
    { op: 'replace', path: '/theme/colors/secondary', value: t.secondaryColor },
    { op: 'replace', path: '/theme/colors/background', value: t.backgroundColor },
    { op: 'replace', path: '/theme/typography/fontHeading', value: t.fontHeading },
    { op: 'replace', path: '/theme/typography/fontBody', value: t.fontBody },
    { op: 'replace', path: '/theme/radius', value: t.borderRadius },
    { op: 'replace', path: '/theme/shadow/style', value: t.shadowStyle },
  ]
}

// ─────────────────────────────────────────────────────────────────────────────
// Section layer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a SectionOverride field onto the patch path it affects on a section.
 *
 * - `variant`        → /sections/{idx}/variant
 * - `layout`         → /sections/{idx}/layout/variant (existing schema slot;
 *                      see src/lib/schemas/layout.ts)
 * - `headlineWeight` → /sections/{idx}/style/headlineWeight (style.* is open
 *                      via z.record on style additions; consumers may ignore
 *                      unknown keys)
 * - `imageWeight`    → /sections/{idx}/style/imageWeight (same as above)
 *
 * Unknown override keys yield no patch (defensive — keeps the applier
 * robust against future SectionOverride extensions).
 */
function patchesForOverride(idx: number, override: SectionOverride): JSONPatch[] {
  const patches: JSONPatch[] = []
  const base = `/sections/${idx}`
  if (override.variant !== undefined) {
    patches.push({ op: 'replace', path: `${base}/variant`, value: override.variant })
  }
  if (override.layout !== undefined) {
    patches.push({
      op: 'replace',
      path: `${base}/layout/variant`,
      value: override.layout,
    })
  }
  if (override.headlineWeight !== undefined) {
    patches.push({
      op: 'replace',
      path: `${base}/style/headlineWeight`,
      value: override.headlineWeight,
    })
  }
  if (override.imageWeight !== undefined) {
    patches.push({
      op: 'replace',
      path: `${base}/style/imageWeight`,
      value: override.imageWeight,
    })
  }
  return patches
}

/**
 * Emit per-section override patches. We deliberately do NOT replace the
 * /sections array wholesale — that's destructive and belongs to the
 * SELECTION_ATOM starter-pack flow (library.ts / registry.ts / router.ts),
 * which OC-TI explicitly leaves alone.
 *
 * For each (sectionType → overrides) pair:
 *   - find the FIRST section in config matching that type (by `.type`)
 *   - emit patches for that section's index
 *   - skip silently if no matching section exists in the active config
 */
function applySectionLayer(match: TemplateMatch, config: MasterConfig): JSONPatch[] {
  if (!match.sectionArrangement) return []
  const overrides = match.sectionArrangement.sectionOverrides
  if (!overrides) return []

  const patches: JSONPatch[] = []
  const sections = config.sections

  for (const [type, override] of Object.entries(overrides) as Array<
    [SectionType, SectionOverride | undefined]
  >) {
    if (!override) continue
    const idx = sections.findIndex((s) => s.type === type)
    if (idx === -1) continue // no matching section — skip per spec
    patches.push(...patchesForOverride(idx, override))
  }

  return patches
}

// ─────────────────────────────────────────────────────────────────────────────
// Content layer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Emit a transient hint patch under /_pendingContentStyle. CONTENT_ATOM /
 * contentGenerator consumers downstream pick this up to drive copy regen.
 * `add` op is correct here — the field is not part of the validated
 * MasterConfig schema and is created on first write. Consumers MUST clear
 * the field after consuming it (out of scope for A4 — see ADR-098 §"Out of
 * scope" + ADR-060 CONTENT_ATOM).
 */
function applyContentLayer(match: TemplateMatch): JSONPatch[] {
  if (!match.contentStyle) return []
  const c = match.contentStyle.contentTemplate
  return [
    {
      op: 'add',
      path: '/_pendingContentStyle',
      value: {
        tone: c.tone,
        sentenceLength: c.sentenceLength,
        emojiUsage: c.emojiUsage,
        headlineStyle: c.headlineStyle,
        copyDensity: c.copyDensity,
        pattern: c.pattern,
      },
    },
  ]
}

// ─────────────────────────────────────────────────────────────────────────────
// Public entry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a `TemplateMatch` into the JSON patch list that applies it to
 * `config`. Layers are independent — empty layers contribute zero patches.
 *
 * Result is suitable for `useConfigStore.getState().applyPatches(...)`.
 *
 * @param match  TemplateMatch envelope from `matchTemplates()`
 * @param config Active MasterConfig (drives section-index resolution)
 */
export function applyTemplateMatch(
  match: TemplateMatch,
  config: MasterConfig,
): JSONPatch[] {
  return [
    ...applyThemeLayer(match),
    ...applySectionLayer(match, config),
    ...applyContentLayer(match),
  ]
}
