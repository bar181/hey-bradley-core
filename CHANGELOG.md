# Changelog

All notable changes to **hey-bradley-core** are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project does not yet follow strict SemVer (v1.0.0-RC1 is the first tagged release).

## [v1.0.0-RC1] — 2026-05-01

First release-candidate of the Hey Bradley open-core SPA. **84 phases sealed (P11 → P83)**; ~996 cumulative pure-unit GREEN; **108 ADRs Accepted**; 41 templates; 21 themes; 18 section types; 12 blog posts; 5-atom Crystal Atom AISP architecture (+ DECOMP front-of-pipeline).

### Foundation phases (P11 — P22)

- **P11** — Public marketing site + enhanced demos + brand and design locks. CLOSED 83/100.
- **P12** — Content Intelligence: site-context derivation, 13 image effects, Resources tab. CLOSED 78/100.
- **P13** — Advanced features: blog section type, multi-page scaffolding, ZIP export, a11y baseline, 100+ tests. CLOSED 76/100.
- **P14** — Marketing review: 20 issues fixed; AISP validation; UI/UX cleanup. CLOSED 74/100.
- **P15** — Polish + Kitchen Sink + Blog + Novice simplification. CLOSED 82/100.
- **P16** — Local database (sql.js + IndexedDB). CLOSED 86/100.
- **P17** — LLM provider abstraction + env-var + BYOK scaffold. CLOSED 88/100.
- **P18** — Real Chat mode (LLM → JSON Patches). CLOSED 89/100.
- **P18b** — Provider expansion + observability (5-adapter matrix; `llm_logs` table). CLOSED 90/100.
- **P19** — Real Listen mode (Web Speech STT + voice-to-pipeline; 18-item fix-pass). CLOSED 88/100.
- **P20** — Verify, cost-caps, MVP close: CostPill, AbortSignal C20, mvp-e2e, getting-started, CONTRIBUTING. CLOSED 88/100.
- **P21** — Cleanup + ADR/DDD gap-fill. SEALED.
- **P22** — Public website rebuild: BYOK demo + Don Miller blog-style. CLOSED 81/100.

### Sprints A — F (P23 — P38)

- **Sprint B (P23 — P25)** — Simple Chat (template-first routing), section targeting via `/hero-1` keyword scoping, intent translation (verb / type / ordinal rewrites; idempotent). ADRs 050-052.
- **Sprint C (P26 — P28)** — AISP instruction layer (Crystal Atom + rule-based classifier), LLM-native AISP (Crystal Atom verbatim → LLM), 2-step template selection (SELECTION_ATOM). ADRs 053, 055-057.
- **Sprint D (P29 — P33)** — Template Library API, template persistence (migration 003 + `userTemplates` repo), Content Generators POC (CONTENT_ATOM), multi-section content pipeline, Content + Template bridge. ADRs 058-062.
- **Sprint E (P34 — P35)** — UI closure + Assumptions Engine; ASSUMPTIONS_ATOM Crystal Atom + LLM lift + EXPERT trace pane + BYOK matrix completion (OpenAI added). ADR-064. **5-atom AISP in production.**
- **Sprint F (P36 — P38)** — Listen + AISP unification (review-first voice UX); command triggers + content/design route split + ListenTab refactor (947 → 84 LOC); Sprint F SEAL. ADRs 065-066.

### Sprints G — J (P44 — P53)

- **Sprint H (P44 — P46)** — Brand Context Upload, codebase reference ingestion, Reference Management UI + Sprint H SEAL. ADRs 067-069.
- **Sprint I (P47 — P49)** — Builder UX polish + a11y, Quick-add picker + Improvement Suggestions, mobile polish + C11 closure + Sprint I SEAL. ADRs 070-072.
- **Sprint J (P50 — P53)** — Personality Engine + composition, Personality Picker UI + onboarding + 5 bubble styles, Conversation Log EXPERT tab + Share Spec clipboard, mobile UX overhaul (3-tab nav + hamburger; later superseded by ADR-090) + Sprint J SEAL. ADRs 073-076.

### Moat sprints K — N (P54 — P57)

- **P54 / Sprint K** — Make the speed visible: latency capture + UI badge. Moat priority #1. ADR-077.
- **P55 / Sprint L** — Make the spec unmissable: AISP always-on + atom animations + spec primary tab. Moat priority #2. ADR-078.
- **P56 / Sprint M** — Premium templates: 3 — 5 strongly opinionated templates + design discipline. Moat priority #3. ADR-079.
- **P57 / Sprint N** — Shareable output: static HTML export + content-addressable share URL stub. Moat priority #4. ADRs 080-081.

