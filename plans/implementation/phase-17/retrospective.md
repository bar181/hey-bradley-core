# Phase 17 Retrospective

## Phase 17 — MVP Track CLOSED 2026-04-27

**Focus:** LLM Provider Abstraction + BYOK scaffold. Single `LLMAdapter` interface with three
implementations (Claude Haiku, Gemini Flash, Simulated). Boot-time provider resolution via
`pickAdapter` reading `VITE_LLM_*` env. BYOK vault in `keys.ts` (in-memory by default, opt-in
`kv` persistence per ADR-043). `intelligenceStore` exposes adapter lifecycle + session usage.
`LLMSettings` panel for provider/key entry mounted in `SettingsDrawer`. `auditedComplete`
wrapper enforces pre-call cost cap, writes `llm_calls` row, updates session counters. CI
secrets-guard (pre-commit + build-time vite assertion) blocks `sk-…` / `AIza…` key shapes.

**Sealed at HEAD:** `a72ba38`
**Baseline (P16 seal):** `755a20a`
**Persona note:** No persona gate this phase per plan; persona scoring resumes at P18.

### DoD Result

**16 / 16 PASS.** See `phase-17/session-log.md` for the per-item evidence walk.

### What Shipped

- `src/contexts/intelligence/llm/adapter.ts` — `LLMAdapter`, `LLMRequest`, `LLMResponse`,
  `LLMError` (incl. `precondition_failed` and `cost_cap` variants).
- `src/contexts/intelligence/llm/claudeAdapter.ts` — `@anthropic-ai/sdk` Haiku adapter with
  `dangerouslyAllowBrowser: true`, key-shape redaction in error classifier.
- `src/contexts/intelligence/llm/geminiAdapter.ts` — `@google/genai` Flash adapter, same
  redaction discipline.
- `src/contexts/intelligence/llm/simulatedAdapter.ts` — canned fallback re-using
  `cannedChat.parseChatCommand`; returns empty patch envelope so Phase 18 fallback path is
  detectable.
- `src/contexts/intelligence/llm/pickAdapter.ts` — env-driven factory; dynamic-imports the
  Anthropic / Google SDKs so the simulated path stays SDK-free.
- `src/contexts/intelligence/llm/cost.ts` — `MODEL_COSTS` table (Haiku $0.25/$1.25 per 1M,
  Flash $0.075/$0.30 per 1M, simulated $0/$0) + `usd()` + `estimateTokens()`.
- `src/contexts/intelligence/llm/keys.ts` — BYOK vault: `readBYOK / writeBYOK / clearBYOK /
  hasBYOK / maskKey / looksLikeAnthropicKey / looksLikeGoogleKey / redactKeyShapes`. Default
  persistence OFF; opt-in `kv` writes only when `remember: true`.
- `src/contexts/intelligence/llm/auditedComplete.ts` — single canonical wrapper. Pre-call cap
  check (refuses with `cost_cap` when `sessionUsd >= cap`), `precondition_failed` when no
  active project, audit-row insert before in-memory counter bump (no DB-vs-state divergence),
  belt-and-suspenders `redactKeyShapes` on error_text.
