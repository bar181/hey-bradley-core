# Agentic Engineering — Best Practices from Hey Bradley

> Date: 2026-05-04 · Phase: MVP-RETRO
> Distilled from 109 phases / 128 ADRs / Hey Bradley v2.0.0-RC1 + connections build
> Audience: future swarm-driven build projects · technical leadership · capstone defense
> Predecessor seal: Pre-Launch Sprint at `e506913`

## Executive summary

This methodology is a **swarm-driven, spec-first, ADR-anchored sprint cadence** that produced 109 sealed phases / 128 + 7 ADRs / ~28.4K source LOC across 360 files / 1,952+ test calls in roughly six weeks of working sessions, peaking at six sealed phases per working day. Use it when a single architect needs to coordinate 3-7 parallel agents per wave at multi-hour velocity without merge conflicts or quality erosion. The discipline is replicable; the testing pattern needs a runtime shift before being copied wholesale.

## 1. The 7-step methodology

Codified per ADR-118 (PROCESS_ATOM) + ADR-119 (DDD_ATOM) + ADR-120 (AGENT_ATOM) + ADR-130 (SealPanel + EOP persistence):

1. **Understand** — Inventory existing surfaces with file:line citations; no aspirational claims (the deep-audit pattern at `plans/strategic-reviews/2026-05-04-gaps-to-done/` is the template — 5 chunks / 1,691 LOC / 77 raw findings, every claim grounded in source grep)
2. **Decompose** — Break work into ADRs before code; one ADR per architectural decision; ≤120 LOC cap per ADR
3. **Architect** — Author Crystal Atom specs (Σ/Γ/Λ/Ε blocks) before implementation; AISP v5.1 contract layer
4. **Spec** — AISP discipline with hard production gate Ambig < 0.02 (lower is better); platinum tier ≥ 0.75
5. **Plan** — Wave-gated parallel agents with disjoint scopes; closer-pattern wave at end
6. **Build** — ≤500 LOC per phase / ≤120 LOC per ADR / ≤80 LOC per spec / ≤300 LOC per atom module
7. **Reflect** — Brutal-honest review (4 perspectives) + EOP triplet (preflight / session-log / retrospective)

## 2. Standard phase process (always-do)

Every phase, in order, no exceptions (CLAUDE.md §"Standard Phase Process"):

1. **Phase execution** per the phase plan — code + docs; LOC caps enforced
2. **End-of-phase** — `08-master-checklist.md` ticks + `STATE.md` row update + `phase-N/session-log.md` results table + `phase-N/retrospective.md` (keep / drop / reframe)
3. **Review with fixes** — post-seal review pass; address must-fix items in `fix-pass-N` commits before next phase opens
4. **Preflight for next phase** — scaffold `phase-(N+1)/preflight/00-summary.md` + `checklist.md` + `MEMORY.md` immediately at seal so next agent inherits a non-empty workspace

**Optional EXTRA for major phases (composite-impacting or capstone-relevant):**

5. **Deep-dive brutal review** — 4 parallel reviewer perspectives (UX / Functionality / Security / Architecture) writing a single chunked report at ≤600 LOC per file; recursive ≤3 passes; each pass identifies blockers → fix → re-review until clean
6. **Persona re-score** — Grandma / Framer / Capstone-or-Lars scored against the rubric; record in `phase-N/personas.md`

Steps 1-4 are non-negotiable. Steps 5-6 are decided per-phase by the owner.

## 3. Effort estimation rule

Per CLAUDE.md §"Effort Estimation Rule" (post-P19 reality check):

- **Target multi-hour shifts, NOT multi-day shifts.** Velocity through P19: ~6 phases/day average. Original phase budgets (4-6 days each) were **10-50× conservative**.
- Phase plans should carry both the original estimate AND a velocity-corrected estimate ("@vel"). See `plans/implementation/mvp-plan/STATE.md` §2.
- Re-budget at the end of each phase based on actual elapsed time.
- **Quality discipline is the brake — do NOT compress to hit velocity. Velocity emerges when discipline holds.**
- Default sprint sizing at velocity: 3-phase sprint ≈ 1 working day; 5-phase sprint ≈ 1-2 working days.

Concrete examples: P107 estimated 4-6h, actual ~2h. P108 / TEST-RUNTIME-SHIFT: 87 net-new test runs in 1 wave / 3 disjoint agents + closer. P102+P103 combined seal: 6 parallel agents / 2 waves / ~1,320+ tests cumulative anchor / 4hr wall clock.

## 4. The disjoint-scope parallel pattern

Codified at AGENT_ATOM Σ-contract per ADR-120 Γ R3 + Ε V1 (the disjoint-ownedFiles invariant). The pattern existed as convention since P74; promoted to atom-contract guarantee at P94.

