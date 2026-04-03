# UI/UX Review V2 -- Builder Deep Dive

**Reviewer**: Opus 4.6 (Brutal Honest Mode)  
**Date**: 2026-04-02  
**Scope**: Builder experience only (left panel, right panel, center canvas, templates, TopBar)  
**Benchmark**: Squarespace, Wix, Lovable.dev, Framer  
**Previous Score**: 52/100 (Phase 4 close)  

---

## FINAL SCORE: 68/100

Significant improvement from 52. The builder has gone from "engineering prototype" to "early beta product." The vocabulary overhaul, drag-drop, layout card system, ImagePicker, and expanded template library are real gains. But it is still 22 points short of the 90 target, and there are specific gaps that prevent it from competing with Lovable.dev or Framer in a side-by-side demo.

---

## What Improved from 52/100 Baseline

These are genuine, measurable improvements since the Phase 4 close review:

### 1. Vocabulary overhaul -- FIXED (was blocker B6, B9)
- "Hero" is now "Main Banner" throughout the left panel and right panel headers
- "Navbar" is now "Top Menu"
- "CTA" is now "Action Block"
- "Features" is now "Columns"
- "Value Props" is now "Numbers"
- "Testimonials" is now "Quotes"
- "FAQ" is now "Questions"
- Section IDs (hero-01, navbar-01) are NO LONGER shown in the left panel UI. The SectionsSection renders human names only.
- **Impact**: This alone moves the Grandma Test from 3/10 to 5/10.

### 2. Drag-and-drop in left panel -- FIXED (was blocker in Builder Mode)
- GripVertical drag handles on every section row
- Drop indicator line (blue accent bar) shows insertion point
- DragStart/DragEnd/DragOver/Drop handlers are properly implemented
- **Impact**: This is table-stakes for a modern builder. Having it moves Builder from 5/10 to 6/10.

### 3. Layout cards in right panel -- NEW
- Hero section: 8 layout presets (Full Photo, Full Video, Clean, Simple, Photo Right, Photo Left, Video Below, Photo Below) with icon cards in a 2x4 grid
- Columns section: 8 variant cards (Cards, Image Cards, Icon+Text, Minimal, Numbered, Horizontal, Gradient, Glass)
- Each card shows an icon + label, selected state has accent border + tint
- **Impact**: This is a Lovable-style pattern. Users pick layouts visually rather than typing variant names. Huge UX win.

### 4. ImagePicker with curated library -- NEW
- 50 curated photos across 9 categories (Food & Bakery, Nature, Business, Technology, People, Creative, Architecture, Abstract)
- 10 curated videos with thumbnail previews
- 6 image effects (Overlay Gradient, Fade to Background, Ken Burns, Zoom on Hover, Parallax, Full Bleed)
- Full-screen modal with category sidebar, 3-column grid, lazy loading
- Photos show alt text labels, videos show play button overlay
- Escape to close, click-outside to close
- **Impact**: This is the single biggest UX improvement. Users no longer need to paste URLs. They browse and click.

### 5. Elements/Content split in right panel -- NEW
- Hero editor has 5 accordion sections: Layout, Elements, Media, Content, Visuals
- Elements section shows toggle switches for Tag Line, Main Button, Extra Button, Social Proof
- Content section has labeled text inputs for each field
- Media section shows current image preview + ImagePicker trigger
- **Impact**: Progressive disclosure done right. Simple users toggle elements on/off. Advanced users edit content text.

### 6. Palette system -- NEW
- 10 named palette presets (Midnight, Forest, Sunset, Ocean, Rose, Cream, Lavender, Slate, Crimson, Neon)
- Each shows 6 color dots inline with palette name
- Current palette display shows active colors with labels
- Selected palette gets accent left border + check mark
- Light/Dark mode toggle in both ThemeSimple and SectionSimple
- **Impact**: Color customization is now visual and approachable. Compare to Squarespace palette picker -- this is in the same category.

