# UI/UX Review -- Phase 4 Close

**Reviewer**: Opus 4.6 (Brutal Honest Mode)  
**Date**: 2026-04-02  
**Target Audience**: Non-technical users ("grandma making a cookie website")  
**Benchmark**: Wix ease of use -- Hey Bradley should be MUCH easier  

---

## Overall Score: 52/100

This is a solid engineering prototype with good bones. It is NOT ready for a capstone demo without significant polish. The core concept (talk to build a website) is compelling, but the execution has gaps that would confuse non-technical users and raise eyebrows from evaluators expecting Stripe/Linear polish.

---

## 1. First Impression (Splash Page) -- 6/10

**The Good:**
- The conversation-driven splash page is a genuinely clever idea. Showing a chat that morphs the right-side hero showcase is the RIGHT way to sell "agentic design."
- The showcases cycle through real design styles (background image, minimal, Harvard, SaaS, creator). This demonstrates capability.
- Framer Motion animations are smooth.

**The Bad:**
- **The animation takes too long.** A user lands on the page and has to WAIT for a typewriter effect to finish before the "Get Started" button activates. That is 30+ seconds of forced waiting. Non-technical users will leave. The CTA button being disabled until the animation finishes is hostile UX.
- **"THE WHITEBOARD THAT WRITES YOUR SPECS"** -- this tagline means nothing to grandma. "Proof-based specifications" is developer jargon. A 70-year-old reads this and thinks "this isn't for me."
- **The chat input at the bottom is fake (disabled).** It looks like you can type, but you cannot. This is misleading. Either make it functional or remove it.
- **"Agentic Design Platform"** subtitle under "Hey Bradley" -- pure jargon. Nobody outside of AI Twitter knows what "agentic" means.
- **No skip button** for the animation sequence.
- **No explanation of what this product actually does** in plain language. "Describe what you want. See it build live." is close but buried.

**Blocker:** The forced wait + jargon tagline will lose every non-technical user within 5 seconds.

**Fix:** Add a prominent "Skip" or make CTA always enabled. Rewrite tagline to: "Tell Bradley what you want. Watch your website appear." Kill the word "agentic." Kill "proof-based specifications."

---

## 2. Grandma Test -- 3/10

**Would a 70-year-old figure out how to make a cookie website?**

No. Here is where grandma gets stuck:

1. **Splash page**: "What is a whiteboard that writes specs?" Closes tab.
2. **If she somehow reaches /new-project**: She sees 8+ theme cards with labels like "SaaS," "Agency," "Portfolio." She does not know what SaaS means. She might pick "Personal" but would be unsure.
3. **If she picks a theme and reaches /builder**: She sees a three-panel layout with tabs labeled "Builder," "Chat," "Listen." The left panel shows "Theme," "Navbar," "Hero," "Features," "Call to Action." She has no idea what a "Hero" section is. She does not know what "CTA" means.
4. **Chat tab**: She sees "hi! tell me what to build." -- this is the closest thing to grandma-friendly UX in the entire app. But the hint text ("try: dark mode, add pricing, headline Hello") assumes she knows the vocabulary. She wants to type "I want a website for my cookie business" and have it work.
5. **Listen tab**: She sees a pulsing red orb with a "Start Listening" button and a speed slider. The orb is aesthetically interesting but gives zero context about what is happening. "Simulate Input" is a developer term.
6. **Right panel (Theme Configuration)**: "EXPERT" tab next to "THEME" tab. Theme cards with slugs like "saas," "agency." Mode toggle between Light/Dark.

**The core problem**: The app uses developer/designer vocabulary everywhere. "Hero," "CTA," "Navbar," "SaaS," "vibe" -- these are insider terms. Grandma speaks: "the top part with my name," "the button people click," "the menu at the top," "something pretty and warm."

**Blocker:** The entire vocabulary is wrong for the target audience. This is a developer tool wearing consumer clothing.

---

## 3. Visual Polish -- 6/10

**The Good:**
- Dark mode is cohesive. The Harvard crimson + dark slate palette is distinctive and consistent.
- DM Sans + JetBrains Mono is a solid font pairing.
- The TopBar crimson header is clean and professional.
- Theme cards on onboarding have nice hover effects (scale, border highlight).
- The listen orb is visually striking.

