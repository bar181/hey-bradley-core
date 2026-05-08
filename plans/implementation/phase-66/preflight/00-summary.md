# P66 / OC-MKTG — Marketing Site Polish (Preflight)

> **Phase:** P66 · **Sprint:** OC-MKTG (folded out of OC-CLEANUP)
> **Date opened:** 2026-04-30
> **Status:** OPEN — owner-authorized single-agent dispatch
> **Predecessor:** P65b / OC-2.5 Wave 2 sealed at `e7b6af2` (481/481 GREEN)
> **Successor:** OC-4 Templates Round 2 (or further marketing iteration if owner reframes after audit)

---

## Why this sprint

Owner brief: visual-polish 6→7.5 inside the builder is meaningless if the
marketing site that brings users in still has weak CTAs and stale stats.
The current Welcome.tsx primary CTA is "Try it now" pointing at the
builder demo — wrong for the Lars/senior-engineer audience that
discovers the site organically. Senior engineers fork repos; they don't
watch demos.

This sprint reframes:
1. **Primary CTA** → "Try the open source version →" (still routes to /onboarding, but the framing pulls senior engineers, not novices)
2. **Secondary CTA** → "Explore AISP →" pointing at `bar181/aisp-open-core` (feeds the AISP-as-standard adoption flywheel — highest-leverage strategic moat per OC-17 in the launch plan)
3. **Social proof bar** with current numbers (90 ADRs / 481 tests / 61/80 competitive / 42K LOC / built by a swarm in 2 days)
4. **Blog preview** surfacing the 3 most recent posts on the homepage (Don Miller hook: "The spec layer explained")

---

## Recon findings

**Current Welcome.tsx (`src/pages/Welcome.tsx`, 201 LOC):**
- Hero CTA `<Link to="/onboarding">Try it now</Link>` (line 51)
- Secondary CTA: "Open core on GitHub" → repo (line 55)
- Final CTA at line 179: also "Try it now" → /onboarding
- 3-mode section: Builder/Chat/Listen (lines 5-26)
- "The Story" Don Miller-style section (line 71)
- "What You Get" blog-style section (line 144)
- Footer with repo links (lines 192-194)

**Stats constants source-of-truth:** `src/data/progress-eval.ts` line 23
- Currently: `adrsAccepted: 79, testsGreen: 244, codingDays: 2, phasesSealed: 42, sprintsSealed: 7`
- Real values at P65b seal: `adrsAccepted: 90, testsGreen: 481, codingDays: 2, phasesSealed: ~50, sprintsSealed: 14` (F/H/I/J/K/L/M/N/O + OC-1/2/3/2.5/2.5w2)

**Blog posts source:** `src/lib/blogPosts.ts` exposes `listBlogPosts()`.
4 posts exist on disk: `aisp-made-visible`, `jira-vs-agentics`,
`lovable-vs-hey-bradley`, `six-sprints-two-days`.

---

## Three deliverables (single agent, sequential within agent)

### A1 — Marketing site audit
File: `plans/strategic-reviews/2026-05-01-marketing-site-audit.md` (~120 LOC)

Read all 4 marketing pages (Welcome, OpenCore, AISP, Research). Map current page structure. Identify all current CTAs (primary + secondary on each). Compare against the owner-recommended layout (in this preflight §"Recommended layout reference" below). Produce a 5-item ranked change list (top 3 land in A2/A3; remaining 2 go to OC-CLEANUP backlog).

### A2 — CTA reframe + social proof bar
Files touched:
- `src/pages/Welcome.tsx` — surgical edits to primary + secondary CTAs (both hero AND final CTA blocks); add social proof bar below hero
- `src/data/progress-eval.ts` — update `HEADLINE_STATS` to current values (90 ADRs, 481 tests, 14 sprints, etc.)

CTA copy:
- Primary: `Try the open source version →` (still `to="/onboarding"`)
- Secondary: `Explore AISP →` (`<a href="https://github.com/bar181/aisp-open-core">`, opens new tab)

Social proof bar (between hero and "The Story"):
- 5 stat pills inline: "90 ADRs", "481 tests green", "61/80 competitive", "42K LOC", "built by a swarm in 2 days"
- Light styling, single line on desktop, wrap on mobile
- Pulls from `HEADLINE_STATS` for ADRs / tests / coding days; competitive score and LOC may be hardcoded since not in stats yet

### A3 — Blog preview on Welcome
Files touched:
- `src/pages/Welcome.tsx` — add blog preview section before the final CTA

Section copy:
- Eyebrow: `THE BLOG`
- Heading: `The spec layer explained` (Don Miller hook)
- 3 cards from `listBlogPosts()` slice [0,3] (most recent 3 by date)
- Each card: title + 2-sentence excerpt + "Read more →" → `/blog/<slug>`
- Card design uses the canonical Feature card pattern (per ADR-091) — hover-lift + token-derived padding + radius

---

## Recommended layout reference (owner-supplied)

```
HERO  →  primary "Try the open source version" + secondary "Explore AISP"
SOCIAL PROOF BAR  →  5 stat pills
THE STORY (Don Miller — problem first)
THREE MODES
SPEED DEMO  (defer to future sprint)
AISP EXPLAINED  (already exists in /aisp page; link from blog preview)
COMPETITIVE TABLE  (defer to future sprint)
BLOG PREVIEW  →  3 most recent
FINAL CTA
FOOTER
```

This sprint covers the 3 highest-leverage deltas (CTA + social proof +
blog preview). Speed demo + competitive table can come in a follow-up
marketing sprint if the owner wants more.

---

## Hard rules

1. **NO new dependencies.** Use existing imports; lucide-react icons only.
2. **NO route changes.** All CTAs route to existing pages.
3. **NO copy bloat.** Keep the social proof bar to ≤5 pills. Keep the blog preview to 3 cards.
4. **NO Welcome.tsx total rewrite.** Surgical edits only — preserve all existing sections.
5. **NO image changes.** Same media library; no new assets.
6. **YES update `HEADLINE_STATS`** to current values (90 ADRs, 481 tests, 14 sprints, ~50 phases).
7. **NO shell commands inside agent.**
8. Use canonical Feature card style for the blog preview (per ADR-091 — token-derived padding, hover-lift).

---

## Acceptance gates

- Audit doc at `plans/strategic-reviews/2026-05-01-marketing-site-audit.md` (≤120 LOC)
- `Try the open source version →` appears in Welcome.tsx (replaces both "Try it now" instances)
- `Explore AISP →` secondary CTA appears in Welcome.tsx hero
- Social proof bar with 5 pills below hero
- Blog preview section with 3 cards before final CTA
- `HEADLINE_STATS` reflects 90 ADRs / 481 tests / 14 sprints / 2 days
- `npx tsc --noEmit` clean
- Adjacent regression: prior OC specs still GREEN (no test added by this sprint — content/copy edits don't warrant new PURE-UNIT spec since they're owner-curated text)

---

## Successor

OC-4 Templates Round 2 (healthcare + non-profit + search/filter UI) OR additional marketing-site iteration (speed demo + competitive table + AISP explained section) — owner decides post-audit-doc-review.
