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
`/plans/implementation/phase-1/screenshots/`

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

---

## Phase 1.3 Retrospective — Brutally Honest Review

**Date:** 2026-03-29
**Sessions:** 6-9 (4 sessions over 2 days)
**Theme iterations:** 8 (yes, eight)

### What Happened

Phase 1.3 was supposed to be "Hero Polish + Presets" — a 1-day phase adding hero variants and undo/redo. Instead, it became a 4-session, 8-iteration theme system overhaul. The scope expanded because the themes kept looking identical (color swaps only), triggering iteration after iteration.

### What Went Well

1. **Research-first approach finally worked.** Iterations 1-7 failed because the swarm built before understanding what a theme IS. Iteration 8 forced research + ADRs first, and the implementation was straightforward after that.

2. **ADRs 017-020 are solid.** Invisible design naming (ADR-017) was the key insight — "SaaS" and "Agency" are instantly understood; "Stripe Flow" and "Neon Terminal" are not. The 6-slot palette (ADR-019) and component visibility matrix (ADR-020) created real visual diversity.

3. **Full JSON replacement works.** `applyVibe()` replacing theme + sections while preserving copy is the correct architecture. Theme switching now changes layout, components, colors, typography, and imagery — not just CSS variables.

4. **Parallel agent execution was fast.** 12 agents created all 10 theme JSONs + 3 data files in ~40 seconds. Sub-Phase B was the fastest phase.

5. **Media library is comprehensive.** 50 verified images + 20 verified videos across 10 categories. All URLs return 200.

### What Went Wrong

1. **8 iterations is unacceptable.** The first 7 iterations were wasted work because the swarm didn't understand the problem. A single research phase at the start would have saved days. **Root cause:** jumping to code before understanding requirements.

2. **applyVibe() preserved image URLs from the default config.** The copy-preservation logic treated ALL `url` props equally — buttons AND images. This caused every theme switch to overwrite the theme's image URLs with empty strings. Took 2 human bug reports to find. **Root cause:** the preservation logic wasn't type-aware.

3. **HeroCentered didn't render heroImage.** The centered hero component was built for video backgrounds but never added inline image rendering. SaaS theme had an image enabled but it never showed. **Root cause:** component was built for one variant's needs, not the universal spec.

4. **Fonts didn't visually update.** `HeroCentered.tsx` didn't apply `fontFamily` to the section element. The font change showed in JSON but not in the preview. **Root cause:** inconsistency between hero components — HeroSplit and HeroMinimal had `fontFamily`, HeroCentered didn't.

5. **Palette default detection was broken.** `default-config.json` had no `palette` block, so the palette selector couldn't detect which palette was active. **Root cause:** new schema fields weren't propagated to all config files.

6. **Too much inline CSS, not enough Tailwind.** Hero components use extensive inline `style={{}}` instead of Tailwind utility classes. This will become a maintenance burden as we add light/dark mode and responsive variants. **Debt logged for Phase 2.**

7. **No Playwright verification during Phase 1.3.** All testing was manual or build-only. The original Phase 1.0/1.1 had Playwright tests; Phase 1.3 relied on human review. **Debt logged for Phase 2.**

### Metrics

| Metric | Value |
|--------|-------|
| Theme iterations | 8 (7 failed, 1 succeeded) |
| ADRs created | 4 (017-020) |
| Theme files created | 10 (replacing 10 old ones) |
| Data files created | 3 (palettes, fonts, media) |
| New components | 2 (PaletteSelector, FontSelector) |
| Modified files | ~15 |
| Bugs found by human review | 4 (image URL, font, palette default, video 403) |
| Bugs found by automated testing | 0 |
| Build failures | 1 (PaletteSelector name spread — fixed in 30s) |

### Lessons Learned

1. **Research before code. Always.** If the swarm can't explain what a "theme" is in 2 sentences, it shouldn't write theme code.
2. **Copy-preservation must be type-aware.** Button URLs are user copy. Image URLs are theme identity. Treating them the same breaks theme switching.
3. **Every component needs the full rendering spec.** If a component supports heroImage, it must render heroImage. Skipping it "because this variant doesn't need it" creates bugs when themes use it.
4. **Propagate schema changes to ALL config files.** New fields added to masterConfig.ts must also appear in default-config.json and template-config.json. Missing propagation = runtime bugs.
5. **Inline styles are debt.** Tailwind utilities should be the default. Inline styles should be reserved for truly dynamic values (user-entered colors/sizes).
6. **Playwright tests should run every phase.** Manual verification misses things. Automated tests would have caught the font and image bugs immediately.

### Phase 1.3 Score

**Estimated: 72/88 (82%) — PASSING but with significant debt.**

The themes work. They're visually distinct. The architecture is sound. But the 8-iteration path, the bugs caught only by human review, and the inline CSS debt mean this phase was more expensive than it should have been.

### Debt Carried to Phase 2+

- [ ] Light/dark mode with per-theme palette pairs
- [ ] Tailwind migration for inline styles in hero components
- [ ] Google Fonts dynamic loading
- [ ] Playwright tests for theme switching
- [ ] Custom color palette picker
- [ ] Accessibility dialog
- [ ] Rubric scoring automation
