# P95 / Planning Sprint A4 — Process Map + AISP specs + Swarm config

> **Phase:** P95 · **Sprint:** Planning Wave 1 · **Agent:** A4 (process map + AISP + swarm)
> **Date:** 2026-05-02 · **READ-ONLY** doc artifact (no source / test / ADR / CLAUDE.md edits).
> **Owned file:** `plans/implementation/phase-95/03-process-map.md`
> **Sibling chain:** A1 (sealed `00-understanding.md`) · A2 (sealed `01-decomposition.md`) · A3 (sealed `02-ddd-adr-plan.md`) · A5 Closer.

Inputs consumed: `phase-95/00-understanding.md` (§§3-4-6), `phase-95/01-decomposition.md` (§§2-4-5-7), `phase-95/02-ddd-adr-plan.md` (§§3-5-7-8), `src/components/planning/ProcessMapSVG.tsx` (ProcessNode/ProcessEdge/ProcessMap types), `src/data/sample-process-map.ts` (shape exemplar), `src/contexts/intelligence/aisp/{processAtom,agentAtom}.ts` (Σ contract conventions).

---

## §1 Methodology

- **ProcessMap data format** per `ProcessMapSVG.tsx`: `ProcessMap = { nodes: ProcessNode[], edges: ProcessEdge[], activeNodeId? }`. `ProcessNode = { id, label, phase, status, x, y, shape? }` with `status ∈ {planned|in-flight|sealed|deferred}` and `shape ∈ {rect|diamond}` (default rect). `ProcessEdge = { from, to, type }` with `type ∈ {sequential|parallel|gate}`.
- **Decomposition convention (PROCESS_ATOM Λ):** Phase = top-level `ProcessNode`; sprint = sub-node within a phase (rendered as separate node when sprint count > 1); wave = grouping under sprint via `parallel` edge fan-out; agent = leaf (NOT rendered in this open-core map per ADR-118 D4 — phase-level only; agent-level lives in §3 detail and §4 AISP Σ blocks).
- **AISP Σ blocks per major agent task** (§4): mirror A2 §5 Crystal Atom shape with concrete file paths now that A3 §3 mapped contexts. Format = `Σ/Ω/Γ/Λ/Ε` per `agentAtom.ts:51` AGENT_ATOM convention.
- **Swarm config** (§5): parallel-vs-sequential bands per A2 §4 (Band 1 / Band 2 / Band 3); file-conflict map per A2 §7 enforces wave-gating on `Planning.tsx` + `Agentics.tsx` + `chatPipeline.ts` + `ConversationLogTab.tsx` + `CLAUDE.md`. Per CLAUDE.md "Swarm Configuration & Anti-Drift": hierarchical topology / specialized strategy / raft consensus; max 6-8 agents per phase swarm.
- **KISS strikes** from A2 §6 + A3 §7 are NOT included as nodes (10 strikes; struck tasks omitted from §2-§3 entirely).

---

## §2 Full ProcessMap data

A SINGLE ProcessMap structure spanning P94 (sealed reference) → P104 (terminal RC launch). 14 nodes (1 sealed reference + 1 in-flight planning + 10 phase nodes P95-P104 + 2 conditional/gate diamonds). Format = TypeScript-ish JSON literal feedable to `ProcessMapSVG`.

```ts
const AGENTIC_WORKBENCH_PROCESS_MAP: ProcessMap = {
  nodes: [
    // Sealed reference (P94 — AGENT_ATOM 8th + final Crystal Atom)
    { id: 'p94', phase: 94, label: 'AGENT_ATOM', status: 'sealed', x: 60, y: 80 },

    // In-flight planning sprint (this sprint — diamond gate before P95 dispatch)
    { id: 'planning', phase: 95, label: 'Planning Sprint', status: 'in-flight', x: 220, y: 80, shape: 'diamond' },

    // Conditional sub-phase P94b (recipe expansion) — only spawns if Q6=B
    { id: 'p94b', phase: 94, label: 'P94b Recipes (cond.)', status: 'planned', x: 220, y: 200 },

    // Body sprints P95-P100W2 (parallel-batchable per A2 §4 Bands 1+2)
    { id: 'p95', phase: 95, label: 'SpecWorkbench', status: 'planned', x: 380, y: 80 },
    { id: 'p96', phase: 96, label: 'Export Claude Code', status: 'planned', x: 540, y: 80 },
    { id: 'p97', phase: 97, label: 'TDD Scaffold', status: 'planned', x: 380, y: 200 },
    { id: 'p98', phase: 98, label: 'KISS Reviewer', status: 'planned', x: 540, y: 200 },
    { id: 'p99', phase: 99, label: 'Seal Panel', status: 'planned', x: 380, y: 320 },
    { id: 'p100w2', phase: 100, label: 'P100W2 Log Build', status: 'planned', x: 540, y: 320 },

    // RC seal gate (diamond — gates on all body sprints sealed)
    { id: 'rc-gate', phase: 101, label: 'RC Seal Gate', status: 'planned', x: 700, y: 200, shape: 'diamond' },

    // Release sequence Band 3 (strictly sequential)
    { id: 'p101', phase: 101, label: 'Agentic WB RC', status: 'planned', x: 860, y: 80 },
    { id: 'p102', phase: 102, label: 'Final QA', status: 'planned', x: 860, y: 200 },
    { id: 'p103', phase: 103, label: 'v2.0.0 Artifacts', status: 'planned', x: 860, y: 320 },
    { id: 'p104', phase: 104, label: 'v2.0.0-RC1 Launch', status: 'planned', x: 1020, y: 200 },
  ],
  edges: [
    // P94 → planning sprint (this dispatch)
    { from: 'p94', to: 'planning', type: 'sequential' },
    // Planning gates on owner Q1+Q6 → P95 (or via P94b if Q6=B)
    { from: 'planning', to: 'p94b', type: 'gate' },     // conditional spawn
    { from: 'planning', to: 'p95', type: 'gate' },      // gates on Q1+Q6 resolved
    { from: 'p94b', to: 'p95', type: 'sequential' },    // if P94b spawns
    // Band 1 + Band 2 parallel fan-out from P94 (planning gate)
    { from: 'planning', to: 'p97', type: 'parallel' },  // P97 ready (no Q-gate)
    { from: 'planning', to: 'p100w2', type: 'gate' },   // P100W2 gates on Q4+Q7
    { from: 'p95', to: 'p96', type: 'sequential' },     // P96 reads P95 SpecBundle
    { from: 'planning', to: 'p98', type: 'gate' },      // P98 gates on Q3
    { from: 'planning', to: 'p99', type: 'parallel' },  // P99 ready (no Q-gate)
    // RC gate consumes ALL body sprints
    { from: 'p95', to: 'rc-gate', type: 'sequential' },
    { from: 'p96', to: 'rc-gate', type: 'sequential' },
    { from: 'p97', to: 'rc-gate', type: 'sequential' },
    { from: 'p98', to: 'rc-gate', type: 'sequential' },
    { from: 'p99', to: 'rc-gate', type: 'sequential' },
    { from: 'p100w2', to: 'rc-gate', type: 'sequential' },
    // RC seal → release sequence (Band 3 strictly sequential)
    { from: 'rc-gate', to: 'p101', type: 'gate' },      // gates on Q5
    { from: 'p101', to: 'p102', type: 'sequential' },
    { from: 'p102', to: 'p103', type: 'sequential' },   // gates on composite ≥80
    { from: 'p103', to: 'p104', type: 'sequential' },
  ],
  activeNodeId: 'planning',
}
```

