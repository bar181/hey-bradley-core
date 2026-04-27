# Phase 20 — Strategic Alignment Report

> **Author:** sprint-alignment agent task (per `phase-21/preflight/00-summary.md` §1).
> **Date:** 2026-04-27.
> **Branch:** `claude/verify-flywheel-init-qlIBr` (HEAD `a86b235`).
> **Status:** Edits staged for coordinator commit. Markdown-only. No source changes.

---

## 1. Summary of edits

| File | Change | Lines (post-edit) |
|---|---|---|
| `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` | Added "Actuals through P19" section (P15-P20 table + P19 deviation note + velocity reality-check). | ~12-30 |
| `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` | Re-wrote Sprint A (P18-P20) bullets: P18 ✅ Sealed, **added P18b row**, P19 ✅ Sealed Listen, P20 🔄 In Flight. | ~32-37 |
| `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` | Re-titled Sprint F → **"Listen Mode Enhancement"** with 4 enhancement-scoped phase descriptions (P36 intent integration, P37 review mode, P38 chat bridge, P39 polish). Original phase numbering preserved. | ~68-76 |
| `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` | Appended `**RESOLVED**` tags to all 6 "Open Questions for Phase 18 Review" with one-line resolutions. | ~118-123 |
| `plans/implementation/phase-18/strategic-vision.md` | Updated "Full Sprint Roadmap" table: Sprint A row notes P19 Listen sealing; Sprint F re-titled to "Listen Mode Enhancement". Sprints B/C/D/E/G/H/I/J/K unchanged. | ~119-129 |
| `plans/implementation/phase-18/strategic-vision.md` | Appended `**RESOLVED**` tags to all 6 "Open Strategic Questions for Phase 18 Review" (OSS RC at end-of-P20; Tier 2/3 deferred; BYOK confirmed; self-hosting deferred; May 2026 capstone; AISP licensing clear). | ~143-148 |
| `plans/implementation/phase-20/01-strategic-alignment.md` | Replaced §2.2 "Re-sequenced sprints (recommend)" -5-shift table with owner-directive note. Original phase numbering re-confirmed for Sprints B-K. Sprint F retitled. | ~46-66 |

---

## 2. Owner authoritative plan reflected

The authoritative post-P18 sprint plan in `plans/implementation/phase-21/preflight/00-summary.md` §"TOP PRIORITY" is now reflected in the canonical roadmap docs:

- **Sprint A (P18-P20):** P18 ✅ / P18b ✅ / P19 ✅ Listen / P20 🔄 — matches owner table.
- **Sprints B/C/D/E/G/H/I/J/K:** unchanged phase numbering.
- **Sprint F (P36-P39):** retitled to "Listen Mode Enhancement"; 4 enhancement-scoped milestones (intent pipeline / review / chat bridge / polish).
- **Re-sequencing rollback:** the earlier P20-preflight-v2 §2.2 -5-phase shift is explicitly withdrawn in favor of original numbering.

The 12 open questions across both phase-18 docs (6 in `roadmap-sprints-a-to-h.md` + 6 in `strategic-vision.md`) now carry RESOLVED tags with one-line answers grounded in actual P15-P19 outcomes.

---

## 3. Velocity reality-check (carried through)

**P15-P19 + P18b — 6 phases sealed in <1 day. Time estimates have been consistently 10-50× too conservative.** All Sprint A-K projections now read against this velocity, not the original 4-6-day-per-phase budgets. Documented at the top of `roadmap-sprints-a-to-h.md`.

---

## 4. Capstone-readiness gates

Per `06-phase-20-mvp-close.md` §9 — all 4 gates remain on track:

| Gate | Status | Notes |
|---|---|---|
| Master Acceptance Test green on Vercel | On track | P20 Day 4 deploy + Day 5 Master e2e |
| Stranger can clone + BYOK + run demo in <5 min | On track | `getting-started.md` + 5-provider matrix shipped P18b |
| Retrospective signed off by owner | On track | P20 Day 7 deliverable |
| Post-MVP backlog ≥9 items | On track | 20 P19 carryforward + 34 deferred-features = 54 listed |

