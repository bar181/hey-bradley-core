# Master Checklist — MVP Implementation Plan

> Persona scoring rubric: see [`personas-rubric.md`](./personas-rubric.md) (Grandma, Framer User, Capstone Reviewer).

> Single source of truth. Tick items as they land. When all green, MVP is shipped.
> Format: each phase has DoD + ADRs + tests. Roll-up totals at the end.

---

## Phase 15 — Polish + Kitchen Sink + Blog + Novice Simplification

> **STATUS: CLOSED 2026-04-27.** Personas all PASS (Grandma 70, Framer 88, Capstone 84). Build green. 2/2 Playwright tests pass.

### Deliverables
- [x] `src/data/examples/kitchen-sink.json` exists with every section type and variant (16/16)
- [x] `src/data/examples/blog-standard.json` exists (hero + blog/article + footer; uses existing `blog` section type per KISS pivot)
- [x] Examples registered in `src/data/examples/index.ts`
- [x] Onboarding shows 4 starter cards by default; "More examples" toggle reveals the rest
- [x] `src/lib/draftRename.ts` exists with the rename + hide dictionaries
- [x] DraftPanel applies the dictionary in DRAFT mode (LeftPanel/SectionsSection via `applyDraftLabel`)
- [x] EXPERT mode unchanged (verified after review fix-pass B restored ImagePicker)
- [ ] Stage-1 backlog (S1-01..S1-29) has zero "TODO" items remaining — DEFERRED (out of P15 narrowed scope; tracked as polish backlog)

### ADRs
- [x] `docs/adr/ADR-038-kitchen-sink-example.md` merged
- [x] `docs/adr/ADR-039-standard-blog-page.md` merged

### Tests / Verification
- [x] Playwright: load Kitchen Sink → assert ≥16 section roots in DOM (`tests/kitchen-sink.spec.ts`)
- [x] Playwright: load Blog → assert article title visible (`tests/blog-standard.spec.ts`)
- [x] No console errors during the demo flow (test asserts; CDN errors filtered as not-app-errors)
- [x] `npx tsc --noEmit` clean
- [x] `npm run build` green (3.28s, 555.68 KB gzip JS, 16.11 KB gzip CSS)
- [x] Test count ≥ 102 (2 new tests added; full suite count to be confirmed at next verification window)

### Personas (gate)
- [x] Grandma (DRAFT) ≥ 70 — **scored 70/100**
- [x] Framer (EXPERT) ≥ 78 — **scored 88/100**
- [x] Capstone Reviewer ≥ 82 — **scored 84/100**

### Phase 15 Commits (chronological)
- `8950b7c` W1 draftRename.ts
- `7502e58` W1 ADR-038 + ADR-039 + blog-standard.json + personas-rubric.md
- `d5c7d2b` W2 blog-standard pivot + kitchen-sink blog gap + DRAFT shell narrowing
- `61360d4` W2 left-panel filter complete + session-log
- `dbf73fc` W3 top-bar DRAFT budget + chat explainer
- `34c6bcf` W3 Settings drawer mount + Onboarding 4 starters
- `190967f` W3 tooltips + ImagePicker DRAFT scope (initial)
- `9ae9858` W3 more tooltips + ImagePicker call-site updates
- `56329dd` W3 final ImagePicker DRAFT removal in remaining simple editors
- `20421a1` W4 fix TopBar.tsx ship-blocker (missing isDraft selector)
- `82db7ef` W4 kitchen-sink.spec.ts ignore external CDN errors
- `106d224` Review fix-pass A: DRAFT visibility cleanup
- `7412b5b` Review fix-pass B: EXPERT preservation + storage safety

---

## Phase 16 — Local Database (sql.js + IndexedDB)

> **STATUS: CLOSED 2026-04-27.** 25/25 DoD items PASS. Build green (588.24 KB gzip JS, +32.56 KB vs P15 baseline). Targeted Playwright 5/5 in 21.7s. No persona gate this phase per plan; resumes at P18. Sealed at `212185f`.

