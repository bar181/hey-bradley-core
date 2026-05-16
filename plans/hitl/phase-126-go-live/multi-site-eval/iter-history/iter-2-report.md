# P126 multi-site eval — final report

Generated 2026-05-16T19:20:54.954Z · model gemini-2.5-flash · total cost $0.082262 / $10 phase cap

## Composite efficacy

| Scenario | Checklist | Reviewer avg | Composite |
|---|---|---|---|
| Hey Bradley storytelling blog | 100.0% | 85.0 | **92.5** |
| Bradley Ross designer portfolio | 88.9% | 72.0 | **80.4** |
| Atlas AI Consulting marketing site | 85.7% | 74.0 | **79.9** |

**Overall composite: 84.3%**

## Per-scenario checklist detail

### Hey Bradley storytelling blog (blog)

Brief: _Personal blog by Bradley Ross. Three Don-Miller-style narrative articles about Hey Bradley (origin, product, capstone). Visual, dark, crimson, Cormorant Garamond serif. Each article has hook, problem, resolution. Newsletter signup. Author bio._

Score: 25/25 (100.0%)

| ID | Pass | Description |
|---|---|---|
| blog-01 | ✅ | site.title includes 'Hey Bradley' or 'Bradley' (case-insensitive) |
| blog-02 | ✅ | site.author or related field references 'Bradley Ross' |
| blog-03 | ✅ | theme.mode equals 'dark' |
| blog-04 | ✅ | theme.palette.bgPrimary is a dark color (hex starts #0 or #1 or named black/near-black) |
| blog-05 | ✅ | theme.palette.accentPrimary is a crimson/red hex (#A-D or #E0-FF in red channel, low green/blue) |
| blog-06 | ✅ | theme.typography.headingFamily equals 'Cormorant Garamond' (case-insensitive) |
| blog-07 | ✅ | Has at least one section with type 'hero' |
| blog-08 | ✅ | Hero headline mentions 'whiteboard' OR 'listens' |
| blog-09 | ✅ | Has at least one columns/grid/list section after hero (article grid) |
| blog-10 | ✅ | Has at least 3 article cards/components in some section |
| blog-11 | ✅ | Article 1 references 'origin' or 'beginning' or 'start' in text |
| blog-12 | ✅ | Article 2 references 'product' or 'builder' or 'platform' in text |
| blog-13 | ✅ | Article 3 references 'capstone' or 'Harvard' in text |
| blog-14 | ✅ | At least one article has a 'hook' or hook-like field/intro text |
| blog-15 | ✅ | At least one article has a 'problem' field or problem-framed sentence |
| blog-16 | ✅ | At least one article has a 'resolution' field or resolution-framed sentence |
| blog-17 | ✅ | Has an author-bio section/component |
| blog-18 | ✅ | Author bio mentions 'Harvard' or 'ALM' or both |
| blog-19 | ✅ | Has a newsletter signup section |
| blog-20 | ✅ | Newsletter section has an email input or form component |
| blog-21 | ✅ | Layout has at least 4 distinct sections |
| blog-22 | ✅ | Accent color suggests warm brand (crimson/red/burgundy hex) |
| blog-23 | ✅ | Heading typography is serif (heading family is a known serif: Cormorant, Garamond, Playfair, Instrument Serif, etc.) |
| blog-24 | ✅ | Has visible call-to-action button somewhere (signup/read more) |
| blog-25 | ✅ | Final config has no malformed sections (every section has type + id + components array) |

### Bradley Ross designer portfolio (portfolio)

Brief: _Visual designer portfolio. Hero with name/title/tagline. Six project cards (image + tags + hover zoom). Video reel near top. Parallax hero. Light beige + sage accent. Contact section with email + Twitter._

Score: 24/27 (88.9%)

| ID | Pass | Description |
|---|---|---|
| port-01 | ✅ | site.title or brand references 'Bradley Ross' or 'portfolio' |
| port-02 | ✅ | theme.mode equals 'light' |
| port-03 | ✅ | theme.palette.bgPrimary is a light beige/cream hex (#F or #E in red/green channels) |
| port-04 | ✅ | theme.palette.accentPrimary or accentSecondary is sage green hex (mid-range green channel, low blue) |
| port-05 | ✅ | Has at least one section with type 'hero' |
| port-06 | ✅ | Hero has a name/title text component |
| port-07 | ✅ | Hero has a tagline/subtitle text component |
| port-08 | ✅ | Hero references 'parallax' in style, layout, effects, or animation field |
| port-09 | ✅ | Has a video reel section (type video OR a section named/described as video) |
| port-10 | ✅ | Video section appears within first 3 sections (excluding navbar) |
| port-11 | ✅ | Has a projects/work section (columns/grid) |
| port-12 | ✅ | Has at least 6 project cards/components |
| port-13 | ✅ | Each project has an image/thumbnail field |
| port-14 | ✅ | Each project has tags (array with ≥1 entry) |
| port-15 | ✅ | Project tags total at least 18 (6 projects × ~3 tags) |
| port-16 | ✅ | Project images reference 'hover' OR 'zoom' OR 'hoverZoom' effect somewhere |
| port-17 | ✅ | Has a contact section |
| port-18 | ✅ | Contact section has an email field/text |
| port-19 | ✅ | Contact section has Twitter/X reference |
| port-20 | ✅ | Has scroll/reveal animation reference somewhere in project section |
| port-21 | ❌ | Layout has at least 5 distinct sections |
| port-22 | ✅ | Beige bg is genuinely warm (not pure white #FFFFFF) |
| port-23 | ✅ | Sage accent is genuinely green-toned (G channel > R and > B) |
| port-24 | ❌ | Has visible CTA in hero (button) |
| port-25 | ✅ | Final config has no malformed sections |
| port-26 | ✅ | Project images have alt-text or label fields |
| port-27 | ❌ | Has navigation/menu section |

### Atlas AI Consulting marketing site (marketing)

Brief: _Traditional B2B SaaS landing page selling Atlas AI Consulting. Strong hero CTA. Three feature cards (strategy / implementation / training). 3-tier pricing (Starter / Growth / Enterprise). Customer logos bar (5+). Three testimonials. Closing CTA 'Book a discovery call.' Navy + electric-blue palette._

Score: 24/28 (85.7%)

| ID | Pass | Description |
|---|---|---|
| mkt-01 | ✅ | site.title or brand references 'Atlas' AND ('AI' or 'Consulting') |
| mkt-02 | ❌ | theme.palette.bgPrimary is navy (R<60, G<60, B>40 — dark blue hex) |
| mkt-03 | ✅ | theme.palette.accentPrimary is electric-blue (high B channel, mid-high G) |
| mkt-04 | ✅ | Has at least one section with type 'hero' |
| mkt-05 | ✅ | Hero headline mentions 'AI features' OR 'ship' AND 'AI' |
| mkt-06 | ✅ | Hero has a CTA button |
| mkt-07 | ✅ | Hero CTA text contains 'discovery' OR 'book' |
| mkt-08 | ✅ | Has a features section (columns/grid) |
| mkt-09 | ✅ | Has at least 3 feature cards |
| mkt-10 | ✅ | Feature 1 references 'strategy' |
| mkt-11 | ✅ | Feature 2 references 'implementation' |
| mkt-12 | ✅ | Feature 3 references 'training' |
| mkt-13 | ✅ | Has a pricing section |
| mkt-14 | ✅ | Has at least 3 pricing tier cards |
| mkt-15 | ✅ | Pricing tier 1 named 'Starter' |
| mkt-16 | ✅ | Pricing tier 2 named 'Growth' |
| mkt-17 | ✅ | Pricing tier 3 named 'Enterprise' |
| mkt-18 | ✅ | Has a customer logos / social-proof bar |
| mkt-19 | ✅ | At least 5 customer logo entries |
| mkt-20 | ✅ | Has a testimonials section |
| mkt-21 | ✅ | At least 3 testimonials |
| mkt-22 | ✅ | Each testimonial has a quote/text field |
| mkt-23 | ✅ | Each testimonial has an author name |
| mkt-24 | ❌ | Has a closing/final CTA section (separate from hero CTA) |
| mkt-25 | ❌ | Closing CTA references 'discovery call' or 'book' |
| mkt-26 | ❌ | Has navigation/menu section |
| mkt-27 | ✅ | Layout has at least 6 distinct sections |
| mkt-28 | ✅ | Final config has no malformed sections |

## 5 brutal-honest reviewers

### ux-critic (cost $0.003123)

| Scenario | Score | Verdict |
|---|---|---|
| blog | 60 | The blog layout feels generic, resembling a marketing landing page rather than a personal narrative space. The CTA in the hero is jarringly out of place for a blog, and the article summaries are too verbose, losing their 'hook, problem, resolution' impact. |
| portfolio | 75 | The portfolio has a solid foundation with clear sections and requested features. However, the generic video placeholder and lack of actual project visuals make it feel more like a template than a personalized showcase. The scroll-reveal effect applied redundantly to each project card suggests an over-application of the prompt. |
| marketing | 80 | This marketing page is quite strong for a B2B SaaS. The hero CTA is excellent, and the content structure is logical. The main flaw is using 'article-card' for features; while it holds the content, it's not a true 'feature card' and the images are missing, making the section feel empty. |

**Top findings:**
- AI consistently defaults to 'article-card' when a simpler 'feature-card' or 'content-card' might be more appropriate, especially when no images are provided, leading to generic layouts.
- Generic placeholder content and missing images severely detract from the 'real website' feel, even when structural requirements are met. Without visual content, the site feels hollow.
- The AI sometimes misinterprets the *spirit* of a prompt, like placing a marketing CTA in a personal blog hero, indicating a lack of contextual understanding for site types.

**Prompt improvements:**
- For content sections, explicitly specify 'visual elements' like 'include relevant icons/illustrations for feature cards' or 'use project images that reflect [design style]'.
- Add 'Consider the primary user goal for each section and optimize CTA placement accordingly (e.g., 'read latest post' for blog, 'view case study' for portfolio).'
- When requesting component types, suggest alternatives or clarify intent: 'use a simple 'text-and-icon' feature card if no imagery, otherwise a visually rich 'product-feature' card.'

### prompt-fidelity (cost $0.003241)

| Scenario | Score | Verdict |
|---|---|---|
| blog | 95 | The blog config is nearly production-ready, successfully implementing all requested features including theme, typography, hero, article structure, author bio, and newsletter. The only minor deviation is the default 'Inter' font for body text, where Cormorant Garamond was only applied to headings. |
| portfolio | 75 | The portfolio site achieved most prompts, correctly setting up the theme, hero with parallax, video reel, and project cards with images/tags/hover zoom. However, the 'subtle animation to the project grid on scroll' prompt was interpreted as 'scroll-reveal' for each card, which is a bit redundant and not precisely a 'grid animation'. Also, the contact section didn't fully render with both email and Twitter links, only implying a general contact section. |
| marketing | 70 | The marketing landing page established the core elements: theme, hero with headline/CTA, feature cards, and a final CTA. However, two significant issues arose: the pricing section was entirely missing from the config, and the customer testimonials only included names, lacking the actual quotes requested by the prompt. A video section was also inexplicably added where it wasn't requested. |

**Top findings:**
- Prompts requesting specific CSS effects (like 'subtle animation on scroll' or 'hover zoom') are sometimes interpreted broadly or redundantly, leading to less precise implementation.
- The system occasionally adds extra, unprompted sections (e.g., video reel in marketing scenario) or omits entire requested sections (e.g., pricing in marketing scenario).
- Details within sections, such as populating testimonial quotes or specific links in a contact section, are sometimes overlooked or incompletely implemented.

**Prompt improvements:**
- For visual effects, be highly specific: 'Add a CSS `transform: scale(1.05)` on hover for project images,' or 'Implement a fade-in-up animation on scroll for the entire project grid container.'
- To avoid extra sections, explicitly state 'Only add sections mentioned in the brief.' If a section is crucial, reiterate its importance or placement.
- For content-rich sections, provide example data in the prompt: 'Add three testimonials, e.g., 'Quote 1' by Name 1, 'Quote 2' by Name 2, etc.'

### json-validator (cost $0.003251)

| Scenario | Score | Verdict |
|---|---|---|
| blog | 95 | The blog scenario achieved a near-perfect score, demonstrating excellent adherence to the prompt. All specified elements like the dark theme, crimson accents, Cormorant Garamond font, article structure, author bio, and newsletter signup were correctly implemented. The JSON structure is also valid and well-organized. |
| portfolio | 75 | The portfolio scenario made a strong effort, successfully implementing the hero, video reel, and project cards with images and tags. However, the critical 'hover zoom' effect for project images and 'animation on scroll' for the project grid were not found in the configuration. The project card `effects` array contained duplicate 'scroll-reveal', indicating a potential misinterpretation or incomplete implementation of effects. |
| marketing | 65 | The marketing scenario had a good start with the hero, features, and closing CTA, but missed several key requirements. The specified '3-tier pricing' and 'customer logos bar' sections were entirely absent. Additionally, while testimonials were requested, the configuration provided only 'article-card' components which is not suitable for testimonials, indicating a lack of appropriate component types or misapplication. |

**Top findings:**
- Several scenarios had missing sections or components entirely (e.g., pricing, customer logos bar in marketing).
- Some interactive effects (e.g., hover zoom, scroll animation) were not implemented or incorrectly applied (e.g., duplicate 'scroll-reveal' effects).
- In the marketing scenario, 'article-card' components were used where dedicated 'testimonial-card' or similar components would have been more appropriate for customer testimonials, indicating a potential schema limitation or misguidance during generation.

**Prompt improvements:**
- For complex interactive features like 'hover zoom' or 'scroll animation', ensure the prompt explicitly asks for 'configurational settings for [effect]' or 'enable [effect] property on [component type]' to guide the model towards specific JSON properties rather than just descriptive text.
- When requesting multiple distinct content types, specify individual component types (e.g., 'add a 'testimonial-card' component for each testimonial') to prevent re-purposing less suitable component types.
- For elements requiring specific counts (e.g., 'three tiers'), explicitly state 'a section of type `pricing` with three `pricing-tier` components' to encourage accurate structural generation.

### copy-quality (cost $0.002947)

| Scenario | Score | Verdict |
|---|---|---|
| blog | 90 | The copy for the blog is exceptionally strong, especially the article summaries which perfectly capture the Don Miller StoryBrand style. The author bio, while a bit generic at the end, is largely good. This site feels ready for production with minor tweaks. |
| portfolio | 65 | While the project card titles are adequate, the lack of descriptions or details beyond generic tags makes the portfolio feel incomplete. The 'Hello, I'm' eyebrow text is a nice touch, but overall the copy leans towards placeholder. It needs more substance to truly showcase a designer's work. |
| marketing | 80 | The marketing site provides strong, benefit-driven copy in the hero and feature cards. The problem-resolution structure within the feature descriptions is very effective for a B2B SaaS. Testimonials and pricing descriptions are passable, though they could be more specific and engaging. |

**Top findings:**
- The blog scenario demonstrated an excellent understanding and execution of a specific content style (Don Miller StoryBrand) within the article summaries.
- The portfolio scenario suffered significantly from a lack of descriptive copy for projects, making them feel generic despite good titles.
- The marketing scenario effectively used problem/resolution structures in feature descriptions, which is strong for a B2B context.

**Prompt improvements:**
- For scenarios requiring detailed content (e.g., portfolio project descriptions), explicitly ask for 2-3 sentences of descriptive copy per item to avoid generic placeholders.
- When specific content styles are desired (e.g., 'Don Miller StoryBrand' for blog), reinforce this instruction for all relevant text fields to maintain consistency.
- For testimonials, specify asking for a particular sentiment or benefit (e.g., 'a quote about increased efficiency') to guide more impactful copy generation.

### render-readiness (cost $0.003169)

| Scenario | Score | Verdict |
|---|---|---|
| blog | 85 | The blog config is largely robust, featuring a dark theme, correct typography, and well-structured article cards with 'hook, problem, resolution' summaries. The main points of failure are missing image URLs for articles and a truncated author bio, which would lead to a less polished presentation. |
| portfolio | 70 | The portfolio config successfully implements a light theme with sage accents, a parallax hero, and project cards with hover-zoom. Critical issues include missing image URLs for all project cards and a truncated final project, which severely impacts renderability and completeness. The prompt for scroll animation was not implemented. |
| marketing | 75 | The marketing landing page has a strong navy and electric-blue theme, a clear hero CTA, and feature cards with detailed problem/resolution descriptions. However, it suffers from missing image URLs for feature cards, a truncated final testimonial, and a completely missing pricing section despite being explicitly prompted. The site is visually consistent but incomplete in content. |

**Top findings:**
- Consistent failure to generate valid image URLs for image-based components (article cards, project cards), often leaving them empty or with placeholders.
- Repeated truncation of content, especially in the final item of a list (e.g., author bio, project cards, testimonials), indicating a possible token limit or generation cutoff issue.
- Lack of implementation for specific animation requests (e.g., 'subtle animation to the project grid on scroll') and critical sections (e.g., pricing tiers), suggesting prompt interpretation or capability limitations.

**Prompt improvements:**
- To ensure all images are present, explicitly request 'use diverse, high-quality, relevant placeholder images from Unsplash for all image fields' for components like article cards and project cards.
- To prevent truncation, add 'Ensure all text fields and list items are complete and not cut off at the end.' to prompts involving multi-item sections or longer text content.
- For complex or precise requirements like animations or specific data structures (e.g., pricing tiers), break down the prompt into smaller, more atomic steps: 'Add a section for pricing tiers. Include Starter, Growth, and Enterprise. For each, list 3 benefits and a price.'

## Preview

Open `preview.html` in a browser. Use the dropdown to select blog / portfolio / marketing.
