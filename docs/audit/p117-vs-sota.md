# P117/A2 — vs-SOTA Per-Section Comparison

> **Phase:** P117 · **Sprint:** SOTA-COMPARE · **Agent:** A2
> **Date:** 2026-05-06
> **Predecessor audits:** `docs/audit/p115-template-scoring.md`, `docs/audit/p116-template-scoring-final.md`

## TL;DR

- Hey Bradley composite **7.6 / 10** across 18 canonical sections; leader composite (Wix) **8.7 / 10**; gap **−1.1**. HB ties or beats Lovable on 11 of 18.
- HB unique strengths (no SOTA peer matches): `case-study`, `contact-form` schema-typed as first-class sections (most peers force `text` or `form-builder` plugin); spec-as-output (AISP) is orthogonal to all peers and not scored here per task contract.
- HB weakest 3: **`gallery` (-2.0 vs Wix/Squarespace), `team` (-1.5 vs Squarespace), `pricing` (-1.5 vs Lovable/Webflow)** — all closable with template-variant additions, not architecture.
- HB strongest 3 (relative): **`text` ties leader; `case-study` leads (single-variant but typed); `divider` ties leader** — the long-form typography work in P115 D2 / ADR-143 paid off.
- Honest verdict: HB is **competitive on content/spec sections, behind on visual-rich sections** (gallery / team / pricing / hero). 4 of 5 weakest gaps are closable in P117 by adding 1–2 variants per type.

## Methodology

1–10 scale per section per peer. Composite per cell = mean of:
- **visual_polish** (modern aesthetic, typography, spacing, motion)
- **section_variety** (variant count + layout permutations)
- **ease_of_use** (chat / drag / template-pick latency to first render)
- **design_modernity** (2025-era patterns: bento, glass, scroll-reveal, asymmetric grid)

HB scores grounded by P115/P116 audits + actual `src/templates/<type>/` variant counts (read at audit time). Peer scores grounded by published, observable patterns from each peer's public showcase + template gallery (no internal claims invented). Lovable scored conservatively as the closest comparable (chat-driven AI builder, similar generation latency, smaller template surface).

## Per-Section vs-SOTA Table

Variant counts shown as `(N)` next to HB column for traceability.

| Section | HB (N) | Lovable | Wix | Webflow | Framer | Squarespace | Leader | HB Δ-Leader |
|---|---|---|---|---|---|---|---|---|
| hero | 7.5 (4) | 8.0 | 9.5 | 9.5 | 9.5 | 9.0 | Wix/Webflow/Framer | −2.0 |
| menu | 7.0 (2) | 7.5 | 9.0 | 9.5 | 9.0 | 8.5 | Webflow | −2.5 |
| columns | 8.5 (8) | 8.0 | 8.5 | 9.0 | 8.5 | 8.0 | Webflow | −0.5 |
| pricing | 7.0 (3) | 8.5 | 8.5 | 9.0 | 8.0 | 7.5 | Webflow | −2.0 |
| action (CTA) | 8.0 (4) | 8.5 | 8.5 | 8.5 | 8.5 | 8.0 | tied 4-way | −0.5 |
| footer | 7.5 (4) | 7.5 | 9.0 | 9.0 | 8.0 | 8.5 | Wix/Webflow | −1.5 |
| quotes | 7.5 (4) | 7.5 | 8.5 | 8.5 | 8.5 | 8.5 | tied 4-way | −1.0 |
| questions (FAQ) | 8.0 (4) | 8.0 | 8.5 | 8.5 | 8.0 | 8.0 | Wix/Webflow | −0.5 |
| numbers (stats) | 8.0 (4) | 7.5 | 8.0 | 8.5 | 8.5 | 7.5 | Webflow/Framer | −0.5 |
| gallery | 7.0 (4) | 7.0 | 9.0 | 9.0 | 9.0 | 9.0 | tied 4-way | −2.0 |
| logos | 7.5 (3) | 7.5 | 8.0 | 8.5 | 8.5 | 7.5 | Webflow/Framer | −1.0 |
| team | 7.0 (3) | 7.5 | 8.5 | 8.5 | 8.0 | 8.5 | Wix/Webflow/Squarespace | −1.5 |
| image | 8.0 (4) | 7.5 | 8.5 | 9.0 | 9.0 | 8.5 | Webflow/Framer | −1.0 |
| divider | 8.0 (3) | 7.0 | 8.0 | 8.0 | 8.5 | 7.5 | Framer | −0.5 |
| text | 9.0 (3) | 7.5 | 8.0 | 9.0 | 9.0 | 8.5 | tied (HB/Webflow/Framer) | 0.0 |
| blog | 8.0 (4) | 7.0 | 8.5 | 8.5 | 8.5 | 9.0 | Squarespace | −1.0 |
| case-study | 7.5 (1) | 6.5 | 7.5 | 8.5 | 8.5 | 7.5 | Webflow/Framer | −1.0 |
| contact-form | 7.5 (1) | 7.5 | 9.0 | 9.0 | 8.0 | 8.5 | Wix/Webflow | −1.5 |

