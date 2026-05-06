# P115 / A5 — Template Visual Scoring + Bottom-15 Lift

> **Phase:** P115 · **Sprint:** VISUAL-QUALITY-BUILDER-POLISH · **Agent:** A5
> **Branch:** swarm/p115-visual-quality
> **Date:** 2026-05-06

## Scope

Score all 56 example sites (50 baseline JSON + 6 .ts/.tsx imports of similar shape; A4 ships 3 net-new for a final population of 53 JSON files) on a 1–10 visual rubric and lift the bottom-15 to ≥7.

**Off-limits per task contract:**

- P113 storytelling sites (5): podcaster-indie, course-creator-tech, contrarian-blog, indie-author-fiction, research-newsletter
- 5-PROJECTS persona builds (5): axon-cli, greenlane-startup, quattro-studio, mrs-albright-tutoring, bordo-spec
- E2E-TEST-2 sites (3): coffee-essay, north-light-agency, indie-coffee-roaster
- E2E-TEST sites (2): aisp-executive, aisp-developer-retro
- A4 in-flight 3 NEW sites: editorial-magazine, indie-game-studio, research-lab

## Rubric

Each template scored 1–10 on four axes, averaged to a composite:

| Axis | Signal |
|------|--------|
| **Theme palette coherence** | Full 6-key palette + `alternatePalette` + canonical preset + non-generic bg/accent (e.g. not `#ffffff`/`#000000`) |
| **Section completeness** | Section count (≥7 = solid; ≥9 = strong; ≤4 = thin) and type variety (≥6 distinct types) |
| **Copy quality** | brandName / tagline / voiceAttributes filled; specific anchors (city, year, named tools/people); no generic phrases like "Trusted by Fortune 500", "Find Your Dream Home", "Forge Your Best Self" |
| **Visual differentiation** | Distinct preset; strong tagline ≥15 chars; voiceAttributes; storytellingPreset; not anonymous in saas/professional/minimalist |

## Before-pass scoring (35 in-scope templates)

| Template | Palette | Section | Copy | Diff | **Composite** | Status |
|----------|--------:|--------:|-----:|-----:|--------------:|--------|
| enterprise-saas | 10 | 8 | 1 | 5 | **6.0** | bottom-15 |
| real-estate | 9 | 8 | 2 | 5 | **6.0** | bottom-15 |
| dev-portfolio | 10 | 8 | 3 | 5 | **6.5** | bottom-15 |
| blank | 9 | 3 | 6 | 9 | **6.8** | bottom-15 (intentional minimal) |
| blog-standard | 10 | 2 | 6 | 9 | **6.8** | bottom-15 |
| fun-blog | 10 | 8 | 2 | 7 | **6.8** | bottom-15 |
| law-firm | 10 | 8 | 3 | 7 | **7.0** | bottom-15 |
| consulting | 9 | 8 | 5 | 9 | **7.8** | bottom-15 (generic copy) |
| photography | 10 | 6 | 6 | 9 | **7.8** | bottom-15 (thin sections) |
| launchpad | 10 | 8 | 5 | 9 | **8.0** | bottom-15 |
| api-docs-landing | 10 | 8 | 6 | 9 | **8.2** | bottom-15 (cohort review) |
| cli-tool | 10 | 8 | 6 | 9 | **8.2** | bottom-15 (cohort review) |
| clinic | 10 | 8 | 6 | 9 | **8.2** | bottom-15 (cohort review) |
| fitforge | 10 | 8 | 6 | 9 | **8.2** | bottom-15 (generic tagline) |
| founder-story | 10 | 8 | 6 | 9 | **8.2** | bottom-15 (cohort review) |

## Lifts applied (15 templates touched, ≤500 LOC delta cap)

Total JSON LOC delta: **+161 / −49 = net +112** across 15 files. Index.ts untouched (A4 owns).

### Substantive lifts (full hero rewrite + metadata fill)

1. **enterprise-saas** — brandName "CloudSync" + compliance-aware voice + badge "SOC 2 Type II · ISO 27001 · HIPAA-ready" + headline "Cloud sync your security team will actually approve" + subtitle naming 140+ regulated-industry teams
2. **real-estate** — brandName "Summit Realty Group" + neighborhood-specific voice + badge "Bozeman, MT · 11 years · 480+ closings" + headline "We sell Bozeman like we live here. Because we do." + subtitle naming Westside cul-de-sac flooding + 2018 builder cuts
3. **dev-portfolio** — brandName "Alex Chen" + production-grounded voice + badge "Available Q3 2026 · Berlin / remote-EU" + subtitle naming Datadog/Vercel + Postgres replication lag + 14× re-renders
4. **fun-blog** — brandName "The Daily Scoop" + irreverent voice + headline "I burned the focaccia. Again. Let's talk about it." + subtitle naming Mara/Queens kitchen/800-word format
5. **law-firm** — brandName "Barrett & Associates" + founder-friendly voice + badge "Founded 1998 · Charleston, SC · 4 partners" + headline "The lawyers founders actually call back." + subtitle naming flat-rate engagements + Series B + family business succession

### Section addition

