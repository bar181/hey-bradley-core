# Hey Bradley — Master Project Rubric & Scorecard

## Purpose
This rubric provides a comprehensive quality assessment of the entire Hey Bradley project across all 7 levels and 21 phases. It tracks both functional requirements completion and quality metrics.

## Scoring Guide
| Score | Meaning | Description |
|-------|---------|-------------|
| 0 | Not Started | No work has begun |
| 1 | Started | Initial work begun, incomplete |
| 2 | Functional | Works but needs polish or has gaps |
| 3 | Complete | Meets all requirements at expected quality |
| 4 | Exceeds | Production-quality, exceeds expectations |

## Project-Level Quality Dimensions

### A. Functional Completeness
| # | Dimension | Weight | Score (0-4) | Weighted | Notes |
|---|-----------|--------|-------------|----------|-------|
| A1 | Builder Mode (DRAFT + BUILD) | 20% | 0 | 0.0 | Core builder with vibe selection, section management |
| A2 | Builder Mode (EXPERT + BUILD) | 15% | 0 | 0.0 | Property inspector, full CSS control, JSON editing |
| A3 | Listen Mode (red orb, dark overlay) | 15% | 0 | 0.0 | Theatrical visual, voice capture, auto-build |
| A4 | JSON Data Tab (bidirectional sync) | 10% | 0 | 0.0 | Live JSON viewer/editor, syntax highlighting |
| A5 | XAI Docs Tab (specs generation) | 10% | 0 | 0.0 | HUMAN + AISP spec auto-generation |
| A6 | Workflow Tab (pipeline visualization) | 5% | 0 | 0.0 | Pipeline steps with status indicators |
| A7 | Section System (8 types, CRUD) | 15% | 0 | 0.0 | All section types, add/remove/reorder |
| A8 | Specification Export | 10% | 0 | 0.0 | Downloadable spec package for Claude Code |
| **Total** | | **100%** | | **0.0** | |

### B. Design Quality ("Wow Factor")
| # | Dimension | Weight | Score (0-4) | Weighted | Notes |
|---|-----------|--------|-------------|----------|-------|
| B1 | Warm cream design system applied | 15% | 0 | 0.0 | #faf8f5 bg, #e8772e accent, #2d1f12 text |
| B2 | Typography (DM Sans + JetBrains Mono) | 10% | 0 | 0.0 | Correct fonts, sizes, weights, transforms |
| B3 | Component polish (shadows, borders, spacing) | 15% | 0 | 0.0 | Pixel-perfect alignment, consistent spacing |
| B4 | Listen Mode red orb effect | 20% | 0 | 0.0 | Layered glow, pulse animation, theatrical impact |
| B5 | Mode transitions (DRAFT↔EXPERT, LISTEN↔BUILD) | 10% | 0 | 0.0 | Smooth, instant, no data loss |
| B6 | Enterprise density in Expert mode | 10% | 0 | 0.0 | text-xs, font-mono, compact property rows |
| B7 | Overall "funded startup" aesthetic | 20% | 0 | 0.0 | Indistinguishable from Framer/Linear/Vercel UI |
| **Total** | | **100%** | | **0.0** | |

### C. Technical Quality
| # | Dimension | Weight | Score (0-4) | Weighted | Notes |
|---|-----------|--------|-------------|----------|-------|
| C1 | JSON as single source of truth | 15% | 0 | 0.0 | All state in configStore, no hidden state |
| C2 | Zod schema coverage | 10% | 0 | 0.0 | All data types have Zod schemas |
| C3 | DDD boundary enforcement | 10% | 0 | 0.0 | Import firewall respected |
| C4 | Performance (< 100ms render) | 15% | 0 | 0.0 | Config change → visual update fast |
| C5 | Zero console errors | 10% | 0 | 0.0 | Clean console in all modes |
| C6 | TypeScript strictness (no any/ts-ignore) | 10% | 0 | 0.0 | Strict mode, proper typing |
| C7 | Test coverage (Playwright e2e) | 15% | 0 | 0.0 | All critical paths tested |
| C8 | Approved dependencies only | 5% | 0 | 0.0 | No unapproved packages |
| C9 | Storage abstraction (IProjectRepository) | 10% | 0 | 0.0 | LocalStorage → Supabase swap |
| **Total** | | **100%** | | **0.0** | |

### D. AISP / Specification Quality
| # | Dimension | Weight | Score (0-4) | Weighted | Notes |
|---|-----------|--------|-------------|----------|-------|
| D1 | AISP Crystal Atom format compliance | 20% | 0 | 0.0 | Matches AISP 5.1 spec |
| D2 | Human-readable spec quality | 20% | 0 | 0.0 | Clear, structured, useful |
| D3 | Claude Code consumption | 20% | 0 | 0.0 | Export → Claude Code → matching site |
| D4 | Ambiguity score (< 0.02 target) | 20% | 0 | 0.0 | Measurable low ambiguity |
| D5 | Spec completeness (all sections covered) | 20% | 0 | 0.0 | Every section generates specs |
| **Total** | | **100%** | | **0.0** | |

## Level-by-Level Progress Summary

| Level | Name | Phases | Requirements | Met | Score | Status |
|-------|------|--------|-------------|-----|-------|--------|
| L1 | Core Builder | 1.0-1.3 | 52 | 0 | 0.0 | NOT STARTED |
| L2 | Full Site Builder | 2.1-2.3 | 31 | 0 | 0.0 | NOT STARTED |
| L3 | Specification Engine | 3.1-3.2 | 14 | 0 | 0.0 | NOT STARTED |
| L4 | Auth & Database | 4.1-4.3 | 25 | 0 | 0.0 | NOT STARTED |
| L5 | LLM Functionality | 5.1-5.4 | 30 | 0 | 0.0 | NOT STARTED |
| L6 | Voice Mode | 6.1-6.3 | 26 | 0 | 0.0 | NOT STARTED |
| L7 | Enterprise Specs | 7.1-7.4 | 27 | 0 | 0.0 | NOT STARTED |
| **Total** | | **21 phases** | **205** | **0** | **0.0** | |

## Capstone Demo Readiness

| Criterion | Target | Status | Notes |
|-----------|--------|--------|-------|
| Time to first meaningful result | < 30 seconds | — | Click vibe → see website |
| Mode switching (DRAFT↔EXPERT) | Instant, smooth | — | No data loss |
| Listen Mode visual impact | "Funded startup" quality | — | Dark screen + glowing red orb |
| Spec output → Claude Code | Produces matching site | — | Round-trip validation |
| Design quality | Indistinguishable from Framer | — | UI designer SME approval |
| All "aha moments" demonstrated | 6/6 | — | See North Star §3.2 |

## Update History

| Date | Updated By | Changes |
|------|-----------|---------|
| 2026-03-28 | Initial creation | Rubric scaffolding — all scores at 0 |
