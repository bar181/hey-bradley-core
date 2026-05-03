# Hey Bradley — Phase 6 Close + Phase 7-8 Grounding

**Date:** April 3, 2026  
**Session Purpose:** Close Phase 6 remaining P1s, then transition to final demo polish  
**Score:** 71 (verified) → 78 (projected after Loop 1-3) → Target 80+

---

## 1. PHASE 6 STATUS: 48/54 DONE (89%)

### What's Complete
- ✅ Canned demo simulator with timed section reveals + typewriter captions
- ✅ 4 example websites (bakery, launchpad-ai, sarah-chen, greenleaf)
- ✅ Chat quick-demo buttons (4 examples, disabled during simulation)
- ✅ Listen "Watch a Demo" wired to simulator + orb burst sync
- ✅ Auto-switch to Builder tab on demo completion
- ✅ AISP Platinum spec generation (HUMAN + AISP views) with syntax highlighting
- ✅ Copy AISP Spec button in TopBar
- ✅ Section headings + accent bars on all 31 grid templates
- ✅ Scroll-triggered entrance animations (useScrollReveal + IntersectionObserver)
- ✅ Staggered card animations (100ms delay) across all card templates
- ✅ Micro-interactions (button hover/active, card shadows, tab crossfade)
- ✅ Neutral default text (no SaaS jargon)
- ✅ Cinematic 4-layer orb with burst growth animation
- ✅ Reduced-motion a11y compliance
- ✅ Left panel narrowed to 320px
- ✅ Dev tabs always visible (Specs highlighted)
- ✅ Vercel CI/CD deployed from main
- ✅ All 26 Playwright tests passing
- ✅ ADRs 026-028 written

### 6 Remaining Items

| # | Item | Severity | Effort | Action |
|---|------|----------|--------|--------|
| PC2 | HeroSplit responsive (`flex-col md:flex-row`) | P1 | 15 min | Fix — mobile hero stacking |
| PC3 | ImagePicker integration for Team editor | P1 | 30 min | Wire existing ImagePicker to Team member photos |
| PC4 | ImagePicker integration for Logo Cloud editor | P1 | 30 min | Wire existing ImagePicker to logo images |
| DP3 | Share button generates shareable preview URL | P1 | 1 hour | Copy preview-mode URL to clipboard (or show "coming soon" toast) |
| PC1 | ColumnsGlass ambient blob colors from theme | P2 | 30 min | Replace hardcoded purple/blue with theme accent via color-mix |
| — | Re-run 4-persona brutal review | — | 30 min | Score must reach 78+ to close Phase 6 |

**Total remaining effort: ~3 hours**

---

## 2. SWARM INSTRUCTIONS: CLOSE PHASE 6

**Step 1: Fix the 5 remaining items (in order).**

1. **HeroSplit responsive.** Add `flex-col md:flex-row` to HeroSplit.tsx. The split layout must stack vertically on mobile (text on top, image below). This is a 1-line CSS fix.

2. **ImagePicker for Team editor.** In `TeamSectionSimple.tsx`, replace the URL text input for member photos with the ImagePicker dialog trigger (same pattern as Hero image selector). Click thumbnail → ImagePicker opens → select → URL populates.

3. **ImagePicker for Logo Cloud editor.** Same pattern in `LogosSectionSimple.tsx`. Each logo should have a clickable thumbnail that opens ImagePicker.

4. **Share button.** Two options (pick the simpler one):
   - Option A: Copy current URL + `?preview=true` to clipboard. Show a toast "Link copied!" If preview mode is active, the URL already shows the clean preview.
   - Option B: Show a toast "Shareable links coming soon" — honest placeholder.
   
   **Recommend Option A** — it's functional even if basic.

5. **ColumnsGlass blob colors.** Replace `bg-purple-500/20`, `bg-blue-500/15`, `bg-indigo-500/10` with `color-mix(in srgb, ${accentPrimary} 20%, transparent)` derived from the theme palette.

**Step 2: Re-run the 4-persona brutal review.**

Run the same review format as the 71/100 scorecard. The review must assess:
- Agency Designer (visual quality, micro-interactions, animation variety)
- Grandma (usability, vocabulary, discoverability)
- Startup Founder (functionality, demo experience, output quality)
- Harvard Professor (architecture, innovation, demo resilience)

**Target: 78+ composite.** If below 75, identify top 3 fixes and do one more iteration.

**Step 3: Commit and close Phase 6.**