**Wave 1**: 3-7 parallel agents with disjoint owned-files (zero file-level overlap). Each agent receives Σ-contract scope + DoD checklist.
**Wave 2 (sequential)**: closer agent writes ADR + tests + EOP triplet + CLAUDE.md sync. Closer touches only ADR + EOP + sync surfaces, never agent outputs.

**Result**: zero merge conflicts across hundreds of agent dispatches.

Specific examples:
- **P102 / OC-POLISH-W5** — 4 parallel agents (token migration / Agentics live-wire / status palette / migration comments) + closer (ADR-132)
- **P107 / LOG-INTEGRITY-EXPANSION** — 2 parallel agents (event_type wires / writeErrorEvent helper) + closer (ADR-135)
- **P108 / TEST-RUNTIME-SHIFT** — 3 parallel agents (p76 trim / mobile projects / behavioral coverage) + closer (ADR-136)
- **P109 / ADR-LEDGER-TRUTH-UP** — 2 parallel agents (README rebuild / drift-guard) + closer (ADR-137)
- **DEEP-AUDIT 2026-05-04** — 5 parallel tracks (architecture / pipeline / persistence / tests / UI) + master checklist aggregator (`plans/strategic-reviews/2026-05-04-gaps-to-done/06-master-checklist.md`)

## 5. ADR-driven discipline

- Every architectural decision gets an ADR in `docs/adr/ADR-{id}-{slug}.md`
- ≤120 LOC cap per ADR (small-ADR cadence sustained signal-richness across the seal-arc — P104/P105/P107/P108 all hit 2-3 decisions / ≤120 LOC)
- Status header: `Accepted` | `Proposed` | `SUPERSEDED`
- Cross-refs cite predecessors AND supersessions in both directions

**Supersession examples (greppable + traceable):**
- ADR-076 (Sprint J 3-tab nav, P53) SUPERSEDED by ADR-090 (Mobile UX Redesign, P69)
- ADR-057 (Sprint C P3 SELECTION_ATOM 2-step pipeline, P28) SUPERSEDED by ADR-098 (Template Intelligence Architecture, P72) and finally by ADR-134 (Dead-Code Purge, P106)

**ADR README rebuilt at every drift-discovery** — lesson from P109 / ADR-137: `docs/adr/README.md` was 89 ADRs stale across 60+ phases (last touched 2026-04-27 at ADR-048 while disk had 127 through ADR-137). Future builds should CI-enforce README-vs-disk count diff at every seal.

## 6. AISP Crystal Atom contracts

Per ADR-118 / ADR-119 / ADR-120; AISP v5.1 (see `plans/initial-plans/00.aisp-reference.md`). AISP is math-first neural-symbolic with 512 native LLM symbols and near-zero ambiguity. Hey Bradley shipped 8 atoms: PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT.

Each atom carries 4 blocks:
- **Σ (Structure)** — typed shape; concrete fields; no TBD allowed
- **Γ (Grounding)** — constraints / rules / invariants
- **Λ (Logistics)** — thresholds / fallbacks / timeouts
- **Ε (Evaluation)** — verifications / acceptance gates

**Hard gates:**
- Production: `Ambig < 0.02` (LOWER is better)
- Phase-3 acceptable: `Ambig ≤ 0.05`
- Tier ladder: Platinum ≥0.75 / Gold ≥0.60 / Silver ≥0.40 / Bronze ≥0.20 / Reject <0.20

**Production-import rule** (from P100 W2 / FMT-VERIFY retrospective): every Crystal Atom helper export ships with a grep-trace verifying ≥1 import site exists in `chatPipeline.ts` or equivalent dispatch surface. Soft existence is not enough — closed at P107 when 4 of 5 unwired event_types finally got production writers.

## 7. EOP triplet pattern

Per phase folder root (canonical 3-file shape after P109 / SCAFFOLDING-CLEANUP at `314856a`):
- `preflight.md` (or `preflight/` subfolder with `00-summary.md` + `checklist.md` + `MEMORY.md`)
- `session-log.md` (concise event timeline)
- `retrospective.md` (keep / drop / reframe)

Other artifacts → `archive/<original-relative-path>/` (preserves history; zero file loss; 692 → 692; 383/383 changes detected as renames at scaffolding cleanup).

**109 phase folders** all preserve the original artifacts under `archive/` after normalization. Future-team review of any phase has a stable path.

## 8. Brutal-honest review rubric (per ADR-094)

4 reviewer perspectives in chunked format (≤600 LOC per chunk):
- **R1: UX-Design** — first-impression score / friction points / a11y
- **R2: Functionality** — does it actually work end-to-end / edge cases
- **R3: Security-BYOK** — key shape leaks / trust boundary integrity / `redactKeyShapes` coverage
- **R4: Architecture-KISS** — no-new-deps / LOC discipline / dependency inversion

