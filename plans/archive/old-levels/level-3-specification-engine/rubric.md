# Level 3: Specification Engine — Rubric

> Scoring criteria for evaluating Level 3 implementation quality.

## Scoring Scale
| Score | Meaning |
|-------|---------|
| 0 | Not implemented |
| 1 | Partially implemented, major gaps |
| 2 | Implemented with minor issues |
| 3 | Fully implemented, meets all criteria |

---

## Phase 3.1 — Pillar Docs (XAI Docs Tab)

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 3.1.1 | Spec templates generate content from configStore state | | |
| 3.1.2 | HUMAN view renders structured markdown in XAI DOCS tab | | |
| 3.1.3 | AISP view renders @aisp Crystal Atom format correctly | | |
| 3.1.4 | Copy button copies spec content to clipboard | | |
| 3.1.5 | Export button downloads spec as file | | |
| 3.1.6 | Specs update live when config changes (no manual refresh) | | |
| 3.1.7 | Generated spec content is accurate and useful | | |
| 3.1.8 | AISP format complies with Crystal Atom specification | | |
| 3.1.9 | Rendering performance is acceptable (<200ms for spec regeneration) | | |

**Phase 3.1 Total:** __ / 27

---

## Phase 3.2 — Site-Level Detail Specs

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 3.2.1 | Per-section spec generators produce detailed specifications for all 8 section types | | |
| 3.2.2 | Zip download includes pillar docs + section specs + config.json | | |
| 3.2.3 | Output is formatted for Claude Code consumption (clear instructions, structured prompts) | | |
| 3.2.4 | All section types are covered by spec generators | | |
| 3.2.5 | Export package is self-contained (no external dependencies to use) | | |
| 3.2.6 | Download UX is clear with progress feedback | | |

**Phase 3.2 Total:** __ / 18

---

## Overall Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Phase 3.1 Score | >= 24 / 27 | |
| Phase 3.2 Score | >= 15 / 18 | |
| **Combined Score** | **>= 39 / 45** | |
| Spec generation time | < 200ms | |
| Zip download size | < 1MB | |
| All 8 section types covered | Yes | |
| AISP format validation passes | Yes | |
| Copy/export works in all browsers | Yes | |
