# ADR-149: Audience Routing Standard

**Status:** Accepted
**Date:** 2026-05-07
**Phase:** P120 / AUDIENCE-ROUTING
**Cross-refs:** ADR-090 (Mobile UX Redesign) · ADR-091 (Canonical Component Quality) · ADR-097 (Blog Content Strategy) · ADR-110 (AISP Visibility Standard) · ADR-146 (Simple Messaging + Product-Market Fit Standard) · ADR-148 (Site Polish + Light/Dark Mode + Research Citation Standard)

## Context

P119 closed the public-surface positioning lock with three calibrated audiences in mind: consumer-track on `/`, engineer-track on `/research` + `/aisp`, and a blog corpus where readers self-select. The audience-segment review at `plans/strategic-reviews/2026-05-07-audience-segment-review.md` then surfaced two concrete gaps that survived the simple-messaging reframe:

1. **Engineer + product-team entry points were missing from the primary nav.** `/research` exists as the engineer-track home but a developer landing on the marketing chrome had no signal that there's a track for them; product teams transitioning from one AI coding assistant to another (Cursor / Claude Code / Copilot) had no destination at all — the segment was the highest-pay-likelihood one in the review.
2. **The blog had no audience filter.** All 15 posts rendered as a flat list. Readers had no way to self-select Story / Technical / For-teams without scanning every card.

P120 closes both gaps via a single audience-routing sprint: 2 nav entries (`For developers` → `/research`, `For teams` → `/for-teams`), 2 NEW pages (`/for-teams` + `/contact`), 1 blog 3-category filter via `?category=` URL param, 1 redirect (`/guides` → `/blog?category=technical`), and 3 cross-page entry-strip links from Welcome / Research / About into the right destinations.

## Decisions

### D1 — Three new audience entry points routed

