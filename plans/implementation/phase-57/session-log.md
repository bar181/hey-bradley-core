# Phase 57' — Session Log

## Public Site Refresh — Blog System + Progress Snapshot

**Date:** 2026-04-29
**Wave commit target:** P57' (mid-Sprint-M-to-Sprint-N pause; pre-defense)
**Preflight:** none authored — owner-mandated pre-defense public-site refresh
**ADR:** ADR-080 (Public Site Refresh — Blog System + Progress Snapshot)

> **Note:** the canonical Sprint N "Shareable Output" phase is also numbered
> P57 (post-defense) per the open-core moat roadmap. This is the
> intermediate **P57'** pre-defense public-site work — distinct phase, same
> integer slot. Tests file is `tests/p57-public-site-refresh.spec.ts`; the
> Sprint N tests will be `tests/p57-static-export.spec.ts` +
> `tests/p57-hosted-share.spec.ts` (different file names, no collision).

## Deliverables (A5 scope — docs/tests/EOP only)

| # | Owner | Status | Files | LOC |
|---|---|---|---|---|
| 1 | A1 | parallel | NEW `src/pages/Blog.tsx` + `BlogPost.tsx` + `src/lib/blogPosts.ts` + `/blog` routes in `App.tsx` | — |
| 2 | A2 | parallel | NEW `src/pages/Progress.tsx` + `src/data/progress-eval.ts` + `/progress` route | — |
| 3 | A3 | parallel | edits to `Welcome.tsx` + `OpenCore.tsx` + `AISP.tsx` | — |
| 4 | A4 | parallel | NEW 2 blog markdown posts in `src/pages/blog/posts/` | — |
| 5 | A5 | shipped | NEW `docs/adr/ADR-080-public-site-blog-and-progress.md` | 114 |
| 6 | A5 | shipped | NEW `tests/p57-public-site-refresh.spec.ts` (12 cases) | ~125 |
| 7 | A5 | shipped | EOP artifacts (this file + retrospective) | — |

## Test results

- p57-public-site-refresh.spec.ts: 12 PURE-UNIT cases authored (FS-level
  reads, no browser bootstrap, no aisp barrel imports).
- Cases P57'.1–P57'.11 depend on A1/A2/A3/A4 source landing.
  Expected-failures by design — GREEN-flip on Wave 1 seal once parallel
  agents ship.
- Case P57'.12 (ADR-080 file shape) is GREEN immediately on A5 dispatch.
- `npx tsc --noEmit`: no A5-scope source edits — no regression possible
  from this wave (ADR markdown + tests/spec only).

## Deliverable details

### ADR-080 (114 LOC, ≤120 budget)

Full Accepted. Sections: Title, Status, Date 2026-04-29, Phase P57'
(mid-Sprint-M-to-Sprint-N pause), Context (public site predates
Sprint J/K/L/M; reviewer needs current state visible 10 days from
defense), Decision (Blog index + post route + hand-rolled markdown +
Progress page + HEADLINE_STATS canonical + existing-page refresh +
~209-word excerpt), Trade-offs (KISS markdown limits + uniform
excerpt cap + parallel scope + headline-stats discipline),
Consequences, Cross-references (ADR-022 public site rebuild,
ADR-031 Welcome design, ADR-077 Speed Visible, ADR-078 Spec
Unmissable, ADR-079 Premium Templates), Defers (Sprint N viral
mechanics post-defense), Status as of P57' dispatch.

### tests/p57-public-site-refresh.spec.ts (12 cases)

PURE-UNIT only — `existsSync` + `readFileSync` + regex. Each test body
≤6 lines. Cases cover:
- P57'.1 Blog system files exist + named exports
- P57'.2 `/blog` and `/blog/:slug` routes wired in App.tsx
- P57'.3 Blog index testids (`blog-index` + `blog-post-card-` prefix)
- P57'.4 KISS dep guard — no marked/react-markdown/remark/unified
- P57'.5 Progress page + progress-eval exports
- P57'.6 `/progress` route wired in App.tsx
- P57'.7 ≥12 PROGRESS_ITEMS entries (regex on `score:` count)
- P57'.8 HEADLINE_STATS six canonical keys present
- P57'.9 Welcome `welcome-build-snapshot-section` testid
- P57'.10 OpenCore capabilities refreshed (personality + latency + Sprint)
- P57'.11 three flagship blog markdown posts on disk
- P57'.12 ADR-080 file shape (≤120 LOC, refs ADR-022/077/078/079)

## Dispatch verification

Inspected `src/pages/blog/posts/` AFTER A4 dispatch — `six-sprints-two-days.md`
and `lovable-vs-hey-bradley.md` already on disk. P57'.11 expects a third
post `aisp-made-visible.md` per spec. `src/data/progress-eval.ts` already
present from A2 dispatch. `src/lib/blogPosts.ts` already present from A1
dispatch. Pages directory shows Blog.tsx + BlogPost.tsx + Progress.tsx
present pre-A5-write — A5 tests assert source-level shape, not creation.
