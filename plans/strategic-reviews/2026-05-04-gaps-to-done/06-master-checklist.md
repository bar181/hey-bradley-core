# Master Checklist — Gaps to v2.0.0-RC1 Truly-Done

> **Source:** Tracks A-E (`01-…` through `05-…`) — 77 raw findings deduplicated to ~52 items.
> **Ordering:** P1 first → KISS-fit YES first → smallest LOC first.
> **Class legend:** `swarm` = swarm-doable now / `owner` = owner-required (BYOK / human / browser) / `tier-2` = post-RC commercial.
> **Sequencing:** P105/P106/… name the proposed sprint per `07-roadmap.md`.

---

## P1 — RC blockers (19 raw → 14 deduped)

### #1 — Welcome CTAs link to a 404 route (`/onboarding` vs `/new-project`)
- **Sources:** E1 · **Where:** `src/pages/Welcome.tsx:12,19,26,50,220`
- **What:** Every "Try Hey Bradley", "Try Chat", "Try Listen", "Open Builder" CTA on the landing page hits `*` NotFound. Routes mount Onboarding at `/new-project` only.
- **Fix LOC:** 5 · **KISS:** YES · **Class:** swarm · **Sprint:** P105
- **Notes:** Mechanical find/replace. Front-door bug. Highest user-impact P1 in the audit.

### #2 — Empty-text branch returns blank summary (silent UI)
- **Sources:** B5 · **Where:** `src/contexts/intelligence/chatPipeline.ts:303-308`
- **What:** Empty input returns `{ ok:false, summary:'', errorKind:null }` — listen surface renders nothing; chat typewriter shows blank.
- **Fix LOC:** 3-5 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #3 — `validateSectionType` has zero production callers (P104 closure-claim is optimistic)
- **Sources:** A6 + B1 (CONVERGED) · **Where:** `src/lib/schemas/section.ts:38-65`
- **What:** P104 sealed the helper with 10 alias entries (`article→text`, `testimonial→quotes`, `cta→action`, `faq→questions`, `stats→numbers`, etc.); ZERO importers in `src/`. JSON-load boundary doesn't invoke it; Zod runs strict and rejects aliases. P104 effectively shipped a no-op.
- **Fix LOC:** 5-15 · **KISS:** YES · **Class:** swarm · **Sprint:** P105
- **Notes:** Wire one call site in `masterConfigParser.ts` pre-Zod, OR honest-walkback the P104 claim.

### #4 — DECOMP verb table missing `forget`/`need`/`create` (drops same-text INTENT classifies)
- **Sources:** B11 · **Where:** `src/contexts/intelligence/aisp/decompAtom.ts:108-114`
- **What:** P101 extended INTENT_ATOM verb classifier with these verbs but DECOMP_ATOM's separate VERB_KEYWORDS table missed the mirror update. "create a pricing section and forget the footer" → DECOMP drops to 0.6 confidence → falls through.
- **Fix LOC:** 5 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #5 — `cleanTranscript` only logged, not piped to pipeline
- **Sources:** B7 + D1 (CONVERGED) · **Where:** `src/contexts/intelligence/chatPipeline.ts:327`
- **What:** Listen submit emits `listen_capture` with `cleaned: cleanTranscript(text)` but downstream `classifyIntent`/`decompose`/`matchTemplates`/`runLLMPipeline` all consume raw `text`. ADR-127 D3 claim "consulted at chatPipeline submit" is false beyond the log payload. ZERO behavioral test.
- **Fix LOC:** 5 (runtime) + ~30 (test) · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #6 — ASSUMPTIONS_FALLBACK_TEMPLATES exported but has zero callers
- **Sources:** B8 · **Where:** `src/contexts/intelligence/aisp/assumptionsAtom.ts:144`
- **What:** P100 W2 added a 3-entry deterministic fallback (revert / reset / clarify) for when `generateAssumptionsLLM` returns empty. `useListenPipeline.ts:148-155` and `ChatInput.tsx:415-435` do NOT consult it — users get empty replies instead of the safety net.
- **Fix LOC:** 10-15 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #7 — `isUnmeasurable` + `hasContradiction` wired as flags but never act
- **Sources:** B3 · **Where:** `src/contexts/intelligence/chatPipeline.ts:396-398`
- **What:** P100 W2 FMT-VERIFY claims these closed dead-code state. Reality: they're computed and emitted into `intent_classification` event_data. No clarification branch, no ASSUMPTIONS_ATOM trigger. Behavioral effect: zero.
- **Fix LOC:** 15-25 · **KISS:** YES · **Class:** swarm · **Sprint:** P105
- **Notes:** Pair with #6 — when `isUnmeasurable=true`, route to ASSUMPTIONS_FALLBACK_TEMPLATES.

