# Project Configuration — bar181/hey-bradley-core

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## Effort Estimation Rule (post-P19 reality check)

- **Target multi-hour shifts, NOT multi-day shifts.** Observed velocity through P19: ~6 phases sealed per day. Original phase budgets (4-6 days each) were 10-50× conservative.
- Phase plans should carry both the original estimate AND a velocity-corrected estimate ("@vel"). See `plans/implementation/mvp-plan/STATE.md` §2.
- Re-budget at the end of each phase based on actual elapsed time.
- Quality discipline (tests, ADRs, persona scoring, brutal reviews) is the brake — do NOT compress to hit velocity. Velocity emerges when discipline holds.
- Default sprint sizing at velocity: a 3-phase sprint (P21-P23 etc.) ≈ 1 working day; a 5-phase sprint (P27-P31) ≈ 1-2 working days.

## Standard Phase Process (always-do)

Every phase, in order, no exceptions:

1. **Phase execution** — code/docs per the phase plan
2. **End-of-phase** — `08-master-checklist.md` ticks + `STATE.md` row update + `phase-N/session-log.md` results table + `phase-N/retrospective.md` (what to keep / drop / reframe)
3. **Review with fixes** — post-seal review pass; address must-fix items in `fix-pass-N` commits before next phase starts
4. **Preflight for next phase** — scaffold `phase-(N+1)/preflight/00-summary.md` + `checklist.md` + `MEMORY.md`

**Optional EXTRA for major phases (composite-impacting or capstone-relevant):**

5. **Deep-dive brutal review** — 4 parallel reviewer perspectives (UX / Functionality / Security / Architecture) writing a single chunked report at ≤600 LOC per file; recursive ≤3 passes; each pass identifies blockers → fix → re-review until clean
6. **Persona re-score** — Grandma / Framer / Capstone scored against the rubric; record in `phase-N/personas.md`

The standard 1-4 is non-negotiable. Steps 5-6 are decided per-phase by the owner.

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Project Status

