# A3 — BYOK + LLM + Pipeline Audit

> **Phase:** P114 / Wave 1 · **Agent:** A3 · **Mode:** RESEARCH ONLY
> **Date:** 2026-05-06 · **Branch:** swarm/p114-feature-audit-fix
> **Predecessor signal:** persistence-verify G6 ("Remember key" plaintext)

## Q1 — BYOK key handling

### Entry surface
- Sole UI entry: `src/components/settings/LLMSettings.tsx:121-131` (`<input id="llm-key" type="password">`); reached via Settings drawer (`SettingsDrawer.tsx`).
- Save path: `setProviderAndKey(provider, key, { remember })` in `intelligenceStore.ts:160-172` calls `writeBYOK(...)` in `keys.ts:33-44`.
- Format hint helpers: `looksLikeAnthropicKey` / `looksLikeGoogleKey` / `looksLikeOpenAIKey` / `looksLikeOpenRouterKey` (`keys.ts:66-86`). `OpenRouter` is **not exported via barrel** (`llm/index.ts:13-21` omits it; the LLMSettings UI never validates OpenRouter keys — silent gap).

### Storage model
Two tiers, both controlled by `keys.ts:14-15`:
1. **In-memory module-scoped vars** `inMemoryKey` / `inMemoryProvider` (always set on `writeBYOK`).
2. **Persisted to `kv` SQLite table** ONLY when `opts.remember === true` (`keys.ts:36-38`).
   - `kv` lives in IndexedDB via sql.js (`db.ts` + `kv.ts:23-30`).
   - **PLAINTEXT.** No encryption. No webcrypto wrap. Anyone with file-system access to the user's IndexedDB DB can read the API key.
   - Honest finding: ADR-043 + LLMSettings:212 ("held only in memory unless you tick Remember") are accurate, but the persisted form has no key-at-rest protection. Same trust class as `chrome://indexeddb-internals` browsing.

### redactKeyShapes — write-site coverage
`redactKeyShapes` (`keys.ts:94-106`) catches `sk-ant-…`, `sk-proj-…`, `sk-or-…`, generic `sk-…`, `AIza…` (35-char), `Bearer …`. Coverage at write boundaries:
- `auditedComplete.ts:286` — `llm_calls.error_text` (belt-and-suspenders, FIX 1).
- `openrouterAdapter.ts:73` — non-200 fetch body before surfacing as `invalid_response` detail.
- `chatPipeline.ts:327, 328, 636, 724` — `input_event` / `listen_capture` / `personality_display` log emits.
- `useListenPipeline.ts:165` — `appendListenTranscript` write.
- `webSpeechAdapter.ts:79-80` (per the FIX 7 comment).
- `adapterUtils.ts:44` — every adapter classifyError detail.
- ✅ Comprehensive at the write boundaries audited.
- **Gap:** `recordLLMLog` write at `auditedComplete.ts:175-176` stores raw `system_prompt` + `user_prompt` UNREDACTED. ADR-047 / `exportImport.ts:83` truncates `llm_logs` on export so secrets never leave the device, but in-DB the prompts retain any user-typed key shape until export-strip. If a user pastes a key into the chat box, it sits in `llm_logs.system_prompt` plaintext.

### Logout / clear-key UX
- `LLMSettings.tsx:88-93` `handleClear` → `window.confirm` → `clearKey()`.
- `intelligenceStore.ts:174-181` `clearKey` ends active session, clears BYOK, re-runs init.
- `keys.ts:47-52` `clearBYOK` zeroes both memory and `kv`.
- ✅ Clean. Single-button, single-confirm UX.

### Verdict — Q1
- **P2:** OpenRouter key validation never wired into LLMSettings (`looksLikeOpenRouterKey` exists, never imported by LLMSettings.tsx).
- **P2:** Plaintext IndexedDB persistence is documented but not encrypted; honest gap. Pre-launch acceptable per ADR-043; flag for Tier-2 with WebCrypto-wrapped `kv` row.
- **P3:** `llm_logs.system_prompt` / `user_prompt` are unredacted in-DB (export strip protects boundary, but in-device forensics see plaintext). Add `redactKeyShapes` at `auditedComplete.ts:175-176` write site.

