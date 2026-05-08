# P100 W2 — Format Verification (A1)

> **Owner:** Agent A1 — Format Verification (gates B1-B4 scenario traces)
> **Repo state:** `claude/verify-flywheel-init-qlIBr` — P100 W2 sealed at `de10b3a`
> **Scope:** READ-ONLY 3-way comparison of Zod schema vs AgentProxy return shape vs Claude adapter request/response.

---

## §1 Methodology

Three-way comparison performed by direct file:line reads — no source/test/ADR edits.

1. **Zod schema** at `src/lib/schemas/patches.ts:8-22` — single source of truth for envelope shape (`PatchEnvelopeSchema`).
2. **AgentProxy return shape** at `src/contexts/intelligence/llm/agentProxyAdapter.ts:50-123` — DB-backed mock; returns `LLMResponse` per `adapter.ts:35-37`.
3. **Claude adapter** at `src/contexts/intelligence/llm/claudeAdapter.ts:47-72` — live SDK; same `LLMResponse` contract.

Verdict per dimension uses `MATCH | PARTIAL | MISMATCH` with severity `low|medium|high`.

Every claim cites `path:line`. The Zod schema is the contract; both adapters MUST produce parsable input for `parseResponse()` at `responseParser.ts:31-46`.

---

## §2 Expected response shape (Zod schema)

Verbatim from `src/lib/schemas/patches.ts:8-22`:

```ts
// RFC-6902 path: '/' followed by `/`-separated tokens; `~0` = `~`, `~1` = `/`.
export const JSONPatchSchema = z.object({
  op: z.enum(['add', 'replace', 'remove']),
  path: z.string().regex(/^\/(?:[^/~]|~0|~1)+(?:\/(?:[^/~]|~0|~1)+)*$/),
  value: z.unknown().optional(),
})
export type JSONPatch = z.infer<typeof JSONPatchSchema>

// The single shape returned by every LLM adapter. ≤ 20 patches per turn.
export const PatchEnvelopeSchema = z.object({
  patches: z.array(JSONPatchSchema).min(1).max(20),
  summary: z.string().max(140).optional(),
})
export type PatchEnvelope = z.infer<typeof PatchEnvelopeSchema>
```

**Required fields:**

- `patches`: `JSONPatch[]`, length 1..20 inclusive (`patches.ts:18`).
- Each `patches[i].op`: enum `'add' | 'replace' | 'remove'` (`patches.ts:9`).
- Each `patches[i].path`: string matching RFC-6902 regex `/^\/(?:[^/~]|~0|~1)+(?:\/(?:[^/~]|~0|~1)+)*$/` (`patches.ts:10`).

**Optional fields:**

- `patches[i].value`: `unknown` (`patches.ts:11`) — `add`/`replace` need it, `remove` doesn't (Zod marks optional; runtime semantics enforced downstream by `validatePatches` at `patchValidator.ts:35`).
- `summary`: string with `max(140)` (`patches.ts:19`).

**Constraints not in schema** (deferred to `validatePatches` at `patchValidator.ts:35-95+`): path whitelist (`/sections`, `/theme`, `/page`, etc. per AISP atom Γ R2 in `system.ts:48-50`); image URL allow-list; unsafe-value regex; prototype-pollution keys.

---

## §3 AgentProxy actual return shape

`agentProxyAdapter.ts:33-124` — class `AgentProxyAdapter implements LLMAdapter`.

**Function signature** (`agentProxyAdapter.ts:50`):

```ts
async complete(req: LLMRequest): Promise<LLMResponse>
```

**Return type:** `LLMResponse` (discriminated union from `adapter.ts:35-37`):

```ts
| { ok: true; json: unknown; tokens: { in: number; out: number }; cost_usd: number }
| { ok: false; error: LLMError }
```

**Sample success literal** (`agentProxyAdapter.ts:117-122`):

```ts
return {
  ok: true,
  json: envelope,                     // JSON.parse(row.expected_envelope_json)
  tokens: { in: inTokens, out: outTokens },
  cost_usd: 0,                        // mock = always free
};
```

