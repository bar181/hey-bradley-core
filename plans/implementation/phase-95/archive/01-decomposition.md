# P95 / Planning Sprint A2 — Decomposition

> **Phase:** P95 · **Sprint:** Planning Wave 1 · **Agent:** A2 (decomposition)
> **Date:** 2026-05-02 · **READ-ONLY** doc artifact (no source / test / ADR / CLAUDE.md edits).
> **Owned file:** `plans/implementation/phase-95/01-decomposition.md`
> **Sibling chain:** A1 (sealed `00-understanding.md`) · A3 DDD+ADR · A4 Process+AISP+Swarm · A5 Closer.

Inputs consumed: `phase-95/00-understanding.md` (§§2-7), `phase-100/milestone-plan.md` (§§2-5), `phase-100/log-design.md` (§§2-9).

---

## §1 Methodology

- **Atomicity:** every task = one file or one strictly-scoped logical change. Cross-file refactors split into per-file tasks.
- **Citation:** every task names its target file path or path family + what it produces (file path, type, side effect).
- **Dependencies:** intra-phase via task-id; inter-phase via phase ledger from A1 §4.
- **Parallel marker:** `yes` = file-disjoint with sibling tasks in same phase; `no` = depends on prior task in same phase.
- **KISS column:** `keep` = strictly necessary for ADR acceptance criteria; `strike` = nice-to-have with no acceptance gate (see §6 for rationale).
- **BLOCKED phases (per A1 §6 owner questions):** P95 (Q1, Q6), P96 (Q2), P98 (Q3), P100/W2 (Q4, Q7), P101 (Q5) — high-level shape only; no atomic detail until owner resolves.
- **Conflict map:** §7 lists files multiple phases want to touch; A4 wave-gates them.

---

## §2 Phase-by-phase atomic task tables

### P94 — AGENT_ATOM (8th + final Crystal Atom)

**Status:** in-flight (A1 §2.A confirms module shipped; this row = velocity-confirmed reference, not a new dispatch).
**Owner-question gates:** Q6 (recipe depth) — does NOT block P94 itself; gates whether to insert a P94b before P95.

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P94-T1 | `src/contexts/intelligence/aisp/agentAtom.ts` | AGENT_ATOM module + `classifyAgents` + `buildAgentAtom` + `parseAgentResponse` | P93 sealed | n/a (sealed) | keep |
| P94-T2 | `docs/adr/ADR-120-agent-atom.md` | ADR-120 Accepted | P94-T1 | no | keep |
| P94-T3 | `tests/p94-agent-atom.spec.ts` | 7 describe blocks / 15 cases | P94-T1, P94-T2 | no | keep |
| P94-T4 | `plans/implementation/phase-94/{02-post-review,session-log,retrospective}.md` | EOP triplet | P94-T3 | no | keep |
| P94-T5 | `CLAUDE.md` | sync (status row + atoms count) | P94-T4 | no | keep |

### P94b — AGENT_ATOM recipe expansion (CONDITIONAL)

**Status:** BLOCKED — owner answer required on Q6 (only spawns if owner picks option B in A1 §6 Q6).
**Owner-question gates:** Q6.

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P94b-T1 | `src/contexts/intelligence/aisp/agentAtom.ts` (`ROLE_RECIPES` table at `:76`) | 6+ role recipes (was 1-2) | P94 sealed + Q6=B | no | keep (R4 mitigation) |
| P94b-T2 | `tests/p94b-agent-recipe.spec.ts` | recipe-coverage test | P94b-T1 | no | keep |
| P94b-T3 | EOP triplet | session-log + retro | P94b-T2 | no | keep |

### P95 — SpecWorkbench (AISP + human-spec dual-view)

**Status:** BLOCKED — owner answer required on Q1 (layout) and Q6 (recipe depth precondition).
**Owner-question gates:** Q1 (layout strategy A/B/C), Q6 (gates whether P94b precedes), implicit ADR-110 dual-view.

High-level task shape (atomic detail withheld until Q1 + Q6 resolve):

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P95-T1 | `src/contexts/intelligence/aisp/specComposer.ts` (NEW; ≤300 LOC) | pure composer: `(process, ddd, agent, intent, assumptions, selection, content, patch) → SpecBundle` | P94 (+ P94b if Q6=B) | yes (with P95-T2) | keep |
| P95-T2 | `src/components/spec/SpecWorkbench.tsx` (NEW; ≤300 LOC) | dual-view React component (left AISP / right human); responsive per Q1 | P95-T1 | yes (with P95-T1) | keep |
| P95-T3 | `src/components/spec/AtomCard.tsx` (NEW; ≤120 LOC) | per-atom collapsible card (Σ + 1-line summary + human prose) | P95-T2 | no | keep |
| P95-T4 | `src/pages/Planning.tsx` (EDIT; +1 tab + +1 conditional render branch) | "Spec" tab mounted in Planning mode | P95-T3 | no | keep |
| P95-T5 | `docs/adr/ADR-121-spec-workbench.md` | ADR-121 Accepted (cross-refs ADR-110/116/120) | P95-T2 | no | keep |
| P95-T6 | `tests/p95-spec-workbench.spec.ts` | ≥15 cases: render + KISS denylist (no `classify*` import) + responsive guard | P95-T3, P95-T5 | no | keep |
| P95-T7 | atom search box | per-atom search input | — | — | **strike** (see §6) |
| P95-T8 | EOP triplet | `phase-95/{02-post-review, session-log, retrospective}.md` + CLAUDE.md sync | P95-T6 | no | keep |

