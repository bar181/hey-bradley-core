# P87 — Post-Review (OC-5-MKT-MOBILE)

> **Phase:** P87 · **Sprint:** OC-5-MKT-MOBILE · **Date:** 2026-05-01
> **Predecessor:** P85 sealed at `6ce19d7` (~1026+ GREEN, 110 ADRs)
> **Companion:** P86 (Polish Wave 4, parallel; combined seal)

## Mandate

P69 / ADR-090 redesigned the **app shell** for mobile (single-surface chat + inline mic + bottom sheet). The **marketing site** (8 public-facing pages users hit before opening the builder) was deferred and lived on the CLAUDE.md carry-forward ledger from OC-5 close until P87. v1.0.0-RC1 raised the cost of leaving it open — Show HN / Product Hunt mobile traffic hits these pages first.

P87 closes the gap with a 2-agent disjoint-scope dispatch.

## Per-agent score

### A4 — Marketing site mobile audit + fix (8 pages)

**Owns:**
- `src/pages/About.tsx`, `AISP.tsx`, `OpenCore.tsx`, `HowIBuiltThis.tsx`
- `src/pages/Docs.tsx`, `BYOK.tsx`, `Blog.tsx`, `Progress.tsx`

**Standard:** Each page ships ≥3 `md:`-prefixed Tailwind responsive classes; no new CSS files; no inline style; no animation lib imports; 44px touch-target floor on CTAs; render cleanly at 375 / 390 / 428px.

**Score:** Pending A4 self-report at session-log roll-up. Surgical-class-only constraint preserves bundle size (ADR-102 ≤800KB gzip — zero new KB).

### A5 — ADR-112 + tests + EOP closer (this agent)

**Owns:**
- `docs/adr/ADR-112-marketing-site-mobile-standard.md` (NEW; ≤120 LOC; Status Accepted)
- `tests/p87-marketing-mobile.spec.ts` (NEW; 4 describe blocks P87.1-P87.4 / 12 cases)
- `plans/implementation/phase-87/02-post-review.md` (this file)
- `plans/implementation/phase-87/session-log.md`
- `plans/implementation/phase-87/retrospective.md`
- `CLAUDE.md` (combined P86+P87 sync)

**Score:** ADR ≤120 LOC ✓. Status Accepted markdown-bold-tolerant ✓. Cross-refs ADR-090 / 091 / 094 / 102 ✓. Tests use `@playwright/test`, FS-read PURE-UNIT, existsSync guards on A4 surfaces ✓. EOP triplet hard-gate ✓.

## Honest declarations (deferred / Tier-2)

- **Live Lighthouse mobile measurement** — post-RC owner task. The ≥85 target is the **declared standard**; the live sweep joins the existing owner-launch-checklist (BYOK smoke + record demo + post Show HN). Score <85 on any of the 8 pages opens an OC-CLEANUP carry-forward.
- **Video embed responsiveness** — DEFERRED to Tier-2. No marketing page currently embeds video; standard added when the first video embed lands.
- **Gesture-based mobile interactions** — swipe-to-dismiss nav, pull-to-refresh, pinch-zoom — DEFERRED to Tier-2 native mobile (iOS / Android shell).
- **Full PWA install flow** — manifest + service worker + install banner — DEFERRED to Tier-2 commercial.
- **Welcome.tsx mobile** — OWNED BY P86 / A2 polish dispatch (combined seal); NOT in P87 scope.

## Test count delta narrative

- P85 baseline: ~1026+ cumulative PURE-UNIT GREEN
- P86 (companion, sealed combined): +~10 polish-wave-4 cases
- P87 (this phase): +~12 cases from `tests/p87-marketing-mobile.spec.ts` (4 describe blocks × ~3 cases each)
- **Combined P86 + P87 anchor: ~1051+ cumulative PURE-UNIT GREEN**

The ≥3 `md:` floor across 8 pages is a conservative regression-catch proxy. Passing doesn't guarantee a great mobile render; failing guarantees a regression. Code-review discipline + post-RC visual audit + owner Lighthouse pass close the gap from "passes the proxy" to "ships well on mobile".

## Hard-rule compliance

- No source code edits by A5 ✓ (A4 owns marketing pages)
- No touching ADR-111 ✓ (P86 / A3 owns)
- No touching `tests/p86-*` or `plans/implementation/phase-86/*` ✓
- No touching `src/pages/*.tsx` ✓
- ADR ≤120 LOC ✓
- Tests use `@playwright/test`; existsSync guards on A4 surfaces ✓
- No new deps; no animation libs in owned files ✓
- TypeScript-strict ✓
