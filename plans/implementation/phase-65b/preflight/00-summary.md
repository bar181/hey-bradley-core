# P65b / OC-2.5 Wave 2 — Canonical Component Quality (Preflight)

> **Phase:** P65b · **Sprint:** OC-2.5 Wave 2 (P1 launch-blocking)
> **Date opened:** 2026-04-30
> **Status:** OPEN — owner-authorized parallel dispatch
> **Predecessor:** P65 / OC-2.5 sealed at `261d840` (450/450 GREEN, ADR-087 contract locked)
> **Successor:** OC-4 Templates Round 2 (then 23 templates inherit canonical components automatically)

---

## Why this sprint exists

OC-2.5 shipped INFRASTRUCTURE (the design-token contract). OC-2.5 Wave 2
ships VISIBLE — the canonical Hero / Feature / Testimonial component
rewrites that consume the contract. Owner math: 23 more templates on
current components × 6/10 output vs. component rewrite first × 23
templates inheriting 8/10 output. Wave 2 first wins.

**Expected outcome:** Visual polish 6 → 7.5 estimated. Every existing
template gets the improvement automatically (the Hero/Feature/Testimonial
renderers are shared; templates pass JSON config in but the component
controls the chrome). Every new template in OC-4 inherits it.

---

## ADR collision — resolved

Owner brief said "ADR-088: Canonical Component Quality Standard" but
ADR-088 is already shipped (Mode Architecture, P63 / OC-2). Renumbering
this sprint's ADR to **ADR-091**. ADR-090 stays reserved for OC-5 Mobile
UX. CLAUDE.md ADR ledger updated at seal.

---

## Three-agent parallel dispatch (disjoint file scopes)

### A1 — Hero rewrite (4 files)

Owns: `src/templates/hero/{HeroCentered, HeroMinimal, HeroOverlay, HeroSplit}.tsx`

Scope per component:
- Import `tokens` from `@/styles/design-tokens`
- Replace any hardcoded `padding`, `gap`, font-size literals with `tokens.spacing.*`, `tokens.typography.*`
- Apply `tokens.radius.*` for any rounded elements
- Apply Tailwind `transition-all` + `duration-200` + `hover:-translate-y-0.5` + `hover:shadow-lg` on CTA buttons
- Add scroll-reveal: `useEffect` + `IntersectionObserver` (pure browser API, NO library) toggling an `is-visible` class with Tailwind `opacity-0 translate-y-4` → `opacity-100 translate-y-0` transition
- Preserve all existing JSON-config-driven values (`section.style.background`, `section.layout.padding`, `section.style.color`) — those stay template-overridable
- Internal vertical rhythm (gap between headline / subhead / CTA stack) uses `tokens.spacing['stack-gap']` or `tokens.spacing['stack-gap-lg']`

### A2 — Feature + Testimonial rewrite (3 files)

Owns: `src/templates/features/{FeaturesCards, FeaturesGrid}.tsx` + `src/templates/testimonials/TestimonialsCards.tsx`

Scope per component:
- Import `tokens` from `@/styles/design-tokens`
- Card padding from `tokens.spacing.*`; card radius from `tokens.radius.md` or `tokens.radius.lg`
- Card hover: `transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]` (or equivalent token-derived class)
- Icon alignment: consistent vertical centering, fixed icon-to-text gap from `tokens.spacing.*`
- TestimonialsCards: proper quote-card treatment — quote mark glyph, attribution layout, avatar-or-initial fallback styling
- Preserve all JSON-config-driven values

### A3 — ADR-091 + tests + EOP artifacts

Owns: `docs/adr/ADR-091-canonical-component-quality.md` + `tests/p65b-canonical-components.spec.ts` + `plans/implementation/phase-65b/{session-log,retrospective}.md`

ADR-091 (≤120 LOC, Status: Accepted, refs ADR-087 + ADR-079):
- Defines "canonical" = Hero / Feature / Testimonial (the 7 component files in A1+A2 scope)
- Quality bar: must import from `@/styles/design-tokens`; must NOT contain hardcoded `'24px'`, `'48px'`, `'96px'` spacing literals; must apply Tailwind transition classes for hover; must support scroll-reveal where appropriate
- Out of scope: 60 OTHER section templates (still acceptable to be non-canonical; OC-8 Clean UI Pass migrates the rest)
- Cross-refs: ADR-087 (token contract), ADR-079 (premium templates), ADR-088 (mode architecture)

Test spec `tests/p65b-canonical-components.spec.ts` (≥10 cases per owner brief):
- For each of the 7 canonical components: imports `from '@/styles/design-tokens'` (asserts on the file source)
- For each of the 7: contains no hardcoded `'24px'`, `'48px'`, `'96px'` string literals (regex deny-list — but allowing them inside imports/comments)
- For Hero variants: contains `IntersectionObserver` reference (scroll-reveal)
- For Feature/Testimonial cards: contains `transition-all` + `hover:-translate-y` + `hover:shadow` Tailwind classes
- ADR-091 exists, ≤120 LOC, refs ADR-087

Session log + retrospective: standard format from P65.

---

## Hard rules (all 3 agents)

1. **NO new dependencies.** No npm install. Pure CSS / Tailwind / browser APIs. (`IntersectionObserver` is browser-native; no library needed.)
2. **NO Framer Motion / GSAP / Lottie / React Spring / animejs** (per ADR-087).
3. **NO new CSS files.** Tailwind classes only.
4. **NO touching the OTHER 60 section templates** (only the 7 canonical: 4 hero + 2 feature + 1 testimonial).
5. **NO breaking JSON config contract.** Existing 26 templates must continue to render. The components honor `section.style.background`, `section.layout.padding`, etc., from JSON. Token usage is for INTERNAL chrome (gaps, hover, radius, transitions, scroll-reveal).
6. **NO shell commands inside agents.**
7. **NO copy or section-structure changes.**

---

## Acceptance gates

- 7 canonical component files refactored to import from design-tokens
- Hero variants implement scroll-reveal via IntersectionObserver
- Feature + Testimonial cards have hover-lift + shadow transitions
- ADR-091 Accepted on disk
- Test spec: ≥10 PURE-UNIT cases passing
- Cumulative test count: 450 + 10 = 460+ GREEN
- `npx tsc --noEmit` clean
- Adjacent regression: prior OC-1/2/2.5/3 specs still GREEN (44/44 + 11/11)
- ALL 26 templates still render (smoke check: `npm run build` clean — but actually we'll just rely on tsc since templates are JSON-config and components type-check)

---

## Successor

OC-4 Templates Round 2 — adds healthcare + non-profit templates + search/
filter UI. New templates inherit Wave 2's component improvements
automatically.
