# P117/A3 — Site-Shape Capability Assessment

> Owner question: *"Is Hey Bradley capable of providing the full range of websites — SPA to multiple pages, from portfolio to blog style?"*
> Verified post-P116 against `src/data/examples/index.ts` (64 entries) + multi-page surfaces (schema / store / UI / pipeline / export).

## TL;DR
- **18 canonical site shapes assessed.** All 18 are at least demonstrated by a corpus entry.
- **Fully supported (YES + ≥7/10):** **15** shapes — SPA, multi-page, portfolio, blog, marketing landing, personal/about, SaaS landing, professional service, editorial/magazine, indie game/studio, research/academic, course/education, podcast/media, newsletter/opinion, agency/studio.
- **Supported but weak (YES + <7/10):** **3** shapes — restaurant/venue, non-profit, author/fiction (one demo each; no specialized section types — `menu`, `hours`, `donate`, `book-card` are absent; copy-only differentiation).
- **Unsupported:** **0** — every requested shape has at least 1 demo. **Closable in P117 Wave 2:** non-profit `donate` CTA + restaurant `menu`/`hours` section types (would lift restaurant + non-profit to ≥8).
- **Multi-page caveat (honest):** the wire ships end-to-end (schema + UI + store + pipeline + per-page export bundle) but **only 4 of 64 demos (6%) actually use it** — `axon-cli` (home + docs), `aisp-developer-retro` (methodology), `aisp-executive` (one named page), `coffee-essay` (`home` only with empty sections — single-page-shaped). Multi-page is **plumbed but under-demonstrated**.

---

## Supported Site Shapes Table

| # | Shape | Supported? | Demo count | Strength | Notes |
|--|--|--|--|--|--|
| 1 | SPA | YES | ~60 of 64 | 9/10 | Default; `config.sections[]` rendered as one page |
| 2 | Multi-page | YES | 4 (axon-cli / aisp-developer-retro / aisp-executive / coffee-essay) | 7/10 | Wire complete; demo coverage thin (6%) |
| 3 | Portfolio | YES | 5+ (photography, dev-portfolio, indie-portfolio, quattro-studio, b2b-agency) | 9/10 | Gallery + image + case-study sections all canonical |
| 4 | Blog | YES | 6 (blog-standard, fun-blog, capstone, podcast-show, contrarian-blog, podcaster-indie) | 9/10 | 4 BlogCard variants per ADR-097 + tagging + read-time |
| 5 | Marketing landing | YES | 25+ (most of corpus default) | 9/10 | Hero + columns + pricing + cta canonical |
| 6 | Personal / About | YES | 5+ (founder-story, ai-engineer-personal, mrs-albright-tutoring, indie-author-fiction, freelance-therapist) | 9/10 | Founder-direct preset (P113) ships voice |
| 7 | SaaS landing | YES | 8+ (launchpad, enterprise-saas, telehealth, greenlane-startup, saas-founder, ai-coding-copilot, ai-workflow-platform, ai-support-copilot) | 9/10 | 4 P80 agentic-product templates added |
| 8 | Restaurant / venue | YES | 3 (restaurant, food-truck-restaurant, local-events-venue) | 6/10 | No `menu`/`hours`/`event-list` section types — uses generic `columns`/`numbers` |
| 9 | Non-profit | YES | 1 (non-profit-community) | 6/10 | No `donate`/`impact-stat`/`volunteer-cta` section types |
| 10 | Professional service | YES | 6+ (clinic, mental-health-practice, law-firm, wedding-planner, freelance-therapist, real-estate) | 9/10 | Trust signals via `numbers` + `quotes` work cleanly |
| 11 | Editorial / magazine | YES | 2 (editorial-magazine, coffee-essay) | 9/10 | P115 long-form typography (17px / 1.7 / 68ch / drop-cap) per ADR-143 |
| 12 | Indie game / studio | YES | 1 (indie-game-studio) | 8/10 | Single demo; pixel-art styling works via theme palette |
| 13 | Research / academic | YES | 3 (researcher-academic, research-lab, research-newsletter) | 9/10 | IBM Plex Serif + data-stat callouts + DOI listings |
| 14 | Course / education | YES | 3 (education, course-creator-tech, codecraft-academy via education.json) | 9/10 | Cohort dates + named-students copy works |
| 15 | Podcast / media | YES | 2 (podcast-show, podcaster-indie) | 9/10 | Episode-card layout via generic `columns` works |
| 16 | Newsletter / opinion | YES | 2 (contrarian-blog, research-newsletter) | 8/10 | Free + paid tiers via `pricing` section |
| 17 | Author / fiction | YES | 1 (indie-author-fiction) | 6/10 | No `book-card`/`buy-link`/`praise-quotes` types — uses generic `quotes` |
| 18 | Agency / studio | YES | 4 (b2b-agency, north-light-agency, quattro-studio, telehealth via clinic.json) | 9/10 | Named case studies + process steps work |