## Q2 — 5 LLM providers

### Adapter inventory
CLAUDE.md claims 5 providers (Claude / Gemini / OpenRouter / OpenAI / **Cohere**). **Cohere does not exist** in source — `grep -n "[Cc]ohere" src/contexts/intelligence/llm/` returns zero hits. Actual adapter set per `pickAdapter.ts:53-108`:

| Provider | File | SDK | Default model | Browser flag |
|---|---|---|---|---|
| `claude` | `claudeAdapter.ts` | `@anthropic-ai/sdk` | `claude-haiku-4-5-20251001` | `dangerouslyAllowBrowser: true` (line 18) |
| `gemini` | `geminiAdapter.ts` | `@google/genai` | `gemini-2.5-flash` | n/a (no browser-allow flag needed) |
| `openai` | `openaiAdapter.ts` | `openai` | `gpt-5-nano` | `dangerouslyAllowBrowser: true` (line 22) |
| `openrouter` | `openrouterAdapter.ts` | bare `fetch` | `mistralai/mistral-7b-instruct:free` | n/a |
| `simulated` | `simulatedAdapter.ts` | none (canned) | `simulated-v1` | n/a |
| `mock` | `agentProxyAdapter.ts` | DB fixture lookup | `agent-proxy-v1` | n/a |

`adapter.ts:5-11` `LLMProviderName` declares `'claude' | 'gemini' | 'openai' | 'openrouter' | 'simulated' | 'mock'` — 6 names. **CLAUDE.md "Cohere" is documentation drift.** Actual on-disk = 4 real providers + 2 dev/canned.

### Interface conformance
All 4 real adapters + simulated + mock implement `LLMAdapter` (`adapter.ts:39-48`): `name() / testConnection() / complete(req) / label() / model()`. Conformance verified by reading each file. `complete()` always returns `LLMResponse` discriminated union (`{ ok: true, ... } | { ok: false, error: LLMError }`) — no thrown errors; all paths funnel through `classifyError` (`adapterUtils.ts:42-55`).

### Default provider selection
`pickAdapter.ts:59` reads `args?.provider ?? env.VITE_LLM_PROVIDER ?? 'simulated'`. In DEV with no key, picks `AgentProxyAdapter` if DB ready else `FixtureAdapter` (lines 76-82). Production no-key → `SimulatedAdapter` (line 82). Sensible.

### Provider switching mid-session
- `intelligenceStore.ts:160-172` `setProviderAndKey(provider, key, opts)` writes BYOK + re-picks adapter + updates store.
- Active session (`activeSession` row in DB) is NOT ended on provider switch — `llm_calls.session_id` continues across providers, which is consistent with "session = project-scoped continuum" but makes per-provider cost attribution harder.
- **Gap:** no observability log when provider swaps (no `provider_change` event_type in migration 005 CHECK enum).

