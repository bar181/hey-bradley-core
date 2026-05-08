# A4 — Quality UX Audit

> **Phase:** P114 / FEATURE-AUDIT — A4 (Quality UX)
> **Date:** 2026-05-06 · **Mode:** RESEARCH-ONLY · ≤400 LOC
> **Sibling scopes:** A1 persistence · A2 image+content · A3 BYOK+LLM (no overlap)
> **Audit basis:** read-only inspection of major UI surfaces against ADR-087/091/094/095/102/110/116

---

## Q1 — ChatInput

**File:** `src/components/shell/ChatInput.tsx` (738 LOC; ADR-095 ≤750 cap = **12 LOC headroom**)

**Decomposition state.** Already sub-componentized (P67/P67c) into `ChatInputBar` + `ChatInputQuickActions` + `ChatInputPersonalityPopover` + `ChatThread` + `ClarificationPanel` + `TemplateBrowsePicker`. Orchestrator owns: messages state · typewriter · pendingAispRef · clarification · prefill consumption · canned-fallback executor · multi-step stagger · LLM-pipeline submit (`runLLMPipeline` at line 380). 25 imports in the orchestrator alone (ChatInput.tsx:1-36).

**useChatPipeline hook (CF#10).** Confirmed UNCREATED. `/src/hooks/` contains only `useKeyboardShortcuts.ts` + `useLightbox.ts`; zero `useChatPipeline` references repo-wide. Carry-forward CF#10 still open.

**Submit interaction.** `handleSend` chains `runLLMPipeline → runCannedFallback` (ChatInput.tsx:343-369). Two failure ladders: pipeline `!ok` → assumptions LLM → ClarificationPanel; pipeline absent action → typewriter literal "Hmm, I didn't catch that. Try one of: …" (ChatInput.tsx:362-368). The fallback string is hard-coded prose — not token-driven copy, not localizable.

**Suggestions / autocomplete.** `ChatInputQuickActions` surfaces empty-state hint + `/browse` link + Try-an-Example dialog (ChatInput.tsx:689). No inline autocomplete; no input-as-you-type suggestion.

**Microphone toggle.** Desktop ChatInput has NO mic affordance — listen mode lives in a sibling tab (`LeftPanel.tsx:21-25` 3-tab strip). Mobile only via `MobileLayout.tsx:128-144` floating-mic button. Two mental models: desktop = tab-switch; mobile = inline button.

**Score: 7.5/10.** Working, sub-componentized, AISP/personality/decomp/highlight all wired. **Gaps:** CF#10 hook still open; canned-fallback prose hard-coded; no inline autocomplete; desktop has no inline mic; orchestrator at 738/750 (98% of cap).

---

## Q2 — Builder mode

**Files:** `src/pages/Builder.tsx` (15 LOC) → `AppShell.tsx` (66 LOC) + `MobileLayout.tsx` (177 LOC).

**Layout.** Desktop tri-pane (TopBar + LeftPanel/CenterCanvas/RightPanel + StatusBar; AppShell.tsx:55-65). Mobile = single chat surface (MobileLayout.tsx:108-167). Hidden/visible swap via `hidden md:flex` / `md:hidden` (Builder.tsx:8-12).

**Direct manipulation.** `RealityTab.tsx` ships SectionWrapper hover toolbar (move up/down/delete; lines 222-263) + AddSectionDivider between sections (lines 138-164) + click-to-select-section in right panel (line 211). Hover ring-2 hb-accent/30 (line 267). Floating chip with section name (line 217-220). Section labels source-of-truth = `SECTION_LABELS` (lines 109-126) but the dropdown picker uses `DIVIDER_SECTION_TYPES` (lines 90-107) — both are maintained inline; minor duplication.

**Inline editing.** Right panel = SIMPLE/EXPERT tabs (RightPanel.tsx:73-78). DRAFT (SIMPLE) narrows section types to `hero/blog/footer` only (LeftPanel.tsx:14-19); a non-allowed section forces a fallback selection (LeftPanel.tsx:45-60). Section content edits land via `setSectionConfig` in 17 SimpleTab variants (SimpleTab.tsx:7-21) — comprehensive coverage but every variant is hand-rolled.

**Visual hierarchy.** TopBar → LeftPanel tabs → CenterCanvas tabs → RightPanel tabs = **3 layers of tabs, side-by-side**. Each layer has independent state. A user landing on Builder has 3 + 2 + 6 + 2 = 13 reachable surface affordances at once. Scoring: dense, but every surface has a clear label and tooltip.

**Drag/reorder.** No drag affordance — only chevron-up/down click buttons (RealityTab.tsx:226-249). Disabled-state on edges (line 231/243). Honest UX gap vs Lovable/Bolt.

**Score: 7.5/10.** Solid hover toolbar + add-section affordance; clean DRAFT/EXPERT mode shift. **Gaps:** no real drag-reorder (chevrons only); 13 affordances at once is dense; section-type list duplicated across `DIVIDER_SECTION_TYPES` + `SECTION_LABELS` + simple-variant routing.

---

## Q3 — Preview rendering of 18 section types

**Files sampled:** `RealityTab.tsx:426-628` (renderSection switch; 1-of-18 fallback at line 619); `templates/hero/HeroCentered.tsx` (167 LOC); `templates/columns/ColumnsCards.tsx` (80 LOC); `templates/blog/BlogCardGrid.tsx` (103 LOC); `templates/team/TeamCards.tsx` (76 LOC); `templates/gallery/GalleryGrid.tsx` (84 LOC).

**Variant coverage.** 18 types × 3-4 variants each = ~52 templates registered in `RealityTab.tsx:8-68`. Every type has a default + named variants. `renderSection` uses 18 if-blocks; falls through to a styled `<div />` empty for unknown type (line 619-627) — silently empty, no warning.

**Token compliance.** Sampled templates use `var(--theme-font)`/`var(--theme-accent, #6366f1)` with fallback hex (ColumnsCards.tsx:34, 56-57, 62-65). HeroCentered.tsx:74 builds radial gradient via `var(--theme-accent)`. **Ad-hoc fallback hex** appears in every template (e.g. `#6366f1`, `rgba(99,102,241,0.12)` in ColumnsCards.tsx:34; `#6366f1` in BlogCardGrid.tsx:47, 90). ADR-087 design-token system has 22 new tokens post-P102 but templates use **legacy `var(--theme-*)`** not the canonical `var(--hb-*)` palette. Two parallel token systems.

**Mobile responsiveness.** Templates use `md:` breakpoint (e.g. ColumnsCards.tsx:45 `grid-cols-1 md:grid-cols-3`). HeroCentered.tsx:95 `text-5xl md:text-7xl`. No 375/390/428-specific scaling. ADR-090 mobile redesign focused on shell, not templates — templates are responsive but not mobile-optimized.

**Empty state.** RealityTab.tsx:351-364 ships a centered icon + "Your site preview will appear here" — clean. Section-internal empty state varies: HeroCentered always renders heading even when blank; ColumnsCards line 69-70 ships placeholder "Your First Feature" + "Describe what makes this special" prose — friendly default. BlogCardGrid.tsx:36 silently returns 0 cards if no `blog-article` components exist; no empty CTA.

**Image handling.** Image-onError = `display: none` (HeroCentered.tsx:139; BlogCardGrid.tsx:70). KISS but: no fallback shimmer / no aria-label after fail. ADR-102 lazy-loading not visible on sampled templates — `<img>` tags missing `loading="lazy"` + explicit `width`/`height` attrs (HeroCentered.tsx:134-141; BlogCardGrid.tsx:66-72).

**Score: 7/10.** Wide variant coverage, working visual reveal animations, focus-visible. **Gaps:** `var(--theme-*)` ≠ `var(--hb-*)` token-system fork; ad-hoc hex fallbacks in ~every template; ADR-102 `loading="lazy"` + dims missing in sampled templates (need invariant check); silent fallthrough on unknown section type; BlogCardGrid empty state is invisible.

---

## Q4 — ConversationLogTab drill-down

**File:** `src/components/center-canvas/ConversationLogTab.tsx` (326 LOC) + `RequestDrillDown.tsx` (209 LOC).

**Per-request_id view.** Confirmed: `loadRequestSummaries(30)` (ConversationLogTab.tsx:64-87) pulls distinct request_ids from log_events ORDER BY ts DESC, builds RequestSummary via `buildSummary` (lines 89-106). RequestDrillDown component lists each request with expand/collapse (RequestDrillDown.tsx:111-208). Per-request export to MD (line 121-125; per-request testid `conversation-log-export-md-${requestId}` line 159).

**Latency display.** Two surfaces: row-level `latencyMs` chip (ConversationLogTab.tsx:268 `${latencyMs}ms`); per-request total at RequestDrillDown.tsx:152 `${summary.totalLatencyMs}ms`. Per-stage latency at line 181-183. Cost estimate `latency × $0.0001/ms` (RequestDrillDown.tsx:128, ConversationLogTab.tsx:128) — placeholder; not real BYOK cost.

**AISP atom chips.** ConversationLogTab.tsx:275-278 renders `aispAtoms` array as monospace chips. Soft-read via `t as Record<string, unknown>` cast (line 254-256) — Carry-forward acknowledged in trailing comment (line 322-326). RequestDrillDown.tsx:184-188 surfaces AISP Σ trace per stage **only when `expert` mode** (gated by `useUIStore.rightPanelTab === 'EXPERT'` at line 116). 4 stages have hardcoded Σ snippets (`AISP_TRACE_BY_STAGE` lines 10-15) — INTENT/DECOMP/SELECTION/PATCH only; CONTENT/ASSUMPTIONS/PROCESS/DDD/AGENT have NO Σ trace.

**DECOMP todo render.** ConversationLogTab.tsx:282-297 ships a `<details>` collapsible with verb/target/details/confidence/status grid — runtime-guarded by `'todoTraces' in t` (line 257). Honest carry-forward documented at lines 317-326: ConversationTurn type widening still pending.

**KISS review row.** RequestDrillDown.tsx:174-197 surfaces a P1/P2/P3 severity badge tuple when `eventData.kind === 'kiss-review'` (P98 / ADR-129 wire). Color-coded: P1 red `#ef4444`, P2 amber `#f59e0b`, P3 muted. Pass/fail badge at line 195.

**Filters.** ConversationLogTab.tsx:177-214 — sessionId / provider / personality text inputs + clear button. No date range; no "since last clear" affordance.

**Score: 8/10.** Most-comprehensive surface in the app. Filtering, drill-down, per-request export, AISP trace, KISS row, latency. **Gaps:** `as unknown as Record<string,unknown>` casts (lines 254-256, 282) signal type-debt; AISP_TRACE_BY_STAGE only covers 4 of 13 event_types — half the AISP atoms invisible in trace; cost estimate is placeholder ($0.0001/ms heuristic, not real BYOK token billing).

---

## Q5 — EXPERT mode (5 center tabs)

**File:** `src/components/center-canvas/TabBar.tsx` (77 LOC) + `CenterCanvas.tsx` (62 LOC) + tab-specific files.

**Tab roster.** TabBar.tsx:11-18 declares 6 tabs (universal Preview + EXPERT-gated Blueprints/Resources/Pipeline/Log + universal Data). Filter via `tab.expert ? isExpert` (line 28). Active-tab fallback (lines 31-35) snaps to Preview if hidden.

**Spec primary tab.** Blueprints tab is auto-positioned **first** after Preview (TabBar.tsx:13 line ordering) per ADR-110/Sprint L. Comments at TabBar.tsx:9-10 confirm "Blueprints (XAI_DOCS) promoted to FIRST EXPERT position … the spec is the moat made legible". Spec-changed accent dot indicator (lines 61-67) — visible when `specHasUnseenUpdate`. Auto-open on first patch (CenterCanvas.tsx:20-39).

**Tab implementations.**
- **Preview** = `RealityTab` — graded above
- **Blueprints** = `XAIDocsTab.tsx` (265 LOC) — 7 sub-tabs: North Star/Architecture/Build Plan/Features/Specifications/AISP/JSON. Per-page scope dropdown when multi-page (line 169-184). AISP syntax highlighting inline (lines 37-117 — duplicate of AISPTab's highlighter). "How to use" banner only on Build Plan tab (lines 213-224); "AISP info banner" on AISP tab (225-235). Empty state at lines 236-242.
- **Resources** = `ResourcesTab.tsx` (559 LOC) — 4 sub-tabs Templates / AISP Guide / Media / Wiki. SECTION_TYPES array hardcoded to **15 entries** (lines 25-43) — DRIFT vs canonical 18; 3 missing (case-study + contact-form + blog).
- **Data** = `DataTab.tsx` (449 LOC) — JSON editor with CodeMirror; Zod-validated. EXPERT-only inline edit; DRAFT = read-only.
- **Pipeline** = `WorkflowTab.tsx` (84 LOC) — **HARD-CODED stub data**. 6 fixed steps + 7 fixed log lines (lines 10-33). No live data binding to log_events. Comments do not declare "stub"; user reading the surface would believe it's live.
- **Log** = `ConversationLogTab` — graded above

**AISP visibility per ADR-110.** AISP atom labels appear in: Blueprints AISP tab + Log per-stage trace (EXPERT only) + ConversationLog `aispAtoms` chips (EXPERT only). NOT in Preview. NOT in Data. ADR-110's "dual-view default" partially honored.

**Score: 7/10.** Good tab discipline, spec-primary positioning correct, EXPERT/DRAFT gating clean. **Gaps:** WorkflowTab is a hard-coded stub with no live wire (P100 W2 added log_events but Pipeline tab never adopted them — leaky abstraction); ResourcesTab SECTION_TYPES array is 15-of-18 (drift vs ADR-100 canonical); AISP highlighter logic duplicated between AISPTab.tsx + XAIDocsTab.tsx (~80 LOC each); 4 of 13 event_types have AISP Σ traces (ADR-110 dual-view incomplete).

---

## Q6 — Mobile UX

**Files:** `MobileLayout.tsx` (177 LOC) + `MobileListenFullscreen.tsx` (124 LOC) + `MobileSpecBottomSheet.tsx` (245 LOC) + `MobileMenu.tsx` (183 LOC) + `MobileFirstRunCard.tsx` (80 LOC).

**Single chat surface.** Per ADR-090 (P69 / OC-5). Single ChatInput rendered (MobileLayout.tsx:122). Inline mic floats bottom-right (lines 128-144). "See Specs" affordance bottom-center (lines 146-166). Hamburger top-left (lines 79-94). 4-affordance layer: hamburger / chat / mic / specs.

**Touch target floor.** Inline mic = `min-h-[44px] min-w-[44px]` (line 135). MobileListenFullscreen mic toggle = `w-40 h-40` (line 81; way over floor). Done button = `min-h-[44px] min-w-[44px]` (line 113). MobileSpecBottomSheet export = 44/44 (line 231). All hit ADR-102 floor.

**Bottom sheet drag refinement (carry-forward).** MobileSpecBottomSheet.tsx:69-89 ships a basic touch delta-y heuristic: `<-40px` = expand to full; `>40px` = collapse to peek; second `>40px` from peek = close. **No velocity tracking; no rubber-band; no momentum.** Comment at lines 69-70 acknowledges "basic delta-y heuristic". Honest gap.

**Listen mode mobile fullscreen.** MobileListenFullscreen.tsx:1-124 — fixed inset, ESC-close, recording toggle, transcript live region. **Web Speech wire-up DEFERRED** per the file header comment (lines 9-12): "actual STT pipeline lives in src/components/left-panel/listen/useListenPipeline.ts; consuming it here is a future task (OC-CLEANUP / OC-12)". Display-only: shows "Listening..." vs "Tap mic to start" — no real STT. **Open carry-forward:** MobileListenFullscreen still shows fake transcript.

**Tokenization (P88 / ADR-113).** Confirmed via `var(--hb-listen-bg)` + `var(--hb-listen-fg)` + `var(--hb-listen-accent)` (MobileListenFullscreen.tsx:62, 82, 84). MobileSpecBottomSheet tokens are **HARD-CODED HEX** (lines 129, 152, 165, 168, 204, 232) — `#faf8f5`, `#6b5e4f`, `#2d1f12` are direct values, not CSS variables. Token discipline mixed.

**Mobile playwright projects.** `playwright.config.ts:24-43` — 3 projects mobile-375/390/428 each opt-in via `testMatch: /p108-mobile-smoke\.spec\.ts/`. Only that one spec runs mobile; cumulative regression stays Desktop. Mobile coverage is **smoke only** (10 cases × 3 viewports).

**Score: 7/10.** Touch targets pass, layout is clean, ADR-090 honored. **Gaps:** MobileListenFullscreen STT not wired (still fake "Listening..."); MobileSpecBottomSheet uses hard-coded hex (~6 occurrences) instead of tokens; bottom-sheet drag is delta-only, no velocity/momentum; mobile test coverage is 1 smoke spec, no behavioral.

---

## Q7 — Onboarding flow

**File:** `src/pages/Onboarding.tsx` (893 LOC).

**Routing chain.** ModeSelectorCard (only when no `appMode` AND no saved project; lines 547-563) → PersonalityPicker (only when not asked AND no persisted; lines 565-599) → main project picker (lines 602-891). Three-step gate.

**handleStartNew (line 535-540).** Applies SaaS theme as default → persists via STORAGE_KEY → navigate('/builder'). Fast (4 statements) but **opinionated**: every Start-New defaults to `applyVibe('saas')`. A florist user would see SaaS-themed sections initially.

**handleThemeSelect (line 500-506).** `applyVibe(slug) → persist → navigate`. 3 statements; clean.

**handleExampleSelect (line 508-517).** `loadConfig → persist → setSelectedContext(hero) → navigate`. Auto-selects hero as the first edit target — good Quickstart cue.

**Persona-fit copy.** Hero h1: "What will you build today?" (line 663) — generic. The Welcome.tsx hero is more specific ("Messy ideas → enterprise specs, instantly"). **Two homepages, two voices.**

**Quickstart speed.** 4 example cards default-rendered (defaultExamples lines 487-495); rest collapsed under "More examples" toggle (lines 815-851). Themes show all 21 in a 2/3-col grid (lines 875-883) — reasonable density. **No filter / search / category** — user must scroll to find a category. ResourcesTab has search; Onboarding doesn't.

**LLM banner.** Lines 627-639: shows "Using simulated responses — add an API key in Settings to enable real AI" when `!hasKey`. Dismissable + persisted. Good.

**Mode hint banner.** Lines 640-660 — per-mode dismissable banner pointing at /planning or /agentics. Three banner copies hardcoded at lines 28-32. Clean.

**FutureCapabilityCard.** Lines 353-376 — 5 cards, 2 marked `available={true}` (Brand Identity / Design Guidelines), 3 marked `available={false}` (Spec Upload / GitHub Connect / Project History). **"Project History" being marked unavailable here while Onboarding ALSO renders saved-project cards (lines 763-773) is contradictory.** A returning user sees "Project History" greyed out yet sees their projects above.

**Score: 7/10.** Three-step gate works, all handlers ≤10 LOC, banners are well-behaved. **Gaps:** "What will you build today?" prose ≠ Welcome.tsx voice (two homepages); Start-New defaults to SaaS for everyone; no filter/search on examples or themes; FutureCapabilityCard "Project History unavailable" contradicts saved-project rendering 100 lines above.

---

## Q8 — Welcome page

**File:** `src/pages/Welcome.tsx` (259 LOC).

**Hero.** Lines 37-77 — eyebrow + h1 "Messy ideas → enterprise specs, instantly." + subhead + AISP trace teaser line + 3 CTAs (Start with your idea / Explore AISP / Read the AISP spec). Solid framing.

**AISP trace teaser.** Line 49-52: monospace "AISP trace: INTENT → ASSUMPTIONS → DECOMP → SELECTION → CONTENT → PATCH → spec." — 6 atoms shown, **3 missing (PROCESS / DDD / AGENT)**. The ChatInput surface attaches all 5 baseline atoms; this teaser shows 6 (5 + DECOMP). Welcome is one atom-cycle behind reality.

**Stats bar.** Lines 80-88 — `~1491+ tests passing` · `128 ADRs` · `51 examples` · `12 blog posts` · `composite 86.7/100`. **DRIFT vs current state:** P113 has 132 ADRs / 56 examples / ~1582+ tests. Welcome stats trail by 4 ADRs and 5 examples. P101 carry-forward closure (W2 fix-pass corrected `701→1162+`) — drift returns at every P-bump.

**Sections.** 7 sections (Hero, Stats bar, "55% problem" article, Build snapshot, Three Modes, "What you get", "Open core vs commercial", Blog preview, Closing CTA, Footer). Each `max-w-3xl mx-auto` (lines 91, 110, 164, 181) — readable column.

**Three Modes.** Lines 144-161 — Builder / Chat / Listen cards. Mobile snap-list at `max-sm:` breakpoint (line 145). All 3 cards link to `/new-project`. Visual hierarchy clean.

**Primary/secondary CTAs.** Hero lines 53-77 — 3 CTAs: primary warm bg "Start with your idea" + secondary outline "Explore AISP" + tertiary muted text "Read the AISP spec". Closing CTA lines 222-243 — 2 CTAs: warm bg "Try the open source version" + outline "Open core on GitHub". Consistent.

**"Capstone" framing.** Eyebrow line 39 mentions "Harvard ALM Capstone" + footer line 248 mentions "Harvard ALM Capstone — Digital Media Design — May 2026". For a capstone-aware audience this is the differentiator; for a non-academic visitor it may signal "research project" not "product".

**Body copy.** "55% problem" article (lines 91-109) is the strongest long-form on the site. Cites "40-65% of implementation intent is lost". Names the bottleneck. Don Miller-grade hook. **Recently P74 / OC-DECOMP brutal review scored Welcome at 73-76/100; Capstone-grade copy here lifts it.**

**AISP trace clickability.** The teaser (line 50-51) is **not clickable**. A user curious about INTENT → ASSUMPTIONS has nowhere to drill down on this page. Surrounding "Explore AISP" CTA at line 62-67 routes to `/aisp` page — works but the trace itself is decorative.

**Score: 8/10.** Strongest single page in the marketing site. Hero framing + 55% prose are publishable copy. **Gaps:** stats bar drifts at every phase bump (touch in P113, drifts again at P115); AISP trace teaser shows 6 atoms when 8 ship (PROCESS/DDD/AGENT missing); trace teaser is decorative not clickable; "Capstone" framing may misposition for non-academic visitors.

---

## Composite UX score

| Surface | Score |
|---|---|
| Q1 ChatInput | 7.5/10 |
| Q2 Builder mode | 7.5/10 |
| Q3 Preview rendering (18 sections) | 7.0/10 |
| Q4 ConversationLogTab | 8.0/10 |
| Q5 EXPERT mode (5 tabs) | 7.0/10 |
| Q6 Mobile UX | 7.0/10 |
| Q7 Onboarding flow | 7.0/10 |
| Q8 Welcome page | 8.0/10 |
| **Average** | **7.4/10** |

Weakest = Q3/Q5/Q6/Q7 (7.0). Strongest = Q4/Q8 (8.0). The audit composite is below the post-P102 site target (78/100 = 7.8) — three category drag-downs: token-system fork (Q3), stub-pipeline tab (Q5), STT not wired (Q6).

---

## Master fix list

| # | Fix | Surface | LOC est | Priority |
|---|---|---|---|---|
| F1 | Welcome stats bar truth-up: `~1491+`→`~1582+` / `128`→`132` / `51`→`56` | Welcome.tsx:82-86 | 5 | P1 |
| F2 | Welcome AISP trace add PROCESS/DDD/AGENT (6→8 atoms) | Welcome.tsx:51 | 3 | P1 |
| F3 | ResourcesTab SECTION_TYPES drift 15→18 (case-study + contact-form + blog) | ResourcesTab.tsx:25-43 | 12 | P1 |
| F4 | WorkflowTab live-wire to log_events (replace stub data) | WorkflowTab.tsx:10-33 | 60 | P2 |
| F5 | AISP_TRACE_BY_STAGE expand 4→9 stages (CONTENT/ASSUMPTIONS/PROCESS/DDD/AGENT Σ) | RequestDrillDown.tsx:10-15 | 15 | P2 |
| F6 | MobileSpecBottomSheet tokenize hard-coded hex (`#faf8f5`/`#6b5e4f`/`#2d1f12` → `var(--hb-*)`) | MobileSpecBottomSheet.tsx:129,152,165,204,232 | 8 | P2 |
| F7 | useChatPipeline hook extraction (CF#10) — moves runLLMPipeline + multi-step + executeAction out of orchestrator | NEW src/hooks/useChatPipeline.ts | ~250 | P2 |
| F8 | Onboarding hero copy align with Welcome voice ("What will you build today?" → spec-workbench framing) | Onboarding.tsx:663-668 | 4 | P3 |
| F9 | Onboarding "Project History unavailable" contradiction with saved-project cards | Onboarding.tsx:371-376 | 4 | P3 |
| F10 | BlogCardGrid empty-state CTA when 0 articles | BlogCardGrid.tsx:36 | 6 | P3 |
| F11 | renderSection unknown-type WARNING (currently silent fallthrough) | RealityTab.tsx:619-627 | 4 | P3 |
| F12 | AISPHighlighted dedup: extract shared component used by both AISPTab + XAIDocsTab | NEW src/components/ui/AISPHighlighted.tsx | ~80 + 2 deletions | P3 |
| F13 | Section drag-reorder (replace chevron up/down with HTML5 drag) | RealityTab.tsx:222-263 | ~40 | P3 |
| F14 | Image lazy-loading + dims on sampled templates (HeroCentered/BlogCardGrid/etc) — ADR-102 compliance | 5 templates × 3 LOC | 15 | P3 |
| F15 | Bottom-sheet drag velocity/momentum tracking | MobileSpecBottomSheet.tsx:69-89 | 25 | P3 |
| F16 | MobileListenFullscreen STT wire-up (consume useListenPipeline) | MobileListenFullscreen.tsx | ~35 | P3 |
| F17 | DataTab + Onboarding example/theme search/filter input | Onboarding.tsx:721-755 + DataTab | ~30 | P3 |
| F18 | Token-system convergence audit `var(--theme-*)` ↔ `var(--hb-*)` (research only — owner decision before fix) | Repo-wide | research only | P3 |

**Total P1: 20 LOC across 3 fixes.** Easy wins; close drift in one commit.
**Total P2: ~333 LOC across 4 fixes.** Real architectural lifts (CF#10 + WorkflowTab live + AISP completeness + tokenization).
**Total P3: ~243 LOC across 11 fixes.** Polish; deferable to post-P114.

---

## Verdict

**Quality UX is at 7.4/10 composite — competitive but not winning.** The strongest surfaces (ConversationLogTab + Welcome) hit 8.0; the weakest 4 surfaces all sit at 7.0 with documented carry-forwards. **No surface is broken; every weak surface has a known fix that is honest about its deferral.**

The most visible quality drags are:
1. **WorkflowTab is a stub** — declared "Pipeline" surface ships hard-coded data while ADR-126 + log_events + RequestDrillDown ship live data ten lines away. Closing F4 alone moves Q5 from 7.0 → 8.5.
2. **ResourcesTab section-types drift** — 15 of 18 documented while ADR-100 ships 18. Promotes ADR-137-style drift guard to a quality concern. F3 closes in 12 LOC.
3. **Welcome stats drift at every P-bump** — F1 is the cheapest 5-LOC fix on the list and is auto-stale within 2 phases. Owner-action repeatable; a CI guard like P109's section-enum-drift-guard for `STAT_NUMBERS` would lock it.

**Carry-forwards already on the registry that this audit confirms still open:**
- CF#10 useChatPipeline hook extraction (orchestrator at 738/750 LOC; 12 LOC headroom on ADR-095)
- CF#5 STT calibration (MobileListenFullscreen still fake)
- Bottom-sheet drag refinement (no velocity)
- ConversationTurn type widening (Record<string, unknown> casts)

**Recommendation for Wave 2 dispatch:** Ship F1+F2+F3 (P1, 20 LOC, 3 surfaces) as a single closer commit alongside the persistence fix from A1. Defer F4-F7 to a P2 dispatch wave. Defer F8-F18 as P3 carry-forwards.

**Composite UX after F1-F3:** Q3 7.0 → 7.0 (no change), Q5 7.0 → 7.5 (ResourcesTab enum closure), Q8 8.0 → 8.5 (Welcome stats + atoms truth-up). New average **7.5/10**. After F4-F7 (P2): Q5 → 8.5; new average **7.7/10** — close to ADR-094 8.5 floor.