**Async behavior:**

- No `setTimeout` — resolves on the **next microtask** after the synchronous `findExamplePromptForUserPrompt` SQL call (`agentProxyAdapter.ts:57`) and `JSON.parse` (`agentProxyAdapter.ts:78`). Effective per-call latency: **≈0ms** (sub-millisecond on warm SQLite).
- Best-effort `recordExamplePromptRun` write (`agentProxyAdapter.ts:101-111`) — wrapped in try/catch so failure is non-fatal. Still synchronous SQL.
- Defensive abort check at entry (`agentProxyAdapter.ts:52-54`) — returns `{ ok: false, error: { kind: 'timeout' } }` if signal already aborted.

---

## §4 Claude adapter expectations

`claudeAdapter.ts:13-73` — class `ClaudeAdapter implements LLMAdapter`.

**SENDS to the API** (`claudeAdapter.ts:52-57`):

```ts
this.client.messages.create({
  model: this.modelId,                          // default 'claude-haiku-4-5-20251001'
  max_tokens: 1024,
  system: req.systemPrompt,                     // top-level system param
  messages: [{ role: 'user', content: req.userPrompt }],
}, req.signal ? { signal: req.signal } : undefined);
```

- **No** `messages` history array threaded — single `{role:'user', content}` per call.
- `req.systemPrompt` is the FULL `buildSystemPrompt({...})` output including embedded RECENT MESSAGES block (see §7).
- `req.signal` forwarded to SDK per ADR-049 / P20 C20 (`claudeAdapter.ts:57`).

**EXPECTS back** (`claudeAdapter.ts:58-67`):

- `r.content`: array of content blocks; concatenates `b.text` for all blocks where `'text' in b` (`claudeAdapter.ts:58-60`).
- `r.usage.input_tokens` + `r.usage.output_tokens` for cost math (`claudeAdapter.ts:61-62`).

**Transforms response → ParsedEnvelope:**

1. Concatenated `text` → `safeJson(text)` at `adapterUtils.ts:25-35` (strips fences, JSON.parse, on failure returns `{ __raw: text }`).
2. Returns `{ ok: true, json: <parsed-or-rawObj>, tokens, cost_usd }` (`claudeAdapter.ts:63-68`).
3. **Caller** (`chatPipeline.ts:221`) runs `parseResponse(res.json)` which validates against `PatchEnvelopeSchema`.

`parseResponse` at `responseParser.ts:31-46` accepts both string and object, normalizes (BOM strip / fence strip / first-`{` to last-`}` slice at `responseParser.ts:14-25`), then `safeParse` against the Zod schema.

---

## §5 Match analysis

