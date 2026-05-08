# Gaps-to-Done Audit · Index & Orientation

> **Date:** 2026-05-04 · **Branch:** `claude/verify-flywheel-init-qlIBr` · **Predecessor seal:** P104 / SCHEMA-GUARDS at `47cbfe4`
> **Mode:** RESEARCH ONLY — meta-audit aggregating 5 deep-dive chunks. No source modifications.

## Why this audit exists

v2.0.0-RC1 is sealed at P103 with a 86.7/100 composite (ADR-132/133). P104 added schema guards on top. The carry-forward registry (ADR-131) lists 12 items: 7 closed, 2 owner-required, 1 Tier-2, 12 P102+ candidates re-rolled. Before owner-attested human click-through and the Show HN / Product Hunt push, the swarm needs to do an honest **brutal-honest checkpoint** that:

1. Does NOT trust the CLAUDE.md anchor narrative blindly
2. Greps actual source for actual call-sites
3. Distinguishes "shipped + wired + tested behaviorally" from "shipped + grep-existsSync-passes"
4. Names the gap class — swarm-doable / owner-required / Tier-2 — for every finding
5. Sequences the work into dispatch-ready sprints

This is the **last static audit before the v2.0.0-RC1 launch click-through**. After this, gaps either get closed (P105+ sprints), get honest-deferred to Tier-2, or get an owner waiver.

## File map

| File | Contents | LOC |
|------|----------|-----|
| `00-index.md` | THIS FILE — orientation + headline truths + cross-track convergence | ≤200 |
| `01-architecture-contracts.md` | Track A — ADR ledger / atom contracts / DDD boundary leaks | ~315 |
| `02-pipeline-behavior.md` | Track B — chatPipeline / atom wiring / dead-code branches | ~458 |
| `03-persistence-observability.md` | Track C — SQLite logs / persist hook / redaction / retention | ~268 |
| `04-test-coverage.md` | Track D — test corpus honesty / soft-pass creep / behavior gap | ~332 |
| `05-ui-surfaces.md` | Track E — routes / mode architecture / token drift / a11y | ~432 |
| `06-master-checklist.md` | Deduplicated cross-track checklist; ordered by P1/P2/P3 + KISS-fit + LOC | ≤600 |
| `07-roadmap.md` | Sprint roadmap P105+; agent counts + LOC budgets + acceptance gates | ≤500 |

## Aggregate stats

- **77 raw findings** across 5 tracks
- **19 P1 · 35 P2 · 23 P3** by raw severity
- **~50 deduplicated items** after cross-track convergence merge
- **5 cross-track convergence callouts** (same root cause flagged ≥2 tracks)
- **~250-300 net LOC** to close the swarm-doable RC blockers
- **5 owner-required items** (cannot be closed without BYOK / browser / human)

## Headline truths — one line per track

1. **Track A — Architecture is load-bearing-but-cracked.** 4 atoms invert dependency on the view layer (`processAtom.ts` imports from `@/components/planning/ProcessMapSVG`); PATCH_ATOM section-type enum is wrong in 3 ways and drifts from `sectionTypeSchema`; ADR README is stale by 87 ADRs (declares 38; reality 122 distinct).
2. **Track B — Pipeline is healthier than feared but five P1 dead branches survived seal.** `validateSectionType` has zero callers; `twoStepPipeline`/SELECTION_ATOM is fully orphaned; `isUnmeasurable`+`hasContradiction` are computed-but-non-acting; route='content' short-circuits to canned never invoking CONTENT_ATOM; `ASSUMPTIONS_FALLBACK_TEMPLATES` is exported but never imported.
3. **Track C — Observability has a silent persistence hole.** `writeLogEvent` does NOT call `persist()`; logs only land in IndexedDB if an unrelated configStore mutation autosaves within the same session. Sessions producing only canned/error replies evaporate on tab close. 5 of 15 declared event_types have zero writers.
4. **Track D — Test suite is documentation-and-grep, not a behavior verifier.** 1,952 literal `test()` calls but ~85% are `expect(srcFile).toMatch(regex)` against source files. Only 26 of 131 specs ever do `page.goto`. Persona scores (86/86/88) are verified by counting `\b8[5-9]/100\b` substrings in a markdown file. `cleanTranscript` has zero behavioral coverage. P76 spec file has ZERO test cases.
5. **Track E — Mode architecture is partially wired and partially contradictory.** Welcome.tsx links to `/onboarding` 5 times but the route is `/new-project` (every primary CTA hits NotFound). AppShell's `/planning` and `/agentics` mode branches are dead code (Routes mount the page components directly, bypassing AppShell). 4 hardcoded literal-hex pills in SpecWorkbench ignore the `--hb-status-*` tokens shipped P102.

