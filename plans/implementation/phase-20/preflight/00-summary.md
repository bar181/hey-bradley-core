# P20 Preflight — 00 Summary

> **Generated:** 2026-04-27 post-P19-seal (`03e7aa7`) + doc-audit (`c73422b`).
> **Phase:** 20 — Verify, Cost Caps, MVP Close, Vercel Deploy.
> **Effort:** 5–7 days (revised from 3–4 to absorb 9 P19 carryforward items folded into scope).
> **Real-LLM cost:** $0 in dev (FixtureAdapter / AgentProxyAdapter active); ~$0.01 if Step 4 live-LLM smoke runs post-deploy.
> **Capstone target:** Harvard ALM in Digital Media Design, May 2026 panel.

---

## 1. Where we are

| Phase | Composite | Sealed | Notes |
|---|---:|---|---|
| P15 | 82 | `47b95f6` | Polish + kitchen sink + blog + novice simplification |
| P16 | 86 | `755a20a` | sql.js + IndexedDB + 5 typed CRUD repositories |
| P17 | 88 | `8377ab7` | LLMAdapter abstraction + BYOK + husky guard |
| P18 | 89 | `232dd79` | Real chat (LLM → JSON patches) — $0 spent |
| P18b | 90 | `805b246` | 5-provider matrix + llm_logs observability |
| **P19** | **88** | `03e7aa7` (seal) + `772c154` (fix-pass-2) + `c73422b` (doc audit) | Web Speech STT + 4 brutal reviews + 18 fix-pass-2 items |

**Trajectory:** 74 → 82 → 86 → 88 → 89 → 90 → 88. P19 dipped 2 points net because adding the listen surface required regression-fixing; the brutal-review fix-pass discipline is what kept P19 from sealing at 66/100.

**Targeted Playwright at P19 seal:** 46 passed / 0 failed / 2 skipped across 14 spec files.

**Bundle:** 599.85 KB main + ~100 KB lazy = ~700 KB gzip total. **100 KB headroom under the 800 KB P20 budget.**

**Documented carryforward into P20:** 20 items (`plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md` §5).

---

## 2. The P20 plan as written (today)

`plans/implementation/mvp-plan/06-phase-20-mvp-close.md` enumerates **14 DoD items**:

1. `CostPill` visible in shell footer
2. Hard cap enforced; `chatPipeline` refuses calls when reached
3. Settings allow editing cap (range 0.10–20.00)
4. `tests/mvp-e2e.spec.ts` covers all 10 acceptance steps
5. Persona review document under `plans/implementation/phase-20/personas.md`
6. Grandma ≥ 70, Framer ≥ 80, Capstone ≥ 88
7. `docs/getting-started.md` exists and reads in ≤ 60 seconds
8. `README.md`, `CONTRIBUTING.md`, `SECURITY.md` updated
9. `plans/deferred-features.md` has Disposition column (Post-MVP-1, Post-MVP-2, Dropped)
10. Vercel main deploy is green; URL in README
11. Master checklist (08) shows 100% green for Phases 15–20
12. `RETRO.md` written
13. `REVIEW.md` updated with swarm review summary
14. Targeted + new Playwright green; build green; no new `console.error`

---

## 3. The 4 known blockers

### 3.1 Cost-cap default not yet wired (BLOCKER for items 1–3)

- `06-phase-20` §3 says default cap = `$1.00`, range $0.10–$20.00, persisted to `kv` table.
- **Code reality:** No `CostPill.tsx` component exists yet. `auditedComplete.ts` has cost-cap logic but reads from a hardcoded constant (not user-editable, not persisted to kv).
- **Decomposition (P20 Day 1):** see `02-fix-decomposition.md` §A.

### 3.2 ADR-047 slot conflict (BLOCKER for the cost-cap ADR write)

- `06-phase-20` says "ADR-047 — Cost Telemetry & Hard Cap" should be authored.
- **Reality:** `docs/adr/ADR-047-llm-logging-observability.md` already exists (P18b carryforward; sealed in `805b246`).
- **Decision:** Author the cost-cap ADR as **ADR-049** (continues at 049+ per `docs/adr/README.md` policy from doc-audit `c73422b`).
- **Decomposition:** ~10 min — author `docs/adr/ADR-049-cost-cap-telemetry.md`, update `06-phase-20-mvp-close.md` §3.4 to reference ADR-049.

### 3.3 SECURITY.md does not exist (BLOCKER for DoD item 8)

