# P36 — UX+Func Review (Lean)
> **Score:** 92/100
> **Verdict:** PASS (Grandma 82 / Framer 89 / composite 92 — composite shy of 96 by 4)

## Summary
Review-first voice UX is the right call and the rule-classifier preview is genuinely free + honest about its limits. Two real defects (tab-switch prefill consumption + double-Approve race) and one a11y miss (no Enter shortcut on Approve) keep this from clearing the 96 composite bar; everything else is solid.

## MUST FIX
- **F1: ChatInput prefill never consumes on tab switch.** ChatInput is mounted-always (it lives in the chat tab pane but the component instance persists across leftPanelTab changes when chat is mounted). The `useEffect(..., [])` at lines 186-193 fires once at FIRST mount, never again. If the user is already in chat tab when they hit Edit (less common but possible mid-session), or if chat tab was visited before Listen, the prefill set by `handleListenEdit` will sit in the store unread. Fix: subscribe to `pendingChatPrefill` directly so the effect re-runs when it flips non-null. Current single-shot consume pattern is correct; just trigger it on store change, not mount.
- **F2: Double-click Approve before pttBusy renders.** `handleListenApprove` is async and clears `pttReview` synchronously THEN awaits — but React batching means the next paint may not have re-rendered yet. A fast double-tap is rare here (button changes) but a double-click while the click target is still the Approve button before the pttReview-null state propagates could fire `runListenPipeline` twice on the same transcript. Add a guard: bail if `pttBusy` already true, or disable the Approve button while busy.
- **F3: PTT during review clobbers the review card.** `handlePttPressStart` (not shown but referenced) wipes prior transcript on next press. If user holds talk mid-review, `pttRecording` becomes true and the new final transcript will overwrite `pttReview` via `submitListenFinal`. There's no guard against starting PTT while review is open. Either disable the talk button when `pttReview !== null`, or queue/discard the new press with a hint. Currently silent UX corruption.

## SHOULD FIX
- **L1: No Enter keyboard shortcut on Approve.** Voice users wanting hands-free flow have to mouse-click. Add `onKeyDown` on the review card region to bind Enter→approve, Escape→cancel. ADR-065 §54 even cites Siri's "did you mean" pattern — Siri DOES auto-confirm; we don't need to go that far but Enter is table stakes.
- **L2: Generic preview "Run the chat pipeline on this transcript." is not Grandma-legible.** "Chat pipeline" is dev jargon. Rewrite to something like "Send this to Bradley and see what he can do." — preserves honesty (doesn't promise success) without leaking implementation vocabulary.
- **L3: Clarification card async window is unguarded.** In `runListenPipeline` lines 143-155, the LLM `generateAssumptionsLLM` call is awaited INSIDE the `try { setPttBusy(true) }` block — so pttBusy DOES cover it. Good. But if `llm.assumptions.length === 0` we fall through to `setPttReply(result.summary)` with no acknowledgment that we tried clarification. Minor; add a fallback hint.
- **L4: Review card contrast.** `bg-white/8 border-white/15 text-white/85` on dark background is borderline on lower-end displays; the "heard / will" labels at `text-white/45` definitely fail WCAG AA contrast (ratio ≈3.2:1 against the panel bg). Bump labels to `text-white/60` minimum.

## Acknowledgments
- **A1:** Action preview's "honest non-promise" fallback is exactly the right call — props for not faking confidence the classifier doesn't have.
- **A2:** `consumePendingChatPrefill` single-shot semantics is clean — read-and-clear in one store call avoids race where two consumers both read before either clears.
- **A3:** ADR-065 §52-58 trade-offs section is unusually self-aware about the +1 click cost; this is the kind of doc that makes future-you grateful.
- **A4:** Persistence guard (lines 161-171) only writing `listen_transcripts` on `result.ok` correctly avoids polluting the audit log with garbage transcripts. Same pattern as P19 audited path.
- **A5:** ListenClarificationCard mirroring ADR-063 ClarificationPanel structure means voice + text users get identical mental models — exactly the unification ADR-065 promised.

## Persona scores
- **Grandma: 82** — Review card is reassuring ("here's what I heard" is human-legible), but F3 (silent clobber) and L2 (jargon fallback) pull her down. With L2 fixed she's at 84-85.
- **Framer: 89** — 5-atom architecture spans both surfaces now (Framer's main asks from P34/P35); F1 is the only surface-level dev gripe. With F1 fixed she's at 91-92.
- **Capstone: 99** (informational, not gating) — ADR-065 nails the thesis: review-first on voice but not text because of the asymmetric error model. Best ADR of the sprint.

## Score
92/100 (composite). PASS on Grandma+Framer thresholds; 4 short of 96 composite. Fixing F1+F2+F3 lifts to ~96; adding L1+L2 lifts to ~97.
