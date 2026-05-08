---
title: "How Multi-Page MVPs Stay Atomic"
slug: "multi-page-mvp-stays-atomic"
date: "2026-05-01"
excerpt: "The page-aware patch story is the part most builders fumble. We made the spec contract carry the page boundary so 'edit page 2 hero' lands in page 2's hero — not page 1's."
tags: ["multi-page", "architecture", "AISP", "open-core"]
---

# How Multi-Page MVPs Stay Atomic

The first time you ask an AI builder for a second page, the wheels usually come off. The first page looked great. You typed "add an About page," got back something plausible, then said "make the hero brighter" — and the home page hero changed. Or both heroes changed. Or the patch landed in some third place because the model lost track of which page was active. The chat surface kept being a chat surface. The decision about *which page you were editing* never made it into the artifact.

That is the bug Hey Bradley closed at P78 and P79. Multi-page MVPs ship in P78 / OC-11 (`activePageId` in the store, page selector tabs in the left panel, per-page bundle emission). The page-aware chat pipeline ships in P79 / OC-14 (a `pageIterator` module plus a `scopeRoot` path prefix at the patch-apply sites). Two phases, two ADRs (ADR-103 and ADR-104), and an honest declaration about what is still deferred. The rest of this post is what changed and why the spec contract is the thing that made it possible.

## The page-naïve bug, in concrete terms

Before P79, the `chatPipeline.ts` matcher fed the full `bundle.sections[]` array into `applyTemplateMatch` regardless of which page the user was looking at. The fix was a single read of `useUIStore.getState().activePageId` at submit-entry, threaded as a `PageScope = { sections, scopeRoot }` through to every apply site. Then `prefixPatchPaths(patches, scopeRoot)` runs immediately before each `applyPatches(...)` call.

Walk the flow. User adds Page 2 ("About"), switches the active page to it, types "make the hero brighter." The pipeline does this:

- Reads `activePageId` once. Resolves it to a `PageScope` with `sections = page2.sections` and `scopeRoot = "pages.about"`.
- Hands those sections — only those sections — to the matcher.
- The matcher emits patches with paths like `sections[0].brightness` (page-local).
- `prefixPatchPaths` rewrites them to `pages.about.sections[0].brightness` immediately before apply.
- The patch lands in page 2. Page 1's hero is untouched.

In single-page mode, `scopeRoot === ""` and the prefix step is a no-op. The byte-equivalent output is preserved by construction. ADR-104 records the design decision, the test assertions, and the surface area: 75 lines of accepted ADR text against a 120-line cap.

## Why the spec contract had to carry the boundary

The boundary could have lived in three other places. We rejected each in turn.

**Option A: ambient store reads inside the matcher.** The matcher would call `useUIStore.getState()` directly. Cheap to write, impossible to test. The matcher becomes coupled to the UI store, can no longer be reasoned about as a pure function, and the page boundary becomes invisible in the PATCH atom emitted to the spec.

**Option B: prefix every path in the spec generator.** Every PATCH atom would arrive pre-prefixed with the scope root. This sounds clean until you remember that the spec is the hand-off artifact. Pre-prefixed paths bake page identity into the spec, which means re-running the same spec on a different page is now a string-replace operation rather than a re-application. We want the spec to be *page-portable*, not page-bound.

**Option C: leave the patches page-naïve and let the renderer guess.** This is what most builders do today. The renderer applies the patch to "the obvious page," which works until you have two pages with similar structure and the renderer guesses wrong. It is the same failure mode as the original bug, just relocated downstream.

The chosen design — pure `pageIterator` module, single-read of `activePageId` at submit-entry, prefix as a final step before apply — keeps the matcher pure, keeps the spec page-portable, and keeps the page boundary explicit at exactly one point in the pipeline. ADR-085 (Multi-Page MVP) and ADR-086 (Process Pages content/runtime split) cross-reference into this decision; ADR-099 (DECOMP_ATOM) and ADR-053 (Crystal Atom) bound the spec contract from above.

## What the test surface looks like

The P79 spec is `tests/p79-page-aware-pipeline.spec.ts` — five describe blocks, fourteen tests, with `existsSync` guards on every A2 and A3 surface so a missing module fails loud rather than silent. The hard gate asserts:

- `pageIterator.ts` exports `getActivePage`, `iteratePages`, `prefixPatchPaths` as pure functions.
- `chatPipeline.ts` reads `activePageId` exactly once per submit-entry.
- Single-page mode (`scopeRoot === ""`) is byte-equivalent to pre-P79 output.
- The ADR-104 file is present, accepted, and under the 120-LOC cap.
- The EOP triplet (preflight, session log, retrospective) is on disk.

The cumulative test count moved to ~942+ pure-unit green at P79 seal, up from ~930+ at P78. Twelve new tests for the two new surfaces. No regressions.

## What we honestly deferred

This is the part that matters. Three things are still page-naïve and they are documented as carry-forward, not hidden:

- **INTENT_ATOM target resolution** still resolves against the full bundle when it builds the `target` field. Deferred to P82 OC-CLEANUP. The user-visible symptom is rare ("edit the second hero on page 2" — INTENT might still pick page 1's second hero); fixing it requires page-aware target resolution inside the AISP layer.
- **DECOMP_ATOM page-targeting verbs.** Phrases like "on page 2" or "in the about page" are not yet first-class verbs in the decomposition table. They get treated as natural-language hints rather than structural directives. Deferred to P82.
- **`iteratePages` adoption in the export pipeline.** P78's A5 already handles per-page emission directly via `shareSpecBundle.ts`'s `bundle.pages[]` walk, so the export path is correct, but it does not yet share code with the chat pipeline's iterator. Refactor for symmetry, not for correctness.

The reason these are out is the same reason we ship anything: the pure-function refactor inside the chat pipeline was the load-bearing change. Page-aware INTENT and DECOMP are surface polish on top of a correct contract. Better to ship the contract first and watch the symptoms in production for one phase before widening the AISP layer.

## What this means for the open-core moat

The thesis is that the spec layer is the moat. Every phase that hardens the contract widens the moat. P79 hardens the contract by making the page boundary an explicit, testable, single-point-of-truth value rather than ambient state. The next agent that reads the codebase — Claude Code, Cursor, a teammate, or the swarm running P82 — does not have to guess where page identity lives. It lives in `useUIStore.activePageId`, threaded once, prefixed once, applied once.

That is what "atomic" means in the multi-page context. Not that every patch is small. That every patch carries enough context to be applied correctly without ambient state, and the spec it produces can be replayed on a different page without surgery. The page boundary became part of the contract. The contract stays inspectable. The moat got a little wider on a Friday afternoon.

The open-core repo has the full diff. ADR-104 is 75 lines. The new test file is 14 cases. The carry-forward list is in the P79 retrospective. We left all three on purpose.

Try the multi-page demo →
