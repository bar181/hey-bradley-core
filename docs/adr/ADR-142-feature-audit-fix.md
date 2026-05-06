# ADR-142 — Feature Audit + Fix (Persistence Wire + Cost Cap + Image Picker + UX Truth-Up)

- **Status:** Accepted
- **Date:** 2026-05-06
- **Phase:** P114 / FEATURE-AUDIT + FIX
- **Cross-refs (primary):** ADR-016 (sql.js + IndexedDB persistence — the saveProject UI wire closes the dead-code state), ADR-040 (cost cap discipline — MODEL_COSTS now matches adapter COST_PER_M; UNKNOWN_MODEL_FALLBACK closes the gpt-5-nano "uncapped" gap), ADR-043 (BYOK trust boundary — preserved; encrypted-at-rest remains Tier-2 carry-forward), ADR-100 (Section Type Completeness — ResourcesTab now lists canonical 18), ADR-126 (Comprehensive LLM Interaction Logging — preset-match emits via the same writeLogEvent path), ADR-127 (cleanTranscript / voice extraction — chat-pipeline storytelling-preset wire is the next step in the same flow), ADR-141 (Storytelling Preset Library — 8 presets now have ≥1 production importer)

## Context

The P114 sprint ran a 2-wave audit→fix loop. Wave 1 dispatched 4 parallel disjoint-scope research agents (A1 persistence + slug + recall / A2 image + content + specs / A3 BYOK + LLM + pipeline / A4 quality UX) producing 47 findings across the major feature surfaces. Wave 2 dispatched 4 parallel fix agents closing the 10 highest-priority gaps in ~197 LOC.

The load-bearing audit finding: **`saveProject()` had zero UI callers.** New users who completed Onboarding never hit the projects table — their work persisted only to legacy localStorage. The recent-projects surface on Welcome was missing, slug-based URL recall did not exist, and `markSaved()` was a dead function with no integration in autosave's flush path. Combined, this meant Hey Bradley *appeared* to have multi-project persistence but in practice was single-project-localStorage.

Two adjacent gaps surfaced at the same time: the cost cap was non-functional for OpenAI (`gpt-5-nano` missing from MODEL_COSTS → `isKnownModel()` returned false → projected cost = $0 → cap check always passed), and the image picker was hidden on 5 simple section editors (gated behind `!isDraft` so first-time users never saw the picker).

## Decisions

### Decision 1 — Persistence load-bearing wire (closes A1 G1+G3+G4+G7)

`src/pages/Onboarding.tsx` now calls `saveProject(name, config)` from each of the 3 entry handlers (`handleThemeSelect` / `handleExampleSelect` / `handleStartNew`) so projects land in the `projects` SQLite table at first sketch. `src/pages/Builder.tsx` reads `?project=<slug>` from `useSearchParams` and calls `loadProject(slug)` on mount — slug-based deep-link recall now works. `src/pages/Welcome.tsx` renders a `welcome-recent-projects` card showing the 5 most-recently-saved projects (hidden when empty); each card links to `/builder?project=<slug>`. `src/contexts/persistence/autosave.ts` calls `useConfigStore.getState().markSaved()` inside the flush try-block so the savedAt timestamp advances on every successful flush.

