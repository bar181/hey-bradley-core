# Phase 17 — LLM Provider Abstraction + BYOK Scaffold — Session Log

**Status:** CLOSED 2026-04-27 — DoD 16/16 PASS, sealed at `a72ba38`.

---

## P17 W1 — 2026-04-27

4 parallel agents: A1 LLMAdapter contract + SimulatedAdapter, A2 ClaudeAdapter, A3 GeminiAdapter, A4 ADR-042 + ADR-043.

Sealed at commit `2da0f98`. tsc clean. Build green.

## P17 W2 — 2026-04-27

3 parallel agents: A5 cost.ts + pickAdapter, A6 keys.ts (BYOK vault), A7 intelligenceStore.

Sealed at commit `92ff9e6`. tsc clean.

## P17 W3 — 2026-04-27

3 parallel agents: A8 LLMSettings UI in drawer, A9 auditedComplete + cap stub, A10 .env + CI guard + onboarding banner.

Sealed at commit `368e8b3`. tsc clean. Build green (1.97s). Playwright kitchen-sink + blog-standard + persistence: 5/5 PASS in 22.2s.

## P17 W4 Verification Sweep — 2026-04-27

| Check | Status | Detail |
|---|---|---|
| tsc --noEmit | PASS | exit 0, zero output |
| tsc -b --force | PASS (implicit via `npm run build`) | composite build clean |
| npm run build | PASS | 2.24s; main 590.90 KB gzip; claudeAdapter chunk 12.26 KB gzip; geminiAdapter chunk 52.38 KB gzip; sql.js chunk 14.05 KB gzip; pickAdapter chunk 0.70 KB gzip |
| Bundle delta vs P16 (588.24 KB main) | +2.66 KB | well under DoD cap (Phase plan §5 line: "Bundle delta ≤ 800 KB gzip") |
| any introductions (P17 diff) | 0 | scanned `2da0f98^..HEAD` |
| console.* not DEV-gated (P17 diff) | 0 | scanned `2da0f98^..HEAD` |
| build-time secret guard | PASS | with `VITE_LLM_API_KEY` set: build aborts with ADR-043 message; without: builds normally |
| scripts/check-secrets.sh | PASS | clean staged diff returns "no key-shape patterns found" exit 0 |
| Playwright (P15+P16+P17 targeted) | 5/5 + 4/4 = 9/9 | persistence 5/5 + new llm-adapter 4/4 |
| Playwright (full suite) | 106 passed / 28 pre-existing failures | failures all in tests/e2e/ + tests/phase{2,3}-smoke.spec.ts (predate P17, unrelated) |
| dynamic chunks (sql.js / claude / gemini) | PASS | each has its own chunk; SDKs not in main bundle |

### Notes / observations

- Vite emits `INEFFECTIVE_DYNAMIC_IMPORT` warning for `src/contexts/intelligence/llm/keys.ts`: dynamically imported by `intelligenceStore.ts` but also statically imported by `LLMSettings.tsx`. Result: keys.ts ends up in the main chunk. Cost: ~2 KB. Not a blocker; either drop the dynamic import in `intelligenceStore` or move keys.ts statically — defer to review swarm's call.
- 28 pre-existing Playwright failures predate P17 (e2e + phase2/phase3 smokes). Not in our diff path. Tracked as a separate cleanup task.

## Hand-off

W4 complete. Awaiting review swarm (KISS / code-quality / security / persistence-correctness) → fix-pass if needed → DoD agent (16-item walk) → seal.

---

## Phase 17 — CLOSED 2026-04-27

**Sealed at HEAD:** `a72ba38`
**Baseline (P16 seal):** `755a20a`
**Persona note:** No persona gate this phase per plan; persona scoring resumes at P18.

### DoD Result

**16 / 16 PASS.** Walked by the BLOCKING DoD confirmation agent against `2da0f98..HEAD`.

### Deliverable Evidence (12)