**Node count: 14** (1 sealed P94 + 1 in-flight planning diamond + 1 conditional P94b + 6 body-sprint nodes P95-P100W2 + 1 RC-gate diamond + 4 release-sequence nodes P101-P104). **Edge count: 19** (3 sequential within planning gate; 5 parallel/gate fan-out; 6 sequential into RC gate; 4 release-sequence + 1 RC-gate diamond exit).

---

## §3 Per-phase node detail

Per-phase expansion into sprint+wave+agent breakdown. Bounded-context tags from A3 §3.

### P95 — SpecWorkbench
- **Status:** planned (BLOCKED on Q1 layout + Q6 recipe depth per A1/A2/A3)
- **Bounded contexts:** ui-shell + intelligence + specification + planning (A3 §3)
- **Sprints:** 1 (composer + dual-view shell + atom card + Planning tab mount in single sprint)
- **Waves per sprint:** 2 (Wave 1 parallel — composer + shell + ADR-121 + tests skeleton; Wave 2 sequential — atom card + Planning.tsx wire + closer)
- **Agents per wave:** Wave 1 = 3 (P95-A1 specComposer / P95-A2 SpecWorkbench shell / P95-A4 ADR-121 + tests + EOP closer skeleton); Wave 2 = 2 (P95-A3 AtomCard + Planning.tsx wire / P95-A5 closer final-sync)
- **DoD checklist:** ADR-121 Accepted; SpecWorkbench renders all 8 atoms; mobile fallback (responsive C per Q1 recommendation); tests ≥15; KISS denylist passes (no `classify*` import in P95 src); EOP triplet
- **Gate items:** ADR-121 authored; Q1+Q6 owner-resolved BEFORE dispatch; AISP spec per §4 P95-A1/A2/A3 blocks

### P96 — Export Claude Code
- **Status:** planned (BLOCKED on Q2 export target per A1/A2/A3)
- **Bounded contexts:** specification + intelligence + ui-shell + planning (A3 §3)
- **Sprints:** 1
- **Waves per sprint:** 2 (Wave 1 parallel — bundler + zipBuilder + golden-fixture + ADR-122; Wave 2 sequential — button + Planning.tsx wire + closer)
- **Agents per wave:** Wave 1 = 4 (P96-A1 claudeCodeBundle / P96-A2 zipBuilder / P96-A3 golden fixture + ADR-122 / P96-A4 closer skeleton); Wave 2 = 2 (P96-A5 ExportButton + Planning.tsx wire / P96-A6 closer final-sync)
- **DoD checklist:** ADR-122 Accepted; golden-file equality vs `examples/3rd-party-consumer/golden-bundle/`; 5-line "hello world" agent dispatches without manual edit; bundle-shape Zod schema validates; tests ≥15; EOP triplet
- **Gate items:** ADR-122 authored; Q2 owner-resolved (recommendation A = ZIP via Blob); P95 SEALED (P96 reads SpecBundle); AISP spec per §4 P96-A1/A2 blocks

### P97 — TDD Scaffold Generator
- **Status:** planned (READY — no Q-gate)
- **Bounded contexts:** intelligence + filesystem (build-time only; no runtime cross-context)
- **Sprints:** 1
- **Waves per sprint:** 1 (single wave; 4 agents file-disjoint)
- **Agents per wave:** 4 (P97-A1 tddScaffold pure / P97-A2 scaffoldWriter + namespace anchor / P97-A3 ADR-123 + vitest config exclude / P97-A4 closer)
- **DoD checklist:** ADR-123 Accepted; namespace isolation (`tests/scaffold/**` excluded from CI gate); existsSync no-overwrite; ≥1 scaffold per atom (8 minimum); tests ≥10; EOP triplet
- **Gate items:** ADR-123 authored; CI exclude pattern verified; AISP spec per §4 P97-A1 block

### P98 — KISS Reviewer
- **Status:** planned (BLOCKED on Q3 findings render surface per A1/A2/A3)
- **Bounded contexts:** intelligence + ui-shell + (conditional agentics if Q3=B per A3 §3)
- **Sprints:** 1
- **Waves per sprint:** 1 (single wave; 3 agents file-disjoint)
- **Agents per wave:** 3 (P98-A1 reviewerPrompt / P98-A2 reviewerSchema + ADR-124 / P98-A3 closer)
- **DoD checklist:** ADR-124 Accepted; Σ R1 scope guard (reject paths outside `AgentSpec.ownedFiles`) verified; Zod schema validates; severity ∈ {blocker, major, minor}; prompt cap ≤4096 chars; tests ≥12; EOP triplet
- **Gate items:** ADR-124 authored; Q3 owner-resolved (recommendation B = Agentics tab); AISP spec per §4 P98-A1 block

### P99 — Seal Panel
- **Status:** planned (READY — no Q-gate)
- **Bounded contexts:** agentics + intelligence + ui-shell (A3 §3)
- **Sprints:** 1
- **Waves per sprint:** 1 (single wave; 4 agents file-disjoint)
- **Agents per wave:** 4 (P99-A1 SealPanel.tsx / P99-A2 markdownEmitter + fileWriter / P99-A3 Agentics.tsx wire + retire stale badge + ADR-125 / P99-A4 closer)
- **DoD checklist:** ADR-125 Accepted; existsSync no-overwrite on session-log writes; markdown diffability; DoD row count = `AgentSpec.dod.length`; stale "Coming soon · P92-P100" badge retired from `Agentics.tsx:19`; tests ≥12; EOP triplet
- **Gate items:** ADR-125 authored; AISP spec per §4 P99-A1/A2 blocks

