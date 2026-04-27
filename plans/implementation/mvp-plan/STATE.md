# MVP Implementation — State of the Program

> **Updated:** 2026-04-27 (after Phase 18b seal at `805b246`)
> **Branch:** `claude/verify-flywheel-init-qlIBr`
> **Companion:** `08-master-checklist.md` (all DoD ticks), per-phase `retrospective.md` and `session-log.md` files.

---

## 1. Done

| Phase | Title | Composite | DoD | Final Commit | Highlight |
|---|---|---:|---|---|---|
| **P15** | Polish + Kitchen Sink + Blog + Novice Simplification | 82/100 | 12/12 + personas | `47b95f6` | Personas all PASS (Grandma 70, Framer 88, Capstone 84). DRAFT mode shrunk: 5 tabs → 2; 16 sections → 3 (hero/blog/footer); jargon labels hidden. Two new examples (kitchen-sink + blog-standard). |
| **P16** | Local Database (sql.js + IndexedDB) | 86/100 | 25/25 | `755a20a` | Frontend-only persistence. 5 typed CRUD repositories. `.heybradley` zip export with **SENSITIVE_KV_KEYS strip** (closes the BYOK leak vector before it lands). Cross-tab Web Lock + BroadcastChannel + pre-migration snapshot. Bundle delta +32.56 KB gzip. |
| **P17** | LLM Provider Abstraction + BYOK Scaffold | 88/100 | 16/16 | `8377ab7` | LLMAdapter interface + Claude/Gemini/Simulated/Fixture impls (Fixture added in P18). BYOK with optional kv persistence; cap pre-check; husky pre-commit guard with 9 key-shape patterns; vite build-time assertion. ADR-042 + ADR-043. Bundle delta +2.00 KB gzip. |
| **P18** | Real Chat Mode (LLM → JSON Patches) | 89/100 | 20/20 | `232dd79` | Crystal Atom system prompt + Zod parser + path-whitelist validator (key prototype-pollution + image URL allow-list + value safety) + atomic applier + cross-surface mutex + redacted audit log. **0 real-LLM calls during all of P18.** $0 spent. ADR-044 + ADR-045. Bundle delta +6.24 KB gzip. |
| **P18b** | Provider Expansion + Observability (addendum) | 90/100 | 18/18 | `805b246` | 5-provider matrix: Claude (paid), Gemini (paid 2.5-flash + free 2.0-flash), OpenRouter (free `mistralai/mistral-7b-instruct:free`), Simulated, **mock** (DB-backed `AgentProxyAdapter` reading from `example_prompts` corpus, 18 rows / 6 categories). New `llm_logs` table with ruvector deltas (D1 dual `request_id` + `parent_request_id`; D2 split `input_tokens`/`output_tokens`; D3 SHA-256 `prompt_hash`); one row per adapter-call decision (incl. cost_cap). 30-day retention enforced at `initDB`. `SENSITIVE_TABLE_OPS` registry strips both new tables from `.heybradley` exports. ADR-046 + ADR-047. **Bundle delta -0.76 KB gzip** (net negative; new modules code-split into lazy chunks). $0 spent. |

### Phase-by-phase test growth
| Phase | Targeted Playwright | Suite total |
|---|---:|---:|
| Pre-P15 baseline | — | 102 |
| P15 | 2 added | 104 |
| P16 | 3 added | 107 |
| P17 | 6 added | 113 / 124 in full sweep |
| P18 | 16 added | 129+ Playwright |
| P18b | 5 added (4 in `p18b-logs.spec.ts` + 2 in `p18b-agent-proxy.spec.ts` minus 1 cap-edge xskip) | 36/36 targeted active (+ 2 xskip) |
| **Net add** | **+32** | **122 net targeted** |

### What's running today
- 100% frontend TypeScript SPA (Vite + React 19 + Tailwind + shadcn).
- sql.js + IndexedDB browser DB, lazy-loaded wasm, cross-tab safe.
- Anthropic + Google SDKs in browser with `dangerouslyAllowBrowser: true` (BYOK only).
- FixtureAdapter is the active LLM adapter in DEV — **zero real-LLM dollars spent**.
- 4 ADRs added (040, 041, 042, 043) in the persistence + provider layers; 2 ADRs added (044, 045) in the chat layer. Total ADR series: 045.
- Husky pre-commit hook + Vite build-time guard prevent any committed/deployed key.

---

## 2. To Do (next 3 phases on the runway)

| Phase | Title | Plan ref | Effort | Real-LLM cost |
|---|---|---|---:|---|
| **Step 4** *(post-DoD optional, gated by `VITE_LLM_LIVE_SMOKE=1`)* | Live LLM smoke against real Haiku | P18 plan §0 Step 3 trailing | ~30 min | ~$0.01 (5 starter prompts × ~$0.002 each) |
| **P19** | Real Listen Mode (Web Speech API) | `05-phase-19-real-listen.md` | 4–6 days | $0 in dev (P18 fixture pipeline reused) |
| **P20** | Verify, Cost Caps, MVP Close, Vercel Deploy | `06-phase-20-mvp-close.md` | 3–4 days | $0 |

After P20, MVP is shipped. Capstone-presentation surface = P15+P16+P17+P18 + the listen mode that P19 adds.

---

