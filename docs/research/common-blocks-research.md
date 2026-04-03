# Common Website Sections/Blocks: Cross-Platform Research

> Date: 2026-04-02
> Purpose: Identify what sections Hey Bradley is missing compared to industry standards

---

## 1. Hey Bradley Current Sections (10 total)

| # | Internal Name | User Label     | Description                          |
|---|---------------|----------------|--------------------------------------|
| 1 | `menu`        | Top Menu       | Navigation bar with logo and links   |
| 2 | `hero`        | Main Banner    | Main banner with headline and button |
| 3 | `columns`     | Columns        | Showcase features side by side       |
| 4 | `pricing`     | Pricing        | Pricing plans and tiers              |
| 5 | `action`      | Action Block   | Section with button and message      |
| 6 | `quotes`      | Quotes         | Customer testimonials and quotes     |
| 7 | `questions`   | Questions      | Frequently asked questions           |
| 8 | `numbers`     | Numbers        | Key value propositions and stats     |
| 9 | `gallery`     | Gallery        | Image gallery                        |
| 10| `footer`      | Footer         | Page footer with links               |

---

## 2. Cross-Platform Section Audit

### What Every Major Platform Offers

The table below maps section types across 7 major platforms. A checkmark means the platform ships it as a first-class section type or pre-built component.

| Section Type         | WordPress | Wix | Squarespace | Framer | Figma/Relume | Webflow | Carrd | Hey Bradley |
|----------------------|-----------|-----|-------------|--------|--------------|---------|-------|-------------|
| Navbar / Menu        | Y         | Y   | Y           | Y      | Y            | Y       | Y     | Y           |
| Hero / Header        | Y         | Y   | Y           | Y      | Y            | Y       | Y     | Y           |
| Features / Columns   | Y         | Y   | Y           | Y      | Y            | Y       | Y     | Y           |
| Pricing              | Y         | Y   | Y           | Y      | Y            | Y       | -     | Y           |
| CTA / Action         | Y         | Y   | Y           | Y      | Y            | Y       | Y     | Y           |
| Testimonials/Quotes  | Y         | Y   | Y           | Y      | Y            | Y       | -     | Y           |
| FAQ / Questions      | Y         | Y   | Y           | Y      | Y            | Y       | -     | Y           |
| Stats / Numbers      | Y         | Y   | Y           | Y      | Y            | Y       | -     | Y           |
| Gallery              | Y         | Y   | Y           | Y      | Y            | Y       | Y     | Y           |
| Footer               | Y         | Y   | Y           | Y      | Y            | Y       | Y     | Y           |
| **Logo Cloud**       | Y         | Y   | Y           | Y      | Y            | Y       | Y     | **MISSING** |
| **Contact / Form**   | Y         | Y   | Y           | Y      | Y            | Y       | Y     | **MISSING** |
| **Team / People**    | Y         | Y   | Y           | Y      | Y            | Y       | -     | **MISSING** |
| **Text / Content**   | Y         | Y   | Y           | Y      | Y            | Y       | Y     | **MISSING** |
| **Image / Media**    | Y         | Y   | Y           | Y      | Y            | Y       | Y     | **MISSING** |
| **Video**            | Y         | Y   | Y           | Y      | Y            | Y       | Y     | **MISSING** |
| **Spacer / Divider** | Y         | Y   | Y           | Y      | Y            | Y       | -     | **MISSING** |
| **Banner / Alert**   | Y         | Y   | -           | Y      | Y            | Y       | -     | **MISSING** |

**Result: Hey Bradley is missing 8 section types that appear on 5+ of 7 platforms.**

---

## 3. Detailed Analysis of Missing Sections

### 3a. Logo Cloud

**How common:** Present on an estimated 60-70% of B2B/SaaS landing pages. Relume (the largest Webflow component library with 1,000+ components) includes "Logo Sections" as a top-level category. 75% of respondents in an Actual Insights study said trust logos increased perceived brand trustworthiness.

**Platform names:**
- WordPress: "Logo Carousel", "Client Logos", "Partner Logos" block
- Wix: "Logo Strip" (within strips)
- Squarespace: Styled within auto-layout sections or gallery
- Framer/Relume: "Logo Sections" (dedicated category)
- Webflow: "Logo Cloud", "Trusted By"

