# Phase 122 — Swarm Instructions
**Branch:** `swarm/p122-ux-overhaul`  
**Target score:** 40/100 → 50/100  
**Phases remaining before LLM API:** P122 (this), P123  
**P124:** Gemini demo mode (deferred — key not yet provided)

---

## Owner Decisions — Locked

| # | Question | Answer |
|---|---|---|
| 1 | Default template | Hey Bradley site — professional, dark, crimson |
| 2 | Landing preview card | Less prominent animation, listen-mode appearance |
| 3 | Nav + messaging | Fine as-is — do not touch |
| 4 | Builder UI scope | Fix critical issues, target 50/100 |
| 5 | Gemini key | Phase 124 — not this phase |

---

## Wave A1 — Audit (do first, no code changes)

```
Before writing any code, audit and report only:

1. Confirm which shadcn components are actually installed 
   in src/components/ui/ — list all present primitives.

2. Grep src/components/ for:
   - style={{ on any JSX element (inline styles doing layout)
   - overflow-x (any value)
   - scrollbar references in CSS

3. Identify the current default template config file.
   Where is "Welcome to Your Website" defined?
   What file controls the initial sections array?

4. Identify where onboarding/template selection is rendered.
   Does a template picker component exist?
   If not, where would it be added (Welcome.tsx? a modal?)?

5. Report the above as a markdown table.
   Do not change any files in this wave.
```

---

## Wave A2 — Default Template + Onboarding Templates

### Task 1: Hey Bradley default template

Replace the current "Welcome to Your Website" default with a
professional Hey Bradley-branded site.

**Spec for the Hey Bradley template:**
```
Site name: Hey Bradley
Theme: dark, crimson accent (#A51C30)
Font: Inter or DM Sans

Section 1 — Hero (dark)
  Heading: "Describe it. See it."
  Subheading: "Your voice is the whiteboard. 
    Describe any site. Watch it build."
  CTA primary: "Start describing"
  CTA secondary: "Watch a demo"
  Style: dark bg, no stock photo, 
         crimson gradient orb behind text

Section 2 — Features (3 columns, dark cards)
  Card 1: 🎙  Listen mode
    "Talk through your idea. The site 
     builds while you speak."
  Card 2: ⚡  Real-time
    "Not regeneration — surgical JSON patches. 
     Sub-second updates."
  Card 3: 📄  Export spec
    "Every build produces a formally verified 
     AISP spec. Hand to Claude Code."

Section 3 — Stats (3 numbers)
  92%  — SWE-bench success rate
  <2%  — Spec ambiguity (AISP)
  0.8s — First build time

Section 4 — CTA / Footer band
  "Ready to build?"
  Button: "Try the builder"
  Dark bg, crimson button
```

This becomes the DEFAULT — what every new user sees on first load.

---

### Task 2: Four onboarding template cards

Add a template picker shown on first load or via 
"Browse templates" voice command.

**Layout:** 2×2 grid of cards, each with:
- Preview thumbnail (generate a simple CSS mock, 
  no real image required)
- Template name
- One-line description
- "Use this template" button

**The four templates:**

**Card 1 — Hey Bradley** (default, pre-selected)
```
Name: Hey Bradley
Description: "The builder's own site — 
  dark theme, crimson accents, 3 sections"
Sections: Hero + Features + Stats
Theme: dark, crimson
```

**Card 2 — Kitchen Sink**
```
Name: Kitchen Sink
Description: "Every section type — 
  use this to explore all capabilities"
Sections: Hero + Features + Columns + Pricing + 
  Quotes + Numbers + Action + FAQ + Gallery
Theme: light, neutral
```

**Card 3 — Portfolio**
```
Name: Portfolio
Description: "Clean personal site for 
  creatives, designers, and founders"
Sections: Hero (name + title) + Gallery (3-col) + 
  About + Contact
Theme: light, serif typography, warm
Hero heading: "Your Name Here"
Hero subhead: "Designer · Builder · Maker"
```

**Card 4 — Swarm choice**
```
SWARM: Identify the highest-quality template 
in the existing template library (src/lib/templates/ 
or wherever templates are defined).

Criteria:
  - Most complete section coverage
  - Best visual quality in preview
  - Most likely to impress a first-time user
  - NOT generic SaaS (we have Hey Bradley for that)

Suggested candidates: agency, restaurant, nonprofit, 
startup. Pick the one that renders best.

Document your choice and rationale in the session-log.
```

---

## Wave A3 — Landing Page Preview

**Goal:** Replace the skeleton wireframe card with a 
listen-mode-style preview that feels alive.

**Current problem:** Grey skeleton lines + red button 
below the hero looks like a broken loading state.

**Target:** Recreate the visual feel of the listen mode 
left panel (the red orb, "Ready to listen..." state) 
as a stylised preview — not a skeleton, not a real iframe.

### Implementation:

Create a new component: 
`src/components/marketing/ListenPreview.tsx`

