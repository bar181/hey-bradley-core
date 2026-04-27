# Phase 21 — Master Checklist

> **Title:** Sprint B Phase 1 — Simple Chat (natural language input + first real templates)
> **Activation gate:** P20 sealed AND Phase α housekeeping (below) complete
> **Effort:** multi-hour shift at P19-velocity
> **Capstone alignment:** Sprints A-C completable before May 2026 defense; Sprint D begins post-defense
> **Owner directive (Option A):** sequential numbering, no gaps. P21 = first coding phase of Sprint B (NOT MVP planning).

---

## Phase 21 coding DoD (the actual coding phase)

Phase 21 ticks the actual coding deliverables of Sprint B Phase 1. The housekeeping in §1-§5 below is now **Phase α / pre-P21** — runs once before P21 begins and is not part of the P21 coding DoD.

- [ ] Natural-language input parser — handles freeform user prompts, routes to template registry
- [ ] **2-3 templates registered** in real registry (not just regex fixtures): "make it brighter", "hide the hero", "warmer colors"
- [ ] Section targeting `/hero-1` works — keyword path scoping resolves to a single section
- [ ] **+5 Playwright cases** (P21 baseline, monotonic non-decreasing)
- [ ] **1 ADR** for template registry (proposed ADR-050; ADR-049 reserved for cost-cap from P20)
- [ ] Build green; lint green; targeted test sweep green
- [ ] `MEMORY.md` and `STATE.md` updated with P21 seal composite + commit

---

## Pre-P21 housekeeping (Phase α — runs before P21 coding)

The following §1-§5 sections were originally framed as "Phase 21 MVP planning". Per owner directive (Option A, sequential numbering with no gaps), they are now **Phase α / pre-P21 housekeeping** — they run once before P21 starts coding, but P21 itself is the Simple Chat coding phase.

## §1 — Lock the authoritative sprint plan

Owner provided the post-P18 sprint plan in `preflight/00-summary.md` "TOP PRIORITY" section. Phase-18 docs and master-backlog need to match.

- [ ] `plans/implementation/phase-18/roadmap-sprints-a-to-h.md`
  - [ ] Add "## Actuals through P19" header table (P15-P19 + P18b composites + commits)
  - [ ] Sprint A — update P19 row to "✅ Sealed Listen mode"; add P18b row between P18 and P19; mark P20 "🔄 In Flight"
  - [ ] Sprint F — re-title to "Listen Mode **Enhancement** (P36-P39)" (preserve original phase numbers)
  - [ ] Sprint F — update 4 phase descriptions to be enhancements (P36 intent pipeline reuse / P37 review mode / P38 chat-bridge / P39 polish)
  - [ ] Open Questions for Phase 18 Review — append RESOLVED tag with one-line resolution to each of 6 Qs

- [ ] `plans/implementation/phase-18/strategic-vision.md`
  - [ ] Full Sprint Roadmap table — Sprint A status; Sprint F title change; rest unchanged
  - [ ] Open Strategic Questions — append RESOLVED tag to each of 6 Qs

- [ ] `plans/implementation/phase-20/01-strategic-alignment.md` §2.2
  - [ ] Drop the proposed -5 phase shift table
  - [ ] Replace with note: "Owner directive: keep original phase numbering. Sprint F re-titled to 'Listen Mode Enhancement' since base Listen shipped in P19."

- [ ] `plans/master-backlog.md`
  - [ ] Read end-to-end
  - [ ] Flag (do not delete) any Stage-3 LLM-MVP items now obsolete (covered by P15-P19)
  - [ ] Flag any out-of-sequence items
  - [ ] Append a short "## Post-P19 reconciliation" note at end of file

---

## §2 — Re-affirm capstone gates

- [ ] Confirm Sprints A-C completable before May 2026 defense at P19 velocity
- [ ] Capstone-presentation surface = sealed P15-P20 + Sprint B (P21-P23) + Sprint C (P24-P26) IF velocity holds
- [ ] Sprint D begins post-defense (NOT a capstone gate); document in `STATE.md`
- [ ] Update `06-phase-20-mvp-close.md` §9 "Capstone-ready definition" — add bullet: "Sprint B+C may also be sealed pre-defense at current velocity; not gating"

---

## §3 — Per-sprint preflight scaffolding

For Sprints B and C (the immediate next executions):

- [ ] `plans/implementation/phase-21/preflight/01-sprint-b.md` (NEW)
  - [ ] P21 — Natural language input + 2-3 hardcoded templates ("make it brighter", "hide the hero")
  - [ ] P22 — Section targeting via `/hero-1` keyword scoping; LLM scoped to one section
  - [ ] P23 — Intent translation: messy user input → clean structured to-do BEFORE LLM call
  - [ ] DoD checklist for each (initial draft; refined at sprint kickoff)