- **Current Phase:** P80 / OC-15 SEALED — 3-agent parallel dispatch (Agentic-Product Templates). Templates 37 → 41 (+4 vertical-positioned: ai-agent-marketplace, ai-coding-copilot, ai-workflow-platform, ai-support-copilot). ADR-105 Accepted (cross-refs ADR-096/098/091). Closes Gap 6 (P2 high-leverage) from `plans/strategic-reviews/2026-05-01-comprehensive-review-3-gaps-resolutions.md`; +1 buffer over the literal floor of 40. Predecessor: P79 / OC-14 SEALED — 4-agent parallel dispatch (Page-Aware Chat Pipeline POC). **A1 (audit)**: `plans/implementation/phase-79/01-pipeline-audit.md` (READ-ONLY artifact; classifies `chatPipeline.ts:128` matcher input + `:354` `applyTemplateMatch` call as page-naïve; recommends integration point post-DECOMP, pre-applyPatches). **A2 (PageIterator pure module)**: `src/contexts/intelligence/pageIterator.ts` (NEW; ≤180 LOC) — exports `getActivePage(config, activePageId)` + `iteratePages(config)` + `prefixPatchPaths(patches, scopeRoot)`; pure functions, no store imports, no input mutation. **A3 (chatPipeline wire)**: `chatPipeline.ts` (EDIT, surgical) — single `useUIStore.getState().activePageId` read at submit-entry; threads `PageScope = { sections, scopeRoot }` through to apply sites; `prefixPatchPaths(patches, scopeRoot)` immediately before each `applyPatches(...)` call; matcher input scoped to active-page sections; single-page mode (`scopeRoot === ""`) byte-equivalent preserved. **A4 (Closer)**: ADR-104 Accepted (75 LOC ≤ 120 cap; cross-refs ADR-085/086/099/053); `tests/p79-page-aware-pipeline.spec.ts` (NEW; 5 describes / 14 tests; existsSync guards on A2/A3 surfaces; hard-gate on ADR + EOP triplet); EOP triplet + this CLAUDE.md sync. **~942+ cumulative PURE-UNIT GREEN** (was ~930+; +~12 new). Closes the latent page-naïve patch-routing bug surfaced by ADR-103 (P78 / OC-11): user adds Page 2, switches active, types "make hero brighter" → patches now correctly target Page 2's hero (was Page 1's pre-P79). Honest declarations: page-aware INTENT_ATOM target resolution DEFERRED to P82 OC-CLEANUP; DECOMP_ATOM page-targeting verbs DEFERRED to P82; iteratePages adoption in export pipeline DEFERRED (A5/P78 export already handles per-page emission directly via `shareSpecBundle.ts:bundle.pages[]`). Predecessor: P78 / OC-11 SEALED — 10-agent multi-track parallel dispatch. **Track A (OC-DECOMP)**: ADR-099 Accepted; `decompAtom.ts` (NEW 226) — DECOMP_ATOM Crystal Atom with deterministic conjunction-split + verb/target lookup tables + 0.9/0.6/0.3 confidence ladder; `todoExecutor.ts` (NEW 167) — routes Todo[] through matchTemplates → applyTemplateMatch with applied/deferred/skipped status; chatPipeline.ts wire (+26 LOC) post-classifyRoute pre-matchTemplates, gates on `todos.length > 1 && confidence ≥ 0.7`. **Track B (Highlights/Log)**: `highlightExtractor.ts` (NEW 81) — 5-25 word truncation with sentence-boundary preference; ChatThread shows highlight + "(see full in log)" footer chip; ConversationLogTab now full-detail surface with Show full/Show highlight per-row toggle + latency_ms + AISP atom chips + decomp-trace render guard. **Track C (Demo)**: `FullSiteSimulator.tsx` (stub→595 LOC) — 10-step coffee-subscription scripted listen-mode flow at `/demo/full-site` with progressive preview, theme-earth swap, typography upscale, gallery, testimonials, CTA, 5-atom spec bundle. **Track D (Brutal-Honest Comprehensive Review)** — 3 chunked Explore docs at `plans/strategic-reviews/2026-05-01-comprehensive-review-{1-features,2-design-ux,3-gaps-resolutions}.md`: features 82.1/100 (vs SOTA 80); design+UX 74.9/100 (4-persona aggregate; Capstone 76 / Grandma 72 / Framer 71 / Lars 70); 25 gaps (5 P1 + 16 P2 + 4 P3); 88% sprint coverage; post-P84 projected 70-73/100. **Track E (Closer)**: `tests/p74-decomp-and-highlights.spec.ts` (NEW; 30 cases / 30/30 GREEN; 1 inline regex fix at seal — Status markdown-bold tolerance) + EOP triplet. **~873+ cumulative PURE-UNIT GREEN** (was ~843; +~30 new). 478/478 GREEN across full session OC chain (P62-P74). Pre-staged FullSiteSimulator stub + route in main.tsx (mirrors P66 pattern; prevented A6/main.tsx collision). Honest declarations: ConversationTurn type widening deferred; LLM-enriched decomposition deferred (rules-only baseline ships); multi-turn requirements accumulator deferred. Predecessors: P73 / OC-TPL-AUDIT (843 GREEN); P72 / OC-TI; `plans/strategic-reviews/2026-05-01-template-audit.md` scored 37 starter packs (avg 7.2/10) + audited 3 P72 libraries; identified bottom-5 (`blank` 3, `kitchen-sink` 4, `blog-standard` 6, `api-docs-landing` 6, `launchpad` 6) + STRUCTURAL GAP (missing `exampleQueries` across all 42 entries) + typography drift (Georgia in law-firm, DM Sans in blog-standard). Phase 2 (5-agent fix dispatch): A1 fixed bottom-5 + law-firm typography (6 JSON files surgical); A2 expanded `themeLibrary.ts` **18 → 21 themes** (added `dark-feminine`/`industrial-modern`/`cozy-maximalist`) + `ThemeTemplate.exampleQueries: readonly string[]` REQUIRED + 18-entry backfill; A3 expanded `sectionLibrary.ts` **12 → 15 arrangements** (added `course-landing`/`booking-calendar`/`newsroom`) + `SectionTemplate.exampleQueries` REQUIRED + 12-entry backfill; A4 expanded `contentLibrary.ts` **12 → 15 styles** (added `instructional`/`punchy-social`/`sales-pressure`) + `ContentTemplate.exampleQueries` REQUIRED + 12-entry backfill; A5 shipped `tests/p73-template-audit-fix.spec.ts` (17 cases across 5 describe blocks) + EOP triplet (02-post-review + session-log + retrospective) + this CLAUDE.md sync. **All 51 library entries now carry `exampleQueries` — libraries are LLM-training-ready for future HNSW activation.** Templates count UNCHANGED at 37 (audit chose quality lift over quantity); +3 to reach literal 40+ remains carry-forward as "OC-4 round 3". **~838+ cumulative PURE-UNIT GREEN** (was ~823; +~17 new from `tests/p73-template-audit-fix.spec.ts`). Predecessors: P72 / OC-TI; P70/P71 (~774 GREEN); P68/P69 (`753beb5`); P67c (`8d46ddf`); P67b (`37933e8`); P67 (`17c9635`); P66 Polish Wave 1 (`34699d4`); P66/OC-MKTG (`62af4a4`); P65b (`e7b6af2`); P65 (`261d840`); P64 (`0701b37`); P63 (`ac6f973`); P62 (`6a86d5c`). Open planning: P61 (`64e305c`/`b1a9652`) + P61b (`8025878`). ADR ledger: ADR-087 Design Tokens; ADR-088 Mode Architecture; ADR-089 Agentics Data Model; ADR-090 Mobile UX Redesign (P69 / OC-5); ADR-091 Canonical Component Quality; ADR-092 Polish Sprint Architecture; ADR-093 Component Decomposition Standard; ADR-094 Professional Grade Standard; ADR-095 Library-Wide Polish Standard; ADR-096 Template Library Expansion (P68 / OC-4); ADR-097 Blog Content Strategy (P71 / OC-13); **ADR-098 Template Intelligence Architecture (P72 / OC-TI)**; **ADR-099 Decomposition Atom (P74 / OC-DECOMP)**. ADR-076 SUPERSEDED. (P73 ships no new ADR — audit doc + fix sprint live under `plans/strategic-reviews/2026-05-01-template-audit.md` + `plans/implementation/phase-73/`. P74 brutal-honest comprehensive review at `plans/strategic-reviews/2026-05-01-comprehensive-review-{1-features,2-design-ux,3-gaps-resolutions}.md`.) Carry-forward: Web Speech wire-up for MobileListenFullscreen; bottom-sheet drag refinement; useChatPipeline hook (P67d); OC-CLEANUP marketing-site mobile (ADR-090 decision 5); build-step RSS generator (replaces static stub); +2 stretch posts to reach literal 12+; ~~OC-DECOMP~~ **CLOSED at P74** (rules-only baseline; LLM-enriched decompose() carry-forward); **OC-TI Wave 2 (matcher UI surface — ranked candidates in chat thread)**; **multi-turn requirements accumulator (across-turn state)**; **ConversationLog persistence to DB**; **HNSW activation (Tier-2 commercial)**; **chatPipeline full wire if A4 deferred**; **A1 P72 ruvector backfill**; **OC-4 round 3 (+3 templates → 40+)**. NEXT: P82 OC-CLEANUP (page-aware INTENT_ATOM + DECOMP page-targeting + mobile drawer page selector — three deferred P1s converge) / OC-TI Wave 2 / OC-12 live-LLM — owner choice per the 25-gap roadmap.
- **Codebase:** ~63K total lines (TS/TSX/JSON/MD, excl. node_modules); ~28,400 lines TS/TSX across 227 source files
- **Themes:** 12 (agency, blog, creative, elegant, minimalist, neon, personal, portfolio, professional, saas, startup, wellness)
- **Examples:** 41 (17 baseline + 3 OC-3 + 11 OC-4: 4 healthcare/wellness + 4 creator/personal + 3 dev-tools/OSS + 4 OC-15 agentic-product: ai-agent-marketplace + ai-coding-copilot + ai-workflow-platform + ai-support-copilot)
- **Section Types:** 18 (includes blog + case-study + contact-form via ADR-100)
- **Images:** 300 in media library catalog, 13 image effects (8 core + 5 wow-factor)
- **Website Pages:** 4 (About, Open Core, How I Built This, Docs) — all with real content
- **Blog Posts:** 10 (4 P58 baseline + 6 P71 expansion per ADR-097; voice + length + cadence + distribution standards codified)
- **Chat Commands:** 15+ simulated requirements (includes 5 compound commands)
- **Listen Demos:** 4 distinct site types
- **Spec Generators:** 6 with design specs, cross-references, effects info
- **Blueprints:** 7 sub-tabs (North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON)
- **Center Tabs (EXPERT):** 5 (Preview, Blueprints, Resources, Data, Pipeline)
- **Capabilities:** Multi-page support, ZIP export, blog section type, AISP Crystal Atom output, real LLM adapters (Claude/Gemini/OpenRouter), Web-Speech STT (PTT), Template Intelligence (3-layer: theme/section/content, ADR-098 — P73 audited + `exampleQueries` shipped on all 51 entries), **DECOMP_ATOM + todoExecutor (front-of-pipeline multi-clause splitter ahead of matcher; ADR-099 — P74 / OC-DECOMP)**, **highlight surface on chat/listen + ConversationLogTab full-detail surface (P74 / Track B)**, **FullSiteSimulator 10-step scripted listen-mode demo (P74 / Track C)**, **case-study + contact-form section types (18 total via ADR-100; P75 / OC-7)**, **spec export quality standard (ADR-101 — P76 / OC-9: canonical export modal CTAs + valid HTML5 static export + versioned AISP filenames + ≥3-heading spec generators)**, **perf+a11y baseline (route lazy + img lazy/dims + aria-labels on icon buttons + bundle ≤800KB; ADR-102 — P77 / OC-10)**, **multi-page MVP wire — page selector UI + per-page AISP export + page-scope spec view (ADR-103 — P78 / OC-11)**, **page-aware chat pipeline (pageIterator module + chatPipeline scopeRoot wire; ADR-104 — P79 / OC-14)**, **agentic-product template family (ADR-105 — P80 / OC-15: 4 vertical-positioned templates closing Gap 6)**
- **Template Intelligence Libraries (P73 / OC-TPL-AUDIT):** **21 themes** (was 18; +`dark-feminine`/`industrial-modern`/`cozy-maximalist`) · **15 section arrangements** (was 12; +`course-landing`/`booking-calendar`/`newsroom`) · **15 content styles** (was 12; +`instructional`/`punchy-social`/`sales-pressure`). All 51 entries carry `exampleQueries: readonly string[]` REQUIRED — LLM-training surface ready for Tier-2 HNSW activation.
- **ADRs:** 105 Accepted on disk (P80 / A3 contribution in this session). Range ADR-045 through ADR-105. Recent additions: ADR-082 (Open Core RC, P58), ADR-083 (Test Library Architecture, P59), ADR-084 (Comprehensive QA Architecture, P60), ADR-085 (Multi-Page MVP, P61), ADR-086 (Process Pages content/runtime split, P61), ADR-087 (Design Token System, P65 / OC-2.5), ADR-088 (Mode Architecture, P63 / OC-2), ADR-089 (Agentics Data Model, P63 / OC-2), ADR-090 (Mobile UX Redesign, P69 / OC-5; supersedes ADR-076), ADR-091 (Canonical Component Quality, P65b / OC-2.5 Wave 2), ADR-092 (Polish Sprint Architecture, P66 Wave 1), ADR-093 (Component Decomposition Standard, P67 / Polish Wave 2), ADR-094 (Professional Grade Standard, P67b / Close the Gap), ADR-095 (Library-Wide Polish Standard, P67c), ADR-096 (Template Library Expansion Standard, P68 / OC-4), ADR-097 (Blog Content Strategy, P71 / OC-13), ADR-098 (Template Intelligence Architecture, P72 / OC-TI), ADR-099 (DECOMP_ATOM Decomposition Atom, P74 / OC-DECOMP — multi-clause splitter Crystal Atom; cross-refs ADR-053/057/060/064/098), ADR-100 (Section Type Completeness, P75 / OC-7 — case-study + contact-form widen enum to 18; cross-refs ADR-079/091/096/098), ADR-101 (Spec Export Quality Standard, P76 / OC-9 — canonical export modal CTAs + valid HTML5 static export + versioned AISP filename pattern + ≥3-heading spec generators; cross-refs ADR-081/082/091/094), ADR-102 (Performance + Accessibility Standard, P77 / OC-10 — heavy routes lazy via React.lazy+Suspense + all `<img>` loading="lazy" with explicit dims + aria-labels on icon-only buttons + bundle gzip cap ≤800KB; cross-refs ADR-090/091/094), **ADR-103 (Multi-Page MVP Wire, P78 / OC-11 — `activePageId` in uiStore + PageSelector tabs strip in left panel + per-page bundle.pages[] emission + static-html `<nav class="hb-page-nav">` + backward-compat single-page mode unchanged; cross-refs ADR-085/081/091)**, **ADR-104 (Page-Aware Chat Pipeline, P79 / OC-14 — pageIterator module + scopeRoot path prefix at chatPipeline apply sites; single-page byte-equivalent preserved; cross-refs ADR-085/086/099/053)**, **ADR-105 (Agentic-Product Templates, P80 / OC-15 — 4 vertical-positioned templates: ai-agent-marketplace + ai-coding-copilot + ai-workflow-platform + ai-support-copilot; cross-refs ADR-096/098/091)**. ADR-076 (Sprint J 3-tab nav) SUPERSEDED by ADR-090. Numbering has 11 documented gaps (002-004, 006-009, 034-037) plus 3 stub-then-superseded duplicates (ADR-051/052/053 each have a P21 stub + a later Accepted file under the same number; see `docs/adr/README.md`).
- **Deferred Features:** 34 documented in plans/deferred-features.md; 20 P20 carryforward items in plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md §5
- **Tests:** Cumulative **~954+ PURE-UNIT GREEN at P80 seal** (was ~942+ at P79 seal; +~12 P80 OC-15 agentic-product templates from `tests/p80-agentic-product-templates.spec.ts`). P78 spec is 9 describe blocks P78.1-P78.9 (P78.1 ADR-103 file shape / P78.2 Schema pages array / P78.3 Store actions addPage+removePage+renamePage+activePageId+setActivePageId / P78.4 PageSelector component testids / P78.5 LeftPanel imports PageSelector / P78.6 Per-page bundle.pages[] emission / P78.7 Static-html `<nav class="hb-page-nav">` / P78.8 Spec page-scope dropdown / P78.9 EOP triplet present), all with existsSync guards on A4/A5 source surfaces. Prior anchor: ~913+ at P77 standalone (+15 from `tests/p77-perf-and-a11y.spec.ts`); ~898+ at combined P75 + P76 seal. P77 spec is 7 describe blocks P77.1-P77.7. P75 spec is 8 describe blocks P75.1-P75.8. P76 spec is 8 describe blocks P76.1-P76.8. Composition: 392 P60 baseline + 3 P60.5 + 10 P62 OC-1 + 20 P63 OC-2 + 14 P64 OC-3 + 11 P65 OC-2.5 + 31 P65b OC-2.5 Wave 2 + 47 P66 Polish Sprint Wave 1 + 42 P67 Polish Wave 2 + 34 P67b Close the Gap + 22 P67c Library-Wide Polish + 74 P68 Templates Round 2 + 30 P69 Mobile Redesign + 0 P70 OC-CLEANUP + ~44 P71 OC-13 Blog Expansion + ~20-48 P72 OC-TI Template Intelligence + ~17 P73 OC-TPL-AUDIT fix-pass + ~25 P74 OC-DECOMP + Highlights + Demo + ~15 P75 OC-7 Section Type Closure + ~10 P76 OC-9 Spec Export Quality + +15 P77 OC-10 perf+a11y + ~15 P78 OC-11 multi-page MVP wire + ~12 P79 OC-14 page-aware pipeline + **+ ~12 P80 OC-15 agentic-product templates**. P70 is a docs-only cleanup sprint (zero new tests by design). P74 spec is `tests/p74-decomp-and-highlights.spec.ts` — 8 describe blocks, ~25 cases. P73 spec is `tests/p73-template-audit-fix.spec.ts` — 5 describe blocks, 17 cases. P72 spec is `tests/p72-template-intelligence.spec.ts` — 11 describe blocks, ~30-48 cases. P59 baseline = 298 Sprint N at `c00c2b7` + ~17 P58 RC + ~51 P59 prompt-library per ADR-083. P60 added 26 specs. Full corpus is 890+ tests across 75+ spec files (includes legacy + skipped suites); ~930+ is the curated PURE-UNIT seal-gate cumulative-regression subset.
- **Ruvector Memory:** **126 entries** at P70 open (P61 baseline 104 + later phase/learning rows + P70 A1 backfill of ADR-087..096 patterns). Vector index `default` (768-dim cosine) + `patterns` (768-dim cosine) BOTH show **0 vectors — HNSW NOT INDEXED**. No auto-write hook on agent runs. Ruvector is a **manually-curated static snapshot**, NOT a flywheel — search via SQL `LIKE` works; HNSW search non-functional. Activation (HNSW re-index + auto-write per agent run) intentionally deferred to commercial Tier-2 learning runtime per `plans/implementation/phase-61/03-ruvector-state.md`.

