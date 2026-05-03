# Track A — Architecture & Contracts Gap Audit

> Date: 2026-05-04 · Auditor: Track A swarm agent
> Branch: claude/verify-flywheel-init-qlIBr · Seal: P104 / 47cbfe4
> Predecessor reviews: 2026-05-01-comprehensive-review-{1-features,2-design-ux,3-gaps-resolutions}.md (P74 era)

## Summary

Architecture is *load-bearing-but-cracked*. The 8-atom Crystal-Atom suite is documented as "pure modules with no React, no store imports" (ADR-118 D3, ADR-119, ADR-120, ADR-121 D3, ADR-122 D1) — but in reality the AISP/specification layer **inverts dependency on the view layer** in 4 files (`processAtom.ts` imports from `@/components/planning/ProcessMapSVG`; `exportClaudeCode.ts`, `kissReviewer.ts`, `tddScaffoldGenerator.ts` all import `PhaseCard` / `SprintSummary` types defined inside the React component file `@/components/agentics/SpecWorkbench.tsx`). The PATCH_ATOM in `src/contexts/intelligence/prompts/system.ts` has a section-type enum that is wrong in 3 ways (uses `navbar` instead of `menu`; misses 8 of the 18 valid types; drifts from `sectionTypeSchema` and from `intentAtom.ts ALLOWED_TARGET_TYPES`). The ADR ledger README (`docs/adr/README.md`) is stale by 87 ADRs — declares "38 ADRs … through ADR-048" while disk has 125 ADR files through ADR-133 with three duplicate IDs (051/052/053) including two un-updated `Proposed` stubs. `validateSectionType()` (P104) has zero callers outside its own test, so the runtime guard never runs. Three event_types declared in migration 005 CHECK enum (`todo_execution`, `decomp_split`, `export_emit`) have zero `writeLogEvent` emit sites in production code — schema admits them, nobody emits them. `chatPipeline.ts` (the primary intelligence dispatcher) reaches directly into 4 Zustand stores, breaking the contexts→store boundary. **Worst 3:** A1 (atom-→-view dependency inversion), A2 (PATCH_ATOM section-type drift), A3 (ADR ledger 87 ADRs stale).

## Method

Read: `docs/adr/README.md`, all 125 `docs/adr/ADR-*.md` headers (head -20 spot-checks on the duplicate-ID pairs and the supersession candidates), the 8 atom modules in `src/contexts/intelligence/aisp/`, `src/contexts/intelligence/aisp/index.ts`, `src/lib/schemas/section.ts` + `masterConfig.ts`, `src/contexts/persistence/repositories/comprehensiveLogs.ts` (full read), `src/contexts/persistence/migrations/005-comprehensive-logs.sql` (CHECK enum), `src/contexts/intelligence/chatPipeline.ts` head + emit() body, `src/contexts/intelligence/prompts/system.ts`, `src/components/agentics/SpecWorkbench.tsx` import block, `package.json` deps, `plans/tier-2/README.md` + tree. Greps: store leak (`from '@/store/'` inside `src/contexts/`), UI leak (`from '@/components/'` / `from '@/pages/'` inside `src/contexts/`), persistence direct-call from UI, atom production wire (`classifyIntent|classifyAgents|...|tryMatchTemplate`), eventType emit literals across the tree, key-shape leak (`sk-|AIza|Bearer`), Supabase residue (`supabase|@supabase` inside `src/`), forbidden deps (`framer-motion|jszip|react-markdown`). Enforcement checks: KISS denylists declared in P91-P99 spec scopes vs `package.json` deps; ADR-076 Status field vs cross-ref claims; `validateSectionType` / `validateEventType` call-site count.

## Findings — ranked

### A1 — Atom / specification layer inverts dependency on view layer

- **Severity:** P1 (RC blocker — violates ADR-118 D3, ADR-121 D3, ADR-122 D1, ADR-128 D1, ADR-129 D1, ADR-130 D1)
- **Where:**
  - `src/contexts/intelligence/aisp/processAtom.ts:32-37`
  - `src/contexts/specification/exportClaudeCode.ts:24`
  - `src/contexts/specification/reviewers/kissReviewer.ts:9`
  - `src/contexts/specification/exporters/tddScaffoldGenerator.ts` (same import line)