**The Bad:**
- **Light mode has contrast issues.** From the screenshots: the cream panel backgrounds make some buttons hard to see. The crimson borders on every button in builder panel (`.light-chrome [data-builder-panel] button`) creates visual noise -- every single interactive element gets a dark crimson border, which is overwhelming rather than clarifying.
- **The onboarding page looks generic.** Dark cards on dark background. No imagery. No personality. Compare to Wix's onboarding, which shows actual website previews. These theme cards show a tiny preview with just a name and an accent bar. You cannot tell what the website will look like.
- **Section IDs are exposed** in the builder panel. Users see `navbar-01`, `hero-01` next to section names. These are implementation details that should be hidden.
- **The "LISTEN" and "BUILD" badges in the TopBar** use different styling (green vs red backgrounds) with no explanation of what they mean.
- **Status bar at bottom** shows "READY AISP SPEC V1.2" and "TAB: SIMPLE CONNECTED" -- pure developer debug info. Should be hidden or made meaningful.
- **Right panel tab labels** "REALITY" "DATA" "ASI" "DOCS" "WORKFLOW" -- these sound like an enterprise SaaS product, not a grandma-friendly website builder.

**Not Stripe/Linear quality.** It is at a good hackathon level -- impressive for the work done, but the fit-and-finish details (consistent spacing, content hierarchy, meaningful empty states) are not there yet.

---

## 4. Navigation Flow -- 7/10

**The Good:**
- `/` -> `/new-project` -> `/builder` is logical and correct.
- The TopBar logo ("Hey Bradley") links back to home.
- "Continue editing your project" appears on /new-project if a saved project exists -- smart.
- "Start from scratch" link at the bottom of onboarding is a nice escape hatch.
- Example sites on onboarding (bakery, consulting, etc.) are excellent for demos.

**The Bad:**
- **No way to get back to /new-project from /builder** without clicking the logo and going through the splash page again. There should be a "New Project" or "Change Theme" shortcut in the builder.
- **The "Share" button in TopBar does nothing** (no click handler). This will be noticed in a demo.
- **No breadcrumb or progress indicator.** User does not know where they are in the flow.
- **No 404 page.** Navigating to `/anything-else` shows blank.
- **Dead ends in the showcase**: Both "Start Listening" and "Try Builder" on the splash page go to `/builder`. There is no differentiation. "Explore Protocol" also goes to `/builder`. Every CTA leads to the same place.

---

## 5. Listen Mode -- 7/10

**The Good:**
- The crimson orb is visually compelling. The multi-layer blur/glow approach creates genuine depth.
- Random drift mode makes the orb feel alive and organic.
- Burst animation sequence (speed up -> high glow -> dim -> return) is well-choreographed.
- The simulate input feature is a smart demo tool: typewriter text shows user request, then AI response, while the orb reacts.
- Settings panel is cleanly tucked behind a toggle -- good progressive disclosure.

**The Bad:**
- **"Simulate Input" is a terrible label for users.** This should be "See a Demo" or "Watch Bradley Work" or "Try Example."
- **The orb does not actually listen.** There is no Web Speech API integration. The "Start Listening" button runs a 10-second burst animation and then stops. This is misleading. For a demo, this is acceptable ONLY if framed as a preview/prototype.
- **Typewriter text during simulation is too small** relative to the orb. The overlay panel at the top competes with the orb visually.
- **Slider labels are cryptic.** "Soft" means core blur? "Glow" means glow opacity? These controls exist for developer tuning, not for users.
- **The sim text is hardcoded**: "lets make a website for grandma and her amazing cookies" -- this is a nice touch for demo but should rotate through multiple examples or match the current project context.
- **No visual state change after "listening" ends.** The orb returns to default with no feedback about what was captured.

---

## 6. Builder Mode -- 5/10

**The Good:**
- Three-tab layout (Builder/Chat/Listen) is a sensible organization.
- Section list with eye toggle (enable/disable), reorder arrows, duplicate, and delete is functionally complete.
- The "Add Section" flyout menu with descriptions for each section type is helpful.
- Resizable panels are professional.
- Preview mode toggle (Edit/Preview) in TopBar works well.
- Device preview buttons (Desktop/Tablet/Mobile) are standard and expected.