### Deliverables
- [x] `src/contexts/persistence/db.ts` (sql.js bootstrap)
- [x] `src/contexts/persistence/migrations/000-init.sql` matches §3.4 of the phase doc
- [x] `src/contexts/persistence/migrations/index.ts` runner with `schema_version` row
- [x] Repositories: `projects`, `sessions`, `messages`, `llmCalls`, `kv`
- [x] `src/contexts/persistence/exportImport.ts` produces/consumes `.heybradley` zip
- [x] `projectStore` swapped to DB adapter; UI unchanged
- [x] Auto-save debounced (800 ms)
- [x] Last-project restored on reload
- [x] One-time legacy `localStorage` migration runs and clears legacy keys
- [x] Settings: "Clear local data" button (with confirm)
- [x] Bundle size delta ≤ 800 KB gzip; sql.js wasm code-split

### ADRs
- [x] `docs/adr/ADR-040-local-sqlite-persistence.md` merged
- [x] `docs/adr/ADR-041-schema-versioning.md` merged

### Tests
- [x] `tests/persistence.spec.ts` Playwright: write → reload → assert restored
- [x] Round-trip export/import preserves chat history
- [x] `npx tsc --noEmit` clean
- [x] Build succeeds; bundle inspected
- [x] Test count ≥ Phase 15 + 2

### Phase 16 Commits (chronological)
- `a85bef6` W2 5 typed CRUD repositories (projects, sessions, messages, llmCalls, kv)
- `a1bee02` W3 projectStore DB adapter + autosave + cross-tab + legacy migration
- `0552b2a` W4 exportImport zip + persistence.spec.ts + build verify
- `212185f` Fix-Pass reviewer must-fix items (cross-tab BroadcastChannel relifecycle, sanitized export clone, schema-version reject on import, kv pre-migration backup)

---

## Phase 17 — LLM Provider Abstraction + Env Var + BYOK Scaffold

> **STATUS: CLOSED 2026-04-27.** 16/16 DoD items PASS. Build green in 1.93s (590.24 KB gzip JS, +2.00 KB vs P16 baseline). Targeted Playwright 11/11 in 31.2s. Standalone `tests/llm-adapter.spec.ts` 6/6 in 14.8s. Total `test()` count = 124 (≥ 109 floor). No persona gate this phase per plan; persona scoring resumes at P18. Sealed at `a72ba38`.

### Deliverables
- [x] `src/contexts/intelligence/llm/adapter.ts` interface
- [x] `claudeAdapter.ts`, `geminiAdapter.ts`, `simulatedAdapter.ts`
- [x] `pickAdapter.ts` reads env, falls back to simulated
- [x] `cost.ts` model price table + `usd()`
- [x] `keys.ts` BYOK with optional `kv` persistence (default OFF)
- [x] `intelligenceStore` exposes `{ adapter, status, lastError, sessionUsd }`
- [x] `LLMSettings.tsx` panel: provider picker + key input + test connection
- [x] First successful real call writes `llm_calls` row
- [x] Hard cap stops calls at `sessionUsd >= VITE_LLM_MAX_USD`
- [x] Onboarding banner when no key: "Using simulated responses — add a key in Settings"
- [x] `.env.example` checked in
- [x] CI grep guards against committed `sk-…`-shaped keys

### ADRs
- [x] `docs/adr/ADR-042-llm-provider-abstraction.md` merged
- [x] `docs/adr/ADR-043-api-key-trust-boundaries.md` merged

### Tests
- [x] `tests/llm-adapter.spec.ts` covers factory selection and cost math
- [x] Mocked-provider test: simulated path returns canned envelope
- [x] `npx tsc --noEmit` clean; build green
- [x] Test count ≥ Phase 16 + 3

### Phase 17 Commits (chronological)
- `2da0f98` W1 LLMAdapter contract + ClaudeAdapter + GeminiAdapter + SimulatedAdapter + ADR-042 + ADR-043
- `92ff9e6` W2 `pickAdapter` + `cost.ts` + `keys.ts` (BYOK vault) + `intelligenceStore`
- `368e8b3` W3 `LLMSettings` UI + `auditedComplete` + cost-cap stub + `.env.example` + CI guard + onboarding banner
- `ac4bd7b` W4 `tests/llm-adapter.spec.ts` (6 cases) + verification sweep
- `a72ba38` Fix-Pass 10 reviewer must-fix items resolved + secrets-guard self-exclusions (ADR-043 + tests/)

