# A4 — Sprint Plan Updates (applying A2 recommendations)

> Author: coordinator (replacing timed-out swarm agent)
> Source: A2 §M recommendations + user directive (insert 2 NEW phases sequentially before Sprint B)
> HEAD before: `98d64e5`

## Decision: Option A1 sequential insertion

Per A2 §M and user's "Option A sequential, no gaps" directive earlier in the session, the 2 NEW phases insert as **P21 + P22** (between P20 seal and Sprint B):

- **P21** = Cleanup + ADR/DDD gap-fill (A6 plan)
- **P22** = Public website rebuild (A5 plan)
- **Sprint B shifts** P21-P23 → **P23-P25**
- **Sprint C** P24-P26 → **P26-P28**
- **Sprint D** P27-P31 → **P29-P33**
- **Sprint E** P32-P35 → **P34-P37**
- **Sprint F** P36-P39 → **P38-P41** (also COMPRESS to 3 phases per A2 §F: P38-P40)
- **Sprint G** P40-P43 → **P42-P45** (post Sprint F compression to 3 phases: P41-P44)
- **Sprint H** P44-P46 → **P45-P47** (post compressions: P45-P47)
- **Sprint I** P47-P49 → **P48-P50**
- **Sprint J** P50-P52 → **P51-P53**
- **Sprint K** P53-P55 → **P54-P56**

**Total phase count grows from P55 to P56** (Sprint F -1 phase + 2 NEW phases = +1 net).

## Files this update modifies (PLAN — owner-approve before execution)

A4 RECOMMENDS the edits below; the actual mass-Edit pass is the work of the cleanup phase (P21) since it's a doc-only sweep:

1. `CLAUDE.md ## Phase Roadmap` — insert P21=Cleanup + P22=Website-rebuild rows; shift Sprint B P21-P23 → P23-P25; reflect Sprint F compression
2. `plans/implementation/mvp-plan/STATE.md §2` — runway table update (Sprint B/C ranges shifted; Sprint F -1 phase noted; Sprint K range adjusted)
3. `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` — sprint headers + ranges; Sprint F compressed to 3 phases; sprints D-K shifted
4. `plans/implementation/phase-18/strategic-vision.md` — Full Sprint Roadmap table
5. `plans/implementation/phase-21/preflight/00-summary.md` — re-frame from "Sprint B Phase 1 — Simple Chat" to **"Cleanup + ADR/DDD gap-fill"**; demote owner sprint table to "see phase-22/A5/A6"
6. `plans/implementation/phase-21/checklist.md` — replace Sprint-B-coding DoD with Cleanup DoD (per A6 plan §5)
7. `plans/implementation/phase-21/MEMORY.md` — title flip; deliverables YAML
8. `README.md` — Build Phases table; Master Schedule reality-check (4 phases/day still holds; total phase count P56 not P55)

## A4 alternative — DO NOTHING (KEEP current numbering)

A4 considered keeping P21 = Sprint B Phase 1 (current state post `eaa2410`) and labeling the 2 new phases as parallel "Phase α" + "Phase β":

| Pros | Cons |
|---|---|
| No mass-edit pass; preserves recent commits | Loses sequential property the owner explicitly approved (Option A) |
| Sprint B/C ranges intact across 8 docs | Cleanup + website rebuild are not "phases" in the canonical sense |

**Recommendation:** **APPLY Option A1** (mass-edit pass). The user's directive was "Confirmed. Option A. Sequential numbering, no gaps." Inserting P21+P22 honors that more cleanly than parallel-track labels. Sprint F compression is independent and can land same pass.

## A4 — proposed edit sequence (for cleanup phase P21 to execute)

### Edit 1: `phase-21/preflight/00-summary.md`
- Title flip: "Sprint B Phase 1 — Simple Chat" → "Cleanup + ADR/DDD gap-fill"
- Body: replace Sprint-B-coding deliverables with cleanup deliverables (cite A6 plan)
- Keep: owner sprint table; reality-check footer

### Edit 2: `phase-21/checklist.md`
- Replace "Phase 21 coding DoD" section with "Phase 21 cleanup DoD" (cite A6)
- Keep "Phase α housekeeping" content as completed (since this IS now that work)
- DO NOT shift sprint labels in the housekeeping section §1-§5 since those reference phase-18 docs

### Edit 3: `phase-21/MEMORY.md`
```yaml
phase: 21
title: Cleanup + ADR/DDD gap-fill (post-P20-seal)
status: PREFLIGHT
activation_gate: P20 sealed
estimated_effort_at_p19_velocity: 1-2 hours
deliverables:
  - archive_phase_15_to_19_working_files
  - adr_drift_amendments_5_files
  - adr_stubs_4_files (050/051/052/053)
  - adr_054_ddd_bounded_contexts_full
  - doc_accuracy_pass_4_files
sprint_b_now_at: P23-P25
```