`saveProject()` callers: 0 → 3 (Onboarding's three entry paths). `markSaved()` callers: 0 → 1 (autosave flush). Backward-compat preserved — existing localStorage-only projects continue to load via the legacy path; the SQLite path is additive.

### Decision 2 — Cost cap correctness (closes A3 P1)

`src/contexts/intelligence/llm/cost.ts` `MODEL_COSTS` now matches the adapter `COST_PER_M` constants used at the site of the actual call: `claude-haiku-4-5-20251001` `{in:1.0, out:5.0}` (4× correction), `gemini-2.5-flash` `{in:0.30, out:2.50}` (4-8× correction across both rates), `gpt-5-nano` `{in:0.05, out:0.40}` added (was missing entirely). New `UNKNOWN_MODEL_FALLBACK = {in:1.0, out:5.0}` ensures any future model that ships in an adapter without a corresponding MODEL_COSTS entry gets a conservative upper-bound rate instead of $0 — the cap can no longer be silently bypassed by adding a new model.

Adapter constants remain the single source of truth for the actual recorded `cost_usd`; `cost.ts` is the projected-cost view used by the pre-call cap check in `auditedComplete.ts`. The two are now in sync. Live-LLM verification ($0.01 cap fires on `gpt-5-nano` when projected hits $0.045) remains CF#4 owner-required.

### Decision 3 — Image selector + storytelling preset wire (closes A2 G1+G6)

Five simple section editors (`BlogSectionSimple` / `GallerySectionSimple` / `ImageSectionSimple` / `LogosSectionSimple` / `TeamSectionSimple`) had their `!isDraft && <ImagePicker />` gates replaced with `<ImagePicker pickerMode={isDraft ? 'library-only' : 'full'} />` so novice-mode users see the picker on first edit (library-only mode disables uploads but exposes the 300-image catalog). EXPERT mode retains the full picker.

`src/contexts/intelligence/chatPipeline.ts` calls `getPresetForVoice([...voice.voiceAttributes])` after `extractVoice()` succeeds; on a match, the pipeline emits a JSON-Patch `replace /site/storytellingPreset` and a `response_summary` log event with `kind: 'preset-match'`. `src/lib/schemas/masterConfig.ts` adds an optional `storytellingPreset: z.string().optional()` field on `siteSchema` to receive the patch. The 8 P113 storytelling presets now have ≥1 production importer (was 0).

### Decision 4 — UX truth-up trio (closes A4 F1+F2+F3)

Welcome stats refreshed to the P113 anchor — `~1582+` tests / `132` ADRs / `56` examples (was `~1491+ / 128 / 51`). The "Building in public" copy block updates the phase range to P11–P113 and the test count match. The AISP teaser line in the hero adds `PROCESS → DDD → AGENT` to surface the full 8-atom suite (was 6 atoms shown). `ResourcesTab.tsx` `SECTION_TYPES` extends from 15 to 18 entries adding `blog` / `case-study` / `contact-form` to match the canonical 18 declared by ADR-100.

### Decision 5 — Carry-forward registry (P2/P3 deferrals; honest)

The audit→fix loop intentionally did not close every finding. The following are documented and tracked:

- **A1 G2** — pagehide BFCache fallback for mobile Safari (sql.js flush race on tab close).
- **A1 G5** — 2-tab race protection (concurrent writers to the same `projects` row).
- **A1 G6** — BYOK Remember encryption (Tier-2 per ADR-043 — WebCrypto-wrapped `kv` row).
- **A1 G8** — orphan project growth handling (no GC of stale slugs).
- **A2 G2/G3** — spec-generator parallel-stack reconciliation (north-star / SADD / impl-plan emitters duplicate output paths).
- **A3 P2** — BYOK plaintext in `llm_logs.system_prompt` / `user_prompt` (export strip protects boundary; in-DB forensics see plaintext).
- **A3 P2** — voice extraction logging coverage gap.
- **A4** — ChatInput hook extraction (CF#10) / WorkflowTab live-wire / mobile STT real-device calibration (CF#5).

## Consequences

- **Closeable / closed:** D1 + D2 + D3 + D4 close 10 P1 findings (~197 LOC) in one parallel pass without new dependencies.
- **Backward-compat preserved:** Existing localStorage-only projects continue to load; cost cap behavior unchanged for already-known models; image picker fallback to library-only mode in SIMPLE preserves the no-upload contract; AISP teaser additive only.
- **Honest carry-forward:** 37 P2/P3 items intentionally deferred to P115+ per Decision 5; BYOK encryption + live-LLM cap verification remain owner-required Tier-2 / post-RC.

## Acceptance Gates

1. ADR-142 ≤120 LOC; Status: Accepted.
2. `saveProject()` callers ≥3 in `src/pages/Onboarding.tsx` (was 0).
3. `markSaved()` callers ≥1 in `src/contexts/persistence/autosave.ts` (was 0).
4. `Builder.tsx` reads `?project=<slug>` and calls `loadProject(`.
5. `Welcome.tsx` has `data-testid="welcome-recent-projects"`.
6. 5 simple editors no longer have `!isDraft.*null` ImagePicker gate.
7. `chatPipeline.ts` imports `getPresetForVoice` (8 presets now have ≥1 prod importer).
8. `masterConfig.ts` `siteSchema` has optional `storytellingPreset` field.
9. `cost.ts` `MODEL_COSTS` includes `gpt-5-nano` AND exports `UNKNOWN_MODEL_FALLBACK`.
10. `cost.ts` Claude rate matches adapter (`in: 1.0`, `out: 5.0`).
11. Welcome stats current to P113 (`1582|132|56`).
12. Welcome AISP teaser includes `PROCESS` / `DDD` / `AGENT`.
13. `ResourcesTab.tsx` `SECTION_TYPES` count = 18.
14. EOP triplet at `plans/implementation/phase-114/`.
15. CLAUDE.md sync; ADR ledger 132 → 133; cumulative regression ≥322 GREEN.
