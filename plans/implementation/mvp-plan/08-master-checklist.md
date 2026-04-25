# Master Checklist — MVP Implementation Plan

> Single source of truth. Tick items as they land. When all green, MVP is shipped.
> Format: each phase has DoD + ADRs + tests. Roll-up totals at the end.

---

## Phase 15 — Polish + Kitchen Sink + Blog + Novice Simplification

### Deliverables
- [ ] `src/data/examples/kitchen-sink.json` exists with every section type and variant
- [ ] `src/data/examples/blog-standard.json` exists (nav + blog with 3 posts + footer)
- [ ] Examples registered in `src/data/examples/index.ts`
- [ ] Onboarding shows 4 starter cards by default; "More examples" toggle reveals the rest
- [ ] `src/lib/draftRename.ts` exists with the rename + hide dictionaries
- [ ] DraftPanel applies the dictionary in DRAFT mode
- [ ] EXPERT mode unchanged
- [ ] Stage-1 backlog (S1-01..S1-29) has zero "TODO" items remaining (all → DONE or → `deferred-features.md`)

### ADRs
- [ ] `docs/adr/ADR-038-kitchen-sink-example.md` merged
- [ ] `docs/adr/ADR-039-standard-blog-page.md` merged

### Tests / Verification
- [ ] Playwright: load Kitchen Sink → assert each section type ID in DOM
- [ ] Playwright: load Blog → assert 3 post titles render
- [ ] No console errors when cycling through all 4 starter cards (run on `vite preview`)
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` green
- [ ] Test count ≥ 102

### Personas (gate)
- [ ] Grandma (DRAFT) ≥ 70
- [ ] Framer (EXPERT) ≥ 78
- [ ] Capstone Reviewer ≥ 82

---

## Phase 16 — Local Database (sql.js + IndexedDB)

### Deliverables
- [ ] `src/contexts/persistence/db.ts` (sql.js bootstrap)
- [ ] `src/contexts/persistence/migrations/000-init.sql` matches §3.4 of the phase doc
- [ ] `src/contexts/persistence/migrations/index.ts` runner with `schema_version` row
- [ ] Repositories: `projects`, `sessions`, `messages`, `llmCalls`, `kv`
- [ ] `src/contexts/persistence/exportImport.ts` produces/consumes `.heybradley` zip
- [ ] `projectStore` swapped to DB adapter; UI unchanged
- [ ] Auto-save debounced (800 ms)
- [ ] Last-project restored on reload
- [ ] One-time legacy `localStorage` migration runs and clears legacy keys
- [ ] Settings: "Clear local data" button (with confirm)
- [ ] Bundle size delta ≤ 800 KB gzip; sql.js wasm code-split

### ADRs
- [ ] `docs/adr/ADR-040-local-sqlite-persistence.md` merged
- [ ] `docs/adr/ADR-041-schema-versioning.md` merged

### Tests
- [ ] `tests/persistence.spec.ts` Playwright: write → reload → assert restored
- [ ] Round-trip export/import preserves chat history
- [ ] `npx tsc --noEmit` clean
- [ ] Build succeeds; bundle inspected
- [ ] Test count ≥ Phase 15 + 2

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
