# MVP Implementation — State of the Program

> **Updated:** 2026-04-27 (after Phase 19 fix-pass-2 at `772c154` — ready for seal)
> **Branch:** `claude/verify-flywheel-init-qlIBr`
> **Companion:** `08-master-checklist.md` (all DoD ticks), per-phase `retrospective.md` and `session-log.md` files.
> **Latest deep-dive:** `plans/implementation/phase-19/deep-dive/00-summary.md` (4 brutal reviews → 18 must-fix items closed)

---

## 1. Done

| Phase | Title | Composite | DoD | Final Commit | Highlight |
|---|---|---:|---|---|---|
| **P15** | Polish + Kitchen Sink + Blog + Novice Simplification | 82/100 | 12/12 + personas | `47b95f6` | Personas all PASS (Grandma 70, Framer 88, Capstone 84). DRAFT mode shrunk: 5 tabs → 2; 16 sections → 3 (hero/blog/footer); jargon labels hidden. Two new examples (kitchen-sink + blog-standard). |
| **P16** | Local Database (sql.js + IndexedDB) | 86/100 | 25/25 | `755a20a` | Frontend-only persistence. 5 typed CRUD repositories. `.heybradley` zip export with **SENSITIVE_KV_KEYS strip** (closes the BYOK leak vector before it lands). Cross-tab Web Lock + BroadcastChannel + pre-migration snapshot. Bundle delta +32.56 KB gzip. |
| **P17** | LLM Provider Abstraction + BYOK Scaffold | 88/100 | 16/16 | `8377ab7` | LLMAdapter interface + Claude/Gemini/Simulated/Fixture impls (Fixture added in P18). BYOK with optional kv persistence; cap pre-check; husky pre-commit guard with 9 key-shape patterns; vite build-time assertion. ADR-042 + ADR-043. Bundle delta +2.00 KB gzip. |
| **P18** | Real Chat Mode (LLM → JSON Patches) | 89/100 | 20/20 | `232dd79` | Crystal Atom system prompt + Zod parser + path-whitelist validator (key prototype-pollution + image URL allow-list + value safety) + atomic applier + cross-surface mutex + redacted audit log. **0 real-LLM calls during all of P18.** $0 spent. ADR-044 + ADR-045. Bundle delta +6.24 KB gzip. |
| **P18b** | Provider Expansion + Observability (addendum) | 90/100 | 18/18 | `805b246` | 5-provider matrix: Claude (paid), Gemini (paid 2.5-flash + free 2.0-flash), OpenRouter (free `mistralai/mistral-7b-instruct:free`), Simulated, **mock** (DB-backed `AgentProxyAdapter` reading from `example_prompts` corpus, 18 rows / 6 categories). New `llm_logs` table with ruvector deltas (D1 dual `request_id` + `parent_request_id`; D2 split `input_tokens`/`output_tokens`; D3 SHA-256 `prompt_hash`); one row per adapter-call decision (incl. cost_cap). 30-day retention enforced at `initDB`. `SENSITIVE_TABLE_OPS` registry strips both new tables from `.heybradley` exports. ADR-046 + ADR-047. **Bundle delta -0.76 KB gzip** (net negative; new modules code-split into lazy chunks). $0 spent. |
| **P19** | Real Listen Mode (Web Speech API) + 3-step staged build + 2 fix-passes | **88/100** | 22/22 | `772c154` | Web Speech STT capture + push-to-talk surface + voice→chat-pipeline fan-in + 754-LOC ListenTab (P20 split queued). 4 brutal-honest reviewers ran on the sealed code (R1 UX 58, R2 Functionality 2/35 prompts, R3 Security 8.5/10 1 HIGH, R4 Architecture 5.5/10) → fix-pass-2 closed 18 must-fix items: F1 hero/article path-resolution helper (closes blog-standard hero corruption); F2 mapChatError (4 infra kinds; FALLBACK_HINT dedup); F3 CSS-injection guard (`url(`/`@import` blocked, `imageUrl` allow-listed); F4 site-context interpolation sanitize; F5 truthful listen privacy copy; F6 DEV-key runtime warn; F7 adapterUtils.ts dedup (-60 LOC across 3 adapters); F8-F13 UX polish (tooltip, inline privacy, draft-mode demo-slider hide, via-voice pill, simulated-mode pill); F14 PersistenceErrorBanner; F15 CLAUDE.md project-status truth-up; F16-F18 code hygiene. ADR-048 (Web Speech). **Composite 66 → 88** post-fix-pass (Grandma 70 / Framer 84 / Capstone 88). **Bundle gzip 599.85 KB main + 100 KB lazy = ~700 KB total** (under 800 KB P20 budget). 46 targeted Playwright passing. **20 P20 carryforward items** documented in `phase-19/deep-dive/05-fix-pass-plan.md` §5. $0 spent. |
| **P21** | Cleanup + ADR/DDD gap-fill | **95/100** (self-rated; doc-only phase, no persona scoring) | Tracks A-D + end-of-phase | `1129cea` | 5 sealed-phase folders archived (P15-P19); 5 ADR drift amendments (040/043/044/047/048); 4 ADR stubs (050-053); ADR-054 DDD bounded contexts authored full; attribution sweep across 11 ADRs (claude-flow swarm → bar181); `STATE.md` runway shifted (Sprint B → P23-P25, etc.); `CLAUDE.md` Phase Roadmap reorganized; standard phase-process documented in CLAUDE.md (every phase = end-of-phase + review-with-fixes + preflight; deep-dive = EXTRA). $0 spent. |
| **P22** | Public Website Rebuild — Don Miller blog-style + BYOK demo | **82/100** (initial seal; pre-persona) | initial seal — fix-pass + brutal review queued | (this session) | Welcome.tsx 918 → 165 LOC (drop 8-showcase carousel; warm-cream theme; Don Miller copy structure); HowIBuiltThis.tsx STATS+PHASES truthed (43 ADRs / 28K LOC / 63+ tests / P1-P21 trajectory); Docs.tsx counts truthed (17 examples / 300 media); NEW BYOK.tsx page (5-provider table + 60-second setup + privacy promise + cost cap); MarketingNav: BYOK replaces Research (5-item max preserved); main.tsx wires `/byok` route. ADR-053 full author. Build green; tsc clean. **Deferred to fix-pass-1:** AISP dual-view component; OpenCore delineation block; theme unification; 5 Playwright cases; persona walks (Grandma ≥70 binding). Recursive brutal review queued post-seal per owner mandate. $0 spent. |