### P100 W2 — Log Build
- **Status:** planned (BLOCKED on Q4 migration plan + Q7 personality compute-all per A1/A2/A3)
- **Bounded contexts:** persistence + intelligence + ui-shell + planning (largest cross-context phase per A3 §3)
- **Sprints:** 1 (large; could split if owner picks Q4=B/C)
- **Waves per sprint:** 3 (Wave 1 parallel — 5 migrations file-disjoint; Wave 2 parallel — 5 repositories file-disjoint; Wave 3 sequential — wiring edits to chatPipeline/PlanningChatBar/Planning/ConversationLogTab + ADR-126 + closer)
- **Agents per wave:** Wave 1 = 5 (P100W2-A1..A5 per migration 005-009); Wave 2 = 5 (P100W2-A6..A10 per repo); Wave 3 = 3 (P100W2-A11 chatPipeline+helpers / P100W2-A12 PlanningChatBar+Planning hydration / P100W2-A13 ConversationLogTab drill-down + ADR-126 + closer)
- **DoD checklist:** ADR-126 Accepted; additive migrations only (no `ALTER` on existing tables); existing-state round-trip test passes (R3 mitigation); drill-down renders 11 categories; `request_id` mint hoisted to `chatPipeline.ts:271` (R8 mitigation); tests ≥20; EOP triplet
- **Gate items:** ADR-126 authored; Q4+Q7 owner-resolved (recommendations A+A); AISP spec deferred per A2 §5 (log infra is sink, not atom)

### P101 — Agentic Workbench RC
- **Status:** planned (BLOCKED on Q5 RC rollout per A1/A2/A3)
- **Bounded contexts:** ALL 6 (full system seal per A3 §3)
- **Sprints:** 1
- **Waves per sprint:** 2 (Wave 1 parallel — 4 reviewer perspectives; Wave 2 sequential — fix-pass + ADR-127 + closer)
- **Agents per wave:** Wave 1 = 4 (P101-A1 UX / P101-A2 Functionality / P101-A3 Security / P101-A4 Architecture); Wave 2 = 1-3 depending on must-fix volume (P101-A5 fix-pass coordinator + ADR-127 + closer)
- **DoD checklist:** ADR-127 Accepted; 4 review docs all ≤600 LOC; recursive must-fix passes ≤3; composite ≥80 (ADR-094 floor — RC blocker); zero open blockers post fix-pass round 3; tests ≥15; EOP triplet
- **Gate items:** ADR-127 authored; Q5 owner-resolved (recommendation A = all-on at tag); ALL body sprints (P95-P100W2) SEALED before dispatch; AISP spec per §4 P101-A1..A4 blocks

### P102 — Final QA + persona re-score
- **Status:** planned (READY post-P101 — no Q-gate)
- **Bounded contexts:** ui-shell + specification (scoring rubric reads rendered surfaces; A3 §3)
- **Sprints:** 1
- **Waves per sprint:** 2 (Wave 1 parallel — 3 personas; Wave 2 sequential — composite + ADR-128 + closer)
- **Agents per wave:** Wave 1 = 3 (P102-A1 Grandma / P102-A2 Framer / P102-A3 Capstone); Wave 2 = 1 (P102-A4 composite scorer + ADR-128 + closer; conditionally spawns P102b if any persona <78)
- **DoD checklist:** ADR-128 Accepted; composite ≥80 (ADR-094 floor); per-persona rubric scored against ADR-094 + ADR-127; tests ≥8; EOP triplet
- **Gate items:** ADR-128 authored; P101 SEALED; (conditional P102b polish trigger if any persona <78)

### P103 — v2.0.0 release artifacts
- **Status:** planned (READY post-P102; mirrors P84 / OC-18 pattern — no Q-gate)
- **Bounded contexts:** specification (CHANGELOG + release notes + Show HN + PH + demo script + owner-launch-checklist v2 in `docs/launch/`; A3 §3)
- **Sprints:** 1
- **Waves per sprint:** 2 (Wave 1 parallel — 6 launch artifacts file-disjoint; Wave 2 sequential — ADR-129 + tests + closer)
- **Agents per wave:** Wave 1 = 6 (P103-A1..A6 per artifact); Wave 2 = 1 (P103-A7 ADR-129 + tests + closer)
- **DoD checklist:** ADR-129 Accepted; CHANGELOG section P85→P104 appended; demo-script ≤180 LOC; owner-launch-checklist v2 ≤80 LOC; tests ≥12; EOP triplet
- **Gate items:** ADR-129 authored; P102 composite ≥80; AISP spec NOT applicable per A2 §5

### P104 — v2.0.0-RC1 public launch (TERMINAL)
- **Status:** planned (READY post-P103 — owner-led)
- **Bounded contexts:** none in source (owner-led tag + posts + beta dispatch + AISP campaign; A3 §3)
- **Sprints:** 1 (Claude-side surface tiny)
- **Waves per sprint:** 1
- **Agents per wave:** 2 (P104-A1 CLAUDE.md final v2.0.0-RC1 sync row / P104-A2 arc-close retro)
- **DoD checklist:** CLAUDE.md final sync row appended; arc-close retro at `plans/implementation/phase-104/retrospective.md`; owner-side tag + posts + beta + AISP campaign documented as carry-forward
- **Gate items:** P103 SEALED; owner-launch-checklist v2 actioned; AISP spec NOT applicable

---

## §4 AISP Σ system prompts per agent task

12 Σ blocks below. One per major agent task across P95-P101 (BLOCKED phases marked TENTATIVE). P100 W2 gets 2 representative blocks per A2 §5 deferral note (log infra is sink, not atom — but per-component blocks needed for closer hand-off). P102-P104 process tasks SKIPPED per A2 §5.

#### P95-A1 — specComposer (TENTATIVE — pending Q1+Q6)
- **Owns:** `src/contexts/intelligence/aisp/specComposer.ts` (NEW; ≤300 LOC)
- **Σ contract:**
  - Ω := { Compose 8 atom outputs into a single SpecBundle for dual-view render }
  - Σ := { input: { intent, assumptions, selection, content, patch, decomp, process, ddd, agent }, output: SpecBundle { atoms: AtomTrace[], humanProse: string } }
  - Γ := { R1: pure read-only function; R2: zero `classify*` import (KISS denylist); R3: SpecBundle.atoms.length === 8 (one per atom); R4: humanProse ≤ 200 words per atom section }
  - Λ := { atoms ordered by execution sequence (intent → assumptions → selection → content → patch → decomp → process → ddd → agent) }
  - Ε := { V1: VERIFY 8 atoms render without error; V2: VERIFY no classify* import; V3: VERIFY SpecBundle Zod schema }
- **Inputs:** atom output types from `src/contexts/intelligence/aisp/{intentAtom,assumptionsAtom,templateSelector,contentAtom,decompAtom,processAtom,dddAtom,agentAtom}.ts`
- **Outputs:** `src/contexts/intelligence/aisp/specComposer.ts`
- **DoD:** Pure function (no side effects); 8 atoms render; KISS denylist passes

