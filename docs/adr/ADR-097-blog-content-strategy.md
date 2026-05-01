# ADR-097 — Blog Content Strategy

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P71 / OC-13 (Blog Expansion)
- **Cross-refs:** ADR-082 (Open Core RC), ADR-094 (Professional Grade Standard), ADR-095 (Library-Wide Polish Standard)

## Context

P58 / Sprint O shipped `v1.0.0-RC1` with 4 launch posts on `/blog`
(lovable-vs-hey-bradley, six-sprints-two-days, aisp-made-visible,
jira-vs-agentics). The Don Miller framing — "the user is the hero, the
product is the guide" — was established by editorial trial during the RC
arc but never codified. P66 / OC-MKTG surfaced the latest 3 posts on the
Welcome hero. P71 / OC-13 expands the corpus from 4 → **10 posts**
(+6 new) and freezes the editorial contract so future polish-sprints
inherit it by reference.

ADR-097 is the editorial counterpart to ADR-094 (professional-grade UI
discipline) and ADR-096 (template-library expansion contract): the same
cadence-and-quality-bar pattern, applied to written content.

## Decision — 4 enforceable standards

1. **Voice — Don Miller framing.** Every post opens with the reader's
   problem, not the product. The product appears as the resolution, not
   the headline. Single-author voice (Bradley Ross). No "we" plural; the
   capstone is one person.
2. **Length — 700-900 words; estimated read time ≤5 minutes.**
   Read time is `Math.ceil(words / 200)` per `src/lib/blogPosts.ts`. The
   600-1000 word band is the test-gate tolerance; the editorial target
   is 700-900. Posts that need more room split into a series.
3. **Cadence — one post per polish-sprint wave.** Each polish or feature
   wave (P64, P66, P67, P68/P69, etc.) earns one post. Major capstone
   milestones (RC release, defense, post-defense) earn a meta post.
   Cadence is not a quota: a sprint with no story does not get a forced
   post.
4. **Distribution — RSS + clipboard share.** Static RSS 2.0 feed at
   `/blog/feed.xml` (build-step generator deferred — stub ships P71).
   Per-post share button copies `${origin}/blog/${slug}` to clipboard
   via `navigator.clipboard.writeText`. NO third-party share libs. NO
   Substack / Medium cross-post. NO newsletter signup at this tier.

## Bounded-context impact

Within the `marketing` aggregate of the `ui-shell` bounded context.
Touches `src/pages/Blog.tsx` (read-time chip + share button + tag filter),
`src/lib/blogPosts.ts` (registry expansion + `readTimeMinutes` helper),
and `public/blog/feed.xml` (static stub). No source-of-truth schema
changes. No persistence changes. No new dependencies.

## Out of scope

- Substack / Medium cross-post — Tier-2 commercial track only.
- Newsletter / email-capture signup — Tier-2 commercial track only.
- Author profile pages — single-author voice for the capstone window.
- Build-step RSS generator (auto-includes the 6 P71 posts) — carry-forward
  to OC-CLEANUP; the stub is honest about its placeholder status.
- Per-post analytics / view counters — deferred.
- Comments / discussion — out of scope for capstone window; ship a link
  to the GitHub issue tracker if discussion is needed.

## Acceptance gates (enforced by `tests/p71-blog-expansion.spec.ts`)

- ADR-097 ≤120 LOC, Status: Accepted, cross-refs ADR-082 + ADR-094.
- 10 markdown posts on disk under `src/pages/blog/posts/`.
- The 6 P71 posts each carry frontmatter (`title:` + `slug:` + `date:`).
- Each P71 post body is 600-1000 words (700-900 target with tolerance).
- `src/pages/Blog.tsx` renders per-post read-time chip + share button.
- `src/pages/Blog.tsx` and `src/lib/blogPosts.ts` import zero
  third-party share / RSS / Substack / Medium libraries.
- `public/blog/feed.xml` exists and parses as RSS 2.0 (root `<rss>`
  element + `<channel>` + `<item>` blocks for the 4 baseline posts).
- `src/lib/blogPosts.ts` exposes `readTimeMinutes()` and `countWords()`
  helpers; sort by date descending in `listBlogPosts()`.

## Consequences

**Positive.** Editorial cadence is now a written contract; the next
polish sprint owner does not re-derive the framing or the length budget.
Search-discoverable content + RSS subscribe path opens a slow-but-real
adoption channel for AISP. The clipboard-share button gives readers a
zero-friction path to circulate posts without Hey Bradley taking on a
share-library dependency. Capstone reviewers see the editorial
discipline as a project artifact alongside the test corpus and the ADR
ledger.

**Negative.** Ongoing curation cost — every polish wave pays a 1-2 hour
editorial tax to write and ship a post. The cadence rule is the
mitigation: a sprint with no genuine story does not produce a post, and
forcing one would lower the bar. The static RSS stub is a placeholder
that requires a build-step generator follow-up; OC-CLEANUP carries it.
The 700-900 word band is opinionated and may feel restrictive for deep
technical posts; series-splitting is the documented escape hatch.

**Neutral.** The 4 baseline P58 posts are grandfathered — they predate
ADR-097 and stay as written. The contract applies to the 6 P71 posts and
all future additions.
