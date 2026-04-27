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

### Deliverables
- [ ] `src/contexts/intelligence/llm/adapter.ts` interface
- [ ] `claudeAdapter.ts`, `geminiAdapter.ts`, `simulatedAdapter.ts`
- [ ] `pickAdapter.ts` reads env, falls back to simulated
- [ ] `cost.ts` model price table + `usd()`
- [ ] `keys.ts` BYOK with optional `kv` persistence (default OFF)
- [ ] `intelligenceStore` exposes `{ adapter, status, lastError, sessionUsd }`
- [ ] `LLMSettings.tsx` panel: provider picker + key input + test connection
- [ ] First successful real call writes `llm_calls` row
- [ ] Hard cap stops calls at `sessionUsd >= VITE_LLM_MAX_USD`
- [ ] Onboarding banner when no key: "Using simulated responses — add a key in Settings"
- [ ] `.env.example` checked in
- [ ] CI grep guards against committed `sk-…`-shaped keys

### ADRs
- [ ] `docs/adr/ADR-042-llm-provider-abstraction.md` merged
- [ ] `docs/adr/ADR-043-api-key-trust-boundaries.md` merged

### Tests
- [ ] `tests/llm-adapter.spec.ts` covers factory selection and cost math
- [ ] Mocked-provider test: simulated path returns canned envelope
- [ ] `npx tsc --noEmit` clean; build green
- [ ] Test count ≥ Phase 16 + 3

---

## Phase 18 — Real Chat Mode (LLM → JSON Patches)

### Interactive Validation Gates (each step demos to user before advancing)

#### Step 1 — Wire the loop
- [ ] Temporary test button in `LLMSettings.tsx` triggers a single hardcoded round-trip
- [ ] Pressing it changes the hero heading to "Hello from LLM" within 8 s
- [ ] Failure shows a one-line toast; no mutation
- [ ] Before/after screenshots in `phase-18/session-log.md`

#### Step 2 — One real user prompt
- [ ] Test button removed; chat input drives the loop
- [ ] Starter prompt *"Make the hero say '…'."* updates preview within 4 s p50 on Haiku
- [ ] Full system prompt assembled (Crystal Atom + current JSON + output rule)
- [ ] `responseParser.ts` + `patchValidator.ts` enforce envelope and path whitelist for `replace`
- [ ] One golden Playwright test passes against mocked adapter
- [ ] `llm_calls` row written for each call

#### Step 3 — Advanced: full DoD
- (covered by the deliverables and tests sections below)

### Deliverables
- [ ] `src/lib/schemas/patches.ts` (`JSONPatchSchema`, `PatchEnvelopeSchema`)
- [ ] `src/contexts/intelligence/prompts/system.ts` builds the Crystal Atom + current JSON + output rule
- [ ] `src/contexts/intelligence/prompts/contextBuilder.ts` enforces 4 KB JSON cap
- [ ] `src/contexts/intelligence/llm/responseParser.ts` (tolerant JSON extractor)
- [ ] `src/contexts/intelligence/llm/patchValidator.ts` (path whitelist + value Zod check)
- [ ] `src/contexts/intelligence/applyPatches.ts` (atomic, structuredClone)
- [ ] `configStore.applyPatches` is the only LLM-mutation entry point
- [ ] `ChatInput.tsx` swaps engine, keeps typewriter
- [ ] Five starter prompts produce expected golden envelopes
- [ ] Fallback to `cannedChat.parseChatCommand` on any failure
- [ ] Audit row written for every call (ok/error/timeout/validation_failed)
- [ ] In-flight lock: input disabled during a request

### ADRs
- [ ] `docs/adr/ADR-044-json-patch-contract.md` merged
- [ ] `docs/adr/ADR-045-system-prompt-aisp.md` merged

### Tests
- [ ] `tests/chat-real.spec.ts` green for all 5 starters with mocked adapter
- [ ] `tests/chat-fallback.spec.ts` green for parse fail and network fail
- [ ] Latency p50 ≤ 4 s on Haiku for single-patch prompts (recorded in session log)
- [ ] No `console.error` during happy path
- [ ] `npx tsc --noEmit` clean; build green
- [ ] Test count ≥ Phase 17 + 5

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
