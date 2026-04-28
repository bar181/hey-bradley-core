# Phase 21 — Cross-Session Memory Anchor

> **Purpose:** Hydrate a fresh session resuming P21 work without re-reading the entire `plans/` tree.
> **Format:** YAML state blocks + decision log; dense.

---

## STATE: Phase 21 SEALED

```yaml
phase: 21
title: Cleanup + ADR/DDD gap-fill
status: SEALED
seal_commit: 1129cea
composite: 95
activation_gate: Wave-2 swarm reports landed (98d64e5 + 194e3bc)
actual_effort: ~1h (estimated 1-2h)
scope: doc-only (no source code)

deliverables_completed:
  - 5_sealed_phase_folders_archived          # P15-P19 _archive/ subfolders with working files
  - 5_adr_drift_amendments                   # ADR-040/043/044/047/048 "Status as of P20" lines
  - 4_adr_stubs_authored                     # ADR-050/051/052/053 (Proposed)
  - adr_054_ddd_bounded_contexts_full        # Accepted; documents 5 contexts
  - state_md_runway_re-organized             # P21=Cleanup + P22=Website-rebuild inserted
  - claude_md_phase_roadmap_re-organized     # Sprint B/C/D-K shifted +2; F compressed 4→3
  - standard_phase_process_documented        # CLAUDE.md "Standard Phase Process" section
  - attribution_sweep                        # 11 ADRs: "claude-flow swarm" → bar181 only

note: "Earlier draft (sealed at ac5ffde) framed P21 as Sprint B Phase 1 — Simple Chat. Post-Wave-2 ratification (98d64e5 + 194e3bc) re-tasked P21 as Cleanup. Sprint B now starts at P23 per current sequencing. This MEMORY entry was stale until P22 deep-review fix-pass."

phase_alpha_pre_p21_housekeeping:
  - lock_authoritative_sprint_plan      # §1 of checklist (was "Phase 21 §1")
  - reaffirm_capstone_gates             # §2
  - sprint_b_and_c_preflight_scaffolds  # §3
  - reality_check_estimates             # §4
  - velocity_aware_planning             # §5

owner_authoritative_sprint_table:
  source: phase-21/preflight/00-summary.md (sequential, Option A)
  Sprint_A: P18-P20 (P18+P18b+P19 sealed; P20 in flight)
  Sprint_B: P21-P23 (Simple Chat — natural language, templates, section targeting)
  Sprint_C: P24-P26 (AISP Chat — instruction layer, intent pipeline, 2-step template)
  Sprint_D: P27-P31 (Templates + Content)
  Sprint_E: P32-P35 (Clarification & Assumptions)
  Sprint_F: P36-P39 (Listen Mode ENHANCEMENT — base shipped P19)
  Sprint_G: P40-P43 (Interview Mode)
  Sprint_H: P44-P46 (Post-MVP Upload + References)
  Sprint_I: P47-P49 (Builder Enhancement)
  Sprint_J: P50-P52 (Agentic Support System)
  Sprint_K: P53-P55 (Release / OSS RC)
```

## STATE: Pre-P21 history

```yaml
phases_sealed:
  P15: { score: 82, commit: 47b95f6, deliverable: DRAFT/EXPERT modes + UX polish }
  P16: { score: 86, commit: 755a20a, deliverable: sql.js + IndexedDB + 5 typed CRUD repos }
  P17: { score: 88, commit: 8377ab7, deliverable: LLMAdapter + BYOK + husky guard }
  P18: { score: 89, commit: 232dd79, deliverable: Real chat (LLM → JSON patches) }
  P18b: { score: 90, commit: 805b246, deliverable: 5-provider matrix + llm_logs }
  P19: { score: 88, commit: 03e7aa7, deliverable: Web Speech STT + voice→pipeline }

phases_in_flight:
  P20: { plan_doc: 06-phase-20-mvp-close.md, preflight_doc: phase-20/preflight/00-summary.md }
  P20_DoD: 26+2 line items
  P20_blockers: 4 (cost-cap wiring, ADR-047 slot conflict, SECURITY.md missing, scope-lock)

quality_trajectory: [74, 82, 86, 88, 89, 90, 88]
real_llm_cost_to_date: $0
build_gzip: ~700 KB total (599.85 main + 100 KB lazy); budget 800 KB
playwright_targeted: 46/46 active; 63 total Playwright across 29 spec files
adrs: 38 files, highest 048; new ADRs continue at 049+
```

## DECISION LOG: Sequential phase numbering (Option A)

```yaml
decision: phase_21_is_sprint_b_phase_1_simple_chat
owner_directive: "Confirmed. Option A. Sequential numbering, no gaps."
mapping:
  Sprint_B: P21-P23
  Sprint_C: P24-P26
  Sprint_D: P27-P31
  Sprint_E: P32-P35
  Sprint_F: P36-P39
  Sprint_G: P40-P43
  Sprint_H: P44-P46
  Sprint_I: P47-P49
  Sprint_J: P50-P52   # capped (was "P50+" open-ended)
  Sprint_K: P53-P55   # 3 phases (Performance/error / Final persona scoring / Open-core RC)
note: "Phase 21 = Sprint B P21 (Simple Chat). Housekeeping tasks renamed Phase α / pre-P21."
```