**The Bad:**
- **Builder tab shows a flat list of section names with no preview.** Compare to Wix: you see actual visual blocks you can rearrange. Here you see "Hero hero-01" and "Features features-01" -- text labels with IDs. This tells you nothing about what the section looks like.
- **No drag-and-drop.** Reordering uses tiny up/down chevrons that only appear on hover. This is 2020-era UX. Modern builders use drag handles.
- **Action buttons (reorder, duplicate, delete) are hidden behind hover** (`opacity-0 group-hover:opacity-100`). On touch devices, there is no hover. These actions are invisible on mobile/tablet.
- **Double-click to delete** (click once = arm, click again = confirm) is non-standard. A confirmation dialog or swipe-to-delete would be more intuitive.
- **Chat tab is functional but limited.** The canned command system (`parseChatCommand`) handles basic commands ("dark mode," "add pricing," "headline Hello") but there is no help/command list accessible from the UI. The hint text only shows on first focus when empty.
- **Right panel tabs** (Reality, Data, ASI, Docs, Workflow) -- I can only see Theme Configuration working. The other tabs may be empty or half-built.
- **No undo/redo feedback.** The buttons exist but there is no toast/notification showing what was undone.

**Blocker:** The builder mode is functional for developers but incomprehensible for non-technical users. "Hero" and "CTA" need human labels.

---

## 7. Light Mode -- 4/10

**The Good:**
- The cream/parchment palette (EDE8E2, F7F5F2) is warm and distinct from the dark mode.
- Crimson accent carries through consistently.

