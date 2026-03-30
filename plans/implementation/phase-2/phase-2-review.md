# Phase 2: System Polish + ALL 8 Section Editors + CRUD — Brutally Honest Review

**Date:** 2026-03-30
**Duration:** ~5 sessions across 2 days (2026-03-29 to 2026-03-30)
**Verdict:** SOLID DELIVERY with notable gaps. The section expansion story works. The foundation is ready for the POC push. Code quality improved over Phase 1 but still has rough edges.

---

## What Works

1. **All 8 section types have renderers + SIMPLE editors.** Hero, Features, Pricing, CTA, Footer, Testimonials, FAQ, Value Props — all render from JSON, all have editing UIs with copy inputs, component toggles, and live preview updates. This was the P0 goal and it was delivered cleanly in a single commit (`b07b520`).

2. **Section CRUD actually works.** Add any of the 8 types via a picker dialog. Remove with double-click confirmation. Duplicate. Reorder with arrows. New sections now pull real sample content from the current theme's JSON instead of rendering as empty black boxes (fixed 2026-03-30).

3. **The close was disciplined.** Bradley's 9-item close checklist (items 9-17) was executed in a single session. All items verified — build passes, 6 Playwright tests pass, accessibility gaps closed.

4. **Responsive navbar shipped.** Hamburger menu below `md` breakpoint collapses undo/redo, device preview, dark/light toggle into a clean dropdown. Simple, functional, not over-engineered.

5. **data-testid attributes everywhere.** All 8 section editors have `data-testid` on their inputs. Playwright can now target any field by name. This unblocked the smoke test suite.

6. **Scope management was excellent.** Bradley's `human-1.md` course-correction expanded the scope from "CSS cleanup + 3 editors" to "ALL 8 types + CRUD" early, avoiding a Phase 3 bottleneck. Then Phase 2 close deferred media pickers, second variants, and full test suite to keep momentum.

## What Doesn't Work Well

1. **Only one variant per non-hero section.** The implementation plan called for 2 variants each (FeaturesCards, CTASplit, FAQTwoCol). Only the first variant was built. This means the Layout accordion in non-hero section editors has nothing to switch between — it's either missing entirely or shows a single option. This limits the "wow factor" for the capstone.

2. **Font cascade is still broken.** Phase 1 flagged this. Phase 2 didn't fix it. `useThemeVars` sets `--theme-font` on the preview container, but not all section renderers consistently inherit it. Some sections render in system fonts regardless of the theme's font selection. This is visible when switching fonts in the Expert tab.

3. **Light mode preview contrast is bad.** When the user toggles the builder chrome to light mode, the center preview panel keeps the theme's dark text colors (e.g., light slate `#94a3b8`) on a now-lighter background. Text becomes hard to read. The audit flagged this at 3/5. Not addressed.

4. **No automated test coverage for section editor ↔ preview wiring.** The Phase 2 smoke tests verify that theme switching works and that the headline input exists, but they don't systematically verify that editing Features card titles updates the preview, or that toggling FAQ items collapses them. The interaction audit found that Playwright couldn't confirm copy-edit → preview-update for most section types.

5. **Dead code in theme JSONs.** `resolveColors.ts` was cleaned up to be palette-only, but the 10 theme JSON files may still contain `colors` blocks that are now dead weight. No cleanup pass was done.

6. **The `text-[11px]` → `text-xs` fix was incomplete.** The ModeToggle and section description fonts were bumped, but the status bar and right panel tabs (`SIMPLE`, `EXPERT`, `THEME CONFIGURATION`) may still have 11px text per the audit. The fix was targeted, not comprehensive.

7. **Accessibility gaps remain.** The P0 fixes (aria-labels, focus indicators) were done, but P1 items were not: no skip link, no `<nav>` landmarks around tab bars, `title` attributes not migrated to `aria-label` on icon buttons. The accessibility dialog (Doc 07 spec) is Phase 4.

8. **No session log entries.** `log.md` is empty — just a placeholder. No session notes were captured during Phase 2 work. This makes it harder to trace decisions.

## Numbers

