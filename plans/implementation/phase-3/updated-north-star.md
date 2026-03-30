# Hey Bradley — Updated North Star & POC Roadmap

**Version:** 4.0.0 | **Date:** March 30, 2026 | **Author:** Bradley Ross  
**Context:** Phase 2 is 5/7 complete. Pivoting to a focused POC → Canned Demo → Polish Demo strategy for capstone defense (May 2026).

---

## 1. VISION (Unchanged)

> **"A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes."**

**Pipeline:** Ideation → Hey Bradley → Specs + JSON → Claude Code / Agentic System → Production Site

**PMF:** Builder Mode + Listen Mode + Spec Documents (all three required)

---

## 2. THREE-STAGE PLAN

```
STAGE 1: POC (Phases 2-5, ~4-5 days)
  └── Grandma-proof builder mode
  └── 8 sections in SIMPLE tab
  └── JSON templates as ground truth
  └── Full-page preview, onboarding, section CRUD
  └── Everything click/edit → JSON → preview works

STAGE 2: CANNED DEMO MODE (Phases 6-7, ~2 days)
  └── 3-5 pre-built example websites as clickable buttons
  └── Simulated chat input (type → canned JSON response → site updates)
  └── Simulated listen mode (click → red orb → typewriter → canned JSON → site builds)
  └── XAI Docs generating specs from JSON
  └── Workflow pipeline showing simulated steps

STAGE 3: POLISH DEMO (Phase 8, ~1-2 days)
  └── Home page / splash page
  └── Smooth transitions between modes
  └── Capstone presentation flow (guided walkthrough)
  └── Final UI/UX polish pass
  └── Deploy to Vercel as hey-bradley.vercel.app
```

**Target: ~1 week from Phase 2 close to presentable demo.**

---

## 3. POC PHASES (Stage 1)

### Phase 2: System Polish + Sections (CLOSING NOW)

**Status:** 5/7 sub-phases done. Close with minimal remaining work.

**To close Phase 2:**
1. Fix `addSection()` defaults — pull section template from current theme JSON, not empty `{}`
2. Add `data-testid` attributes to all editor inputs and toggles (unblocks Playwright)
3. Run smoke Playwright tests (theme switch, section CRUD, basic rendering)
4. Fix 3 P0 a11y issues (unnamed buttons, chat input aria-label, focus indicators)
5. Commit and close

**Deferred from Phase 2 to Phase 3:**
- Media pickers (URL inputs work)
- Second variants per section
- Full Playwright suite
- Font cascade fix
- Light mode preview contrast

### Phase 3: Onboarding + Full-Page Preview + Builder UX

**Goal:** A user lands on Hey Bradley, picks a theme, sees a full multi-section website, and can customize it.

| Deliverable | Details |
|-------------|---------|
| Onboarding page | `/` route with 10 theme cards. Click → navigates to `/builder` with theme applied. "Start from scratch" option. |
| Navbar section | Navigation bar renderer (logo + links). Needed for full-page preview to look like a real website. |
| Full-page preview | Toggle in TopBar hides left + right panels. Shows all enabled sections stacked as a complete page with navbar. |
| Section variants | 2nd variant per section (FeaturesCards, CTASplit, FAQTwoCol, etc.). Selectable in SIMPLE tab Layout accordion. |
| Drag-and-drop reorder | @dnd-kit integration for section reordering in left panel. |
| addSection() with theme defaults | New sections inherit sample content from theme JSON. |

**DoD:**
```
- [ ] Onboarding page with 10 theme cards navigates to builder
- [ ] Full-page preview mode shows complete multi-section site
- [ ] Navbar renders at top of preview
- [ ] At least 2 variants per section type selectable
- [ ] Drag-and-drop section reorder works
- [ ] New sections have theme-aware sample content
```

### Phase 4: JSON Templates Finalization

**Goal:** All JSON is clean, validated, and organized. The JSON folder structure becomes the seed data for a future database.

| Deliverable | Details |
|-------------|---------|
| Master template JSON | `src/data/template-config.json` — all possible options for all section types, fully documented |
| Per-section templates | `src/data/sections/{type}/template.json` — default content + all component options per section type |
| Constraints/options JSON | `src/data/options/` — available image URLs, video URLs, font options, color palette options, icon options |
| Theme JSON audit | All 10 theme files validated, consistent structure, no stale fields |
| Project JSON schema | Zod schema for the project JSON that gets saved/loaded. Validation on load. |
| JSON documentation | `src/data/README.md` updated with complete hierarchy explanation |

