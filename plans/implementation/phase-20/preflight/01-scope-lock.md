# P20 Preflight — 01 Scope-Lock Decision Template

> **Purpose:** Before P20 Day 1, resolve which of the 20 P19 carryforward items are inside the P20 DoD vs polish week vs post-MVP.
> **Source:** `plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md` §5 + `06-phase-20-mvp-close.md` §5.
> **Output:** A revised P20 DoD checklist (replaces `06-phase-20-mvp-close.md` §5 list of 14 with the consolidated list).

---

## 1. The 20 P19 carryforward items

Sorted by recommended P20 disposition.

### 1.1 Recommend: PULL INTO P20 DoD (must-fix-MVP)

| C# | Item | Effort | Why MVP | Risk if dropped |
|---|---|---:|---|---|
| C01 | 8 image-MVP fixtures | 4h | Narrowed MVP scope = theme + hero + IMAGES + article. Today: 0/8 image prompts work via chat | Capstone reviewer asks "swap the photo" and gets canned-hint. Demo loses minute. |
| C02 | "What can you do?" help/discovery handler | 30m | Most common second-prompt from any new user | Grandma score drops 3 points if reviewer happens to test "Help" |
| C06 | OpenRouter privacy hint in LLMSettings.tsx | 10m | Must ship with SECURITY.md anyway | Truth-in-advertising failure if user picks OpenRouter without seeing what it sees |
| C15 | Lock import path against malicious example_prompts seeds | 30m | Closes a real attack vector for shared `.heybradley` bundles | Security regression in capstone Q&A |
| C16 | FK on llm_logs.session_id (migration 003) | 15m | Schema correctness; symmetric with llm_calls | Data drift over time; orphan log rows |
| C20 | auditedComplete Promise.race → AbortSignal | 30m | Step 4 live-LLM smoke will reveal request leak | $0.005 of leak per stuck call × N = real cap-math drift |
| **Subtotal** | | **5h 25m** | | |

### 1.2 Recommend: PULL INTO P20 POLISH WEEK (nice-to-have-MVP)

| C# | Item | Effort | Why polish | Risk if dropped |
|---|---|---:|---|---|
| C04 | ListenTab.tsx 4-component split (754→<500 each) | 4h | Prevents future regressions like P19 score dip | Maintainability tax accumulates |
| C11 | Vertical carousel <600px viewport | 30m | Capstone may demo on phone; Grandma walk fails on phone | Mobile demo loses 8 points |
| C12 | AISP Blueprint sub-tab refresh | 4h | Capstone reviewer wants AISP visible in UI, not just system prompt | Capstone score caps at 88 (matches P19 cleanly but no upside) |
| C14 | Sentinel test for SENSITIVE_TABLE_OPS | 30m | Schema-evolution canary | Future table addition could leak in exports |
| C17 | parseMasterConfig Zod helper (rm 11 `as unknown as`) | 2h | Eliminates type-escape concentration | Boot-time corruption goes undetected |
| C18 | Audit log LRU bound | 30m | Performance correctness at high call volume | Memory growth over weeks of use |
| **Subtotal** | | **11h 30m** | | |

### 1.3 Recommend: DROP TO POST-MVP

| C# | Item | Effort | Why drop | Track |
|---|---|---:|---|---|
| C03 | Multi-intent prompt parser | 8h+ | Needs LLM tool-use (architectural shift); not regression-blocking | post-MVP-1 |
| C05 | Intelligence→Persistence service-facade | 6h | Decision required (ADR amendment OR refactor); leaving implicit is the actual cost | ADR amendment in P20 close, refactor post-MVP |
| C07 | SECURITY.md authoring | 2h | **already promoted to P20 DoD item 8** | — |
| C08 | TDD-ify with vitest (London-school) | 2-3 days | CLAUDE.md guideline never enforced; existing Playwright is solid | post-MVP-2 |
| C09 | Replace `@anthropic-ai/sdk` + `@google/genai` with raw fetch | 4-6h | Saves ~60 KB gzip; bundle margin is +100 KB so not blocker | post-MVP-2 |
| C10 | Welcome.tsx (918 LOC) god-component split | 6-8h | Pre-existing pre-P15 debt; not P19's problem | post-MVP-2 |
| C13 | "Clear local data" Settings affordance | — | **ALREADY SHIPPED in P16**; doc fix only | close in `05-fix-pass-plan.md` §5 |
| C19 | ESLint v9 flat-config migration | 2-3h | Pre-P15 carryforward; tooling, not feature | post-MVP-2 |