- Update `phase-6/living-checklist.md` with final status
- Write `phase-6/phase-6-review.md` retrospective
- Update implementation plan with Phase 6 dates and scores
- Tag the commit: `v0.6.0-phase6-complete`

---

## 3. PHASE 7-8 OVERVIEW (After Phase 6 Closes)

### Phase 7: Final Demo Polish

| Item | Details |
|------|---------|
| Welcome/splash page refinement | CTA always clickable, mobile responsive, jargon-free tagline |
| Demo presentation flow | Guided 15-minute sequence: Welcome → Theme select → Builder → Chat demo → Listen demo → Specs → "Questions?" |
| Light mode consistency pass | Verify all sections render correctly in light themes (Personal, Blog, Professional, Minimalist) |
| Font loading | Google Fonts properly loaded for all 5 font options |
| Edge case fixes | Empty states, error boundaries, 404 page |
| Final Playwright full suite | All smoke tests + visual regression + interaction flows |

### Phase 8: Capstone Presentation Prep

| Item | Details |
|------|---------|
| Presentation slides/script | 15-minute demo walkthrough with talking points |
| Vercel production deploy | Final clean deploy with og:image, meta tags |
| README with screenshots + demo link | GitHub repo presentation |
| Wiki page for capstone | Architecture overview, AISP innovation, tech stack |
| Backup plan | Offline mode (localStorage) in case of network issues during demo |

---

## 4. DEMO SEQUENCE (15 Minutes)

The capstone demo should follow this flow:

```
[0:00] WELCOME PAGE
"Hey Bradley is a platform where you describe a website and watch it build itself."
Show the splash page. Click "Start Building."

[1:00] THEME SELECTION  
"First, pick a style." Click SaaS theme. Navigate to builder.

[2:00] BUILDER MODE
"Here's a complete marketing site. 6 sections, all editable."
Click through sections in left panel. Show right panel editors.
Edit a headline. Toggle a component off. Show real-time preview.

[4:00] CHAT MODE
"But you don't have to click. You can just tell Bradley what you want."
Switch to Chat tab. Type "make it dark" → site goes dark.
Type "add questions" → FAQ section appears.
Type "headline Launch Your AI Product" → headline updates.

[6:00] LISTEN MODE (THE WOW MOMENT)
"And you don't even have to type."
Switch to Listen tab. Click "Watch a Demo."
Red orb pulses → typewriter captions → bakery website materializes.
"Bradley just built a complete bakery website from a voice description."

[8:00] THE OUTPUT
"But the real innovation isn't the visual. It's what Hey Bradley produces."
Click Specs tab. Show AISP specification.
"This is a complete, machine-readable specification that any AI coding agent
can use to reproduce this exact site. Not HTML — a spec."
Show HUMAN view. Show AISP view with Crystal Atom notation.
Click "Copy Spec" button.

[10:00] FULL PREVIEW
Click Preview mode. Show the full stacked website with navbar.
"This is what the client sees."
Toggle mobile view. "Responsive by default."

[11:00] VERSATILITY
"And it works for any kind of website."
Click "Try an Example" → Photography portfolio loads.
"Same builder, completely different site."

[12:00] ARCHITECTURE
"Under the hood, it's JSON-driven. Every change produces a JSON diff.
Theme switching replaces the entire JSON template.
The AISP spec is generated live from the JSON state."
Show Data tab briefly.

[13:00] WRAP-UP
"Hey Bradley sits between ideation and production.
You describe what you want. Bradley builds the spec.
Then Claude Code or any agentic system builds the production site."
Show the pipeline diagram.

[14:00] QUESTIONS
```

---

## 5. RULES REMINDER (for the swarm)

1. **No new features.** Polish only. Zero new section types or variants.
2. **Screenshot after every visual change.** Cardinal Sin #13.
3. **Harvard palette for builder chrome.** Crimson #A51C30. Dark: #2C2C2C panels. Light: #F7F5F2 panels.
4. **No developer jargon in user-facing UI.**
5. **All colors from 6-slot palette.** No hardcoded hex in templates.
6. **`prefers-reduced-motion` respected** on all animations.
7. **Run `npx tsc --noEmit && npx vite build`** before every commit.
8. **Right panel hides in Chat/Listen modes.**

---

*Phase 6 is 89% done. Close the remaining 5 items, re-score to 78+, then transition to Phase 7-8 for the final demo polish sprint. The capstone is won by a flawless 15-minute demo, not by more features.*