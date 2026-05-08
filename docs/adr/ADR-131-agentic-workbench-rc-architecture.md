# ADR-131 — Agentic Workbench RC Architecture

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P101 / AW-RC
- **Cross-refs:** ADR-082 (Open Core RC), ADR-109 (Open Core v1.0.0-RC1
  Architecture), ADR-116 (Three-Mode), ADR-126 (Comprehensive Log
  Infrastructure), ADR-128 (TDD Scaffold), ADR-129 (KISS Review),
  ADR-130 (Seal Panel + EOP Persistence)

## Context

P101 closes the Agentic Workbench arc opened at P90. The arc P90 → P101
shipped three modes (Whiteboard / Planning / Agentics — ADR-116), the
8-atom AISP suite (ADR-118 + ADR-119 + ADR-120 closing the suite at
PROCESS + DDD + AGENT alongside the 5 baseline atoms PATCH / INTENT /
SELECTION / CONTENT / ASSUMPTIONS plus DECOMP from P74), the SpecWorkbench
(ADR-121), Claude Code markdown bundle export (ADR-122), comprehensive
log infrastructure (ADR-126 + ADR-127), TDD scaffold generator (ADR-128),
KISS reviewer (ADR-129), and the Seal Panel + EOP persistence (ADR-130).

This ADR is the definitive record naming what the Agentic Workbench RC
IS at v2.0.0-RC1 boundary. P101 / W2 brutal review surfaced 4 PARTIAL
verdicts (R1 Whiteboard / R2 Planning+Agentics / R3 Security / R4
Architecture) — this ADR records honest acceptance with carry-forwards
named, not papered over.

## Decisions

### Decision 1 — RC ships at v2.0.0-RC1 with 3 modes routed + 8 atoms wired

The Agentic Workbench RC ships:

- **3 modes routed** — `/builder` (Whiteboard) + `/planning` + `/agentics`
  (verified `src/main.tsx`). AppShell mode-aware via `useLocation()` per
  ADR-116 D3.
- **8 Crystal Atoms** in production with ≥1 import site each: PATCH +
  INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP (ADR-099) +
  PROCESS (ADR-118) + DDD (ADR-119) + AGENT (ADR-120). AGENT
  production-wired in `PlanningChatBar.tsx` per ADR-128 D3.
- **7-step methodology** with UI surface per step: Research (Onboarding /
  saved-project) · Decompose (`chatPipeline.ts`) · Architect
  (PlanningChatBar → DDD_ATOM) · Spec (PlanningChatBar → PROCESS_ATOM) ·
  Plan (PlanningChatBar → AGENT_ATOM) · Build (SpecWorkbench →
  TDD scaffold per ADR-128) · Reflect (KISS review per ADR-129 + Seal
  Panel per ADR-130).
- **Comprehensive log infra** — `log_events` + `edit_history` SQLite
  tables (ADR-126); 13+ event types; BYOK redaction at every write
  boundary; 30/90-day retention now wired at boot per P101 / R3 P1 fix.

### Decision 2 — Persona scoring acceptance (honest, not optimistic)

P101 W2 4-reviewer brutal review:

- **Grandma 84/100** — below ≥85 floor by 1. Driven by Welcome stale
  stats (P101 fix applied, lifts to ~88) + Onboarding token drift
  (deferred to P102). Closeable post-RC.
- **Framer 84/100** — below ≥85 floor by 1. Same drivers. Closeable
  post-RC.
- **Lars 85/100** — below ≥88 floor by 3 (PARTIAL). Driven by
  SealPanel `eop=null` runtime (Tier-2 build-time pre-bake per
  ADR-130 D3) + `onSeal` unwired (P101 fix applied, lifts ~+2) +
  Agentics map hardcoded (deferred to P102). Honest PARTIAL.

Composite ≈ 84/100 with P101 fixes applied. Above floor with P102
token migration + Agentics live-map wire.

### Decision 3 — Honest carry-forward registry at RC boundary

