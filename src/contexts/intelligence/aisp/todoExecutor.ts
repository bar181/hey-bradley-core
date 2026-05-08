/**
 * todoExecutor.ts — P74 / OC-DECOMP / A2
 *
 * Authority: ADR-099 (DECOMP_ATOM — Decomposition Atom; A3 owns the ADR text).
 *
 * Orchestrates a `DecompAtomResult` (output of `decompose()` from A1's
 * `decompAtom.ts`) through the existing template matcher → applier loop,
 * one todo at a time. Emits a structured per-todo trace so the
 * ConversationLogTab + AISPSurface can render exactly what happened for
 * each clause of a multi-clause user utterance ("make it brighter and add
 * pricing" → 2 todos → 2 traces → 2 patch sets composed in order).
 *
 * Pure function; no side effects. Returns the patches; the chatPipeline
 * consumer is responsible for applying them via configStore (A3 wires it).
 *
 * Strict scope (per A2 hard rules):
 *  - NO new dependencies
 *  - NO touching files outside todoExecutor.ts
 *  - TypeScript-strict; no `any`
 *  - ≤ 200 LOC total
 */

import type { Todo, DecompAtomResult } from '@/contexts/intelligence/aisp/decompAtom'
import type { MasterConfig } from '@/lib/schemas'
import type { JSONPatch } from '@/lib/schemas/patches'
import {
  matchTemplates,
  TEMPLATE_CONFIDENCE_THRESHOLD,
} from '@/contexts/intelligence/templates/templateMatcher'
import { applyTemplateMatch } from '@/contexts/intelligence/templates/templateApplier'

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

/** Per-todo execution trace for ConversationLogTab + AISPSurface. */
export interface TodoTrace {
  /** The source todo from DECOMP_ATOM. */
  todo: Todo
  /** The matcher's result for this todo's `details` query. */
  match: ReturnType<typeof matchTemplates>
  /** Patches emitted (empty if matcher confidence < threshold or unknown verb/target). */
  patches: readonly JSONPatch[]
  /**
   * Status:
   *  - `applied`  — matcher confidence ≥ threshold; patches were generated
   *  - `deferred` — matcher confidence < threshold; alternatives surfaced
   *  - `skipped`  — verb or target unrecognized AND confidence < 0.5
   */
  status: 'applied' | 'deferred' | 'skipped'
  /** Human-readable summary (≤80 chars) for log/UX display. */
  summary: string
}

/** Aggregate execution result returned by `executeTodos()`. */
export interface TodoExecutionResult {
  /** Pass-through of the upstream DECOMP_ATOM result. */
  decomp: DecompAtomResult
  /** One trace per todo, in todo order. */
  traces: readonly TodoTrace[]
  /** Concatenated patches across all `applied` todos, in order. */
  allPatches: readonly JSONPatch[]
  /** Count of todos by status. */
  counts: { applied: number; deferred: number; skipped: number }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

const SKIP_CONFIDENCE_FLOOR = 0.5
const SUMMARY_MAX = 80

/** Trim a summary string to the ≤80-char display contract. */
function clampSummary(s: string): string {
  if (s.length <= SUMMARY_MAX) return s
  return `${s.slice(0, SUMMARY_MAX - 1)}…`
}

/**
 * Decide whether this todo should be skipped outright (verb/target unknown
 * AND not enough signal in `details` to justify a fallback match attempt).
 *
 * The matcher is still called when the floor is met (≥ 0.5) so we can
 * surface alternatives even when the parser couldn't classify verb/target.
 */
function shouldSkip(todo: Todo, matchConfidence: number): boolean {
  const verbUnknown = todo.verb === 'unknown'
  const targetUnknown = todo.target === 'unknown'
  if (!verbUnknown && !targetUnknown) return false
  return matchConfidence < SKIP_CONFIDENCE_FLOOR
}

/** Build the human-readable summary for a trace row. */
function summarize(
  todo: Todo,
  status: TodoTrace['status'],
  match: ReturnType<typeof matchTemplates>,
): string {
  const tag = `${todo.verb}/${todo.target}`
  switch (status) {
    case 'applied':
      return clampSummary(
        `applied: ${tag} → ${match.rationale}`,
      )
    case 'deferred':
      return clampSummary(
        `deferred: low-confidence; surfaces alternatives (${match.confidence.toFixed(2)})`,
      )
    case 'skipped':
      return clampSummary(`skipped: unrecognized verb/target (${tag})`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// executeTodos — public entry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute a DECOMP_ATOM result by routing each todo through the
 * template matcher → applier loop. Composes patches in todo order.
 *
 * NOTE: this does NOT mutate `config` or apply patches — it returns
 * the patches; the chatPipeline consumer applies them via configStore.
 *
 * Empty `decomp.todos` → returns an empty result with zero counts.
 *
 * @param decomp Output of `decompose(...)` from A1's decompAtom.ts
 * @param config Active MasterConfig (drives section-index resolution in applier)
 */
export function executeTodos(
  decomp: DecompAtomResult,
  config: MasterConfig,
): TodoExecutionResult {
  const traces: TodoTrace[] = []
  const allPatches: JSONPatch[] = []
  let appliedCount = 0
  let deferredCount = 0
  let skippedCount = 0

  for (const todo of decomp.todos) {
    const match = matchTemplates(todo.details, config)

    let status: TodoTrace['status']
    let patches: readonly JSONPatch[]

    if (shouldSkip(todo, match.confidence)) {
      status = 'skipped'
      patches = []
      skippedCount += 1
    } else if (match.confidence >= TEMPLATE_CONFIDENCE_THRESHOLD) {
      const generated = applyTemplateMatch(match, config)
      status = 'applied'
      patches = generated
      allPatches.push(...generated)
      appliedCount += 1
    } else {
      status = 'deferred'
      patches = []
      deferredCount += 1
    }

    traces.push({
      todo,
      match,
      patches,
      status,
      summary: summarize(todo, status, match),
    })
  }

  return {
    decomp,
    traces,
    allPatches,
    counts: {
      applied: appliedCount,
      deferred: deferredCount,
      skipped: skippedCount,
    },
  }
}
