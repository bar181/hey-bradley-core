# P101 / Reviewer R2 — Planning + Agentics Brutal Review (Lars persona)

**Status:** READ-ONLY review · 1 of 4 parallel reviewers (R1 Whiteboard,
R3 security, R4 architecture+KISS in flight).
**Date:** 2026-05-03.
**Branch:** claude/verify-flywheel-init-qlIBr.
**Scope:** `src/pages/Planning.tsx`, `src/pages/Agentics.tsx`, plus
`src/components/{planning,agentics}/*`. No source touched.

---

## §1 Lars persona profile

Lars is a senior agentic engineer. Daily Claude Code user. Six years of
TypeScript / React; comfortable with TDD London School, DDD bounded
contexts, ADR-driven decisions, and the "spec → tests → impl → seal"
loop. He treats opacity-only hover states as an unfinished affordance,
reads ARIA before he reads pixels, and trusts a tool the moment he
finds the trace of an atom in `chatPipeline.ts`. He is unforgiving of
demoware (sample data hardcoded into a `useState` initializer with no
hint that it is sample data) and forgiving of intentional Tier-2 gaps
when they are documented inline.

**Floor:** ≥88 to call it production-grade.
**Lift levers:** AISP visibility, methodology fidelity, atom-trace
exposure, EOP triplet rendering, token compliance.

---

## §2 Planning mode surfaces (4)

Dimensions scored 1–10: **AV** AISP visibility · **SW** spec workflow ·
**MF** methodology fidelity · **TC** token compliance · **LF** Lars-friendly.

### 2.1 ProcessMapSVG · `src/components/planning/ProcessMapSVG.tsx`
- AV 7 / SW 7 / MF 8 / TC 9 / LF 8 → **7.8 / 10**
- Strong ARIA (`role="img"` line 203, per-node `role="button" tabIndex={0}` lines 122-123, full `aria-label` line 124). Token-pure except documented sealed/deferred literals at lines 63-71 (ADR-117 D4).
- A2 audit fix landed: `fontSize=14 fontWeight=500` lines 145-146.
- Lars dings: no legend strip → status colours unreadable for first-time visitor; no edge-type key (sequential/parallel/gate at lines 167+ visually identical at small zoom).

### 2.2 DomainModelSVG · `src/components/planning/DomainModelSVG.tsx`
- AV 8 / SW 7 / MF 9 / TC 10 / LF 9 → **8.6 / 10**
- 4 relationship kinds (partnership / customer-supplier / conformist / anti-corruption-layer) directly map to Eric Evans canon — Lars approves on sight. `aria-label` line 51, `role="button"` line 49, keyboard parity lines 39-44.
- Strongest SVG. Mild gap: no relationship-kind legend; new viewer must infer dashed=conformist.

### 2.3 PlanningChatBar · `src/components/planning/PlanningChatBar.tsx`
- AV 8 / SW 8 / MF 10 / TC 10 / LF 9 → **9.0 / 10**
- The methodology-fidelity star of Planning. Single submit fires PROCESS_ATOM (line 44), DDD_ATOM (line 58), AGENT_ATOM (line 78) and persists `process_atom_output` + `ddd_atom_output` events (lines 53-63). This is the closure of P101 carry-forward #1+#2 in 80 LOC.
- Lars dings: button label "Decompose" (line 115) is wrong — DECOMP_ATOM lives in `chatPipeline.ts`, not here. Here we run 3 different atoms and persist 2 of them; the verb is misleading.

### 2.4 SpecWorkbench right panel · `src/components/agentics/SpecWorkbench.tsx`
- AV 9 / SW 9 / MF 9 / TC 9 / LF 9 → **9.0 / 10**
- Tabbed Human/AISP/ADR (lines 346-350); SprintChip with hover-lift `hover:-translate-y-0.5 transform` (line 89) post-A2 fix. AISP tab carries Copy CTA `spec-aisp-copy` (line 175). All 3 reviewer CTAs wired in header (lines 322-324: Run KISS Review · Generate Test Spec · Export Claude Code).
- Lars dings: phase-level only — sprint cards in Planning don't scroll-snap, and there's no "open in Agentics" deep-link to round-trip a phase from Planning into the seal flow.

**Planning composite (avg of 4):** (7.8 + 8.6 + 9.0 + 9.0) / 4 = **8.6 / 10 → 86 / 100**.

---

## §3 Agentics mode surfaces (4)

