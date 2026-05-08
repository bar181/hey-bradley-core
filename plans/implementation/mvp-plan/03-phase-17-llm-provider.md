# Phase 17 — LLM Provider Abstraction + Env Var + BYOK Scaffold

> **Stage:** B — Foundation for LLM
> **Estimated effort:** 3–4 days
> **Prerequisite:** Phase 16 closed (DB operational, `kv` and `llm_calls` tables ready).
> **Successor:** Phase 18 — Real Chat.

---

## North Star

> **A single function `complete(prompt) → JSONPatch[]` works against either Anthropic Haiku or Google Gemini Flash, picked by env var in dev or a BYOK input in production. No backend.**

---

## 1. Specification (S)

### 1.1 What changes

1. New module `src/contexts/intelligence/llm/` with one interface and three implementations:
   - `ClaudeAdapter` (Anthropic SDK, `claude-haiku-4-5-20251001`, `dangerouslyAllowBrowser: true`)
   - `GeminiAdapter` (Google `@google/genai`, `gemini-2.5-flash`)
   - `SimulatedAdapter` (returns canned responses; used as fallback)
2. Env var resolution at boot:
   - `VITE_LLM_PROVIDER` (one of: `claude`, `gemini`, `simulated`)
   - `VITE_LLM_MODEL` (optional override)
   - `VITE_LLM_API_KEY` (dev only)
   - `VITE_LLM_MAX_USD` (default `1.00`)
   - `VITE_LLM_BASE_URL` (optional, for proxy)
3. **BYOK input.** A small "API Key" field under Settings. Saved to the `kv` table only if user ticks "Remember on this device" (default off). Otherwise held in memory until tab close.
4. **No real chat wiring yet.** This phase only ships the adapter, env resolution, key handling, and a "Test connection" button. Phase 18 wires the adapter to the chat input.

### 1.2 What does **not** change

- The chat input UI (still uses `cannedChat.ts` until Phase 18).
- The store contracts.
- The DB schema (uses `kv` and `llm_calls` already created).

### 1.3 Novice impact

- A novice with no key sees the canned chat exactly as today.
- A novice with a key sees a green "Connected" badge after pasting it in Settings.

---

## 2. Pseudocode (P)

```
type LLMRequest  = { systemPrompt: string, userPrompt: string, schema?: ZodSchema }
type LLMResponse = { ok: true, json: unknown, tokens: { in: number, out: number }, cost_usd: number }
                 | { ok: false, error: 'no_key'|'rate_limit'|'network'|'invalid_response', detail?: string }

interface LLMAdapter {
  name(): 'claude'|'gemini'|'simulated'
  complete(req: LLMRequest): Promise<LLMResponse>
  testConnection(): Promise<boolean>
}

on app boot:
  cfg = readEnv()
  key = cfg.envKey ?? kv.get('byok_key') ?? ''
  adapter = pickAdapter(cfg.provider, key)
  intelligenceStore.set({ adapter, status: key ? 'connected' : 'no_key' })

function pickAdapter(provider, key):
  if !key and provider != 'simulated':
    return new SimulatedAdapter()
  switch provider:
    case 'claude':    return new ClaudeAdapter(key, model)
    case 'gemini':    return new GeminiAdapter(key, model)
    default:          return new SimulatedAdapter()
```

---

## 3. Architecture (A)

### 3.1 DDD context

`Intelligence` becomes a real bounded context. It owns:

- The adapter interface and implementations.
- Prompt assembly (Phase 18 fleshes this out; here only the system-prompt slot is reserved).
- The cost meter (Phase 20 expands the UI; here we count tokens and write to `llm_calls`).

It depends on `Configuration` (read JSON for system prompt) and `Persistence` (write `llm_calls`).

### 3.2 Files touched / created