### P96 — Export Claude Code (CLAUDE.md + swarm + ADR bundle)

**Status:** BLOCKED — owner answer required on Q2 (export target A/B/C).
**Owner-question gates:** Q2 (ZIP/in-page/filesystem).

High-level task shape:

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P96-T1 | `src/contexts/intelligence/export/claudeCodeBundle.ts` (NEW; ≤250 LOC) | bundler: `(SpecBundle) → { 'CLAUDE.md', 'swarm.json', 'docs/adr/ADR-XXX-stub.md', 'README.md' }` | P95 sealed | yes (with P96-T2) | keep |
| P96-T2 | `src/contexts/intelligence/export/zipBuilder.ts` (NEW; ≤120 LOC) | Blob ZIP emitter (mirrors `shareSpecBundle.ts` P78 pattern) | P96-T1 | yes (with P96-T1) | keep — only if Q2=A |
| P96-T3 | `src/components/spec/ExportClaudeCodeButton.tsx` (NEW; ≤80 LOC) | button on SpecWorkbench → triggers bundler + Blob download | P96-T1, P96-T2 | no | keep |
| P96-T4 | `examples/3rd-party-consumer/golden-bundle/` (NEW directory) | golden-file fixture (canonical bundle output) | P96-T1 | no | keep |
| P96-T5 | `docs/adr/ADR-122-export-claude-code.md` | ADR-122 Accepted (cross-refs ADR-101/108/120) | P96-T3 | no | keep |
| P96-T6 | `tests/p96-export-roundtrip.spec.ts` | ≥15 cases: golden-file equality + 5-line "hello world" agent dispatch + bundle-shape schema | P96-T4, P96-T5 | no | keep (R2 mitigation) |
| P96-T7 | `src/pages/Planning.tsx` (EDIT; mount export button on SpecWorkbench tab) | UI wire | P96-T3 | no | keep |
| P96-T8 | bundle-versioning UI panel | versioned-filename selector | — | — | **strike** (see §6) |
| P96-T9 | in-page render of bundle (Q2=B branch) | copy-buttons per file | P96-T1 + Q2=B | yes (with P96-T2) | conditional — only if Q2≠A |
| P96-T10 | EOP triplet + CLAUDE.md sync | `phase-96/*` | P96-T7 | no | keep |

### P97 — TDD Scaffold Generator (test spec from AISP)

**Status:** ready (no blocking owner question; ADR-083 test library architecture already exists).
**Owner-question gates:** none.

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P97-T1 | `src/contexts/intelligence/scaffold/tddScaffold.ts` (NEW; ≤200 LOC) | pure: `(AgentSpec | Atom) → string` (Playwright `describe`/`it` source per Γ rule + DoD bullet) | P94 sealed | yes (with P97-T2) | keep |
| P97-T2 | `src/contexts/intelligence/scaffold/scaffoldWriter.ts` (NEW; ≤80 LOC) | filesystem helper writing to `tests/scaffold/<atom>.spec.ts` (existsSync guard — no overwrite) | P97-T1 | yes (with P97-T1) | keep |
| P97-T3 | `tests/scaffold/.gitkeep` + `tests/scaffold/README.md` | namespace anchor + CI-exclude doc | P97-T2 | yes | keep |
| P97-T4 | `vitest.config.ts` or test-runner gate | exclude pattern `tests/scaffold/**` | P97-T3 | no | keep |
| P97-T5 | `docs/adr/ADR-123-tdd-scaffold.md` | ADR-123 Accepted (cross-refs ADR-083/120) | P97-T2 | no | keep |
| P97-T6 | `tests/p97-tdd-scaffold.spec.ts` | ≥10 cases: scaffold shape per atom + namespace isolation + existsSync guard | P97-T5 | no | keep |
| P97-T7 | scaffold visual preview UI | render scaffold in browser | — | — | **strike** (see §6) |
| P97-T8 | EOP triplet + CLAUDE.md sync | `phase-97/*` | P97-T6 | no | keep |

### P98 — KISS + Review Pattern (automated reviewer generator)

**Status:** BLOCKED — owner answer required on Q3 (findings render surface A/B/C).
**Owner-question gates:** Q3 (chat / Agentics tab / reviewer persona).

High-level task shape:

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P98-T1 | `src/contexts/intelligence/review/reviewerPrompt.ts` (NEW; ≤180 LOC) | pure: `(AgentSpec) → ReviewerPrompt {systemPrompt, scope, schema}` | P94 sealed | no | keep |
| P98-T2 | `src/contexts/intelligence/review/reviewerSchema.ts` (NEW; ≤60 LOC) | Zod schema for findings (`{severity, file, line?, why, fix}[]`) | P98-T1 | yes (with P98-T1) | keep |
| P98-T3 | review-findings render surface (Q3-dependent) | conditional component | P98-T1 + Q3 | no | keep |
| P98-T4 | `docs/adr/ADR-124-kiss-reviewer.md` | ADR-124 Accepted (cross-refs ADR-094/095/110/120) | P98-T2 | no | keep |
| P98-T5 | `tests/p98-kiss-reviewer.spec.ts` | ≥12 cases: prompt shape + schema validate + scope guard (no path outside ownedFiles) | P98-T4 | no | keep (R2 prompt-injection mitigation) |
| P98-T6 | reviewer-history viewer with diff | inline diff between review passes | — | — | **strike** (see §6) |
| P98-T7 | EOP triplet + CLAUDE.md sync | `phase-98/*` | P98-T5 | no | keep |