#### P95-A2 — SpecWorkbench shell (TENTATIVE — pending Q1)
- **Owns:** `src/components/spec/SpecWorkbench.tsx` (NEW; ≤300 LOC)
- **Σ contract:**
  - Ω := { Render dual-view spec composer; desktop side-by-side / mobile auto-collapses to toggle (Q1=C recommendation) }
  - Σ := { props: { bundle: SpecBundle }, view: 'aisp' | 'human' | 'dual', viewport: 'desktop' | 'mobile' }
  - Γ := { R1: dual-view default desktop (≥768px); R2: mobile single-pane fallback with toggle; R3: per-atom collapsible card (lazy via Suspense per ADR-102); R4: 44px WCAG touch targets (per ADR-090) }
  - Λ := { responsive hybrid via media query; toggle persists in uiStore }
  - Ε := { V1: VERIFY desktop side-by-side at ≥768px; V2: VERIFY mobile single-pane at <768px; V3: VERIFY ARIA tablist on view toggle }
- **Inputs:** `SpecBundle` from P95-A1 specComposer
- **Outputs:** `src/components/spec/SpecWorkbench.tsx`
- **DoD:** Renders all 8 atoms; mobile fallback verified; ADR-091 hover-lift + focus-visible

#### P95-A3 — AtomCard component (TENTATIVE — pending Q1)
- **Owns:** `src/components/spec/AtomCard.tsx` (NEW; ≤120 LOC)
- **Σ contract:**
  - Ω := { Render single atom as collapsible card with Σ symbol + 1-line summary + human prose }
  - Σ := { props: { atom: AtomTrace }, expanded: boolean }
  - Γ := { R1: shows Σ symbol header (e.g. "INTENT_ATOM"); R2: 1-line summary collapsed; R3: human prose expanded; R4: token-derived spacing/colors per ADR-087 }
  - Λ := { collapsed default; click → expand }
  - Ε := { V1: VERIFY Σ + summary render; V2: VERIFY expand/collapse keyboard accessible; V3: VERIFY 8 atom variants supported }
- **Inputs:** AtomTrace shape (defined in P95-A1)
- **Outputs:** `src/components/spec/AtomCard.tsx`
- **DoD:** 8 atom variants rendered; keyboard accessible; token compliance

#### P96-A1 — claudeCodeBundle (TENTATIVE — pending Q2)
- **Owns:** `src/contexts/intelligence/export/claudeCodeBundle.ts` (NEW; ≤250 LOC)
- **Σ contract:**
  - Ω := { Bundle SpecBundle into Claude-Code-consumable file map }
  - Σ := { input: SpecBundle, output: { 'CLAUDE.md', 'swarm.json', 'docs/adr/ADR-XXX-stub.md', 'README.md' } }
  - Γ := { R1: bundle dispatches 5-line "hello world" agent without manual edit; R2: ADR stub carries cross-refs to source ADRs; R3: swarm.json one entry per `AgentSpec` from AGENT_ATOM; R4: CLAUDE.md auto-generated from spec composer output }
  - Λ := { pure function; deterministic file ordering for golden-file equality }
  - Ε := { V1: VERIFY golden-file equality vs `examples/3rd-party-consumer/golden-bundle/`; V2: VERIFY 5-line hello-world dispatches in stub sandbox; V3: VERIFY bundle-shape Zod schema }
- **Inputs:** `SpecBundle` from P95; `AgentSpec[]` from `agentAtom.ts:31`
- **Outputs:** `src/contexts/intelligence/export/claudeCodeBundle.ts`
- **DoD:** Golden-file test passes; 5-line hello-world test passes; Zod schema validates

#### P96-A2 — zipBuilder (TENTATIVE — pending Q2=A)
- **Owns:** `src/contexts/intelligence/export/zipBuilder.ts` (NEW; ≤120 LOC)
- **Σ contract:**
  - Ω := { Emit Blob ZIP from file map (mirrors `shareSpecBundle.ts` P78 pattern) }
  - Σ := { input: Record<string, string>, output: Blob }
  - Γ := { R1: ZIP MIME type `application/zip`; R2: directory structure preserved; R3: file content UTF-8 encoded; R4: no external dep beyond browser-native (or single shipped lib) }
  - Λ := { Blob download via existing P78 pattern }
  - Ε := { V1: VERIFY ZIP roundtrip (extract = original file map); V2: VERIFY no extra deps in package.json; V3: VERIFY MIME type }
- **Inputs:** file map from P96-A1
- **Outputs:** `src/contexts/intelligence/export/zipBuilder.ts`
- **DoD:** ZIP roundtrip; KISS no-new-deps; MIME type set

#### P97-A1 — tddScaffold (READY)
- **Owns:** `src/contexts/intelligence/scaffold/tddScaffold.ts` (NEW; ≤200 LOC)
- **Σ contract:**
  - Ω := { Auto-emit Playwright test scaffold from AISP Γ rules + DoD checklist; one describe per Γ rule + one it per DoD bullet }
  - Σ := { input: AgentSpec | AtomTrace, output: ScaffoldFile { path, source }, framework: 'playwright' }
  - Γ := { R1: scaffold writes ONLY to `tests/scaffold/<atom>.spec.ts` namespace; R2: existsSync guard — never overwrite existing scaffold; R3: ≥1 scaffold per atom (8 atoms minimum coverage); R4: CI excludes `tests/scaffold/**` from gate-blocking pass }
  - Λ := { Playwright primary; Vitest secondary }
  - Ε := { V1: VERIFY namespace isolation; V2: VERIFY no overwrite on second emit; V3: VERIFY all 8 atom scaffolds emit }
- **Inputs:** `AgentSpec` from `agentAtom.ts:31`; `AtomTrace` from P95-A1
- **Outputs:** `src/contexts/intelligence/scaffold/tddScaffold.ts`
- **DoD:** Namespace isolation; existsSync no-overwrite; 8-atom coverage

#### P98-A1 — reviewerPrompt (TENTATIVE — pending Q3)
- **Owns:** `src/contexts/intelligence/review/reviewerPrompt.ts` (NEW; ≤180 LOC)
- **Σ contract:**
  - Ω := { Generate brutal-honest reviewer prompt scoped to AgentSpec.ownedFiles + DoD; surface findings per Q3 channel }
  - Σ := { input: AgentSpec, output: ReviewerPrompt { systemPrompt, scope, schema }, findings: { severity: 'blocker'|'major'|'minor', file, line?, why, fix }[] }
  - Γ := { R1: reviewer scope MUST NOT include paths outside `AgentSpec.ownedFiles` (Σ-contract-as-ACL per A3 §3); R2: findings schema-validated via Zod; R3: severity ∈ {blocker, major, minor}; R4: prompt cap ≤ 4096 chars (LLM context safety per CONTENT_ATOM `:135`) }
  - Λ := { Findings render: chat (Q3=A) | Agentics tab (Q3=B) | persona (Q3=C) }
  - Ε := { V1: VERIFY scope guard rejects paths outside ownedFiles; V2: VERIFY schema validates; V3: VERIFY prompt-injection mitigation (Σ contract scoping) }
