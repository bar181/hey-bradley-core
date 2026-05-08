# P87 — OC-5 Marketing Mobile (Preflight)

> **Phase:** P87 · **Sprint:** OC-5-MKT-MOBILE · **Date:** 2026-05-01
> **Predecessor:** P85 sealed at `6ce19d7` (~1026+ GREEN, 110 ADRs)
> **Companion:** P86 (Polish Wave 4, parallel)
> **Cross-refs:** ADR-090 (Mobile UX Redesign — app mobile, P69 / OC-5), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-102 (Performance + Accessibility)

## Mandate — separate from app mobile

P69/ADR-090 redesigned the BUILDER/CHAT/LISTEN app for mobile (`src/components/shell/Mobile*.tsx`). **Marketing site mobile** (`src/pages/About.tsx`, `AISP.tsx`, `OpenCore.tsx`, `HowIBuiltThis.tsx`, `Docs.tsx`, `BYOK.tsx`, `Blog.tsx`, `Progress.tsx`) was deferred from OC-5 (CLAUDE.md carry-forward). P87 closes that gap. Welcome.tsx is OWNED BY P86/A2 — leave alone.

Lighthouse mobile target: ≥85.

## 2 parallel agents · disjoint scopes

### A4 — Marketing site mobile audit + fix
**Owns:**
- `src/pages/About.tsx` (EDIT)
- `src/pages/AISP.tsx` (EDIT)
- `src/pages/OpenCore.tsx` (EDIT)
- `src/pages/HowIBuiltThis.tsx` (EDIT)
- `src/pages/Docs.tsx` (EDIT)
- `src/pages/BYOK.tsx` (EDIT)
- `src/pages/Blog.tsx` (EDIT)
- `src/pages/Progress.tsx` (EDIT)

**For each page, audit at 375px / 390px / 428px:**
- Nav collapse — does the navbar/header render without overflow?
- Hero text overflow — does h1 wrap cleanly without horizontal scroll?
- CTA button sizing — buttons reachable at 44px min touch target (WCAG)?
- Card stacking — multi-column grids stack to single column on mobile?
- Padding/margins — `px-4` minimum on mobile; `md:px-8` desktop+

**Fix strategy:** Surgical Tailwind responsive classes only. Patterns:
- `flex-col md:flex-row` for stacking grids
- `text-2xl md:text-4xl` for h1 size scaling
- `px-4 md:px-8` for container padding
- `w-full md:w-auto` for full-width-mobile buttons
- `block md:inline` for nav collapse
- `gap-4 md:gap-8` for grid spacing
- NO layout rebuilds — surgical class adds only

**Constraints:** Each page ≤40 LOC of edits. NO new components. NO removal of existing features. NO animation libs. NO desktop regression — every desktop test must remain GREEN. NO touching `src/pages/Welcome.tsx` (P86/A2 owns).

DO NOT touch:
- Welcome.tsx (A2 owns)
- ADR-112 / tests / plans / CLAUDE.md (A5 owns)
- Any file outside `src/pages/*.tsx` listed above

### A5 — ADR-112 + tests + EOP closer
**Owns:**
- `docs/adr/ADR-112-marketing-site-mobile-standard.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-090 + ADR-091 + ADR-094 + ADR-102)
  - Decisions: (1) all 8 marketing pages render cleanly at 375/390/428px; (2) WCAG 44px touch target floor; (3) Tailwind responsive classes only — no media-query CSS files; (4) Lighthouse mobile ≥85 target
- `tests/p87-marketing-mobile.spec.ts` (NEW; ≥10 cases; Playwright):
  - P87.1 ADR-112 file shape (4)
  - P87.2 All 8 marketing pages contain mobile-responsive Tailwind patterns (4) — `md:` prefix usage check across each page: About / AISP / OpenCore / HowIBuiltThis / Docs / BYOK / Blog / Progress (each gets 1 case grouped — or 4 cases checking subsets of pages)
  - P87.3 KISS — no animation libs in P87 source (1)
  - P87.4 EOP triplet (3)
- `plans/implementation/phase-87/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` final sync — coordinate with P86/A3 NOTE: bump 111 → 112 Accepted with both entries. Tests cumulative anchor → ~1051+ at combined seal. Capabilities line entries for P86 + P87.

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`. existsSync guards on A4 surfaces.

## Hard rules
1. NO new dependencies
2. NO animation libs
3. NO touching files outside owned list
4. NO desktop regression — every existing test must remain GREEN
5. Tailwind responsive classes only — no new CSS files
6. KISS — surgical class additions, NO layout rebuilds
7. NO shell commands inside agents (except tsc + targeted playwright run)
8. TypeScript-strict

## Acceptance gates (combined P86 + P87)
- All 8 marketing pages mobile-responsive at 375/390/428px
- Lighthouse mobile target ≥85 (declared in ADR-112; live measurement deferred to post-RC)
- ADR-111 (P86) + ADR-112 (P87) Accepted
- ≥15 P86 + ≥10 P87 tests GREEN
- Cumulative ≥725 session OC chain regression
- tsc strict clean