### RC + QA arc (P58 — P60)

- **P58 / Sprint O** — Open Core RC: README / CLAUDE final + demo video + Agentics Foundation beta + `v1.0.0-RC1` public release path. ADR-082.
- **P59** — Test library prompt corpus: 280-entry canonical corpus for AgentProxy + live-LLM testing arc. ADR-083. (366/366 PURE-UNIT GREEN at seal.)
- **P60** — Comprehensive QA architecture: 50 personality + 80 LLM matrix + flagship + 2 persona templates + 4 per-concern specs + reviewer-impression + competitive. ADR-084. (392/392 PURE-UNIT GREEN at seal.)

### OC arc (P61 — P83)

- **P61** — Multi-page MVP planning. ADR-085 + ADR-086 (Process Pages content / runtime split).
- **P62 / OC-1** — First design tokens.
- **P63 / OC-2** — Mode architecture + agentics data model. ADRs 088-089.
- **P64 / OC-3** — Share-bundle polish.
- **P65 / OC-2.5** — Design tokens v2 + canonical components. ADR-087.
- **P65b / OC-2.5 Wave 2** — Canonical component quality. ADR-091.
- **P66 / OC-MKTG** — Marketing-site refresh + Polish Sprint Wave 1. ADR-092.
- **P67 / Polish Wave 2** — Component decomposition standard. ADR-093.
- **P67b / Close-the-Gap** — Professional grade standard. ADR-094.
- **P67c / Library-Wide Polish** — ADR-095.
- **P68 / OC-4** — Templates Round 2: 11 new templates + visual-style filter. ADR-096.
- **P69 / OC-5** — Mobile UX redesign: single-surface chat + inline mic + bottom sheet. ADR-090 supersedes ADR-076.
- **P70 / OC-CLEANUP** — Docs / scoring cleanup. Pure docs, zero feature work, zero new tests by design.
- **P71 / OC-13** — Blog expansion: 4 → 10 posts + read-time / share / tag-filter + RSS stub. ADR-097.
- **P72 / OC-TI** — Template Intelligence (3-layer: theme / section / content). ADR-098.
- **P73 / OC-TPL-AUDIT** — Audited 37 starter packs + 3 P72 libraries; bottom-5 fixes; `exampleQueries` REQUIRED on all 51 entries; libraries are LLM-training-ready.
- **P74 / OC-DECOMP + Highlights + Demo + Comprehensive Review** — DECOMP_ATOM front-of-pipeline multi-clause splitter + todoExecutor; chat highlight surface + ConversationLogTab full-detail; FullSiteSimulator 10-step demo at `/demo/full-site`. ADR-099. Brutal-honest 4-persona review at `plans/strategic-reviews/2026-05-01-comprehensive-review-{1-features,2-design-ux,3-gaps-resolutions}.md`.
- **P75 / OC-7** — Section Type closure: case-study + contact-form widen the enum 16 → 18. ADR-100.
- **P76 / OC-9** — Spec Export Quality Standard: canonical export modal CTAs + valid HTML5 static export + versioned AISP filename pattern + ≥3-heading spec generators. ADR-101.
- **P77 / OC-10** — Performance + accessibility baseline: route lazy via `React.lazy + Suspense`, `<img loading="lazy">` with explicit dims, aria-labels on icon-only buttons, bundle gzip cap ≤800 KB. ADR-102.
- **P78 / OC-11** — Multi-page MVP wire: `activePageId` in `uiStore`, PageSelector tabs in left panel, per-page `bundle.pages[]` emission, static-HTML `<nav class="hb-page-nav">`, single-page mode preserved byte-equivalent. ADR-103.
- **P79 / OC-14** — Page-aware chat pipeline: `pageIterator` pure module + `scopeRoot` path prefix at chatPipeline apply sites. ADR-104.
- **P80 / OC-15** — Agentic-product templates: 4 vertical-positioned (ai-agent-marketplace, ai-coding-copilot, ai-workflow-platform, ai-support-copilot). Template count 37 → 41. ADR-105.
- **P81 / OC-16** — Prompt Library completeness: corpus 280 → 500+; 6 categories with multi-page + template-triggers + DECOMP multi-clause + listen-mode transcripts; 8-field schema. ADR-106.
- **P82 / OC-CLEANUP** — Pre-RC cleanup batch: page-aware INTENT_ATOM + DECOMP page-targeting + mobile drawer page selector wired in source; +2 blog posts to meet ADR-097 floor (10 → 12); RSS refresh; EOP audit. ADR-107.
- **P83 / OC-17** — AISP Adoption Push: README rewrite (AISP-first; 5-step "Adopting AISP" quickstart); `docs/aisp-adoption/` 3-doc guide tree; `examples/3rd-party-consumer/` polyglot reference impls (TS + Python; stdlib-only; zero `package.json`; zero `requirements.txt`). ADR-108.

