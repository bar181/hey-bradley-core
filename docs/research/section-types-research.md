# Section Types Research

**Date:** 2026-03-29 | **Purpose:** Define standard components, variants, and best practices for 7 website section types (beyond hero, which is already implemented).

**Sources:** Tailwind UI, Webflow, Squarespace, Framer, Stripe, Linear, Vercel, Notion, NNGroup, Smashing Magazine, Orbit Media.

---

## Section Frequency Ranking (Marketing Sites)

Based on analysis of top SaaS/marketing sites, sections appear in this order of frequency:

| Rank | Section | Frequency | Notes |
|------|---------|-----------|-------|
| 1 | Hero | ~100% | Always present, already implemented |
| 2 | Features | ~95% | Almost universal on product pages |
| 3 | CTA | ~90% | Often appears 2-3 times per page |
| 4 | Footer | ~100% | Always present, structural requirement |
| 5 | Testimonials | ~80% | Social proof, critical for conversion |
| 6 | Pricing | ~70% | Present on most SaaS sites |
| 7 | FAQ | ~60% | Common on landing pages + pricing pages |
| 8 | Value Props | ~55% | Stats/numbers, often near hero or above footer |

---

## 1. Features

### Variants

| Variant | Layout | Best For |
|---------|--------|----------|
| `grid-3col` | 3-column grid of cards | Standard, most common (Stripe, Linear) |
| `grid-4col` | 4-column grid of cards | Sites with 4+ features to highlight |
| `alternating` | Zigzag rows: text left/image right, then flipped | Deep feature explanations (Vercel, Notion) |
| `icon-list` | Single-column vertical list with icons | Compact feature lists, sidebars |

### Components Per Feature Card

| Component | Required | Type | Constraints |
|-----------|----------|------|-------------|
| `icon` | Optional | Lucide icon slug | From icon map (zap, target, shield, etc.) |
| `title` | **Required** | string | 2-6 words, max 60 chars |
| `description` | **Required** | string | 1-2 sentences, max 200 chars |

### Recommended Item Count

- **3 features:** Clean, focused (Stripe pattern: "Payments, Billing, Connect")
- **4 features:** Balanced 2x2 grid on mobile
- **6 features:** Maximum before overwhelming; 3x2 grid
- **Standard:** 3-4 is the sweet spot for most sites

### Real-World Examples

- **Stripe:** 3-column grid, each card has an icon (colored SVG), bold title, 1-line description. Cards have subtle surface background, no border. Minimal spacing.
- **Linear:** 3-column grid, monochrome icons, short titles, muted descriptions. Dark background, cards blend into surface.
- **Vercel:** Alternating zigzag layout for major features (Deploy, Preview, Ship). Each row has a heading, paragraph, and a screenshot/demo on the opposite side.
- **Tailwind UI:** Offers grid-3col (with icon + title + description), centered 2x3 grid, and offset grid variants. Icon is always above title.

### Section-Level Components

| Component | Required | Type | Notes |
|-----------|----------|------|-------|
| `sectionTitle` | Optional | heading | "Features", "What we offer", etc. |
| `sectionSubtitle` | Optional | text | Brief intro line |
| `featureCards[]` | **Required** | array of feature-card | 3-6 items |

---

## 2. Pricing

### Variants

| Variant | Layout | Best For |
|---------|--------|----------|
| `2-tier` | Two cards side by side | Simple free/pro split |
| `3-tier` | Three cards, middle highlighted | Standard SaaS (good/better/best) |
| `comparison` | Full feature comparison table | Complex products with many plan differences |

### Components Per Pricing Tier

| Component | Required | Type | Constraints |
|-----------|----------|------|-------------|
| `tierName` | **Required** | string | "Free", "Pro", "Enterprise" (max 20 chars) |
| `price` | **Required** | string | "$0", "$29", "Custom" |
| `period` | Optional | string | "/month", "/year", "per seat/month" |
| `description` | Optional | string | 1-line tier summary (max 100 chars) |
| `features[]` | **Required** | array of string | Bulleted list of included features |
| `ctaButton` | **Required** | button | "Get Started", "Contact Sales" |
| `highlighted` | Optional | boolean | Adds "recommended" badge + visual emphasis |
| `badge` | Optional | string | "Most Popular", "Best Value" |

### Section-Level Components

