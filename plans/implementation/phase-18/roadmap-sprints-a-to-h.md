# Phase 18+ — Full Chat & Intelligence Roadmap

> **Status:** DRAFT (planning artifact saved at end of Phase 17 for review at the start of Phase 18).
> **Authority:** Discussion document. Will be re-reviewed and refined at Phase 18 kickoff before any execution.
> **Saved:** 2026-04-27 by direction of the project owner.
> **Scope:** Sprints A through H — Chat foundation through Open-Source Release Candidate.
> **Companion:** `strategic-vision.md` (the architectural / commercial-positioning view).

---

## Actuals through P19

> **Velocity reality-check (owner, post-P19):** *"P15-P19 + P18b — 6 phases sealed in under one day. Time estimates have been consistently 10-50× too conservative."* All Sprint A-K projections in this doc should be read against this velocity, not the original 4-6-day-per-phase budgets.

| Phase | Composite | Delivered | vs. original plan |
|---|---|---|---|
| P15 | 82 | DRAFT/EXPERT modes, UX polish | (pre-Sprint-A) |
| P16 | 86 | Local SQLite persistence (sql.js + IndexedDB) | (pre-Sprint-A) |
| P17 | 88 | LLM provider abstraction + BYOK scaffold | (pre-Sprint-A) |
| P18 | 89 | Real chat pipeline — Crystal Atom system prompt, JSON patches, applier | ✅ matches Sprint A P18 |
| P18b | 90 | 5-provider matrix + `llm_logs` observability | NEW addendum (not in original plan) |
| P19 | 88 | Real Listen mode (Web Speech API, voice→pipeline fan-in) | **DEVIATION** — original P19 = "Prompt template library" |
| P20 | in-flight | MVP close — cost-cap, SECURITY.md, Vercel, personas + 20 P19 carryforward | matches Sprint A P20 (expanded scope) |

**P19 deviation:** the originally-planned "Prompt template library" was effectively absorbed into P18 (Crystal Atom system prompt + path-whitelist validator + 5 starter fixtures + ADR-044/045). P19 instead pulled Sprint F's Listen mode forward to harden the "virtual whiteboard" capstone-demo thesis. See `plans/implementation/phase-20/01-strategic-alignment.md` §2.1.

---

## Sprint A — Chat Foundation (P18-P20)

- **P18:** ✅ Sealed — Chat POC: LLM call works, returns JSON, merges with project JSON, preview + specs update live. (Composite 89.)
- **P18b:** ✅ Sealed — Provider Expansion + Observability: 5-adapter matrix (Claude/Gemini/OpenRouter/Simulated/AgentProxy) + `llm_logs` ruvector deltas. (Composite 90.)
- **P19:** ✅ Sealed Listen mode (Web Speech API) — voice → transcript → existing chat pipeline. Sprint F pulled forward. (Composite 88.)
- **P20:** 🔄 In Flight — MVP close: cost-cap pill + Master Acceptance e2e + Vercel deploy + persona reviews + 20 P19 carryforward items.

## Sprint B — Simple Chat (P21-P23)

- **P21:** Basic chat UX — user types naturally, 2–3 hardcoded templates respond correctly (e.g. "make it brighter", "hide the hero").
- **P22:** Section targeting — `/hero-1` keyword scoping, LLM knows to change one section vs whole site.
- **P23:** Intent translation — messy user input → clean structured to-do before any LLM call fires.

## Sprint C — AISP Chat (P24-P26)

- **P24:** AISP instruction layer — LLM calls written in AISP spec format, returns AISP + human-readable to-do list side by side.
- **P25:** Intent pipeline — AISP determines intent, reformats messy prompt into structured spec, shows human the translation step-by-step.
- **P26:** 2-step template selection — first LLM call selects best matching theme (AISP-scoped), second LLM call modifies based on full chat context.

## Sprint D — Templates + Content (P27-P31)

- **P27:** Template library — build, store, retrieve templates; user can browse + apply.
- **P28:** Template creation — generate new templates from conversation context.
- **P29:** Content generation POC — user says "write my hero section", LLM generates actual words (headline, subhead, CTA copy) not just structure changes.
- **P30:** Content pipeline — generate content for all section types (articles, team bios, testimonials, CTAs). Style-aware (matches site tone).
- **P31:** Content + template bridge — generated content auto-slots into correct template fields.

## Sprint E — Clarification & Assumptions (P32-P35)

- **P32:** Assumptions engine — when intent is ambiguous, LLM generates assumptions list + confidence score. Shows user: *"You said brighter — I selected Theme 123, assuming warm tones. Is this right?"*
- **P33:** Clarification UX — define and build the interaction pattern. Three modes considered:
  - Click options (LLM offers 3 visual choices)
  - Inline text confirm ("change X to Y — confirm?")
  - Free-form correction ("no, I meant cooler tones")
  Swarm to prototype all 3, persona-test, pick winner.
- **P34:** Options picker — visual theme/variant selector surfaced mid-chat. User clicks, preview updates instantly, chat continues.
- **P35:** Assumption persistence — accepted assumptions saved to project context so LLM doesn't re-ask same questions.

## Sprint F — Listen Mode **Enhancement** (P36-P39)

> **Note (post-P19):** Base Listen mode shipped in P19 (Web Speech API, voice→pipeline fan-in). Original phase numbering preserved per owner directive (no -5 shift). Sprint F is now scoped as **enhancements on top of the shipped P19 baseline**.

- **P36:** Listen + intent pipeline integration — wire shipped Listen mode into the P25 intent pipeline so spoken input flows through AISP intent extraction (reuses P25 work, not a re-build).
- **P37:** Listen review mode — transcript + extracted actions surfaced side-by-side; user approves/edits before LLM fires.
- **P38:** Listen + chat bridge — voice and text routed through unified intent pipeline; conversation history shared across modes.
- **P39:** Listen polish + advanced error states — silent-mic detection, partial-transcript recovery, provider-rotation on STT failure, accessibility passes.