**Recommended variants:**
1. Simple row of grayscale logos
2. Scrolling/marquee logo ticker
3. Logo grid with company names

**Priority: MUST-HAVE** -- The single most common section missing from Hey Bradley. Nearly every marketing site includes a "Trusted by" or "As Featured In" logo bar.

---

### 3b. Contact / Form

**How common:** Present on 80-90% of business websites. Every platform ships a contact form as a first-class element. Wix lists it among its most popular pre-built strips. WordPress has a dedicated "Contact Form" block. Squarespace includes form blocks natively.

**Platform names:**
- WordPress: "Contact Form" block (via WPForms, Gravity Forms, or core)
- Wix: "Contact" strip, "Form" element
- Squarespace: "Form Block" with email integration
- Framer: "Contact Section"
- Webflow/Relume: "Contact Sections" (dedicated category)
- Carrd: "Form" element

**Recommended variants:**
1. Simple contact form (name, email, message)
2. Contact info cards (email, phone, address, map)
3. Contact split (form on left, info on right)

**Priority: MUST-HAVE** -- Fundamental for any business website. Currently impossible in Hey Bradley without workarounds.

---

### 3c. Team / People

**How common:** Present on 40-50% of business/agency websites. Squarespace has a dedicated "People" auto-layout section type. Relume includes "Team Sections" as a top-level category. Tilda's landing page anatomy lists "Team" as a standard functional block.

**Platform names:**
- WordPress: "Team Members" block (via plugins)
- Wix: "Team" section template
- Squarespace: "People" section (auto-layout)
- Framer: "Team Sections"
- Webflow/Relume: "Team Sections" (dedicated category)

**Recommended variants:**
1. Team grid (photo, name, role)
2. Team cards with bio text
3. Team row (compact, horizontal)

**Priority: SHOULD-HAVE** -- Currently users force team members into the Columns section, which lacks photo/role/bio structure.

---

### 3d. Text / Content Block

**How common:** The most fundamental building block on every platform. WordPress's entire editor is built around the Paragraph/Text block. Squarespace has a dedicated "Text Block." Carrd uses text as a core element type. Present on 95%+ of all websites.

**Platform names:**
- WordPress: "Paragraph", "Heading", "Text" blocks (core)
- Wix: "Text" element, "Text Strip"
- Squarespace: "Text Block"
- Framer: "Text" component
- Webflow: "Rich Text", "Text Block"
- Carrd: "Text" element

**Recommended variants:**
1. Rich text (heading + body paragraphs)
2. Two-column text (side-by-side paragraphs)
3. Text with side image (article-style)

**Priority: MUST-HAVE** -- Without a standalone text section, users cannot add long-form content, about-us paragraphs, or article content between other sections. The hero section is not a substitute.

---

### 3e. Image / Media Block

**How common:** Present on 90%+ of websites. WordPress has dedicated Image, Cover, and Media & Text blocks. Squarespace and Wix both treat images as first-class section content. Every Framer and Figma library includes image sections.

**Platform names:**
- WordPress: "Image" block, "Cover" block, "Media & Text" block
- Wix: "Image" element, "Image Strip"
- Squarespace: "Image Block", Gallery sections
- Framer: "Image" component, "Cover" section
- Webflow: "Image", "Hero with Image"
- Carrd: "Image" element

**Recommended variants:**
1. Full-width image (with optional text overlay)
2. Image with caption
3. Side-by-side image and text (media + text)

**Priority: MUST-HAVE** -- Different from Gallery (which shows multiple images). This is a single featured image section for visual breaks, product shots, or hero-style imagery without the headline/CTA structure.

---

### 3f. Video Section

**How common:** Present on 30-40% of landing pages and growing. Video marketing data shows 39% of marketers report short-form video generates ROI (HubSpot). Tilda lists "Video" as a standard landing page block. WordPress has a dedicated Video block and Cover block with video backgrounds.

**Platform names:**
- WordPress: "Video" block, "Cover" block (with video background)
- Wix: "Video" element, "Video Strip"
- Squarespace: "Video Block"
- Framer: "Video" component
- Webflow: "Video", "Background Video"
- Carrd: "Video" element

**Recommended variants:**
1. Centered video embed (YouTube/Vimeo)
2. Full-width video background with text overlay
3. Video with side text (explainer layout)

**Priority: SHOULD-HAVE** -- Increasingly important for product demos, explainer videos, and brand storytelling.