| Action | Path | Purpose |
|---|---|---|
| CREATE | `src/contexts/intelligence/llm/adapter.ts` | The interface |
| CREATE | `src/contexts/intelligence/llm/claudeAdapter.ts` | Anthropic browser SDK |
| CREATE | `src/contexts/intelligence/llm/geminiAdapter.ts` | Google `@google/genai` |
| CREATE | `src/contexts/intelligence/llm/simulatedAdapter.ts` | Canned fallback (re-uses `cannedChat.ts`) |
| CREATE | `src/contexts/intelligence/llm/pickAdapter.ts` | Factory + env reading |
| CREATE | `src/contexts/intelligence/llm/cost.ts` | Token + USD math |
| CREATE | `src/contexts/intelligence/llm/keys.ts` | BYOK in/out of `kv` table; in-memory fallback |
| CREATE | `src/store/intelligenceStore.ts` | `{ adapter, status, lastError }` |
| CREATE | `src/components/settings/LLMSettings.tsx` | BYOK input + provider picker + Test button |
| EDIT | `src/pages/Onboarding.tsx` | Add small banner: "Using simulated responses — add a key in Settings" if no key |
| EDIT | `package.json` | add deps: `@anthropic-ai/sdk`, `@google/genai` |
| CREATE | `.env.example` | document `VITE_LLM_*` vars |
| CREATE | `docs/adr/ADR-042-llm-provider-abstraction.md` | Decision record |
| CREATE | `docs/adr/ADR-043-api-key-trust-boundaries.md` | Security note |
| CREATE | `tests/llm-adapter.spec.ts` | Test factory + simulated path; mock Anthropic |

### 3.3 ADRs to author

#### ADR-042 — LLM Provider Abstraction (browser-only)

- **Decision:** Single `LLMAdapter` interface; provider selected at boot via env or settings; simulated fallback.
- **Rationale:** Provider-neutrality protects MVP from API churn; simulated fallback keeps demos working.
- **Browser-only:** Both Anthropic and Google SDKs support browser use. We pass `dangerouslyAllowBrowser: true` to Anthropic; we make this *only* acceptable in BYOK / dev contexts.
- **Status:** Accepted.

#### ADR-043 — API Key Storage & Trust Boundaries

- **Threat model:**
  - Dev mode: `VITE_LLM_API_KEY` is bundled into the dev server. **Never** deploy a build with this set; CI guards via grep.
  - Production: only BYOK. Keys live in `localStorage` via the DB `kv` table when user opts in; otherwise in-memory.
  - The deployed bundle ships *no* key.
  - LLM calls hit the provider directly; we accept the user's IP and key are exposed to that provider — that is BYOK by definition.
- **Mitigations:** prefix-mask key in any UI; never log key; never include key in `llm_calls.error_text`; CI grep ensures no provider key leaks into the repo.
- **Out of scope (post-MVP):** server-side proxy, encryption-at-rest of the key.
- **Status:** Accepted.

### 3.4 Env-var contract

```
# .env.example
VITE_LLM_PROVIDER=claude        # claude | gemini | simulated
VITE_LLM_MODEL=                 # optional, defaults inside adapter
VITE_LLM_API_KEY=               # DEV ONLY. Empty string in production builds.
VITE_LLM_MAX_USD=1.00           # hard cap per session
VITE_LLM_BASE_URL=              # optional; only for the dev proxy script
```

### 3.5 Cost math

```ts
// src/contexts/intelligence/llm/cost.ts
export const MODEL_COSTS = {
  'claude-haiku-4-5-20251001': { in: 0.25 / 1e6, out: 1.25 / 1e6 },
  'gemini-2.5-flash':          { in: 0.075 / 1e6, out: 0.30 / 1e6 },
} as const;

export function usd(model: keyof typeof MODEL_COSTS, inTok: number, outTok: number): number {
  const c = MODEL_COSTS[model];
  return inTok * c.in + outTok * c.out;
}
```

(Numbers are MVP estimates; refine in Phase 20 against published rates.)

