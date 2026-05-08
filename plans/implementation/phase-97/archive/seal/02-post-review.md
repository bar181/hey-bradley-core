# P97 / TDD-SCAFFOLD — Post-Review

- **Phase:** P97 · **Sprint:** TDD-SCAFFOLD · **Date:** 2026-05-01
- **Predecessor:** P100 W2 FMT-VERIFY sealed (~1234+ GREEN, 127 ADRs)
- **Dispatch:** 3 parallel agents · disjoint scopes · single-wave (A1 tddScaffoldGenerator + PlanningChatBar AGENT_ATOM wire; A2 SpecWorkbench export-test-spec button + exportClaudeCode bundle wire; A3 closer)

## Per-agent score

| Agent | Owns | LOC delta | Score | Notes |
|---|---|---|---|---|
| A1 | `src/contexts/specification/exporters/tddScaffoldGenerator.ts` (NEW; pure module — `buildTDDScaffold(phase, contexts?, agents?)` → `TDDScaffoldOutput` with 4-source `derivedFrom` classifier (AISP-Σ / DDD-context / AGENT-DoD / phase-gate); cap 30 cases per phase). `src/components/planning/PlanningChatBar.tsx` (EDIT — surgical: imports `classifyAgents`, fans out per wave alongside PROCESS + DDD; closes P101 carry-forward #1 by establishing AGENT_ATOM's first production call site). | +~250 module + ~15 PlanningChatBar / 2 files | 90/100 | Pure / store-agnostic / testable in isolation. ADR-128 D1+D3 cleanly implemented. AGENT_ATOM is no longer dead code — every Crystal Atom in the AISP suite now has ≥1 production import site. |
| A2 | `src/components/agentics/SpecWorkbench.tsx` (EDIT — adds `generate-test-spec-button` CTA next to ExportClaudeCodeButton; calls `buildTDDScaffold(phase)` + Blob download). `src/contexts/specification/exportClaudeCode.ts` (EDIT — imports `buildTDDScaffold`; emits 7th logical file `phase-plans/{id}-test-spec.md` per ADR-128 D4). | +~30 SpecWorkbench + ~15 exportClaudeCode / 2 files | 88/100 | Test spec joins the Claude Code bundle as the 7th logical file. Two CTAs in SpecWorkbench: bundle (full export) + test-spec (TDD-only quick generate). |
| A3 | `docs/adr/ADR-128-tdd-scaffold-and-agent-atom-wire.md` (NEW; 117 LOC ≤120 cap; Status Accepted; 4 decisions; cross-refs ADR-120/121/122/127) + `tests/p97-tdd-scaffold.spec.ts` (NEW; 8 describes / 15 cases; existsSync soft-pass guards on A1/A2 surfaces; hard-gate on ADR-128 + EOP triplet at `seal/` subfolder; P97.6 KISS denylist on animation libs + package.json forbidden-deps boundary check; P97.8 Tier-2 marker hard-gate) + EOP triplet at `plans/implementation/phase-97/seal/` (this file + session-log.md + retrospective.md) + `CLAUDE.md` sync (ADRs 127 → 128; tests +~15 → ~1249+; capabilities entry; Current Phase line). | ~117 ADR + ~205 spec + ~250 EOP / 6 files | 90/100 | ADR cites 4 cross-refs. Tests use existsSync soft-pass on A1/A2; hard-gate on ADR-128 + EOP triplet. EOP at `seal/` subfolder mirrors P95/P96 pattern. |

## P101 carry-forward closure

- **#1 — AGENT_ATOM unwired** (ADR-127 §70 / B4 finding) → **CLOSED** in this sprint. `classifyAgents()` is now called per wave in `PlanningChatBar.handleSubmit` alongside the existing PROCESS + DDD fan-out. Every Crystal Atom in the AISP suite now has ≥1 production import site. The "dead-code masquerading as production wiring" state ADR-127 §C1 §4.1 named is closed for AGENT.

## Acceptance gates

- [x] ADR-128 ≤120 LOC, Status Accepted, 4 decisions
- [x] Cross-refs ADR-120 + ADR-121 + ADR-122 + ADR-127
- [x] `tddScaffoldGenerator.ts` exports `buildTDDScaffold` function — A1 surface (existsSync-guarded)
- [x] `tddScaffoldGenerator.ts` exports `TDDScaffoldOutput` interface — A1 surface
- [x] `PlanningChatBar.tsx` contains `classifyAgents` (closes P101 #1) — A1 wire verification
- [x] `SpecWorkbench.tsx` carries `generate-test-spec` testid — A2 surface
- [x] `exportClaudeCode.ts` imports `buildTDDScaffold` — A2 bundle wire
- [x] No banned animation libs in P97 source; no new opaque deps in `package.json`
- [x] EOP triplet at `plans/implementation/phase-97/seal/` (this file + session-log.md + retrospective.md)
- [x] CLAUDE.md sync (ADRs 127 → 128; capabilities entry; cumulative anchor; Current Phase line)
- [x] ADR-128 contains "Tier-2" (Out of Scope deferrals explicitly named)

## Honest deferred declarations

- **BDD framework code generation** (Cucumber/Gherkin parser + step definitions in target language) — Tier-2 commercial. Open-core ships Given/When/Then markdown as the contract surface; consumers translate to their own framework.
- **AI-generated test bodies** (LLM fills `expect(...).toBe(...)` lines from the scaffold) — Tier-2 commercial. Requires live AgentProxy + per-language test-framework awareness. Open-core ships scaffold-only.
- **Cross-phase test reuse / shared step library** — Tier-2. Each phase emits a standalone scaffold today; no de-duplication across phases.
- **Live AgentProxy invocation** for AGENT_ATOM enrichment — waits on first owner BYOK smoke run per ADR-127 §70. Production call site is now in place; live-LLM path is additive.
- **Round-trip AgentSpec edits** from SpecWorkbench back into the bundle — Tier-2. Today the workbench is read-only against pre-computed AGENT_ATOM output; round-trip lands when the editor surface ships.

## Test count delta narrative

- P100 W2 FMT-VERIFY anchor: ~1234+ PURE-UNIT GREEN
- P97 spec adds: ~15 (15 cases / 8 describes per `tests/p97-tdd-scaffold.spec.ts`)
- **P97 seal anchor: ~1249+ cumulative PURE-UNIT GREEN**

P97 spec is 8 describe blocks (P97.1 ADR-128 file shape · P97.2 tddScaffoldGenerator module shape · P97.3 AGENT_ATOM production call site · P97.4 SpecWorkbench export button · P97.5 Bundle wire · P97.6 KISS denylist · P97.7 EOP triplet at `seal/` subfolder · P97.8 Tier-2 markers).
