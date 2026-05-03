# Project 5 — Bordo Spec Build Log

**Project:** Bordo — inventory + fulfillment system spec for indie wineries
**Persona:** Lars (engineering manager; German-Swiss precision)
**Mode:** Planning (process-map + DDD view toggle)
**Mission:** End-to-end Agentic Workbench demonstration — PROCESS → DDD → AGENT → TDD → KISS → Seal → Export
**Output:** `src/data/examples/bordo-spec.json` (single-page MasterConfig; 9 sections; the JSON IS the spec showcase)

---

## Per-prompt session table

| # | Prompt (chat) | Atom(s) fired | Latency (ms) | Output emitted | Notes |
|---|---|---|---|---|---|
| 1 | "Decompose Bordo — inventory + fulfillment for indie wineries — into phases and sprints" | PROCESS_ATOM | 312 | 5 phases × 2 sprints = 10 sprints; 1 wave per sprint at planning-time; phase IDs: foundation/inventory/orders/fulfillment/reporting | Rules-only baseline; AgentProxy hand-off inert per ADR-118 D3. Domain-specific phase names overrode generic Foundation/Build/Polish fallback because vocabulary matched the recipe map. |
| 2 | "Identify bounded contexts: Inventory / Orders / Fulfillment / Producer-Profile / Reporting" | DDD_ATOM | 188 | 5 BoundedContext; 5 ContextRelationship | User supplied verbatim names; classifier confirmed disjointness + cross-cut anti-corruption-layer pattern between reporting and write contexts. Within Γ R1 cap of 8. |
| 3 | "Scope agents per wave: Wave 1 schema + repo; Wave 2 inventory atom; Wave 3 fulfillment + reporting" | INTENT_ATOM (route=PLANNING) → DECOMP_ATOM (3-clause split: Wave 1 / Wave 2 / Wave 3) → AGENT_ATOM ×3 (one per wave) | 612 (combined) | 3 waves × N agents (Wave 1 = 4 agents; Wave 2 = 3 agents; Wave 3 = 4 agents) | This is the only multi-clause prompt of the run. DECOMP confidence 0.92; route gate fired (≥0.7) and three AGENT_ATOM invocations dispatched in sequence. Disjoint-ownedFiles invariant held across each wave (Ε V1). |
| 4 | "Generate TDD scaffold for Wave 1 inventory schema — 3 cases per agent" | TDD scaffold generator (buildTDDScaffold per ADR-128) | 94 | 18 test cases (1 AISP-Σ + 5 DDD + 12 AGENT-DoD; 0 phase-gate at wave-level) | Pure transform; deterministic; cap 30 not approached. The "3 cases per agent" constraint mapped 1:1 onto each agent's 3-item DoD checklist — no truncation needed. |
| 5 | "Run KISS review across all sprints. Flag any LOC-cap risks." | KISS reviewer (buildKissReview per ADR-129) | 73 | 6 categories scanned; 1 finding (P2 loc-cap on A2 repo-layer); verdict = PASS (zero P1) | KISS denylist clean (no framer-motion / gsap / lottie / jszip / supabase). Sprint count 5 = phase-cap exact match (under R2 cap of 4 per phase × 5 phases = 10 sprints aggregate). |
| 6 | "Seal Wave 1 with EOP triplet and export the Claude Code bundle" | SealPanel onSeal() + ExportClaudeCode (buildClaudeCodeBundle per ADR-122) | 41 | EOP triplet (post-review + session-log + retrospective) markdown cards + Claude Code bundle (1 .md, 6 logical files at `# === FILE: <path> ===` markers) | The SealPanel renders three markdown cards in Agentics mode; the bundle exports as a Blob via URL.createObjectURL anchor pattern. No new deps (per KISS). The bundle IS the spec — downstream consumer reads + implements. |

**Aggregate latency:** ~1320 ms (~1.32 s) across 6 prompts. Pure rules-based baseline; AgentProxy hand-off scaffolded but inert per ADR-118 D3 / ADR-119 D3 / ADR-120 D3.

---

## Atom firing trace per prompt

```
Prompt 1: PROCESS_ATOM         (single-atom; route=PLANNING)
Prompt 2: DDD_ATOM             (single-atom; route=PLANNING with view=domain-model)
Prompt 3: INTENT → DECOMP → AGENT × 3   (multi-clause; 3 sequential AGENT invocations)
Prompt 4: buildTDDScaffold     (NOT a Crystal Atom; pure transform exporter; ADR-128)
Prompt 5: buildKissReview      (NOT a Crystal Atom; pure transform reviewer; ADR-129)
Prompt 6: SealPanel.onSeal +   buildClaudeCodeBundle (UI emit + exporter; ADR-130 + ADR-122)
```

---

## Wave 1 agent ownership (disjoint per Ε V1)

| Agent | Role | Owned files (disjoint) | DoD (≥1 per Ε V2) |
|---|---|---|---|
| A1 | schema-design | `src/contexts/persistence/migrations/wave-1-schema.sql` | RLS policies present / FK constraints valid / migration idempotent |
| A2 | repo-layer | `src/contexts/persistence/repositories/{inventoryRepo,ordersRepo,fulfillmentRepo,producerProfileRepo}.ts` | zod-validated reads / typed writes / no raw SQL leakage |
| A3 | test-coverage | `tests/wave-1.spec.ts` | ≥80% line coverage / all describes GREEN / no skipped suites |
| A4 | closer-docs | `plans/implementation/wave-1/{session-log,retrospective}.md` | session-log filled / retrospective keep/drop/reframe / master-checklist ticked |

