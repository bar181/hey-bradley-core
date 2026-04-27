# Phase 17 — LLM Provider Abstraction + BYOK Scaffold — Session Log

**Status:** IN PROGRESS (W1–W4 complete; review swarm pending; DoD seal pending)

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