### P99 — Seal Panel (DoD + session log + retro UI)

**Status:** ready (CLAUDE.md "Standard Phase Process" + AGENT_ATOM DoD already provide schema).
**Owner-question gates:** none (existsSync guard already covers safety; A1 §3 lists no Q on P99).

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P99-T1 | `src/components/seal/SealPanel.tsx` (NEW; ≤250 LOC) | Agentics-mode tab; renders DoD checklist from `AgentSpec.dod`; "Generate session-log" button | P94 sealed | yes (with P99-T2) | keep |
| P99-T2 | `src/contexts/intelligence/seal/markdownEmitter.ts` (NEW; ≤180 LOC) | pure: `(SealState) → { 'session-log.md': string, 'retrospective.md': string }` | P94 sealed | yes (with P99-T1) | keep |
| P99-T3 | `src/contexts/intelligence/seal/fileWriter.ts` (NEW; ≤80 LOC) | filesystem write helper with existsSync guard (append-only — never overwrites) | P99-T2 | no | keep |
| P99-T4 | `src/pages/Agentics.tsx` (EDIT; mount Seal Panel as new tab; retire "Coming soon · P92-P100" badge at `:19`) | wire + stale-copy fix from A1 §7 | P99-T1 | no | keep |
| P99-T5 | `docs/adr/ADR-125-seal-panel.md` | ADR-125 Accepted (cross-refs ADR-116/120; CLAUDE.md "Standard Phase Process" §2-4) | P99-T3 | no | keep |
| P99-T6 | `tests/p99-seal-panel.spec.ts` | ≥12 cases: DoD render + markdown shape + existsSync no-overwrite guard | P99-T5 | no | keep |
| P99-T7 | drag-to-reorder DoD items | UX nicety | — | — | **strike** (see §6) |
| P99-T8 | EOP triplet + CLAUDE.md sync | `phase-99/*` | P99-T6 | no | keep |

### P100 Wave 2 — Log build (SQLite migrations + repos + pipeline wiring + drill-down)

**Status:** BLOCKED — owner answer required on Q4 (migration plan A/B/C) and Q7 (compute-all-5 personality).
**Owner-question gates:** Q4 (auto / opt-in / env-flag), Q7 (compute-all / once / on-demand).

High-level task shape:

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P100W2-T1 | `src/contexts/persistence/migrations/005-request-envelopes.sql` | additive `CREATE TABLE IF NOT EXISTS request_envelopes` (+ page_id/page_index columns absorbing category 8) | P100/W1 ratified | yes (T1-T5 file-disjoint) | keep |
| P100W2-T2 | `migrations/006-stage-events.sql` | `CREATE TABLE IF NOT EXISTS stage_events` (categories 2+4+5+11) | P100/W1 ratified | yes | keep |
| P100W2-T3 | `migrations/007-decomp-traces.sql` | parent + child tables (category 3) | P100/W1 ratified | yes | keep |
| P100W2-T4 | `migrations/008-listen-captures.sql` | `listen_captures` table (category 7; raw + cleaned) | P100/W1 ratified | yes | keep |
| P100W2-T5 | `migrations/009-atom-outputs.sql` | `atom_outputs` table (categories 9+10; PROCESS + DDD + future) | P100/W1 ratified | yes | keep |
| P100W2-T6 | `src/contexts/persistence/repositories/requestEnvelopes.ts` | repo CRUD + FK to sessions | P100W2-T1 | yes (T6-T10) | keep |
| P100W2-T7 | `src/contexts/persistence/repositories/stageEvents.ts` | repo CRUD | P100W2-T2 | yes | keep |
| P100W2-T8 | `src/contexts/persistence/repositories/decompTraces.ts` | repo CRUD parent + child | P100W2-T3 | yes | keep |
| P100W2-T9 | `src/contexts/persistence/repositories/listenCaptures.ts` | repo CRUD | P100W2-T4 | yes | keep |
| P100W2-T10 | `src/contexts/persistence/repositories/atomOutputs.ts` | repo CRUD + hydrate-most-recent helper | P100W2-T5 | yes | keep |
| P100W2-T11 | `src/contexts/intelligence/chatPipeline.ts` (EDIT) | hoist `request_id` mint to `:271` (R8 mitigation per A1 §5); thread through stage emits | P100W2-T6, T7 | no | keep |
| P100W2-T12 | `src/components/planning/PlanningChatBar.tsx` (EDIT) | persist PROCESS_ATOM + DDD_ATOM via `atomOutputs.create` | P100W2-T10 | no | keep |
| P100W2-T13 | `src/pages/Planning.tsx` (EDIT) | hydrate `liveMap`/`liveDomainModel` from latest atomOutputs row on mount | P100W2-T12 | no | keep |
| P100W2-T14 | `src/components/center-canvas/ConversationLogTab.tsx` (EDIT) | drill-down per request_id rendering 11 categories | P100W2-T6 through T10 | no | keep |
| P100W2-T15 | `docs/adr/ADR-126-log-system.md` | ADR-126 Accepted (cross-refs ADR-018/074/110) | P100W2-T14 | no | keep |
| P100W2-T16 | `tests/p100w2-log-system.spec.ts` | ≥20 cases: round-trip on existing kv (R3 mitigation) + per-stage emit + drill-down render + additive-only assertion | P100W2-T15 | no | keep |
| P100W2-T17 | personality compute-all-5 (Q7=A) | 5 variants per request | P100W2-T11 + Q7 | conditional | conditional |
| P100W2-T18 | EOP triplet + CLAUDE.md sync | `phase-100/wave-2/*` | P100W2-T16 | no | keep |

