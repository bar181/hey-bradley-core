# P100 / A2 — Milestone Plan through v2.0.0-RC1

> **Phase:** P100 · **Sprint:** LOG-SYS-DESIGN Wave 1 · **Agent:** A2 (milestone planner)
> **Date:** 2026-05-02
> **Scope:** Forward-looking phase plan P94 → P104 covering the Agentic Workbench arc closure + v2.0.0-RC1 launch.
> **Sibling:** A1 (pipeline audit + log design at `plans/implementation/phase-100/log-design.md`) — disjoint scope.
> **READ-ONLY:** This is a planning artifact. No source / test / ADR / CLAUDE.md edits.

## §1 Methodology

- **Source data:** `plans/implementation/mvp-plan/STATE.md` (P56-P69 phase status table + velocity history) · `CLAUDE.md` lines 102-157 (Phase Roadmap table; Phase Status §; Open-Core Moat Priorities; Tier-2 deferral list) · `plans/implementation/phase-94/preflight/00-summary.md` (only on-disk preflight beyond P100). P95-P104 not yet drafted on disk — extrapolated from the session-top roadmap and Agentic Workbench arc context (P90 → P100 → RC at P104).
- **Velocity assumption:** Per `CLAUDE.md` "Effort Estimation Rule" — multi-hour shifts not multi-day. Observed velocity through P19 → P93: ~6 phases/day at session pace. Per-phase typical wall-clock at session velocity = 30-90 min (atom + ADR + ≥15 tests + EOP triplet). Wave-gated phases (e.g., P94 has Wave 1 + Wave 2 sequential) = 1-2 hours. Fix-pass + EOP overhead ≈ 15 min/phase.
- **Critical-path method:** Forward dependency chain from P94 (in-flight) → P104 (RC public launch). Phases that block the next consumer (e.g., P95 SpecWorkbench cannot open without P94 AGENT_ATOM types exported) are on the critical path. Polish/branch phases (P97 TDD scaffold, P98 KISS reviewer, P99 Seal Panel) parallelizable since they touch disjoint UI surfaces. P100 Wave 2 (log infra) ships independently from UI critical path.

## §2 Per-phase plan P94 — P104

### P94 — AGENT_ATOM (8th + final Crystal Atom)
- **Status:** in-flight (parallel with this P100 Wave 1 sprint)
- **Delivers:** 8th Crystal Atom decomposing a wave into agent specs (role / ownedFiles / scope / DoD / inputs / outputs); caps the AISP atom suite. ADR-120 + `agentAtom.ts` + ≥15 tests.
- **Gates:** P92 + P93 sealed at `4ec0160` (PROCESS_ATOM + DDD_ATOM live); preflight `phase-94/preflight/00-summary.md` ratified.
- **Agent count:** 2 agents · Wave 1 parallel (A1 atom module; A2 not used) · Wave 2 closer (ADR-120 + tests + EOP). Per the on-disk preflight: 3 agents · 2 waves nominal (A1 module + A2 closer; sibling slot reserved).
- **Dependencies:** none beyond sealed P93 (PROCESS_ATOM types reused for `Wave` + `WaveContext`; DDD_ATOM `BoundedContext` used as input).
- **Parallel-with:** P100 Wave 1 (this sprint — file-disjoint by design).
- **Estimated wall-clock:** 60-90 min at session velocity.
- **Risk flags:** disjoint-ownedFiles invariant test must verify per-wave (Γ R2); rules-only baseline acceptable — live LLM dispatch deferred (mitigation: AgentProxy adapter scaffolded inert).

