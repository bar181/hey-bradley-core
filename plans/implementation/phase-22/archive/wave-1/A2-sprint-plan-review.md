# A2 — Sprint B-K Plan Review (vs codebase reality)

> Author: coordinator (replacing timed-out swarm agent)
> Source HEAD: `eaa2410`
> Sequential numbering Option A locked: B=P21-P23 / C=P24-P26 / D=P27-P31 / E=P32-P35 / F=P36-P39 / G=P40-P43 / H=P44-P46 / I=P47-P49 / J=P50-P52 / K=P53-P55

## Executive summary (≤150 words)

Sprint B-K plans are largely sound but **3 sprints are partially-pre-shipped** by P15-P19 work, and 2 phases need scope correction. Overall recommended:
- **Sprint B (P21-P23)** — KEEP. New work: real template registry + section targeting + intent translator. ~30-60 min/phase at velocity.
- **Sprint C (P24-P26)** — TIGHTEN. AISP system prompt already shipped (P18); the genuinely-new layer is intent classification + AISP user-view UI. Could compress to 2 phases.
- **Sprint F (P36-P39)** — COMPRESS. Listen→pipeline already integrated (P19). Enhancement work is 2 phases max.
- **Sprint G (P40-P43)** — KEEP, reuse P19 STT pattern for TTS.
- **Sprint H+I+J+K** — KEEP as scoped; J is post-defense.
- **Insert 2 NEW phases** between P20 and P21: P20.5 cleanup + P20.7 website rebuild (or rename to P21/P22 and shift).

## §B Sprint B — Simple Chat (P21-P23)

| Phase | Plan | Reality | Recommendation |
|---|---|---|---|
| P21 | Natural-language input + 2-3 templates | `step-2.ts` already has 5 regex fixtures + `cannedChat.ts` parses prefixes. The new work is a **registry abstraction** — typed Template entries with metadata vs raw regex | KEEP. ~1 hour. Add ADR-050 for template registry |
| P22 | Section targeting via `/hero-1` keyword scoping | NOT shipped. New work: parser layer in `chatPipeline.ts` that resolves `/hero-1` → section index before patch validator runs | KEEP. ~1 hour |
| P23 | Intent translation — messy → structured to-do | Partial: `parseChatCommand` does some normalization. New work: structured `Intent` type + middleware step before fixture/template lookup | KEEP. ~1.5 hours |

**Existing reuse:** `step-2.ts`, `cannedChat.ts`, `chatPipeline.ts`, `mapChatError.ts`, `auditedComplete.ts`, `patchValidator.ts`
**New:** `src/contexts/intelligence/templates/registry.ts`, `src/contexts/intelligence/intent/parser.ts`, ADR-050 + ADR-051

## §C Sprint C — AISP Chat (P24-P26)

| Phase | Plan | Reality | Recommendation |
|---|---|---|---|
| P24 | AISP instruction layer | **AISP Crystal Atom already in `prompts/system.ts` (P18 shipped, ADR-045)**. The genuinely-new work is AISP user-facing view (Blueprints AISP sub-tab is P20 C12 — overlap) | TIGHTEN. Re-scope to "AISP intent classification" — distinct from system-prompt layer |
| P25 | Intent pipeline — AISP determines intent | Builds on P23 intent translation; reuses Crystal Atom symbols | KEEP |
| P26 | 2-step template selection (theme pick → modify) | Needs P21 template registry first | KEEP |

**Existing reuse:** `prompts/system.ts` (Crystal Atom), `bar181/aisp-open-core` external repo
**New:** `src/contexts/intelligence/aisp/intentClassifier.ts`, ADR-052 (AISP intent layer)
**Risk:** Sprint C could compress to 2 phases (P24 = intent classifier; P25 = 2-step template). **P26 could merge into P25.**

## §D Sprint D — Templates + Content (P27-P31)

| Phase | Plan | Reality | Recommendation |
|---|---|---|---|
| P27 | Template library — browse + apply | Foundation: 17 examples + 12 themes already in `src/data/`. New: UI for browsing | KEEP, build on existing data |
| P28 | Template creation from conversation | Needs P21 registry + P25 intent pipeline | KEEP |
| P29 | Content generation POC — LLM writes hero copy | NEW; first phase to use LLM for content, not structure | KEEP. Add ADR for content guardrails (tone, length, hallucination) |
| P30 | Content pipeline — all section types | Builds on P29 | KEEP |
| P31 | Content + template bridge | Glue phase | KEEP, may compress |

## §E Sprint E — Clarification & Assumptions (P32-P35)

All 4 phases NEW work — no pre-shipping. KEEP as planned.

## §F Sprint F — Listen Mode Enhancement (P36-P39)