| Component | Required | Type | Notes |
|-----------|----------|------|-------|
| `sectionTitle` | Optional | heading | "Pricing", "Simple, transparent pricing" |
| `sectionSubtitle` | Optional | text | "No hidden fees. Cancel anytime." |
| `billingToggle` | Optional | toggle | Monthly/Annual switch with discount badge |
| `tiers[]` | **Required** | array of pricing-tier | 2-3 items |

### Recommended Tier Count

- **2 tiers:** Clean binary choice (Free vs Pro). Works for simple products.
- **3 tiers:** Industry standard. Middle tier is the "recommended" upsell target. The decoy effect makes the middle tier look best.
- **4 tiers:** Maximum. Only for enterprise products with distinct segments.
- **Standard:** 3 tiers is the dominant pattern.

### Monthly/Annual Toggle

- Toggle at the top of the section, above the tier cards
- Annual pricing shows a discount badge ("Save 20%")
- Prices update inline when toggled (no page reload)
- Stripe, Linear, Notion, Vercel all use this pattern

### Real-World Examples

- **Stripe:** 3-tier layout. Clean cards with white background, one highlighted with indigo border. Feature lists use checkmarks. CTA buttons are solid for highlighted tier, outline for others.
- **Linear:** 3-tier, dark background. Highlighted tier has a subtle glow. Feature lists are concise (5-8 items per tier). Monthly/annual toggle at top.
- **Notion:** 4-tier (Free, Plus, Business, Enterprise). Comparison table below the cards. Toggle for monthly/annual. "Most Popular" badge on Business tier.

---

## 3. CTA (Call to Action)

### Variants

| Variant | Layout | Best For |
|---------|--------|----------|
| `simple` | Centered heading + subtitle + button | Bottom-of-page conversion (most common) |
| `split` | Text on left, image/form on right | Newsletter signups, demo requests |
| `gradient` | Centered text over gradient/colored background | Visual emphasis, brand moments |
| `newsletter` | Heading + email input + submit button | Email list building |

### Components

| Component | Required | Type | Constraints |
|-----------|----------|------|-------------|
| `heading` | **Required** | string | 4-10 words, max 80 chars |
| `subtitle` | Optional | string | 1-2 sentences, max 200 chars |
| `primaryButton` | **Required** | button | Text + URL + style (filled/outline) |
| `secondaryButton` | Optional | button | Less prominent alternative action |
| `backgroundImage` | Optional | image URL | For gradient/image variants |
| `emailInput` | Optional | input | For newsletter variant only |

### Recommended Usage

- CTAs appear 2-3 times on a typical marketing page
- One above the fold (hero CTA), one mid-page, one at the bottom
- Bottom-of-page CTA is the most common standalone CTA section
- Keep it short: heading + 1 button is the minimum effective pattern

### Real-World Examples

- **Stripe:** "Start building" CTA at bottom of every page. Dark background, white text, single prominent button. No image.
- **Linear:** Gradient background CTA. "Build better software." heading + "Get started" button. Subtle animated background.
- **Vercel:** "Start Deploying" CTA with dark bg, centered text, two buttons (primary + secondary).
- **Tailwind UI:** Offers simple-centered, split with image, split with form, gradient bg, and stacked variants.

---

## 4. Footer

### Variants

| Variant | Layout | Best For |
|---------|--------|----------|
| `multi-column` | 3-5 columns of links + bottom bar | Standard SaaS/corporate (most common) |
| `simple` | Single row: logo + links + social | Minimal sites, landing pages |
| `minimal` | Just copyright + legal links | Ultra-minimal, single-page sites |

### Components

| Component | Required | Type | Constraints |
|-----------|----------|------|-------------|
| `logo` | Optional | image/text | Company logo or text mark |
| `tagline` | Optional | string | Brief company description (max 100 chars) |
| `columns[]` | **Required** | array of link-column | 3-5 columns, each with heading + links |
| `columnHeading` | **Required** | string | "Product", "Company", "Resources" |
| `links[]` | **Required** | array of link | Text + URL pairs |
| `socialIcons[]` | Optional | array of social-link | Platform + URL (twitter, github, linkedin, etc.) |
| `copyright` | **Required** | string | "(c) 2026 Company. All rights reserved." |
| `legalLinks[]` | Optional | array of link | Privacy Policy, Terms of Service |

### Recommended Column Count