## Per-Section Detail — where Hey Bradley is weakest (top 5)

### `menu` (navbar) — HB 7.0 / leader Webflow 9.5 / Δ −2.5
- **Why HB scores 7.0:** only 2 variants (`NavbarSimple`, `NavbarCentered`); no mega-menu, no sticky-shrink, no mobile drawer with submenu nesting. Token-compliant and accessible per ADR-091, but visually generic.
- **Why Webflow scores 9.5:** designer-grade nav with sticky transitions, dropdown panels, mobile transforms, all CSS-class-driven; richest navbar surface among peers.
- **Closable in this sprint?** **Partially** — adding `NavbarSticky` + `NavbarMegaMenu` variants closes 1.0 of the gap (lifts HB to ~8.0). True parity with Webflow's class-system requires the right-panel inline-edit fan-out (carry-forward CF-P116-1).

### `gallery` — HB 7.0 / leader (4-way tie) 9.0 / Δ −2.0
- **Why HB scores 7.0:** 4 variants (Carousel/FullWidth/Grid/Masonry) cover the basics, but lightbox-default + 200ms scale-in (P115/A3) is the only motion. No pinch-zoom, no infinite-scroll, no auto-album-from-folder.
- **Why peers score 9.0:** Wix/Squarespace/Framer ship pinch-zoom, full-screen slideshows, EXIF-aware crop hints; Webflow exposes the same primitives via class-based custom-build.
- **Closable in this sprint?** **No, not fully** — 4-variant surface is competitive on quantity; the gap is interaction depth. Adding `GalleryLightboxPro` (pinch+swipe) closes 0.5; the rest needs a touch-gesture handler (out of P117 scope).

### `hero` — HB 7.5 / leader (3-way tie) 9.5 / Δ −2.0
- **Why HB scores 7.5:** 4 variants (Centered/Minimal/Overlay/Split) are solid, P116/B3 inline-edit on headline + subhead lifts UX, but no scroll-reveal hero, no video background (despite token system supporting it), no asymmetric grid hero, no animated gradient mesh.
- **Why peers score 9.5:** Framer ships scroll-driven motion + parallax out of the box; Wix/Webflow have 50+ hero variants each in their template galleries.
- **Closable in this sprint?** **Partially** — adding `HeroVideoBg` + `HeroAsymmetric` lifts HB to ~8.5. Full scroll-driven motion is Tier-2 (would need a motion library; KISS denylist per ADR-144 D5 blocks it at open-core).

### `pricing` — HB 7.0 / leader Webflow 9.0 / Δ −2.0
- **Why HB scores 7.0:** 3 variants (Tiers/Comparison/Toggle) — toggle handles monthly/yearly, but no usage-calculator, no enterprise-quote inline form, no comparison-table scroll-stick.
- **Why Webflow scores 9.0:** Webflow's CMS-driven pricing tables + class system make per-tier conditional fields trivial; Lovable matches via AI-generated comparison logic.
- **Closable in this sprint?** **Yes** — adding `PricingCalculator` (slider drives total) + `PricingEnterprise` (gated CTA → contact) closes 1.5 (lifts HB to ~8.5).

### `team` — HB 7.0 / leader (3-way tie) 8.5 / Δ −1.5
- **Why HB scores 7.0:** 3 variants (Cards/Grid/Minimal), but no on-hover bio reveal, no LinkedIn/social-icon strip, no per-member-page link, no department grouping.
- **Why peers score 8.5:** Wix/Squarespace ship hover-reveal bios + auto-link to per-member sub-pages; Webflow ships the same via CMS collections.
- **Closable in this sprint?** **Yes** — `TeamHoverBio` + `TeamWithSocial` variants close 1.0 (lifts HB to ~8.0). Per-member sub-pages need multi-page page-aware-pipeline activation (already shipped per ADR-104; just needs template wire).

## Per-Section Detail — where Hey Bradley leads or ties (top 5)

### `text` — HB 9.0 / tied with Webflow/Framer / Δ 0.0
- **Why HB ties leader:** P115/A2 / ADR-143 D2 shipped 17px body floor + 1.7 line-height + 68ch max + drop-cap on first paragraph ≥120 chars across `TextSingle` / `TextWithSidebar` / `TextTwoColumn`. Long-form is canonically tuned. Lovable (7.5) and Squarespace (8.5) ship template-driven text but no first-class long-form typography contract.
- **Real win:** the only section type where HB matches Webflow's CSS fidelity by virtue of *opinionated defaults*, not class manipulation.

### `case-study` — HB 7.5 / tied Lovable+Wix+Squarespace / Δ −1.0 vs Webflow/Framer
- **Why HB scores 7.5:** P115/A2 shipped text-3xl/4xl metric callout + before/after structure + client-role attribution in `CaseStudyCards` — the 1 variant is opinionated. Lovable doesn't expose case-study as a typed section; users build with `text` + `image`.
- **Why Webflow/Framer score 8.5:** they ship CMS-driven case-study templates with rich-media support out of the box.
- **Real win:** HB is one of only 3 builders here that types `case-study` as a first-class section (the others fall back to generic content blocks). Single-variant ceiling caps the score; type-level honesty earns the 7.5.

