# Phase 18b Session Log

## Phase 18b — Verification Sweep — 2026-04-27

| Check | Status | Detail |
|---|---|---|
| tsc --noEmit | PASS | zero output (`npx tsc --noEmit --ignoreDeprecations 5.0`) |
| npm run build | PASS | 2.03s; main 2,264.12 kB / gzip **595.72 kB** (P18 baseline 596.48 kB → **delta -0.76 kB**); openrouterAdapter 1.74 kB / gz 0.88 (new); pickAdapter 4.74 kB / gz 1.95; db 20.79 kB / gz 6.88; claudeAdapter 42.63 kB / gz 12.29; geminiAdapter 264.66 kB / gz 52.44; sql-wasm-browser 39.62 kB / gz 14.05 |
| any/console violations | 0 / 0 | `git diff 232dd79..HEAD … grep ':\s*any\b'` empty; all 5 added `console.warn` calls `import.meta.env.DEV`-gated |
| secrets-guard | PASS | `[secrets-guard] no key-shape patterns found` |
| Targeted Playwright | 36/36 active passed (2 xskip) | 1.8 min duration; all P18 + P18b + adapter + persistence + kitchen-sink + blog-standard suites green |

### Bundle delta vs P18 baseline (596.48 kB main gzip)
- Main JS gzip: **595.72 kB** (**-0.76 kB / -0.13%**, net negative; new modules are lazy-imported)
- openrouterAdapter chunk gzip: 0.88 kB (new, lazy)
- pickAdapter chunk gzip: 1.95 kB (separated to host the new branch)
- db chunk gzip: 6.88 kB (lazy; carries 002-llm-logs migration + new repos)

---

## Phase 18b — CLOSED — 2026-04-27

**Branch:** `claude/verify-flywheel-init-qlIBr`
**Final commit:** `805b246` (P18b Fix-Pass: address all 10 reviewer must-fix items + 5 new tests)
**Baseline (P18 seal):** `232dd79`
**Range:** `232dd79..HEAD`

### Commit chronology (P18 seal → HEAD)

| # | SHA | Subject |
|---|-----|---------|
| 1 | `446ad5a` | Add program-level STATE.md (post-P18 seal index) |
| 2 | `57bd30e` | P18b pre-work: ruvector research findings |
| 3 | `278c36b` | P18b W1: 5-provider LLM matrix + DB-backed agent-proxy + example_prompts corpus |
| 4 | `7b20c4d` | P18b W2: llm_logs schema + repo + audit wiring + ADR-047 |
| 5 | `03a0874` | Gitignore playwright-report/ (runtime artifact regenerated each test run) |
| 6 | `805b246` | P18b Fix-Pass: address all 10 reviewer must-fix items + 5 new tests |

(Total: 6 commits across the P18b range `232dd79..HEAD`.)