### 1.4 Total carryforward absorption

| Disposition | Items | Effort | New P20 estimate |
|---|---:|---:|---|
| Existing P20 DoD | 14 | ~3 days | baseline |
| Pull into P20 DoD | 6 (C01, C02, C06, C15, C16, C20) | +5h 25m | +1 day |
| Pull into P20 polish | 6 (C04, C11, C12, C14, C17, C18) | +11h 30m | +1.5 days |
| Drop to post-MVP | 7 (C03, C05, C08, C09, C10, C19) + C07 promoted | 0 | 0 |
| Doc-only close | 1 (C13) | 5m | 0 |
| **Revised P20 effort** | **26 items** | **~5–7 days** | **matches roadmap-review estimate** |

---

## 2. Proposed P20 DoD (revised)

(replaces `06-phase-20-mvp-close.md` §5 if approved)

### 2.1 Original 14
- [ ] `CostPill` visible in shell footer
- [ ] Hard cap enforced; `chatPipeline` refuses calls when reached
- [ ] Settings allow editing cap (range 0.10–20.00)
- [ ] `tests/mvp-e2e.spec.ts` covers all 10 acceptance steps
- [ ] Persona review document committed (`plans/implementation/phase-20/personas.md`)
- [ ] Grandma ≥ 70, Framer ≥ 80, Capstone ≥ 88
- [ ] `docs/getting-started.md` exists and reads in ≤ 60 seconds
- [ ] `README.md`, `CONTRIBUTING.md`, `SECURITY.md` updated
- [ ] `plans/deferred-features.md` has Disposition column (Post-MVP-1, Post-MVP-2, Dropped)
- [ ] Vercel main deploy is green; URL in README
- [ ] Master checklist (08) shows 100% green for Phases 15–20
- [ ] `RETRO.md` written
- [ ] `REVIEW.md` updated with swarm review summary
- [ ] No new `console.error` during the Master Acceptance Test

### 2.2 Pulled-in must-fix (C01, C02, C06, C15, C16, C20)
- [ ] **C01** — 8 image-MVP fixtures (replace, swap, dim, brighten, rounded, square, centered, crop) with `IMAGE_PATH_RE` extension where needed
- [ ] **C02** — Help/discovery fixture covering "What can you do?", "Help", "Hi", "Hello", "I'm stuck", "Show me what's possible" → friendly summary of 5 starter patterns + 4 MVP pillars
- [ ] **C06** — OpenRouter privacy hint in `LLMSettings.tsx` PROVIDER_TIER block
- [ ] **C15** — `importBundle` re-seeds `example_prompts` from canonical migration 001 (or marks imported rows `source='import'` and refuses them in AgentProxyAdapter)
- [ ] **C16** — Migration 003 adds FK constraint `llm_logs.session_id REFERENCES sessions(id)`
- [ ] **C20** — `LLMRequest.signal: AbortSignal` plumbed through claude/gemini/openrouter adapters; `auditedComplete` aborts on timeout instead of letting request leak

