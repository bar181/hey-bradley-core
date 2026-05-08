# Hey Bradley — Technical Deep Dive on Development Process

> **Date:** 2026-05-04 · **Phase:** MVP-RETRO · **Branch:** `swarm/mvp-retrospective`
> **Predecessor seal:** Pre-Launch Sprint at `e506913`
> **Audience:** Capstone defense + future-team handoff + engineering replay

## Executive summary

The build was a **swarm-driven, spec-first, ADR-anchored sprint cadence** that landed **109 sealed phase folders**, **128 ADRs on disk** (ADR-001..ADR-137 + 7 connections ADRs C01..C07), **~28.4K LOC of TS/TSX across 360 src files**, and **~1,952 literal `test(` calls across 146 spec files** in roughly six weeks of working sessions. Velocity peaked at six sealed phases per working day. The headline bottleneck was **test-trustworthiness**: ~85% of the spec corpus regex-matches source text rather than invoking source modules, so the seal-gate ratchet caught documentation drift but missed runtime regressions until P105–P108 corrected course. ADR README drift (89 ADRs stale across 60+ phases) and self-inflicted path-move regressions (P109 scaffolding cleanup broke 20 EOP existsSync tests) were the two largest scale-vs-velocity tradeoffs. The discipline pattern is recommendable; the testing pattern needs a runtime shift before being copied.

## 1. Process architecture

### 1.1 Standard phase process (CLAUDE.md §"Standard Phase Process")

Every phase ran the same five-step loop, no exceptions:

1. **Preflight** — scaffold `phase-N/preflight/00-summary.md` + `checklist.md` + `MEMORY.md`
2. **Execution** — code + docs per phase plan; LOC caps enforced (≤500 source/component, ≤120 ADR, ≤300 atom modules)
3. **End-of-phase (EOP triplet)** — `master-checklist.md` ticks + `STATE.md` row update + `session-log.md` results table + `retrospective.md` (keep / drop / reframe)
4. **Review with fixes** — post-seal review pass; must-fix items land in `fix-pass-N` commits before next phase opens
5. **Next-phase preflight** — scaffolded immediately after seal so the next agent inherits a non-empty workspace

**Optional extras for major phases:** 4-reviewer brutal review (UX / Functionality / Security / Architecture) at ≤600 LOC per chunked report, recursive ≤3 passes, and persona re-score (Grandma / Framer / Capstone-or-Lars) against a stable rubric.

### 1.2 Wave-gated parallelism

Most phases dispatched in two waves with **disjoint file scopes** to guarantee zero merge conflicts:

- **Wave 1**: 2–5 parallel agents, each owning a non-overlapping file set (e.g. P106 dispatched `A1 deleteOrphan` / `A2 atomViewInversion` / `A3 sectionEnumReconciliation` simultaneously)
- **Wave 2**: a single closer agent that wrote the ADR + tests + EOP triplet + `CLAUDE.md` sync after Wave 1 landed

The disjoint-ownedFiles invariant later got codified as **AGENT_ATOM Γ R3 + Ε V1** (ADR-120) — a load-bearing pattern was promoted from convention to Σ-contract.

### 1.3 Multi-hour shifts (CLAUDE.md velocity rule)

CLAUDE.md §"Effort Estimation Rule" makes the velocity expectation explicit: **target multi-hour shifts, NOT multi-day shifts.** Observed velocity through P19 was ~6 sealed phases per day. Original phase budgets (4–6 days each) were 10–50× conservative. Sprints were re-budgeted at the end of each phase based on actual elapsed time, with the explicit rule: *"Quality discipline is the brake — do NOT compress to hit velocity. Velocity emerges when discipline holds."*

## 2. Scale + speed numbers

### 2.1 Lines of code

| Surface | LOC | Files |
|---|---|---|
| Web app `src/` (TS + TSX) | **~54,187** total / ~28,400 component LOC | **360** files (210 `.tsx` + 150 `.ts`) |
| Total repo (excl. node_modules) | **~63K** | TS/TSX/JSON/MD |
| Connections layer source | **5,061** LOC across 61 source/docs files (excl. `dist/`) | 10 plugin files + 7 MCP tools/server + 6 NPX commands + 18 AISP specs + 7 ADRs |
| `dist/` build output | 14M unminified assets folder; **2.26 MB** entry chunk pre-gzip | 50+ lazy chunks |

### 2.2 Phase counts