### P101 — Agentic Workbench RC (full three-mode product seal)

**Status:** BLOCKED — owner answer required on Q5 (RC rollout strategy A/B/C).
**Owner-question gates:** Q5 (all-on / VITE flag / Settings hide).

High-level task shape:

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P101-T1 | `plans/implementation/phase-101/reviews/ux-review.md` | UX persona reviewer pass | P95-P100 sealed | yes (T1-T4) | keep |
| P101-T2 | `plans/implementation/phase-101/reviews/functionality-review.md` | functionality reviewer pass | P95-P100 sealed | yes | keep |
| P101-T3 | `plans/implementation/phase-101/reviews/security-review.md` | security reviewer pass | P95-P100 sealed | yes | keep |
| P101-T4 | `plans/implementation/phase-101/reviews/architecture-review.md` | architecture reviewer pass | P95-P100 sealed | yes | keep |
| P101-T5 | fix-pass commits (recursive ≤3 cycles) | must-fix items resolved | T1-T4 | no | keep |
| P101-T6 | feature-flag plumbing (Q5=B/C only) | conditional VITE_AGENTIC_WORKBENCH gate | T5 + Q5 | no | conditional — strike if Q5=A |
| P101-T7 | `docs/adr/ADR-127-agentic-workbench-rc.md` | ADR-127 Accepted (cross-refs ADR-094/116) | P101-T5 | no | keep |
| P101-T8 | `tests/p101-rc-seal.spec.ts` | ≥15 cases: composite-score guard + RC manifest + must-fix resolved | P101-T7 | no | keep |
| P101-T9 | EOP triplet + CLAUDE.md sync | `phase-101/*` | P101-T8 | no | keep |

### P102 — Final QA + persona re-score

**Status:** ready (gates on P101 seal; rubric already exists per ADR-094).
**Owner-question gates:** none.

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P102-T1 | `plans/implementation/phase-102/personas/grandma.md` | Grandma persona scoring | P101 sealed | yes (T1-T3) | keep |
| P102-T2 | `plans/implementation/phase-102/personas/framer.md` | Framer persona scoring | P101 sealed | yes | keep |
| P102-T3 | `plans/implementation/phase-102/personas/capstone.md` | Capstone persona scoring | P101 sealed | yes | keep |
| P102-T4 | `plans/implementation/phase-102/personas.md` | composite scoring + ≥80 floor verify | P102-T1, T2, T3 | no | keep |
| P102-T5 | `docs/adr/ADR-128-final-qa.md` | ADR-128 Accepted (cross-refs ADR-094/127) | P102-T4 | no | keep |
| P102-T6 | `tests/p102-final-qa.spec.ts` | ≥8 cases: composite-floor guard + persona-doc shape | P102-T5 | no | keep |
| P102-T7 | (CONDITIONAL) P102b polish phase trigger | spawned only if any persona < 78 (R4 escalation) | T4 | no | keep — guard only |
| P102-T8 | EOP triplet + CLAUDE.md sync | `phase-102/*` | P102-T6 | no | keep |

### P103 — v2.0.0 release artifacts

**Status:** ready (mirrors P84 / OC-18 pattern).
**Owner-question gates:** none.

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P103-T1 | `CHANGELOG.md` (EDIT — append v2.0.0-RC1 section P85→P104) | release history | P102 sealed | yes (T1-T6) | keep |
| P103-T2 | `docs/launch/release-notes-v2.0.0-rc1.md` (NEW) | release notes | P102 sealed | yes | keep |
| P103-T3 | `docs/launch/show-hn-post-v2.md` (NEW; ≤120 LOC) | Show HN copy | P102 sealed | yes | keep |
| P103-T4 | `docs/launch/product-hunt-tagline-v2.md` (NEW; ≤40 LOC) | PH tagline | P102 sealed | yes | keep |
| P103-T5 | `docs/launch/demo-video-script-v2.md` (NEW; ≤180 LOC) | demo script update | P102 sealed | yes | keep |
| P103-T6 | `docs/launch/owner-launch-checklist-v2.md` (NEW; ≤80 LOC) | owner checklist (R5 mitigation) | P102 sealed | yes | keep |
| P103-T7 | `docs/adr/ADR-129-v2-release.md` | ADR-129 Accepted (cross-refs ADR-109/127/128) | T1-T6 | no | keep |
| P103-T8 | `tests/p103-release-artifacts.spec.ts` | ≥12 cases: existsSync per artifact + LOC-cap guards | P103-T7 | no | keep |
| P103-T9 | re-record demo video | actual recording | — | — | **strike** (per ADR-109 §4 — owner-only post-RC) |
| P103-T10 | EOP triplet + CLAUDE.md sync | `phase-103/*` | P103-T8 | no | keep |

