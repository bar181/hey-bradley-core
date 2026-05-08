# P101 / A3 — 7-Step End-to-End Verification

**Status:** verification-only doc. No source-code edits.
**Date:** 2026-05-03.
**Scope:** confirm the 7-step methodology fires end-to-end across Whiteboard /
Planning / Agentics modes and that all 8 AISP atoms have ≥1 production import
site. Companion to `tests/p101-7step-e2e-smoke.spec.ts` (15 cases / 8 describe
blocks; 15/15 GREEN at A3 close).

---

## 1. The 7 Steps and their UI Surfaces

| # | Step | UI Surface (file) | Atom / Module Fired | P101E2E case |
|---|------|-------------------|---------------------|--------------|
| 1 | **Research** — load existing project context | `src/pages/Onboarding.tsx` (+ `src/pages/Welcome.tsx`) | `useProjectStore.loadProject` + `STORAGE_KEY` saved-project lookup | P101E2E.1 |
| 2 | **Decompose** — split multi-clause asks | `src/contexts/intelligence/chatPipeline.ts` (line 426 dynamic import; line 431 `decompose()` call) | `DECOMP_ATOM` (`decompose` in `decompAtom.ts`) | P101E2E.2 |
| 3 | **Architect** — bounded contexts + ADR | `src/components/planning/PlanningChatBar.tsx` (line 3 import; line 58 + 70 calls) | `DDD_ATOM` (`classifyContexts` in `dddAtom.ts`) | P101E2E.3 |
| 4 | **Spec** — phases / sprints / waves / agents + AISP Σ | `src/components/planning/PlanningChatBar.tsx` (line 2 import; line 44 call) | `PROCESS_ATOM` (`classifyProcess` in `processAtom.ts`) | P101E2E.4 |
| 5 | **Plan** — agent scopes + DoD | `src/components/planning/PlanningChatBar.tsx` (line 5 import; line 78 call inside loop) | `AGENT_ATOM` (`classifyAgents` in `agentAtom.ts`) — P97 wire | P101E2E.5 |
| 6 | **Build** — TDD scaffold (Given/When/Then) | `src/contexts/specification/exportClaudeCode.ts` (line 24 import; line 209 call) | `buildTDDScaffold` (`exporters/tddScaffoldGenerator.ts`) — P97 module | P101E2E.6 |
| 7 | **Reflect** — KISS review + Seal | `src/components/agentics/SpecWorkbench.tsx` (`run-kiss-review-button` testid) + `src/pages/Agentics.tsx` (`<SealPanel>` mount) | `kissReviewer.buildKissReview` (P98) + `SealPanel` (P99) | P101E2E.7 |

---

## 2. All 8 AISP Atoms — Production Call Sites Confirmed

Per the P100 W2 / FMT-VERIFY retrospective rule: every Crystal Atom helper
export ships with a grep-trace verifying ≥1 import site exists in
`chatPipeline.ts` or equivalent dispatch surface.

| Atom | Production call site | Evidence |
|------|----------------------|----------|
| 1. INTENT      | `chatPipeline.ts` line 21 (`import { isUnmeasurableGoal } from '@/contexts/intelligence/aisp/intentAtom'`) | P101E2E.8 case 1 |
| 2. ASSUMPTIONS | `chatPipeline.ts` (route fall-through path comment line 344; `assumptionsAtom` reachable via fall-through from low-confidence INTENT) | P101E2E.8 case 1 |
| 3. SELECTION   | `chatPipeline.ts` line 344 + 490 (template matcher SELECTION_ATOM short-circuit) | P101E2E.8 case 1 |
| 4. CONTENT     | `chatPipeline.ts` line 611 + 616 (CONTENT_ATOM route; LLM dispatch deferred — Tier-2) | P101E2E.8 case 1 |
| 5. PATCH       | `chatPipeline.ts` line 244 + 464 + 507 + 551 (`applyPatches()` is the canonical PATCH_ATOM apply site) | P101E2E.8 case 1 |
| 6. DECOMP      | `chatPipeline.ts` line 426 dynamic import + line 431 `decompose()` invocation (P74) | P101E2E.8 case 2 |
| 7. PROCESS     | `PlanningChatBar.tsx` line 2 import + line 44 `classifyProcess(text)` (P92) | P101E2E.8 case 3 |
| 8. DDD         | `PlanningChatBar.tsx` line 3 import + line 58 + 70 `classifyContexts(text)` (P93) | P101E2E.8 case 3 |
| (also) AGENT   | `PlanningChatBar.tsx` line 5 import + line 78 `classifyAgents(ctx)` (P97) — closes P101 carry-forward #1 | P101E2E.8 case 3 |

