# Phase 18+ — Full Chat & Intelligence Roadmap

> **Status:** DRAFT (planning artifact saved at end of Phase 17 for review at the start of Phase 18).
> **Authority:** Discussion document. Will be re-reviewed and refined at Phase 18 kickoff before any execution.
> **Saved:** 2026-04-27 by direction of the project owner.
> **Scope:** Sprints A through H — Chat foundation through Open-Source Release Candidate.
> **Companion:** `strategic-vision.md` (the architectural / commercial-positioning view).

---

## Sprint A — Chat Foundation (P18-P20)

- **P18:** Chat POC — LLM call works, returns JSON, merges with project JSON, preview + specs update live.
- **P19:** Prompt template library — identify and define every LLM API call type, structured + documented, ADRs written.
- **P20:** Test mode — validate hero, articles, show/hide sections end-to-end. Playwright tests green.

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

## Sprint F — Listen Mode (P36-P39)

- **P36:** Listen mode POC — architecture defined, mic capture, transcript storage wired to P16 DB, basic transcription working.
- **P37:** Listen + intent — transcript processed through intent pipeline (P25), extracts actionable to-dos from spoken input.
- **P38:** Listen + chat bridge — transcripts inform chat context, voice input triggers same chat pipeline as text.
- **P39:** Listen review mode — user sees transcript + extracted actions side by side, can approve/edit before LLM fires.

## Sprint G — Interview Mode (P40-P43)

- **P40:** Interview mode POC — LLM asks the user questions via text to build site context (name, purpose, audience, tone).
- **P41:** Interview voice — LLM speaks questions aloud using TTS, user responds via mic, full voice conversation loop.
- **P42:** Interview → project — completed interview auto-populates project JSON (sections, content, theme choices).
- **P43:** Interview + assumptions bridge — interview answers feed assumptions engine (P35), reducing clarification prompts during normal chat.

## Sprint H — Polish + Release Candidate (P44-P46)

- **P44:** Performance + error handling — loading states, graceful LLM failures, retry logic, cost guard rails.
- **P45:** Final persona scoring pass — Grandma, Framer, Capstone re-scored against full feature set.
- **P46:** Open-source RC — public repo cleanup, README, CLAUDE.md final, license, contribution guide.

---

## The Full Arc

| Range | Phase Goal |
|---|---|
| **P18-20** | It works (POC) |
| **P21-23** | Humans use it naturally (simple chat) |
| **P24-26** | AISP makes it precise + transparent |
| **P27-31** | Templates + content generation |
| **P32-35** | LLM asks questions, shows its work |
| **P36-39** | Voice input + listen mode |
| **P40-43** | Interview mode (LLM leads the conversation) |
| **P44-46** | Ship it |

---

## Swarm Notes for Later Sprints

- **Sprint E UX decision (P33)** is the highest-risk unknown — prototype-first, no premature commitment.
- **Sprint G voice (P41)** depends on TTS provider choice — add to P17 ADR-042 as a future consideration during P19 prompt-template review.
- **Content generation (P29-30)** should reuse AISP intent layer from P25 — same pipeline, different output type.
- **Listen + Interview** are separate UX modes but share the same `transcript → intent → action` pipeline.

---

## Open Questions for Phase 18 Review

These are explicit decision points the owner should re-review at the start of Phase 18, before this roadmap is locked.

1. **AISP enforcement timing.** Plan above introduces AISP at P24. Should P18-P23 already use a thin AISP wrapper in the system prompt, even if responses are plain JSON, to set the precedent? Or is the "JSON-only POC first, AISP later" sequencing intentional?
2. **Template-vs-from-scratch boundary.** P26's "LLM never designs from scratch" rule is strong. Should P18 already enforce this (JSON-patches against existing examples only) or is the POC allowed to add fully-formed sections from the model output?
3. **Listen mode dependency on Interview.** Sprint F (Listen) lands at P36–P39 and Sprint G (Interview) at P40–P43. Should Interview *come first* given that the interview transcript is the cleanest source of intent for the assumptions engine? Re-sequence?
4. **Content generation scope.** P29-31 generates copy. Are there guardrails on tone, length, or factual claims? Cite hallucination risk explicitly.
5. **Cost cap evolution.** P17 cap is per-session USD. As multi-call pipelines (Sprint C 2-step, Sprint E clarification) ship, do we need per-action caps too?
6. **Test discipline as features grow.** Test count is monotonically non-decreasing. Spell out the test target per sprint (e.g. P18 +5, P19 +5, etc.) to avoid drift.

---

This document is a working draft. Re-read at start of P18, refine with the swarm, then lock for execution.