- **Phase folders processed at scaffolding cleanup**: 109 (per `2026-05-04-scaffolding-cleanup-report.md`)
- **Total phase boundaries when including connections + final-cleanup + 5-projects + pre-launch + mvp-retro**: 109+ named seal points
- **Time anchor**: P11 (initial polish) → v2.0.0-RC1 (P103) → connections layer P1–P6 → pre-launch sprint
- **Phase folders missing canonical 3-shape pre-cleanup**: 32 missing preflight (pre-P21 era), 3 missing session-log, 6 missing retrospective — all normalized at scaffolding cleanup

### 2.3 ADR ledger

- **128 files on disk** in `docs/adr/`
- ID range **ADR-001 through ADR-137** with documented gaps (002-004, 006-009, 034-037, 123-125 reserved for unrun phases) plus **3 stub-then-superseded duplicates** (ADR-051/052/053 each have a P21 stub + a later Accepted file)
- **2 explicit supersessions tracked**: ADR-076 (Sprint J 3-tab nav) → ADR-090 (Mobile UX Redesign); ADR-057 (P28 SELECTION_ATOM 2-step pipeline) → ADR-134 (P106 dead-code purge; templateMatcher.ts is canonical)
- **+7 connections ADRs** (ADR-C01..C07) at `connections/docs/adr/`
- ADR README rebuilt at P109 / ADR-LEDGER-TRUTH-UP after **89-ADR drift over 60+ phases** (was last touched 2026-04-27 at ADR-048)

### 2.4 Test corpus

- **Literal `test(` count across `tests/**/*.spec.ts`**: **1,952** (verified at audit time; 2,065 at the latest count post-connections sprint)
- **Spec files**: 131 at P104 audit anchor, **146** at audit-end including connections
- **`existsSync` calls**: **1,038** across 131 specs at P104; ~7.9 per spec average (P100 W2 has 44; P95 has 34)
- **Cumulative regression at P109 anchor (CLAUDE.md self-report)**: 237 GREEN curated set; broader claim "~1,491+ at P109" is the whole-corpus cumulative
- **Behavioral runtime regression count (audit estimate)**: **likely <400** of the 1,952 literal `test(` calls — only **26 of 131** specs ever call `page.goto`; only **3** use `@/` path-alias imports
- **Single Playwright project pre-P108**: `Desktop Chrome`. P108 widened to 4 projects (Desktop + 3 mobile devices) via `testMatch` opt-in to avoid retro-fitting Desktop suite

### 2.5 Bundle size + perf

- **Entry chunk pre-gzip**: 2.26 MB (`dist/assets/index-*.js`)
- **Lazy chunks** (largest): `geminiAdapter` 264KB, `configStore` 207KB, `kv` 163KB, `openaiAdapter` 108KB, `intelligenceStore` 107KB
- **CSS bundle**: 114 KB
- **Build time**: ~2.5–7.7 s (Vite + sql.js pre-bundle)
- **ADR-102 cap**: ≤800 KB **gzip** entry — lazy chunks excluded from the cap; route lazy + img lazy + aria-label discipline shipped at P77

### 2.6 Velocity peaks

- **P102 + P103 combined seal** (token migration + Agentics live-wire + release notes + launch assets + ADR-132 + ADR-133): 6 parallel agents across 2 waves, ~1,320+ tests cumulative anchor at end-of-window, 4 hr wall clock
- **P105 RC-blockers**: 4 P1 carry-forwards closed (Welcome routes, log persistence flush, cleanTranscript pipeline wire, validateSectionType production wire) in 4 parallel + 1 closer = ~3 hr wall clock for 17 NEW tests + ADR + EOP triplet
- **P108 TEST-RUNTIME-SHIFT**: 87 net-new test runs (24 p76 trim + 30 mobile × 3 projects + 33 helpers behavioral) in 1 wave / 3 disjoint agents + closer

## 3. Bottlenecks

### 3.1 Vite-only `import.meta.glob` barrier

`src/contexts/persistence/db.ts` transitively pulls `migrations/index.ts` which uses Vite-only `import.meta.glob`. Importing `validateEventType` (P104) into a raw Playwright/Node test crashed the bootstrap. **P108 / A10 worked around** by extracting `validateEventType` via `node:vm runInNewContext` sandbox — preserves the "import + invoke" rule without restructuring `src/`. **Future runtime helpers should use a file-system-direct read pattern from the start** to avoid the glob transitive trap.

### 3.2 Soft-pass `existsSync` over-reliance

The seal-gate ratchet greps source-text for substring presence rather than calling functions. The Track D audit (`04-test-coverage.md`) found:

- 26 of 131 specs ever call `page.goto` (Playwright bootstrap)
- Only 3 specs use `@/` path-alias imports — the test corpus barely loads source modules
- Estimated **~600 `existsSync` calls are post-seal soft-pass guards** that no longer protect against timing-slip but DO protect against accidental file deletion

**P108 closed the top-3 helper gaps** (`cleanTranscript` / `validateEventType` / `validateSectionType` got 33 cases of behavioral coverage). The rest of the soft-pass corpus is a carry-forward.

### 3.3 Self-inflicted regressions on path moves

The P109 / SCAFFOLDING-CLEANUP moved **338 files** into `archive/` subfolders to normalize 109 phase folders to the 3-canonical-file shape. The move broke ~20 EOP-triplet `existsSync` checks across older phase specs that pinned to `seal/02-post-review.md` paths instead of the new top-level filenames. **A staleness fix-pass shipped at `30c8c11`** to migrate test references. **Lesson**: path moves should atomically migrate test references in the same commit that does the move.

### 3.4 ADR README drift

`docs/adr/README.md` was last touched 2026-04-27 at ADR-048 — **60+ phases dormant** while disk reality grew to 127 ADR files. Rebuilt at P109 / A12 (260 LOC ≤500 cap, every title sourced verbatim from disk, documented gaps + supersessions explicit). **Should be CI-enforced going forward** via a README-vs-disk diff at every seal — the section-enum drift regression guard pattern from P109 / A13 (`tests/p109-section-enum-drift-guard.spec.ts`) is the template.

### 3.5 Connections-layer tsconfig moduleResolution gotcha

`connections/mcp/` and `connections/npx/` use tsc `moduleResolution: bundler`. Extension-less relative imports compile clean under `tsc --noEmit` strict but **fail at raw Node ESM runtime** because Node ESM requires `.js` on relative specifiers. Recorded as **G1 publish-blocker in `connections/docs/seal/02-post-review.md`** at the P5 verification gate. **Fix** is `moduleResolution: NodeNext` from the start, OR a post-build extension rewrite step.

### 3.6 Optimistic seal claims (closure-without-callsite)

Two examples surfaced after-the-fact:

- `validateSectionType` declared "wired" at P104 but had **0 production callers** until P105 / A4 added a dev-only EXAMPLE_SITES audit pass at module init
- `cleanTranscript` declared "wired" at ADR-127 but was logging-only until P105 / A3 threaded `effectiveText` through 14 consumers when `source==='listen'`

The fix-pattern (introduced at P105) is to treat **"carry-forward CLOSED" claims as needing a hard-test for ≥1 production import + invocation**, not just module presence.

## 4. What scaled well

### 4.1 ADR-driven discipline

Every architectural decision was documented and dated. Supersessions were tracked explicitly (ADR-057 → ADR-134; ADR-076 → ADR-090) with cross-refs in both directions. The pattern allowed a new agent dropping into phase N to reason backward about why phase N–10 made a particular call without reading session logs.

### 4.2 Disjoint-scope parallel agents

Hundreds of multi-agent dispatches landed across the build with **zero merge conflicts** because Wave 1 owners were assigned non-overlapping file sets. The convention worked at every scale from 2 agents (most cleanup phases) to 6 agents (P102+P103 combined seal). Codified as ADR-120 / Ε V1.

### 4.3 EOP triplet pattern

Preflight + session-log + retrospective per phase was non-negotiable from P21 onward. **109 phase folders normalized at scaffolding cleanup** all preserve the original artifacts under `archive/` (zero file loss; 692 → 692; 383/383 changes detected as renames). Future-team review of any phase has a stable path.

### 4.4 Cross-track convergence in audits

The deep-audit (`plans/strategic-reviews/2026-05-04-gaps-to-done/`) found that the same root cause was flagged by 2+ audit tracks. The aggregator merged 73 raw findings → **52 unique items** by collapsing convergences (e.g. "section-enum drift" appeared in Track A architecture + Track D test coverage). The pattern saved roughly one full audit-cycle of triage work.

### 4.5 Schema-first runtime guards

`validateEventType` + `validateSectionType` (P104) caught silent failures **before they hit users**: the `patch_applied` → `patch_validation` alias remap and the `article` → `text` / `nav` → `menu` / `cta` → `action` section aliases existed in fixtures + LLM output but NOT in the canonical 18-type enum. Without the validators, those rows would have silently dropped or thrown CHECK constraint errors at runtime.

