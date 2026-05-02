# P100 W2 / A6 — Scenario 4 Planning Build Log

**Scenario:** Developer building a SaaS authentication system in Planning mode.
**Owner agent:** A6 (Wave 2 / disjoint scope from A3 Axon, A4 edge cases, A5 listen).
**Mode:** `planning` (Whiteboard / Listen / Agentics modes are NOT exercised here).
**Atoms exercised:** PROCESS_ATOM (ADR-118), DDD_ATOM (ADR-119), AGENT_ATOM (ADR-120),
INTENT_ATOM (ADR-053), SELECTION_ATOM (ADR-057).
**Final output:** `.md` bundle per ADR-122 (Export Claude Code).
**Simulation-only:** no code in `src/` is exercised; this log records what the
W1 / migration-005 wired pipeline WOULD have written to `log_events`.

## Per-prompt log

### Prompt 1 — "I need to build a SaaS authentication system"

- Mode: `planning`
- Atoms: `INTENT`, `PROCESS`
- Pipeline: input → INTENT classifies as project-scaffold → PROCESS_ATOM
  invoked with project-description → emits 4-5 phase plan (foundation /
  schema / auth-flow / sessions; QA appended later in step 3).
- **`process_atom_output` event WRITTEN** with payload:
  `{ phaseCount: 4, sprintCount: 8, waveCount: 8, agentCount: 12 }`.
- ProcessMapSVG re-renders with 4 sequential phase nodes.
- Latency: ~420ms (rules-classifier + map render).
- log_events rows: 4 (input + intent + process + summary).

### Prompt 2 — "Break this into phases"

- Mode: `planning`
- Atoms: `INTENT`, `PROCESS`
- Pipeline: input → INTENT classifies as confirm-decompose → PROCESS_ATOM
  re-emits stable plan (idempotent on confirm — same hash as step 1).
- **`process_atom_output` event WRITTEN** (idempotent re-emit; same payload).
- Owner-visible: SpecWorkbench Human-spec tab refreshes with phase summary text.
- Latency: ~380ms.
- log_events rows: 4.

### Prompt 3 — "Add a phase for testing and QA"

- Mode: `planning`
- Atoms: `INTENT`, `PROCESS`
- Pipeline: input → INTENT classifies as add-phase → PROCESS_ATOM re-runs
  with augmented description → emits 5-phase plan (QA appended at position 4).
- **`process_atom_output` event WRITTEN** with payload:
  `{ phaseCount: 5, sprintCount: 10, waveCount: 10, agentCount: 16 }`.
- ProcessMapSVG re-renders with 5 phase nodes; sprint count climbs to 10.
- Γ R1 (|phases| ≤ 5) — at the cap exactly; further phase-add prompts would
  be REJECTED downstream. Honest declaration in build log.
- Latency: ~410ms.
- log_events rows: 4.

### Prompt 4 — "Generate the DDD bounded contexts"

- Mode: `planning`
- Atoms: `INTENT`, `DDD`
- Pipeline: input → INTENT classifies as generate-domain-model → DDD_ATOM
  invoked with same project description → emits 4 contexts
  (User / Session / Token / Audit) + 4 relationships
  (partnership / customer-supplier / anti-corruption-layer × 2).
- **`ddd_atom_output` event WRITTEN** with payload:
  `{ contextCount: 4, relationshipCount: 4, kinds: ["partnership","customer-supplier","anti-corruption-layer"] }`.
- DomainModelSVG mounts in Planning right panel via PlanningViewToggle
  (process-map ↔ domain-model swap).
- Γ R1 (|contexts| ≤ 8) — well under cap; Γ R4 (4 kinds) — 3 kinds used.
- Latency: ~360ms.
- log_events rows: 4.

### Prompt 5 — "Show me the AISP spec for the auth phase"

- Mode: `planning`
- Atoms: `INTENT`, `SELECTION`
- Pipeline: input → INTENT classifies as render-aisp-spec → SELECTION_ATOM
  picks `auth-flow` phase from the 5-phase plan → SpecWorkbench AISP tab
  renders the verbatim Σ block for the auth-flow phase.
- No new atom output written (SpecWorkbench is a render-only consumer of
  prior PROCESS_ATOM + DDD_ATOM outputs).
- Latency: ~90ms (no atom invocation; React re-render only).
- log_events rows: 3 (input + intent + summary).

### Prompt 6 — "Add an agent scope for the JWT implementation"

- Mode: `planning`
- Atoms: `INTENT`, `AGENT`
- Pipeline: input → INTENT classifies as add-agent-scope → AGENT_ATOM
  invoked with WaveContext for `sessions-s1-w1` (JWT wave) →
  emits AgentSpec with role=`jwt-implementation`, ownedFiles disjoint
  from siblings, DoD checklist (≥1 item per Γ R2).
- **`agent_atom_output` event WRITTEN** (encoded as `agent_atom_output`
  log_event_type — extends the W1 base schema for planning-mode-only;
  alternative encoding could be `process_atom_output` extension with
  `agentMutated: true` payload — final encoding deferred to A7 audit).
  Payload: `{ waveId: "sessions-s1-w1", agentSpec: { role: "jwt-implementation",
  ownedFilesCount: 2, dodCount: 3 } }`.
