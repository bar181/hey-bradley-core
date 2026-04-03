# Multi-Persona Builder Review -- Brutally Honest

**Date**: 2026-04-02
**Reviewer**: Opus 4.6 (4-persona deep review)
**Previous scores**: 52/100 (Phase 4 close), 66/100 (variant scoring), 68/100 (UI/UX review v2)
**Files reviewed**: 23 source files across left-panel, right-panel, center-canvas, shell, templates, and CSS

---

## Persona 1: Top Agency Designer (Linear/Stripe Quality Bar)

**Score: 58/100**

### Who I Am
I lead design at an agency that ships work for Fortune 500 clients. Our benchmark is Linear's landing page, Stripe's documentation, Vercel's dashboard. Every pixel matters. I evaluate on visual craft, typographic hierarchy, spatial rhythm, and whether the output could pass as a real marketing site without edits.

### Top 3 Things Done Well

1. **ActionGradient is genuinely agency-quality.** The `linear-gradient(135deg, ...)` with `color-mix(in srgb, ...)` produces a gradient CTA section that I would not be embarrassed to show a client. The `rounded-full` button with `shadow-xl`, the `drop-shadow-sm` on the heading, the `opacity-80` subtitle -- this is the right recipe. See `/workspaces/hey-bradley-core/src/templates/action/ActionGradient.tsx` lines 12-32. This template alone proves the system can produce professional output.

2. **The font pairing is correct.** DM Sans for UI chrome, `var(--theme-font)` for template content, JetBrains Mono for monospace labels. This is a legitimate design system choice. The `tracking-tight` on headings and `leading-relaxed` on body text across templates shows someone understands typographic rhythm. See `/workspaces/hey-bradley-core/src/index.css` line 1 for the import and line 16 for the assignment.

3. **ColumnsGlass uses real glassmorphism correctly.** `backdrop-blur-xl` combined with `rgba(255, 255, 255, 0.05)` backgrounds and `rgba(128,128,128,0.15)` borders. The icon container gets its own `backdrop-blur-sm` layer. This is the correct implementation -- not the fake glassmorphism you see in tutorials where people just add blur without proper layering. See `/workspaces/hey-bradley-core/src/templates/columns/ColumnsGlass.tsx` lines 38-42.

### Top 3 Things That Need Fixing

1. **Every template card uses the exact same spacing formula -- `py-20 px-6` sections with `max-w-6xl` containers and `gap-6` or `gap-7` grids.** There is zero spatial variation between section types. A real agency page alternates between tight-packed sections (py-12) and breathing sections (py-32). The monotonous `py-20` on every single template makes the page feel like a CSS grid demo, not a designed page. See `/workspaces/hey-bradley-core/src/templates/columns/ColumnsGradient.tsx` line 28, `/workspaces/hey-bradley-core/src/templates/columns/ColumnsGlass.tsx` line 28, `/workspaces/hey-bradley-core/src/templates/columns/ColumnsImageCards.tsx` line 35, `/workspaces/hey-bradley-core/src/templates/gallery/GalleryGrid.tsx` line 39 -- all identical `py-20 px-6` or `py-16 px-6`. Every. Single. One.

2. **The card hover effects are amateur-tier.** `hover:shadow-xl` and `hover:scale-105` on gallery images. `hover:shadow-lg` on glass cards. These are the first hover effects every junior developer adds. Linear cards have a subtle background luminance shift. Stripe cards have directional lighting that follows the cursor. Even basic agency work uses `transition-all duration-200` with a border-color change and a `translate-y-[-2px]` lift. The current hovers scream "followed a tutorial." See `/workspaces/hey-bradley-core/src/templates/columns/ColumnsImageCards.tsx` line 44 (`hover:shadow-xl`), `/workspaces/hey-bradley-core/src/templates/gallery/GalleryGrid.tsx` line 47 (`group-hover:scale-105`).

