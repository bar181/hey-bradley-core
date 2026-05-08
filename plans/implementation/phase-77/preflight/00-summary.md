# P77 / OC-10 — Performance + Accessibility (Preflight)

> **Phase:** P77 · **Sprint:** OC-10 · **Date:** 2026-05-01
> **Predecessor:** P76 sealed at `32e3b74` (~898+ GREEN, 101 ADRs)
> **Companion:** P78 / OC-11 Multi-Page MVP (parallel)
> **Gap-closure refs:** Gap 7 (mobile public-site polish), Gap 13 (mobile onboarding stretch), partial Gap 12 (visual polish floor)

## 3 parallel agents · disjoint scopes

### A1 — Performance (route lazy + img dims + bundle gate)
**Owns:**
- `src/main.tsx` (EDIT — wrap heavy routes with `React.lazy()` + Suspense fallback: `/demo/*`, `/blog`, `/blog/:slug`, `/research`, `/how-i-built-this`, `/docs`, `/byok`, `/aisp`, `/open-core`, `/progress`, `/spec/:hash`, `/about`)
- All `<img>` tags across `src/templates/**`, `src/components/**`, `src/pages/**` (EDIT — add `loading="lazy"` + explicit `width`/`height` OR aspect-ratio CSS; keep above-fold hero img eager)
- `vite.config.ts` (verify chunk-splitting; do not over-split)

**Constraints:** NO new deps; bundle gzip ≤800KB total (verify via `npm run build` output)

### A2 — Accessibility (axe + aria + alt + focus)
**Owns:**
- All icon-only buttons in `src/components/**` (EDIT — ensure `aria-label` on mic, send, close, theme-toggle, mode-toggle, share, export, hamburger, page-tab-close, etc.)
- `<img>` alt sweep — REPLACE empty/decorative with `alt=""` (decorative) or descriptive alt for content imagery
- Focus-ring audit on interactive surfaces (verify Tailwind `focus-visible:ring-2 focus-visible:ring-[var(--hb-focus)]` token applied)
- `tests/p77-a11y-axe.spec.ts` (NEW — axe-core scan via Playwright per route; ≥4 routes; zero CRITICAL violations; SERIOUS allowed if documented)

**Constraints:** NO new deps EXCEPT `@axe-core/playwright` may be added if not present (devDependency only); else inline regex-based aria audit

### A3 — ADR-102 + 15 tests + EOP
**Owns:**
- `docs/adr/ADR-102-perf-and-a11y.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-090/091/094)
- `tests/p77-perf-and-a11y.spec.ts` (NEW; ≥15 cases — FS-read pattern; Playwright `test.describe` like P74/P75/P76)
- `plans/implementation/phase-77/{02-post-review.md, session-log.md, retrospective.md}`
- CLAUDE.md sync (ADRs → 102; tests +15; perf/a11y in capabilities)

## Hard rules
1. NO new dependencies (axe-core devDep only IF needed; ask first)
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO breaking existing routes
4. Above-fold hero <img> must stay eager (LCP)
5. NO shell commands inside agents (axe runs are at gate via Playwright)
6. TypeScript-strict
7. `tsc --noEmit` must remain clean

## Acceptance gates (combined P77+P78)
- All heavy routes lazy-loaded
- All `<img>` carry `loading="lazy"` (above-fold exception) + explicit dims
- ARIA labels on every icon-only button
- `tests/p77-perf-and-a11y.spec.ts` ≥15 cases GREEN
- `tests/p78-multipage-mvp.spec.ts` ≥15 cases GREEN
- ADR-102 + ADR-103 Accepted
- Cumulative ≥930 GREEN
- tsc strict clean