### Phase-by-phase test growth
| Phase | Targeted Playwright | Suite total |
|---|---:|---:|
| Pre-P15 baseline | — | 102 |
| P15 | 2 added | 104 |
| P16 | 3 added | 107 |
| P17 | 6 added | 113 / 124 in full sweep |
| P18 | 16 added | 129+ Playwright |
| P18b | 5 added (4 in `p18b-logs.spec.ts` + 2 in `p18b-agent-proxy.spec.ts` minus 1 cap-edge xskip) | 36/36 targeted active (+ 2 xskip) |
| P19 step 1+2+3 | 13 added (`p19-step1` x4 + `p19-step2` x4 + `p19-step3` x0 polish + `p19-step3-edges` x5) | 41/41 targeted (+ 2 xskip) |
| P19 fix-pass-2 | 9 added (`p19-fix-hero-on-blog-standard` x1 + `p19-fix-mapchaterror` x6 + `p19-fix-css-injection` x2) | **46/46 targeted active** |
| **Net add through P19** | **+54** | **63 across 29 spec files (full sweep counter; 46 targeted is the seal-gate number)** |

### What's running today
- 100% frontend TypeScript SPA (Vite + React 19 + Tailwind + shadcn).
- sql.js + IndexedDB browser DB, lazy-loaded wasm, cross-tab safe.
- Anthropic + Google + OpenRouter (raw fetch) SDKs in browser with `dangerouslyAllowBrowser: true` (BYOK only).
- FixtureAdapter + AgentProxyAdapter are the active DEV adapters — **zero real-LLM dollars spent across P15-P19**.
- Web Speech API STT (push-to-talk) in P19; voice transcripts route through the same chatPipeline as text.
- ADRs added: P16→040,041; P17→042,043; P18→044,045; P18b→046,047; P19→048. **38 ADR files on disk; numbered up to 048.** Sequential audit (close 11 numbering gaps) is a P20 doc-task.
- Husky pre-commit hook + Vite build-time guard prevent any committed/deployed key.
- DEV-mode `VITE_LLM_API_KEY` boot warning (P19 fix-pass-2 F6).
- CSS-injection-resistant patch validator (`url(`/`@import` blocked, `imageUrl` allow-listed) — P19 fix-pass-2 F3.
- Per-error-kind chat copy via `mapChatError` (4 infra kinds + 2 fallback paths) — P19 fix-pass-2 F2.

---

## 2. To Do (post-P19-seal runway)

> **Velocity reality-check (post-P19, owner-flagged):** P15-P19 + P18b sealed in <1 day. Original 4-6-day-per-phase estimates have been observed 10-50× conservative. Effort columns below carry the original estimates AND the velocity-corrected estimate ("@vel"). Re-budget at end of each phase.