3. **ColumnsImageCards and ColumnsGlass use hardcoded dark-mode-only colors that break on light palettes.** `rgba(255,255,255,0.03)` is invisible on a white background. `border-white/10` is invisible on cream. This is not a palette adaptation issue -- it is a fundamental design system failure. Any agency would reject this in review. The template must use `var(--theme-bg-secondary)` and `var(--theme-border)` exclusively. See `/workspaces/hey-bradley-core/src/templates/columns/ColumnsImageCards.tsx` lines 47-48, `/workspaces/hey-bradley-core/src/templates/columns/ColumnsGlass.tsx` lines 40-41.

### What Would Move This to 90/100

- Replace uniform `py-20 px-6` with section-type-appropriate spacing: hero gets `py-28`, features get `py-16`, CTA gets `py-24`, footer gets `py-12`. Create a spacing map per section type.
- Replace `hover:shadow-xl` / `hover:scale-105` with subtle, premium interactions: border-color transitions, `translate-y-[-1px]` lifts, background luminance shifts using `color-mix`.
- Audit every template file for hardcoded colors. Replace ALL instances of `rgba(255,255,255,...)`, `border-white/`, `text-gray-900`, `bg-white` with CSS variable references. Zero exceptions.
- Add section title/eyebrow typography to Columns, Quotes, Numbers sections. Currently these sections jump straight to cards with no section heading. Every Tailwind UI component has a section title above the grid.
- Add micro-animations: staggered card entry on scroll (IntersectionObserver + `animation-delay`), smooth layout transitions when switching variants.

---

## Persona 2: Professional Web Design Agency Owner

**Score: 52/100**

### Who I Am
I run a 12-person web design agency. We build 4-6 client sites per month. I evaluate tools on whether they would save my team time, whether clients could make their own edits, and whether the output is good enough to charge $5K-$15K per site. I currently use Webflow for custom work and Squarespace for budget clients.

### Top 3 Things Done Well

1. **The ImagePicker is genuinely useful for client work.** 50 curated photos across 9 categories with a clean modal, category sidebar, and thumbnail grid. My junior designers waste 30 minutes per page finding stock photos on Unsplash. Having "Food & Bakery," "Business," "Technology," "People" categories with pre-sized images means they can populate a client mockup in minutes. The video library (10 clips) is small but the pattern is right. See `/workspaces/hey-bradley-core/src/components/right-panel/simple/ImagePicker.tsx` lines 66-125 for the curated library.

2. **The palette preset system covers real client needs.** Midnight for tech startups, Cream for bakeries, Ocean for travel, Rose for beauty brands, Crimson for Harvard/institutional. 10 presets with 6 semantic colors each means my team could start with a preset close to the client's brand and adjust. The visual palette row with color dots and the selected-state left border is clean UX. See `/workspaces/hey-bradley-core/src/components/right-panel/simple/ThemeSimple.tsx` lines 54-65 for presets.

3. **The section management workflow is complete.** Add, remove, reorder (drag + buttons), duplicate, show/hide, select-to-edit. This is the complete CRUD set that a builder needs. The two-click delete confirmation prevents accidents. The hidden sections collapsible group is a nice touch for complex pages. See `/workspaces/hey-bradley-core/src/components/left-panel/SectionsSection.tsx` for the full implementation.

### Top 3 Things That Need Fixing

1. **Only 1 pricing variant. This is a dealbreaker for client work.** Pricing is the most important section on any business website -- it is where conversion happens. Squarespace has 5+ pricing layouts. Webflow templates always include at least 3 pricing variants (simple cards, comparison table, toggle monthly/annual). Having a single `PricingTiers` variant means every client site looks the same in the section that matters most. See `/workspaces/hey-bradley-core/src/components/center-canvas/RealityTab.tsx` lines 317-319 -- only one case, no switch statement.

