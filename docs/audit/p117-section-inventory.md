# P117/A1 — Section Inventory + Per-Section Scoring

> Read-only audit. Source files inspected: `src/lib/schemas/section.ts` · `src/templates/<type>/*.tsx` · `src/components/right-panel/SimpleTab.tsx` + `simple/*` · `src/components/center-canvas/RealityTab.tsx` · `src/components/shared/InlineEditable.tsx` · `src/lib/sectionTypeSwap.ts` · `src/contexts/intelligence/aisp/{intentAtom,decompAtom,assumptions}.ts` · `src/data/examples/*.json` (64 sites). No source modified.

## TL;DR

- **Two render-broken section types ship dead** — `case-study` and `contact-form` have dedicated `Simple` editors AND template variants on disk, BUT (a) `RealityTab.tsx` has no `case 'case-study' | 'contact-form'` branch — they fall through to an empty `<div>`, and (b) `SimpleTab.tsx` lacks the routing case so the editor never opens. 20 of 64 example sites declare these types — they all render blank in the canvas.
- **Strongest 3 (composite ≥ 8.5):** `hero` (8.8), `footer` (8.6), `text` (8.6) — InlineEditable, 3+ variants, full chat/listen cue coverage, used in 58 of 64 demos.
- **Weakest 3 (composite ≤ 5.5):** `contact-form` (3.8), `case-study` (4.0), `divider` (5.4) — first two are render-broken, divider has no chat/listen cues at all.
- **Severity tally:** 2 P1 (case-study + contact-form render path) · 7 P2 (single-variant logos/team gaps + missing chat cues for image/divider/numbers + section-type swap matrix only covers 4 of 18 types) · 6 P3 (variant gaps for case-study + contact-form + decorative-only divider polish + InlineEditable hero-only).
- **Inline edit reach: 1 of 18** — only hero (HeroSplit + HeroCentered) consumes `InlineEditable`. Text/quotes/columns headlines still require right-panel round-trip.

## 5-Row Summary Table

Sorted by Composite ascending. Q = Quality, C = Chat ease, L = Listen ease, B = Builder ease, D = Design. All scores 1-10.

| Section Type | Variants | Q | C | L | B | D | Composite | Severity |
|---|---|---|---|---|---|---|---|---|
| `contact-form` | 1 (ContactFormSimple) | 5 | 4 | 3 | 4 | 3 | **3.8** | **P1** render path missing in RealityTab |
| `case-study` | 1 (CaseStudyCards) | 6 | 5 | 4 | 4 | 1 | **4.0** | **P1** render path + SimpleTab routing missing |
| `divider` | 3 (Line, Space, Decorative) | 7 | 3 | 3 | 7 | 7 | **5.4** | P2 zero chat/listen cues; used in 1 of 64 sites |
| `logos` | 3 (Simple, Marquee, Grid) | 7 | 6 | 6 | 7 | 7 | **6.6** | P2 sparse cue table; used in 3 of 64 sites |
| `image` | 4 (FullWidth, WithText, Overlay, Parallax) | 8 | 5 | 5 | 7 | 9 | **6.8** | P2 no SECTION_CUES entry; lightbox + ImageFallback land via P115 |
| `numbers` | 4 (Counters, Icons, Cards, Gradient) | 8 | 6 | 6 | 7 | 8 | **7.0** | P2 no SECTION_CUES entry; "stats" alias only |
| `team` | 3 (Cards, Grid, Minimal) | 7 | 7 | 7 | 7 | 8 | **7.2** | P2 only 10 of 64 sites use it; copy patterns shallow |
| `gallery` | 4 (Grid, Masonry, Carousel, FullWidth) | 8 | 7 | 7 | 7 | 8 | **7.4** | P3 carousel a11y not verified at this audit |
| `blog` | 4 (CardGrid, FeaturedGrid, ListExcerpts, Minimal) | 8 | 8 | 7 | 7 | 8 | **7.6** | P3 chat-blog 7.0 vs listen-blog 9.5 (P113 finding still open) |
| `questions` | 4 (Accordion, Cards, Numbered, TwoCol) | 8 | 8 | 7 | 8 | 8 | **7.8** | P3 used in only 6 of 64 sites |
| `quotes` | 4 (Cards, Single, Stars, Minimal) | 8 | 8 | 8 | 8 | 8 | **8.0** | clean |
| `pricing` | 3 (Tiers, Toggle, Comparison) | 8 | 8 | 8 | 8 | 8 | **8.0** | clean |
| `menu` | 2 (NavbarSimple, NavbarCentered) | 8 | 8 | 8 | 8 | 8 | **8.0** | navbar→menu alias well-covered |
| `action` | 4 (Centered, Split, Gradient, Newsletter) | 8 | 8 | 8 | 8 | 9 | **8.2** | clean |
| `columns` | 8 (Cards, Glass, Gradient, Horizontal, IconText, ImageCards, Minimal, Numbered) | 9 | 8 | 8 | 8 | 9 | **8.4** | richest variant set in the library |
| `text` | 3 (Single, TwoColumn, WithSidebar) | 9 | 8 | 8 | 8 | 9 | **8.6** | P115 typography lift landed; 58 of 64 sites use |
| `footer` | 4 (Simple, Minimal, MultiColumn, SimpleBar) | 9 | 8 | 8 | 9 | 9 | **8.6** | clean; 58 of 64 sites |
| `hero` | 4 (Centered, Split, Overlay, Minimal) | 9 | 9 | 9 | 9 | 9 | **8.8** | InlineEditable wired post-P116; 58 of 64 sites |