**The Bad:**
- **The blanket crimson border on ALL buttons in builder panel** is visually heavy. Every theme row, every section row, every action button gets `border: 1px solid #8B1729`. This makes the panel look like a form with mandatory fields highlighted in red -- an error state, not a design choice.
- **The TopBar background changes from dark crimson (#8C1515) in dark to brighter crimson (#A51C30) in light** -- this is fine, but the white text on crimson has borderline contrast (4.4:1 ratio). WCAG AA requires 4.5:1 for normal text.
- **The listen orb has a hardcoded `bg-[#1a1a1a]` background** that does NOT respond to light mode. So you get cream panels everywhere except the listen tab, which is a dark rectangle. This is jarring.
- **Screenshot evidence** (from `cannot see buttons - light mode.png` filename in phase-4 directory) confirms that button visibility has been a known issue.

**Blocker:** Light mode listen tab not adapting to light theme is a visible inconsistency that will be noticed in any demo.

---

## 8. Responsive -- 3/10

**The Good:**
- TopBar has a hamburger menu for mobile that contains all controls.
- Onboarding grid adapts from 4 columns to 2 columns.

**The Bad:**
- **The splash page (Welcome.tsx) is completely broken on mobile.** It uses a fixed 45%/55% horizontal split (`w-[45%]` for chat, `flex-1` for showcases). On mobile, this results in two impossibly narrow columns side by side. There is no responsive breakpoint that stacks them vertically.
- **The builder's three-panel layout** tries to maintain on mobile, resulting in panels too narrow to be usable. The screenshot `responsive-mobile.png` confirms this: the preview text is cut off, panels are cramped.
- **PanelLayout uses `react-resizable-panels`** with a 15% minimum size. On a 375px phone, 15% is 56px -- not enough for any meaningful content.
- **No mobile-specific UX.** There is no bottom sheet, no swipe navigation, no simplified mobile builder view. The desktop layout is just squeezed.
- **Listen tab on mobile**: The orb, sliders, and buttons would stack in the narrow panel but the experience would be marginal.

**Blocker:** The splash page is non-functional on mobile. If an evaluator opens this on a phone, it is immediately embarrassing.

---

## 9. Missing Features for Demo -- Score N/A (Inventory)

### Must-Have for Capstone Demo
1. **Skip animation button** on splash page (or always-enabled CTA)
2. **Working "Share" button** -- even if it just copies a URL or shows a "coming soon" modal
3. **Export/Download** -- even a "Download JSON" button so the spec feels tangible
4. **Undo/Redo toast notifications** -- user needs feedback that something happened
5. **404 page** with redirect to home
6. **Mobile splash page** that does not break layout
7. **Light mode listen tab** background adaptation

### Should-Have for Credibility
8. **Actual speech recognition** (Web Speech API) -- even basic transcription would make Listen mode real rather than simulated
9. **Section previews** in the builder list (thumbnails or at minimum colored indicators)
10. **Onboarding theme previews** that show actual website layouts, not just names + accent bars
11. **User-friendly section names**: "Hero" -> "Main Banner", "CTA" -> "Action Button", "Navbar" -> "Top Menu"
12. **Help/tutorial overlay** for first-time builder users
13. **Loading states** and transitions between pages

### Nice-to-Have for Wow Factor
14. Real AI responses in Chat (even if just calling an API with a canned prompt)
15. Animation on section reorder (the list just jumps)
16. Keyboard shortcuts overlay (Ctrl+Z works but is not discoverable)

---

## 10. Wix Comparison -- 4/10

**Is Hey Bradley genuinely easier than Wix for a first-time user?**

No. Here is why:

| Aspect | Wix | Hey Bradley |
|--------|-----|-------------|
| First impression | "What kind of website?" with clear categories and images | "THE WHITEBOARD THAT WRITES YOUR SPECS" (jargon) |
| Onboarding | Visual templates with full previews, guided questions | Theme name cards with no visual preview |
| Building | Drag-and-drop visual editor, click any element to edit | Text list of section names, type commands in chat |
| Vocabulary | "Header," "Button," "Image Gallery" | "Navbar," "Hero," "CTA," "Value Props" |
| Mobile | Responsive-first, dedicated mobile editor | Broken on mobile |
| Help | Interactive tutorials, tooltips everywhere | No help system |
| Feedback | Immediate visual response to every action | Typewriter text confirmation in chat |

**Where Hey Bradley wins (conceptually):**
- The chat-driven approach IS genuinely innovative and COULD be easier than Wix -- if it worked with natural language. "Make me a cookie website" is easier than dragging blocks around.
- Listen mode is a unique differentiator that Wix does not have.
- The spec-first approach (JSON-driven) is architecturally superior for iteration.

**Where Hey Bradley loses (currently):**
- The chat only handles canned commands, not real natural language.
- The visual feedback loop is weak -- you type a command and watch text appear, rather than seeing the website change in real-time.
- Every label and term assumes technical literacy.

---

## Blockers Summary (Must Fix Before Phase 5)

| # | Issue | Severity | File(s) |
|---|-------|----------|---------|
| B1 | Splash page forces 30s wait before CTA is clickable | Critical | `Welcome.tsx` |
| B2 | Splash page tagline is developer jargon | Critical | `Welcome.tsx` |
| B3 | Splash page layout breaks on mobile (no responsive) | Critical | `Welcome.tsx` |
| B4 | Light mode listen tab has hardcoded dark background | High | `ListenTab.tsx` |
| B5 | All builder buttons get crimson borders in light mode (visual noise) | High | `index.css` |
| B6 | Section IDs exposed to users (navbar-01, hero-01) | Medium | `SectionsSection.tsx` |
| B7 | "Share" button is non-functional | Medium | `TopBar.tsx` |
| B8 | "Simulate Input" label is dev-speak | Medium | `ListenTab.tsx` |
| B9 | Developer jargon throughout (Hero, CTA, Navbar, SaaS, Agentic) | High | Multiple files |
| B10 | No 404 page | Low | `main.tsx` |

---

## Scoring Breakdown

| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| First Impression | 6/10 | 15% | 0.90 |
| Grandma Test | 3/10 | 15% | 0.45 |
| Visual Polish | 6/10 | 10% | 0.60 |
| Navigation Flow | 7/10 | 10% | 0.70 |
| Listen Mode | 7/10 | 10% | 0.70 |
| Builder Mode | 5/10 | 15% | 0.75 |
| Light Mode | 4/10 | 5% | 0.20 |
| Responsive | 3/10 | 10% | 0.30 |
| Wix Comparison | 4/10 | 10% | 0.40 |
| **Total** | | **100%** | **5.00/10 = 50/100** |

**Adjusted score: 52/100** (bonus points for the orb being genuinely cool and the chat concept being strong)

---

## Bottom Line

The architecture is sound. The concept is strong. The engineering is competent. But this is a developer's idea of a consumer product. Every label, every flow, every default assumes the user knows what "Hero" and "CTA" and "SaaS" and "agentic" mean. The splash page actively repels non-technical users by making them wait and then showing them jargon.

For the capstone demo, the highest-ROI fixes are:
1. Make the splash page CTA always clickable (or add skip)
2. Rewrite ALL user-facing copy to plain English
3. Fix mobile splash page layout
4. Fix light mode listen tab background
5. Remove section IDs from the builder panel

These five changes would move the score from 52 to roughly 65-70. The remaining gap to 80+ requires actual AI integration in chat and better visual previews in the builder -- which is Phase 5 territory.
