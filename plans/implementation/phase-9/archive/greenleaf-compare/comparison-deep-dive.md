# DoD #12 — Reproduction Test: GreenLeaf Consulting

## Test Setup
- **Source:** Hey Bradley → GreenLeaf Consulting example → XAI DOCS → Build Plan
- **Target:** Build Plan pasted into Claude → "Build this in React + Tailwind"
- **Comparison:** Side-by-side visual review of 8 sections

---

## Section-by-Section Comparison

| Section | Hey Bradley (Left) | Claude Output (Right) | Match | Notes |
|---------|-------------------|----------------------|-------|-------|
| **Navbar** | Sticky, green logo, 5 nav links, "Schedule a Call" CTA button | Sticky, text logo, 5 nav links, "Schedule a Call" CTA button | 85% | Claude version is actually better — cleaner sticky behavior. Logo rendering differs (emoji vs text). Nav links match exactly. |
| **Hero** | "Strategy That Grows With You", italic "Grows", badge "Trusted by Fortune 500", two CTAs, social proof line, avatar dots | Same headline, same CTAs, same social proof text, badge present | 90% | Content is nearly identical. Claude version is cleaner/more modern. Hey Bradley has italic styling on "Grows" that Claude didn't reproduce. Avatar dots missing in Claude version. |
| **Columns (Services)** | "WHAT WE DO" label, "Our Services" heading, 2 cards visible (Growth Strategy, Operational Excellence), icon boxes, "Learn more →" links | "Our Services" heading, 3 cards in row (Growth Strategy, Operational Excellence, Leadership Advisory), icon boxes | 85% | Claude shows all 3 cards in one row vs Hey Bradley's 2-column layout. Content text is identical. Section label "WHAT WE DO" missing in Claude. "Learn more" links missing in Claude. |
| **Numbers** | "BY THE NUMBERS" label, "Results That Speak" heading, 4 stats in colored banner (120+, 94%, $2.4B, 14), dark gradient background | "Results That Speak" heading, 4 stats with lightning icons, clean white cards | 80% | Stats values are IDENTICAL (120+, 94%, $2.4B, 14). Labels differ slightly ("Clients Served" vs "Companies transformed"). Claude added decorative icons. Background treatment completely different — Hey Bradley uses dark gradient banner, Claude uses white cards. |
| **Quotes (Testimonials)** | "CLIENT VOICES" label, "Client Testimonials" heading, 3 cards with stars, quotes, avatar initials (SR, JC, MP), names + titles | "Client Testimonials" heading, 3 cards with stars, quotes, names + titles | 90% | Quote text is IDENTICAL across all 3 testimonials. Star ratings match. Names differ (Sarah Reynolds→Jennifer Walsh, James Chen→Robert Nakamura, Maria Patel→Amara Okafor) — Claude used different names from the spec. Titles differ similarly. |
| **Questions (FAQ)** | "FAQ" label, "Common Questions", 5 accordion items, one expanded with detailed answer | "Common Questions", 5 accordion items, different questions shown, one expanded | 70% | The questions are COMPLETELY DIFFERENT. Hey Bradley: "What types of companies..." / Claude: "How long does a typical engagement last?" The spec either didn't include the exact questions or Claude generated its own. This is the biggest gap. |
| **Action (CTA)** | "Ready to Accelerate Your Growth?", dark gradient banner, "Schedule a Consultation" green button, "Free · No commitment · 30 min" | Same heading, same description, same button text, same subtext | 95% | Nearly perfect reproduction. Content matches word-for-word. Layout differs slightly (Hey Bradley full-width banner vs Claude centered card). |
| **Footer** | "GreenLeaf Consulting", tagline, 3 link columns (Services/Company/Resources), social icons (LinkedIn, X, email), copyright + locations | Same structure, same columns, same links, social icons, copyright | 90% | Content matches closely. Claude added slightly different location formatting. Social icons present in both. Link text is identical across columns. |

---