### P95 — SpecWorkbench (AISP + human-spec dual-view)
- **Status:** planned
- **Delivers:** Planning-mode tab that renders all 8 atoms as a single human-readable spec (left pane = AISP Σ/Ω/Γ; right pane = human prose). Wires PROCESS + DDD + AGENT outputs into one composite view. ADR-121.
- **Gates:** P94 sealed (AGENT_ATOM types must be importable).
- **Agent count:** 3 (A1 spec composer module · A2 SpecWorkbench React component · A3 closer ADR + tests + EOP).
- **Dependencies:** P94 AGENT_ATOM exports. P92 PROCESS_ATOM. P93 DDD_ATOM. ADR-110 dual-view standard.
- **Parallel-with:** P97 (TDD scaffold — different generator surface) and P100 Wave 2 (log infra — different stack).
- **Estimated wall-clock:** 60-90 min.
- **Risk flags:** SCOPE CREEP — easy to over-grow into "all 8 atoms in one UI". Mitigation: KISS rule — read-only render only, no editing, no live re-classify; atoms stay owned by their respective modules.

### P96 — Export Claude Code (CLAUDE.md + swarm + ADR bundle)
- **Status:** planned
- **Delivers:** "Export to Claude Code" button on SpecWorkbench → emits a zip with auto-generated CLAUDE.md (project intro + atoms summary), swarm dispatch JSON (one entry per AgentSpec from AGENT_ATOM), and stub ADR scaffold. Round-trippable into a target repo. ADR-122.
- **Gates:** P95 sealed (SpecWorkbench renders the bundle source).
- **Agent count:** 3 (A1 exporter module · A2 export modal UI · A3 closer ADR + ≥15 tests + EOP).
- **Dependencies:** P95 SpecWorkbench. ADR-101 spec export quality standard. Existing `shareSpecBundle.ts` patterns from P78 OC-11.
- **Parallel-with:** P98, P99 (different code paths).
- **Estimated wall-clock:** 60-90 min.
- **Risk flags:** ROUND-TRIP CORRECTNESS — exported CLAUDE.md must be Claude-Code-consumable. Mitigation: golden-file tests against `examples/3rd-party-consumer/` polyglot patterns from P83 ADR-108.

### P97 — TDD Scaffold Generator (test spec from AISP)
- **Status:** planned
- **Delivers:** From AISP Γ rules per atom, auto-emit Playwright test scaffold (one describe block per Γ rule). Owner runs scaffold against new code as TDD seed. ADR-123.
- **Gates:** P94 sealed (AGENT_ATOM DoD checklist drives test bullets).
- **Agent count:** 2 (A1 scaffold generator + ADR · A2 closer tests + EOP).
- **Dependencies:** P94 AGENT_ATOM. ADR-083 test library architecture.
- **Parallel-with:** P95, P96, P98, P99 — file-disjoint; only writes to `tests/scaffold/` namespace.
- **Estimated wall-clock:** 45-60 min (smaller surface).
- **Risk flags:** scaffold must NOT pollute existing test dir (mitigation: dedicated `tests/scaffold/` subtree; CI gates exclude it).

### P98 — KISS + Review Pattern (automated reviewer generator)
- **Status:** planned
- **Delivers:** Reviewer template generator — given an AGENT_ATOM AgentSpec, emit a brutal-honest review prompt scoped to its ownedFiles + DoD. Powers post-seal review pass per CLAUDE.md "Standard Phase Process" §3. ADR-124.
- **Gates:** P94 sealed.
- **Agent count:** 2 (A1 reviewer template module · A2 closer ADR + tests + EOP).
- **Dependencies:** P94 AGENT_ATOM. ADR-094 Professional Grade Standard. ADR-095 Library-Wide Polish Standard.
- **Parallel-with:** P95, P96, P97, P99.
- **Estimated wall-clock:** 45-60 min.
- **Risk flags:** prompt-injection drift if reviewer prompts widen unchecked (mitigation: ADR-110 dual-view + Σ contract scoping; reviewer output schema-validated).