- `src/store/intelligenceStore.ts` — adapter lifecycle + session usage. Rehydrates
  `sessionUsd` / `sessionTokens` from DB on init (so a page reload can't bypass the cap).
  Subscribes once to `projectStore` so it ends the previous session on project switch.
- `src/components/settings/LLMSettings.tsx` — provider picker, masked key input with format
  hint (anthropic / google shape detection), Save / Test / Clear buttons. Mounted in
  `SettingsDrawer.tsx`. Test button calls `adapter.testConnection()` directly so a ping does
  not pollute the audit log nor consume the cap budget.
- `src/pages/Onboarding.tsx` — "Using simulated responses — add a key in Settings" banner
  shown when `!hasKey && !bannerDismissed`; dismissal persisted via localStorage key
  `hb-onboarding-llm-banner-dismissed`.
- `.env.example` — `VITE_LLM_PROVIDER`, `VITE_LLM_API_KEY=` (empty), `VITE_LLM_MAX_USD=1.00`,
  optional `VITE_LLM_MODEL` override.
- `vite.config.ts` — production-build assertion: throws when `command === 'build'` and
  `process.env.VITE_LLM_API_KEY` is set, per ADR-043.
- `scripts/check-secrets.sh` — pre-commit + CI guard checking 9 key-shape patterns
  (sk-ant-, sk-proj-, AIza, sk-, hf_, ghp_, github_pat_, gsk_, xai-) against the staged
  diff; self-excludes the script itself, ADR-043, and `tests/` (which use synthetic
  fixtures).
- `.husky/pre-commit` — hook that runs the secrets-guard script.
- `docs/adr/ADR-042-llm-provider-abstraction.md` (115 lines, Accepted).
- `docs/adr/ADR-043-api-key-trust-boundaries.md` (108 lines, Accepted; references ADR-040
  `SENSITIVE_KV_KEYS` as the export-hygiene anchor).
- `tests/llm-adapter.spec.ts` — 6 Playwright cases: cost.usd math, pickAdapter no-key
  fallback, pickAdapter explicit args, auditedComplete writes `llm_calls` row + bumps
  session counters, cost-cap fires when `sessionUsd >= cap`, `redactKeyShapes` scrubs
  Bearer / sk-ant- / AIza shapes.

### Verification

- `npx tsc --noEmit --ignoreDeprecations 5.0` — exit 0, zero output.
- `npm run build` — green in **1.93s**; main JS 2,250.58 KB / gzip **590.24 KB**;
  claudeAdapter chunk gzip 12.29 KB; geminiAdapter chunk gzip 52.44 KB; pickAdapter chunk
  gzip 0.72 KB; sql-wasm-browser chunk gzip 14.05 KB; CSS gzip 16.15 KB.
- Bundle delta vs P16 baseline (588.24 KB gzip): **+2.00 KB**, well under the 800 KB DoD
  ceiling.
- `bash scripts/check-secrets.sh` — exit 0, "no key-shape patterns found".
- Targeted Playwright (kitchen-sink + blog-standard + persistence + llm-adapter) —
  **11 passed in 31.2s**.
- `tests/llm-adapter.spec.ts` standalone — **6 passed in 14.8s**.
- Total `test()` calls across `tests/**/*.spec.ts` — **124** (target ≥ 109 = P16 + 3).
- `any` / non-DEV-gated `console.*` policy on the `755a20a..HEAD` `src/**/*.{ts,tsx}` diff:
  **0 / 0 violations**.

### Phase 17 Commits (chronological)

| Commit | Wave | Summary |
|---|---|---|
| `2da0f98` | W1 | LLMAdapter contract + ClaudeAdapter + GeminiAdapter + SimulatedAdapter + ADR-042 + ADR-043 |
| `92ff9e6` | W2 | `pickAdapter` + `cost.ts` + `keys.ts` (BYOK vault) + `intelligenceStore` |
| `368e8b3` | W3 | `LLMSettings` UI + `auditedComplete` + cost-cap stub + `.env.example` + CI guard + onboarding banner |
| `ac4bd7b` | W4 | `tests/llm-adapter.spec.ts` (6 cases) + verification sweep |
| `a72ba38` | Fix-Pass | 10 reviewer must-fix items resolved + secrets-guard self-exclusions (ADR-043 + tests/) |

### What Worked

1. **Single seam `auditedComplete`.** All Phase 18 callers (chat, listen) will hit one
   wrapper that owns the cap, the audit row, and the counter update. No call site re-derives
   any of those concerns.
2. **Audit-before-counter ordering.** Writing `llm_calls` first means a DB failure surfaces
   as `invalid_response` and never updates `sessionUsd`. The DB is the source of truth; the
   in-memory store is a derived cache rehydrated on init.
3. **Two-layer secrets guard.** Pre-commit hook + CI grep + build-time vite assertion + ADR-040
   `SENSITIVE_KV_KEYS` strip on export. A key would have to defeat all four layers to leak.
4. **Dynamic SDK imports keep simulated path lean.** ClaudeAdapter (12.29 KB gz) and
   GeminiAdapter (52.44 KB gz) live in separate chunks; the no-key user pays only the
   pickAdapter overhead (0.72 KB gz) until they save a key.
5. **Cap rehydration from DB on init.** `intelligenceStore.init` re-reads
   `sumSessionCostUsd(sess.id)` so a page reload mid-session can't reset the in-memory cap
   counter to zero and silently bypass the ceiling.

### What We'd Do Differently

1. **`keys.ts` should have been static-imported from `intelligenceStore` from day one.**
   The W2 design used a dynamic import there too, which collided with `LLMSettings.tsx`'s
   static import and produced a Vite `INEFFECTIVE_DYNAMIC_IMPORT` warning. Fix-pass landed
   the static import; future modules should pick one strategy per dependency graph.
2. **Test 4's project-creation step is brittle.** It depends on the kitchen-sink starter
   loading exactly the same way every time. A Phase 18 refactor of the example loader
   should ship a smaller test fixture that creates a project programmatically.
3. **The Test connection button could be more affirmative.** Today it shows ✓ / ✗ but does
   not echo the model id or the actual provider name in the success state. A small UX
   delta to land in P18.
4. **The cost-cap is a session-level guard only.** A user who reloads in the same session
   continues against the rehydrated counter, but a user who closes the tab and reopens
   starts fresh. P20's CostPill + per-day or per-week cap will close that loop.

### Phase 18 Hand-off

P18 owns the chat → JSON-Patch loop. The seam it inherits:

- `auditedComplete(adapter, req, ctx)` — single call site. Returns `LLMResponse`.
- `intelligenceStore.adapter` — lifecycle-managed; never null after `init()`.
- `intelligenceStore.sessionUsd` / `sessionTokens` — observable for the future CostPill.
- `redactKeyShapes` — re-use on any new error path that touches user-facing strings.
- `recordLLMCall` — already used by `auditedComplete`; do not duplicate.

The simulated adapter currently returns `{ patches: [] }` — Phase 18 will extend it (or its
canned-chat backend) to return real golden envelopes for the 5 starter prompts. The
adapter contract stays unchanged.

**Ready for P18: YES.**