- **3 columns:** Standard minimum (Product, Company, Resources)
- **4 columns:** Most common (adds Legal or Support column)
- **5 columns:** Maximum before it gets cluttered
- **Standard:** 4 columns is the dominant pattern

### Real-World Examples

- **Stripe:** 5-column footer (Products, Solutions, Developers, Resources, Company). Logo + tagline on the left. Social icons + language selector at bottom. Clean horizontal divider above copyright.
- **Linear:** 4-column footer (Product, Company, Resources, Developers). Minimal, no tagline. Social icons (Twitter, GitHub) at bottom right.
- **Vercel:** 4-column footer. Logo at top left. Columns are Product, Resources, Company, Legal. Copyright + social icons at bottom.
- **72% of top 50 marketing sites** include social icons in the footer (Orbit Media study).

---

## 5. Testimonials

### Variants

| Variant | Layout | Best For |
|---------|--------|----------|
| `card-grid` | 2-3 column grid of quote cards | Multiple testimonials, social proof density |
| `single-quote` | One large centered quote | Hero testimonials, featured customer |
| `carousel` | Horizontal slider of quote cards | Many testimonials in limited space |
| `logo-wall` | Grid of customer logos (no quotes) | Brand credibility, "trusted by" sections |

### Components Per Testimonial Card

| Component | Required | Type | Constraints |
|-----------|----------|------|-------------|
| `quote` | **Required** | string | 1-3 sentences, max 300 chars |
| `authorName` | **Required** | string | Full name |
| `authorRole` | Optional | string | "CEO at Acme", "Head of Engineering" |
| `authorCompany` | Optional | string | Company name (if not in role) |
| `avatar` | Optional | image URL | Square headshot, 40-64px |
| `rating` | Optional | number (1-5) | Star rating, displayed as filled stars |
| `companyLogo` | Optional | image URL | For logo wall variant |

### Section-Level Components

| Component | Required | Type | Notes |
|-----------|----------|------|-------|
| `sectionTitle` | Optional | heading | "What our customers say" |
| `sectionSubtitle` | Optional | text | Brief intro |
| `testimonials[]` | **Required** | array of testimonial | 3-6 items |

### Recommended Item Count

- **3 testimonials:** Minimum for credibility (grid of 3)
- **5-6 testimonials:** Sweet spot for carousel
- **8-12 logos:** Minimum for a logo wall to feel credible
- **Standard:** 3-5 testimonials is optimal (6-12 overwhelms per research)

### Real-World Examples

- **Stripe:** Card grid, 3 columns. Each card has a large quote, author name + role, and a company logo. No star ratings. Dark surface cards on darker background.
- **Linear:** Single large quote with attribution. Rotates through customer quotes. Minimal styling.
- **Notion:** Logo wall of customer logos + individual quote cards below. Grammarly pattern: carousel with quantifiable results.
- **Tailwind UI:** Offers side-by-side cards, simple centered (single quote), grid with large quote, and off-white card variants.

---

## 6. FAQ

### Variants

| Variant | Layout | Best For |
|---------|--------|----------|
| `accordion` | Expandable question/answer pairs | Standard, most common (Stripe, Notion) |
| `two-column` | Questions on left, answers on right | Desktop-optimized, always visible |
| `plain-list` | All Q&As visible, no interaction | Simple pages, SEO-focused |

### Components Per FAQ Item

| Component | Required | Type | Constraints |
|-----------|----------|------|-------------|
| `question` | **Required** | string | Clear, concise question (max 120 chars) |
| `answer` | **Required** | string | Supports basic formatting (bold, links), max 500 chars |

### Section-Level Components

| Component | Required | Type | Notes |
|-----------|----------|------|-------|
| `sectionTitle` | Optional | heading | "Frequently Asked Questions" |
| `sectionSubtitle` | Optional | text | "Can't find what you're looking for? Contact us." |
| `faqItems[]` | **Required** | array of faq-item | 4-8 items |

### Recommended Item Count

- **4 items:** Minimum to justify the section
- **6-8 items:** Sweet spot (covers major concerns without overwhelming)
- **10+ items:** Should be split into categories or moved to a dedicated help page
- **Standard:** 5-7 items

### Accordion Best Practices

- Chevron icon (down when closed, up when open) is the standard indicator
- Allow multiple items to open simultaneously (NNGroup recommendation)
- First item can be open by default to hint at interactivity
- "Expand/Collapse All" is optional but useful for 8+ items
- Use semantic `<button>` headers with `aria-expanded` for accessibility