**Verdicts**: PASS / PARTIAL / FAIL · 3-5 specific findings · severity P1/P2/P3

Pattern repeated at: P38 Sprint F SEAL `3049b05` · P53 Sprint J SEAL `644200a` · P101 Agentic Workbench RC `c4f3987` · P102 Final QA · DEEP-AUDIT 2026-05-04 (5-track expansion).

## 9. Comprehensive logging discipline (per ADR-126)

**Two-table architecture:**
- `log_events` — 15-value CHECK enum; **100% coverage post-P107** (was 10/15 = 66.7% pre-P107; A5+A6 wired the 5 unwired types)
- `edit_history` — 3-level ID hierarchy: `session_id → request_id → event_id`

**BYOK trust boundary at every write site (per ADR-043 + ADR-114 D3):**
- `redactKeyShapes` for `sk-*` / `AIza*` / `Bearer *` patterns at every write boundary
- `writeErrorEvent` helper (P107 / `comprehensiveLogs.ts:+39 LOC`) centralizes error capture; redacts BOTH `message` AND `stack`
- Fire-and-forget contract per ADR-126 D4 — `persist().catch()` swallows; never throws upward
- **Zero key-shape leaks** in 98 log fixture rows across 4 test scenarios (P107.4 + P89.6 grep tests for `api_key|apikey|byok_key` in source)

**Pattern**: every helper export must have ≥1 production import site; soft existence is not enough.

## 10. Schema-first runtime guards

P104 / SCHEMA-GUARDS introduced the validators; P105 actually wired them at production call sites:

- **`validateEventType`** in `comprehensiveLogs.ts` — catches `patch_applied` → `patch_validation` aliases at write boundary; drops invalid rows (returns early, never throws); preserves ADR-126 D4 fire-and-forget contract
- **`validateSectionType`** in `src/lib/schemas/section.ts` — catches `article`/`long-form`→`text`, `testimonial`/`pull-quote`→`quotes`, `nav`→`menu`, `cta`→`action`, `faq`→`questions`, `stats`→`numbers` at JSON-load boundary
- **Drift regression guard** (P109 / `tests/p109-section-enum-drift-guard.spec.ts` 211 LOC / 13 cases / 7 describes) — 5 sources of section-type truth verified canonical 18 at every CI run; adding a 19th type now requires touching 5 source files + the test in lock-step

## 11. Cross-track convergence pattern

Lesson from DEEP-AUDIT 2026-05-04 (`plans/strategic-reviews/2026-05-04-gaps-to-done/00-index.md`):

- Same root cause flagged by ≥2 tracks → merge into single line item
- 77 raw findings → ~50 deduplicated items (5 cross-track convergences)
- Each finding cites source-track ID (A6+B1, A7+C1, B7+D1, etc.)

**5 specific convergences captured**:
1. `validateSectionType` is dead — A6 + B1 (BOTH say zero callers; P104 closure-claim was OPTIMISTIC)
2. 5 event_types declared but never emitted — A7 + C1 (`multi_page_scope` / `error_event` / `todo_execution` / `decomp_split` / `export_emit`)
3. `cleanTranscript` only emitted, not piped — B7 + D1 (logged but not threaded through classifier/decomposer/matcher/runLLMPipeline)
4. PATCH_ATOM section-type 3-way drift — A2 + A11 + Track D (PATCH_ATOM 16 / sectionTypeSchema 18 / ALLOWED_TARGET_TYPES 23)
5. Pure-unit `existsSync` soft-pass culture — D13 + implicit (1,038 calls; ~600 are post-seal soft-pass guards)

**Convergences are highest-confidence findings** because they were independently surfaced by ≥2 readers from different perspectives. Pattern saves roughly one full audit-cycle of triage work.

## 12. Anti-patterns documented (with examples)

### 12.1 Optimistic seal claims
- `validateSectionType` declared "wired" at P104 but had **0 production callers** until P105 / A4
- ADR-127 declared `cleanTranscript` "wired" but was logging-only until P105 / A3 threaded `effectiveText` through 14 consumers
- **Fix**: future "carry-forward CLOSED" claims must hard-test ≥1 production import + invocation (codified in P105.4 + P105.5)

### 12.2 Self-inflicted regressions on path moves
- P109 / SCAFFOLDING-CLEANUP at `314856a` moved 338 files into `archive/` to normalize 109 phase folders to canonical 3-file shape; broke ~20 EOP-triplet `existsSync` checks
- **Fix**: path moves atomically migrate test references in same commit (staleness fix-pass at `30c8c11` was avoidable)