2. **No custom color picker means I cannot match client brand colors.** If a client's brand color is `#2D5F2D` (forest green), I cannot enter that hex code anywhere. I am limited to the 10 palette presets. Squarespace, Wix, Webflow, and Framer all let you type a hex code. For a demo tool this is understandable, but for client work it is disqualifying. The `ThemeSimple` component shows palette presets with no custom input option. See `/workspaces/hey-bradley-core/src/components/right-panel/simple/ThemeSimple.tsx` -- no color input element exists anywhere in the file.

3. **No export/publish workflow.** After building a page, there is no way to export it as HTML, deploy it, or generate a shareable link. The "Share" button copies the current URL, but that URL is the builder URL, not a published site URL. For client work, I need to hand off either a live URL or clean HTML/CSS. This is not a file issue -- the entire feature is missing from the architecture.

### What Would Move This to 90/100

- Add 3-4 pricing variants: comparison table, cards with monthly/annual toggle, enterprise "Contact Us" tier, minimal single-price.
- Add a hex color input to the palette system. Even a simple text field where users type `#2D5F2D` and it updates the accent color would be transformative.
- Add export: "Download as HTML" that generates a single self-contained HTML file with inline CSS and the current content/images. This is how Carrd works.
- Add a "Duplicate page" or "Save as template" feature so my team can build a base template and clone it for similar clients.
- Add form handling for the newsletter action variant. Currently the email input in `ActionNewsletter.tsx` does nothing. For client work, it needs to at least collect to a mailto: link or a webhook URL field.

---

## Persona 3: Grandma (First-Time User, Making a Cookie Website)

**Score: 45/100**

### Who I Am
I am 68 years old. My grandkids got me a laptop for Christmas. I want to make a little website for my home cookie business so the neighbors can see my flavors and place orders. I have never built a website before. I use Facebook and email, and I once uploaded photos to Walgreens for prints. That is my entire technology experience.

### Top 3 Things Done Well

1. **The picture chooser is wonderful.** When I clicked "Choose a Photo" in the right panel, a nice window popped up with categories -- and there is "Food & Bakery"! I can see bread, cookies, pastries, pizza. I just click one and it goes right into my banner. I do not have to know what a "URL" is or find photos on some other website. My granddaughter would be proud of me. See `/workspaces/hey-bradley-core/src/components/right-panel/simple/ImagePicker.tsx` lines 66-74 -- the Food & Bakery category has 7 relevant images.

2. **The little eye buttons make sense.** I can see an eye icon next to each section. When I click it, the section disappears from the preview. When I click it again, it comes back. I understand this -- it is like hiding something. I do not need to delete it forever, I can just hide it while I work on other things. See `/workspaces/hey-bradley-core/src/components/left-panel/SectionsSection.tsx` lines 218-228 for the eye toggle.

3. **"Main Banner" and "Top Menu" are words I understand.** The left panel says "Main Banner," not "Hero" or "HeroCentered." "Top Menu" makes sense -- that is the thing at the top of every website. "Quotes" is what my happy customers say. I can work with these names. See `/workspaces/hey-bradley-core/src/components/left-panel/SectionsSection.tsx` lines 41-52 for the name map.

### Top 3 Things That Need Fixing

1. **I do not know what "Columns" means for my cookie website.** When I click "Add Section" and see "Columns -- Showcase features side by side," I have no idea what to do with that. My cookies are not "features." I want "My Cookie Flavors" or "What We Offer" or at minimum "Content Cards." And the description says "Showcase product features in columns" -- I do not think of my snickerdoodles as "product features." The word "Columns" means a newspaper column to me, or the columns on a building. See `/workspaces/hey-bradley-core/src/components/left-panel/SectionsSection.tsx` line 47 (`columns: 'Columns'`) and line 58 (`columns: 'Showcase features side by side'`). These need friendlier names.

2. **The right panel is empty when I first open the builder. I do not know what to do.** When the page loads, the right side is blank gray. There is no message saying "Click something to start editing" or "Start here." I stared at it for a full minute before my granddaughter told me to click on "Main Banner" in the left panel. A big friendly arrow or a "Welcome! Click on any section to start editing" message would save me. See `/workspaces/hey-bradley-core/src/components/right-panel/RightPanel.tsx` -- when `selectedContext` is null, the component renders nothing below the tab bar. No empty state guidance exists.