## Per-Section Detail (18 sections)

### `hero`
- **Variants:** HeroCentered, HeroSplit, HeroOverlay, HeroMinimal (4) · 8 layout presets in SectionSimple
- **Quality:** 9/10 — token-compliant, ARIA full, ImagePicker on backgroundImage, video routing at SectionSimple.tsx:84
- **Chat ease:** 9/10 — "make hero brighter", "change the headline" → SECTION_CUES has hero/banner/top/headline/header
- **Listen ease:** 9/10 — voice → cleanTranscript → INTENT_ATOM resolves
- **Builder ease:** 9/10 — InlineEditable wired on headline+subhead (HeroSplit + HeroCentered) post-P116
- **Design:** 9/10 — bg image / bg video / split-left/right / minimal / overlay all present
- **Composite:** 8.8/10
- **Gaps:** [P3] InlineEditable not extended to other content slots (eyebrow, CTA labels) yet — carry-forward CF-P116-1.

### `menu`
- **Variants:** NavbarSimple, NavbarCentered (2)
- **Quality:** 8/10 — render path live at RealityTab.tsx:427-433; alias `navbar`/`nav`/`navigation` → `menu` via validateSectionType
- **Chat ease:** 8/10 — "add nav", "change menu" both resolve via alias map
- **Listen ease:** 8/10 — same alias coverage
- **Builder ease:** 8/10 — NavbarSectionSimple editor wired in SimpleTab.tsx:54
- **Design:** 8/10 — only 2 variants vs 4 for most types; no transparent/sticky variants
- **Composite:** 8.0/10
- **Gaps:** [P3] sticky / transparent-on-scroll variant absent.

### `columns`
- **Variants:** ColumnsCards, ColumnsGlass, ColumnsGradient, ColumnsHorizontal, ColumnsIconText, ColumnsImageCards, ColumnsMinimal, ColumnsNumbered (8) — richest variant set
- **Quality:** 9/10 — heavy variant coverage, token-compliant
- **Chat ease:** 8/10 — SECTION_CUES has feature/capability; "value-props" alias also remaps here per P106 reconciliation
- **Listen ease:** 8/10 — same coverage
- **Builder ease:** 8/10 — FeaturesSectionSimple wired
- **Design:** 9/10 — Glass/Gradient give modern feel
- **Composite:** 8.4/10
- **Gaps:** [P3] icon picker not exposed in SimpleTab; bento-grid variant absent.

### `pricing`
- **Variants:** PricingTiers, PricingToggle, PricingComparison (3)
- **Quality:** 8/10 — toggle is monthly/annual; comparison is feature matrix
- **Chat ease:** 8/10 — "add pricing", "show pricing" → SECTION_CUES hits
- **Listen ease:** 8/10 — same
- **Builder ease:** 8/10 — PricingSectionSimple wired
- **Design:** 8/10 — 18 of 64 sites use it (mostly SaaS templates)
- **Composite:** 8.0/10
- **Gaps:** [P3] no usage-based pricing variant ($/seat slider).

### `action`
- **Variants:** ActionCentered, ActionSplit, ActionGradient, ActionNewsletter (4)
- **Quality:** 8/10 — token-compliant; newsletter variant has email input
- **Chat ease:** 8/10 — "cta" alias → action; SECTION_CUES has cta/call to action/button
- **Listen ease:** 8/10 — same alias coverage
- **Builder ease:** 8/10 — CTASectionSimple wired
- **Design:** 9/10 — gradient + newsletter add range
- **Composite:** 8.2/10
- **Gaps:** [P3] no countdown-CTA variant; newsletter doesn't actually wire to a backend (open-core honest limit).

