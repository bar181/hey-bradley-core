# Phase 15 Retrospective

**Phase:** 15 — Developer Assistance + Marketing Site Overhaul
**Duration:** 2026-04-06 to 2026-04-07 (2 sessions)
**Status:** CLOSED

---

## Dimension Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Features | 18/20 | All planned features shipped: tooltips (25+), shortcuts (4), error boundaries (2), AISP page, Research page, sticky nav. ESLint config deferred. |
| Code Quality | 16/20 | Zero console.logs, zero TS errors, build green. Bundle size documented but no code-splitting yet. ESLint v9 migration needed. |
| UX | 15/20 | Tooltips on all major controls. Keyboard shortcuts work. Empty states guide users. StoryBrand narrative on Welcome page. AISP/Research pages are strong. Mobile responsive needs deeper audit. |
| Specs | 14/20 | ADRs 038-043 are solid (swarm protocol, quality gates, test regression). AISP Platinum sample validated. No spec generator changes this phase. |
| Docs | 12/20 | Session logs and living checklist maintained well. Developer docs page not expanded beyond existing /docs. Wiki page created. |
| Demo | 10/20 | Browser preview captured. Marketing pages look good. No new demo flows added. Chat/Listen unchanged. |

**Composite Score: 85/100**

---

## What Shipped

1. **111 tests passing** — up from 90 (Phase 14 close) / 102 (Phase 14 baseline). 9 new Phase 15 tests + 3 test fixes.
2. **25+ tooltips** — CSS-only component, no external library. Covers TopBar, TabBar, LeftPanel, SectionsSection, SectionSimple, RightPanelTabBar.
3. **4 keyboard shortcuts** — Ctrl+P (preview), Ctrl+E (expert), ? (help), Escape (close). ShortcutHelp modal with kbd indicators.
4. **2 error boundaries** — ErrorBoundary wrapping all section renderers in RealityTab. SectionErrorFallback with recovery action.
5. **3 empty states** — No sections, no blueprints, no selection. All with helpful messaging and CTAs.
6. **AISP marketing page** — 5 Crystal Atom components, Sigma-512 symbol set, ambiguity comparison chart, GitHub link.
7. **Research page** — 3 research findings (55% bottleneck, 40-65% intent loss, landscape comparison).
8. **Sticky MarketingNav** — Consistent navigation across all 8 marketing pages with active-state indicators.
9. **ADRs 038-043** — Swarm Orchestration Protocol, Agent Roles, Human-Swarm Comms, Quality Gates, Grounding Auto-Gen, Test Regression Prevention.
10. **ruflo + RuVector submodules** — Initialized at upstreams/ for core flywheel reference.

## What Didn't Ship

1. **ESLint v9 migration** — eslint.config.js needed. ESLint effectively not running. Deferred to P16.
2. **Bundle code-splitting** — 2,060 KB single chunk. Vite warns. Deferred to P16.
3. **Developer docs expansion** — /docs page exists but not expanded with section reference, theme reference, JSON guide.
4. **Onboarding flow improvements** — First-visit detection, welcome overlay not implemented. Was in original P15 scope but deprioritized in favor of marketing overhaul.
5. **Toast/notification system** — Not implemented. Error boundary and empty states cover most cases.

## Lessons Learned

1. **Test selector brittleness** — CSS `[role="button"]` doesn't match native `<button>` implicit ARIA roles. Always use `getByRole()` in Playwright. This wasted ~30 min of debugging.
2. **UI evolution breaks tests** — Chat demo buttons moved behind a dialog. Tests need to track the current UI flow, not the Phase 3 flow. Tests are documentation of current behavior.
3. **Keyboard shortcuts in Playwright** — `page.keyboard.type('?')` works but is sensitive to focus state. Always blur inputs first with `document.activeElement.blur()` or click a non-input element.
4. **Swarm grounding pays off** — ADRs 038-043 made this session much smoother. The 5-stage protocol (INGEST → EXECUTE → VERIFY → CLOSE → HANDOFF) kept the work structured.
5. **Marketing pages > dev features for capstone** — AISP and Research pages directly serve the capstone defense narrative. More valuable than toast notifications.

## Risk Flags for Phase 16

- ESLint has been off for multiple phases. Technical debt accumulating.
- Bundle size (2 MB) will matter at scale. Code-splitting should happen before Phase 19.
- 13 image effects have not been audited since Phase 12. Some may be broken.
- Site context (purpose/audience/tone) has never been verified to actually affect spec output.
