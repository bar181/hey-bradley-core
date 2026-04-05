# Phase 14 — Comprehensive Fix Checklist

**Source:** Screenshot review + human feedback (April 5, 2026)
**Rule:** The swarm creates a plan for each item before implementing. No item is started without a documented approach.

---

## CRITICAL FIXES (P0 — Do First)

### 1. AISP Output Is Structured Prose, Not Real AISP
**Screenshot:** Image 1 — The AISP tab shows `@aisp 2.0` format with `@section`, `@variant`, `@layout` tags. This is NOT AISP 5.1 Crystal Atom notation.
**Problem:** The entire thesis depends on AISP producing formal mathematical notation with Σ_512 symbols. What's rendering is structured prose with @ tags — closer to YAML than formal logic.
**Fix:** The AISP generator must output proper Crystal Atoms:
```aisp
⟦
  Ω := { render(Site, "LaunchPad AI") | |sections| = 7 ∧ theme.preset = "saas" ∧ theme.mode = "dark" }
  Σ := { MasterConfig : 𝕋 := { site: Site, theme: Theme, sections: Section 𝕃 }, ... }
  Γ := { R1: ∀ s ∈ sections : s.enabled = ⊤ ⟹ render(s), ... }
  Λ := { palette := ⟨ bg₁: "#0f172a", ... ⟩, sections := [...] }
  Ε := { V1: VERIFY ∀ s : render(s) ≠ ⊥, ... }
⟧
```
**NOT** the current `@aisp 2.0 / @section columns / @variant glass` format. Use `aisp_validate` and `aisp_tier` to confirm Platinum. The Blueprints AISP sub-tab AND the Expert panel "RAW AISP SPEC" (Image 5) both need this fix.
**Files:** `src/lib/specGenerators/aispSpecGenerator.ts`, `src/lib/specGenerators/sectionRules.ts`

### 2. Expert Panel Shows "RAW AISP SPEC" — Remove
**Screenshot:** Image 5 — The Expert tab for Content Cards shows a "RAW AISP SPEC" section at the bottom with the @aisp 2.0 format.
**Problem:** AISP specs belong in the Blueprints tab, not in the per-section Expert editor. This is developer clutter in the wrong place.
**Fix:** Remove the "RAW AISP SPEC" section from ALL Expert panel section editors. AISP lives only in Blueprints → AISP sub-tab.
**Files:** All section editor components in `src/components/right-panel/editors/`

### 3. Landing Page Hero Statement Missing
**Problem:** The landing page still shows the chat animation with no context above it. First-time visitors don't know what Hey Bradley is.
**Fix:** Add hero text above the animation:
```
The whiteboard that writes your specs.
Describe what you want. See it build in real-time.
Get enterprise specifications that any AI can execute on the first try.
[Try the Builder →]    [Read the Story →]
```
**Files:** `src/pages/Welcome.tsx`

### 4. Resources/Developer Guide Tab Missing
**Problem:** The Resources tab (beside Blueprints) with JSON templates, AISP conversion guide, media library browser, and wiki is not implemented.
**Fix:** Add "Resources" as a top-level center tab (EXPERT mode only). Four sub-sections: Templates & JSON, AISP Guide, Media Library, Wiki placeholder.
**Tab order SIMPLE:** `Preview | Blueprints`
**Tab order EXPERT:** `Preview | Blueprints | Resources | Data | Workflow`
**Files:** New `ResourcesTab.tsx` component, update `CenterCanvas.tsx` tab routing

---

## UI/UX FIXES (P1 — Do After P0)

### 5. Rename "Main Banner" → "Hero Section"
**Screenshot:** Image 1 left panel — "Main Banner" is awkward. "Hero Section" or just "Hero" is the standard term everyone understands.
**Fix:** Find and replace all instances of "Main Banner" with "Hero" in section labels, editors, and JSON references.

### 6. Rename "Top Menu" → "Navigation Bar"
**Screenshot:** Image 3 — "Top Menu" in the add section list. Change to "Navigation Bar" or "Nav Bar".
**Fix:** Update the section label and all references.

### 7. Navigation Bar Simple Mode Needs Toggle + Layout Options
**Screenshot:** Image 6 — Top Menu SIMPLE mode shows Logo Text and Action Button toggles (not working) and content inputs.
**Fix:**
- Make the Logo Text and Action Button toggles actually work (currently grayed out with no function)
- Add layout options to EXPERT mode: Sticky (yes/no), Transparent/Glass background, Hamburger menu (mobile behavior)
**Files:** `src/components/right-panel/editors/MenuEditor.tsx`

### 8. Onboarding Page — Preview Images Disappear
**Screenshot:** Image 2 — Examples tab shows text cards with no preview images (was working in Phase 9 with 18 preview screenshots).
**Problem:** The preview screenshots either regressed or the image paths broke during Phase 10-13 refactoring.
**Fix:** Verify preview screenshots exist in `/public/previews/`. If missing, regenerate using the Playwright screenshot script. If paths are wrong, fix the image references in the onboarding component.
**Files:** `src/pages/Onboarding.tsx`, `/public/previews/`

### 9. "More Sections" Has Double Scrollbar
**Screenshot:** Image 3 — The "Add New Section" dropdown has its own scrollbar inside the panel scrollbar.
**Fix:** Replace the scrollable dropdown with an accordion or a full-height list that uses the panel's native scroll. No nested scrollbars.
**Files:** `src/components/left-panel/SectionList.tsx` or equivalent