## DECISION LOG: Sprint F deviation (P19)

```yaml
decision: pull_listen_mode_from_sprint_F_to_P19
original_phase: P36-P39 (Sprint F)
actual_phase: P19 (single phase)
phase_jump: -17 phases
rationale:
  - strategic_vision.md positions Listen as "the unique differentiator"
  - capstone-presentation surface (May 2026) needed Listen for "virtual whiteboard" demo
  - P17/P18 brutal reviews flagged "without Listen, demo feels like thinner Lovable"
  - original P19 "prompt template library" was partially absorbed by P18 itself
sprint_F_resolution: re-titled to "Listen Mode Enhancement" (NOT pulled-back; P36-P39 preserved for enhancement work)
```

## DECISION LOG: Velocity reality check

```yaml
observation: P15-P19 + P18b sealed in <1 day
original_estimates: 4-6 days per phase
actual_velocity: ~6 phases per day
correction_factor: 10-50x conservative
implication:
  sprints_A_through_C: realistically completable before May 2026 defense
  sprint_D_onwards: post-defense work
  P20: <1 day at velocity (vs 5-7 day estimate)
estimation_rule: "Target multi-hour shifts not multi-day shifts. Re-budget at end of each phase."
```

## OPEN QUESTIONS at P21 kickoff

```yaml
Q1: Sprint B start same session as P20 seal OR pause for owner sign-off?
    default: pause for owner sign-off (post-P20 is natural capstone-alignment checkpoint)

Q2: +5 cases per phase test target still right at 6-phases/day velocity?
    default: yes (quality discipline is the brake)

Q3: Sprint F (Listen Enhancement P36-P39) — keep 4 phases or compress?
    default: keep 4 phases (intent pipeline / review / chat bridge / polish each warrant a phase)

Q4: Sprint G (Interview P40-P43) — TTS provider?
    default: decide at P40 kickoff (Web Speech has TTS too; mirror P19 STT decision)

Q5: Multi-intent parser (P19 carryforward C03) — pull into Sprint B P23 or stay deferred?
    default: stay deferred (Sprint B P23 = single-intent only; multi-intent is architectural)
```

## INDEX: where to find things

```yaml
phase_21:
  preflight:
    summary: plans/implementation/phase-21/preflight/00-summary.md  # TOP PRIORITY draft
    sprint_b: plans/implementation/phase-21/preflight/01-sprint-b.md  # NEW (per checklist §3)
    sprint_c: plans/implementation/phase-21/preflight/02-sprint-c.md  # NEW
  checklist: plans/implementation/phase-21/checklist.md
  memory: plans/implementation/phase-21/MEMORY.md  # this file
  sprint_d_onwards: plans/implementation/phase-21/sprint-d-onwards.md  # NEW (post-defense backlog)

phase_20_carryforward:
  c20_goap: plans/implementation/phase-20/preflight/03-c20-abortsignal-goap.md
  alignment_v1: plans/implementation/phase-20/01-strategic-alignment.md  # §2.2 needs correction per P21 §1
  alignment_report: plans/implementation/phase-20/strategic-alignment-report.md  # written by alignment-agent

phase_18_canonical:
  roadmap_sprints: plans/implementation/phase-18/roadmap-sprints-a-to-h.md  # locked at P21
  strategic_vision: plans/implementation/phase-18/strategic-vision.md  # locked at P21

mvp_plan:
  state: plans/implementation/mvp-plan/STATE.md
  master_checklist: plans/implementation/mvp-plan/08-master-checklist.md
  p20_plan: plans/implementation/mvp-plan/06-phase-20-mvp-close.md

memory_database:
  ruvector_sqlite: .swarm/memory.db (208 KB; tracked)
  hnsw_index: .swarm/hnsw.index (1.5 MB; tracked)
  query_commands: plans/implementation/phase-20/memory-status.md §"Independent SQLite query commands"

claude_md_root: CLAUDE.md (post-doc-audit c73422b — Phase Roadmap shows P15-P19 CLOSED, P20 NEXT)
```

## NEXT ACTION (if resuming)

```yaml
1. Read this file (top to bottom)
2. Verify P20 sealed:
   - check plans/implementation/mvp-plan/STATE.md §1 for P20 row with composite + commit
   - check 08-master-checklist.md P20 section for 100% green
3. If P20 sealed:
   - Execute checklist.md §1-§5 in order
   - Use Edit (not Write) for existing-file modifications
   - Markdown-only; no source code
4. If P20 NOT sealed:
   - First execute phase-20/checklist.md
   - Return here when P20 lands
```

---

**Last updated:** 2026-04-27 (P20 preflight v2 commit `a86b235`).
**Update on:** P21 §1-§5 closure; P20 seal; sprint-plan refinement.
