# Phase 15 Living Checklist

**Phase:** 15 — Developer Assistance + Marketing Site Overhaul
**Started:** 2026-04-06
**Status:** IN PROGRESS

---

## 1. Test Investigation + Fix (102 to 90 drop)

- [ ] Identify which 12 tests were lost between Phase 14 close and current state
- [ ] Determine root cause (deleted, renamed, skipped, or broken)
- [ ] Restore or rewrite missing tests
- [ ] Confirm all 90 existing tests still pass
- [ ] Reach 110+ total passing tests by phase close

---

## 2. Marketing Site Overhaul

### Welcome / Home Page
- [ ] Apply Don Miller StoryBrand framework to hero messaging
- [ ] Implement telephone game narrative flow
- [ ] Ensure clear CTA hierarchy

### About Page
- [ ] Refresh copy to align with StoryBrand voice
- [ ] Update Bradley bio and project context

### AISP Page (New)
- [ ] Create AISP marketing page component
- [ ] Add AISP protocol overview (math-first symbolic language)
- [ ] Link to public repo and reference docs
- [ ] Add route and navigation entry

### Research Page (New)
- [ ] Create Research page component
- [ ] Showcase Harvard capstone context and methodology
- [ ] Add route and navigation entry

### Sticky Navigation
- [ ] Implement sticky/fixed nav bar across marketing pages
- [ ] Ensure smooth scroll and active-state indicators
- [ ] Verify responsive behavior on mobile/tablet

---

## 3. Tooltips (20+ Controls)

- [ ] Implement CSS-only tooltip component (no external library)
- [ ] Add tooltips to builder tab controls
- [ ] Add tooltips to preview mode controls
- [ ] Add tooltips to spec generator buttons
- [ ] Add tooltips to theme selector options
- [ ] Add tooltips to example selector options
- [ ] Add tooltips to chat/listen demo controls
- [ ] Add tooltips to navigation items
- [ ] Verify tooltip positioning and overflow handling
- [ ] Reach 20+ tooltips total

---

## 4. Keyboard Shortcuts

- [ ] Implement Ctrl+P shortcut (toggle preview mode)
- [ ] Implement Ctrl+E shortcut (toggle expert mode)
- [ ] Implement ? shortcut (open help/shortcuts overlay)
- [ ] Implement Escape shortcut (close modals/overlays)
- [ ] Add keyboard shortcut help panel/modal
- [ ] Ensure shortcuts do not conflict with browser defaults
- [ ] Add visual indicators for available shortcuts

---

## 5. Error States

### Error Boundary
- [ ] Implement top-level React error boundary component
- [ ] Add fallback UI with recovery action
- [ ] Log errors for debugging

### Empty States
- [ ] Empty sections state (no content in a section)
- [ ] Empty blueprints state (no blueprint selected)
- [ ] Empty preview state (nothing to preview)
- [ ] Ensure all empty states have helpful messaging and CTAs

---

## 6. Code Quality

- [ ] Run bundle size audit and document results
- [ ] Identify and remove dead code / unused exports
- [ ] Remove stray console.log statements from production code
- [ ] Run lint and fix all warnings
- [ ] Verify build succeeds cleanly with no warnings

---

## 7. Phase Close

- [ ] Write Phase 15 retrospective (what worked, what did not, lessons)
- [ ] Update project wiki / docs with Phase 15 outcomes
- [ ] Update CLAUDE.md with new phase status, test count, page count
- [ ] Run full test suite and confirm all pass
- [ ] Phase 16 preflight: define scope, goals, and entry criteria
