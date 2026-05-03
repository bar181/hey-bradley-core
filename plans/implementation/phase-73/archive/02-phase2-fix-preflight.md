# P73 Phase 2 — Fix Sprint Preflight

> **Date:** 2026-05-01
> **Source:** `plans/strategic-reviews/2026-05-01-template-audit.md` (Phase 1)
> **Status:** OPEN — 5-agent parallel dispatch authorized

---

## Audit-driven scope (5 agents, disjoint files)

### A1 — Fix bottom-5 templates + typography drift
**Owns:** 5 JSON template files
- `src/data/examples/blank.json` (3/10 → ≥7) — generic copy is BY DESIGN per OC-1 recon; honest path: rename concept to "starter scaffold" + improve hero copy slightly so it scores ≥7 without losing its "blank canvas" purpose
- `src/data/examples/kitchen-sink.json` (4/10 → ≥7) — fix copy gaps + section ordering
- `src/data/examples/blog-standard.json` (6/10 → ≥7) — improve copy + **fix DM Sans drift → Inter**
- `src/data/examples/api-docs-landing.json` (6/10 → ≥7) — strengthen technical-credibility content
- `src/data/examples/launchpad.json` (6/10 → ≥7) — replace generic SaaS copy with vertical-specific
- `src/data/examples/law-firm.json` — **fix Georgia drift → Fraunces** (font compliance only; otherwise scoring 8+)

### A2 — themeLibrary.ts: exampleQueries + 3 new themes
**Owns:** `src/contexts/intelligence/templates/themeLibrary.ts` only

- Add to `ThemeTemplate` interface: `exampleQueries: readonly string[]` (REQUIRED; 2-3 sample user utterances per entry)
- Backfill 18 existing entries with realistic queries (e.g., warm-minimal: ["make it warmer", "I want something approachable", "cozy feel"])
- Add 3 new themes per audit gap: `dark-feminine` · `industrial-modern` · `cozy-maximalist` (full ThemeTemplate with all fields including exampleQueries)
- Final count: 21 themes

### A3 — sectionLibrary.ts: exampleQueries + 3 new arrangements
**Owns:** `src/contexts/intelligence/templates/sectionLibrary.ts` only

- Add `exampleQueries: readonly string[]` to `SectionTemplate` interface (REQUIRED)
- Backfill 12 existing entries with 2-3 user utterances each
- Add 3 new arrangements per audit: `course-landing` · `booking-calendar` · `newsroom`
- Final count: 15 arrangements

### A4 — contentLibrary.ts: exampleQueries + 3 new styles
**Owns:** `src/contexts/intelligence/templates/contentLibrary.ts` only

- Add `exampleQueries: readonly string[]` to `ContentTemplate` interface (REQUIRED)
- Backfill 12 existing entries with 2-3 user utterances each
- Add 3 new styles per audit: `instructional` · `punchy-social` · `sales-pressure`
- Final count: 15 styles

### A5 — Tests + EOP
**Owns:**
- `tests/p73-template-audit-fix.spec.ts` (NEW; ≥15 cases)
- `plans/implementation/phase-73/{02-post-review.md, session-log.md, retrospective.md}`
- CLAUDE.md surgical update (templates count; library counts; ADR ledger note re audit)

Tests assert:
- All 21 themes have `exampleQueries` (length ≥1)
- All 15 sections have `exampleQueries`
- All 15 content styles have `exampleQueries`
- Bottom-5 templates have hero `padding: '80px 24px'` + no system-ui/Georgia/DM Sans
- New theme/section/content slugs exist in their libraries
- `THEME_LIBRARY.length >= 21`, `SECTION_LIBRARY.length >= 15`, `CONTENT_LIBRARY.length >= 15`
- **Backward compat:** `templateMatcher.ts` still imports successfully (interface change is additive REQUIRED — but new field auto-fills downstream paths)

---

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new section types (use existing 16)
4. Surgical edits — preserve all existing entries
5. NO touching `library.ts` / `registry.ts` / `router.ts` / `templateMatcher.ts` / `templateApplier.ts` (those consume the libraries; interface additions are safe but DO NOT modify consumers)
6. NO shell commands inside agents
7. TypeScript-strict; `exampleQueries: readonly string[]` (no `any`)

## Acceptance gates
- A1: 6 templates touched; bottom-5 score ≥7; law-firm + blog-standard typography fixed
- A2: 21 themes with exampleQueries
- A3: 15 sections with exampleQueries
- A4: 15 content styles with exampleQueries
- A5: ≥15 PURE-UNIT cases passing
- tsc clean
- Cumulative ≥838 GREEN (823 + 15)