---

### 3g. Spacer / Divider

**How common:** Present as a utility block on every major platform. WordPress has a dedicated "Spacer" block and "Separator" block. Squarespace has a "Spacer" block. These are layout utility elements rather than content sections.

**Platform names:**
- WordPress: "Spacer" block, "Separator" block
- Wix: "Divider" element, spacing controls
- Squarespace: "Spacer Block", "Line Block"
- Framer: Spacing component
- Webflow: "Divider", spacing utility

**Recommended variants:**
1. Empty spacer (configurable height)
2. Horizontal line divider
3. Decorative divider (wave, gradient, pattern)

**Priority: SHOULD-HAVE** -- Important for visual breathing room between sections. Without it, users cannot control vertical rhythm.

---

### 3h. Banner / Alert Bar

**How common:** Present on 20-30% of websites, primarily SaaS and e-commerce. WordPress has notification bar plugins. Webflow and Framer libraries include banner/alert components. Less universal than other sections but very common for announcements.

**Platform names:**
- WordPress: "Banner" block (via plugins), notification bars
- Wix: "Header Strip", announcement bars
- Framer: "Banner" component
- Webflow/Relume: "Banners" category
- Carrd: Not available

**Recommended variants:**
1. Top-of-page announcement bar (dismissible)
2. Inline banner (within page flow)

**Priority: NICE-TO-HAVE** -- Useful but not essential for an MVP section library. Can be added later.

---

## 4. Summary: Gap Analysis

### MUST-HAVE (add these first -- present on 60-95% of marketing sites)

| Section    | Gap Severity | Rationale                                                |
|------------|--------------|----------------------------------------------------------|
| Logo Cloud | Critical     | Every B2B/SaaS landing page has "Trusted by" logos       |
| Contact    | Critical     | Every business site needs a contact form                 |
| Text       | Critical     | Cannot add plain content/about sections without this     |
| Image      | High         | Single featured image section; different from gallery    |

### SHOULD-HAVE (add in next phase -- present on 30-50% of marketing sites)

| Section  | Gap Severity | Rationale                                              |
|----------|--------------|--------------------------------------------------------|
| Team     | Medium       | Common for agency/business sites; currently hacked via Columns |
| Video    | Medium       | Growing importance for product demos and explainers    |
| Spacer   | Medium       | Layout utility; needed for visual rhythm control       |

### NICE-TO-HAVE (add later -- present on 20-30% of sites)

| Section | Gap Severity | Rationale                                               |
|---------|--------------|----------------------------------------------------------|
| Banner  | Low          | Useful for announcements but not core to page structure  |

---

## 5. Recommended Final Section List (15 sections)

This list covers an estimated 95% of marketing website needs:

| #  | Section    | User Label      | Category     | Status       |
|----|------------|-----------------|--------------|--------------|
| 1  | `menu`     | Top Menu        | Navigation   | EXISTS       |
| 2  | `hero`     | Main Banner     | Content      | EXISTS       |
| 3  | `text`     | Text Block      | Content      | **NEW**      |
| 4  | `image`    | Image           | Media        | **NEW**      |
| 5  | `video`    | Video           | Media        | **NEW**      |
| 6  | `columns`  | Columns         | Layout       | EXISTS       |
| 7  | `logos`    | Logo Cloud      | Trust        | **NEW**      |
| 8  | `numbers`  | Numbers         | Trust        | EXISTS       |
| 9  | `quotes`   | Quotes          | Trust        | EXISTS       |
| 10 | `pricing`  | Pricing         | Commerce     | EXISTS       |
| 11 | `team`     | Team            | People       | **NEW**      |
| 12 | `questions`| Questions       | Support      | EXISTS       |
| 13 | `contact`  | Contact         | Conversion   | **NEW**      |
| 14 | `action`   | Action Block    | Conversion   | EXISTS       |
| 15 | `gallery`  | Gallery         | Media        | EXISTS       |
| -- | `footer`   | Footer          | Navigation   | EXISTS       |
| -- | `spacer`   | Spacer          | Utility      | **NEW** (optional) |
| -- | `banner`   | Banner          | Utility      | **NEW** (optional) |

The core 15 (rows 1-15 plus footer) provide full coverage. Spacer and Banner are optional utility sections that can be added when needed.

