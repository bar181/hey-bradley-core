# ADR-150 — LLM Update Contract: Fast, JSON-Only Patches, Code-Driven Merge

**Status:** Accepted
**Phase:** P122 / UX-OVERHAUL + LLM-LIVE
**Date:** 2026-05-08
**Cross-refs:** ADR-044 (JSON-Patch validation) · ADR-045 (Crystal Atom system prompt) · ADR-047 (LLM SDK confinement) · ADR-049 (Cost-cap telemetry) · ADR-053 (AISP intent classifier) · ADR-126 (Comprehensive logging) · ADR-141 (Voice extraction)

---

## Context

P122 brings live BYOK Gemini calls online. The LLM sits at the centre of three loops: chat → JSON-Patch → preview update, listen → cleaned transcript → JSON-Patch, and (P124) hosted demo → JSON-Patch. Owner has limited BYOK budget — every call must be cheap, fast, and surgical. The smoke-test budget is **10 prompts / $1.00 per session**.

Without a tight contract, LLMs return prose, full-site JSON, mixed Markdown+JSON, hallucinated section types, or commentary that wastes tokens. The existing infrastructure (system prompt + Zod parser + path-whitelist validator) is correct but not sufficient — it is permissive about what the model *thinks* it must produce.

This ADR codifies the contract for a single class of LLM call: **the site-update call**. It does not cover decomposition (DECOMP_ATOM), intent classification (INTENT_ATOM), or content generation (CONTENT_ATOM) — those have their own atom contracts. This ADR is the contract for the inner JSON-Patch loop.

## Decisions

### D1 — Model lock: cheap + fast only

The site-update LLM call MUST use a model in the cheap-fast tier:

- **Default:** `gemini-2.5-flash` (current `geminiAdapter.ts:DEFAULT_MODEL`; rates `{in: 0.30, out: 2.50}` USD per 1M tokens).
- **Permitted alternatives:** `claude-haiku-4-5`, `gpt-4o-mini`, `gpt-5-nano`. Equivalent or cheaper rates required.
- **Forbidden for the site-update call:** any `pro` / `opus` / `sonnet-class` / o1 / `gemini-pro` model. Those are reasoning models; the site-update is a parsing-and-mapping task, not a reasoning task.

Selection rationale: the inner loop must return in < 1.5s wall-clock to feel real-time per the public-site "Real time, not rebuild" claim (P120.5). Pro-tier models cost 10×–50× more without changing the parsing-and-mapping quality on this task.

### D2 — Response shape: JSON-Patch only, never full site JSON

The model returns a JSON-Patch array (RFC-6902 subset, validated by the existing Zod schema at `src/lib/schemas/patch.ts`). The model **never** returns:

- The full site JSON.
- Prose explanation, Markdown, or commentary.
- A "reasoning trace" outside the patch body.
- A schema-shaped object that isn't a JSONPatch array.

Why: returning a 50-row patch is ~200 tokens out; returning a full site JSON is ~3,000–8,000 tokens out. The cost difference compounds across every interaction. The product is a JSON-Patch system; LLM responses must match the system shape.

Enforcement: the existing path-whitelist validator (ADR-044) rejects any non-JSONPatch shape. This ADR adds a system-prompt-level instruction making the contract explicit to the model so it doesn't have to guess.

### D3 — Code-driven merge, never LLM-driven merge

The merge of LLM-returned patches into the current site config happens in deterministic code (`applyPatches`) — never in the LLM. The LLM is told the *current state* of relevant fields (so it can produce a correct patch) but it is not asked to merge.

Why: merging is a deterministic operation with well-known semantics (RFC-6902). LLMs hallucinate field paths, drop unrelated fields, or invent intermediate shapes when asked to merge. Code merges in microseconds, deterministically, with bounded failure modes.

Operational rule: if a feature seems to need "the LLM to combine two configs", split it into (a) LLM produces patch A from current state, (b) code applies patch A, (c) code produces context for the next LLM call from new state, (d) LLM produces patch B. Never (a) → LLM(state, target) → merged result.

### D4 — System prompt structure (locked)

Every site-update call ships with a system prompt that includes, in this exact order:

1. **Role**: "You produce JSON-Patch arrays that mutate a website configuration."
2. **What is available to update**: enumerated section types (the 18 canonical from ADR-100), the field-path schema (Zod-derived path regex from ADR-044), and the operation set (`add` / `replace` / `remove` — not `move` / `copy` / `test` for the v1 contract).
3. **Requirements**: "Return a JSON-Patch array. No prose. No code fences. No commentary. If you cannot satisfy the request safely, return `[]`."
4. **Current state context**: only the slices of site config relevant to the user's prompt — never the full site. The slice is computed by a code-side context-builder, not by the LLM.
5. **User prompt verbatim**.

The Crystal Atom system prompt at `src/contexts/intelligence/prompts/system.ts` (PATCH_ATOM, ADR-045) holds the source of truth. P122 / W6 verifies it matches this ADR; any drift is a P122 fix-pass item.

### D5 — Guardrails the model cannot violate

- **Path whitelist**: any path outside the Zod regex is rejected at validation time (existing, ADR-044).
- **Section-type whitelist**: any `type` value outside the canonical 18 is rejected (existing, ADR-100).
- **Image URL allow-list**: any `imageUrl` outside the configured CDN/local-image set is rejected (existing, ADR-045).
- **Cost cap**: every call counts against the per-session `VITE_LLM_MAX_USD` cap (existing, ADR-049). When the cap is hit, the next call short-circuits to the canned fallback (existing, ADR-019/020 fallback).
- **NEW per this ADR — turn budget**: a single user prompt produces at most 1 LLM call to the site-update endpoint. Multi-clause prompts are split by DECOMP_ATOM (ADR-099) BEFORE reaching the site-update call; each todo is a separate call. The budget for a smoke-test session is **10 LLM calls / $1.00**.