| # | Carry-forward | Status at RC |
|---|---------------|--------------|
| CF#1 | AGENT_ATOM production wire | **CLOSED** (P97 / ADR-128 D3) |
| CF#2 | PROCESS+DDD persistence | **CLOSED** (P99 / ADR-130 D4) |
| CF#3 | Verb classifier `forget`/`need`/`create` | **CLOSED** (P101 W1) |
| CF#4 | Live LLM verifications | **OWNER-REQUIRED** (post-RC BYOK smoke) |
| CF#5 | Real STT calibration | **OWNER-REQUIRED** (post-RC) |
| CF#6 | Build-time EOP pre-bake | **TIER-2** (Vite plugin; ADR-130 D3) |
| CF#7 | Welcome + Onboarding token migration (~150 LOC) | **P102 / OC-POLISH-W5** |
| CF#8 | Agentics live-map wire (hoist `liveMap` cross-mode) | **P102** |
| CF#9 | SVG legend strips (ProcessMap + DomainModel) | **P102** |
| CF#10 | `useChatPipeline` hook extraction | **P102+ if pipeline pushed** |
| CF#11 | Status palette tokens `--hb-status-{sealed,deferred}` | **P102 palette pass** |
| CF#12 | Log enum housekeeping (5 declared event_types unwired) | **P102** |

### Decision 4 — SOTA composite score: honest +0 to +4 vs SOTA

Per P100 W2 FMT-VERIFY ADR-127 §C: **79/100 raw → 84/100 with D1
fixes**, vs Lovable 80/100 baseline. The arc P95 → P101 lifts the
methodology surface (review → export → tests → KISS-gate → seal +
spec workbench + atom suite) but the LIVE-LLM divergence risks
(ADR-127 §9) cap the optimistic ceiling. **Honest range: 79–84/100.**

Prior P100 W2 LOG-BUILD claim of 88/100 was OPTIMISTIC — verification
through real code paths surfaced 5 gaps. P101 W1 fixes closed 3; CF#4-5
remain owner-gated.

## Out of Scope

- **Live LLM verifications** (CF#4) — post-RC owner BYOK smoke run.
  No in-tree mocking shortcut; honesty over fake green.
- **Real STT calibration** (CF#5) — post-RC owner; Web Speech runtime
  activation is BYOK-gated.
- **Build-time EOP pre-bake** (CF#6) — Tier-2; Vite plugin reads
  `plans/implementation/phase-{N}/seal/` + injects EOP markdown into
  PhaseCard fixtures. Open-core ships `eop=null` empty-state.
- **Token migration on Welcome + Onboarding** (CF#7) — P102 /
  OC-POLISH-W5; ~150 LOC across two files; out of P101 30-LOC budget.
- **Agentics live-map wire** (CF#8) — P102; hoist `liveMap` from
  Planning into Zustand slice OR read-back via `getEventsForRequest`.
- **SVG legend strips** (CF#9) — P102 polish.

## Acceptance Gates

1. ADR-131 exists at `docs/adr/ADR-131-agentic-workbench-rc-architecture.md`.
2. ADR-131 ≤ 180 LOC; declares Status: Accepted; cross-refs ADR-082 +
   ADR-109 + ADR-116 + ADR-126 + ADR-128 + ADR-129 + ADR-130.
3. All 8 Crystal Atom modules exist on disk under
   `src/contexts/intelligence/aisp/`.
4. Each of the 8 atoms has ≥1 production import site in `src/`.
5. `src/main.tsx` declares `/builder` (or `/`), `/planning`, `/agentics`
   routes.
6. P101 reviewer artifacts present at `plans/implementation/phase-101/seal/`
   (04-r1 + 05-r2 + 06-r3 + 07-r4).
7. P101 EOP triplet at `plans/implementation/phase-101/seal/`
   (02-post-review + session-log + retrospective).

## Consequences

**Positive:** RC boundary documented with honest persona acceptance —
two PARTIAL verdicts named (Whiteboard 84 / Lars 85) rather than
papered over. The 12-item carry-forward registry is the truth-up
ledger for P102+ and Tier-2 commercial scope. CF#1-3 closed in
sequential phases (P97 / P99 / P101 W1) with file:line evidence;
CF#4-6 honest defers; CF#7-12 explicit P102 candidates.

**Negative:** Persona floors not all cleared at RC tag — Grandma /
Framer / Lars all at-or-just-below floor. Required compromise to
hold RC scope within 30-LOC fix budget; P102 polish wave closes the
floor breaches.

**Mitigations:** P102 token migration + Agentics live-map wire +
SVG legend strips lift composite to ~91/100 per R1 §6 projection.
Owner-required CF#4-5 (live LLM + STT) gated behind first BYOK
smoke run; the surface is RC-clean, the runtime activation is
owner work.