3. **When I scroll down in the preview, I see "Columns" and "Action Block" with placeholder text that says "Feature" and "Description." These are not my words.** The default text should say something like "Your cookie name here" or at minimum "Your title here." Seeing the word "Feature" makes me think this tool is for software companies, not for grandmas with cookies. See `/workspaces/hey-bradley-core/src/templates/columns/ColumnsImageCards.tsx` line 19 (`DEFAULT_TITLES = ['Lightning Fast', 'Pixel Perfect', 'Always Secure']`) -- these are SaaS defaults. None of these words mean anything to me.

### What Would Move This to 90/100

- Rename "Columns" to "Content Cards" or "Showcase" with description "Show your products, services, or ideas side by side."
- Rename "Action Block" to "Call Out" or "Sign-Up Banner" with description "A section that asks visitors to do something, like sign up or order."
- Add a welcome screen / empty state in the right panel: "Welcome to your website builder! Click on 'Main Banner' in the left panel to start editing your page."
- Add a "Website Type" picker at the start: "What kind of website are you making? Restaurant / Bakery / Small Business / Portfolio / Personal." Then pre-fill template text accordingly. Instead of "Lightning Fast," I would see "Chocolate Chip Cookies."
- Make the "Add Section" descriptions say what the section is FOR, not what it IS. "Gallery -- Show photos of your products" not "Gallery -- Image gallery."
- Add a big, obvious "Add my own photo" button with instructions: "Click here to use a photo from your computer." Currently the ImagePicker only has curated stock photos and URL paste. Grandma has cookie photos on her phone that she emailed to herself.

---

## Persona 4: Startup Founder (Building a Landing Page Fast)

**Score: 62/100**

### Who I Am
I am a solo founder. I just raised a $500K pre-seed round. I need a landing page up TODAY so I can start driving traffic from my Product Hunt launch. I am technical (I can write React) but I do not want to. I want to click 10 times, type my headline, pick a color, and have a page live in 15 minutes. I am currently evaluating this against Framer, Carrd, and Typedream.

### Top 3 Things Done Well

1. **The layout card system in the right panel lets me switch hero layouts instantly.** I clicked "Photo Right" and my hero split into text-left, image-right. I clicked "Full Video" and got a video background. 8 hero layouts, 8 column variants -- I can find my look in 30 seconds of clicking. This is faster than Framer where I would be dragging layers around. See `/workspaces/hey-bradley-core/src/components/right-panel/simple/SectionSimple.tsx` lines 19-30 for the 8 hero layouts and `/workspaces/hey-bradley-core/src/components/right-panel/simple/FeaturesSectionSimple.tsx` lines 23-32 for the 8 column variants.

2. **The palette presets give me a dark SaaS look immediately.** I clicked "Midnight" and my page went deep navy with blue accents. Clicked "Neon" and got black with cyan. These are the aesthetics my developer audience expects. Combined with the DM Sans font and the tight tracking on headings, the output passes as a real startup landing page. See `/workspaces/hey-bradley-core/src/components/right-panel/simple/ThemeSimple.tsx` lines 54-65 for the dark-first palette presets.

3. **Undo/redo works.** I changed my headline, did not like it, hit Ctrl+Z, and it reverted. This is basic but critical when you are iterating fast. The TopBar shows undo/redo buttons with proper disabled states. See `/workspaces/hey-bradley-core/src/components/shell/TopBar.tsx` lines 89-106 for undo/redo implementation.

### Top 3 Things That Need Fixing

