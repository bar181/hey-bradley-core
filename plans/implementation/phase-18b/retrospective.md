# Phase 18b Retrospective

## Phase 18b — MVP Track CLOSED 2026-04-27

**Branch:** `claude/verify-flywheel-init-qlIBr`
**Final commit:** `805b246`
**P18 baseline:** `232dd79`
**Range:** `232dd79..HEAD` (6 commits)

### Outcome

Phase 18b (Provider Expansion + Observability) closed with **18/18 DoD
items PASS** under the BLOCKING confirmation walk run on 2026-04-27.

P18b was an addendum phase that emerged out of the post-P18 retro: the
P18 `LLMAdapter` interface had room for three providers (Claude, Gemini,
Simulated) plus an in-tree `FixtureAdapter`, but the upcoming P19 listen
work and the Capstone-track free-tier story both pushed for two more —
a DB-backed mock for cross-provider regression testing and an OpenRouter
free-tier rail so OSS contributors could exercise the real pipeline at
$0. While extending the matrix, the ruvector research surfaced three
schema improvements (dual request id for retry chains, split input /
output tokens, content-addressable prompt hash) that were close enough
to ship as the same phase.

The result: **5 LLM providers behind one interface, two new persistence
tables, full per-call observability, retention enforced at session boot,
and a -0.76 kB net bundle delta** (new code is code-split into lazy
chunks).

### What went well

- **Five providers, six commits, no source-tree thrash.** W1 added the
  three new code paths (`AgentProxyAdapter`, `OpenRouterAdapter`,
  migration 001 + `examplePrompts.ts`) without touching `auditedComplete`
  or `applyPatches`. W2 added the observability layer (migration 002 +
  `llmLogs.ts` + audit-row write into `auditedComplete`) without touching
  any adapter. The Fix-Pass closed all 10 reviewer must-fix items in one
  batch (named FIX 1–10).
- **Bundle discipline net-negative.** Main JS gzip moved from 596.48 →
  **595.72 kB (-0.76 kB)**. The new `OpenRouterAdapter` is lazy
  (0.88 kB gz chunk); `pickAdapter` separated cleanly (1.95 kB gz chunk);
  the migration + repo additions live in the lazy `db` chunk.
- **Zero `any`, zero ungated `console`.** Five new `console.warn` calls
  in `auditedComplete.ts` and `db.ts` are all `import.meta.env.DEV`-gated.
- **One row per adapter-call decision.** The Fix-Pass FIX 5 enforced the
  invariant that EVERY `auditedComplete` decision (ok / error / timeout /
  validation_failed / cost_cap / rate_limit) writes exactly one
  `llm_logs` row. The pre-emptive insert + downstream `updateLLMLog`
  pattern is robust to mid-call throws (FIX 6 fallback flips status to
  `error` if the success-path UPDATE itself throws).
- **Cross-provider drift detection groundwork.** The `example_prompts`
  corpus (18 rows, 6 categories) + `example_prompt_runs` table mean a
  future "run all 18 prompts against Claude, Gemini, OpenRouter" loop
  becomes one query. The ruvector dual-id pattern (`request_id` UNIQUE +
  `parent_request_id` for retry chains) lets us correlate without
  hand-rolled session bookkeeping.
- **Retention enforced before it could become a bug.** `pruneOldLLMLogs`
  fires once per `initDB` boot with a 30-day cutoff. Failures are
  non-fatal (forensic-only table), so the prune call cannot wedge the
  app on startup.
- **Privacy parity for the new tables.** `SENSITIVE_TABLE_OPS` registry
  in `exportImport.ts` symmetrically truncates both `llm_logs` AND
  `example_prompt_runs` from `.heybradley` exports. Regression: `byok_*`
  rows still stripped from `kv`, and `llm_calls.error_text` still nulled.
- **Two ADRs and a research note.** ADR-046 (multi-provider) and ADR-047
  (logging) both Accepted; `phase-18b/ruvector-research.md` documents
  the three schema deltas with upstream cite.

### What we'd do differently

- **`request_id` UUID fallback was an oversight.** The first W2 cut used
  `Date.now()-Math.random()` which risks UNIQUE-constraint collisions
  under burst load (especially on sql.js test rigs without
  `crypto.randomUUID`). FIX 9 replaced it with a true RFC-4122 §4.4
  v4-shaped fallback. Should have been v4 from W2 — the UNIQUE
  constraint was right there in the migration.
- **Pre-emptive vs post-hoc log insertion.** The first W2 cut wrote
  `llm_logs` only on the success branch (post-hoc). Reviewer flagged
  that cost_cap and timeout paths fell through silently. FIX 5 inverted
  to pre-emptive insert + downstream update. The right shape from the
  start, but the obvious shape only after the reviewer pass.