**DoD:**
```
- [ ] template-config.json has every possible key for every section type
- [ ] Per-section templates exist with sample content
- [ ] Options JSONs exist (images, videos, fonts, palettes, icons)
- [ ] All 10 theme JSONs pass Zod validation
- [ ] Project JSON saves/loads correctly from localStorage
- [ ] README documents the complete JSON hierarchy
```

### Phase 5: Tailwind/shadcn Cleanup + Polish

**Goal:** Eliminate all custom CSS. Every component uses Tailwind utilities and shadcn primitives. No inline styles except for dynamic values (gradient URLs, background images).

| Deliverable | Details |
|-------------|---------|
| Tailwind audit | Replace all inline `style={{}}` with Tailwind classes where possible |
| shadcn component audit | Replace any custom inputs/toggles/buttons with shadcn equivalents |
| Theme color mapping | JSON palette slots → CSS variables → Tailwind classes (documented pattern) |
| Google Fonts loading | Dynamic font loading from fonts.json URLs |
| Responsive polish | All sections look good at mobile (375px), tablet (768px), desktop (1280px) |
| a11y fixes | P0 + P1 accessibility issues from audit |

**DoD:**
```
- [ ] Zero custom .css files (Tailwind only)
- [ ] Zero inline style={{}} except gradients and background images
- [ ] All interactive elements use shadcn components
- [ ] Google Fonts load correctly for all 5 font options
- [ ] Responsive preview looks good at all 3 breakpoints
- [ ] P0 accessibility issues resolved
```

---

## 4. CANNED DEMO MODE (Stage 2)

### Phase 6: Example Websites + Simulated Chat

**Goal:** Pre-built example websites that demonstrate the full pipeline without needing a real LLM.

| Deliverable | Details |
|-------------|---------|
| 3-5 example website JSONs | Complete project configs with real copy, real images, matching themes. Examples: "Sweet Spot Bakery" (Wellness theme), "LaunchPad AI" (SaaS theme), "Sarah Chen Photography" (Portfolio theme), "GreenLeaf Consulting" (Professional theme). |
| Example buttons | In onboarding page or TopBar: "Try an Example" dropdown with 3-5 options. Click → loads the pre-built JSON → site appears fully built. |
| Simulated chat | Chat input accepts text. On send: show "Processing..." → wait 1.5s → apply a canned JSON patch that matches the input (keyword matching). Example: type "make it dark" → applies dark palette. Type "add testimonials" → enables testimonials section. |
| Chat history | Messages appear in a chat-like UI below the input. Shows user message → "Bradley" response → applied changes. |

**DoD:**
```
- [ ] 3-5 example websites loadable via buttons
- [ ] Each example has unique copy, images, and theme
- [ ] Chat input produces visible changes via canned JSON patches
- [ ] At least 5 canned chat commands work (dark mode, add section, change headline, etc.)
- [ ] Chat history shows message flow
```

### Phase 7: Simulated Listen Mode + XAI Docs

**Goal:** The listen/voice experience is simulated convincingly. XAI Docs generate real specs from JSON.

| Deliverable | Details |
|-------------|---------|
| Listen mode simulation | Toggle Listen → red orb appears → click "Start Listening" → typewriter text: "Parsing intent... Generating bakery website... Applying Warm theme..." → canned JSON loads → site appears. The entire sequence is scripted. No actual STT or LLM. |
| Workflow pipeline animation | While listen simulation runs, Workflow tab lights up sequentially: Voice Capture ✓ → Intent Parsing ✓ → AISP Generation ✓ → Schema Validation (spinning) → Reality Render → Edge Deploy. Timed to match the typewriter. |
| XAI Docs live | HUMAN view generates structured spec from current JSON (sections listed, copy included, layout described). AISP view generates `@aisp` formatted output. Both update when JSON changes. |
| Copy/export on XAI Docs | Copy to clipboard + Export buttons work on both HUMAN and AISP views. |

**DoD:**
```
- [ ] Listen mode simulation runs a convincing 10-15 second sequence
- [ ] Red orb + typewriter + site appears = "wow" moment
- [ ] Workflow pipeline animates in sync with listen simulation
- [ ] XAI Docs HUMAN view shows real spec from JSON
- [ ] XAI Docs AISP view shows @aisp formatted spec
- [ ] Copy/export work on both views
```