Adds: **MS** 7-step methodology surface clarity · **EOP** EOP triplet
rendering · **AT** atom trace exposure.

### 3.1 Phase tree (left) · `src/pages/Agentics.tsx` lines 99-161
- AV 9 / SW 9 / MF 9 / TC 10 / LF 9 / MS 9 / EOP n/a / AT 7 → **8.9 / 10**
- `aria-pressed` (line 116) + `aria-expanded` (line 117). Mono `P{phase}` prefix (line 124). AISPDeveloperCard mounts at the bottom (line 159) per ADR-110 D4.
- Lars dings: no phase-status pill on the tree row; he has to expand sprints to see status.

### 3.2 ProcessMap (center) · `src/components/planning/ProcessMapSVG.tsx`
- Same component as Planning §2.1; mounted line 168 of Agentics.tsx with sample data. AV 7 / SW 7 / MF 8 / TC 9 / LF 7 / MS 8 / EOP n/a / AT 6 → **7.4 / 10**.
- Lars dings: Agentics center is hardcoded `HEY_BRADLEY_SAMPLE_MAP` (line 169). No live LLM-classified map (Planning has it via `liveMap`; Agentics does not). The mode that should be most production-feeling is the most demoware-feeling.

### 3.3 SpecWorkbench (right) · `src/components/agentics/SpecWorkbench.tsx`
- AV 10 / SW 10 / MF 10 / TC 9 / LF 10 / MS 10 / EOP n/a / AT 9 → **9.7 / 10**.
- All 3 reviewer-loop CTAs land here (lines 322-324). The KISS summary chip (line 245) gives Lars the binary "PASS / FAIL — N P1 / M P2 / K P3" line he wants.

### 3.4 SealPanel · `src/components/agentics/SealPanel.tsx`
- AV 8 / SW 9 / MF 8 / TC 10 / LF 8 / MS 8 / EOP 4 / AT 6 → **7.6 / 10**.
- 3-card grid `grid-cols-1 xl:grid-cols-3` (line 245). `seal-phase-button` lock icon (lines 221-231). KISS-summary inline pill (lines 156-164) reads `extractScores()` regex from postReview body — clever closure with §3.3.
- **Lars-blocking dings (this is the biggest carry-forward in the suite):**
  1. `eop` is hard-wired to `null` from Agentics.tsx line 193 — **the empty state is the only state Lars will ever see at open-core.** Comment on line 188-191 admits "no runtime fetch yet".
  2. `onSeal` prop never wired (Agentics.tsx line 193 omits it) → "Seal Phase" button is a dead button for a Lars demo run.

**Agentics composite (avg of 4):** (8.9 + 7.4 + 9.7 + 7.6) / 4 = **8.4 / 10 → 84 / 100**.

---

## §4 7-step methodology fidelity

| # | Step | Fires from | Status |
|---|------|------------|--------|
| 1 | Research | `Onboarding.tsx` saved-project lookup | OK — outside Planning/Agentics; flagged only because Lars expects the active phase tree to read from `useProjectStore`, not hardcoded `HEY_BRADLEY_SAMPLE_PHASES` (Agentics.tsx line 30) |
| 2 | Decompose | `chatPipeline.ts` line 426 dynamic-import | OK — but invisible from Planning/Agentics; no UI surface fires DECOMP from Planning |
| 3 | Architect | `PlanningChatBar.tsx` line 58, 70 | **Strong** — `classifyContexts(text)` runs with `ddd_atom_output` persisted line 59 |
| 4 | Spec | `PlanningChatBar.tsx` line 44 | **Strong** — `classifyProcess(text)` + `process_atom_output` line 53 |
| 5 | Plan | `PlanningChatBar.tsx` line 78 | **Strong** — `classifyAgents(ctx)` per wave; closes P101 carry-forward #1 |
| 6 | Build | `SpecWorkbench.tsx` line 251 (Generate Test Spec) | OK — emits `<phase>-test-spec.md` blob |
| 7 | Reflect | `SpecWorkbench.tsx` line 234 + `SealPanel.tsx` line 220 | **Partial** — KISS review fires; Seal button has no callback wired |

**End-to-end score:** **86 / 100.** The methodology arc is real and
traceable, but step 1 (research) is hardcoded sample data and step 7
(reflect) has a dead Seal button. Lars would call it a demo, not a
shipping loop.

---

## §5 Lars persona score

- **Planning mode:** 86 / 100
- **Agentics mode:** 84 / 100
- **Composite:** **85 / 100**

