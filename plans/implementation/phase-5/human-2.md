# Hey Bradley — Phase 5 Directive: Polish Sprint + Canned Demo Foundation

**Priority:** P0 — The product scores 52/100. It needs to be 75+ before capstone.  
**Root Cause:** The product is built by engineers for engineers. Every label, color, and flow assumes technical literacy. The fix is vocabulary + visual polish + simulated functionality.

---

## 1. THE FIVE HIGHEST-ROI FIXES (Do First — Moves Score from 52 → 70)

### Fix 1: Kill All Jargon (30 minutes, biggest single impact)

Search and replace across the entire codebase:

| Current (Developer Jargon) | Replace With (Plain English) |
|---------------------------|----------------------------|
| Hero | Main Banner |
| CTA / Call to Action | Action Banner |
| Navbar | Top Menu |
| Value Props | Key Numbers |
| FAQ | Questions & Answers |
| SaaS (theme name) | Tech Product |
| "Agentic Design Platform" | "Your AI Website Builder" |
| "THE WHITEBOARD THAT WRITES YOUR SPECS" | "Tell Bradley What You Want. Watch It Appear." |
| "proof-based specifications" | "ready-to-build website plans" |
| "Simulate Input" | "Watch a Demo" |
| hero-01, features-01, etc. | **Hide all section IDs from the UI** — only show the human name |
| AISP (in user-facing text) | "Technical Spec" |
| "vibe" | "style" or "theme" (already mostly done) |

**Files to check:** `SectionsSection.tsx` (section IDs visible), `Welcome.tsx` (tagline/subtitle), `ListenTab.tsx` ("Simulate Input"), `TopBar.tsx`, all section editor labels, onboarding theme card labels.

**Rule:** If grandma wouldn't understand the word, replace it. The ONLY place developer terms are acceptable is in the DATA tab (JSON view) and XAI DOCS tab.

### Fix 2: Splash Page — Always-Clickable CTA + Skip (15 minutes)

**Current:** User must wait 30+ seconds for the typewriter animation to finish before the "Get Started" button activates. This is hostile.

**Fix:**
- CTA button is **always enabled and visible** from the moment the page loads
- Position it prominently: large, crimson, centered below the tagline
- The typewriter animation plays BEHIND/BESIDE the CTA as ambient decoration — it does not gate the CTA
- Add a "Skip" text link next to or below the animation area
- Rewrite the CTA: "Start Building →" (not "Get Started" which is generic)

**New splash layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              Hey Bradley                            │
│   Tell Bradley What You Want. Watch It Appear.      │  ← New tagline
│                                                     │
│           [ Start Building → ]                      │  ← Always enabled, big, crimson
│                                                     │
│   ┌─ typewriter chat ─┐  ┌─ hero showcase ─┐       │  ← Ambient, not gating
│   │ ...animating...    │  │ (theme preview) │       │
│   └────────────────────┘  └─────────────────┘       │
│                                                     │
│   "Or explore an example:"                          │
│   [Sweet Spot Bakery] [LaunchPad AI] [Photography]  │  ← Example buttons
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Fix 3: Mobile Splash Page (30 minutes)

**Current:** The 45%/55% horizontal split is completely broken on mobile.

**Fix:** Stack vertically below `md` breakpoint:
```
Mobile:
  Hey Bradley (title)
  Tagline
  [Start Building →]
  Typewriter chat (full width)
  Hero showcase (full width, below chat)
  Example buttons (stacked or 2-col)
```

Use Tailwind responsive: `flex-col md:flex-row` for the chat/showcase split.

### Fix 4: Light Mode Listen Tab Background (10 minutes)

**Current:** Listen tab has hardcoded `bg-[#1a1a1a]` that doesn't respond to light mode.

