/**
 * P79 / OC-14 — PageIterator (pure module)
 *
 * Page-aware scope resolver for the multi-page MVP wire (ADR-103).
 * Pure: no store imports, no mutation. Caller passes config + activePageId.
 *
 * Single-page mode is the synthetic fallback when `config.pages` is absent or
 * has length <= 1. JSON Patch paths target root sections (`scopeRoot === ""`).
 *
 * Multi-page mode kicks in when `config.pages.length > 1`. Patch paths are
 * scoped to `/pages/{id}` so chatPipeline ops land on the active page only.
 */

import type { MasterConfig, PageConfig } from '@/lib/schemas/masterConfig'
import type { Section } from '@/lib/schemas/section'

/** Resolved page scope for downstream pipeline + export consumers. */
export interface PageScope {
  /** The page (synthetic single-page when config.pages absent/short). */
  page: PageConfig | null
  /** Sections to operate on (active-page sections OR root sections). */
  sections: Section[]
  /** JSON Patch path prefix: "" for single-page, "/pages/{id}" for multi. */
  scopeRoot: string
}

/** Patch op shape (subset). Extra keys preserved via index signature. */
interface PatchOp {
  op: string
  path: string
  [k: string]: unknown
}

/**
 * Returns the active page scope. Falls back to a synthetic single-page scope
 * when `config.pages` is absent / has length <= 1, when `activePageId` is
 * null, or when no matching page is found.
 */
export function getActivePage(
  config: MasterConfig,
  activePageId: string | null,
): PageScope {
  const pages = config.pages
  if (pages && pages.length > 1 && activePageId !== null) {
    const match = pages.find((p) => p.id === activePageId)
    if (match) {
      return {
        page: match,
        sections: match.sections,
        scopeRoot: `/pages/${match.id}`,
      }
    }
  }
  return {
    page: null,
    sections: config.sections,
    scopeRoot: '',
  }
}

/**
 * Iterates all pages (or a single synthetic page). Used by export-all paths
 * that need to walk every page bundle in the config.
 */
export function iteratePages(config: MasterConfig): PageScope[] {
  const pages = config.pages
  if (pages && pages.length > 1) {
    return pages.map((page) => ({
      page,
      sections: page.sections,
      scopeRoot: `/pages/${page.id}`,
    }))
  }
  return [
    {
      page: null,
      sections: config.sections,
      scopeRoot: '',
    },
  ]
}

/**
 * Returns a NEW patch array with each op's `path` prefixed by `scopeRoot`.
 * When `scopeRoot === ""` returns the input array unchanged (reference-equal).
 * Does NOT mutate inputs.
 *
 * @example
 *   prefixPatchPaths([{ op: 'replace', path: '/sections/0/headline', value: 'x' }], '/pages/home')
 *   // → [{ op: 'replace', path: '/pages/home/sections/0/headline', value: 'x' }]
 */
export function prefixPatchPaths(
  patches: ReadonlyArray<PatchOp>,
  scopeRoot: string,
): Array<PatchOp> {
  if (scopeRoot === '') {
    // Reference-equal pass-through for single-page; cast preserves caller's
    // mutable view without copying.
    return patches as Array<PatchOp>
  }
  return patches.map((p) => ({ ...p, path: `${scopeRoot}${p.path}` }))
}