### Open-Core Moat Priorities

1. **Speed visible** — Sprint K / P54 / ADR-077 (latency badge surfaces sub-second response)
2. **Spec unmissable** — Sprint L / P55 / ADR-078 (AISP always-on + atom animations)
3. **Premium templates** — Sprint M / P56 / ADR-079 (3-5 strongly opinionated templates)
4. **Shareable output** — Sprint N / P57 / ADR-081 (static HTML export + hosted spec URL)

### Deferred to Commercial (Tier-2)

- Multi-page sites (beyond current scope)
- OAuth + Supabase persistence
- Vector DB learning runtime (HNSW re-index pending)
- Tier-2 flagship dashboard / SaaS apps
- Agentic Support System (Sprints J/K/L originals)

### Phase Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| P11 | Website + enhanced demos + brand/design locks | CLOSED (83/100) |
| P12 | Content Intelligence: site context, 13 effects, Resources tab | CLOSED (78/100) |
| P13 | Advanced Features: blog section, multi-page, export, a11y, 100+ tests | CLOSED (76/100) |
| P14 | Marketing review: 20 issues fixed, AISP validation, UI/UX cleanup | CLOSED (74/100) |
| P15 | Polish + Kitchen Sink + Blog + Novice Simplification | CLOSED (82/100) |
| P16 | Local Database (sql.js + IndexedDB) | CLOSED (86/100) |
| P17 | LLM Provider Abstraction + Env Var + BYOK Scaffold | CLOSED (88/100) |
| P18 | Real Chat Mode (LLM → JSON Patches) | CLOSED (89/100) |
| P18b | Provider Expansion + Observability (5-adapter matrix + llm_logs) | CLOSED (90/100) |
| P19 | Real Listen Mode (Web Speech STT + voice-to-pipeline + 18-item fix-pass) | CLOSED (88/100) |
| P20 | Verify, Cost Caps, MVP Close — CostPill + AbortSignal C20 + mvp-e2e + getting-started + CONTRIBUTING | CLOSED 88/100 (Grandma 76 / Framer 87 / Capstone 91) |
| P21 | **Cleanup + ADR/DDD gap-fill (NEW — inserted post-Wave-2 ratification)** | NEXT (post-P20) |
| P22 | **Public Website Rebuild — BYOK demo + Don Miller blog-style** | CLOSED 81/100 (Grandma 73 / Framer 84 / Capstone 86) |
| P23 | Sprint B Phase 1 — Simple Chat (template-first routing; 3 templates + router + ADR-050) | CLOSED 88/100 (Grandma 76 / Framer 86 / Capstone 92) |
| P24 | Sprint B Phase 2 — section targeting via `/hero-1` keyword scoping (parser + resolver + template scope-honoring; ADR-051 full) | CLOSED 88/100 (Grandma 76 / Framer 87 / Capstone 92) |
| P25 | Sprint B Phase 3 — intent translation (verb/type/ordinal rewrites; idempotent; ADR-052 full) | CLOSED 88/100 (Sprint B complete; ~140m total / ~50× velocity) |
| P26 | Sprint C Phase 1 — AISP Instruction Layer (Crystal Atom + rule-based classifier; ADR-053 full) | CLOSED 89/100 (Capstone 93; +1 from P25 — capstone thesis demo phase) |
| P27 | Sprint C P2 — LLM-Native AISP (Crystal Atom verbatim → LLM; Zod schema; UI panel; ADR-055 + ADR-056; capstone thesis demo) | CLOSED 90/100 (Grandma 76 / Framer 88 / Capstone 96 — plateau broken) |
| P28 | Sprint C P3 — 2-step template selection (SELECTION_ATOM; ADR-057) + carryforward closure (C04 partial / C17 partial / C15 done / C16 deferred ADR-040b) | CLOSED 91/100 (Sprint C complete; Sprint D greenlight CONFIRMED) |
| P29 | Sprint D P1 — Template Library API (decoration over registry; category + kind enums; 4 list/filter APIs; ADR-058) | CLOSED 91/100 (held; Sprint D opener; setup-phase pause before content arc) |
| P30 | Sprint D P2 — Template Persistence (migration 003 + userTemplates repo + BrowseTemplate split-type; ADR-059) | CLOSED 91/100 (held; data-layer phase) |
| P31 | Sprint D P3 — Content Generators POC (CONTENT_ATOM Crystal Atom + generateContent stub; ADR-060) | CLOSED 92/100 (+1; 4-atom AISP architecture in production) |
| P32 | Sprint D P4 — Multi-section content pipeline (section-aware tone/length defaults; ADR-061) | CLOSED 92/100 (held; Framer +1) |
| P33 | Sprint D P5 — Content + Template Bridge (kind dispatch + first generator template + ADR-062); SPRINT D CLOSE | CLOSED 93/100 (+1; Sprint D complete; 4-atom AISP in production) |
| P33+ | End-of-Sprint-D Brutal-Honest Review + 3 fix-passes (12/12 must-fix closed; 99/99 tests GREEN) | CLOSED — persona re-score deferred to post-UI mini-phase |
| P34 | Sprint E P1 — UI Closure + Assumptions Engine + brutal-honest review fix-pass (6 must-fix + 2 LOW closed) | CLOSED 95/100 estimated post-fix (Grandma 79 / Framer 89 / Capstone 98); 157/157 tests GREEN; Sprint E greenlight CONFIRMED |
| P35 | Sprint E P2 — ASSUMPTIONS_ATOM Crystal Atom + LLM lift + EXPERT trace pane + BYOK matrix completion (OpenAI added; ADR-064) | CLOSED 96/100 estimated (Grandma 79 / Framer 91 / Capstone 99); **5-atom AISP in production**; 211/211 tests GREEN |
| P36 | Sprint F P1 — Listen + AISP Unification (review-first voice UX; ListenReviewCard + ListenClarificationCard + listenActionPreview; ADR-065) | CLOSED 96/100 estimated (Grandma 81 / Framer 89 / Capstone 99); 255/255 tests GREEN; 31/35 prompt coverage |
| P37 | Sprint F P2 — Command Triggers + Content/Design Route Split + ListenTab refactor + carryforward closure (ADR-066) | CLOSED 91/100 estimated post-fix-pass (Grandma 82 / Framer 90 / Capstone 99); 408/408 tests GREEN; 35/35 prompt coverage; ListenTab 947→84 LOC |
| P38 | Sprint F P3 — Sprint F SEAL — end-of-sprint 4-reviewer brutal review + fix-pass + presentation gate | CLOSED at `3049b05` |
| P44 | Sprint H P1 — Brand Context Upload (ADR-067) | CLOSED — Sprint H Wave 1 |
| P45 | Sprint H P2 — Codebase Reference Ingestion (ADR-068) | CLOSED — Sprint H Wave 2 |
| P46 | Sprint H P3 — Reference Management UI + Sprint H SEAL (ADR-069 + end-of-sprint fix-pass) | CLOSED at `a83ba8a` |
| P47 | Sprint I P1 — Builder UX polish + a11y (ADR-070) | CLOSED — Sprint I Wave 1 (`4edae30`) |
| P48 | Sprint I P2 — Quick-add picker + Improvement Suggestions (ADR-071) | CLOSED — Sprint I Wave 2 (`85f341e`) |
| P49 | Sprint I P3 — Mobile polish + C11 closure + Sprint I SEAL (ADR-072) | CLOSED at `e08bc94` |
| P50 | Sprint J P1 — Personality Engine + Composition (no Σ widening; ADR-073) | CLOSED — Sprint J Wave 1 (`a12fd57`) |
| P51 | Sprint J P2 — Personality Picker UI + Onboarding step + 5 bubble styles (ADR-074) | CLOSED — Sprint J Wave 2 (`6d3f27e`) |
| P52 | Sprint J P3 — Conversation Log EXPERT tab + Share Spec clipboard (ADR-075) | CLOSED — Sprint J Wave 3 (`c806af4`) |
| P53 | Sprint J P4 — Mobile UX overhaul (3-tab nav + hamburger; ADR-076) + **Sprint J SEAL** | CLOSED at `644200a` — system-wide composite 89.75 PASS |
| P54 | **Sprint K — Make The Speed Visible** (latency capture + UI badge; moat priority #1; ADR-077) | CLOSED at `44cc36c` — Sprint K Wave 1 |
| P55 | **Sprint L — Make The Spec Unmissable** (AISP always-on + atom animations + spec primary tab; moat priority #2; ADR-078) | CLOSED at `2944461` — Sprint L Wave 1 |
| P56 | **Sprint M — Premium Templates** (3-5 strongly opinionated templates + design discipline; moat priority #3; ADR-079) | CLOSED at `3398702` — Sprint M Wave 1 |
| P57 | **Sprint N — Shareable Output** (static HTML export + hosted spec URL; moat priority #4; ADR-080 + ADR-081 supersedes ADR-075) | CLOSED — Wave 1 public-site refresh at `e692204`; Wave 2 Sprint N at `c00c2b7` (cumulative 298/298 PURE-UNIT GREEN) |
| P58 | **Sprint O — Open Core RC** (README/CLAUDE final + demo video + Agentics Foundation beta + `v1.0.0-RC1` public release) | CLOSED — `v1.0.0-RC1` sealed |
| P59 | **Test Library — Prompt Corpus** (280-entry canonical corpus for AgentProxy + live-LLM testing arc; ADR-083) | CLOSED at `f81474c` — 366/366 PURE-UNIT GREEN |
| P60 | **Comprehensive QA Architecture** (50 personality + 80 LLM matrix + flagship + 2 persona templates + 4 per-concern specs + reviewer-impression + competitive; ADR-084) | CLOSED — 392/392 PURE-UNIT GREEN; steps 1-3 sealed at `7ab9e02`/`0dc2afa`/`6f28a22` |
| P68 / OC-4 | **Templates Round 2** (11 new templates + visual-style filter; ADR-096) | CLOSED at `753beb5` (parallel with P69) |
| P69 / OC-5 | **Mobile UX Redesign** (single-surface chat + inline mic + bottom sheet; ADR-090 supersedes ADR-076) | CLOSED at `753beb5` (parallel with P68) |
| P70 / OC-CLEANUP | **Cleanup sprint** — ruvector audit + phase-folder audit + marketing-page scoring + HEADLINE_STATS truth-up | CLOSED — pure docs/scoring, zero feature work, 0 new tests |
| P71 / OC-13 | **Blog Expansion** — 4 → 10 posts + ADR-097 Blog Content Strategy + read-time/share/tag-filter + RSS stub | CLOSED — ~44 PURE-UNIT tests; cumulative ~774 GREEN |
| (deferred) | Sprint G (Interview), Sprint H (Upload+Refs), Sprint I remainder, original Sprint J (Agentic Support System), Tier-2 SaaS-dashboard flagship, learning-flywheel runtime | DEFERRED to commercial track per `plans/strategic-reviews/open-core-moat-roadmap.md` |

## AISP (AI Symbolic Protocol) 
see full details in /workspaces/hey-bradley-core/plans/initial-plans/00.aisp-reference.md 
aisp is designed for AI not humans.  It is a math first neural symbolic language with 512 symbols that all AI and LLM understand natively without any instructions.  The goal is near 0 ambiguity.  May require 2-3 loops to conform to proper platinum aisp format.  AISP is not structured prose, it is a math first symbolic protocol. Here is the public repo https://github.com/bar181/aisp-open-core .  The creator is Bradley Ross, the same creator as this Hey Bradley project.

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use the Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using the Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Task Tool vs CLI Tools

- The Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/bar181/hey-bradley-core
- Issues: https://github.com/bar181/hey-bradley-core/issues