### 3.6 Adapter shape

```ts
// claudeAdapter.ts
import Anthropic from '@anthropic-ai/sdk';
import { LLMAdapter, LLMRequest, LLMResponse } from './adapter';

export class ClaudeAdapter implements LLMAdapter {
  private client: Anthropic;
  private model: string;
  constructor(apiKey: string, model = 'claude-haiku-4-5-20251001') {
    this.client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    this.model = model;
  }
  name() { return 'claude' as const; }
  async testConnection() {
    try {
      await this.client.messages.create({
        model: this.model,
        max_tokens: 4,
        messages: [{ role: 'user', content: 'ping' }],
      });
      return true;
    } catch {
      return false;
    }
  }
  async complete(req: LLMRequest): Promise<LLMResponse> {
    try {
      const r = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: req.systemPrompt,
        messages: [{ role: 'user', content: req.userPrompt }],
      });
      const text = r.content.map(b => 'text' in b ? b.text : '').join('');
      const inTok = r.usage?.input_tokens ?? 0;
      const outTok = r.usage?.output_tokens ?? 0;
      return {
        ok: true,
        json: safeParse(text),
        tokens: { in: inTok, out: outTok },
        cost_usd: usd(this.model as any, inTok, outTok),
      };
    } catch (e: any) {
      return classifyError(e);
    }
  }
}
```

(`safeParse` and `classifyError` are local helpers; full source in Phase 18.)

### 3.7 BYOK UI sketch

```tsx
// src/components/settings/LLMSettings.tsx
export function LLMSettings() {
  const [key, setKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<'idle'|'ok'|'fail'>('idle');
  return (
    <section>
      <label>Provider
        <select name="provider">…</select>
      </label>
      <label>API Key
        <input type="password" value={key} onChange={e => setKey(e.target.value)} />
      </label>
      <label><input type="checkbox" checked={remember} onChange={…}/>Remember on this device</label>
      <button onClick={async () => {
        keysRepo.set(key, { remember });
        const ok = await intelligenceStore.getState().adapter.testConnection();
        setStatus(ok ? 'ok' : 'fail');
      }}>Test connection</button>
      <p>{status === 'ok' ? 'Connected.' : status === 'fail' ? 'Connection failed.' : ''}</p>
    </section>
  );
}
```

---

## 4. Refinement (R)

### 4.1 Checkpoints

- **A — Env wiring.** Adapter resolves correctly in dev with `.env.local`.
- **B — Browser test.** A real "ping" call to Claude Haiku succeeds with a valid key.
- **C — BYOK.** Settings panel saves a key, tests it, persists across reload when "Remember" is checked.
- **D — Audit log.** Every call writes a row in `llm_calls`.
- **E — Cost cap.** When session token-spend would exceed `VITE_LLM_MAX_USD`, calls return `{ ok: false, error: 'rate_limit', detail: 'cost cap' }` and the chat shows a banner.

### 4.2 Intentionally deferred

- Streaming (we render the full JSON patch; perceived latency is acceptable).
- Anthropic prompt caching (deferred; adds branching for `cache_control`).
- Multi-key support and key rotation.

---

## 5. Completion (C) — DoD Checklist

- [ ] `LLMAdapter` interface lives in `src/contexts/intelligence/llm/`
- [ ] `ClaudeAdapter`, `GeminiAdapter`, `SimulatedAdapter` implemented
- [ ] `pickAdapter` reads env, falls back to simulated cleanly
- [ ] `intelligenceStore` exposes `{ adapter, status, lastError, sessionUsd }`
- [ ] `.env.example` checked in; `.env.local` ignored
- [ ] `LLMSettings.tsx` UI works: paste key → Test → green/red feedback
- [ ] BYOK persists in `kv` only when "Remember" is checked
- [ ] First successful call with real key writes a row to `llm_calls`
- [ ] Cost meter math validated against a fixed example
- [ ] Hard cap stops calls at `sessionUsd >= VITE_LLM_MAX_USD`
- [ ] CI grep guards against committed `sk-…` Anthropic keys (regex check in `scripts/`)
- [ ] ADR-042 and ADR-043 merged
- [ ] `tests/llm-adapter.spec.ts` covers: simulated path, factory selection, cost math
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] Test count ≥ previous + 3
- [ ] Master checklist updated