- **Sensitive-table strip needed a registry, not a one-off.** The first
  W2 cut had three `clone.exec("DELETE FROM ...")` lines stacked in
  `exportSanitizedDBBytes`. FIX 1 + FIX 8 lifted them into a typed
  `SENSITIVE_TABLE_OPS` array of `{ table, op }` records (`truncate` |
  `null_column`). When P19 adds a `stt_logs` table, it's a one-line
  registry append.
- **The `mock` provider name almost shipped as `'simulated'`.** First
  W1 cut returned `'simulated'` from `AgentProxyAdapter.name()` to keep
  the picker UI happy. Reviewer flagged: that conflates two distinct
  providers in the audit log (`simulated` is canned passthrough; `mock`
  is DB-backed corpus-driven). FIX 2 split them: the picker now lists
  `mock` as a first-class entry, and `example_prompt_runs.provider`
  matches `adapter.name()`.

### Files added / changed (P18b range)

**New adapters / pickers:**
- `src/contexts/intelligence/llm/agentProxyAdapter.ts` (mock provider, DB-backed)
- `src/contexts/intelligence/llm/openrouterAdapter.ts` (fetch-based, no SDK)
- `src/contexts/intelligence/llm/pickAdapter.ts` (extended with `mock` and `openrouter` branches; `dbReady()` probe)

**Schema + repos:**
- `src/contexts/persistence/migrations/001-example-prompts.sql` (18 rows / 6 categories / 5 indexes)
- `src/contexts/persistence/migrations/002-llm-logs.sql` (ruvector deltas D1+D2+D3 + 6-status enum)
- `src/contexts/persistence/repositories/examplePrompts.ts` (typed CRUD; exact-then-regex match)
- `src/contexts/persistence/repositories/llmLogs.ts` (typed CRUD; `pruneOldLLMLogs`)

**Observability + retention:**
- `src/contexts/intelligence/llm/auditedComplete.ts` (pre-emptive `llm_logs` insert; one row per decision; FIX 5–10)
- `src/contexts/persistence/db.ts` (`pruneOldLLMLogs` wired into `initDB`; `DEFAULT_RETENTION_MS = 30 days`)
- `src/contexts/intelligence/llm/keys.ts` (`hashPrompt` SHA-256 + FNV-1a fallback)

**Privacy:**
- `src/contexts/persistence/exportImport.ts` (`SENSITIVE_TABLE_OPS` registry; both new tables truncated)

**Tests (5 new in Fix-Pass):**
- `tests/p18b-agent-proxy.spec.ts` (DB fixtures happy + miss path)
- `tests/p18b-logs.spec.ts` (`llm_logs` write-on-success, hashPrompt determinism, `example_prompt_runs` idempotency, cost-cap row write)

**ADRs (2 new):**
- `docs/adr/ADR-046-multi-provider-llm-architecture.md` (Accepted; 5-provider matrix; ruvector cited)
- `docs/adr/ADR-047-llm-logging-observability.md` (Accepted; "Retention now enforced"; 7-item never-log list; cross-links to ADR-040/043/044/046)

**Research note:**
- `plans/implementation/phase-18b/ruvector-research.md` (D1–D3 schema deltas + upstream cite)

### Carry-overs to P19

- **Real chat round-trip smoke** (Step 4) — still human-triggered, post-DoD; now also runnable for free via `VITE_LLM_PROVIDER=openrouter` against the default `mistralai/mistral-7b-instruct:free` model.
- **`stt_logs` table for listen-mode observability** — when P19 lands, mirror the `llm_logs` shape: pre-emptive insert in the STT decision path; add `{ table: 'stt_logs', op: 'truncate' }` to `SENSITIVE_TABLE_OPS`.
- **Adapter `dispose()`** carried forward from P17/P18; not surfaced in P18b but the new `OpenRouterAdapter` will eventually want it (currently no SDK to dispose, just a fetch — defensible to defer).
- **Example-prompt eval harness** — the schema is in place; building the loop ("run 18 prompts × 3 providers; assert envelope match against `expected_envelope_json`") is a separate work item, not blocking P19.

### Hand-off note

> **P19 (Real Listen Mode) preflight:** chat pipeline + audit log +
> 5-provider matrix all in place; P19 only adds STT capture front-end.

The downstream-of-input pipeline is sealed. P19 attaches a Web Speech API
capture surface upstream of the existing ChatInput; the cost cap, mutex,
and 6-status audit log are unchanged. The 5-provider matrix means P19
can be smoke-tested for free against `mock` (DB-backed) or `openrouter`
(free model) before any paid provider is touched.

### Sealed

**Date:** 2026-04-27 (UTC)
**Ready for P19:** YES