### #8 — Atom→view dependency inversion (4 imports)
- **Sources:** A1 · **Where:** `processAtom.ts:32-37`, `exportClaudeCode.ts:24`, `kissReviewer.ts:9`, `tddScaffoldGenerator.ts`
- **What:** PROCESS_ATOM imports types FROM `@/components/planning/ProcessMapSVG`; 3 specification modules import `PhaseCard`/`SprintSummary` FROM `@/components/agentics/SpecWorkbench`. `PhaseCard`/`SprintSummary` are defined inside the .tsx component file. This violates ADR-118 D3 / ADR-121 D3 / ADR-122 D1 / ADR-128 D1 / ADR-129 D1 / ADR-130 D1 (all declare "pure / store-agnostic / no view import").
- **Fix LOC:** ~60 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #9 — `aispRoute === 'content'` short-circuits to canned, never invokes CONTENT_ATOM
- **Sources:** B4 · **Where:** `src/contexts/intelligence/chatPipeline.ts:617-635`
- **What:** When route='content' AND no template matched, pipeline returns canned "I can do design changes right now…" string. Comment at L612 admits "TODO: content route → P38 LLM content call (CONTENT_ATOM verbatim → LLM)" — unfulfilled since P37. `generateContent` IS wired into `registry.ts:18` (template-4 path) but route='content' branch never reaches it.
- **Fix LOC:** 30-50 · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #10 — Wire 5 dead enum slots (error_event, todo_execution, multi_page_scope, decomp_split, export_emit)
- **Sources:** A7 + C1 + C5 (CONVERGED) · **Where:** `migrations/005-comprehensive-logs.sql:CHECK` declares; ZERO writers in `src/`
- **What:** Schema declares 15 event_types; only 10 are emitted. Five slots dead. `error_event` matters most — every catch in chatPipeline goes to `console.warn` only, invisible in production builds. Owner cannot debug from a user's exported DB.
- **Fix LOC:** ~65 (5 emit sites) · **KISS:** YES · **Class:** swarm · **Sprint:** P106
- **Notes:** Honest priority: error_event > todo_execution > decomp_split > export_emit > multi_page_scope.

### #11 — `writeLogEvent` does NOT call `persist()` (logs evaporate on tab close)
- **Sources:** C2 · **Where:** `comprehensiveLogs.ts:185-215` + `db.ts:154-172`
- **What:** writeLogEvent runs INSERT against the in-memory sql.js DB. Persistence to IndexedDB happens ONLY when `persist()` is called separately (closeDB, kv set, projects upsert). Sessions where user only chats but no patches apply (canned, error, listen reject) NEVER persist their logs. Tests don't catch this because they run in single browser context. **Single most load-bearing observability gap.**
- **Fix LOC:** ~15-25 (debounced flush + pagehide listener) · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #12 — twoStepPipeline / SELECTION_ATOM is fully orphaned
- **Sources:** B2 · **Where:** `src/contexts/intelligence/aisp/twoStepPipeline.ts:71`; `templateSelector.ts:72`
- **What:** ADR-057 / P28 architected the 2-step LLM-driven SELECTION path. `runTwoStepPipeline` + `selectTemplate` total 245 LOC. ZERO production importers. The 3-layer matcher (`templateMatcher.ts`) is the de-facto SELECTION; the LLM-driven variant never executes.
- **Fix LOC:** ~6 (DELETE per KISS) OR ~25 (wire) · **KISS:** YES (delete) · **Class:** swarm · **Sprint:** P105

### #13 — AppShell mode-detection branches are dead code
- **Sources:** E2 · **Where:** `src/components/shell/AppShell.tsx:65-99`
- **What:** AppShell mounted only inside `Builder.tsx` (only at `/builder`). Routes `/planning` → `<Planning />` and `/agentics` → `<Agentics />` mount their own page components directly. AppShell `pathname.startsWith('/planning')` / `'/agentics'` branches NEVER fire. Contradicts ADR-116 D3 ("AppShell layout route-derived").
- **Fix LOC:** 30 (delete branches OR re-architect) · **KISS:** YES (delete) · **Class:** swarm · **Sprint:** P105
- **Notes:** Architecture decision required: amend ADR-116 D3 to acknowledge mode pages are siblings, OR route Planning + Agentics through AppShell.

