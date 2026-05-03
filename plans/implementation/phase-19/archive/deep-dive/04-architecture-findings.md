# P19 Deep-Dive — Chunk 4: Architecture + Maintainability Brutal Review (R4)

> **Reviewer:** R4 — Architecture + maintainability brutal-honest deep-dive
> **Verdict:** **5.5/10 maintainability** — P17–P19 functional, but accumulated structural debt has crossed the "every new phase pays a tax" threshold.
> **Source:** `/tmp/claude-0/.../tasks/a795e355dbf5c856c.output`

---

## 1. Critical structural debt table

| # | Item | File:line | Severity | Cost-to-fix |
|---|---|---|---:|---:|
| 1 | `safeJson` + `classifyError` cloned 3x in adapter modules | `claudeAdapter.ts:71-101`, `geminiAdapter.ts:71-100`, `openrouterAdapter.ts:91-103` | High | 1h (extract `adapterUtils.ts`) |
| 2 | Intelligence imports Persistence repos directly (no service boundary) | `auditedComplete.ts:9-12`, `keys.ts:9`, `recordPipelineFailure.ts:14`, `chatPipeline.ts:11-12` | High | 4-6h (P20 service facade) |
| 3 | DB-init failure cascade: app renders, every `getDB()` throws | `main.tsx:66-87` + `db.ts:114-117` | High | 2h (in-memory fallback or banner) |
| 4 | Cross-context bleed in store: `intelligenceStore` imports persistence repos | `intelligenceStore.ts:12-13` | Medium | folded into #2 |
| 5 | `ListenTab.tsx` 754 LOC (CLAUDE.md says <500); mixes orb+demo+PTT+session+privacy+sliders | `ListenTab.tsx:1-755` | High | 4-6h (P20 split) |
| 6 | `configStore.ts` 646 LOC, blends config CRUD + theme registry + multi-page CRUD + helpers | `configStore.ts:1-646` | Medium | 8h (P20+) |
| 7 | Listen-success persistence has its own `activeSession ?? startSession` block | `ListenTab.tsx:155-159` vs `auditedComplete.ts:56-62` | Medium | 30m (export `ensureSession`) |
| 8 | `runSimulateInput` deps `[simActive, burstActive, runBurstAnimation]` are dead | `ListenTab.tsx:299-350` | Low | 5m fix |
| 9 | `chatPipeline.submit` swallows ALL `runLLMPipeline` exceptions silently | `chatPipeline.ts:163-166` | Medium | 15m to log + recordPipelineFailure |
| 10 | Welcome.tsx 918 LOC, untouched by P17-19 — pre-existing pre-MVP debt | `pages/Welcome.tsx` | Medium | 6-8h, defer post-MVP |

**Items 1, 3, 7, 8, 9 are fix-pass-NOW. Items 2, 5, 6 are P20. Item 10 is post-MVP.**

---

## 2. CLAUDE.md guideline violations

### 2.1 Files > 500 LOC

| File | LOC | P19 delta |
|---|---:|---:|
| `src/pages/Welcome.tsx` | 918 | 0 (pre-existing) |
| `src/components/left-panel/ListenTab.tsx` | 754 | **+59** (PTT + privacy added in P19) |
| `src/pages/Onboarding.tsx` | 740 | 0 |
| `src/store/configStore.ts` | 646 | 0 |
| `src/components/center-canvas/RealityTab.tsx` | 613 | 0 |
| `src/components/center-canvas/ResourcesTab.tsx` | 559 | 0 |
| `src/components/left-panel/SectionsSection.tsx` | 529 | 0 |
| `src/components/shell/ChatInput.tsx` | 509 | **+9** (just over the line; was below pre-P19) |