---

## 5. POLISH DEMO (Stage 3)

### Phase 8: Home Page + Presentation Flow + Deploy

**Goal:** A polished, deployable demo that can be walked through in a 15-minute capstone presentation.

| Deliverable | Details |
|-------------|---------|
| Home page | Marketing-style landing page for Hey Bradley itself. Headline, feature highlights, "Try It Now" CTA → navigates to builder. |
| Presentation flow | A guided sequence: Home → Onboarding → Pick theme → Edit hero → Toggle sections → Show Data Tab → Show XAI Docs → Show Listen simulation → Show Workflow → "Questions?" |
| Final UI polish | Typography consistency, spacing audit, animation smoothness, loading states, empty states. |
| Vercel deploy | Production build at hey-bradley.vercel.app. Og:image, meta tags, favicon. |
| README update | Screenshots, demo link, architecture overview, capstone context. |

**DoD:**
```
- [ ] Home page renders with professional marketing quality
- [ ] 15-minute demo walkthrough works without bugs
- [ ] Deployed to Vercel and accessible via URL
- [ ] README has screenshots and demo link
- [ ] Zero P0 visual/functional issues
```

---

## 6. POST-POC ROADMAP (After Capstone)

| Phase | Focus | Notes |
|-------|-------|-------|
| 9 | Right panel JSON-driven | Controls generated from JSON schemas, not hardcoded React components |
| 10 | SQLite local database | Migration files, seed data from JSON templates, replace localStorage |
| 11 | Real LLM integration | Chat input → Claude API → JSON patches. Listen mode → Whisper → Claude → patches. |
| 12 | Expert mode | Expert tab for all sections, AISP viewer, advanced controls |
| 13 | Supabase + Auth | Login, user projects, cloud persistence |
| 14+ | Marketplace, API, enterprise | White label, templates marketplace, API access |

---

## 7. DECISIONS (Answers to Swarm's 8 Questions)

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Media Pickers | **Defer to Phase 3** | URL inputs work. Don't block Phase 2 close. |
| 2 | Playwright scope | **Smoke tests for Phase 2 close** | Theme switch, CRUD, basic rendering. Full suite Phase 3. |
| 3 | Second variants | **Phase 3** | One variant per section sufficient for Phase 2. |
| 4 | addSection() defaults | **Inherit from current theme** | Pull section template from active theme JSON. If theme doesn't have that section type, use generic template with sample content. |
| 5 | Harvard crimson chrome | **Keep for capstone** | Distinctive, ties to academic context. Configurable post-capstone. |
| 6 | Expert tab | **Keep visible with palette + font only** | Shows depth without overwhelming grandma. Hide empty accordions. |
| 7 | Navbar section | **Phase 3** | Essential for full-page preview. |
| 8 | Editor inputs not found | **Add `data-testid` to all inputs + toggles** | This is a P0 fix. Playwright can't test what it can't find. |
| 9 | SQLite database | **Defer to post-presentation** | JSON files until after capstone. Migration files can be created alongside JSON templates for future use. |

---

## 8. SWARM INSTRUCTIONS: CLOSE PHASE 2

**Paste to swarm (<200 words):**

Close Phase 2 with these 5 items, then stop:

1. **Fix addSection() defaults.** When user clicks "Add Section" → pick a type → the new section must have real sample content from the current theme's JSON for that section type. If the current theme doesn't include that section, use a generic template with placeholder copy ("Your Feature Title", "Your testimonial here", etc.). No more empty dark boxes.

2. **Add `data-testid` attributes** to every editor input (headline, subtitle, CTA text, badge text) and every toggle switch in all 8 section SIMPLE editors. Pattern: `data-testid="hero-headline-input"`, `data-testid="features-toggle-enabled"`. This unblocks Playwright.

3. **Smoke Playwright tests.** Write 5 tests: theme switch changes preview, addSection creates visible section, removeSection removes it, edit headline updates preview, toggle component hides it. Use `data-testid` selectors.

4. **Fix 3 P0 a11y issues.** Add `aria-label` to chat input, name the 3 unnamed buttons, add visible focus indicators on the 2 buttons missing them.

5. **Commit, update implementation plan, mark Phase 2 complete.** Write Phase 2 retrospective. Then STOP and request human review before Phase 3.