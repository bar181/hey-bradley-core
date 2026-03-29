# Phase 1: Core Builder — Brutally Honest Close-Out Review

**Date:** 2026-03-29
**Duration:** ~10 sessions across 2 days
**Verdict:** FUNCTIONAL but with significant architectural debt. The grandma story works. The code needs cleanup.

---

## What Works

1. **Theme switching is real.** 10 themes produce 10 visually distinct hero sections — different layouts, components, colors, fonts, images. Not just color swaps.

2. **The SIMPLE tab is clean.** Layout → Style → Content is logical. Toggle-beside-field is intuitive. Char indicators are compact.

3. **8 hero layouts are meaningful.** BG Image, BG Video, Minimal, Compact, Image Right/Left, Video/Image Below — each produces a structurally different hero.

4. **Persistence works.** LocalStorage auto-save, undo/redo with keyboard shortcuts, JSON export/import.

5. **ADR discipline is strong.** 12 ADRs documenting real decisions. The research → ADR → build sequence (finally adopted in 1.3e) was the right approach.

## What Doesn't Work Well

1. **CSS vars + inline styles coexist messily.** ADR-021 introduced CSS custom properties, but hero renderers still use `section.style.background` and `section.style.color` as inline styles. The migration is half-done. Some elements use `text-theme-text`, others `text-inherit`, others inline `color`. No consistency.

2. **Light theme text was broken 3 times.** Fixed with inline `color: section.style.color`, then `text-theme-text`, then `text-inherit`. Root cause: no single authoritative way to set text color. This should be ONE pattern.

3. **8 theme iterations.** The first 7 were wasted because the swarm coded before understanding requirements. The research-first approach in iteration 8 should have been iteration 1.

4. **shadcn Button can't be used for links.** Base-ui's Button component expects native `<button>`, not `<a>`. We had to revert to plain `<a>` tags. The shadcn investment is underutilized — only Switch, Badge, Card are actually used in the preview.

5. **No Playwright tests for Phase 1.3-1.5.** All verification was manual or build-only. The Phase 1.0 Playwright suite wasn't extended.

6. **Section routing is hero-only.** Right panel shows hero options regardless of which section is selected. Features and CTA sections render but have no editing UI.

7. **Font changes don't visually update sections.** `applyFont()` updates the store, but the font-family cascade through CSS vars is inconsistent.

8. **The theme JSON files include both `palette` and `colors` blocks.** This backward-compat bridge adds complexity. Should converge on one format.

## Numbers

| Metric | Value |
|--------|-------|
| Sub-phases | 6 (1.0 through 1.5) |
| Commits | 20+ |
| ADRs | 12 (010-021) |
| Theme files | 10 |
| Hero renderers | 4 (Centered, Split, Overlay, Minimal) |
| Section renderers | 2 (FeaturesGrid, CTASimple) |
| shadcn components installed | 7 (Button, Badge, Switch, Card, Input, Textarea, Accordion) |
| shadcn components used in preview | 2 (Badge, Card) |
| Inline styles remaining in renderers | ~12 (gradients, video, layout) |
| Playwright tests | 18 (Phase 1.0 only, not extended) |
| Bugs found by human review | 8+ |
| Bugs found by automated testing | 0 |

## Lessons for Phase 2

1. **ONE color system, not two.** Kill the `colors` block. Use `palette` only. CSS vars set from palette.
2. **ONE text color pattern.** `color: section.style.color` on the `<section>` element, `text-inherit` everywhere else. No `text-theme-text` class.
3. **Extend Playwright tests with every sub-phase.** If a feature isn't tested, it's not done.
4. **Research before code. Every time.** The 8-iteration theme disaster proves this.
5. **Don't install shadcn components you won't use.** Button isn't usable for links. Only add what's needed.

## Deferred to Phase 2+

| Item | Priority | Phase |
|------|----------|-------|
| Image picker dialog with thumbnail gallery | P1 | 2 |
| Video picker dialog with thumbnail gallery | P1 | 2 |
| Gradient picker | P2 | 2 |
| Image/video URL add dialog | P2 | 2 |
| Section-specific right panel routing | P1 | 2 |
| Right panel dropdown for section selection | P2 | 2 |
| Edit icon overlay on main preview | P2 | 2 |
| Light/dark mode with per-theme palette pairs | P1 | 2 |
| Accessibility dialog | P2 | 2 |
| XAI Docs live generation | P2 | 2 |
| Listen mode visual polish | P3 | 2 |
| 7 section types in grandma mode | P0 | 3 |
| Expert tab content for all sections | P1 | 4 |
| Chat/Listen LLM integration | P0 | 5 |
| Supabase auth + persistence | P1 | 5 |
| Image/video upload | P2 | 5 |
| Presentation mode (MVP demo) | P0 | MVP |

## Score: 77% — Passing, Not Excellent

The grandma story works: pick theme → choose layout → edit text → toggle components → change palette/font → preview on mobile → undo → export. That's the core loop and it functions.

But the code quality is uneven, the CSS architecture is half-migrated, and there are no automated tests beyond Phase 1.0. Phase 2 needs to prioritize consolidation over new features.
