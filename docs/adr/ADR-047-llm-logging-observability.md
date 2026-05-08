# ADR-047: LLM Logging & Observability — `llm_logs` Alongside `llm_calls`

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 18b

---

## Context

P16 introduced `llm_calls` as a minimal audit log (per-call cost, tokens, status, redacted `error_text`) used as the source-of-truth for cap math (`sumSessionCostUsd` is read on every pre-call cap check). P17 hardened the redaction story (ADR-043 `redactKeyShapes`); P18 stabilized the patch contract (ADR-044) whose discriminated `LLMError.kind` union we now want to correlate.

Phase 18b expands provider diversity to five adapters (ADR-046) and introduces a DB-backed agent-proxy + an `example_prompts` corpus for cross-LLM comparison. Cross-provider drift detection and post-hoc validation need richer per-call context than `llm_calls` carries today — specifically: a content-addressable prompt hash for fixture/agent-proxy correlation, a retry-chain identifier, a started-at timestamp + latency split, and a closed status enum that admits `fixture` and `agent_proxy` as first-class non-error states.

Adding columns to `llm_calls` would muddy the cap-math source-of-truth and bloat every cap read on the hot path. A separate `llm_logs` table is cleaner.

---

## Decision

Add a new `llm_logs` table (migration `002-llm-logs.sql`) alongside the existing `llm_calls`. The two tables have distinct, non-overlapping purposes:

| Table | Purpose | Hot path | Lifetime |
|---|---|---|---|
| `llm_calls` (P16) | Cap-math audit; one row per call decision | Yes — read by `sumSessionCostUsd` for the pre-call cap | Indefinite (LRU bound is a deferred backlog item) |
| `llm_logs` (P18b) | Observability + cross-provider comparison; one row per call with full context | No — written but not read by hot pipeline | Default-bounded by `pruneOldLLMLogs(beforeMs)` (not enforced in P18b) |

### Schema highlights (see `migrations/002-llm-logs.sql`)

- `request_id` (UUID v4) + `parent_request_id` for retry-chain correlation [ruvector P3 / D1].
- `prompt_hash` SHA-256(systemPrompt || '\n' || userPrompt) — enables fixture lookup + cross-provider drift detection without re-storing prompts [ruvector D3].
- `input_tokens` + `output_tokens` split, not merged [ruvector P4 / D2; required for ADR-046 per-provider cost math].
- `started_at` (ISO-8601 UTC) + `latency_ms`; `completed_at` is derivable and omitted [ruvector P2 + P5].
- `status` closed enum `{ok, error, timeout, validation_failed, cost_cap, rate_limit}` — admits non-error states (`fixture`, `agent_proxy` extension as P18b lands) per ADR-044's `LLMError.kind` alignment [ruvector P1].

### Privacy & security policy

The deployed bundle ships no key (ADR-043). `llm_logs.system_prompt` and `user_prompt` are stored verbatim for forensic value but are **excluded from `.heybradley` export** via `exportSanitizedDBBytes` — the same `SENSITIVE_KV_KEYS` pattern from ADR-040 is extended to also `DELETE FROM llm_logs` on the export-side temp DB before zip. `error_text` on `llm_calls` retains its P17 `redactKeyShapes` redaction; on `llm_logs` we record only `error_kind` (the discriminated-union member name from `LLMError.kind`), no detail, defense-in-depth.

We **never** log:

1. `api_key` (BYOK contract, ADR-043).
2. Key hashes, fingerprints, last-4, or any key-derived material — provider identity is enough (ruvector A2).
3. `client_ip` (frontend-only; not visible to us anyway).
4. User PII beyond what was typed into the chat input.
5. AISP embeddings or `context_embedding` vectors (ruvector A1; belongs in ReasoningBank, not a forensic log).
6. ReasoningBank verdicts, lessons, or `FailurePattern` analyses (ruvector A3; wrong table).
7. KV-cache state, witness chains, or any cryptographic-audit artifacts (no server, no consumer).

### Retention

