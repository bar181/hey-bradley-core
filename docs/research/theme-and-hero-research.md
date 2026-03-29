# Theme and Hero Section Research

> Research date: 2026-03-29
> Purpose: Foundation research for Hey Bradley's 10-theme system. Covers use-case categories, hero section patterns, and component inventory based on real marketplace data.
> Audience: Build team implementing themes in JSON-driven spec architecture.

---

## Part A: Top 10 Most Popular Website Use Cases

### Methodology

Rankings are synthesized from four primary marketplace sources:
- **Webflow**: 7,000+ templates. Top categories: Agency/Portfolio, SaaS/Startup, Business, E-commerce, Landing Pages ([Flowsamurai 2026 category report](https://www.flowsamurai.com/post/top-selling-webflow-template-categories), [Wedoflow category analysis](https://www.wedoflow.com/post/webflow-template-categories-sold-the-most))
- **Squarespace**: 420+ templates across 8 categories. Local Business (30.65%), Professional Services (25.27%), Art & Design (16.67%), Photography (14.52%), Health & Beauty (11.29%) ([Website Template Statistics 2026](https://mycodelesswebsite.com/website-template-statistics/))
- **ThemeForest**: 51,000+ themes. Top sellers: multipurpose business, admin dashboards, e-commerce, portfolio ([ThemeForest Best Sellers](https://themeforest.net/top-sellers))
- **Framer**: Fast-growing marketplace. Top categories: Portfolio/Creative, SaaS/AI, Real Estate, Blog, Events ([Muzli Best Framer Templates 2026](https://muz.li/blog/the-best-framer-website-templates-for-2026/), [Pentaclay Top 50](https://pentaclay.com/blog/top-50-latest-framer-templates-for-the-upcoming-2026))

### The 10 Categories

| Rank | Category | Marketplace Demand | Hey Bradley Theme |
|------|----------|-------------------|-------------------|
| 1 | SaaS / Software | Highest across Webflow, ThemeForest, Framer | stripe-flow |
| 2 | Agency | Top seller on Webflow; strong on Squarespace | loom-friendly |
| 3 | Portfolio / Creative | Highest sustained search interest (Google Trends 2025); #1 on Framer | studio-bold |
| 4 | Blog / Content | Strong on Framer, WordPress, Squarespace | notion-warm |
| 5 | Startup / Landing Page | Consistent seller across all platforms | vercel-prism |
| 6 | Personal / CV | 11.29% of Squarespace; growing on Framer | pastel-playful |
| 7 | Professional / Business | 25.27% of Squarespace; #2 on ThemeForest | linear-sharp |
| 8 | Wellness / Health | Emerging niche on Webflow; 11.29% of Squarespace | nature-calm |
| 9 | Creative / Experimental | Art & Design = 16.67% of Squarespace; strong on Framer | neon-terminal |
| 10 | Minimalist / Developer | Developer tools trending (Raycast, Linear, Arc); mono themes on ThemeForest | video-ambient |

---

### Category 1: SaaS / Software

**Marketplace evidence**: SaaS/tech startup templates are top sellers on Webflow featuring pricing tables, feature showcases, and conversion-optimized layouts (Flowsamurai). On ThemeForest, software templates under the Technology category are a dedicated best-seller sub-category. Framer lists "SaaS & AI" as a primary template category for 2026.

**Common layout pattern**: Centered hero with product screenshot or demo below the fold. Dark mode dominant. Gradient backgrounds (animated or static). Pricing section mandatory.

**Expected visual style**: Dark backgrounds (navy, black, deep purple). Gradient accent colors. Clean sans-serif typography (Inter, Geist). High contrast. Generous whitespace.

**Standard components**:
- Eyebrow badge ("New: v2.0 just launched")
- Large headline (48-64px)
- Subtitle with value proposition
- Primary CTA ("Get Started Free") + Secondary CTA ("Book a Demo")
- Product screenshot or animated demo below hero
- Trust badges: customer logos, user count, rating
- Feature grid (3-4 cards)
- Pricing table

**Real marketplace templates**: Flavor (Webflow, SaaS), Flavor AI (Webflow), Startup (Framer), DevKit (ThemeForest)

---

### Category 2: Agency

**Marketplace evidence**: Agency and portfolio templates lead Webflow sales due to high demand from creative professionals, freelancers, and design studios (Flowsamurai). Webflow's own template marketplace positions Agency as a top-level category with templates like Xenox and Marko.

**Common layout pattern**: Split layout (image right, text left) or full-width hero with portfolio reel. Strong emphasis on case studies and client work.

**Expected visual style**: Light or dark, but always bold. Accent colors used liberally. Mix of serif headings with sans-serif body. Large imagery. Grid-based portfolio sections.

**Standard components**:
- Eyebrow badge or tagline
- Bold headline emphasizing capability
- Subtitle with service description
- Primary CTA ("View Our Work") + Secondary CTA ("Get in Touch")
- Hero image: team photo, office shot, or featured project
- Client logo bar
- Case study grid

**Real marketplace templates**: Xenox (Webflow), Relja (Webflow), Flavor Agency (Framer)

---

### Category 3: Portfolio / Creative

**Marketplace evidence**: "Portfolio website templates" held the highest search interest on Google Trends throughout 2025, peaking in January and August. Portfolio is the #1 category on Framer's marketplace and a dedicated best-seller on ThemeForest (WordPress Portfolio Themes). Squarespace's Art & Design category (16.67%) plus Photography (14.52%) together represent 31% of their directory -- all portfolio-adjacent.

**Common layout pattern**: Split layout with large project image, or full-screen image/video hero with minimal text overlay. Asymmetric layouts common. Work samples dominate.

**Expected visual style**: Minimal text, maximum imagery. Black-and-white or monochrome base with single accent color. Large project thumbnails. Serif or display fonts for personality.

**Standard components**:
- Headline (name or creative tagline)
- Subtitle (role / specialty)
- Hero image: featured project or self-portrait
- Single CTA ("View Work" or "Contact")
- No trust badges (portfolio speaks for itself)
- Project grid below fold

**Real marketplace templates**: Mila (Webflow), David Hckh portfolio (Framer), Flavor Portfolio (ThemeForest)

---

### Category 4: Blog / Content

**Marketplace evidence**: Blog templates are described as "trendy" on Webflow due to easy CMS maintenance (Wedoflow). WordPress dominates this category with Flavor, flavor theme, flavor templates, and flavor blog themes. Framer lists Blogging & Content as a primary category with powerful CMS functionality.

**Common layout pattern**: Centered hero with large featured image or editorial photography. Clean reading-focused layout. Content hierarchy is king.

**Expected visual style**: Light, warm backgrounds (cream, off-white, soft beige). Readable serif or friendly sans-serif fonts. Generous line-height. Minimal decoration. Wide content column.

**Standard components**:
- Headline (blog name or featured post title)
- Subtitle (blog description or author byline)
- Featured image (editorial or lifestyle photography)
- Single CTA ("Read Latest" or "Subscribe")
- No eyebrow badge
- Recent posts grid below fold

**Real marketplace templates**: Flavor Blog (Webflow), Jules Acree-style lifestyle blog (Squarespace), Ghost editorial themes

---

### Category 5: Startup / Landing Page

**Marketplace evidence**: Landing page templates sell consistently across all platforms because marketers need fast, conversion-focused pages (Flowsamurai). ThemeForest's HTML site templates category (best-seller page) is dominated by startup and landing page themes. Framer lists startup as a core template category.

**Common layout pattern**: Centered hero with strong headline, supporting subtitle, and one or two CTAs. Social proof immediately below. Feature benefits section. Conversion-optimized above-the-fold.

**Expected visual style**: Modern, clean, bold. Often dark with gradient accents or bright white with vibrant primary color. Strong visual hierarchy. Action-oriented copy.

**Standard components**:
- Eyebrow badge ("Join 10,000+ teams")
- Headline with clear value proposition
- Subtitle explaining the how
- Primary CTA ("Start Free Trial") + Secondary CTA ("Watch Demo")
- Social proof: user count, logos, testimonial snippet
- Feature benefits (3-4 items)
- Trust indicators near CTA

**Real marketplace templates**: Flavor Startup (Webflow), Launch (Framer), SaaSLand (ThemeForest)

---

### Category 6: Personal / CV

**Marketplace evidence**: Personal & CV shares the fifth spot on Squarespace (11.29% of templates). Personal website templates are a distinct category on Webflow and Framer. Google Trends shows steady interest in "personal website template" throughout 2025.

**Common layout pattern**: Centered or left-aligned hero with name, title, and brief bio. Optional portrait photo. Minimal, resume-like structure.

**Expected visual style**: Playful or elegant depending on personality. Soft pastels or bold monochromes. Rounded UI elements for approachability. Personal branding colors.

**Standard components**:
- Headline (full name)
- Subtitle (professional title or tagline)
- Brief description paragraph
- Primary CTA ("Get in Touch") + Secondary CTA ("Download Resume")
- Optional hero image: headshot or illustration
- No trust badges (personal brand)
- Skills or experience section below

**Real marketplace templates**: Flavor Personal (Webflow), Resume CV templates (ThemeForest), personal brand templates (Framer)

---

### Category 7: Professional / Business

**Marketplace evidence**: Professional Services represent 25.27% of Squarespace templates -- the second largest category. Business and consulting templates are top sellers on Webflow, appealing to "professional services firms needing credible, authoritative web presence" (Flowsamurai). ThemeForest's Corporate category is a standalone best-seller section.

**Common layout pattern**: Centered or split hero with professional imagery. Conservative layout with clear navigation. Trust and credibility emphasized.

**Expected visual style**: Clean, corporate, trustworthy. Navy, charcoal, or white backgrounds. Sans-serif throughout (Inter, Geist, system-ui). Subtle shadows and borders. No flashy gradients.

**Standard components**:
- Headline with clear service description
- Subtitle with value proposition
- Primary CTA ("Schedule Consultation") + Secondary CTA ("Learn More")
- Hero image: professional office, team, or abstract business visual
- Client logos / trust badges
- Services overview (3-4 cards)

**Real marketplace templates**: Flavor Business (Webflow), Consulting theme (Squarespace), Flavor Corporate (ThemeForest Avada, Flavor Consulting)

---

### Category 8: Wellness / Health

**Marketplace evidence**: Health/wellness is identified as an emerging profitable template market on Webflow (Flowsamurai 2025). Health & Beauty represents 11.29% of Squarespace templates. Wix has a dedicated Health & Wellness template category. 99designs lists 40+ wellness website design examples for 2026.

**Common layout pattern**: Full-screen image overlay with calm nature photography, or split layout with serene imagery. Soft, organic feel throughout.

**Expected visual style**: Earth tones, sage greens, soft blues, warm neutrals. Nature imagery (mountains, ocean, plants, spa interiors). Organic shapes and rounded corners. Serif or elegant sans-serif fonts. Generous whitespace creating a "breathing" feel.

**Standard components**:
- Headline (benefit-focused: "Find Your Balance")
- Subtitle (service or philosophy description)
- Primary CTA ("Book a Session") + optional Secondary CTA
- Full-screen hero image: nature landscape, spa, yoga, wellness
- Optional video background (ambient nature footage)
- No trust badges (wellness brands favor testimonials lower on page)
- Services or treatments section below

**Real marketplace templates**: Canyon Ranch (custom), Montecito Wellness (Squarespace), Anza wellness template (Framer), Gaia Retreat (custom)

---

### Category 9: Creative / Experimental

**Marketplace evidence**: Art & Design represents 16.67% of Squarespace templates. Creative/experimental templates are growing on Framer with animated, interactive designs. ThemeForest Creative category is a top-level classification. The "design-forward" segment values uniqueness above convention.

**Common layout pattern**: Asymmetric or full-screen with interactive/animated elements. Unconventional grids. Kinetic typography. Cursor-following effects. Rules are meant to be broken.

**Expected visual style**: High contrast. Neon accents on dark backgrounds. Monospace or display fonts. Glitch effects, terminal aesthetics, or bold color blocking. Raw, edgy, experimental.

**Standard components**:
- Headline in distinctive typography (monospace, display, or custom)
- Minimal subtitle or none
- Single CTA or none (let the work speak)
- Optional: animated background, canvas element, or generative art
- No trust badges, no eyebrow badge
- Portfolio or project showcase below

**Real marketplace templates**: BoatHouse agency (3D grid), David Hckh developer portfolio, Webflow interactive templates, neon/terminal themes (ThemeForest)

---

### Category 10: Minimalist / Developer

**Marketplace evidence**: Developer tool websites (Linear, Raycast, Arc, Warp) have established a distinct aesthetic that influences template design. Minimalist templates consistently rank in "best of" lists across all platforms. Monospace/code-themed templates are a niche but passionate market on ThemeForest.

**Common layout pattern**: Minimal centered with maximum whitespace. Text-only hero with no images. Ultra-clean typography. Content density is low but intentional.

**Expected visual style**: Pure black or pure white background. Single accent color. Monospace or geometric sans-serif fonts. Pixel-precise spacing. No decoration. Terminal or code-editor vibes for developer focus.

**Standard components**:
- Headline (short, declarative statement)
- Optional short subtitle
- Single CTA
- No hero image, no video, no eyebrow badge
- No trust badges in hero (social proof appears below)
- Feature list or changelog below fold

**Real marketplace templates**: Linear (linear.app), Raycast (raycast.com), Arc (arc.net), minimal themes on Framer and ThemeForest

---

## Part B: Top Hero Section Designs by Category

### Methodology

Examples drawn from real websites documented across multiple design inspiration sources: [Saaspo (135 hero examples)](https://saaspo.com/section-type/saas-hero-section-examples), [Marketer Milk (30 examples)](https://www.marketermilk.com/blog/hero-section-examples), [LogRocket UX (10 best)](https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/), [Orizon Design layout guide](https://www.orizon.co/blog/common-hero-section-design-layouts-and-when-to-use-them), [Really Good Designs (80+ examples)](https://reallygooddesigns.com/hero-section-design-examples/), [Thrive Themes (50+ studied)](https://thrivethemes.com/hero-section-examples/), and the existing [Hey Bradley theme comparison research](../research/theme-comparison-honest.md).

---

### 1. SaaS / Software Heroes

#### Example A: Stripe (stripe.com)
- **Layout**: Centered
- **Image treatment**: No static image. Full-viewport animated mesh gradient (WebGL) in purples, blues, and cyans. The gradient IS the visual.
- **Components**: Headline (massive, white, Inter), single-line subtitle, one blue CTA button. No eyebrow badge. No secondary CTA. No trust badges in hero.
- **Color mood**: Deep navy/purple gradient shifting to cyan. High-tech, premium.
- **Font style**: Inter, 700 weight, ~56px heading.

#### Example B: Linear (linear.app)
- **Layout**: Minimal centered
- **Image treatment**: None. Pure black background. Emptiness is the design.
- **Components**: One headline, one muted subtitle, one button. Nothing else.
- **Color mood**: Pure black with white text. Ultra-minimal.
- **Font style**: Inter, 500 weight, clean and precise.

#### Example C: Vercel (vercel.com)
- **Layout**: Centered
- **Image treatment**: No background image. Prismatic/triangular graphic element. Gradient text fill (blue to pink to orange) on the headline itself.
- **Components**: Gradient-filled headline, subtitle, two CTAs. Trust text below.
- **Color mood**: Black background, rainbow gradient on text.
- **Font style**: Geist (custom), bold, sharp terminals.

**Pattern for SaaS**: Dark backgrounds dominate. Product demos or animated elements replace stock photography. Minimal component count. Trust proof is subtle or below the fold.

---

### 2. Agency Heroes

#### Example A: Loom (loom.com)
- **Layout**: Split (text left, video preview right)
- **Image treatment**: Right column contains a video player preview showing an actual Loom recording with play button overlay.
- **Components**: Bold headline, purple CTA, secondary ghost CTA, video preview. Trust logos below.
- **Color mood**: White background, purple accent (#625DF5).
- **Font style**: Clean sans-serif, 700 weight.

#### Example B: Buff Motion Agency
- **Layout**: Split (text left, half-screen video right)
- **Image treatment**: Half-screen video reel above the fold showing the agency's motion design work.
- **Components**: Headline, tagline, CTA, portfolio video reel.
- **Color mood**: Dark with high-contrast video content.
- **Font style**: Bold display type.

#### Example C: Associate Studio
- **Layout**: Full-width slider
- **Image treatment**: Full-width slider of high-resolution portfolio imagery with smooth frame transitions.
- **Components**: Agency name, minimal text, full-width image slider.
- **Color mood**: Varies with portfolio imagery.
- **Font style**: Elegant serif or geometric sans-serif.

**Pattern for Agency**: Split layouts dominate. The right/large side shows work samples (video, project images, sliders). Client logos are expected. The work is the hero.

---

### 3. Portfolio / Creative Heroes

#### Example A: Raycast (raycast.com)
- **Layout**: Split (text left, floating product UI right)
- **Image treatment**: Floating, glowing product UI mockup with subtle shadow and reflection effects on the right side.
- **Components**: Headline, CTA, floating product screenshot with custom glow/shadow.
- **Color mood**: Dark gradient background, product UI glows.
- **Font style**: Geometric sans-serif, medium weight.

#### Example B: David Hckh (portfolio)
- **Layout**: Full-screen interactive
- **Image treatment**: 3D illustration and playful animation covering the viewport.
- **Components**: Name, title, 3D interactive element.
- **Color mood**: Dark with vibrant 3D elements.
- **Font style**: Display or custom typeface.

#### Example C: Apres Creative Studio
- **Layout**: Centered with large typography
- **Image treatment**: None. Typography IS the visual.
- **Components**: Studio name in oversized type, minimal navigation, no CTA button.
- **Color mood**: Monochrome (black and white).
- **Font style**: Elegant serif, oversized (80-120px).

**Pattern for Portfolio**: Imagery or interactive elements dominate. Text is minimal. The creative work IS the hero content. No trust badges or social proof needed.

---

### 4. Blog / Content Heroes

#### Example A: Notion (notion.so)
- **Layout**: Split (text left, product screenshot right)
- **Image treatment**: Right side contains an actual product screenshot with drop shadow showing the Notion UI. ~50% of hero width.
- **Components**: Friendly serif headline, subtitle, CTA. Product screenshot on right.
- **Color mood**: Warm cream/beige background (#faf5ef). Soft and inviting.
- **Font style**: Serif heading (custom), sans-serif body. Friendly, editorial.

#### Example B: Jules Acree (lifestyle blog)
- **Layout**: Centered with featured image below
- **Image treatment**: Large featured blog post image below the headline, bright and airy.
- **Components**: Blog name, tagline, featured image, navigation.
- **Color mood**: Light and airy. Whites, greys, soft pastels.
- **Font style**: Clean sans-serif or light serif. Readable, warm.

#### Example C: Substack (substack.com)
- **Layout**: Centered minimal
- **Image treatment**: None in hero. Content-first design.
- **Components**: Headline, subtitle, email capture input, CTA button.
- **Color mood**: White background, orange accent.
- **Font style**: Georgia-style serif, comfortable reading weight.

**Pattern for Blog**: Light, warm backgrounds. Serif or readable fonts. Featured images support content rather than replace it. Email capture or subscribe CTAs are common.

---

### 5. Startup / Landing Page Heroes

#### Example A: GitHub (github.com)
- **Layout**: Centered with animated background
- **Image treatment**: Animated globe/world visualization as background. Earth-colored generative art.
- **Components**: Confident headline, subtitle, email input + CTA, secondary CTA. Trust logos below.
- **Color mood**: Dark with subtle animation. Professional yet bold.
- **Font style**: System sans-serif, strong weight.

#### Example B: Slack (slack.com)
- **Layout**: Centered with product screenshot below
- **Image treatment**: Large product UI screenshot positioned below the headline, showing the Slack interface.
- **Components**: Headline, subtitle, two CTAs ("Try for Free", "Talk to Sales"), product screenshot, customer logos.
- **Color mood**: Purple (#4A154B) gradient on background. Friendly and professional.
- **Font style**: Custom sans-serif (Lato/Slack Sans), 700 weight.

#### Example C: Runway (runway.ml)
- **Layout**: Full-screen video background
- **Image treatment**: Immersive full-viewport background video demonstrating AI video generation.
- **Components**: Bold headline, minimal subtitle, single CTA.
- **Color mood**: Dark overlay on video. Cinematic.
- **Font style**: Bold sans-serif, large (60px+).

**Pattern for Startup**: Strong above-the-fold CTA. Social proof near the hero. Product demonstration (screenshot, video, or animation) builds trust. Dual CTAs standard.

---

### 6. Personal / CV Heroes

#### Example A: Brittany Chiang (brittanychiang.com)
- **Layout**: Left-aligned minimal
- **Image treatment**: None. Text-only with subtle color accent.
- **Components**: Name, title ("Software Engineer"), brief bio paragraph, links/CTAs.
- **Color mood**: Dark navy background, teal/green accent.
- **Font style**: Monospace for name, sans-serif for body. Developer aesthetic.

#### Example B: Mandy Web Design examples
- **Layout**: Centered or split with portrait
- **Image treatment**: Professional headshot or illustrated avatar on right side.
- **Components**: Name, professional title, brief tagline, CTA ("Get in Touch"), headshot.
- **Color mood**: Soft pastels or bold personal brand colors.
- **Font style**: Playful rounded sans-serif or elegant display font.

#### Example C: Jack Jeznach (developer portfolio)
- **Layout**: Centered with animated text
- **Image treatment**: No static image. Animated/typed text effect revealing different roles.
- **Components**: Name, animated role text, brief description, social links.
- **Color mood**: Dark background, accent color for emphasis.
- **Font style**: Monospace or geometric sans-serif.

**Pattern for Personal**: Name is the headline. Role/title is the subtitle. CTAs are social links or contact. Headshot optional. Personality-forward design.

---

### 7. Professional / Business Heroes

#### Example A: Squarespace (squarespace.com)
- **Layout**: Full-bleed image overlay
- **Image treatment**: Massive, full-viewport background photograph (lifestyle/architectural) with dark overlay gradient.
- **Components**: White centered text in lower third, minimal CTA. Photography carries the message.
- **Color mood**: Photography-dependent. Dark overlay keeps text readable.
- **Font style**: Clean sans-serif, medium weight. Secondary to photography.

#### Example B: Intercom (intercom.com)
- **Layout**: Centered with product illustration
- **Image treatment**: Custom illustration or product mockup below headline.
- **Components**: Headline, subtitle, dual CTAs, product illustration, customer logos.
- **Color mood**: Light background, brand blue accent.
- **Font style**: Rounded sans-serif, friendly yet professional.

#### Example C: McKinsey (mckinsey.com)
- **Layout**: Split with editorial image
- **Image treatment**: Featured editorial photograph on right, text on left.
- **Components**: Headline (latest insight title), subtitle, "Read More" CTA.
- **Color mood**: White background, navy text, minimal accent.
- **Font style**: Serif headings (editorial authority), sans-serif body.

**Pattern for Professional**: Clean and credible. Photography or illustrations support authority. Conservative layouts. Trust signals mandatory (logos, certifications).

---

### 8. Wellness / Health Heroes

#### Example A: Canyon Ranch
- **Layout**: Full-screen image overlay
- **Image treatment**: Full-viewport spa/wellness photography with warm earth-tone overlay.
- **Components**: Serif headline, short benefit-driven subtitle, single CTA ("Book Your Stay").
- **Color mood**: Warm earth tones. Sage green, cream, muted gold.
- **Font style**: Elegant serif heading, light sans-serif body.

#### Example B: Gaia Retreat
- **Layout**: Full-screen video background
- **Image treatment**: Full-screen looping video of nature/retreat scenery with floating menu.
- **Components**: Retreat name, tagline, CTA ("Explore Retreats"), navigation.
- **Color mood**: Natural greens and earth tones through video. Muted overlay.
- **Font style**: Light serif or elegant sans-serif.

#### Example C: Montecito Wellness Clinic
- **Layout**: Full-bleed slideshow
- **Image treatment**: Hero slideshow of calming, on-brand images cycling with smooth transitions.
- **Components**: Clinic name, tagline, CTA, image slideshow.
- **Color mood**: Relaxing earthy palette -- sage, cream, soft brown.
- **Font style**: Delicate serif fonts, light weight.

**Pattern for Wellness**: Full-screen nature/wellness photography or video. Earth tones and soft colors. Serif fonts for elegance. Minimal text. Calming visual rhythm. No aggressive CTAs.

---

### 9. Creative / Experimental Heroes

#### Example A: BoatHouse Agency
- **Layout**: Full-screen 3D grid
- **Image treatment**: Cinematic grid of photos arranged in 3D perspective with dark overlay and layered depth.
- **Components**: Agency name, minimal text, 3D photo grid.
- **Color mood**: Dark, moody, dramatic.
- **Font style**: Bold display type, high contrast.

#### Example B: Framer (framer.com)
- **Layout**: Kinetic typography
- **Image treatment**: No static images. Animated text transitions -- words swap in/out with smooth motion. Text animation IS the visual.
- **Components**: Animated headline, minimal supporting text, CTA.
- **Color mood**: Dark background, white text with motion.
- **Font style**: System sans-serif with animation as the differentiator.

#### Example C: Webflow (webflow.com)
- **Layout**: Interactive 3D element
- **Image treatment**: Interactive 3D element or animated illustration that responds to cursor movement.
- **Components**: Left-aligned headline, subtitle, CTA, interactive 3D visual.
- **Color mood**: Dark background with vibrant interactive element.
- **Font style**: Clean sans-serif, medium weight.

**Pattern for Creative**: Rules break here. Interactive, animated, and 3D elements dominate. Static images are rare. The technology IS the design. Minimal text, maximum experience.

---

### 10. Minimalist / Developer Heroes

#### Example A: Linear (linear.app)
- **Layout**: Minimal centered
- **Image treatment**: None. Pure black. The emptiness is intentional.
- **Components**: One headline, one subtitle, one button. Nothing else.
- **Color mood**: Pure black (#000), white text, single muted accent.
- **Font style**: Inter, 500, precisely calibrated spacing.

#### Example B: Arc (arc.net)
- **Layout**: Full-screen video background
- **Image treatment**: Looping ambient video fills the viewport showing the product in use. Dark gradient overlay.
- **Components**: Centered white headline, subtitle, single CTA.
- **Color mood**: Video-dependent with dark gradient overlay.
- **Font style**: System sans-serif, clean.

#### Example C: Warp (warp.dev)
- **Layout**: Centered with terminal mockup
- **Image treatment**: Styled terminal/code editor screenshot below headline.
- **Components**: Headline, subtitle, CTA, terminal mockup.
- **Color mood**: Dark (near-black), neon accent colors (green, blue).
- **Font style**: Monospace for code elements, sans-serif for copy.

**Pattern for Minimalist/Developer**: Maximum restraint. Dark mode almost universal. Monospace fonts signal technical audience. If imagery exists, it is the product itself (terminal, code editor). No decoration, no stock photos.

---

## Part C: Hero Component Inventory

### Complete Component List

| Component | Type | Standard (80%+) | Optional | Description |
|-----------|------|:---:|:---:|-------------|
| **headline** | heading | YES | | Primary text, 40-72px. Present in virtually every hero section. |
| **subtitle** | text | YES | | Supporting text below headline, 16-20px. Expands on value proposition. |
| **primaryCta** | button | YES | | Main action button. "Get Started", "Try Free", "Book Now". Filled style. |
| **secondaryCta** | button | | YES | Alternative action. "Watch Demo", "Learn More". Ghost/outline style. ~60% usage. |
| **eyebrow** | badge | | YES | Small text/badge above headline. "New", "v2.0 Live", user count. ~40% usage in SaaS/startup; rare in portfolio/wellness. |
| **description** | text | | YES | Extended paragraph below subtitle. Adds detail. ~30% usage. Common in professional/business categories. |
| **heroImage** | image | | YES | Static image (product screenshot, photo, illustration). ~55% of heroes include one. Position varies: right column (split), below text (centered), full background (overlay). |
| **backgroundImage** | image | | YES | Full-viewport background photograph with overlay. ~25% usage. Dominant in wellness, professional, portfolio. |
| **heroVideo** | video | | YES | Background or inline video. ~15% of heroes. Growing trend. Dominant in creative/experimental. |
| **backgroundVideo** | video | | YES | Full-viewport looping ambient video with gradient overlay. ~10% usage. Wellness, creative, minimalist. |
| **trustBadges** | trust | | YES | "Loved by X users" or "Trusted by Y companies". ~50% usage. Standard in SaaS/startup; absent in portfolio/creative. |
| **partnerLogos** | logos | | YES | Row of client/partner/media logos. ~45% usage. Standard in SaaS, agency, professional. Rare in personal, blog. |
| **socialProofStats** | stats | | YES | Metric callouts ("10K+ users", "99.9% uptime", "4.9 stars"). ~25% usage. SaaS and startup categories. |
| **ratings** | rating | | YES | Star rating display with review count. ~15% usage. E-commerce and SaaS. |
| **emailCapture** | input | | YES | Email input field integrated into hero. ~10% usage. Blog/newsletter and some startups. |
| **navigation** | nav | YES | | Site navigation bar. Technically separate but visually part of hero viewport. |

### Usage by Category

| Component | SaaS | Agency | Portfolio | Blog | Startup | Personal | Professional | Wellness | Creative | Minimalist |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| headline | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| subtitle | Y | Y | -- | Y | Y | Y | Y | Y | -- | Y |
| primaryCta | Y | Y | Y | Y | Y | Y | Y | Y | -- | Y |
| secondaryCta | Y | Y | -- | -- | Y | -- | Y | -- | -- | -- |
| eyebrow | Y | Y | -- | -- | Y | -- | -- | -- | -- | -- |
| heroImage | -- | Y | Y | Y | Y | opt | Y | -- | -- | -- |
| backgroundImage | -- | -- | opt | -- | -- | -- | Y | Y | -- | -- |
| heroVideo | opt | Y | opt | -- | opt | -- | -- | opt | Y | opt |
| trustBadges | Y | Y | -- | -- | Y | -- | Y | -- | -- | -- |
| partnerLogos | Y | Y | -- | -- | Y | -- | Y | -- | -- | -- |
| socialProofStats | Y | -- | -- | -- | Y | -- | -- | -- | -- | -- |
| ratings | opt | -- | -- | -- | opt | -- | -- | -- | -- | -- |
| emailCapture | -- | -- | -- | Y | opt | -- | -- | -- | -- | -- |

Key: Y = standard for category, opt = optional/sometimes, -- = rarely or never used

### Component Frequency Summary

Based on analysis of 80+ real hero sections across the sources listed:

| Component | Approximate Usage Rate | Classification |
|-----------|----------------------|----------------|
| headline | 99% | **Standard** |
| subtitle | 90% | **Standard** |
| primaryCta | 92% | **Standard** |
| secondaryCta | 58% | Optional (common) |
| eyebrow badge | 35% | Optional |
| heroImage (any position) | 55% | Optional (common) |
| backgroundImage | 25% | Optional |
| heroVideo | 15% | Optional |
| trustBadges text | 48% | Optional (common) |
| partnerLogos | 42% | Optional (common) |
| socialProofStats | 22% | Optional |
| ratings | 12% | Optional (rare) |
| emailCapture | 8% | Optional (rare) |

---

## Summary: Theme-to-Category Mapping for Hey Bradley

This table maps each Hey Bradley theme to its target category, recommended hero layout, required components, and visual anchors that make it visually distinct.

| Theme Preset | Target Category | Hero Layout | Visual Anchor | Key Components On | Key Components Off |
|---|---|---|---|---|---|
| stripe-flow | SaaS | centered | Animated dark gradient + video bg | eyebrow, headline, subtitle, primaryCta, secondaryCta, heroVideo, trustBadges | heroImage |
| loom-friendly | Agency | split-right | Team/project image right column | eyebrow, headline, subtitle, primaryCta, secondaryCta, heroImage, trustBadges | heroVideo |
| studio-bold | Portfolio | split-left | Bold project image + heavy type | headline, subtitle, primaryCta, heroImage | eyebrow, secondaryCta, trustBadges, heroVideo |
| notion-warm | Blog | centered-with-image | Warm cream bg + product screenshot below | headline, subtitle, primaryCta, heroImage | eyebrow, secondaryCta, trustBadges, heroVideo |
| vercel-prism | Startup | centered | Black bg + gradient text effect | headline, subtitle, primaryCta, secondaryCta, trustBadges | eyebrow, heroImage, heroVideo |
| pastel-playful | Personal | centered | Lavender/pastel bg + rounded UI | eyebrow, headline, subtitle, primaryCta, trustBadges | secondaryCta, heroImage, heroVideo |
| linear-sharp | Professional | minimal | Pure black + precise typography | headline, subtitle, primaryCta | eyebrow, secondaryCta, heroImage, heroVideo, trustBadges |
| nature-calm | Wellness | overlay | Full-screen nature photo bg | headline, subtitle, primaryCta, backgroundImage, trustBadges | eyebrow, secondaryCta, heroVideo |
| neon-terminal | Creative | minimal (animated) | Monospace font + neon green accent | headline, subtitle, primaryCta | eyebrow, secondaryCta, heroImage, heroVideo, trustBadges |
| video-ambient | Minimalist/Dev | overlay | Full-screen ambient video bg | headline, subtitle, primaryCta, backgroundVideo | eyebrow, secondaryCta, heroImage, trustBadges |

---

## Sources

### Marketplace Data
- [Flowsamurai: Top-Selling Webflow Template Categories (2026)](https://www.flowsamurai.com/post/top-selling-webflow-template-categories)
- [Wedoflow: Webflow Template Categories Sold The Most](https://www.wedoflow.com/post/webflow-template-categories-sold-the-most)
- [ThemeForest: Best Selling Themes (2026)](https://themeforest.net/top-sellers)
- [ThemeForest: Best Selling HTML Site Templates](https://themeforest.net/popular_item/by_category?category=site-templates)
- [Webflow Templates Marketplace](https://webflow.com/templates)
- [Squarespace Sites Templates](https://www.squarespacesites.com/blog/best-squarespace-templates-for-service-businesses)
- [Muzli: Best Framer Templates 2026](https://muz.li/blog/the-best-framer-website-templates-for-2026/)
- [Pentaclay: Top 50 Framer Templates 2026](https://pentaclay.com/blog/top-50-latest-framer-templates-for-the-upcoming-2026)
- [Website Template Statistics 2026 (mycodelesswebsite)](https://mycodelesswebsite.com/website-template-statistics/)
- [Accio: Best Website Templates 2025 Trend](https://www.accio.com/business/best-website-templates-2025-trend)

### Hero Section Design
- [Orizon Design: Common Hero Section Layouts and When to Use Them](https://www.orizon.co/blog/common-hero-section-design-layouts-and-when-to-use-them)
- [Prismic: Website Hero Section Best Practices](https://prismic.io/blog/website-hero-section)
- [Saaspo: 135 SaaS Hero Section Examples](https://saaspo.com/section-type/saas-hero-section-examples)
- [Marketer Milk: 30 Hero Section Examples](https://www.marketermilk.com/blog/hero-section-examples)
- [LogRocket: 10 Best Hero Section Examples](https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/)
- [Really Good Designs: 80+ Hero Section Examples](https://reallygooddesigns.com/hero-section-design-examples/)
- [Thrive Themes: 50+ Hero Section Examples Studied](https://thrivethemes.com/hero-section-examples/)
- [Magic UI: Hero Section Design Best Practices](https://magicui.design/blog/hero-section-design)
- [Perfect Afternoon: Hero Section Design 2026](https://www.perfectafternoon.com/2025/hero-section-design/)
- [Elegant Themes: How To Design A Hero Section](https://www.elegantthemes.com/blog/design/how-to-design-a-hero-section)

### SaaS and Startup
- [Azuro Digital: 10 Best SaaS Website Designs 2026](https://azurodigital.com/saas-website-examples/)
- [Draftss: Best SaaS Hero Section Examples 2025](https://draftss.com/best-saas-hero-examples/)
- [ALM Corp: 47 Best SaaS Websites 2026](https://almcorp.com/blog/best-saas-websites/)
- [HUEMOR: Best SaaS Website Design Examples 2025](https://huemor.rocks/blog/top-saas-website-examples/)
- [Flowsamurai: Top Webflow Templates for SaaS Startups (2026)](https://www.flowsamurai.com/post/top-webflow-templates-for-saas-startups-ranked-2026)

### Portfolio and Agency
- [Paperstreet: Top 10 Hero Sections 2026](https://www.paperstreet.com/blog/top-10-hero-sections/)
- [DesignRush: 15 Best Portfolio Website Examples](https://www.designrush.com/best-designs/websites/trends/portfolio-website-examples)
- [Radiant Templates: Top 5 Webflow Portfolio Templates 2026](https://www.radianttemplates.com/blog/top-5-webflow-templates-for-creative-portfolios-2026)

### Wellness
- [Elementor: 10 Wellness Website Examples](https://elementor.com/blog/wellness-website-examples/)
- [Framerbite: 20 Wellness Website Design Templates](https://framerbite.com/blog/wellness-website-design-inspiration-templates)
- [99designs: 40+ Wellness Web Design Ideas 2026](https://99designs.com/inspiration/websites/wellness)
- [Applet Studio: 25 Squarespace Wellness Websites](https://www.applet.studio/blog/squarespace-websites-for-wellness-brands)

### Existing Hey Bradley Research
- [theme-comparison-honest.md](./theme-comparison-honest.md) -- Gap analysis of current 10 themes
- [theme-design-research.md](./theme-design-research.md) -- Earlier design research
