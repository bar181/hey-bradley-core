# P102 / Agent A3 — CF#9–12 Closure Report

**Owner:** A3 (small low-risk fixes track)
**Sibling agents:** A1 (Welcome.tsx), A2 (Onboarding.tsx + Agentics.tsx live-wire), B1, B2 (docs/launch)
**Wave 2 closers:** A4 + B3
**Date:** 2026-05-03
**Branch:** claude/verify-flywheel-init-qlIBr

## Carry-forwards closed

### CF#11 — Status palette tokens (CLOSED)

ADR-117 D4 literal-hex stopgap removed. Two new mode-independent tokens added
to `:root` block in `src/index.css`:

- `src/index.css:46-48` — `--hb-status-sealed: #22c55e` and
  `--hb-status-deferred: #f59e0b` declared with the comment block tying the
  decision back to ADR-117 D4 + CF#11.
- `src/components/planning/ProcessMapSVG.tsx:60-71` — `statusStyle()` `sealed`
  and `deferred` arms now reference `var(--hb-status-sealed)` and
  `var(--hb-status-deferred)` instead of literal `#22c55e` / `#f59e0b`.

LOC delta: +5 in `src/index.css`, +0 net in `ProcessMapSVG.tsx` (line-replace).
Backward-compatibility: token values match the prior literal hex byte-for-byte
so all rendered output is pixel-identical. The P91.3 token-count assertion
(`≥2 var(--hb-*)` refs in `ProcessMapSVG.tsx`) now passes with even more
margin (was 6 var refs — now 10).

### CF#12 — Log enum housekeeping (CLOSED — Option A: docs)

Per the brief's KISS recommendation, took the comment-only path. Added an
`INTENT_FUTURE` block to `src/contexts/persistence/migrations/005-comprehensive-logs.sql`
naming each of the 5 declared-but-unwired enum values
(`multi_page_scope`, `error_event`, `todo_execution`, `decomp_split`,
`export_emit`) with the rationale (schema stability across enum-extension
waves; SQLite cannot `DROP CONSTRAINT`; writer-wiring is additive and does
not require a migration bump).

- `src/contexts/persistence/migrations/005-comprehensive-logs.sql:30-39` —
  10-line comment block prior to the `Schema-only here` marker.

LOC delta: +10 (SQL comment lines only — no schema or code change).

## Carry-forwards deferred

### CF#9 — SVG legends/labels (DEFERRED → P103+)

Rationale: Implementing a status-pill legend strip on both `ProcessMapSVG.tsx`
and `DomainModelSVG.tsx` adds ~20 LOC each (40 LOC) plus per-status localized
labels and viewBox-height adjustment to avoid clipping. With CF#11 + CF#12
already at +15 LOC, taking CF#9 would push the source delta to ≥55 LOC and
require a viewBox change that risks the pixel-snapshot pattern downstream
(P91 + P93 specs). Kept additive-token surface only this sprint.

### CF#10 — `useChatPipeline` hook extraction (DEFERRED → post-launch)

Rationale: `chatPipeline.ts` is at 738/750 LOC. Hook extraction is a real
refactor crossing 70+ LOC and touching the highest-traffic emit surface in
the codebase. Per the brief's LOW KISS-fit rating, deferred. Suggested target
phase: post-RC refactor sprint or P103 if owner re-prioritizes.

## LOC budget

| Surface | LOC delta |
|---|---|
| `src/index.css` (CF#11 tokens) | +5 |
| `src/components/planning/ProcessMapSVG.tsx` (CF#11 consume) | 0 net (line-replace) |
| `src/contexts/persistence/migrations/005-comprehensive-logs.sql` (CF#12) | +10 |
| **Total source delta** | **+15 LOC** |
| **Cap** | ≤80 LOC |
| **Margin** | 65 LOC under cap |

## Hard-rule compliance

- No new dependencies added (verified — touched only `.css`, `.tsx`, `.sql`).
- No animation libs touched.
- No A1/A2/B1/B2/A4/B3 owned files touched
  (Welcome.tsx / Onboarding.tsx / Agentics.tsx / ADRs / tests / plans / CLAUDE.md
  / docs/launch/ all unmodified).
- Token additions are additive-only; existing palette unchanged.
- TypeScript-strict: changes are pure JSX text + CSS + SQL comments — no type
  surface touched.
- Backward-compat: existing tests stay GREEN (token values byte-identical to
  prior literals; SQL comment additions are inert).
