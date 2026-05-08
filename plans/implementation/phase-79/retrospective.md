# P79 / OC-14 — Retrospective

> **Phase:** P79 · **Sprint:** OC-14 (Page-Aware Chat Pipeline POC) · **Date:** 2026-05-01

## Keep

- **Four-track parallel dispatch (A1 audit / A2 pure module / A3 wire / A4 closer) on disjoint surfaces.** Page-aware pipeline is genuinely cross-cut (audit doc + pure module + chat pipeline edit + ADR/tests), and splitting on those seams kept each agent in a narrow blast radius. No collisions on the source files because A2 / A3 owned different modules and A4 (this agent) ships docs + tests + CLAUDE.md only.
- **FS-read pure-unit pattern with `existsSync` guards on A2 / A3 surfaces.** The closer test ships GREEN even when A2 / A3 land slightly later — the spec only hard-gates A4 deliverables (ADR-104 file shape, EOP triplet present). This pattern (used at P74 for Track-D review docs and P78 for A4 / A5 surfaces) keeps the seal-gate honest without forcing serial dispatch.
- **ADR-104 stays ≤120 LOC (actual: 75 LOC).** Tight ADR with 3-decision shape + cross-refs is more useful than a long essay. The recon-truth note ("`chatPipeline.ts:128` reads `config.sections` directly; `:354` calls `applyTemplateMatch(tplMatch, config)` — both page-naïve") names the latent bug explicitly so future readers see exactly what changed and why.
- **Pure module separation: `pageIterator.ts` has no store imports.** `activePageId` is passed in by the caller. This is the right discipline — the pure module is testable in isolation, can be reused in future Web Worker / Tier-2 server contexts, and has zero React coupling. Keep this discipline as the project grows toward Tier-2.
- **Single-page byte-equivalent fast-path as the regression invariant.** When `scopeRoot === ""`, `prefixPatchPaths` returns the input array reference-equal — patches unchanged, downstream behavior identical. Every existing single-page example renders byte-identical pre-P79 output. This is the gate, not "all sites are multi-page".

## Drop

- **The temptation to widen scope to page-aware INTENT_ATOM mid-sprint.** OC-14 preflight explicitly punted page-scope intent resolution to P82 OC-CLEANUP, and that hold-the-line was the right call. The intent resolver upgrade is non-trivial (target-page disambiguation in the parser) and would have blown the OC-14 timebox. Cross-page commands like `"edit page 2 hero from page 1"` still resolve to the active page only — fine for v1.
- **The temptation to refactor `chatPipeline.ts` shape.** A3 inserted surgical reads + scope-prefix calls; no reshaping of the pipeline. A bigger refactor is tempting but would have broken the regression invariant. Punt.
- **iteratePages adoption in the export pipeline.** A5/P78 export already handles per-page emission via `shareSpecBundle.ts:bundle.pages[]` directly. Re-wiring through `iteratePages` would be a cosmetic change with regression risk and zero user-visible benefit. Punt.
- **DECOMP_ATOM page-targeting verbs.** `decompAtom.ts` rules do not yet surface a `targetPage` field on `Todo`. P82 candidate. Multi-clause utterances scoped per-page is a real feature; not this sprint.
- **Worry about animation transitions on page switch.** No animation-library imports (the five banned packages) in any A4-owned file. The page tab strip already has a CSS transition under ADR-103; the patch pipeline doesn't need a stage.

## Reframe

- **Page-naïve pipeline was the latent bug introduced (silently) by ADR-085 and surfaced by ADR-103.** The data model existed (ADR-085, P61 planning); the UI surface shipped (ADR-103, P78); but the pipeline didn't update. Reframe: every multi-page-touching phase from here forward must verify that the chat pipeline is page-aware. Document this as an invariant in the next sprint's preflight.
- **The bug was invisible until UX made it visible.** Pre-P78, no user could switch pages, so the page-naïve pipeline never showed wrong behavior. P78 made multi-page visible; P79 closes the bug it surfaced. This is a healthy pattern: ship the visible surface first, then close the structural gaps it exposes. (Compare: P74 OC-DECOMP shipped DECOMP_ATOM only AFTER the chat surface made multi-clause input observable.)
- **`scopeRoot` plumbing is reusable.** The single-page byte-equivalent fast-path means future page-aware features (page-aware INTENT_ATOM, DECOMP page-targeting, mobile drawer page selector) can ride on the `scopeRoot` plumbing without extending the wire-point. This is the moat: subsequent sprints get cheaper, not more expensive.

## Carry-forward

- **Page-aware INTENT_ATOM target resolution** (P82 OC-CLEANUP — primary candidate; cross-page commands like `"edit page X hero"` from a different active page)
- **DECOMP_ATOM page-targeting verbs** (P82 — `Todo.targetPage` field; multi-clause cross-page utterances)
- **Mobile drawer page selector** (P82 — hamburger drawer surface needs page-list section; carry-forward from P78)
- **Page-nav auto-render in live preview** (P82 — cheap follow-on now that static export emits the nav)
- **Per-page brand / theme override** (Tier-2 commercial)
- **Hosted multi-page sites** (Tier-2 commercial — server-side routing)
- **iteratePages adoption in export pipeline** (Tier-2 — currently `shareSpecBundle.ts` emits per-page directly; refactor to use `iteratePages` is cosmetic-only)
- **Cross-page link validation / broken-link detection** (Tier-2)

## Velocity note

P79 closer (this triplet + ADR-104 + spec + CLAUDE.md edit) sized as ~25-35 minutes of A4 wall-clock at velocity. P79 as a 4-agent dispatch on a single working session is on-budget per the 3-phase-sprint ≈ 1 working day baseline (CLAUDE.md "Effort Estimation Rule"). The 4-agent dispatch shape is well within the 6-8 maxAgents recommendation — sustainable.

## Composite trajectory

P74 design+UX aggregate: 74.9/100 (Capstone 76 / Grandma 72 / Framer 71 / Lars 70). Combined P77 + P78 lifted the perf+a11y + multi-page sub-scores; P78 retrospective projected the post-P78 design+UX aggregate at the 80-82 band. P79 closes the latent page-naïve patch-routing bug surfaced by P78 — the visible-vs-actual UX disagreement on patch routing was a hidden P1 that would have shown up the moment a user with two pages tried to edit the second one. Closing it before it lands in the public demo is the right call.

Open P1 items after P79: page-aware INTENT (P82), DECOMP page-targeting (P82), mobile drawer page selector (P82). OC-CLEANUP at P82 is the natural next live candidate — three deferred P1s converge on the same sprint.
