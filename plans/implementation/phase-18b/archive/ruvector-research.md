# RuVector Logging-Pattern Research — Phase 18b Pre-work

Source: local submodule `upstreams/ruvector/` (no WebFetch needed; local copy is current).
Scope: inform `llm_logs` schema (Wave 2 A4), ADR-047 (logging) and ADR-046 (multi-provider).
Constraint reminder: frontend-only, BYOK, no remote shipping, no real LLM calls in dev/test, schema cap ~12 cols.

---

## 1. Borrowed Patterns (5)

### P1. Status as a small closed enum, not a free-form string
Ref: `upstreams/ruvector/crates/ruvllm/src/session.rs:42-52` (`SessionStatus = Active|Paused|Expired|Terminated`)
and `upstreams/ruvector/crates/ruvllm/src/reasoning_bank/verdicts.rs:13-32` (`Verdict = Success|Failure|Partial|RecoveredViaReflection`).
Adoption: `llm_logs.status TEXT CHECK (status IN ('ok','error','fixture','agent_proxy','timeout'))`.
This handles A4 spec plus the user's "no real LLM calls in dev/test" directive — fixture and agent_proxy are first-class, not error.

### P2. Latency in a single integer unit (ms), not nanos
Ref: `upstreams/ruvector/crates/ruvllm/src/reasoning_bank/trajectory.rs:117` (`pub latency_ms: u64`)
and `upstreams/ruvector/crates/rvAgent/rvagent-core/src/metrics.rs:42-52` (records ns, exposes us — too granular for our need).
Adoption: store `latency_ms INTEGER`. Skip ruvector's atomic-counter snapshot pattern — that is a runtime metric collector, not a per-call log; conflating the two is an anti-pattern (see A1 below).

### P3. Dual ID: monotonic u64 + UUID for external reference
Ref: `upstreams/ruvector/crates/ruvllm/src/reasoning_bank/trajectory.rs:14-24,216-218` (`TrajectoryId(u64)` + `uuid: Uuid`).
Adoption: keep `id INTEGER PRIMARY KEY AUTOINCREMENT` (rowid, internal joins) and add `request_id TEXT NOT NULL` (UUID v4, externally addressable, surfaces in UI/console). The 3rd-party A4 spec only had `id`; this is delta D1.

### P4. Token accounting split, not merged
Ref: `trajectory.rs:131-134` (`input_tokens`, `output_tokens` separate) and `trajectory.rs:198-201` (`total_input_tokens`, `total_output_tokens`).
Adoption: `input_tokens INTEGER` and `output_tokens INTEGER` rather than a single `tokens` field. Required for cost math per provider (ADR-046 cross-link) since pricing differs per side.

### P5. Started-at + total-latency, derive completed-at
Ref: `trajectory.rs:231-234` (`started_at`, `completed_at`, `total_latency_ms`).
Adoption: store `created_at TEXT NOT NULL` (ISO-8601 UTC) and `latency_ms`. Drop `completed_at` — derivable, saves a column and stays under the 12-col cap.

---

## 2. Anti-Patterns to Avoid (3)

### A1. Don't log embeddings or KV-cache state per call
Ref: `trajectory.rs:121` (`context_embedding: Option<Vec<f32>>`), `session.rs:103-106` (`context_embedding` and `kv_cache: Arc<TwoTierKvCache>`).
Reasoning: ruvector logs vectors because it *is* a vector store. `llm_logs` is forensic/cost; storing embeddings explodes row size and duplicates indexable data the app doesn't need. Keep `llm_logs` text-only.

### A2. Don't co-mingle the API key (or anything derived) into log rows
Ref: `upstreams/ruvector/crates/ruvllm/src/training/real_trainer.rs:862,891,935-942` — ruvector stores `api_key: String` on the trainer struct, which is fine for an in-process Rust struct but would be a serialization landmine if mirrored into a SQL log row. ruvector itself never serializes that field to disk; we should follow the same rule explicitly.
Reasoning: BYOK contract. No prefix, no last-4, no fingerprint, no SHA in logs. Provider identity is enough.

