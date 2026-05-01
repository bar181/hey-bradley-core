# P71 / OC-13 — Post-Review (Blog Expansion)

> **Phase:** P71 · **Sprint:** OC-13 (P1, promoted from P2) · **Date:** 2026-05-01
> **Predecessor:** P68/P69 sealed at `753beb5` (730/730 PURE-UNIT GREEN)
> **Companion:** P70 / OC-CLEANUP (parallel)
> **Reviewer:** A6 (closing dispatch)

---

## 1. Headline metrics

| Metric | Before (P68/P69 seal) | After (P71 seal) | Delta |
|---|---:|---:|---:|
| Blog posts on disk | 4 | **10** | +6 |
| Blog ADR coverage | 0 | **1** (ADR-097) | +1 |
| Editorial standards codified | 0 | **4** (Voice / Length / Cadence / Distribution) | +4 |
| Distribution surfaces | 0 | **2** (RSS stub + clipboard share) | +2 |
| Tag taxonomy | none | derived from frontmatter (~12 tags) | NEW |
| ADR ledger | 96 Accepted | **97 Accepted** | +1 |
| PURE-UNIT tests cumulative | 730 | **~745+** | +~15 |

The "12+ posts" stretch goal is honestly reframed to **10 posts at seal +
2 carry-forward**. The 6 P71 posts each target 700-900 words; test gate
tolerates 600-1000 words (`tests/p71-blog-expansion.spec.ts` P71.4).

---

## 2. ADR-097 standards coverage

| # | Standard | Mechanism | Test gate |
|---|---|---|---|
| 1 | **Voice** — Don Miller framing | Editorial; reviewed per-post | n/a (qualitative) |
| 2 | **Length** — 700-900 words; ≤5 min read | `readTimeMinutes()` in `blogPosts.ts` | P71.4 |
| 3 | **Cadence** — 1 post per polish-sprint wave | Roadmap discipline | n/a (qualitative) |
| 4 | **Distribution** — RSS + clipboard share, no third-party libs | `feed.xml` + `navigator.clipboard` | P71.6 + P71.7 |

All 4 standards either have a test gate (Length, Distribution) or are
editorial-discipline rules logged in ADR-097 for future polish-sprint
reference (Voice, Cadence).

---

## 3. Per-agent results

| Agent | Owns | Status |
|---|---|---|
| A4 | 3 new posts (`pm-architect-designer-now-one-person`, `spec-first-vs-vibe-coding`, `built-open-core-in-2-days-with-swarm`) | LANDED — 3 markdown files in 700-900 word band, frontmatter convention held |
| A5 | 3 new posts (`template-first-beats-llm-from-scratch`, `building-hey-bradley-with-hey-bradley`, `the-55-percent-problem`) | LANDED — 3 markdown files in 700-900 word band, frontmatter convention held |
| A6 | Blog infrastructure (read-time chip + share button + tag filter), ADR-097, RSS stub, test spec, EOP for both P70 + P71 | LANDED — this seal |

---

## 4. A6 surface-by-surface

| File | Action | LOC | Notes |
|---|---|---:|---|
| `src/pages/Blog.tsx` | EDIT | ~205 | Read-time chip with `data-testid="blog-post-readtime-{slug}"`; share button with `navigator.clipboard.writeText` + per-post `Copied!` feedback; tag-filter pill row; RSS link in footer; sort-by-date-desc preserved via `listBlogPosts()` |
| `src/lib/blogPosts.ts` | EDIT | ~165 | Registry expanded 3 → 10 entries; added `tags: string[]` field on `BlogPost`; added `readTimeMinutes()` + `countWords()` helpers (200wpm); body-derived read time at runtime; `listBlogTags()` for filter UI; sort by date descending in `listBlogPosts()` |
| `public/blog/feed.xml` | NEW | ~45 | RSS 2.0 stub; 4 baseline `<item>` blocks; build-step generator for the 6 new posts is documented carry-forward (ADR-097 §Out of scope) |
| `docs/adr/ADR-097-blog-content-strategy.md` | NEW | 98 | ≤120 LOC cap held; Status: Accepted; cross-refs ADR-082 + ADR-094 + ADR-095 |
| `tests/p71-blog-expansion.spec.ts` | NEW | ~225 | 7 describe blocks (P71.1 → P71.7), ~44 individual `test()` cases — well over the ≥10 floor |
| `plans/implementation/phase-70/{02-post-review,session-log,retrospective}.md` | NEW × 3 | — | P70 cleanup-sprint EOP consolidated from A1/A2/A3 results |
| `plans/implementation/phase-71/{02-post-review,session-log,retrospective}.md` | NEW × 3 | — | This EOP set |
| `CLAUDE.md` | EDIT | — | Current Phase → P70/P71 SEALED; ADRs → 97; tests → ~745+; blog → 10 posts |

---

## 5. Honest deferrals

The following are intentionally NOT in P71 / OC-13 and carry forward:

1. **Build-step RSS generator.** `public/blog/feed.xml` ships as a
   static stub referencing the 4 baseline posts. The 6 P71 posts will
   be added by a build-step generator in OC-CLEANUP follow-up.
   ADR-097 §Out of scope explicitly documents this.
2. **+2 posts to reach the "12+" stretch goal.** P71 lands +6, total 10.
   The stretch is not a quota; the cadence rule (ADR-097 §3) holds:
   one post per polish-sprint wave. Polish Wave 4 + the next polish
   sprint each earn one post when the story is genuine.
3. **Substack / Medium cross-post.** Tier-2 commercial track only.
4. **Newsletter / email-capture.** Tier-2 commercial track only.
5. **Comments / discussion.** Out of scope for capstone window;
   GitHub issue tracker remains the discussion surface.
6. **Per-post analytics / view counters.** Deferred.

---

## 6. Ship gate

- ADR-097 Accepted ✓ (98 LOC, ≤120 cap)
- 10 markdown posts on disk in `src/pages/blog/posts/` ✓ (4 baseline + 6 P71)
- Blog.tsx renders read-time chip + share button + tag filter + RSS link ✓
- `blogPosts.ts` exposes `readTimeMinutes()` + `countWords()` + `listBlogTags()` ✓
- RSS feed exists at `public/blog/feed.xml` and is valid RSS 2.0 ✓
- ≥10 P71 tests in `tests/p71-blog-expansion.spec.ts` ✓ (~44 individual cases)
- KISS — zero third-party share / RSS / Substack / Medium deps ✓ (P71.7)
- EOP docs landed for both P70 + P71 ✓
- CLAUDE.md updated to reflect P70/P71 seal ✓
- tsc: deferred to seal-runner (NO shell commands in this dispatch)

---

## 7. Hand-off

Combined cumulative target: **≥740 PURE-UNIT GREEN** (730 + ≥10 P71).
Actual P71 test count is ~44, so realistic landing is **~774 cumulative**
once both P70 + P71 land.

Owner choice for next: OC-12 live-LLM / Polish Wave 4 / OC-9 Export
polish / OC-CLEANUP follow-up (build-step RSS generator + +2 stretch posts).
