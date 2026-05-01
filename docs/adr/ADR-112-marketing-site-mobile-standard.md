# ADR-112 — Marketing Site Mobile Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P87 / OC-5-MKT-MOBILE
- **Cross-refs (primary):** ADR-090 (Mobile UX Redesign — app mobile, P69), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-102 (Performance + Accessibility Standard)

## Context

ADR-090 redesigned the BUILDER app for mobile in P69 / OC-5 (single-surface chat + inline mic + bottom sheet). That sprint scoped the **app shell** (`src/components/shell/Mobile*.tsx`), not the **marketing site** — the eight public-facing pages users hit before they ever open the builder. Marketing site mobile (`About`, `AISP`, `OpenCore`, `HowIBuiltThis`, `Docs`, `BYOK`, `Blog`, `Progress`) was deferred at OC-5 close and recorded as carry-forward in CLAUDE.md.

P87 closes that gap before commercial Tier-2 work begins. The deferral has lived on the carry-forward ledger since P69; the v1.0.0-RC1 ship at P84 raised the cost of leaving it open — anyone arriving from Show HN or Product Hunt on a phone hits the marketing site first, and a broken hero or overflowing CTA is a worse first impression than the builder being mobile-rough on day-one beta.

## Decision

ADR-112 names four standards governing marketing site mobile from this seal forward.

### 1. All 8 marketing pages render cleanly at 375 / 390 / 428px

The three iPhone/Android baseline widths anchor the breakpoint sweep. Each of the eight pages (About, AISP, OpenCore, HowIBuiltThis, Docs, BYOK, Blog, Progress) renders without horizontal scroll, without text-overflow clipping, and without nav collapse failure at all three widths. Welcome.tsx is **out of scope** — owned by P86 / A2 polish dispatch.

### 2. WCAG 44px touch target floor on all interactive surfaces

Every CTA button, nav link, dismiss control, expand/collapse toggle on the eight pages meets the WCAG 2.1 AA touch-target floor of 44px × 44px on mobile. Surgical class additions only: `min-h-[44px]` + `px-4 py-3` baseline; no new component primitives.

### 3. Tailwind responsive classes only — no new CSS files; no inline style

Surgical class additions inside JSX: `flex-col md:flex-row`, `text-2xl md:text-4xl`, `px-4 md:px-8`, `w-full md:w-auto`, `gap-4 md:gap-8`. Every page MUST contain ≥3 `md:`-prefixed responsive classes after the sweep — measurable proxy for "mobile-first responsive" without forcing a render-time spec. No new `.css` files; no inline `style={...}` blocks; no animation library imports (KISS continuation per ADR-094).

### 4. Lighthouse mobile target ≥85 — declared standard

Lighthouse mobile score ≥85 across all eight pages is the **declared target** for this standard. Live measurement is a post-RC owner task (the owner-launch-checklist already lists "BYOK smoke + record demo video"; Lighthouse mobile sweep joins that list). Declaring the target now anchors the gate that future agent-led marketing edits cite when adding new pages or sections.

## Out of scope (Tier-2 / deferred)

- Video embed responsiveness (Tier-2 — no marketing pages currently embed video; standard added when first video lands)
- Gesture-based mobile interactions — swipe-to-dismiss nav, pull-to-refresh, pinch-zoom (Tier-2 native mobile)
- Full PWA install flow — manifest, service worker, install banner (Tier-2 commercial)
- Live Lighthouse measurement (post-RC owner task; declared target preserved as gate)

## Acceptance gates per decision

1. **D1:** Every marketing page in scope shows ≥3 `md:`-prefixed Tailwind classes in source. Tests assert this on each of the 8 files. The proxy is conservative — passing it doesn't guarantee a great mobile render, but failing it guarantees a regression.
2. **D2:** Touch-target audit happens at code-review time. Reviewers cite ADR-112 §2 on any CTA button missing the 44px floor.
3. **D3:** Any new marketing page MUST follow the same responsive-class pattern. ADR-112 §3 is the citable rejection criterion for inline-style or new-CSS-file PRs.
4. **D4:** Post-RC owner runs Lighthouse mobile across the 8 pages. Score <85 on any page opens an OC-CLEANUP carry-forward.

## Consequences

**Positive:**
- The eight marketing pages render cleanly on the three baseline mobile widths users actually hit (iPhone SE / iPhone 14 / Pixel-class). First impression from Show HN / Product Hunt traffic improves before commercial Tier-2 starts.
- The "no new CSS files, no inline style, Tailwind responsive only" constraint preserves the bundle-size discipline ADR-102 set (≤800KB gzip). Mobile sweep adds zero KB.
- The ≥3 `md:` floor is an objective, citable gate. Future agents adding marketing pages have a clear bar.

**Negative:**
- Lighthouse target is declared, not measured live — the gate is conditional on owner-side post-RC measurement. Mitigation: ADR-112 §4 names the gate; CLAUDE.md carry-forward names the measurement.
- "Render cleanly" is a judgment call — the ≥3 `md:` proxy catches gross regressions but not subtle ones (hero text 30% too large on 375px still passes the proxy if `md:text-4xl` is present). Mitigation: code-review discipline + post-RC visual audit + owner Lighthouse pass.
- Welcome.tsx is out of scope — P86 / A2 owns. Cross-sprint coordination risk if A2 and A4 land conflicting nav patterns. Mitigation: disjoint file ownership (Welcome ≠ the 8 marketing pages); ADR-112 explicitly names Welcome as out-of-scope.

**Mitigations:**
- ADR-112 cross-refs ADR-090 (app mobile precedent), ADR-091 (token-derived spacing), ADR-094 (professional polish standard), ADR-102 (perf+a11y baseline) — four pillars governing how mobile marketing fits the broader OC discipline.
- A4 (source edits) + A5 (ADR + tests + EOP) is the two-agent dispatch closing the standard into production. P86 runs in parallel with disjoint scope.