### P104 — v2.0.0-RC1 public launch (TERMINAL)

**Status:** ready (Claude-side surface tiny; owner-led).
**Owner-question gates:** none.

| Task ID | File path | Produces | Depends on | Parallel? | KISS? |
|---|---|---|---|---|---|
| P104-T1 | `git tag v2.0.0-RC1` (owner-side) | release tag | P103 sealed | n/a | keep |
| P104-T2 | Show HN / PH / Reddit / LinkedIn / Twitter-X posts (owner-side) | public launch | P104-T1 | n/a | keep |
| P104-T3 | Agentics Foundation beta dispatch (owner-side; 20-50 users) | beta cohort | P104-T1 | n/a | keep |
| P104-T4 | AISP campaign (owner-side; 1-2 wks) | community engagement | P104-T1 | n/a | keep |
| P104-T5 | `CLAUDE.md` (EDIT — final v2.0.0-RC1 sync row) | status row | P104-T1 | no | keep |
| P104-T6 | `plans/implementation/phase-104/retrospective.md` | arc-close retro | P104-T5 | no | keep |
| P104-T7 | promo automation (auto-cross-post bot) | nice-to-have | — | — | **strike** (see §6) |

---

## §3 Cross-phase dependency graph

```
P94 ──┬─→ P95 ──→ P96 ──┐
      │                  │
      │                  ├─→ P101 ──→ P102 ──→ P103 ──→ P104
      │                  │
      ├─→ P97 ───────────┤
      ├─→ P98 ───────────┤
      ├─→ P99 ───────────┤
      │
      └─→ (P94b CONDITIONAL → P95)

P100 W1 (this sprint) ─→ P100 W2 ────────→ P101
                         (parallel batchable with P95-P99)
```

**Edge labels (dependency reasons):**

- P94 → P95: AGENT_ATOM types (`AgentSpec`, `AgentAtomOutput`) imported by SpecWorkbench composer
- P94 → P94b: same module — recipe table widening (R4 mitigation)
- P94b → P95: only if Q6=B; ensures composer renders depth
- P95 → P96: Export reads SpecWorkbench composite (`SpecBundle`)
- P95 → P101: Planning-mode dual-view feeds RC composite
- P94 → P97: DoD checklist drives test bullets
- P94 → P98: AgentSpec is reviewer scoping unit
- P94 → P99: AgentSpec.dod drives Seal Panel rows
- P100 W1 → P100 W2: design ratification gate
- P100 W2 → P101: log infra surfaces in RC drill-down
- P95-P100 W2 → P101: full body-arc closure
- P101 → P102: persona scoring follows seal
- P102 → P103: composite ≥80 floor unblocks release artifacts
- P103 → P104: release artifacts present unblocks tag

---

## §4 Parallel vs sequential bands

**Band 1 (parallel; dispatch in same session window — file-disjoint):**
- P95 SpecWorkbench (`src/components/spec/*`, `src/contexts/intelligence/aisp/specComposer.ts`) — gated on Q1+Q6
- P97 TDD Scaffold (`src/contexts/intelligence/scaffold/*`, `tests/scaffold/*`) — READY
- P100 W2 (`src/contexts/persistence/migrations/005-009*.sql` + `src/contexts/persistence/repositories/*`) — gated on Q4+Q7

Task IDs: P95-T1..T8, P97-T1..T8, P100W2-T1..T18.

Conflict resolution within Band 1: P100W2 touches `chatPipeline.ts` + `Planning.tsx`; P95 touches `Planning.tsx`. Wave-gate via §7 (P95 wave first; P100W2 follows on `Planning.tsx` only).

**Band 2 (parallel; dispatch after Band 1 — file-disjoint):**
- P96 Export Claude Code (`src/contexts/intelligence/export/*`, `src/components/spec/ExportClaudeCodeButton.tsx`) — gated on Q2; depends on P95
- P98 KISS Reviewer (`src/contexts/intelligence/review/*`) — gated on Q3
- P99 Seal Panel (`src/components/seal/*`, `src/contexts/intelligence/seal/*`, `src/pages/Agentics.tsx`) — READY

Task IDs: P96-T1..T10, P98-T1..T7, P99-T1..T8.

Conflict resolution within Band 2: P96 touches `Planning.tsx`; P99 touches `Agentics.tsx`. Disjoint pages. P95 + P96 stack on `src/components/spec/*` so wave-gate Band 2's P96 after Band 1's P95 completes.

**Band 3 (strictly sequential — RC release sequence):**
- P101 RC seal (gates on Band 1 + Band 2 ALL sealed) — gated on Q5
- P102 persona re-score (gates on P101)
- P103 release artifacts (gates on P102 ≥80 floor)
- P104 public launch (gates on P103)

Task IDs: P101-T1..T9 → P102-T1..T8 → P103-T1..T10 → P104-T1..T7.

No parallelism in Band 3. Within P101, T1-T4 (4 reviewer perspectives) parallel; T5+ sequential. Within P102, T1-T3 (3 personas) parallel; T4+ sequential. Within P103, T1-T6 (6 artifacts) parallel; T7+ sequential.