```tsx
// A stylised mockup of the listen mode UI
// Shows what the product looks like in use
// NOT an iframe — a crafted visual illusion

Layout (side by side):
LEFT (~30%): 
  - Small crimson orb (pulsing, CSS animation)
  - Text: "Ready to listen..."
  - Simulated waveform bars (CSS, animated)
  - "HOLD TO TALK" button (styled, not functional)
  - Muted: "Your voice goes to your browser's STT..."

RIGHT (~70%):
  - Mini browser chrome (3 dots + URL bar)
  - Inside: a simplified version of the Hey Bradley 
    template hero — "Describe it. See it." in white, 
    dark bg, crimson button visible
  - Should look like a site actively being built

Styling:
  - Dark card, subtle border
  - Rounded corners (rounded-xl)
  - Less prominent than current — scale it down, 
    add opacity: 0.85
  - Max width: 640px, centered
  - NOT full-width
```

Replace the skeleton card in Welcome.tsx with 
`<ListenPreview />`.

**Animation:** The orb should pulse (existing keyframes). 
The waveform bars should animate. Nothing else should move — 
keep it calm, not flashy.

---

## Wave A4 — Critical Builder UI Fixes

**Target:** Fix the issues that make the builder feel broken.  
**Do not attempt:** Full shadcn migration, panel design overhaul.  
**Do fix:** The things visible in the screenshots.

### Fix 1: Left panel horizontal scroll
```
File: whichever component renders the left panel sidebar

Fix:
  - Add overflow-x: hidden to the panel container
  - Add min-w-0 to all flex children inside the panel
  - Wrap content in shadcn <ScrollArea> with 
    type="vertical" (vertical scroll only)
  - The scrollbar at the bottom must disappear
  
Verify: resize browser to 1200px wide — 
no horizontal scroll should appear anywhere
in the left panel.
```

### Fix 2: Chat toolbar clipping
```
File: the Chat tab panel component

Problem: PROFESSIONAL button cut off at right edge

Fix:
  - Wrap the toolbar button row in a flex container 
    with flex-wrap: wrap OR
  - Use shadcn <ScrollArea> horizontal on just 
    the toolbar row
  - All buttons (SHARE SPEC, EXPORT, SIMULATED MODE, 
    PROFESSIONAL) must be visible without scrolling
    at 1280px width
```

### Fix 3: Agentics card grid alignment
```
File: the Agentics panel component

Problem: 7th card (JSON Config) sits alone 
in a bottom row, looks orphaned.

Fix option A: Change grid from 3-col to 
  auto-fill with min card width — 
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
  This lets 7 cards fill naturally.

Fix option B: Add an 8th card.
  Suggested: "Export Bundle"
  Icon: 📦
  Description: "Full ZIP: CLAUDE.md, ADRs, specs, scaffold"
  This is a real feature — wire it to the export action.

Swarm: choose whichever is cleaner to implement.
Document choice in session-log.
```

### Fix 4: "More Sections" label
```
File: left panel section list component

Change: "More Sections" label/button → 
  "+ Add Section" with a proper shadcn Button 
  variant="outline" size="sm"
  
This communicates action, not navigation.
```

---

## Wave A5 — Engineering Hygiene (carry-forwards)

### CF-P121-1: Node 22 pin for CI
```
File: .github/workflows/ (whichever CI file runs tests)

Add: 
  node-version: '22'
  
This stops the Node v24 JSON import error from 
breaking the full 152-file test run.
Playwright tests should pass in full after this fix.
```

### CF-P121-2: sql.js WASM path
```
Files: 
  1. Copy: node_modules/sql.js/dist/sql-wasm.wasm 
     → public/sql-wasm.wasm
  2. Edit db.ts initSqlJs call:
     const SQL = await initSqlJs({
       locateFile: () => '/sql-wasm.wasm'
     });
  3. Confirm public/sql-wasm.wasm is NOT in .gitignore

Verify: dev server starts, no WASM errors in console,
"[persistence] initDB" succeeds.
```

---

## Exit Criteria

```
[ ] Build passes: npm run build — zero errors
[ ] Dev server: no console errors (except React DevTools info)
[ ] Default template: Hey Bradley site renders on first load
[ ] Template picker: 4 cards visible and selectable
[ ] Landing preview: ListenPreview component, no skeleton
[ ] Left panel: zero horizontal scrollbar
[ ] Chat toolbar: all buttons visible at 1280px
[ ] Agentics grid: 7 cards fill cleanly, no orphan
[ ] "Add Section" button replaces "More Sections"
[ ] Node 22 pinned in CI
[ ] WASM initialises without error on dev server
[ ] Score self-assessment: honest 50/100 or document gap
```

---

## Phase Sequence Summary

```
P122 (this)  — Templates + landing preview + critical UI
               Target: 40 → 50/100

P123         — UI continuation, target 50 → 65/100
               Scope TBD after P122 retrospective
               Focus: builder panel proportions, 
               resizable panels, right panel polish,
               public site below-fold content

P124         — Gemini demo mode
               /api/demo-chat, server-side key,
               IP rate limit, dollar cap
               Owner provides key at P124 start
```

---

## Do Not Touch in This Phase

```
- MarketingNav.tsx (nav is fine)
- Welcome.tsx hero section copy
- AISP Crystal Atom view (already great)
- Listen mode core UI (already good)
- BlogPost.tsx
- About.tsx / Docs.tsx (P122 architecture deferred)
- Any builder logic / LLM adapter code
- src/lib/blogPosts.ts
```