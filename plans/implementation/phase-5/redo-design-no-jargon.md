# Hey Bradley — Section System Redesign: Visual-First, Agency Quality

**Priority:** P0 — The current sections don't work visually and use developer jargon  
**Supersedes:** All previous section naming and variant specifications

---

## 1. THE PROBLEM

Three intertwined issues:

**Naming:** "Hero," "CTA," "Value Props," "FAQ" — these are developer terms. Grandma doesn't know what "CTA" means. But "Hero" IS widely known. The fix isn't renaming everything — it's using **hybrid names** that work for both audiences.

**Variants:** Each section has 1-2 variants, most don't work. The layout selector shows options but clicking them does nothing, or produces broken layouts. Need 8 working variants per section with visual thumbnails.

**Visual quality:** The current section renderers produce plain text blocks. No images in feature cards, no visual variety, no card styling. Compare to Squarespace or Framer's section blocks — they look like designed marketing pages, not developer prototypes.

---

## 2. ADR-023: SECTION NAMING — HYBRID APPROACH

**Decision:** Use names that are understood by both grandma AND professionals. Some sections keep their industry name (Hero, Footer). Others get renamed to describe what they DO, not what marketers call them.

**Context:** "CTA" means nothing to a normal person. But "Hero" is widely understood — even non-technical people know "the big part at the top." The fix is selective renaming, not blanket replacement.

| Current Name | New Name | Why |
|-------------|----------|-----|
| Hero | **Hero** (keep) | Widely understood. "The main banner at the top." |
| Features | **Columns** | More accurate — it's content arranged in 2-4 columns. Could be features, services, team members, anything. |
| Pricing | **Pricing** (keep) | Self-explanatory. Everyone knows what pricing is. |
| CTA / Call to Action | **Action** | Short, clear. "The section that asks people to do something." |
| Footer | **Footer** (keep) | Universal — everyone knows the bottom of the page. |
| Testimonials | **Quotes** | Simpler. "What people say about you." |
| FAQ | **Questions** | Friendlier than the acronym "FAQ." |
| Value Props | **Numbers** | The section that shows big numbers/stats. "100+ Happy Clients." |
| Navbar | **Menu** (keep as "Top Menu" in UI) | Everyone understands a menu. |
| *(new)* | **Gallery** | Image/video showcase. Missing from current system. |

**Total: 10 section types** (was 9, added Gallery)

**Consequence:** Section type strings in JSON change. Theme JSONs need updating. All renderers, editors, and references update.

---

## 3. ADR-024: LAYOUT VARIANTS — 8 PER SECTION, VISUAL THUMBNAILS

**Decision:** Every section type has up to 8 layout variants. Each variant is a visually distinct card style/arrangement shown as a clickable thumbnail in the right panel. Column count (2/3/4) is a SEPARATE control from layout variant.

**Context:** Currently, variants and column count are conflated. "FeaturesGrid3" is a variant name that encodes both the style (grid) and the column count (3). These should be independent: pick a card style (with image, minimal, gradient, etc.) THEN pick how many columns.

**Two independent controls:**

```
LAYOUT VARIANT (pick one of 8):
  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ Cards   │ │ Minimal │ │ Icons   │ │ Images  │
  └─────────┘ └─────────┘ └─────────┘ └─────────┘
  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
  │Bordered │ │Gradient │ │ Glass   │ │ Stacked │
  └─────────┘ └─────────┘ └─────────┘ └─────────┘

COLUMNS (pick one):
  [2]  [3]  [4]
  
  (All become 1 column on mobile automatically)
```

**Consequence:** Each section type needs up to 8 renderer variants + a column selector. The JSON stores `variant` (style) and `columns` (count) separately.

---

## 4. THE 10 SECTIONS — COMPLETE SPECIFICATION

### 4.1 Hero (Keep Name)

The main banner at the top. Already has 5 layout variants. Expand to 8:

| # | Variant | Description | Image Treatment |
|---|---------|-------------|-----------------|
| 1 | Centered | Text centered, image below | Image below content |
| 2 | Split Right | Text left, image right (50/50) | Right column |
| 3 | Split Left | Image left, text right (50/50) | Left column |
| 4 | Full Background | Full-bleed background image, text overlay | Background with overlay |
| 5 | Minimal | Text only, max whitespace, no image | None |
| 6 | Video Background | Autoplay video behind text overlay | Background video |
| 7 | Cards | Text with floating product/app cards | Floating card elements |
| 8 | Gradient | Bold gradient background, centered text | CSS gradient |

No column selector (Hero is always full-width).

