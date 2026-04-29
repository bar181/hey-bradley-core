# Template Design Reference — 2026-04-29

> Source for Sprint M premium templates (P56). A1/A2/A3 may consult this for visual direction.
> Goal: templates read as "designer made this," not "AI made this."
> Authored read-only by A4 Wave 1. No source-code changes.

## 1. Reference signals — Framer / Linear / Vercel

**Framer showcase (framer.com/showcase, framer.com/templates) — 2026 dominant patterns:**
- Editorial-scale type: hero headlines at 96-160px, tight tracking (-0.02em), single weight pairing (display + mono caption).
- One accent rule: monochrome base + exactly one saturated color (often a near-neon green, electric blue, or warm rust) used sparingly on CTAs and one underline.
- Hero is text-first: a single full-bleed sentence, no image, no button cluster — usually one CTA + one "see work" link.
- Aggressive whitespace: 200-320px section padding on desktop; sections breathe even on mobile (96-160px).
- Micro-asymmetry: off-grid offsets (12-24px) on hero blocks signal "designed by hand."

**Linear (linear.app) — what makes it feel designed:**
- Dark theme with low-contrast surfaces (#0F1014 base, #1A1B20 cards) — never pure black, never pure white text (uses #E6E8EB).
- Type pair: Inter Display for headlines, Inter for body, IBM Plex Mono for code/labels. One family, three roles.
- Restrained accent: a single muted purple (~#5E6AD2) that only appears on links, brand mark, and gradient washes — never on body buttons.
- Copy voice: terse, declarative, "Linear is a tool built for…". No exclamation marks. No "amazing/powerful/seamless."
- Micro-interactions visible from screenshots: 2px border on hover, 4px translate on cards, gradient halos on focus.

**Vercel (vercel.com) — image discipline & whitespace:**
- Whitespace ratio: ~60% of above-the-fold pixel area is empty. Hero is 1 line of type, 1 sentence below, 1 button.
- Sans-serif at extreme size: Geist Sans 80-128px, weight 500 (not 700 — feels lighter/more confident).
- Image discipline: almost no photography. When images appear, they are abstract gradient meshes, code screenshots, or product UI shots — never humans, never stock, never illustrations.
- Tasteful gradients: 2-3 hue blends used as section backdrops, never as text fills.
- Color anchor: black/white base, occasional electric blue (#0070F3) on a single CTA per page.

## 2. Indie portfolio aesthetic

References: Tobias van Schneider (vanschneider.com / Semplice), Brutalist Web Design Manifesto, IndieHackers builder portfolios (e.g., levels.io, marc.dev style).
- Single bold accent on raw white or off-black; type does the work, not color.
- Personal voice in copy: "I'm Bradley. I build things." No "we," no "leveraging."
- One large face-or-hand photo above the fold — humanizes immediately, distinguishes from AI output.
- Project list as raw catalog: numbered (01/02/03), no card thumbnails, dates aligned right.
- Slight typographic flex: one display face (e.g., GT Sectra, Reckless, PP Editorial) paired with a workhorse sans.

## 3. B2B agency aesthetic

References: ueno.co, instrument.com, work-and-co.com, mucca.com.
- Warm earthy palette: cream (#F5EFE6), rust (#B5532A), forest (#2F4A3A), slate (#3A3A3C). Not the Vercel/Linear cool-tech palette.
- Numbered process sections: "01. Discover / 02. Design / 03. Ship" — calm signal of method.
- Named case-study quotes with the client's full name + role + company logo. Anonymous testimonials read as fake.
- Generous serif headlines (Tiempos Headline, GT Super, Domaine Display) paired with a neutral grotesque body.
- Asymmetric two-column layouts: 1/3 + 2/3, never 50/50. 50/50 reads as Bootstrap default.

## 4. SaaS founder aesthetic

References: Vercel, Resend (resend.com), Linear, early Stripe, founder-led product pages.
- Founder photo on About or hero — ungated trust signal vs generic stock.
- Whitespace-led: hero headline ≤ 8 words, supporting line ≤ 16 words, single CTA.
- Deep blue or near-black accent (#0A1628 or #0F1014). Avoid purple-pink AI-startup gradient cliché.
- Code or product screenshot as the only image asset above the fold.
- Numbers earn trust: "2,400 teams ship faster" is better than "trusted by leading companies."

## 5. Anti-patterns (AVOID — looks AI-generated)

Templates must NOT do these. Each is a tell that triggers "AI made this":
1. **Generic stock photography** — Unsplash skyscraper, diverse-team-laughing-at-laptop, handshake-over-contract. Instant tell.
2. **Three-button hero** — "Get started / Watch demo / Learn more" cluster. Real designers pick one.
3. **Lorem-ipsum echoes** — "Welcome to Your Website," "Empowering Your Vision," "Your One-Stop Solution." These survive in AI output because they're never edited.
4. **Emoji headers in every section** — "🚀 Features / 💎 Pricing / 🎯 About." One emoji is a choice; six is a tell.
5. **Rainbow gradient buttons** — purple-to-pink-to-orange CTA. Reads as 2023 AI-startup boilerplate.
6. **Every section is an accordion or a 3-card grid** — visual monotony. Real sites vary section rhythm (hero / quote / grid / full-bleed image / list / CTA).
7. **Fake logos / "as seen in" with no real brands** — TechCrunch + Forbes + Wired arranged in greyscale row with no link. Worse than no row.
8. **Five testimonials with first-name-only or "CEO, Tech Company"** — no last name, no company = fabricated.
9. **Palette overuse** — 5+ accent colors. Premium templates use 1 accent, max 2.
10. **Center-aligned everything** — every section centered = AI default. Designed sites mix left-aligned, asymmetric, and centered intentionally.
11. **Pricing tier called "Enterprise"** with "Contact us" and no number — fine in real SaaS, tells in a portfolio template.

## 6. Per-template direction

- **A1 SaaS Founder** — Vercel-feel: white base (#FFFFFF) or near-black (#0A0A0B), generous whitespace (≥120px section padding), deep blue accent (#0A1628), founder photo prominent in About or hero, single CTA above the fold, code/product screenshot as the only hero image. Numeric trust signals over logo soup.
- **A2 Indie Portfolio** — Bold + personal: off-white (#FAFAF7) or near-black (#111111) base, single saturated accent (electric green #00E676 or warm rust #C84B31), display serif headlines (GT Sectra / PP Editorial / Reckless feel), first-person copy, numbered project list with right-aligned dates, one large face/hand photograph.
- **A3 B2B Agency** — Warm earthy: cream base (#F5EFE6), rust accent (#B5532A), forest secondary (#2F4A3A), serif display headlines, numbered process sections (01/02/03), named case-study quotes with full name + role + company, asymmetric 1/3 + 2/3 layouts. Avoid cool-tech blue palette entirely.

## 7. Concrete visual direction

**Type pairing recommendations:**
- A1 SaaS: Geist Sans (display 80-112px, body 18px) + Geist Mono for labels/code. Single family, three roles.
- A2 Indie: GT Sectra Display or PP Editorial New (headlines 96-160px) + Inter (body 17-18px). Serif + grotesque contrast.
- A3 B2B: Tiempos Headline or GT Super (headlines 72-96px) + Söhne or Inter (body 17px) + IBM Plex Mono for process numerals.

**Color hex anchors:**
- A1 SaaS: base `#FFFFFF` / text `#0A0A0B` / accent `#0A1628` (deep navy) / muted `#6B7280`.
- A2 Indie: base `#FAFAF7` / text `#111111` / accent `#C84B31` (warm rust) OR `#00E676` (electric green — pick one).
- A3 B2B: base `#F5EFE6` (cream) / text `#1F2421` / primary accent `#B5532A` (rust) / secondary `#2F4A3A` (forest).

**Hero composition pattern:**
- A1: left-aligned headline (≤8 words) + supporting line + 1 CTA + product screenshot offset right at 60% width.
- A2: full-bleed face/hand photo background OR full-bleed display headline ("Hi, I'm Bradley. I build things.") with name + 1 link.
- A3: asymmetric 1/3 (small caps eyebrow + headline) + 2/3 (large case-study image), no buttons in hero — first CTA appears after section 2.

**Image curation note (cross-ref A6 image audit):**
- A1: zero photography in hero. Product/code screenshots only. Founder photo appears in About section, not hero.
- A2: one large editorial photograph (face, hand, or workspace). No stock. Project thumbnails optional and small.
- A3: real client work imagery (case-study shots, process photos). Never stock teams-at-laptop. A6's audit should flag generic stock.

**Section rhythm rule (all three):** vary section types — never two identical layouts in a row. Pattern: hero / quote-or-stat / asymmetric content / full-bleed image-or-color / list-or-grid / CTA.