### 12.3 Audit grep precision
- D7 false positive at P108: `^\s*test\(` regex missed `const it = test;` aliasing in `tests/p76-spec-export-quality.spec.ts` (file actually had 24 cases)
- 6 P1 Track D items reduced to 5 P1 + 1 audit-error
- **Fix**: future audits grep for `test(` AND `it(` AND `const\s+it\s*=\s*test` aliasing markers; test the audit-grep itself before declaring findings P1

### 12.4 ADR README drift
- 89-ADR window of stale docs; took P109 to catch (60+ phases dormant; README last touched 2026-04-27 at ADR-048)
- **Fix**: CI-enforce README-vs-disk diff at every seal — the section-enum drift guard pattern from P109 / A13 is the template

### 12.5 Soft-pass `existsSync` over-reliance
- 1,038 `existsSync` calls across 131 specs; ~85% of post-P75 specs are FS-read regex matchers, not behavioral
- Only 26 of 131 specs ever call `page.goto`
- Only 3 specs use `@/` path-alias imports — the test corpus barely loads source modules
- **Fix**: test-runtime-shift culture (P108 was correction; make it default — require ≥1 `page.goto` behavioral assertion per spec from day 1)

### 12.6 Vite-only `import.meta.glob` transitive trap
- `validateEventType` couldn't be imported into raw Playwright/Node test because `db.ts` transitively pulls `migrations/index.ts` with `import.meta.glob`
- P108 / A10 worked around via `node:vm runInNewContext` sandbox — preserves "import + invoke" rule but it's a smell
- **Fix**: helpers intended for runtime invocation in BOTH browser AND test contexts should be file-system-readable from start (no `import.meta.glob` transitive)

### 12.7 Connections-layer ESM publish-blocker
- `tsconfig.json` `module: ESNext` + `moduleResolution: bundler` works for build (tsc strict GREEN) but fails at Node ESM runtime when loading the standalone MCP server because compiled imports lack `.js` extensions
- Recorded as **G1 publish-blocker** in `connections/docs/05-verification.md` Gate 5 (diagnosed at P5-verify; commit `024e3cc`)
- **Fix**: `moduleResolution: NodeNext` from the start, OR a post-build extension rewrite step. Add NodeNext template to project scaffolding.

## 13. Anti-patterns NOT documented in Hey Bradley but worth flagging

Items that never came up because the discipline prevented them — speculation only:

- **Untyped agent dispatch** — we always typed via Σ/Γ contracts; agents had concrete DoD checklists
- **Lack of ownership boundaries** — we enforced disjoint `ownedFiles` from P74 onward; promoted to ADR-120 contract at P94
- **Implicit context** — we always cited file:line; deep-audit + ADRs both cite source paths
- **Goalpost-moving on persona scores** — P101 → P102 arc (84/84/85 → 86/86/88) named floor breaches and fixed underlying surfaces (token migration + Agentics live-wire) rather than relaxing the rubric

## 14. Re-use checklist for future projects

Copy from this methodology into a new build:

1. CLAUDE.md with Project Status section as canonical state record (rebuilt at every seal)
2. EOP triplet pattern (preflight + session-log + retrospective) per phase folder
3. ADR ledger with ≤120 LOC cap, supersession tracking, README-vs-disk drift guard test
4. AISP Crystal Atom contracts (Σ/Γ/Λ/Ε) for every architectural primitive
5. Disjoint-scope wave dispatch with closer pattern (Wave 1 parallel + Wave 2 closer)
6. Multi-hour shift cadence with @vel re-budget at each seal
7. Brutal-honest 4-reviewer review (UX / Functionality / Security / Architecture) at major phases
8. Persona scoring with named floors and explicit floor-breach admissions (don't paper)
9. Two-table SQLite logging (events + edit_history) with BYOK redaction at every write site
10. Schema-first runtime guards with alias maps for taxonomy taught by user data
11. Cross-track convergence merge pattern in audits (collapse same-root-cause findings)
12. Behavioral test discipline — ≥1 `page.goto` or module invocation per spec from day 1
13. ADR README CI-enforcement (`tests/adr-readme-vs-disk.spec.ts` template)
14. NodeNext tsconfig + path-move atomic test migration as default scaffolding
15. Closer pattern (ADR + tests + EOP + sync, ~30-45 min) reliably ~1 hour at codebase scale; produces most-trusted artifacts

## 15. Verdict

The swarm-driven discipline was worth it. **What mattered**: ADR-driven supersession chains (so we know what got replaced and why), brutal-honest reviews (so the next phase knows what's broken), disjoint-scope parallel dispatch (so 4-agent waves merge without conflicts), and the multi-hour-shift cadence (so quality discipline never compresses to hit velocity). **The recommended pattern for similar future builds**: keep the discipline, fix the test culture (runtime invocation > regex grep), and CI-enforce documentation invariants from day one rather than catching them at phase 109. The methodology is replicable; the sealed pattern produces owner-runnable open-core software at multi-hour velocity.