### 4.2 Columns (Renamed from "Features")

Content arranged in 2-4 columns. Could be features, services, team members, benefits.

| # | Variant | Description |
|---|---------|-------------|
| 1 | **Cards** | Bordered cards with icon + title + description |
| 2 | **Image Cards** | Cards with image on top + title + description |
| 3 | **Icon + Text** | Large icon centered above text, no card border |
| 4 | **Minimal** | Title + description only, no icon, no border |
| 5 | **Numbered** | Large number (01, 02, 03) + title + description |
| 6 | **Horizontal** | Icon/image left, text right, in rows not grid |
| 7 | **Gradient Cards** | Cards with gradient background fill |
| 8 | **Glass** | Cards with glass/blur effect background |

**Column selector:** [2] [3] [4] — default 3

**Each card supports:** Icon (from Lucide set), Image URL, Title, Description, Optional link

### 4.3 Pricing (Keep Name)

| # | Variant |
|---|---------|
| 1 | **Simple Cards** — Side by side tier cards |
| 2 | **Highlighted** — Middle tier emphasized larger |
| 3 | **Horizontal** — Tiers stacked vertically |
| 4 | **Compact** — Minimal, one-line per feature |
| 5 | **Toggle** — Monthly/Yearly toggle |
| 6 | **Comparison Table** — Feature comparison grid |
| 7 | **Single Plan** — One plan highlighted, CTA prominent |
| 8 | **Enterprise** — Contact us style, no public pricing |

**Column selector:** [2] [3] [4] — default 3

### 4.4 Action (Renamed from "CTA")

The section that asks visitors to do something.

| # | Variant |
|---|---------|
| 1 | **Centered** — Heading + button, centered |
| 2 | **Split** — Text left, button/form right |
| 3 | **Background Image** — Full-bleed image with overlay text |
| 4 | **Gradient** — Bold gradient background |
| 5 | **Newsletter** — Email input + submit button |
| 6 | **App Download** — App store badges + phone mockup |
| 7 | **Minimal** — Single line with inline button |
| 8 | **Video** — Background video with overlay CTA |

No column selector (Action is always full-width).

### 4.5 Quotes (Renamed from "Testimonials")

What people say about you.

| # | Variant |
|---|---------|
| 1 | **Cards** — Photo + quote + name/role per card |
| 2 | **Single Quote** — One large quote, centered, rotating |
| 3 | **Minimal** — Text only, no photos |
| 4 | **Rating Stars** — Cards with star ratings |
| 5 | **Logo + Quote** — Company logo above each quote |
| 6 | **Carousel** — Horizontal scroll/swipe |
| 7 | **Grid** — Masonry-style mixed-size cards |
| 8 | **Video** — Video testimonial thumbnails |

**Column selector:** [2] [3] [4] — default 3

### 4.6 Questions (Renamed from "FAQ")

Questions & Answers section.

| # | Variant |
|---|---------|
| 1 | **Accordion** — Click to expand/collapse answers |
| 2 | **Two Column** — Questions left, selected answer right |
| 3 | **Cards** — Each Q&A as a card |
| 4 | **Tabs** — Category tabs with questions per tab |
| 5 | **Search** — Search bar above accordion |
| 6 | **Numbered** — Numbered questions list |
| 7 | **Minimal** — Simple text list, no styling |
| 8 | **Grid** — Q&A pairs in 2-3 column grid |

### 4.7 Numbers (Renamed from "Value Props")

Big numbers and statistics that build trust.

| # | Variant |
|---|---------|
| 1 | **Counters** — Large numbers with labels ("100+ Happy Clients") |
| 2 | **Icons + Numbers** — Icon above each counter |
| 3 | **Cards** — Each stat in a card |
| 4 | **Horizontal Bar** — Stats in a single horizontal bar |
| 5 | **Timeline** — Numbers along a timeline |
| 6 | **Circular** — Numbers inside circular progress indicators |
| 7 | **Gradient Cards** — Stats on gradient background cards |
| 8 | **Minimal** — Numbers and labels only, no decoration |

**Column selector:** [2] [3] [4] — default 4

### 4.8 Gallery (NEW)

Image and video showcase.

| # | Variant |
|---|---------|
| 1 | **Grid** — Equal-size image grid |
| 2 | **Masonry** — Pinterest-style mixed sizes |
| 3 | **Carousel** — Horizontal scroll slider |
| 4 | **Lightbox** — Click to enlarge |
| 5 | **Full Width** — One large image/video per row |
| 6 | **Split** — Large image left, smaller grid right |
| 7 | **Video** — Video thumbnails with play button |
| 8 | **Before/After** — Slider comparison |