- ADR-043 (BYOK posture) cross-references SECURITY.md.
- ADR-048 (Web Speech STT) references "Settings → Clear Local Data" (verified shipped in P16).
- **Decomposition (P20 Day 1–2):** see `02-fix-decomposition.md` §B.

### 3.4 9 of 20 P19 carryforward items are NOT in the P20 DoD (SCOPE-LOCK BLOCKER)

The P19 deep-dive `05-fix-pass-plan.md` §5 enumerates C01–C20 with target-phase tags. The mismatch:

| C# | Item | Tagged | In P20 DoD? |
|---|---|---|---|
| C01 | 8 image-MVP fixtures | P20 | ❌ |
| C02 | "What can you do?" help/discovery handler | P20 | ❌ |
| C04 | ListenTab.tsx 4-component split | P20 | ❌ |
| C06 | OpenRouter privacy hint in LLMSettings | P20 | ❌ (folds into SECURITY.md doc) |
| C11 | Vertical carousel <600px | P20 | ❌ |
| C12 | AISP Blueprint sub-tab refresh | P20 | ❌ |
| C13 | "Clear local data" Settings affordance | P20 | ❌ — **already shipped P16** |
| C14 | Sentinel test for SENSITIVE_TABLE_OPS naming | P20 | ❌ |
| C15 | Lock import path against malicious example_prompts | P20 | ❌ |
| C16 | FK on llm_logs.session_id | P20 | ❌ |
| C17 | parseMasterConfig Zod helper | P20 | ❌ |
| C18 | Audit log LRU bound | P20 | ❌ |
| C20 | auditedComplete AbortSignal | P20 | ❌ |

Per the roadmap-review agent: **C13 is already done** (P16 shipped it; P19 doc has stale reference). The remaining 12 items need explicit triage:

- **Pull into P20 (must-fix-MVP):** C01 (image fixtures), C02 (help handler), C04 (ListenTab split), C06 (privacy hint), C15 (import lock), C16 (FK), C20 (AbortSignal)
- **Pull into P20 (polish week):** C11 (mobile carousel), C12 (AISP refresh), C14 (sentinel test), C17 (parseMasterConfig), C18 (LRU)
- **Drop to post-MVP:** none in this list — but C03 (multi-intent), C08 (vitest TDD), C09 (raw-fetch SDKs), C10 (Welcome split), C19 (ESLint v9) are explicitly post-MVP.
- **Close docs:** C13 (already shipped) — flip in `05-fix-pass-plan.md` §5.

This makes the **revised P20 DoD = 14 + 12 = 26 items**, justifying the 5–7 day estimate vs the original 3–4.

---

## 4. Comprehensive MVP gap analysis (cross-cutting)

### 4.1 UX/UI gaps (from R1 brutal review + persona walks)

- ✅ Grandma 70 (target met by P19 fix-pass-2). Sustained in P20 by image-fixture C01 + help-handler C02.
- ✅ Framer 84 (target 80; over). Sustained.
- ✅ Capstone 88 (target 85; over). P20 must hold; the AISP Blueprint refresh (C12) is the highest-value single item for Capstone score.
- ⚠️ Mobile (<600px viewport) — vertical carousel C11. Capstone reviewer will likely demo on phone.
- ⚠️ Listen tab is 754 LOC (CLAUDE.md guideline 500). Split (C04) prevents future regressions like the P19 score dip.

### 4.2 LLM prompt + handler gaps (from R2 brutal review)

- **Coverage matrix as of P19 fix-pass-2:** still 2/35 realistic prompts work end-to-end as standalone fixtures. The path-resolution helper (`resolvePath.ts`) closes the silent-corruption class but does NOT add new fixtures.
- **Image MVP scope** (one of the 4 narrowed pillars: theme + hero + IMAGES + article) has 0 chat fixtures. C01 closes this with 8 new fixtures.
- **Help/discovery** ("What can you do?", "Hi", "Help") — zero handler. C02 closes this with one fixture covering ~6 phrasings.
- **Multi-intent prompts** — silently apply first match only. C03 is post-MVP (needs LLM tool-use).
- **canned-chat shadowing** — `cannedChat.parseChatCommand` runs BEFORE FixtureAdapter for some prefixes. P20 must document the priority order in `chatPipeline.ts` to prevent future fixture-shadow bugs.

### 4.3 Error-handling gaps (from R2 + R4)