**P19 pushed 2 files over the 500-LOC line and 1 file further over.** ListenTab.tsx is the structural problem (item #5 above).

### 2.2 TDD London School (rule violated)

Zero spec files for P17/P18/P18b/P19 are mock-first. Tests are Playwright e2e (`tests/p18-step1.spec.ts` etc.) that drive real UI through `__configStore`/`__intelligenceStore` window globals — that's integration testing, not TDD.

- No vitest setup exists
- No mock-first unit tests for `auditedComplete`, `chatPipeline`, `validatePatches`, `webSpeechAdapter`, etc.

**Defer to P20+.** The Playwright suite is sound and gives high integration confidence; the gap is a methodology/coverage gap, not a correctness one.

### 2.3 Documentation drift (CLAUDE.md `## Project Status`)

| Claim | Reality | Drift |
|---|---|---|
| "ADRs: 37 (through ADR-037)" | **49 ADRs (through ADR-048)** | **+12 ADRs unaccounted** |
| "Tests: 102 passing (11 spec files)" | **63 `test()` calls across 20 spec files** (just `tests/*.spec.ts`) | Different number; different methodology |
| "Codebase: 171 TS/TSX source files, ~17,000 lines" | **28,091 lines** (counted) | **+11K LOC unaccounted (~65%)** |

**Stale since P15.** Capstone reviewer flagged in P15 retro; never fixed across 5 phases. **10-min update; embarrassing if not done.**

---

## 3. Duplication count

| Pattern | Count | Locations |
|---|---:|---|
| `safeJson()` adapter helper | **3** | `claudeAdapter.ts:71`, `geminiAdapter.ts:71`, `openrouterAdapter.ts:91` |
| `classifyError()` adapter helper | **3** | same three files |
| `FALLBACK_HINT` literal | **2 close, 1 hint** | Constant in `chatPipeline.ts:40-46`, near-duplicate in `ChatInput.tsx:236-243`. Strict-move attempt that left the original. |
| `ensureSession`-equivalent logic | **2** | `auditedComplete.ts:56-62` (function) + `ListenTab.tsx:155-158` (inline) |
| `mapListenError` vs WebSpeech ERROR_MAP shape mismatch | **2** | `ListenTab.tsx:19-36` + `webSpeechAdapter.ts:26-33` (different shapes; mapping logic split) |
| `as unknown as Record<string, unknown>` for theme JSON imports | **12** | in `configStore.ts:24-35` + 17 in `data/examples/index.ts` |
| Dev-only window store-exposure pattern (`__store`) | **4 stores** | Repeats `as unknown as` cast — extract `exposeForDev()` helper |
| `void persist()` after every repo write | **15 call sites** across 8 repository files | A `withPersist()` decorator would centralise the policy |

**`safeJson`/`classifyError` triplication is the only one that hits the "flag at three" threshold. Extract before P20 (FIX-PASS NOW).**

---

## 4. Type-escape audit

| Escape | Count | Concentration | Risk |
|---|---:|---|---|
| `as unknown as ...` | **65** | 11 in `configStore.ts`, 17 in `data/examples/index.ts`, 6 in `data/spec-templates/index.ts`, 14 in `tests/*.spec.ts` (DEV-only window globals), 7 in `contexts/persistence/*.ts` (sql.js row casts), 2 in `db.ts` (sql.js CJS/ESM interop), ~8 elsewhere | High concentration in `configStore.ts` is the dangerous one |
| `as any` | **0** | clean | — |
| `@ts-ignore` / `@ts-expect-error` | **0** | clean | — |
| `Object.prototype.hasOwnProperty.call(...)` | **5** | `applyPatches.ts`, `patchValidator.ts`, `cost.ts`, `draftRename.ts` | All defensive; all justified |

**Verdict:** ~80% of `as unknown as` are JSON-import shape-casts (themes, examples, spec templates) rather than logic-layer escapes. The dangerous concentration is the 11 in `configStore.ts` where `deepMerge(config as unknown as Record<string, unknown>, patch) as unknown as MasterConfig` is the central mutation path.

**Fix proposal (P20):** A `parseMasterConfig(json)` Zod helper would eliminate all 11 in one swoop AND give boot-time corruption detection for free. ~2h.

---

## 5. Async / concurrency risks

| # | Risk | File:line | Severity | Fix |
|---|---|---|---:|---|
| 1 | Floating `void persist()` writes (15 sites) — silent loss on quota error | 8 repository files | Medium | Add `.catch(e => DEV && console.warn(e))` to each; ~15 LOC total. |
| 2 | `void useListenStore.getState().stopRecording().then(submitListenFinal)` — no `.catch()` | `ListenTab.tsx:196`, `:224` | Low | Add `.catch()` to both chains. ~2 LOC. **FIX-PASS NOW.** |
| 3 | `db.ts:124` background re-hydrate: tight TOCTOU window between stale flag + new init | `db.ts:114-127` | Low | Single-flight guard around the re-hydrate. ~5 LOC. **Defer P20.** |
| 4 | WebLocks + BroadcastChannel coordination | `db.ts` + `persist()` | OK | Sound. Safari 15- without `navigator.locks` silently degrades with one-time DEV warn. |
| 5 | `auditedComplete` mutex via store flag: TOCTOU on multi-event-loop | `intelligenceStore.ts` | Negligible | Single-threaded JS, atomic-enough. |
| 6 | Stale closures in ListenTab `runSimulateInput` deps | `ListenTab.tsx:299-350` | Low | Use refs only OR remove the deps; ~5m. **FIX-PASS NOW.** |
| 7 | PTT timer ref management | `ListenTab.tsx:231-246` | OK | All 4 timers cleared in unmount effect. Verified. |
| 8 | `submitListenFinal` empty deps array | `ListenTab.tsx` | Low | Correct today; fragile to future edits. Document inline. |

---

## 6. Schema + migration outlook

| Aspect | State | Verdict |
|---|---|---|
| Migrations | 3 (000-init, 001-example-prompts, 002-llm-logs) | Additive; clean. |
| Each wrapped BEGIN/COMMIT | yes; rolls back on error | Sound. |
| Pre-snapshot of kv before applying | yes; restore on failure | Sound. |
| Deprecated columns mid-flight | none | Clean. |
| Forward-compat schema_version bump | `WHERE 1=1` UPDATE | Tolerates multi-row corruption. |

### 6.1 Hidden migration risks

**R1:** `import.meta.glob` eager-loading. If a 003 migration appears in a deployed bundle but the user's IndexedDB has version=2, the pre-snapshot at line 50 happens AFTER `dbInstance` is built from old bytes; if the new migration drops a column the OLD app version still tries to read, an in-flight session will crash. Mitigation requires app-version pinning. **Defer to P20 but document.**

**R2:** Partial migration: if DDL succeeds but `schema_version` bump throws, `ROLLBACK` recovers, but the snapshot is left in `kv` forever (line 88 only clears on full success). **Cosmetic, not data-loss.**

**R3:** `llm_logs.session_id` is NOT a foreign key (002-llm-logs.sql line 18). `llm_calls.session_id` IS (000-init line 38). Asymmetric — orphan log rows possible. **Defer to P20 (migration 003).**

---

## 7. Performance debt

| Asset | Size | Notes |
|---|---:|---|
| `index-BX3LfMlU.js` | 2.27 MB raw → ~600 KB gzip | Main bundle |
| `geminiAdapter-Cm7VyQUk.js` | 264 KB raw → ~52 KB gzip | Lazy-loaded |
| `claudeAdapter-DQ2F8mIg.js` | 42 KB raw → ~12 KB gzip | Lazy-loaded |
| `sql-wasm-browser-DpYD3PFE.js` | 39 KB raw → ~6 KB gzip | Lazy-loaded |
| `db-BygelQGV.js` | 20 KB raw | Lazy-loaded |
| `pickAdapter-BzEkFPVV.js` | 4.7 KB raw | Lazy-loaded |
| `openrouterAdapter-B1LL5G2I.js` | 1.7 KB raw | Lazy-loaded |
| `index-BoV4ekLd.css` | 96 KB raw | One-shot |

### 7.1 Cold-load round-trips

`index.html` → main JS + CSS → (after init) `db.ts` chunk → `sql-wasm-browser` chunk → `sql-wasm.wasm` (700 KB in `dist/sqljs/`).

**That's 4 sequential RTTs before DB is ready.** The wasm file is intentionally NOT in `assets/` — served from `/sqljs/` via the prebuild copy script. Means it's not chunk-hashed and can stale-cache across deploys. **Mild risk; document.**

### 7.2 Bundle margin

~670 KB gzip total. P20 budget 800 KB. **Margin is 130 KB** for P20's "MVP close" work + future model SDKs. The `@google/genai` SDK is the single biggest cost (264 KB raw); adding OpenAI native SDK later would eat the budget.

### 7.3 SDK vs raw fetch trade-off

`@anthropic-ai/sdk` and `@google/genai` are full SDKs for what is essentially one HTTP POST per provider. The OpenRouter adapter shows you can do the whole thing with `fetch()` in 100 LOC and 1.7 KB. Replacing the two SDK-based adapters with raw fetch saves **~290 KB raw / ~60 KB gzip**.

**Defer to post-MVP.** SDKs do give you streaming primitives you'll want eventually.

---

## 8. Top 5 must-fix-before-P20 (architecture)

| # | Item | Time | LOC |
|---|---|---:|---:|
| A1 | Extract `safeJson` + `classifyError` to `adapterUtils.ts`; refactor 3 adapters | 1h | ~50 net deletion |
| A2 | Fix `main.tsx` initDB-failure cascade (in-memory fallback OR banner) | 2h | ~25 |
| A3 | Update CLAUDE.md `## Project Status` (ADRs 37→49, tests 102→63, LOC 17K→28K) | 15m | ~12 |
| A4 | Resolve `FALLBACK_HINT` duplication — `ChatInput` imports from `chatPipeline` | 5m | ~5 net deletion |
| A5 | Decide on Intelligence→Persistence direction: ADR-040 amendment OR service facade | 30m decision | (if facade: 4h refactor; if amendment: 30m) |

**Total fix-pass NOW: A1 + A3 + A4 = 1h 20m. A2 = 30m if banner-only; 2h if in-memory fallback. A5 is decision-only.**

---

## 9. Top 5 fix-during-P20 (architecture)

| # | Item | Time |
|---|---|---:|
| AP1 | Split `ListenTab.tsx` into `OrbAnimation` + `DemoSimulator` + `PttSurface` + `OrbSettings` | 4h |
| AP2 | Add foreign-key on `llm_logs.session_id` symmetric with `llm_calls` | 15m + migration 003 |
| AP3 | Replace `as unknown as MasterConfig` casts in `configStore.ts` with `parseMasterConfig(json)` Zod helper | 2h |
| AP4 | Add `.catch()` to `void useListenStore.getState().stopRecording().then(submitListenFinal)` chains | 10m |
| AP5 | Quarantine the chatPipeline `catch {}` swallow at line 163; route to `recordPipelineFailure` | 20m |

---

## 10. Defers (post-MVP, documented)

- Replace `@anthropic-ai/sdk` + `@google/genai` with raw fetch (~60 KB gzip saved, 4-6h cost)
- Split `configStore.ts` into config + themes + pages stores (8h)
- Introduce a real `LLMAuditService` interface and inject into adapters (DDD service layer) — prerequisite for any future Supabase/server backend
- Move STT into its own `capture` bounded context (today it lives under `intelligence/stt`); semantically STT is input-source not intelligence
- TDD-ify with vitest for `auditedComplete`, `chatPipeline`, `validatePatches`, `applyPatches`, `webSpeechAdapter` (mock-first London-school per CLAUDE.md). Playwright e2e is great but not what the rule says.
- Restructure `__configStore`/`__intelligenceStore`/`__listenStore`/`__projectStore` window globals into one `__hb` namespace — verify `import.meta.env.DEV` gating works correctly under `vite preview`
- Welcome.tsx (918 LOC) untouched since pre-P15 — pre-existing god-component, not P17-19's debt

---

## 11. Cross-reference

- See `02-functionality-findings.md` §"Error-kind UI mapping audit" — the FALLBACK_HINT duplication is the SAME issue from a UX angle.
- See `03-security-findings.md` §"Posture strengths" — the single-writer audit chokepoint is what makes architecture item #2 (Intelligence→Persistence direct imports) less alarming than it would otherwise be.
- See `00-summary.md` §3 (must-fix items 5 + 7 + 8 from this chunk).

---

## 12. Files referenced (all absolute)

- `/home/user/hey-bradley-core/src/contexts/intelligence/llm/claudeAdapter.ts`
- `/home/user/hey-bradley-core/src/contexts/intelligence/llm/geminiAdapter.ts`
- `/home/user/hey-bradley-core/src/contexts/intelligence/llm/openrouterAdapter.ts`
- `/home/user/hey-bradley-core/src/contexts/intelligence/llm/auditedComplete.ts`
- `/home/user/hey-bradley-core/src/contexts/intelligence/chatPipeline.ts`
- `/home/user/hey-bradley-core/src/contexts/persistence/db.ts`
- `/home/user/hey-bradley-core/src/contexts/persistence/migrations/index.ts`
- `/home/user/hey-bradley-core/src/contexts/persistence/migrations/002-llm-logs.sql`
- `/home/user/hey-bradley-core/src/contexts/persistence/repositories/llmLogs.ts`
- `/home/user/hey-bradley-core/src/store/configStore.ts`
- `/home/user/hey-bradley-core/src/store/intelligenceStore.ts`
- `/home/user/hey-bradley-core/src/store/listenStore.ts`
- `/home/user/hey-bradley-core/src/components/left-panel/ListenTab.tsx`
- `/home/user/hey-bradley-core/src/components/shell/ChatInput.tsx`
- `/home/user/hey-bradley-core/src/components/settings/LLMSettings.tsx`
- `/home/user/hey-bradley-core/src/main.tsx`
- `/home/user/hey-bradley-core/CLAUDE.md`
- `/home/user/hey-bradley-core/playwright.config.ts`

---

**Author:** R4 brutal review consolidation
**Cross-link:** `00-summary.md` §3 (must-fix-now items 5 + 7 + 8)
**Next file:** `05-fix-pass-plan.md`