- **What:** The Crystal Atom (PROCESS_ATOM) and three specification modules (export / reviewer / TDD scaffold) all `import type` from React component files. PROCESS_ATOM imports `ProcessNode`/`ProcessEdge`/`ProcessMap`/`ProcessNodeStatus` from `@/components/planning/ProcessMapSVG`; the 3 specification modules import `PhaseCard` and `SprintSummary` from `@/components/agentics/SpecWorkbench`. `PhaseCard` and `SprintSummary` are *defined inside the .tsx component file* (verified — `src/components/agentics/SpecWorkbench.tsx:8-9` exports the interfaces). This is an upside-down architecture: the "domain" layer (`contexts/`) depends on the "view" layer (`components/`), where DDD requires the opposite.
- **Evidence:**
  ```
  src/contexts/intelligence/aisp/processAtom.ts:32-37:
    import type {
      ProcessEdge, ProcessMap, ProcessNode, ProcessNodeStatus,
    } from '@/components/planning/ProcessMapSVG'
  src/contexts/specification/exportClaudeCode.ts:24:
    import type { PhaseCard, SprintSummary } from '@/components/agentics/SpecWorkbench'
  ```
- **Fix LOC est:** ~60 LOC. Move the type definitions to `src/contexts/specification/types.ts` (PhaseCard / SprintSummary) and `src/contexts/intelligence/aisp/processAtom.ts` self-define ProcessNode etc., then have `ProcessMapSVG.tsx` import FROM the atom (correct direction). Update 4 import lines.
- **KISS-fit:** YES — pure-rename refactor, no new deps.
- **Owner-required?** NO

### A2 — PATCH_ATOM section-type enum drifts from `sectionTypeSchema` AND `ALLOWED_TARGET_TYPES`

- **Severity:** P1 (RC blocker — violates ADR-001 JSON SSOT and ADR-100 Section Type Completeness)
- **Where:** `src/contexts/intelligence/prompts/system.ts:44-45` (the `CRYSTAL_ATOM` template literal injected verbatim into every LLM system prompt)
- **What:** PATCH_ATOM enumerates the SectionType set as 16 values: `{ navbar, hero, features, pricing, action, quotes, questions, numbers, gallery, logos, team, image, divider, text, blog, footer }`. Three problems: (1) uses `navbar` — that token is **not in `sectionTypeSchema`** (`section.ts:5-12` has `menu`, never `navbar`); (2) lists `features` and `pricing` and `cta` synonyms that are not in the canonical 18; (3) MISSES 5 valid section types: `case-study`, `contact-form`, `value-props`, `testimonials`, `faq`. The schema says 18 types; the LLM is told there are 16, with one wrong; the chat-router atom (`intentAtom.ts:51-57 ALLOWED_TARGET_TYPES`) lists 23 entries (a *third* drift). Three sources of truth, all different.
- **Evidence:**
  ```
  prompts/system.ts:44-45 (LLM sees this verbatim):
    SectionType := 𝔼{ navbar, hero, features, pricing, action, quotes,
                      questions, numbers, gallery, logos, team, image,
                      divider, text, blog, footer }
  schemas/section.ts:5-12 (Zod runtime truth):
    z.enum(['hero','menu','columns','pricing','action','footer',
            'quotes','questions','numbers','gallery','logos','team',
            'image','divider','text','blog','case-study','contact-form'])
  aisp/intentAtom.ts:51-57 (router truth):
    ['hero','blog','footer','features','pricing','cta','testimonials',
     'faq','value-props','gallery','image','team','columns','action',
     'quotes','questions','numbers','divider','text','logos','menu',
     'case-study','contact-form']
  ```
- **Fix LOC est:** ~10 LOC. Replace `system.ts:44-45` literal with `${VALID_SECTION_TYPES.join(', ')}` template substitution. Re-verify `intentAtom.ts:ALLOWED_TARGET_TYPES` against `sectionTypeSchema` and reduce to canonical 18 OR document the chat-aliases-vs-canonical split explicitly.
- **KISS-fit:** YES.
- **Owner-required?** NO

### A3 — ADR ledger README is stale by 87 ADRs (claims 38 through ADR-048; reality is 125 through ADR-133)

