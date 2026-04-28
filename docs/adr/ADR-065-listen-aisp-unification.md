# ADR-065: Listen + AISP Pipeline Unification (Review-First Voice UX)

**Status:** Accepted
**Date:** 2026-04-28 (P36 Sprint F P1)
**Deciders:** Bradley Ross
**Phase:** P36

## Context

P19 wired voice (Web Speech PTT) into the same `chatPipeline.submit()` used by the chat input — voice and text shared the same pipeline structurally. But the Listen surface bypassed every Sprint D-E UX improvement: no AISP feedback chip, no clarification card on low confidence, and (crucially) no preview/approve gate before the LLM call fired.

A user holding the talk button would say "rewrite the headline more bold" → Bradley would silently call the LLM → patches would land or fail → the user had no idea what was happening. Worst case: an ASR mis-transcription ("rewrite the deadline") would burn tokens AND make a wrong edit.

## Decision

### Three new Listen-surface components

#### A1 — `ListenClarificationCard.tsx` + AISP chip in reply banner

When `chatPipeline.submit()` returns a low-confidence intent on a voice transcript, the Listen panel surfaces the same 3-button + escape-hatch UX from `ClarificationPanel` (P34 / ADR-063), styled for the dark-background ListenTab. Selection re-feeds the canonical rephrasing through the same `runListenPipeline` path; persistence uses the existing `recordAcceptedAssumption` from ADR-063.

The reply banner gains a compact AISP chip showing `verb · target · template-id` — same data the ChatInput AISPSurface (ADR-064) renders, but trimmed for the smaller surface.

#### A2 — `ListenReviewCard.tsx` (review-first UX)

The pivotal change: **the chat pipeline does NOT auto-fire on transcript completion anymore**. Instead, the Listen panel shows a review card:

```
HEARD
"hide the hero"

WILL
Hide the hero.

[Approve] [Edit] [Cancel]
```

- **Approve** — fires the existing pipeline (`runListenPipeline` extracted from the old `submitListenFinal`)
- **Edit** — pushes the transcript to `useUIStore.pendingChatPrefill` + switches to the chat tab; ChatInput consumes the prefill on mount and the user can type-edit + send
- **Cancel** — discards; no pipeline call, no audit row

Action preview is computed client-side via the rule-based `classifyIntent` (P26 / ADR-053) — costs <1ms, never burns tokens. When confidence < 0.5 or no target, the preview reads "Run the chat pipeline on this transcript." (honest non-promise).

#### A3 — Cross-surface state via `uiStore.pendingChatPrefill`

New `pendingChatPrefill` field + `setPendingChatPrefill` / `consumePendingChatPrefill` (single-shot read-and-clear). Eliminates the previous Listen-tab-prefills-localStorage hack pattern.

### Why review-first on voice but not text

Voice has a fundamentally different error model: ASR mis-transcriptions are silent + irreversible. A typo in the chat input can be fixed before pressing Enter; a bad transcript in voice mode is a fait accompli the moment the LLM fires. The 1-second review gate trades latency for honesty, and the action preview uses the rule-based classifier (free, fast) so the gate doesn't introduce a token cost.

## Trade-offs accepted

- **+1 click on every voice action.** This is the right trade. Voice users are choosing voice for hands-free convenience but they also have higher tolerance for confirmation dialogs (think Siri's "did you mean…" pattern).
- **Action preview is rule-based only.** No LLM-driven preview at this phase; the rule classifier handles ~70% of templated phrasings. Misses fall through to a generic "Run the chat pipeline" preview which is still actionable.
- **`pendingChatPrefill` is a soft hand-off.** ChatInput consumes on mount; if the user navigates away before the consume effect fires, the prefill is lost. Acceptable — single-shot semantics; not retried.
- **No streaming preview while user is talking.** P19 already shows interim transcripts; review card only renders on `final`.

## Consequences

- (+) Voice + text now share **every** AISP UX surface: classification chip, clarification card, accepted-assumption persistence
- (+) Review gate kills the "Bradley made a wrong edit because of a mis-hearing" failure mode
- (+) Edit hand-off to ChatInput means voice → text crossover is one click (closes a long-standing UX gap from P19)
- (+) Composite expected to climb on Grandma persona (review = trust) + Framer (5-atom architecture now spans both surfaces)
- (-) Adds 3 components (~280 LOC total) + 1 helper + 1 uiStore field — minimal complexity
- (-) Pipeline path is now `submitListenFinal → setPttReview → handleListenApprove → runListenPipeline`; one extra hop vs P19's direct `submitListenFinal → submitChatPipeline`. Acceptable; the gate IS the value.

## Cross-references

- ADR-048 (P19; Web Speech STT)
- ADR-053 (INTENT_ATOM) — action preview source
- ADR-063 (Assumptions Engine + ClarificationPanel; P34) — voice mirrors text
- ADR-064 (ASSUMPTIONS_ATOM + LLM lift; P35) — voice clarification reuses LLM-first generator

## Status as of P36 seal

- ListenReviewCard + ListenClarificationCard + listenActionPreview shipped ✅
- ListenTab refactored: review-first → approve → pipeline ✅
- uiStore.pendingChatPrefill + consume pattern shipped ✅
- ChatInput consumes prefill on mount (transcript hand-off live) ✅
- ADR-065 full Accepted ✅
- 14+ PURE-UNIT tests covering action preview / review wiring / clarification card / prefill round-trip / 31/35 prompt coverage ✅
- Build green; tsc clean; backward-compat with all P15-P35 ✅