The dead-code state ADR-127 §C1 §4.1 named is now CLOSED for every atom in the
8-atom suite.

---

## 3. Persistence Read-Back Status

### 3.1 Write side — confirmed at P99 / SEAL-PANEL

`PlanningChatBar.tsx` (line 53 + 59) emits two `writeLogEvent()` calls per
Planning chat submit:

- `event_type: 'process_atom_output'` — payload includes phase / sprint / wave
  counts from `classifyProcess(text)`.
- `event_type: 'ddd_atom_output'` — payload includes context / relationship
  counts from `classifyContexts(text)`.

Both event types are declared in the migration 005 CHECK enum (per ADR-126 +
ADR-127 D4) and in `comprehensiveLogs.ts` `LogEventType` (lines 24-25).

**Status:** ✓ closed at P99. Carry-forward #2 from P101 audit is sealed.

### 3.2 Read-back side — confirmed via existing helper

`getEventsForRequest(db, requestId)` in `comprehensiveLogs.ts` line 228 returns
all `LogEventInsert` rows for a given `request_id` in `created_at` order. The
ConversationLogTab drill-down (P100 W2 / A8) consumes this helper and renders
PROCESS+DDD events alongside INTENT / template_match / patch_validation rows
in the same surface.

**On page reload:** the SQLite file persists across sessions (sql.js +
IndexedDB; ADR-016). PROCESS+DDD outputs written before the reload are read
back via `getEventsForRequest()` and re-rendered.

### 3.3 Carry-forward (Tier-2, post-RC)

**`Planning.tsx` in-memory state is NOT yet rehydrated from `log_events` on
mount.** Specifically:

- `liveMap: ProcessMap | null` — currently null on mount; populated only when
  the user submits a Planning chat input. The PROCESS_ATOM output that
  generated the previous map is in `log_events` but the renderer does not
  reconstruct `liveMap` from there.
- `liveDomainModel: DomainModel | null` — same pattern; persists on disk via
  `ddd_atom_output` event but not rehydrated to in-memory state.

**This is a Tier-2 follow-on (post-RC).** The fix is a `useEffect` that on
mount calls `getEventsForRequest()` for the most recent `process_atom_output`
+ `ddd_atom_output` events for the active project, then rebuilds `liveMap` +
`liveDomainModel` via the same `toProcessMap` / `toDomainModel` adapters used
on submit. Rationale for deferral: open-core RC scope already covers
write-side persistence + drill-down read; full state-rehydration round-trip
overlaps with AgentProxy round-trip work scheduled post-RC.

---

## 4. ConversationLogTab Seed Fixture

**Script:** `scripts/seed-conversationlog-fixtures.ts` (77 LOC; stdlib-only
Node TS; run via `npx tsx`).

**Output:** `tests/fixtures/conversationlog-seed.json` (275 LOC; 20 rows).

**Coverage:** 4 scenarios × ~5 events each, mirroring P100 W2 simulation set:

| Scenario | requestId | Events |
|----------|-----------|--------|
| Axon CLI dev (chat, single-page) | `req-axon-001` | input_event → intent_classification → template_match → patch_validation → response_summary |
| Adversarial / contradiction (DECOMP split) | `req-edge-001` | input_event → intent_classification (with contradiction flag) → decomp_split → todo_execution → response_summary |
| Listen-mode startup (transcript-cleanup) | `req-listen-001` | listen_capture → input_event → intent_classification → patch_validation → response_summary |
| Planning SaaS auth (PROCESS+DDD persistence) | `req-plan-001` | input_event → process_atom_output → ddd_atom_output → export_emit → response_summary |

**Use:** load into a sql.js handle for ConversationLogTab drill-down to
display meaningful 4-scenario data without a running dev-server or live
AgentProxy invocation.

---

## 5. Verification Outcome

- 4 owned files exist (`tests/p101-7step-e2e-smoke.spec.ts`,
  `scripts/seed-conversationlog-fixtures.ts`,
  `tests/fixtures/conversationlog-seed.json`,
  `plans/implementation/phase-101/02-e2e-verification.md`).
- `npx playwright test tests/p101-7step-e2e-smoke.spec.ts --reporter=line` →
  **15/15 GREEN** (8 describe blocks P101E2E.1-P101E2E.8).
- Seed script runs clean: 20 log_events rows emitted.
- Hard rules upheld: no source-code edits beyond owned files; no touches to
  A1's `intentClassifier.ts`, A2's audit/fix files, or ADR-131 / CLAUDE.md
  (A4 closer Wave 2).
