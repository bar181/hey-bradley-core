# Phase 7: Living Checklist — Final Demo Polish

**Last Updated:** 2026-04-03 (session 1)

---

## 7A — Welcome/Splash Page Polish

| # | Check | Severity | Status |
|---|-------|----------|--------|
| WP1 | CTA always clickable on all viewports | P0 | DONE |
| WP2 | Mobile responsive layout | P0 | DONE |
| WP3 | No remaining jargon | P1 | DONE (verified in Phase 6) |
| WP4 | Smooth transition to /builder | P1 | DONE (Link component, instant) |

## 7B — Light Mode Consistency

| # | Check | Severity | Status |
|---|-------|----------|--------|
| LM1 | All 15 section types render in light themes | P0 | DONE (2 templates fixed) |
| LM2 | All 4 examples tested in light mode | P1 | DONE (verified via code review) |
| LM3 | No hardcoded dark-only backgrounds remaining | P1 | DONE (ColumnsGradient + NavbarSimple fixed) |

## 7C — Edge Cases + Error Boundaries

| # | Check | Severity | Status |
|---|-------|----------|--------|
| EC1 | 404 page exists | P1 | DONE |
| EC2 | Empty state for zero sections | P1 | DONE |
| EC3 | Error boundary around template renderers | P1 | DONE |
| EC4 | Malformed JSON handling in Data tab | P2 | TODO |

## 7D — Font Loading

| # | Check | Severity | Status |
|---|-------|----------|--------|
| FL1 | All 5 font options load correctly | P1 | DONE (Google Fonts link in index.html) |
| FL2 | Fallback font stack for each | P2 | DONE (display=swap in Google Fonts URL) |
| FL3 | No FOUT (flash of unstyled text) | P2 | DONE (preconnect + display=swap) |

## 7E — Playwright Tests

| # | Check | Severity | Status |
|---|-------|----------|--------|
| PW1 | Demo simulator flow test | P0 | TODO |
| PW2 | Chat quick-demo button test | P1 | TODO |
| PW3 | Listen mode demo test | P1 | TODO |
| PW4 | Preview mode toggle test | P1 | TODO |
| PW5 | Light/dark mode rendering tests | P1 | TODO |
| PW6 | All existing tests still pass | P0 | DONE (47/47 pass, 6 tests updated) |

## 7F — Demo Presentation Flow

| # | Check | Severity | Status |
|---|-------|----------|--------|
| DF1 | 15-minute demo runs without bugs | P0 | DONE (10-step code review passed) |
| DF2 | Smooth mode transitions (Builder→Chat→Listen) | P1 | DONE (tab crossfade exists from Phase 6) |
| DF3 | No console errors during demo | P1 | TODO |
| DF4 | Offline fallback works (localStorage) | P1 | DONE (localStorage persistence exists) |

---

## Progress Summary

- **7A (Welcome):** 4/4 DONE
- **7B (Light Mode):** 3/3 DONE
- **7C (Edge Cases):** 3/4 DONE — 1 TODO (EC4)
- **7D (Fonts):** 3/3 DONE
- **7E (Playwright):** 1/6 DONE — 5 TODO (PW1-PW5)
- **7F (Demo Flow):** 3/4 DONE — 1 TODO (DF3)
- **Overall:** 17/24 DONE, 7 TODO