### `footer`
- **Variants:** FooterSimple, FooterMinimal, FooterMultiColumn, FooterSimpleBar (4)
- **Quality:** 9/10 — 4 variants cover SaaS / blog / brochure / minimal aesthetics
- **Chat ease:** 8/10 — SECTION_CUES has footer/bottom
- **Listen ease:** 8/10 — same
- **Builder ease:** 9/10 — FooterSectionSimple wired
- **Design:** 9/10 — used in 58 of 64 sites; consistently strong
- **Composite:** 8.6/10
- **Gaps:** none P1 or P2.

### `quotes`
- **Variants:** QuotesCards, QuotesSingle, QuotesStars, QuotesMinimal (4)
- **Quality:** 8/10 — token-compliant; star variant has visual rating
- **Chat ease:** 8/10 — "testimonial"/"testimonials"/"pull-quote" alias → quotes; SECTION_CUES has testimonial/quote/review
- **Listen ease:** 8/10 — same
- **Builder ease:** 8/10 — TestimonialsSectionSimple wired
- **Design:** 8/10 — single variant has nice large pull-quote layout
- **Composite:** 8.0/10
- **Gaps:** [P3] sectionTypeSwap matrix includes quotes — good; video-testimonial variant absent.

### `questions`
- **Variants:** QuestionsAccordion, QuestionsCards, QuestionsNumbered, QuestionsTwoCol (4)
- **Quality:** 8/10 — accordion uses `<details>` element (a11y default keyboard support)
- **Chat ease:** 8/10 — "faq" alias → questions; SECTION_CUES has faq/question/q&a
- **Listen ease:** 7/10 — alias works but "frequently asked questions" full phrase not tested
- **Builder ease:** 8/10 — FAQSectionSimple wired
- **Design:** 8/10 — accordion is most common; numbered variant adds visual interest
- **Composite:** 7.8/10
- **Gaps:** [P3] only 6 of 64 sites use it — corpus under-represents.

### `numbers`
- **Variants:** NumbersCounters, NumbersIcons, NumbersCards, NumbersGradient (4)
- **Quality:** 8/10 — counters animate; gradient looks modern
- **Chat ease:** 6/10 — NO entry in SECTION_CUES — only "stats" alias in validateSectionType; "add metrics", "add KPIs" miss entirely
- **Listen ease:** 6/10 — same
- **Builder ease:** 7/10 — ValuePropsSectionSimple wired (cross-named — minor cognitive burden)
- **Design:** 8/10 — gradient + counters give wow
- **Composite:** 7.0/10
- **Gaps:** [P2] add SECTION_CUES entry: `numbers: ['stat','stats','metric','metrics','number','numbers','kpi']`; [P3] sectionTypeSwap matrix includes numbers — good.

### `gallery`
- **Variants:** GalleryGrid, GalleryMasonry, GalleryCarousel, GalleryFullWidth (4)
- **Quality:** 8/10 — token-compliant; lightbox via P115 ImageFallback shared helper
- **Chat ease:** 7/10 — "add gallery" hits via type-name fallback (line 100 of assumptions.ts: `cues = SECTION_CUES[type] ?? [type]`); no synonym list (e.g. "photos", "portfolio shots")
- **Listen ease:** 7/10 — same
- **Builder ease:** 7/10 — GallerySectionSimple wired with library-only ImagePicker per P114 fix
- **Design:** 8/10 — masonry + carousel give variety
- **Composite:** 7.4/10
- **Gaps:** [P3] carousel a11y (keyboard nav, ARIA live region for slide change) not verified in this audit pass.

### `logos`
- **Variants:** LogosSimple, LogosMarquee, LogosGrid (3)
- **Quality:** 7/10 — marquee animates via CSS keyframes (no library dep)
- **Chat ease:** 6/10 — type-name fallback only ("add logos"); no "client logos", "trusted by" cues
- **Listen ease:** 6/10 — same
- **Builder ease:** 7/10 — LogosSectionSimple wired with library-only ImagePicker per P114 fix
- **Design:** 7/10 — only 3 variants; corpus uses in 3 of 64 sites
- **Composite:** 6.6/10
- **Gaps:** [P2] add SECTION_CUES entry: `logos: ['logo','logos','client','trusted by','partners']`; [P3] grayscale-on-hover missing as a per-section knob.