| Phase | Title | Plan ref | Effort | @vel | Real-LLM cost |
|---|---|---|---:|---:|---|
| **Step 4** *(post-DoD optional, gated by `VITE_LLM_LIVE_SMOKE=1`)* | Live LLM smoke against real Haiku | P18 plan §0 Step 3 trailing | ~30 min | ~30 min | ~$0.01 (5 starter prompts × ~$0.002 each) |
| **P20** | Verify, Cost Caps, MVP Close, Vercel Deploy + 20 P19 carryforward items | `06-phase-20-mvp-close.md` + `phase-19/deep-dive/05-fix-pass-plan.md` §5 | 5–7 days (orig) | <1 day | $0 in dev; ~$0.01 if Step 4 runs |
| **P21** *(NEW — Cleanup)* | Cleanup + ADR/DDD gap-fill (archive sealed phases + 5 ADR amendments + 4 stubs + ADR-054 DDD + doc accuracy pass) | `phase-21/preflight/00-summary.md` + `phase-22/A6-cleanup-plan.md` | 1-2h | 1-2h | $0 |
| **P22** *(NEW — Website rebuild)* | Public Website Rebuild (BYOK demo + Don Miller blog-style + 11 pages refreshed; Welcome 918→250 LOC) | `phase-22/A5-website-rebuild-plan.md` | 2-4h | 2-4h | $0 |
| **Sprint B (P23-P25)** | Simple Chat — natural language input + 2-3 templates + section targeting + intent translation | `phase-22/wave-1/A2-sprint-plan-review.md` §B | <1 day | <1 day | $0 in dev |
| **Sprint C (P26-P28)** | AISP Chat — instruction layer + intent pipeline + 2-step template selection | A2 §C | 1-2 days | 1-2 days | $0 in dev |
| **Capstone defense** | May 2026 panel | — | — | gated | — |
| **Sprint D (P29-P33)** | Templates + Content (5 phases) | A2 §D | post-defense | post-defense | $0 in dev |
| **Sprint E (P34-P37)** | Clarification & Assumptions (4 phases) | A2 §E | post-defense | post-defense | $0 in dev |
| **Sprint F (P38-P40)** | Listen Mode Enhancement (compressed to 3 phases — voice→pipeline already integrated P19) | A2 §F | post-defense | post-defense | $0 in dev |
| **Sprint G (P41-P44)** | Interview Mode (4 phases) | A2 §G | post-defense | post-defense | $0 in dev |
| **Sprint H (P45-P47)** | Post-MVP Upload + References (3 phases) | A2 §H | post-defense | post-defense | $0 in dev |
| **Sprint I (P48-P50)** | Builder Enhancement (3 phases) | A2 §I | post-defense | post-defense | $0 in dev |
| **Sprint J (P51-P53)** | Agentic Support System (3 phases) | A2 §J | post-defense | post-defense | $0 in dev |
| **Sprint K (P54-P56)** | Release / OSS RC (3 phases) | A2 §K | post-defense | post-defense | $0 in dev |

> **NOTE on phase numbering (post-Wave-2 ratification):** Sequential Option A still holds, BUT 2 NEW phases inserted (P21=Cleanup + P22=Website rebuild) shift Sprint B-K each +2 phases. Sprint F also COMPRESSED from 4→3 phases (voice→pipeline already integrated P19). Net: Sprint K final phase = **P56** (was P55). Mapping: B P23-P25 / C P26-P28 / D P29-P33 / E P34-P37 / F P38-P40 / G P41-P44 / H P45-P47 / I P48-P50 / J P51-P53 / K P54-P56.

After P20, the POC ships and the MVP-build arc begins. Capstone-presentation surface = P15+P16+P17+P18+P19+P20 (all sealed) + Sprint B + Sprint C if velocity holds. **Total real-LLM spend MVP-to-date: $0.**

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
- ~~`CLAUDE.md` still says 37 ADRs / 102 tests~~ **RESOLVED 2026-04-27 in post-P19 doc audit.** `CLAUDE.md` `## Project Status` now reads 38 ADRs through ADR-048 + 63 Playwright cases across 29 spec files (46 targeted active for P19 seal-gate) + ~28,400 LOC TS/TSX across 227 source files. ADR numbering convention (11 holes: 002-004, 006-009, 034-037) documented in `docs/adr/README.md`.

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
| P19 step-3 seal | (84 internal) | -6 (Listen tab regressed Grandma persona) |
| P19 fix-pass-2 (`772c154`) | **88** | **+4 net vs step-3 seal; -2 vs P18b** |

Trend: P19 momentarily dipped on persona regression, then recovered with the brutal-honest fix-pass. Net trajectory across P15→P19: +6 (82→88). P20's 20-item carryforward backlog is on track to pull the composite back to 90+ at MVP close.
