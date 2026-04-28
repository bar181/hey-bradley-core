# ADR-042: LLM Provider Abstraction — Browser-only, BYOK + Env Var

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 17

---

## Context

Phase 17 begins the LLM stage of Hey Bradley. The MVP charter (ADR-029) forbids a backend, which means every LLM call originates in the browser. Two providers are in scope for MVP — Anthropic Claude (Haiku) and Google Gemini (Flash) — plus a simulated fallback that keeps demos and offline development working when no key is present.

Three forces shape the decision:

1. **Provider neutrality.** Pricing, latency, and rate-limit behavior between Claude and Gemini differ enough that locking the codebase to either is premature. The chat input (Phase 18) and the listen pipeline (Phase 19) must call exactly one function regardless of which provider is active.
2. **Bring-your-own-key.** The deployed bundle ships no key. Production users paste their own key in Settings. Dev uses a `.env.local` value for fast iteration. Both paths must converge on the same call site.
3. **Browser-only constraint.** Both Anthropic and Google publish browser-capable SDKs. Anthropic requires `dangerouslyAllowBrowser: true`, which is acceptable in BYOK / dev contexts (ADR-043 records the security boundary).

Without a single seam, every call site would re-derive provider selection, key resolution, error classification, and cost math. That cost compounds across Phases 18–20.

---

## Decision

Adopt a single `LLMAdapter` interface in `src/contexts/intelligence/llm/` with three implementations and a factory that resolves the active adapter at boot.

### 1. Interface

```ts
interface LLMAdapter {
  name(): 'claude' | 'gemini' | 'simulated';
  complete(req: LLMRequest): Promise<LLMResponse>;
  testConnection(): Promise<boolean>;
}
```

`LLMResponse` is a tagged union: `{ ok: true, json, tokens, cost_usd }` or `{ ok: false, error, detail? }` with `error ∈ { 'no_key' | 'rate_limit' | 'network' | 'invalid_response' }`. Every error class is enumerable; callers cannot encounter an unmodeled failure.

### 2. Implementations

- **`ClaudeAdapter`** — `@anthropic-ai/sdk`, model `claude-haiku-4-5-20251001`, constructed with `dangerouslyAllowBrowser: true`.
- **`GeminiAdapter`** — `@google/genai`, model `gemini-2.5-flash`.
- **`SimulatedAdapter`** — re-uses `cannedChat.ts`. Used whenever no key is available or `VITE_LLM_PROVIDER=simulated`.

### 3. Boot-time resolution

```
cfg = readEnv()
key = cfg.envKey ?? kv.get('byok_key') ?? ''
adapter = pickAdapter(cfg.provider, key)
intelligenceStore.set({ adapter, status: key ? 'connected' : 'no_key' })
```

`pickAdapter` returns `SimulatedAdapter` whenever the chosen provider lacks a key, so no caller can construct a real adapter without one.

### 4. Code-splitting

Vite splits each provider SDK into its own chunk. Only the active provider's chunk is fetched, capping bundle impact at the cost of one provider, not both.

### 5. Audit log

Every `complete()` call writes one row to `llm_calls` (per ADR-040) with provider, model, tokens, cost, status, and the patch payload. The error text never includes the API key (per ADR-043).

---

## Alternatives considered

- **LangChain.js.** Rejected. Heavy dependency graph, frequent breaking changes, opinionated runnable abstractions we do not need at MVP scope. The interface above is ~30 lines.
- **Vercel AI SDK.** Rejected. Oriented toward Edge runtime and streaming-first UX. We are not on Edge and Phase 17 explicitly defers streaming.
- **Hand-rolled `fetch`.** Rejected. The official SDKs handle retries, request shaping, and tokenizer-side concerns adequately. Re-implementing them is yak-shaving with no MVP payoff.
- **One provider only (Claude).** Rejected. Locks the project to a single vendor's pricing and availability before either has been measured against real users. Dual-provider from day one keeps the option open at trivial cost.

---

## Consequences

### Positive

- **Single seam.** Chat (Phase 18) and listen (Phase 19) call `adapter.complete()` and remain provider-agnostic.
- **Demos always work.** `SimulatedAdapter` is the default fallback; a novice with no key sees identical UX to today's canned chat.
- **Future tool-use upgrade fits.** When provider tool-use (function calling) becomes worth the complexity, it slots in behind the same interface without touching call sites.
- **Cost transparency.** Every call is metered and audit-logged from day one (per ADR-040 `llm_calls` table).

### Negative

- **Two SDK dependencies.** Combined ≈ 80 KB gz after code-split. Acceptable for the optionality gained.
- **User IP exposed to provider.** Direct browser-to-provider calls reveal the user's IP and key to Anthropic / Google. This is the BYOK contract (ADR-043).
- **Browser CORS surface.** Some networks may block direct provider calls. Mitigated by the optional dev proxy script (`scripts/llm-proxy.mjs`) and `VITE_LLM_BASE_URL`.

### Risks

- **SDK browser support breaks.** If either SDK drops `dangerouslyAllowBrowser`-equivalent support, that provider degrades to `experimental`; the abstraction limits blast radius to one file.
- **Provider rate-limit shapes diverge.** Mitigated by the unified `error: 'rate_limit'` classification and per-adapter `classifyError`.

---

## Implementation pointer

- `src/contexts/intelligence/llm/adapter.ts` — interface + request/response types
- `src/contexts/intelligence/llm/claudeAdapter.ts` — Anthropic implementation
- `src/contexts/intelligence/llm/geminiAdapter.ts` — Google implementation
- `src/contexts/intelligence/llm/simulatedAdapter.ts` — canned fallback
- `src/contexts/intelligence/llm/pickAdapter.ts` — factory + env reading
- `src/contexts/intelligence/llm/cost.ts` — token + USD math
- `src/store/intelligenceStore.ts` — `{ adapter, status, lastError, sessionUsd }`
- Phase 17 plan: `plans/implementation/mvp-plan/03-phase-17-llm-provider.md`

---

## Related ADRs

- ADR-040: Local SQLite Persistence — `kv` table holds the BYOK key; `llm_calls` table holds the audit log
- ADR-043: API Key Trust Boundaries — security envelope around the keys this abstraction consumes
- ADR-044: JSON Patch Contract (future, Phase 18) — defines the response shape every adapter ultimately returns