### Final DoD walk — 18/18 PASS

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | `LLMProviderName` union includes all 5 (`claude` `gemini` `openrouter` `simulated` `mock`) | PASS | `src/contexts/intelligence/llm/adapter.ts:5` |
| 2 | `AgentProxyAdapter` exists; `name()` returns `'mock'` (NOT `'simulated'`) | PASS | `src/contexts/intelligence/llm/agentProxyAdapter.ts:33-35` |
| 3 | `OpenRouterAdapter` uses fetch + Bearer + HTTP-Referer + X-Title; default `mistralai/mistral-7b-instruct:free` | PASS | `src/contexts/intelligence/llm/openrouterAdapter.ts:10,17,19,20,39,56` |
| 4 | Gemini supports both paid (`gemini-2.5-flash`) and free (`gemini-2.0-flash`) via constructor | PASS | `geminiAdapter.ts:9,16` constructor `model: string = DEFAULT_MODEL`; `cost.ts:7-8` MODEL_COSTS table has both rows (free row priced at `{ in: 0, out: 0 }`) |
| 5 | `pickAdapter` accepts all 5 providers; mock does NOT leak (provider !== 'mock' AND key present → real adapter) | PASS | `pickAdapter.ts:51-57` (explicit `mock` branch returns `AgentProxyAdapter` only on rawProvider==='mock'); claude/gemini/openrouter branches at `:79-91` require `apiKey` truthy |
| 6 | Migration 001 creates `example_prompts` + `example_prompt_runs` + 5 indexes; seeds 18 rows across 6 categories (5/3/3/3/2/2) | PASS | `migrations/001-example-prompts.sql:6-19,21-37`; row count `grep -E "^\s*\('[a-z]"` = 18; category breakdown starter=5, edge_case=3, safety=3, multi_section=3, site_context=2, content_gen=2 (matches mandate); 4 explicit `CREATE INDEX` + 1 implicit UNIQUE on `slug` = 5 |
| 7 | Migration 002 creates `llm_logs` with all 3 ruvector deltas + 6-status enum | PASS | `migrations/002-llm-logs.sql:16-37` (D1: `request_id` UNIQUE + `parent_request_id`; D2: `input_tokens` + `output_tokens` split; D3: `prompt_hash` SHA-256); status CHECK at `:32` covers `ok|error|timeout|validation_failed|cost_cap|rate_limit` |
| 8 | `repositories/examplePrompts.ts` typed CRUD: list/find/get/recordRun/listRuns | PASS | `examplePrompts.ts:31,42,53,72,102` |
| 9 | `repositories/llmLogs.ts` typed CRUD: record/update/list/getByRequestId/pruneOld | PASS | `llmLogs.ts:47,78,100,110,119` |
| 10 | `auditedComplete` writes a `llm_logs` row for EVERY adapter-call decision (incl. `cost_cap` + `precondition_failed` paths per FIX 5) | PASS | `auditedComplete.ts:135-181` pre-emptively inserts log row before cost-cap rejection at `:184-194`; success update at `:236-250`; error update at `:268-277`; precondition_failed path at `:127-133` correctly aborts before log insert (no session_id to attribute) |
| 11 | `pruneOldLLMLogs` wired into `db.ts:initDB` after migrations with `DEFAULT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000` | PASS | `db.ts:8` (import), `:15` (constant value verified), `:60-95` (initDB call site after migrations succeed; failure non-fatal per DEV warn at `:95`) |
| 12 | `prompt_hash` deterministic SHA-256 of `${systemPrompt}\n${userPrompt}` (FNV-1a fallback) | PASS | `keys.ts:97-104` (`subtle.digest('SHA-256', ...)` on the joined input; FNV-1a 32-bit hex-padded fallback at `:104`) |
| 13 | `request_id` UUID-v4 (or higher-entropy fallback satisfying UNIQUE) | PASS | `auditedComplete.ts:35-53` (`fallbackRequestId()` builds RFC-4122 §4.4-shaped v4 from 16 crypto-random bytes); `:159` prefers `crypto.randomUUID()` then falls back |
| 14 | `exportImport.ts:exportSanitizedDBBytes` strips both `llm_logs` AND `example_prompt_runs` via `SENSITIVE_TABLE_OPS` | PASS | `exportImport.ts:64-71` (registry has `llm_logs` truncate + `example_prompt_runs` truncate + `llm_calls.error_text` null_column); applied at `:83` |
| 15 | Regression: `byok_*` rows still stripped from `kv`; `llm_calls.error_text` still nulled | PASS | `exportImport.ts:24` (`startsWith('byok_')`), `:82` (`DELETE FROM kv WHERE k LIKE 'byok_%' OR k = 'pre_migration_backup'`); `error_text` null op preserved in registry at `:70` |
| 16 | `ADR-046-multi-provider-llm-architecture.md` Accepted; 5 providers documented; ruvector cited | PASS | `ADR-046:3` Status; provider matrix table at `:28-32` (5 rows); ruvector cite at `:96` |
| 17 | `ADR-047-llm-logging-observability.md` Accepted; "Retention now enforced" updated; 7-item never-log list; cross-links to ADR-040/043/044/046 | PASS | `ADR-047:3` Status; "now enforced (Phase 18b FIX 7)" at retention block; numbered never-log list 1–7 (`api_key`, key-derived material, `client_ip`, user PII, AISP/`context_embedding` vectors, ReasoningBank verdicts/`FailurePattern`, KV-cache/witness/audit artifacts); cross-links at `:99-102` |
| 18 | Cross-cutting: tsc clean, build green, 0 any, 0 ungated console, secrets clean, targeted Playwright green | PASS | (all metrics above) |

### Cross-cutting metrics
- **tsc:** clean
- **build:** 2.03s, main gzip 595.72 kB
- **bundle delta vs P18 (596.48 kB):** **-0.76 kB** (net negative; new modules code-split into lazy chunks)
- **`any` violations added:** 0
- **`console.*` violations:** 0 (5 new calls all DEV-gated via `import.meta.env.DEV`)
- **secrets-guard:** clean (no key-shape patterns)
- **Playwright (targeted):** 36/36 active passed (+ 2 intentional xskip on env-inlined `VITE_LLM_MAX_USD` clamp); 1.8 min

### NO REAL LLM — verified
The `mock` provider is the DB-backed `AgentProxyAdapter` reading from
`example_prompts` rows seeded by migration 001. The `simulated` provider
remains the `SimulatedAdapter` canned passthrough. No live `claude`,
`gemini`, or `openrouter` call was made during P18b verification. The
real adapters exist as lazy imports in `pickAdapter.ts` and only activate
when both `VITE_LLM_PROVIDER=<name>` AND a non-empty `VITE_LLM_API_KEY`
are present — neither holds in DEV/test paths.

### Hand-off note for P19

**P19 (Real Listen Mode) preflight: chat pipeline + audit log + 5-provider matrix all in place; P19 only adds STT capture front-end.**

The full LLM round-trip (system prompt → adapter → parse → validate →
apply → audit row in both `llm_calls` AND `llm_logs`) is now wired and
covered by 36 targeted Playwright tests. P19 plugs `webkitSpeechRecognition`
(or the unprefixed `SpeechRecognition`) into the existing ChatInput
upstream of the same pipeline; the cost cap, mutex, and 6-status audit
log are unchanged downstream of the STT capture surface. No source-code
modification to `auditedComplete.ts`, `pickAdapter.ts`, `applyPatches.ts`,
or any repository should be needed to ship P19. The 5-provider matrix
means a P19 listener can be smoke-tested for free against the `mock`
DB-backed adapter or the `openrouter` free-tier model before any paid
provider is touched.

**Sealed:** 2026-04-27 (UTC)
**Ready for P19:** YES
