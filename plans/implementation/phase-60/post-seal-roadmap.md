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

## Design discipline — threads through every post-defense sprint

> Visual polish is the single weakest dimension at P60 (6/10 vs Framer 9/10).
> Each post-defense sprint **must** carry an explicit design pass — not as a
> separate sprint, but as a section of every sprint scope. No sprint ships
> without a design diff (typography, spacing, color tokens, motion, mobile
> breakpoints). Reviewer-impression audit at `docs/launch/reviewer-impression-audit.md`
> is the running design-debt log.

---

## Post-defense — open-core sprint backlog

> **Hard scope rule:** No real hosted URL on open-core (no server, no
> Vercel KV, no Supabase). Static HTML + content-addressable in-browser stub
> + bundle export stay; Tier-2 commercial replaces the in-browser stub with
> a real Supabase row. Open-core sprints **enhance the bundle/export
> surface** so Tier-2 has more to wire up.

| # | Sprint | Scope | Design slice | Effort |
|---|---|---|---|---|
| 1 | **OC-1 — Visual Polish Floor** | Replace Lorem-adjacent copy in kitchen-sink, dev-portfolio, generic blog; AISP trace default-expand on first reply (≈30-min quick win) | Library-wide typography audit · color-token consistency · spacing rhythm pass on every template hero | 1 day |
| 2 | **OC-2 — Mobile First-Run + Polish** | Mobile onboarding card (don't show tri-pane on first phone load) · chat-first mobile landing | Mobile typography scale · touch-target audit · listen-mode mobile design pass · animation tuning | 1-2 days |
| 3 | **OC-3 — Share Bundle Polish** (in-browser only) | Improve static HTML export styling · attribution footer polish · spec bundle UI polish · in-browser content-addressable stub UX. **NO real URL** — that ships in Tier-2. Core functionality preserved/enhanced so Tier-2 plug-in is mechanical | Export-modal redesign · "Built with Hey Bradley" footer typography · shared-spec preview card design | 1-2 days |
| 4 | **OC-4 — AISP Adoption Push** | `bar181/aisp-open-core` README polish · 3+ third-party reference impls · demo notebook · cross-link from HB | Repo landing-page design · README hero + diagrams · demo notebook visual styling | 1-2 weeks |
| 5 | **OC-5 — Prompt Library** | `plans/swarm-patterns/` — canonical agent dispatch templates extracted from Sprint K-O wave logs | Light — markdown formatting + diagrams | 1 day |
| 6 | **OC-6 — Ruvector Activation** | HNSW re-index (bge-base-en-v1.5, 768-dim, all 95 entries) · auto-write per agent run · learning-flywheel loop closure | Trace-pane visualization design when ruvector reads/writes occur | 2-3 days |

These six are **commercial-Tier-2 prep + open-core polish**. None gate the
defense. OC-1 and OC-3 (the design-heavy ones) deliver the most reviewer-
impression lift per hour.

---

## Tier-2 commercial — moves OUT of open-core scope

| Tier-2 item | Open-core counterpart it enhances |
|---|---|
| Real hosted share URL (Supabase row + Vercel KV) | OC-3 polished bundle/export surface |
| OAuth + multi-device persistence | None — Tier-2-only |
| Hosted ruvector learning runtime | OC-6 local-only flywheel |
| SaaS dashboard / flagship app | None — Tier-2-only |
| Original Sprint J Agentic Support System (specs arbitrary codebases) | None — Tier-2 research track |

---

## What is NOT on this list (intentionally deferred)

Per `plans/strategic-reviews/open-core-moat-roadmap.md` and reaffirmed at
P60 seal, the following stay deferred to commercial Tier-2 track and are
NOT in any post-defense open-core sprint:

- Real hosted share URL (server-backed) — the open-core stays on the
  in-browser content-addressable stub; OC-3 only polishes the bundle UI
- Multi-page sites beyond current scope
- OAuth + Supabase persistence
- Hosted vector DB learning runtime
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