---

## §5 AISP Crystal Atom system prompts

Format per AISP convention. 6 blocks (P95, P96, P97, P98, P99, P101). P100 W2 = log infra (no atom). P102-P104 = release process (no atom).

#### P95 SpecWorkbench

```
Σ := { surface: 'spec-workbench', view: 'aisp' | 'human' | 'dual',
       atoms: AtomTrace[], rendering: 'side-by-side' | 'tabs' }
Ω := { Render all 8 AISP atom traces alongside human-readable spec
       in dual-view; toggleable; mobile collapses to tabs }
Γ := { R1: must support all 8 atoms;
       R2: human spec ≤ 200 words per section;
       R3: AISP trace shows Σ symbol + 1-line summary;
       R4: zero `classify*` import (read-only — atoms owned by their modules) }
Λ := { dual-view default desktop; tabs mobile; per-atom toggle }
Ε := { V1: VERIFY all 8 atoms render without error,
       V2: VERIFY mobile single-pane fallback,
       V3: VERIFY KISS denylist (no classify* import in P95 src) }
```

NOTE: Q1 selects between Σ.rendering = 'side-by-side' (option A), 'tabs' (option B), or both responsive (option C — recommended). Block above assumes C.

#### P96 Export Claude Code

```
Σ := { bundle: { 'CLAUDE.md': string, 'swarm.json': string,
                 'docs/adr/ADR-XXX-stub.md': string, 'README.md': string },
       agents: AgentSpec[], output: 'zip' | 'in-page' | 'fs-write' }
Ω := { One-click export of SpecWorkbench composite into a Claude-Code-
       consumable bundle; round-trippable into a target repo }
Γ := { R1: bundle must dispatch a 5-line "hello world" agent without manual edit;
       R2: ADR stub carries cross-refs to source ADRs;
       R3: swarm.json one entry per AgentSpec from AGENT_ATOM;
       R4: CLAUDE.md auto-generated from spec composer output }
Λ := { ZIP via Blob (Q2=A); in-page copy buttons (Q2=B); fs write (Q2=C) }
Ε := { V1: VERIFY golden-file equality vs examples/3rd-party-consumer/golden-bundle/,
       V2: VERIFY 5-line hello-world agent runs in stub sandbox,
       V3: VERIFY bundle-shape Zod schema }
```

NOTE: Q2 selects Σ.output. Block above assumes A (recommended).

#### P97 TDD Scaffold Generator

```
Σ := { input: AgentSpec | Atom, output: ScaffoldFile { path, source },
       framework: 'playwright' | 'vitest' }
Ω := { Auto-emit test scaffold from AISP Γ rules + DoD checklist;
       one describe per Γ rule; one it per DoD bullet }
Γ := { R1: scaffold writes ONLY to tests/scaffold/<atom>.spec.ts namespace;
       R2: existsSync guard — never overwrite existing scaffold;
       R3: ≥1 scaffold per atom (8 atoms minimum coverage);
       R4: CI excludes tests/scaffold/** from gate-blocking pass }
Λ := { Playwright primary; Vitest secondary }
Ε := { V1: VERIFY namespace isolation,
       V2: VERIFY no overwrite on second emit,
       V3: VERIFY all 8 atom scaffolds emit }
```

#### P98 KISS Reviewer

```
Σ := { input: AgentSpec, output: ReviewerPrompt { systemPrompt, scope, schema },
       findings: { severity: 'blocker' | 'major' | 'minor', file, line?,
                   why, fix }[] }
Ω := { Generate brutal-honest reviewer prompt scoped to AgentSpec.ownedFiles
       + DoD; surface findings to a defined channel (Q3) }
Γ := { R1: reviewer scope must NOT include paths outside AgentSpec.ownedFiles;
       R2: findings schema-validated via Zod;
       R3: severity ∈ {blocker, major, minor};
       R4: reviewer prompt cap ≤ 4096 chars (LLM context safety) }
Λ := { Findings render: chat (Q3=A) | Agentics tab (Q3=B) | persona (Q3=C) }
Ε := { V1: VERIFY scope guard — reject any file outside ownedFiles,
       V2: VERIFY schema validation,
       V3: VERIFY prompt-injection mitigation (Σ contract scoping) }
```

NOTE: Q3 selects Λ render channel. Block above assumes B (recommended).

#### P99 Seal Panel

```
Σ := { phase: { id, dod: string[], sessionLog: string, retro: string },
       state: 'draft' | 'ready' | 'sealed', output: { 'session-log.md',
       'retrospective.md' } }
Ω := { Agentics-mode tab rendering "Standard Phase Process" steps 2-4;
       owner ticks DoD; auto-emit session-log.md + retrospective.md stubs }
Γ := { R1: DoD checklist rows derived from AgentSpec.dod;
       R2: existsSync guard — never overwrites existing session-log files;
       R3: markdown output diffable (deterministic ordering);
       R4: retire stale "Coming soon · P92-P100" badge from Agentics.tsx:19 }
Λ := { append-only on existing files; full emit on new }
Ε := { V1: VERIFY existsSync no-overwrite,
       V2: VERIFY markdown diffability,
       V3: VERIFY DoD row count matches AgentSpec.dod.length }
```

#### P101 Agentic Workbench RC