### Typical Page Order (recommended default)

```
menu -> hero -> logos -> columns -> numbers -> quotes -> pricing -> team -> questions -> contact -> action -> gallery -> footer
```

---

## 6. Cross-Platform Naming Reference

| Hey Bradley | WordPress          | Wix              | Squarespace       | Relume/Webflow     | Framer         |
|-------------|--------------------|------------------|-------------------|--------------------|----------------|
| menu        | Navigation         | Header           | Header            | Navbar             | Navbar         |
| hero        | Cover / Hero       | Hero Strip       | Hero Section      | Hero Header        | Hero           |
| text        | Paragraph/Text     | Text Strip       | Text Block        | Content Section    | Text           |
| image       | Image / Cover      | Image Strip      | Image Block       | Image Section      | Image          |
| video       | Video              | Video Strip      | Video Block       | Video Section      | Video          |
| columns     | Columns / Features | Columns Strip    | Auto Layout       | Feature Section    | Features       |
| logos       | Logo Carousel      | Logo Strip       | Gallery (logos)    | Logo Sections      | Logos          |
| numbers     | Counter / Stats    | Stats Strip      | Auto Layout       | Stats Section      | Stats          |
| quotes      | Testimonial        | Testimonial      | Quote Block       | Testimonial        | Testimonials   |
| pricing     | Pricing Table      | Pricing Strip    | Pricing Section   | Pricing Section    | Pricing        |
| team        | Team Members       | Team Section     | People Section    | Team Section       | Team           |
| questions   | Accordion / FAQ    | FAQ Strip        | Accordion Block   | FAQ Section        | FAQ            |
| contact     | Contact Form       | Contact Strip    | Form Block        | Contact Section    | Contact        |
| action      | Buttons / CTA      | CTA Strip        | Button Block      | CTA Section        | CTA            |
| gallery     | Gallery            | Gallery Strip    | Gallery Section   | Gallery Section    | Gallery        |
| footer      | Footer             | Footer           | Footer            | Footer             | Footer         |

---

## Sources

- [10+ Must-Have Blocks for WordPress 2025](https://essential-blocks.com/must-have-blocks-for-wordpress-site/)
- [Blocks (full list) - WordPress.com](https://wordpress.com/support/wordpress-editor/blocks/)
- [Gutenberg Blocks: Complete List](https://gogutenberg.com/blocks/)
- [Wix: Work with Sections and Strips](https://www.wix.com/learn/tutorials/web-design/work-with-sections-and-strips)
- [Wix: Adding and Setting Up a Strip](https://support.wix.com/en/article/wix-editor-adding-and-setting-up-a-strip)
- [Squarespace: Page Sections](https://support.squarespace.com/hc/en-us/articles/360027987711-Page-sections)
- [Squarespace: Auto Layouts](https://support.squarespace.com/hc/en-us/articles/360057763852-Auto-layouts)
- [Squarespace Page Sections: Complete 2026 Guide](https://www.squarepros.io/blog/squarespace-page-sections-guide)
- [Relume: Webflow Component Library](https://www.relume.io/components)
- [Relume: Free Components](https://www.relume.io/free-components)
- [Relume: Logo Sections](https://www.relume.io/categories/logo-sections)
- [Framify: 1600+ Framer Components](https://framify.design/)
- [Framerize: 300+ Components](https://www.framer.com/marketplace/plugins/framerize/)
- [Tilda: Landing Page Anatomy](https://tilda.education/en/courses/landing-page/landing-page-anatomy/)
- [Unbounce: Anatomy of a Landing Page](https://unbounce.com/landing-page-articles/the-anatomy-of-a-landing-page/)
- [Wix Blog: Anatomy of a Landing Page](https://www.wix.com/blog/anatomy-of-a-landing-page)
- [Landing Page Statistics 2026](https://www.involve.me/blog/landing-page-statistics)
- [Logo Cloud Examples - Landingfolio](https://www.landingfolio.com/components/logo-cloud)
- [Carrd: Building Documentation](https://carrd.co/docs/building)
- [Carrd: Using Sections](https://carrd.co/docs/building/using-sections)
- [Webflow vs Carrd Comparison](https://www.lowcode.agency/blog/carrd-vs-webflow)
- [The Landing Page Checklist 2025](https://www.flow.ninja/blog/landing-page-checklist)