1. **The pricing section has only 1 variant and it does not have a monthly/annual toggle.** My SaaS has three tiers with monthly and annual pricing. Every competitor landing page has a pricing section with a toggle switch. The single `PricingTiers` variant renders static cards with no toggle. This means I have to build the most important conversion section somewhere else and come back to paste it in -- defeating the entire purpose of a builder. See `/workspaces/hey-bradley-core/src/components/center-canvas/RealityTab.tsx` lines 317-319 -- `if (section.type === 'pricing') return <PricingTiers section={section} />`. One variant. No toggle. No comparison table.

2. **There is no way to publish or deploy.** I built a page that looks decent in 10 minutes. Now what? There is no "Publish" button, no Vercel/Netlify integration, no "Download HTML" option. The "Share" button copies the builder URL -- that shows MY editing interface, not a clean page. Carrd gives me a live URL in 2 clicks. Framer deploys to a subdomain automatically. Without publish, this tool is a fancy mockup generator, not a landing page builder. The TopBar has Preview/Edit toggle and Share, but no publish/deploy action. See `/workspaces/hey-bradley-core/src/components/shell/TopBar.tsx` -- no publish function exists.

3. **The newsletter/email capture action variant has a non-functional input.** The `ActionNewsletter` template renders an email input and a "Subscribe" button, but neither does anything. There is no form handler, no webhook URL field, no Mailchimp integration, not even a `mailto:` link. For my Product Hunt launch, I need to capture emails from day one. A pretty input that collects nothing is worse than no input at all. See `/workspaces/hey-bradley-core/src/templates/action/ActionNewsletter.tsx` lines 24-43 -- the input and button are purely decorative.

### What Would Move This to 90/100

- Add 3 pricing variants: (1) toggle monthly/annual with highlighted "popular" tier, (2) comparison table with checkmarks, (3) single-price "pay once" card.
- Add one-click publish to a `*.heybradley.dev` subdomain or export as static HTML + CSS.
- Wire the newsletter input to a configurable webhook URL (Zapier, Make, or direct Mailchimp). At minimum, add a right-panel field where I type my form endpoint URL.
- Add an analytics/tracking section in the right panel: "Paste your Google Analytics ID" or "Add your Meta Pixel."
- Add SEO fields: page title, meta description, Open Graph image. These are the first things I configure on any landing page.
- Add a "Duplicate Section" button that is more prominent. I want to quickly duplicate my best-looking feature card 3 times and edit the text.

---

## Summary

### Average Score Across 4 Personas

| Persona | Score |
|---------|-------|
| Agency Designer | 58/100 |
| Agency Owner | 52/100 |
| Grandma | 45/100 |
| Startup Founder | 62/100 |
| **Average** | **54/100** |

The previous internal review scored 68/100. The multi-persona average is 54/100. The gap exists because the internal review weighted architectural quality and code cleanliness, which are invisible to end users. When scored purely on "would this person use this tool and recommend it," the number drops significantly. The builder is a strong engineering artifact that is not yet a strong product.

---

### Top 10 Improvements Ranked by Impact

