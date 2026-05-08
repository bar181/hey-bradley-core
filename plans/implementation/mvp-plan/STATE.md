# MVP Implementation — State of the Program

> **Updated:** 2026-05-01 (P70/A1 ruvector + stake-doc realignment — backfills P56-P69 status table below).
> **Latest seal:** P68 / OC-4 + P69 / OC-5 (parallel) at `753beb5` — cumulative **730/730 PURE-UNIT GREEN**; **96 ADRs Accepted** (ADR-001 → ADR-096); **37 templates** registered.
> **Branch:** `claude/verify-flywheel-init-qlIBr`
> **Companion:** `08-master-checklist.md` (all DoD ticks), per-phase `retrospective.md` and `session-log.md` files.
> **Latest deep-dive:** `plans/strategic-reviews/2026-04-29-sprint-j-system-wide/` (Sprint J system-wide; composite 89.75 PASS at `ef9a421`).

## Phase status snapshot (P56 → P69) — backfilled 2026-05-01 by P70/A1

| Phase | Sprint | Status | Commit | Highlight |
|---|---|---|---|---|
| **P56** | Sprint M Wave 1 — Premium Templates (moat #3) | CLOSED | `3398702` | 3-5 strongly opinionated templates + design discipline; ADR-079. |
| **P57** | Sprint N — Shareable Output (moat #4) | CLOSED | Wave 1 `e692204`; Wave 2 `c00c2b7` | Static HTML export + hosted spec URL; ADR-080 + ADR-081 supersedes ADR-075; cumulative 298/298 GREEN. |
| **P58** | Sprint O — Open Core RC | CLOSED | `v1.0.0-RC1` tag | README/CLAUDE final + demo video + Agentics Foundation beta + public release; ADR-082. |
| **P59** | Test Library — Prompt Corpus | CLOSED | `f81474c` | 280-entry canonical corpus for AgentProxy + live-LLM testing arc; ADR-083; 366/366 PURE-UNIT GREEN. |
| **P60** | Comprehensive QA Architecture | CLOSED | `7ab9e02` / `0dc2afa` / `6f28a22` | 50 personality + 80 LLM matrix + flagship + 2 persona templates; ADR-084; 392/392 GREEN. |
| **P61** | Multi-Page MVP + Process Pages Split | CLOSED | `64e305c` / `b1a9652` (P61b `8025878`) | ADR-085 multi-page; ADR-086 content/runtime split. |
| **P62** | OC-1 (Open-Core polish wave 1) | CLOSED | `6a86d5c` | +10 P62 OC-1 tests. |
| **P63** | OC-2 — Mode Architecture + Agentics Data Model | CLOSED | `ac6f973` | ADR-088 mode discriminator (Whiteboard/Planning/Agentics); ADR-089 schema migration 005 design; +20 tests. |
| **P64** | OC-3 — Templates Round 1 (3 templates) | CLOSED | `0701b37` | coffee-roaster + dev-conference + podcast-show; +14 tests; library 23 → 26. |
| **P65** | OC-2.5 — Design Token System | CLOSED | `261d840` | ADR-087 `src/styles/design-tokens.ts`; +11 tests. |
| **P65b** | OC-2.5 Wave 2 — Canonical Components | CLOSED | `e7b6af2` | 7 canonical components (4 Hero + 2 Feature + 1 Testimonial); ADR-091; +31 tests. |
| **P66** | Polish Sprint Wave 1 (OC-MKTG + 6 polish surfaces) | CLOSED | `62af4a4` / `34699d4` | ADR-092 5 polish standards; demos, mobile first-run, mode selector, filter UI, inline personality popover; +47 tests. |
| **P67** | Polish Wave 2 — Component Decomposition | CLOSED | `17c9635` | ADR-093 file-size caps + ChatInput 1013 → 250 LOC orchestrator + 3 sub-components; +42 tests. |
| **P67b** | Close-the-Gap (Professional Grade) | CLOSED | `37933e8` | ADR-094 8.5 quantified gates + 5 sub-page hero consistency + mobile audit; +34 tests. |
| **P67c** | Library-Wide Polish (legacy sweep) | CLOSED | `8d46ddf` | ADR-095 coverage standard; settings drawer parity, EXPERT editor collapse parity, ChatThread 157-LOC extraction; +22 tests. |
| **P68** | OC-4 — Templates Round 2 (11 templates) | CLOSED | `753beb5` | ADR-096 expansion standard; 4 healthcare/wellness + 4 creator/personal + 3 dev-tools/OSS; registry 26 → 37; +74 tests. |
| **P69** | OC-5 — Mobile UX Redesign | CLOSED | `753beb5` (parallel with P68) | ADR-090 supersedes ADR-076; single chat surface + inline mic + fullscreen listen + spec bottom sheet; +30 tests; **730/730 cumulative GREEN**. |
| **P70** | OC-CLEANUP — ruvector + stake-doc realignment | OPEN | (this commit) | A1 backfilled 10 ADR pattern entries (087-096) + CLAUDE.md/STATE.md/README/wiki phase-pin sync. |
| **P71** | OC-13 — Blog Expansion (parallel with P70) | OPEN | — | Companion sprint to P70/OC-CLEANUP. |
| **P75** | OC-7 — Section Type Closure (case-study + contact-form) | CLOSED | — | ADR-100 widens enum 16 → 18; ~15 P75 tests; 8 describe blocks. |
| **P76** | OC-9 — Spec Export Quality Standard | CLOSED | — | ADR-101 canonical export modal CTAs + valid HTML5 + versioned AISP filename + ≥3-heading spec generators; ~10 P76 tests. |
| **P77** | OC-10 — Performance + Accessibility | CLOSED | — | ADR-102 route lazy + img lazy/dims + aria-labels + ≤800KB gzip cap; +15 P77 tests; 7 describe blocks. |
| **P78** | OC-11 — Multi-Page MVP Wire | CLOSED | — | ADR-103 `activePageId` + PageSelector + per-page bundle.pages[] + `<nav class="hb-page-nav">`; ~15 P78 tests; 9 describe blocks. |
| **P79** | OC-14 — Page-Aware Chat Pipeline | CLOSED | — | ADR-104 pageIterator pure module + chatPipeline scopeRoot wire; single-page byte-equivalent preserved; ~12 P79 tests; 5 describe blocks. Composite est. 92. |
| **P80** | OC-15 — Agentic-Product Templates (4 vertical) | CLOSED | — | ADR-105 ai-agent-marketplace + ai-coding-copilot + ai-workflow-platform + ai-support-copilot; templates 37 → 41; ~12 P80 tests; closes Gap 6 from 25-gap roadmap. Composite 9.25/10 → 92.5. |
| **P81** | OC-16 — Prompt Library Completeness | CLOSED | — | ADR-106 corpus 280 → 500+ entries across 6 files (multi-page.json + template-triggers.json NEW); 8-field schema; +~15 P81 tests; 9 describe blocks. Composite est. 90. |
| **P82** | OC-CLEANUP — Carry-forward closure (P79 P1s) | CLOSED | — | ADR-107 page-aware INTENT extension + DECOMP page-targeting + mobile drawer page selector + blog 10→12 (ADR-097 floor met) + RSS refresh + EOP audit (P15-P81 back-fill enumeration); +~15 P82 tests; 8 describe blocks; **~984+ cumulative PURE-UNIT GREEN at combined P81 + P82 seal**. Composite est. 91. |

---

## 1. Done

| Phase | Title | Composite | DoD | Final Commit | Highlight |
|---|---|---:|---|---|---|
| **P15** | Polish + Kitchen Sink + Blog + Novice Simplification | 82/100 | 12/12 + personas | `47b95f6` | Personas all PASS (Grandma 70, Framer 88, Capstone 84). DRAFT mode shrunk: 5 tabs → 2; 16 sections → 3 (hero/blog/footer); jargon labels hidden. Two new examples (kitchen-sink + blog-standard). |
| **P16** | Local Database (sql.js + IndexedDB) | 86/100 | 25/25 | `755a20a` | Frontend-only persistence. 5 typed CRUD repositories. `.heybradley` zip export with **SENSITIVE_KV_KEYS strip** (closes the BYOK leak vector before it lands). Cross-tab Web Lock + BroadcastChannel + pre-migration snapshot. Bundle delta +32.56 KB gzip. |
| **P17** | LLM Provider Abstraction + BYOK Scaffold | 88/100 | 16/16 | `8377ab7` | LLMAdapter interface + Claude/Gemini/Simulated/Fixture impls (Fixture added in P18). BYOK with optional kv persistence; cap pre-check; husky pre-commit guard with 9 key-shape patterns; vite build-time assertion. ADR-042 + ADR-043. Bundle delta +2.00 KB gzip. |
| **P18** | Real Chat Mode (LLM → JSON Patches) | 89/100 | 20/20 | `232dd79` | Crystal Atom system prompt + Zod parser + path-whitelist validator (key prototype-pollution + image URL allow-list + value safety) + atomic applier + cross-surface mutex + redacted audit log. **0 real-LLM calls during all of P18.** $0 spent. ADR-044 + ADR-045. Bundle delta +6.24 KB gzip. |
| **P18b** | Provider Expansion + Observability (addendum) | 90/100 | 18/18 | `805b246` | 5-provider matrix: Claude (paid), Gemini (paid 2.5-flash + free 2.0-flash), OpenRouter (free `mistralai/mistral-7b-instruct:free`), Simulated, **mock** (DB-backed `AgentProxyAdapter` reading from `example_prompts` corpus, 18 rows / 6 categories). New `llm_logs` table with ruvector deltas (D1 dual `request_id` + `parent_request_id`; D2 split `input_tokens`/`output_tokens`; D3 SHA-256 `prompt_hash`); one row per adapter-call decision (incl. cost_cap). 30-day retention enforced at `initDB`. `SENSITIVE_TABLE_OPS` registry strips both new tables from `.heybradley` exports. ADR-046 + ADR-047. **Bundle delta -0.76 KB gzip** (net negative; new modules code-split into lazy chunks). $0 spent. |
| **P19** | Real Listen Mode (Web Speech API) + 3-step staged build + 2 fix-passes | **88/100** | 22/22 | `772c154` | Web Speech STT capture + push-to-talk surface + voice→chat-pipeline fan-in + 754-LOC ListenTab (P20 split queued). 4 brutal-honest reviewers ran on the sealed code (R1 UX 58, R2 Functionality 2/35 prompts, R3 Security 8.5/10 1 HIGH, R4 Architecture 5.5/10) → fix-pass-2 closed 18 must-fix items: F1 hero/article path-resolution helper (closes blog-standard hero corruption); F2 mapChatError (4 infra kinds; FALLBACK_HINT dedup); F3 CSS-injection guard (`url(`/`@import` blocked, `imageUrl` allow-listed); F4 site-context interpolation sanitize; F5 truthful listen privacy copy; F6 DEV-key runtime warn; F7 adapterUtils.ts dedup (-60 LOC across 3 adapters); F8-F13 UX polish (tooltip, inline privacy, draft-mode demo-slider hide, via-voice pill, simulated-mode pill); F14 PersistenceErrorBanner; F15 CLAUDE.md project-status truth-up; F16-F18 code hygiene. ADR-048 (Web Speech). **Composite 66 → 88** post-fix-pass (Grandma 70 / Framer 84 / Capstone 88). **Bundle gzip 599.85 KB main + 100 KB lazy = ~700 KB total** (under 800 KB P20 budget). 46 targeted Playwright passing. **20 P20 carryforward items** documented in `phase-19/deep-dive/05-fix-pass-plan.md` §5. $0 spent. |
| **P21** | Cleanup + ADR/DDD gap-fill | **95/100** (self-rated; doc-only phase, no persona scoring) | Tracks A-D + end-of-phase | `1129cea` | 5 sealed-phase folders archived (P15-P19); 5 ADR drift amendments (040/043/044/047/048); 4 ADR stubs (050-053); ADR-054 DDD bounded contexts authored full; attribution sweep across 11 ADRs (claude-flow swarm → bar181); `STATE.md` runway shifted (Sprint B → P23-P25, etc.); `CLAUDE.md` Phase Roadmap reorganized; standard phase-process documented in CLAUDE.md (every phase = end-of-phase + review-with-fixes + preflight; deep-dive = EXTRA). $0 spent. |
| **P22** | Public Website Rebuild — Don Miller blog-style + BYOK demo | **81/100** (Grandma 73 / Framer 84 / Capstone 86) | initial + fix-pass-1 (pass-2 NOT triggered) | `49a109e` | Initial seal `b024d1c` (72/100): Welcome.tsx 918 → 165 LOC (drop 8-showcase carousel); HowIBuiltThis truthed (43 ADRs / 28K LOC / 63+ tests / P1-P21 trajectory); Docs counts truthed; NEW BYOK page (5-provider table); MarketingNav 5-item max; ADR-053 full author. Brutal-review pass-1: 4-chunk report (≤600 LOC/file) → 6 must-fix items applied (F1 AISPDualView component on /aisp; F2 theme unification across 6 dark pages → warm-cream universal; F3 persona walks; F4 OpenCoreVsCommercial component on /open-core; F6 BYOK acronym verified; F7 COCOMO callout restored ~140× compression). F5 partial; F8/F10 deferred to P23 (LOW); F9 invalid (Builder.tsx not stub). 6 ADR amendments + 2 new marketing components. Build green at 556 KB gzip. **Composite 72 → 81 post-fix-pass-1 (+9). All 3 personas above target.** $0 spent. |
| **P22+** | Deep Review P15-P22 + Fix-Pass | **89/100** (Grandma 75 / Framer 86 / Capstone 90) | 9 must-fix items closed | `17097f7` | 4-chunk deep-review report (≤600 LOC/file) covering UX + Functionality + Security + Architecture across cumulative P15-P22 state. Fix-pass: SECURITY.md authored at repo root (closes ADR-043 cross-reference + P20 DoD item 8); ErrorBoundary console.error gated; AISPDualView + OpenCoreVsCommercial render-order fixed (moved before footer); phase-21 MEMORY.md flipped to actual "Cleanup" outcome; STATE.md §2 dedup; CLAUDE.md ADR count 38→44; ADR-053 dark-island caveat withdrawn; BYOK provider URLs clickable; About.tsx capstone callout. Composite 84 → 89 (+5). Pass-2 NOT triggered. |
| **P20** | MVP Close — Cost cap UI + AbortSignal + mvp-e2e + getting-started + CONTRIBUTING | **88/100** (Grandma 76 / Framer 87 / Capstone 91) | 22/26 DoD closed; 4 LOW carryforward to P23 | `616ae02` | ADR-049 (Cost-Cap Telemetry) authored; CostPill component shipped in shell footer (3-tier states green/amber/red); intelligenceStore.capUsd field + setCapUsd action with [0.10, 20.00] clamp + kv persistence at 'cost_cap_usd'; Settings cap-edit input. C20 AbortSignal plumb-through across 6 adapters (Claude options-bag, OpenRouter native fetch, Gemini race-against-abort-event, Fixture/Simulated/AgentProxy defensive checks). 8 image-MVP fixtures (replace/swap/darker-brighter/remove + 8-image catalog) + help/discovery handler covering 6 phrasings. NEW tests/mvp-e2e.spec.ts (10/10 green) + tests/p20-cost-cap.spec.ts (6/6 green). NEW docs/getting-started.md + CONTRIBUTING.md. Carryforward to P23: C04 ListenTab split, C11 mobile carousel, C12 AISP refresh, C14 sentinel test, C15 import lock, C16 migration 003 FK, C17 Zod helper, C18 LRU; Vercel deploy owner-triggered. Build green at 557.36 KB gzip. **Composite 88/100 exceeds ≥85 capstone gate.** $0 spent. |
| **P23** | Sprint B Phase 1 — Simple Chat (template-first routing) | **88/100** (Grandma 76 / Framer 86 / Capstone 92) | 9/9 DoD; 5+2 P23 tests + C18 LRU + C14 sentinel | `f38d324` | NEW templates module (`src/contexts/intelligence/templates/`): types + registry (3 templates: make-it-brighter / hide-section / change-headline) + router (`tryMatchTemplate` w/ confidence threshold 0.8) + index barrel. `chatPipeline.submit()` template-first short-circuit: dynamic-import + graceful fallback to LLM on miss. Templates resolve targets via `findSectionByType` / `heroHeadingPath`; friendly empty-patch envelope on missing target. ADR-050 (Template-First Chat Architecture) full Accepted (replaces P21 stub). NEW tests: p23-simple-chat.spec.ts (5 cases; retry-stable) + p23-sentinel-table-ops.spec.ts (2 cases for C14 schema-evolution canary). C18 LRU bound on llm_logs (10K row max via `pruneLLMLogsByCount` at every initDB). Build green at 557.86 KB gzip (+0.5 KB delta). Carryforward to P24: ListenTab split, Zod helper, import lock, migration FK, mobile carousel, AISP refresh, test-flake unit-stabilization. $0 spent. |
| **P24** | Sprint B Phase 2 — Section Targeting via `/type-N` keyword scoping | **88/100** (Grandma 76 / Framer 87 / Capstone 92) | 11/11 DoD | `e336717` | NEW `templates/scoping.ts`: `parseSectionScope(text)` extracts `/hero-1` / `/blog-2` / `/footer` tokens (1-based→0-based; cleanText strip) + `resolveScopedSectionIndex(config, scope)` walks ENABLED sections only (disabled-skip semantics). `TemplateMatchContext.scope?: SectionScope` field added; router extracts scope BEFORE pattern match; `hide-section` + `change-headline` templates honor scope override with friendly echo on miss. `make-it-brighter` ignores scope (backward-compat). ADR-051 (Section Targeting Syntax) full Accepted (replaces P21 stub). NEW `tests/p24-section-targeting.spec.ts` (10 cases; PURE-UNIT — no browser, deterministic, first-pass green; addresses P23 flake lesson). Backward-compat: P23 tests unchanged. Build green at 557.55 KB gzip (-0.3 KB delta). $0 spent. |
| **P25** | Sprint B Phase 3 — Intent Translation (rule-based pre-AISP) | **88/100** (held; Sprint B complete) | 9/9 DoD | `ea5a0e2` | NEW `templates/intent.ts`: `translateIntent(text)` rewrites verbs (3 hide synonyms / 3 change synonyms) + type aliases (blog post → blog; page footer → footer; hero section → hero) + ordinal-to-scope-token (1st-5th → /type-N). Idempotent on canonical input. `chatPipeline.submit()` runs translateIntent BEFORE tryMatchTemplate (P23+P24 unchanged downstream). ADR-052 (Intent Translator) full Accepted (replaces P21 stub). NEW `tests/p25-intent-translator.spec.ts` (7 PURE-UNIT cases; first-pass GREEN). Build green at 557.60 KB gzip. **SPRINT B (P23-P25) COMPLETE; ~140m total vs original 4-6 days × 3 phases = ~50× velocity.** $0 spent. |
| **P26** | Sprint C Phase 1 — AISP Instruction Layer | **89/100** (Grandma 76 / Framer 87 / Capstone 93; +1 capstone) | 10/10 DoD | `17c99ea` | NEW `src/contexts/intelligence/aisp/`: `intentAtom.ts` (Crystal Atom verbatim Ω/Σ/Γ/Λ/Ε per `bar181/aisp-open-core ai_guide`; 6 IntentVerb ops; 21 ALLOWED_TARGET_TYPES; AISP_CONFIDENCE_THRESHOLD=0.85), `intentClassifier.ts` (rule-based `classifyIntent(text)` returns `{verb,target,params,confidence,rationale}`; 9 verb rules; scope-token+ordinal target inference; verb-specific params extraction), `index.ts` barrel. `chatPipeline.submit()` runs classifyIntent BEFORE P25 translateIntent: ≥0.85 + target → construct canonical text from `{verb,target,params}`; <0.85 → fall through to P25 rule-based. ADR-053 (AISP Intent Classifier) full Accepted (replaces P21 stub). NEW `tests/p26-aisp-intent.spec.ts` (9 PURE-UNIT cases; first-pass GREEN). Build green at 557.78 KB gzip. **First composite increase since P22 deep-review (88→89). Sprint C P1 ships capstone-thesis user-visible AISP layer.** $0 spent. |
| **P27** | Sprint C P2 — LLM-Native AISP (capstone-thesis demonstration) | **90/100** (Grandma 76 / Framer 88 / Capstone 96) — **plateau broken (+2 vs P26 89)** | 10/10 DoD; brutal-review composite 90 ≥ greenlight gate | `19732a1` | A1 Zod schema + llmClassifyIntent; A2 AISPTranslationPanel UI; A3 ADR-056 + BONUS ADR-055 (30-line AISP-format trajectory). 9 PURE-UNIT tests GREEN. Three AISP artifacts in repo. Brutal-review composite 90 → Sprint D greenlight conditional. $0. |
| **P28** | Sprint C P3 — 2-step Template Selection + Carryforward Closure | **91/100** (Grandma 76 / Framer 89 / Capstone 96) — second consecutive climb | 9/9 DoD; brutal-review composite 91 (R1 76 / R2 89 / R3 94 / R4 89); Sprint D greenlight CONFIRMED | `34f499b` | **Wave 1:** C04 ListenTab partial split (785 → 736 LOC); C17 partial Zod helper (11/21 casts removed); C15 import lock (closes R3 P19 attack); C16 formal deferral (ADR-040b). **Wave 2:** A3 templateSelector w/ Σ-restricted SELECTION_ATOM (threshold 0.7; cost reserve 0.75); A4 twoStepPipeline orchestrator; A5 ADR-057 (Sprint C closes with 3 Crystal Atoms in production: ADR-045 + ADR-053 INTENT_ATOM + ADR-057 SELECTION_ATOM). 6 PURE-UNIT tests GREEN. Build 558 KB gzip (+0.4 KB). **Sprint C COMPLETE.** $0. |
| **P29** | Sprint D P1 — Template Library API | **91/100** (held; Grandma 76 / Framer 89 / Capstone 96) — setup-phase pause | 8/8 DoD | `ac872e1` | NEW `src/contexts/intelligence/templates/library.ts` (~75 LOC): `TemplateMeta extends Template` w/ `category` (theme \| section \| content) + `examples` + `kind` (patcher \| generator); `TEMPLATE_LIBRARY` decorated registry (readonly; module-load construction); 4 list/filter/lookup APIs (`listTemplates`, `listTemplatesByCategory`, `listTemplatesByKind`, `getTemplateById`). 3 P23 baselines categorized via hand-curated `BASELINE_META`. `kind: 'generator'` slot reserved for P31 first content generator. ADR-058 (Template Library API) full Accepted. NEW `tests/p29-template-library.spec.ts` — **8 PURE-UNIT cases GREEN first-pass**. Build green at 558 KB gzip (+0.0 KB; tree-shake friendly). **Sprint D phasing tightened: P29 library / P30 persistence / P31 content POC / P32 multi-section / P33 UI bridge.** ~25m actual / ~5× velocity. $0. |
| **P30** | Sprint D P2 — Template Persistence | **91/100** (held; data-layer phase) | 7/7 DoD | (pending commit) | NEW migration `003-user-templates.sql` (table + CHECK enums on category/kind + 2 indexes; FK deferred per ADR-040b symmetry). NEW `userTemplates` repo (`createUserTemplate`/`listUserTemplates`/`getUserTemplate`/`deleteUserTemplate`/`parseUserTemplate`). Library `BrowseTemplate` split-type + `listAllForBrowse(loadUserRows)` injected callback (DB-free at module load; pure-unit-test-friendly). ADR-059 (Template Persistence) full Accepted — documents split-type pattern + opt-in user content (NOT export-stripped). NEW `tests/p30-template-persistence.spec.ts` — **9 PURE-UNIT cases GREEN first-pass** (DDL shape + repo surface + browse merge + order). Build green. ~30m / ~3× velocity. $0. |
| **P31** | Sprint D P3 — Content Generators POC (CONTENT_ATOM) | **92/100** (+1; Grandma 76 / Framer 89 / Capstone 97) — first Sprint D climb | 7/7 DoD | (pending commit) | NEW `aisp/contentAtom.ts` — verbatim AISP CONTENT_ATOM (Σ: text+tone+length; Tone enum 5; Length enum 3; max_chars 60/160/400; threshold 0.7; cost reserve 0.85). NEW `aisp/contentGenerator.ts` — deterministic stub (quoted-phrase extraction + tone cue inference + length cue inference + Γ R1/R3 enforcement). ADR-060 full Accepted — documents 4-atom AISP architecture (INTENT → SELECTION → CONTENT → PATCH all in repo at distinct Σ-scopes; capstone thesis exhibit). NEW `tests/p31-content-generators.spec.ts` — **15 PURE-UNIT cases GREEN first-pass** (CONTENT_ATOM verbatim + tone enum + length cap + isCleanContent + 9 generateContent cases). Build green. ~25m / ~4× velocity. $0. |
| **P32** | Sprint D P4 — Multi-section Content Pipeline | **92/100** (held; Grandma 76 / Framer 90 / Capstone 97) — Framer +1 | 7/7 DoD | (pending commit) | NEW `aisp/contentDefaults.ts` — 19-section table mapping `SectionType → {tone,length}` aligned with INTENT_ATOM ALLOWED_TARGET_TYPES. `getSectionDefaults(type)` lookup w/ neutral/short fallback. `generateContent` extended w/ optional `sectionType` param + 4-tier resolution order (cue word → caller default → section default → hard fallback). ADR-061 full Accepted — Σ unchanged (section type is runtime hint, not output schema). NEW `tests/p32-multi-section-content.spec.ts` — **11 PURE-UNIT cases GREEN first-pass**. **Sprint D regression P29-P32 = 43/43 GREEN.** Build green. ~20m / ~3× velocity. $0. |
| **P33** | Sprint D P5 — Content + Template Bridge (SPRINT D CLOSE) | **93/100** at seal; **persona re-score pending UI mini-phase** | 8/8 DoD | (pending commit) | Template type extended w/ optional `kind` / `category` / `examples`. NEW `generate-headline` template registered (kind:'generator'). `twoStepPipeline.ts` kind-dispatch. ADR-062 full Accepted. NEW `tests/p33-content-bridge.spec.ts` — 11 PURE-UNIT cases GREEN first-pass. **SPRINT D COMPLETE: 5 phases / 5 ADRs (058-062) / 54 PURE-UNIT cases / 1 migration / $0. 4-atom AISP architecture in production.** |
| **P33+** | End-of-Sprint-D Brutal-Honest Review + 3 fix-passes | R1 FAIL 68 / R2 PASS 84 / R3 PASS 82 / R4 PASS 84; **12 must-fix items closed** | 12/12 must-fix | (pending commit) | **R1 (UX FAIL):** GENERATE_HEADLINE envelope was a UX dead-end (dev-speak surface). **fix-pass-1**: rewired envelope to call `generateContent`; FALLBACK_HINT updated; friendly help on null. **R2 (Func PASS):** browse-id collisions; isCleanContent URI-scheme gaps. **fix-pass-2**: listAllForBrowse de-dups (registry wins); isCleanContent broadened to mailto/tel/data/javascript/file/ftp + embedded-JSON; library Array.isArray guard; BASELINE_META deleted (metadata inlined on registry); resolveTargetPath extension hook in twoStepPipeline. **R3 (Sec PASS):** import-poisoning + unbounded TEXT columns. **fix-pass-3**: importBundle truncates user_templates (symmetric w/ P28 example_prompts re-seed); createUserTemplate id allowlist + RESERVED_IDS; size caps (payload 64KB / examples 8KB / name 200ch); row count cap 1000; sectionType allowlist in resolveTargetPath; listUserTemplates LIMIT cap. **R4 (Arch PASS):** 3-tier metadata + hardcoded resolver; addressed by R4 fix-pass-2 above. **NEW tests:** `p33-fix-pass-envelope.spec.ts` (7) + `p33-fix-pass-2.spec.ts` (19) + `p33-fix-pass-3.spec.ts` (11). **Final regression: 99/99 GREEN** (P28-P33 + 3 fix-passes + sentinel). Deferred items (UI consumers, AISPTranslationPanel wiring, R4 F3 metadata refactor, R3 sentinel hardening) queued explicitly for Sprint E. Build green. **All 12 reviewer must-fix items closed.** Persona re-score deferred to post-UI mini-phase. |
| **P34** | Sprint E P1 — UI Closure + Assumptions Engine + brutal-honest review fix-pass | **95/100** estimated post-fix (Grandma 79 / Framer 89 / Capstone 98) | 9/9 DoD + 6/6 must-fix closed | `9df6e18` | **Wave 1 (Sprint D UI closure):** A1 wired `chatPipeline.ts` ChatPipelineResult with `aisp + templateId`; AISPTranslationPanel renders inline under each bradley reply. A2 NEW `TemplateBrowsePicker.tsx` — visual grid + `/browse` slash. **Wave 2:** assumptions + ClarificationPanel + ADR-063. **Brutal-honest review (4 PASS):** 6 must-fix + 2 LOW closed. **Final regression: 157/157 GREEN.** |
| **P36** | Sprint F P1 — Listen + AISP Unification (review-first voice UX) | **96/100** estimated (Grandma 81 / Framer 89 / Capstone 99); 31/35 coverage | 8/8 DoD | (pending commit) | NEW `ListenReviewCard.tsx` (Approve/Edit/Cancel before pipeline fires); NEW `ListenClarificationCard.tsx` (3-button voice clarification mirroring P34 ChatInput pattern); NEW `listenActionPreview.ts` (rule-classifier preview, 0-cost). ListenTab refactored: review-first → approve → `runListenPipeline` (extracted). Voice clarification fires `generateAssumptionsLLM` (P35) on low-confidence intent + `recordAcceptedAssumption` persistence on accept. NEW `uiStore.pendingChatPrefill` single-shot field; ChatInput consumes on mount → seamless Listen → Chat tab hand-off via Edit button. AISP feedback chip in reply banner (verb · target · template). ADR-065 full Accepted (review-first voice rationale + ASR error model). NEW `tests/p36-listen-enhanced.spec.ts` — **26 PURE-UNIT cases GREEN first-pass; 31/35 prompt coverage gate met** (raised from P35's 28/35). **Cumulative: 255/255 GREEN.** Build green. **5-atom AISP architecture now spans BOTH chat + voice surfaces.** |
| **P37** | Sprint F P2 — Command Triggers + Content/Design Route Split + ListenTab refactor + Sprint-F debt closure | **91/100** estimated post-fix-pass (Grandma 82 / Framer 90 / Capstone 99); 35/35 coverage; ListenTab 947→84 LOC | 8/8 DoD + 7 fix-pass items closed | (pending seal commit) |
| **P38** | Sprint F P3 — Sprint F SEAL (4-reviewer brutal end-of-sprint + fix-pass + presentation gate) | sealed | DoD per `phase-38/preflight/00-summary.md` | `3049b05` | Backfilled row 2026-04-29 housekeeping audit. Canonical scope: `plans/implementation/phase-38/preflight/00-summary.md`. Session-log + retrospective backfilled post-seal. |
| **P44** | Sprint H P1 — Brand Context Upload | sealed | per Sprint H wave 1 | `(Sprint H W1)` | Backfilled 2026-04-29. Brand-context upload + manifest-only reads. ADR-067. |
| **P45** | Sprint H P2 — Codebase Reference Ingestion | sealed | per Sprint H wave 2 | `3a43e9f` and prior | Backfilled 2026-04-29. ZIP extraction + reference store. ADR-068. |
| **P46** | Sprint H P3 — Reference Management UI + Sprint H SEAL | sealed; 3-reviewer end-of-sprint review (`phase-46/deep-dive/`) | end-of-sprint fix-pass closed | `a83ba8a` | Backfilled 2026-04-29. ADR-069. Session-log + retrospective backfilled post-seal. |
| **P47** | Sprint I P1 — Builder UX polish + a11y | sealed | per Sprint I wave 1 | `4edae30` | Backfilled 2026-04-29. ADR-070. |
| **P48** | Sprint I P2 — Quick-add picker + Improvement Suggestions | sealed | per Sprint I wave 2 | `85f341e` | Backfilled 2026-04-29. ADR-071. |
| **P49** | Sprint I P3 — Mobile polish + C11 closure + Sprint I SEAL | sealed; lean end-of-sprint review (`phase-49/deep-dive/01-sprint-i-review.md`) | C11 closed | `e08bc94` | Backfilled 2026-04-29. ADR-072. Session-log + retrospective backfilled post-seal. |
| **P50** | Sprint J P1 — Personality Engine + Composition (no Σ widening) | sealed | per Sprint J wave 1 | `a12fd57` | ADR-073. Preflight backfilled at `d3bbeb3`. |
| **P51** | Sprint J P2 — Personality Picker UI + Onboarding + 5 bubble styles | sealed | per Sprint J wave 2 | `6d3f27e` | ADR-074. |
| **P52** | Sprint J P3 — Conversation Log EXPERT tab + Share Spec clipboard | sealed | per Sprint J wave 3 | `c806af4` | ADR-075 (will be superseded by ADR-080 in Sprint N). |
| **P53** | Sprint J P4 — Mobile UX overhaul + Sprint J SEAL | sealed; system-wide review composite 89.75 PASS | DoD per `phase-53/preflight/00-summary.md` | `644200a` | ADR-076. System-wide review at `ef9a421` (`plans/strategic-reviews/2026-04-29-sprint-j-system-wide/`). |
| **P54** | Sprint K Wave 1 — Make The Speed Visible (moat priority #1) | sealed | A1 latency capture + A2 PatchLatencyBadge + A3 ADR-077 + p54 spec | `44cc36c` | NEW `PatchLatencyBadge.tsx` (79 LOC) + `chatPipeline.latencyMs` capture + first blog post (`lovable-vs-hey-bradley.md`). 10 PURE-UNIT cases authored. |
| **P55** | Sprint L Wave 1 — Make The Spec Unmissable (moat priority #2; **most important**) | sealed; cumulative **234/234 GREEN** | A1 always-on AISPTranslationPanel + A2 spec auto-open one-shot + A3 ADR-078 + p55 spec | `2944461` | Default-on AISP trace chip on every bradley reply; spec primary-tab auto-open on first patch (kv-persisted `ui_spec_panel_auto_opened`); CSS-only Tailwind animation (no new deps). 15 PURE-UNIT cases. **5-atom AISP architecture is now the default UI surface.** | **A1:** ListenTab.tsx 947 → **84 LOC** (orchestrator only); NEW `useListenPipeline.ts` (403 LOC) + `ListenControls.tsx` (137) + `ListenTranscript.tsx` (168) + organic extractions (DemoDialog/ListenOrb/ListenSettings/useListenDemo). R2 S2: `redactKeyShapes` applied at the listen-write boundary. **A2:** R1 L3 friendly fallthrough message; R2 S1 `MAX_PREFILL_LENGTH=1024` + `sanitizePendingText` (rejects non-string + BYOK shape); R2 S4 `PendingMessage` directed-message envelope (`target: 'chat'`); R2 S5 ADR-065 doc retraction (EXPERT trace pane stays chat-only). **A3:** example_prompts seed 18 → **43 rows** (35/35 sprint-close gate met); 9 categories incl. NEW command/voice_only/ambiguous; INSERT OR REPLACE for idempotent re-seed. **NEW commands/commandTriggers.ts** (parseCommand + COMMAND_TRIGGER_LIST; 8 CommandKinds incl. P37 R1 F1 fix-pass `template-help`); **NEW aisp/routeClassifier.ts** (content/design/ambiguous; pure-rule). chatPipeline content-route gate (Grandma-friendly copy). ADR-066 full Accepted. **3-reviewer brutal review:** R1 UX 87 / R2 Sec 86 / R3 Arch 92 (all PASS). **Fix-pass:** 2 must-fix (F1 silent /template reject; F2 dev-y content-route copy) + 5 should-fix (R1 L1+L2 voice vocab; R1 L3 friendly affordance; R2 L3 Bearer pattern; R3 L2 unconditional classifyRoute). NEW `tests/p37-{commands,route-classifier,listen-chat-bridge,carryforward,listen-split,prompt-coverage,fix-pass}.spec.ts`. **Cumulative regression: 408/408 PURE-UNIT GREEN.** Build green. **All 6 P36 carryforward items closed.** |
| **P54** | Sprint K — Make The Speed Visible | 📋 PLANNED — moat priority #1 | preflight scaffolded | — | Latency capture (`ChatPipelineResult.latencyMs`) + UI badge on bradley replies (`data-testid="latency-badge"`; ≤5s shows pill, >5s shows ✓; P50 target ≤1.2s on AgentProxy) + benchmark mode stub (gated `VITE_BENCHMARK=1`) + ADR-077. Carryforward fold-in: top-10 #1 (ChatInput LOC split), #2 (Playwright runtime suite ≤10), #5 (DEV-warn on ConversationLogTab). Effort @vel: ~1 day. |
| **P55** | Sprint L — Make The Spec Unmissable (**most important**) | 📋 PLANNED — moat priority #2 | preflight scaffolded | — | AISP trace chip on EVERY bradley reply (default-on, not Geek-opt-in) + atom light-up animation (5 atoms in sequence ≤800ms) + spec primary-tab promotion + auto-open one-shot on first patch + ADR-078. Visibility ratio target = 1.0 across 35/35 example_prompts. Geek mode preserved: shows full classification text + rationale. Effort @vel: ~1 day. |
| **P56** | Sprint M — Premium Templates | 📋 PLANNED — moat priority #3 | preflight scaffolded | — | 3-5 strongly opinionated templates (SaaS founder / Indie portfolio / B2B agency / Conference site / Personal brand) + premium typography/color/image discipline (curated swatches; hand-picked from existing 300-image catalog; no new assets) + ADR-079. Persona re-score gate: Framer ≥90, Capstone ≥98. Effort @vel: ~1 day. |
| **P57** | Sprint N — Shareable Output (post-defense) | 📋 PLANNED — moat priority #4 | preflight scaffolded | — | Static HTML export (self-contained `.zip` + "Built with Hey Bradley" footer) + hosted spec URL (Vercel KV preferred; Supabase fallback) — replaces P52/ADR-075 clipboard data URL + ADR-080 (supersedes ADR-075). Manual paste-test gate: Slack + Twitter + iMessage. Effort @vel: ~1 day. POST-DEFENSE only. |
| **P58** | Sprint O — Open Core RC (post-defense) | 📋 PLANNED — public release | preflight scaffolded | — | README rewrite around moat story + CLAUDE.md final accuracy pass + demo video (Hey Bradley vs Lovable side-by-side; 4 moat priorities visible in 30s) + Agentics Foundation beta launch (gated 100-cohort) + public `v1.0.0-RC1` GitHub release + ADR-081. Final persona gate: Grandma ≥85, Framer ≥92, Capstone ≥98. Effort @vel: ~1 day. POST-DEFENSE only. |
| **P35** | Sprint E P2 — ASSUMPTIONS_ATOM Crystal Atom + LLM Lift + EXPERT trace + BYOK matrix completion | **96/100** estimated (Grandma 79 / Framer 91 / Capstone 99) | 9/9 DoD | (pending commit) | **Pre-wave 0 (BYOK audit):** OpenAI provider was MISSING — added `openaiAdapter.ts` w/ `gpt-5-nano` default ($0.05/$0.40 per 1M); installed openai SDK; extended `LLMProviderName`; wired pickAdapter + LLMSettings + key validators. Cost-per-million UPDATED to 2026 prices: Claude Haiku 4.5 $1/$5; Gemini 2.5 Flash $0.30/$2.50. NEW `tests/byok-providers.spec.ts` (20 cases). **Wave 1 A1:** NEW `aisp/assumptionsAtom.ts` (~135 LOC) — verbatim AISP Ω/Σ/Γ/Λ/Ε; Σ {id,label,rephrasing,confidence,rationale}; Γ R1-R5; Λ threshold 0.7 + cost reserve 0.65. NEW `validateAssumptionsAtomOutput()` enforces all rules. NEW `aisp/assumptionsLLM.ts` (~140 LOC) — 6-tier fallback chain (empty → no adapter → cost-cap → throw → error → Σ/Γ fail → SUCCESS) to rule-based stub. **Wave 1 A2:** NEW `AISPPipelineTracePane.tsx` (~150 LOC) — EXPERT-only collapsible pane rendering all 5 atoms in trace order (INTENT → ASSUMPTIONS → SELECTION → CONTENT → PATCH). Hidden in SIMPLE mode; non-blocking. ChatInput integration: `clarification.source` carries LLM/rules/empty; pendingAispRef carries trace. **Wave 2:** ADR-064 full Accepted. NEW `tests/p35-assumptions-atom.spec.ts` (34 cases; **28/35 prompt coverage gate met** — gate raised from P34's 25/35). **Cumulative regression: 211/211 PURE-UNIT GREEN.** Build green. **5-atom AISP architecture in production: PATCH+INTENT+SELECTION+CONTENT+ASSUMPTIONS. Capstone-thesis full exhibit.** |

### Phase-by-phase test growth
| Phase | Targeted Playwright | Suite total |
|---|---:|---:|
| Pre-P15 baseline | — | 102 |
| P15 | 2 added | 104 |
| P16 | 3 added | 107 |
| P17 | 6 added | 113 / 124 in full sweep |
| P18 | 16 added | 129+ Playwright |
| P18b | 5 added (4 in `p18b-logs.spec.ts` + 2 in `p18b-agent-proxy.spec.ts` minus 1 cap-edge xskip) | 36/36 targeted active (+ 2 xskip) |
| P19 step 1+2+3 | 13 added (`p19-step1` x4 + `p19-step2` x4 + `p19-step3` x0 polish + `p19-step3-edges` x5) | 41/41 targeted (+ 2 xskip) |
| P19 fix-pass-2 | 9 added (`p19-fix-hero-on-blog-standard` x1 + `p19-fix-mapchaterror` x6 + `p19-fix-css-injection` x2) | **46/46 targeted active** |
| **Net add through P19** | **+54** | **63 across 29 spec files (full sweep counter; 46 targeted is the seal-gate number)** |

### What's running today
- 100% frontend TypeScript SPA (Vite + React 19 + Tailwind + shadcn).
- sql.js + IndexedDB browser DB, lazy-loaded wasm, cross-tab safe.
- Anthropic + Google + OpenRouter (raw fetch) SDKs in browser with `dangerouslyAllowBrowser: true` (BYOK only).
- FixtureAdapter + AgentProxyAdapter are the active DEV adapters — **zero real-LLM dollars spent across P15-P19**.
- Web Speech API STT (push-to-talk) in P19; voice transcripts route through the same chatPipeline as text.
- ADRs added: P16→040,041; P17→042,043; P18→044,045; P18b→046,047; P19→048. **38 ADR files on disk; numbered up to 048.** Sequential audit (close 11 numbering gaps) is a P20 doc-task.
- Husky pre-commit hook + Vite build-time guard prevent any committed/deployed key.
- DEV-mode `VITE_LLM_API_KEY` boot warning (P19 fix-pass-2 F6).
- CSS-injection-resistant patch validator (`url(`/`@import` blocked, `imageUrl` allow-listed) — P19 fix-pass-2 F3.
- Per-error-kind chat copy via `mapChatError` (4 infra kinds + 2 fallback paths) — P19 fix-pass-2 F2.

---

## 2. To Do (post-P19-seal runway)

> **Velocity reality-check (post-P19, owner-flagged):** P15-P19 + P18b sealed in <1 day. Original 4-6-day-per-phase estimates have been observed 10-50× conservative. Effort columns below carry the original estimates AND the velocity-corrected estimate ("@vel"). Re-budget at end of each phase.

| Phase | Title | Plan ref | Effort | @vel | Real-LLM cost |
|---|---|---|---:|---:|---|
| **Step 4** *(post-DoD optional, gated by `VITE_LLM_LIVE_SMOKE=1`)* | Live LLM smoke against real Haiku | P18 plan §0 Step 3 trailing | ~30 min | ~30 min | ~$0.01 (5 starter prompts × ~$0.002 each) |
| **P20** | Verify, Cost Caps, MVP Close, Vercel Deploy + 20 P19 carryforward items | `06-phase-20-mvp-close.md` + `phase-19/deep-dive/05-fix-pass-plan.md` §5 | 5–7 days (orig) | <1 day | $0 in dev; ~$0.01 if Step 4 runs |
| **Sprint B (P23-P25)** | Simple Chat — natural language input + 2-3 templates + section targeting + intent translation | `phase-22/wave-1/A2-sprint-plan-review.md` §B | <1 day | <1 day | $0 in dev |
| **Sprint C (P26-P28)** | AISP Chat — instruction layer + intent pipeline + 2-step template selection | A2 §C | 1-2 days | 1-2 days | $0 in dev |
| **Capstone defense** | May 2026 panel | — | — | gated | — |
| **Sprint D (P29-P33)** | Templates + Content (5 phases) | A2 §D | post-defense | post-defense | $0 in dev |
| **Sprint E (P34-P37)** | Clarification & Assumptions (4 phases) | A2 §E | post-defense | post-defense | $0 in dev |
| **Sprint F (P38-P40)** | Listen Mode Enhancement (compressed to 3 phases — voice→pipeline already integrated P19) | A2 §F | post-defense | post-defense | $0 in dev |
| **Sprint G (P41-P44)** | Interview Mode (4 phases) | A2 §G | post-defense | post-defense | $0 in dev |
| **Sprint H (P45-P47)** | Post-MVP Upload + References (3 phases) | A2 §H | post-defense | post-defense | $0 in dev |
| **Sprint I (P48-P50)** | Builder Enhancement (3 phases) | A2 §I | post-defense | post-defense | $0 in dev |
| **Sprint J (P50-P53)** | Personality + Mobile + Share + Log (delivered; sealed `644200a`) | sprint-j-personality/03-sprint-j-locked.md | <1 day | sealed | $0 in dev |
| **Sprint K (P54)** | Make The Speed Visible — moat priority #1 | `phase-54/preflight/00-summary.md` + `open-core-moat-roadmap.md` | <1 day | <1 day | $0 in dev |
| **Sprint L (P55)** | Make The Spec Unmissable — moat priority #2 (**most important**) | `phase-55/preflight/00-summary.md` | <1 day | <1 day | $0 in dev |
| **Sprint M (P56)** | Premium Templates — moat priority #3 | `phase-56/preflight/00-summary.md` | <1 day | <1 day | $0 in dev |
| **Sprint N (P57)** | Shareable Output — moat priority #4 (post-defense) | `phase-57/preflight/00-summary.md` | <1 day | <1 day | $0 in dev |
| **Sprint O (P58)** | Open Core RC — public release (post-defense) | `phase-58/preflight/00-summary.md` | <1 day | <1 day | $0 in dev |
| **Deferred to commercial** | Sprint G (Interview), Sprint H (Upload+Refs), Sprint I remainder, original Sprint J Agentic Support, Tier-2 SaaS-dashboard flagship, learning-flywheel runtime | `open-core-moat-roadmap.md` §"What defers" | post-launch | post-launch | — |

> **NOTE on phase numbering (post-Wave-2 ratification + 2026-04-29 moat reframe):** Sequential Option A still holds, BUT 2 NEW phases inserted (P21=Cleanup + P22=Website rebuild) shifted Sprint B-K each +2 phases. Sprint F also COMPRESSED from 4→3 phases (voice→pipeline already integrated P19). Sprint J (P50-P53) was repurposed mid-arc into Personality + Mobile + Share + Log (delivered; sealed `644200a`). **Original Sprint K (P54-P56 "Release / OSS RC") replaced 2026-04-29 by the moat-first sequence:** K=P54 Speed Visible / L=P55 Spec Unmissable / M=P56 Premium Templates / N=P57 Shareable Output / O=P58 Open Core RC. Canonical ratification: `plans/strategic-reviews/open-core-moat-roadmap.md`. Sprints G/H/I-remainder/original-J-Agentic-Support deferred to commercial track.

After P20, the POC ships and the MVP-build arc begins. Capstone-presentation surface = P15+P16+P17+P18+P19+P20 (all sealed) + Sprint B + Sprint C if velocity holds. **Total real-LLM spend MVP-to-date: $0.**

---

## 3. Gaps (deferred from review swarms; not blockers for current phase but worth tracking)

### Carried forward from P15
- Stage-1 backlog (S1-01..S1-29) zero TODOs — DEFERRED out of narrowed scope, marked Post-MVP polish.
- ESLint v9 flat-config migration (predates P15).

### Carried forward from P16
- Audit log LRU bound (currently unbounded; performance concern at high call volume).
- `tests/persistence.spec.ts` uses dev-only private-import path that wouldn't work against a built app.

### Carried forward from P17
- 30s timeout in `auditedComplete` uses `Promise.race` but doesn't actually `AbortSignal` the underlying SDK request — request leaks. Real concern for Step 4 onward (R2 P18 review).
- DEV `VITE_LLM_API_KEY` exposure in DevTools Sources (acknowledged in ADR-043; defensible per BYOK contract but worth runtime warning banner).
- 28 pre-existing Playwright failures in `tests/e2e/`, `tests/phase{2,3}-smoke.spec.ts` — predate P15, unrelated to MVP track.

### Carried forward from P18
- Per-section Crystal Atom inlining (ADR-045 future extension) deferred — global atom sufficient for 5 starters.
- `safeJson`/`classifyError` near-duplicated in claudeAdapter + geminiAdapter; will become triplicated when a 3rd real provider lands. Extract to shared module before that.
- `system.ts` `compactJson` truncates by byte-slicing mid-token; LLM tolerates but section-aware trimming would be cleaner.
- Step 1 wire test artifact: `tests/p18-step1.spec.ts` still loads blog-standard then resets-to-default-config because the original fixture was authored against a different shape. Cosmetic; harmless; can be cleaned up if the fixture is rewritten.
- Two `console.warn` calls in `auditedComplete` + `recordPipelineFailure` are DEV-gated but will be silently shipped to production builds (gate is at runtime, not build-time). Replace with no-op in production for ~10 LOC saved.

### Doc drift
- ~~`CLAUDE.md` still says 37 ADRs / 102 tests~~ **RESOLVED 2026-04-27 in post-P19 doc audit.** `CLAUDE.md` `## Project Status` now reads 38 ADRs through ADR-048 + 63 Playwright cases across 29 spec files (46 targeted active for P19 seal-gate) + ~28,400 LOC TS/TSX across 227 source files. ADR numbering convention (11 holes: 002-004, 006-009, 034-037) documented in `docs/adr/README.md`.

### Architectural future-work (post-MVP signals)
- Adapter `dispose()` so `clearKey` actually invalidates captured SDK clients.
- CSP + `dangerouslySetInnerHTML` audit (planned for P20).
- Supabase Edge Function adapter as a hosted-demo path (post-MVP per planning docs).

---

## 4. Recommendations — Next Steps

### Strongly recommended

1. **Run Step 4 (live LLM smoke) before P19.** ~$0.01 cost, ~30 min, irreversible confidence: a one-time `VITE_LLM_LIVE_SMOKE=1` run against real Haiku across the 5 starter fixtures proves the swap is genuinely one config flip and surfaces any real-API quirks (CORS, rate-limit shapes, tool-use mismatches) **before** P19 layers STT on top. If you skip this and P19 ships green against fixtures only, the first real Haiku call could expose regressions in either pipeline simultaneously.

2. **Update `CLAUDE.md`'s claimed ADR + test counts** before P19 (10-min job). The Capstone reviewer flagged this 3 phases ago and it's still drifting. Easy quality win for the persona scoring at MVP close.

3. **Author one tiny fix** for the `auditedComplete` `Promise.race` timeout to plumb an `AbortSignal` through `LLMRequest` and into the Anthropic + Gemini adapters. Step 4 will reveal this; better to land it now (~30 LOC) than during P19 review.

### Recommended

4. **Greenlight P19 immediately after Step 4.** P19 is structurally simpler than P18 (just adds STT capture; reuses the entire chat pipeline). Same 3-step staging pattern (capture → wire to pipeline → full DoD). Estimated 4–6 days, $0.

5. **Extract `safeJson` + `classifyError` to a shared module** during P19 W1 (5 LOC each in two files; opportunistic cleanup before the inevitable third provider).

### Defer (post-MVP)

6. ESLint v9 flat-config migration.
7. Per-section Crystal Atom inlining.
8. Audit log LRU bound.
9. Adapter `dispose()`.
10. CSP audit (planned for P20 anyway).
11. Stage-1 backlog reconciliation.
12. Supabase Edge Function adapter.

---

## 5. The MVP path remaining

```
[Step 4]      [P19]          [P20]
   ↓            ↓              ↓
~30 min     4–6 days        3–4 days
$0.01       $0              $0
   ↓            ↓              ↓
real-LLM    Listen Mode    Verify + cost
smoke       (Web Speech    cap polish +
proves      API; P18       Vercel deploy
swap        pipeline       + persona
works       reused)        re-score + RC
```

After P20 the MVP is the capstone deliverable. Total spend on real LLM during MVP development: **$0** (P15–P18) **+ ~$0.01** (Step 4 smoke) **= ~$0.01 total**.

---

## 6. Quality trajectory

| Phase | Composite | Δ |
|---|---:|---:|
| P14 (pre-MVP track) | 74 | — |
| P15 | 82 | +8 |
| P16 | 86 | +4 |
| P17 | 88 | +2 |
| P18 | 89 | +1 |
| P18b | 90 | +1 |
| P19 step-3 seal | (84 internal) | -6 (Listen tab regressed Grandma persona) |
| P19 fix-pass-2 (`772c154`) | **88** | **+4 net vs step-3 seal; -2 vs P18b** |

Trend: P19 momentarily dipped on persona regression, then recovered with the brutal-honest fix-pass. Net trajectory across P15→P19: +6 (82→88). P20's 20-item carryforward backlog is on track to pull the composite back to 90+ at MVP close.
