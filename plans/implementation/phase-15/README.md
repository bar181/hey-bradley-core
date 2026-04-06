# Phase 15 Preflight: Developer Assistance

**Phase:** 15  
**Focus:** Builder UX for developers — tooltips, onboarding, error states, keyboard shortcuts, docs, code quality  
**Prerequisite:** Phase 14 CLOSED (74/100)  
**Enforcement:** ADR-011 (End-of-Phase Close Protocol)  

---

## Grounding Report

### Current State (Phase 14 Close)
- **Source files:** 171 TS/TSX
- **Lines:** ~17,000 TS/TSX
- **Examples:** 15 (all with siteContext)
- **Themes:** 12 (all with expanded metadata)
- **Tests:** 102 passing (11 spec files)
- **ADRs:** 37 (through ADR-037)
- **Wiki pages:** 18

### Key Gaps from Phase 14
- Test count stalled at 102 (target was 110+)
- Onboarding preview screenshots may need regeneration
- No tooltips or contextual help anywhere in the builder
- No keyboard shortcuts
- No error/empty state designs
- Resources tab has content but no developer-focused documentation
- Bundle size has not been audited since Phase 9

### Phase 15 Objective
Make the builder self-explanatory for a developer encountering it for the first time. Every panel, toggle, and tab should have contextual help. Error states should guide the user. The codebase should be leaner and better tested.

---

## Sprint Breakdown

### Sprint 1: Tooltips and Contextual Help (2 hours)
- Add tooltip component (reusable, positioned, accessible)
- Tooltips on all left-panel section controls (add, delete, move, toggle)
- Tooltips on right-panel mode toggle (SIMPLE vs EXPERT)
- Tooltips on center tabs (Preview, Blueprints, Resources, Data, Pipeline)
- Tooltips on TopBar controls (export, theme selector, example loader)
- Info icons on complex fields (siteContext purpose, audience, tone)

### Sprint 2: Onboarding Flow Improvements (2 hours)
- First-visit detection (localStorage flag)
- Welcome overlay with 3-step guide: Pick an Example, Customize Sections, Export Specs
- Onboarding page: regenerate preview screenshots for all 15 examples
- "Getting Started" card in Chat tab for first-time users
- Quick-start templates highlighted in example picker

### Sprint 3: Error States and Empty States (1.5 hours)
- Empty state for section list when no sections added
- Empty state for Blueprints when no site loaded
- Error boundary component for section renderers (graceful fallback)
- Validation messages on required fields (site name, theme selection)
- Toast/notification system for user feedback (save, export, errors)

### Sprint 4: Keyboard Shortcuts and Developer Docs (2 hours)
- Keyboard shortcut system (Ctrl+S save, Ctrl+E export, Ctrl+P preview toggle)
- Shortcut help modal (Ctrl+/ or ? to open)
- Developer documentation page in Resources tab:
  - JSON schema reference
  - Theme authoring guide
  - Section type reference
  - AISP Crystal Atom quick reference
- API documentation stub for future LLM integration

### Sprint 5: Code Quality Pass + Test Expansion (2.5 hours)
- Bundle size audit (identify largest chunks)
- Lazy loading for heavy components (Blueprints sub-tabs, Listen orb, marketing pages)
- Dead code removal pass
- Test expansion: add tests for Phase 14 fixes (dialog patterns, AISP output, renames)
- Test expansion: add tests for Phase 15 features (tooltips, keyboard shortcuts, error states)
- Target: 110+ tests passing
- Full persona review (Grandma 55+, Agentic Engineer 80+, Capstone 85+)

---

## Testing Plan

### Unit Tests (target: +15 new)
- Tooltip component: positioning, accessibility, keyboard dismiss
- Keyboard shortcut registry: registration, conflict detection, help modal
- Error boundary: catches errors, renders fallback, reports to console
- Toast/notification: show, auto-dismiss, stack multiple
- First-visit detection: localStorage read/write, reset

### Integration Tests (target: +8 new)
- Onboarding flow: welcome overlay appears on first visit, dismissed on second
- Tooltips visible on hover for key controls
- Export keyboard shortcut triggers download
- Error boundary catches malformed section config
- Empty states render when section list is empty

### E2E Tests (existing Playwright, target: maintain)
- Verify tooltip visibility on builder load
- Verify keyboard shortcut modal opens with ?

### Test Target: 110+ total (from 102)

---

## Exit Criteria

Phase 15 is NOT closed until:
- [ ] Tooltips present on all major controls (left panel, right panel, center tabs, TopBar)
- [ ] First-visit onboarding overlay implemented
- [ ] Onboarding page shows preview images for all 15 examples
- [ ] Empty states for section list and Blueprints
- [ ] Error boundary wraps section renderers
- [ ] Keyboard shortcuts working (Ctrl+S, Ctrl+E, Ctrl+P, ?)
- [ ] Developer documentation page in Resources tab
- [ ] Bundle size audited and lazy loading added for heavy components
- [ ] 110+ tests passing
- [ ] Build green
- [ ] Retrospective written
- [ ] Wiki page created
- [ ] CLAUDE.md updated
- [ ] Phase 16 preflight created

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tooltip library adds bundle weight | Medium | Build custom lightweight tooltip, no external dependency |
| Keyboard shortcuts conflict with browser | Medium | Only bind unoccupied combos; detect OS; allow user override |
| Lazy loading breaks existing functionality | High | Test all lazy-loaded routes before committing |
| Preview screenshot regeneration fails | Low | Keep palette fallback from P14 as backup |

---

## Enforcement

Per ADR-011, Phase 15 close requires:
1. Living checklist fully checked
2. Session log with all actions
3. Retrospective with dimension scores
4. Wiki page
5. CLAUDE.md updated
6. Phase 16 preflight created
7. Memory file updated