| # | Improvement | Impact | Effort | Personas Helped | Key Files |
|---|-------------|--------|--------|-----------------|-----------|
| 1 | **Add 3+ pricing variants** (toggle, comparison table, enterprise) | +8 pts | Large (2 days) | Agency Owner, Founder | New files in `/src/templates/pricing/`, update `RealityTab.tsx` switch |
| 2 | **Add publish/export** (static HTML download or deploy to subdomain) | +7 pts | Large (3-5 days) | Agency Owner, Founder | New feature -- export service, TopBar publish button |
| 3 | **Add empty state in right panel** with welcome guidance | +5 pts | Quick fix (1 hour) | Grandma, Founder | `/src/components/right-panel/RightPanel.tsx` line 57 |
| 4 | **Fix all hardcoded dark-only colors in templates** to use CSS variables | +5 pts | Medium (4 hours) | Agency Designer, Agency Owner | `/src/templates/columns/ColumnsImageCards.tsx` lines 47-48, `/src/templates/columns/ColumnsGlass.tsx` lines 40-41, audit all 38 templates |
| 5 | **Rename "Columns" to "Content Cards"** and fix all section descriptions to be human-friendly | +4 pts | Quick fix (30 min) | Grandma | `/src/components/left-panel/SectionsSection.tsx` lines 44-65 |
| 6 | **Add custom hex color input** to the palette system | +4 pts | Medium (3 hours) | Agency Owner, Agency Designer | `/src/components/right-panel/simple/ThemeSimple.tsx` -- add input below palette presets |
| 7 | **Replace uniform section spacing** with section-type-appropriate padding | +4 pts | Medium (2 hours) | Agency Designer | All template files -- change `py-20 px-6` to per-type values |
| 8 | **Add contextual default content** per theme/industry instead of "Lightning Fast" / "Feature" | +4 pts | Medium (4 hours) | Grandma, Agency Owner | `/src/templates/columns/ColumnsImageCards.tsx` lines 19-24, all template DEFAULT_ arrays |
| 9 | **Wire newsletter form** to configurable webhook/email endpoint | +3 pts | Medium (3 hours) | Founder | `/src/templates/action/ActionNewsletter.tsx` lines 24-43, add webhook field to right panel |
| 10 | **Add section title/heading** above card grids in Columns, Quotes, Numbers templates | +3 pts | Quick fix (2 hours) | Agency Designer | All grid-based templates -- add optional h2 above the grid |

---

### Estimated Effort Key

- **Quick fix**: Under 2 hours, no architectural changes
- **Medium**: 2-6 hours, may require new components or data fields
- **Large**: 1-5 days, requires new features or significant refactoring

---

### Which 5 Changes Would Have the Biggest Impact on Score

These 5 changes, done in order, would move the average from 54 to approximately 72:

1. **Add right panel empty state with welcome message** (Quick fix, +5 pts) -- Every persona benefits. Grandma goes from confused to guided. Founder wastes less time figuring out the tool. This is the single highest ROI change because it costs 1 hour and helps everyone.

2. **Fix hardcoded dark-only colors in templates** (Medium, +5 pts) -- The Agency Designer and Agency Owner both scored this as a credibility-destroying issue. When someone picks the Cream palette and sees invisible cards, they close the tab. This fix makes the entire palette system actually work.

3. **Add 3 pricing variants** (Large, +8 pts) -- The Agency Owner and Founder both listed this as their number one complaint. Pricing is the highest-conversion section on any business site. Having 1 variant when every other section has 4-8 makes the builder feel incomplete at the worst possible moment.

4. **Rename sections and fix descriptions** (Quick fix, +4 pts) -- "Columns" to "Content Cards," "Action Block" to "Call to Action," and fix the leaked "CTA" jargon in descriptions. This costs 30 minutes and makes the Grandma score jump from 45 to ~52.

5. **Add contextual default content** (Medium, +4 pts) -- Replace "Lightning Fast" / "Pixel Perfect" / "Always Secure" with "Your First Feature" / "Your Second Feature" / "Your Third Feature" at minimum, or industry-specific text per theme. This affects every persona's first impression of the output quality.

**Combined estimated effort for all 5: approximately 3-4 days of focused work.**
**Projected score after all 5: 72/100** (from 54 average)

---

### Honest Bottom Line

The builder has strong engineering bones: clean component architecture, proper state management (Zustand), a real design token system (`hb-*` variables + `--theme-*` variables), and a curated asset library. The code is well-organized and the 38 template variants render without crashes.

But it is still a developer's tool wearing a user's skin. The vocabulary, the empty states, the default content, and the missing publish workflow all reveal that the builder was built from the inside out (code-first) rather than from the outside in (user-first). The Agency Designer sees uniform spacing and tutorial-grade hover effects. The Agency Owner sees a missing pricing section and no export. Grandma sees words she does not understand and no guidance. The Founder sees no way to go live.

The gap from 54 to 90 is approximately 10 days of focused UI/UX work. The gap from 54 to 72 is approximately 4 days. For the capstone demo, targeting 72 with the 5 high-impact changes above is the pragmatic path.
