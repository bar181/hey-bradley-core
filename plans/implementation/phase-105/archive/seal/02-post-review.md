# P105 / RC-BLOCKERS-CLOSURE — Post-Review

> **Phase:** P105 · **Sprint:** RC-BLOCKERS-CLOSURE · **Sealed:** 2026-05-04
> **Predecessor:** P104 / SCHEMA-GUARDS at `47cbfe4` (~1335+ tests; 81 GREEN at anchor)
> **Audit basis:** `plans/strategic-reviews/2026-05-04-gaps-to-done/` (5 chunks · 73 items · 19 P1 / 35 P2 / 23 P3)
> **Wave 1 commit:** `b1235f5`

## Sprint summary

P105 closes the **top-priority RC-blockers** surfaced by the brutal-honest deep-dive audit:

1. Front-door route 404 (every Welcome CTA hit `/onboarding`; route registered as `/new-project`)
2. Persistence gap (writeLogEvent never called `persist()` — logs evaporated on tab close)
3. Pipeline bypass of `cleanTranscript` (called for logging only; classifier saw raw transcript)
4. P104 closure-claim regression (`validateSectionType` had 0 production callers)
5. AppShell dead Planning/Agentics branches (those routes mount their pages directly per ADR-116 D3)

Two waves: 4 disjoint-scope parallel agents (A1-A4) + 1 closer (A5).

## Per-agent deltas

### A1 — Welcome routes + AppShell cleanup (Track E E1+E2)
- `src/pages/Welcome.tsx`: 5× `/onboarding` → `/new-project` (1:1 string replace; LOC delta 0)
- `src/components/shell/AppShell.tsx`: 113 → 67 LOC (−46; deleted dead Planning/Agentics branches per ADR-116 D3); only Whiteboard/Builder branch remains; testid `appshell-mode-whiteboard` lifted to root

**Impact:** front-door CTAs no longer 404. AppShell single-source-of-truth honored.

### A2 — Log persistence flush (Track C2)
- `src/contexts/persistence/repositories/comprehensiveLogs.ts`: +50 LOC
  - 500ms debounced `scheduleFlush()` shared by `writeLogEvent` + `writeEditHistory`
  - NEW exported `flushLogsImmediate(): Promise<void>` for forced-flush callers
  - Fire-and-forget contract preserved (writes still return synchronously; `persist().catch()` swallows)
- `src/contexts/persistence/db.ts`: +14 LOC (pagehide listener registered once in `initDB`)

**Impact:** zero-patch submits (canned fallback / error path / listen reject) now persist their logs. Closes "logs evaporate on tab close" honest-gap from P100 W2 audit.

### A3 — cleanTranscript pipeline wire (Tracks B7 + D1)
- `src/contexts/intelligence/chatPipeline.ts`: +31/−12 LOC
  - `effectiveText = opts.source === 'listen' ? cleanTranscript(text) : text` at submit-entry
  - 14 consumer replacements: `classifyIntent`, `llmClassifyIntent`, `isUnmeasurableGoal`, `hasContradiction`, `classifyRoute`, `decompose`, `matchTemplates`, `translateIntent`, `deriveImprovements` (×2), `runCanned` (×3), `runLLMPipeline`
  - Raw `text` preserved for `input_event` / `listen_capture` log + 4× `edit_history` writes

**Impact:** ADR-127 declared cleanTranscript "wired"; was wired only for logs. Classifier + matcher + decomposer now see disfluency-stripped transcript when `source === 'listen'`. Chat-mode byte-equivalent preserved.

### A4 — validateSectionType production wire (Tracks A6 + B1)
- `src/data/examples/index.ts`: +24 LOC
  - Dev-only audit pass at module init (`if (typeof console !== 'undefined' && import.meta.env.DEV)`)
  - Iterates `cfg.sections ?? []` + each `page.sections ?? []` (multi-page per ADR-035)
  - 2 production call sites of `validateSectionType` outside its declaration file (was 0 pre-P105 — closes A6+B1 convergence; honest P104 closure)

**Impact:** P104 closure was optimistic — helper had 0 production importers. Now active observational guard at JSON-load time; Zod `sectionTypeSchema` remains strict source of truth for canonical configs.

### A5 — Closer (this commit)
- `tests/p105-rc-blockers.spec.ts` (NEW; 7 describe blocks / 17 cases)
- EOP triplet (this file + session-log + retrospective)
- `CLAUDE.md` sync

## Carry-forward closures (4 items)

| ID | Audit chunk | Item | Status |
|----|-------------|------|--------|
| **A6+B1** | features-functionality / closure-claim | `validateSectionType` production wire | **CLOSED** (A4) |
| **B7+D1** | data-pipeline / log-coverage | `cleanTranscript` pre-classify wire | **CLOSED** (A3) |
| **C2** | persistence | `writeLogEvent` → `persist()` flush | **CLOSED** (A2) |
| **E1+E2** | ux-routes / shell-arch | Welcome route 404 + AppShell dead branches | **CLOSED** (A1) |

## Honest gaps remaining (deferred)

Per P105 preflight priority list (post-P105 roadmap):

| Order | Phase | Focus | LOC | Items | Why this order |
|-------|-------|-------|-----|-------|----------------|
| 1 | P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX | twoStepPipeline 245-LOC orphan; atom→view dependency inversion (4 files); `ASSUMPTIONS_FALLBACK_TEMPLATES` wire; PATCH_ATOM section-enum drift | ~310 | 8 | Architectural debt grows with every feature |
| 2 | P107 / LOG-INTEGRITY-EXPANSION | 5 declared-but-unwired event_types (multi_page_scope / error_event / todo_execution / decomp_split / export_emit); centralized error-event capture | ~200 | 5 | Builds on P105/A2 persist; full forensic before BYOK smoke |
| 3 | P108 / TEST-RUNTIME-SHIFT | Empty `p76-spec-export-quality.spec.ts`; mobile viewport projects; behavioral coverage for cleanTranscript / validateEventType / validateSectionType | ~400 | 10 | Trustworthy seal gate before owner click-through |
| 4 | P109 / ADR-LEDGER-TRUTH-UP | `docs/adr/README.md` rebuild (claims 38; disk 125); section-type 3-way drift (schema/PATCH_ATOM/intentAtom) | ~150 | 4 | Final cleanup before owner-required tasks |

After P109, the open-core is owner-runnable — only the 5 owner-attestation items remain (BYOK smoke / STT calibration / demo video / launch posts / Lighthouse).

## Acceptance gate verification

- [x] 4 P1 blockers closed (A1 routes + A2 persist + A3 cleanTranscript wire + A4 validateSectionType wire)
- [x] ≥15 P105 tests GREEN (17 cases / 7 describes)
- [x] Cumulative regression ≥96 GREEN (P101 25 + P102 22 + P-E2E-2 22 + P104 12 + P105 17 = 98)
- [x] Both tsc strict configs clean
- [x] EOP triplet at `plans/implementation/phase-105/seal/`
- [x] CLAUDE.md sync — P105 + 4 carry-forward closures
- [x] No new ADR (fix-pass closure sprint per P102 + P104 precedent)
- [x] No new deps