## Overall Reproduction Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Content accuracy | 88% | Headlines, body text, CTA labels, stat values all match. Testimonial names and FAQ questions diverge. |
| Layout structure | 82% | All 8 sections present in correct order. Column counts and spacing differ. |
| Color/theme | 75% | Claude chose a similar green palette but different specific shades. Hey Bradley uses branded green (#16a34a area), Claude used a comparable but not identical green. |
| Component behavior | 85% | Sticky nav works. Accordion works. CTA buttons work. Hover states present. |
| Visual polish | 80% | Claude's version is arguably cleaner in some sections. Hey Bradley has more decorative elements (gradient banners, avatar dots, italic styling). |

### **Composite Score: 82%**

---

## Gap Analysis — Why Not 90%?

### P0 Gaps (Must fix in Build Plan generator)

1. **FAQ questions not in spec.** The Build Plan must include the EXACT question text for each accordion item, not just "FAQ section with 5 questions." This caused the biggest divergence — Claude invented its own questions.

2. **Testimonial names/titles not in spec.** The Build Plan must include exact names, titles, and companies for each testimonial. Claude used plausible but wrong names.

3. **Section labels missing from spec.** Labels like "WHAT WE DO", "BY THE NUMBERS", "CLIENT VOICES", "FAQ" are not in the Build Plan. These are decorative elements that set the visual tone. Add them.

### P1 Gaps (Should fix)

4. **Color hex values not explicit enough.** The Build Plan says "professional theme" but doesn't specify exact hex codes. Add: `accentPrimary: #16a34a`, `bgPrimary: #ffffff`, etc. This is what AISP Γ rules should encode.

5. **Layout variant not specified.** "Columns section" doesn't say "2 columns with Learn More links" vs "3 columns as cards." The variant name (e.g., "columns-cards" vs "columns-minimal") should be in the spec.

6. **Numbers background treatment not specified.** Hey Bradley uses a dark gradient banner. The Build Plan doesn't mention this. Claude used white cards. Add: `style: { background: "gradient-dark" }`.

### P2 Gaps (Nice to fix)

7. **Hero italic styling on "Grows".** Minor typographic detail not captured in spec.
8. **Avatar dots in hero social proof.** Decorative element not specified.
9. **"Learn more →" links on service cards.** Feature not mentioned in columns spec.

---

## Recommendations for the Swarm

To get from 82% to 90%+, the Build Plan generator needs these changes:

### 1. Include ALL content verbatim
For every section, the Build Plan must output the exact text for:
- Headings and subheadings
- Section labels/badges (e.g., "WHAT WE DO")
- ALL list items with full text (FAQ questions + answers, testimonial quotes + names + titles)
- CTA button text and subtext
- Stats values AND labels

### 2. Include explicit style directives
For each section, add:
- Background treatment (white / dark gradient / colored banner)
- Column count and card style
- Whether "Learn more" or similar links are present
- Avatar/icon treatment

### 3. Include color palette
Add a "Design System" section at the top of the Build Plan:
```
Colors:
  Primary: #16a34a (green)
  Background: #ffffff
  Text: #1a1a2e
  Accent: #16a34a
  Dark surface: #1e293b
Font: DM Sans
Border radius: 8px
```

### 4. Reference the AISP spec for precision
The AISP Crystal Atom already encodes most of this formally. The Build Plan should either embed the Crystal Atom or reference it. The Γ rules with exact component paths and Λ bindings with exact values are what push reproduction from 82% to 95%+.

---

## Verdict

**82% is strong for a first-pass reproduction.** The structure, content flow, and component types are all correct. The gaps are in specificity — the spec tells the AI WHAT to build but not enough about HOW it should look. Fixing the P0 gaps (FAQ content, testimonial names, section labels) would push this to ~88%. Adding explicit color/style directives would push it to 90%+.

**The thesis holds:** the Build Plan produces a recognizable, functional website from specs alone. The remaining gap is spec granularity, which is exactly what AISP Crystal Atoms solve — the formal notation encodes the details that natural-language specs leave to interpretation.