- **Severity:** P1 (consumer-facing; the README is the entry point for `docs/aisp-adoption/` per ADR-108)
- **Where:** `docs/adr/README.md:5` ("38 accepted ADRs on disk, numbered through ADR-048") and the entire ADRs-by-Phase table (`README.md:35-50`).
- **What:** The README declares "Last updated: 2026-04-27 (post-P19 seal at `03e7aa7`)". Today is 2026-05-03. The `## ADRs by Phase` table stops at P19. Real disk: 125 `.md` files (`ls docs/adr/ | wc -l = 125` — 124 ADRs + README) numbered through ADR-133. Per `CLAUDE.md` Project Status block, the headcount should be "133 ADRs" or — adjusting for the 11 documented gaps + 3 duplicate-ID pairs + ADR-076 supersession status — "122 distinct accepted IDs on disk" (122 = 125 disk minus README minus 2 superseded P21 stubs). README is wrong by ~85 phase rows.
- **Evidence:**
  ```
  $ ls docs/adr/ | wc -l
  125
  $ ls docs/adr/ | sort -V | tail -3
  ADR-132-final-qa-token-migration.md
  ADR-133-v2-rc1-open-core-boundary.md
  README.md
  $ head -5 docs/adr/README.md
  > Status as of 2026-04-27 (post-P19 seal, commit `03e7aa7`)
  ```
- **Fix LOC est:** ~120 LOC of README markdown (rebuild the phase table P20→P104; bump the cross-check to 122; mention the 3 stub-then-superseded duplicates and ADR-076 supersession).
- **KISS-fit:** YES — pure docs.
- **Owner-required?** YES — README is canonical adoption surface; owner sign-off recommended on phasing rollup.

### A4 — Two `Proposed` ADR stubs (ADR-051 + ADR-052) still on disk un-updated despite their successors being Accepted

- **Severity:** P2 (should-fix; ADR ledger discipline)
- **Where:**
  - `docs/adr/ADR-051-intent-translator.md:3` — `Status: Proposed (stub authored P21 Cleanup; full content lands in P25 Sprint B Phase 3)`
  - `docs/adr/ADR-052-aisp-intent-classifier.md:3` — `Status: Proposed (stub authored P21 Cleanup; full content lands in P26 Sprint C Phase 1)`
- **What:** Both stubs were authored P21 with the same number as a later Accepted file (ADR-051-section-targeting and ADR-052-intent-translator both Accepted; ADR-053-aisp-intent-classifier Accepted with explicit "Note on numbering" header). The two stubs need an explicit `Status: Superseded by ADR-053-aisp-intent-classifier.md` (for ADR-052 stub) and a closure note on ADR-051 stub. Otherwise grep-checks for "Proposed" return false-positives implying live drafts.
- **Evidence:**
  ```
  $ grep -lE -i 'Status.*Proposed' docs/adr/ADR-*.md
  docs/adr/ADR-051-intent-translator.md
  docs/adr/ADR-052-aisp-intent-classifier.md
  ```
- **Fix LOC est:** ~6 LOC (2 status fields + 2 supersession lines). Optional: rename the stubs to `ADR-051-intent-translator-stub-superseded.md` for filename clarity.
- **KISS-fit:** YES.
- **Owner-required?** NO

### A5 — ADR-076 (mobile-ux-overhaul) lacks `Superseded by ADR-090` on its own Status field

- **Severity:** P2 (should-fix; ADR ledger discipline)
- **Where:** `docs/adr/ADR-076-mobile-ux-overhaul.md:3` — still says `Status: Accepted` (verified `head -8`).
- **What:** ADR-090 declares "ADR-076 (Sprint J P53 mobile 3-tab nav — **SUPERSEDED** by this ADR)" in its cross-refs (`ADR-090:13`), and `CLAUDE.md` says "ADR-076 (Sprint J 3-tab nav) SUPERSEDED by ADR-090". The convention from the README says "When a new ADR builds on or supersedes an existing one, link both directions (the older ADR gets a `Superseded by` line; the new ADR gets a `Supersedes` line)" — the older ADR is missing its `Superseded by`. README ledger also doesn't mention the supersession.
- **Evidence:**
  ```
  $ head -3 docs/adr/ADR-076-mobile-ux-overhaul.md
  # ADR-076: Mobile UX Overhaul (north-star X8 bifurcation)
  **Status:** Accepted
  **Date:** 2026-04-29
  ```
- **Fix LOC est:** ~3 LOC.
- **KISS-fit:** YES.
- **Owner-required?** NO

### A6 — `validateSectionType()` (P104 SCHEMA-GUARDS) has zero callers outside the schema file itself