| # | Field | Zod requires (`patches.ts:#`) | AgentProxy returns | Claude adapter produces | Match? |
|---|-------|---|---|---|---|
| 1 | `envelope.patches` array | `min(1).max(20)` (`:18`) | parsed from `expected_envelope_json` text (DB-curated) (`agentProxyAdapter.ts:78`) | parsed via `safeJson` from `r.content[].text` join (`claudeAdapter.ts:58-65`) | **PARTIAL — medium**: AgentProxy fixtures are hand-validated; live LLM may emit `patches:[]` (zero) which Zod rejects as `validation_failed`. |
| 2 | `patches[i].op` enum | `'add'\|'replace'\|'remove'` (`:9`) | per-fixture; trusted | LLM-generated; depends on system-prompt Γ R2 (`system.ts:48-50`) | **PARTIAL — medium**: live LLM might emit `op:'move'/'copy'` (RFC-6902 ops not in schema). |
| 3 | `patches[i].path` regex | `/^\/(?:[^/~]|~0|~1)+(...)?$/` (`:10`) | per-fixture | LLM-generated; allowed-paths injected via `renderAllowedPathsForPrompt` (`system.ts:172`) | **PARTIAL — medium**: live LLM may emit empty string or non-RFC paths. |
| 4 | `patches[i].value` | `unknown.optional()` (`:11`) | per-fixture | LLM-generated; arbitrary JSON | **MATCH — low**. |
| 5 | `summary` length | `string.max(140).optional()` (`:19`) | per-fixture | LLM-generated; no max enforced in prompt OUTPUT_RULE (`system.ts:71-72`) | **PARTIAL — medium**: live LLM may exceed 140 chars; AISP atom declares `≤140` but isn't repeated in OUTPUT_RULE. |
| 6 | Top-level shape | `{patches, summary}` only (`:17-20`) | exact (fixture-controlled) | LLM may add extra keys (e.g. `reasoning:`) | **PARTIAL — low**: Zod `safeParse` strips unknown keys by default — extras pass. |
| 7 | First char `{` | `Ε V3` in atom (`system.ts:66`) | guaranteed by `JSON.parse` of pre-validated string | best-effort via `safeJson` fence-strip + `responseParser.ts:14-25` slice | **PARTIAL — medium**: real LLM may prepend prose; mitigated by `normalize()` slicing first `{` to last `}`. |
| 8 | RFC-6902 escape (`~0`/`~1`) | regex permits both | per-fixture | live LLM rarely emits — paths use plain `/sections/0/...` | **MATCH — low**. |
| 9 | Patch count cap | `max(20)` (`:18`) | per-fixture | OUTPUT_RULE doesn't restate `≤20` (atom Γ R7 only at `system.ts:55`) | **PARTIAL — low**: live LLM may emit 21+; Zod rejects. |
| 10 | Forbidden ops at `value` | not in Zod | per-fixture | unsafe values caught downstream by `validatePatches` (`patchValidator.ts:35`) | **MATCH — N/A** (validation tier 2). |
| 11 | `LLMResponse.tokens` | (not in Zod — outer envelope) | `{in,out}` from `estimateTokens` (`agentProxyAdapter.ts:87-88`) | `{in,out}` from `r.usage.input_tokens/output_tokens` (`claudeAdapter.ts:61-62`) | **MATCH — low**: same shape. |
| 12 | `LLMResponse.cost_usd` | (outer envelope) | hardcoded `0` (`agentProxyAdapter.ts:121`) | `(in*1.0 + out*5.0)/1e6` (`claudeAdapter.ts:11,67`) | **MATCH — low**: shape match; semantic mismatch (mock=$0 always). |

**Field count: 12** (≥10 requirement satisfied).

**Critical mismatch surfaces:** Rows 1-3, 5, 7, 9 share the same root cause — **AgentProxy returns vetted fixtures while a real LLM may emit non-conforming output that fails Zod**. Pipeline correctly handles via `validation_failed` errorKind (`chatPipeline.ts:216-217`).

---

## §6 Async behavior

- **AgentProxy resolves**: synchronous SQL + JSON.parse → resolves on next microtask. Effective latency **<1ms** (`agentProxyAdapter.ts:50-123` has zero `setTimeout`/`await sleep`).
- **Real Claude resolves**: always async — network round-trip (~50-200ms) + inference (~500-3000ms for Haiku 4.5). `messages.create` is a single network call.
- **Wrapper timeout**: `auditedComplete.ts:21` sets `CALL_TIMEOUT_MS = 30_000`; AbortController plumbed at `auditedComplete.ts:208-222`; AbortError → `{kind:'timeout'}`.

**Risk: timing-dependent code**

- Re-entrancy mutex at `auditedComplete.ts:114-117` (`store.inFlight`) — AgentProxy releases sub-ms so back-to-back submits never block; live LLM holds the mutex 0.5-30s, surfacing UI states (disabled input, pending spinner) **never exercised by AgentProxy traces**. Mitigation: `auditedComplete.ts:308-311` uses `finally` so mutex always releases.
- `chatPipeline.ts:635` `await runLLMPipeline(...)` — single `await`; correctly handles slow LLM. No racing code.
- `auditedComplete.ts:209` `setTimeout(...CALL_TIMEOUT_MS)` arms abort; AgentProxy never trips it (sub-ms resolve), so the abort path is **untested in scenario fixtures**.

**Carry-forward to B1-B4:** scenario logs from AgentProxy will show `latency_ms ≈ 0`; do **not** infer real-LLM behavior from that field.