### 4.6 BYOK trust boundary at every write site

ADR-043 enforced **zero key shapes ever cross to disk**. The audit confirmed: `redactKeyShapes` is called in 11 sites + the centralized `writeErrorEvent` helper added at P107 ensures **both `message` AND `stack`** get redacted at every error path. **0 key shapes** in 98 log fixture rows across the 4 test scenarios. The trust boundary survived 100% of test fixtures and never required a security retraction.

## 5. What didn't scale (needs improvement)

### 5.1 Audit grep precision

D7 in the test-coverage audit was a **false positive**: `^\s*test\(` regex missed `const it = test;` aliasing in `tests/p76-spec-export-quality.spec.ts`. The file actually had 24 cases (it/test alias). **Future audits should grep for `test(` AND `it(` AND `const\s+it\s*=\s*test` aliasing markers.** ADR-136 documents the correction. **6 P1 Track D items** were reduced to **5 P1 + 1 audit-error** by the P108 / A8 correction.

### 5.2 Test-trustworthiness vs file-presence

The seal gate enforced KISS (no-new-deps) + ADR (file shape) + EOP-triplet (existence). It did **NOT** enforce runtime regressions. Track D P1s reduced post-P108 (D1 + D3 + D4 + D7 closed) but the **cultural shift is incomplete** — most pre-P108 specs are still pure-text grep against source files. Recommend a test-runtime-shift pass at every major-phase seal going forward.

### 5.3 Optimistic seal claims (see §3.6)

Pattern-of-failure: declaring a feature "shipped" when only the module exists. The P105 closure-with-callsite-hard-test fix-pattern should become the default, not the exception.

### 5.4 ADR ledger maintenance frequency

89-ADR drift took 60+ phases to catch. The lesson is that documentation is a **CI-enforceable invariant**, not a manual one. The P109 section-enum drift guard test (`tests/p109-section-enum-drift-guard.spec.ts`) is now the template — adding a 19th section type requires touching 5 source files + the test in lock-step. **The same pattern should apply to ADR README presence.**

## 6. Process improvements for future sprints

1. **Test-runtime-shift culture as default.** P108 was a correction; future phases should treat behavioral-coverage of new helpers as a same-sprint requirement, not a follow-up. Hard-test ≥1 production import + invocation.
2. **ADR README CI-enforcement.** Section-enum drift guard pattern (P109 / A13) extended to a `tests/adr-readme-vs-disk.spec.ts` that fails the build when README count ≠ `find docs/adr -name "ADR-*.md" | wc -l`.
3. **Path-move atomic migration.** When phase folders or test paths move, the test-reference update lands in the SAME commit. The P109 scaffolding cleanup should have migrated test paths inline; the staleness fix-pass at `30c8c11` was avoidable.
4. **Audit grep self-test.** Before adopting an audit regex, run it against a known-positive sample. P108 / D7 false positive cost ~1 hour of fix-pass attention.
5. **Connections-layer tsconfig defaults to NodeNext.** Avoids the bundler-vs-runtime publish blocker (G1) class. Add `tsconfig.json` template to project scaffolding.
6. **Vite-only barrier avoidance.** Helpers intended for runtime invocation in BOTH browser AND test contexts should be file-system-readable from start (no `import.meta.glob` transitive). The `node:vm` workaround was a smell.
7. **Persona scoring honesty.** P101 → P102 arc (84 → 86 / 84 → 86 / 85 → 88) is the template — score, name floor breaches, name fixes, re-score with named callers. **Do NOT** rely on a regex-match against markdown text as the only enforcement (Track D / D8).
8. **Cross-track convergence merge by default.** Deep-audit pattern (5 chunks → 1 master checklist with 73 → 52 items) should be the meta-shape of every multi-reviewer pass. Saves roughly one cycle of triage.

## 7. Honest verdict

The swarm-driven engineering process was **worth the discipline overhead** — the velocity number (6 phases/day at peak; 109 phases / ~6 weeks net) and the scale number (128 + 7 ADRs / 1,952 tests / 2.26 MB entry chunk lazy-trimmed below ADR-102's 800 KB gzip cap) only landed because the EOP triplet + ADR-anchored seal-gate + disjoint-scope parallelism prevented the single-coder bottleneck from forming. **The recommended pattern for similar future builds**: keep the discipline, fix the test culture (runtime invocation > regex grep), and CI-enforce documentation invariants from day one rather than catching them at phase 109.

The MVP is launch-ready. The methodology is replicable. The honest gaps are named.