- **Inputs:** `AgentSpec` from `agentAtom.ts:31`
- **Outputs:** `src/contexts/intelligence/review/reviewerPrompt.ts`
- **DoD:** Scope guard rejects out-of-scope; Zod schema validates; prompt cap enforced

#### P99-A1 — SealPanel UI (READY)
- **Owns:** `src/components/seal/SealPanel.tsx` (NEW; ≤250 LOC)
- **Σ contract:**
  - Ω := { Agentics-mode tab rendering "Standard Phase Process" steps 2-4 as DoD checklist + session-log emit button }
  - Σ := { props: { phase: { id, dod: string[] } }, state: 'draft'|'ready'|'sealed' }
  - Γ := { R1: DoD rows derived from `AgentSpec.dod` (canonical source); R2: row count === `AgentSpec.dod.length`; R3: token-derived spacing/colors per ADR-087; R4: tab mounted in Agentics mode (NOT Whiteboard, NOT Planning) per ADR-116 }
  - Λ := { rows render top-down in canonical order (no UI reorder per A2 §6 strike #5) }
  - Ε := { V1: VERIFY row count === dod.length; V2: VERIFY token compliance; V3: VERIFY mount in Agentics only }
- **Inputs:** `AgentSpec.dod` from `agentAtom.ts:31`
- **Outputs:** `src/components/seal/SealPanel.tsx`
- **DoD:** Renders DoD checklist; Agentics-mode mount; token compliance

#### P99-A2 — markdownEmitter (READY)
- **Owns:** `src/contexts/intelligence/seal/markdownEmitter.ts` (NEW; ≤180 LOC)
- **Σ contract:**
  - Ω := { Emit `session-log.md` + `retrospective.md` markdown stubs from SealState }
  - Σ := { input: SealState, output: { 'session-log.md': string, 'retrospective.md': string } }
  - Γ := { R1: deterministic ordering (diffable across runs); R2: existsSync guard via fileWriter (Σ R2 — never overwrites existing); R3: append-only on existing files; R4: full emit on new }
  - Λ := { pure function; filesystem write delegated to fileWriter helper }
  - Ε := { V1: VERIFY existsSync no-overwrite; V2: VERIFY markdown diffable across two runs same input; V3: VERIFY append-only on existing }
- **Inputs:** SealState shape (defined in P99-A1)
- **Outputs:** `src/contexts/intelligence/seal/markdownEmitter.ts`
- **DoD:** Pure emitter; existsSync guard; markdown diffable

#### P100W2-A11 — chatPipeline request_id mint (TENTATIVE — pending Q4+Q7)
- **Owns:** `src/contexts/intelligence/chatPipeline.ts` (EDIT — surgical at `:271`); NEW helper `src/contexts/intelligence/log/requestIdMint.ts` (per A2 §7 + A3 §3 ACL recommendation)
- **Σ contract:**
  - Ω := { Hoist request_id mint to chatPipeline submit-entry (R8 mitigation per A1 §5); thread through all stage emits }
  - Σ := { mint: () => RequestId, threaded: { intent_stage, assumptions_stage, selection_stage, content_stage, patch_stage, decomp_stage, process_stage, ddd_stage, agent_stage } }
  - Γ := { R1: mint at `:271` BEFORE any throw site (R8); R2: extract into separate helper module to keep chatPipeline edit minimal (per A3 §3 ACL); R3: every persist call carries request_id; R4: `recordPipelineFailure` orphans eliminated (log-design §6 finding 7) }
  - Λ := { mint once per submit; thread via closure }
  - Ε := { V1: VERIFY request_id present in every stage emit; V2: VERIFY no orphan failure rows; V3: VERIFY chatPipeline edit ≤30 LOC }
- **Inputs:** existing `chatPipeline.ts:271` submit-entry
- **Outputs:** edited `chatPipeline.ts`; new `src/contexts/intelligence/log/requestIdMint.ts`
- **DoD:** request_id threaded through 12 stages; no orphan failures; ≤30 LOC chatPipeline edit

#### P100W2-A12 — atomOutputs persistence (TENTATIVE — pending Q4)
- **Owns:** `src/components/planning/PlanningChatBar.tsx` (EDIT); `src/pages/Planning.tsx` (EDIT — hydrate on mount)
- **Σ contract:**
  - Ω := { Persist PROCESS_ATOM + DDD_ATOM outputs via atomOutputs repo on submit; hydrate `liveMap`/`liveDomainModel` from latest atomOutputs row on Planning mount }
  - Σ := { persist: (atom, output) => atomOutputs.create(...), hydrate: () => atomOutputs.latestByAtom(atomId) }
  - Γ := { R1: persistence call after classify call (no UI lag); R2: hydrate before initial render (no flash of empty state); R3: backward-compat — empty atomOutputs table still renders sample map (P91); R4: no breaking change to Planning.tsx existing logic }
  - Λ := { write-after-classify; read-on-mount }
  - Ε := { V1: VERIFY persist round-trip; V2: VERIFY hydrate without flash; V3: VERIFY empty-table fallback }
- **Inputs:** `Planning.tsx liveMap/liveDomainModel` state; new atomOutputs repo from P100W2-A10
- **Outputs:** edited `PlanningChatBar.tsx` + `Planning.tsx`
- **DoD:** PROCESS+DDD persist; hydrate on mount; empty fallback

#### P101-A1 — UX reviewer (TENTATIVE — pending Q5)
- **Owns:** `plans/implementation/phase-101/reviews/ux-review.md` (NEW; ≤600 LOC per A2 §2)
- **Σ contract:**
  - Ω := { Brutal-honest UX review of Whiteboard + Planning + Agentics modes; identify must-fix UX blockers }
  - Σ := { surfaces: ['/', '/planning', '/agentics'], findings: { severity, surface, why, fix }[], composite: number }
  - Γ := { R1: cover all 3 modes; R2: per-finding severity ∈ {blocker, major, minor}; R3: ≤600 LOC per A2 §2; R4: Grandma + Framer persona lens applied }
  - Λ := { parallel with P101-A2/A3/A4 in Wave 1 (all 4 reviewers run concurrently) }
  - Ε := { V1: VERIFY all 3 modes covered; V2: VERIFY composite numeric; V3: VERIFY ≤600 LOC }
- **Inputs:** sealed P95-P100W2 surfaces
- **Outputs:** `plans/implementation/phase-101/reviews/ux-review.md`
- **DoD:** 3 modes covered; composite ≥80 floor; ≤600 LOC

**AISP Σ block count: 12** (3 P95 + 2 P96 + 1 P97 + 1 P98 + 2 P99 + 2 P100W2 + 1 P101). P102-P104 process tasks SKIPPED per A2 §5 closing note.

---

## §5 Swarm coordination plan

Per A2 §4 parallel/sequential bands and A2 §7 file-conflict map. Hierarchical topology / specialized strategy / raft consensus per CLAUDE.md.

### P95 dispatch (TENTATIVE — pending Q1+Q6)
- **Wave 1 (parallel; 3 agents):** P95-A1 specComposer (`src/contexts/intelligence/aisp/specComposer.ts`); P95-A2 SpecWorkbench shell (`src/components/spec/SpecWorkbench.tsx`); P95-A4 ADR-121 + tests skeleton + EOP (`docs/adr/ADR-121-spec-workbench.md` + `tests/p95-spec-workbench.spec.ts` + EOP triplet)
- **Wave 2 (sequential; 2 agents):** P95-A3 AtomCard + Planning.tsx wire (`src/components/spec/AtomCard.tsx` + `src/pages/Planning.tsx` EDIT — adds Spec tab); P95-A5 closer final-sync (CLAUDE.md sync row)
- **File-conflict map:** `src/pages/Planning.tsx` — Wave 2 only (P95-A3); CLAUDE.md — Wave 2 closer only (P95-A5)
- **Estimated wall-clock:** 30-45 min at observed velocity (per CLAUDE.md velocity rule)

### P96 dispatch (TENTATIVE — pending Q2)
- **Wave 1 (parallel; 4 agents):** P96-A1 claudeCodeBundle (`src/contexts/intelligence/export/claudeCodeBundle.ts`); P96-A2 zipBuilder (`src/contexts/intelligence/export/zipBuilder.ts`); P96-A3 golden fixture + ADR-122 (`examples/3rd-party-consumer/golden-bundle/` + `docs/adr/ADR-122-export-claude-code.md`); P96-A4 tests skeleton + EOP closer skeleton (`tests/p96-export-roundtrip.spec.ts`)
- **Wave 2 (sequential; 2 agents):** P96-A5 ExportClaudeCodeButton + Planning.tsx wire (`src/components/spec/ExportClaudeCodeButton.tsx` + `src/pages/Planning.tsx` EDIT — mounts button on Spec tab); P96-A6 closer final-sync
- **File-conflict map:** `src/pages/Planning.tsx` — Wave 2 only AFTER P95 fully sealed (file shared across phases); CLAUDE.md — Wave 2 closer only
- **Estimated wall-clock:** 45-60 min at observed velocity

### P97 dispatch (READY)
- **Wave 1 (parallel; 4 agents):** P97-A1 tddScaffold (`src/contexts/intelligence/scaffold/tddScaffold.ts`); P97-A2 scaffoldWriter + namespace anchor (`src/contexts/intelligence/scaffold/scaffoldWriter.ts` + `tests/scaffold/.gitkeep` + `tests/scaffold/README.md`); P97-A3 ADR-123 + vitest config exclude (`docs/adr/ADR-123-tdd-scaffold.md` + `vitest.config.ts` EDIT — exclude pattern); P97-A4 tests + EOP closer (`tests/p97-tdd-scaffold.spec.ts` + EOP triplet)
- **File-conflict map:** `vitest.config.ts` — single touch by P97-A3 only; CLAUDE.md — closer only
- **Estimated wall-clock:** 30-45 min

### P98 dispatch (TENTATIVE — pending Q3)
- **Wave 1 (parallel; 3 agents):** P98-A1 reviewerPrompt (`src/contexts/intelligence/review/reviewerPrompt.ts`); P98-A2 reviewerSchema + ADR-124 (`src/contexts/intelligence/review/reviewerSchema.ts` + `docs/adr/ADR-124-kiss-reviewer.md`); P98-A3 tests + (conditional) findings render surface + EOP closer (`tests/p98-kiss-reviewer.spec.ts` + Q3-conditional surface)
- **File-conflict map:** Q3=B branch touches `src/pages/Agentics.tsx` (potential conflict with P99 — P98 dispatches AFTER P99 if Q3=B); CLAUDE.md — closer only
- **Estimated wall-clock:** 30-45 min

### P99 dispatch (READY)
- **Wave 1 (parallel; 4 agents):** P99-A1 SealPanel.tsx (`src/components/seal/SealPanel.tsx`); P99-A2 markdownEmitter + fileWriter (`src/contexts/intelligence/seal/markdownEmitter.ts` + `src/contexts/intelligence/seal/fileWriter.ts`); P99-A3 Agentics.tsx wire + retire stale badge + ADR-125 (`src/pages/Agentics.tsx` EDIT — mount Seal Panel + retire `:19` badge + `docs/adr/ADR-125-seal-panel.md`); P99-A4 tests + EOP closer (`tests/p99-seal-panel.spec.ts`)
- **File-conflict map:** `src/pages/Agentics.tsx` — P99-A3 only (sole touch); CLAUDE.md — closer only
- **Estimated wall-clock:** 30-45 min

### P100W2 dispatch (TENTATIVE — pending Q4+Q7)
- **Wave 1 (parallel; 5 agents):** P100W2-A1..A5 — 5 migrations (`migrations/005-009-*.sql`)
- **Wave 2 (parallel; 5 agents):** P100W2-A6..A10 — 5 repositories (`src/contexts/persistence/repositories/{requestEnvelopes,stageEvents,decompTraces,listenCaptures,atomOutputs}.ts`)
- **Wave 3 (sequential; 3 agents):** P100W2-A11 chatPipeline edit + requestIdMint helper; P100W2-A12 PlanningChatBar+Planning hydration; P100W2-A13 ConversationLogTab drill-down + ADR-126 + tests + EOP closer
- **File-conflict map:** `chatPipeline.ts` — Wave 3 single touch (P100W2-A11); `Planning.tsx` — Wave 3 single touch AFTER P95 + P96 sealed (P100W2-A12); `ConversationLogTab.tsx` — Wave 3 single touch (P100W2-A13); CLAUDE.md — Wave 3 closer only
- **Estimated wall-clock:** 90-120 min (largest phase per A3 §3)

### P101 dispatch (TENTATIVE — pending Q5)
- **Wave 1 (parallel; 4 agents):** P101-A1 UX review; P101-A2 Functionality review; P101-A3 Security review; P101-A4 Architecture review (all 4 write to disjoint `plans/implementation/phase-101/reviews/*-review.md`)
- **Wave 2 (sequential; 1-3 agents):** P101-A5 fix-pass coordinator (recursive ≤3 cycles per CLAUDE.md "Standard Phase Process" §5); ADR-127 + tests + EOP closer at end
- **File-conflict map:** Wave 1 = 4 disjoint review docs (no conflict); Wave 2 fix-pass touches whatever Wave 1 surfaces (sequential single-agent); CLAUDE.md — closer only
- **Estimated wall-clock:** 60-90 min Wave 1; 60-180 min Wave 2 (depends on must-fix volume)

**SKIPPED:** P102-P104 dispatch (separate session when owner unblocks Q5/post-RC; release sequence is Band 3 strictly sequential).

---

## §6 Memory + ruvector entries

Per CLAUDE.md ruvector convention (manual snapshot per ADR-070); 126 entries baseline. ~5 LOC per phase below.

### P95 SpecWorkbench seal
- ruvector entry: pattern category "agentic-workbench-ui"
  - text: "SpecWorkbench dual-view {layout choice from Q1} renders 8 atoms"
  - tags: P95, ADR-121, dual-view, AISP-visibility
  - file:line refs: `src/components/spec/SpecWorkbench.tsx`, `src/pages/Planning.tsx` Spec tab mount

### P96 Export Claude Code seal
- ruvector entry: pattern category "agentic-workbench-export"
  - text: "Export Claude Code emits {Q2 choice} bundle round-trippable into target repo"
  - tags: P96, ADR-122, export, golden-fixture
  - file:line refs: `src/contexts/intelligence/export/claudeCodeBundle.ts`, `examples/3rd-party-consumer/golden-bundle/`

### P97 TDD Scaffold seal
- ruvector entry: pattern category "agentic-workbench-tdd"
  - text: "TDD scaffold auto-emits Playwright tests from AISP Γ rules + DoD"
  - tags: P97, ADR-123, scaffold, namespace-isolation
  - file:line refs: `src/contexts/intelligence/scaffold/tddScaffold.ts`, `tests/scaffold/`

### P98 KISS Reviewer seal
- ruvector entry: pattern category "agentic-workbench-review"
  - text: "Reviewer prompt scoped to AgentSpec.ownedFiles via Σ R1 scope guard"
  - tags: P98, ADR-124, reviewer, scope-guard
  - file:line refs: `src/contexts/intelligence/review/reviewerPrompt.ts`

### P99 Seal Panel seal
- ruvector entry: pattern category "agentic-workbench-seal"
  - text: "Seal Panel renders DoD checklist from AgentSpec.dod; existsSync no-overwrite"
  - tags: P99, ADR-125, seal-panel, agentics-mode
  - file:line refs: `src/components/seal/SealPanel.tsx`, `src/pages/Agentics.tsx`

### P100W2 Log build seal
- ruvector entry: pattern category "agentic-workbench-log"
  - text: "5 additive migrations 005-009; request_id mint hoisted to chatPipeline:271"
  - tags: P100W2, ADR-126, log-system, request-id, additive-migrations
  - file:line refs: `src/contexts/persistence/migrations/005-009*.sql`, `src/contexts/intelligence/log/requestIdMint.ts`

### P101 RC seal
- ruvector entry: pattern category "agentic-workbench-rc"
  - text: "Agentic Workbench v2.0.0-RC1; 4-reviewer pass composite ≥80; {Q5 rollout}"
  - tags: P101, ADR-127, RC, composite-floor
  - file:line refs: `plans/implementation/phase-101/reviews/`, `docs/adr/ADR-127-agentic-workbench-rc.md`

EACH phase additionally appends ADR ledger update in CLAUDE.md + EOP triplet at `plans/implementation/phase-N/`.

---

## §7 Gate conditions per phase

Explicit gate items the closer agent verifies before sealing.

### P95 gate
- [ ] Q1 + Q6 owner-resolved (per A1 §6)
- [ ] All A2 P95-T1..T6 tasks complete (atomic checkboxes)
- [ ] ADR-121 authored + Status: Accepted
- [ ] tsc --noEmit + tsc -p tsconfig.app.json both clean
- [ ] ≥15 tests on `tests/p95-spec-workbench.spec.ts`
- [ ] KISS denylist test passes (no `classify*` import in P95 src)
- [ ] Mobile fallback verified (375px viewport)
- [ ] EOP triplet at `plans/implementation/phase-95/`
- [ ] CLAUDE.md surgical sync (ADRs 120→121; tests cumulative; capabilities entry)
- [ ] Cumulative session OC chain regression GREEN (≥1162 baseline + 15 P95)

### P96 gate
- [ ] Q2 owner-resolved (per A1 §6)
- [ ] P95 SEALED (P96 reads SpecBundle)
- [ ] All A2 P96-T1..T7 tasks complete
- [ ] ADR-122 authored + Status: Accepted
- [ ] Golden-file equality test passes vs `examples/3rd-party-consumer/golden-bundle/`
- [ ] 5-line "hello world" agent dispatches without manual edit (R2 mitigation)
- [ ] tsc clean
- [ ] ≥15 tests on `tests/p96-export-roundtrip.spec.ts`
- [ ] EOP triplet at `plans/implementation/phase-96/`
- [ ] CLAUDE.md sync (ADRs 121→122)
- [ ] Cumulative regression GREEN (≥1177 baseline + 15 P96)

### P97 gate
- [ ] All A2 P97-T1..T6 tasks complete
- [ ] ADR-123 authored + Status: Accepted
- [ ] Namespace isolation verified (`tests/scaffold/**` excluded from CI gate)
- [ ] existsSync no-overwrite verified (second emit no-op)
- [ ] ≥1 scaffold per atom (8 atoms minimum coverage)
- [ ] ≥10 tests on `tests/p97-tdd-scaffold.spec.ts`
- [ ] tsc clean
- [ ] EOP triplet at `plans/implementation/phase-97/`
- [ ] CLAUDE.md sync (ADRs 122→123)
- [ ] Cumulative regression GREEN (≥1192 baseline + 10 P97)

### P98 gate
- [ ] Q3 owner-resolved (per A1 §6)
- [ ] All A2 P98-T1..T5 tasks complete
- [ ] ADR-124 authored + Status: Accepted
- [ ] Σ R1 scope guard rejects paths outside `AgentSpec.ownedFiles` (verified test)
- [ ] Zod findings schema validates
- [ ] Prompt-injection mitigation verified (Σ contract scoping test)
- [ ] ≥12 tests on `tests/p98-kiss-reviewer.spec.ts`
- [ ] tsc clean
- [ ] EOP triplet at `plans/implementation/phase-98/`
- [ ] CLAUDE.md sync (ADRs 123→124)
- [ ] (CONDITIONAL if Q3=C) ADR-073 amendment authored
- [ ] Cumulative regression GREEN (≥1202 baseline + 12 P98)

### P99 gate
- [ ] All A2 P99-T1..T6 tasks complete
- [ ] ADR-125 authored + Status: Accepted
- [ ] Stale "Coming soon · P92-P100" badge retired from `Agentics.tsx:19`
- [ ] existsSync no-overwrite verified on session-log writes
- [ ] Markdown diffability verified (deterministic ordering)
- [ ] DoD row count === `AgentSpec.dod.length` (test)
- [ ] ≥12 tests on `tests/p99-seal-panel.spec.ts`
- [ ] tsc clean
- [ ] EOP triplet at `plans/implementation/phase-99/`
- [ ] CLAUDE.md sync (ADRs 124→125)
- [ ] Cumulative regression GREEN (≥1214 baseline + 12 P99)

### P100W2 gate
- [ ] Q4 + Q7 owner-resolved (per A1 §6)
- [ ] All A2 P100W2-T1..T16 tasks complete
- [ ] ADR-126 authored + Status: Accepted
- [ ] Migrations additive-only verified (no `ALTER` on existing tables — test)
- [ ] Round-trip test on existing kv passes (R3 mitigation)
- [ ] `request_id` mint hoisted to `chatPipeline.ts:271` (R8 mitigation)
- [ ] Drill-down renders 11 categories
- [ ] No orphan `recordPipelineFailure` rows (test)
- [ ] ≥20 tests on `tests/p100w2-log-system.spec.ts`
- [ ] tsc clean
- [ ] EOP triplet at `plans/implementation/phase-100/wave-2/`
- [ ] CLAUDE.md sync (ADRs 125→126)
- [ ] Cumulative regression GREEN (≥1226 baseline + 20 P100W2)

### P101 gate
- [ ] Q5 owner-resolved (per A1 §6)
- [ ] ALL body sprints (P95-P100W2) SEALED
- [ ] All 4 reviewer perspectives ran (Wave 1 parallel)
- [ ] Per-review LOC ≤600 (per A2 §2)
- [ ] Recursive must-fix passes ≤3 cycles
- [ ] Composite ≥80 (ADR-094 floor — RC blocker)
- [ ] Zero open blockers post fix-pass round 3
- [ ] ADR-127 authored + Status: Accepted
- [ ] ≥15 tests on `tests/p101-rc-seal.spec.ts`
- [ ] EOP triplet at `plans/implementation/phase-101/`
- [ ] CLAUDE.md sync (ADRs 126→127)

**SKIPPED:** P102 + P103 + P104 gates (separate session post-RC; release sequence Band 3).

---

## §8 Carry-forward to A5 (Sprint plan + EOP template)

What A5 needs from this doc:

- **§3 per-phase node detail** → A5 expands each into formal phase plans at `plans/implementation/phase-{N}/00-summary.md` + `checklist.md` + `MEMORY.md` per CLAUDE.md "Standard Phase Process" §4 preflight scaffold.
- **§4 AISP Σ blocks** → A5 attaches as system prompts in agent-roster files at `plans/implementation/phase-{N}/agents/{P{N}-A{M}}.md` (per-agent system-prompt files mirroring how P92-P94 dispatched).
- **§5 swarm coordination** → A5 wave structure per phase becomes the dispatch order in phase plans; `plans/implementation/phase-{N}/dispatch.md` lists Wave 1 / Wave 2 / Wave 3 with parallel-vs-sequential markers + file-conflict notes.
- **§6 ruvector entries** → A5 includes in EOP template at `plans/implementation/phase-{N}/03-ruvector-entry.md` (one per phase; manual-snapshot pattern per ADR-070).
- **§7 gate conditions** → A5 includes in DoD checklist per phase; closer agent verifies these explicitly before EOP triplet write.
- **BLOCKED-phase markers** → A5 propagates "BLOCKED on Q{N}" tags into phase-plan summary headers; owner-resolution becomes explicit precondition in `00-summary.md`.
- **Conditional P94b** → A5 drafts P94b plan at `plans/implementation/phase-94b/` with explicit "spawns only if Q6=B" gate.

A5 also synthesizes the FOUR sealed planning docs (00-understanding + 01-decomposition + 02-ddd-adr-plan + 03-process-map = this doc) into a single Planning Sprint retro at `plans/implementation/phase-95/planning-retrospective.md` capturing: (a) what owner needs to resolve before P95 dispatch (Q1+Q6); (b) parallel batch order Band 1 → Band 2 → Band 3; (c) ADR ledger projection 120 → 129; (d) 6 risks (R1-R8 from A1 §5) with mitigation tasks already woven into A2; (e) bounded-context surface stable at 6 (no new contexts per A3 §4).

---

# Report

Section LOC counts: §1≈8, §2≈55 (ProcessMap data literal), §3≈100 (10 phases P95-P104 expanded), §4≈140 (12 AISP Σ blocks), §5≈55 (6 phase dispatches + skipped note), §6≈40 (7 phase ruvector entries), §7≈90 (7 phase gates + skipped note), §8≈12. Total ≈ 500 LOC ≤ 600 cap (whitespace + headers excluded).

ProcessMap node count: **14** (1 sealed P94 reference + 1 in-flight planning diamond + 1 conditional P94b + 6 body-sprint nodes P95-P100W2 + 1 RC-gate diamond + 4 release-sequence nodes P101-P104). Edge count: **19**.

AISP Σ block count in §4: **12** (3 P95 + 2 P96 + 1 P97 + 1 P98 + 2 P99 + 2 P100W2 + 1 P101). P102-P104 process tasks SKIPPED per A2 §5.

Phase gates documented in §7: **7** (P95 + P96 + P97 + P98 + P99 + P100W2 + P101). P102-P104 SKIPPED (Band 3 release sequence; separate session post-RC).

Hard-rule compliance: READ-ONLY (no source / test / ADR / CLAUDE.md edits — only the owned doc artifact at `plans/implementation/phase-95/03-process-map.md` written); doc artifact only ≤600 LOC; ProcessMap data structure valid TypeScript per `ProcessMapSVG.tsx` types (ProcessNode/ProcessEdge/ProcessMap fields verified — id/label/phase/status/x/y/shape? on nodes; from/to/type on edges; activeNodeId? on map; status ∈ {planned|in-flight|sealed|deferred}; type ∈ {sequential|parallel|gate}; shape ∈ {rect|diamond}); BLOCKED phases (P95/P96/P98/P100W2/P101) marked TENTATIVE with Q-gate references; ≥12 AISP Σ blocks in §4 (12 actual; one per major agent task across P95-P101); swarm coordination per phase in §5 (6 phases; P102-P104 skipped per spec); KISS strikes from A2 §6 / A3 §7 NOT included as nodes (10 strikes omitted); no shell commands beyond read/cat/wc/ls/head; all 8 sections (§1-§8) present.
