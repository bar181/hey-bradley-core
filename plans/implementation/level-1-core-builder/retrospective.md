# Level 1: Core Builder — End-of-Phase Retrospective

## Purpose

This retrospective uses Playwright browser automation to validate UI, UX, and functionality at the end of Level 1. It produces objective test results that update the rubric scores.

---

## Playwright Test Plan

### Phase 1.0 Tests — Shell & Navigation

```
- [ ] App loads at localhost without errors
- [ ] Three-panel layout is visible and resizable
- [ ] LISTEN/BUILD toggle switches UI state
- [ ] DRAFT/EXPERT toggle switches UI state
- [ ] All 4 center tabs are navigable with active styling
- [ ] Status bar displays "READY AISP SPEC V1.2" and "MODE: DRAFT CONNECTED"
- [ ] Chat input is visible with mic, text field, and send button
- [ ] Draft left panel shows vibe cards and section list
- [ ] Expert left panel shows accordion property inspector
- [ ] Draft right panel shows headline input and layout selector
- [ ] Expert right panel shows layout/content/style accordion sections
- [ ] Warm cream color scheme is applied (screenshot comparison)
- [ ] No console errors during full navigation walkthrough
```

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

## Retrospective Template

_Fill in after running all Playwright tests at the end of Level 1._

### What Went Well

_(To be completed after Level 1)_

### What Didn't Go Well

_(To be completed after Level 1)_

### Key Decisions Made

_(To be completed after Level 1)_

### Rubric Score Update

_(Link to updated rubric.md scores after testing)_

See: [rubric.md](./rubric.md)

### Screenshots

Playwright screenshots will be stored in:
`/plans/implementation/level-1-core-builder/screenshots/`

Expected screenshot set:
- `shell-draft-mode.png` — Full app in Draft mode
- `shell-expert-mode.png` — Full app in Expert mode
- `hero-centered.png` — HeroCentered variant
- `hero-split.png` — HeroSplit variant
- `hero-overlay.png` — HeroOverlay variant
- `hero-fullimage.png` — HeroFullImage variant
- `hero-minimal.png` — HeroMinimal variant
- `data-tab.png` — DATA tab with syntax-highlighted JSON
- `xai-docs-human.png` — XAI DOCS Human view
- `xai-docs-aisp.png` — XAI DOCS AISP view
- `workflow-tab.png` — WORKFLOW tab with pipeline steps
- `listen-mode-orb.png` — Listen mode with red orb
- `responsive-phone.png` — Responsive preview at 375px
- `responsive-tablet.png` — Responsive preview at 768px

### Recommendations for Level 2

_(To be completed after Level 1)_
