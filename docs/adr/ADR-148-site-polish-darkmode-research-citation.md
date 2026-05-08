# ADR-148: Site Polish + Light/Dark Mode + Research Citation Standard

**Status:** Accepted
**Date:** 2026-05-07
**Phase:** P119 / SITE-POLISH
**Cross-refs:** ADR-087 (Design Token System) · ADR-091 (Canonical Component Quality) · ADR-094 (Professional Grade Standard) · ADR-141 (Quality Push) · ADR-146 (Simple Messaging + Product-Market Fit Standard) · ADR-147 (Walkthrough Story Page)

## Context

P118 / P118.5 honest review surfaced four concrete public-surface gaps that survived the simple-messaging reframe:

1. Five surgical UX issues — outdated CTA on About ("Explore AISP" pointing at engineer-track), misaligned `MarketingNav` chrome (`bg-[#1a1a1a]/90` hardcoded near-black on parchment-bodied marketing pages), too-slow Welcome hero animation (3.4s sequential), bare-cursor Walkthrough Scene 1 fake browser (no context for the eye), pseudo-stat ("research shows a large share…") in About's Telephone Game card with no actual citation.
2. **Light + dark mode were broken on marketing surfaces.** `--hb-*` tokens were defined only in `:root` (light-mode-only); the shadcn token family already had a `.dark` override block. Marketing pages used hardcoded `[#faf8f5]` / `[#2d1f12]` / `[#e8772e]` Tailwind arbitrary values that never invert under dark mode.
3. **AISP research findings had no surface.** ADR-146 D2 ("no numbers / no competitor names / no jargon on public pages") was calibrated for marketing-pitch numbers — but the owner is the creator of AISP and the researcher behind the math; the numbers ARE Harvard ALM Capstone research findings, which makes them legitimate on a public surface as cited research, not pitch-deck stats.

P119 closes all three gaps in a single surgical sprint: UX fixes (≤25 LOC), `.dark { --hb-* }` overrides, hex→token migration on About + OpenCore + MarketingNav, and the math-first AISP finding inserted at three calibrated surfaces (About consumer-track / Research engineer-track / AISP page already-deep math).

## Decisions

### D1 — 5 surgical UX fixes shipped (≤25 LOC total delta)

Fix 1: `About.tsx:184-186` — replace "Explore AISP" CTA (engineer-track destination on a consumer page) with "Watch the walkthrough →" linking to `/walkthrough`. Same icon, same styling; just swap destination + label. Fix 2: `About.tsx:65-67` — replace the unsourced "research shows a large share…" pseudo-stat with the locked AISP research finding paragraph (D3 below). Fix 3: `MarketingNav.tsx:15` — `bg-[#1a1a1a]/90` → `bg-[var(--hb-paper)]/85` + `border-[rgb(var(--hb-warm-rgb)/0.15)]`; brand wordmark + links use `text-[var(--hb-ink)]` / `text-[var(--hb-ink-muted)]` so dark mode flips cleanly; "Try Builder" CTA stays high-contrast (`bg-[var(--hb-warm)]` + `text-white`). Fix 4: `Welcome.tsx:43-51` — typewriter `2.4s steps(34)` → `1.6s steps(34)`; morph delay `2.2s` → `1.2s`; total visible time ~2.4s (Apple-tight without losing rhythm). Fix 5: `Walkthrough.tsx:101-104` — Scene 1 fake browser body gets a muted placeholder hint ("what would you like to build?") above the blinking cursor so the eye has context.

### D2 — `.dark { --hb-* }` override pattern for marketing tokens

Added a `.dark { ... }` block to `src/index.css` after the `:root` token definitions. Light-mode parchment palette flips to dark surfaces: `--hb-paper: #faf8f5` → `#1a1a1a`; `--hb-paper-soft: #f1ece4` → `#242424`; `--hb-paper-tile: #f0ede8` → `#2c2c2c`; `--hb-ink: #2d1f12` → `#f3f3f1`; `--hb-ink-muted: #6b5e4f` → `#a8a39a`; the marketing card-text family follows the same pattern. `--hb-warm: #e8772e` and `--hb-warm-hover: #c45f1c` stay light-mode values across both modes — brand-locked accent. Activation surface is the standard `.dark` class on `<html>` or `<body>`; mode toggle is delivered elsewhere in the chrome (P119 only ships the override values).