---

## §7 Memory check

**Architecture claim under test:** "no LLM memory anywhere; every call stateless."

**Per-adapter inspection:**

- **ClaudeAdapter** (`claudeAdapter.ts:52-57`): `messages: [{ role: 'user', content: req.userPrompt }]` — single-turn array. **No client-side state** retained between calls (class holds `client` + `modelId` only at `:14-15`).
- **GeminiAdapter** (`geminiAdapter.ts:54-61`): `contents: req.userPrompt` — single string. Stateless.
- **OpenAIAdapter** (`openaiAdapter.ts:60-63`): `messages: [{role:'system'...}, {role:'user'...}]` — two-element array, no prior turns. Stateless.
- **OpenRouterAdapter** (`openrouterAdapter.ts:62-67`): identical to OpenAI shape. Stateless.
- **AgentProxyAdapter** (`agentProxyAdapter.ts:50-123`): pure function over `req.userPrompt`. `recordExamplePromptRun` writes to DB, but the adapter never **reads** prior runs to influence next response. Stateless to LLM.

**Verdict:** **CONFIRMED — no LLM-side memory.**

**chatPipeline history threading** — there IS conversation history, but it lives in the **system prompt** as a flattened text block, not as `messages[]`:

- `chatPipeline.ts:206`: `buildSystemPrompt({ configJson, history })` — `history` of last-N user/bradley turns passed in.
- `system.ts:92-97` (`renderHistory`): builds `RECENT MESSAGES (last N):\n- user: ...\n- bradley: ...` block, capped at `HISTORY_CAP = 6` (`system.ts:74`).
- This block is concatenated into the single `systemPrompt` string at `system.ts:177` and emitted via `req.systemPrompt` to every adapter.

**Implication:** Each LLM call ships history INSIDE the system prompt — the LLM has no implicit conversation memory; `messages[]` is always single-turn. AgentProxy ignores history entirely (matches by `userPrompt` only at `agentProxyAdapter.ts:57`), so **multi-turn coherence is untested in fixtures**.

---

## §8 Error path comparison

| Failure mode | AgentProxy code path | Real Claude code path | Divergence |
|---|---|---|---|
| Malformed JSON in response | Fixture is pre-validated → never happens. (If row hand-edited bad: `agentProxyAdapter.ts:79-85` returns `{kind:'invalid_response'}`) | `safeJson` returns `{__raw: text}` → `parseResponse` rejects → `validation_failed` (`responseParser.ts:34-43`) | AgentProxy bypasses the parse failure entirely. |
| Valid JSON, invalid path | `validatePatches` rejects (`patchValidator.ts:35-95+`) → `validation_failed` (`chatPipeline.ts:226-233`) | Same path | **MATCH**. |
| Rate limit (429) | N/A — no network | `classifyError` regex `/rate\s*limit\|429\|RESOURCE_EXHAUSTED/` (`adapterUtils.ts:45-47`) → `{kind:'rate_limit'}` → `chatPipeline.ts:213` maps to `rate_limit` | AgentProxy untested. |
| Timeout (>30s) | Cannot trigger naturally; only the entry abort-check (`agentProxyAdapter.ts:52-54`) | AbortController at `auditedComplete.ts:208-222` fires; SDK throws AbortError; `claudeAdapter.ts:69-71` → `classifyError` → `{kind:'timeout'}` | AgentProxy untested at runtime. |
| Markdown-fenced JSON | N/A — fixtures stored raw | `safeJson` strips ` ```json ... ``` ` (`adapterUtils.ts:26-29`); fallback to `responseParser.ts:14-25` regex | **MATCH** — both terminate at Zod parse. |
| No active project | Both fail at `auditedComplete.ts:140-153` `ensureSession()` → `{kind:'precondition_failed'}` | Same | **MATCH**. |
| In-flight mutex collision | Returns `{kind:'rate_limit', detail:'another call in flight'}` at `auditedComplete.ts:115` | Same | **MATCH** (but AgentProxy releases mutex too fast to ever hit this in practice). |

---

## §9 Verdict

