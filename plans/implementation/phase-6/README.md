# Phase 6: Home Page + Listen Simulation

**North Star:** The "wow" phase. A cinematic splash page with animated chat showcase, plus the red orb listen simulation that makes the capstone demo feel like a real AI product.

**Status:** WAITING (after Phase 5)
**Prerequisite:** Phase 5 COMPLETE (simulated chat works)

---

## Phase 6 Goal

Two deliverables that create the capstone "wow moments":

1. **Home/Splash Page** — A polished landing page for Hey Bradley itself, inspired by the reference splash design (split layout: left chat panel with typewriter animation, right hero showcases that transition as chat progresses).
2. **Listen Mode Simulation** — Toggle LISTEN → dark overlay + red pulsing orb → "START LISTENING" → scripted 10-15 second typewriter sequence → load example website → auto-switch to BUILD mode.

---

## Reference Materials

- **Splash page code:** `plans/implementation/level-1-core-builder/human-feedback/love-example-spash.md`
- **Screencaps:** `plans/implementation/phase-3/screencaps/splash-0.png` through `splash-5.png`
- **Brad Pixar avatar:** `plans/implementation/phase-3/screencaps/brad_pixar.webp`

The reference splash uses:
- Split layout: 45% left chat panel, 55% right hero showcase
- Typewriter conversation flow with timed showcase transitions
- 5 hero styles: whiteboard (initial), background-image, minimal, Harvard crimson, SaaS gradient, creator portrait
- framer-motion animations (fade, slide, scale)
- Indicator dots for showcase navigation
- "Get Started" CTA at bottom of chat panel

---

## Deliverables

### Home/Splash Page
- Marketing-style landing page at `/` (replaces or wraps current onboarding)
- Split layout with animated chat conversation + hero showcase transitions
- Theme showcases demonstrate what Hey Bradley can build
- "Get Started" → navigates to onboarding/builder
- Professional quality: Stripe/Linear tier polish

### Listen Mode Simulation
- Toggle LISTEN in TopBar → dark overlay appears
- Red pulsing orb centered
- "START LISTENING" button below orb
- Click start → typewriter text sequence (~10-15s):
  - "Listening..." → "Heard: bakery website with testimonials" → "Parsing..." → "Applying Wellness theme..." → "Building sections..."
- After sequence → load sweet-spot-bakery.json (from Phase 4 examples)
- Auto-switch to BUILD mode
- Workflow tab animates in sync (if time)

---

## Key Files

| File | Action |
|------|--------|
| `src/pages/Home.tsx` | CREATE — splash page |
| `src/components/shell/ListenOverlay.tsx` | CREATE — red orb + typewriter simulation |
| `src/components/shell/TopBar.tsx` | MODIFY — wire LISTEN toggle |
| `src/assets/bradley/brad_pixar.webp` | COPY from screencaps |

---

## What Phase 6 Does NOT Do

- Real voice/STT integration (Phase 9+)
- XAI Docs (Phase 7)
- Vercel deployment (Phase 8)
