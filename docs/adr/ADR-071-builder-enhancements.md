# ADR-071: Builder Enhancements — Quick-add Picker + Areas for Improvement

**Status:** Accepted
**Date:** 2026-04-29 (P48 Sprint I P2)
**Deciders:** Bradley Ross
**Phase:** P48

## Context

Sprint H sealed at avg 89.7 (P44 88 / P45 91 / P46 90); Sprint I Wave 1 (P47,
ADR-070) shipped builder-mode UX polish — collapse/expand rows, categorized
add-section picker, right-panel ARIA + focus + Escape. P47 closed the
discoverability gap on the section list itself, but reviewer feedback flagged
two remaining ceilings: (1) new users still browse the 16-type catalog one
section at a time even after categorization, and (2) bradley replies in chat
end with the patch summary — there is no nudge toward the *next* useful action.

P48 (Sprint I Wave 2) closes both gaps with two parallel agent slots: A4 ships
a curated quick-add panel (one-click 6-section shortcut grid) inside the
SectionsSection, and A5 ships a pure-rule improvement suggester wired into the
chat pipeline. This ADR records the contract.

## Decision

### Quick-add picker (A4 — `QuickAddPicker.tsx`)

A new opt-in component mounted **inside** SectionsSection (NOT a replacement
for the existing add-section grid):

1. **Curated 6-section catalog.** The picker surfaces the 6 highest-leverage
   types (`hero`, `action`, `text`, `blog`, `pricing`, `footer`) — empirically
   the most-added-first sections across the listen-mode demo corpus. The
   remaining 10 types stay reachable via the P47 categorized picker.
2. **Three category buckets identical to P47.** *Hero & CTA* / *Content* /
   *Social Proof + Media*. Reusing P47's taxonomy keeps the mental model
   single: quick-add is a *shortcut*, not a different ontology.
3. **Pure-CSS preview hover.** No popover library — hover reveals a one-line
   preview swatch via `:hover` CSS. Click delegates to the existing
   `addSection` action on `useConfigStore` — the picker never owns state.
4. **a11y first.** `role="list"` on the grid, `role="listitem"` on each card,
   `aria-expanded` on the panel toggle, full arrow-key nav (`onKeyDown` →
   `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight`).

### Improvement suggester (A5 — `aisp/improvementSuggester.ts`)

A pure-rule heuristic surfaced under bradley replies in `ChatInput.tsx`:

1. **Pure rule table — no LLM, no Σ widening.** `suggestImprovements` is
   ≤150 LOC, walks the post-patch site config, and returns up to 3
   `ImprovementSuggestion` objects. Rule keywords include `hero`, `pricing`,
   `cta`, `footer`, `blog` — each maps to a "you might next want…" prompt.
2. **Threaded into `chatPipeline` after `appliedPatchCount > 0`.** The
   suggester sits behind a defensive `try { … } catch { /* swallow */ }` so
   any throw inside the heuristic NEVER blocks the user-visible patch reply.
3. **Result type extension.** `ChatPipelineResult` gains an
   `improvements?: ImprovementSuggestion[]` field, threaded through to
   `ChatInput.tsx` and rendered as a `💡 Next steps` block under each
   bradley reply (testid `aisp-improvement-suggestions`).
4. **Σ-restriction by construction.** Suggestions are *advisory text* — they
   do NOT produce patches and do NOT widen INTENT_ATOM (ADR-053). The user
   must restate the suggestion as a normal chat turn for it to land in the
   pipeline.

## Trade-offs

- **Rule-based vs LLM-driven suggestions.** A rule table is deterministic
  (replayable in tests), free (cost = $0), and low-latency (<1ms). The
  trade-off is variety: suggestions feel canned after 2-3 turns. Mitigated by
  a deterministic affirmation prefix ("Nice — next you might…") so the
  canned-ness reads as *encouragement*, not *limitation*.
- **Hand-curated heuristic table.** Every new section type needs a manual
  rule entry. Mitigated by gating new types through ADR-022 (Section Type
  Registry) — adding a type already requires a registry edit, so the
  suggester table sits adjacent.
- **Quick-add duplicates the categorized picker.** Two add surfaces compete
  for visual real estate. Mitigated by collapsing quick-add by default
  (aria-expanded toggle) — only power-users who reach for it pay the cost.
- **`improvements` field on `ChatPipelineResult` is optional.** Existing
  consumers ignore unknown fields, so the change is backwards-compatible —
  but we accepted optional-as-default rather than always-empty-array to keep
  serialized telemetry slim.

## Consequences

- (+) Discoverability win: the 6 most-added types are one click away.
- (+) Agentic-suggestion arc opens — the improvement suggester is the seam
  for a future LLM-backed "Areas for improvement" panel (P50+).
- (+) Zero fixture corpus changes — quick-add reuses ADR-058's Template
  Library API, suggestions add no test fixtures.
- (+) Suggestion path is fail-safe: a try/catch guarantees the suggester
  cannot regress the chat reply.
- (-) Heuristic table is hand-curated and must be reviewed at every new
  section type — small ongoing maintenance cost.
- (-) Reviewer must still sanity-check the canned-prefix tone at sprint
  close (Wave 3, P49+) — risk of suggestions reading as patronizing.

## Cross-references

- **ADR-022** — Section Type Registry (the 16-type catalog quick-add curates).
- **ADR-040** — Local SQLite Persistence (kv table; suggestions are
  ephemeral, NOT persisted — deliberate).
- **ADR-053** — INTENT_ATOM (suggestions DO NOT widen Σ — advisory text only).
- **ADR-058** — Template Library API (quick-add reuses the list/filter APIs).
- **ADR-067** — Brand Context Upload (Sprint H opener).
- **ADR-068** — Codebase Reference Ingestion (Sprint H sibling).
- **ADR-069** — Context Management (Sprint H closer; defensive-try precedent).
- **ADR-070** — Builder UX Enhancement (Sprint I Wave 1; this Wave's predecessor).

## Status as of P48 seal

- A4 `QuickAddPicker.tsx` curated 6-section panel + a11y + arrow-key nav:
  TBD (seal commit).
- A5 `aisp/improvementSuggester.ts` + `chatPipeline` defensive integration +
  `ChatInput.tsx` `💡 Next steps` block: TBD (seal commit).
- A6 ADR-071 (this file) + `tests/p48-builder-enhancements.spec.ts`: shipped.
- Cumulative regression count + persona re-score recorded at sprint close
  (Sprint I Wave 3, P49+).
