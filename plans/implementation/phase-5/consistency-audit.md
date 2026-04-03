# Visual Consistency Audit Report

**Date:** 2026-04-02
**Mode:** Playwright automated visual audit (tests/consistency-audit.mjs)
**Themes:** Dark (Tech Business/SaaS default) + Light Chrome (Harvard HMS Brand)

## Important Note

The chrome light/dark toggle (Sun/Moon icon in top bar) only affects the **builder UI chrome**
(top bar, left panel, right panel). The **preview content** uses inline styles from
`section.style.background` and `section.style.color` in the config JSON, which default to a
dark palette (`#0a0a1a` bg, `#f8fafc` text). This is by design -- the preview shows the user's
configured site colors.

## Section Audit Table

| Section | Dark OK | Light OK | Issues Found | Status |
|---------|---------|----------|--------------|--------|
| Top Menu (menu) | PASS | PASS | None | OK |
| Main Banner (hero) | PASS | PASS | None | OK |
| Content Cards (columns) | PASS | PASS | None | OK |
| Pricing (pricing) | PASS | PASS | None | OK |
| Action Block (action) | PASS | PASS | Minor: py-20 vs standard py-16 | OK (intentional) |
| Footer (footer) | PASS | PASS | None | OK |
| Quotes (quotes) | FAIL | FAIL | Text invisible - Card component overrides color | FIXED |
| Questions (questions) | PASS | PASS | None | OK |
| Numbers (numbers) | PASS | PASS | None | OK |
| Gallery (gallery) | PASS | PASS | None | OK |
| Image (image) | PASS | PASS | None | OK |
| Spacer (divider) | PASS | PASS | None | OK |
| Text (text) | PASS | PASS | None | OK |
| Logo Cloud (logos) | PASS | PASS | Logos too faded at opacity-40/50 | FIXED |
| Team (team) | PASS | PASS | None | OK |

## Issues Found and Fixed

### 1. Quotes / Testimonials / Features: Invisible text in Card components

**Root cause:** Templates using the shadcn `<Card>` component inherited `text-card-foreground`
from the Card's default classes. This CSS variable (`--card-foreground`) resolves to near-black
(`oklch(0.145 0 0)`) since the app uses the light-mode `:root` shadcn vars by default. On the
dark preview background (`#0a0a1a` / `#12122a`), this made all card text nearly invisible.

**Affected files:**
- `src/templates/quotes/QuotesCards.tsx`
- `src/templates/quotes/QuotesStars.tsx`
- `src/templates/testimonials/TestimonialsCards.tsx`
- `src/templates/features/FeaturesGrid.tsx`

**Fix:** Added `text-inherit` class to each `<Card>` usage so text color inherits from the
parent `<section>` element (which sets `color` via `section.style.color`).

### 2. Logo Cloud: Images too faded on dark backgrounds

**Root cause:** All three logo variants (Simple, Marquee, Grid) applied `grayscale` with
very low opacity (40-50%) making the placeholder images nearly invisible on dark backgrounds.

**Affected files:**
- `src/templates/logos/LogosSimple.tsx`
- `src/templates/logos/LogosMarquee.tsx`
- `src/templates/logos/LogosGrid.tsx`

**Fix:** Increased base opacity from 40-50% to 70% for better visibility while maintaining
the desaturated aesthetic. Hover state still transitions to full color/opacity.

### 3. Spacing Analysis (Informational)

Most sections use `py-16` (64px). Exceptions:
- `menu` / `navbar`: `py-3` (12px) -- correct for nav bars
- `hero` (centered variant): custom padding via `section.layout.padding` -- correct
- `action` (centered): `py-20` (80px) -- intentionally larger for CTA emphasis
- `divider`: `py-4` (16px) -- correct for spacer elements
- `footer`: `py-12` to `py-16` -- correct
- `quotes` (single): `py-24` (96px) -- intentionally larger for visual impact

These spacing variations are intentional and appropriate for each section's purpose.

## CSS Issues Summary

| Issue | Severity | Templates | Fix |
|-------|----------|-----------|-----|
| Card `text-card-foreground` overrides section color | Critical | QuotesCards, QuotesStars, TestimonialsCards, FeaturesGrid | `text-inherit` on Card |
| Logo images too faded | Medium | LogosSimple, LogosMarquee, LogosGrid | Opacity 40-50% -> 70% |
| Spacing inconsistency | Low | Various | Intentional per section type |

## Screenshots

All screenshots saved to `tests/screenshots/consistency/`.

- `menu-dark.png` / `menu-light.png`
- `hero-dark.png` / `hero-light.png`
- `columns-dark.png` / `columns-light.png`
- `pricing-dark.png` / `pricing-light.png`
- `action-dark.png` / `action-light.png`
- `footer-dark.png` / `footer-light.png`
- `quotes-dark.png` / `quotes-light.png`
- `questions-dark.png` / `questions-light.png`
- `numbers-dark.png` / `numbers-light.png`
- `gallery-dark.png` / `gallery-light.png`
- `image-dark.png` / `image-light.png`
- `divider-dark.png` / `divider-light.png`
- `text-dark.png` / `text-light.png`
- `logos-dark.png` / `logos-light.png`
- `team-dark.png` / `team-light.png`
