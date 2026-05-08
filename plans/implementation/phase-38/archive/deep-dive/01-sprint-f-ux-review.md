# Sprint F End-of-Sprint — R1 UX Review (Lean)
> **Score:** 92/100
> **Verdict:** PASS (Grandma 82 / Framer 90 — both floors held)

## Summary
Sprint F lands the review-first voice UX cleanly: PTT → review card → approve → AISP chip is coherent end-to-end, and the `pendingChatPrefill` hand-off (subscribe-on-store, single-shot consume at ChatInput:188-194) survives tab toggles without state stickiness. Mutual exclusion between `/browse` + ListenReviewCard + ClarificationPanel is verified in both surfaces; the major remaining UX gap is command discoverability — `COMMAND_TRIGGER_LIST` exists as a manifest but no in-product surface renders it.

## MUST FIX
- F1: `ChatInput.tsx:703` — Empty-state hint mentions `/browse` but Listen surface has zero command discovery; Grandma in voice-mode never learns commands exist. Add a one-line cue under ListenControls (e.g. "say 'browse templates' or hold to talk") gated on `messages.length===0 && !pttReview`.
- F2: `useListenPipeline.ts:204-225` — Command-trigger short-circuit silently switches to chat tab with NO toast/feedback. User says "browse templates" → orb-pulse, no PTT, then the panel just vanishes. Add a 1.5s "Switching to chat…" hint via `setPttHint` before the tab swap.

## SHOULD FIX
- L1: `commandTriggers.ts:74-117` — `COMMAND_TRIGGER_LIST` is exported but unused at any UI surface. Wire it into a "?" affordance (next to `/browse — pick a template` link, ChatInput:715) showing the 7 kinds + aliases. Cheapest discoverability win Sprint F can ship.
- L2: `ListenControls.tsx:95` — Button disabled when `pttReview !== null` is correct, but the `aria-label="Resolve review first"` only fires when reading the button; sighted Grandma sees "Review first ↑" with an up-arrow that points at nothing visually anchored. Either render the review card with a connecting border or change copy to "Review above first".
- L3: `useListenPipeline.ts:228-231` — `hide`/`show` voice cases fall through to the review card (intentional per ADR-066), but the comment says "Voice rarely speaks the slash form" while the case-block matches the slash kind. The fall-through is correct; the comment is misleading and will confuse next-phase contributors.
- L4: `ListenReviewCard.tsx:43-45` — Approve auto-focus works in the split (verified — ref-effect on mount fires after ListenTranscript renders the card), but `tabIndex={-1}` on the wrapper means `Escape` only fires when focus is INSIDE the card. After Approve fires and the card unmounts, focus is lost — for a Grandma re-prompt scenario, focus should return to the PTT button.
- L5: `useListenPipeline.ts:155` — Persistence only on `result.ok` is correct, but `redactKeyShapes(text)` is applied to the user's raw transcript only at persist time; the AISP chip + reply banner above already surface the raw text on screen. If the user accidentally voiced an API key, it's already rendered. Consider redacting at the review-card boundary too (defence-in-depth, not a blocker).

## Acknowledgments
- A1: Pipeline split (ListenTab 84 LOC + hook 403 LOC + 2 sub-components) is genuinely clean — every file under cap, no behaviour drift vs P36 claimed in the hook docstring and verified by reading both call sites.
- A2: P34 R1 F4 parity in ListenTab confirmed — `setPttClarification(null)` at useListenPipeline.ts:192 mirrors ChatInput.tsx:387 `setShowBrowsePicker(false)`. Mutual exclusion holds on both surfaces.
- A3: `pendingChatPrefill` consume pattern (ChatInput:188-194) correctly subscribes to the store field, not just on-mount — survives tab toggles. Edit hand-off from ListenReviewCard works on every press, not just first.
- A4: 35/35 prompt corpus matches what users will type — verified the voice-phrase regex set covers the natural variants ("open templates", "pick a template", "template browser") added in P37 R1 L1 fix-pass.
- A5: ADR-065 R2 S5 fix-pass scope-clarification (chat-only EXPERT trace pane) is honest and well-noted; prevents marketing-overreach on the "voice + chat share every surface" claim.
- A6: `redactKeyShapes` symmetric persistence boundary (R2 S2) is a real security win even if L5 above suggests an additional layer.

## Persona scores (sprint-cumulative)
- Grandma: 82 (P37 baseline 82 held; F1+F2 fixes would lift to 84 — voice command discovery is the gap)
- Framer: 90 (P37 baseline 90 held; clean refactor + ADR honesty + 5-atom architecture spans both surfaces)
- Capstone: 99 (P37 baseline 99 held; ADR-065 R2 S5 honesty actively defends the score; ADR-066 research-bottleneck framing is publishable as-is)

## Score
92/100
