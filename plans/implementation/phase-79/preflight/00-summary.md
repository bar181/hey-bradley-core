# P79 / OC-14 — Process Pages POC: Page-Aware Pipeline (Preflight)

> **Phase:** P79 · **Sprint:** OC-14 · **Date:** 2026-05-01
> **Predecessor:** P78 sealed at `a51cb88` (~930+ GREEN, 103 ADRs)
> **Cross-refs:** ADR-085 (multi-page MVP), ADR-086 (process-pages content/runtime split), ADR-099 (DECOMP_ATOM), ADR-053/057/060/064 (atom layers)

## Reframe — page-naïve recon

P78 shipped multi-page UI + per-page export. Pipeline is **page-naïve**:
- `chatPipeline.ts:128` reads `config.sections` directly (no page scope)
- `chatPipeline.ts:354` calls `applyTemplateMatch(tplMatch, config)` — config root sections, not active-page sections
- Result: user adds Page 2, types "make hero brighter" → patches target Page 1's hero (the bug)

P79 closes the bug. Out of scope: workflow process-type pages (deferred — that's a different OC-14 reading; CLAUDE.md `Capabilities` ADR-086 already accepted).

## 4 parallel agents · disjoint scopes

### A1 — Pipeline audit (READ-ONLY artifact)
**Owns:**
- `plans/implementation/phase-79/01-pipeline-audit.md` (NEW; ≤300 LOC) — read `src/contexts/intelligence/chatPipeline.ts`, `applyPatches.ts`, `templates/templateApplier.ts`, `aisp/todoExecutor.ts`. Classify each call site as page-naïve / page-aware / N/A. Enumerate gap list with file:line citations. Recommend integration point (post-DECOMP, pre-applyPatches).

**Constraints:** READ-ONLY — no source edits. Doc artifact only.

### A2 — PageIterator impl
**Owns:**
- `src/contexts/intelligence/pageIterator.ts` (NEW; ≤180 LOC) — exports:
  - `getActivePage(config, activePageId): { page, sections, scopeRoot }` returning the active page's sections + path-prefix (`""` single-page, `/pages/{id}` multi-page)
  - `iteratePages(config): Iterable<{page, sections, scopeRoot}>` for export-all path
  - `prefixPatchPaths(patches, scopeRoot)` mutates JSON Patch ops to scope paths
  - Single-page fallback (pages absent OR length≤1) → returns synthetic page covering `config.sections`
- Tests at end of file? NO — tests go to A3.

**Constraints:** Pure function module. NO store imports (caller passes config + activePageId). NO mutation of input config.

### A3 — chatPipeline integration + types
**Owns:**
- `src/contexts/intelligence/chatPipeline.ts` (EDIT) — at the patch-apply call sites (lines ~206, ~335, ~357, ~386):
  - Read `useUIStore.getState().activePageId` (single read at submit entry; pass through)
  - Call `getActivePage(config, activePageId)` to obtain `{sections, scopeRoot}`
  - Pass `sections` to template matcher input in place of `config.sections` for matching context
  - Call `prefixPatchPaths(patches, scopeRoot)` before `applyPatches(...)` — multi-page patches now target `/pages/{id}/sections/...` paths
  - Single-page mode: `scopeRoot = ""` → patches unchanged → existing behavior preserved
- `src/lib/types/chatPipeline.ts` OR inline in chatPipeline (EDIT — extend types if needed; minimal change)

**Constraints:** Backward-compat — single-page tests must remain GREEN. NO refactor of pipeline shape; surgical insertions only.

### A4 — ADR-104 + tests + EOP closer
**Owns:**
- `docs/adr/ADR-104-page-aware-pipeline.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-085 + ADR-086 + ADR-099 + ADR-053)
- `tests/p79-page-aware-pipeline.spec.ts` (NEW; ≥12 cases; Playwright `test.describe`/`test`; FS-read PURE-UNIT pattern with `existsSync` guards):
  - P79.1 ADR-104 file shape (4)
  - P79.2 PageIterator module shape (3): exports getActivePage, iteratePages, prefixPatchPaths
  - P79.3 chatPipeline page-aware wire (2): chatPipeline imports pageIterator; `prefixPatchPaths` referenced
  - P79.4 KISS — no animation libs in P79 source (1)
  - P79.5 EOP triplet (3)
- `plans/implementation/phase-79/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync (ADRs 103 → 104; tests +12; capabilities entry)

**Constraints:** ADR ≤120 LOC; Status: Accepted; tests use `@playwright/test` (NOT vitest); ROOT = `process.cwd()`; no animation libs in owned files.

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. Backward-compat — single-page mode patches identical paths as today
4. NO touching files outside owned list
5. NO shell commands inside agents (except tsc + targeted playwright run)
6. TypeScript-strict; no `any`
7. KISS — defer page-aware INTENT_ATOM target resolution to P82

## Acceptance gates
- PageIterator pure module compiles + exports 3 functions
- chatPipeline reads activePageId; multi-page patches scope-prefixed; single-page bytewise unchanged
- ADR-104 Accepted citing ADR-085 + ADR-086
- ≥12 P79 tests GREEN
- Full session OC chain regression (P62-P79) GREEN — ≥606
- tsc strict clean