### P99 — Seal Panel (DoD + session log + retro UI)
- **Status:** planned
- **Delivers:** Agentics-mode tab rendering CLAUDE.md "Standard Phase Process" steps 2-4 as a checklist UI. Owner ticks DoD items; auto-generates `phase-N/session-log.md` + `retrospective.md` stubs. ADR-125.
- **Gates:** P94 sealed (AGENT_ATOM DoD drives Seal Panel checklist).
- **Agent count:** 3 (A1 seal-panel React component · A2 markdown template emitter · A3 closer ADR + tests + EOP).
- **Dependencies:** P94 AGENT_ATOM. CLAUDE.md "Standard Phase Process". `08-master-checklist.md` patterns.
- **Parallel-with:** P95, P96, P97, P98 — disjoint UI surface.
- **Estimated wall-clock:** 60-90 min.
- **Risk flags:** template emitter must not overwrite existing session-log files (mitigation: existsSync guard before write; append-only mode).

### P100 — Log System Design + Build
- **Status:** Wave 1 in-flight (this sprint — A1 + A2 read-only docs); Wave 2 GATED on owner review.
- **Delivers:** Wave 1 = `log-design.md` + `milestone-plan.md` (this doc). Wave 2 = SQLite migrations + repos + pipeline wiring + ConversationLogTab drill-down + ADR-126.
- **Gates:** Wave 1 = no gate beyond P93 sealed. Wave 2 = owner ratification of A1 + A2 design docs.
- **Agent count:** Wave 1 = 2 (A1 audit · A2 plan). Wave 2 = 3 (A3 migrations/repos · A4 pipeline wiring + synthetic data · A5 closer ADR-126 + tests + EOP).
- **Dependencies:** Wave 2 needs A1 design ratified. ADR-018 chat pipeline. ADR-074 Conversation Log.
- **Parallel-with:** Wave 1 parallels P94. Wave 2 parallels ANY of P95-P99 (independent infra; touches `src/contexts/persistence/migrations` + `src/contexts/persistence/repositories` + ConversationLogTab — non-overlapping with SpecWorkbench/Export/TDD/Reviewer/Seal surfaces).
- **Estimated wall-clock:** Wave 1 = 30-45 min (this sprint). Wave 2 = 90-120 min (3 agents, migration + wiring overhead).
- **Risk flags:** SQLite migration risk on Wave 2 — adding tables to live kv-persisted store could break existing user state (mitigation: additive-only migration `004_log_*.sql`; idempotent upserts; no schema changes to existing tables).

### P101 — Agentic Workbench RC (full three-mode product sealed)
- **Status:** planned
- **Delivers:** Full system seal of Whiteboard + Planning + Agentics modes. ADR-116 boundaries verified. End-of-arc 4-reviewer brutal-honest review (UX / Functionality / Security / Architecture; ≤600 LOC per file; recursive ≤3 passes). ADR-127.
- **Gates:** P95-P99 + P100 Wave 2 ALL sealed.
- **Agent count:** 4 (one per reviewer perspective) + 1 closer = 5.
- **Dependencies:** Every prior P94-P100 phase sealed.
- **Parallel-with:** none — this is a synthesis phase; runs after all body sprints.
- **Estimated wall-clock:** 90-150 min (review depth + must-fix recursive passes).
- **Risk flags:** recursive must-fix passes can extend wall-clock unbounded (mitigation: ≤3 pass cap per CLAUDE.md "Standard Phase Process" §5; defer non-blockers to post-RC).

### P102 — Final QA + persona re-score
- **Status:** planned
- **Delivers:** Grandma / Framer / Capstone persona scoring against the rubric per CLAUDE.md "Optional EXTRA" §6. Composite ≥ ADR-094 floor. Records to `phase-102/personas.md`. ADR-128.
- **Gates:** P101 sealed.
- **Agent count:** 3 personas in parallel + 1 closer = 4.
- **Dependencies:** P101 RC seal.
- **Parallel-with:** none — gates RC release.
- **Estimated wall-clock:** 60-90 min.
- **Risk flags:** COMPOSITE REGRESSION — persona scores could drop below SOTA 80 if Agentic Workbench arc surfaces feel less polished than v1.0.0-RC1's whiteboard (mitigation: P101 fix-pass loop catches drift first; if persona < 80 → spawn P102b polish phase before P103).

