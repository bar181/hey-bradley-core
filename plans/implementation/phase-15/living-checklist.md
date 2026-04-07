# Phase 15 Living Checklist

**Phase:** 15 — Developer Assistance + Marketing Site Overhaul
**Started:** 2026-04-06
**Status:** IN PROGRESS (near close)
**Last Updated:** 2026-04-07

---

## 1. Test Investigation + Fix

- [x] Identify which tests were failing (3 of 102)
- [x] Fix Hero accordion test — `[role="button"]` CSS selector doesn't match native `<button>` ARIA role, switched to `getByRole`
- [x] Fix Chat demo PW1 — demo buttons moved behind "Try an Example" dialog, updated test flow
- [x] Fix Chat demo PW2 — updated test to open dialog first
- [x] Confirm all 102 existing tests pass — 102/102 GREEN
- [x] Add Phase 15 tests — 9 new tests in `tests/e2e/phase15-devassist.spec.ts`
- [x] Reach 110+ total passing tests — **111 passed, 0 failed**

---

## 2. Marketing Site Overhaul

### Welcome / Home Page
- [x] Apply Don Miller StoryBrand framework to hero messaging
- [x] Implement telephone game narrative flow
- [x] Ensure clear CTA hierarchy

### About Page
- [x] Refresh copy to align with StoryBrand voice

### AISP Page (New)
- [x] Create AISP marketing page component — src/pages/AISP.tsx
- [x] Add AISP protocol overview (Crystal Atom components, Sigma-512, ambiguity comparison)
- [x] Link to public repo and reference docs
- [x] Add route and navigation entry — /aisp

### Research Page (New)
- [x] Create Research page component — src/pages/Research.tsx
- [x] Showcase Harvard capstone context (3 findings, landscape comparison)
- [x] Add route and navigation entry — /research

### Sticky Navigation
- [x] Implement sticky/fixed nav bar — MarketingNav with sticky top-0 z-50
- [x] Active-state indicators for current page
- [x] Verified responsive behavior

---

## 3. Tooltips (20+ Controls)

- [x] CSS-only tooltip component — src/components/ui/Tooltip.tsx (no external library)
- [x] TopBar controls — 7 tooltips (mode toggle, 3 breakpoints, design lock, brand lock, preview)
- [x] Center tabs — 5 tooltips via TabBar
- [x] Left panel — 2 tooltips (site settings, theme)
- [x] Section controls — 3 tooltip templates (drag, visibility, add section)
- [x] Layout presets — 8 tooltip instances in SectionSimple
- [x] SIMPLE/EXPERT tabs — 2 tooltips via RightPanelTabBar
- [x] **Total: 25+ tooltip instances across 7 files** (target was 20+)

---

## 4. Keyboard Shortcuts

- [x] Ctrl+P — toggle preview mode
- [x] Ctrl+E — toggle SIMPLE/EXPERT
- [x] ? — open keyboard shortcuts help
- [x] Escape — close modals/overlays/help
- [x] ShortcutHelp modal — src/components/ui/ShortcutHelp.tsx
- [x] No browser conflicts — Ctrl+ combos with preventDefault
- [x] Visual kbd indicators in help modal

---

## 5. Error States

- [x] ErrorBoundary component — src/components/ui/ErrorBoundary.tsx
- [x] SectionErrorFallback UI with recovery action
- [x] componentDidCatch logs to console.error
- [x] Empty sections state — "No sections yet" + CTA in SectionsSection
- [x] Empty blueprints state — "Add some sections to generate specifications" in XAIDocsTab
- [x] Empty editor state — "Welcome to the Editor" in SimpleTab
- [x] All empty states have helpful messaging and CTAs

---

## 6. Code Quality

- [x] Bundle size audit — JS: 2,060 KB (537 KB gzip), CSS: 89.6 KB (15.4 KB gzip)
- [x] No stray console.log statements — zero found in src/
- [x] TypeScript clean — `tsc --noEmit` passes with 0 errors
- [x] Build succeeds — GREEN (5.85s)
- [x] ESLint config gap noted — needs eslint.config.js for ESLint v9 (deferred to P16)

---

## 7. Submodules + AISP Grounding

- [x] ruflo submodule initialized — upstreams/ruflo (CLI, agents, plugins, v2/v3)
- [x] RuVector submodule initialized — upstreams/ruvector (Rust crates, benchmarks, npm bindings)
- [x] AISP Platinum Crystal Atom confirmed — 10-line sample validated against spec
- [x] 14-agent swarm spawned — hierarchical-mesh topology, specialized strategy

---

## 8. Phase Close

- [ ] Write Phase 15 retrospective
- [ ] Update project wiki with Phase 15 outcomes
- [ ] Update CLAUDE.md with new phase status, test count, page count
- [ ] Phase 16 preflight: define scope, goals, and entry criteria