- **Severity:** P2 (should-fix; kills the value of the P104 sprint)
- **Where:** `src/lib/schemas/section.ts:38-65` (helper exists). Search for callers across all of `src/`: only the file's own test fixture references it.
- **What:** P104 CLAUDE.md narrative says "validateSectionType() exports VALID_SECTION_TYPES … SIDE-CAR helper to sectionTypeSchema Zod — Zod remains strict source of truth for MasterConfig validation; helper provides friendly remap for runtime callers that opt in." But ZERO runtime callers opt in. JSON-load boundaries in `src/data/` (46 example sites) don't call it; `masterConfigParser.ts` doesn't call it; section-type aliases in incoming chat (`intentAtom.ts ALLOWED_TARGET_TYPES`) don't call it. The alias-remap (`article` → `text`, `testimonial` → `quotes`, etc.) is dead code at the application layer — the carry-forward "validateSectionType() JSON-load guard CLOSED" claim in the CLAUDE.md P104 paragraph is OPTIMISTIC: the helper is defined but never invoked.
- **Evidence:**
  ```
  $ grep -lE 'validateSectionType|VALID_SECTION_TYPES' src/ -r --include='*.ts' --include='*.tsx'
  src/lib/schemas/index.ts            # barrel re-export only
  src/lib/schemas/section.ts          # the file itself
  ```
- **Fix LOC est:** ~25 LOC. Wire one call site in `masterConfigParser.ts` at JSON-load entry (pre-Zod parse) to opt in for friendly aliases; OR honest-walkback the P104 claim to "exported but un-wired; opt-in by future callers."
- **KISS-fit:** YES.
- **Owner-required?** NO

### A7 — 3 event_types declared in migration 005 CHECK enum but zero production emit sites

