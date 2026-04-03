# Phase 6: Living Checklist — Canned Demo + Deploy Preparation

**Last Updated:** 2026-04-03 (Session 2 — grounding + Loop 2 verification)

---

## 6A — Canned Demo Simulation

| # | Check | Severity | Status |
|---|-------|----------|--------|
| DS1 | `demoSimulator.ts` orchestrates timed section reveals | P0 | TODO |
| DS2 | Typewriter captions narrate each step | P0 | TODO |
| DS3 | Theme applies before sections appear | P0 | TODO |
| DS4 | Sections appear one-by-one with fade/slide animation | P0 | TODO |
| DS5 | Auto-switch from Chat tab to Builder tab on completion | P1 | TODO |
| DS6 | All 4 example websites have simulation sequences | P0 | TODO |
| DS7 | Simulation can be interrupted/cancelled by user action | P1 | TODO |
| DS8 | Timing feels natural (subtle randomness in intervals) | P2 | TODO |

## 6B — Chat Quick-Demo Buttons

| # | Check | Severity | Status |
|---|-------|----------|--------|
| CB1 | 3-4 quick-demo buttons rendered below chat input | P0 | TODO |
| CB2 | Each button triggers the canned demo simulation | P0 | TODO |
| CB3 | Buttons show relevant emoji + label (e.g., "Build a Bakery") | P1 | TODO |
| CB4 | Buttons disabled during active simulation | P1 | TODO |

## 6C — Listen Mode Demo

| # | Check | Severity | Status |
|---|-------|----------|--------|
| LD1 | "Watch a Demo" triggers demo simulator | P0 | TODO |
| LD2 | Orb pulse speed changes during simulation | P1 | TODO |
| LD3 | Captions appear in transcript area | P0 | TODO |
| LD4 | Auto-switch to Builder tab on completion | P1 | TODO |
| LD5 | Orb returns to idle state after simulation | P1 | TODO |

## 6D — XAI Docs Integration

| # | Check | Severity | Status |
|---|-------|----------|--------|
| XD1 | AISP spec rendered as structured document in XAI DOCS tab | P1 | DONE |
| XD2 | Section-level explanations displayed | P1 | DONE |
| XD3 | AISP symbol reference accessible | P2 | DONE |

## 6E — Deploy Preparation

| # | Check | Severity | Status |
|---|-------|----------|--------|
| DP1 | Vercel deployment configured and working | P0 | DONE (CI/CD from main) |
| DP2 | Static HTML export generates valid self-contained page | P0 | DESCOPED (output is AISP, not HTML — per ADR-026) |
| DP3 | Share button generates shareable preview URL | P1 | TODO |
| DP4 | Preview URL loads site without builder chrome | P1 | DONE (preview mode exists) |
| DP5 | Build succeeds with zero errors | P0 | DONE |

## 6F — Polish Carryover from Phase 5

| # | Check | Severity | Status |
|---|-------|----------|--------|
| PC1 | ColumnsGlass ambient blob fix | P2 | TODO |
| PC2 | HeroSplit responsive (`flex-col md:flex-row`) | P1 | TODO |
| PC3 | ImagePicker integration for Team editor | P1 | TODO |
| PC4 | ImagePicker integration for Logo Cloud editor | P1 | TODO |
| PC5 | Type-appropriate section spacing (not uniform `py-16`) | P2 | DONE |
| PC6 | Section headings/eyebrows above card grids | P2 | DONE |

## 6G — Session 1 Polish + AISP Output

| # | Check | Severity | Status |
|---|-------|----------|--------|
| SP1 | Section headings above all 30 grid/card templates (15 JSONs) | P1 | DONE |
| SP2 | useScrollReveal hook with IntersectionObserver + prefers-reduced-motion | P1 | DONE |
| SP3 | Staggered card animations (100ms delay) in ALL card templates | P2 | DONE |
| SP4 | Button micro-interactions (hover:scale-[1.02] active:scale-[0.98]) | P2 | DONE |
| SP5 | Tab crossfade on Builder/Chat/Listen switch | P2 | DONE |
| SP6 | Platinum AISP Crystal Atom output (95/100 tier) in Specs tab | P1 | DONE |
| SP7 | Copy/download for both HUMAN and AISP views | P1 | DONE |
| SP8 | Spacing standardized per section type | P2 | DONE |
| SP9 | Neutral default text replacing SaaS jargon | P1 | DONE |
| SP10 | ADRs 026-028 (AISP output, micro-interactions, section headings) | P2 | DONE |
| SP11 | Research: agency polish patterns, AISP output mapping | P2 | DONE |

## 6H — Loop 2 Fixes (Verified Session 2)

| # | Check | Severity | Status |
|---|-------|----------|--------|
| L2-1 | Section headings consistent across ALL 31 grid templates | P1 | DONE |
| L2-2 | Resting card shadows (`shadow-md`) on all card templates | P1 | DONE |
| L2-3 | AISP syntax highlighting (Greek symbols, delimiters, operators) | P1 | DONE |
| L2-4 | Example JSONs updated with real headings (bakery: "Fresh From Our Oven") | P1 | DONE |
| L2-5 | Default config expanded to 6 sections (menu, hero, columns, quotes, numbers, action) | P0 | DONE |
| L2-6 | Stagger animation on ALL card-based templates (not just 5) | P2 | DONE |
| L2-7 | Heading/subheading editor fields in 8 Simple editors | P1 | DONE |

## 6I — Example Websites

| # | Check | Severity | Status |
|---|-------|----------|--------|
| EX1 | `bakery.json` with real copy and images | P0 | DONE |
| EX2 | `launchpad-ai.json` — SaaS theme, dark, 6 sections | P0 | TODO |
| EX3 | `sarah-chen-photography.json` — Portfolio theme, gallery | P0 | TODO |
| EX4 | `greenleaf-consulting.json` — Professional theme, numbers | P0 | TODO |
| EX5 | "Try an Example" buttons on onboarding + chat | P1 | TODO |

---

## Phase 6 Pass Criteria

| Severity | Rule | Result |
|----------|------|--------|
| P0 failures | BLOCKING | **5 remaining** (DS1-4, DS6, CB1-2, LD1, LD3, EX2-4) |
| P1 failures | < 3 allowed | **7 remaining** (DS5, DS7, CB3-4, LD2, LD4-5, PC2-4, DP3, EX5) |
| P2 failures | Informational | **2 remaining** (DS8, PC1) |

## Progress Summary

- **6A (Canned Demo):** 0/8 DONE
- **6B (Chat Buttons):** 0/4 DONE
- **6C (Listen Demo):** 0/5 DONE
- **6D (XAI Docs):** 3/3 DONE
- **6E (Deploy Prep):** 3/5 DONE (1 descoped)
- **6F (Polish Carryover):** 2/6 DONE
- **6G (Session 1 Polish + AISP):** 11/11 DONE
- **6H (Loop 2 Fixes):** 7/7 DONE
- **6I (Example Websites):** 1/5 DONE
- **Overall:** 27/54 items complete (50%)