## 3. Gaps (deferred from review swarms; not blockers for current phase but worth tracking)

### Carried forward from P15
- Stage-1 backlog (S1-01..S1-29) zero TODOs — DEFERRED out of narrowed scope, marked Post-MVP polish.
- ESLint v9 flat-config migration (predates P15).

### Carried forward from P16
- Audit log LRU bound (currently unbounded; performance concern at high call volume).
- `tests/persistence.spec.ts` uses dev-only private-import path that wouldn't work against a built app.

### Carried forward from P17
- 30s timeout in `auditedComplete` uses `Promise.race` but doesn't actually `AbortSignal` the underlying SDK request — request leaks. Real concern for Step 4 onward (R2 P18 review).
- DEV `VITE_LLM_API_KEY` exposure in DevTools Sources (acknowledged in ADR-043; defensible per BYOK contract but worth runtime warning banner).
- 28 pre-existing Playwright failures in `tests/e2e/`, `tests/phase{2,3}-smoke.spec.ts` — predate P15, unrelated to MVP track.

### Carried forward from P18
- Per-section Crystal Atom inlining (ADR-045 future extension) deferred — global atom sufficient for 5 starters.
- `safeJson`/`classifyError` near-duplicated in claudeAdapter + geminiAdapter; will become triplicated when a 3rd real provider lands. Extract to shared module before that.
- `system.ts` `compactJson` truncates by byte-slicing mid-token; LLM tolerates but section-aware trimming would be cleaner.
- Step 1 wire test artifact: `tests/p18-step1.spec.ts` still loads blog-standard then resets-to-default-config because the original fixture was authored against a different shape. Cosmetic; harmless; can be cleaned up if the fixture is rewritten.
- Two `console.warn` calls in `auditedComplete` + `recordPipelineFailure` are DEV-gated but will be silently shipped to production builds (gate is at runtime, not build-time). Replace with no-op in production for ~10 LOC saved.

### Doc drift
- `CLAUDE.md` still says 37 ADRs / 102 tests; reality at end of P18 is **45 ADRs** (000–037 + 038–045) and **129+ Playwright tests**. Capstone reviewer flagged this in P15 retro; never fixed. ~10 min update.

### Architectural future-work (post-MVP signals)
- Adapter `dispose()` so `clearKey` actually invalidates captured SDK clients.
- CSP + `dangerouslySetInnerHTML` audit (planned for P20).
- Supabase Edge Function adapter as a hosted-demo path (post-MVP per planning docs).

---

## 4. Recommendations — Next Steps

### Strongly recommended

1. **Run Step 4 (live LLM smoke) before P19.** ~$0.01 cost, ~30 min, irreversible confidence: a one-time `VITE_LLM_LIVE_SMOKE=1` run against real Haiku across the 5 starter fixtures proves the swap is genuinely one config flip and surfaces any real-API quirks (CORS, rate-limit shapes, tool-use mismatches) **before** P19 layers STT on top. If you skip this and P19 ships green against fixtures only, the first real Haiku call could expose regressions in either pipeline simultaneously.

2. **Update `CLAUDE.md`'s claimed ADR + test counts** before P19 (10-min job). The Capstone reviewer flagged this 3 phases ago and it's still drifting. Easy quality win for the persona scoring at MVP close.

3. **Author one tiny fix** for the `auditedComplete` `Promise.race` timeout to plumb an `AbortSignal` through `LLMRequest` and into the Anthropic + Gemini adapters. Step 4 will reveal this; better to land it now (~30 LOC) than during P19 review.

### Recommended

4. **Greenlight P19 immediately after Step 4.** P19 is structurally simpler than P18 (just adds STT capture; reuses the entire chat pipeline). Same 3-step staging pattern (capture → wire to pipeline → full DoD). Estimated 4–6 days, $0.

5. **Extract `safeJson` + `classifyError` to a shared module** during P19 W1 (5 LOC each in two files; opportunistic cleanup before the inevitable third provider).

### Defer (post-MVP)

6. ESLint v9 flat-config migration.
7. Per-section Crystal Atom inlining.
8. Audit log LRU bound.
9. Adapter `dispose()`.
10. CSP audit (planned for P20 anyway).
11. Stage-1 backlog reconciliation.
12. Supabase Edge Function adapter.

---

## 5. The MVP path remaining

```
[Step 4]      [P19]          [P20]
   ↓            ↓              ↓
~30 min     4–6 days        3–4 days
$0.01       $0              $0
   ↓            ↓              ↓
real-LLM    Listen Mode    Verify + cost
smoke       (Web Speech    cap polish +
proves      API; P18       Vercel deploy
swap        pipeline       + persona
works       reused)        re-score + RC
```

After P20 the MVP is the capstone deliverable. Total spend on real LLM during MVP development: **$0** (P15–P18) **+ ~$0.01** (Step 4 smoke) **= ~$0.01 total**.

---

## 6. Quality trajectory

| Phase | Composite | Δ |
|---|---:|---:|
| P14 (pre-MVP track) | 74 | — |
| P15 | 82 | +8 |
| P16 | 86 | +4 |
| P17 | 88 | +2 |
| P18 | 89 | +1 |
| P18b | 90 | +1 |

Trend: monotonically improving as the architecture solidifies and the review-cycle discipline tightens. P19 should hold or exceed 90.
