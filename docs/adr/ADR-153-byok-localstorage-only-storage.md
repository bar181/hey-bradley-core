# ADR-153: BYOK localStorage-Only Storage + Smoke-Test Policy

**Status:** Accepted
**Date:** 2026-05-16
**Phase:** P126 / GO-LIVE — FEATURE 2
**Cross-refs:** ADR-040 (Sensitive KV Export Strip) · ADR-042 (LLM Provider Abstraction) · ADR-043 (API Key Trust Boundaries) · ADR-047 (LLM Observability) · ADR-114 (Persistence Boundary Redaction) · ADR-149 (Audience Routing)

## Context

The Hey Bradley Builder shell ships a BYOK (Bring-Your-Own-Key) trust model: users paste their own provider API key and the platform routes LLM calls through it. The key never reaches our infrastructure. Before P126 / F2 the only way to set the key was the Settings drawer (`SettingsDrawer.tsx` → `LLMSettings`); a first-time user landing on `/builder` had no signal that BYOK existed, what state it was in, or how to set it. The owner brief at `plans/hitl/phase-126-go-live/human-2.md` FEATURE 2 makes BYOK a first-class always-visible UX surface (top-right hover panel).

Surfacing the BYOK panel reinforces — and DOES NOT relax — the key trust boundary established by ADR-043 + ADR-114 D3. This ADR locks the storage location, smoke-test policy, redaction discipline, and failure-mode UX for the new panel so the surface elevation does not introduce a regression.

## Decisions

### D1 — BYOK keys live in `localStorage` via the `kv` repository only

The existing `kv` repository (`src/contexts/persistence/repositories/kv.ts`) backed by `localStorage` is the SOLE persistence target for BYOK keys. The panel calls `useIntelligenceStore.setProviderAndKey(provider, apiKey, { remember: true })` which delegates to `writeBYOK` (`src/contexts/intelligence/llm/keys.ts`) — the canonical single writer to `kv['byok_key']` + `kv['byok_provider']`. No IndexedDB row, no `log_events.event_data` field, no `edit_history.before/after_snapshot` field, no `.heybradley` export entry, no migration column, no server-bound request body, no telemetry payload may carry the key. ADR-040 SENSITIVE_KV_KEYS already strips `byok_key` + `byok_provider` from exports; that mechanism continues to gate every `.heybradley` zip. ADR-043 + ADR-114 D3 redaction at every persistence boundary continues to apply — the panel introduces no new persistence path.

### D2 — Smoke test = 1-token Gemini ping on save (~$0.0000003)

When the user clicks **Save & test** the panel issues a single `POST` to `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` with body `{contents:[{parts:[{text:"ping"}]}], generationConfig:{thinkingConfig:{thinkingBudget:0}, maxOutputTokens:8}}`. The request is fired DIRECTLY from the browser via `fetch` — bypassing `auditedComplete` because (a) no audit row should be created for a credential check (per the `LLMSettings.handleTest` precedent — ADR-047 carve-out), and (b) the key is not yet stored, so there is no adapter to invoke. Cost is bounded at ~$0.0000003 per Gemini Flash 2.5 pricing (≤8 output tokens). On HTTP 200 + `candidates[0].finishReason ∈ {"STOP","MAX_TOKENS"}` the key is persisted via `setProviderAndKey` and the panel auto-collapses after 1.5 s. On HTTP 400 / 401 / 403 the key is REJECTED client-side without being written; on 429 the user sees a rate-limit hint and may retry; on network error the user sees "Could not reach Gemini — check connection."

### D3 — Redaction at every persistence boundary (reinforces ADR-043 + ADR-114 D3)

The panel introduces zero new event payloads. Specifically:

- `log_events.event_data` — no panel-originated emit; the smoke-test ping does NOT write to `log_events` (carve-out per ADR-047 §"connection check").
- `edit_history` — unchanged; the panel never calls `applyPatches`.
- `llm_calls` — unchanged; the smoke ping bypasses `auditedComplete`.
- `.heybradley` exports — ADR-040 SENSITIVE_KV_KEYS strip continues; new owner-facing dialogue (e.g. error messages) never includes the key string.
- Console / dev warnings — pass all error strings through `redactKeyShapes` (`src/contexts/intelligence/llm/keys.ts`) per ADR-043 §"redaction"; the panel does not directly log key-bearing strings.

The `LLMHealthStore` (`src/store/llmHealthStore.ts`) holds `'idle' | 'ok' | 'error'` only — three enum values, in-memory, never persisted, no key material.

### D4 — Failure-mode UX is explicit and recoverable

Three failure classes each have a distinct inline message:
1. **Invalid key** (HTTP 4xx) → red "Invalid API key — double-check and retry"; key is NOT stored; user can edit + retry.
2. **Network failure** → red "Could not reach Gemini — check connection."; key is NOT stored; user can retry once connectivity returns.
3. **Provider rate-limit** (HTTP 429) → red "Rate-limited — wait a moment"; key is NOT stored; user retries after backoff.

The success state shows green "Key active" inline + auto-collapses after 1.5 s; the persistent collapsed-pill then carries the green dot until the next chat round-trip flips `llmHealth` (the `setLLMHealth` wiring in `chatPipeline.ts`).

### D5 — Anti-pattern: NO server-side proxy endpoint

A future temptation would be to proxy the smoke test (or any LLM call) through a Hey Bradley server route to hide the user's key from the browser network log. **This is explicitly forbidden.** Routing the key through any server endpoint we operate recreates exactly the trust-boundary risk ADR-043 was written to eliminate: a server log row, a CDN trace, a load-balancer access log, or a misconfigured request inspector becomes a credential exfiltration vector. The BYOK panel is a browser-side surface that talks DIRECTLY to the provider; that is the design.

The single carve-out that does exist (the `/api/demo-chat` Vercel route from P124 / CF-P124-Vercel) uses our own server-side key for the no-BYOK demo-mode flow and does NOT touch user-supplied keys — see ADR-152 / P124 retrospective for the orthogonal flow.

## Consequences

- BYOK panel ships at `src/components/shell/BYOKPanel.tsx` (≤200 LOC) mounted in `AppShell.tsx`.
- `setLLMHealth` wired from `chatPipeline.ts` (~6 LOC) so the StatusBar LLM dot reacts to live round-trip outcomes.
- Smoke-test fixed at Gemini 2.5 Flash for P126; other providers (Claude / OpenAI / OpenRouter) continue to use the existing Settings drawer flow because the brief explicitly scopes the panel to Google. A future ADR may generalize the panel to multi-provider when usage data supports it.
- Zero new persistence boundaries; zero new server endpoints; zero relaxation of ADR-043 + ADR-114 D3 redaction discipline.
- `check-secrets.sh` continues to gate; the smoke-test fetch body does NOT include any committed key shape.
- `.heybradley` export bundle remains key-free per ADR-040 SENSITIVE_KV_KEYS.

## Carry-forwards

- **CF-P126-ADR153-1:** Generalize the panel to Claude / OpenAI / OpenRouter once the FEATURE 2 usage telemetry from the owner's qualitative review confirms the Gemini-only scope is the right floor (deferred to P127+).
- **CF-P126-ADR153-2:** Replace the inline `fetch` smoke test with a thin shared `pingProvider(provider, key)` helper when (a) the panel goes multi-provider and (b) the helper can be exercised under the existing test harness without leaking key material into test fixtures.
- **CF-P126-ADR153-3:** Surface the LLM-call latency on the green pill (e.g. "Key active · 240 ms") once we have a P-99 dashboard worth referencing; not in P126 scope.
