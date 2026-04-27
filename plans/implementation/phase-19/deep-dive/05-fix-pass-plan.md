# P19 Deep-Dive — Chunk 5: Consolidated Fix-Pass Plan

> **Goal:** Close all must-fix-NOW items from R1+R2+R3+R4 brutal reviews before P19 seal.
> **Budget:** 3.5 hours total (single fix-pass commit on `claude/verify-flywheel-init-qlIBr`).
> **After fix-pass target:** Composite 88/100 (Grandma 70, Framer 84, Capstone 88), 10 documented P20 carryforward items.

---

## 1. Must-fix queue (consolidated, ordered by criticality)

| # | Item | Source | Severity | Time |
|---|---|---|---:|---:|
| **F1** | Hero/subheading/article fixtures use section-by-type resolution (close path-hardcoding bug) | R2 | Critical | 30m |
| **F2** | Add `mapChatError(kind)` parallel to `mapListenError`; surface in ChatInput; remove duplicate `FALLBACK_HINT` | R2 + R4 | Critical | 30m |
| **F3** | Extend `UNSAFE_VALUE_RE` with `\burl\(` + `@import`; add image path `imageUrl` | R3 (S1+S2) | High-Sec | 15m |
| **F4** | Sanitize site-context interpolation (purpose/audience/tone) | R3 (S3) | Med-Sec | 10m |
| **F5** | Truthful listen privacy copy (audio vs transcript) | R1 (F3) + R3 (S4) | Trust | 5m |
| **F6** | DEV-mode `VITE_LLM_API_KEY` runtime warning | R3 (S5) | Med-Sec | 5m |
| **F7** | Extract `safeJson` + `classifyError` to `adapterUtils.ts` | R4 (A1) | Maintainability | 45m |
| **F8** | Listen tab tooltip: "Microphone capture (alpha)" → "Speak to Bradley (preview)" | R1 (G1) | UX | 2m |
| **F9** | Inline privacy disclosure block above PTT (don't gate on first click) | R1 (G2) | UX | 15m |
| **F10** | Hide demo sliders in DRAFT mode | R1 (G3) | UX | 10m |
| **F11** | Conversational fallback prefix ("I didn't catch that.") | R1 (G4) | UX | 3m |
| **F12** | "via voice" pill on chat bubbles when source=listen | R1 (F1) | UX | 15m |
| **F13** | Simulated-mode pill in chat header | R1 (C1) | UX | 15m |
| **F14** | DB-init failure banner (in-memory fallback OR banner) | R4 (A2) | Reliability | 30m |
| **F15** | Update `CLAUDE.md` Project Status block (ADRs/tests/LOC) | R4 (A3) | Doc | 10m |
| **F16** | Stale-closure deps in `runSimulateInput` | R4 #8 | Code-hygiene | 5m |
| **F17** | `chatPipeline.submit` swallow → log + `recordPipelineFailure` | R4 #9 | Observability | 15m |
| **F18** | `.catch()` on `void useListenStore.getState().stopRecording().then(submitListenFinal)` | R4 #2 | Code-hygiene | 5m |

**Total: ~3h 35m. Distributable across 1 fix-pass commit OR 2-3 if fix-pass agent prefers granular commits.**

---

## 2. File-by-file change list

### 2.1 New files (3)

| Path | Purpose | LOC |
|---|---|---:|
| `src/data/llm-fixtures/resolvePath.ts` | Section-by-type path resolution helpers (F1) | ~60 |
| `src/contexts/intelligence/llm/adapterUtils.ts` | Shared `safeJson` + `classifyError` (F7) | ~50 |
| `src/lib/mapChatError.ts` | Kind → friendly copy mapper (F2) | ~40 |

### 2.2 Modified files (~12)

| Path | Edits |
|---|---|
| `src/data/llm-fixtures/step-2.ts` | F1: replace 3 hardcoded paths with helper calls; bail with empty patches when section/component missing |
| `src/components/shell/ChatInput.tsx` | F2: import + use `mapChatError`; remove local FALLBACK_HINT; F11: prefix conversational; F12: source=listen pill; F13: simulated-mode pill |
| `src/contexts/intelligence/chatPipeline.ts` | F2: emit error kind in result envelope; F11: prefix logic centralized; F17: log + recordPipelineFailure on catch |
| `src/contexts/intelligence/llm/patchValidator.ts` | F3: extend regex |
| `src/lib/schemas/patchPaths.ts` | F3: include `imageUrl` in IMAGE_PATH_RE; OR add disposition note |
| `src/contexts/intelligence/prompts/system.ts` | F4: `escapeForPromptInterpolation` helper applied at SITE CONTEXT |
| `src/components/left-panel/ListenTab.tsx` | F5: truthful copy; F8: tooltip; F9: inline privacy block above PTT; F10: hide demo sliders in DRAFT; F16: deps fix; F18: `.catch()` on chains |
| `src/components/left-panel/LeftPanel.tsx` | F8: tooltip text origin |
| `src/contexts/intelligence/llm/pickAdapter.ts` | F6: DEV-mode console.warn |
| `src/contexts/intelligence/llm/claudeAdapter.ts` | F7: import from `adapterUtils.ts`; delete local copies |
| `src/contexts/intelligence/llm/geminiAdapter.ts` | F7: same |
| `src/contexts/intelligence/llm/openrouterAdapter.ts` | F7: same |
| `src/main.tsx` + (new) `src/components/shell/PersistenceErrorBanner.tsx` | F14: catch initDB error → render banner OR construct in-memory SQL.Database fallback |
| `CLAUDE.md` | F15: Project Status block update |

### 2.3 New tests (3 spec files, ~50 LOC each)

| Path | What it covers |
|---|---|
| `tests/p19-fix-hero-on-blog-standard.spec.ts` | F1: load blog-standard, send "Make the hero say 'X'", assert hero updates and BLOG section is unchanged |
| `tests/p19-fix-mapchaterror.spec.ts` | F2: 6 error kinds × 1 message each; assert kind-specific copy renders |
| `tests/p19-fix-css-injection.spec.ts` | F3: send a patch with `url(http://attacker)` value; assert validator rejects |

---

## 3. Order of operations (recommended sequence for fix-pass agent)

### Wave A — Critical bugs (60m)

1. F1 — path-resolution helper + 3 fixture updates + test
2. F2 — `mapChatError` + ChatInput integration + test
3. F3 — extend UNSAFE_VALUE_RE + IMAGE_PATH_RE + test

### Wave B — Security + privacy disclosure (35m)

4. F4 — escapeForPromptInterpolation
5. F5 — listen privacy copy
6. F6 — DEV-mode key warning

### Wave C — Maintainability (60m)

7. F7 — extract adapterUtils.ts
8. F14 — DB-init failure banner
9. F15 — CLAUDE.md update

### Wave D — UX polish (60m)

10. F8 — tooltip
11. F9 — inline privacy block
12. F10 — hide demo sliders in DRAFT
13. F11 — conversational fallback prefix (subsumed by F2 mapChatError)
14. F12 — "via voice" pill
15. F13 — simulated-mode pill

### Wave E — Code hygiene (25m)

16. F16 — runSimulateInput deps
17. F17 — chatPipeline catch logging
18. F18 — .catch() on void chains

### Final — Test + build (15m)

19. `npm run build` → green
20. `npx playwright test tests/p18*.spec.ts tests/p19*.spec.ts` → green
21. `npm run lint` → green
22. Commit + push

---

## 4. Test plan

### 4.1 Targeted Playwright suites (must remain green)

```bash
npx playwright test tests/p18-step1.spec.ts        # 5 starters baseline
npx playwright test tests/p18-step3.spec.ts        # add/remove/multi-patch + safety
npx playwright test tests/p18b-logs.spec.ts        # llm_logs forensic
npx playwright test tests/p18b-agent-proxy.spec.ts # mock adapter
npx playwright test tests/p19-step1.spec.ts        # STT capture
npx playwright test tests/p19-step2.spec.ts        # voice → pipeline
npx playwright test tests/p19-step3.spec.ts        # PTT polish
npx playwright test tests/p19-step3-edges.spec.ts  # PTT edges
```

Expected: 36/36 targeted (existing) + 3 new (fix-pass) = **39 targeted active**.

### 4.2 New tests (3)

- `tests/p19-fix-hero-on-blog-standard.spec.ts` — F1 critical bug regression test
- `tests/p19-fix-mapchaterror.spec.ts` — F2 error-kind mapping
- `tests/p19-fix-css-injection.spec.ts` — F3 validator rejects `url(`/`@import`

### 4.3 Manual smoke (≤5m)

Open `localhost:5173` in DEV mode (FixtureAdapter active):
- Type "Make the hero say 'Test'" → hero updates ✓
- Switch active config to blog-standard via DevTools `__configStore.setActiveExample('blog-standard')`
- Type "Make the hero say 'Test'" → hero updates correctly (NO blog section corruption) ✓
- Tap Listen tab → privacy disclosure visible BEFORE clicking mic ✓
- Type "What can you do?" → friendly canned hint with conversational prefix ✓

---

## 5. Carryforward items (P20 backlog, NOT fix-pass scope)

Each item below is intentionally OUT of fix-pass to keep the patch surface tight. All have rationale and target phase.

| # | Item | Source | Target |
|---|---|---|---|
| C01 | 8 image-MVP fixtures (replace, swap, dim, rounded corners, etc.) | R2 | P20 |
| C02 | "What can you do?" help/discovery handler | R2, R1 (C3) | P20 |
| C03 | Multi-intent prompt parser ("change accent AND make hero serif") | R2 | P21 (post-MVP, LLM tool-use) |
| C04 | Split `ListenTab.tsx` (754 LOC) into 4 components | R4 #5 | P20 §6 |
| C05 | Intelligence→Persistence service-facade decision (ADR-040 amendment OR refactor) | R4 #2 | P20 §1 |
| C06 | OpenRouter privacy hint in `LLMSettings.tsx` | R3 (P2) | P20 (with SECURITY.md) |
| C07 | SECURITY.md authoring | R3 (P1) | P20 |
| C08 | TDD-ify with vitest (mock-first London) | R4 §2.2 | P20+ |
| C09 | Replace `@anthropic-ai/sdk` + `@google/genai` with raw fetch (~60 KB gzip) | R4 §7.3 | post-MVP |
| C10 | Welcome.tsx (918 LOC) god-component split | R4 #10 | post-MVP |
| C11 | Vertical carousel on phone <600px | R1 (G5) | P20 (UX polish week) |
| C12 | AISP Blueprint sub-tab refresh | R1 (C3) | P20 |
| C13 | "Clear local data" Settings affordance (ADR-048 references it) | R3 (P5) | P20 |
| C14 | Sentinel test for table naming vs `SENSITIVE_TABLE_OPS` | R3 (P4) | P20 |
| C15 | Lock import path against malicious example_prompts seeds | R3 (P3) | P20 |
| C16 | FK on `llm_logs.session_id` symmetric with `llm_calls` (migration 003) | R4 §6.1-R3 | P20 |
| C17 | `parseMasterConfig(json)` Zod helper to remove 11 `as unknown as` in `configStore` | R4 (AP3) | P20 |
| C18 | Audit log LRU bound (carry from P16) | STATE.md §3 | P20 |
| C19 | ESLint v9 flat-config migration (carry from P15) | STATE.md §3 | post-MVP |
| C20 | `auditedComplete` Promise.race → AbortSignal plumb-through | STATE.md §3 (P17 carry) | P20 (Step 4 reveals this anyway) |

**Total carryforward: 20 items, all documented with severity + target phase.**

---

## 6. Acceptance criteria for P19 seal

After fix-pass:

| Criterion | Target | Measurement |
|---|---|---|
| All targeted Playwright pass | 39/39 | `npx playwright test tests/p18*.spec.ts tests/p19*.spec.ts` |
| Build green | yes | `npm run build` |
| Lint green | yes | `npm run lint` |
| TypeScript compile | yes | `tsc --noEmit` |
| F1 critical bug closed | yes | new spec passes |
| F2 mapChatError works | yes | new spec passes |
| F3 CSS-injection rejected | yes | new spec passes |
| Composite UX score | ≥85 | Grandma 70+, Framer 80+, Capstone 85+ |
| Doc audit complete | yes | CLAUDE.md ADR/test/LOC counts match reality |
| ADRs sequential | yes | 000-048 (no gaps in numbering) |
| P20 carryforward documented | yes | all 20 items above with rationale |

---

## 7. Dispatch instructions for fix-pass agent

Recommended single-agent dispatch (sparc-coder or similar):

```
Subject: P19 Fix-Pass — Close all 18 must-fix items from brutal reviewers
Branch: claude/verify-flywheel-init-qlIBr
Read first:
  - plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md (this file)
  - plans/implementation/phase-19/deep-dive/02-functionality-findings.md (F1 detail)
  - plans/implementation/phase-19/deep-dive/03-security-findings.md (F3+F4 detail)
Execute waves A-E in order.
Run npm run build && npx playwright test tests/p18*.spec.ts tests/p19*.spec.ts after each wave.
Commit at end with message: "P19 Fix-Pass 2: close all 18 brutal-reviewer findings (path-hardcoding, mapChatError, CSS-injection guard, listen privacy, adapterUtils dedup, +13 polish)"
Report at completion only.
```

---

## 8. Cross-reference

- See `00-summary.md` §3 for the 8-item summary version of this queue.
- See per-chunk findings (`01`-`04`) for full reviewer rationale per item.
- See `STATE.md` §2 for how this fits the post-P18 runway (P19 → P20 → MVP close).

---

**Author:** P19 deep-dive consolidation (4 brutal reviews → 1 actionable plan)
**Status:** Awaiting fix-pass dispatch
**Cross-link:** This is the LAST chunk of the P19 deep-dive series (00-05).