### 10. Toggle Panel Buttons Cut Off Font
**Problem:** The panel resize handles are cutting into text/labels at the panel edges.
**Fix:** Add padding/margin to panel content containers so text doesn't touch the resize handles. Verify at minimum panel width (18%).
**Files:** `src/components/shell/PanelLayout.tsx`

---

## CHAT MODE FIXES (P1)

### 11. Chat Examples — Button with Dialog, Not Inline List
**Screenshot:** Image 4 area — The chat tab currently shows example options inline.
**Fix:** Replace with a button "💡 Try an Example" that opens a dialog/modal with:
- **Site Templates:** "Build me a bakery website", "Create a SaaS landing page", "Make a photography portfolio"
- **Common Updates:** "Add a pricing section", "Add testimonials", "Change to dark mode"
- **Style Changes:** "Make this brighter", "Make this more fun", "Make this professional"
- Each option has a short description of what it will do
- Clicking an option closes the dialog and executes the command

### 12. Site-Wide Chat Commands Need Expanded JSON Theme Support
**Problem:** Commands like "make this brighter" or "make this more fun" need to actually change multiple settings simultaneously.
**Fix:**
- "Make this brighter" → change palette to lighter colors + set mode to light
- "Make this more fun" → change tone to playful + update site context + potentially swap to a more energetic theme
- "Add pricing section" → add pricing section AND updated hero CTA AND new action block (not just one section)
- These compound commands need expanded JSON theme configs that define the full set of changes per command
**Files:** `src/lib/chatHandler.ts` or equivalent, theme JSON files

---

## LISTEN MODE FIXES (P1)

### 13. Listen Button Should Be at Bottom
**Screenshot:** Image 4 — The listen interface has the orb at top, typewriter in middle, example buttons below.
**Fix:** Move the "Start Listening" / "LISTENING" button to the bottom of the panel. The flow should be: orb (top, visual) → typewriter captions (middle, feedback) → demo buttons as dialog (bottom) → start button (very bottom).

### 14. Listen Demo Options Should Be Button → Dialog
**Problem:** Same as chat — demo options should open a dialog, not display inline.
**Fix:** "🎙 Watch a Demo" button → dialog with options: "Bakery website", "SaaS startup", "Photography portfolio", "Food blog". Clicking selects and starts the demo sequence. Dialog closes automatically.

---

## MARKETING SITE FIXES (P1)

### 15. Marketing Website Pages Not Updated
**Problem:** The /about, /open-core, /docs, /how-i-built-this pages are still basic placeholder content from Phase 11.
**Fix:** Update with full content as specified in the marketing site plan. Convert hey-bradley-story.html → /story route. Convert aisp-explainer.html → /aisp route. Add consistent nav + footer across all marketing pages.
**Files:** All pages in `src/pages/`

---

## DOCUMENTATION REQUIREMENTS (P2)

### 16. Historical Build Review
**Task:** The swarm must review ALL phase plans (Phase 1-13) and create a comprehensive file listing every planned feature that was NOT implemented.
**Output:** `plans/deferred-features.md` with columns:
- Feature name
- Original phase planned
- Rationale for deferral (no longer valid / too complex for grandma / deferred to LLM phase / superseded by different approach)
- Current status (still wanted / cancelled / replaced by X)

### 17. Expanded JSON Theme Configs
**Task:** Each theme needs expanded JSON that includes not just colors/fonts but also:
- Recommended section types for this theme
- Default tone/audience/purpose for this theme
- Chat command mappings (what "make it brighter" means for each theme)
- Variant recommendations per section type
**Files:** `src/data/themes/*.json`

---

## SWARM EXECUTION ORDER

```
BATCH 1 (Critical — 2 hours):
  #1  Fix AISP generator output (real Crystal Atoms, not @aisp tags)
  #2  Remove RAW AISP from Expert panels
  #3  Add landing page hero statement
  #4  Build Resources tab

BATCH 2 (UI/UX — 2 hours):
  #5  Rename Main Banner → Hero
  #6  Rename Top Menu → Navigation Bar  
  #7  Fix nav bar toggles + add layout options
  #8  Fix onboarding preview images
  #9  Fix double scrollbar in More Sections
  #10 Fix panel toggle font cutoff

BATCH 3 (Chat + Listen — 1.5 hours):
  #11 Chat examples as button → dialog
  #12 Expand compound chat commands
  #13 Listen button to bottom
  #14 Listen demos as button → dialog

BATCH 4 (Marketing + Docs — 2 hours):
  #15 Update marketing pages with full content
  #16 Historical build review (deferred features doc)
  #17 Expanded JSON theme configs

BATCH 5 (Quality — 1 hour):
  Playwright tests for all fixes
  Full persona review
  Phase close protocol
```

**Total estimated: ~8.5 hours of swarm time**

---

## EXIT CRITERIA

Phase 14 is NOT closed until:
- [ ] AISP output validates at Platinum via `aisp_validate` + `aisp_tier`
- [ ] No `@aisp 2.0` format anywhere in the codebase
- [ ] Landing page has hero statement above animation
- [ ] Resources tab is live in EXPERT mode
- [ ] All section names are user-friendly (no "Main Banner" or "Top Menu")
- [ ] Onboarding page shows preview images for all examples
- [ ] No double scrollbars anywhere
- [ ] Chat and Listen have button → dialog pattern for examples
- [ ] Marketing pages have real content (not placeholder)
- [ ] `deferred-features.md` documents all planned-but-not-built items
- [ ] 95+ Playwright tests passing
- [ ] Persona scores: Agentic Engineer 80+, Grandma 55+, Capstone 85+