### Real-World Examples

- **Stripe:** Accordion on pricing page. Clean chevron icons. Questions are bold, answers are regular weight with muted color. Single-column, centered, max-width ~720px.
- **Notion:** Accordion with plus/minus icons. Groups questions by category on help pages.
- **Tailwind UI:** Offers accordion (single-column), two-column (side by side), and centered with background variants.
- **Smashing Magazine research:** FAQ pages are the top use case for accordion components.

---

## 7. Value Props (Stats/Numbers)

### Variants

| Variant | Layout | Best For |
|---------|--------|----------|
| `stats-bar` | Horizontal row of 3-4 big numbers | Compact, often placed between sections |
| `icon-grid` | Grid with icon + number + label | Feature-like layout with quantified claims |
| `big-numbers` | Large animated counter numbers | Impact statements, annual reports |

### Components Per Value Prop Item

| Component | Required | Type | Constraints |
|-----------|----------|------|-------------|
| `value` | **Required** | string | "500+", "99.9%", "$2B", "10x" |
| `label` | **Required** | string | "Customers", "Uptime", "Processed", "Faster" |
| `description` | Optional | string | Explanatory detail (max 100 chars) |
| `icon` | Optional | Lucide icon slug | For icon-grid variant |
| `prefix` | Optional | string | "$", "#", etc. |
| `suffix` | Optional | string | "+", "%", "x", etc. |

### Section-Level Components

| Component | Required | Type | Notes |
|-----------|----------|------|-------|
| `sectionTitle` | Optional | heading | "By the numbers", "Why teams choose us" |
| `sectionSubtitle` | Optional | text | Brief context |
| `stats[]` | **Required** | array of stat-item | 3-4 items |

### Recommended Item Count

- **3 stats:** Minimum, classic trio (e.g., customers + uptime + response time)
- **4 stats:** Most common, fills a row evenly
- **6 stats:** Maximum, use 2 rows of 3
- **Standard:** 3-4 stats

### Real-World Examples

- **Stripe:** Stats bar with big numbers: "Millions of companies", "135+ currencies", "35+ countries". White text on dark background. No icons.
- **Linear:** "Built for speed" section with stats: issue creation time, page load time, etc. Animated counters.
- **Vercel:** "250k+ deployments per day" style stats. Large numbers with subtle animation.
- **WordPress:** "Trusted by 2,800,000 websites" as a value prop. Counter animation on scroll.
- **Common patterns:** Numbers count up from zero on scroll (intersection observer). Suffix characters (+, %, x) appear after count completes.

---

## Cross-Section Patterns

### Required vs Optional Components Summary

| Section | Required Components | Optional Components |
|---------|-------------------|-------------------|
| Features | title, description (per card) | icon, section title/subtitle |
| Pricing | tierName, price, features[], ctaButton | period, description, highlighted, badge, billingToggle |
| CTA | heading, primaryButton | subtitle, secondaryButton, backgroundImage, emailInput |
| Footer | columns[] with links, copyright | logo, tagline, socialIcons, legalLinks |
| Testimonials | quote, authorName | authorRole, authorCompany, avatar, rating, companyLogo |
| FAQ | question, answer | section title/subtitle |
| Value Props | value, label | description, icon, prefix, suffix |

### Standard Item Counts

| Section | Min | Recommended | Max |
|---------|-----|-------------|-----|
| Features | 3 | 3-4 | 6 |
| Pricing Tiers | 2 | 3 | 4 |
| CTA buttons | 1 | 1-2 | 2 |
| Footer columns | 2 | 3-4 | 5 |
| Testimonials | 3 | 3-5 | 6 (12 for logo wall) |
| FAQ items | 4 | 5-7 | 10 |
| Value Props | 3 | 3-4 | 6 |

### Typical Page Flow (Conversion Funnel)

```
1. Hero          → Attention (headline + CTA)
2. Features      → Interest (what you offer)
3. Value Props   → Credibility (proof in numbers)
4. Testimonials  → Trust (social proof)
5. Pricing       → Decision (compare options)
6. FAQ           → Objection handling
7. CTA           → Action (final conversion push)
8. Footer        → Navigation (links, legal, social)
```

This flow follows the standard Attention > Interest > Trust > Action funnel used by Stripe, Linear, Vercel, and most top SaaS marketing sites.
