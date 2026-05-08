# Phase Plan — Folder + Scaffolding Cleanup + ADR/DDD Gap Fill

> **Slot:** Inserts as **P21** in sequential Option A (between P20 seal and Sprint B start; shifts Sprint B from P21-P23 → P23-P25).
> **Effort:** 1-2 hours @ velocity.
> **Persona gate:** none (housekeeping; no UX surface change).
> **ADRs:** ADR-049b (numbering convention reaffirm) + ADR-054 (DDD bounded-context audit).
> **Source:** A1 capability audit + user directive: "archiving all phase level files except the logs, preflight, and end of phase results / retrospective. this phase in parallel should review all the adr and ddd files and identify any gaps, create and enhance all adr and ddd files based on the current state."

## North Star

> **A future contributor reading the `plans/implementation/` tree finds only the durable artifacts (logs + preflight + retros + end-of-phase results) for sealed phases, with working files archived to a clearly-marked subfolder. Every ADR is up-to-date with code reality, every DDD bounded context is documented, and the 11 numbering holes have a one-line explanation each.**

## 1. Specification (S)

### 1.1 Scope IN

**Track A — Folder + scaffolding archive:**
- For each sealed phase (P11 through P20), classify files into KEEP vs ARCHIVE
- Move ARCHIVE files to `plans/implementation/phase-N/_archive/` subfolder
- KEEP set per phase: `session-log.md`, `retrospective.md` (if exists), preflight docs, end-of-phase results (per-phase composite + DoD ticks)
- ARCHIVE set per phase: working drafts, fix-pass scratchpads, reviewer-output files (already in `_archive` for some phases), intermediate planning notes, deep-dive chunks for phases beyond P19 (P19 keeps deep-dive — capstone-relevant)

**Track B — ADR review + gap fill (parallel to Track A):**
- Read all 38 ADRs; cross-reference against current code
- For each capability that lacks an ADR (per A1 §F), author one
- For each ADR that drifted from code, append a "**Status as of P20:**" line at top
- Document the 11 numbering holes in `docs/adr/README.md` (already documented post-c73422b — verify)

**Track C — DDD bounded-context audit:**
- Audit `src/contexts/` directory tree (intelligence, persistence, specification, configuration)
- Author ADR-054 — DDD Bounded Contexts (formalize the de-facto context map)
- Flag any cross-context coupling concerns (e.g., Intelligence importing Persistence repos directly; A1 §F flagged this)

**Track D — Doc final-accuracy pass:**
- `CLAUDE.md ## Project Status` — verify counts match A1 audit (38 ADRs, 17 examples, 16 sections, 300 media, etc.)
- `README.md` — verify Build Phases table reflects P15-P20 sealed; Master Schedule still accurate
- `STATE.md` — verify all phase rows + runway match reality
- `08-master-checklist.md` — verify roll-up totals (DoD / ADRs / tests)

### 1.2 Scope OUT

- Code refactors (Welcome.tsx 918 LOC split → post-MVP)
- ADR amendment for Intelligence→Persistence service-facade (C05 → post-MVP)
- Test infrastructure changes (vitest migration → post-MVP)
- Any source-code modification

### 1.3 Archive structure

```
plans/implementation/
├── phase-15/
│   ├── _archive/               # NEW — working drafts archived here
│   ├── session-log.md          # KEEP
│   ├── retrospective.md        # KEEP (if exists)
│   ├── preflight.md            # KEEP (if exists)
│   └── end-of-phase-result.md  # KEEP (composite + DoD)
├── phase-16/
│   └── (same shape)
├── ...
├── phase-19/
│   ├── _archive/               # NEW
│   ├── deep-dive/              # KEEP — capstone-relevant 6-chunk brutal review
│   ├── session-log.md          # KEEP
│   └── ...
├── phase-20/                   # active phase — no archive yet
├── phase-21/                   # NEW — cleanup phase (this plan)
├── phase-22/                   # NEW — website rebuild (A5 plan)
├── ...
```

### 1.4 ADR gaps to fill