Primary nav adds `For developers` → `/research` (engineer-track home; the page already exists from the P119 site-polish arc and carries the AISP math + handoff blog + open core entry strip per ADR-148 D3) and `For teams` → `/for-teams` (NEW page; product-team audience transitioning between AI coding assistants; persistent spec + CLAUDE.md handoff + agent scope map; honest about what's not shipped — no team workspaces, no shared cloud projects, no SSO; those land in a future commercial tier). `/contact` ships as a separate audience entry point (LinkedIn `bradaross` + GitHub `bar181/hey-bradley-core` + `bar181/aisp-open-core` + Capstone defense May 2026 + Agentics Foundation; no form, no tracking) but is **NOT in the primary nav** — reachable from the About footer via "Work with us →" link. The primary nav stays focused on use-the-product audiences; `/contact` is for partnership / acquirer / capstone / Agentics-Foundation traffic that lands on About first.

### D2 — Blog 3-category surface via `?category=` URL param

Blog index renders a 3-tab category pill row (Story / Technical / For teams). Tab state is mirrored to the URL via React Router's `useSearchParams` so links like `/blog?category=technical` deep-link directly to the filtered view. Each post card surfaces a category pill above the title. Categories are derived from existing post tags via NEW helpers `categoryOf(post): BlogCategory` + `BLOG_CATEGORY_LABEL` + `BlogCategory` type in `src/lib/blogPosts.ts` — explicit overrides for the 3 P118 posts ensure correct categorization (`describe-it-see-it` + `why-we-built-this-the-honest-version` = Story, `the-handoff-that-changes-everything` = Technical), with tag-set heuristics handling the rest. NO new content this sprint — only routing of what exists. The legacy `/guides` route (left over from earlier doc-tree planning) redirects to `/blog?category=technical` so any external link survives.

### D3 — "Coming from another builder?" link routes from Welcome H2 to the comparison post

Welcome Section 1 surfaces a single subtle line under the H2: "Coming from another builder? See how it compares →" linking to `/blog/describe-it-see-it` (which carries the 4-row builder comparison table relocated from Welcome at P118 / ADR-146 D2). The owner brief originally said "Coming from Lovable or another builder?" but **ADR-146 D2 lock holds — no competitor names on public pages**. Specific competitor names (Lovable / WordPress / Wix / Webflow) live in the blog-post body where audience self-selects, not on the home page. The link is plain-English routing of intent; the blog post is where the comparison happens. Calibration documented to prevent future re-litigation.

### D4 — Research-page "Start here" 3-item entry strip + Geek-mode Easter egg

Research opens with a NEW 3-item "Start here" entry strip routing engineers to existing depth: (a) `/aisp` (the AISP spec page), (b) `/blog/the-handoff-that-changes-everything` (the technical deep dive), (c) `/open-core` (what ships free). Lifts engineer-track conversion by routing to existing content instead of producing new content. Research footer carries the Geek-mode Easter egg: "See what the engineers see →" → `/aisp`. The Easter egg is quiet — small, footer-positioned, muted-ink — for the curious reader who's already deep in the research surface and wants to see the underlying symbolic protocol without it being shoved at them.

### D5 — Honest scope on `/for-teams` is the credibility move

`/for-teams` deliberately makes NO commercial promises. Section 3 is titled "Honest about what's shipped" and states explicitly: "No team workspaces, no shared cloud projects, no SSO — those land in a future commercial tier when there's something worth charging for. The open core stays open." The honesty IS the credibility move — product teams transitioning between AI coding assistants have heard every overpromise; they self-select for the page that names what doesn't exist yet. KISS denylist per ADR-144 D5 / ADR-146 D4 holds — zero new dependencies. Pure CSS + existing `useReveal` hook from F1 / ADR-146 D4 honors `prefers-reduced-motion: reduce` on every animated surface.

## Consequences

- 2 new primary-nav entries (For developers + For teams) land between Research and Open Core; 7-link nav stays manageable; React-key collision avoided by composite key (`${to}|${label}`) since "Research" + "For developers" both route to `/research`.
- 2 NEW pages (`/for-teams` + `/contact`); 1 redirect (`/guides` → `/blog?category=technical`); both registered in `src/main.tsx` via existing `lazy() + Suspense` pattern; named-export adapter via `.then(m => ({ default: m.X }))`.
- Blog filters by category via `?category=` URL param; 3 P118 posts explicitly categorized via slug-override; remaining 12 categorized via tag-heuristic; legacy `blog-tag-filter` testid superseded by `blog-category-filter` (legacy P71 spec updated to reference the new testid).
- Welcome H2 link routes "Coming from another builder?" intent to the comparison post — competitor names stay in the blog body where audience self-selects (ADR-146 D2 holds).
- Research "Start here" 3-item strip + Geek-mode footer Easter egg ship; engineer-track depth is one click from the marketing surface.
- About footer "Work with us →" link routes partnership / acquirer / capstone traffic to `/contact`.
- KISS denylist per ADR-144 D5 / ADR-146 D4 holds — zero new dependencies; no animation libs added.
- P118 / P118.5 / P119 regression guards (Welcome H1 lock, no-numbers, no-competitor-names, walkthrough brand-invisible-1-5, dark-mode token overrides) all still GREEN.

## Carry-forwards

- **CF-P120-1:** dedicated `/for-investors` or `/for-acquirers` page (deferred — partnership / acquirer traffic currently routes through About → /contact; if signal volume warrants, a dedicated page is the next move).
- **CF-P120-2:** team workspaces / shared cloud projects / SSO on `/for-teams` (Tier-2 commercial; named explicitly on the page so the deferral is honest).
- **CF-P120-3:** A/B test which Welcome subtle-link copy converts best ("Coming from another builder?" vs "Switching from Lovable?" vs "Tried other AI builders?"). Blog post body keeps the competitor-named version; the marketing surface stays generic per ADR-146 D2 unless the test data says otherwise.