---

## Per-Shape Detail (18 shapes)

### 1. SPA (single-page; default mode)
- **Supported:** YES
- **Pipeline:** `getActivePage(config, null)` returns synthetic single-page scope; `scopeRoot === ''`; `prefixPatchPaths()` is reference-equal pass-through.
- **Demonstrated by:** ~60 of 64 entries (every site without `pages[]` array).
- **Quality:** 9/10
- **Gaps:** none

### 2. Multi-page (per ADR-103 + ADR-104)
- **Supported:** YES — full wire confirmed:
  - Schema: `pages: pageSchema[].optional()` on `masterConfigSchema` (`src/lib/schemas/masterConfig.ts:173`)
  - Store: `activePageId: string | null` + `setActivePageId()` (`src/store/uiStore.ts:182,313`)
  - UI: `PageSelector.tsx` (173 LOC) — tabs + add/rename/delete + active-page hydration
  - Pipeline: `chatPipeline.ts` lines 313-321 + 453-454 + 524-531 — page-aware patch routing via `getActivePage` + `prefixPatchPaths`
  - Export: `shareSpecBundle.ts:62-94` `buildPageEntries()` emits per-page `humanSpec` + `northstar` + `filenames` into `bundle.pages[]`
- **Demonstrated by:** axon-cli (home + docs) · aisp-developer-retro (methodology) · aisp-executive (one named page) · coffee-essay (home with empty sections — effectively still single-page)
- **Quality:** 7/10 — wire is complete; demo coverage is **6% (4/64)** and 1 of 4 has empty sections
- **Gaps:** under-demonstrated; no demo with 3+ real multi-page-with-content (e.g. /home + /about + /pricing + /blog)

### 3. Portfolio
- **Supported:** YES
- **Demonstrated by:** photography · dev-portfolio · indie-portfolio · quattro-studio · b2b-agency
- **Sections used:** `gallery` + `image` + `text` + `case-study` (P75 / ADR-100 widened enum to 18 types)
- **Quality:** 9/10
- **Gaps:** none

### 4. Blog
- **Supported:** YES
- **Demonstrated by:** blog-standard · fun-blog · capstone · podcast-show · contrarian-blog · podcaster-indie
- **Sections used:** `blog` section type (ADR-100) + 4 BlogCard variants (BlogCardGrid / BlogFeaturedGrid / BlogListExcerpts / BlogMinimal) per P115/A2
- **Quality:** 9/10 — author/date/readTime metadata strip + category chip (P115)
- **Gaps:** none

### 5. Marketing landing
- **Supported:** YES (default shape)
- **Demonstrated by:** ~25+ entries
- **Sections:** hero / columns / numbers / pricing / cta / quotes / logos
- **Quality:** 9/10
- **Gaps:** none

### 6. Personal / About
- **Supported:** YES
- **Demonstrated by:** founder-story · ai-engineer-personal · mrs-albright-tutoring · indie-author-fiction · freelance-therapist
- **Voice:** P113 `founder-direct` storytelling preset wires cleanly
- **Quality:** 9/10
- **Gaps:** none