### D6 — Logging contract

Every site-update call records a row in `llm_logs` (ADR-046/047) and a `response_summary` event in `log_events` (ADR-126). Required columns/fields:

- `model` (string, exact id e.g. `gemini-2.5-flash`)
- `input_tokens` / `output_tokens`
- `cost_usd` (computed deterministically from adapter `COST_PER_M`)
- `latency_ms`
- `prompt_hash` (SHA-256 of system + user prompt; for cache lookup later)
- `result_kind` ∈ `{patch_applied, patch_validation_failed, parse_error, cap_short_circuit, fallback_canned}`
- `request_id` and `parent_request_id` (per ADR-126 D2/D3)

Redaction: the `redactKeyShapes` helper runs on every `prompt_text` / `response_text` field before write per ADR-043 + ADR-114 D3. No raw API key shape (`sk-…` / `AIza…` / `key=…`) ever lands in any persisted column.

### D7 — Cost-cap visibility (UI contract)

The `CostPill` component (ADR-049) MUST be visible in every mode the user can issue a site-update from: builder (chat + listen), Agentics (LLM-Log panel header), and on the public `/walkthrough` if it ever ships a real BYOK demo (P124+). Owner can see the spend in real time without context-switching.

Smoke-test session budget: **10 LLM prompts max** during P122/P123. With `gemini-2.5-flash` at expected ~500 input + 200 output tokens per turn, projected per-call cost is `(500 × 0.30 + 200 × 2.50) / 1_000_000 ≈ $0.000650`. 10 calls ≈ $0.0065. Well under the $1.00 cap; the cap exists for safety, not budget.

## Consequences

**Wins:**

- LLM cost predictability — every call is bounded.
- Response time predictability — `flash`-tier models return in 200–800ms typical.
- Failure mode predictability — invalid responses are rejected at validation, not silently merged.
- BYOK trust boundary preserved — keys never persist; logs are redacted.
- The contract scales: P124 demo mode (server-side key, IP rate limit) reuses the same shape.

**Trade-offs accepted:**

- Cheap models occasionally produce a malformed patch. The fallback is `[]` (no-op) — not crash, not retry-with-pro-model. The user sees the canned-fallback chat reply ("That came back malformed; try rephrasing") and the build remains intact.
- Multi-clause prompts cost N calls (one per DECOMP todo). For "make hero brighter and add a pricing section", that's 2 calls (~$0.0013 total). Acceptable.

**Future:**

- ADR-151+ MAY introduce a result-caching layer keyed by `prompt_hash` to skip identical re-prompts (cost saving for demo loops). Out of scope for P122–P124.
- A future `policy` field in the site-update call response could let the model signal *why* it returned `[]` (e.g. "out of scope" / "ambiguous" / "would violate brand lock"), which would feed into UX micro-copy. Out of scope for v1.

## Implementation checklist (P122 / W6 — co-running)

- [x] `geminiAdapter.ts:DEFAULT_MODEL = 'gemini-2.5-flash'` — verified at `src/contexts/intelligence/llm/geminiAdapter.ts:9`. No override path uses `pro` for the site-update call.
- [ ] `prompts/system.ts:PATCH_ATOM` matches D4 ordering — partial; `OUTPUT_RULE` sits at position 9 (after CURRENT JSON) instead of position 3. `CRYSTAL_ATOM` carries the `R8: {prose,html,markdown,fences}=∅` requirement symbolically up front, so the runtime contract is communicated, just split between two prompt sections. Documentation-vs-implementation gap; carry-forward CF-P123-A3 (P124 candidate — pick rewrite system.ts OR rewrite ADR-150 D4).
- [x] `chatPipeline.ts` site-update call site emits a `response_summary` log per D6 (column shape exists in `llm_logs` per `migrations/002-llm-logs.sql:22` + `repositories/llmLogs.ts:28,53,61`; `prompt_hash` / `model` / `input_tokens` / `output_tokens` / `cost_usd` / `latency_ms` all wired). Carry-forward CF-P123-A2: ADR-150 D6 prescribes `result_kind ∈ {patch_applied, patch_validation_failed, parse_error, cap_short_circuit, fallback_canned}` enum, but `chatPipeline.ts` emits `stage ∈ {decomp, template, legacy-template, llm, canned-fallback}` — semantically adjacent but vocabulary-divergent. Pick one; document the choice (P124 candidate).
- [x] `CostPill` visible in Agentics layout per D7 — verified at `src/pages/Agentics.tsx:141` with `flex-shrink-0 whitespace-nowrap` (P123 / W3 always-visible promise).
- [x] Smoke test in W6: real Gemini call landed via `tests/p123-llm-smoke.spec.ts`; results at `docs/audit/p123-llm-smoke-results.md`; 1 row written, all D6 fields populated, redaction holds (post-write grep returns 0 hits for `AIza`/`sk-`/`Bearer` shapes); spend recorded $0.000163.
- [ ] Persona-Playwright verification (W11 NEW): chat-mode prompt → patch returned → preview updated → log row visible in Agentics LLM-Log panel. ≤2 LLM calls. — W11 PARTIAL per P122 retrospective; audit doc deferred to CF-P122-W11-1.
- [x] Total P122 LLM smoke spend recorded in retrospective; must be < $0.05. — Verified $0.000163 << $0.05.

## Authorship

Bradley Ross — owner, AISP author, capstone defender. ADR drafted during P122 / W6 dispatch as the codified contract for live LLM site-updates across P122 → P124.
