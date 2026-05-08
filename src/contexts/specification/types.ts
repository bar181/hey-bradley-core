/**
 * P106 / Agent A2 — Specification shared types (neutral location).
 *
 * Per ADR-121 D1 and ADR-122 / ADR-128 / ADR-129 / ADR-130 D1. Atom and
 * specification-emitter modules MUST NOT import from `src/components/`.
 * These types are the source of truth for the SpecWorkbench surface +
 * its downstream consumers (exportClaudeCode, kissReviewer,
 * tddScaffoldGenerator, SealPanel).
 *
 * `components/agentics/SpecWorkbench.tsx` re-exports these types so existing
 * UI consumers (Agentics, Planning, ExportClaudeCodeButton, SealPanel,
 * sample-spec-workbench) continue to import from the component path;
 * pure modules under `src/contexts/` import from here directly to maintain
 * pure-module discipline (no React imports).
 *
 * Cross-refs: ADR-121 SpecWorkbench, ADR-122 Export Claude Code,
 *             ADR-128 TDD Scaffold, ADR-129 KISS Reviewer,
 *             ADR-130 Seal Panel, ADR-134 Atom→view dependency inversion fix,
 *             ADR-138 Export Completeness (P110).
 */

import type { DDDAtomOutput } from '@/contexts/intelligence/aisp/dddAtom'
import type { ProcessAtomOutput } from '@/contexts/intelligence/aisp/processAtom'

/** Status palette shared with ProcessMapSVG; mirrors `ProcessNodeStatus`. */
export type SpecStatus = 'planned' | 'in-flight' | 'sealed' | 'deferred'

/** Single-sprint summary surfaced as a horizontally-scrollable card. */
export interface SprintSummary {
  readonly id: string
  readonly name: string
  readonly status: SpecStatus
  readonly agentCount: number
  readonly keyDeliverable: string
  readonly agentScopes?: ReadonlyArray<{
    readonly id: string
    readonly role: string
    readonly ownedFiles: ReadonlyArray<string>
  }>
  readonly dod?: ReadonlyArray<string>
  readonly aispSpec?: string
}

/** Phase-level spec card — atomic unit consumed across the workbench arc. */
export interface PhaseCard {
  readonly id: string
  readonly phase: number
  readonly name: string
  readonly status: SpecStatus
  readonly sprints: ReadonlyArray<SprintSummary>
  readonly humanSpec: {
    readonly northStar: string
    readonly sadd: string
    readonly implementationPlan: string
  }
  readonly aispSpec: string
  readonly adrRefs: ReadonlyArray<{
    readonly id: string
    readonly title: string
    readonly href?: string
  }>
  /**
   * P110 / A2 — Optional DDD_ATOM output for the phase. When present the
   * exporter emits `ddd-contexts.md` from this; when absent a placeholder
   * is emitted instead. Per ADR-138 Export Completeness Standard.
   */
  readonly dddOutput?: DDDAtomOutput
  /**
   * P110 / A2 — Optional PROCESS_ATOM output for the phase. When present
   * the exporter enriches `implementation-plan.md` with phase/sprint/wave/
   * agent prose; when absent the existing `humanSpec.implementationPlan`
   * text alone is rendered. Per ADR-138 Export Completeness Standard.
   */
  readonly processOutput?: ProcessAtomOutput
}