### Highlights

Concrete numbers at v1.0.0-RC1 seal:

- **84 phases** sealed (P11 → P83)
- **108 ADRs** Accepted on disk (range ADR-045 — ADR-108)
- **~996+ cumulative pure-unit GREEN** at the curated seal-gate subset; **671 tests** GREEN across the session OC chain (P62 — P83)
- **41 templates** (17 baseline + 3 OC-3 + 11 OC-4 + 4 P75 + 4 OC-15 + 2 follow-ons reorganised)
- **21 themes**; **15 section arrangements**; **15 content styles**; all 51 Template-Intelligence entries carry `exampleQueries`
- **18 section types** (incl. blog, case-study, contact-form)
- **12 blog posts** (≥12 per ADR-097)
- **5-atom Crystal Atom AISP architecture** in production: SELECTION + CONTENT + INTENT + ASSUMPTIONS + AISP-instruction. **+1 front-of-pipeline:** DECOMP_ATOM (multi-clause splitter; ADR-099).
- **Multi-page** support (per-page bundle, page-aware pipeline)
- **3 BYOK providers**: Claude (Anthropic), Gemini (Google AI Studio), OpenRouter
- **Web Speech STT** Listen mode (PTT)
- **Static HTML export** (valid HTML5; per-page emission; navigation `<nav class="hb-page-nav">`)
- **300 images** in media library; **13 image effects** (8 core + 5 wow-factor)
- **5 EXPERT center tabs**: Preview, Blueprints, Resources, Data, Pipeline
- **7 Blueprint sub-tabs**: North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON
- **126 ruvector entries** (manually curated; HNSW activation deferred to Tier-2)

### Adoption surface (P83)

The v1.0.0-RC1 release ships a complete AISP adoption path:

- **README.md** — AISP-first rewrite (≤300 LOC) with a 5-step "Adopting AISP" quickstart
- **`docs/aisp-adoption/`** — 3-doc adoption guide tree (`00-getting-started.md` + `01-bundle-schema.md` + `02-reference-implementation-walkthrough.md`; ≤200 LOC each)
- **`examples/3rd-party-consumer/`** — polyglot reference implementations (`parse-aisp-typescript.ts` + `parse-aisp-python.py` + `sample-bundle.json` + README); **stdlib-only**; **zero `package.json`**; **zero `requirements.txt`**

The bundle parsing surface is stable across `aisp-1.X` minor versions. See ADR-108.

### Known limitations

Honest list of things deliberately deferred from open-core RC:

- **Hosted share URL** — content-addressable share-spec URL is a stub at RC. Hosted serving deferred to Tier-2 commercial.
- **HNSW vector-DB activation** — ruvector exists as a manually-curated static snapshot (126 entries, 0 indexed vectors). HNSW re-index + auto-write per agent run deferred to Tier-2 learning runtime.
- **Multi-tenant** — open-core is single-user single-browser. OAuth + Supabase persistence deferred to commercial repo.
- **Native mobile apps** — none. Mobile UX is responsive-web only (ADR-090).
- **Full WCAG AAA** — open-core ships a WCAG 2.1 AA-leaning baseline (ADR-102). AAA contrast everywhere not guaranteed.
- **Localization** — English only. i18n surface is not wired.
- **Live-LLM evaluation harness** — the 280 / 500-entry prompt corpus runs against AgentProxy mock; live-LLM matrix execution against the 5-adapter set is deferred (ADR-083 / ADR-084 acknowledge this).
- **Original Sprint J (Agentic Support System)** — reframed; deferred to commercial.
- **Tier-2 SaaS-dashboard flagship** — separate repo.
- **External community engagement** (1 — 2 weeks marketing / advocacy / conferences) — owner-led post-RC.
- **AISP RFC process for breaking changes** — slated for P84 / OC-18.

### Migration / breaking changes

**None.** This is the first release candidate; there is no prior tag to migrate from.

**AISP versioning policy (per ADR-108):**

- `aisp-1.X` minor bumps preserve backward compatibility on the bundle parsing surface. Reference implementations in `examples/3rd-party-consumer/` will continue to parse all `aisp-1.X` bundles.
- `aisp-2.0` and later major bumps require an **RFC issue** with: motivation, alternatives considered, migration path, and a backward-compat shim plan. See CONTRIBUTING.md "AISP RFC process".

[v1.0.0-RC1]: https://github.com/bar181/hey-bradley-core/releases/tag/v1.0.0-RC1
