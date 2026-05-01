# P82 / OC-CLEANUP — Carry-Forward Batch (Preflight)

> **Phase:** P82 · **Sprint:** OC-CLEANUP · **Date:** 2026-05-01
> **Predecessor:** P80 sealed at `926f6ea` (~954+ GREEN, 105 ADRs, 41 templates, 10 blog posts)
> **Companion:** P81 / OC-16 Prompt Library (parallel)
> **Cross-refs:** ADR-104 (Page-Aware Pipeline), ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-090 (Mobile UX), ADR-097 (Blog Content Strategy)

## Reframe — carry-forward registry

Carry-forwards from prior sprints converging at OC-CLEANUP:
- **Page-aware INTENT cross-page targeting** (P79 retrospective P1)
- **DECOMP page-targeting verbs** (`Todo.targetPage`) (P79 retrospective P1)
- **Mobile drawer page selector** (P78 carry, P79 confirmed; mounts in MobileMenu.tsx)
- **+2 blog posts to reach 12** (CLAUDE.md carry-forward; current = 10)
- **Build-step RSS feed** (currently `public/blog/feed.xml` static stub; needs dynamic from blogPosts.ts)
- **ruvector backfill for P80 + P81 + ADRs 105/106/107** (manual snapshot per ADR-070 §ruvector-state)
- **EOP triplet audit P15-P81** (P59/P60/P61 gaps detected: 2/3, 2/3, 1/3 respectively — investigate + fill or document why deferred)

## 3 parallel agents · disjoint scopes

### A3 — Page-aware carry-forwards (INTENT + DECOMP + mobile drawer)
**Owns:**
- `src/contexts/intelligence/aisp/intentAtom.ts` (EDIT — add `pageId?: string` to `IntentTarget` interface; extend rule R3-extension to detect "page N" + "page X" patterns in input text; resolve to `pageId` when match found; default to active page when absent)
- `src/contexts/intelligence/aisp/decompAtom.ts` (EDIT — extend Todo type with `targetPage?: string`; add page-targeting verb rules ("change page 2 hero" → split into Todo with targetPage='page-2-id'); fall back to active page absent explicit page reference)
- `src/components/shell/MobileMenu.tsx` (EDIT — mount PageSelector OR a page-list section so mobile users can switch active page; reuse existing PageSelector component logic where possible)
- `src/contexts/intelligence/chatPipeline.ts` (EDIT — surgical: when intent.target.pageId is set, override scopeRoot computation; when DECOMP Todo.targetPage is set, scope per-todo)

**Constraints:** Backward-compat — single-page mode + active-page-only intent unchanged. KISS — no UI for cross-page command picker yet (just resolves correctly). Surgical edits only.