Below the ≥88 floor by 3 points. Two surgical fixes (gaps #1 and #2 in
§6) close it.

---

## §6 Honest gaps blocking Lars ≥88

### G1 — SealPanel `eop` is null at runtime [BLOCKER]
- File: `src/pages/Agentics.tsx` line 193
- `<SealPanel phase={activePhase} eop={null} />` — the empty state
  (`SealPanel.tsx` lines 171-182) is the only path users hit.
- Fix: build-time pre-bake reads `plans/implementation/phase-{N}/seal/{02-post-review,session-log,retrospective}.md` via Vite plugin → injects into `HEY_BRADLEY_SAMPLE_PHASES.eop`. ≤80 LOC plugin + 1 prop wire. Lars-impact: +5.

### G2 — `onSeal` prop never wired [BLOCKER]
- File: `src/pages/Agentics.tsx` line 193
- `SealPanel.tsx` line 220 declares the button + line 187 calls `onSeal?.()` — but Agentics never passes the callback. Dead button.
- Fix: pass `onSeal={() => writeLogEvent(... event_type: 'phase_sealed')}` (event type already in migration 005 CHECK enum per ADR-126). 5 LOC. Lars-impact: +2.

### G3 — Agentics center map is hardcoded sample, not classifier output [PARTIAL]
- File: `src/pages/Agentics.tsx` line 169
- `map={{ ...HEY_BRADLEY_SAMPLE_MAP, activeNodeId: selectedNodeId }}` — Agentics has no chat bar; users cannot drive a live map here.
- Fix: hoist `liveMap` from Planning into a Zustand slice (or read-back `process_atom_output` via `getEventsForRequest`) and consume in Agentics center. ~30 LOC. Lars-impact: +3.

### G4 — PlanningChatBar submit label "Decompose" is misleading [LARS-PEDANTIC]
- File: `src/components/planning/PlanningChatBar.tsx` line 115
- Submit fires PROCESS + DDD + AGENT, not DECOMP_ATOM (which lives in `chatPipeline.ts`). Lars reads the verb and expects a different atom.
- Fix: rename to "Plan" or "Spec" (1 LOC). Lars-impact: +0.5.

### G5 — No legend strip on either SVG [PARTIAL]
- Files: `src/components/planning/ProcessMapSVG.tsx` (status fills lines 53-75; edge types line 167+) + `src/components/planning/DomainModelSVG.tsx` (relationship kinds)
- Status colours + edge types are unreadable to a first-time viewer. ADR-117 §6 declared "legend strip" Tier-2 carry-forward, but Lars expects ≥a tooltip cluster.
- Fix: 12-LOC `<Legend>` sub-component pinned bottom-left of viewBox. Lars-impact: +1.

---

## §7 Verdict

**PARTIAL.**

- Planning composite 8.6 / 10 (86 / 100) — passes A2 audit but trails Lars floor by 2.
- Agentics composite 8.4 / 10 (84 / 100) — fails Lars floor by 4. Two blockers (G1 eop=null, G2 onSeal-not-wired) gate the Reflect step.
- Methodology arc is real (7/7 steps trace to a UI surface), but step 1 (Research) is sample data and step 7 (Reflect) has a dead Seal button.

**Specific blockers:**
1. SealPanel renders empty state at runtime (G1; `Agentics.tsx:193`).
2. Seal button has no wired callback (G2; `Agentics.tsx:193`).
3. Agentics center is demoware sample, not classifier output (G3; `Agentics.tsx:169`).

**Recommended fix order (≤120 LOC total):**
- G2 first (5 LOC; closes the "dead button" smell instantly).
- G1 next (Vite plugin ≤80 LOC; build-time EOP pre-bake from disk).
- G3 last (~30 LOC; hoist `liveMap` cross-mode).
- G4 + G5 cosmetic; defer to next polish wave.

**Lars-projected post-fix:** Planning 89 / Agentics 91 / Composite **90 / 100.** Above floor.

---

## §8 Out-of-scope confirmations

- READ-ONLY: zero source files touched.
- No tests touched. No ADRs touched. No `CLAUDE.md` touched.
- This is one of 4 parallel reviewer outputs; R1 (Grandma+Framer on
  Whiteboard), R3 (security), R4 (architecture+KISS) parallel.
- A4 closer Wave 2 owns ADR-131 + master-checklist + retrospective +
  CLAUDE.md sync — not this file.