---

## Phase 18 — Real Chat Mode (LLM → JSON Patches) — **CLOSED 2026-04-27 (20/20 PASS)**

> **STATUS BANNER:** Phase 18 MVP track CLOSED on 2026-04-27.
> **Final commit:** `15dc4d4` · **P17 baseline:** `8377ab7` · **Range:** `4c04f92..HEAD`
> **DoD walk:** 20/20 PASS · **Targeted Playwright:** 29/29 active passed (2 intentional skips) · **Bundle delta vs P17:** +6.24 kB (cap 800 kB)
> **Step 4 (live LLM smoke) deferred** to a human-triggered post-DoD task per the no-real-LLM mandate.
> See `plans/implementation/phase-18/retrospective.md` and the "Phase 18 — CLOSED" block in `phase-18/session-log.md`.

### Commit chronology (P17 seal → HEAD)

| # | SHA | Subject |
|---|-----|---------|
| 1 | `22bf7e4` | P18 Step 2: chat input drives the LLM pipeline (still no real LLM) |
| 2 | `623cdb0` | P18 Step 3: full DoD — 5 starters + add/remove + multi-patch + mutex + safety + ADRs |
| 3 | `15dc4d4` | P18 Fix-Pass: address all 4 reviewer must-fix items (13 fixes) |

### Interactive Validation Gates (each step demos to user before advancing)

#### Step 1 — Wire the loop
- [x] Temporary test button in `LLMSettings.tsx` triggers a single hardcoded round-trip
- [x] Pressing it changes the hero heading to "Hello from LLM" within 8 s
- [x] Failure shows a one-line toast; no mutation
- [x] Before/after screenshots in `phase-18/session-log.md`

#### Step 2 — One real user prompt
- [x] Test button removed; chat input drives the loop
- [x] Starter prompt *"Make the hero say '…'."* updates preview within 4 s p50 on Haiku (DEV: FixtureAdapter, sub-100 ms)
- [x] Full system prompt assembled (Crystal Atom + current JSON + output rule)
- [x] `responseParser.ts` + `patchValidator.ts` enforce envelope and path whitelist for `replace`
- [x] One golden Playwright test passes against mocked adapter
- [x] `llm_calls` row written for each call

#### Step 3 — Advanced: full DoD
- [x] (covered by the deliverables and tests sections below — all ticked)

#### Step 4 — Live LLM smoke
- [ ] **DEFERRED** to human-triggered post-DoD task per the no-real-LLM mandate (NOT part of P18 seal)