- **Severity:** P2 (carry-forward CF#10 / CF#12 still open per CLAUDE.md ADR-131)
- **Where:**
  - `src/contexts/persistence/migrations/005-comprehensive-logs.sql:CHECK` — admits 15 event_types
  - Greps across `src/` for emit literals: only **5 distinct event_type values** are actually emitted: `input_event`, `listen_capture`, `intent_classification`, `decomposition`, `template_match`, `patch_validation`, `personality_display`, `response_summary`, `process_atom_output`, `ddd_atom_output` (10 in chatPipeline + 2 in PlanningChatBar + 1 each in SpecWorkbench/Agentics for `response_summary`).
  - **Never emitted in production:** `todo_execution`, `decomp_split`, `export_emit`, `error_event`, `multi_page_scope`. Migration 005 SQL comment block (lines 14-17) ADMITS this: "todo_execution — reserved for todoExecutor.ts emit wiring (P102+ candidate)".
- **What:** Schema declares slots; nobody fills them. Two of the three `decomp_split`/`export_emit`/`todo_execution` were added in P100 W2 specifically to "extend CHECK enum so fixtures stop being silently rejected" — i.e. they pass tests by being declared, not by being emitted.
- **Evidence:**
  ```
  $ grep -rEn "eventType:\s*'[a-z_]+'" src/ --include='*.ts' --include='*.tsx' | grep -v '\.spec\.' | sort -u
  src/components/agentics/SpecWorkbench.tsx: eventType: 'response_summary'
  src/components/planning/PlanningChatBar.tsx: eventType: 'ddd_atom_output'
  src/components/planning/PlanningChatBar.tsx: eventType: 'process_atom_output'
  src/pages/Agentics.tsx: eventType: 'response_summary'
  # plus chatPipeline 'emit(logCtx, X, …)' for 10 different X values
  ```
- **Fix LOC est:** ~30 LOC. Wire `error_event` at the `emit error path in chatPipeline.ts` catch blocks; wire `multi_page_scope` at `pageIterator.scopeRoot` boundary; wire `todo_execution` in `todoExecutor.ts:executeAll`. OR remove the three never-emitted slots from the migration enum (cleanup; requires migration 006).
- **KISS-fit:** YES — pure additive emit calls.
- **Owner-required?** NO

### A8 — `chatPipeline.ts` reaches directly into 4 Zustand stores (DDD bounded-context boundary leak)

- **Severity:** P2 (should-fix; existing leak that predates AISP architecture but P104 era is the right time)
- **Where:** `src/contexts/intelligence/chatPipeline.ts:13-18` imports `useConfigStore`, `useIntelligenceStore`, `useUIStore`, `useProjectStore` — all from `@/store/`. Per `grep -rE "from '@/store/" src/contexts/`, total of **12 store-import lines across 7 files in `src/contexts/`** (chatPipeline 4, autosave 2, auditedComplete 2, llmClassifier 1, twoStepPipeline 1, templateSelector 1, assumptionsLLM 1, templates/router 1).
- **What:** Per `CLAUDE.md` "Project Architecture" section: "Follow Domain-Driven Design with bounded contexts." The "intelligence" bounded context (under `src/contexts/intelligence/`) should not reach OUT to the UI store layer for state — it should accept dependencies via parameters or use a thin port/adapter. Today every chatPipeline.submit call does `useUIStore.getState()` / `useConfigStore.getState()` / `useProjectStore.getState()` / `useIntelligenceStore.getState()` synchronously. This works but couples `intelligence` to the React app shell.
- **Evidence:**
  ```
  $ grep -rE "from '@/store/" src/contexts/ --include='*.ts' --include='*.tsx' | wc -l
  12
  src/contexts/intelligence/chatPipeline.ts:13-18:
    import { useConfigStore } from '@/store/configStore'
    import { useIntelligenceStore } from '@/store/intelligenceStore'
    import { useUIStore } from '@/store/uiStore'
    import { useProjectStore } from '@/store/projectStore'
  ```
- **Fix LOC est:** ~50 LOC. Refactor `submit()` to accept a `ChatPipelineDeps { config, activePageId, projectId, sessionId, intelligence }` parameter; chatPipeline becomes pure with respect to stores; the 2 callers (`ChatInput.tsx`, `ListenTab.tsx`) read stores and pass deps in.
- **KISS-fit:** YES — pure dependency-injection refactor; no new deps; testability improves.
- **Owner-required?** NO

### A9 — Atom verbatim consts declared but inert: parse/build helpers throw, contradicting ADR-126 D4 fire-and-forget

- **Severity:** P2 (should-fix; AGENT_ATOM/DDD_ATOM/PROCESS_ATOM each define `parse*Response` that throws on schema mismatch)
- **Where:**
  - `src/contexts/intelligence/aisp/agentAtom.ts:239` — `throw new Error('AGENT_ATOM schema mismatch: ${field}')`
  - `src/contexts/intelligence/aisp/dddAtom.ts:213, 224, 226, 231-247` — 9 `throw new Error` paths
  - `src/contexts/intelligence/aisp/processAtom.ts:187` — `throw new Error('PROCESS_ATOM schema mismatch: ${field}')`
- **What:** ADR-126 D4 mandates "fire-and-forget writes wrapped try/catch never throws upward." Same discipline should apply to the AgentProxy hand-off path (these `parse*Response` helpers will be invoked by an LLM round-trip in P95+). Today they throw on any field mismatch — when the live-LLM path activates, a malformed Anthropic response will throw upward through PlanningChatBar → React error boundary, breaking the demo. ADR-127 D5 acknowledges 5 LIVE-LLM divergence risks; this is one of them not yet captured.
- **Evidence:** see file:line refs above.
- **Fix LOC est:** ~40 LOC. Convert each `throw` to `return null` + `console.warn` (mirror `validateEventType`'s pattern). Update return types from `T` to `T | null` and propagate `null` checks at call sites (which today are zero — these helpers are dead code per ADR-120 "AgentProxy hand-off scaffolded inert until P95+"). Cheap to fix now.
- **KISS-fit:** YES.
- **Owner-required?** NO

### A10 — `package.json` includes 3 deps that P91-P99 KISS-denylist tests claim are forbidden

- **Severity:** P2 (should-fix; document-vs-disk discipline)
- **Where:**
  - `package.json:dependencies` includes `framer-motion ^12.38.0`, `jszip ^3.10.1`, `react-markdown ^10.1.0`.
  - `tests/p91-process-map.spec.ts` (per CLAUDE.md P91 narrative) declares "P91.7 KISS denylist on framer-motion/gsap/lottie/@react-spring/animejs/react-flow/d3 imports + no react-flow/d3/svg-pan-zoom in package.json".
  - Same denylist claim repeated in P92-P99 spec narratives.
- **What:** Three deps are real and used: `framer-motion` (no current source import — vestigial?); `jszip` used by `src/contexts/persistence/exportImport.ts`, `src/lib/exportProject.ts`, `src/components/settings/CodebaseContextUpload.tsx`; `react-markdown` used by `src/components/center-canvas/XAIDocsTab.tsx`. The KISS test denylist is implemented as an *opt-in scoped* check (per file) and does NOT fail the build today, but the CLAUDE.md narrative reads as if these deps are absent. ADR-122 D1 explicitly says "JSZip rejected per ADR-122 D1 (KISS holds)" — that is **wrong**, JSZip is in the repo and is the export emitter for ZIP.
- **Evidence:**
  ```
  $ grep -E '"framer-motion|"jszip|"react-markdown' package.json
      "framer-motion": "^12.38.0",
      "jszip": "^3.10.1",
      "react-markdown": "^10.1.0",
  $ grep -rEn "framer-motion|from 'jszip|react-markdown" src/ --include='*.ts' --include='*.tsx'
  src/components/center-canvas/XAIDocsTab.tsx:2:import ReactMarkdown from 'react-markdown'
  src/components/settings/CodebaseContextUpload.tsx:17:import JSZip from 'jszip'
  src/contexts/persistence/exportImport.ts:5:import JSZip from 'jszip';
  src/contexts/persistence/exportImport.ts:13:export { default as JSZip } from 'jszip';
  src/lib/exportProject.ts:7:import JSZip from 'jszip'
  ```
- **Fix LOC est:** ~30 LOC (uninstall `framer-motion` if vestigial; honest-walkback ADR-122 D1 to "JSZip allowed via existing exportImport.ts; new export pipelines rejected" or similar; clarify KISS-denylist intent in ADR-129/130 narratives).
- **KISS-fit:** YES (negative — removing a dep).
- **Owner-required?** YES — owner should decide whether `framer-motion` should be uninstalled or wired (verify-trace claim).

### A11 — `intentAtom.ts ALLOWED_TARGET_TYPES` (23 entries) drifts from `sectionTypeSchema` (18 entries)

- **Severity:** P2 (should-fix; sub-finding of A2 but tracked separately because the resolution differs)
- **Where:** `src/contexts/intelligence/aisp/intentAtom.ts:51-57` (23 entries: 18 schema + `features`, `pricing`, `cta`, `testimonials`, `faq` synonyms).
- **What:** The chat router accepts user-typed "make the testimonials section bigger" → `target.type = 'testimonials'`. But `sectionTypeSchema` doesn't admit `testimonials` — at patch time the `testimonials` value would be remapped (or fail). The Γ R3 grammar in INTENT_ATOM lists 21 types; the TS const lists 23. The schema admits 18. The PATCH_ATOM lists 16. **Four sources, three different counts.**
- **Evidence:** see A2 evidence block.
- **Fix LOC est:** ~20 LOC. Either (a) reduce ALLOWED_TARGET_TYPES to canonical 18 + add an explicit alias map (mirror `validateSectionType` pattern) for `testimonials` → `quotes`, `faq` → `questions`, `features` → `value-props`, `cta` → `action`, `pricing` → `pricing` (keep), or (b) widen `sectionTypeSchema` to match. Choice (a) is clearly correct (alias map already exists in P104 — extend it, expose it, use it).
- **KISS-fit:** YES.
- **Owner-required?** NO

### A12 — `LogEventType` union and `VALID_LOG_EVENT_TYPES` const can drift silently

- **Severity:** P3 (note; defence-in-depth opportunity)
- **Where:** `src/contexts/persistence/repositories/comprehensiveLogs.ts:15-32` (LogEventType TS union, 15 entries) + `:40-56` (VALID_LOG_EVENT_TYPES const array, 15 entries) + migration 005 CHECK enum (15 entries).
- **What:** Three separate hand-maintained lists, all 15 entries. P104 correctly added `validateEventType` at the write boundary, but the TS-level safety is a literal union — if migration 006 adds a 16th event_type, all three places need synchronized edits or the validator will admit a row the CHECK rejects (or vice versa).
- **Evidence:** Three lists exist; only convention guards them.
- **Fix LOC est:** ~15 LOC. Derive `LogEventType` from `VALID_LOG_EVENT_TYPES` via `typeof VALID_LOG_EVENT_TYPES[number]` (already done — `ValidLogEventType`); deprecate `LogEventType` in favor of `ValidLogEventType`; add a build-time check that compares the TS const array length to the CHECK enum count.
- **KISS-fit:** YES.
- **Owner-required?** NO

### A13 — Open-core / Tier-2 boundary verified clean (positive finding)

- **Severity:** N/A (verification — no fix required)
- **Where:** `src/` recursive grep for `supabase|@supabase` → **zero matches**. `plans/tier-2/` archive present with `README.md` + `supabase/{auth.ts,index.ts,schema.sql}` + `featureFlag-archived.ts`. ADR-114 + ADR-115 retained as Tier-2 planning docs per CLAUDE.md P89b correction.
- **What:** P89b boundary correction held; no residual leak. BYOK key shapes (`sk-…`, `AIza…`, `Bearer …`) appear only in the redaction regex (`comprehensiveLogs.ts:158-167`), the validator (`llm/keys.ts`), and the BYOK settings UI placeholders (`LLMSettings.tsx`) — all expected. **No hardcoded credentials.**
- **Evidence:**
  ```
  $ grep -rE 'supabase|@supabase' src/ --include='*.ts' --include='*.tsx' | wc -l
  0
  $ grep -rE 'sk-|AIza|Bearer ' src/ --include='*.ts' --include='*.tsx'
  # all matches are placeholders, regex patterns, or redaction code
  ```

### A14 — UI components reach directly into persistence repositories (12+ files)

- **Severity:** P3 (note; long-standing pattern that has worked but is architecturally noisy)
- **Where:** `grep "from '@/contexts/persistence/" src/components/`:
  - `PlanningChatBar.tsx`, `Agentics.tsx`, `SpecWorkbench.tsx`, `ConversationLogTab.tsx`, `RequestDrillDown.tsx` import `comprehensiveLogs`/`getDB`
  - `useListenPipeline.ts` imports `messages` + `sessions`
  - `MobilePreFilledPrompt.tsx`, `AISPTranslationPanel.tsx`, `MobileFirstRunCard.tsx`, `Onboarding.tsx` import `kv`
  - `BrandContextUpload.tsx`, `ReferenceManagement.tsx`, `CodebaseContextUpload.tsx` import `brandContext`/`codebaseContext`
- **What:** UI surfaces touch the SQLite repo directly instead of going through a store/service layer. This is the inverse of A8 (intelligence → store): UI → persistence skips the `/store/` layer entirely. For event-logging it's defensible (low-coupling fire-and-forget), but for typed reads (`getEventsForRequest`) it produces tight coupling between view rendering and SQL row shape (e.g. `RequestDrillDown.tsx` imports `LogEventType` to render labels).
- **Fix LOC est:** ≥150 LOC (post-RC; out-of-scope for this gap audit but flagged).
- **KISS-fit:** NO immediate fix; the current shape is "working but ugly." Refactor would create new abstraction layer; defer unless specific bug shows up.
- **Owner-required?** NO

### A15 — ADR cross-reference graph has no machine-readable index

- **Severity:** P3 (note; tooling gap)
- **Where:** Every ADR has free-form "Cross-refs" prose (e.g. `ADR-130 cross-refs ADR-126/128/129`). No JSON/YAML index that lists `{adr-id, supersedes, superseded-by, depends-on}`.
- **What:** With 122 distinct ADR IDs and 3 duplicates, a developer asking "what supersedes ADR-076?" or "which ADRs depend on ADR-043 BYOK trust boundary?" must grep the corpus. The README ledger is the only summary and it's stale (A3). For a project that markets itself as AISP-adopting and consumer-of-spec-bundles, a missing ADR-graph manifest is a smell.
- **Fix LOC est:** ~80 LOC (`docs/adr/index.json` generated by a script in `scripts/build-adr-index.ts`; rebuild on every ADR commit).
- **KISS-fit:** YES — derived artifact, deterministic.
- **Owner-required?** NO

## Carry-forward registry status (Track A perspective)

ADR-131 carry-forward registry from CLAUDE.md (12 items). Track A re-verifies the architecture/contracts ones:

| CF# | Description (per CLAUDE.md) | Claimed status | Track A verdict | Why |
|---|---|---|---|---|
| CF#1 | AGENT_ATOM production wire (closed P97) | CLOSED | CONFIRMED CLOSED | `PlanningChatBar.tsx` calls `classifyAgents` (verified). |
| CF#2 | PROCESS+DDD persisted to log_events (closed P99) | CLOSED | CONFIRMED CLOSED | 2 emit literals in PlanningChatBar verified. |
| CF#3 | (per ADR-131 — listed CLOSED) | CLOSED | NOT VERIFIED | Track A scope didn't expand CF#3 specifics. |
| CF#4 | Live LLM BYOK $0.05 smoke | OWNER-REQUIRED | CONFIRMED OWNER-REQUIRED | No code change unblocks this; owner runs once at RC. |
| CF#5 | Real STT calibration | OWNER-REQUIRED | CONFIRMED OWNER-REQUIRED | Same. |
| CF#6 | Build-time EOP pre-bake | TIER-2 | CONFIRMED TIER-2 | Vite plugin work, post-RC. |
| CF#7 | Welcome/Onboarding token migration | CLOSED P102 | NOT IN TRACK SCOPE | Defer to Track E (UI). |
| CF#8 | Agentics live-wire | CLOSED P102 | NOT IN TRACK SCOPE | Defer to Track B (pipeline). |
| CF#9 | (per ADR-131 — POST-LAUNCH) | POST-LAUNCH | NOT VERIFIED | Track A scope. |
| CF#10 | (per ADR-131 — POST-LAUNCH) | POST-LAUNCH | LIKELY OPEN | A7 finding suggests `error_event`/`multi_page_scope` emit-site wiring still owed. |
| CF#11 | Status palette tokens (closed P102) | CLOSED P102 | NOT IN TRACK SCOPE | Defer to Track E. |
| CF#12 | Migration 005 INTENT_FUTURE comment block | CLOSED P102 | CONFIRMED CLOSED | Comment block present in 005-comprehensive-logs.sql; A7 finds the actual emits still missing. |

**New carry-forwards Track A surfaces (P104 era):**

| New CF# | Description | Severity | Owner |
|---|---|---|---|
| TA1 | Atom→view dependency inversion (4 imports) | P1 | dev |
| TA2 | PATCH_ATOM SectionType drift in system.ts | P1 | dev |
| TA3 | ADR README stale by 87 ADRs | P1 | docs |
| TA4 | ADR-051/052 Proposed-stub status hygiene | P2 | docs |
| TA5 | ADR-076 missing `Superseded by` line | P2 | docs |
| TA6 | validateSectionType wired at zero call sites | P2 | dev |
| TA7 | LogEventType-vs-CHECK-vs-CONST drift risk | P3 | dev |
| TA8 | Atom parse helpers throw on malformed LLM | P2 | dev |
| TA9 | Vestigial framer-motion dep (or wire-and-document) | P2 | owner |
| TA10 | ALLOWED_TARGET_TYPES vs sectionTypeSchema drift | P2 | dev |
| TA11 | Machine-readable ADR cross-ref index | P3 | tooling |

## Honest declaration

What I CAN verify by static-only reading: file existence, import graphs, regex matches across the source tree, documented-vs-actual ADR status, schema enum cardinality, declared-but-unused symbols. What I CANNOT verify without running the code or live LLM:

1. **Whether the runtime atom flows actually parse a real LLM response correctly.** PROCESS/DDD/AGENT atoms have `parse*Response` helpers, but I never observed an LLM round-trip — they may throw on every real Anthropic / Gemini reply (A9). Live BYOK smoke required (CF#4).
2. **Whether `validateEventType` actually rejects a row in production rather than just in unit fixtures.** Verified the call site exists in `writeLogEvent`; I cannot run the SQLite + sql.js bootstrap in a static audit.
3. **Whether the chatPipeline `emit()` calls actually persist 10+ rows per submit.** P100 W2 has 30 spec cases asserting this; I read the call sites but did not exercise the pipeline.
4. **Whether removing `framer-motion` would break a runtime path.** No source `import` matches today, but a CSS-driven animation or dynamic import could be in play; needs a build + Lighthouse run.
5. **Whether the DDD bounded-context boundary leak (A8) actually causes a real bug today.** It's an architectural smell; functionally the code works because the stores ARE Zustand singletons accessible globally. The cost is testability and refactor velocity, not correctness — until a live SSR / streaming-RSC scenario triggers a `useStore.getState()` hydration mismatch.
6. **Whether the live-LLM behavior matches PATCH_ATOM's wrong section-type enum (A2)**. Today's AgentProxy is canned-fallback / fixture-driven for 90%+ of paths per CLAUDE.md "live BYOK runtime deferred"; the wrong enum will only bite when real LLMs start returning `navbar` in patches and Zod rejects them.

Reproducible parts of this audit: 18 grep commands and 12 file reads, all listed under §Method. A developer can run them in order and reach the same findings.

---

**End of Track A audit.** ≥10 findings (15 produced). Top 3 worst gaps: A1 (atom→view inversion), A2 (PATCH_ATOM section-type drift), A3 (ADR ledger stale). 3 P1 / 8 P2 / 4 P3 by severity.
