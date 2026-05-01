# P72 / OC-TI — Template Intelligence (Preflight)

> **Phase:** P72 · **Sprint:** OC-TI (Template Intelligence)
> **Date opened:** 2026-05-01
> **Status:** OPEN — awaiting owner go for agent dispatch
> **Predecessor:** P70/P71 sealed at `8fa9887` + `29541e0` (774 GREEN, 97 ADRs)
> **Authority:** ADR-098 (just Accepted) — Template Intelligence Architecture

---

## Why this sprint

OC-3 + OC-4 shipped 37 MasterConfig starter packs. Owner reframe at P71 close: starter packs are **onboarding examples** (good and necessary); they are NOT mid-conversation template selectors. The mid-conversation surface needs a **3-layer intelligence** (theme / section / content) with matcher + applier per ADR-098.

This sprint builds the new intelligence layer ALONGSIDE the 37 starter packs. Existing files (`library.ts`, `registry.ts`, `router.ts`) stay untouched — they handle the starter-pack SELECTION_ATOM flow.

---

## 5 parallel agents

### A1 — themeLibrary.ts (NEW; 15-20 theme templates)
Each theme entry:
```ts
{ id, name, description, searchTags[], vectorDescription,
  theme: { primaryColor, secondaryColor, backgroundColor, fontHeading,
           fontBody, borderRadius, shadowStyle } }
```

Examples: warm-minimal · dark-tech · bright-playful · corporate-clean · retro-bold · editorial-cream · saas-modern · neon-graphic · brutalist-monochrome · soft-pastel · medical-trust · bookstore-warm · academic-precise · podcast-purple · agency-bold (15-20 distinct entries)

### A2 — sectionLibrary.ts (NEW; 10-15 section arrangements)
Each section template:
```ts
{ id, name, sections: SectionType[], sectionOverrides: Record<id, SectionConfig>,
  searchTags[], vectorDescription }
```

Examples: saas-landing · personal-brand · product-launch · agency-portfolio · oss-library-landing · podcast-show · clinic-trust · creator-narrative · editorial-blog · conference-event (10-15 distinct entries)

### A3 — contentLibrary.ts (NEW; 10-15 writing-style templates)
Each content template:
```ts
{ id, name, tone, sentenceLength, emojiUsage, headlineStyle,
  copyDensity, pattern, searchTags[], vectorDescription }
```

Examples: don-miller-story · elevator-pitch · article · product-description · fun-casual · professional · technical · emotional · minimalist · bold-agency (per ADR-098 §"Content Template Library")

### A4 — templateMatcher.ts + templateApplier.ts (NEW; 2 files)

`templateMatcher.ts` — pure-function ranking:
- Input: user utterance + INTENT_ATOM classification
- Output: `TemplateMatch[]` per layer, sorted by confidence
- Implementation: keyword-tag scoring + simple similarity heuristic (open-core; HNSW activation is Tier-2 per CLAUDE.md)
- Threshold default 0.8; configurable via constant

`templateApplier.ts` — pure-function patch generator:
- Input: `TemplateMatch` + current `MasterConfig`
- Output: `JsonPatch[]` (per ADR-045 PATCH_ATOM)
- Per-layer patch paths: `/theme/*`, `/sections/{id}/*`, content paths via CONTENT_ATOM regeneration

### A5 — ADR-098 (already shipped) + tests + EOP

ADR-098 already Accepted at this preflight commit. A5 ships:
- `tests/p72-template-intelligence.spec.ts` (≥20 cases) — matcher returns ranked candidates; applier emits valid patches; libraries each have ≥ specified entries; confidence threshold fires ASSUMPTIONS_ATOM at <0.8
- `plans/implementation/phase-72/{02-post-review.md, session-log.md, retrospective.md}`
- CLAUDE.md update: ADRs → 98; tests → 794+; new aggregate "Template Intelligence (3-layer)" listed

---

## Hard rules

1. NO new dependencies; NO library imports beyond existing app modules
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs (irrelevant — no UI in this sprint)
3. NO touching existing `library.ts` / `registry.ts` / `router.ts` (SELECTION_ATOM starter-pack flow stays intact)
4. NO touching the 37 MasterConfig templates (they stay as onboarding examples)
5. NO HNSW activation (Tier-2 deferred); matcher uses keyword + tag similarity only
6. Per-file LOC caps: themeLibrary ≤ 600 (data-heavy); sectionLibrary ≤ 500; contentLibrary ≤ 400; templateMatcher ≤ 250; templateApplier ≤ 250
7. TypeScript-strict; no `any`
8. NO shell commands inside agents
9. All new types exported from `src/contexts/intelligence/templates/index.ts` (touch only the index export block, not other registry logic)

---

## Acceptance gates

- 5 NEW files exist
- ≥ 15 themes, ≥ 10 section arrangements, ≥ 10 content templates
- Matcher returns `TemplateMatch[]` with confidence per layer
- Confidence < 0.8 fires ASSUMPTIONS_ATOM (round-trip with existing `assumptionStore`)
- Applier emits valid `JsonPatch[]`
- ≥ 20 PURE-UNIT cases passing
- tsc clean
- Cumulative ≥ 794 GREEN

---

## Successor

OC-TI Wave 2 (UI surface for the matcher — show candidate templates in chat thread before applying) — owner decides scheduling.

OR direct continuation to OC-12 (live-LLM smoke) / OC-9 (Export polish) / OC-11 (multi-page MVP).

---

## Awaiting owner go

The 5-agent dispatch is queued. Type "Dispatch OC-TI" to proceed, or revise the brief first.
