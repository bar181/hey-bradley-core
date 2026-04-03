# Phase 6: Canned Demo + Deploy Preparation

**Status:** NEXT
**Target Start:** 2026-04-03
**Target End:** 2026-04-10
**Capstone Deadline:** May 2026

---

## Phase 6 Goals

Phase 5 raised the builder from 52/100 to 65/100 through visual polish and section expansion. Phase 6 focuses on making the builder **demonstrable** — a canned demo that simulates AI building a site in real-time, plus deploy preparation for the capstone presentation.

### Primary Objectives

1. **Canned Demo Simulation** — Listen mode triggers a timed sequence where sections appear one-by-one with typewriter captions, simulating AI-driven site generation
2. **Chat Quick-Demo Buttons** — One-click buttons in the Chat tab ("Build a Bakery", "Build a Startup", etc.) that trigger the same simulation
3. **XAI Docs Integration** — Surface the AISP specification in a readable format within the builder
4. **Deploy Preparation** — Vercel deployment, shareable preview URLs, static HTML export

### Stretch Objectives

- Pricing section expansion (3+ variants with monthly/annual toggle)
- Custom hex color input in palette editor
- Section headings/eyebrows above card grids
- Scroll-triggered fade-in animations

---

## Scope Definition

### 6A: Canned Demo Simulation (P0)

The core capstone demo feature. When a user clicks an example or speaks a command, the builder should:

1. Switch to Chat tab automatically
2. Display typewriter captions narrating what "the AI" is doing
3. Apply theme (palette, fonts)
4. Reveal sections one-by-one with timed delays
5. Switch to Builder tab when complete

**Simulation sequence (example: "Sweet Spot Bakery"):**

```
[0.0s] Navigate to /builder
[0.5s] Chat tab activates
[1.0s] Typewriter: "let's build a bakery website..."
[2.0s] Theme applies (Wellness palette)
[2.5s] Typewriter: "adding a warm hero section..."
[3.5s] Hero section appears
[5.0s] Typewriter: "now some features..."
[5.5s] Content Cards section appears
[7.0s] Typewriter: "customers love reviews..."
[7.5s] Quotes section appears
[8.5s] Typewriter: "and a way to order..."
[9.0s] Action section appears
[9.5s] Typewriter: "your bakery site is ready"
[10.0s] Switch to Builder tab, right panel fades in
```

**Files involved:**
- New: `src/lib/demoSimulator.ts` — orchestrates timed section reveals
- Modify: `src/components/left-panel/ChatTab.tsx` — add quick-demo buttons
- Modify: `src/components/left-panel/ListenTab.tsx` — wire "Watch a Demo" to simulator
- Modify: `src/stores/configStore.ts` — add section-reveal API

### 6B: Chat Quick-Demo Buttons (P0)

Below the chat input, add 3-4 quick-action buttons:

```
Quick demos:
[Build a Bakery] [Build a Startup] [Build a Portfolio] [Build a Consulting Site]
```

Each button triggers the canned demo simulation with the corresponding example JSON.

### 6C: Listen Mode Demo (P1)

Wire the "Watch a Demo" button in Listen tab to the demo simulator:

```
[0s]   Orb slow pulse
[1s]   Caption: "listening..."
[3s]   Caption: "heard: build me a bakery website"
[4s]   Orb speeds up
[5s]   Caption: "on it..."
[6-9s] Sections appear with captions
[10s]  Caption: "ready"
[11s]  Orb returns to slow, auto-switch to Builder tab
```

### 6D: XAI Docs Integration (P1)

Surface the AISP specification in a readable format:
- Render the JSON spec as a structured document in the XAI DOCS tab
- Show section-level explanations
- Include the AISP symbol reference

### 6E: Deploy Preparation (P1)

- **Vercel deployment:** Configure `vercel.json`, environment variables, build settings
- **Static HTML export:** "Download as HTML" button that generates a self-contained HTML file with inline styles and CDN image references
- **Shareable preview URL:** Share button generates a URL that loads the site in preview mode (no builder chrome)

### 6F: Polish Carryover (P2)

Items deferred from Phase 5:
- ColumnsGlass ambient blob fix
- HeroSplit responsive (`flex-col md:flex-row`)
- ImagePicker integration for Team and Logo Cloud editors
- Uniform section spacing fix (type-appropriate padding)
- Section headings/eyebrows above card grids

---

## Dependencies on Phase 5 Deliverables

| Dependency | Status | Risk |
|-----------|--------|------|
| 15 section types with variant renderers | DONE | None |
| 4 example website JSONs | DONE | None |
| ImagePicker component | DONE | None |
| Theme system with 8 presets + 10 palettes | DONE | None |
| Chat tab with typewriter display | DONE | None |
| Listen tab with orb animation | DONE | None |
| Preview mode (hidden chrome) | DONE | None |
| Plain-English section labels | DONE | None |
| configStore with undo/redo | DONE | None |
| Theme-aware colors across all templates | DONE (19 fixed) | Low — may find more in edge cases |

All Phase 5 deliverables required for Phase 6 are complete. No blocking dependencies.

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Demo timing feels artificial | Medium | High | Tune delays with user testing. Add subtle randomness to intervals. Use easing functions for section reveals. |
| Vercel deploy breaks with client-side routing | Medium | Medium | Configure `vercel.json` rewrites for SPA routing. Test with `vercel dev` locally. |
| Static HTML export misses styles | Medium | Medium | Use inline Tailwind styles or include CDN link. Test generated HTML in clean browser. |
| Persona score stays below 75 | High | Medium | Demo simulation is the single biggest score lever. If implemented well, the "wow factor" should push Agency Owner and Founder scores up 8-10 points each. |
| Scope creep into chat intelligence | Low | Medium | Chat v2 (15+ command patterns, history panel) is explicitly deferred to Phase 7+. Phase 6 chat work is limited to quick-demo buttons. |
| Capstone timeline pressure | Medium | High | Phase 6 targets 1 week. If demo simulation is done by day 3, remaining time goes to deploy + polish. If blocked, cut XAI Docs and polish carryover. |

---

## Estimated Timeline

| Day | Focus | Deliverables |
|-----|-------|-------------|
| 1 | 6A: Demo simulator core | `demoSimulator.ts`, timed section reveal, typewriter integration |
| 2 | 6B + 6C: Chat buttons + Listen demo | Quick-demo buttons in Chat tab, Listen "Watch a Demo" wired |
| 3 | 6E: Deploy prep | Vercel config, static HTML export, shareable preview URL |
| 4 | 6D: XAI Docs | AISP spec rendering in XAI DOCS tab |
| 5 | 6F: Polish + testing | Carryover fixes, full persona re-review, Playwright verification |
| 6-7 | Buffer | Bug fixes, scoring re-run, capstone prep |

**Target persona score after Phase 6:** 75+

---

## Success Criteria

| # | Criterion | Target |
|---|-----------|--------|
| 1 | Canned demo plays full sequence for all 4 examples | Sections appear one-by-one with captions |
| 2 | Chat quick-demo buttons work | Click triggers simulation |
| 3 | Listen "Watch a Demo" runs simulation | Orb pulses, captions appear, site builds |
| 4 | Static HTML export produces valid page | Opens in browser, all sections render |
| 5 | Vercel deploy succeeds | Live URL accessible |
| 6 | Persona score re-run | Average 75+ (up from 65) |
| 7 | All 26 existing tests pass | No regressions |
| 8 | Preview mode shareable URL | URL loads site without builder chrome |