## Cross-track convergence — same root cause, multiple eyes

These items were independently flagged by ≥2 tracks. The master checklist merges them into single items.

1. **`validateSectionType` is dead** — A6 + B1 (BOTH say zero callers; P104 closure-claim is OPTIMISTIC). The helper ships with a 10-entry alias map (`article→text`, `testimonial→quotes`, `cta→action`, etc.) but the JSON-load boundary in `masterConfigParser.ts` and `EXAMPLE_SITES` import path never invoke it. Zod runs strict and rejects aliases. **5-15 LOC fix.**
2. **5 event_types declared but never emitted** — A7 + C1 (`multi_page_scope` / `error_event` / `todo_execution` / `decomp_split` / `export_emit`). Schema admits them; nobody fills them. Two were added P100 W2 specifically so fixtures stop being silently rejected — i.e. they pass tests by being declared, not by being emitted. **~65 LOC to close all 5.**
3. **`cleanTranscript` only emitted, not piped** — B7 + D1 (chatPipeline.ts:327 calls it for the log payload only; downstream `classifyIntent`, `decompose`, `matchTemplates`, `runLLMPipeline` all consume the raw `text`). Listen-mode users pay disfluency tax on every submit. Zero behavioral test exists. **~5 LOC fix; ~30 LOC test.**
4. **PATCH_ATOM section-type / sectionTypeSchema / ALLOWED_TARGET_TYPES — 3-way drift** — A2 + A11 + Track D (no test enforces 18-canonical). PATCH_ATOM lists 16 (wrong: `navbar` not in schema), `sectionTypeSchema` lists 18, `ALLOWED_TARGET_TYPES` lists 23. Three sources of truth. **~30 LOC fix; ~20 LOC drift-guard test.**
5. **Pure-unit existsSync soft-pass culture** — D13 plus implicit in every track's "honest declaration." 1,038 existsSync calls across 131 spec files; ~600 are post-seal soft-pass guards that no longer protect against timing-slip but DO mask accidental file deletion. **Systematic prune, not a single fix.**

## Quick-jump links

- Worst P1s by track:
  - A1 (atom→view inversion) → `01-architecture-contracts.md` §A1
  - B2 (twoStepPipeline orphaned) → `02-pipeline-behavior.md` §B2
  - C2 (writeLogEvent does not persist) → `03-persistence-observability.md` §C2
  - D7 (P76 spec is empty) → `04-test-coverage.md` §D7
  - E1 (Welcome links to 404) → `05-ui-surfaces.md` §E1
- All findings deduplicated and ordered → `06-master-checklist.md`
- Sprint dispatch plan → `07-roadmap.md`

## Honest declaration (this audit)

This is RESEARCH ONLY. The 5 source chunks were each a static audit (grep + file read; no execution). This index aggregates and dedupes them. No claim here is verified by running the code or live LLMs. The 5 cross-track convergences are the highest-confidence findings because they were independently surfaced by ≥2 readers from different perspectives.

What this audit does NOT cover (out-of-scope, owner-required):

- Live BYOK round-trip (CF#4) — owner runs once at v2.0.0-RC1 launch
- Real STT calibration (CF#5) — owner runs at launch
- Mobile / screen-reader live render — owner-attested or post-launch Lighthouse
- Visual regression against design intent — no baseline screenshots in repo
- Cross-browser (Firefox, Safari, mobile Safari) — single Playwright project = Desktop Chrome
