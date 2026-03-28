# Level 5: LLM Functionality — Rubric

> Scoring criteria for evaluating Level 5 implementation quality.

## Scoring Scale
| Score | Meaning |
|-------|---------|
| 0 | Not implemented |
| 1 | Partially implemented, major gaps |
| 2 | Implemented with minor issues |
| 3 | Fully implemented, meets all criteria |

---

## Phase 5.1 — Chat Bot (Hero Only)

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 5.1.1 | chatStore created with message history, loading, and error state | | |
| 5.1.2 | Chat input sends text to LLM via Supabase Edge Function | | |
| 5.1.3 | LLM returns valid JSON patch targeting hero section | | |
| 5.1.4 | Patch validated by Zod before applying to configStore | | |
| 5.1.5 | Hero updates within 2 seconds of user input | | |
| 5.1.6 | Error handling for invalid patches (retry or user-facing message) | | |
| 5.1.7 | Chat history visible and scrollable in left panel | | |
| 5.1.8 | Two-step LLM flow implemented (intent classification + patch generation) | | |
| 5.1.9 | Cost tracking per interaction logged (tokens used, estimated cost) | | |

**Phase 5.1 Total:** __ / 27

---

## Phase 5.2 — Copy Suggestions

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 5.2.1 | Clicking a section and editing text triggers copy suggestion flow | | |
| 5.2.2 | LLM generates 3 distinct copy alternatives per request | | |
| 5.2.3 | Suggestions appear in a popover/dropdown near the edit point | | |
| 5.2.4 | User can click to accept a suggestion (applies immediately) | | |
| 5.2.5 | Debounced trigger prevents excessive API calls (>= 1.5s pause) | | |
| 5.2.6 | Suggestions follow copywriting best practices (quality assessment) | | |

**Phase 5.2 Total:** __ / 18

---

## Phase 5.3 — Section Inference

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 5.3.1 | User types natural language and LLM identifies target section | | |
| 5.3.2 | Classification works across all 8 section types | | |
| 5.3.3 | Confidence score returned with classification result | | |
| 5.3.4 | Clarification asked when confidence < 0.7 | | |
| 5.3.5 | Multi-section commands handled (e.g., "change hero and pricing") | | |
| 5.3.6 | Workflow tab shows pipeline progress for each step | | |
| 5.3.7 | Section inference accuracy >= 80% on test prompts | | |
| 5.3.8 | End-to-end response time < 4 seconds (classification + patch) | | |

**Phase 5.3 Total:** __ / 24

---

## Phase 5.4 — Onboarding Purpose

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 5.4.1 | Onboarding textarea accepts natural language description | | |
| 5.4.2 | LLM parses description into structured config matching configStore schema | | |
| 5.4.3 | Appropriate vibe auto-selected based on description tone | | |
| 5.4.4 | All relevant sections auto-populated with generated content | | |
| 5.4.5 | Progressive build visible (sections appearing sequentially) | | |
| 5.4.6 | Result is fully editable after generation (not locked) | | |
| 5.4.7 | Works for 60-70% of marketing site descriptions on first attempt | | |

**Phase 5.4 Total:** __ / 21

---

## Overall Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Phase 5.1 Score | >= 24 / 27 | |
| Phase 5.2 Score | >= 15 / 18 | |
| Phase 5.3 Score | >= 20 / 24 | |
| Phase 5.4 Score | >= 17 / 21 | |
| **Combined Score** | **>= 76 / 90** | |
| Chat response time (hero patch) | < 2s | |
| Section inference accuracy | >= 80% | |
| Copy suggestion latency | < 3s | |
| Onboarding description coverage | >= 60% | |
| Cost per chat interaction | < $0.01 | |
| Cost per onboarding generation | < $0.05 | |
| Error rate (malformed patches) | < 5% | |
| Zod validation pass rate | >= 95% | |