- ✅ `mapChatError` (P19 fix-pass-2 F2) covers cost_cap / timeout / precondition_failed / rate_limit. validation_failed routes to canned hint (semantically correct).
- ✅ `mapListenError` (pre-P19) covers 6 STT error kinds.
- ⚠️ `auditedComplete` Promise.race timeout doesn't `AbortSignal` the underlying SDK request — request leaks. C20 closes this.
- ⚠️ DB-init failure → `PersistenceErrorBanner` (P19 fix-pass-2 F14). Edge case: if banner itself fails to render, app silently degrades. Add a smoke test in P20.

### 4.4 Security + privacy gaps (from R3 brutal review)

- ✅ CSS-injection guard (P19 fix-pass-2 F3). `url(`/`@import` blocked.
- ✅ Site-context interpolation sanitize (P19 fix-pass-2 F4).
- ✅ DEV-mode key warn (P19 fix-pass-2 F6).
- ⚠️ SECURITY.md authoring (P20 DoD item 8). Blueprint exists in `06-phase-20` §3.4.
- ⚠️ OpenRouter privacy hint (C06 — folds into SECURITY.md sweep).
- ⚠️ Lock import path against malicious example_prompts seeds (C15). Today: `importBundle` replaces entire DB; a doctored bundle could ship a hostile envelope.
- ⚠️ Sentinel test for SENSITIVE_TABLE_OPS (C14). Schema-evolution canary.

### 4.5 Architecture + maintainability gaps (from R4 brutal review)

- ✅ adapterUtils dedup (P19 fix-pass-2 F7).
- ⚠️ ListenTab.tsx 754 LOC (C04). Recommended split: `OrbAnimation` + `DemoSimulator` + `PttSurface` + `OrbSettings`.
- ⚠️ Intelligence→Persistence direct repo imports (C05). Decision call: ADR amendment OR thin service facade. Either works; leaving implicit is what's expensive.
- ⚠️ 11 `as unknown as MasterConfig` casts in `configStore.ts`. C17 closes via Zod parser.
- ⚠️ Audit log unbounded (C18). LRU bound by row count (e.g., 10K rows max).
- ⚠️ FK on `llm_logs.session_id` (C16) — referential integrity asymmetry vs `llm_calls`.

### 4.6 Test gaps

- Targeted Playwright suite is healthy at 46/46. P20 adds:
  - `tests/mvp-e2e.spec.ts` (DoD item 4) — 10 acceptance steps end-to-end.
  - `tests/p20-cost-cap.spec.ts` — cap-edge tests (exactly-cap, over-cap, settings-edit propagation).
  - `tests/p20-image-fixtures.spec.ts` (C01) — 8 image-MVP fixtures.
  - `tests/p20-help-handler.spec.ts` (C02) — help/discovery.
  - `tests/p20-import-lock.spec.ts` (C15) — malicious-bundle rejection.
  - `tests/p20-sentinel.spec.ts` (C14) — SENSITIVE_TABLE_OPS naming canary.
  - **Estimated final targeted count: 60+ active.**

### 4.7 Documentation gaps

- ✅ CLAUDE.md (post doc-audit `c73422b`).
- ✅ docs/adr/README.md (post doc-audit).
- ⚠️ README.md "Build Phases L1-L7" table still shows pre-MVP framing (doc-audit recommended this for P20).
- ⚠️ `docs/getting-started.md` (DoD item 7) — 60-second BYOK walkthrough.
- ⚠️ SECURITY.md (DoD item 8 + C07).
- ⚠️ CONTRIBUTING.md (DoD item 8).
- ⚠️ `plans/deferred-features.md` Disposition column (DoD item 9).
- ⚠️ `RETRO.md` + `REVIEW.md` (DoD items 12 + 13).

### 4.8 Deploy gaps

- ⚠️ Vercel deploy not yet attempted (DoD item 10).
- ⚠️ `vite.config.ts` may need `assetsInclude` tweaks for `sql.js` wasm on Vercel.
- ⚠️ Pre-deploy: confirm build-time assertion against `VITE_LLM_API_KEY` runs in Vercel build (not just local).
- ⚠️ Step 4 live-LLM smoke (`VITE_LLM_LIVE_SMOKE=1`) — not wired into anything; document as human-triggered post-deploy.

---

## 5. The 5 highest-priority preflight items

(distilled from all 4 brutal reviews + roadmap-review agent + doc-audit agent)

