# P71 / OC-13 Blog Expansion — Preflight

> **Phase:** P71 · **Sprint:** OC-13 (P2 → P1 promoted)
> **Date:** 2026-05-01
> **Predecessor:** P68/P69 sealed at `753beb5` (730 GREEN, 96 ADRs)
> **Companion:** P70 / OC-CLEANUP (parallel)

---

## Current state
- 4 blog posts on disk: aisp-made-visible, jira-vs-agentics, lovable-vs-hey-bradley, six-sprints-two-days
- Welcome.tsx surfaces `listBlogPosts().slice(0, 3)` (P66/OC-MKTG)
- Blog index at `src/pages/Blog.tsx` (118 LOC)
- Post format: markdown at `src/pages/blog/posts/*.md` consumed by `src/lib/blogPosts.ts`

Goal: 4 → **10 posts** (+6 new); honest reframe of "12+" target — leaves +2 carry-forward.

---

## 3 parallel agents

### A4 — Posts 5-7 (3 posts; 700-900 words each)
Owns NEW files in `src/pages/blog/posts/`:
- `pm-architect-designer-now-one-person.md`
- `spec-first-vs-vibe-coding.md`
- `built-open-core-in-2-days-with-swarm.md`

Don Miller framing: problem first, then resolution. Each post 700-900 words. Use existing markdown frontmatter convention from current 4 posts.

### A5 — Posts 8-10 (3 posts; 700-900 words each)
Owns NEW files in `src/pages/blog/posts/`:
- `template-first-beats-llm-from-scratch.md`
- `building-hey-bradley-with-hey-bradley.md` (meta — most-shareable)
- `the-55-percent-problem.md`

Same framing rules as A4.

### A6 — Blog infrastructure + ADR-097 + EOP
Owns:
- `src/pages/Blog.tsx` (EDIT, surgical) — verify shows all posts sorted by date with category tags; add per-post estimated read time chip + share-link button (clipboard `navigator.clipboard.writeText(url)` — no library)
- `public/blog/feed.xml` (NEW) OR a small build-time generator if straightforward; if generator non-trivial, ship a stubbed static `feed.xml` referencing existing 4 posts as a placeholder + flag for OC-CLEANUP follow-up
- `src/lib/blogPosts.ts` (EDIT IF NEEDED) — add `readTimeMinutes` helper if not present
- `docs/adr/ADR-097-blog-content-strategy.md` (NEW; ≤120 LOC) — captures: voice (Don Miller framing), cadence (one post per polish wave), audience (capstone reviewers + agentic-engineering twitter), distribution (RSS + share-buttons)
- `tests/p71-blog-expansion.spec.ts` (NEW; ≥10 cases) — 10 posts on disk; ADR-097 shape; Blog.tsx renders all; share button + read-time chip present
- `plans/implementation/phase-70/{session-log, retrospective}.md` (P70 EOP — A6 owns since A1-A3 are doing the work) AND `plans/implementation/phase-71/{02-post-review, session-log, retrospective}.md`

CLAUDE.md update: Current Phase → P70/P71 sealed; ADRs → 97; tests → 745+; blog → 10 posts.

---

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. Markdown posts use existing frontmatter convention (check current 4 for shape)
4. ADR ≤120 LOC
5. NO shell commands
6. TypeScript-strict
7. Read time = `Math.ceil(wordCount / 200)`

## Acceptance gates
- 6 new markdown posts on disk in `src/pages/blog/posts/`
- Blog.tsx renders all 10 with read-time + share-link
- ADR-097 Accepted
- ≥10 P71 tests passing
- EOP docs for both P70 + P71
- tsc clean
- Cumulative ≥740 GREEN