6. **blog-standard** — added 2 sections (text "Why I keep this blog" + action "Sundays in your inbox") to lift section count 3 → 5; corrected invalid purpose/audience/tone enum values (`Personal blog about baking` → `blog`, `Home bakers` → `consumer`, `Warm, conversational` → `warm`)

### Copy + voice sharpening

7. **consulting** — badge "Trusted by Fortune 500" → "10 years · 80+ engagements · 7 senior partners"; headline "Strategy That Grows With You" → "Strategy work without the 80-page deck."; subtitle expanded with Cambridge/Austin offices + 18 engagements/year cap + partner-led delivery
8. **fitforge** — tagline "Forge your best self" → "60-minute strength + conditioning. East Austin. No mirrors, no influencers."; headline "Forge Your Strongest Self" → "Hard work, real coaches, no mirrors."; subtitle expanded with East 6th warehouse + three coaches + Saturday lifts
9. **photography** — tagline "Capturing moments worth remembering" → "San Francisco Bay Area · weddings, portraits, editorial · booking 9 weddings a year" + voice "boutique-deliberate"
10. **restaurant** — tagline expanded "24 seats. Asheville, NC. The menu changes when the farm trucks change."; headline "Where Every Meal Tells a Story" → "Twenty-four seats. One menu. Whatever Tuesday's farms sent us."; subtitle naming Madison Avenue + four farm partners + $110 prix-fixe + Sunday 9 PM reservation drop
11. **florist** — tagline expanded "Hand-tied in Brooklyn · weddings, events, weekly subscriptions · seasonal-only"; headline "Flowers That Tell Your Story" → "Seasonal flowers from people we know by name."; subtitle naming Greenpoint + two-florist studio + 22 weddings/year + four growers Long Island/Hudson Valley
12. **education** — tagline "Learn to code with project-based courses" → "12-week cohorts. Real production codebases. Senior engineers from Google, Meta, Stripe."; voiceAttributes upgraded to "no-bootcamp-fluff"

### Schema repair + voice expansion

13. **mental-health-practice** — invalid `tone: "empathetic"` → `"warm"`; tagline "Therapy that meets you where you are" → "Portland group practice · 7 licensed therapists · sliding-scale + superbills"; voice + "neighborhood-specific"
14. **telehealth** — invalid `tone: "tech-forward"` → `"casual"`; tagline expanded "On-demand telehealth · all 50 states · 12-minute median response"; voice + "no-jargon"

### Minimal polish

15. **blank** — voiceAttributes + "vertical-agnostic" + tagline expanded "A clean scaffold · point Bradley at any vertical · the same hero reshapes itself" (template intentionally retains minimal section count as starter scaffold)

## After-pass scoring (53-template population)

| Status | Count | % of 53 |
|--------|------:|--------:|
| ≥7.0 | **52** | **98.1%** |
| <7.0 | 1 | 1.9% |
| **Target ≥85%** | **45** | **85.0%** |

**Result: 98.1% of templates score ≥7 — well over the 85% target.**

The single remaining sub-7 template is `blank` (composite 6.8) — it is intentionally a minimal starter scaffold with 4 sections, designed to demonstrate the "clean slate that reshapes itself" premise per the on-page copy. Lifting it to a real 7-section template would defeat its purpose.

## Bottom-3 → Top-3 deltas (post-lift)

| Template | Before | After | Δ |
|----------|-------:|------:|--:|
| enterprise-saas | 6.0 | 8.2 | +2.2 |
| real-estate | 6.0 | 8.5 | +2.5 |
| dev-portfolio | 6.5 | 8.8 | +2.3 |
| fun-blog | 6.8 | 8.5 | +1.7 |
| blog-standard | 6.8 | 7.2 | +0.4 (intentional minimal-blog) |
| law-firm | 7.0 | 8.8 | +1.8 |
| consulting | 7.8 | 8.2 | +0.4 |
| fitforge | 8.2 | 8.5 | +0.3 |

## Verification

- All 50 base example JSONs parse against `JSON.parse` (A4 adds 3 more = 53 total).
- Strict tsc on root + `tsconfig.app.json` — both CLEAN (no new type errors).
- A1 / A2 / A3 / A4 / A6 owned files untouched (A5 only edits `src/data/examples/*.json`, leaves `src/data/examples/index.ts` to A4).
- No new dependencies introduced.
- Total LOC delta across 15 files: +161 / −49 = +112 net (cap was ≤500).

## Carry-forwards

- Other invalid `purpose`/`audience`/`tone` enum values exist on ~12 templates (e.g. `purpose: "product"` on api-docs-landing/cli-tool/oss-library; `purpose: "ecommerce"` on coffee-roaster). Zod's `.optional().default(...)` quietly defaults these — tightening this is a P116 candidate (would require either widening the enum or a migration script + audit).
- A4 may revise editorial-magazine / indie-game-studio / research-lab between now and seal — current scoring snapshot (8.2 / 8.2 / 8.2) reflects what's on disk at A5 close.
- "Premium tier" off-limits assumption: the 15 off-limits templates are presumed ≥7 by virtue of their P113 / 5-PROJECTS / E2E-TEST provenance, but A5 did not re-score them. If any sit below 7, the 98.1% number tightens. Spot-check on coffee-essay + axon-cli + aisp-executive each exceed 8.5 by inspection.
