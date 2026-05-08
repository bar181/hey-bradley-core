# P97 / TDD-SCAFFOLD — Retrospective

- **Phase:** P97 · **Sprint:** TDD-SCAFFOLD · **Date:** 2026-05-01

## Keep

- **Combined-sprint pattern** (TDD scaffold + AGENT_ATOM production wire as one phase). The scaffold consumes `AgentSpec[]`, so wiring AGENT_ATOM at the same time keeps the dependency arrow short and the carry-forward window minimal. ADR-127 had named AGENT_ATOM unwired as P101 #1 — closing it in the same sprint that ships the first downstream consumer is structurally cheaper than two-phase dispatch.
- **4-source `derivedFrom` classifier** on every test case (AISP-Σ / DDD-context / AGENT-DoD / phase-gate). Downstream consumers can filter by source kind without re-parsing. Mirrors ADR-127's atom-helper grep-trace discipline: every helper export ships with ≥1 import site, every test case ships with ≥1 source classifier.
- **Test spec as 7th bundle file**, not separate download. ADR-128 D4 keeps the Claude Code bundle as the single canonical drop — spec + tests in the same `.md` file. Mirrors ADR-122's "two CTAs, two purposes" pattern (clipboard quick-AISP + bundle full-export); P97 adds a third quick-CTA (test-spec only) without breaking the canonical drop contract.
- **Pure / store-agnostic emitter contract** (mirrors ADR-121 D3 + ADR-122 emitter patterns). `buildTDDScaffold(phase, contexts?, agents?)` accepts pre-computed atom outputs as optional args; falls back to scaffold-from-PhaseCard-only when atoms aren't available. Testable in isolation; mountable from any surface (SpecWorkbench export-button OR exportClaudeCode bundle emitter — both consume the same module).
- **EOP at `seal/` subfolder** mirrors P95/P96 pattern.
- **existsSync soft-pass guards on A1/A2; hard-gate on A3-owned ADR + EOP triplet.** Standard pattern from P92-P96.

## Drop

- **Nothing.** AGENT_ATOM wiring had been on the carry-forward ledger from P94 close (8 weeks of latent dead-code state per ADR-127's grep-trace discipline rule). Combining the wire with the scaffold's first consumer surface kept the close cost minimal — no separate phase needed for the wire alone.

## Reframe

- **"Carry-forward" is structurally cheap when paired with a downstream consumer.** P101 #1 (AGENT_ATOM unwired) sat dormant until P97 had a downstream consumer that needed `AgentSpec[]`. Wiring the atom in isolation would have been busywork; wiring it in service of the scaffold's first use makes the wire's value visible in the same drop. Future carry-forwards should be paired with their first downstream consumer where possible — defer-then-implement-with-consumer is structurally cheaper than implement-then-find-consumer.
- **"Scaffold" is not a downstream feature — it's the consumer-experience surface.** The arc P95 → P96 → P97 is design (review) → materialization (export) → consumer-experience (TDD-first workflow on the consumer's side). Each phase confirms the prior phase's contract by consuming it. The bundle now contains tests in the same drop as the spec — TDD-first becomes the consumer's default without extra round-trips.

## Carry-forward (Tier-2 commercial / post-RC)

- BDD framework code generation — Tier-2 commercial.
- AI-generated test bodies (LLM fills `expect(...).toBe(...)` lines) — Tier-2 commercial.
- Cross-phase test reuse / shared step library — Tier-2.
- Live AgentProxy invocation for AGENT_ATOM enrichment — waits on first owner BYOK smoke run.
- Round-trip AgentSpec edits — Tier-2 (workbench is read-only against pre-computed AGENT output today).
- P98 KISS+Review gate — next in the AW arc.
- P99-P100 seal panel — closes the AW arc.

## Velocity note

- Preflight estimate: 30-45 min wall-clock for P97.
- Actual: comparable. Three disjoint scopes ran in parallel without contention. AGENT_ATOM wire was a 15-LOC surgical edit on PlanningChatBar; the scaffold module was the bulk of the LOC; A3's closer ran alongside both without a sequential gate.
- **Net:** velocity hit was as estimated. The combined-sprint pattern (atom-wire + first-consumer) paid for itself in a single phase rather than two.

## P95 → P96 → P97 → P98 arc

P95 sealed SpecWorkbench (read-only review). P96 sealed Export Claude Code (materialization). P97 seals TDD scaffold (consumer-experience). P98 will seal the KISS+Review gate (final-mile discipline before the AW arc closes at P99-P100). The AISP suite is now complete (P94) with all 8 atoms production-wired (P97) and consumed by SpecWorkbench (P95) + Export bundle (P96) + TDD scaffold (P97). Every atom has ≥1 production import site — the dead-code state ADR-127 named is now globally closed for the AW arc.