### Failure modes — malformed responses
- `safeJson(text)` (`adapterUtils.ts:25-35`) tolerates code fences + falls back to `{ __raw: text }` on parse failure.
- `parseResponse(json)` (`responseParser.ts:31-46`) accepts string OR object, normalizes prose-around-JSON, validates against `PatchEnvelopeSchema` (Zod), returns `{ ok: false, reason }` on schema fail.
- `runLLMPipeline` in `chatPipeline.ts:225-238` records `recordPipelineFailure(callId, 'parse', ...)` on parse fail, `'validate'` on Zod fail.
- ✅ All 4 real adapters route every error path through `classifyError`. Malformed JSON → `invalid_response`. SDK throw → `classifyError`. HTTP non-200 (OpenRouter) → `invalid_response` with redacted body.
- **Gap (OpenAI):** `openaiAdapter.ts:72-75` surfaces `message.refusal` as `invalid_response` BUT **does not return tokens / cost on the refusal branch** (zero charges credited). For a refusal the input tokens were still consumed; the user's session cap math undercounts. Minor — refusals are rare and `cost_usd` for the refusal call is at most `prompt_tokens × in-rate` ≈ <$0.001.
- **Gap (Gemini):** `geminiAdapter.ts:62-72` races SDK promise vs abort. SDK fetch can leak in background — known C20 GOAP carry-forward, documented in adapter source.
- **Gap (cost.ts staleness):** `cost.ts:5-11` `MODEL_COSTS` lists `claude-haiku-4-5-20251001` at `{in:0.25, out:1.25}`; `claudeAdapter.ts:11` `COST_PER_M` says `{in:1.0, out:5.0}` — **4× divergence**. `gpt-5-nano` + `claude-haiku-4-5-20251001`'s real Anthropic 2026 pricing ($1/$5) is in the adapter, the projected-cap math reads `MODEL_COSTS` ($0.25/$1.25). Cap math undercounts by 4× for Claude. `gpt-5-nano` is missing from `MODEL_COSTS` entirely → `isKnownModel('gpt-5-nano')` returns false → `estimateMaxCostForModel` returns 0 → projected upper bound = $0 → cap check always passes regardless of cap. **OpenAI is effectively uncapped.** Same for any paid OpenRouter model.

### Verdict — Q2
- **P1 (security/correctness):** `cost.ts MODEL_COSTS` 4× understates Claude price + `gpt-5-nano` missing entirely → OpenAI projected-cost = 0 → cost cap is non-functional for OpenAI. Treat as cap-bypass bug.
- **P3:** CLAUDE.md "Cohere" docs drift — Cohere never shipped. Update README + CLAUDE.md; either ship Cohere or remove the claim.
- **P3:** OpenRouter key format never validated in LLMSettings UI.

## Q3 — Chat pipeline trace

### `submit(opts)` entry to return — `chatPipeline.ts:299-790`

1. `text = opts.text.trim()` → empty short-circuit (line 304).
2. **Page scope** — `getActivePage(config, activePageId)` (line 320); single-page mode collapses to byte-equivalent.
3. **Log envelope** — `logCtx = { requestId: newRequestId(), sessionId, projectId, pageId, pageIndex, source }` (lines 322-326).
4. `emit input_event` + (if listen) `emit listen_capture` (lines 327-328) — both `redactKeyShapes`-wrapped.
5. **`effectiveText`** (line 341) — `cleanTranscript(text)` on listen, raw on chat. ADR-127 wired since P105.
6. **AISP classify** — `classifyIntent(effectiveText, projectType)` (line 393); LLM-fallback to `llmClassifyIntent` if confidence low (lines 397-405).
7. **Voice extraction** (P113 / A4) — `chatPipeline.ts:413-437`. Fires when `opts.source === 'chat'` AND `aisp.verb === 'add'` OR `!aisp.target` AND `currentVoice.length === 0` AND `voice.confidence > 0.5`. Emits JSON-Patch `replace /site/voiceAttributes` BEFORE downstream paths.
8. **DECOMP_ATOM** (lines 464-555) — `decompose(effectiveText, aisp, config.pages)`; emits `decomposition`; if `≥2 todos & confidence ≥0.7`, runs `executeTodos` + applies composed patches per-todo-page-scope; emits `decomp_split` + `todo_execution` + `patch_validation` + `response_summary`; returns early.
9. **Template matcher** (lines 558-601) — `matchTemplates(effectiveText, scopedConfig)`; emits `template_match`; if `confidence ≥ TEMPLATE_CONFIDENCE_THRESHOLD`, applies + returns early with `matcherConfidence` chip.
10. **Legacy template router** (lines 602-674) — `tryMatchTemplate(canonicalForTemplate)` post-AISP-translate; if matches with patches → apply + return.
11. **Content-route gate** (lines 688-706) — when `aispRoute === 'content'` AND no template matched, returns canned hint (avoids wrong-shape JSON patch from LLM).
12. **LLM patch path** (lines 708-742) — `runLLMPipeline(effectiveText, source, history, scope)`; on success, applies patches + emits trace events.
13. **Canned fallback** (lines 770-790) — `runCanned(text)`; final hint.

