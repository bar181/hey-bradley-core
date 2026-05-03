# Roadmap to v2.0.0-RC1 Truly-Done

> **Source:** `06-master-checklist.md` (52 items deduplicated from 77 raw findings).
> **Goal:** Sequence the swarm-doable items into 5 dispatch-ready sprints; honestly defer the rest.
> **Discipline:** Each sprint has explicit agent count, LOC budget, owned files, acceptance gate, and dependency call-outs.

---

## Sprint summary

| Sprint | Name | Agents | LOC budget | Duration | Items | Mandate |
|--------|------|--------|-----------|----------|-------|---------|
| P105 | DEAD-CODE-PURGE | 4 | ~250 | 3-5 hours | 13 | Wire or delete every orphaned export; close Welcome 404; close atom→view inversion |
| P106 | LOG-INTEGRITY | 3 | ~200 | 2-3 hours | 13 | Close 5 dead enum slots; add `persist()` flush hook; close `editHist` anonymous-session gap |
| P107 | UI-RECONCILIATION | 3 | ~150 | 2-3 hours | 9 | Reconcile mode architecture; a11y skip-link + tablist; responsive density on Planning/Agentics |
| P108 | TEST-RUNTIME-SHIFT | 4 | ~400 | 4-6 hours | 9 | Build sql.js fixture; rename misleading specs; mobile playwright; persona-doc-grep honesty note |
| P109 | DOCS-LEDGER-TRUTH-UP | 1 | ~150 | 2 hours | 6 | Rebuild ADR README; close ADR-051/052/076 status hygiene; honest-walkback ADR-122 D1 |
| **Total** | | **15 agent-instances** | **~1,150** | **13-19 hours** | **50** | |

Velocity context: per CLAUDE.md "Effort Estimation Rule" target multi-hour shifts. 5-sprint sweep at velocity ≈ 2 working days. Each sprint ships independently; quality discipline (ADR + tests + EOP triplet) holds.

---

## P105 / DEAD-CODE-PURGE

**Mandate:** Delete or wire 8 orphaned exports + 5 ship-blocker fixes surfaced by Tracks A+B+E. Close 5 of the 14 P1 findings.