**Column selector:** [2] [3] [4] — default 3

### 4.9 Menu (Renamed from "Navbar")

Top navigation. Keep current implementation, add variants:

| # | Variant |
|---|---------|
| 1 | **Simple** — Logo + links + CTA button |
| 2 | **Centered** — Logo centered, links split left/right |
| 3 | **Transparent** — No background, overlays hero |
| 4 | **Dark** — Dark background regardless of theme |

No column selector.

### 4.10 Footer (Keep Name)

| # | Variant |
|---|---------|
| 1 | **Multi-Column** — Logo + 3-4 link columns + social |
| 2 | **Simple** — Copyright + links in one line |
| 3 | **Newsletter** — Email signup + links |
| 4 | **Minimal** — Copyright only |
| 5 | **Dark** — Dark background regardless of theme |
| 6 | **Cards** — Contact info in card blocks |

No column selector.

---

## 5. VISUAL DESIGN REQUIREMENTS

### 5.1 All Section Renderers Must:

- Use theme palette colors (6-slot system — no hardcoded hex)
- Use theme font family
- Include real Unsplash placeholder images (not empty boxes)
- Have proper responsive behavior (1 column on mobile)
- Have consistent spacing (use theme spacing values)
- Look like they came from Squarespace or Framer, not a developer prototype

### 5.2 Image Selector for All Sections

Every section variant that includes images must have an image selector in the SIMPLE editor:

```
MEDIA
┌──────┐
│ img  │ Feature Image 1
└──────┘ Click to change
┌──────┐
│ img  │ Feature Image 2  
└──────┘ Click to change
```

For now: clicking opens a text input for URL. Future: opens a gallery dialog with Unsplash thumbnails.

### 5.3 Video Selector

Sections with video support (Hero variant 6, Gallery variant 7, Action variant 8) must have a video URL input with a preview thumbnail when a valid URL is entered.

---

## 6. SWARM EXECUTION

### Step 1: Research + ADRs (No Code)

1. Save ADR-023 (Hybrid Naming) and ADR-024 (8 Variants + Column Selector) to `docs/adrs/`
2. Web search Tailwind UI, shadcn/ui, and Framer section block designs for visual references
3. Document 3 reference screenshots per section type in `docs/research/section-design-research.md`

### Step 2: Rename All Sections

Update section type strings across: JSON files, Zod schemas, renderers, editors, left panel labels, theme JSONs. This is a mechanical find-and-replace:
- `features` → `columns`
- `cta` → `action`
- `testimonials` → `quotes`
- `faq` → `questions`
- `value-props` → `numbers`
- `navbar` → `menu`
- Add `gallery` type

### Step 3: Build Column Selector

Add a column count control (2/3/4 buttons) to the SIMPLE editor for: Columns, Pricing, Quotes, Numbers, Gallery. This is independent of the variant selector. Store as `section.columns` in the JSON.

### Step 4: Build Variant Renderers

For each section type, build up to 8 variant renderers. Start with the 3 most visually different per section. Priority order:
1. **Columns** — Cards, Image Cards, Icon + Text (these are the most visible)
2. **Hero** — already has 5, add Video Background, Cards, Gradient
3. **Quotes** — Cards, Single Quote, Rating Stars
4. **Action** — Centered, Split, Gradient
5. **Questions** — Accordion (done), Two Column, Cards
6. Remaining sections

### Step 5: Screenshot + Playwright

Screenshot every variant of every section. Verify:
- Each variant produces a visually distinct layout
- Column selector changes the number of columns
- Images render from URLs
- Theme colors apply correctly
- Mobile responsive (1 column)

---

## 7. VERIFICATION

| # | Check | Severity |
|---|-------|----------|
| 1 | All 10 section types render without errors | P0 |
| 2 | Hybrid names used in all user-facing UI | P0 |
| 3 | At least 3 working variants per section | P0 |
| 4 | Column selector (2/3/4) works for applicable sections | P0 |
| 5 | All variants have visual thumbnails in right panel | P1 |
| 6 | Images render from Unsplash URLs in all image variants | P0 |
| 7 | Video URL input works for video variants | P1 |
| 8 | Theme colors apply to all variants | P0 |
| 9 | Mobile responsive (1 column on 375px) | P1 |
| 10 | Playwright screenshots all variants | P1 |

---

*Sections are the product. If they don't look like Squarespace quality, nothing else matters. Rename them so grandma understands. Give them 8 visual options so every site looks different. Separate column count from card style. Include images everywhere.*