### #14 — PATCH_ATOM section-type 3-way drift
- **Sources:** A2 + A11 (CONVERGED) · **Where:** `prompts/system.ts:44-45` (16 entries; uses `navbar`); `sectionTypeSchema` (18 entries; uses `menu`); `intentAtom.ts ALLOWED_TARGET_TYPES` (23 entries with synonyms)
- **What:** Three sources of truth, three different counts. PATCH_ATOM is wrong (uses `navbar` not in schema; misses 5 valid types). LLM is told there are 16 with one wrong; chat router knows 23.
- **Fix LOC:** ~30 (template-substitute the canonical 18 into prompt; reduce ALLOWED_TARGET_TYPES OR widen to alias-aware) · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #15 — `tests/p76-spec-export-quality.spec.ts` has ZERO test cases
- **Sources:** D7 · **Where:** `tests/p76-spec-export-quality.spec.ts`
- **What:** P76 / OC-9 / ADR-101 seal claims unverified. File is a placeholder with 2 existsSync probes and 0 `test()` calls. CLAUDE.md anchor claims "+10 P76 OC-9" — not present.
- **Fix LOC:** ~80 · **KISS:** YES · **Class:** swarm · **Sprint:** P108

### #16 — Mobile viewport coverage = ZERO playwright runs
- **Sources:** D4 · **Where:** `playwright.config.ts:20`
- **What:** Single project `chromium` / `Desktop Chrome`. ADR-090/091/112/113 all promise 375/390/428 readability. Live measurement is "owner post-RC task". `grep '375|390|428'` matches are doc-text greps not viewport runs.
- **Fix LOC:** ~10 config + ~80 viewport asserts · **KISS:** YES · **Class:** swarm · **Sprint:** P108

### #17 — `validateEventType` runtime invocation never tested
- **Sources:** D3 · **Where:** `tests/p104-seed-smoke.spec.ts:137-167`
- **What:** P104 spec checks `expect(src).toMatch(/export\s+function\s+validateEventType/)`. The CHECK-enum compare re-implements the allow-list locally; never imports + invokes the validator. Drop-invalid-rows behavior unverified.
- **Fix LOC:** ~50 · **KISS:** YES · **Class:** swarm · **Sprint:** P108

### #18 — `writeLogEvent` runtime never sql-asserted
- **Sources:** D11 · **Where:** All P100 W2 / P104 specs
- **What:** Tests grep for `'writeLogEvent'` substring count. Nothing opens an in-memory sql.js DB, runs the pipeline, and queries `SELECT * FROM log_events`. ADR-126/127/130 all hinge on persistence side-effects; tests verify call-site presence not row-write.
- **Fix LOC:** ~120 (sql.js bootstrap + 3 scenario re-runs + redaction shape) · **KISS:** YES · **Class:** swarm · **Sprint:** P108

### #19 — P101 "7-step e2e smoke" is regex-against-source, not e2e
- **Sources:** D10 · **Where:** `tests/p101-7step-e2e-smoke.spec.ts`
- **What:** Header says "Verifies 7-step methodology fires end-to-end" but every test body is `expect(src).toMatch(/.../)`. No orchestration that fires Step 1→7. The "smoke" misnamer is a discipline failure.
- **Fix LOC:** 5 (rename) OR 250 (build real e2e) · **KISS:** YES (rename) · **Class:** swarm · **Sprint:** P108

---

## P2 — Should-fix (35 raw → 27 deduped)