### A4 — Docs + RSS + ruvector + EOP audit
**Owns:**
- `src/pages/blog/posts/{NEW-POST-1.md, NEW-POST-2.md}` (NEW — 2 new blog posts following ADR-097 voice: 800-1200 words; topics suggested: "How Multi-Page MVPs Stay Atomic" and "The Open-Core Boundary: What Ships Free, What's Tier-2"; or pick equivalents from owner brief carry-forward)
- `src/lib/blogPosts.ts` (EDIT — append metadata for the 2 new posts in the existing entries array; mirror existing entry shape exactly)
- `scripts/build-rss.ts` OR similar (NEW — small build-step script that reads `blogPosts.ts` listings and emits `public/blog/feed.xml` with proper RSS 2.0 + atom links; runs at build time via npm script; OR if scripts dir doesn't exist, emit a TS module that the build pipeline can call; alternatively just regenerate `public/blog/feed.xml` once and document the "build-step needed" carry-forward)
- `public/blog/feed.xml` (EDIT — refresh with all 12 posts)
- `plans/strategic-reviews/2026-05-01-eop-audit-p15-p81.md` (NEW; ≤200 LOC) — audit every phase folder; report which have full triplet, which gaps exist, why (link to commits if known); produce a markdown table with phase | preflight | session-log | retrospective | notes
- `plans/strategic-reviews/2026-05-01-ruvector-backfill.md` (NEW; ≤80 LOC) — note ruvector entries that should land for P80/P81/ADRs 105/106/107; ruvector itself is read-only static snapshot per CLAUDE.md, so this is a doc artifact (the actual file write is deferred or coordinated separately)

**Constraints:** Posts follow ADR-097 voice (Don Miller, founder narrative, concrete examples). RSS xml is well-formed XML. EOP audit cites commits where possible. NO touching CLAUDE.md / STATE.md / README (A5 owns).

### A5 — Final accuracy pass + ADR-107 + closer
**Owns:**
- `docs/adr/ADR-107-oc-cleanup-standard.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-090, ADR-097, ADR-104; defines what "clean" means before RC: a) all P1 carry-forwards closed or explicitly documented as deferred; b) blog ≥12 posts; c) EOP triplet on every sealed phase or documented gap; d) CLAUDE.md/STATE.md/README counts match disk reality)
- `tests/p82-oc-cleanup.spec.ts` (NEW; ≥15 cases; Playwright `test.describe`/`test`):
  - P82.1 ADR-107 file shape (4)
  - P82.2 Page-aware INTENT extension (2 — intentAtom.ts source contains `pageId` + page-detection regex)
  - P82.3 DECOMP page-targeting (2 — decompAtom.ts source contains `targetPage`)
  - P82.4 Mobile drawer page selector (1 — MobileMenu.tsx imports PageSelector OR contains page-list rendering)
  - P82.5 Blog count ≥12 (1 — `src/pages/blog/posts/` has ≥12 .md files)
  - P82.6 RSS feed has ≥12 items (1 — `public/blog/feed.xml` contains ≥12 `<item>` blocks)
  - P82.7 EOP audit doc landed (1)
  - P82.8 EOP triplet present for P82 (3)
- `plans/implementation/phase-82/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` (EDIT — final sync; coordinate with P81/A2 NOTE — bump ADRs to 107; bump tests anchor; bump blog count 10→12; mark P82 SEALED)
- `plans/implementation/mvp-plan/STATE.md` (EDIT — append P81+P82 rows with composite scores)
- `README.md` (EDIT — verify capabilities reflect actual shipped state; update template count + ADR count + tests count if drift exists)
- `docs/wiki/llm-call-process-flow.md` (EDIT — append "last verified P82" line; spot-check process flow still describes pipeline accurately post-P79 page-aware wire)

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`. CLAUDE.md/STATE.md/README final-sync — verify counts match disk before committing (template count = `ls src/data/examples/*.json | wc -l` + TS examples; blog count = `ls src/pages/blog/posts/*.md | wc -l`; ADR count = `ls docs/adr/ADR-*.md | wc -l`).

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. NO breaking existing routes / blog rendering
5. NO shell commands inside agents (except tsc + targeted playwright run + small grep/wc for verification)
6. TypeScript-strict
7. KISS — RSS can ship as static refresh + carry-forward note for true build-step automation

## Acceptance gates (combined P81 + P82)
- Page-aware INTENT + DECOMP closed (intentAtom.ts + decompAtom.ts updated; chatPipeline consumes)
- Mobile drawer surfaces PageSelector
- Blog ≥12 posts
- RSS feed has ≥12 items
- EOP audit doc identifies + triages all gaps
- ADR-106 + ADR-107 both Accepted
- CLAUDE.md / STATE.md / README counts match disk
- ≥15 P81 tests + ≥15 P82 tests GREEN
- Full session OC chain (P62-P82) regression ≥655 GREEN
- tsc strict clean

## Carry-forwards (explicit defer past P82)
- True build-step RSS (cron-triggered) → P83+
- ruvector HNSW activation → Tier-2 commercial
- Hosted share URL → Tier-2 commercial
- Cross-page command UX picker → P83+ (page-aware engine ships this sprint; explicit picker is UX polish)
