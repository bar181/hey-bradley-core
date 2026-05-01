# P83 / OC-17 — Retrospective

**Phase:** P83 / OC-17 (AISP Adoption Push)
**Date:** 2026-05-01
**Composite estimate:** 91/100 (Grandma 79 / Framer 91 / Capstone 96)

## Keep

- **Three-agent parallel dispatch with disjoint scopes.** A1 / A2 / A3 each owned non-overlapping file sets. Zero collisions at seal. Mirrors the P78 / P79 / P80 / P82 dispatch pattern that has been clean across the OC arc.
- **existsSync guards on cross-agent surfaces in the test spec.** Eight P83 soft-pass cases (P83.2 + P83.3 + P83.4) green-skip if A1 / A2 timing-slip. Eight hard-gate cases (P83.1 + P83.5 + P83.6) run unconditionally. The pattern has now held across P74 / P78 / P79 / P82 / P83 — five sprints of clean parallel-dispatch seals.
- **Reframe of "1-2 weeks community engagement" to docs-now-engagement-later.** Owner brief originally read like a marketing-phase deliverable. Preflight reframe to "P83 ships the docs that make engagement possible; engagement itself is post-RC owner-led work" was the right call — kept agent scope honest and avoided conflating doc work with marketing work.
- **Polyglot floor (TS + Python, stdlib-only).** Proves AISP bundle is not language-coupled. Adoption surface broadens to any JSON-capable runtime. Zero `package.json` / zero `requirements.txt` is a real test of "consumable cold by an external developer".
- **ADR-108 cross-refs ADR-053 / ADR-082 / ADR-098.** Adoption ADRs that explicitly cite the originating standards (the first Crystal Atom, the RC release boundary, the Template Intelligence library shape) make the discipline visible in the ledger. Secondary refs to ADR-097 / ADR-104 / ADR-107 keep the recent-arc context rooted.

## Drop

- **Treating doc sprints as low-velocity by default.** P83 was named an "adoption push" but the engine deliverables (4 polyglot reference-impl files + 3 adoption-guide docs + ADR + 16-case spec) is a meaningful engineering footprint. The retro should report this as the unit of work — not "doc cleanup" or "adoption marketing" — because it underweights the polyglot reference-impl A2 shipped.
- **Animation-lib temptation in adoption-page polish.** A1 brief explicitly forbade the five P83 preflight hard-rule #2 animation libraries. P83.5 enforces in-test against the banned-list. Drop the assumption that adoption-surface visual polish needs JS animation — CSS transitions are sufficient and ADR-091 token-compliant.

## Reframe

- **"Adoption push" is a punctuation phase, not a code-feature phase.** The naming pattern (OC-CLEANUP at P82; OC-17 adoption at P83) suggests two distinct cleanup cadences: pre-RC carry-forward closure (P82) + pre-RC public-surface polish (P83). Capstone-reviewer score discipline keeps the bar honest; without it, P83 risks being read as "we'll write better docs eventually" instead of a sealed engineering deliverable.
- **AISP bundle JSON shape is now a public contract.** Pre-P83, the bundle shape was an internal artifact. Post-ADR-108, minor versions are backward-compat for adopters and breaking changes require an RFC (deferred to P84 OC-18). This is a real boundary shift — every future change to bundle shape now passes through the version policy gate.
- **Sixteen tests against a target of twelve is a discipline win, not over-engineering.** The 8-case hard-gate cluster (ADR + KISS + EOP) covers seal-blocking concerns; the 8-case soft-pass cluster covers cross-agent surfaces. The 4-case buffer is the difference between "passes the brief" and "covers the real seal surface". Keep the buffer.

## Carry-forward (post-P83 → P84+ / Tier-2)

| Item | Surface | Target phase | Rationale |
|---|---|---|---|
| Live community engagement campaign | Marketing / advocacy / conferences | Post-RC | Owner-led; not agent-led code. P84+ window. |
| AISP RFC process for breaking changes | `docs/aisp-adoption/03-versioning-rfc.md` (TBD) | P84 / OC-18 candidate | Versioning policy + governance for `aisp-2.0` major bump path. |
| Localization of adoption guide | `docs/aisp-adoption/i18n/` | Tier-2 | English-only floor for v1; mirrors ADR-106 disfluency-coverage decision. |
| Hosted reference-impl playground | Vercel KV / Supabase | Tier-2 | Pairs with hosted share URL; auth-coupled. |
| Live demo of 3rd-party consumer running | CI smoke-test or hosted demo | P84 | Parser smoke-runs at CI time; full demo post-RC. |
| Build-step blog floor gate | Carry-forward from P82 retro | P84 / OC-18 | Replace hand-counting at A4-style retro time. |

## Velocity note

- **Original budget:** P83 OC-17 estimated as 1-2 days at velocity (3-agent sprint with marketing-surface complexity).
- **Actual elapsed:** Sub-day at velocity (parallel dispatch with clean disjoint scopes; reuse of P82 EOP / test-spec patterns).
- **Re-budget for P84:** RC final + community engagement window will likely need 2-3 days at velocity given the marketing surface (post-RC), the RFC process kickoff, and the final composite review.

The discipline (ADR + tests + EOP triplet + persona scoring) holds. Velocity emerges when the brakes hold; do not compress P84 to chase a faster RC seal.

## Status

**P83 / OC-17 SEALED at composite ~91/100.** AISP adoption surface lands: README rewrite + 3-doc adoption guide tree at `docs/aisp-adoption/` + 4-file polyglot reference impl at `examples/3rd-party-consumer/` + ADR-108 (71 LOC ≤ 120) + 16-case spec. Cumulative ~996+ PURE-UNIT GREEN. P84 (RC final + community engagement window) inherits a clean adoption-ready baseline.