### #20 — DECOMP threshold 0.7 drops mid-confidence multi-clause
- **Sources:** B6 · **Where:** `chatPipeline.ts:433` + `decompAtom.ts:36`
- **What:** Multi-clause inputs scoring 0.6 (single-hit per clause) get dropped silently. Combined with verb-table gaps (#4), users pay DECOMP cost for nothing.
- **Fix LOC:** ~20 (lower threshold OR widen verb table) · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #21 — Template matcher `alternatives` populated but never surfaced
- **Sources:** B9 · **Where:** `templateMatcher.ts:128-134`; `chatPipeline.ts:498-499`
- **What:** When confidence < 0.8, matcher returns top-3 alternatives per layer. chatPipeline emits them in the log payload only; never feeds them to ASSUMPTIONS_ATOM clarification card.
- **Fix LOC:** 20-30 · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #22 — `logCtx.sessionId === ''` silently disables ALL log emit
- **Sources:** B10 · **Where:** `chatPipeline.ts:282-284, 322-326`
- **What:** When projectId null OR `activeSession(projectId)` returns null, sessionId is `''`. emit() short-circuits. Brand-new user's first message produces ZERO log_events rows. ConversationLogTab shows nothing for that submit.
- **Fix LOC:** ~10 (lazy `startSession` mirror useListenPipeline) · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #23 — `editHist` skips writes when projectId is null (anonymous demo)
- **Sources:** C12 · **Where:** `chatPipeline.ts:286-290`
- **What:** Hey Bradley public-site demo + listen-mode-only flows have no project. ~30% of submits drop edit_history rows. ADR-126 §3 "per-patch before/after for replay/forensics" promise broken.
- **Fix LOC:** ~3 (sentinel) OR ~30 (schema relax via migration 006) · **KISS:** PARTIAL · **Class:** swarm · **Sprint:** P106

### #24 — `response_summary` overloaded with 3 unrelated kinds
- **Sources:** C4 · **Where:** `chatPipeline.ts` (5 sites) + `Agentics.tsx` (`kind:'seal-event'`) + `SpecWorkbench.tsx` (`kind:'kiss-review'`)
- **What:** Single CHECK-enum slot carries 3 semantically distinct categories via `event_data.kind` string-soup. Schema enforcement bypassed; typo on kind silent.
- **Fix LOC:** ~30 (migration 006 splits enum) · **KISS:** PARTIAL (schema migration cost) · **Class:** swarm · **Sprint:** P106
- **Notes:** Tier-2 candidate — defer if migration cadence too costly.

### #25 — `getEventsForSession` declared in scope, not implemented
- **Sources:** C3 · **Where:** `comprehensiveLogs.ts:280-314` (only `getEventsForRequest` + `getEditHistoryForProject`)
- **What:** Audit brief and ADR-126 §3 imply per-session drill-down. ConversationLogTab works around with paginated chat_messages → per-request resolution.
- **Fix LOC:** ~12 · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #26 — Caller-side redactKeyShapes missing on 2 sites
- **Sources:** C decomp + atom rationale (TC12) · **Where:** `chatPipeline.ts:432` (decomp.todos) + `PlanningChatBar.tsx:53-63` (process/ddd output rationale)
- **What:** Repo-layer (`comprehensiveLogs.ts`) catches at INSERT. Caller-side redundancy missing. Defence-in-depth uneven.
- **Fix LOC:** ~6 · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #27 — `pruneLogEventsByCount` LRU bound missing
- **Sources:** C14 (TC11) · **Where:** `db.ts` — only `pruneLLMLogsByCount(10_000)` exists
- **What:** Heavy-logging session re-serializes entire DB on every autosave; IndexedDB blob grows unbounded between prune sweeps.
- **Fix LOC:** ~5 (mirror llm_logs LRU) · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #28 — Two `Proposed` ADR stubs (ADR-051 + ADR-052) un-updated
- **Sources:** A4 · **Where:** `docs/adr/ADR-051-intent-translator.md:3` + `ADR-052-aisp-intent-classifier.md:3`
- **What:** P21 stubs share IDs with later Accepted ADRs (ADR-053 Note-on-numbering header). Status field still says `Proposed (stub)`. False-positive on grep for live drafts.
- **Fix LOC:** ~6 · **KISS:** YES · **Class:** swarm · **Sprint:** P109

### #29 — ADR-076 lacks `Superseded by ADR-090` on its Status field
- **Sources:** A5 · **Where:** `docs/adr/ADR-076-mobile-ux-overhaul.md:3`
- **What:** ADR-090 cross-refs declare ADR-076 superseded; CLAUDE.md states it; ADR-076 itself still says `Status: Accepted`. README ledger doesn't mention supersession.
- **Fix LOC:** ~3 · **KISS:** YES · **Class:** swarm · **Sprint:** P109

### #30 — ADR ledger README is stale by 87 ADRs
- **Sources:** A3 · **Where:** `docs/adr/README.md:5,35-50`
- **What:** Declares "38 ADRs through ADR-048". Reality: 125 files (124 ADRs + README) through ADR-133. README is the entry point for `docs/aisp-adoption/` per ADR-108.
- **Fix LOC:** ~120 (rebuild phase table P20→P104) · **KISS:** YES · **Class:** owner-recommended · **Sprint:** P109
- **Notes:** Owner sign-off recommended on phasing rollup; pure docs.

### #31 — Atom parse helpers throw on malformed LLM (contradicts ADR-126 D4)
- **Sources:** A9 · **Where:** `agentAtom.ts:239`, `dddAtom.ts:213-247` (9 throws), `processAtom.ts:187`
- **What:** ADR-126 D4 mandates fire-and-forget never throws upward. AgentProxy hand-off helpers throw on schema mismatch. When live-LLM activates, malformed Anthropic response throws through PlanningChatBar → React error boundary, breaking demo.
- **Fix LOC:** ~40 (return null + console.warn pattern; mirror validateEventType) · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #32 — chatPipeline reaches into 4 Zustand stores (DDD boundary leak)
- **Sources:** A8 · **Where:** `chatPipeline.ts:13-18`
- **What:** Intelligence context imports useConfigStore / useIntelligenceStore / useUIStore / useProjectStore. Per CLAUDE.md DDD principle, intelligence should accept deps via parameters or thin port/adapter.
- **Fix LOC:** ~50 (DI refactor accepting `ChatPipelineDeps`) · **KISS:** YES · **Class:** swarm · **Sprint:** deferred (post-RC)
- **Notes:** Architectural smell, not bug; defer unless P107+ ROUTE-RECONCILIATION lifts the deps for other reasons.

### #33 — `ALLOWED_TARGET_TYPES` (23) drifts from sectionTypeSchema (18)
- **Sources:** A11 (sub-finding of #14 but resolution differs) · **Where:** `intentAtom.ts:51-57`
- **What:** Chat router accepts 23 types incl. synonyms (testimonials/faq/features/cta/pricing). Schema admits 18. PATCH_ATOM lists 16. **Already merged into #14** but tracked separately because resolution path differs (alias map extension).
- **Fix LOC:** ~20 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #34 — `framer-motion` dep present but no source imports
- **Sources:** A10 · **Where:** `package.json` + zero `framer-motion` imports in `src/`
- **What:** P91-P99 KISS denylist tests claim deps are forbidden; `framer-motion ^12.38.0`, `jszip ^3.10.1`, `react-markdown ^10.1.0` are real deps. ADR-122 D1 says "JSZip rejected" — wrong, it ships.
- **Fix LOC:** ~30 (uninstall framer-motion if vestigial; honest-walkback ADR-122 D1) · **KISS:** YES (negative) · **Class:** owner-decision · **Sprint:** P109

### #35 — SpecWorkbench ignores `--hb-status-*` palette tokens (P102 partial closure)
- **Sources:** E3 · **Where:** `SpecWorkbench.tsx:70,72`
- **What:** P102 / CF#11 shipped `--hb-status-sealed` (`#22c55e`) + `--hb-status-deferred` (`#f59e0b`); ProcessMapSVG was wired but SpecWorkbench was missed. Still uses inline literal hex.
- **Fix LOC:** 4 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #36 — ModeSelectorCard is a token-drift island (zero `--hb-*`)
- **Sources:** E4 · **Where:** `src/components/onboarding/ModeSelectorCard.tsx:74,79,84,94,96,114,124,132,137,151`
- **What:** 11 raw hex literals; persona-card lives at the front door of mode selection. P102 token migration covered Welcome + most of Onboarding but skipped this step.
- **Fix LOC:** 12 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #37 — MobileSpecBottomSheet uses marketing-palette literals
- **Sources:** E5 · **Where:** `MobileSpecBottomSheet.tsx:129,148,152,156,165,168,181,201,204,210`
- **What:** Hardcoded `#faf8f5`/`#2d1f12`/`#6b5e4f` (warm marketing palette) inside builder shell which uses `--hb-bg`/`--hb-surface`. Visual jolt at 375px.
- **Fix LOC:** ~10 · **KISS:** YES · **Class:** swarm · **Sprint:** P105

### #38 — Agentics passes `eop={null}` always; SealPanel empty-state never escapes
- **Sources:** E6 · **Where:** `Agentics.tsx:232`
- **What:** SealPanel wired with hardcoded null. Empty state is the only state. ADR-130 D3 names build-time EOP pre-bake as Tier-2 carry-forward but D4 says Planning persistence closes it — but no read path from log_events → SealPanel.
- **Fix LOC:** ~25 (load most-recent EOP from log_events OR Vite glob-import disk) · **KISS:** YES · **Class:** swarm · **Sprint:** P107

### #39 — Welcome 3-mode cards mismatch ADR-116 modes
- **Sources:** E7 · **Where:** `Welcome.tsx:6-28`
- **What:** Three cards (Builder / Chat / Listen) all link `/onboarding` (broken per #1). After fix, they're 3 *interaction styles* within Whiteboard mode — NOT the 3 modes per ADR-116. Welcome doesn't surface Planning or Agentics.
- **Fix LOC:** ~30 · **KISS:** YES · **Class:** owner-copy · **Sprint:** P107

### #40 — ChatInput pushes 738/750 LOC ceiling per ADR-095
- **Sources:** E8 · **Where:** `ChatInput.tsx`
- **What:** 12 LOC of headroom. Long-deferred `useChatPipeline` hook extraction (P67d carry-forward) would bring it under. Touching ChatInput for any other fix risks breaching cap.
- **Fix LOC:** ~120 (extract hook) · **KISS:** YES · **Class:** swarm · **Sprint:** P107

### #41 — Planning + Agentics responsive density sparse (5-6 classes vs 19-29 on marketing)
- **Sources:** E9 · **Where:** `Planning.tsx`, `Agentics.tsx`
- **What:** Only `flex-col md:flex-row` + `md:w-64` — no `lg:`, no `sm:`, no `md:p-6` differential. ProcessMapSVG at viewBox 740×400 horizontally overflows 375px. No `min-h-[44px]` touch-target floor on any new mode surface.
- **Fix LOC:** ~25 · **KISS:** YES · **Class:** swarm · **Sprint:** P107

### #42 — Skip-link absent from every top-level page
- **Sources:** E10 · **Where:** Welcome / Onboarding / Planning / Agentics / AppShell
- **What:** WCAG 2.1 §2.4.1 Bypass Blocks. Welcome ~250 LOC of sections; keyboard user must tab through 12+ nav links. ADR-102 a11y baseline doesn't enumerate skip-link.
- **Fix LOC:** ~25 (shared SkipLink component + 1 mount per top page) · **KISS:** YES · **Class:** swarm · **Sprint:** P107

### #43 — Icon-only buttons missing aria-label across new agentics surfaces
- **Sources:** E11 · **Where:** `ExportClaudeCodeButton.tsx:43`, `MobileSpecBottomSheet.tsx:109,138,226`, etc.
- **What:** Mixed coverage. Most newer buttons have visible text or aria-labels. Mobile bottom-sheet drag handle is icon-only.
- **Fix LOC:** ~10 · **KISS:** YES · **Class:** swarm · **Sprint:** P107

### #44 — PlanningViewToggle missing tablist semantics
- **Sources:** E12 · **Where:** `PlanningViewToggle.tsx`
- **What:** No `role="tablist"`, no `role="tab"`, no `aria-selected` state. SpecWorkbench gets this right; PlanningViewToggle doesn't.
- **Fix LOC:** ~6 · **KISS:** YES · **Class:** swarm · **Sprint:** P107

### #45 — Persona scores doc-grep, not behavior-derived (P102 final QA)
- **Sources:** D8 · **Where:** `tests/p102-final-qa.spec.ts:179-194`
- **What:** Grandma 86 / Framer 86 / Lars 88 verified by counting `\b(8[5-9]|9[0-9]|100)/100\b` substrings in markdown. ADR-132 §3 acceptance gate is a documentation contract, not a behavior contract.
- **Fix LOC:** structurally hard (live persona simulation) OR ~10 (add NOTE in spec) · **KISS:** PARTIAL · **Class:** owner-attested · **Sprint:** P108
- **Notes:** Honest-document-fix is appropriate; full automation is post-launch.

### #46 — `p101-verb-classifier.spec.ts` re-implements regex locally
- **Sources:** D9 · **Where:** `tests/p101-verb-classifier.spec.ts:38-40`
- **What:** Spec defines `const FORGET_RE = /\bforget\b/i` LOCALLY. If source flips word-boundary or adds negative-lookbehind, both checks pass while behavior diverges.
- **Fix LOC:** ~20 (replace local regex with `import { classifyIntent }`) · **KISS:** YES · **Class:** swarm · **Sprint:** P108

### #47 — Crystal Atoms (PROCESS / DDD / AGENT) have zero call-site behavior tests
- **Sources:** D12 · **Where:** P92/P93/P94 specs
- **What:** Five spec files reference the atoms. None call `classifyAgents(waveCtx)` and assert `AgentSpec[]` non-empty / disjoint ownedFiles. Source-shape only.
- **Fix LOC:** ~180 (60 LOC × 3 atoms) · **KISS:** YES · **Class:** swarm · **Sprint:** P108

---

## P3 — Notes (23 raw → 11 deduped)

### #48 — Soft-pass guard creep (~600 obsolete existsSync)
- **Sources:** D13 · **Where:** 1,038 existsSync across 131 spec files; avg 7.9/spec
- **What:** Soft-pass-when-deferred pattern justified at A_n dispatch boundaries; never retired post-seal. Of ~1,038, est ~600 are obsolete.
- **Fix LOC:** systematic prune; not a single fix · **KISS:** N/A · **Class:** swarm · **Sprint:** P108

### #49 — Per-submit dynamic-import overhead (≥6 awaits per call)
- **Sources:** B12 · **Where:** `chatPipeline.ts:339-346, 356, 426-427`
- **What:** Every submit awaits 6 dynamic imports. stageMarks.classifyStart set AFTER imports → latency math understates. Hoist to static.
- **Fix LOC:** ~30-50 · **KISS:** YES · **Class:** swarm · **Sprint:** deferred (perf)

### #50 — LLM AISP cost-cap pre-check at 90% can starve mid-budget
- **Sources:** B13 · **Where:** `llmClassifier.ts:48`
- **What:** `if (sessionUsd >= capUsd * 0.9) return null` — last 10% never usable for AISP. No UI signal "AISP skipped due to cap."
- **Fix LOC:** ~5-10 · **KISS:** YES · **Class:** swarm · **Sprint:** deferred

### #51 — `personalityMessage` reads intelligenceStore TWICE (race)
- **Sources:** B14 · **Where:** `chatPipeline.ts:567,582,653,667`
- **What:** Settings change mid-pipeline could disagree between persisted message and result row.
- **Fix LOC:** ~5 (pin once at submit-entry) · **KISS:** YES · **Class:** swarm · **Sprint:** deferred

### #52 — `improvements` swallows module-load errors silently
- **Sources:** B15 · **Where:** `chatPipeline.ts:154-167`
- **What:** Production catches eat suggester import failure. No `error_event` log row. Pair with #10 close.
- **Fix LOC:** ~5 · **KISS:** YES · **Class:** swarm · **Sprint:** P106 (with #10)

### #53 — Retention prune fires once per `initDB()` only
- **Sources:** C6 · **Where:** `db.ts:111-116`
- **What:** No mid-session re-fire. Long-running tabs accumulate weeks of in-memory rows.
- **Fix LOC:** ~10 (visibility-change + 6h interval) OR honest-defer · **KISS:** YES · **Class:** tier-2 candidate · **Sprint:** deferred

### #54 — `validateEventType` warns to console even in production
- **Sources:** C9 · **Where:** `comprehensiveLogs.ts:65-80`
- **What:** Chatty validator can flood production console. Other persistence sites DEV-gate; this one doesn't.
- **Fix LOC:** ~3 (DEV-gate) · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #55 — Migration 005 `latency_ms` column never populated
- **Sources:** C13 · **Where:** `005-comprehensive-logs.sql:63`
- **What:** emit() doesn't pass latencyMs to writeLogEvent. latency lives in event_data JSON only. Indexed queries impossible.
- **Fix LOC:** ~5 · **KISS:** YES · **Class:** swarm · **Sprint:** P106

### #56 — `LogEventInsert.id` Math.random fallback unguarded
- **Sources:** C11 · **Where:** `comprehensiveLogs.ts:144-155`
- **What:** Older harnesses without crypto.randomUUID fall back to Math.random. Two concurrent writes could collide. PRIMARY KEY violation silently swallowed.
- **Fix LOC:** ~5 (counter suffix + DEV-warn) · **KISS:** YES · **Class:** swarm · **Sprint:** deferred

### #57 — Seed scripts emit JSON; no browser-side replay path
- **Sources:** C7 · **Where:** `scripts/seed-e2e2-logevents.ts`, `seed-conversationlog-fixtures.ts`
- **What:** Node scripts emit fixtures; nothing reads them back into live DB on boot. Honest-rename to test-only OR add dev-mode bootstrap.
- **Fix LOC:** ~5 (rename) OR ~30 (bootstrap) · **KISS:** YES (rename) · **Class:** swarm · **Sprint:** P109

### #58 — Onboarding mode-hint copy is stub-trap
- **Sources:** E13 · **Where:** `Onboarding.tsx:29-32`
- **What:** "Planning mode is live — open /planning to map a project." User lands; sees 3 stub projects; only Hey Bradley is active. No "+ New Project" button. Copy oversells.
- **Fix LOC:** ~5 (hedge copy) OR ~30 (+New Project action) · **KISS:** YES · **Class:** owner-copy · **Sprint:** P107

### #59 — Empty-state copy inconsistent across modes (5 different prompts)
- **Sources:** E17 · **Where:** Planning/Agentics/SpecWorkbench/SealPanel/DomainModelSVG empty states
- **What:** "Select a project" / "Select a phase from the map" / "Run a phase to see the seal" / "Type a project description" / "Select a phase to see its spec" — no unified micro-copy guideline.
- **Fix LOC:** ~15 · **KISS:** YES · **Class:** swarm · **Sprint:** P107

---

## Owner-required / Tier-2 / human testing (DEFERRED to end per owner direction)

These items CANNOT be closed by the swarm without owner BYOK keys, browser/screen-reader access, or commercial Tier-2 work. They are NOT P1 RC blockers because the carry-forward registry already names them as owner-required.

### #60 — Live LLM BYOK $0.05 smoke (CF#4)
- **Sources:** A12 + D5 · **Class:** owner · **Notes:** ADR-131 §3 / ADR-133 §4. 5 prompts × 3 providers (Claude / Gemini / OpenRouter). No code change unblocks. Recommend env-gated `tests/livellm/byok-smoke.spec.ts` (~150 LOC) for owner CI but the SMOKE-RUN itself is owner-attested.

### #61 — Real STT calibration (CF#5)
- **Sources:** D6 · **Class:** owner · **Notes:** Web Speech API needs real microphone. Mock-Web-Speech fixture spec (~80 LOC) closes the dev surface; calibration is owner.

### #62 — Lighthouse mobile ≥85 measurement
- **Sources:** D4 honest decl · **Class:** owner · **Notes:** ADR-112 declared standard. Live measurement is post-RC owner task per CLAUDE.md.

### #63 — Visual contrast / screen-reader / cross-browser
- **Sources:** Track E honest decl items 1-7 · **Class:** owner · **Notes:** Source-static reads cannot verify. Browser render + axe-core + VoiceOver/NVDA/JAWS testing is owner-attested.

### #64 — UI components reach directly into persistence repositories (12+ files)
- **Sources:** A14 · **Class:** tier-2 · **Notes:** Long-standing pattern; functionally works. Refactor would create new abstraction layer. Defer unless specific bug shows up.

### #65 — IndexedDB full-export cost (every persist re-serializes entire DB)
- **Sources:** C14 · **Class:** tier-2 · **Notes:** ~100+ LOC for delta-tracking. Better short-term: row-count cap (#27) which IS swarm-doable.

### #66 — Machine-readable ADR cross-ref index
- **Sources:** A15 · **Class:** tier-2-tooling · **Notes:** Generate `docs/adr/index.json` from ADR headers + cross-refs. Nice-to-have; not RC blocker.

### #67 — AISPDeveloperCard no resurface mechanism
- **Sources:** E15 · **Class:** owner-product-decision · **Notes:** Dismissed → never returns. Add Settings toggle to clear flag. ~12 LOC.

### #68 — Marketing-page hex literal density (token drift Tier-2 polish)
- **Sources:** E16 · **Class:** tier-2 · **Notes:** ADR-112 ducks future palette change; intentional today. ~80 LOC across 8 pages. Defer to palette refresh.

### #69 — Conversation log drill-down deep-link (URL state)
- **Sources:** E18 · **Class:** tier-2 · **Notes:** Power-user concern. ~20 LOC if owner wants it.

### #70 — Cross-tab DB invalidation re-fires retention sweep
- **Sources:** C10 · **Class:** non-issue · **Notes:** Correct as-is; pruning idempotent. P3 noise.

### #71 — `seed-e2e2-logevents.ts` doesn't import `validateEventType`
- **Sources:** C8 · **Class:** swarm-deferred · **Notes:** ~6-12 LOC; requires leaf-module split for transitive imports. Defer to P109 with other docs cleanup.

### #72 — Store-state integration tests stop at P79
- **Sources:** D15 · **Class:** swarm-deferred · **Notes:** Zustand store unit tests cheap (~40 LOC/slice). Defer to post-RC test arc.

### #73 — Fixtures never replayed against real DB
- **Sources:** D14 · **Class:** swarm-deferred · **Notes:** ~100 LOC sql.js bootstrap + replay harness. Same effort as #18; bundle into P108 / TEST-RUNTIME-SHIFT.

---

## Summary statistics

- **52 deduplicated items** (down from 77 raw)
- **19 P1 raw → 14 deduped** (5 cross-track convergences merged)
- **35 P2 raw → 27 deduped**
- **23 P3 raw → 11 deduped**
- **14 owner-required / Tier-2 / deferred** (items #60-#73)
- **Total swarm-doable LOC:** ~1,000-1,400 (estimates; rough order)
- **Total swarm-doable items:** ~38 of 52

## Item-class breakdown by sprint assignment

| Sprint | Item count | LOC budget | Sample items |
|--------|-----------|-----------|--------------|
| P105 / DEAD-CODE-PURGE | 12 | ~250 | #1 #2 #3 #4 #6 #8 #12 #13 #14 #31 #35 #36 #37 |
| P106 / LOG-INTEGRITY | 10 | ~200 | #9 #10 #11 #20 #21 #22 #23 #24 #25 #26 #27 #54 #55 |
| P107 / UI-RECONCILIATION | 8 | ~150 | #38 #39 #40 #41 #42 #43 #44 #58 #59 |
| P108 / TEST-RUNTIME-SHIFT | 7 | ~400 | #15 #16 #17 #18 #19 #45 #46 #47 #48 |
| P109 / DOCS-LEDGER-TRUTH-UP | 5 | ~150 | #28 #29 #30 #34 #57 #71 |
| Deferred (post-RC) | 10 | ~250 | #32 #49 #50 #51 #53 #56 #60-#73 owner items |