**Fix:** Use `bg-hb-panel` or the builder chrome background variable. In light mode, the orb should pulse crimson on the warm off-white background — still striking, different aesthetic. Or: keep the listen tab dark in both modes (it's a "theatrical" space) but add a subtle border/transition so it doesn't feel like a broken element.

**Recommendation:** Keep listen tab dark always. It's a stage. The dark background makes the orb pop. Just add a 1px border and a subtle transition when entering listen mode so it feels intentional, not broken.

### Fix 5: Remove Section IDs from UI (10 minutes)

**Current:** Users see "Hero hero-01", "Features features-01" next to every section.

**Fix:** Hide the ID. Only show the human-readable name. The ID is an implementation detail stored in JSON — not a user-facing label.

```tsx
// BEFORE
<span>{section.type} {section.id}</span>

// AFTER  
<span>{getSectionLabel(section.type)}</span>
// Where getSectionLabel maps: hero → "Main Banner", features → "Features", etc.
```

---

## 2. CANNED DEMO MODE (Moves Score from 70 → 80)

### 2.1 Example Websites with "Watch It Build" Simulation

The 4 example website JSONs should already exist from Phase 4. The missing piece is the **simulation experience**: user clicks an example → typewriter captions appear → site sections appear one by one → feels like AI is building it.

**Simulation sequence when user clicks an example (e.g., "Sweet Spot Bakery"):**

```
[0.0s] Navigate to /builder
[0.5s] Left panel switches to Chat tab automatically  
[1.0s] Typewriter caption: "let's build a bakery website..."
[2.0s] Theme applies (Wellness) — hero background changes
[2.5s] Typewriter: "adding a warm hero section..."
[3.5s] Hero section appears with bakery content
[4.0s] Typewriter: "now some features..."
[5.0s] Features section appears
[5.5s] Typewriter: "customers love reviews..."
[6.5s] Testimonials section appears
[7.0s] Typewriter: "and a way to order..."
[8.0s] CTA section appears  
[8.5s] Typewriter: "your bakery site is ready ✓"
[9.0s] Left panel switches to Builder tab
[9.5s] Right panel fades in
```

This makes loading a pre-built example feel like **the AI is building it in real-time**, even though it's just loading a JSON file with timed section reveals. The key is the typewriter captions providing a narrative while sections appear one by one.

### 2.2 Chat Simulation Buttons

In the Chat tab, below the input, add 3-4 quick-action buttons:

```
┌─────────────────────────────────────┐
│  Quick demos:                       │
│  [🍪 Build a Bakery]               │
│  [🚀 Build a Startup]              │
│  [📸 Build a Portfolio]            │
│  [💼 Build a Consulting Site]      │
└─────────────────────────────────────┘
```

Clicking any of these triggers the same simulation sequence as the example websites. This gives users a one-click "wow" moment from within the builder.

### 2.3 Listen Mode Simulation

When user clicks "Watch a Demo" (renamed from "Simulate Input"):

```
[0s]   Orb slow pulse
[1s]   Caption (italic, muted): "listening..."
[3s]   Caption: "heard: build me a bakery website"
[4s]   Orb speeds to fast pulse
[5s]   Caption (typewriter): "on it..."
[6s]   Caption: "picking warm colors..."
[7s]   Theme applies, hero updates
[8s]   Caption: "adding sections..."
[9s]   Sections appear
[10s]  Caption: "ready ✓"
[11s]  Orb returns to slow. Auto-switch to Builder tab.
```

### 2.4 Transcript & Change Log

**Transcript:** Shared history accordion in Chat and Listen tabs (already designed in Doc 22). One line per action. Collapsed by default.

**Change Log:** Add a simple log to the DATA tab as a toggle: "JSON View" | "Change Log". The change log shows timestamped entries:
```
10:32  Theme → Wellness
10:32  Mode → light
10:33  Section added: Testimonials
10:33  Headline → "Sweet Spot Bakery"
```

Not a separate center tab — fold it into DATA tab to keep the tab count at 4.

---

## 3. SITE DETAILS PAGE (New Feature — Phase 5 or 6)

A "Site Details" section in the right panel when Theme is selected, or as a separate first item in the Builder tab section list:

```
SITE DETAILS
├── Site Name: "Sweet Spot Bakery"
├── Tagline: "Handcrafted with love since 2019"
├── Author: "Jane Baker"
├── Description: "A local bakery specializing in artisan cookies and pastries"
├── Domain: "sweetspotkbakery.com" (optional)
└── Favicon: (color picker or upload — defer upload)
```

This maps to the `site` level in the JSON hierarchy (`site.title`, `site.description`, `site.author`). It's important because:
- The navbar logo text should read from `site.title`
- The page `<title>` should read from `site.title`
- Export/XAI Docs use `site.description` and `site.author`

**Implementation:** Add a "Site Details" accordion to the Theme right panel (above the theme preset cards), or make it a separate clickable item at the top of the Builder tab section list (above Theme).

---

## 4. VISUAL POLISH CHECKLIST

| # | Issue | Fix | Priority |
|---|-------|-----|----------|
| 1 | Light mode crimson borders on EVERY button | Remove blanket `.light-chrome button` border. Only active/selected elements get crimson border. | P0 |
| 2 | Status bar shows "READY AISP SPEC V1.2" | Change to "Ready" or hide entirely. Status bar should show meaningful info or nothing. | P1 |
| 3 | "LISTEN" and "BUILD" badges unclear | Add tooltip or label. Or just show the active mode: "Mode: Build" | P1 |
| 4 | "Share" button does nothing | Either wire to copy URL, or show "Coming soon" toast, or hide it | P1 |
| 5 | No 404 page | Add a simple 404 → redirect to "/" | P2 |
| 6 | Onboarding theme cards show no preview | The mini-preview cards exist in the right panel — reuse them on onboarding. Each card should show actual colors/layout, not just a name. | P1 |
| 7 | Tab labels "XAI DOCS" "WORKFLOW" | Consider: "Specs" and "Pipeline" or "Docs" and "Steps" — less jargony | P1 |
| 8 | Double-click to delete section | Replace with single click → confirmation dialog | P2 |
| 9 | Hover-only action buttons (reorder, duplicate, delete) | Make always visible on the selected section row, hidden on others | P1 |

---

## 5. SWARM EXECUTION ORDER

```
STEP 1: Jargon removal (Fix 1) — search and replace, 30 min
STEP 2: Splash page CTA always enabled + mobile fix (Fix 2+3) — 30 min
STEP 3: Section ID removal + light mode polish (Fix 4+5) — 20 min
STEP 4: Light mode border cleanup (§4 item 1) — 15 min
STEP 5: Site Details section in right panel — 1 hour
STEP 6: Canned demo simulation (§2.1-2.3) — 2-3 hours
STEP 7: Visual polish items (§4 remaining) — 1 hour
STEP 8: Playwright verification — all existing tests pass + new checks

TOTAL: ~6-7 hours of swarm time
```

**Steps 1-4 are the "move from 52 to 70" fixes.** Do these first before anything else. Steps 5-7 are the "move from 70 to 80" features.

---

## 6. VERIFICATION

| # | Check | Target |
|---|-------|--------|
| 1 | Zero developer jargon in user-facing UI | No "Hero", "CTA", "Navbar", "SaaS", "Agentic" visible to user |
| 2 | Splash page CTA clickable within 2 seconds of page load | Button always enabled |
| 3 | Splash page works on mobile (375px) | Stacked layout, no horizontal overflow |
| 4 | Section list shows human names only (no IDs) | "Main Banner" not "Hero hero-01" |
| 5 | Light mode has no invisible buttons | All interactive elements visible and clickable |
| 6 | Example website simulation plays the typewriter sequence | Sections appear one by one with captions |
| 7 | Chat quick-demo buttons work | Click "Build a Bakery" → simulation runs |
| 8 | Listen "Watch a Demo" runs simulation | Orb pulses → captions → site appears |
| 9 | Site Details editable in right panel | Site name, tagline, author inputs work |
| 10 | Re-run UI/UX review — target 75+ | Improvement from 52 baseline |

---

*The product has good bones. The fix is vocabulary and visual consistency, not architecture. Replace every developer word with a grandma word. Fix the colors. Add the simulation magic. 52 → 75+ in one sprint.*