| Metric | Phase 1 | Phase 2 | Delta |
|--------|---------|---------|-------|
| Sub-phases | 6 (1.0-1.5) | 7 (2.1-2.7, 5 complete + 2 partial) | — |
| Commits | 20+ | 11 (Phase 2 specific) | — |
| Section renderers | 2 (Hero variants only) | 11 (4 hero + 7 non-hero) | +9 |
| SIMPLE editors | 1 (Hero) | 8 (all section types) | +7 |
| Playwright tests | 18 (Phase 1.0) | 24 (18 + 6 Phase 2 smoke) | +6 |
| Total source files (.ts/.tsx) | ~55 | 72 | +17 |
| Total JSON data files | ~12 | 15 | +3 |
| Total lines of code | ~9,000 | ~13,600 | +4,600 |
| ADRs | 12 (010-021) | 13 (+ ADR-022 section registry) | +1 |
| UI/UX audit score | N/A | 3.4/5 (68%) | — |
| Accessibility pass rate | N/A | ~85% (most contrast/font passing) | — |
| Phase close score | 77% | ~82% (estimated) | +5% |

## Honest Assessment: What We're Building vs. Where We Are

### The Good
The builder fundamentally works. A user can:
- Pick from 10 themes → see a completely different website
- Click any of 8 section types in the left panel → edit it in the right panel
- Add/remove/duplicate/reorder sections
- Edit copy → see it update in the preview immediately
- Toggle components on/off
- Switch between light/dark palettes
- Export the entire config as JSON
- Undo/redo 100 steps

This is a real product interaction loop, not a mockup.

### The Bad
The builder looks like **a 70% product, not a 95% product.** Specific gaps:
- Only hero has multiple layout variants. Every other section has exactly one look.
- Font selection doesn't reliably cascade to all sections.
- New sections added via CRUD don't always match the current theme's visual style perfectly.
- The preview area clips content on smaller viewports (the responsive navbar helps but the 3-panel layout is still desktop-first).
- No full-page preview mode — you see one section at a time in the center panel, not a stacked website.

### The Path to POC
The updated north star (v4.0.0) correctly identifies that **Phase 3 (onboarding + full-page preview) is the make-or-break phase.** Without a landing page and full-page preview, the demo starts mid-product. The capstone judge doesn't see "pick a theme → here's your website." They see a 3-panel editor with a partial preview.

## Lessons for Phase 3

1. **Full-page preview is the #1 priority.** It's the "wow" moment that makes everything click. Before section variants, before media pickers, before drag-and-drop — get the full stacked website rendering.

2. **Navbar section unlocks the full-page story.** A site without navigation looks unfinished. Ship a simple navbar renderer in Phase 3.1.

3. **Second variants are higher impact than they seem.** Right now every Features section looks the same across all 10 themes. Adding even one alternative (FeaturesCards vs FeaturesGrid) doubles the visual diversity.

4. **Test the wiring, not just the rendering.** Phase 2's Playwright tests verify "does the page crash?" but not "does editing the pricing tier name update the preview text?" Phase 3 should add interaction-level tests.

5. **Don't defer the font cascade again.** It's been broken since Phase 1. Every demo where the user changes fonts and nothing visually changes is a missed "aha" moment.

## Score: ~82% — Good, Not Great

Phase 2 delivered the core section expansion story on time and within scope. The close was clean. But the product still feels like a builder in progress, not a polished demo. The gap between "it works" and "it wows" is Phase 3's job.

**Phase 2 status: CLOSED.**

---

## Deferred Items (Carried to Phase 3+)

| Item | Original Phase | Deferred To | Why |
|------|---------------|-------------|-----|
| Media pickers (image/video browse) | 2.6 | Phase 3 | URL inputs work, not blocking |
| Second variants per section | 2.3 | Phase 3 | One variant per type sufficient for close |
| Full Playwright suite (112 checks) | 2.7 | Phase 3 | Smoke tests sufficient for close |
| Font cascade fix | Phase 1 carry | Phase 3/5 | Needs CSS architecture work |
| Light mode preview contrast | 2.5 | Phase 5 | Builder chrome issue, not content |
| Google Fonts dynamic loading | 2.7 | Phase 5 | System fonts work as fallback |
| Dead `colors` block cleanup | 2.1 | Phase 4 | Dead code, no runtime impact |
| Section highlight on click | 2.7 | Phase 3 | UX polish, not blocking |
| Skip navigation link | a11y audit | Phase 3 | P1 accessibility |
| `<nav>` landmarks | a11y audit | Phase 3 | P1 accessibility |