### Per-stage observability
- `input_event` / `listen_capture` / `intent_classification` / `decomposition` / `decomp_split` / `todo_execution` / `multi_page_scope` / `template_match` / `patch_validation` / `personality_display` / `response_summary` — all emit through `emit()` (line 282) which writes via `writeLogEvent(getDB(), ...)` per ADR-126.
- ALL log writes are `try/catch` fire-and-forget (`emit` line 285; `editHist` line 290). Pipeline never throws because of log failure.
- `writeErrorEvent` wraps catch sites at lines 553, 599, 657, 766 (P107 / A6 closure). Both `message` and `stack` are `redactKeyShapes`-passed inside `comprehensiveLogs.ts:writeErrorEvent`.

### Gaps in trace
- **Voice extraction emits no log event.** P113/A4 changes `site.voiceAttributes` but emits no `voice_extraction` (or any) event. Forensic blind spot — owner cannot grep the log for "when did this site's voice get populated?"
- **Sequencing concern:** `voiceExtraction` fires AFTER `classifyIntent` but BEFORE template-matcher / DECOMP. Since voice attrs influence template selection (e.g. `dry-humor-narrator` storytelling preset), the matcher in the same call could see the just-applied voice. ✅ Correct ordering, but undocumented.
- **No `provider_change` event** when user swaps providers mid-session (Q2 finding).
- `runLLMPipeline` errors that hit the outer try/catch at line 760 emit via `recordPipelineFailure(null, ...)` AND `writeErrorEvent`. ✅ Defence-in-depth.

### Verdict — Q3
- **P2:** Add `voice_extraction` log_event (or fold into `intent_classification` event_data) so the voice patch is observable.
- **P3:** Document the per-stage flow in a single page-of-paper diagram (no such doc exists today; readers must trace 790 LOC).

## Q4 — Listen mode quality

### 2-stage capture per ADR-127
Yes. `useListenPipeline.ts:181-233` `submitListenFinal` builds review card; `handleListenApprove` (lines 240-250) fires `runListenPipeline` only after explicit user approve. Stage 1 = capture + review; Stage 2 = approve + chat-pipeline submit.

### cleanTranscript pipeline
Wired at `chatPipeline.ts:341` (`effectiveText = opts.source === 'listen' ? cleanTranscript(text) : text`). Pure rules-based (`transcriptCleanup.ts:12-22`): strips disfluencies (`uh+`/`um+`/`like`/`you know`), false-starts (duplicated word), trailing pauses (`...`/`—`), multi-space collapse. Idempotent. Tested in P108/A10 helpers behavioral spec.

### ListenReviewCard / ListenClarificationCard UX
- `ListenReviewCard.tsx` (sibling component) renders transcript + preview + confidence; user picks Approve / Edit / Cancel via `useListenPipeline` handlers (lines 240-262).
- `ListenClarificationCard.tsx` renders when `shouldRequestAssumptions(intent)` is true and `generateAssumptionsLLM` returns ≥1 assumption (line 149); user picks one to refine the request (`handleListenClarificationAccept`).
- ✅ Both surfaces ship and are wired.

### Voice activity detection
**None.** `webSpeechAdapter.ts` uses Web Speech `onresult` events; there is no VAD beyond the SR engine's own start/end. Listen mode has a 12-second auto-stop timer (`listenHelpers.ts:9` `PTT_AUTO_STOP_MS = 12_000`) and a 250ms hold-gate (`PTT_HOLD_GATE_MS`) to dismiss accidental taps.

### Microphone permissions handling
- `listenHelpers.ts:35` `mapListenError` maps `permission_denied` to a friendly string.
- `webSpeechAdapter.ts:26-32` `ERROR_MAP` translates SR error codes (`'not-allowed'` → `'permission_denied'`, etc.) to `STTError` kinds.
- Privacy disclosure: `useListenPipeline.ts:288-294` checks `localStorage[hb-listen-privacy-acknowledged]`; first-time hold pops the privacy modal (`PRIVACY_TITLE` text in `listenHelpers.ts:13`).
- ✅ Wraps the standard browser permission flow; surfaces clear retry instructions.