- [ ] `plans/implementation/phase-21/preflight/02-sprint-c.md` (NEW)
  - [ ] P24 — AISP instruction layer; AISP + human-readable to-do side by side
  - [ ] P25 — Intent pipeline; AISP determines intent + reformats prompt + step-by-step translation surfaced
  - [ ] P26 — 2-step template selection (theme pick AISP-scoped → modify with full chat context)
  - [ ] Cross-reference: `bar181/aisp-open-core` `ai_guide` (the AISP source-of-truth)

- [ ] `plans/implementation/phase-21/sprint-d-onwards.md` (NEW, stub)
  - [ ] Lists Sprints D through K with one-line per phase
  - [ ] Marked "POST-DEFENSE — refine after May 2026 capstone presentation"

---

## §4 — Reality-check estimates

Owner explicitly flagged: estimates are 10-50× too conservative.

- [ ] Audit `06-phase-20-mvp-close.md` Effort note (reads "3-4 days")
  - [ ] Replace with: "**Estimated effort: <1 day at P19 velocity (originally 3-4 days; adjusted post-P19-actuals).**"

- [ ] Audit `phase-20/preflight/01-scope-lock.md` Day 1-7 schedule
  - [ ] Add header note: "Original 7-day schedule reflects pre-P19 budget. At observed velocity (6 phases/day), entire P20 may seal in a single session. Sub-day items can run in parallel."
  - [ ] DO NOT delete the day-by-day; keep as reference / fallback if velocity slips

- [ ] Audit `phase-20/preflight/02-fix-decomposition.md` §F day-by-day mapping
  - [ ] Add the same velocity-reality note at top of §F

- [ ] `CLAUDE.md` — add to "Phase Roadmap" or "Behavioral Rules" section:
  - [ ] "**Effort estimation rule (post-P19):** target multi-hour shifts not multi-day shifts. Original phase budgets observed to be 10-50× conservative. Re-budget at end of each phase."

---

## §5 — Velocity-aware planning

- [ ] Document new estimation rule in `plans/implementation/mvp-plan/STATE.md` as a top-level note
- [ ] If P20 seals same-day as P19, fold P21 (Sprint B Phase 1) preflight into next session start
- [ ] Maintain monotonic test growth: target +5 cases per phase; at velocity, that's +30 cases/day → audit `tests/` doesn't accumulate unmaintained debt
- [ ] Maintain monotonic ADR growth: 1-2 ADRs per phase; current 38; project ~46 by end of Sprint C

---

## §6 — Open questions for phase 21 review

(answered at sprint kickoff, before P21 execution starts)

- [ ] Should Sprint B (P21-P23) start IMMEDIATELY post-P20-seal in same session, or pause for owner sign-off?
  - **Recommended default:** pause for owner sign-off. The post-P20 state is the natural "checkpoint" for capstone-alignment review.
- [ ] At 6-phases-per-day velocity, is the original "+5 cases/phase" test target still right?
  - **Recommended default:** yes — quality discipline is the brake on velocity. Don't loosen.
- [ ] Sprint F (Listen Enhancement, P36-P39) — keep at 4 phases or compress?
  - **Recommended default:** keep at 4 phases. Owner's draft preserves P36-P39 for the enhancement work; intent pipeline + review mode + chat bridge + polish each warrant a phase.
- [ ] Sprint G (Interview Mode P40-P43) — TTS provider choice?
  - **Recommended default:** decide at P40 kickoff. Web Speech API has TTS too; mirror the P19 STT decision.
- [ ] Multi-intent prompt parser (post-MVP per P19 deep-dive C03) — pull into Sprint B P23 (intent translation) or stay deferred?
  - **Recommended default:** stay deferred to post-MVP unless owner directs otherwise. Sprint B P23 handles single-intent translation; multi-intent is architectural.

---

## §7 — Phase-21 close-out

- [ ] All §1-§5 items ticked
- [ ] Owner approves sprint-plan lock-in (single-sentence go/no-go)
- [ ] `STATE.md` runway extended past P20 to reference Sprints B-C
- [ ] `phase-21/MEMORY.md` cross-session anchor written

---

## Cross-references

- `preflight/00-summary.md` — top-priority sprint plan + reconciliation tasks
- `MEMORY.md` — cross-session anchor with sprint-plan state
- `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` — canonical sprint definition
- `plans/implementation/phase-18/strategic-vision.md` — commercial positioning
- `plans/implementation/phase-20/checklist.md` — P20 prerequisite
- `plans/master-backlog.md` — 4-stage backlog cross-check

---

**Total items:** 30+ across §1-§5; all small (≤30 min each at P19 velocity)
**Estimated total effort:** 1-3 hours
**Activation:** post-P20-seal
