# Level 1: Core Builder — Phase Requirements

**Authority:** This file is the source of truth for phase-level DoD. Phase criteria are fixed before work starts and do not change mid-phase.

---

## Phase 1.0: Shell & Navigation [COMPLETE]
- [x] Three-panel layout renders
- [x] LISTEN/BUILD toggle works
- [x] All 4 center tabs navigable
- [x] Status bar renders
- [x] Left panel flat list with chat/listen pinned at bottom

## Phase 1.1: Hero + JSON Core Loop [COMPLETE]
- [x] Zod schemas defined
- [x] configStore with applyPatch and CRUD
- [x] Hero renders from JSON
- [x] Data Tab with CodeMirror (no raw HTML)
- [x] Right panel controls → JSON → preview loop
- [x] Playwright 5/5 passing

## Phase 1.2: JSON Templates & Smoke Test [COMPLETE]
- [x] JSON templates folder with README
- [x] template-config.json (all possible options for site, theme, hero)
- [x] default-config.json (Hey Bradley example content)
- [x] Smoke test: right panel toggle → JSON updates → preview updates
- [x] ADRs 012-016 written
- [x] Favicon + title "Hey Bradley — Designer Mode"

## Phase 1.3: Themes & Layout [PLANNED]
- [ ] 3 theme presets selectable (Modern Dark, Clean Light, Bold Gradient)
- [ ] Selecting theme updates: site settings, theme config, layout defaults, hero styling
- [ ] Copy stays fixed (Hey Bradley example) — copy editing deferred
- [ ] Theme selection in right panel SIMPLE tab works
- [ ] JSON in Data Tab reflects theme changes

## Phase 1.4: Listen Mode Visual [PLANNED]
- [ ] Red orb overlay renders on LISTEN toggle
- [ ] Dark transition (300ms fade)
- [ ] START LISTENING button
- [ ] Orb pulse animation

## Phase 1.5: XAI Docs + Workflow Tabs [PLANNED]
- [ ] XAI Docs HUMAN view renders from JSON
- [ ] XAI Docs AISP view renders @aisp format
- [ ] Workflow pipeline stepper (mock data)
- [ ] COPY/EXPORT buttons on XAI Docs

## Phase 1.6: Hero Polish + Accessibility [PLANNED]
- [ ] All 5 hero variants
- [ ] Responsive preview toggles
- [ ] Undo/redo wiring
- [ ] LocalStorage persistence
- [ ] Accessibility settings dialog (Doc 07)