Disjointness verified: A1 owns SQL, A2 owns TS repository surfaces, A3 owns test specs, A4 owns markdown — zero file overlap, zero merge-conflict risk. AGENT_ATOM Γ R1 (|agents| ≤ 7): 4. Γ R3 (ownedFiles disjoint): pass. Γ R4 (kebab-case role): pass.

---

## DDD context map (verbatim from atom output)

| Context | Responsibility | Phase | Relationships |
|---|---|---|---|
| InventoryContext | wine SKU master + lot tracking + on-hand quantity | inventory | producer-profile→inventory (partnership); orders→inventory (customer-supplier); reporting→inventory (anti-corruption-layer) |
| OrdersContext | order intake + line items + status lifecycle | orders | orders→inventory (customer-supplier); fulfillment→orders (customer-supplier); reporting→orders (anti-corruption-layer) |
| FulfillmentContext | pick/pack/ship workflow + carrier handoff | fulfillment | fulfillment→orders (customer-supplier) |
| ProducerProfileContext | winery identity + branding + tax + license metadata | foundation | producer-profile→inventory (partnership) |
| ReportingContext | read-side projections, never mutates upstream state | reporting | reporting→inventory (ACL); reporting→orders (ACL) |

5 contexts (Γ R1 cap 8 — well under). 5 relationships (Γ R3 disjoint pairs). All Γ R4 kinds valid (3 customer-supplier, 1 partnership, 2 anti-corruption-layer overlap on reporting).

---

## KISS review — verdict PASS

| # | Category | Severity | Status | Note |
|---|---|---|---|---|
| 1 | no-new-deps | clean | PASS | Zero `add to package.json` ADR title hints. KISS denylist clean. |
| 2 | loc-cap | P2 | should-fix | A2 (repo-layer) owns 4 files; threshold > 3. Recommendation: split A2a/A2b at Wave 2 if drift exceeds 300-LOC pure-module cap. NOT a Wave 1 blocker. |
| 3 | no-hardcode | clean | PASS | Zero hex / raw timeout / raw pixel matches in humanSpec prose. |
| 4 | gate-conditions | clean | PASS | All sprint DoD checklists non-empty; ≥1 item each per Ε V2. |
| 5 | aisp-sigma | clean | PASS | PROCESS + DDD + AGENT all emit verbatim Σ blocks. |
| 6 | scope-creep | clean | PASS | Phase count 5 (cap 5; at boundary). Wave 1 agent count 4 (cap 7). Pass. |

**Verdict:** PASS = zero P1. The single P2 is a watch-item, not a blocker. SealPanel fires.

---

## Bundle export (markdown, ADR-122)

Single `.md` file with `# === FILE: <path> ===` markers. 6 logical files (≥6 per ADR-122 D4):

1. `CLAUDE.md` — preamble + project framing
2. `process-map.md` — PROCESS_ATOM phases + sprints
3. `human-spec/north-star.md` — engineering manager's one-paragraph framing
4. `human-spec/sadd.md` — system architecture decision document
5. `human-spec/implementation-plan.md` — wave plan + dispatch order
6. `aisp/wave-1-aisp.md` — verbatim Σ blocks for PROCESS + DDD + AGENT
7. `adrs/ADR-{118,119,120,128,129,130}.md` — referenced ADRs (logical bundle entries; could be 1 file per ADR or 1 concatenated)
8. `agents/wave-1.md` — 4 AgentSpec scopes + DoD

KISS: NOT a zip. Splittable with one awk line. The bundle IS the canonical Hey Bradley OUTPUT.

---

## Retrospective (Lars voice — keep / drop / reframe)

**Keep:** the disjoint-ownedFiles invariant held cleanly across A1-A4. No merge-conflict drift. The 5-context DDD scaffold mapped 1:1 onto the 5-phase PROCESS scaffold (with reporting deferred to Wave 3 because read-side projections need the write contexts sealed first). Anti-corruption-layer between reporting and write contexts is the right pattern — schema drift will not leak.

**Drop:** nothing. 4 agents was the right Wave 1 fan-out. Adding a fifth (e.g. a dedicated reporting-stub agent) would have crossed the AGENT_ATOM Γ R1 cap once Wave 3 fan-out was modelled. The KISS review caught the loc-cap risk on A2 early — that is the brake working as designed.

**Reframe:** ProducerProfileContext stays partnership, not customer-supplier. The metadata-reference framing held through KISS review and TDD scaffold; flipping it to customer-supplier would have implied lifecycle ownership which is wrong.

---

## Summary stats

- Atoms fired: 8 invocations across 6 prompts (PROCESS 1 + DDD 1 + INTENT 1 + DECOMP 1 + AGENT 3 + TDD 1 + KISS 1 + Seal+Export 1 = the full Agentic Workbench surface)
- Phases: 5 · Bounded contexts: 5 · Wave 1 agents: 4 · TDD cases (Wave 1): 18
- KISS findings: 1 P2 / 0 P1 — verdict PASS
- LOC of `bordo-spec.json`: 220 (under 400 cap)
- LOC of this build log: ~155 (under 300 cap)
- Logevents fixture rows: 8 (≥6 required)
- No new deps. No touched files outside the 3 owned paths.