### 7. Template library expanded to 46 files
- 10 section types with multiple variants each
- Hero: 4 variants (Centered, Split, Overlay, Minimal)
- Columns: 8 variants (Cards, ImageCards, IconText, Minimal, Numbered, Horizontal, Gradient, Glass)
- Action: 4 variants (Centered, Split, Gradient, Newsletter)
- Quotes: 4 variants (Cards, Single, Stars, Minimal)
- Questions: 4 variants (Accordion, TwoCol, Cards, Numbered)
- Numbers: 4 variants (Counters, Icons, Cards, Gradient)
- Footer: 4 variants (Simple, MultiColumn, SimpleBar, Minimal)
- Gallery: 4 variants (Grid, Masonry, Carousel, FullWidth)
- Pricing: 1 variant (Tiers)
- Navbar: 1 variant (Simple)
- **Total distinct renderable variants: ~38** (not 31 as suggested; counting all switch cases)

### 8. Right panel header with context -- IMPROVED
- Shows "THEME" or section type label in mono uppercase
- Section enable/disable toggle right in the header
- SIMPLE/EXPERT tab bar for progressive disclosure

### 9. Center canvas section interaction -- NEW
- Hover shows section label badge (top-left, accent background)
- Floating toolbar on hover (move up, move down, delete) with proper dividers
- Click-to-select opens right panel with section config
- AddSectionDivider between sections (hover to reveal "+ Add Section" pill)
- Accent ring-inset on hover for clear selection feedback

