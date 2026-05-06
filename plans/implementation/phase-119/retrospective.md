# P119 — Site Polish — Retrospective

**Phase:** P119 / SITE-POLISH
**Date:** 2026-05-07
**Branch:** swarm/p119-site-polish

## Site polish outcomes (before / after)

| Surface | Before P119 | After P119 |
|---|---|---|
| About.tsx CTA pair | Try open source · Explore AISP (engineer-track on consumer page) | Try open source · Watch the walkthrough (consumer-track) |
| About.tsx Telephone Game card | Pseudo-stat ("research shows a large share…"; no citation) | Math-first AISP finding with Harvard ALM Capstone citation; AISP-preserves-90% in `<strong>` |
| MarketingNav.tsx chrome | `bg-[#1a1a1a]/90` (hardcoded near-black on parchment marketing pages) | `bg-[var(--hb-paper)]/85` + token-based text colors (light/dark portable) |
| Welcome.tsx hero animation | 2.4s typewriter + 2.2s morph delay (3.4s sequential) | 1.6s typewriter + 1.2s morph delay (~2.4s overlapping; Apple-tight) |
| Walkthrough.tsx Scene 1 | Bare blinking cursor (no eye anchor) | Muted placeholder "what would you like to build?" + cursor |
| Research.tsx | No explicit math section | NEW "The math" subsection: `0.60⁵ ≈ 7.8%` + `0.98⁵ ≈ 90.4%` + Harvard ALM citation |
| AISP.tsx ambiguity bars | Bars only, no compounding context | + 1-line compounding math + Harvard ALM citation |
| `--hb-*` token family | Light-mode-only (`:root`) | Light + dark mode (`.dark` override block) |
| About / OpenCore hex literals | Hardcoded `[#faf8f5]` / `[#2d1f12]` / `[#e8772e]` / `[#6b5e4f]` / `[#f1ece4]` | All migrated to `var(--hb-*)` (theme-mode portable) |

## Keep / Drop / Reframe

**Keep:**
- The "single-agent closer for tightly-bounded scope" pattern. P119 was disjoint enough that a single pass landed it cleanly without wave coordination.
- The hex→token migration discipline. Once `.dark` overrides exist, every hardcoded marketing hex is a latent bug.
- The Harvard ALM Capstone citation pattern. Numbers WITH academic citation are different from numbers as pitch-deck stats. ADR-148 D3 codifies the exemption to ADR-146 D2.

**Drop:**
- The assumption that ADR-146 D2 ("no numbers on public pages") was absolute. It was calibrated for marketing-pitch numbers; research findings cited as Capstone research are a different category. P119 carved the narrow exemption.

**Reframe:**
- "Why is this surface dark?" → P119 found two intentional dark-band CTA gradients on About + Research that should NOT migrate to tokens because they are deliberate dark callouts for visual hierarchy in light mode. Token migration is mechanical UNTIL it isn't — judgment matters.

## Carry-forwards

- **CF-P119-1:** Mode toggle UI surface (P119 ships override values; the toggle is post-RC owner-visible work).
- **CF-P119-2:** `from-[#242424]/[#1a1a1a]` dark-band CTAs on About + Research could become a shared `<DarkBandCTA>` component if a third surface wants the pattern.
- **CF-P119-3:** Localization of the math citation (Tier-2; deferred per ADR-109).
- **CF-P119-4:** OpenCore.tsx still uses some literal `40-65%` / `55%` / `<2%` numbers in the body (the "55% problem" framing). These are NOT cited as Harvard ALM Capstone research — they predate ADR-148. Future pass: either cite-and-keep (with citation) or reframe-as-blog-quote per ADR-146 D2 relocation pattern.
- **CF-P119-5:** Welcome.tsx hero animation now overlapping; reduced-motion path still tested via the existing `@media (prefers-reduced-motion: reduce)` block — unchanged from P118. Re-verify on a real low-end device post-RC.

## What gates the next phase

P119 is a polish sprint between P118.5 walkthrough seal and any future RC2-prep work. No new architectural decision; ADR-148 documents the academic-citation exemption + dark-mode token pattern + hex→token migration discipline.

## Honest scoping

The OpenCore.tsx "55% problem" stat block (3 cards: 55% / 40-65% / <2%) was NOT migrated to the Harvard ALM citation pattern in P119. It would have widened the sprint scope past the ≤25 LOC budget. Named as CF-P119-4 for explicit follow-up — not buried.