### Gaps
- **No microphone availability probe before recording.** First click waits for the browser permission prompt; if the user has previously blocked, the SR engine throws `permission_denied` AFTER they hold the button. UX cost: silent failure on the first try. Could probe via `navigator.permissions.query({ name: 'microphone' })` to disable the orb up-front.
- **No STT calibration** — CF#5 from CLAUDE.md is OWNER-REQUIRED for live runtime calibration; current acceptance is browser default `lang: 'en-US'` (line 64).
- **`cleanTranscript` does NOT preserve quoted strings** — P108 / A10 found this (`/\b(uh+|...)\b/` crosses quote chars). Audited; deferred.

### Verdict — Q4
- **P3:** Pre-flight `navigator.permissions.query` to disable the mic button when permission is `denied`.
- **P3:** STT calibration runtime — owner-required carry-forward (CF#5).

## Q5 — AgentProxy contract

### Stub/mock for offline/dev
Yes — `AgentProxyAdapter` (`agentProxyAdapter.ts`) is the DB-backed mock. Looks up `userPrompt` in the `example_prompts` table (`findExamplePromptForUserPrompt`, line 57) and returns the stored `expected_envelope_json` as the response. Misses fall through with `invalid_response` so the chat pipeline hits the canned reply.

### Per-provider behavior
The adapter is **provider-agnostic** — it maps `provider: 'mock'` and returns from `example_prompts` regardless of which "real" provider the test wants to simulate. `example_prompt_runs` is the table where real-LLM responses can be stored per provider for cross-provider validation, but **no automated process populates it.** It is owner-recorded. Today there is no per-provider fixture differentiation.

### Real-LLM smoke (CF#4) testability
- `auditedComplete` runs against any picked adapter; if a real BYOK key is present, real LLM responses flow through the same path. `tests/architecture-invariants.spec.ts` ARCH-4 confines LLM SDK constructions to `src/contexts/intelligence/llm/`.
- **No automated CF#4 smoke** — owner-required. The closest harness is `agentProxyAdapter.ts:96-115` `recordExamplePromptRun` baseline writer — it caches the mock as the baseline and could be extended to record real-LLM runs.
- ✅ Architecture supports CF#4. Test infrastructure (Playwright) gates on `simulated`/`mock` only; no real-key Playwright run exists.

### Verdict — Q5
- **P2 (CF#4):** Owner-required. The adapter pattern + `example_prompt_runs` schema can host CF#4 smoke; needs a Playwright fixture that injects a real key + restricts the call to one cheap prompt + asserts envelope shape.

## Q6 — Cost capping

### CostPill UI
- `src/components/shell/CostPill.tsx` renders `${sessionUsd.toFixed(...)} / ${capUsd.toFixed(2)}` in shell footer with green/amber/red ring at 80%/100% thresholds.
- Hidden when `sessionUsd === 0` (line 18) — user only sees it once spend starts.
- ✅ Wired into `StatusBar.tsx` per grep.

### Cost cap discipline
- `auditedComplete.ts:25-37` `getCapUsd()` reads from `intelligenceStore.capUsd` (kv-persisted), env var `VITE_LLM_MAX_USD`, default $1.00.
- `auditedComplete.ts:120-130` projects upper bound (`estimateMaxCostForModel(model, inTok, 1024)`) and refuses if `sessionUsd + projected >= cap`.
- Refused calls still write `llm_logs` row with `status: 'cost_cap'` (lines 167-185) for observability.
- `setCapUsd` (`intelligenceStore.ts:192-200`) clamps to `[0.10, 20.00]`.
- ADR-040 mentions `cost_cap_reserve := 0.85` — **no implementation found** in `auditedComplete.ts`. The cap is hard at 1.0 (refuse when total ≥ cap), not 0.85. ADR-040 rule is documentation drift.
- ✅ Cap is wired and writes audit rows on rejection.

### Gaps
- **`MODEL_COSTS` staleness (Q2 finding propagates):** Pre-call cap math reads `cost.ts MODEL_COSTS` (`{in:0.25, out:1.25}` for Claude). Adapter's per-call charge reads `claudeAdapter.ts COST_PER_M` (`{in:1.0, out:5.0}`). Cap denies ~4× more calls than it should — but more importantly, `cost.ts` is missing `gpt-5-nano` entirely → projected = 0 → **OpenAI calls always pass the cap regardless of cap value.** Same for paid OpenRouter models. **Cap is bypassed for OpenAI.**
- **No per-call rate limit** beyond the in-flight mutex (`auditedComplete.ts:114-117`). One-at-a-time. Sufficient for single-user open-core; Tier-2 commercial would need real RPS limits.
- **`cost_cap_reserve` from ADR-040 unimplemented** — minor; current behavior is documented and consistent with itself.

### Verdict — Q6
- **P1:** Sync `cost.ts MODEL_COSTS` with adapter `COST_PER_M` constants; add `gpt-5-nano`, OpenRouter paid models. Without this fix the cost cap is non-functional for OpenAI. Single source of truth (lift `COST_PER_M` into `cost.ts`).
- **P3:** ADR-040 `cost_cap_reserve := 0.85` either implement or remove from ADR.

## Master fix list

| # | Fix | LOC est | Priority | Cite |
|---|-----|---------|----------|------|
| 1 | Sync `cost.ts MODEL_COSTS` w/ adapter `COST_PER_M`; add `gpt-5-nano` + OpenRouter paid model entries; lift adapters' constants up | ~25 | **P1** | Q2/Q6 |
| 2 | Wire `looksLikeOpenRouterKey` into LLMSettings hint chain | ~8 | P2 | Q1 |
| 3 | Add `redactKeyShapes` to `recordLLMLog` write at `auditedComplete.ts:175-176` (system_prompt + user_prompt) | ~5 | P2 | Q1 |
| 4 | Emit `voice_extraction` (or extend `intent_classification` event_data) for P113/A4 patch site | ~6 | P2 | Q3 |
| 5 | Pre-flight `navigator.permissions.query({name:'microphone'})` in listen surface to disable orb when denied | ~15 | P3 | Q4 |
| 6 | Update CLAUDE.md to drop "Cohere" — actual = 4 real adapters (Claude/Gemini/OpenAI/OpenRouter) + 2 dev (simulated/mock) | ~3 | P3 | Q2 |
| 7 | Either implement ADR-040 `cost_cap_reserve := 0.85` (refuse at 85% not 100%) or strike from ADR | ~5 or doc | P3 | Q6 |
| 8 | (Optional) `provider_change` event_type for cross-provider session attribution | ~10 | P3 | Q2 |
| 9 | (Owner) CF#4 BYOK live LLM smoke harness — Playwright fixture w/ real key + cheap-prompt envelope assert | n/a | OWNER | Q5 |

## Verdict

**4 real LLM providers + 2 dev fixtures** (CLAUDE.md "Cohere" drift); BYOK key handling is solid in-memory, plaintext at-rest in IndexedDB when "Remember" is on (documented per ADR-043), redaction comprehensive at every audited write boundary except the `llm_logs` prompt columns. Chat pipeline trace clean and well-instrumented; voice extraction patches `/site/voiceAttributes` invisibly to the log. Listen mode 2-stage review-then-approve UX ships with privacy disclosure but no permission pre-flight. **Cost cap is non-functional for OpenAI** (Fix #1 P1) due to `cost.ts` missing `gpt-5-nano` and stale Claude pricing — single highest-priority fix in this audit. AgentProxy contract supports CF#4 owner-required smoke via `example_prompt_runs` schema. No ADR-040 `cost_cap_reserve` implementation found.

**Recommend: Fix #1 lands in Wave 2** (P1, ~25 LOC). Fixes #2-#4 (~19 LOC) cluster as one BYOK-leak-and-observability mini-pass. Fixes #5-#8 are P3 polish suitable for P115 if time permits.
