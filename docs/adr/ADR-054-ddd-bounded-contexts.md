# ADR-054: DDD Bounded Contexts (Post-P20 Reality)

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** P21 (Cleanup)

## Context

The codebase has grown organically through P11-P20 with 5 de-facto bounded contexts. Until now they were implicit. P21 cleanup formalizes them so future contributors (and the agent swarm) work from a shared mental model.

## Decision

Five contexts are recognized as the canonical DDD boundaries of `hey-bradley-core`:

### 1. Configuration (the source-of-truth)

**Owner:** `src/store/configStore.ts` + `src/lib/schemas/masterConfig.ts`
**Aggregate:** `MasterConfig` (single root; everything else derives)
**Key types:** Section, Component, Theme, Site
**Public API:** `useConfigStore()` hook + `applyPatches()` selector
**Invariants:**
- Only Zod-parsed objects enter the store
- All mutations go through `applyPatches()` (audited via Intelligence)
- Direct mutation outside the store is forbidden (TypeScript + lint enforce)

### 2. Persistence (durable state)

**Owner:** `src/contexts/persistence/`
**Sub-modules:** `db.ts` (sql.js bootstrap) + `migrations/{000-init,001-example-prompts,002-llm-logs}.sql` + `repositories/{sessions,llmCalls,llmLogs,kv,projects,exampleProgrammeRuns}.ts` + `exportImport.ts`
**Aggregates:** Session, LLMCall, LLMLog, KV entry, Project, ExamplePromptRun
**Public API:** typed CRUD per repository; `exportImport.exportBundle()` + `importBundle()`
**Invariants:**
- 30-day retention enforced at `initDB`
- `SENSITIVE_TABLE_OPS` registry strips `byok_*` kv prefix + `llm_logs` + `example_prompt_runs` from exports
- Cross-tab Web Locks (`hb-db-write`) + BroadcastChannel (`hb-db`) coordinate writes

### 3. Intelligence (LLM + STT pipelines)

**Owner:** `src/contexts/intelligence/`
**Sub-modules:** `llm/{adapter,claudeAdapter,geminiAdapter,openrouterAdapter,fixtureAdapter,agentProxyAdapter,simulatedAdapter,adapterUtils,patchValidator,pickAdapter,auditedComplete,keys,cost}.ts` + `prompts/system.ts` + `chatPipeline.ts` + `stt/{sttAdapter,webSpeechAdapter}.ts`
**Aggregates:** LLMRequest, LLMResponse, ChatMessage, Transcript
**Public API:** `chatPipeline.submit({source, text, history?})` (single fan-in for chat AND voice) + `auditedComplete()` (cost-cap + audit chokepoint)
**Invariants:**
- Cost-cap pre-check + per-call wall-clock timeout (30s)
- All adapter errors classified via `classifyError` + `safeJson` (`adapterUtils.ts`)
- Patches validated via `patchValidator.ts` (path whitelist + value safety + CSS-injection guard)
- Cross-surface mutex via `inFlight` flag (FIX 10) — chat + listen + settings test cannot race

### 4. Specification (AISP + human-readable spec generation)

**Owner:** implicit; rendered via `src/components/center-canvas/BlueprintsTab.tsx` + sub-components
**Aggregates:** AISP Crystal Atom, North Star, Architecture, Build Plan, Features, Human Spec, AISP Symbol Vocabulary
**Public API:** Blueprints tab UI + `prompts/system.ts` exports the active Crystal Atom
**Invariants:**
- AISP grammar conforms to `bar181/aisp-open-core ai_guide` (512-symbol vocabulary)
- Specs are derived (not source-of-truth); always read from Configuration

### 5. UI Shell (the user surface)

**Owner:** `src/components/{shell,left-panel,center-canvas,right-panel,settings,marketing}/` + `src/pages/`
**Aggregates:** none (pure rendering layer)
**Public API:** mode toggles (DRAFT/EXPERT/BUILD/LISTEN) + tab routing
**Invariants:**
- UI subscribes to stores; never imports from Persistence directly
- Mode changes affect controls only, never data (per `phase-15/README.md` design rule)

## Cross-context coupling map (de-facto today)

| From | To | Direction | Today | Future-work |
|---|---|---|---|---|
| Intelligence | Persistence | direct repo imports | `auditedComplete` imports `llmCalls/llmLogs/sessions` | introduce `LLMAuditService` facade (post-MVP, R4 brutal review C05) |
| Intelligence | Configuration | store-getter calls | `useConfigStore.getState()` in chat pipeline | acceptable; UI-state vs domain-state line |
| UI Shell | Intelligence | store subscriptions only | clean | maintain |
| UI Shell | Persistence | NEVER (direct) | enforced via convention | add lint rule post-MVP |
| Specification | Configuration | read-only | clean | maintain |
| Persistence | Intelligence | NEVER | enforced | maintain (Persistence is leaf) |

## Consequences

- (+) New contributors have a single read (this ADR) to understand the boundary lines
- (+) Brutal-review architecture audits can grade against a known map
- (+) Future refactors (e.g. STT capture moving out of Intelligence) have a starting point
- (-) Documents the existing Intelligence → Persistence direct coupling without yet fixing it (deferred to post-MVP)
- (-) "Specification" context is implicit (no dedicated `src/contexts/specification/` directory) — accepted for MVP

## Open future-work items

1. **Intelligence → Persistence facade.** Introduce `LLMAuditService` so `auditedComplete` no longer imports 5 repository files. (Post-MVP; R4 brutal review C05.)
2. **STT to its own context.** Currently nested under `intelligence/stt/`; semantically it's input-source not intelligence. Move to `src/contexts/capture/` post-MVP.
3. **Specification context formalization.** Either consolidate Blueprints sub-tabs into `src/contexts/specification/` OR document the rationale for keeping it implicit.
4. **Lint rule for UI → Persistence.** Today the convention is followed but not enforced; add an ESLint import-graph rule.

## Cross-references

- ADR-040 (Local SQLite Persistence) — the Persistence context's foundational decision
- ADR-042 (LLM Provider Abstraction) — the Intelligence context's LLM adapter shape
- ADR-045 (System Prompt AISP) — the Intelligence/Specification boundary
- ADR-046 (Multi-Provider LLM Architecture) — the 5-adapter matrix
- ADR-048 (STT Web Speech) — the Intelligence/STT submodule
- A1 Capability audit (`phase-22/wave-1/A1-capability-audit.md` §F) — flagged the coupling
- R4 brutal review (`phase-19/deep-dive/04-architecture-findings.md`) — original C05 carryforward

## Status as of P21 (this ADR)

- All 5 contexts confirmed in place across the P15-P19 codebase.
- Cross-context coupling map is current.
- Future-work items 1-4 are explicitly deferred to post-MVP.