### 2.3 Pulled-in polish (C04, C11, C12, C14, C17, C18)
- [ ] **C04** — `ListenTab.tsx` split into `OrbAnimation` + `DemoSimulator` + `PttSurface` + `OrbSettings` (each <500 LOC)
- [ ] **C11** — Vertical-list starter carousel on `<600px` viewport (Welcome page)
- [ ] **C12** — AISP Blueprint sub-tab refresh: surface system-prompt AISP atom in UI; cross-link to `bar181/aisp-open-core`
- [ ] **C14** — Sentinel Playwright test: any new `CREATE TABLE` containing `prompt|text|key|secret|password` column names is in `SENSITIVE_TABLE_OPS` registry
- [ ] **C17** — `parseMasterConfig(json)` Zod helper replaces 11 `as unknown as MasterConfig` casts in `configStore.ts`
- [ ] **C18** — Audit log LRU bound (10K rows max; `pruneOldLLMLogs` already exists, add row-count pruning)

### 2.4 Doc closure (C07 already in DoD §2.1; C13 already shipped)
- [ ] Update `plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md` §5 to mark C13 as "✅ shipped P16"
- [ ] **ADR-049** — Cost-Cap Telemetry & Hard Cap (new, replaces the conflict with existing ADR-047 for llm-logs)

### 2.5 Total revised count: **26 + 2 ADR/doc = 28 line items**.

---

## 3. P20 sprint structure (proposed)

### Day 1 (Mon) — Cost-cap wiring
- ADR-049 authored
- `CostPill.tsx` + `LLMSettings.tsx` cap-edit + `auditedComplete.ts` kv-read
- `tests/p20-cost-cap.spec.ts` (3 cases: under-cap / at-cap / over-cap + edit-propagates)
- C20 (AbortSignal) plumb-through

### Day 2 (Tue) — SECURITY.md + privacy disclosures
- Author SECURITY.md cross-referencing ADR-029, 040, 043, 047, 048
- C06 OpenRouter hint
- Pre-deploy review: ensure no key leaks in build artifacts
- C16 migration 003 FK constraint

### Day 3 (Wed) — Master Acceptance Test e2e + image fixtures
- `tests/mvp-e2e.spec.ts` (10 acceptance steps)
- C01 image-MVP fixtures (8 prompts)
- C02 help/discovery handler
- C15 import-lock against example_prompts mutation

### Day 4 (Thu) — Vercel deploy + Step 4 prep
- Vercel project setup + deploy
- Confirm `vite.config.ts` `assetsInclude` works for sql.js wasm
- Document Step 4 `VITE_LLM_LIVE_SMOKE` flag (post-deploy human task)
- README screenshots + `docs/getting-started.md`

### Day 5 (Fri) — Polish week kickoff
- C04 ListenTab split
- C11 mobile carousel
- C14 sentinel test
- `CONTRIBUTING.md` + `plans/deferred-features.md` Disposition column

### Day 6 (Mon) — Polish week + persona reviews
- C12 AISP Blueprint refresh
- C17 parseMasterConfig
- C18 audit log LRU
- 3 persona reviews scheduled (Grandma + Framer + Capstone)

### Day 7 (Tue) — Close-out
- Persona scores recorded in `plans/implementation/phase-20/personas.md`
- `RETRO.md` + `REVIEW.md` written
- Master checklist 08 → 100% green for P15-P20
- Final tag + push
- Step 4 live-LLM smoke (~$0.01) — post-tag, human-approved

---

## 4. Approval checklist

The user (Bradley) signs off on:

- [ ] Day 1–7 schedule above
- [ ] 26-item revised DoD (vs original 14)
- [ ] ADR-049 numbering (vs renaming existing ADR-047)
- [ ] $0 in-dev / $0.01 post-tag-smoke budget
- [ ] Persona reviewer pre-schedule (Day 6 = Monday week 2 of P20)

If all approved → kick off P20 Day 1 with cost-cap ADR + CostPill.tsx.
If any rejected → re-budget per rejection; update `06-phase-20-mvp-close.md` accordingly.

---

**Cross-link:** `00-summary.md` §3.4 (scope-lock blocker), §8 (decision summary)
**Next file:** `02-fix-decomposition.md`