### D3 — Harvard ALM Capstone academic-citation exemption to ADR-146 D2

ADR-146 D2 forbade numbers / competitor names / jargon on public pages because they read as pitch-deck stats. P119 carves out a narrow exemption: **research findings cited as Harvard ALM Capstone research (Bradley Ross, 2026) are allowed on public surfaces** because the owner is the AISP author + the researcher; the math IS the message; and citation makes the numbers legitimate research, not marketing copy. Three surfaces carry the finding: (a) `About.tsx` Telephone Game card — single paragraph with plain-English numbers ("about 40%" / "only about 8%" / "over 90%"), Harvard ALM citation in-line, the AISP-preserves-90% sentence in `<strong>` for emphasis; (b) `Research.tsx` — NEW "The math" subsection with the explicit `0.60⁵ ≈ 7.8%` and `0.98⁵ ≈ 90.4%` calculations + Harvard ALM Capstone citation; (c) `AISP.tsx` — single line below the existing ambiguity bars ("Across five handoffs: industry baselines compound to ~8% intent preservation. AISP holds it above 90%. *Capstone research, Harvard ALM 2026.*"). The H1 lock on Welcome (ADR-146 D1) remains literal; the no-numbers / no-jargon rules on Welcome body copy remain unchanged. The exemption is scoped — it applies ONLY to academically-cited research findings on About / Research / AISP, not to feature claims, latency stats, ADR counts, test counts, or competitor comparisons.

### D4 — Hex→token migration on About + OpenCore + MarketingNav for theme-mode portability

Mechanical replacement of hardcoded Tailwind arbitrary-value hex on About.tsx + OpenCore.tsx + MarketingNav.tsx: `[#faf8f5]` → `[var(--hb-paper)]`; `[#f1ece4]` → `[var(--hb-paper-soft)]`; `[#2d1f12]` → `[var(--hb-ink)]`; `[#6b5e4f]` → `[var(--hb-ink-muted)]`; `[#e8772e]` → `[var(--hb-warm)]`; `hover:bg-[#c45f1c]` → `hover:bg-[var(--hb-warm-hover)]`. Brand-locked Crimson `#A51C30` retained (Harvard HMS brand). Two intentional dark-band CTAs on About + Research keep their `from-[#242424] to-[#1a1a1a]` gradient + `text-white` content because they ARE dark callouts for visual hierarchy in light mode (would lose contrast purpose if migrated). Welcome.tsx + Walkthrough.tsx already token-compliant from P118 / P118.5.

## Consequences

- 5 surgical UX fixes landed inside the ≤25 LOC budget across 5 files. About CTA now consumer-track. MarketingNav adapts to body palette. Welcome animation feels Apple-tight. Walkthrough Scene 1 has eye anchor.
- Dark mode now actually flips on Welcome / Walkthrough / About / OpenCore / Research / MarketingNav once a mode-toggle ships.
- The math-first AISP finding has three calibrated surfaces (consumer / engineer / deep) with Harvard ALM Capstone citation at every numerical claim. The owner's research has a public home that doesn't read as pitch-deck.
- KISS denylist per ADR-144 D5 / ADR-146 D4 holds — zero new dependencies. Pure CSS / pure token migration.
- Welcome H1 lock ("Describe it. See it.") + no-numbers + no-jargon regression guards from P118 still GREEN. Walkthrough brand-invisible-1-5 from P118.5 still GREEN.

## Carry-forwards

- **CF-P119-1:** mode toggle UI surface (P119 ships the `.dark` override values; the toggle itself is post-RC owner-visible work)
- **CF-P119-2:** `from-[#242424]/[#1a1a1a]` dark-band CTAs on About + Research could become a shared component if a third surface wants the pattern
- **CF-P119-3:** localization of the math citation (Tier-2; deferred per ADR-109 deferral list)