## Sprint G — Interview Mode (P40-P43)

- **P40:** Interview mode POC — LLM asks the user questions via text to build site context (name, purpose, audience, tone).
- **P41:** Interview voice — LLM speaks questions aloud using TTS, user responds via mic, full voice conversation loop.
- **P42:** Interview → project — completed interview auto-populates project JSON (sections, content, theme choices).
- **P43:** Interview + assumptions bridge — interview answers feed assumptions engine (P35), reducing clarification prompts during normal chat.

## Sprint H — Post-MVP Upload + References (P44-P46)

> **Note:** Original H scope ("Polish + Release Candidate") moved to Sprint K (P53-P55) per owner authoritative sprint table. H is now Post-MVP Upload + References.

- **P44:** Style guide + brand voice upload.
- **P45:** Reference codebase ingestion.
- **P46:** Google site builder bridge.

## Sprint I — Builder Enhancement (P47-P49)

- **P47:** UX improvements based on user feedback.
- **P48:** Best practices from existing builders.
- **P49:** Areas-for-improvement surfaced post-MVP.

## Sprint J — Agentic Support System (P50-P52)

> **Note:** Previously listed as "P50+" open-ended; owner now caps at P50-P52.

- **P50:** Existing codebase analysis tool.
- **P51:** Hard architecture problem solver.
- **P52:** Multi-level agentic engineer support.

## Sprint K — Release / Open-core RC (P53-P55)

> **Note:** Previously listed as "K — final" (no range). Owner now sets 3 phases P53-P55.

- **P53:** Performance + error handling — loading states, graceful LLM failures, retry logic, cost guard rails.
- **P54:** Final persona scoring pass — Grandma, Framer, Capstone re-scored against full feature set.
- **P55:** Open-core RC — public repo cleanup, README, CLAUDE.md final, license, contribution guide.

---

## The Full Arc

| Range | Phase Goal |
|---|---|
| **P18-20** | It works (POC) |
| **P21-23** | Humans use it naturally (simple chat) |
| **P24-26** | AISP makes it precise + transparent |
| **P27-31** | Templates + content generation |
| **P32-35** | LLM asks questions, shows its work |
| **P36-39** | Voice input + listen mode (enhancement on shipped P19 base) |
| **P40-43** | Interview mode (LLM leads the conversation) |
| **P44-46** | Post-MVP Upload + References |
| **P47-49** | Builder Enhancement |
| **P50-52** | Agentic Support System |
| **P53-55** | Ship it (Open-core RC) |

---

## Swarm Notes for Later Sprints

- **Sprint E UX decision (P33)** is the highest-risk unknown — prototype-first, no premature commitment.
- **Sprint G voice (P41)** depends on TTS provider choice — add to P17 ADR-042 as a future consideration during P19 prompt-template review.
- **Content generation (P29-30)** should reuse AISP intent layer from P25 — same pipeline, different output type.
- **Listen + Interview** are separate UX modes but share the same `transcript → intent → action` pipeline.

---

## Open Questions for Phase 18 Review

These are explicit decision points the owner should re-review at the start of Phase 18, before this roadmap is locked.

1. **AISP enforcement timing.** Plan above introduces AISP at P24. Should P18-P23 already use a thin AISP wrapper in the system prompt, even if responses are plain JSON, to set the precedent? Or is the "JSON-only POC first, AISP later" sequencing intentional? — **RESOLVED:** AISP enforced from P18; Crystal Atom lives in `prompts/system.ts` (ADR-045). Full AISP intent layer matures in Sprint C (P24-26).
2. **Template-vs-from-scratch boundary.** P26's "LLM never designs from scratch" rule is strong. Should P18 already enforce this (JSON-patches against existing examples only) or is the POC allowed to add fully-formed sections from the model output? — **RESOLVED:** JSON-patches against existing examples ONLY from P18. `patchValidator.ts` enforces path whitelist (`patchPaths.ts`); only `add`/`replace`/`remove` ops; no full-section LLM creation. ADR-045 codifies.
3. **Listen mode dependency on Interview.** Sprint F (Listen) lands at P36–P39 and Sprint G (Interview) at P40–P43. Should Interview *come first* given that the interview transcript is the cleanest source of intent for the assumptions engine? Re-sequence? — **RESOLVED:** Listen-first won (shipped P19 — Web Speech API, ADR-048). Interview stays at P40-P43 and reuses the Listen transcript pipeline.
4. **Content generation scope.** P29-31 generates copy. Are there guardrails on tone, length, or factual claims? Cite hallucination risk explicitly. — **RESOLVED:** Deferred to Sprint D (P27-31) per original schedule. Hallucination risk acknowledged in `SECURITY.md` (P20 Day 2). Cost-cap + path-whitelist already prevent most footguns at MVP.
5. **Cost cap evolution.** P17 cap is per-session USD. As multi-call pipelines (Sprint C 2-step, Sprint E clarification) ship, do we need per-action caps too? — **RESOLVED for MVP:** Per-session only ($1.00 default, user-editable). Per-action caps deferred to Sprint C/E when multi-step pipelines actually land.
6. **Test discipline as features grow.** Test count is monotonically non-decreasing. Spell out the test target per sprint (e.g. P18 +5, P19 +5, etc.) to avoid drift. — **RESOLVED:** Monotonic confirmed: 102→104→107→113→129→36/36→41/41→46/46 through P19 fix-pass-2. P20 projected +14-19 → 65+ targeted post-P20.

---

This document is a working draft. Re-read at start of P18, refine with the swarm, then lock for execution.
