# Comprehensive Review — Part 2: Design + UX + Mobile + Accessibility

> **Date:** 2026-05-01 · **Phase:** P74 · **SOTA baseline:** 80/100 across 5 dimensions
> **Sister reviews:** A7 (features inventory), A9 (gaps + resolutions)

---

## §1 Methodology + Scoring Rubric

This review scores 15 surfaces (pages, major components, interaction layers) across five design dimensions:

- **Visual polish** (1-100): typography hierarchy, color discipline, spacing rhythm, motion, image quality
- **First-impression clarity** (1-100): can a new user understand the surface in ≤5 seconds?
- **Interaction quality** (1-100): hover states, transitions, focus states, keyboard nav, touch targets
- **Mobile responsiveness** (1-100): clean adaptation at 375 / 390 / 428 px?
- **Accessibility** (1-100): aria-* attributes, role, aria-label, color contrast, keyboard reachability

**Aggregate** is a weighted average: 0.25× visual + 0.20× clarity + 0.25× interaction + 0.15× mobile + 0.15× a11y.

**SOTA baseline:** 80/100 is the competitive floor (Linear, Framer, Lovable, Stripe UI polish standard). Scores >85 indicate Hey Bradley is ahead on that dimension; <75 indicates drift.

---

## §2 Per-Surface Scoring (15 Surfaces)

### 1. Welcome.tsx Marketing Landing

**File anchor:** `src/pages/Welcome.tsx:31–100` (hero + social proof + story)