### `team`
- **Variants:** TeamCards, TeamGrid, TeamMinimal (3)
- **Quality:** 7/10 — token-compliant; bio text length not enforced
- **Chat ease:** 7/10 — SECTION_CUES has team/about us/people
- **Listen ease:** 7/10 — same
- **Builder ease:** 7/10 — TeamSectionSimple wired with library-only ImagePicker per P114 fix
- **Design:** 8/10 — cards + grid + minimal cover most use cases
- **Composite:** 7.2/10
- **Gaps:** [P3] only 10 of 64 sites use it; team-with-roles variant absent.

### `image`
- **Variants:** ImageFullWidth, ImageWithText, ImageOverlay, ImageParallax (4)
- **Quality:** 8/10 — ImageFallback + useImageError shared helpers landed P115
- **Chat ease:** 5/10 — NO SECTION_CUES entry; "add image", "add photo" hit type-name only; no "picture", "screenshot", "photo" synonyms
- **Listen ease:** 5/10 — same
- **Builder ease:** 7/10 — ImageSectionSimple wired with library-only ImagePicker per P114 fix
- **Design:** 9/10 — parallax + overlay + with-text give strong design range; click→lightbox default per P115
- **Composite:** 6.8/10
- **Gaps:** [P2] add SECTION_CUES entry: `image: ['image','photo','picture','screenshot','figure']`; sectionTypeSwap matrix includes image (good).

### `divider`
- **Variants:** DividerLine, DividerSpace, DividerDecorative (3)
- **Quality:** 7/10 — DividerDecorative is SVG ornament; spacer is just height
- **Chat ease:** 3/10 — NO SECTION_CUES entry; "add divider", "add spacer" hit only via type-name fallback; "break", "section break" miss entirely
- **Listen ease:** 3/10 — same
- **Builder ease:** 7/10 — DividerSectionSimple wired
- **Design:** 7/10 — decorative variant has 3-4 ornament options
- **Composite:** 5.4/10
- **Gaps:** [P2] add SECTION_CUES entry: `divider: ['divider','spacer','break','separator','space']`; only 1 of 64 sites uses divider — corpus under-uses.

### `text`
- **Variants:** TextSingle, TextTwoColumn, TextWithSidebar (3)
- **Quality:** 9/10 — typography lift per P115/ADR-143 (17px body, 1.7 line-height, 68ch max-width, drop-cap on first ¶ ≥120 chars)
- **Chat ease:** 8/10 — SECTION_CUES via assumptions.ts — `'article'` and `'long-form'` aliases → text via validateSectionType; "add text", "add article" both hit
- **Listen ease:** 8/10 — same
- **Builder ease:** 8/10 — TextSectionSimple wired; sectionTypeSwap matrix includes text (great — swap quotes ↔ text supported)
- **Design:** 9/10 — sidebar variant is editorial-grade
- **Composite:** 8.6/10
- **Gaps:** none P1 or P2.

### `blog`
- **Variants:** BlogCardGrid, BlogFeaturedGrid, BlogListExcerpts, BlogMinimal (4)
- **Quality:** 8/10 — author·date·readTime metadata strip + category chip per P115/ADR-143
- **Chat ease:** 8/10 — SECTION_CUES has blog/article/post/news (also `article`/`long-form` aliases coexist with text — slight ambiguity acknowledged)
- **Listen ease:** 7/10 — same; chat-blog quality 7.0/10 vs listen-blog 9.5/10 per P113 retro is the residual gap
- **Builder ease:** 7/10 — BlogSectionSimple wired with library-only ImagePicker per P114 fix
- **Design:** 8/10 — 4 variants cover newsletter / magazine / minimal use cases
- **Composite:** 7.6/10
- **Gaps:** [P3] chat-blog quality gap remains open per P113 carry-forward.

### `case-study`
- **Variants:** CaseStudyCards (1)
- **Quality:** 6/10 — single variant; metric callout + before/after structure landed P115/ADR-143
- **Chat ease:** 5/10 — NO SECTION_CUES entry; NO alias in validateSectionType; "add case study" hits only via canonical-type-name fallback (cue array `[type]` per assumptions.ts:100)
- **Listen ease:** 4/10 — same
- **Builder ease:** 4/10 — **CaseStudySectionSimple exists at `src/components/right-panel/simple/CaseStudySectionSimple.tsx` BUT NOT wired in SimpleTab.tsx routing (lines 53-69)** — falls through to default `<SectionSimple>` which is hero-shaped and useless for case-study editing
- **Design:** 1/10 — **DOES NOT RENDER in canvas — RealityTab.tsx has no `case 'case-study'` branch (last branch is `blog` at line 607); falls through to empty `<div>` at line 619**
- **Composite:** 4.0/10
- **Gaps:** [P1] wire `case 'case-study': return <CaseStudyCards section={section} />` (with optional variants if added) in RealityTab.tsx; [P1] wire `case 'case-study': return <CaseStudySectionSimple sectionId={section.id} />` in SimpleTab.tsx; [P2] add SECTION_CUES + alias map (`case-study`, `case study`, `success story` → case-study); [P3] add 2nd and 3rd variants (timeline, hero-story).