**Agents (4):**
- A1 / front-door-fix → `src/pages/Welcome.tsx` (#1) + `src/contexts/intelligence/chatPipeline.ts` empty-input branch (#2)
- A2 / atom-domain-purify → atom→view inversion (#8) + atom parse helpers convert throws to `null` (#31) + PATCH_ATOM section-type 3-way drift (#14) + ALLOWED_TARGET_TYPES alias map (#33)
- A3 / dead-export-purge → `validateSectionType` wire OR delete (#3) + `ASSUMPTIONS_FALLBACK_TEMPLATES` wire (#6) + `isUnmeasurable`+`hasContradiction` act (#7) + DECOMP verb table (#4) + twoStepPipeline DELETE (#12) + AppShell dead branches (#13)
- A4 / closer → ADR-134 (Dead-Code-Purge boundary) + `tests/p105-dead-code-purge.spec.ts` + EOP triplet at `plans/implementation/phase-105/seal/`

**Owned files:**
- `src/pages/Welcome.tsx` (5 LOC find/replace)
- `src/contexts/intelligence/chatPipeline.ts` (empty-input branch + isUnmeasurable/hasContradiction action branch + 4 verb-table lines)
- `src/contexts/intelligence/aisp/{processAtom,agentAtom,dddAtom}.ts` (purify view imports + convert throws)
- `src/contexts/intelligence/aisp/decompAtom.ts` (verb-table extension)
- `src/contexts/specification/{exportClaudeCode,reviewers/kissReviewer,exporters/tddScaffoldGenerator}.ts` (extract PhaseCard / SprintSummary types to `src/contexts/specification/types.ts`)
- `src/contexts/specification/types.ts` (NEW; ~30 LOC; PhaseCard + SprintSummary moved here)
- `src/components/agentics/SpecWorkbench.tsx` (re-import types from `contexts/specification/types`; component file becomes type-consumer not type-source)
- `src/contexts/intelligence/prompts/system.ts` (PATCH_ATOM template-substitute canonical 18)
- `src/contexts/intelligence/aisp/intentAtom.ts` (ALLOWED_TARGET_TYPES alias map extension)
- `src/lib/schemas/section.ts` (`validateSectionType` wire site decision)
- `src/contexts/persistence/repositories/masterConfigParser.ts` (consume validateSectionType pre-Zod)
- `src/components/shell/ChatInput.tsx` + `useListenPipeline.ts` (ASSUMPTIONS_FALLBACK_TEMPLATES wire)
- `src/contexts/intelligence/aisp/{twoStepPipeline,templateSelector}.ts` (DELETE both files)
- `src/contexts/intelligence/aisp/index.ts` (drop deleted exports from barrel)
- `src/components/shell/AppShell.tsx` (delete dead `pathname.startsWith('/planning'|'/agentics')` branches)
- `src/components/agentics/SpecWorkbench.tsx` + `src/components/onboarding/ModeSelectorCard.tsx` + `src/components/shell/MobileSpecBottomSheet.tsx` (token migration: status pills + raw hex; #35 #36 #37)
- `docs/adr/ADR-134-dead-code-purge.md` (NEW; ≤120 LOC cap)
- `tests/p105-dead-code-purge.spec.ts` (NEW; ~80 LOC; existsSync hard-gates on deletions; behavioral asserts on validateSectionType + ASSUMPTIONS_FALLBACK + DECOMP verb mirror)
- `plans/implementation/phase-105/seal/{02-post-review,session-log,retrospective}.md` (NEW)

**Acceptance gate:**
- `grep -rE "from '@/components/" src/contexts/` returns ZERO matches (atom→view inversion closed)
- `grep -rE "navbar" src/contexts/intelligence/prompts/system.ts` returns ZERO matches (PATCH_ATOM truth-up)
- `grep -rE "twoStepPipeline|runTwoStepPipeline|selectTemplate" src/` returns ZERO matches outside test/spec
- `grep -rE "validateSectionType" src/contexts/persistence/repositories/masterConfigParser.ts` returns ≥1 match (wire-up)
- `grep -rE "ASSUMPTIONS_FALLBACK_TEMPLATES" src/components/shell/ChatInput.tsx` returns ≥1 match
- `grep -rE "/onboarding" src/pages/Welcome.tsx` returns ZERO matches
- `tsc --noEmit` clean
- 12+ new behavioral tests in p105-dead-code-purge.spec.ts (NOT existsSync soft-pass)
- ADR-134 + EOP triplet present
- PASS = zero P1 KISS-review verdict per ADR-129

**Owner-required tasks blocked by this sprint:** none. Closes #1 #2 #3 #4 #6 #7 #8 #12 #13 #14 #31 #33 #35 #36 #37 (15 items / 14 P1 + 1 P2; #33 merged into #14 fix path).

---

## P106 / LOG-INTEGRITY

**Mandate:** Close 5 dead enum slots; add persist hook so logs don't evaporate; close `editHist` anonymous-session gap; close 4 P2 observability items. Close 13 items.

**Agents (3):**
- B1 / persist-hook → `comprehensiveLogs.ts` debounced flush + `pagehide` listener (#11) + `pruneLogEventsByCount` LRU (#27) + DEV-gate validateEventType console.warn (#54) + emit() latencyMs column (#55)
- B2 / dead-enum-wire → `error_event` helper + 4 catch sites (#10 / #52); `todo_execution` per-row in todoExecutor (#10); `decomp_split` per-todo loop (#10); `export_emit` ExportClaudeCodeButton onClick (#10); `multi_page_scope` post-getActivePage (#10). Plus `getEventsForSession` (#25) + `editHist` anonymous sentinel (#23) + caller-side redactKeyShapes on decomp + atom rationale (#26) + lazy `startSession` for sessionId='' (#22) + content-route → CONTENT_ATOM wire (#9) + DECOMP threshold OR verb extension (#20) + alternatives surface to ASSUMPTIONS card (#21)
- B3 / closer → ADR-135 (Log Integrity + 5-Slot Closure) + `tests/p106-log-integrity.spec.ts` + EOP triplet

**Owned files:**
- `src/contexts/persistence/repositories/comprehensiveLogs.ts` (`persist()` debounce hook + DEV-gate + `getEventsForSession` + caller-helper for redact)
- `src/contexts/persistence/db.ts` (pagehide flush listener + `pruneLogEventsByCount`)
- `src/contexts/intelligence/chatPipeline.ts` (5 emit-site additions; emit() signature extended with latencyMs; lazy startSession; CONTENT_ATOM wire at route='content'; alternatives → ASSUMPTIONS surface; editHist sentinel; DECOMP threshold tweak)
- `src/contexts/intelligence/todoExecutor.ts` (`todo_execution` per-row emit)
- `src/components/agentics/ExportClaudeCodeButton.tsx` (`export_emit` log + redactKeyShapes if free-text)
- `src/components/planning/PlanningChatBar.tsx` (caller-side redactKeyShapes on rationale)
- `src/contexts/persistence/migrations/006-log-integrity.sql` (NEW IF schema-relax for editHist anonymous needed; otherwise sentinel string approach in comprehensiveLogs.ts)
- `docs/adr/ADR-135-log-integrity.md` (NEW; ≤140 LOC)
- `tests/p106-log-integrity.spec.ts` (NEW; ~150 LOC; uses sql.js bootstrap fixture; INSERT + SELECT round-trip on 5 newly-wired event_types; persist() flush behavioral assertion)
- `plans/implementation/phase-106/seal/{02-post-review,session-log,retrospective}.md` (NEW)

**Acceptance gate:**
- `grep -rE "writeLogEvent\(.*'error_event'" src/contexts/intelligence/chatPipeline.ts` returns ≥3 matches
- `grep -rE "writeLogEvent\(.*'todo_execution'" src/contexts/intelligence/todoExecutor.ts` returns ≥1 match
- `grep -rE "writeLogEvent\(.*'decomp_split'" src/` returns ≥1 match
- `grep -rE "writeLogEvent\(.*'export_emit'" src/components/agentics/ExportClaudeCodeButton.tsx` returns ≥1 match
- `grep -rE "writeLogEvent\(.*'multi_page_scope'" src/contexts/intelligence/chatPipeline.ts` returns ≥1 match
- `grep -rE "void persist\(\)|pagehide" src/contexts/persistence/repositories/comprehensiveLogs.ts` returns ≥1 match
- `grep -rE "getEventsForSession" src/contexts/persistence/repositories/comprehensiveLogs.ts` returns ≥1 match
- `tsc --noEmit` clean
- 6+ behavioral tests using sql.js round-trip (NOT existsSync) verify each new event_type INSERT lands a row
- ADR-135 + EOP triplet present
- PASS = zero P1 KISS-review

**Owner-required tasks blocked by this sprint:** none. Closes #9 #10 #11 #20 #21 #22 #23 #25 #26 #27 #52 #54 #55 (13 items).

---

## P107 / UI-RECONCILIATION

**Mandate:** Reconcile mode architecture (Welcome 3-cards vs ADR-116; Agentics SealPanel `eop={null}`); close a11y gaps (skip-link, tablist semantics, icon labels); add responsive density to Planning/Agentics; extract `useChatPipeline` hook to free ChatInput LOC ceiling. Close 9 items.

**Agents (3):**
- C1 / mode-arch-fixup → Welcome 3-cards re-copy or restructure (#39) + Onboarding mode-hint hedge (#58) + Agentics SealPanel eop fetch from log_events (#38) + empty-state copy unification (#59)
- C2 / a11y + responsive → SkipLink shared component (#42) + PlanningViewToggle tablist semantics (#44) + icon-button aria-labels (#43) + Planning/Agentics responsive density + 44px touch-target floor (#41) + ChatInput useChatPipeline hook extract (#40)
- C3 / closer → ADR-136 (UI Reconciliation + a11y baseline extension) + `tests/p107-ui-reconciliation.spec.ts` + EOP triplet

**Owned files:**
- `src/pages/Welcome.tsx` (3-cards re-frame to 3-modes per ADR-116)
- `src/pages/Onboarding.tsx` (MODE_HINT_COPY hedge)
- `src/pages/Agentics.tsx` (SealPanel eop fetch path: read most-recent EOP triplet from log_events `response_summary` with `kind:'seal-event'` OR Vite glob-import disk path)
- `src/components/a11y/SkipLink.tsx` (NEW; ~25 LOC) — shared component
- `src/pages/Welcome.tsx` + `Onboarding.tsx` + `Planning.tsx` + `Agentics.tsx` + `Builder.tsx` (mount SkipLink + add `<main id="main-content">`)
- `src/components/planning/PlanningViewToggle.tsx` (role="tablist" + role="tab" + aria-selected)
- `src/components/agentics/ExportClaudeCodeButton.tsx` (aria-label)
- `src/components/shell/MobileSpecBottomSheet.tsx` (drag-handle aria-label)
- `src/pages/Planning.tsx` + `src/pages/Agentics.tsx` (responsive class density + `min-h-[44px]` on buttons)
- `src/components/shell/ChatInput.tsx` (extract `useChatPipeline` hook to `src/hooks/useChatPipeline.ts`; ChatInput drops to ≤620 LOC)
- `src/hooks/useChatPipeline.ts` (NEW; ~120 LOC)
- Empty-state copy strings — touch 5 surfaces with unified phrasing (#59)
- `docs/adr/ADR-136-ui-reconciliation.md` (NEW; ≤120 LOC)
- `tests/p107-ui-reconciliation.spec.ts` (NEW; ~100 LOC; existsSync hard-gate on SkipLink mount in 4 pages; behavioral assert on PlanningViewToggle aria-selected; ChatInput LOC <650 hard-gate)
- `plans/implementation/phase-107/seal/...` (NEW)

**Acceptance gate:**
- `grep -rE "skip-link|SkipLink" src/pages/Welcome.tsx` returns ≥1 match (and same on Onboarding/Planning/Agentics)
- `grep -rE 'role="tablist"' src/components/planning/PlanningViewToggle.tsx` returns ≥1 match
- `wc -l src/components/shell/ChatInput.tsx` < 650
- `wc -l src/hooks/useChatPipeline.ts` exists
- `grep -rE "eop=\{null\}" src/pages/Agentics.tsx` returns ZERO matches (replaced with fetch path)
- 8+ behavioral tests; existsSync ratio ≤1.0 (NOT 1.5+ as P100 W2 era)
- ADR-136 + EOP triplet
- PASS = zero P1 KISS-review

**Owner-required tasks blocked by this sprint:** mobile/screen-reader live verification (post-RC owner task; sprint ships source-correct surfaces). Closes #38 #39 #40 #41 #42 #43 #44 #58 #59 (9 items).

---

## P108 / TEST-RUNTIME-SHIFT

**Mandate:** Shift the test corpus from documentation-and-grep toward behavioral runtime asserts. Build sql.js bootstrap fixture; mobile playwright project; rename P101 7-step e2e smoke (or build real e2e); fill the empty P76 spec; add Crystal Atom call-site tests; honest-document persona scoring; replace local regex re-implementations. Close 9 items.

**Agents (4):**
- D1 / sql.js fixture → `tests/fixtures/sql-js-bootstrap.ts` shared bootstrap (~80 LOC); P104 + P100 W2 specs migrate to bootstrap-and-assert pattern (#17 #18); fixtures replay against real DB (#73)
- D2 / mobile + p76 + atoms → `playwright.config.ts` add Pixel/iPhone projects (#16) + `tests/p76-spec-export-quality.spec.ts` body (#15; ~80 LOC) + Crystal Atom call-site tests for PROCESS/DDD/AGENT (#47; ~180 LOC)
- D3 / rename + honest-doc → P101 7-step rename to `p101-7step-source-presence.spec.ts` (#19) + persona-rescore NOTE in p102-final-qa.spec.ts (#45) + verb classifier import-and-call (#46) + soft-pass guard prune script (#48; targeted retire of post-seal soft-passes in P89-P104 specs)
- D4 / closer → ADR-137 (Test-Runtime-Shift) + `tests/p108-test-runtime-shift.spec.ts` + EOP triplet

**Owned files:**
- `tests/fixtures/sql-js-bootstrap.ts` (NEW; ~80 LOC; opens in-memory DB, runs migrations 001-005, exposes `withFreshDB(fn)` helper)
- `tests/p104-seed-smoke.spec.ts` (EDIT; replace local allow-list with `import { VALID_LOG_EVENT_TYPES, validateEventType }`; assert remap behavior + drop-invalid-rows behavior in real DB)
- `tests/p100-w2-comprehensive-logs.spec.ts` (EDIT; 3 scenario fixtures replay → INSERT → SELECT; row-count + redaction shape asserts)
- `playwright.config.ts` (EDIT; add `projects: [{ name: 'mobile-pixel', use: devices['Pixel 7'] }, { name: 'mobile-iphone', use: devices['iPhone 14'] }]`)
- `tests/mobile/{p87-marketing-mobile-render,p88-section-visual-render,p90-mode-mobile-render}.spec.ts` (NEW; viewport-runs of existing static checks)
- `tests/p76-spec-export-quality.spec.ts` (EDIT from 0 cases to ~12 cases covering ADR-101's 4 standards)
- `tests/atoms/{p92-process-atom-runtime,p93-ddd-atom-runtime,p94-agent-atom-runtime}.spec.ts` (NEW; ~60 LOC each; call classify*() and assert AgentSpec[] non-empty / disjoint ownedFiles / ProcessMap nodes-and-edges shape)
- `tests/p101-7step-e2e-smoke.spec.ts` → RENAME to `tests/p101-7step-source-presence.spec.ts` (5 LOC rename; updates header comment)
- `tests/p102-final-qa.spec.ts` (EDIT; add NOTE comment block clarifying persona scores are doc-shape only; ~10 LOC)
- `tests/p101-verb-classifier.spec.ts` (EDIT; replace local FORGET_RE with `import { classifyIntent }` + `expect(classifyIntent('forget the footer').action).toBe('remove')`)
- `scripts/prune-soft-pass-guards.ts` (NEW; ~80 LOC; targeted demote of post-seal existsSync to hard `expect().toBe(true)` for sealed-and-shipped surfaces; outputs diff for owner review; does NOT auto-apply)
- `docs/adr/ADR-137-test-runtime-shift.md` (NEW; ≤140 LOC)
- `tests/p108-test-runtime-shift.spec.ts` (NEW; ~80 LOC; existsSync hard-gates on bootstrap fixture + mobile config + p76 body + atom runtime specs)
- `plans/implementation/phase-108/seal/...` (NEW)

**Acceptance gate:**
- `tests/fixtures/sql-js-bootstrap.ts` exists and exports `withFreshDB`
- `playwright.config.ts` has ≥3 projects (Desktop Chrome + ≥2 mobile)
- `wc -l tests/p76-spec-export-quality.spec.ts` shows ≥80 LOC and `grep -cE "^\s*test\(" tests/p76-spec-export-quality.spec.ts` returns ≥10
- `grep -E "from '@/contexts/intelligence/aisp/agentAtom'" tests/atoms/p94-agent-atom-runtime.spec.ts` returns ≥1 match
- `tests/p101-7step-e2e-smoke.spec.ts` does NOT exist (renamed)
- `grep -rE "from '@/contexts/intelligence/aisp/intentClassifier'" tests/p101-verb-classifier.spec.ts` returns ≥1 match
- ADR-137 + EOP triplet
- 30+ NEW behavioral tests added across the sprint
- PASS = zero P1 KISS-review

**Owner-required tasks blocked by this sprint:** Live LLM (CF#4) + STT (CF#5) + Lighthouse remain owner-attested but the test infrastructure is now in place. Closes #15 #16 #17 #18 #19 #45 #46 #47 #48 (9 items).

---

## P109 / DOCS-LEDGER-TRUTH-UP

**Mandate:** Rebuild ADR README phase table; close ADR status hygiene gaps; honest-walkback ADR-122 D1 (JSZip rejected — wrong); seed-script honest-rename. Close 6 items. Single-agent docs sprint.

**Agents (1):**
- E1 / docs-truth-up → ADR README rebuild (#30) + ADR-051 + ADR-052 stub status hygiene (#28) + ADR-076 Superseded-by line (#29) + ADR-122 D1 honest-walkback (#34) + seed scripts honest-rename or import VALID_LOG_EVENT_TYPES (#57 #71) + ADR-138 (Docs Ledger Truth-Up) + `tests/p109-docs-ledger-truth-up.spec.ts` + EOP triplet

**Owned files:**
- `docs/adr/README.md` (REBUILD; phase table P20→P104; ADR count truth-up to 122 distinct accepted IDs; mention 3 stub-then-superseded duplicates + ADR-076 supersession)
- `docs/adr/ADR-051-intent-translator.md:3` (Status: Superseded by ADR-051-section-targeting.md OR rename file to `-stub-superseded`)
- `docs/adr/ADR-052-aisp-intent-classifier.md:3` (Status: Superseded by ADR-053-aisp-intent-classifier.md)
- `docs/adr/ADR-076-mobile-ux-overhaul.md:3` (add `Superseded by ADR-090` line)
- `docs/adr/ADR-122-export-claude-code.md` (D1 walkback: "JSZip allowed via existing `exportImport.ts`; new export pipelines rejected" — or remove the claim)
- `package.json` (decision on `framer-motion`: uninstall if vestigial OR mount-with-test-coverage; #34 owner gate)
- `scripts/seed-e2e2-logevents.ts` (`import { VALID_LOG_EVENT_TYPES } from '../src/contexts/persistence/repositories/comprehensiveLogs'`)
- `scripts/seed-conversationlog-fixtures.ts` (same import; OR leaf-module split if transitive imports complicate)
- `src/contexts/persistence/repositories/eventTypeEnum.ts` (NEW IF leaf-module split needed; ~10 LOC; just exports the const + type)
- `docs/adr/ADR-138-docs-ledger-truth-up.md` (NEW; ≤120 LOC)
- `tests/p109-docs-ledger-truth-up.spec.ts` (NEW; ~60 LOC; behavioral assertions on README phase count + grep `Proposed (stub)` returns 0 + `Superseded by ADR-090` in ADR-076 + framer-motion package.json decision recorded)
- `plans/implementation/phase-109/seal/...` (NEW)

**Acceptance gate:**
- `grep -cE "^### Phase " docs/adr/README.md` returns ≥80 (rebuilt phase table)
- `grep -cE "^\*\*Status:\*\* Proposed \(stub" docs/adr/ADR-051-*.md` returns 0 OR file renamed with `-stub-superseded` suffix
- `grep -E "Superseded by ADR-090" docs/adr/ADR-076-mobile-ux-overhaul.md` returns ≥1 match
- `grep -rE "JSZip rejected" docs/adr/` returns 0 matches (ADR-122 D1 walked back)
- `grep -rE "VALID_LOG_EVENT_TYPES" scripts/seed-e2e2-logevents.ts` returns ≥1 match
- ADR-138 + EOP triplet
- PASS = zero P1 KISS-review

**Owner-required tasks blocked by this sprint:** owner sign-off on ADR README phasing rollup (recommended; not blocking). Closes #28 #29 #30 #34 #57 #71 (6 items).

---

## Honest deferrals

These items either CANNOT be closed before owner attestation OR are explicitly Tier-2 commercial work. They do NOT block v2.0.0-RC1 launch because the carry-forward registry already names them.

### Owner-required (must run live; no swarm closure)

1. **Live BYOK $0.05 smoke (CF#4)** — owner runs 5 prompts × 3 providers (Claude / Gemini / OpenRouter) at v2.0.0-RC1 tag. P108 ships an env-gated `tests/livellm/byok-smoke.spec.ts` skeleton (~150 LOC) that owner runs once and the CI then guards regressions. Until owner runs it, ADR-131 §3 5-LIVE-LLM-divergence-risk register is not test-attested. Item #60.
2. **Real STT calibration (CF#5)** — Web Speech API requires real microphone. P108 ships mock-Web-Speech fixture. Calibration is owner. Item #61.
3. **Lighthouse mobile ≥85 measurement** — ADR-112 declared standard. Live measurement is post-RC owner task. P108 ships mobile playwright projects which catch source-shape regressions; live Lighthouse score is owner. Item #62.
4. **Visual contrast / screen-reader / cross-browser** — source-static reads cannot verify contrast at runtime, VoiceOver / NVDA / JAWS output, or cross-browser parity (Firefox / Safari / mobile Safari). Owner-attested or post-launch axe-core CI. Item #63.
5. **Welcome 3-mode card copy decision** — #39 has a swarm-doable path (rewrite to 3 modes per ADR-116) AND an owner-decision path (keep 3-interaction-styles framing and explicitly note "Whiteboard mode internal"). P107 ships the swarm-doable rewrite; owner can override.

### Tier-2 commercial (post-RC; deferred)

1. **UI components → persistence direct calls (12+ files)** — long-standing pattern; functional. Refactor creates new abstraction layer; defer unless specific bug. Item #64.
2. **IndexedDB delta-tracking** — `persist()` re-serializes entire DB. ~100+ LOC architectural change. P106 ships row-count cap as cheaper short-term mitigation. Item #65.
3. **Machine-readable ADR cross-ref index (`docs/adr/index.json`)** — nice-to-have; not RC blocker. Item #66.
4. **AISPDeveloperCard resurface mechanism** — owner product decision; ~12 LOC if owner wants. Item #67.
5. **Marketing-page hex literal density** — ADR-112 ducks future palette change intentionally. ~80 LOC across 8 pages. Defer to palette refresh. Item #68.
6. **ConversationLogTab drill-down deep-link (URL state)** — power-user concern; ~20 LOC if owner wants. Item #69.
7. **Mid-session retention sweep** — long-running tabs accumulate rows. Open-core users rarely keep tabs open for days. Item #53.
8. **Math.random UUID collision guard** — P3 defensive. Item #56.
9. **chatPipeline DDD boundary leak (4 store imports)** — architectural smell, not bug. ~50 LOC DI refactor. Item #32.
10. **Per-submit dynamic-import overhead** — perf concern dev-mode-only assumption; production bundle may collapse. Item #49.
11. **LLM AISP cost-cap 90% literal** — P3 conservatism vs bug judgment call. Item #50.
12. **personalityMessage race** — P3 defensive pin. Item #51.
13. **Store-state integration tests** — Zustand specs cheap; defer to post-RC test arc. Item #72.

### Non-issues (verified-clean; no fix needed)

- A13 — Open-core / Tier-2 boundary clean (zero Supabase refs in `src/`)
- C10 — Cross-tab DB invalidation re-fires retention sweep (correct as-is; pruning idempotent)

---

## Acceptance for "v2.0.0-RC1 truly-done"

The conditions that would make v2.0.0-RC1 truly-done. Each is classified as **swarm-can-attest** (closeable in P105-P109) or **owner-must-attest** (requires human / browser / live BYOK).

### Swarm-can-attest (post-P109 close)

- [ ] **All 14 P1 findings closed** (P105 closes 12; P106 closes 2 more)
- [ ] **All 5 cross-track convergence items closed** (validateSectionType wired; 5 enum slots emit; cleanTranscript piped; PATCH_ATOM truth-up; soft-pass prune script run)
- [ ] **Atom→view dependency inversion eliminated** (`grep -rE "from '@/components/" src/contexts/` = 0 matches)
- [ ] **Welcome.tsx links resolve to real routes** (Welcome → /new-project → Onboarding renders)
- [ ] **chatPipeline.ts paths all reachable** (no orphaned twoStepPipeline; route='content' invokes CONTENT_ATOM; ASSUMPTIONS_FALLBACK reachable)
- [ ] **All 5 declared event_types have ≥1 production writer** (10/15 → 15/15)
- [ ] **`writeLogEvent` writes are persisted across tab close** (debounced flush + pagehide listener)
- [ ] **Test corpus has ≥1 sql.js-bootstrap behavioral spec per major contract** (P104 schema-guards + P100 W2 logs + P92-P94 atoms)
- [ ] **`tests/p76-spec-export-quality.spec.ts` is non-empty** (was 0 cases; now ≥10)
- [ ] **Mobile playwright projects exist** (≥2 device profiles; not just Desktop Chrome)
- [ ] **ADR README rebuilt to reflect 122 distinct accepted IDs through ADR-138** (not stuck at 38 / ADR-048)
- [ ] **5 new ADRs (134-138) ship + 5 EOP triplets at `seal/` subfolders**
- [ ] **PASS = zero P1 KISS-review** on each of P105-P109 closer specs
- [ ] **`tsc --noEmit` clean** at every sprint boundary
- [ ] **Cumulative test growth target:** P105 (~15) + P106 (~20) + P107 (~10) + P108 (~30) + P109 (~10) = ~85 NEW tests; cumulative regression target ≥1,400 PURE-UNIT GREEN

### Owner-must-attest (post-launch; not blocking sprint close)

- [ ] **Tag v2.0.0-RC1** at the P109 seal commit
- [ ] **CF#4 BYOK $0.05 live smoke** — 5 prompts × 3 providers; cost-cap respected; Crystal Atom Σ compliance verified on live JSON
- [ ] **CF#5 STT calibration** — real microphone; cleanTranscript on actual disfluency patterns; transcript→pipeline integration eyeball-verified
- [ ] **Lighthouse mobile ≥85** measured at 375/390/428 viewports on Welcome / Onboarding / Builder / Planning / Agentics
- [ ] **WCAG AA contrast** — axe-core CI green OR owner manual sweep
- [ ] **Cross-browser smoke** — Firefox + Safari + mobile Safari load-and-click sweep
- [ ] **Demo video recorded** per `docs/launch/demo-video-script.md`
- [ ] **Show HN / Product Hunt / Reddit / LinkedIn / Twitter-X posts** per launch checklist
- [ ] **Agentics Foundation beta share** with 20-50 users
- [ ] **AISP community campaign** (1-2 weeks marketing)

---

## Velocity & risk notes

**Velocity:** Per CLAUDE.md "Effort Estimation Rule" the codebase observed velocity is ~6 phases sealed per day. P105-P109 is 5 sprints; honest estimate **~1.5 working days at sustained quality**. Quality discipline (ADR + tests + EOP triplet) is the brake — do not compress.

**Risk: P106 migration 006.** Item #24 (response_summary 3-way overload) requires migration 006 if schema-relax route taken. SQLite cannot DROP CONSTRAINT — requires table-rebuild on existing installs. Cleanest path: defer #24 to Tier-2; P106 ships sentinel-string approach for #23 instead (no migration). This is reflected in the LOC budget (~200 not ~250).

**Risk: P108 sql.js bootstrap.** Building the fixture is non-trivial (~80 LOC) but pays back across all future log/persistence specs. First-use risk: WASM cold-start in Node may have quirks. Mitigation: P104 specs already prove the regex pattern works; sql.js is a one-time investment.

**Risk: P109 framer-motion decision.** Item #34 needs owner judgment. If owner says "uninstall," sprint is mechanical. If "wire," another sprint of trace work. Default: P109 ships `tests/p109-docs-ledger-truth-up.spec.ts` with the package.json line marked "decision pending; owner gate" and ADR-138 records both paths.

**Risk: deferred #32 (chatPipeline DDD boundary).** Architecturally smelly; functionally fine. Could be in scope of a P110 (post-RC) DDD-CLEANUP sprint. Not RC-blocking.

**Risk: P107 ChatInput hook extract.** ChatInput is the highest-traffic component in the codebase; extraction must NOT break the live demo. Mitigation: P107 ships extract + corresponding test that renders ChatInput and verifies submit() round-trip. Ensure P67d carry-forward note in CLAUDE.md is updated to "CLOSED at P107."

---

## Closer note

This roadmap is dispatch-ready: each sprint names agents, owned files, LOC budget, and acceptance gate. Dependencies are minimal (P105 must precede P106 because LOG-INTEGRITY's CONTENT_ATOM wire depends on the dead-code-purge path being clean; P107 can run parallel with P106 if agent budget allows; P108 can start anytime; P109 is independent docs-only).

The roadmap closes **38 of the 52 deduplicated items** as swarm work. The remaining 14 are honestly classified: 5 owner-required (live BYOK / STT / Lighthouse / contrast / cross-browser), 8 Tier-2 commercial (post-RC polish), and 1 deferred-by-judgment (chatPipeline DDD refactor; non-blocking).

After P109 close, a tagged v2.0.0-RC1 is owner-runnable: BYOK smoke + demo video + launch posts gate the public release.