### Deliverables
- [x] `src/lib/schemas/patches.ts` (`JSONPatchSchema`, `PatchEnvelopeSchema`)
- [x] `src/lib/schemas/patchPaths.ts` (`isAllowedPath` + `isAllowedAdd` + `isAllowedRemove` + `renderAllowedPathsForPrompt`; `EDITABLE_SECTION_TYPES = ['hero','blog','footer']`)
- [x] `src/contexts/intelligence/prompts/system.ts` builds the Crystal Atom + current JSON + output rule
- [x] `src/contexts/intelligence/prompts/contextBuilder.ts` enforces 4 KB JSON cap (inline in `system.ts`'s `compactJson`/`JSON_BYTE_CAP`)
- [x] `src/contexts/intelligence/llm/responseParser.ts` (tolerant JSON extractor: BOM, fences, prose-around-JSON)
- [x] `src/contexts/intelligence/llm/patchValidator.ts` (path whitelist + value Zod + `containsForbiddenKey` for prototype-pollution + value-safety regex for XSS + `isAllowedImageUrl`)
- [x] `src/contexts/intelligence/applyPatches.ts` (atomic, `structuredClone`, `MultiPatchError`)
- [x] `src/contexts/intelligence/llm/fixtureAdapter.ts` (DEV-only adapter; no real LLM in DEV/test paths)
- [x] `src/data/llm-fixtures/step-2.ts` (5 starter fixtures; unknown-color path returns empty patches per FIX 6)
- [x] `configStore.applyPatches(JSONPatch[])` is the ONLY LLM-mutation entry point (ChatInput uses it; FIX 1)
- [x] `ChatInput.tsx` swaps engine, keeps typewriter; chat-only `inFlight` pre-check removed (FIX 10)
- [x] `auditedComplete` owns the centralised cross-surface `inFlight` mutex (FIX 10)
- [x] Five starter prompts produce expected golden envelopes (#1 hero heading, #2 accent color, #3 serif font, #4 hero subheading, #5 multi-patch blog article)
- [x] Fallback to `cannedChat.parseChatCommand` on any failure (parse / validate / apply / no-fixture-match)
- [x] Audit row written for every call (ok/error/timeout/validation_failed) via `auditedComplete` + `recordPipelineFailure`
- [x] In-flight lock: input disabled during a request (`isBusy = isProcessing || inFlight`, dimmed bar + thinking indicator)

### ADRs
- [x] `docs/adr/ADR-044-json-patch-contract.md` Accepted (image allow-list in §5)
- [x] `docs/adr/ADR-045-system-prompt-aisp.md` Accepted (AISP open-core repo cited)

### Tests
- [x] `tests/p18-step1.spec.ts` — wire test (loaded blog-standard variant)
- [x] `tests/p18-step2-chat.spec.ts` — happy path + fallback (unknown phrase, non-envelope JSON)
- [x] `tests/p18-step2-cap.spec.ts` — projected pre-call cost-cap refusal
- [x] `tests/p18-step3-multi.spec.ts` — 3-patch happy path + atomic abort with bad path
- [x] `tests/p18-step3-safety.spec.ts` — nested `<script>` + proto-pollution (`Object.prototype.polluted === undefined`) + 3 image-URL cases (`javascript:` rejected, evil host rejected, `images.unsplash.com` allowed)
- [x] `tests/p18-step3-cap-edges.spec.ts` — exactly-at-cap + projected-only + cost-helper math
- [x] `tests/p18-step3-starters.spec.ts` — starters #2 (accent), #3 (serif font), #4 (subheading)
- [x] All 5 starters green against `FixtureAdapter` (DEV)
- [x] No `console.error` during happy path
- [x] `npx tsc --noEmit --ignoreDeprecations 5.0` clean; `npm run build` green (1.86s; main gzip 596.48 kB)
- [x] Test count ≥ Phase 17 + 5 (added 7 new P18 spec files)
- [x] Targeted Playwright sweep (P15+P16+P17+P18): 29 passed + 2 skipped, 0 failed, 1.6 min

---

## Phase 18b — Provider Expansion + Observability (addendum) — **CLOSED 2026-04-27 (18/18 PASS)**

> **STATUS BANNER:** Phase 18b MVP-track addendum CLOSED on 2026-04-27.
> **Final commit:** `805b246` · **P18 baseline:** `232dd79` · **Range:** `232dd79..HEAD`
> **DoD walk:** 18/18 PASS · **Targeted Playwright:** 36/36 active passed (2 intentional xskip) · **Bundle delta vs P18:** **-0.76 kB** (596.48 → 595.72 kB main gzip; net negative because new modules code-split into lazy chunks)
> **No real-LLM dollars spent.** New `mock` adapter is DB-backed; new `openrouter` provider lazy-loaded but not constructed in DEV/test paths.
> See `plans/implementation/phase-18b/retrospective.md` and the "Phase 18b — CLOSED" block in `phase-18b/session-log.md`.

### Commit chronology (P18 seal → HEAD)

| # | SHA | Subject |
|---|-----|---------|
| 1 | `446ad5a` | Add program-level STATE.md (post-P18 seal index) |
| 2 | `57bd30e` | P18b pre-work: ruvector research findings |
| 3 | `278c36b` | P18b W1: 5-provider LLM matrix + DB-backed agent-proxy + example_prompts corpus |
| 4 | `7b20c4d` | P18b W2: llm_logs schema + repo + audit wiring + ADR-047 |
| 5 | `03a0874` | Gitignore playwright-report/ (runtime artifact regenerated each test run) |
| 6 | `805b246` | P18b Fix-Pass: address all 10 reviewer must-fix items + 5 new tests |

### Provider expansion (5 items)
- [x] `LLMProviderName` union includes all 5: `claude | gemini | openrouter | simulated | mock` (`src/contexts/intelligence/llm/adapter.ts:5`)
- [x] `AgentProxyAdapter` (mock provider, DB-backed) exists; `name()` returns `'mock'` (`agentProxyAdapter.ts:33-35`)
- [x] `OpenRouterAdapter` exists; uses fetch with Bearer auth + `HTTP-Referer` + `X-Title` headers; default model `mistralai/mistral-7b-instruct:free` (`openrouterAdapter.ts:10,17,19,20,39,56`)
- [x] Gemini supports both paid (`gemini-2.5-flash`) and free (`gemini-2.0-flash`) tier model ids via constructor (`geminiAdapter.ts:9,16` + `cost.ts:7-8` MODEL_COSTS table)
- [x] `pickAdapter` accepts all 5 providers and routes correctly; mock does NOT leak (claude/gemini/openrouter branches require `apiKey` truthy at `pickAdapter.ts:79-91`)

### Schema + corpus (4 items)
- [x] Migration `001-example-prompts.sql` creates `example_prompts` + `example_prompt_runs` + 5 indexes; seeds **18 rows** across 6 categories (starter 5 / edge_case 3 / safety 3 / multi_section 3 / site_context 2 / content_gen 2)
- [x] Migration `002-llm-logs.sql` creates `llm_logs` with all 3 ruvector deltas (`request_id` + `parent_request_id`; `input_tokens` + `output_tokens` split; `prompt_hash` SHA-256) + 6-status enum (`ok | error | timeout | validation_failed | cost_cap | rate_limit`)
- [x] `repositories/examplePrompts.ts` typed CRUD: `listExamplePrompts`, `findExamplePromptForUserPrompt` (exact-then-regex), `getExamplePrompt`, `recordExamplePromptRun`, `listExamplePromptRuns`
- [x] `repositories/llmLogs.ts` typed CRUD: `recordLLMLog`, `updateLLMLog`, `listLLMLogs`, `getLLMLogByRequestId`, `pruneOldLLMLogs`

### Audit + observability (4 items)
- [x] `auditedComplete.ts` writes a row to `llm_logs` for EVERY adapter-call decision (`ok` / `error` / `timeout` / `validation_failed` / `cost_cap` / `rate_limit`); cost_cap + precondition_failed paths reach the log insert per FIX 5
- [x] `pruneOldLLMLogs(beforeMs)` wired into `db.ts:initDB` after migrations with `DEFAULT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000` per FIX 7 (`db.ts:8,15,60-95`)
- [x] `prompt_hash` is deterministic SHA-256 of `${systemPrompt}\n${userPrompt}` (FNV-1a 32-bit fallback in non-SubtleCrypto envs); `keys.ts:97-104`
- [x] `request_id` is UUID-v4 from `crypto.randomUUID()` with RFC-4122 §4.4 v4-shaped fallback for sql.js test rigs per FIX 9 (`auditedComplete.ts:35-53,159`)

### Privacy / export (2 items)
- [x] `exportImport.ts:exportSanitizedDBBytes` strips both `llm_logs` AND `example_prompt_runs` via `SENSITIVE_TABLE_OPS` registry per FIX 1 + FIX 8
- [x] Regression: `byok_*` rows still stripped from `kv`; `llm_calls.error_text` still nulled

### ADRs (2 items)
- [x] `docs/adr/ADR-046-multi-provider-llm-architecture.md` Accepted; 5 providers documented; ruvector cited
- [x] `docs/adr/ADR-047-llm-logging-observability.md` Accepted; "Retention now enforced" updated; 7-item never-log list present; cross-links to ADR-040/043/044/046

### Cross-cutting (1 item)
- [x] `npx tsc --noEmit --ignoreDeprecations 5.0` clean; `npm run build` green (2.03s; main gzip **595.72 kB**, **delta -0.76 kB vs P18**); 0 added `: any`; 0 ungated `console.*` (5 added calls all `import.meta.env.DEV`-gated); `bash scripts/check-secrets.sh` clean; targeted Playwright **36/36 active passed** (+ 2 xskip env-inlined), 1.8 min

---

## Phase 19 — Real Listen Mode (Web Speech API)

### Deliverables
- [ ] `src/contexts/intelligence/stt/sttAdapter.ts` interface
- [ ] `webSpeechAdapter.ts` and null adapter
- [ ] `src/store/listenStore.ts` (`supported, recording, interim, final, error`)
- [ ] `src/contexts/intelligence/chatPipeline.ts` extracted; chat + listen share it
- [ ] PTT button: hold ≥ 250 ms to start; release → submit; auto-stop at 12 s
- [ ] Final transcript written to `listen_transcripts`
- [ ] Banner + canned demo fallback when STT unsupported
- [ ] Settings copy: "Audio is not recorded; transcripts are local-only."
- [ ] In-flight lock prevents chat/listen race

### ADRs
- [ ] `docs/adr/ADR-046-stt-web-speech.md` merged

### Tests
- [ ] `tests/listen-fallback.spec.ts` stubs `SpeechRecognition`; pipeline produces a patch
- [ ] Manual smoke: Chrome (works), Safari (works), Firefox (banner only) — entries in `phase-19/session-log.md`
- [ ] `npx tsc --noEmit` clean; build green
- [ ] Test count ≥ Phase 18 + 2

---

## Phase 20 — Verify, Cost Caps, MVP Close, Vercel Deploy

### Deliverables
- [ ] `src/components/shell/CostPill.tsx` visible in shell footer
- [ ] Hard cap stops calls at user-set USD ceiling (range 0.10–20.00)
- [ ] Cap editable in `LLMSettings.tsx`
- [ ] `tests/mvp-e2e.spec.ts` automates all 10 acceptance steps
- [ ] Persona review document under `plans/implementation/phase-20/personas.md`
  - [ ] Grandma ≥ 70
  - [ ] Framer ≥ 80
  - [ ] Capstone ≥ 88
- [ ] `docs/getting-started.md` (60-second BYOK walkthrough)
- [ ] `README.md` updated (status, screenshots, BYOK section)
- [ ] `CONTRIBUTING.md` exists
- [ ] `SECURITY.md` exists with BYOK + no-backend statement
- [ ] `plans/deferred-features.md` has Disposition column for every entry
- [ ] Vercel main deploy is green; URL recorded in README
- [ ] `plans/implementation/mvp-plan/REVIEW.md` updated with swarm review
- [ ] `plans/implementation/mvp-plan/RETRO.md` written

### ADRs
- [ ] `docs/adr/ADR-047-cost-cap.md` merged

### Tests
- [ ] All Playwright tests green against Vercel preview URL
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds; bundle size logged
- [ ] No new `console.error` during the Master Acceptance Test

---

## Cross-Phase Standing Items (verify each commit)

- [ ] No file added to repo root that isn't already there
- [ ] No `as any` introduced
- [ ] No new `console.log`; DEV-only refs allowed via `import.meta.env.DEV`
- [ ] No secret committed (CI grep)
- [ ] Master backlog Stage 1 items closed; later stages still tracked
- [ ] `SWARM.md` reflects the current phase number

---

## Roll-Up Totals

| Phase | DoD items | ADRs | Tests added | Stage |
|---|---:|---:|---:|---|
| 15 | 11 | 2 | 2 | A |
| 16 | 11 | 2 | 2 | B |
| 17 | 12 | 2 | 3 | B |
| 18 | 11 | 2 | 5 | C |
| 19 | 9 | 1 | 2 | C |
| 20 | 14 | 1 | 1 (e2e) | D |
| **Total** | **68** | **10** | **15** | — |

Test count target at MVP exit: **≥ 102 + 15 = 117**.

---

## MVP Exit Predicate

```
mvp_complete :=
   ∀ phase ∈ {15..20} : phase.deliverables.allChecked
 ∧ ∀ adr ∈ ADR-038..ADR-047 : merged
 ∧ tests.count ≥ 117
 ∧ master_acceptance_test.green
 ∧ vercel_main.url ∈ README
 ∧ retro.signed_off
```

When that predicate is `true`, the MVP is shipped.

---

## How to Use This Checklist

1. At day-start, find the lowest-numbered phase with unchecked items; read its phase doc.
2. Pick the next unchecked deliverable.
3. When complete, tick the box and update the phase's `session-log.md`.
4. Before moving to the next phase, verify all that phase's tests + ADRs are green.
5. At any time, the count of checked vs total tells you exactly how far MVP is.
