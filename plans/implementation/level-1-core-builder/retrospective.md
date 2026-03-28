# Level 1: Core Builder — End-of-Phase Retrospective

## Purpose

This retrospective uses Playwright browser automation to validate UI, UX, and functionality at the end of Level 1. It produces objective test results that update the rubric scores.

---

## Playwright Test Plan

### Phase 1.0 Tests — Shell & Navigation

**Test run: 2026-03-28 | 18/18 passed (100%)**

```
- [x] App loads at localhost without console errors
- [x] Three-panel layout visible (3 data-panel elements detected)
- [x] LISTEN/BUILD toggle exists and switches UI state
- [x] Theme row visible in left panel navigation
- [x] Hero section row visible in left panel navigation
- [x] Tab "REALITY" exists and clickable
- [x] Tab "DATA" exists and clickable
- [x] Tab "XAI DOCS" exists and clickable
- [x] Tab "WORKFLOW" exists and clickable
- [x] Status bar with READY indicator visible
- [x] Chat input visible with placeholder text
- [x] SIMPLE/EXPERT tabs exist in right panel
- [x] Click Theme updates right panel with theme configuration
- [x] Click Hero updates right panel with section configuration
- [x] Expert tab shows AISP/spec viewer
- [x] Hero preview renders in Reality tab
- [x] Dark theme applied (background: rgb(15, 23, 42) slate-900)
- [x] Listen toggle clickable and functional
```

**Architecture notes (differs from original plan):**
- DRAFT/EXPERT mode toggle was removed entirely; replaced by SIMPLE/EXPERT tabs in right panel
- Left panel is pure flat navigation (no accordions, no controls)
- Right panel holds all configuration via 5-accordion hierarchy
- Dark slate design system (slate-900 bg, blue-500 accent) replaced warm cream (#faf8f5)

### Phase 1.1 Tests — Hero + JSON Core Loop

```
- [ ] Hero section renders in REALITY tab from configStore
- [ ] Clicking a vibe card changes hero colors immediately
- [ ] Typing headline in Draft panel updates hero text immediately
- [ ] Expert property values (padding, gap, align) update hero layout
- [ ] DATA tab shows full JSON with syntax highlighting
- [ ] DATA tab reflects all control changes in real-time
- [ ] Editing JSON in DATA tab updates preview and both control panels
- [ ] Invalid JSON in DATA tab shows red highlight (does not crash)
- [ ] Preview re-render < 100ms (performance timing assertion)
- [ ] configStore state matches visible UI at all times
- [ ] Section click-to-select shows dashed orange border
- [ ] AISP ID ghost overlay appears on section hover
```

### Phase 1.2 Tests — All Tabs + Listen Mode Visual

```
- [ ] XAI DOCS HUMAN view renders structured spec text from config
- [ ] XAI DOCS AISP view renders @aisp formatted syntax with line numbers
- [ ] HUMAN/AISP sub-toggle switches views correctly
- [ ] COPY and EXPORT AISP buttons are functional
- [ ] WORKFLOW tab shows 6 pipeline steps with correct status icons
- [ ] Pipeline step states render correctly (completed/active/waiting)
- [ ] Live stream output log panel shows timestamped entries
- [ ] Listen toggle produces dark overlay (300ms fade)
- [ ] Red orb renders with 3 visible CSS layers (core, mid-ring, ambient)
- [ ] Orb pulse animation runs smoothly (no jank in performance profile)
- [ ] START LISTENING button is visible and centered below orb
- [ ] Features section placeholder visible in REALITY tab
- [ ] CTA section placeholder visible in REALITY tab
- [ ] Section click highlights with dashed orange border
```

### Phase 1.3 Tests — Hero Polish + Presets

```
- [ ] HeroCentered variant renders correctly
- [ ] HeroSplit variant renders correctly (content left, image right)
- [ ] HeroOverlay variant renders correctly (background image + text)
- [ ] HeroFullImage variant renders correctly (full-bleed + centered text)
- [ ] HeroMinimal variant renders correctly (text only, max whitespace)
- [ ] Undo works via Ctrl+Z (reverts last change)
- [ ] Redo works via Ctrl+Shift+Z (re-applies undone change)
- [ ] Undo/redo history supports 50+ steps without data loss
- [ ] Auto-save persists config across page reload
- [ ] JSON export produces valid downloadable .json file
- [ ] JSON import restores state from uploaded file (with Zod validation)
- [ ] Import of invalid JSON shows error (does not corrupt state)
- [ ] Responsive preview constrains width to 375px (phone)
- [ ] Responsive preview constrains width to 768px (tablet)
- [ ] Responsive preview constrains width to 1280px (desktop)
- [ ] Reset to default restores initial config after confirmation
```

---

## Phase 1.0 Retrospective

### What Went Well

- Parallel agent swarms (5 agents per iteration) delivered components in ~2 minutes each
- Design pivot from warm cream to dark slate was a major quality improvement
- UX architecture redesign (flat left + accordion right) is cleaner than the original DRAFT/EXPERT swap
- Context-aware accordion state resets prevent broken UI states
- Chat and Listen always visible at bottom of left panel
- 18/18 Playwright tests passed on first run -- shell is solid

### What Didn't Go Well

- Initial warm cream design needed a full pivot -- could have started with dark from the beginning
- react-resizable-panels API version mismatch required post-agent fix
- Playwright system libraries not pre-installed on Codespaces
- Three iterations needed to reach final architecture (shell -> dark pivot -> unified panels -> polish)

### Key Decisions Made

- ADR-009b (Warm Cream) superseded by Dark Precision (slate-900, blue-500)
- ComplexityMode (DRAFT/EXPERT) removed entirely -- replaced by SIMPLE/EXPERT tabs in right panel
- Left panel = pure navigation (zero controls, zero accordions)
- Right panel = all configuration with 5-accordion hierarchy
- History tab -> TopBar icon (placeholder for Phase 7.2)
- Accessibility dialog spec queued for Phase 1.3
- uuid dropped for crypto.randomUUID(), jszip dropped for individual downloads

### Rubric Score Update

Phase 1.0 scores updated to reflect actual architecture. See: [rubric.md](./rubric.md)

**Phase 1.0 Total: 55 / 64** (avg 3.4 -- meets/exceeds requirements)

### Screenshots

Playwright screenshots will be stored in:
`/plans/implementation/level-1-core-builder/screenshots/`

Expected screenshot set (updated for actual architecture):
- `shell-build-mode.png` -- Full app in BUILD mode with dark theme
- `shell-listen-mode.png` -- Full app in LISTEN mode
- `simple-tab.png` -- Right panel SIMPLE view
- `expert-tab.png` -- Right panel EXPERT/AISP view
- `reality-tab.png` -- REALITY tab with hero preview
- `data-tab.png` -- DATA tab with syntax-highlighted JSON
- `xai-docs-tab.png` -- XAI DOCS tab
- `workflow-tab.png` -- WORKFLOW tab with pipeline steps

### Recommendations for Phase 1.1

- configStore must be the FIRST deliverable -- all UI wiring depends on it
- Deep merge utility needs comprehensive tests (TDD this one)
- HeroCentered should read CSS values from JSON, not hardcode Tailwind classes
- DATA tab bidirectional sync is the most complex piece -- plan carefully
- Keep the 5-accordion right panel structure -- it maps perfectly to the JSON model