### 10. Light mode CSS -- IMPROVED (was blocker B4, B5)
- Cream/parchment palette is warmer (#F5F3F0 bg, #FFFFFF surface)
- Input elements get proper white backgrounds and warm borders in light mode
- The blanket crimson border issue from Phase 4 appears resolved -- no more `.light-chrome [data-builder-panel] button` global override
- **Impact**: Light mode is now usable, not just tolerable.

---

## Category Scores (1-10 each)

### 1. First Impression -- does the builder look professional? **7/10**

**The Good:**
- TopBar is clean: crimson header, "Hey Bradley" logo, undo/redo, device preview buttons, Edit/Preview toggle, Share button, right panel toggle. This is a complete toolbar.
- Three-panel layout with resizable panels reads as "serious tool."
- The accent color (Harvard crimson) is distinctive and gives brand identity.
- DM Sans + JetBrains Mono is a premium font pairing.

**The Bad:**
- The center canvas tabs (Preview, Data, Specs, Pipeline) expose internal architecture. A first-time user does not need to see "Pipeline." Squarespace shows ONE canvas -- the live preview. Data/Specs/Pipeline should be developer-only tabs hidden behind a setting or removed for the demo.
- The "Share" button still has no click handler. It renders but does nothing. In a live demo, clicking it and getting zero response is a credibility hit.
- The right panel shows "Select an item" when nothing is selected -- this is a blank gray void. Framer shows a properties panel even for the page-level settings. The empty state needs at minimum a hint: "Click a section in the preview to edit it."

**Delta from baseline**: +1 (was 6). TopBar cleanup and layout polish moved this up.

---

### 2. Grandma Test -- can she build a cookie website? **5/10**

**The Good:**
- "Main Banner," "Top Menu," "Columns," "Action Block" -- grandma can understand these.
- The Add Section menu shows descriptions: "Main banner with headline and CTA" -- wait, "CTA" leaked through in the description map. This is still jargon.
- ImagePicker with "Food & Bakery" category lets grandma find cookie photos.
- Layout cards with icons (Full Photo, Photo Right, etc.) are visual enough to guess at.
- Toggle switches for elements (Tag Line, Main Button) are grandma-friendly.

**The Bad:**
- The description for "hero" still says "Main banner with headline and CTA" -- the word "CTA" is developer jargon. Should be "Main banner with headline and button."
- "Action Block" is better than "CTA" but still unclear. "Call to Action" or "Sign-Up Section" or "Banner with Button" would be clearer.
- Columns description says "Showcase product features in columns" -- grandma does not think in "columns." She thinks "show my different cookie types side by side."
- The Add Section types include "Numbers" and "Gallery" which are reasonable, but there is no visual preview of what these look like. Grandma cannot pick between "Quotes" and "Numbers" without seeing them.
- Chat tab hint says "try: dark mode, add pricing, headline Hello" -- this is command syntax, not natural language. Grandma wants to type "make the colors warmer" or "add a page for my menu."
- The SIMPLE/EXPERT tab distinction is good progressive disclosure, but "EXPERT" implies grandma is not welcome there.

**Delta from baseline**: +2 (was 3). Vocabulary fixes are real progress. Still not Wix-level approachable.

---

### 3. Visual Variety -- do the 38 variants produce genuinely different-looking sections? **7/10**

**The Good:**
- 8 column variants genuinely look different: Cards (bordered), ImageCards (photo + text), Glass (backdrop-blur), Gradient (gradient bg), Numbered (with numbers), etc.
- 4 hero variants cover the main patterns: centered text, split with image, fullscreen overlay, minimal.
- Gallery has 4 meaningfully different layouts (grid, masonry, carousel, full-width).
- Quotes has visual diversity: card grid, single spotlight, star ratings, minimal.
- ColumnsGlass uses `backdrop-blur-xl` and `rgba(255,255,255,0.05)` -- this produces a real glassmorphism effect.
- ActionGradient uses `color-mix(in srgb, ...)` for the gradient -- modern CSS, produces clean results.

**The Bad:**
- Some variants are visually similar when rendered. ColumnsCards and ColumnsMinimal differ primarily in border treatment, not in overall visual impression. A user flipping between them might not notice the change.
- ColumnsImageCards uses hardcoded `rgba(255,255,255,0.03)` background and `border-white/10` -- these only work on dark backgrounds. On a light palette (Cream, Lavender), the cards will be nearly invisible.
- Pricing has only 1 variant. This is a gap -- pricing is one of the most viewed sections on any business site. Squarespace has 5+ pricing layouts.
- Footer has 4 variants but the visual range is narrow (all are text-based, no imagery).

**Delta from baseline**: This was not scored separately before. 7/10 is strong for the template count.

---

### 4. Color Palette -- does the palette selector work? Are presets good? **7/10**

**The Good:**
- 10 palette presets cover a wide range: dark tech (Midnight, Neon), nature (Forest, Ocean), warm (Sunset, Cream), feminine (Rose, Lavender), neutral (Slate), brand (Crimson).
- Each preset has 6 semantic colors (bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary) -- this is the right abstraction level.
- The palette row UI is clean: name + 6 color dots + check mark for selected.
- Current Colors display shows active palette with labels.
- Theme dropdown with swatch preview (bgPrimary + accent bar) is a nice touch.

**The Bad:**
- No custom color picker. Users can only choose from presets. Squarespace, Wix, and Framer all let you pick arbitrary colors. For a demo this is acceptable, but it limits perceived flexibility.
- The palette presets are all dark-first except Cream, Lavender, and Slate. The light palette options are limited. A "Clean White," "Soft Gray," or "Warm Sand" preset for light-mode users is missing.
- Palette selection does not preview before applying. You click and it changes. Squarespace shows a hover preview. This is a nice-to-have, not a blocker.
- The theme dropdown and palette presets are in the same panel -- it is unclear whether selecting a new theme overwrites your palette customizations, or if they are independent. No tooltip or hint explains the relationship.

---

### 5. Image Picker -- 50 images + videos + effects -- is this usable? **8/10**

**The Good:**
- This is the standout feature of the builder. 50 curated photos, 10 videos, 6 effects in a well-designed modal.
- Category sidebar (9 categories) with active state highlighting.
- 3-column thumbnail grid with hover scale effect and bottom label overlay.
- Selected image gets crimson border + ring -- clear selection feedback.
- Videos show play icon overlay on thumbnail -- users understand these are videos.
- Effects tab with icon + name + description for each effect. Clean 2-column card layout.
- Escape to close, click-backdrop to close, X button -- three ways to dismiss.
- Portal-rendered modal at z-9999 -- will not clip behind panels.

**The Bad:**
- The "Effects" tab is always shown, but `onEffectChange` is optional and often not wired. Clicking an effect may do nothing for most sections. This is a broken promise -- user clicks "Ken Burns" and nothing happens. Either wire it up or hide the tab when effects are not supported.
- No search/filter within photos. 50 images is manageable, but as the library grows, text search will be needed.
- No "paste URL" fallback in the picker modal. The trigger button exists outside the modal, but inside the modal there is no URL input. Users who have their own images cannot use them from this modal.
- Video thumbnails use Unsplash images that do not match the video content (e.g., "Coffee Pour" thumbnail is bread). This is a content mismatch.
- No loading states for images. On slow connections, the grid will show broken image placeholders before thumbnails load.

**Delta from baseline**: This did not exist in Phase 4. 8/10 is strong -- this feature alone is demo-worthy.

---

### 6. Left Panel -- drag-drop, clean rows, action bar **7/10**

**The Good:**
- Drag handles (GripVertical) on every row.
- Drop indicator line (accent color) shows insertion target.
- Eye toggle for show/hide with immediate visual feedback.
- Selected row gets accent border-2 -- clear selection state.
- Action bar (move up/down, duplicate, delete) appears below selected row.
- Hidden sections collapsed under "N hidden sections" with chevron toggle.
- Add Section button with dashed border, accent color on hover, section type picker with icons and descriptions.
- Three tabs (Builder, Chat, Listen) with standard tab bar pattern.
- Theme row at top with palette icon, selected state fills with accent color.

**The Bad:**
- Drag-and-drop only works with native HTML5 drag API. No visual ghost preview of the dragged item. Compared to Framer's drag experience (smooth, animated, with visual placeholder), this feels basic.
- The action bar buttons (move up/down, duplicate, delete) are tiny (14px icons with 4px padding). These are hard to click, especially on touch devices.
- The delete confirmation (click once to arm, click again to confirm with red pulse animation) is non-standard. A small inline "Delete? Yes / No" would be clearer.
- Max width `max-w-[300px]` on the builder panel content means the panel can never be wider than 300px even if the user resizes. This is unnecessarily restrictive.
- Section descriptions in the Add Section menu still use "CTA" ("Main banner with headline and CTA").

---

### 7. Right Panel -- Lovable-style layout cards, elements/content split **7/10**

**The Good:**
- Every section type has its own dedicated Simple editor (10 total: hero, menu, columns, action, pricing, footer, quotes, questions, numbers, gallery). This is comprehensive.
- Hero editor: Layout (8 cards), Elements (4 toggles), Media (preview + ImagePicker), Content (6 text fields), Visuals (mode toggle). This is a complete editing experience.
- Columns editor: Layout (8 cards), Content (expandable per-card editors with icon select, title, description, toggle, delete). Per-card editing with add/remove is Webflow-level functionality.
- Accordion sections with persistent open/close state (stored in UI store). Good UX memory.
- SIMPLE/EXPERT progressive disclosure -- correct pattern for mixed audiences.
- Media preview shows current image thumbnail above the ImagePicker trigger.

**The Bad:**
- The "Visuals" section in SectionSimple duplicates the mode toggle that already exists in ThemeSimple. Changing mode in one place should change it everywhere -- and it does (both call toggleMode), but having the same control in two places creates confusion about scope. "Does this change just this section or the whole site?"
- Content accordion is collapsed by default. This means the most common action (editing text) requires an extra click. It should default to open for hero sections at minimum.
- Feature card editors take significant vertical space. With 3 cards, each with icon/title/description fields, the scrollable area becomes very long. Collapsible per-card editors (click card header to expand) would reduce scrolling.
- No inline preview of what the selected layout looks like. The layout card shows an icon (e.g., PanelRight for "Photo Right") but does not show a miniature wireframe. Squarespace layout selectors show a tiny visual preview of the actual layout.
- The icon select for feature cards uses a raw `<select>` dropdown. On Mac this renders as a native dropdown which looks fine, but it breaks the custom styling on Windows/Linux where native selects look different.

---

### 8. Preview Quality -- do sections look like real marketing pages? **7/10**

**The Good:**
- ActionGradient with `linear-gradient(135deg, ...)` and `color-mix` produces genuinely professional-looking gradient CTAs with drop shadows and rounded-full buttons.
- ColumnsGlass with backdrop-blur creates a real glassmorphism effect.
- ColumnsImageCards with hover scale and aspect-video images looks like a modern SaaS features section.
- GalleryGrid with hover-to-reveal captions and scale animation is polished.
- Hero variants cover the main marketing page patterns.
- Typography is clean: `tracking-tight` on headings, `leading-relaxed` on body text, proper font sizing hierarchy.
- Proper responsive grid classes (`grid-cols-1 md:grid-cols-3`).

**The Bad:**
- Default content is generic: "Feature," "Description," "Take the next step." Squarespace fills in contextually relevant placeholder text. Even "Your feature title here" would be better than a single word.
- ColumnsImageCards hardcodes `rgba(255,255,255,0.03)` and `border-white/10` -- this only works on dark backgrounds. Light theme renders invisible cards.
- Several templates use raw `section.style.background` and `section.style.color` but do not account for the palette system. If the palette sets custom colors, some templates may not reflect them.
- No hover states on CTA buttons in preview. The ActionGradient button has `hover:bg-gray-100` but the hero CTA buttons may not have hover transitions.
- No animation or transition between section variants when switching layouts. The entire section re-renders, which can feel jarring.

---

### 9. Light Mode -- clean white panels, good contrast? **6/10**

**The Good:**
- The CSS variables for `.light-chrome` are well-defined: warm off-white (#F5F3F0), pure white surfaces, soft warm borders (#E5E1DC).
- Input elements get explicit white backgrounds and warm borders in light mode.
- The crimson accent carries through cleanly in both modes.
- The Phase 4 blanket-border issue appears fixed.

**The Bad:**
- The TopBar remains crimson (#A51C30) in light mode. White text on this crimson is borderline WCAG AA (around 4.4:1 contrast ratio). This was noted in the Phase 4 review and is still present.
- Template sections (ColumnsImageCards, ColumnsGlass) use hardcoded dark-theme colors (`rgba(255,255,255,0.03)`, `border-white/10`). These are invisible or wrong on light backgrounds. The palette system sets bgPrimary/textPrimary correctly, but the template CSS does not fully adapt.
- The ListenTab background issue (hardcoded dark) was noted in Phase 4 as blocker B4. Based on the screenshots directory showing new orb variations, this may have been addressed, but the CSS evidence in index.css does not show a light-mode orb background override.
- The `reduced-motion` media query is a nice accessibility touch, but the light mode does not include a `prefers-color-scheme` auto-detection. Users must manually toggle.

**Delta from baseline**: +2 (was 4). The blanket border fix and improved variables are real progress.

---

### 10. Consistency -- does everything feel like one cohesive product? **6/10**

**The Good:**
- The `hb-*` CSS variable system is used consistently across ALL components. Every panel, button, and text element references the same token set. This is architecturally correct.
- Font usage is consistent: DM Sans for UI, JetBrains Mono for labels/tabs.
- Accent color (crimson) is the same everywhere: selected states, active tabs, hover borders, action buttons.
- Icon sizing is mostly consistent: 13-14px for UI elements, 18-20px for layout cards.
- Border radius is consistent: `rounded-md` for inputs, `rounded-lg` for cards/modals, `rounded-full` for pills.

**The Bad:**
- The center canvas tabs (Preview, Data, Specs, Pipeline) use a different visual language than the left panel tabs (Builder, Chat, Listen) and right panel tabs (Simple, Expert). Left uses icon+text, center uses text-only, right uses mono uppercase. Three different tab styles in one product.
- Section names are inconsistent between the Add Section descriptions and the actual labels. The add menu says "Call-to-action block" but the section row says "Action Block" and the right panel header says "ACTION BLOCK." Three different phrasings.
- The `SectionSimple` hero editor has a "Visuals" accordion with a mode toggle, but other section editors (FeaturesSectionSimple, etc.) do not. The mode toggle only appears when editing the hero. This is inconsistent -- mode should be global or nowhere at section level.
- Template files use a mix of absolute colors (`text-gray-900`, `bg-white`) and CSS variable references (`var(--theme-accent)`). Some templates will not respond to palette changes because they use hardcoded Tailwind colors.
- The center canvas SectionWrapper hover toolbar uses `bg-hb-surface` while the left panel action bar is just inline buttons with no background. Different interaction patterns for the same actions (move, delete).

---

## Score Summary

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| 1. First Impression | 7/10 | 10% | 0.70 |
| 2. Grandma Test | 5/10 | 15% | 0.75 |
| 3. Visual Variety | 7/10 | 10% | 0.70 |
| 4. Color Palette | 7/10 | 10% | 0.70 |
| 5. Image Picker | 8/10 | 10% | 0.80 |
| 6. Left Panel | 7/10 | 10% | 0.70 |
| 7. Right Panel | 7/10 | 10% | 0.70 |
| 8. Preview Quality | 7/10 | 10% | 0.70 |
| 9. Light Mode | 6/10 | 5% | 0.30 |
| 10. Consistency | 6/10 | 10% | 0.60 |
| **TOTAL** | | **100%** | **6.65/10 = 66.5** |

**Adjusted: 68/100** (bonus for ImagePicker being genuinely impressive and the layout card system being well-executed)

---

## BLOCKERS -- Would Embarrass in Capstone Demo

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| B1 | "Share" button does nothing when clicked | High | TopBar.tsx line 138 |
| B2 | Effects tab in ImagePicker shows 6 effects but clicking them often does nothing (onEffectChange not wired) | High | ImagePicker.tsx |
| B3 | ColumnsImageCards and ColumnsGlass use hardcoded dark-only colors -- invisible on light palettes | High | ColumnsImageCards.tsx:37-38, ColumnsGlass.tsx:38-39 |
| B4 | "CTA" still appears in the hero section description ("Main banner with headline and CTA") | Medium | SectionsSection.tsx line 56 |
| B5 | Center canvas shows Data/Specs/Pipeline tabs that are developer-facing, not user-facing | Medium | TabBar.tsx, CenterCanvas.tsx |
| B6 | Content accordion collapsed by default in hero editor -- most common action requires extra click | Medium | SectionSimple.tsx line 200 |
| B7 | Default template content is generic single words ("Feature," "Description") rather than contextual placeholders | Medium | Multiple template files |
| B8 | TopBar white-on-crimson text is borderline WCAG AA in light mode | Low | TopBar.tsx, index.css |

---

## Specific Fixes to Reach 90/100

### Tier 1: Quick wins to reach 75 (1-2 hours each)

1. **Fix "CTA" in description map** -- change `hero: 'Main banner with headline and CTA'` to `hero: 'Main banner with headline and button'` in SectionsSection.tsx line 56. Also change `action: 'Call-to-action block'` to `action: 'Section with button and message'`. (5 minutes)

2. **Make Share button functional** -- add `onClick={() => navigator.clipboard.writeText(window.location.href)}` with a toast "Link copied!" or show a "Coming soon" modal. (30 minutes)

3. **Fix ColumnsImageCards/ColumnsGlass for light palettes** -- replace hardcoded `rgba(255,255,255,0.03)` with `var(--theme-bg-secondary, rgba(255,255,255,0.03))` or use palette-aware `color-mix`. Replace `border-white/10` with `border-current opacity-10` or a CSS variable. (1 hour)

4. **Open Content accordion by default for hero** -- change `<RightAccordion id="content" label="Content">` to `<RightAccordion id="content" label="Content" defaultOpen>` in SectionSimple.tsx line 200. (2 minutes)

5. **Hide Data/Specs/Pipeline tabs** -- conditionally render these tabs only when a developer setting is enabled, or remove them from the tab bar entirely for the demo build. Show only "Preview." (30 minutes)

6. **Hide or wire Effects tab** -- if effects are not implemented, remove the effects tab from ImagePicker or add a "Coming Soon" badge on it. Do not show 6 clickable cards that do nothing. (30 minutes)

7. **Better default content** -- change "Feature" to "Your Feature Title" and "Description" to "Describe what makes this special." Change "Take the next step" to "Ready to get started?" across all templates. (1 hour)

### Tier 2: Medium effort to reach 82 (half-day each)

8. **Add section type preview thumbnails in Add Section menu** -- render a tiny (60x40px) preview of what each section type looks like, or at minimum a wireframe SVG icon that shows the layout structure. This is how Squarespace and Framer do it. (4 hours)

9. **Improve drag-and-drop** -- add a visual ghost preview (clone of the row with opacity) during drag. Add smooth CSS transition when items reorder. The current jump-cut reorder feels jarring. (4 hours)

10. **Add "paste URL" input inside ImagePicker modal** -- a text field at the top of the photos tab that says "Paste an image URL" so users with their own images can use them. (2 hours)

11. **Fix template palette responsiveness** -- audit all 38 template variants and ensure they use CSS variables (`var(--theme-*)`) instead of hardcoded colors. Create a shared utility for card backgrounds: `bg-[var(--theme-bg-secondary)]` and `border-[var(--theme-border)]`. (4 hours)

12. **Improve empty state in right panel** -- when no section is selected, show a visual prompt: "Click any section in the preview to start editing" with an arrow illustration or a list of quick actions ("Change theme colors", "Edit main banner text"). (2 hours)

### Tier 3: Significant effort to reach 90 (1-2 days each)

13. **Layout preview thumbnails in right panel** -- instead of abstract icons (PanelRight, ImageDown), render miniature wireframe SVGs that show the actual content layout. Show text block position, image position, button position. This is how Framer's layout selector works. (1 day)

14. **Per-card collapsible editors in FeaturesSectionSimple** -- each card shows just its title in collapsed state. Click to expand and show icon/description/toggle. This reduces scrolling from 6 expanded cards to 6 compact rows. (4 hours)

15. **Add Pricing variant** -- currently only 1 pricing layout. Add at least "Pricing comparison table" and "Pricing cards with toggle (monthly/annual)" to match the 4-variant standard of other sections. (1 day)

16. **Contextual default content per theme** -- when a user selects the "bakery" example, template placeholders should say "Our Fresh-Baked Cookies" not "Feature." This requires mapping theme slugs to content presets. (1 day)

17. **Unified tab styling** -- make left panel, center canvas, and right panel tabs use the same visual pattern. Pick one: icon+text with underline accent. Apply everywhere. (4 hours)

18. **Canvas-only mode** -- hide center canvas tabs entirely. The builder should show ONLY the live preview in the center. Data/Specs/Pipeline should be accessible from a developer menu or keyboard shortcut, not primary navigation. (2 hours)

19. **Hover preview for palette presets** -- when hovering over a palette in ThemeSimple, temporarily apply it to the preview canvas so users can see the result before committing. Revert on mouse-leave. (1 day)

20. **Keyboard shortcuts overlay** -- Ctrl+Z/Ctrl+Shift+Z for undo/redo already work but are not discoverable. Add a "?" keyboard shortcut that shows an overlay with all shortcuts. (4 hours)

---

## Gap Analysis: 68 to 90

| Score Target | What Gets You There | Effort |
|-------------|---------------------|--------|
| 68 -> 75 | Tier 1 fixes (items 1-7) | 1 day |
| 75 -> 82 | Tier 2 fixes (items 8-12) | 2-3 days |
| 82 -> 90 | Tier 3 fixes (items 13-20) | 5-7 days |

**The honest truth**: reaching 90 requires approximately 8-10 days of focused UI work. The builder has solid bones and the right architectural patterns (layout cards, accordion editors, ImagePicker modal). What it lacks is the polish layer: preview thumbnails, contextual content, smooth animations, unified styling. These are the details that separate "good hackathon project" from "Stripe/Linear/Vercel quality."

The 75 target is achievable in a single day of focused work. Items 1-7 are all straightforward code changes with no architectural risk.

---

## Comparison to Benchmarks

| Aspect | Squarespace | Wix | Lovable.dev | Framer | Hey Bradley |
|--------|-------------|-----|-------------|--------|-------------|
| Layout selection | Visual thumbnails | Visual thumbnails | AI + cards | Wireframe thumbnails | Icon cards (good, not visual) |
| Color system | Full picker + presets | Full picker + presets | AI-generated | Full picker + presets | Presets only (no custom) |
| Image library | Getty integration | Unsplash built-in | AI-generated | Unsplash API | 50 curated (strong for MVP) |
| Section editing | Click element on canvas | Click element on canvas | Chat + sidebar | Click + property panel | Sidebar accordions (functional) |
| Drag reorder | Smooth animated | Smooth animated | AI-driven | Smooth animated | Basic HTML5 drag (functional) |
| Preview fidelity | Production-ready | Production-ready | Near-production | Production-ready | Good with dark-mode caveats |
| Mobile editing | Dedicated mobile view | Dedicated mobile view | Responsive preview | Responsive preview | Device buttons (no mobile editor) |

Hey Bradley is at roughly **Lovable.dev minus AI generation quality**. The sidebar editing pattern is similar, the layout cards are similar, the accordion structure is similar. The gap is in AI intelligence (Lovable generates real content) and visual polish (Lovable has smoother animations and better preview fidelity).

---

## Bottom Line

From 52 to 68 is a 30% improvement. The vocabulary overhaul, drag-drop, layout cards, ImagePicker, palette system, and expanded templates are all real, substantive improvements. This is no longer a developer prototype -- it is an early beta product.

The path to 75 is clear and achievable in one day. The path to 90 requires about a week of sustained UI polish work. The architecture supports all the planned improvements -- nothing requires a rewrite. This is execution work, not design work.

For the capstone demo specifically: fix the 8 blockers listed above, especially the Share button and the hardcoded dark-only template colors. These are the items that will be noticed by evaluators who click around.