---

## 6. GOAP Plan

### 6.1 Goal state

```
goal := AdapterContractDefined ∧ ProvidersImplemented ∧ EnvResolved ∧ BYOKWorks ∧ CostCapEnforced ∧ TestsPass
```

### 6.2 Actions

| Action | Preconditions | Effects | Cost |
|---|---|---|---|
| `add_provider_deps` | repo clean | DepsAdded | 1 |
| `define_adapter_interface` | DepsAdded | InterfaceDefined | 1 |
| `impl_simulated_adapter` | InterfaceDefined | SimulatedReady | 1 |
| `impl_claude_adapter` | InterfaceDefined | ClaudeReady | 2 |
| `impl_gemini_adapter` | InterfaceDefined | GeminiReady | 2 |
| `impl_pick_adapter` | ClaudeReady ∧ GeminiReady ∧ SimulatedReady | EnvResolved | 1 |
| `impl_keys_module` | DBReady | KeysReady | 1 |
| `impl_cost_module` | InterfaceDefined | CostReady | 1 |
| `impl_intelligence_store` | EnvResolved ∧ KeysReady | StoreReady | 1 |
| `build_settings_ui` | StoreReady | BYOKWorks | 2 |
| `wire_audit_log` | StoreReady ∧ DBReady | AuditWorks | 1 |
| `wire_cost_cap` | CostReady ∧ StoreReady | CostCapEnforced | 1 |
| `author_adr_042_043` | InterfaceDefined ∧ KeysReady | ADRsMerged | 1 |
| `add_ci_grep_guard` | repo clean | LeakGuardReady | 1 |
| `add_tests` | StoreReady ∧ AuditWorks | TestsPass | 2 |
| `run_build` | TestsPass | GoalMet | 1 |

### 6.3 Optimal plan (cost = 20)

```
1. add_provider_deps
2. define_adapter_interface
3. impl_simulated_adapter   ┐
4. impl_claude_adapter      │ parallel
5. impl_gemini_adapter      │
6. impl_cost_module         ┘
7. impl_keys_module
8. impl_pick_adapter
9. impl_intelligence_store
10. build_settings_ui       ┐
11. wire_audit_log          │ parallel
12. wire_cost_cap           ┘
13. author_adr_042_043      ┐ parallel with 14
14. add_ci_grep_guard       ┘
15. add_tests
16. run_build
```

### 6.4 Replan triggers

- CORS rejection from Anthropic browser SDK → run dev proxy `scripts/llm-proxy.mjs` and set `VITE_LLM_BASE_URL`.
- Gemini SDK browser support broken → mark Gemini as `experimental: true` and ship Claude-only for MVP; reopen post-MVP.
- Cost numbers wrong against published rates → update table only; don't refactor.

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| User pastes wrong key shape | H | Format check + 1-call ping; clear error text |
| Browser CORS blocks direct calls | M | Tiny Node proxy script under `scripts/` for dev only |
| Token cost shock on a stuck loop | M | Hard cap + per-call timeout (8 s) |
| Anthropic key checked-in by accident | L | CI grep blocks PR; pre-commit hook |
| Bundle inflation from SDKs | M | Code-split per provider; only the chosen one ships |

---

## 8. Hand-off to Phase 18

- `intelligenceStore.adapter` is callable from anywhere.
- `kv` and `llm_calls` are live.
- BYOK + simulated fallback both work in production-build smoke tests.
- Phase 18 begins by wiring `complete()` to the chat input and replacing `cannedChat` matching.
