# Phase 20 — Strategic Alignment

> **Purpose:** Reconcile what we ACTUALLY shipped through P15-P19 against the original phase-18 strategic plan (`roadmap-sprints-a-to-h.md` + `strategic-vision.md`), so P20 work + the post-MVP roadmap stay anchored.
> **Status:** Reference doc; updated by the Day-5/6 sprint-alignment agent task.
> **Source plans:** `plans/implementation/phase-18/strategic-vision.md` + `roadmap-sprints-a-to-h.md` (drafted at end of P17, locked at P18 kickoff).

---

## 1. Original phase-18 plan — Sprint A through H

> "It's a roadmap saved at the end of P17 to keep us on track through the full P18-P46 arc + post-MVP commercial tiers."

| Sprint | Range | Original goal |
|---|---|---|
| A | P18-20 | Chat Foundation — POC LLM call → JSON merge → preview update |
| B | P21-23 | Simple Chat — natural language; 2-3 templates; section targeting |
| C | P24-26 | AISP Chat — AISP instruction layer; 2-step template selection |
| D | P27-31 | Templates + Content — library + creation; LLM writes the words |
| E | P32-35 | Clarification & Assumptions — ambiguity detection; options picker |
| F | P36-39 | **Listen Mode** — voice → transcript → intent pipeline |
| G | P40-43 | Interview Mode — LLM asks; voice TTS; auto-populate JSON |
| H | P44-46 | Polish + Release Candidate — performance; persona scoring; OSS RC |

(Source: `phase-18/roadmap-sprints-a-to-h.md`. The strategic-vision.md adds Sprint I/J/K post-MVP.)

---

## 2. What we actually shipped

| Phase | Original goal (per phase-18 plan) | Actually shipped | Delta |
|---|---|---|---|
| **P18** | Chat POC (LLM call → JSON merge → preview) | ✅ Real Chat Mode (LLM → JSON Patches), Crystal Atom system prompt, Zod parser, validator, applier, mutex, audit log | **MET** + P18b addendum (5-provider matrix + llm_logs observability) |
| **P18b** | (not in plan) | ✅ Provider Expansion + Observability — 5 LLM adapters (Claude/Gemini/OpenRouter/Simulated/AgentProxy); ruvector deltas D1-D3 in `llm_logs` | **NEW** — addendum slot inserted; closes the brutal-review-flagged gap on real-LLM hardening |
| **P19** | Prompt template library — define every LLM API call type, ADRs written | ⚠️ **Real Listen Mode (Web Speech API)** — Sprint F pulled forward 17 phases | **DEVIATION** — original P19 work deferred to Sprint B/C; Listen mode advanced to satisfy the "voice-first" capstone-demo narrative |
| **P20** | Test mode — hero, articles, show/hide sections end-to-end | Per `06-phase-20-mvp-close.md`: cost-cap pill + Master Acceptance e2e + Vercel deploy + persona reviews + 12 carryforward items | **MET + EXPANDED** — DoD count grew from 14 to 28 to absorb P19 carryforward |

### 2.1 The P19 deviation explained

Why was Listen mode pulled from Sprint F (P36-P39) to P19?

- **Strategic-vision.md positioning** explicitly calls Listen "the unique differentiator." The capstone-presentation surface (May 2026) needed Listen to demo the "virtual whiteboard that draws your ideas as you talk" thesis.
- **Risk-driven sequencing:** brutal-honest reviews in P17/P18 flagged that without Listen, the "chat-first" demo feels like a thinner version of Lovable / AI Studio. Listen was the moat.
- **Prompt template library** (original P19) was partially absorbed by P18 itself — the Crystal Atom system prompt + path-whitelist validator + 5 starter fixtures + ADR-044/045 effectively constituted "every LLM API call type structured + documented."
- **Net result:** Sprint F is now P19 (single phase, not 4); Sprint A's "test mode" became P20; Sprints B-G shift forward 1 phase each.

### 2.2 Sprint sequencing — owner directive (post-P20-preflight-v2)

> **Owner directive:** keep original phase numbering for all Sprints B-K. Re-title Sprint F (P36-P39) to **"Listen Mode Enhancement"** since base Listen shipped in P19. Do NOT shift Sprints B-K by -5 phases; the earlier-proposed re-sequencing table is superseded.

The original phase numbering stands:

| Sprint | Range | Note |
|---|---|---|
| A | P18-P20 | P18/P18b/P19 sealed; P20 in-flight (MVP close) |
| B | P21-P23 | Simple Chat (unchanged) |
| C | P24-P26 | AISP Chat (unchanged) |
| D | P27-P31 | Templates + Content (unchanged) |
| E | P32-P35 | Clarification & Assumptions (unchanged) |
| F | P36-P39 | **Listen Mode Enhancement** (re-titled — base shipped P19; Sprint F now layers P25 integration + review mode + chat bridge + polish on top) |
| G | P40-P43 | Interview Mode (unchanged) |
| H | P44-P46 | Post-MVP Upload + References (unchanged) |
| I | P47-P49 | Builder Enhancement (unchanged) |
| J | P50+ | Agentic Support System (unchanged) |
| K | final | Release (unchanged) |

The earlier "shift -5" recommendation for Sprints B-K is **withdrawn**. Confirming: original phase numbering is canonical. See `phase-21/preflight/00-summary.md` for the authoritative draft.

---

## 3. The 6 strategic open questions — RESOLVED

(`strategic-vision.md` §"Open Strategic Questions for Phase 18 Review")

### Q1. Open-core RC at P46 or earlier?

**Resolved:** **EARLIER** — P19+P20 already cover the chat + listen + AISP + cost-cap + BYOK foundation. Strategic-vision.md original H sprint (P44-46) work folds into P20 (cost-cap + persona scoring + Vercel + RC tag). **Recommended OSS RC tag: end of P20.** Sprint I/J/K become post-MVP commercial work.

### Q2. Tier 2/3 build vs partner?

**Deferred — not blocking MVP.** Tier 1 (open-core SPA) is the MVP. Tier 2/3 partnership (Vercel/Webflow/Framer) is a Q3-2026 owner-decision. **No P20 dependency.**

### Q3. Pricing model?

**Tier 1 (open-core):** BYOK → user pays $0 to project, ~$0.001-0.01 per chat to provider. Hosting cost ~$0 on Vercel hobby tier. **Confirmed.**

**Tier 2 (commercial, post-MVP):** open question — flat subscription vs per-project. **No P20 dependency.**

### Q4. Self-hosting Tier 2?