### 7. SaaS landing
- **Supported:** YES
- **Demonstrated by:** launchpad · enterprise-saas · telehealth · greenlane-startup · saas-founder · 4× P80 agentic-product templates
- **Quality:** 9/10
- **Gaps:** none

### 8. Restaurant / venue
- **Supported:** YES (with weakness)
- **Demonstrated by:** restaurant · food-truck-restaurant · local-events-venue
- **Sections used:** generic `columns` for menus, `numbers` for hours, `gallery` for photos
- **Quality:** 6/10 — works via generic types but no semantic `menu`/`hours`/`event-list` sections
- **Gaps:** **shape-specific section types missing** — `menu` (price + description rows), `hours` (day/time grid), `event-list` (date + band + cover price). Site `purpose` enum has `restaurant` value but no matching section type leverages it.
- **Closable in P117/W2:** Add 3 section types (`menu` / `hours` / `event-list`) — would lift to 8/10

### 9. Non-profit
- **Supported:** YES (with weakness)
- **Demonstrated by:** non-profit-community (single demo)
- **Sections used:** generic `numbers` for impact stats, `quotes` for volunteer testimonials, `cta` for donate/volunteer
- **Quality:** 6/10 — works but no semantic affordance
- **Gaps:** no `donate-cta`/`impact-stat`/`volunteer-signup` types; site `purpose` enum lacks `nonprofit` (defaults to `marketing`)
- **Closable in P117/W2:** Add `donate-cta` section type + 2nd non-profit demo (e.g. animal rescue or food bank) — would lift to 8/10

### 10. Professional service
- **Supported:** YES
- **Demonstrated by:** clinic · mental-health-practice · law-firm · wedding-planner · freelance-therapist · real-estate
- **Sections:** trust signals via `numbers` (years/clients) + `quotes` (testimonials) + `pricing` (packages)
- **Quality:** 9/10
- **Gaps:** none

### 11. Editorial / magazine
- **Supported:** YES
- **Demonstrated by:** editorial-magazine · coffee-essay
- **Typography:** P115 long-form standard (17px body / 1.7 line-height / 68ch / drop-cap on first paragraph) per ADR-143
- **Quality:** 9/10
- **Gaps:** none

### 12. Indie game / studio
- **Supported:** YES
- **Demonstrated by:** indie-game-studio (single P115 demo)
- **Visual treatment:** neon-pink + mint on near-black canvas; pixel-art screenshots via gallery
- **Quality:** 8/10 — single demo limits range; theme palette flexibility carries it
- **Gaps:** no game-specific `wishlist-cta` or `screenshot-carousel`; second demo (e.g. solo dev) would broaden
- **Closable:** none required

### 13. Research / academic
- **Supported:** YES
- **Demonstrated by:** researcher-academic · research-lab · research-newsletter
- **Treatment:** IBM Plex Serif + data-stat callouts + DOI publication listings
- **Quality:** 9/10
- **Gaps:** none

### 14. Course / education
- **Supported:** YES
- **Demonstrated by:** education (CodeCraft Academy) · course-creator-tech (Concrete) · 8-week cohorts demonstrated
- **Quality:** 9/10
- **Gaps:** none

### 15. Podcast / media
- **Supported:** YES
- **Demonstrated by:** podcast-show (Build Mode) · podcaster-indie (Cassette · Season Four)
- **Sections:** episode-card layout via `columns` + sponsor tiers via `pricing`
- **Quality:** 9/10
- **Gaps:** none

### 16. Newsletter / opinion
- **Supported:** YES
- **Demonstrated by:** contrarian-blog (The Slower Path) · research-newsletter (Receipts)
- **Sections:** free + paid tiers via `pricing`; archive via `blog`
- **Quality:** 8/10
- **Gaps:** no `subscribe-form` or `paywall-cta` semantic type
- **Closable:** lift would require email-capture section type — Tier-2 candidate