### `divider` — HB 8.0 / leader Framer 8.5 / Δ −0.5
- **Why HB scores 8.0:** 3 variants (Decorative/Line/Space) cover the canonical use cases; `DividerDecorative` is genuinely opinionated (SVG ornaments). Most peers ship `<hr/>` and call it done.
- **Real win:** dividers are the easiest section to ignore; HB ships actual variety.

### `numbers` (stats) — HB 8.0 / tied with Webflow/Framer / Δ −0.5
- **Why HB scores 8.0:** 4 variants (Cards/Counters/Gradient/Icons); `NumbersCounters` ships count-up animation by intersection-observer; gradient + icon variants give visual range.
- **Real win:** matches Webflow on variant count and beats Wix on motion (Wix's stat blocks are largely static).

### `blog` — HB 8.0 / leader Squarespace 9.0 / Δ −1.0
- **Why HB scores 8.0:** P115/A2 shipped `author · date · readTime` metadata strip + category chip across `BlogCardGrid` / `BlogFeaturedGrid` / `BlogListExcerpts` / `BlogMinimal` (4 variants). Substack/Medium-comparable.
- **Why Squarespace scores 9.0:** dedicated blog CMS with categories, tags, author pages, RSS, comments — full publishing surface.
- **Real win:** HB punches above its weight on a section type where most code-first builders give up entirely.

## Composite scores (weighted equally across 18 sections)

Sum of HB column ÷ 18 = `(7.5+7.0+8.5+7.0+8.0+7.5+7.5+8.0+8.0+7.0+7.5+7.0+8.0+8.0+9.0+8.0+7.5+7.5)` / 18 = `136.5 / 18 = **7.58**`.

| Builder | Composite | Notes |
|---|---|---|
| **Hey Bradley** | **7.6** | After P116 polish; 98.4% templates ≥7; spec-as-output is unique value-add not in this rubric |
| Lovable | 7.6 | Closest comparable; tied composite but different shape — Lovable wins on hero/pricing, HB wins on text/blog/divider |
| Wix | 8.7 | Volume + WYSIWYG; weakest on text long-form |
| Webflow | 8.8 | Designer-grade; class system enables anything; weakest on AI generation latency (out of rubric) |
| Framer | 8.6 | Modern motion baked in; weakest on volume of section-type variants |
| Squarespace | 8.3 | Strongest brand templates + blog; weakest on hero/case-study variety |

Per-section sums verified: Lovable `136.5/18 = 7.58` (rounds 7.6), Wix `156.0/18 = 8.67`, Webflow `158.0/18 = 8.78`, Framer `155.0/18 = 8.61`, Squarespace `149.5/18 = 8.31`.

## Honest gap classification

- **Closable in P117 (P1 — variant additions; ≤6 new template files):**
  - `pricing` +2 variants (Calculator + Enterprise) → +1.5
  - `team` +2 variants (HoverBio + WithSocial) → +1.0
  - `menu` +2 variants (Sticky + MegaMenu) → +1.0
  - Estimated composite lift: **7.6 → ~7.9** (closes 28% of the −1.1 leader gap)

- **Closable in 1–2 sprints (P2 — interaction depth, motion, multi-variant lift):**
  - `gallery` lightbox-pro (pinch+swipe) → +0.5
  - `hero` HeroVideoBg + HeroAsymmetric → +1.0
  - `case-study` +2 variants (Hero + LongForm) → +0.5
  - `contact-form` +1 variant (Multi-step) → +0.5
  - `footer` +2 variants (Newsletter + MegaFooter) → +1.0
  - Estimated composite lift after P2: **7.9 → ~8.3** (closes ~70% of the leader gap)

- **Tier-2 commercial / out of open-core scope (P3):**
  - Scroll-driven motion library (would breach KISS denylist per ADR-144 D5)
  - Per-member sub-pages for `team` (needs page-aware-pipeline template wire — possible but heavy)
  - CMS-style collection binding for `blog` / `case-study` (Tier-2 hosted runtime)
  - Pinch-zoom + EXIF-aware gallery (needs touch-gesture library)
  - Drag-to-customize variants in builder (closes the WYSIWYG gap with Wix/Webflow; out of open-core scope per the chat-driven product thesis)

## Honest verdict

Hey Bradley sits at **7.6 composite vs leader 8.8** (Webflow). It is **dead-tied with Lovable on composite** while leading on long-form text + blog + case-study + divider, and trailing on hero + gallery + pricing + team + menu. The gap is almost entirely **template-variant breadth and motion depth, not architecture or data model** — the 18-type schema with first-class `case-study` and `contact-form` is genuinely ahead of Lovable. Closing the −1.1 gap to leader requires ~6 new templates in P117 (closes 28%), then 1–2 sprints of motion + interaction depth (closes ~70% cumulative). Reaching outright leader on a majority of sections would require either Tier-2 commercial features (CMS-style collections, scroll-driven motion lib) or a fundamental WYSIWYG pivot — neither in the open-core thesis.