### `contact-form`
- **Variants:** ContactFormSimple (1)
- **Quality:** 5/10 — visual-only form (no real submission per template comment); single variant
- **Chat ease:** 4/10 — NO SECTION_CUES entry; NO alias; "add contact form" hits only canonical-name fallback
- **Listen ease:** 3/10 — same; "let people contact me" → no resolution
- **Builder ease:** 4/10 — **ContactFormSectionSimple exists at `src/components/right-panel/simple/ContactFormSectionSimple.tsx` BUT NOT wired in SimpleTab.tsx routing** — falls through to default `<SectionSimple>` (hero editor)
- **Design:** 3/10 — **DOES NOT RENDER in canvas — RealityTab.tsx has no `case 'contact-form'` branch; falls through to empty `<div>`**
- **Composite:** 3.8/10
- **Gaps:** [P1] wire `case 'contact-form': return <ContactFormSimple section={section} />` in RealityTab.tsx; [P1] wire `case 'contact-form': return <ContactFormSectionSimple sectionId={section.id} />` in SimpleTab.tsx; [P2] add SECTION_CUES + alias map (`contact form`, `contact us`, `get in touch`, `reach out` → contact-form); [P3] add 2nd variant (split with map / split with image / multi-step wizard).

## Gap Roll-Up

### P1 (must-fix this sprint)
1. **case-study render path** — `RealityTab.tsx` missing `case 'case-study': return <CaseStudyCards section={section} />` block (after the `blog` block at line 607). 6 example sites declare `case-study` and render blank.
2. **contact-form render path** — `RealityTab.tsx` missing `case 'contact-form': return <ContactFormSimple section={section} />` block. 14 example sites declare `contact-form` and render blank.
3. **case-study + contact-form SimpleTab routing** — `SimpleTab.tsx` switch (lines 53-69) lacks both cases; both editors exist on disk but never open. (Single fix; close in same sprint as #1+#2.)

### P2 (should-fix carry-forward)
1. Add SECTION_CUES entries in `src/contexts/intelligence/aisp/assumptions.ts:77-87` for `numbers`, `image`, `divider`, `logos`, `case-study`, `contact-form` (currently 9 of 18 types covered).
2. Add `validateSectionType` aliases for case-study (`case study`, `success story`) and contact-form (`contact form`, `contact us`, `get in touch`).
3. `sectionTypeSwap` matrix (`src/lib/sectionTypeSwap.ts`) covers only 4 of 18 types (text/quotes/numbers/image). Hero ↔ hero-variant swap, columns ↔ team swap (both card-based) would be high-value next-tier additions — but per ADR-144 D4 expansion is gated on per-type safe-default seed components. P2 because user-visible value is real but contract requires careful design.
4. `numbers` editor uses `ValuePropsSectionSimple` — historical naming carry-forward; rename to `NumbersSectionSimple` for clarity (zero behavior change).
5. ResourcesTab.tsx already lists 18 section types per P114/F4 truth-up but `DIVIDER_SECTION_TYPES` quick-add list in `RealityTab.tsx:90-107` shows only 16 — case-study + contact-form missing from quick-add too. Gated by P1 #1+#2 (no point quick-adding a section that doesn't render).

### P3 (nice-to-have)
1. Extend `InlineEditable` beyond hero — text headlines, columns headings, pricing tier names, blog card titles. Carry-forward CF-P116-1 (defer until shared component contract stabilizes against hero-only usage).
2. Carousel a11y (gallery) — keyboard nav + ARIA live region for slide change.
3. Sticky/transparent navbar variant (menu).
4. Usage-based pricing variant (slider for $/seat).
5. Video-testimonial variant (quotes).
6. Bento-grid variant (columns).

## Scoring methodology

Each dimension scores 1-10 against this ladder: **1-3 broken or missing**, **4-5 stub/partial**, **6-7 functional but rough**, **8-9 polished and idiomatic for the standard**, **10 best-in-class for the category**. Composite is the unweighted mean of Q/C/L/B/D rounded to 1 decimal. Severity tags: **P1** = blocks shipped feature for users (rendered as blank or unwired editor); **P2** = real friction or coverage gap that does not block; **P3** = polish/expansion not gating any current user flow.