- **MVP:** ~~no enforcement~~ **now enforced** (Phase 18b FIX 7). `initDB()` calls `pruneOldLLMLogs(Date.now() - DEFAULT_RETENTION_MS)` after migrations succeed. Default 30-day retention; one DELETE per session boot.
- **Post-MVP:** invoke from `closeSession` or a daily timer for tighter cadence on long-running sessions. Default 30-day retention.

---

## Alternatives considered

- **Single `llm_calls` table with extended columns.** Rejected. Muddies the cap-math source-of-truth and bloats every cap read on the hot path. The two purposes (cap math vs. observability) have different read patterns and different lifetimes.
- **Append-only file log (JSONL on filesystem).** Rejected. We are a browser SPA; IndexedDB is our filesystem. A second persistence mechanism for one table fails the KISS bar.
- **Server-side log shipping (Sentry, LogRocket, etc.).** Rejected. The frontend-only / no-backend constraint (ADR-029) stands. Telemetry providers also conflict with the BYOK trust model — we cannot relay user prompts off-device without re-opening ADR-043.

---

## Consequences

### Positive

- **Cross-LLM comparison becomes tractable.** Joining `example_prompts` with `example_prompt_runs` (P18b W1) yields predicted-vs-actual; `SELECT ... FROM llm_logs GROUP BY provider` yields per-provider latency, cost, and error histograms in one query.
- **Retry chains are observable.** `parent_request_id` lets a UI surface "this call was a retry of X" without hand-rolled correlation in app code.
- **Cap math is undisturbed.** The hot path keeps reading the leaner `llm_calls`; the richer `llm_logs` is write-only from the pipeline's perspective.

### Negative

- **Bundle gain:** ~3 KB gz for the new repository + the `auditedComplete` write-site delta.
- **Wasm DB grows:** the migration adds ~1 KB to the empty DB; per-row size is small (no embeddings, no full-history JSON columns).
- **Two tables to keep in sync.** Mitigated by writing both from one chokepoint (`auditedComplete.ts`) — the writer either succeeds at both or fails the call.

---

## Implementation pointer

- `src/contexts/persistence/migrations/002-llm-logs.sql` — schema (created by W2 A4)
- `src/contexts/persistence/repositories/llmLogs.ts` — typed CRUD (created by W2 A4)
- `src/contexts/intelligence/llm/auditedComplete.ts` — single write site for both `llm_calls` and `llm_logs`
- `src/contexts/persistence/exportImport.ts` — A4 adds `DELETE FROM llm_logs` to the export sanitization step alongside the existing `SENSITIVE_KV_KEYS` strip

---

## Reference

`plans/implementation/phase-18b/ruvector-research.md` — borrowed patterns P1 (status enum), P2 (latency unit), P3 (dual ID), P4 (token split), P5 (started-at + derived completed-at); deltas D1 (`request_id` + `parent_request_id`), D2 (split tokens), D3 (`prompt_hash`); anti-patterns §3 / §4 (no embeddings, no key material, no lessons/verdicts, no client IP).

---

## Related ADRs

- ADR-040: Local SQLite Persistence — owns the `kv` table, the `SENSITIVE_KV_KEYS` export strip, and the migration runner this ADR plugs into
- ADR-043: API Key Trust Boundaries — BYOK contract; this ADR extends the redaction discipline to the new table
- ADR-044: JSON Patch Contract — `error_kind` aligns with `LLMError.kind` discriminated union
- ADR-046: Multi-Provider LLM Architecture — provider matrix whose per-provider cost/latency rollups this ADR makes queryable

---

## Status as of P20

- Ruvector deltas D1 (request_id + parent_request_id), D2 (input/output_tokens split), D3 (SHA-256 prompt_hash) all shipped P18b.
- 30-day retention LIVE at `initDB` via `pruneOldLLMLogs`.
- `mapChatError` 4 infra kinds (cost_cap / timeout / precondition_failed / rate_limit) shipped P19 fix-pass-2 F2.
- `mapListenError` 6 STT kinds shipped P19.
- FK on `llm_logs.session_id` (C16) NOT YET shipped — P20 Day 2 work (migration 003).
