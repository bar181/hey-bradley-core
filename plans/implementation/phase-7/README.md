# Phase 7: Final Demo Polish

**Status:** NEXT (after Phase 6 close)
**Prerequisite:** Phase 6 COMPLETE (98% checklist, score 78+)
**Target:** 2 days
**Goal:** Flawless 15-minute capstone demo with zero rough edges

---

## Phase 7 Scope

Phase 6 delivered all core features. Phase 7 is polish-only — no new features.

### 7A: Welcome/Splash Page Polish
- CTA always clickable on all viewports
- Mobile responsive layout
- Remove any remaining jargon
- Smooth transition to /builder

### 7B: Light Mode Consistency Pass
- Verify ALL 15 section types render correctly in light themes (Personal, Blog, Professional, Minimalist)
- Fix any remaining hardcoded dark-only backgrounds
- Test all 4 example websites in light mode

### 7C: Edge Cases + Error Boundaries
- 404 page
- Empty state for zero sections
- Error boundary around template renderers
- Graceful handling of malformed JSON in Data tab

### 7D: Font Loading
- Google Fonts properly loaded for all 5 font options
- Fallback stack for each font
- No FOUT (flash of unstyled text)

### 7E: Playwright Full Suite
- Smoke tests for demo simulator flow
- Chat quick-demo button interaction test
- Listen mode demo test
- Preview mode toggle test
- Light/dark mode rendering tests
- All existing 26 tests still passing

### 7F: Demo Presentation Flow
- Guided 15-minute sequence (see phase-7/human-1.md for full script)
- Smooth mode transitions
- No console errors during demo
- Offline fallback (localStorage persistence already exists)

---

## What Phase 7 Does NOT Do

- No new section types or variants
- No real LLM/voice integration
- No auth/database
- No image upload
- No custom hex color input