- Γ R3 / Ε V1 verified: ownedFiles `["src/sessions/jwt.ts", "src/sessions/refresh.ts"]`
  disjoint from sibling `jwt-test` agent's `["tests/sessions/jwt.spec.ts"]`.
- SpecWorkbench Agentics tab updates with new agent card.
- Latency: ~480ms (rules-classifier + ownedFiles disjoint check + render).
- log_events rows: 4.

### Prompt 7 — "What ADRs do I need to write first"

- Mode: `planning`
- Atoms: `INTENT`
- Pipeline: input → INTENT classifies as recommend-adrs → rules-based
  ADR recommender walks `phases[]` + `boundedContexts[]` and surfaces
  3 ADRs to queue: ADR-001 auth-strategy, ADR-002 token-format,
  ADR-003 session-storage.
- No atom output written; ADR list is a derived view, not a Crystal Atom output.
- SpecWorkbench ADR tab pre-populates with 3 stub entries (Status: Proposed).
- Latency: ~220ms.
- log_events rows: 3.

### Prompt 8 — "Generate the TDD spec for phase 1"

- Mode: `planning`
- Atoms: `INTENT`, `PROCESS`
- Pipeline: input → INTENT classifies as generate-tdd-scaffold →
  TDD scaffolder (P97 — DEFERRED; this is a SIMULATED expected output)
  emits red/green/refactor plan for the foundation phase.
- **`process_atom_output` event WRITTEN** (TDD scaffold is encoded as
  a PROCESS_ATOM extension in the simulation since P97 hasn't shipped
  its own atom — final atom assignment deferred to P97 sprint owner).
- Output: 3 test stubs (project-bootstrap.spec / ci-setup.spec / adr-scaffolding.spec)
  with explicit failing assertions before implementation.
- Latency: ~340ms.
- log_events rows: 4.

### Prompt 9 — "Run KISS review on the plan"

- Mode: `planning`
- Atoms: `INTENT`
- Pipeline: input → INTENT classifies as run-kiss-review →
  KISS reviewer (P98 — DEFERRED; this is a SIMULATED expected output)
  walks the 5-phase plan + 4-context model + 16 agents and emits findings.
- Findings: scope tight, no premature abstraction, ownedFiles disjoint
  invariant holds across all 10 waves, agent count well under Γ R1
  (|agents/wave| ≤ 7 — max observed = 2).
- No atom output written; KISS review is a meta-pass over prior atom outputs.
- Latency: ~290ms.
- log_events rows: 3.

### Prompt 10 — "Export everything for Claude Code"

- Mode: `planning`
- Atoms: `INTENT`
- Pipeline: input → INTENT classifies as export-bundle →
  `buildClaudeCodeBundle(phase, projectSlug)` invoked per ADR-122 →
  emits single `.md` with `# === FILE: <path> ===` markers, ≥6 logical files:
  - `CLAUDE.md` preamble
  - `process-map.md` (ProcessMap nodes + edges)
  - `human-spec/north-star.md`
  - `human-spec/sadd.md` (system architecture decision doc)
  - `human-spec/implementation-plan.md`
  - `aisp/phase-aisp.md` (verbatim Σ blocks per phase)
  - `adrs/ADR-001-auth-strategy.md` + `ADR-002-token-format.md` + `ADR-003-session-storage.md`
  - `agents/wave-{n}.md` per wave (10 wave files)
- **`export_emit` event WRITTEN** with payload:
  `{ format: "markdown", logicalFileCount: 16, byteSize: ~24KB, exportedAt: ISO8601 }`.
- `response_summary` event WRITTEN: bundle export latency = 60ms; download triggered
  via `Blob` + `URL.createObjectURL` per ADR-122 D2.
- Latency: ~60ms (pure transform; no atom invocation; no LLM call).
- log_events rows: 4.

## Row-count summary

| Step | log_events | edit_history |
|------|-----------:|-------------:|
| 1    | 4          | 0            |
| 2    | 4          | 0            |
| 3    | 4          | 0            |
| 4    | 4          | 0            |
| 5    | 3          | 0            |
| 6    | 4          | 0            |
| 7    | 3          | 0            |
| 8    | 4          | 0            |
| 9    | 3          | 0            |
| 10   | 4          | 0            |
| **Σ**| **37**     | **0**        |

Total SQLite rows: **37**.
Total simulated latency: **3050ms** (~3.05s across 10 prompts).

`edit_history` row count = 0: planning mode is read-emit, NOT patch-apply.
The downstream consumer (Claude Code) writes the actual implementation;
Hey Bradley's planning surface is a spec factory, not a code generator.

## Honest declarations

- P97 TDD scaffold + P98 KISS reviewer are DEFERRED — steps 8 and 9 simulate
  the expected output shape; final atom assignment + log event encoding
  deferred to those sprint owners.
- `agent_atom_output` log event type is a planning-mode-specific extension
  of the W1 base schema (W1 schema currently lists chat-mode events only) —
  final encoding (own type vs `process_atom_output` payload extension)
  deferred to A7 audit.
- This scenario does not exercise `applyPatches()` or any chatPipeline
  apply-site; the build log records WOULD-WRITE rows from a hypothetical
  wired planning-mode pipeline.
- Bundle byte size in step 10 (~24KB) is a representative simulation,
  not measured.