```
Σ := { rcManifest: { phases: ['P94'..'P100W2'], reviews: ReviewPass[],
       composite: number, mustFixes: { open, closed } },
       reviewers: ['ux', 'functionality', 'security', 'architecture'] }
Ω := { Full system seal of Whiteboard + Planning + Agentics modes;
       4-reviewer brutal-honest pass; ≤3 recursive must-fix loops;
       composite ≥ ADR-094 floor (80) }
Γ := { R1: 4 reviewer perspectives MUST run in parallel (UX/Func/Sec/Arch);
       R2: per-file LOC ≤ 600 in review docs;
       R3: recursive must-fix passes ≤ 3;
       R4: composite ≥ 80 (RC blocker) }
Λ := { Q5 selects rollout: all-on (A) | VITE flag (B) | Settings hide (C) }
Ε := { V1: VERIFY all 4 reviews ran,
       V2: VERIFY composite ≥ 80,
       V3: VERIFY zero open blockers post fix-pass round 3 }
```

NOTE: Q5 selects Λ rollout. Block above assumes A (recommended).

#### P100 W2 (no AISP block)

AISP spec deferred — log infrastructure (SQLite migrations + repos + drill-down) is plumbing, not an atom. Per A1 §3 and milestone-plan §2 it carries ADR-126 but no Σ contract because there is no consuming atom: it is the sink.

#### P102/P103/P104 (no AISP block)

AISP spec not applicable — these are release-process phases (persona scoring, release artifacts, public launch). They carry ADRs (128, 129) but no atomic computation.

---

## §6 KISS strikes

Tasks identified in §2 that aren't strictly necessary — STRUCK with rationale:

1. **P95-T7 "Atom search box" — STRIKE.** 8 atoms is small enough to scroll on any viewport; search adds complexity for no UX win on a static-N composite. ADR-110 dual-view doesn't require search. Re-evaluate at Tier-2 if atom count > 20.

2. **P96-T8 "Bundle versioning UI panel" — STRIKE.** Bundle filename already carries version per ADR-101 (versioned-AISP-filename pattern); UI is redundant. Owner picks filename via download dialog; no extra UI surface.

3. **P97-T7 "Scaffold visual preview UI" — STRIKE.** Scaffold output is plain TypeScript — opening it in any editor IS the preview. Adding a render layer doubles the source-of-truth and introduces drift between "what the file says" and "what the UI shows".

4. **P98-T6 "Reviewer-history viewer with diff" — STRIKE.** Git history already carries this — reviewer findings persist as commits + EOP retro entries per CLAUDE.md "Standard Phase Process" §3. Adding an in-app diff viewer rebuilds git on top of the file system for a use-case git already serves.

5. **P99-T7 "Drag-to-reorder DoD items" — STRIKE.** DoD comes from `AgentSpec.dod` (canonical source); reordering in UI breaks the canonical→render mapping and invites the AgentSpec to drift. If owner needs different order, edit the AgentSpec recipe — single source of truth holds.

6. **P101-T6 "Feature-flag plumbing for Q5=B/C only" — STRIKE if Q5=A.** ADR-116 already shipped routes; gating now requires reverting ADR-116 + rebuilding env-var infra stripped at P89b. Default (A — recommended) skips this entirely; flag only added if owner picks B or C.

7. **P103-T9 "Re-record demo video" — STRIKE from Claude scope.** Per ADR-109 §4 owner-launch-checklist pattern — demo video record is owner-only post-RC task. Claude ships script (T5) only.

8. **P104-T7 "Promo automation (auto-cross-post bot)" — STRIKE.** Auto-cross-post adds infra burden + risks platform TOS violations + dilutes message control on launch day. Owner posts manually per current launch-checklist pattern.

9. **P96-T9 "In-page render of bundle (Q2=B branch)" — STRIKE if Q2=A (recommended).** Recommendation A (ZIP via Blob) is consistent with existing P78 export pattern; in-page render is a redundant secondary affordance. Add only if owner explicitly picks Q2=B.

10. **P100W2-T17 "Personality compute-all-5 (Q7=A)" — KEEP if Q7=A; STRIKE if Q7=B/C.** Compute-once (current) ships zero new code; compute-all is the recommended option only because it matches the "visible audit" P100 narrative. Cost is negligible (5 string concats) so the recommendation holds, but mark "strikable" if owner deprioritizes audit depth.

---

## §7 File-conflict map (wave-gating recommendations for A4)

Files that multiple phases want to touch — flag for A4 Process Map:

- **`src/pages/Planning.tsx`** — touched by:
  - P95-T4 (mount Spec tab)
  - P96-T7 (mount Export button on Spec tab — surgical edit on Spec tab subtree)
  - P100W2-T13 (hydrate liveMap/liveDomainModel)
  - P101-T5 (fix-pass)
  
  **Wave order:** P95 first (introduces Spec tab) → P96 (decorates Spec tab) → P100W2 (hydration on mount) → P101 (review pass). NO parallel dispatch on this file.

- **`src/pages/Agentics.tsx`** — touched by:
  - P99-T4 (mount Seal Panel + retire stale badge)
  - P101-T5 (fix-pass)
  
  **Wave order:** P99 first → P101 review.