### A3. Don't mirror ruvector's "lessons" / verdict-analysis fields in `llm_logs`
Ref: `trajectory.rs:237-238` (`lessons: Vec<String>`), `verdicts.rs:235-292` (`FailurePattern`, `RecoveryStrategy`, `VerdictAnalysis`).
Reasoning: those belong in a learning store (ReasoningBank), not in a per-request log. Mixing them blows the 12-col cap and forces JSON columns that fail the KISS bar.

---

## 3. Recommended `llm_logs` Schema Deltas vs A4 spec

Final shape (12 cols, all required fields covered):

| # | Column | Type | Source | Delta vs A4 |
|---|--------|------|--------|-------------|
| 1 | `id` | INTEGER PK AUTOINCREMENT | A4 | — |
| 2 | `request_id` | TEXT NOT NULL | P3 | **+ ADD** (UUID, retry-correlation root) |
| 3 | `parent_request_id` | TEXT NULL | P3 | **+ ADD** (set when retry; NULL on first attempt) |
| 4 | `created_at` | TEXT NOT NULL | P5 | — |
| 5 | `provider` | TEXT NOT NULL | ADR-046 | — (anthropic / openai / fixture / agent_proxy) |
| 6 | `model` | TEXT NOT NULL | A4 | — |
| 7 | `status` | TEXT NOT NULL CHECK enum | P1 | **CHANGE** to enum incl. `fixture`,`agent_proxy` |
| 8 | `latency_ms` | INTEGER NOT NULL | P2 | — |
| 9 | `input_tokens` | INTEGER | P4 | **CHANGE** (split from single `tokens`) |
| 10 | `output_tokens` | INTEGER | P4 | **CHANGE** (split from single `tokens`) |
| 11 | `prompt_hash` | TEXT NOT NULL | new | **+ ADD** SHA-256 of normalized prompt; enables dedup, cache lookups, fixture matching without storing prompt text |
| 12 | `error_code` | TEXT NULL | A4 | — (short slug like `rate_limit`, `auth`, `network`, `parse`; full message lives in console only) |

Indexes: `(request_id)`, `(created_at)`, `(provider, model, created_at)`.

Three deltas vs the 3rd-party 18b A4 spec:
- **D1**: add `request_id` + `parent_request_id` for retry chains (P3).
- **D2**: split tokens into `input_tokens` / `output_tokens` (P4) — required for ADR-046 cost-by-provider.
- **D3**: add `prompt_hash` (SHA-256, hex, 64 chars) — supports fixture matching for the "no real LLM calls in dev/test" directive without persisting prompt content.

---

## 4. Fields We Explicitly DO NOT Borrow (BYOK / frontend-only)

| Upstream field | Source | Reason rejected |
|----------------|--------|-----------------|
| `api_key` on any struct | `real_trainer.rs:862,935` | BYOK: key never leaves the provider call closure; never serialized. |
| `client_ip`, `user_agent` | `session.rs:67-68` (`SessionMetadata`) | We are the client. Storing our own IP/UA is noise + privacy hazard. |
| `context_embedding: Vec<f32>` | `session.rs:104`, `trajectory.rs:121,219` | A1 — bloat, no consumer in 18b. |
| `query_embedding`, `response_embedding` | `trajectory.rs:219-222` | Same as above; reserved for a future ReasoningBank store, not `llm_logs`. |
| `lessons`, `FailurePattern`, `RecoveryStrategy` | `trajectory.rs:237`, `verdicts.rs:235-269` | A3 — wrong table. |
| Full prompt / full response text | `trajectory.rs` action+rationale strings | Privacy + size; we keep `prompt_hash` only. Raw text stays in the in-memory console viewer. |
| Witness chains / cryptographic audit | `docs/research/sublinear-time-solver/07-mcp-integration.md:697` | Server-side concept; we have no server. |

---

## 5. Cross-links for ADR authors

- ADR-046 (multi-provider): use `provider` + `model` + split tokens (P4) so per-provider cost rollups are a single SQL `GROUP BY provider`.
- ADR-047 (logging): cite P1 (status enum incl. `fixture`/`agent_proxy`), P3 (request_id chain), P5 (timestamp+latency, no `completed_at`), and the explicit "no key material, no prompt text, no embeddings" rule from section 4.
- Test fixtures: `prompt_hash` (D3) is the join key between fixture files and `llm_logs` rows — fixture runs produce real log rows with `status='fixture'` and matching hash, satisfying the dev/test directive.
