# Post-P60 Roadmap — End of Open Core → Defense

> **Date:** 2026-04-29 · **Phase:** P60 SEALED at `fcb3c06`
> **Status:** Open Core RC complete · Defense in ~2 weeks · LOW PRIORITY regroup
> **Pair with:** `plans/strategic-reviews/open-core-moat-roadmap.md`,
> `tests/p60-competitive-analysis.md`, `docs/launch/reviewer-impression-audit.md`

---

## Open Core arc — sprints sealed

| Sprint | Phase | Moat priority / theme | Sealed at | ADR |
|---|---|---|---|---|
| K | P54 | #1 Speed visible (latency badge default-on) | `44cc36c` | ADR-077 |
| L | P55 | #2 Spec unmissable (AISP atom trace always-on + animations) | `2944461` | ADR-078 |
| M | P56 | #3 Premium templates (5 opinionated templates) | `3398702` | ADR-079 |
| N | P57 | #4 Shareable output (static HTML + content-addressable stub) | `c00c2b7` | ADR-080 + ADR-081 |
| O | P58 | Open Core RC — `v1.0.0-RC1` public release | `e99ecc2` | ADR-082 |
| — | P59 | Test Library — 280-entry prompt corpus | `f81474c` | ADR-083 |
| — | P60 | Comprehensive QA Architecture (this seal) | `fcb3c06` | ADR-084 |

**Cumulative gate:** 392/392 PURE-UNIT GREEN at P60 seal.

---

## Headline numbers for the defense

1. **100× velocity** — 212 developer-days of output landed in 2 days.
2. **<2% ambiguity** — AISP Crystal-Atom spec vs 40-60% prose-spec baseline.
3. **61/80 competitive score** — HB ahead of Lovable 51 / Claude Designer 46 / Framer 45 across 8 dimensions (`tests/p60-competitive-analysis.md`).

HB wins clearly on: **Spec quality 10/10**, **Open-source posture 10/10**,
**Speed perception 9/10**. HB loses on: Mobile UX (Lovable 9 vs HB 7),
Sharing (Framer 9 vs HB 5), Visual polish floor (Framer 9 vs HB 6).

---

## Pre-defense — owner-only checklist (no swarm)

| # | Action | Estimate |
|---|---|---|
| 1 | `git tag v1.0.0-RC1 && git push origin v1.0.0-RC1` | 1 min |
| 2 | Record 90-second demo video — script at `docs/launch/demo-video-script.md` | 30 min |
| 3 | Live BYOK smoke test — 5 prompts × real Haiku (~$0.01 spend) | 10 min |
| 4 | Slide deck — 10-12 slides, lead with the 61/80 competitive score | 2-3 hrs |
| 5 | Rehearse demo twice end-to-end | 30 min |

Total: half a working day spread over the two-week window.

---

## Post-defense — backlog (swarm-eligible, deferred)

| # | Task | Source / link |
|---|---|---|
| 1 | Ruvector HNSW re-index — bge-base-en-v1.5, 768-dim, all 95 entries | `plans/strategic-reviews/ruvector-fix-2026-04-29.md` |
| 2 | Sprint N hosted URL — real shareable link (Vercel KV stub + 1 endpoint) replacing in-browser content-addressable stub | `tests/p60-competitive-analysis.md` §"Top 3 gaps" #1; ADR-081 §honesty-note |
| 3 | Prompt library at `plans/swarm-patterns/` — canonical agent dispatch templates extracted from Sprint K-O wave logs | new |
| 4 | Auto-write to ruvector on every agent run — close the learning-flywheel loop deferred to Tier-2 | `CLAUDE.md` §Project Status (HNSW re-index pending → deferred) |
| 5 | Visual polish floor — replace remaining Lorem-adjacent generic templates with real-copy versions (kitchen-sink, dev-portfolio); targets visual-polish 6 → 8 | `tests/p60-competitive-analysis.md` §"Top 3 gaps" #2 |
| 6 | AISP atom trace default-expand on first reply per session (≈30 min, medium impact) | `tests/p60-competitive-analysis.md` §"Top 3 gaps" #3 |

These are commercial-Tier-2 candidates and capstone-defense follow-ups — not
gating the defense itself.

---

## What is NOT on this list (intentionally deferred)

Per `plans/strategic-reviews/open-core-moat-roadmap.md` and reaffirmed at
P60 seal, the following stay deferred to commercial Tier-2 track:

- Multi-page sites beyond current scope
- OAuth + Supabase persistence (the real share-link backbone)
- Vector DB learning runtime (HNSW re-index pending → Tier-2)
- Tier-2 SaaS dashboard / flagship app
- Original Sprint J Agentic Support System ("Hey Bradley specs arbitrary
  codebases") — research-grade work, no competitor attempting
- Sprint G (Interview), Sprint H remainder (Upload+Refs polish), Sprint I
  remainder

---

## Bottom line

The product is defense-ready. The open core arc is **complete**.
Two-week window is for owner rehearsal and slide work; no further
swarm-orchestrated phase work is gating the capstone.
