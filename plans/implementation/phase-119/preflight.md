# P119 — Site Polish (Surgical UX + Light/Dark Mode + AISP Research Context) — Preflight

> **Phase:** P119 · **Sprint:** SITE-POLISH · **Date:** 2026-05-07
> **Branch:** swarm/p119-site-polish
> **Predecessor:** P118.5 sealed at `7f5fe54`

## Mandate

Owner-locked outcomes from P118 / P118.5 review:

1. **5 surgical UX fixes** identified in honest review (≤25 LOC total)
2. **Light + dark mode** must work on every public surface
3. **AISP research context** added — math-first; cited as Harvard ALM Capstone research; the telephone-game analogy now carries the actual numbers

## The math-first AISP finding (locked copy; do not paraphrase)

Industry baseline: each handoff introduces ~40% ambiguity. After 5 iterations (design → ticket → code → review → ship) that compounds: 0.60⁵ ≈ 7.8% intent preservation (~99% failure to preserve original intent).

AISP baseline: ambiguity per step <2% (Crystal Atom δ floor). After 5 iterations: 0.98⁵ ≈ 90.4% intent preservation.

Same 5 steps. Different result. Cited as Harvard ALM Capstone research (Bradley Ross, 2026).

## 5 surgical UX fixes (locked from review)

| # | File | Change | Cap |
|---|---|---|---|
| 1 | `About.tsx:184-186` | Replace "Explore AISP" CTA with "Watch the walkthrough →" (consumer-track CTA on a consumer page) | 3 LOC |
| 2 | `About.tsx:65-67` | Replace pseudo-stat ("research shows a large share…") with the math-first AISP finding (single paragraph; cite Harvard ALM Capstone) | 12 LOC |
| 3 | `MarketingNav.tsx:15` | Adapt navbar to body palette using tokens; works in light + dark via `var(--hb-paper)` family | 8 LOC |
| 4 | `Welcome.tsx:43-51` | Tighten hero animation timing — overlap typewriter + morph instead of sequential; total ≤2s | 6 LOC |
| 5 | `Walkthrough.tsx:101-104` | Add muted placeholder "what would you like to build?" in Scene 1 fake-browser body so the cursor reveal has context | 4 LOC |

## Light/dark mode work

**Discovery from preflight inspection of `src/index.css`:**
- `--hb-*` token family (paper / ink / warm) is currently **light-mode-only** (defined in `:root`, no `.dark` overrides)
- `shadcn` token family (background / foreground / etc) DOES have `.dark { ... }` block
- `.dark` class is the activation surface (mode toggle elsewhere flips this on `<html>` or `<body>`)

**Fix:** add a `.dark { --hb-paper: ...; --hb-ink: ...; ... }` override block in `src/index.css` so marketing surfaces invert cleanly.

**Token mapping (light → dark):**
- `--hb-paper: #faf8f5` → dark equivalent (suggest `#1a1a1a` or `#161616` near-black; mirrors shadcn dark `--card`)
- `--hb-paper-soft: #f1ece4` → `#242424` panel/card
- `--hb-paper-tile: #f0ede8` → `#2c2c2c` tile
- `--hb-ink: #2d1f12` → parchment text `#f3f3f1`
- `--hb-ink-muted: #6b5e4f` → muted parchment `#a8a39a`
- `--hb-warm: #e8772e` → SAME (warm orange reads on both light + dark; brand-locked)
- `--hb-warm-hover: #c45f1c` → SAME
- Marketing card-text family (`--hb-mkt-text`, `--hb-mkt-text-secondary`, etc) → flip light-card-on-paper to dark-card-on-near-black

**Hex literal cleanup pass:**
- `About.tsx` — currently uses hardcoded hexes (`#faf8f5`, `#2d1f12`, `#e8772e`, etc.) — migrate to `var(--hb-*)` tokens so dark mode actually flips
- `OpenCore.tsx` — same migration
- `MarketingNav.tsx` — `bg-[#1a1a1a]/90` → token-based
- Welcome.tsx + Walkthrough.tsx are already token-compliant (verified in P118 review)

## AISP research context surfaces

### About.tsx (consumer-track; ONE paragraph)
Replace `<p>` at lines 65-67 with this exact copy (or token-equivalent rewrite):

> "Each handoff is a game of telephone — and the math is brutal. Capstone research at Harvard ALM measured ~40% ambiguity per step in normal software handoffs. After five steps — design → ticket → code → review → ship — only about 8% of original intent survives. **AISP, the symbolic protocol I built for Hey Bradley, keeps ambiguity below 2% per step. Same five steps, over 90% intent preserved.** That's the math the rest of this site is built on."

Plain language; named research citation; the math is shown without overwhelming.

### Research.tsx (engineer-track; deeper math)
Add a "The math" sub-section with the explicit calculation:
- Industry: 0.60⁵ ≈ 7.8% intent preservation (~92% failure)
- AISP: 0.98⁵ ≈ 90.4% intent preservation
- Same 5 steps. Different result.
- Cite as Harvard ALM Capstone (Bradley Ross, 2026).

### AISP.tsx (already has the 40% bar; extend)
Already shows industry ambiguity bars at ~50%/40%/30%/2%. Add ONE line below the bars showing the 5-iteration compounding math.

## Plan — single closer agent (no waves)

The scope is tightly bounded and the surfaces are disjoint enough that a single agent can land it cleanly:

1. Add `.dark { --hb-* }` override block to `src/index.css`
2. Surgical fixes #1-#5 in named files
3. Token migration on About.tsx + OpenCore.tsx + MarketingNav.tsx (replace hex with var)
4. AISP research context insertions (About + Research + AISP)
5. ADR-148 (Site Polish + Light/Dark Mode + Research Citation Standard) ≤120 LOC
6. `tests/p119-site-polish.spec.ts` (≥10 cases)
7. EOP triplet + CLAUDE.md sync + ADR README counter bump 138 → 139

## Hard rules

1. NO new dependencies
2. ADR-148 ≤120 LOC
3. The Harvard ALM Capstone citation MUST appear at every numerical claim — these are research findings, not pitch-deck stats. Citation makes them legitimate on a public surface despite the ADR-146 D2 "no numbers on public pages" rule (academic context exemption documented in ADR-148)
4. The "0.60⁵ ≈ 7.8%" / "0.98⁵ ≈ 90.4%" math appears verbatim on Research and AISP pages (math-first)
5. About page numbers framed plain-English ("about 40%" / "only about 8%" / "over 90%") — research-grade but consumer-readable
6. Light + dark mode both render cleanly on Welcome / Walkthrough / About / OpenCore / Blog / Research / MarketingNav
7. Both tsc strict configs CLEAN
8. EOP triplet at phase root
9. Brand "Hey Bradley" remains invisible in Walkthrough scenes 1-5 prose (do not regress P118.5)

## Acceptance gates

- 5 surgical fixes landed
- `.dark { --hb-* }` override block present in `src/index.css`
- Hardcoded hex literals on About + OpenCore + MarketingNav replaced with `var(--hb-*)` tokens
- AISP research finding paragraph on About + Research math + AISP page math
- ADR-148 Accepted (with the academic-citation exemption to ADR-146 D2 documented)
- ≥10 P119 tests GREEN
- Cumulative regression preserved (~1726+ at P119 anchor)
- Both tsc strict configs CLEAN
- CLAUDE.md + ADR README synced (138 → 139 ADRs)