1. **Resolve scope-lock.** 30-minute decision call before P20 Day 1: which of C01/C02/C04/C06/C11/C12/C14/C15/C16/C17/C18/C20 are P20 DoD vs P20 polish vs post-MVP? Update `06-phase-20-mvp-close.md` DoD checklist accordingly.
2. **Wire the cost cap before anything else.** ADR-049 + `CostPill.tsx` + `auditedComplete.ts` cap read from kv + `LLMSettings.tsx` cap edit. ~4 hours total. Blocks DoD items 1–3 + the e2e test (DoD item 4).
3. **Author SECURITY.md early (Day 1–2).** Blueprint in `06-phase-20` §3.4. Cross-reference ADR-040 (export sanitization), ADR-043 (BYOK), ADR-029 (no backend), ADR-047 (logging), ADR-048 (STT). Closes DoD item 8 + C06 + C07.
4. **Master Acceptance Test e2e first.** `tests/mvp-e2e.spec.ts` automates 10 steps against Vercel preview. Build it on Day 2 against local `vite preview` + mock adapters; Vercel is the same target with a different host. This is the capstone-ready gate.
5. **Persona review pre-schedule.** Grandma ≥70 / Framer ≥80 / Capstone ≥88 are binding. Schedule 3 reviewer slots in week 2 of P20. Pre-write the persona rubric (`plans/implementation/phase-20/personas-rubric.md`) so reviewers score against the same scale as P15-P19.

---

## 6. Reading guide for the preflight folder

| File | Length | Purpose |
|---|---:|---|
| `00-summary.md` (this file) | ~280 LOC | Executive summary, blockers, gap analysis, top-5 priorities |
| `01-scope-lock.md` | ~200 LOC | Decision-call template for the 12 carryforward items + final P20 DoD list |
| `02-fix-decomposition.md` | ~280 LOC | File-by-file plan for the 4 known blockers + day-by-day P20 schedule |
| `MEMORY.md` | ~80 LOC | Cross-session memory anchor: what to know if resuming P20 in a fresh session |

---

## 7. Cross-references

- **STATE.md** §2 (post-P19-seal runway): `plans/implementation/mvp-plan/STATE.md`
- **P20 plan**: `plans/implementation/mvp-plan/06-phase-20-mvp-close.md`
- **P19 deep-dive**: `plans/implementation/phase-19/deep-dive/00-summary.md` … `05-fix-pass-plan.md`
- **P19 session log**: `plans/implementation/phase-19/session-log.md`
- **Master checklist**: `plans/implementation/mvp-plan/08-master-checklist.md`
- **ADR conventions**: `docs/adr/README.md` (post-doc-audit `c73422b`)

---

## 8. Decision summary (what the user must approve before P20 starts)

| Question | Default | Approve? |
|---|---|:---:|
| Pull C01 (8 image fixtures) into P20 DoD? | Yes — narrowed MVP scope says "images" is one of the 4 pillars | ☐ |
| Pull C02 (help handler) into P20 DoD? | Yes — most common second-prompt | ☐ |
| Pull C04 (ListenTab split) into P20 DoD? | Yes — prevents future score regressions; refactor week-2 | ☐ |
| Pull C11/C12 (mobile + AISP refresh) into P20 polish week? | Yes — cheap UX wins for Capstone score | ☐ |
| Pull C14/C15/C16 (test sentinel + import lock + FK) into P20 DoD? | Yes — security/correctness; small effort | ☐ |
| Pull C17/C18/C20 (Zod parser + LRU + AbortSignal) into P20 polish week? | Defer C17 to post-MVP if pressed; C18/C20 are 30 min each | ☐ |
| Step 4 live-LLM smoke: pre-deploy gate or post-deploy human-triggered? | Post-deploy human-triggered (per ADR-046 deferral) | ☐ |
| Cost-cap default: hardcoded $1.00 or env-var-driven? | Hardcoded $1.00; user-editable via Settings (persists to kv) | ☐ |
| ADR-049 vs renumbering existing ADRs? | New ADR-049 for cost-cap; preserve existing 047 (llm-logging) | ☐ |

If all defaults approved → P20 effort is **5–7 days**, $0 in dev, ~$0.01 if Step 4 runs.
If any rejected → re-budget per the rejection.

---

**Author:** P19 review-swarm consolidation + roadmap-review agent + doc-audit agent
**Last updated:** 2026-04-27 post-`c73422b`
**Next file:** `01-scope-lock.md`