**Deferred — not blocking MVP.** Tier 1 (the MVP) IS self-hostable by definition (it's a SPA with no backend; clone-and-deploy). Tier 2 self-hosting is a Q3-2026 question.

### Q5. Capstone deadline alignment.

**Resolved:** **May 2026.** Capstone-required surface = P15+P16+P17+P18+P18b+P19+P20 (all sealed by end of P20). Sprints B-K are POST-CAPSTONE and POST-MVP — they can ship in 2026-Q3 or later without affecting the May 2026 panel.

**Capstone-ready definition (per `06-phase-20-mvp-close.md` §9):**
1. Master Acceptance Test green on Vercel
2. Stranger can clone + BYOK + run demo in <5 min
3. Retrospective signed off by owner
4. Post-MVP backlog has ≥9 items listed

P20 closes all 4. ✅

### Q6. AISP open-core licensing.

**Resolved:** AISP at `bar181/aisp-open-core` is owned by the same author (Bradley Ross). License confirmed clear of friction. **No action needed.** Document the cross-link in `BlueprintsTab.tsx` AISP sub-tab (P20 Day 6 — C12).

---

## 4. The 6 phase-18-review open questions — RESOLVED

(`roadmap-sprints-a-to-h.md` §"Open Questions for Phase 18 Review")

### Q1. AISP enforcement timing — P18 or P24?

**Resolved:** **AISP from P18.** `prompts/system.ts` already includes the Crystal Atom in the system prompt; ADR-045 documents this. Decision: AISP wrapper from day one, full AISP intent layer matures in original Sprint C (now P23-25 per re-sequencing).

### Q2. Template-vs-from-scratch boundary.

**Resolved:** **JSON-patches against existing examples ONLY.** `patchValidator.ts` enforces a path whitelist (`patchPaths.ts`); only `add` / `replace` / `remove` ops; no full-section creation from LLM output. ADR-045 codifies this. Confirmed enforced.

### Q3. Listen vs Interview re-sequence.

**Resolved:** **Listen first** (shipped P19); Interview deferred to original Sprint G (now P35-38 per re-sequencing). Rationale: Listen adds the "virtual whiteboard" demo surface; Interview is a pull-the-questions LLM mode that builds on the same transcript pipeline. Listen-first proved the pipeline; Interview will reuse it.

### Q4. Content generation guardrails.

**Deferred to original Sprint D (now P26-30).** Cost-cap + path-whitelist already prevent most footguns; tone/length/factual guardrails are a post-MVP feature. Document in `SECURITY.md` (P20 Day 2): "Content generation is NOT a feature of P20 MVP. Hallucination risk is acknowledged for future Sprint D."

### Q5. Cost cap evolution — per-action caps?

**Resolved for MVP:** **Per-session only.** $1.00 default, user-editable in Settings (P20 Day 1 wires this). Per-action caps (Sprint C 2-step pipelines, Sprint E clarification) are explicitly deferred to original Sprint C/E.

### Q6. Test discipline.

**Resolved:** Test count IS monotonically non-decreasing. Actuals through P19: 102 → 104 → 107 → 113 → 129 → 36/36 targeted → 41/41 → 46/46 (after P19 fix-pass-2). P20 projected: +14-19 (cost-cap×4, abort×1, mvp-e2e×10, image×8, help×1, sentinel×1, import-lock×1) → **65+ targeted post-P20**.

---

## 5. Strategic moat through MVP — what sticks

Per `strategic-vision.md` §"The Moat (Unique Architecture)":

| Moat element | Status | Evidence |
|---|---|---|
| **JSON as foundational layer** | ✅ shipped P11+ | `MasterConfig` + Zod parser + applyPatches |
| **AISP for precision** | ✅ shipped P18 | Crystal Atom in `prompts/system.ts`; ADR-045 |
| **Multi-step LLM pipeline** | 🟡 partial | Single-step intent today; multi-step deferred to Sprint C (post-MVP) |
| **Specs for humans** | ✅ shipped P15+ | Blueprints tab; AISP sub-tab refresh in P20 |
| **Listen mode** | ✅ shipped P19 | Web Speech STT; voice→chat-pipeline fan-in; ADR-048 |

**4 of 5 moat elements are shipped.** The 5th (multi-step pipeline) is post-MVP per the re-sequenced Sprint C. **The MVP is true to the strategic-vision moat thesis.**

---

## 6. P20-P46 alignment recap (for the Day-5/6 agent task)

The Day-5/6 sprint-alignment agent updates these documents:

1. **`plans/implementation/phase-18/roadmap-sprints-a-to-h.md`** — adds P15-P19 actuals + scores; flags P19 deviation; reflects re-sequencing per §2.2
2. **`plans/implementation/phase-18/strategic-vision.md`** — resolves 6 strategic open questions per §3 of this doc; adds RESOLVED tags
3. **`plans/implementation/phase-20/strategic-alignment-report.md`** (NEW) — agent's summary of changes made
4. **`plans/implementation/mvp-plan/STATE.md`** §2 — extends runway beyond P20 to flag re-sequenced Sprint B and Sprint G post-MVP

This work is one agent task, ~1 hour, on Day 5 or Day 6 of P20.

---

## 7. Capstone-presentation alignment

| Capstone gate | P20 deliverable | Status |
|---|---|---|
| "Tell Bradley what you want; he builds it" demo | Vercel preview URL + getting-started.md | Day 4 |
| Listen mode visible during demo | P19-shipped + ListenTab split (C04) | Day 5 |
| AISP visible in UI (not just system prompt) | C12 — Blueprints AISP sub-tab refresh | Day 6 |
| Cost cap demonstrable | CostPill in shell footer | Day 1 |
| BYOK + provider matrix | LLMSettings panel + SECURITY.md | Day 2 |
| 3 personas all hitting target | Day 6 reviews | Day 6 |
| OSS RC tag | Final tag at end of Day 7 | Day 7 |

Every gate has a P20 day pinned. Capstone defense in May 2026 sees a fully-sealed MVP at P20-tag.

---

## 8. Remember the original mission

From `strategic-vision.md` line 11:

> **"The virtual whiteboard that drafts your ideas and delivers enterprise-grade specs for your AI coding system."**

P20 closes the **POC → MVP gate**. Sprints B-K are how the MVP becomes a commercial product. Don't lose the thread.

---

**Author:** synthesized from `phase-18/strategic-vision.md`, `phase-18/roadmap-sprints-a-to-h.md`, plus the P19 deep-dive carryforward analysis.
**Pending action:** Day-5/6 agent task to physically update the phase-18 docs with these resolutions.
