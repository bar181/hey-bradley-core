# ADR-046: Multi-Provider LLM Architecture — Five Adapters Behind One Interface

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 18b

---

## Context

P17/P18 established the `LLMAdapter` interface (ADR-042) and the JSON-patch contract (ADR-044). Initial implementations were Claude Haiku, Gemini 2.5 Flash, and a Simulated fallback. Phase 18 added an in-tree `FixtureAdapter` for tests.

Phase 18b expands the matrix to capture three real-world needs that were out of scope for the MVP charter but are blocking the next maturity step:

1. **Cost-tier diversity.** Haiku is the precision tier but is paid; Gemini Flash has a free quota but is rate-limited; OSS contributors with no paid Anthropic or Google account need a path that costs $0 and works today.
2. **Free-tier accessibility.** OSS contributors evaluating Hey Bradley on a fork must be able to exercise the real LLM pipeline without billing setup. OpenRouter's `:free` model fan-out solves this.
3. **Agent-proxy testing.** The in-tree TS `FixtureAdapter` is too rigid for cross-LLM benchmarking. Replacing it with a DB-backed corpus (`example_prompts`) lets us run the same prompt against three real providers and compare drift against a predicted envelope.

---

## Decision

Expand the provider matrix to **five adapters**, all behind the same `LLMAdapter` interface:

| Provider value | Adapter | Tier | Use case |
|---|---|---|---|
| `simulated` | `SimulatedAdapter` (in-tree FixtureAdapter fallback) | Free | Module-init before DB ready; canned smoke |
| `mock` | `AgentProxyAdapter` (DB-backed `example_prompts`) | Free | Dev/test corpus; cross-LLM baseline |
| `gemini` | `GeminiAdapter` (model-configurable: `2.0-flash` free or `2.5-flash` paid) | Free / Balanced | Cost-conscious novice; multi-modal future |
| `openrouter` | `OpenRouterAdapter` (default `mistralai/mistral-7b-instruct:free`) | Free | OSS community; bring-your-own-model fan-out |
| `claude` | `ClaudeAdapter` (default `claude-haiku-4-5-20251001`) | Paid | Precision tier; capstone demo path |

### Default selection at runtime

- **DEV mode:** `mock` (DB-backed `AgentProxyAdapter`) — confirms pipeline integrity without spending money.
- **Production with no BYOK key:** `simulated` (in-tree fallback) — demos always work.
- **Production with BYOK key + `VITE_LLM_PROVIDER=claude|gemini|openrouter`:** that adapter, resolved by `pickAdapter`.

`pickAdapter` keeps ADR-042's invariant: a real adapter is never constructed without a key.

### Why three real providers (not just one)?

1. **Cost diversity.** Haiku ≈ $0.0019/turn, Gemini Flash free tier ≈ $0, OpenRouter `:free` models ≈ $0. Users pick by budget, not by what we hard-coded.
2. **Latency diversity.** Haiku p50 ≈ 3 s, Gemini Flash ≈ 2 s, OpenRouter free models ≈ 5–10 s. Different demos get different feel.
3. **Capability diversity.** Haiku precision; Gemini multi-modal headroom (Phase 19+ listen); OpenRouter community-model evaluation across hundreds of open-weight checkpoints.
4. **Agent-proxy as the fourth dimension.** DB-backed fixtures let us compare *predicted vs actual* responses across all three real providers to detect drift over model versions and prompt changes.

### Cross-LLM validation pipeline (the agent-proxy story)

- `example_prompts` table stores the prompt + predicted envelope (one row per canonical request).
- Each real provider, when run against the corpus, writes its actual response to `example_prompt_runs` keyed by `provider`.
- A future ADR (likely ADR-048) will define the comparison rubric (byte-equal / semantically equivalent / drift) and acceptance thresholds. Phase 18b only lays the storage and the `AgentProxyAdapter` read path.

---

## Alternatives considered

- **Single provider (just Claude).** Rejected. Concentration risk, billing-gated OSS contribution, no ability to detect provider-specific drift.
- **Two providers (Claude + Gemini).** Rejected. Both require an account with payment instruments on file (Gemini's free tier still requires Google Cloud auth). OpenRouter is essential for the unauthenticated OSS contributor.
- **Server-side gateway (we proxy to all providers).** Rejected. Violates the no-backend constraint (ADR-029) and centralizes BYOK keys server-side, breaking ADR-043's trust boundary.
- **Keep `FixtureAdapter` in-tree, add real providers only.** Rejected. In-tree fixtures cannot capture predicted envelopes per-prompt with the granularity cross-LLM benchmarking needs; the corpus has to be data, not code.

---

## Consequences

### Positive

- **OSS contributors can exercise the real pipeline at $0** via `openrouter` + a free model.
- **Cross-LLM drift becomes observable** through `example_prompts` + `example_prompt_runs`.
- **DEV defaults to `mock`** — CI and local iteration cost nothing and never hit a rate limit.

### Negative

- **Bundle gains a small fetch-based OpenRouter adapter** (~3 KB gzip; no SDK — uses raw `fetch`).
- **LLMSettings UI grows from 3 to 5 picker options.** Mitigated by grouping (Free / Paid).
- **The `cost.ts` `MODEL_COSTS` table grows.** Cost math gracefully returns `0` for unknown OpenRouter models (free-tier default).
- **Documentation burden increases proportionally** — mitigated by ADR-047 (logging — Wave 2) which captures actual costs per call for after-the-fact verification.

---

## Implementation pointer

- `src/contexts/intelligence/llm/agentProxyAdapter.ts` — DB-backed adapter, reads `example_prompts`
- `src/contexts/intelligence/llm/openrouterAdapter.ts` — fetch-based, no SDK
- `src/contexts/intelligence/llm/pickAdapter.ts` — factory, extended with `mock` and `openrouter` branches
- `src/contexts/persistence/migrations/001-example-prompts.sql` — corpus schema
- `src/contexts/persistence/repositories/examplePrompts.ts` — read/write API
- Phase 18b plan: `plans/implementation/phase-18b/` (Wave 1 / Wave 2)

---

## Reference

The ruvector upstream (`upstreams/ruvector/`) was inspected for logging-pattern parallels that inform per-provider call shaping and status enumeration; see `plans/implementation/phase-18b/ruvector-research.md`.

---

## Related ADRs

- ADR-042: LLM Provider Abstraction — the single-interface decision this ADR extends from 3 to 5 adapters
- ADR-043: API Key Trust Boundaries — BYOK contract; unchanged, applies to all five adapters
- ADR-044: JSON Patch Contract — response shape every adapter (real or proxy) must produce
- ADR-047: LLM Call Logging (Wave 2) — captures provider/model/tokens/cost per call for cross-LLM validation