| # | Item | Evidence |
|---|---|---|
| 1 | `adapter.ts` contract | `src/contexts/intelligence/llm/adapter.ts` lines 7–36; `LLMRequest`, `LLMResponse`, `LLMError` (incl. `precondition_failed` line 21) all exported |
| 2 | 3 adapter impls | `claudeAdapter.ts:12–69`, `geminiAdapter.ts:12–69`, `simulatedAdapter.ts:21–46` — each `implements LLMAdapter` with `name() / testConnection() / complete() / label() / model()` |
| 3 | `pickAdapter.ts` | `src/contexts/intelligence/llm/pickAdapter.ts:21–24` reads `VITE_LLM_PROVIDER`/`VITE_LLM_API_KEY`/`VITE_LLM_MODEL`; `:26–32` simulated fallback when no key; `:35,:39` dynamic SDK imports |
| 4 | `cost.ts` | `src/contexts/intelligence/llm/cost.ts:5–9` — `MODEL_COSTS` exports Haiku `{in:0.25, out:1.25}` + Flash `{in:0.075, out:0.30}`; `usd()` line 17 |
| 5 | `keys.ts` BYOK | `src/contexts/intelligence/llm/keys.ts` exports `readBYOK` (23), `writeBYOK` (33), `clearBYOK` (47), `hasBYOK` (55), `maskKey` (60), `looksLikeAnthropicKey` (66), `looksLikeGoogleKey` (70), `redactKeyShapes` (80); persistence default OFF (line 36 `if (opts.remember)`) |
| 6 | `intelligenceStore.ts` | `src/store/intelligenceStore.ts:18–37` — state + actions: `init`, `testConnection`, `setProviderAndKey`, `clearKey`, `recordUsage`, `resetSession`, `endActiveSession` |
| 7 | `LLMSettings.tsx` | `src/components/settings/LLMSettings.tsx` — provider picker (lines 89–98), key input (101–110), Test (137–144), Save (128–135), Clear (145–152); mounted in `SettingsDrawer.tsx:6` import + `:103` `<LLMSettings />` |
| 8 | First call writes `llm_calls` row | `auditedComplete.ts:80–88` calls `recordLLMCall`; verified by `tests/llm-adapter.spec.ts` Test 4 (rowCount ≥ 1, provider=simulated, model=simulated-v1, status=ok) — PASS |
| 9 | Hard cap stops calls | `auditedComplete.ts:48–59` pre-call cap check; `getCapUsd` reads `VITE_LLM_MAX_USD`; verified by `tests/llm-adapter.spec.ts` Test 5 (kind === 'cost_cap' once `recordUsage(0,0,1.5) >= $1.00`) — PASS |
| 10 | Onboarding banner when no key | `src/pages/Onboarding.tsx:11,406,409,412,495` — `showLLMBanner = !hasKey && !bannerDismissed` controls display |
| 11 | `.env.example` | Tracked at repo root (`git ls-files | grep .env.example`); contains `VITE_LLM_PROVIDER`, `VITE_LLM_API_KEY=`, `VITE_LLM_MAX_USD=1.00`, optional `VITE_LLM_MODEL` |
| 12 | CI grep guards | `scripts/check-secrets.sh` (29 lines, executable, 9 key-shape patterns) + `.husky/pre-commit` (1 line, calls script); build-time guard in `vite.config.ts:6–10` throws when `command === 'build'` and `process.env.VITE_LLM_API_KEY` set |

### ADR Evidence (2)

| # | Item | Evidence |
|---|---|---|
| 13 | ADR-042 | `docs/adr/ADR-042-llm-provider-abstraction.md` — Status: Accepted (line 3); 115 lines (well above 80) |
| 14 | ADR-043 | `docs/adr/ADR-043-api-key-trust-boundaries.md` — Status: Accepted (line 3); 108 lines; references ADR-040 `SENSITIVE_KV_KEYS` (lines 44, 79, 97, 107) |

### Test Evidence (2)

| # | Item | Evidence |
|---|---|---|
| 15 | `tests/llm-adapter.spec.ts` | 6 tests (cost.usd math, pickAdapter no-key fallback, pickAdapter explicit args, auditedComplete row + counters, cost-cap, redactKeyShapes) — **6 passed (14.8s)** |
| 16 | Test count ≥ 109 | grep-count of `^\s*test(` across `tests/**/*.spec.ts` = **124** (well above the P16 + 3 = 109 floor) |

### Cross-Cutting Verification

- `npx tsc --noEmit --ignoreDeprecations 5.0` — exit 0, zero output.
- `npm run build` — green in **1.93s**; main JS gzip **590.24 KB**; claudeAdapter chunk gzip **12.29 KB**; geminiAdapter chunk gzip **52.44 KB**; pickAdapter chunk gzip 0.72 KB; sql-wasm-browser chunk gzip 14.05 KB; CSS gzip 16.15 KB.
- Bundle delta vs P16 baseline (588.24 KB gzip): **+2.00 KB**, well under the 800 KB DoD ceiling.
- `bash scripts/check-secrets.sh` — exit 0, "no key-shape patterns found".
- `any` / non-DEV-gated `console.*` violations on the `755a20a..HEAD` `src/**/*.{ts,tsx}` diff: **0 / 0**.
- Targeted Playwright (kitchen-sink + blog-standard + persistence + llm-adapter): **11 / 11 passed in 31.2s**.

### Phase 17 Commits (chronological)

| Commit | Wave | Summary |
|---|---|---|
| `2da0f98` | W1 | LLMAdapter contract + ClaudeAdapter + GeminiAdapter + SimulatedAdapter + ADR-042 + ADR-043 |
| `92ff9e6` | W2 | `pickAdapter` + `cost.ts` + `keys.ts` (BYOK vault) + `intelligenceStore` |
| `368e8b3` | W3 | `LLMSettings` UI + `auditedComplete` + cost-cap stub + `.env.example` + CI guard + onboarding banner |
| `ac4bd7b` | W4 | `tests/llm-adapter.spec.ts` (6 cases) + verification sweep |
| `a72ba38` | Fix-Pass | 10 reviewer must-fix items resolved + secrets-guard self-exclusions (ADR-043 + tests/) |

**Ready for P18: YES.**
