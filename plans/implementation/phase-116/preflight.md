# P116 — Final Polish Pass — Preflight

> **Phase:** P116 · **Sprint:** FINAL-POLISH · **Date:** 2026-05-04
> **Branch:** swarm/p116-final-polish
> **Predecessor:** P115 sealed at `bfc3b73`

## Mandate

Close remaining visual quality gap surfaced by P115 honest audit ("Visual output still reads AI-generated on 20-30% of templates"). 4 disjoint tracks (B1+B2+B3 parallel, B4 closer).

## Agents

### B1 — 5 NEW non-SaaS demos (59 → 64)
- wedding-planner.json (soft editorial / serif / photo-forward / emotional)
- food-truck-restaurant.json (bold / tactile / menu / neighborhood-specific)
- non-profit-community.json (mission-first / impact numbers / volunteer CTA)
- freelance-consultant.json (lawyer/accountant/therapist; trust signals)
- local-events-venue.json (calendar-adjacent / energetic / diverse sections)
- Each: real named entity + real location + real copy
- Wire EXAMPLE_SITES 59 → 64

### B2 — Bottom-10 final visual lift
- Read P115 bottom-15 audit + score current
- Lift remaining sub-7 templates per the named-entity pattern (Mrs. Albright / Cassette / Quattro Studio precedent)
- Target: 90%+ of 64 templates ≥7
- Min 5 sections each; no orphan single-section configs

### B3 — Builder friction-point fixes (2 remaining)
- F1 inline edit: contenteditable overlay on double-click for hero headline + subhead ONLY (tight scope)
- F2 section-type switch: dropdown in section header action bar; compatible swaps only (text ↔ quotes ↔ numbers ↔ image)

### B4 — Closer
- ADR-144 (Final Visual Quality Standard)
- 10 tests
- Phase EOP + CLAUDE.md sync

## Hard rules

1. NO new dependencies
2. tsc strict CLEAN both configs
3. EOP triplet at phase root
4. ADR-144 ≤120 LOC
5. Each new demo Zod-valid + voiceAttributes set + storytelling preset cited

## Acceptance gates

- 5 new demos wired (59 → 64)
- ≥90% of 64 templates ≥7
- Inline edit fires on double-click hero headline + subhead
- Section-type switch dropdown renders + executes compatible swap
- ADR-144 Accepted
- ≥10 P116 tests GREEN
- Cumulative regression preserved