Per A1 §F:
- ADR-049 — Cost-cap telemetry (P20 Day 1 deliverable; this phase verifies it landed)
- ADR-049b — Numbering convention (already in `docs/adr/README.md`; promote to formal ADR if the README isn't sufficient)
- ADR-050 — Template registry (Sprint B P21 — but the SHIFTED P23 in new sequencing); STUB only here
- ADR-051 — Intent translator (Sprint B P23 → P25); STUB only here
- ADR-052 — AISP intent classifier (Sprint C P24 → P26); STUB only here
- ADR-053 — Public site IA (P22 → website rebuild); STUB only here
- ADR-054 — DDD bounded contexts; AUTHOR FULLY in this phase

ADR-amendments (drift fixes):
- ADR-040 (local SQLite persistence) — append "**Status as of P20:** retention 30-day live in `db.ts:initDB`; SENSITIVE_TABLE_OPS registry covers `byok_*`, `llm_logs`, `example_prompt_runs`."
- ADR-043 (BYOK trust boundaries) — append "**Status as of P20:** SECURITY.md authored P20 Day 2 (cross-link); DEV-mode key warn shipped P19 fix-pass-2 F6."
- ADR-045 (chat patch validator) — append "**Status as of P20:** `url(`/`@import` blocked + `imageUrl` allow-listed (P19 F3); site-context interpolation sanitize (P19 F4)."
- ADR-047 (llm logging) — append "**Status as of P20:** ruvector deltas D1-D3 shipped P18b; 30-day retention live; `mapChatError` 4 kinds + `mapListenError` 6 kinds."
- ADR-048 (STT Web Speech) — append "**Status as of P20:** Listen voice→chat-pipeline fan-in shipped P19; 6 STT error kinds mapped; PTT + privacy disclosure + via-voice pill all live."

### 1.5 DDD audit deliverable (ADR-054 outline)

```
ADR-054 — DDD Bounded Contexts (post-P20)

Contexts:
1. Configuration   (src/store/configStore.ts + lib/schemas/masterConfig.ts)
2. Persistence     (src/contexts/persistence/{db,migrations,repositories,exportImport})
3. Intelligence    (src/contexts/intelligence/{llm,prompts,chatPipeline,stt})
4. Specification   (implicit; system-prompt-driven via Crystal Atom + Blueprints)
5. UI Shell        (src/components/{shell,left-panel,center-canvas,right-panel,settings})

Cross-context coupling (de-facto today):
- Intelligence ↔ Persistence: direct repo imports (auditedComplete imports llmCalls/llmLogs/sessions)
- Intelligence ↔ Configuration: `useConfigStore.getState()` calls
- UI ↔ Intelligence: store subscriptions only (clean)

Documented decision:
- Intelligence→Persistence direct imports ACCEPTED for MVP scope.
- Future-work: introduce LLMAuditService facade (post-MVP) per A1 §F C05.
```

## 2. Pseudocode (P)

```
for each sealed phase P in [P11..P20]:
  identify_files(P) -> {keep, archive}
  mkdir P/_archive (if absent)
  for f in archive: git mv f P/_archive/f
  verify keep_set is intact (session-log + preflight + retro + end-of-phase result)

for each ADR in docs/adr/:
  cross_check_against_code()
  if drifted: append "Status as of P20" line
  if missing capability covered: STUB ADR with title + status='Proposed'

author_ADR_054(DDD bounded contexts)
verify CLAUDE.md + README.md + STATE.md + 08-master-checklist.md counts

commit + push
```

## 3. Architecture (A)

No code changes. Markdown + git mv only.

### 3.1 Files added

- `docs/adr/ADR-049-cost-cap-telemetry.md` — VERIFY (authored P20 Day 1)
- `docs/adr/ADR-050-template-registry.md` — STUB (Status: Proposed; full content in P23)
- `docs/adr/ADR-051-intent-translator.md` — STUB
- `docs/adr/ADR-052-aisp-intent-classifier.md` — STUB
- `docs/adr/ADR-053-public-site-ia.md` — STUB (full content in P22 website rebuild)
- `docs/adr/ADR-054-ddd-bounded-contexts.md` — FULL AUTHOR
- `plans/implementation/phase-{15,16,17,18,19,20}/_archive/.gitkeep` — placeholder

### 3.2 Files moved (per phase, indicative)

The exact archive set is determined by reading each phase folder. KEEP guards prevent over-archiving.

## 4. Refinement (R)

### 4.1 Checkpoints

- **A — Phase folders classified.** Each P11-P20 has KEEP-set verified
- **B — Archives created.** `_archive/` exists per phase with moved working files
- **C — ADR drift fixes.** 5 ADRs (040, 043, 045, 047, 048) have "Status as of P20" lines
- **D — ADR stubs authored.** 4 stubs (050, 051, 052, 053) exist as placeholders
- **E — ADR-054 full author.** DDD bounded-context map documented
- **F — Doc accuracy pass.** CLAUDE.md / README / STATE / master-checklist all match A1 truth-source

### 4.2 Intentionally deferred

- Code-side bounded-context refactor (post-MVP)
- vitest migration (post-MVP)
- Welcome.tsx LOC split (post-MVP)

## 5. Completion (C) — DoD Checklist

- [ ] `_archive/` subfolder exists in each of phase-15, 16, 17, 18, 19
- [ ] phase-20 has no `_archive/` yet (still active)
- [ ] KEEP files verified per phase (session-log + preflight + retro + end-of-phase result)
- [ ] ADR-040, 043, 045, 047, 048 each have "**Status as of P20:**" amendment line
- [ ] ADR-049 verified (authored P20 Day 1)
- [ ] ADR-050, 051, 052, 053 STUBS exist (status Proposed)
- [ ] ADR-054 (DDD bounded contexts) fully authored
- [ ] `docs/adr/README.md` numbering-holes section verified accurate (11 holes documented)
- [ ] `CLAUDE.md ## Project Status` counts match A1 audit
- [ ] `README.md` Build Phases table reflects P15-P20 sealed
- [ ] `STATE.md` runway accurate
- [ ] `08-master-checklist.md` roll-up totals match per-phase sums
- [ ] No source-code changes
- [ ] `git status --short` is clean post-commit
- [ ] Push to origin

## 6. GOAP Plan

### 6.1 Optimal plan (cost ~1.5h @ velocity)

```
1. Inventory each phase folder, build KEEP/ARCHIVE classification    [20m]
2. git mv working files to _archive/ per phase                       [15m]
3. ADR drift fixes (5 amendments)                                    [20m]
4. ADR stubs (4 placeholders)                                        [15m]
5. ADR-054 full author (DDD bounded contexts)                        [25m]
6. Doc-accuracy pass (CLAUDE / README / STATE / master-checklist)    [15m]
7. Commit + push                                                     [5m]
```

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Archive misclassification (over-archiving) | M | Conservative defaults: when in doubt, KEEP. Re-audit at end |
| Git history loss on `git mv` | L | `git mv` preserves history; sanity-check with `git log --follow` |
| ADR stubs become stale | M | Mark all stubs "Status: Proposed"; per-sprint ADR fill is the dependent phase's job |
| Doc-accuracy pass surfaces deeper drift | L | If found, defer to A4 sprint-plan-update phase |

## 8. Success criteria

- 5 phase folders (P15-P19) have `_archive/` subfolder; P20 active
- 38 ADRs verified or amended with status lines
- ADR-054 DDD bounded contexts authored
- Truth-source docs (CLAUDE.md, README.md, STATE.md, 08-master-checklist.md) all match A1 audit numbers
- Single commit; push successful

## 9. Cross-references

- A1 capability audit (`phase-22/wave-1/A1-capability-audit.md`)
- A2 sprint plan review (recommends this phase + website rebuild as 2 NEW slots)
- A4 sprint-plan updates (companion deliverable; updates phase-21+/checklist + roadmap-sprints)
- `docs/adr/README.md` (post `c73422b` doc audit)

---

**Author:** coordinator (replacing timed-out swarm agent A6)
**Output:** `plans/implementation/phase-22/A6-cleanup-plan.md`
**Activates:** immediately post-P20 seal (this phase = P21 in sequential Option A)
