# Phase 57 Wave 2 — Session Log

## Sprint N — Shareable Output (canonical, post-defense push-through)

**Date:** 2026-04-30
**Wave commit target:** P57 Wave 2
**Preflight:** `plans/implementation/phase-57/preflight/00-summary.md`
**ADR:** ADR-081 (Shareable Output — Static HTML Export + Hosted Spec Link
Stub + Attribution)

> **Note on phase numbering:** phase-57 has TWO waves. Wave 1 (P57') sealed
> at `19fc501` covering the public-site refresh under ADR-080. **This Wave 2
> is the canonical Sprint N proper** — static HTML export + hosted spec
> link stub + attribution toggle. ADR-080 is consumed; this wave ships
> ADR-081. Owner deferred the post-capstone-presentation hold and pushed
> Sprint N through to RC. Test file is `tests/p57-wave2-shareable.spec.ts`
> (no collision with `tests/p57-public-site-refresh.spec.ts`).

## Deliverables (N4 scope — docs/tests/EOP only)

| # | Owner | Status | Files | LOC |
|---|---|---|---|---|
| 1 | N1 | parallel | NEW `src/contexts/export/staticHtmlExport.ts` + `src/components/shell/ExportStaticHtmlButton.tsx` + edits to `ChatInput.tsx` | — |
| 2 | N2 | parallel | NEW `src/contexts/export/hostedSpecLink.ts` + `src/pages/SharedSpec.tsx` + `/spec/:hash` route in `main.tsx` + `ShareSpecButton.tsx` rewire | — |
| 3 | N3 | parallel | NEW `src/contexts/export/attribution.ts` + `src/components/settings/AttributionToggle.tsx` | — |
| 4 | N4 | shipped | NEW `docs/adr/ADR-081-shareable-output.md` | ~115 |
| 5 | N4 | shipped | NEW `tests/p57-wave2-shareable.spec.ts` (15 cases) | ~135 |
| 6 | N4 | shipped | EOP artifacts (this file + retrospective) | — |

## Test results

- `tests/p57-wave2-shareable.spec.ts`: 15 PURE-UNIT cases authored
  (FS-level reads + regex; no browser bootstrap, no aisp barrel imports).
- Cases P57N.1 – P57N.14 depend on N1/N2/N3 source landing.
  Expected-failures by design — GREEN-flip on Wave 2 seal once parallel
  agents ship their source.
- Case P57N.15 (ADR-081 file shape + cross-refs) is GREEN immediately on
  N4 dispatch.
- `npx tsc --noEmit`: no N4-scope source edits — no regression possible
  from this wave (ADR markdown + test spec + EOP markdown only).

## Deviations from preflight

- **ADR number rollover.** Preflight `00-summary.md` named the ADR
  ADR-080. Wave 1 (P57') consumed ADR-080 for the public-site refresh.
  Wave 2 ships **ADR-081** — explicitly noted in this wave's ADR title
  and cross-refs.
- **Static export bundle simplified.** Preflight described a `.zip`
  containing `index.html` + `style.css` + `images/` + `aisp.json` +
  `README.txt`. Wave 2 ships a **single self-contained HTML doc** with
  inline CSS instead — lighter, no JSZip dependency at the export
  boundary, easier to paste-test. Preflight intent ("self-contained, no
  server required, opens in any browser") preserved.
- **Hosted link is a stub.** Preflight named Vercel KV / Supabase as
  preferred backings. Wave 2 ships the kv-backed in-browser stub per
  ADR-040 with HONEST disclosure that cross-browser sharing is a
  Tier-2 commercial upgrade. Same client API surface — Tier-2 swaps the
  backing without changing N1/N2 callers.
- **ADR-075 amended, not superseded.** Preflight DoD said "supersedes
  ADR-075". Wave 2 amends ADR-075 instead — clipboard data URL fallback
  still ships next to the new export button, plus `ShareSpecButton` is
  rewired to also call `publishSpecLocally`. Two surfaces coexist; no
  user-facing regression on the legacy CTA.

## Wave 2 close gate

- [ ] N1 + N2 + N3 source agents ship; 14/14 source-dependent tests flip
- [x] N4 ADR-081 + 15-test spec authored (this wave)
- [ ] Manual paste-test (Slack / Twitter / iMessage / email) — owner
- [ ] tsc clean across the merged N1/N2/N3/N4 commit
- [ ] STATE.md row + CLAUDE.md roadmap row for P57 updated post-merge
- [ ] P58 preflight scaffolded (Sprint O — Open Core RC)