### 17. Author / fiction
- **Supported:** YES (with weakness)
- **Demonstrated by:** indie-author-fiction (Mira Chen)
- **Sections:** generic `quotes` for praise blurbs; `columns` for book covers
- **Quality:** 6/10 — single demo; no `book-card`/`buy-link`/`book-praise` types
- **Gaps:** missing semantic types for book commerce
- **Closable in P117/W2:** Add `book-card` section type + 2nd author demo (sci-fi/non-fiction) — would lift to 8/10

### 18. Agency / studio
- **Supported:** YES
- **Demonstrated by:** b2b-agency (Wheelhouse) · north-light-agency · quattro-studio · clinic (medical agency-shaped)
- **Sections:** `case-study` (ADR-100) + named process steps via `columns`
- **Quality:** 9/10
- **Gaps:** none

---

## Coverage Roll-Up
- **Fully supported (YES + ≥7):** **15** of 18 shapes — SPA · multi-page · portfolio · blog · marketing landing · personal/about · SaaS landing · professional service · editorial/magazine · indie game/studio · research/academic · course/education · podcast/media · newsletter/opinion · agency/studio
- **Supported but weak (YES + <7):** **3** of 18 — restaurant/venue (6/10) · non-profit (6/10) · author/fiction (6/10)
- **Unsupported:** **0** of 18

---

## Honest verdict

Hey Bradley **does** provide the full range as claimed at the *shape* level — every canonical site shape (SPA → multi-page, portfolio → blog → SaaS → editorial → restaurant → non-profit) has at least one working demo and renders end-to-end through the canonical 18-section-type taxonomy.

The honest weaknesses are **(a)** multi-page is plumbed but under-demonstrated (6% of demos use it; only 4 of 64 sites; one of those 4 has empty page sections), **(b)** three shapes (restaurant, non-profit, author) lean on generic section types because no semantic equivalents exist (`menu` / `hours` / `donate-cta` / `book-card` / `event-list`), and **(c)** the `sitePurposeSchema` enum (6 values: marketing/portfolio/saas/blog/agency/restaurant) is narrower than the demonstrated shape range — non-profit, podcast, editorial, education, healthcare all fall back to `purpose: 'marketing'`, which means matcher and content generators see less differentiated context than the demos suggest.

None of these are blockers; all are quality lifts.

---

## Closable in P117 (Wave 2 candidates)

| ID | Item | Effort | Lift |
|--|--|--|--|
| CF-P117-A3-1 | Add `menu` + `hours` + `event-list` section types (ADR-100 style enum widening to 21) | ~250 LOC + ADR | restaurant/venue 6 → 8 |
| CF-P117-A3-2 | Add `donate-cta` section type + 2nd non-profit demo (food bank or animal rescue) | ~120 LOC | non-profit 6 → 8 |
| CF-P117-A3-3 | Add `book-card` section type + 2nd author demo (sci-fi or non-fiction) | ~120 LOC | author/fiction 6 → 8 |
| CF-P117-A3-4 | Promote 2 existing single-page demos to genuinely multi-page (3+ pages each with content) — e.g. `quattro-studio` → /work + /about + /contact; `wedding-planner` → /home + /packages + /about | ~150 LOC content per site | multi-page 7 → 9 (corpus demo coverage 6% → 9%) |
| CF-P117-A3-5 (Tier-2) | Widen `sitePurposeSchema` enum from 6 to 12 (add `nonprofit`/`podcast`/`editorial`/`education`/`healthcare`/`event-venue`) so matcher + content generators see correct shape-context | schema + matcher table updates | broad cross-shape lift |

CF-P117-A3-1 + CF-P117-A3-2 + CF-P117-A3-3 together would close all 3 weak-shape slots (lift 6/10 → 8/10) and bring `fully supported (≥7)` count from 15/18 → 18/18 in one sprint.
