# P84 / OC-18 — Retrospective

**Phase:** P84 / OC-18 (Open Core RC Final)
**Date:** 2026-05-01
**Predecessor:** P83 / OC-17 SEALED (~996+ GREEN, 108 ADRs)
**Closure:** v1.0.0-RC1 ready · OPEN CORE ARC COMPLETE (P11 → P84)

## Keep

- **4-agent parallel dispatch on disjoint scopes** — A1 (release) / A2 (launch) / A3 (quality) / A4 (closer). The pattern from P74 / P78 / P79 / P82 / P83 held: existsSync guards on cross-agent surfaces let any timing-slip surface as soft-pass rather than red.
- **Hard-gate cluster owned by closer** — P84.1 + P84.6 + P84.7 + P84.8 = 9 cases under A4's exclusive control. Even if A1/A2/A3 timing-slip, the seal still hard-gates on ADR-109 + owner-checklist + master-checklist + EOP triplet. This pattern has now landed cleanly across 6 OC sprints.
- **Honest deferred-list discipline** — ADR-109 § 2 enumerates 8 Tier-2 deferrals + ADR-109 § 4 enumerates 7 owner-only post-RC tasks. No silent drops; every item has a phase-of-origin pointer. Mirrors ADR-107 / ADR-108 cleanup discipline.
- **Concrete numbers, no marketing inflation** — 108 ADRs, ~996 tests, 41 templates, 12 blog posts, 21 themes, 18 section types, 5+1 atoms. Every number sourced from CLAUDE.md status line.
- **Cross-ref chain (ADR-082 + ADR-104 + ADR-108)** — three pillars of the open-core moat (RC scope + page-aware + adoption) chained through ADR-109. Future readers can follow the lineage in one hop.

## Drop

- **Original plan's "1-2 weeks community engagement" line item** — correctly reframed at P83 preflight as **post-RC owner-led marketing**, not agent-led code. P84 ships the launch artifacts (CHANGELOG + release notes + Show HN draft + PH tagline + demo script + owner checklist); the engagement window itself is owner work.
- **Live BYOK smoke test as agent-led work** — correctly classified as owner-only ($0.01 dollar spend requires owner authorization). Test infrastructure is in place (5-adapter matrix from P18b / ADR-046); the call is owner-judged.
- **Live demo video record as agent-led work** — voice-over + screen capture is human craft. A2 ships the script; the recording is owner work.

## Reframe

- **"Code sprint" vs "owner work" boundary** — P83 preflight reframed the engagement window as post-RC; P84 honors and codifies that boundary in ADR-109 § 4. This boundary should now be the default for any future "marketing/community/advocacy" line item: agents ship docs/drafts/templates, owner ships the live execution.
- **AISP versioning policy** — moved from "TBD" to "documented standard" in ADR-109 § 3. Minor bumps (`aisp-1.X`) are backward-compat; major bumps (`aisp-2.0`) require RFC issue. RFC governance template itself is post-RC carry-forward (first breaking change creates it).
- **OC arc velocity** — P74 → P84 in approximately 10 sprints across this session window. Original phase budgets (4-6 days each) were 10-50× conservative per the post-P19 reality check. The OC arc validated the velocity-corrected estimate at scale: discipline (tests, ADRs, persona scoring, brutal reviews) is the brake; velocity emerges when discipline holds.

## Carry-forward (post-RC)

### Owner-only (immediate to weeks 1-2)

- Tag `v1.0.0-RC1` + push
- BYOK smoke test (5 prompts × 3 providers; ~$0.01)
- Record demo video (script: `docs/launch/demo-video-script.md`)
- Post Show HN / Product Hunt / Reddit / LinkedIn / Twitter-X (drafts at `docs/launch/`)
- Share with Agentics Foundation beta (20-50 users)
- AISP open-spec repo announcement (https://github.com/bar181/aisp-open-core)

### Tier-2 commercial (post-RC roadmap)

- Hosted share URL (server-backed; Vercel KV / Supabase)
- HNSW vector-DB activation (learning flywheel; auto-write per agent run)
- Multi-tenant org + ACL
- Native mobile apps (iOS / Android)
- Full WCAG 2.1 AAA compliance
- Localization (English-only floor at v1)
- Live-LLM eval harness (corpus exists at 500+ entries; runs are post-RC)
- Tier-2 SaaS dashboard / Agentic Support System (original Sprints J/K/L)

### Post-RC governance (P85+)

- AISP RFC template (created when first breaking change is proposed)
- v1.0.0 GA boundary (post-RC1 stabilization period)

## What went right

- **Discipline held under acceleration.** P74 → P84 closed in ~10 sprints; quality didn't compress. ADR cadence held (one per OC sprint average); test cadence held (~12-30 new cases per sprint); EOP triplet held (no skipped retrospectives).
- **Adoption surface lands before launch, not after.** P83 / ADR-108 shipped the polyglot reference impls + adoption guide tree before P84 / RC final. 3rd-party adopters can read the spec cold without internal Hey Bradley source. This was a strategic-review gap (Gap 2 from `2026-05-01-comprehensive-review-3-gaps-resolutions.md`) closed pre-RC, not deferred to post.
- **The 25-gap roadmap drove sequencing.** P74 brutal-honest comprehensive review identified 25 gaps; P75-P83 closed P1s + high-leverage P2s. P84 is the natural seal-point — no P1 gaps remain; P2 gaps are either closed or explicitly Tier-2.

## What we'd reframe

- **The "1-2 week community engagement" originally read as agent scope.** Reframed correctly at P83 preflight, but the original plan's wording invited drift. Future plans should pre-classify "marketing window" line items as owner-led.
- **AISP RFC governance** could have shipped with ADR-109 instead of being a P85+ carry-forward. Mitigation: no breaking change is yet proposed, so the template is genuinely speculative. First RFC issue creates the template — pull-based vs push-based authoring is the right call here.
- **Composite persona re-score** is a projection (Grandma 80 / Framer 91 / Capstone 97) not a measured score. Could be measured post-RC against the rubric in `personas-rubric.md`. Worth scheduling as a post-launch artifact.

## Velocity note (full OC arc P74 → P84)

| Sprint | Phase | Test delta | Cumulative |
|---|---|---:|---:|
| OC-DECOMP | P74 | +~30 | ~873 |
| OC-7 | P75 | +~15 | ~888 |
| OC-9 | P76 | +~10 | ~898 |
| OC-10 | P77 | +15 | ~913 |
| OC-11 | P78 | +~15 | ~928 |
| OC-14 | P79 | +~12 | ~940 |
| OC-15 | P80 | +~12 | ~952 |
| OC-16 | P81 | +~15 | ~967 |
| OC-CLEANUP | P82 | +~15 | ~982 |
| OC-17 | P83 | +~12 | ~994 |
| **OC-18** | **P84** | **+~15** | **~1011+** |

10 OC sprints; ~138 cumulative new tests; 11 ADRs (ADR-099 → ADR-109); zero P1 gaps remaining at seal. **OPEN CORE ARC COMPLETE.**
