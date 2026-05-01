# P87 — Retrospective (OC-5-MKT-MOBILE)

> **Phase:** P87 · **Sprint:** OC-5-MKT-MOBILE · **Date:** 2026-05-01

## Keep

- **2-agent disjoint-scope dispatch.** A4 owns 8 marketing pages (source); A5 owns ADR + tests + EOP + CLAUDE.md. Zero overlap, zero coordination friction. Mirrors the P85 pattern.
- **`md:`-count proxy as regression-catch gate.** The ≥3 `md:` floor across 8 pages is conservative but objective. Passing doesn't guarantee a great mobile render; failing guarantees a regression. Cheap, citable, automatable.
- **Surgical Tailwind responsive classes only — no new CSS files; no inline style.** Preserves the ADR-102 ≤800KB gzip bundle discipline. Mobile sweep adds zero KB.
- **existsSync guards on A4 surfaces.** Soft-pass pattern lets A4 timing slips surface as deferred (carry-forward) rather than red. Matches the P85 / P84 / P83 / P82 cadence.

## Drop

- **Lighthouse measurement inside the seal.** Live measurement requires a running browser + network; PURE-UNIT spec discipline forbids that here. The ≥85 target is **declared**; measurement is an owner-launch-checklist post-RC task. Decided to keep it that way.
- **Welcome.tsx ambition.** Welcome was OWNED BY P86 / A2 polish dispatch — explicitly out of A4 scope. Resisted the temptation to pull it in.

## Reframe

- **"Marketing site mobile" is a different surface than "app mobile".** ADR-090 closed app mobile (P69). ADR-112 closes marketing mobile (P87). Two ADRs, two scopes, same OC-5 sprint family — recognized late, encoded explicitly now.
- **The carry-forward ledger is a real artifact.** OC-5 marketing mobile sat on the CLAUDE.md carry-forward line from P69 close to P85 close (16 phases). Closing it before commercial Tier-2 starts is the correct move — not because the deferral was sloppy, but because v1.0.0-RC1 raised the cost of the open item.

## Carry-forward

| Item | Owner | Phase / Disposition |
|---|---|---|
| Live Lighthouse mobile sweep (≥85 target) on 8 pages | Owner | Post-RC (owner-launch-checklist append) |
| Video embed responsiveness standard | Future agent | When first video lands |
| Gesture-based mobile interactions | Tier-2 | Native mobile commercial |
| Full PWA install flow | Tier-2 | Commercial |
| `<85` Lighthouse score on any page | Future agent | Opens OC-CLEANUP-2 carry-forward |

## Velocity note

P87 ran parallel with P86 (Polish Wave 4 — 3 sibling agents) under combined-seal discipline. Two ADRs (111 + 112), two phase folders (86 + 87), one CLAUDE.md sync. Velocity holds at ~6 phases/day observed through P19; P85-P87 maintains that rate with the 2-wave dispatch + closer pattern. The brake on the velocity is the standard 1-4 phase-process discipline (EOP triplet + tests + ADR + CLAUDE.md), not headcount.

The 25-gap roadmap's marketing-site mobile carry-forward is now closed. NEXT: owner-led RC tagging + Show HN / PH posting + Agentics Foundation beta share + Lighthouse mobile pass — per `docs/launch/owner-launch-checklist.md`.
