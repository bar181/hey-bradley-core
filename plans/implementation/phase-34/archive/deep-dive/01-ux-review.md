# P34 — R1 UX Review
> **Score:** 86/100
> **Verdict:** PASS (Grandma 78 / Framer 88)

## Summary
Sprint E P1 lands the Sean-from-GWH pattern cleanly: 3-button clarification + /browse picker + template chip on AISP panel. The copy is human, the visual hierarchy holds because each panel has a distinct vertical region, but Grandma discoverability of /browse and the "yours" tag (which can never appear at runtime) are real near-misses.

## MUST FIX
- F1: `ChatInput.tsx:545-548` — /browse hint only shows when input is empty AND focused AND `messages.length === 0`. After Grandma's first turn, the slash command becomes invisible forever. Fix: also surface a persistent "browse templates" affordance near the lightbulb (Try Examples) button or keep the hint text after first send.
- F2: `TemplateBrowsePicker.tsx:78-82` — "yours" green tag is dead code at runtime (line 26 comment confirms `loadUserRows` is omitted). Renders `t.source === 'user'` that the registry never produces. Fix: remove the branch entirely until P34+ wires user_templates, or guard at type level so it cannot mislead reviewers.
- F3: `ChatInput.tsx:496-505` + `510-542` — no Escape-key handler on either panel; `handleKeyDown` (l. 418) only fires on the input. Grandma cannot dismiss /browse or clarification with the keyboard. Fix: add a top-level keydown listener (or `onKeyDown` on the wrapper div) for `Escape → onClose/onReject`.
- F4: `ChatInput.tsx:496-542` — opening `/browse` mid-clarification stacks both panels above the input with no precedence rule, and accepting an assumption does not auto-close `showBrowsePicker`. Fix: when `clarification` is set, hide /browse (or vice versa) — render exactly one disambiguation surface at a time.

## SHOULD FIX
- L1: `ClarificationPanel.tsx:41` — "I'm not 100% sure — pick the one you meant" is good Grandma copy, BUT the ADR-063 §Wiring step 2 promises "pick the closest match below ↓" with an arrow. The arrow + "closest match" framing tested better; ship the ADR copy or update ADR.
- L2: `ClarificationPanel.tsx:54-59` — confidence pills `85% / 75% / 65%` read as "guessing" to Grandma when the lowest is sub-70. Per ADR-063 trigger is `<0.7`, so the LOWEST shown will routinely be 65%. Consider hiding the % below 70 and using "less likely" copy, OR labeling the column "match" so 65% reads as "65% match" not "65% sure".
- L3: `ChatInput.tsx:526` — the accepted `a.rephrasing` is appended as a fresh user turn but the original low-confidence turn stays above it un-annotated. Add a small "↳ confirmed as" connector or grey-out the original so audit trail is visually obvious to non-devs.
- L4: `AISPTranslationPanel.tsx:55-62` — the `template: generate-headline` chip is always visible (outside the collapsible) even when it adds no signal for Grandma. Either move inside the panel, or rename to a friendlier "matched: headline-generator".
- L5: `ChatInput.tsx:510` — no `aria-live="polite"` region wrapping the ClarificationPanel; screen readers won't announce the "I need clarification" interrupt. Add `role="region" aria-live="polite" aria-label="Clarification needed"`.
- L6: `TemplateBrowsePicker.tsx:35-101` — no Tab order guarantee; close button is first in DOM but cards are buttons too. Real-keyboard test: Tab from input goes to close-button (correct) then sweeps grid (correct), but no visible focus ring style — `focus-visible:ring-2 focus-visible:ring-[#e8772e]` should be added on the cards + close.
- L7: `ChatInput.tsx:507-509` — comment promises "lightbulb-adjacent browse affordance" but only the slash command exists. Either add the button or update the comment so the next reviewer doesn't chase a phantom.
- L8: Edge case — what if intent classifier never returns? `chatPipeline.submit` is in a `setTimeout(..., 400)` chain but no timeout/abort. If LLM hangs, `isProcessing=true` forever and clarification never fires. ADR-063 silent on this; add a 15s timeout that falls through to assumptions on hang.

## Acknowledgments
- A1: `ClarificationPanel.tsx:66-73` — the "something else — let me rephrase" escape hatch is the right Grandma move; italic + muted gives it the "out" feel without competing with the 3 primary buttons.
- A2: `AISPTranslationPanel.tsx:33-34` + `82-84` — graceful handling of the `intent=null + templateId=set` canned-fallback path (italic explanation copy) is genuinely thoughtful — most reviewers would have crashed-on-null.
- A3: `TemplateBrowsePicker.tsx:53` — category ordering (`theme → section → content`) matches the user's mental model (big choice → narrower choice → fill-in). Good IA.
- A4: `ChatInput.tsx:526-534` — re-feeding `a.rephrasing` through `runLLMPipeline` (not a special path) preserves the single-pipeline invariant from ADR-050. Architectural cleanliness paying off at the UX surface.
- A5: ADR-063 §Trade-offs — the "rule-based, no LLM" call-out + cue-word-table-drift acknowledgment shows the team knows the technical-debt position they're taking.

## Persona scores
- Grandma: 78 (passes 77 floor; loses points on F1 discoverability + L2 65% confusion + F3 keyboard dismiss)
- Framer: 88 (passes 85 floor; loses on F2 dead "yours" tag + F4 panel collision + L4 always-on chip noise)

## Score
86/100
