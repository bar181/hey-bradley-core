/**
 * P23 Sprint B Phase 1 — Template Engine types.
 *
 * A Template is a pre-validated intent: regex matcher + envelope producer.
 * Match runs BEFORE LLM call. On match (confidence ≥ 0.8), patch envelope
 * applies directly — no LLM, no cost, no audit row in llm_calls (still
 * recorded as 'template' source in chat_messages for transparency).
 *
 * Distinct from FixtureAdapter: fixtures are a DEV-only LLM proxy (returns
 * canned envelopes via the adapter interface). Templates short-circuit the
 * LLM entirely and run as a first-class chatPipeline step.
 *
 * ADR-050 (Template-First Chat Architecture).
 */

import type { JSONPatch } from '@/lib/schemas/patches'
import type { MasterConfig } from '@/lib/schemas'

/** RFC-6902 patch op subset used by templates (add | replace | remove). */
export type JsonPatchOp = JSONPatch

export interface TemplateMatchContext {
  text: string
  match: RegExpExecArray
  config: MasterConfig
}

export interface TemplateEnvelope {
  patches: JsonPatchOp[]
  summary: string
}

export interface Template {
  /** Stable id (kebab-case); appears in audit + analytics. */
  id: string
  /** Short human-readable label for "Used template: X" UI. */
  label: string
  /** Plain-English description for help / discovery. */
  description: string
  /** Regex matcher; must yield deterministic match groups. */
  matchPattern: RegExp
  /** Confidence score for matched input. Default 1.0 (exact regex hit = high confidence). */
  confidence?: number
  /**
   * Build the patch envelope from match context. Return empty patches with
   * a friendly summary if the match cannot resolve to a real path (e.g.,
   * target section absent from active config).
   */
  envelope: (ctx: TemplateMatchContext) => TemplateEnvelope
}

export interface TemplateMatchResult {
  template: Template
  envelope: TemplateEnvelope
  confidence: number
}
