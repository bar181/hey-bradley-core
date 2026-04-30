# P61 Launch Planning — Preflight

> **Phase:** P61 — Launch Planning (planning-only; no shipped code)
> **Date opened:** 2026-04-30
> **Status:** OPEN — preflight written; execution gates below
> **Predecessor:** P60 sealed at `fcb3c06` + P60.5 quick win at `dabc638`
> **Successor:** P62..P75 launch-execution sprints (OC-1..OC-14)

---

## What this phase is

A planning phase. Reads the third-party reviewer feedback, my Explore-agent
audit, and the post-P60 roadmap; produces a single launch plan with
brutal-honest sprint review, MVP-vs-P2 split, cleanup sub-phase,
marketing-site audit, and blog content prompts. **No code shipped here.**

Time budget: ~½ day total to plan + commit. Subsequent execution phases
each carry their own preflight + log + retrospective per CLAUDE.md
standard process.

---

## Inputs (canonical signals consumed)

1. `01-third-party-feedback-2026-04-30.md` — owner-supplied 3rd-party reviewer
   summary (14-sprint outline + additional-functionality wishlist + honest
   current-state table)
2. `02-launch-plan.md` — synthesized brutal review (this phase's main output)
3. `plans/implementation/phase-60/post-seal-roadmap.md` — the 6-sprint OC-1..OC-6
   roadmap written at P60 seal (now superseded by 02-launch-plan.md)
4. `tests/p60-competitive-analysis.md` — HB 61/80 vs Lovable / CD / Framer
5. `docs/launch/reviewer-impression-audit.md` — 4 quick wins (1 already shipped at P60.5)
6. `plans/strategic-reviews/2026-04-29-product-evaluation.md` — B-grade brutal review
7. `plans/initial-plans/09.post-mvp-open-core.md` — original post-MVP checklist (40-50% shipped)
8. `plans/deferred-features.md` — 34-item deferred ledger
9. `plans/implementation/mvp-plan/STATE.md` — phase state

---

## Deliverables (this preflight)

| File | LOC target | Purpose |
|---|---:|---|
| `preflight/00-summary.md` (this file) | ≤140 | Phase scope + sprint table + execution gates |
| `01-third-party-feedback-2026-04-30.md` | ≤90 | Verbatim save of owner-supplied 3rd-party reviewer signal |
| `02-launch-plan.md` | ≤370 | Brutal review + sprint roadmap + cleanup sub-phase + marketing audit + blog prompts + multi-page/process-pages decision |

Hard cap: 600 LOC across all three. Anything else is over-planning.

---

## Sprint outline at a glance (full detail in `02-launch-plan.md`)

**MVP launch-blocking (P1) — must ship before public RC promotion:**

| # | Sprint | Effort | Theme |
|---|---|---|---|
| OC-1 | Visual Polish Floor + Design Discipline | 1-2 days | Library-wide Lorem replacement; design tokens |
| OC-2 | Onboarding 2.0 (3 choices not 10) | 1-2 days | Grandma path + Sr-Dev path explicit fork |
| OC-3 | Templates Round 1 (40+ total) | 1-2 days | Verticals coverage |
| OC-4 | Templates Round 2 (edge cases + search) | 1-2 days | Polish + discoverability |
| OC-5 | Mobile UX Overhaul (single-mode + marketing site audit) | 2-3 days | Chat + listen as one mode w/ toggle |
| OC-6 | Listen-Mode 50-Prompt Scenarios | 1-2 days | Voice surface coverage |
| OC-7 | Section-Type Gap Closure | 1 day | Menu, case-study, contact-form |
| OC-8 | Clean UI Pass (tokens, states, motion) | 1-2 days | Continuous design discipline |
| OC-9 | Spec Quality + Export Polish | 1 day | Bundle UI; no real URL |
| OC-10 | Performance + Accessibility | 1 day | a11y baseline + perf budget |
| OC-11 | Multi-Page MVP | 2-3 days | Wire ADR-035 50%-scaffolded data model end-to-end |
| OC-CLEANUP | Cleanup Sub-Phase (ruvector, docs, archive, wiki, marketing audit) | 1-2 days | Stake-docs alignment |

**P2 (advanced — ship if time before public, else just-after):**

| # | Sprint | Effort | Theme |
|---|---|---|---|
| OC-12 | Live LLM Testing (needs API keys) | 1-2 days | Real Haiku/Claude/Gemini smoke |
| OC-13 | Blog Expansion (12+ posts) | 1 day | Content + 3 process posts |
| OC-14 | Process Pages POC (CONTENT version) | 1-2 days | Phase-process content type, no runtime |
| OC-15 | Agentic-Process Templates (TEMPLATE version) | 1-2 days | Dashboard / agent landing-page templates |
| OC-16 | Prompt Library 500+ entries | 1 day | Extend P59 corpus |
| OC-17 | AISP Adoption Push | 1-2 weeks | aisp-open-core repo polish + 3 third-party impls |
| OC-18 | Public Launch RC Final | 1 day | Tag, release notes, demo video v2 |

**Hard Tier-2 (NOT in open-core; commercial only):**
Real hosted share URL · OAuth + Supabase · hosted ruvector runtime ·
real backend deployment for agentic processes · SaaS dashboard ·
original Sprint J Agentic Support System.

---

## Execution gates (when to start dispatching OC sprints)

1. Owner reads + signs off on `02-launch-plan.md` MVP-vs-P2 split
2. Pre-defense owner checklist complete (`v1.0.0-RC1` tag pushed, demo recorded, slides, BYOK smoke, rehearsal)
3. Defense delivered (T+0 to T+14 days from this preflight)
4. Post-defense → enter OC-1 with its own preflight under `plans/implementation/phase-62/`

---

## Out of scope for THIS phase

- Writing any OC-N preflight (those happen at the start of each execution phase)
- Touching code (planning-only)
- Committing any new ADRs (cleanup sub-phase will catalog)
- Running tests (no code changes)

---

## Gate to seal P61

P61 seals when:
- All three planning files committed
- Owner has acknowledged the MVP-vs-P2 split
- This preflight + `02-launch-plan.md` referenced from `CLAUDE.md` § Project Status

A `session-log.md` + `retrospective.md` will be added at seal — minimal, since this phase is planning-only.
