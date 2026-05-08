# ADR-102 — Performance + Accessibility Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P77 / OC-10
- **Cross-refs:** ADR-090 (Mobile UX Redesign), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard)

## Context

Through P58 (Open Core RC) the open-core ships an unbundled tool surface where every route — `/about`, `/blog`, `/blog/:slug`, `/research`, `/how-i-built-this`, `/docs`, `/byok`, `/aisp`, `/open-core`, `/progress`, `/spec/:hash`, `/demo/*` — was eagerly imported in `main.tsx`. The P74 brutal-honest comprehensive review (`plans/strategic-reviews/2026-05-01-comprehensive-review-2-design-ux.md`) flagged three cross-persona pain points: (1) cold load on the marketing surface fetches all 12+ secondary routes; (2) imagery in templates lacked `loading="lazy"` + explicit dims, causing CLS on scroll; (3) icon-only buttons (mic, send, theme-toggle, hamburger, share, export, close) lacked `aria-label`, blocking screen readers and the Capstone reviewer's a11y persona check.

OC-10 ratifies the open-core baseline for both surfaces in one ADR so future contributors have a single bar to clear.

## Decision

The open-core enforces **four** performance + accessibility standards:

### 1. Heavy routes lazy-loaded

All non-primary routes mount via `React.lazy()` + `<Suspense fallback={...}>` in `src/main.tsx`. Eager (static) imports are reserved for `/`, `/builder`, and `*` (NotFound). This keeps the initial JS bundle scoped to the primary tool surface.

### 2. All `<img>` carry `loading="lazy"` + explicit dims

Every `<img>` tag across `src/templates/**`, `src/components/**`, `src/pages/**` carries `loading="lazy"` and explicit `width`/`height` (or aspect-ratio CSS). **Exception:** the above-fold hero image on the landing surface stays eager to preserve LCP.

### 3. ARIA labels on every icon-only button

Every `<button>` whose visible label is an icon (mic, send, close, theme-toggle, mode-toggle, share, export, hamburger, page-tab-close, etc.) carries an `aria-label`. The token `focus-visible:ring-2 focus-visible:ring-[var(--hb-focus)]` is the canonical focus indicator (per ADR-091).

### 4. Bundle gzip cap ≤800KB

Vite production output (`npm run build`) must report total gzipped JS ≤800KB. Verified at gate via the build summary; chunk-splitting is decided by Vite's defaults — no manual `manualChunks` carve-up unless a future ADR opens it.

## Out of scope (Tier-2)

- Full WCAG 2.1 AAA compliance (open-core targets AA where it's free; AAA is a commercial promise)
- Live screen-reader testing (NVDA, VoiceOver, JAWS pass-throughs)
- Mobile gesture a11y (swipe-back, double-tap-zoom, pinch semantics)
- Per-route axe-core CI gate (carry-forward; the spec relies on FS-read invariants)
- Real-user-monitoring (RUM) latency telemetry — Tier-2 commercial

## Acceptance gates

1. `src/main.tsx` imports `React.lazy` and wraps ≥10 secondary routes in `<Suspense>`.
2. Every `<img>` in `src/{templates,components,pages}/**` carries `loading="lazy"` (above-fold hero exempt) and explicit `width`/`height`.
3. Every icon-only button carries `aria-label`; PTT mic, ChatInput send, theme-toggle, hamburger, share, export, close all pass.
4. Production build (`npm run build`) reports total gzipped JS ≤800KB.

## Consequences

**Positive:**
- Cold-load on marketing surface drops to the primary-tool bundle plus the landing route only — measurably faster TTFB on the demo URL.
- Screen-reader pass on the canonical builder surface — Capstone persona crosses the a11y gate.
- Image lazy + dims eliminates the scroll-CLS that the P74 review flagged on `/blog/:slug` and template gallery sections.
- Single ADR + single test spec (`tests/p77-perf-and-a11y.spec.ts`) for the perf+a11y bar — easy onboarding for future contributors.

**Negative:**
- Suspense fallback flash on first navigation to a heavy route. Mitigation: lightweight skeleton (no spinner) per ADR-090.
- ARIA-label discipline is now mandatory; PR reviews must catch missing labels on new icon buttons.
- The 800KB cap is tight; one heavy dependency could break it. Mitigation: ADR-102 forbids new animation libraries (framer-motion already pinned to a single demo file) and prefers CSS-only motion.

**Mitigations:**
- The KISS no-animation-library rule in `src/main.tsx` and `src/store/**` is asserted in the spec — accidental imports surface immediately.
- Bundle cap is a build-time check, not a runtime gate; CI can fail-fast on regression.