| Dimension | Verdict |
|---|---|
| Schema match | **PARTIAL** — fixtures conform; live LLM may emit non-conforming envelopes (Zod rejects → `validation_failed`). |
| Async behavior | **GAPS** — AgentProxy is sub-ms; live LLM is 0.5-30s; mutex/timeout/cancel paths untested by fixtures. |
| Memory model | **CONFIRMED** — every adapter is single-turn; history lives in system prompt only; no client-side accumulation. |
| Error paths | **GAPS** — `rate_limit` / `timeout` / `network` / fenced-output / refusal paths effectively unreachable via AgentProxy. |

**Top 5 risks if Hey Bradley were switched to a live LLM tomorrow:**

1. **Schema-rejection rate spike** — live LLM emits 21+ patches, missing `summary` cap, prose-prefixed JSON, or `op:'move'`. Pipeline routes to `validation_failed` → user sees canned hint instead of build-result. Frequency unknown; the OUTPUT_RULE doesn't restate `|patches|≤20` or `summary≤140`. Severity **HIGH**.
2. **Latency UX gap** — `inFlight` mutex blocks for 0.5-30s; current ChatInput / ListenTab UX is built on near-instant returns. Disabled-state, pending spinner, abort affordance need real-LLM stress-test. Severity **HIGH**.
3. **Cost cap blast radius** — `getCapUsd()` defaults to $1.00 at `auditedComplete.ts:16`; Haiku 4.5 at `$1/$5 per 1M` lets ~150 calls/session hit the cap. AgentProxy is always `cost_usd: 0` so the cost-cap rejection branch at `auditedComplete.ts:192-200` is never exercised by scenario fixtures. Severity **MEDIUM**.
4. **History-in-prompt token bloat** — `renderHistory` caps at 6 turns × 240 chars (`system.ts:74,95`); `JSON_BYTE_CAP = 4096` for config JSON (`system.ts:75`); plus brand context (4096B). Real Claude/Gemini calls will eat 2400+ tokens **per turn** of input cost. Severity **MEDIUM**.
5. **Multi-turn coherence regression** — AgentProxy matches by exact userPrompt only; history is irrelevant. Live LLM **will** be sensitive to RECENT MESSAGES content; current corpus has zero multi-turn fixtures to validate. Severity **MEDIUM**.

---

## §10 Carry-forward to B1-B4

Each B agent (B1 Axon CLI dev / B2 adversarial edge cases / B3 listen mode / B4 Planning SaaS auth) MUST capture the full pipeline trace per prompt:

1. **`prompt`** — the verbatim user text submitted to `chatPipeline.submit()`.
2. **`intent_classification`** — output of INTENT atom (`aispRoute`, `verb`, `target`).
3. **`decomposition`** — DECOMP atom todos array (if `todos.length > 1`).
4. **`patches`** — the `parsed.envelope.patches` array (post-Zod, pre-apply).
5. **`personality_response`** — `derivePersonalityMessage` output string.
6. **`SQLite rows`** — `log_events` rows inserted (event types: input_event, intent_classification, decomposition, template_match, patch_validation, personality_display, response_summary) + `edit_history` row when `applied > 0`.

**Specifically flag any case where AgentProxy diverges from real-LLM expectations:**

- AgentProxy returns `latency_ms: 0` — note in trace as **synthetic-baseline**, not real timing.
- AgentProxy `cost_usd: 0` — the cost-cap path is unreachable.
- AgentProxy ignores `req.signal` after entry-check — abort mid-call cannot be exercised.
- AgentProxy ignores `history` — multi-turn fixtures cannot validate prompt threading.
- AgentProxy fixtures are pre-validated — Zod failure path & `safeJson` fence-strip path are **untested**.
- If a B-scenario expects a Zod-rejection, fixture must be hand-authored to emit a deliberately malformed envelope (currently no such fixture exists).

**Hard rule for B1-B4:** each prompt that produces `applied > 0` must have a corresponding `edit_history` row; each prompt regardless of outcome must have a `response_summary` row. Any missing row = pipeline trace gap = block sealed traces.