**Capstone-presentation surface = sealed P15-P20.** If velocity holds (6 phases/day), Sprints B and C (P21-P26) are also realistically completable before the May 2026 defense without sliding the capstone gate.

---

## 5. `master-backlog.md` Stage 3 cross-check (read-only flag, no edits)

Stage-3 LLM-MVP rows (S3-01 through S3-08) were written before P15-P19 shipped. Several are now covered by sealed work:

| # | Item | Status against P15-P19 actuals |
|---|---|---|
| S3-01 | Chat → Claude API → JSON patches | ✅ **Covered by P18** (real chat pipeline; Crystal Atom; applier) |
| S3-02 | Listen → STT → Claude → JSON patches | ✅ **Covered by P19** (Web Speech API instead of Whisper, but the pipeline is shipped) |
| S3-03 | AISP in system prompts | ✅ **Covered by P18** (Crystal Atom in `prompts/system.ts`; ADR-045) |
| S3-04 | Context-aware responses | ✅ **Covered by P18** (project JSON included in pipeline context) |
| S3-05 | Image selection via AI | ⏳ **Deferred** — falls in Sprint D content-generation work (P27-31) |
| S3-06 | Copy suggestion engine | ⏳ **Deferred** — Sprint D (P29-30) |
| S3-07 | Error handling (API fallback, rate limit, retry) | 🟡 **Partial** — provider-rotation shipped P18b; per-action retry/cost-cap due P20 |
| S3-08 | Streaming responses with typewriter | ⏳ **Deferred** — UI polish, not currently scheduled; candidate for Sprint F P39 polish |

**Recommendation (for owner, no doc change yet):** retire S3-01/02/03/04 from Stage-3 (mark DONE with phase pointers); keep S3-05/06 in Sprint D backlog; keep S3-07 with P20 carryforward note; keep S3-08 as Sprint F P39 candidate. Owner decides whether to mutate `master-backlog.md` or leave as historical artifact.

---

## 6. Open questions surfaced during alignment

1. **Sprint B P21 absorption.** The owner's Sprint B P21 ("Natural language input + 2-3 real templates") effectively replaces the originally-planned P19 "Prompt template library" work (which was absorbed into P18). Should P21 explicitly absorb the unfinished pieces of original-P19 (prompt-template ADRs per LLM call type), or has P18+P18b already covered that?
2. **Sprint F single-phase compression.** `phase-21/preflight/00-summary.md` §5 raises this directly: "keep Sprint F at P36-P39 even though base is shipped, OR compress to a single phase?" Resolution belongs to phase-21 review, not this report — flagging here for visibility.
3. **`master-backlog.md` Stage-3 mutation.** Per §5 above — does the owner want Stage-3 historicalized (mark items DONE-via-phase-pointer) or kept as-is? Recommendation: mutate after P20 seal so the backlog stays canonical for Sprint B planning.
4. **Phase numbering for Sprint H "Polish + RC" originally at P44-P46.** Owner draft has Sprint H = "Post-MVP Upload + References" (different scope than original). The original H "RC" milestone effectively folds into P20 (per Q1 resolution above). Strategic-vision.md table now reflects the new Sprint H scope; cross-check that the OSS RC tag at end-of-P20 doesn't leave Sprint K orphaned.

---

## 7. Files NOT modified (per task scope)

- `plans/master-backlog.md` — read-only cross-check only; mutations deferred to owner per §5.
- `plans/implementation/mvp-plan/STATE.md` — out of scope for this task (was listed in `01-strategic-alignment.md` §6 as a future deliverable, but task scope explicitly limits to the 5 listed files).
- All source files (`src/**`, `tests/**`, ADRs).

---

## 8. Coordinator handoff

- Edits are staged in working tree; **NOT committed**, **NOT pushed**.
- Run `git diff --stat plans/` to confirm scope before committing.
- Suggested commit message: `docs(phase-18,20): align strategic docs with authoritative post-P19 sprint plan`.

---

**End of report.**