### Edit 4: `STATE.md §2 runway`
- Insert P21 row (Cleanup) + P22 row (Website rebuild)
- Shift Sprint B (P21-P23) → (P23-P25); Sprint C → (P26-P28); etc.
- Sprint F annotated: "compress to 3 phases per A2 §F"
- Add row for total phase count change: P55 → P56

### Edit 5: `CLAUDE.md ## Phase Roadmap`
- Add P21 + P22 rows
- Shift P23-P28 rows (Sprint B + C)
- Compress Sprint F note (P38-P40 instead of P38-P41)
- Update P55 → P56 final phase

### Edit 6: `phase-18/roadmap-sprints-a-to-h.md`
- Sprint A: status row (P18+P18b+P19 sealed; P20 in flight)
- **NEW:** Sprint A.5 = Cleanup (P21) + Website rebuild (P22)
- Sprint B: P23-P25 (was P21-P23)
- Sprint C: P26-P28 (was P24-P26)
- Sprint D: P29-P33 (was P27-P31)
- Sprint E: P34-P37 (was P32-P35)
- Sprint F: P38-P40 (was P36-P39; compressed to 3 phases per A2 recommendation)
- Sprint G: P41-P44 (was P40-P43)
- Sprint H: P45-P47 (was P44-P46)
- Sprint I: P48-P50 (was P47-P49)
- Sprint J: P51-P53 (was P50-P52)
- Sprint K: P54-P56 (was P53-P55)

### Edit 7: `phase-18/strategic-vision.md`
- Full Sprint Roadmap table — same shifts as Edit 6
- Sprint F compression noted

### Edit 8: `README.md`
- Build Phases table — insert P21 (Cleanup) + P22 (Website rebuild) rows; shift Sprint B-K
- Master Schedule reality-check — total day count adjusts slightly:
  - Day 1: P20-P22 (MVP + cleanup + website rebuild) — fits at 4 phases/day
  - Day 2: P23-P26 (Sprint B + C start)
  - Day 3: P27-P30 (Sprint C end + D)
  - ... etc.
- Total schedule preserved — capstone defense still Day 10; OSS RC still Day 21

## A4 — Sprint F compression detail

Per A2 §F, Sprint F (Listen Mode Enhancement) compresses from 4 phases (P36-P39 in original numbering) to **3 phases**:

- **P38** — Listen + intent pipeline (P25/P27 reuse) [unchanged role, new number]
- **P39** — Listen review mode (transcript + actions side-by-side) [unchanged role]
- **P40** — Listen polish + advanced error states [absorbs former "chat bridge" since P19 already shipped that]

The dropped phase (former P38 chat-bridge) is documented as "ALREADY DONE in P19" in the cleanup phase's archive notes.

## A4 — risk: where does Sprint K's compression land?

Sprint K (P53-P55 → P54-P56) — A2 recommended TIGHTENING but didn't recommend compression. Recommendation: keep at 3 phases since OSS RC is the major release event:
- **P54** — Performance + error handling
- **P55** — Final persona scoring (delta-only since P20 already scored)
- **P56** — OSS RC tag + announcement

## A4 — handoff to P21 cleanup phase

When P21 (Cleanup) executes per A6 plan, the FIRST track is the 8-file mass-edit pass above. Track A archive work runs in parallel. Track B/C/D follow.

Total cleanup-phase effort with this A4 work folded in: **2-3 hours** (was 1-2 in A6; +1h for the renumbering pass).

## A4 — Files I'd modify (proposed)

8 markdown files (no code, no tests, no source); single commit; push.

Confirmed mapping P20 → P56:
- P20 MVP close
- **P21 Cleanup + ADR/DDD gap-fill (NEW)**
- **P22 Public website rebuild (NEW)**
- P23-P25 Sprint B Simple Chat
- P26-P28 Sprint C AISP Chat
- P29-P33 Sprint D Templates + Content
- P34-P37 Sprint E Clarification & Assumptions
- **P38-P40 Sprint F Listen Mode Enhancement (COMPRESSED to 3)**
- P41-P44 Sprint G Interview Mode
- P45-P47 Sprint H Upload + References
- P48-P50 Sprint I Builder Enhancement
- P51-P53 Sprint J Agentic Support System
- P54-P56 Sprint K Release / OSS RC

---

**Author:** coordinator (replacing timed-out swarm agent A4)
**Output:** `plans/implementation/phase-22/A4-sprint-plan-updates.md`
**Recommendation:** P21 cleanup phase executes the 8-file mass-edit pass per §"proposed edit sequence"
