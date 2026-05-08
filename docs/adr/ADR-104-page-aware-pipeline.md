# ADR-104 — Page-Aware Chat Pipeline

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P79 / OC-14
- **Cross-refs (primary):** ADR-085 (Multi-Page MVP — data-model predecessor), ADR-099 (DECOMP_ATOM — front-of-pipeline splitter), ADR-053 (INTENT_ATOM)
- **Cross-refs (secondary):** ADR-086 (Process Pages content/runtime split — context only; not pipeline architecture)

## Context

P78 / OC-11 (ADR-103) shipped the **multi-page UI surface** + per-page AISP export: visitors can add / rename / switch pages, and `bundle.pages[]` emits one entry per page. The data model (`MasterConfig.pages: Page[]`) had been live since ADR-085 (P61 planning).

The **chat pipeline did not get the memo.** `src/contexts/intelligence/chatPipeline.ts:128` reads `config.sections` directly when building matcher input, and `:354` calls `applyTemplateMatch(tplMatch, config)` against config-root sections. Both call sites are page-naïve. The user-visible bug:

> User adds Page 2 ("About"), clicks the page tab to switch active, types `"make hero brighter"` → patches target Page 1's hero (root sections), not Page 2's hero. The active-page indicator and the patched DOM disagree.

ADR-085 framed multi-page as the structural moat surface. ADR-103 shipped the visible UI. ADR-104 closes the **invisible** gap: the pipeline must read which page is active and scope patches accordingly.

## Decision

Three surgical pieces, scoped to the existing `intelligence` bounded context:

### 1. New pure module: `pageIterator.ts`

`src/contexts/intelligence/pageIterator.ts` exports three pure functions:

- `getActivePage(config, activePageId)` → `{ page, sections, scopeRoot }` returning the active page's sections and a JSON-Patch path prefix (`""` for single-page, `/pages/{id}` for multi-page)
- `iteratePages(config)` → `Iterable<{page, sections, scopeRoot}>` for export-all consumers
- `prefixPatchPaths(patches, scopeRoot)` → returns patches with paths re-rooted under `scopeRoot`

**Caller-controlled state.** No store imports. `activePageId` is passed in by the caller. No mutation of input config.

### 2. Single `activePageId` read at `chatPipeline.submit()` entry

`chatPipeline.ts` reads `useUIStore.getState().activePageId` ONCE at submit-entry, threads a `PageScope = { sections, scopeRoot }` through the pipeline, calls `getActivePage(config, activePageId)` to obtain it, and calls `prefixPatchPaths(patches, scopeRoot)` immediately before `applyPatches(...)` at each apply site. Matcher input uses the scoped `sections` rather than `config.sections`.

### 3. Single-page byte-equivalent fast-path

When `scopeRoot === ""` (no `pages[]` array OR `pages.length <= 1`), `prefixPatchPaths` returns the input array reference-equal — patches are unchanged, downstream behavior is identical. The 17+ pre-existing single-page examples and every legacy chat test stay byte-identical.

## Out of scope (Tier-2 / P82 carry-forwards)

- **Page-aware INTENT_ATOM target resolution** — cross-page commands like "edit page 2 hero from page 1" still resolve to the active page only. Target-page disambiguation in the parser is non-trivial and was explicitly punted from OC-14.
- **iteratePages adoption in the export pipeline** — A5/P78 export already handles per-page emission via `shareSpecBundle.ts:bundle.pages[]`; not re-wired here.
- **DECOMP_ATOM page-targeting verbs** — `decompAtom.ts` rules do not yet surface a `targetPage` field on `Todo`. P82 candidate.
- **Per-page brand / theme override** — Tier-2 commercial.
- **Mobile drawer page selector** — P82 (carry-forward from P78).

## Acceptance gates

1. `src/contexts/intelligence/pageIterator.ts` exists; exports `getActivePage` + `iteratePages` + `prefixPatchPaths`.
2. `chatPipeline.ts` imports `getActivePage` + `prefixPatchPaths` and reads `useUIStore` for `activePageId`.
3. Single-page mode: every existing example renders byte-identical pre-P79 output (regression gate).
4. Multi-page mode: patches against active page id `p2` carry `/pages/p2/sections/...` paths after `prefixPatchPaths`.
5. `pageIterator.ts` source contains zero animation-library imports (Framer Motion / GSAP / Lottie / React Spring / animejs).
6. ADR-104 Accepted; cross-refs ADR-085 / ADR-086 / ADR-099 / ADR-053.
7. ≥12 P79 tests GREEN in `tests/p79-page-aware-pipeline.spec.ts`.
8. TypeScript-strict; no `any` in new code.

## Consequences

**Positive:**
- Closes the page-naïve patch-routing bug introduced (latent) by ADR-085 and surfaced by ADR-103.
- Pure-module separation (`pageIterator.ts`) keeps page scoping testable in isolation.
- Single-page fast-path means zero regression risk on the 17+ legacy examples.
- Sets up a stable wire-point for the deferred page-aware INTENT_ATOM upgrade (P82) — the `scopeRoot` plumbing is reusable.

**Negative:**
- Adds one module + a small wire-delta in `chatPipeline.ts` — surgical but real.
- AISP atom paths grow longer in multi-page mode (`/pages/{id}/sections/...`); EXPERT trace pane density already addressed under ADR-103 mitigations.
- Introduces a `useUIStore` dependency at the chatPipeline entry — kept as a one-line read; no store coupling beyond that.

**Mitigations:**
- `existsSync` guards on A2 / A3 source surfaces in the P79 test spec keep the seal-gate honest under parallel-dispatch timing.
- Single-page byte-equivalence is named as Acceptance gate #3 — the regression suite asserts pre-existing examples stay unchanged.
- `pageIterator.ts` is a pure module with no store / no React imports — drop-in for future Web Worker / Tier-2 server contexts.