| Phase | Plan | Reality | Recommendation |
|---|---|---|---|
| P36 | Listen + intent pipeline (P25 reuse) | **P19 already routes voice→chatPipeline.** Reuse of P25 intent layer is the real new work | KEEP |
| P37 | Listen review mode — transcript + actions side-by-side | NEW UX | KEEP |
| P38 | Listen + chat bridge | **Already done in P19** — voice and text use the same pipeline | **DROP or absorb into P37**. Sprint F compresses to 3 phases |
| P39 | Listen polish + error states | `mapListenError` 6 kinds already shipped P19 | TIGHTEN. ~30 min only |

**Recommend:** Compress Sprint F from P36-P39 (4 phases) to **P36-P38 (3 phases)**. The 4th slot (P39) opens up for…

## §G Sprint G — Interview Mode (P40-P43)

| Phase | Plan | Reality | Recommendation |
|---|---|---|---|
| P40 | Interview POC text | NEW | KEEP |
| P41 | Interview voice — Web Speech TTS | TTS Web Speech API is browser-native; reuse P19 STT adapter pattern | KEEP, ~1 hour |
| P42 | Interview → project JSON auto-populated | Builds on P40 + intent pipeline P25 | KEEP |
| P43 | Interview + assumptions bridge | Builds on P35 | KEEP |

**No changes.**

## §H Sprint H — Post-MVP Upload + References (P44-P46)

All 3 phases NEW work. No upload UI exists today. KEEP.

## §I Sprint I — Builder Enhancement (P47-P49)

Existing builder is solid (P15-P17). KEEP but lean — UX polish iterations.

## §J Sprint J — Agentic Support System (P50-P52)

Out-of-Hey-Bradley-core scope per strategic-vision.md. Mostly external integration (e.g., bar181/aisp-open-core deeper integration). **Consider deferring entirely beyond OSS RC**, keeping P50-P52 as buffer.

## §K Sprint K — Release (P53-P55)

| Phase | Plan | Reality | Recommendation |
|---|---|---|---|
| P53 | Performance + error handling | Overlaps with P20 work | TIGHTEN if P20 already lands these |
| P54 | Final persona scoring | Personas re-scored at P20 already | TIGHTEN to delta-only |
| P55 | OSS RC — public repo, license, contributing | Repo IS public; CONTRIBUTING.md is P20 DoD | TIGHTEN to tag-and-announce |

## §L NEW phases needed (recommend numbers for A4/A5/A6)

### Cleanup + ADR/DDD gap-fill phase
- **Recommended slot:** between P20 seal and P21 start (rename to P21 = cleanup; shift Sprint B to P22-P24)
- **OR:** as P20.5 / "Phase β" interlude (preserves Sprint B at P21-P23)
- **Owner directive (Option A sequential):** likely insert as P21 with shift; alternatively as a parallel-track phase
- **Effort at velocity:** 1-2 hours
- **Includes:** archive phase-15..19 working files (keep logs + preflight + retros + end-of-phase results); ADR gap-fill for 11 numbering holes; CLAUDE.md+README+STATE final accuracy pass; DDD bounded-context audit

### Public-website rebuild phase
- **Recommended slot:** parallel-track or pre-Sprint B (allows demo to be live for capstone)
- **Effort at velocity:** 2-4 hours
- **Persona gate:** Grandma ≥70 required
- **Scope:** simplified pages reflecting "end of open core" reality; BYOK demo + local storage; commercial features marked as separate-repo

## §M Resequencing recommendations (final)

Given Option A sequential + 2 new phases:

**Option A1 (recommended):** insert 2 new phases as **P21 = Cleanup, P22 = Website rebuild**, shift Sprint B to **P23-P25**, all subsequent sprints shift +2.

**Option A2:** insert as parallel-track phases (Phase α + Phase β) WITHOUT shifting sprint numbers. Cleaner for sprint-roadmap docs but loses sequential property.

**Recommendation:** A1 — sequential property preserved; 2 small phases at front of post-MVP arc; capstone demo benefits from website rebuild landing early.

## §N Files I would have read

- `plans/implementation/phase-18/roadmap-sprints-a-to-h.md`
- `plans/implementation/phase-18/strategic-vision.md`
- `plans/implementation/phase-21/preflight/00-summary.md`
- `plans/implementation/phase-21/checklist.md`
- `plans/implementation/phase-21/MEMORY.md`
- `src/data/llm-fixtures/step-2.ts` (5 fixture starters)
- `src/lib/cannedChat.ts` (prefix parser)
- `src/contexts/intelligence/chatPipeline.ts`, `prompts/system.ts`
- `src/contexts/intelligence/llm/patchValidator.ts`, `mapChatError.ts`
- `src/templates/` (22 dirs covering 16 section types + variants)
- `src/data/examples/` (17 example JSONs), `src/data/themes/` (12 themes)
- `src/components/left-panel/ListenTab.tsx` (754 LOC)

(All read in prior session context; cited by file:line where applicable above.)

---

**Author:** coordinator (Wave-1 agent timed out; report written directly)
**Output:** `plans/implementation/phase-22/wave-1/A2-sprint-plan-review.md`
**Cross-link:** A1 capability audit + A3 website assessment (companion docs)
