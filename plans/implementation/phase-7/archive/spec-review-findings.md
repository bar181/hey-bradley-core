# Spec Quality Review — Hey Bradley vs LLM Output

**Date:** 2026-04-03
**Input:** GreenLeaf Consulting example (consulting.json)
**Reference files:** spec-actual-hb-1.md (JSON), spec-human-aisp.md (generated specs), spec-to-html-1.md (LLM HTML output)

---

## What Was Tested

1. Hey Bradley's live preview renders GreenLeaf Consulting from `consulting.json`
2. The Specs tab generates HUMAN + AISP specifications from that JSON
3. An external LLM (likely Claude/GPT) was given the AISP spec and asked to produce HTML
4. The LLM-generated HTML was compared against Hey Bradley's live preview

---

## Findings: Hey Bradley Spec Output

### HUMAN Spec — Grade: B+ (Good, but missing detail)

**What works well:**
- Structure is clear: Overview → Site Info → Page Structure → Section Details
- Section types and variants correctly identified
- Component counts accurate
- Copy/download buttons functional

**What's missing vs what the LLM needed:**
1. **Content is truncated in the AISP view.** Component text is cut at 30 chars (`spec-human-aisp.md` line 124: `"We partner with ambitious comp"` — truncated). The LLM had to guess the full text. The HUMAN view has the full text, so this is AISP-only issue.
2. **No spacing/padding info in HUMAN view.** The reference JSON has `"sectionPadding": "80px"`, `"containerMaxWidth": "1200px"` — not in the generated spec. The LLM added its own generous spacing which looked better.
3. **No typography weight/size details.** The JSON has `"headingWeight": 600`, `"baseSize": "16px"`, `"lineHeight": 1.7` — not in the generated spec.
4. **Section content headings not in HUMAN section details.** The `content.heading` and `content.subheading` are not surfaced in the Section Details (e.g., "Our Services" / "Strategic expertise across growth, operations, and leadership").
5. **No style info per section.** The JSON has `background` and `color` per section — not in the generated spec. The LLM had to derive these from the palette.

### AISP Spec — Grade: B- (Structural, but data loss)

**What works well:**
- Crystal Atom structure (Ω, Σ, Γ, Λ, Ε) is correctly formatted
- Type system is formal and impressive-looking
- Rules (Γ) correctly enumerate constraints
- Verification block (Ε) includes contrast ratio check

**What's missing:**
1. **Component text truncation at 30 chars.** This is the biggest issue. `"We partner with ambitious comp"` is not useful to an LLM trying to reproduce the site. Full text must be preserved.
2. **Only first 4 components shown per section.** `comps.slice(0, 4)` on line 164 of XAIDocsTab.tsx means sections with 5+ components lose data.
3. **No content.heading/subheading in sections.** The section headings ("Our Services", "Results That Speak") are not in the AISP output at all.
4. **Spacing/typography not in Λ bindings.** Missing: `spacing`, `borderRadius`, `headingWeight`, `lineHeight`.

---

## Findings: LLM-Generated HTML (spec-to-html-1.md)

### What the LLM did BETTER than Hey Bradley's preview:

1. **Font pairing.** Used `Instrument Serif` for headings + `DM Sans` for body — a professional serif/sans combination. Hey Bradley uses a single font family. The LLM's choice is visually superior.
2. **Generous whitespace.** `padding: 100px 24px 96px` on hero, `88px` on sections. Hey Bradley uses `py-16` (~64px) uniformly. The LLM output breathes more.
3. **Subtle decorative elements.** Radial gradient glow behind hero (`rgba(37,99,235,0.07)`), section eyebrow labels (`text-transform: uppercase; letter-spacing: 2px`), pill badge with dot indicator — small details Hey Bradley doesn't add.
4. **CSS custom properties for everything.** `--radius-sm`, `--shadow-sm`, `--shadow-md`, `--border-soft` — systematic design tokens. Hey Bradley uses inline Tailwind classes.
5. **Section label pattern.** Each section has a small uppercase label above the heading ("WHAT WE DO", "OUR IMPACT"). Hey Bradley has headings but no eyebrow labels.
6. **Typography scale.** `clamp(42px, 6vw, 72px)` for h1 with `letter-spacing: -1.5px` — fluid, professional. Hey Bradley uses fixed `text-3xl md:text-4xl`.

### What Hey Bradley does that the LLM didn't:

1. **Interactive elements.** Hover states, card lift, scroll animations — the LLM output is static.
2. **Theme switching.** Can instantly change the entire design system.
3. **Real-time editing.** Click any element to modify it.
4. **Multiple variants.** 47+ template variants vs the LLM's single interpretation.

---

## Recommendations for Enhancement

### Phase 7/8 (Pre-capstone — quick wins):

| # | Enhancement | Impact | Effort |
|---|-------------|--------|--------|
| 1 | **Remove 30-char truncation in AISP.** Show full text for all components. | High — eliminates data loss | 5 min |
| 2 | **Remove `slice(0, 4)` limit.** Show all components, not just first 4. | High — eliminates data loss | 5 min |
| 3 | **Add content.heading/subheading to both views.** The section headings are the most important missing content. | High — improves spec completeness | 30 min |
| 4 | **Add spacing/typography to HUMAN overview.** Include sectionPadding, containerMaxWidth, headingWeight, baseSize, lineHeight. | Medium — better spec fidelity | 15 min |
| 5 | **Add section background/color to HUMAN section details.** Each section should show its background and text color. | Medium — eliminates guesswork | 15 min |

### Post-capstone (larger improvements):

| # | Enhancement | Impact | Effort |
|---|-------------|--------|--------|
| 6 | **Serif heading font option.** Add 2-3 serif fonts (Instrument Serif, Playfair Display, Fraunces) to the font system. This was the biggest visual gap vs the LLM output. | High | 2-3 hrs |
| 7 | **Section eyebrow labels.** Add a small uppercase label above each section heading (like the LLM's "WHAT WE DO" pattern). | Medium | 1-2 hrs |
| 8 | **Fluid typography.** Use `clamp()` for heading sizes instead of fixed breakpoints. | Medium | 1-2 hrs |
| 9 | **More generous section spacing.** Increase default padding from `py-16` to `py-20 md:py-24` on content sections. | Low-Medium | 30 min |
| 10 | **Design tokens in CSS.** Convert hardcoded shadow/radius values to CSS custom properties for consistency. | Low | 2 hrs |

---

## Verdict

The spec generation is **structurally sound but loses critical data** through truncation and omission. Fixes 1-5 above are quick and would meaningfully improve the round-trip fidelity (spec → LLM → HTML). The visual gap between Hey Bradley's preview and the LLM's output is primarily about **font pairing** (serif/sans) and **whitespace** — addressable post-capstone.

The AISP format itself is a genuine differentiator. The Crystal Atom notation impressed in the reference and would impress in a capstone demo. The issue is not the format but the **data completeness** within it.

**For the capstone:** Fix items 1-5 (quick wins, ~1 hour total). The spec becomes genuinely useful for LLM reproduction. Save items 6-10 for post-capstone polish.