- **`src/contexts/intelligence/chatPipeline.ts`** — touched by:
  - P100W2-T11 (hoist request_id mint to `:271`; thread stage emits)
  - P101-T5 (fix-pass)
  
  **Wave order:** P100W2 first → P101 review. CRITICAL: chatPipeline.ts is high-traffic; recommend extracting `request_id` minting into a separate `src/contexts/intelligence/log/requestIdMint.ts` helper module to keep chatPipeline edit minimal.

- **`src/components/center-canvas/ConversationLogTab.tsx`** — touched by:
  - P100W2-T14 (drill-down per request_id)
  - P101-T5 (fix-pass)
  
  **Wave order:** P100W2 only; review pass after.

- **`src/components/planning/PlanningChatBar.tsx`** — touched by:
  - P100W2-T12 (persist atom outputs)
  
  **Wave order:** P100W2 only.

- **`CLAUDE.md`** — touched by EVERY closer (P95, P96, P97, P98, P99, P100W2, P101, P102, P103, P104).
  
  **Coordination:** sequential by phase order via existing NOTE-FOR-NEXT pattern. No simultaneous edits.

- **`src/components/spec/*`** — touched by:
  - P95-T2/T3 (SpecWorkbench + AtomCard)
  - P96-T3 (ExportClaudeCodeButton — sibling file, not edit)
  
  **Wave order:** P95 must seal before P96 dispatches into this directory.

- **`docs/adr/`** — multiple ADRs added; no overwrite risk (each gets unique number).

---

## §8 Carry-forward to A3 (DDD + ADR)

What A3 needs from this doc to draft DDD bounded contexts + ADR list:

- **§2 task tables** → A3 maps tasks to bounded contexts:
  - SpecWorkbench / Export → `intelligence/spec` + `intelligence/export` contexts
  - TDD Scaffold → `intelligence/scaffold` context (new)
  - KISS Reviewer → `intelligence/review` context (new)
  - Seal Panel → `intelligence/seal` context (new) + `presentation/agentics` UI context
  - P100 W2 log build → `persistence/log` context (extends existing persistence bounded context)

- **§5 AISP Σ specs** → A3 lists ADRs each spec implies:
  - ADR-121 (P95 SpecWorkbench) — cross-refs ADR-110/116/120
  - ADR-122 (P96 Export) — cross-refs ADR-101/108/120
  - ADR-123 (P97 TDD Scaffold) — cross-refs ADR-083/120
  - ADR-124 (P98 KISS Reviewer) — cross-refs ADR-094/095/110/120
  - ADR-125 (P99 Seal Panel) — cross-refs ADR-116/120
  - ADR-126 (P100 W2 Log System) — cross-refs ADR-018/074/110
  - ADR-127 (P101 RC) — cross-refs ADR-094/116
  - ADR-128 (P102 Final QA) — cross-refs ADR-094/127
  - ADR-129 (P103 v2 Release) — cross-refs ADR-109/127/128
  - 9 new ADRs total (121-129); ledger goes 120 → 129.

- **§6 KISS strikes** → A3 confirms no DDD violation by removing them:
  - All 10 strikes are UI niceties or git-duplicating features — no bounded context lost.
  - Specifically confirm: P98-T6 (reviewer-history) does not break the `intelligence/review` context's responsibility (review = generate prompt + validate findings; history = git's job).

- **§7 conflict map** → A3 records "shared file" pattern as architectural concern: `Planning.tsx` becomes a multi-context aggregator (Spec + Export + persistence hydration); recommend ADR-121 carry a decision on whether to extract a `PlanningPageController` to keep the page lean.

---

# Report

Section LOC counts: §1≈10, §2≈260 (11 phase tables incl. P94 reference + P94b conditional), §3≈40, §4≈45, §5≈115 (6 AISP Σ blocks + 2 explicit no-block notes), §6≈25, §7≈45, §8≈30. Total ≈ 570 LOC ≤ 600 cap.

Phase-table count: 11 (P94 reference + P94b conditional + P95-P104 = 12 actually; spec asked 10 expected for P95-P104 minimum). Counted strictly within P95-P104 scope: 10 tables (one per phase including P100 W2 separated out).

KISS strike count: 10 (≥5 floor satisfied).

BLOCKED phase count: 5 (P95 on Q1+Q6; P96 on Q2; P98 on Q3; P100/W2 on Q4+Q7; P101 on Q5). Plus conditional P94b (gated on Q6).

AISP Σ blocks in §5: 6 (P95, P96, P97, P98, P99, P101 — one per major phase agent task). P100 W2 + P102-P104 explicitly noted as no-AISP-block (infrastructure / process phases).

Hard-rule compliance: READ-ONLY (no source/test/ADR/CLAUDE.md edits — only the owned doc artifact at `plans/implementation/phase-95/01-decomposition.md` written); doc artifact only; all 8 sections (§1-§8) present; per-phase tables for P95-P104 (10 phases — P94 included as sealed reference + P94b conditional bonus); ≥5 KISS strikes (10 actual); 6 AISP Σ blocks (one per major phase agent task — P95/P96/P97/P98/P99/P101; P100 W2 + P102-P104 noted as out-of-scope for atomic computation); BLOCKED phases marked with shape only (no atomic detail) — high-level task lists per spec; ≤600 LOC; phase/task IDs cited (no file:line required this pass per spec); no shell commands beyond ls/read.