### P103 — v2.0.0 release artifacts (CHANGELOG / release notes / Show HN / PH)
- **Status:** planned
- **Delivers:** CHANGELOG.md update (P85 → P104 history); release notes at `docs/launch/release-notes-v2.0.0-rc1.md`; Show HN post; Product Hunt tagline; demo video script update; owner launch checklist v2. Mirrors P84 / OC-18 pattern. ADR-129.
- **Gates:** P102 personas ≥ 80.
- **Agent count:** 3 (A1 release artifacts · A2 launch assets · A3 closer ADR-129 + tests + EOP).
- **Dependencies:** P102 sealed.
- **Parallel-with:** none — gates RC tag.
- **Estimated wall-clock:** 60-90 min.
- **Risk flags:** demo-video re-record overhead may slip schedule (mitigation: script-only this phase; record deferred to post-RC owner task per ADR-109 § 4 pattern).

### P104 — v2.0.0-RC1 public launch
- **Status:** planned (TERMINAL)
- **Delivers:** `v2.0.0-RC1` git tag; Show HN / PH / Reddit / LinkedIn / Twitter-X posts; Agentics Foundation beta dispatch (20-50 users); AISP community campaign (1-2 weeks). Owner-led, no Claude code edits.
- **Gates:** P103 sealed.
- **Agent count:** 0 source agents · 1 owner checklist runner.
- **Dependencies:** P103 release artifacts complete.
- **Parallel-with:** post-RC owner-only carry-forwards (BYOK smoke / live LLM eval / etc.) per ADR-109 § 4 pattern.
- **Estimated wall-clock:** 30-45 min Claude-side (final CLAUDE.md sync + retro). Owner-side post-launch days are out of band.
- **Risk flags:** LAUNCH READINESS — BYOK smoke + demo video + Show HN copy must all be ready (mitigation: P103 owner launch checklist mirrors `docs/launch/owner-launch-checklist.md` from P84; pre-flight gate before tag).

## §3 Critical path to v2.0.0-RC1

Linear dependency chain that BLOCKS the RC:

```
P94 → P95 → P96 → P101 → P102 → P103 → P104    (7 phases)
```

- P94 unlocks P95 (AGENT_ATOM types feed SpecWorkbench composer)
- P95 unlocks P96 (Export pipeline reads SpecWorkbench composite)
- P96 indirectly required for P101 (RC must demonstrate full export round-trip)
- P101 → P102 → P103 → P104 is mechanical seal-and-ship sequence; cannot skip

**Branch (parallelizable, do not block RC):**
- P97 (TDD scaffold) — can ship anytime after P94
- P98 (KISS reviewer) — can ship anytime after P94
- P99 (Seal Panel) — can ship anytime after P94
- P100 Wave 2 (log build) — can ship anytime after Wave 1 design ratified; independent infra

**Critical-path wall-clock at session velocity:**
- P94 (60-90 min) + P95 (60-90) + P96 (60-90) + P101 (90-150) + P102 (60-90) + P103 (60-90) + P104 (30-45) = **6-10 hours total** for the 7 critical phases.
- Add ~15 min EOP/fix-pass overhead per phase = +1.75 hours.
- **Critical-path total: 7.75-11.75 hours of session time.**

If P97 + P98 + P99 + P100/W2 ship in parallel batches alongside P95/P96 (file-disjoint), they add ZERO wall-clock to the critical path — they fold into the same calendar window.

## §4 Parallelism opportunities

Explicit pairs/triples/quads that can dispatch in the same session because they touch disjoint files:

- **Triple A (mid-arc parallel batch):** P95 SpecWorkbench (Planning mode tab) + P97 TDD Scaffold (`tests/scaffold/` only) + P100 Wave 2 (`src/contexts/persistence/` only) — three different surfaces, no overlap.
- **Triple B (post-P95 parallel batch):** P96 Export Claude Code (export modal + zip emitter) + P98 KISS Reviewer (reviewer template module) + P99 Seal Panel (Agentics mode tab + markdown emitter) — three different code areas.
- **Pair C (gates, sequential):** P101 RC seal must follow the parallel batches; P102 persona re-score must follow P101; P103 release artifacts must follow P102; P104 launch must follow P103. No parallelism in the seal sequence.
- **P100 Wave 2 with anything:** log infra is purely additive (new migration + new repo + drill-down panel inside ConversationLogTab). It can ship beside any of P95/P96/P97/P98/P99 without conflict.
- **Owner-only post-RC carry-forwards** (BYOK smoke / demo video record / Show HN posting) parallel with Claude-side any time — out-of-band per ADR-109 § 4.

## §5 Risk register (top 5)

### R1 — P95 SpecWorkbench scope creep
- **Risk:** "All 8 atoms in one UI" balloons into editing/re-classifying/multi-page-aware composer.
- **Severity:** HIGH (largest single phase; sets template for P96-P99).
- **Mitigation:** Explicit Σ contract — read-only render only; atoms stay owned by their modules; no re-classify trigger from SpecWorkbench. KISS denylist test on P95 source forbids any `classify*` import.
- **Trigger to escalate:** if A1 module exceeds 300 LOC or tries to import `classifyProcess`/`classifyContexts` directly → split into P95a + P95b.

### R2 — P96 Export Claude Code round-trip correctness
- **Risk:** Exported CLAUDE.md / swarm.json / ADR bundle is not Claude-Code-consumable; dev opens the zip and the bundle won't run.
- **Severity:** HIGH (this is the user-visible deliverable that justifies the Agentic Workbench arc).
- **Mitigation:** Golden-file tests in `tests/p96-export-roundtrip.spec.ts` validate against the polyglot reference patterns from P83 (`examples/3rd-party-consumer/`). Stub-load the exported bundle in a sandbox repo and verify a 5-line "hello world" agent dispatches.
- **Trigger to escalate:** any golden-file test fails after fix-pass round 2 → P96b sub-phase.

### R3 — P100 Wave 2 SQLite migration breaks existing kv-persisted store
- **Risk:** Adding `log_*` tables triggers a re-migration that wipes user state (sessions / projects / pages / personality choice / `appMode`).
- **Severity:** MEDIUM (open-core only — Tier-2 Supabase path unaffected per P89b boundary).
- **Mitigation:** Migration `004_log_*.sql` is ADDITIVE-ONLY — `CREATE TABLE IF NOT EXISTS`; no `ALTER TABLE` on existing tables; no `DROP`; idempotent upserts. Existing `kv` slot reads byte-equivalent across migrations. Test verifies pre-migration data round-trips post-migration.
- **Trigger to escalate:** any existing-state test fails after migration → freeze Wave 2; emergency revert; Tier-2 defer.

### R4 — P102 persona re-score regression below SOTA 80
- **Risk:** Capstone or Framer persona scores Agentic Workbench arc below v1.0.0-RC1 baseline (composite drops < 80).
- **Severity:** MEDIUM (delays RC tag; forces P102b polish phase).
- **Mitigation:** P101 4-reviewer brutal pass catches drift FIRST (UX reviewer is closest persona proxy). Pre-emptive polish wave woven into P95-P99 owner-decided cadence per ADR-094 + ADR-095. KISS denylist on every P95-P99 source prevents the kinds of feature-creep that historically depressed Grandma scores.
- **Trigger to escalate:** any persona < 78 → spawn P102b polish phase; defer P103 by one session-day.

