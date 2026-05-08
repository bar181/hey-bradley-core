# Marketing Site Audit — P66 / OC-MKTG

> **Date:** 2026-05-01
> **Sprint:** P66 / OC-MKTG (Marketing Site Polish)
> **Predecessor seal:** P65b / OC-2.5 Wave 2 at `e7b6af2`
> **Audit scope:** Welcome / OpenCore / AISP / Research

---

## 1. Current state — top-of-fold by page

| Page | LOC | H1 / hook (1-line summary) | Primary CTA (verbatim) | Secondary CTA (verbatim) |
|------|-----|----------------------------|------------------------|--------------------------|
| Welcome (`src/pages/Welcome.tsx`) | 201 | "Tell Bradley what you want. Watch it appear." | `Try it now` → `/onboarding` | `Open core on GitHub` → `bar181/hey-bradley-core` |
| OpenCore (`src/pages/OpenCore.tsx`) | ~440 | "The 55% problem nobody's solving." | `hey-bradley-core` repo link | `aisp-open-core` repo link |
| AISP (`src/pages/AISP.tsx`) | 264 | "AI Symbolic Protocol" — math-first 512-symbol language | `View on GitHub` (aisp-open-core) | `Try in Builder` → `/new-project` |
| Research (`src/pages/Research.tsx`) | 308 | "The most expensive game of telephone in history." | (none in hero — narrative-first) | (none in hero — narrative-first) |

Tertiary on Welcome hero today: `Read the AISP spec` → `/aisp`.

---

## 2. Gap vs. owner-recommended layout

Recommended layout (per preflight): HERO → SOCIAL PROOF → STORY → MODES → SPEED DEMO → AISP EXPLAINED → COMPETITIVE TABLE → BLOG PREVIEW → FINAL CTA → FOOTER.

| Layout slot | Welcome | OpenCore | AISP | Research |
|-------------|---------|----------|------|----------|
| Hero with strong primary CTA | ⚠️ (CTA copy weak — "Try it now") | ✅ (repo links) | ✅ | ⚠️ (no CTA in hero by design) |
| Social proof bar (5 stat pills) | ❌ | ⚠️ (4-stat block but mid-page, stale numbers) | ❌ | ❌ |
| Story (Don Miller — problem first) | ✅ ("The 55% problem") | ✅ ("AI solved the wrong half") | ⚠️ (jumps to mechanics) | ✅ (3-act narrative) |
| Three modes section | ✅ | ❌ | ❌ | ❌ |
| Speed demo | ❌ (deferred) | ❌ (deferred) | ❌ | ❌ |
| AISP explained | ⚠️ (link only) | ✅ (Crystal Atom block) | ✅ (full page) | ⚠️ (woven into prose) |
| Competitive table | ❌ (deferred) | ⚠️ (Fit & Value chart, no head-to-head) | ⚠️ (feature comparison on AISP only) | ✅ (5-row tool table) |
| Blog preview (3 cards) | ❌ | ❌ | ❌ | ❌ |
| Final CTA | ⚠️ (still says "Try it now") | ✅ | ✅ | ✅ |
| Footer | ✅ | ✅ | ✅ | ✅ |

Stale numbers: OpenCore "How it's built" cites 244 tests / 79 ADRs / 42 phases / P15-P56 — superseded by 481 / 90 / ~50 / P15-P65b.

---

## 3. Ranked 5-item change list

| # | Change | Owner sprint | Files |
|---|--------|--------------|-------|
| 1 | Welcome hero + final CTA reframe to "Try the open source version →" + secondary "Explore AISP →" (senior-engineer pull, not novice demo bait) | **P66 / A2 (this sprint)** | `src/pages/Welcome.tsx` |
| 2 | Welcome social proof bar below hero (90 ADRs / 481 tests / 61/80 competitive / 42K LOC / 2-day swarm); update `HEADLINE_STATS` source-of-truth | **P66 / A2 (this sprint)** | `src/pages/Welcome.tsx`, `src/data/progress-eval.ts` |
| 3 | Welcome blog preview (3 cards, canonical Feature card style, hover-lift per ADR-091) before final CTA | **P66 / A3 (this sprint)** | `src/pages/Welcome.tsx` |
| 4 | OpenCore "How it's built" stat refresh (244→481 tests, 79→90 ADRs, 42→~50 phases, P15-P56→P15-P65b) — currently stale by 6 sprints | OC-CLEANUP backlog | `src/pages/OpenCore.tsx` (lines ~298-309 stat grid + ~314-321 capability list) — 1-line rationale: numbers must match Welcome social proof bar; mismatch breaks credibility |
| 5 | Research page hero CTA pair (currently no hero CTA — narrative-first works but a sticky bottom-of-hero "Try it" + "Read OpenCore" would lift conversion without breaking the 3-act flow) | OC-CLEANUP backlog | `src/pages/Research.tsx` (insert below `<p>` at line ~25) — 1-line rationale: 308-LOC narrative deserves an entry-point CTA at fold; currently the only CTA is at the very bottom |

---

## 4. Out of scope (deferred to future marketing sprints)

- **Speed demo section** on Welcome (latency badge live demo / animated patch timeline) — owner-deferred per preflight; candidate for OC-MKTG-2.
- **Competitive table section** on Welcome (head-to-head vs. Lovable / v0 / Cursor / Claude Code with score-by-score breakdown) — owner-deferred; the Research page already has a 5-row tool table that could be lifted/condensed.
- **AISP-explained section** on Welcome (currently only a tertiary "Read the AISP spec" link; a 2-3 paragraph explainer with the Crystal Atom example block from OpenCore would help Lars-persona organic discovery) — owner-deferred.
- **OpenCore + AISP + Research** stat-refresh pass beyond item #4 — partial-coverage sweep across all 4 marketing pages to catch every "244 tests" / "79 ADRs" / "42 phases" / "P15-P56" reference. Audit-only this sprint; landed in OC-CLEANUP.