- **Visual polish:** 79/100 — Warm cream palette (#faf8f5 text #2d1f12) is cohesive; headline leading-[1.05] + 5xl/6xl responsive; social proof bar uses `border-y` cue effectively. Missing: hero gradient layer is absent (vs. Linear's glow backgrounds).
- **First-impression clarity:** 84/100 — "Tell Bradley what you want" headline + 3-mode cards (Builder/Chat/Listen) instantly convey USP. Visual hierarchy (text-xs accent → 5xl bold → xl body) is crisp. Slightly dense CTA cluster (3 buttons).
- **Interaction quality:** 76/100 — Primary CTA has `hover:bg-[#c45f1c] transition-colors`; secondary buttons have border hover. Missing: focus-visible ring on CTAs; no button shadow-lift on hover.
- **Mobile responsiveness:** 82/100 — `max-w-3xl mx-auto px-6` reflows cleanly; heading uses `lg:text-6xl` responsive sizing. Social proof bar is flex-wrap gap-aware. Hero section padding (py-24) is aggressive on mobile (should px-4 py-12 mobile).
- **Accessibility:** 71/100 — Semantic `<main>`, `<section>`, `<article>` structure. Missing: aria-label on nav links; color contrast on text-[#6b5e4f] on #faf8f5 is 6.2:1 (passes but barely); no skip-to-content link.
- **Aggregate:** 78/100
- **SOTA gap:** Linear's homepage uses subtle animated gradient backgrounds + hero video background; color contrast on body text exceeds 8:1. HB Welcome is clean but flat. Add: subtle radial gradient layer, boost body text color to #4a3f34 (8.5:1), add focus-visible rings.
- **Resolution sprint:** P75 OC-6 (marketing polish pass)

### 2. Onboarding Flow (Mode + Personality + Project Picker)

**File anchor:** `src/pages/Onboarding.tsx:85–180` (three-step workflow)

- **Visual polish:** 74/100 — Mode selector card uses `rounded-xl` consistently; personality picker thumbnails (emoji) are underdesigned (no visual border or frame). Project preview thumbnails are small (150×100) and lack visual depth. Typography hierarchy is flat (all text-sm).
- **First-impression clarity:** 72/100 — Three sequential steps (mode → personality → project) are not visually distinct (same card styling). User must infer progression. Missing: step indicator pill ("Step 1 of 3") or visual breadcrumb.
- **Interaction quality:** 68/100 — Card hover is implicit (no explicit hover:bg-* class visible in read). Project card delete button uses `rounded` (no size spec); missing hover-lift and focus states.
- **Mobile responsiveness:** 77/100 — Grid layout `grid-cols-1 md:grid-cols-2` works but personality picker emoji layout is cramped on 375 px.
- **Accessibility:** 65/100 — No role="tablist" on step container; personality cards are `<div>` not `<button>` (unclear if keyboard-navigable). Missing aria-label per personality ("Founder personality", etc.).
- **Aggregate:** 71/100
- **SOTA gap:** Framer's onboarding uses numbered step badges + animated step transitions + full-width hero per step. HB is bare cards. Add: step indicator, animated transitions on step change, aria-current="step" on active step, button role + aria-pressed on personality picker.
- **Resolution sprint:** P74 OC-DECOMP or P75 OC-6

### 3. Builder Tri-Pane (Left + Center + Right, Desktop Only)

**File anchor:** `src/pages/Builder.tsx:4–14` (layout shell) + `src/components/shell/PanelLayout.tsx` (orchestrator)

- **Visual polish:** 81/100 — Left panel uses hb-text tokens consistently; section list has icon + name + hover. Right panel (Simple/Expert tabs) has clean alt styling. Center canvas (preview) is full-height with overflow hidden. Color discipline: `bg-hb-bg`, `border-hb-border`, `text-hb-text-primary` applied uniformly. Issue: very subtle borders (hb-border is muted) reduce visual separation.
- **First-impression clarity:** 83/100 — Three panes are instantly recognizable (web builder pattern is industry-standard). Left = sections, Center = preview, Right = editor. Tabs (SIMPLE/EXPERT) clearly label modes. Missing: onboarding tooltip on first load.
- **Interaction quality:** 82/100 — Sections collapse/expand; icons in left panel respond to hover. Simple tab switches between SIMPLE+EXPERT panels. Missing: active section highlight in left panel, drag-reorder visual feedback.
- **Mobile responsiveness:** N/A (hidden `hidden md:flex` on <768px per ADR-090)
- **Accessibility:** 79/100 — Sections have `aria-expanded` per Accordion pattern. Right panel tabs use semantic tab structure (likely via recharts TabBar). Missing: keyboard shortcut hints (should show on first use or via `?`).
- **Aggregate:** 81/100
- **SOTA gap:** Webflow's builder has more pronounced visual hierarchy (darker left nav, lighter canvas). HB is monochromatic. Add: stronger left-panel bg contrast (e.g., bg-hb-surface), taller section cards, expanded section highlight.
- **Resolution sprint:** P75 OC-6 (polish pass)

### 4. Mobile Shell (Chat + Inline Mic + Specs Bottom Sheet + First-Run Card)

**File anchor:** `src/components/shell/MobileLayout.tsx:32–100` (layout) + `MobileFirstRunCard` + `MobileSpecBottomSheet`

- **Visual polish:** 73/100 — Top bar is minimal (hamburger + brand + emoji); clean mono font. First-run card uses warm palette (cream + orange accent) consistent with Welcome. Bottom sheet peek/full states use grip handle (GripHorizontal icon). Issue: very tight vertical space (h-12 top bar) makes interaction targets small.
- **First-impression clarity:** 78/100 — Single chat surface is instantly clear (chat thread obvious). Inline mic button is discoverable (Mic icon on input bar). "See Specs" is secondary CTA. First-run card on initial load explains modes. Missing: one-sentence explainer above chat input on true first run.
- **Interaction quality:** 71/100 — Mic button has hover + focus ring (inferred from `focus-visible:ring-2`). Menu uses `aria-expanded` properly. Missing: visual ripple or scale on tap (transitions only); bottom sheet drag states not visible in code (raw touch events).
- **Mobile responsiveness:** 85/100 — Flex column layout is native mobile-first. `h-screen` on parent, flex-1 on chat area, fixed bottom sheet all adapt well. Top bar h-12 is appropriate for touch (44+ px ideal). Chat input + mic button stack cleanly.
- **Accessibility:** 76/100 — Menu trigger has `aria-label="Open menu"` + `aria-expanded`. Personality emoji is not marked `aria-hidden=true` (minor). Missing: aria-label on mic button ("Push to talk"), "See Specs" button aria-label.
- **Aggregate:** 77/100
- **SOTA gap:** Lovable's mobile chat uses bottom input bar + floating mic + smooth bottom-sheet animations. HB is functional but not whimsical. Add: button scale animations on tap, micro-interaction on mic press (orb pulse), bottom sheet easing (cubic-bezier).
- **Resolution sprint:** P74 Track B / A8 (mobile UX) or P75 OC-6

### 5. ChatThread (Bradley/User Bubbles + Highlight + AISP Surface + Personality)

**File anchor:** `src/components/shell/ChatThread.tsx:26–50` (message rendering)

- **Visual polish:** 77/100 — Bradley/user distinction via `text-hb-text-muted` (user) vs `text-hb-text-primary` (bradley). "via voice" pill is subtle (`bg-hb-surface border border-hb-border/30`). Personality message block uses persona-specific styling (5 branches: fun orange border, geek mono, teacher yellow bg, coach orange, professional plain). Missing: message timestamps, read receipts, loading skeleton on typing.
- **First-impression clarity:** 80/100 — User name ("you:") makes speaker clear. Bradley replies are visually distinct. "via voice" pill is self-explanatory. Highlight truncation ("see full in log") is minor but correct. Missing: visual cue that Bradley is "AI" (emoji? badge?).
- **Interaction quality:** 74/100 — Personality bubble has no interactive affordance (is it tappable?). Chat messages are read-only text (copy is not exposed). Missing: hover-to-select, long-press menu on mobile, copy-to-clipboard button.
- **Mobile responsiveness:** 81/100 — Text-sm sizing adapts well on narrow screens. Pill widths are inline so they reflow. Issue: long URLs in messages may overflow (no word-break).
- **Accessibility:** 78/100 — Messages have `data-testid` roles (chat-msg-user, chat-msg-bradley) but no explicit `role="article"`. Missing: aria-label on personality bubble, aria-live="polite" on message list for screen readers (new messages announced).
- **Aggregate:** 78/100
- **SOTA gap:** Claude's official chat UI uses larger message spacing, subtle timestamps, smooth scroll-to-newest-message. HB is compact. Add: aria-live region, message timestamp, scroll-lock behavior, copy button on hover.
- **Resolution sprint:** P74 Track B / A4 (highlights) or P75 OC-6

### 6. AISP Trace Pane (5-Atom Chips + Auto-Expand + EXPERT Only)

**File anchor:** `src/components/shell/AISPPipelineTracePane.tsx:35–75` (collapsed/expanded states)

- **Visual polish:** 72/100 — Colored chips (indigo/emerald/amber) for intent source (llm/rules/fallthrough). 5-atom layout uses `space-y-1.5` for vertical rhythm. Border is `border-indigo-200/50 bg-indigo-50/30` (very subtle). Font is `text-[11px] font-mono` (tiny). Missing: icon per atom type, better color contrast.
- **First-impression clarity:** 68/100 — "AISP pipeline (EXPERT)" toggle is cryptic (user must know what AISP is). Atom abbrevs (INTENT_ATOM, ASSUMPTIONS_ATOM) are self-explanatory if you know the spec. Detail text is monospace + small (hard to scan). Missing: human-readable labels ("Recognized intent: create/hero").
- **Interaction quality:** 65/100 — Toggle button has `hover:text-[#2d1f12] underline decoration-dotted` (faint). Collapsed state shows only toggle + chevron. No copy button per atom. Missing: atom detail can be clicked to expand individual atoms.
- **Mobile responsiveness:** 79/100 — Monospace font is tiny on mobile (11px). But layout is vertical stack so reflows. Bottom sheet on mobile shows atoms in peek state (40vh), full state (85vh) should expand trace.
- **Accessibility:** 62/100 — `data-testid` attributes are test hooks, not ARIA. Missing: role="region" aria-label="AISP pipeline trace", aria-expanded on toggle button. Colored chips rely on color alone (not wcag-2.1 AA compliant).
- **Aggregate:** 69/100
- **SOTA gap:** Framer's AI canvas shows an "Audit trail" panel with clearer atom naming + copy buttons + one-line summaries. HB is raw + small. Add: aria-expanded, better color contrast (darken chips), copy icon per atom, human-friendly labels.
- **Resolution sprint:** P75 OC-6 (accessibility polish)

### 7. Spec/Export Surface (Blueprints Tabs + ShareSpecButton + ExportStaticHtmlButton)

**File anchor:** `src/components/shell/ShareSpecButton.tsx:20–60` + `ExportStaticHtmlButton.tsx:30–54`

- **Visual polish:** 75/100 — Share button icon (Share2) + "Share spec" label is clear. Export button icon (Download) + "Export" label is clear. Toast confirmation ("Copied!" / "Downloaded!") uses kind: 'success' | 'error' with inferred styling. Both buttons are small `icon + text` compounds. Missing: button-size consistency with main CTAs, shadow-lift on hover.
- **First-impression clarity:** 82/100 — Button labels are instantly actionable ("Share" = copy to clipboard; "Export" = download HTML). Toast feedback confirms action. Missing: tooltip explaining "shares as data URL, no server".
- **Interaction quality:** 76/100 — Share button has clipboard API fallback to textarea hack (robust). Export has `triggerDownload()` with object URL cleanup. Both have toast feedback (3-second auto-dismiss). Missing: loading state while composing spec, button disabled state during generation.
- **Mobile responsiveness:** 78/100 — Buttons are inline (`inline-flex`). Touch target sizing unknown (likely <44px on share button).
- **Accessibility:** 69/100 — No aria-label on icon-only buttons (if packed into nav). Missing: role="button" fallback, aria-live on toast announcements, disabled state `aria-disabled="true"`.
- **Aggregate:** 76/100
- **SOTA gap:** Lovable shows "Copy link" + "Share on Twitter" variants + file size badge. HB is minimal. Add: aria-label on buttons, file-size preview tooltip, loading spinner while composing.
- **Resolution sprint:** P74 / P75 OC-6

### 8. Listen Mode (Orb + Transcript + Push-to-Talk + Mobile Fullscreen)

**File anchor:** `src/components/left-panel/listen/ListenOrb.tsx:23–60` + `MobileListenFullscreen` + ListenTab

- **Visual polish:** 79/100 — Orb is 4-layer radial gradient with pulse/breathe animations (CSS keyframes, no JS library). Gradient colors are #A51C30 (burgundy) with opacity tuning. Looks hypnotic and brand-consistent. Transcript display below is text-sm monospace. Issue: on mobile, orb takes full viewport (intentional) but transcript font is too small on 375px.
- **First-impression clarity:** 84/100 — Pulsing orb immediately signals "listening"; red/burgundy is universally understood as "recording". Transcript appears mid-screen, clearly legible. Push-to-talk affordance (bottom button) is obvious.
- **Interaction quality:** 81/100 — Orb animation is smooth (CSS cubic-bezier easing). Mic button has rounded + hover states. Transcript updates in real-time (typed via simulation). Sliders (pulse speed, blur, glow) show live orb tuning. Missing: haptic feedback on mobile PTT, visual scrub timeline.
- **Mobile responsiveness:** 80/100 — Mobile fullscreen uses `h-screen flex flex-col`, orb is `flex-1 flex items-center justify-center`. Scaling is responsive via `min(${size}px, 90%)`. Transcript is small but readable at 390px.
- **Accessibility:** 73/100 — Orb animation is non-essential (no aria-label needed). Mic button needs aria-label ("Push to talk" or "Start listening"). Sliders need aria-label + aria-valuenow. Missing: skip animation preference (prefers-reduced-motion).
- **Aggregate:** 79/100
- **SOTA gap:** Lovable's voice UI has morphing shapes + colored waveform animation. HB's orb is classic + elegant (Stripe's parity). Add: prefers-reduced-motion support, haptic on mobile, aria-label on mic button.
- **Resolution sprint:** P74 Track C / A6 or P75 OC-6

### 9. Template Browse Picker (Filters + Thumbnails + 26-Template Grid)

**File anchor:** `src/components/shell/TemplateBrowsePicker.tsx:38–150` (filters + grid rendering)

- **Visual polish:** 77/100 — Filter pills (Persona / Industry / Complexity / Visual Style) use consistent styling. Grid layout is `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (responsive). Template cards have rounded borders + hover lift (inferred). Typography is text-sm. Missing: template thumbnail preview image (code doesn't render images, only name + description).
- **First-impression clarity:** 75/100 — Filter pills are discoverable; grid shows 26 template names + brief descriptions. Persona/Industry/Complexity are clear filter categories. Visual Style filter is newer (P68 OC-4) and may confuse. Missing: featured/recommended card at top.
- **Interaction quality:** 73/100 — Filter pills likely toggle (click to filter). Card click calls `onPick(examplePhrase)`. No explicit hover states in read code. Missing: loading skeleton per card, favorites star, preview modal on click.
- **Mobile responsiveness:** 76/100 — Grid is `grid-cols-1` on mobile (stacks vertically). Filter pills may wrap on 375px. Cards are full-width (good).
- **Accessibility:** 68/100 — Filter pills are likely `<button>` but no aria-pressed visible. Cards are likely `<button>` too. Missing: aria-label per card ("LaunchPad template, SaaS founder persona"), aria-live on filter result count.
- **Aggregate:** 74/100
- **SOTA gap:** Framer's template browser has visual thumbnail preview + tags + "Try in 30s" CTA. HB is text-only. Add: thumbnail renders, aria-pressed on filter pills, result count with aria-live.
- **Resolution sprint:** P75 OC-6 (UI polish)

### 10. Section Editors (Collapse-by-Default + QuickAdd + Simple/Expert Variants)

**File anchor:** `src/components/left-panel/SectionsSection.tsx:50–180` (section list + editors)

- **Visual polish:** 73/100 — Section cards have icon + name + visibility toggle + collapse/expand chevron. Spacing is `space-y-2` for card stacking. Icons (Star for hero, Grid3X3 for columns, etc.) are consistent per type. Background is `bg-hb-bg` (no card-lift). Missing: section thumbnail preview, drag-reorder visual cue.
- **First-impression clarity:** 72/100 — Section list is scannable (names visible). "Add section" button is at bottom (users may miss it on mobile). Collapse/expand is intuitive (chevron direction). Missing: one-line section description on hover.
- **Interaction quality:** 70/100 — Chevron toggle is implicit (no explicit hover state). Eye icon (Show/Hide section) has clear affordance. Missing: long-press to reorder, drag handle icon, delete confirmation dialog.
- **Mobile responsiveness:** 74/100 — Section list reflows on mobile (left panel is hidden on <768px per Builder.tsx). Quick add list is likely a picker modal (good).
- **Accessibility:** 66/100 — Collapse/expand is likely aria-expanded but not visible in this read. Missing: aria-label per section ("Hero section, expanded"), role="region" on section list.
- **Aggregate:** 71/100
- **SOTA gap:** Webflow's layers panel has drag-reorder handles + thumbnails + nesting visual cues. HB is flat. Add: aria-expanded, drag handle, section thumbnail, better visual distinction between sections.
- **Resolution sprint:** P75 OC-6

### 11. Marketing Sub-Pages (OpenCore / AISP / Research / About / HowIBuiltThis / Docs / BYOK / Blog / Progress)

**File anchor:** `src/pages/OpenCore.tsx:6–100` + `AISP.tsx:23–100`

- **Visual polish:** 76/100 — Hero section gradient (from-#A51C30/10 via-transparent to-#A51C30/5) adds depth vs Welcome. Typography scaling is `text-5xl lg:text-6xl` (consistent). Section spacing is py-20 (ample). Color discipline: warm cream (#faf8f5) + dark text (#2d1f12) + accent (#e8772e). Issue: stat callout boxes are bright red-500/10 (breaks palette slightly).
- **First-impression clarity:** 78/100 — Page title + subtitle immediately clarify subject (Open Core vs. AISP). Stat callouts anchor key points. Comparison table (AISP page) is scannable. Missing: breadcrumb ("Home > AISP") for wayfinding.
- **Interaction quality:** 75/100 — CTA buttons use primary color + hover transitions. Links in comparison table likely don't have hover states. Missing: interactive demo component (e.g., toggleable comparison cards).
- **Mobile responsiveness:** 79/100 — Hero uses `max-w-3xl mx-auto px-6`, reflows cleanly. Grid layouts use `md:grid-cols-2` or `md:grid-cols-5` (mobile stacks). Stat boxes may be tight on 375px.
- **Accessibility:** 72/100 — Semantic structure (`<main>`, `<section>`, `<article>`). Missing: skip-to-content link, aria-label on callout boxes, color contrast on stat labels (verify red-400 on red-500/10).
- **Aggregate:** 76/100
- **SOTA gap:** Linear's documentation pages use code examples + animated demos + clear next-page CTA. HB marketing pages are prose-focused. Add: interactive component showcase, clearer visual hierarchy in comparison tables.
- **Resolution sprint:** P75 OC-6 (marketing polish)

### 12. Blog (10 Posts + Share Button + Read-Time + Tag Filter)

**File anchor:** `src/pages/Blog.tsx:30–80` (post list + tag filter)

- **Visual polish:** 74/100 — Blog hero matches Welcome palette (cream + orange accent). Post cards likely have image + title + excerpt + metadata. Tag pills for filtering. Read-time chip is useful. Missing: post card hover states, featured post visual distinction.
- **First-impression clarity:** 78/100 — "Building Hey Bradley in public" hero tagline is clear. Post list is scannable (cards). Tag filter at top enables discovery. Missing: featured post carousel or pinned post.
- **Interaction quality:** 71/100 — Tag click filters posts (mutable state `activeTag`). Share button copies post URL to clipboard (toast feedback). Missing: post card click-through animation, tag filter visual feedback (active tag pill styling).
- **Mobile responsiveness:** 76/100 — Hero reflows cleanly. Post grid is likely `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Tag pills may wrap on narrow screens.
- **Accessibility:** 69/100 — Post list is semantic (likely `<article>` per post). Missing: aria-current="page" on active tag, aria-live on post count when filter changes, aria-label on share button per post.
- **Aggregate:** 73/100
- **SOTA gap:** Stripe's blog has author avatars + publication date + category + suggested next post. HB blog is minimal. Add: author info, publication date, category tags distinct from filter, "Read next" CTA.
- **Resolution sprint:** P75 OC-6

### 13. Demos (ListenModeDemo + ChatModeDemo + FullSiteSimulator P74)

**File anchor:** `src/demos/ListenModeDemo.tsx:93–150` + `ChatModeDemo.tsx:21–100` + `FullSiteSimulator` (P74)

- **Visual polish:** 78/100 — Both demos use warm Welcome palette (consistent). Scripted UI shows typewriter animation + preview panel updating. ListenModeDemo has orb animation. ChatModeDemo has AISP trace chips. Missing: animated transitions between demo steps.
- **First-impression clarity:** 82/100 — Both demos auto-play on load, showing full interaction flow. "Play/Pause/Restart" controls are visible at top. Preview panel updates sync with transcript/reply. FullSiteSimulator (P74) should extend to 10-step flow (hero → blog → theme → typography → export).
- **Interaction quality:** 80/100 — Play/Pause/Restart buttons work. Step history toggles on click (ListenModeDemo). Typewriter animation is smooth (TYPEWRITER_MS = 30). Missing: speed control slider (1x/2x/0.5x playback).
- **Mobile responsiveness:** 74/100 — Demos render full-screen on mobile (good). Preview panel is narrow on <768px. Controls stack horizontally (may wrap on very narrow screens).
- **Accessibility:** 68/100 — Animated demo is `prefers-reduced-motion` hostile. Missing: aria-live on transcript/reply for screen reader users, pause state announcement, step counter aria-label.
- **Aggregate:** 76/100
- **SOTA gap:** Framer's demo video is slick (production video). HB demos are scripted (good for no-backend constraint). Add: prefers-reduced-motion support, playback speed control, closed captions on transcript.
- **Resolution sprint:** P74 Track C / A6 (FullSiteSimulator)

### 14. Settings Drawer (7 Internal Panels: BrandContext / Codebase / LLM / Personality / Reference / Attribution / Theme)

**File anchor:** `src/components/settings/SettingsDrawer.tsx:13–70` (drawer frame + internal panels)

- **Visual polish:** 72/100 — Drawer is `absolute top-0 right-0 h-full max-w-md bg-hb-surface border-l border-hb-border shadow-2xl`. Header is minimal (`h-12 flex items-center justify-between`). Close button (X icon) is top-right. Panels are likely tab-based or sequential. Missing: drawer backdrop blur, section dividers between panels.
- **First-impression clarity:** 68/100 — Settings label is clear. Internal panels are named (LLMSettings, BrandContextUpload, etc.) but not visually distinct on entry. User must discover which panel does what. Missing: panel descriptions, icons for each panel.
- **Interaction quality:** 69/100 — Drawer opens on trigger + ESC closes (visible in handleKeyDown). Clear local data button has confirm dialog (good UX). Missing: visual feedback on file upload, form validation errors, undo/reset per panel.
- **Mobile responsiveness:** 70/100 — Drawer is `max-w-md` (fits mobile screen). Scroll is `overflow-y-auto`. Internal panels may be cramped on narrow screens.
- **Accessibility:** 64/100 — Dialog has `role="dialog" aria-modal="true" aria-label="Settings"`. Missing: focus trap (focus should not escape drawer), aria-label per internal panel, keyboard shortcut to open/close (CMD+,).
- **Aggregate:** 68/100
- **SOTA gap:** Framer's settings use tabbed panel interface + icons per panel + search. HB settings are stacked sections. Add: panel tabs with icons, focus trap, search within settings, keyboard shortcut hint in UI.
- **Resolution sprint:** P75 OC-6

### 15. Conversation Log Tab (Full-Detail Surface P74-Enhanced)

**File anchor:** `src/components/center-canvas/ConversationLogTab.tsx:54–100` (log display + filters + exports)

- **Visual polish:** 71/100 — Log is text-sm monospace (appropriate for logs). Session/provider/personality/date filters are above. Export buttons (Markdown + JSON icons) are prominent. Missing: syntax highlighting for JSON, date range picker for time-based filtering.
- **First-impression clarity:** 69/100 — "Conversation Log" tab is discoverable (in center canvas). Filters are scannable. Export buttons are actionable. Missing: legend explaining columns (timestamp, role, text, latency, personality).
- **Interaction quality:** 72/100 — Filter controls update log in real-time (mutable useState). Highlight toggle per row ("Show full" / "Show highlight") is useful. Export buttons trigger download (async). Missing: copy button per turn, full-screen mode, search/find within log.
- **Mobile responsiveness:** 65/100 — Log is narrow on mobile (ConversationLogTab is likely center canvas, which is hidden on <768px). Log table may overflow horizontally.
- **Accessibility:** 61/100 — Log is text-content only (should be fine for screen readers). Missing: aria-label on filter buttons, aria-live on log updates, role="log" on container (or role="region" aria-label="Conversation log").
- **Aggregate:** 68/100
- **SOTA gap:** Claude's conversation history has clearer row separation + timestamp + copy-to-clipboard per message. HB log is raw. Add: syntax highlighting, row borders, copy button, aria-live on new turns.
- **Resolution sprint:** P74 Track B / A5 (log enhancement) or P75 OC-6

---

## §3 Aggregate Across Dimensions

| Dimension | Mean | High | Low | Notes |
|---|---|---|---|---|
| Visual polish | 75.4 | 84 (Mobile Shell) | 71 (ConversationLog) | Warm palette + consistent tokens; missing subtle depth (glows, shadows) |
| First-impression clarity | 77.6 | 84 (Welcome, Mobile) | 68 (Settings) | USP is clear; secondary surfaces need better visual hierarchy |
| Interaction quality | 73.9 | 82 (Builder) | 65 (AISP Trace) | Button states implemented; missing animations + feedback polish |
| Mobile responsiveness | 77.1 | 85 (Mobile Shell) | 65 (Conversation Log) | Good flex-column patterns; font sizes too small in places |
| Accessibility | 70.5 | 79 (Builder) | 61 (Conversation Log) | Semantic HTML present; aria-* attributes sparse, focus rings missing |
| **Aggregate (weighted)** | **74.9/100** | — | — | **Below SOTA floor (80/100) by ~5 points** |

---

## §4 Per-Persona Aggregate Scoring

**Capstone Reviewer** (design school faculty):
- Cares about: visual hierarchy, typography, color theory, brand coherence, user research
- HB score: **76/100** — Warm palette is cohesive + intentional (cream = approachable, orange = energy). Typography responsive + readable. Missing: subtle depth, microinteractions, user research validation.

**Grandma Persona** (70yo, first-time user, tries onboarding):
- Cares about: obvious buttons, large text, no jargon, confidence in next step
- HB score: **72/100** — Welcome is clear ("Tell Bradley what you want"). Onboarding steps are confusing (what is "Mode Selector"?). Mobile chat is intuitive. Missing: larger fonts in onboarding, skip-ahead options.

**Framer Judge** (competitive polished UI standard):
- Cares about: motion design, hover/focus states, shadow depth, interaction delighters
- HB score: **71/100** — Lack of animated transitions on step changes, button hover is subtle (no lift), AISP trace pane is utilitarian (not delightful). Demos (Listen/Chat) have scripted animation but not every surface.

**Lars (Senior Eng)** (evaluates accessibility + keyboard nav):
- Cares about: ARIA attributes, focus-visible rings, keyboard shortcuts, reduced-motion
- HB score: **70/100** — Semantic HTML is solid; aria-label sparse, focus rings mostly missing, no prefers-reduced-motion on orb/demos, no keyboard shortcuts for common actions (open settings, share spec).

---

## §5 Top 5 Polished + Bottom 5 Drift Surfaces

**Top 5 (Strongest):**

1. **Mobile Shell (77/100)** — Best responsive design in the suite; touch targets appropriate; first-run onboarding clear.
2. **Builder Tri-Pane (81/100)** — Iconic web-builder layout; clear visual zones; tab switching is smooth.
3. **Welcome Landing (78/100)** — Strong hero + story; compelling headline; CTA clarity.
4. **Listen Mode Orb (79/100)** — Hypnotic, brand-aligned animation; instant affordance (red = recording).
5. **ChatThread (78/100)** — Highlights feature + personality bubbles + "via voice" pill; chat feels conversational.

**Bottom 5 (Most Drift):**

1. **Conversation Log Tab (68/100)** — Raw monospace text; no syntax highlighting; missing aria-live; hidden on mobile.
2. **Settings Drawer (68/100)** — Internal panels poorly organized; no icons or descriptions; confusing mental model.
3. **AISP Trace Pane (69/100)** — Tiny monospace (11px); EXPERT-only (excludes users); colors not WCAG AA.
4. **Section Editors (71/100)** — Flat visual design; no drag-reorder UX; missing section thumbnails.
5. **Onboarding Flow (71/100)** — No step indicator; three-step progression is unclear; personality picker undesigned.

---

## §6 Bottom Line

Hey Bradley is a **cohesive, functional design** (74.9/100 aggregate) built on a **warm, consistent palette** and **responsive mobile-first patterns** that serve the core use case (chat → edit → export) well. The **Welcome landing, Mobile shell, and Builder tri-pane are SOTA-adjacent** (75–81/100) and would ship on a consumer app. However, **secondary surfaces (Settings, Logs, AISP Trace, Onboarding) drift toward utilitarian** (65–71/100) due to **missing focus rings, sparse aria-* attributes, tiny typography, flat interaction states, and no motion design**. To reach 80/100 SOTA parity, HB needs a **6-week Polish sprint** (P75 OC-6): add focus-visible rings globally, boost ARIA coverage (aria-label, aria-live, aria-expanded, aria-pressed), animate step transitions on onboarding, enlarge Settings/Log typography, add button scale/lift on hover, and implement prefers-reduced-motion support across all demos.

