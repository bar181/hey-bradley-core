# ADR-080: Public Site Refresh — Blog System + Progress Snapshot

**Status:** Accepted
**Date:** 2026-04-29
**Deciders:** Bradley Ross
**Phase:** P57' (mid-Sprint-M-to-Sprint-N pause; pre-defense public-site work)

## Context

Sprint M (P56) sealed the moat tripod (speed visible / spec unmissable /
output premium). The moat metric "designer made this" needs a public
surface that a capstone reviewer can navigate WITHOUT bootstrapping the
builder. The open-core moat roadmap
(`plans/strategic-reviews/open-core-moat-roadmap.md`) defers Sprint N
(Shareable Output) to post-defense, leaving a gap: the public site
predates Sprint J/K/L/M and shows stale numbers (28 phases, 6 sprints,
~150 tests) instead of the current state (42 phases, 7 sprints sealed,
244 tests, 79 ADRs). Owner mandate: publish a blog system + a swarm-eval
progress snapshot NOW so the public site reflects current state visible
to reviewers in the 10-day pre-defense window.

## Decision

### Blog index `/blog` + single-post route `/blog/:slug`

`src/pages/Blog.tsx` renders an index of cards; `src/pages/BlogPost.tsx`
renders a single post by slug. Both consume `src/lib/blogPosts.ts` which
exports `listBlogPosts()`, `getBlogPost(slug)`, and a hand-rolled
`renderMarkdown(md)` helper. NO new markdown deps (`marked`,
`react-markdown`, `remark`, `unified` are forbidden by the P57'.4 KISS
dep guard). The parser handles the subset we author — headings, bold,
italic, paragraphs, links — and stops there. Acceptable for MVP scope.

### Progress page `/progress` with 1-10 scored eval

`src/pages/Progress.tsx` renders a 1-10 scored evaluation across ≥12
items spanning architecture, UX, engineering discipline, and gaps.
`src/data/progress-eval.ts` exports `PROGRESS_ITEMS` (the rubric) and
`HEADLINE_STATS` (the canonical numbers reviewers will quote): coding
days, days to defense, phases sealed, ADRs accepted, tests green,
sprints sealed. Single source of truth for the headline numbers — the
Welcome refresh and the AISP-page footnote both pull from
`HEADLINE_STATS` rather than re-typing.

### Existing-page refresh

`Welcome.tsx` adds a `welcome-build-snapshot-section` testid block
("Built in 2 days. Ready in 10."). `OpenCore.tsx` capabilities list is
refreshed to reflect Sprint J personality picker, Sprint K latency
badge, Sprint L spec-unmissable, Sprint M premium templates. `AISP.tsx`
adds a footnote pointing at the Sprint L moat-visible decision (the
spec is now always-on, not Geek-only).

### Sample blog excerpt on Progress page (~209 words)

Progress page renders a short teaser excerpt of the flagship blog post
("Six sprints, two days") under the headline stats. Hard cap at ~209
words to keep blog cards uniform in the index view.

## Trade-offs

- **Hand-rolled markdown parser is small but limited.** No syntax
  highlighting, no code fences. Acceptable for MVP scope — the two
  shipping posts are prose-heavy, not code-heavy. Fence support deferred
  to commercial track if blog volume grows.
- **~209-word excerpt as a hard cap.** Keeps blog index cards visually
  uniform. If a future post needs a longer hook, the cap holds and the
  post owner trims.
- **Three pages refreshed in parallel.** Welcome / OpenCore / AISP each
  edited by a single agent (A3) to avoid merge conflicts; A4 owns blog
  markdown content; A5 (this scope) owns ADR + tests + EOP only.
- **`HEADLINE_STATS` as single source of truth.** Future stat updates
  (after each phase seal) edit one file; pages re-render. No
  copy-paste-drift across Welcome / Progress / AISP.

## Consequences

- (+) Public site reflects post-Sprint-M state — capstone reviewers see
  current numbers, not P28-era stale ones.
- (+) Blog system is shippable without infra — markdown files on disk,
  parser in repo, no CMS, no build step beyond Vite.
- (+) Progress page is the "show your work" surface — 12+ scored items
  + headline stats + sample blog excerpt.
- (+) `HEADLINE_STATS` discipline prevents future drift.
- (-) Hand-rolled markdown parser is a maintenance liability if blog
  scope grows; mitigated by Sprint N deferral of viral mechanics.
- (-) Three new routes (`/blog`, `/blog/:slug`, `/progress`) widen the
  public-site surface; mitigated by all three being read-only.

## Cross-references

- **ADR-022** — Public site rebuild (P22); ADR-080 layers on top.
- **ADR-031** — Initial Welcome design; refresh respects the original
  warm-light chrome palette.
- **ADR-077** — Sprint K Speed Visible; OpenCore capability list cites it.
- **ADR-078** — Sprint L Spec Unmissable; AISP page footnote cites it.
- **ADR-079** — Sprint M Premium Templates; OpenCore capability list cites it.
- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe;
  Sprint N viral mechanics deferred to post-defense)

## Defers

- Hosted spec links + viral mechanics → Sprint N (P57, post-defense).
- Markdown code-fence + syntax highlighting → commercial track.
- Blog comments / RSS / pagination → out of scope.

## Status as of P57' dispatch

- ADR-080 full Accepted (this file)
- A1 Blog.tsx + BlogPost.tsx + blogPosts.ts + routes (parallel)
- A2 Progress.tsx + progress-eval.ts + route (parallel)
- A3 Welcome / OpenCore / AISP refresh (parallel)
- A4 two new blog posts in `src/pages/blog/posts/` (parallel)
- A5 (this scope) ADR + tests + EOP only — no source edits