### R5 — P104 launch readiness gap (BYOK smoke + demo video + Show HN)
- **Risk:** RC tag is ready but launch assets aren't (no recorded demo / Show HN copy untested / BYOK smoke not run with $0.01 budget).
- **Severity:** MEDIUM (delays public launch only — RC tag itself is unblocked).
- **Mitigation:** Owner-launch-checklist v2 produced in P103 mirrors `docs/launch/owner-launch-checklist.md` from P84. Post-RC owner-only tasks explicitly enumerated per ADR-109 § 4 pattern. Decouple RC tag from public launch (tag can ship; launch can wait days).
- **Trigger to escalate:** if owner reports launch slip > 1 week → revisit P103 to expand pre-launch automation (e.g., auto-gen Show HN draft from CHANGELOG).

## §6 Estimated total wall-clock

At observed session velocity (~6 phases/day at session pace; per CLAUDE.md velocity rule):

**Critical-path-only (P94 → P104):**
- 7 phases × 60-100 min = 7-12 hours session time
- + EOP/fix-pass overhead × 7 = 1.75 hours
- **Critical path total: 8.75-13.75 hours of Claude session time** (~1.5-2 working days at session pace).

**Full P94-P104 if all branches ship (parallel-batched):**
- Critical path = 8.75-13.75 hours (above)
- P97 + P98 + P99 + P100 Wave 2 fold into the same calendar window via parallel dispatch (file-disjoint). They add agent count but not wall-clock.
- **Worst-case total if branches dispatch sequentially instead: +3-4 hours = 12-18 hours** (~2-3 working days).

**Owner-side post-RC tasks (out-of-band, not counted above):**
- Demo video record: 30-60 min owner time
- Show HN post + monitoring: 1-2 days
- AISP community campaign: 1-2 weeks
- BYOK smoke ($0.01 budget): 15 min owner time

## §7 Carry-forward inventory (Tier-2 commercial — NOT v2.0.0 open-core)

Items explicitly deferred to commercial track per `plans/strategic-reviews/open-core-moat-roadmap.md` and CLAUDE.md "Deferred to Commercial (Tier-2)":

- **Hosted share URL runtime** (P89b boundary; ADR-114 + ADR-115 stay as Tier-2 planning docs)
- **HNSW vector DB activation** (ruvector index `default` + `patterns` show 0 vectors at P70 audit — manual snapshot only; auto-write hook on agent runs deferred)
- **Multi-tenant team workspaces + ACL** (Supabase 5-table schema scaffolded but not wired)
- **Native mobile apps** (iOS / Android) — open-core ships responsive web only
- **Live LLM eval harness** (post-RC owner task; current matrix is rules-deterministic + AgentProxy adapter only)
- **Pan/zoom on process map** (ADR-117 Tier-2 decision)
- **Drag-to-rearrange phase reordering / context positions** (ADR-117 / ADR-119 Tier-2)
- **ML-enriched atom classifiers via vector-DB lookup** (PROCESS / DDD / AGENT all rules-only at open-core baseline)
- **Multi-turn requirements accumulator** (across-turn state — DECOMP_ATOM family Tier-2)
- **Cross-project context federation** (DDD_ATOM Tier-2)
- **Sprint+wave+agent rendering as additional process-map graph levels** (data shape present; only phase-level rendered at open-core)
- **Real-time subscriptions + edge functions** (Tier-2 phase 2)
- **Runtime feature toggles** (Tier-2 phase 3)
- **Localization** (post-RC; English-only at open-core)
- **Full WCAG 2.1 AAA** (open-core ships AA + 44px touch-target floor per ADR-112)
- **Tier-2 SaaS-dashboard flagship + Agentic Support System** (original Sprint J — Sprint H/I deferred targets)

---

**Acceptance verification:**
- §1 (~10 LOC) · §2 (~140 LOC, 11 phase rows P94-P104) · §3 (~30 LOC) · §4 (~25 LOC) · §5 (~50 LOC, 5 risk items) · §6 (~25 LOC) · §7 (~25 LOC)
- All 7 sections present; ≥10 phase rows in §2 (11 actual); ≥5 risk items in §5 (5 actual); ≤400 LOC; READ-ONLY (zero source/test/ADR edits).
