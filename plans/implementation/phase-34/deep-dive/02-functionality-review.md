# P34 — R2 Functionality Review
> **Score:** 84/100
> **Verdict:** PASS

## Summary
The P34 wiring is functionally correct in the happy path: chatPipeline carries AISP+templateId across all five return branches, the assumptions engine produces sensible ranked output, and the kv store hardens malformed JSON. One real bug exists in the clarification trigger that overrides successful canned-fallback replies, plus several smaller correctness gaps around verb resolution and second-pass recursion.

## MUST FIX
- **F1 — Clarification trigger fires over successful canned-fallback replies.** ChatInput.tsx L337-348: the predicate is `!result.appliedPatchCount && result.aisp && shouldRequestAssumptions(...)`. This is true even when `result.ok===true && result.fellBackToCanned===true` (canned parser matched). Result: user's successful canned reply (e.g. "Switched to dark mode") is replaced by "I'm not 100% sure...". Add `!result.ok` (or `!result.fellBackToCanned || !result.ok`) to the guard so canned matches win over clarification.

## SHOULD FIX
- **L1 — `inferVerb` is dead code when a `ClassifiedIntent` is supplied.** assumptions.ts L94: `req.intent?.verb ?? inferVerb(lower)`. `IntentVerb` is non-nullable on `ClassifiedIntent`, so the fallback only runs when `req.intent === null`. Means cue-vs-intent conflicts (e.g. text="remove the testimonials" with intent.verb='change') silently pick 'change' and the rephrasing diverges from the user's literal cue. Either (a) prefer cue when a strong cue is present, or (b) document explicitly that intent.verb wins.
- **L2 — Recursive clarification on accept.** ChatInput L526-534: accepting an assumption re-runs `runLLMPipeline(a.rephrasing)`. If the canonical rephrasing ("hide the team") still produces an AISP intent < 0.7 (e.g. AISP-LLM not configured), a SECOND clarification panel surfaces. Add a guard like `skipClarification: true` on the second pass, or require `accepted` paths to bypass `shouldRequestAssumptions`.
- **L3 — `/browse` while clarification is open does not dismiss it.** handleSend L372-376 short-circuits but does not clear `clarification` state; both panels render stacked. Call `setClarification(null)` alongside `setShowBrowsePicker(true)`.
- **L4 — Cue table overlap: VERB_CUES.hide includes 'remove' AND VERB_CUES.remove includes 'remove'.** Iteration order (hide first) means inferVerb always resolves "remove" → 'hide', so `verb: 'remove'` is unreachable from inferVerb. Test L86 ("remove the testimonials section") passes only because of this iteration accident. Either drop 'remove' from `VERB_CUES.hide` OR drop the `remove` enum branch entirely. Currently the code is correct-by-accident.
- **L5 — Coverage gate masks verb correctness.** p34-assumptions.spec.ts L263 measures `r.length > 0` only; it does NOT assert verb resolution per phrasing. With `lowIntent.verb='change'`, every assumption's rephrasing starts with "change" — even for phrasings like "reveal the faq" (test L98 passes only because intent is `null` there). Add a per-phrasing verb assertion to the coverage loop, or split the fixture into intent=null vs intent=lowIntent groups.

## Acknowledgments
- **A1 — JSON parse hardening verified.** assumptionStore.ts L33-47: try/catch wraps JSON.parse, type-guards every field, returns [] on any malformed shape. Solid.
- **A2 — Ring buffer math correct.** L52: `existing.slice(-(MAX_ENTRIES - 1))` keeps last 49, appends 1 → exactly 50 max. Confirmed by p34-assumptions.spec.ts L174.
- **A3 — Pipeline AISP propagation complete.** All five chatPipeline return branches carry `aisp: aispTrace` (verified by wave1 spec L36 grep). No silent drops.
- **A4 — Confidences strictly descending.** confidences=[0.85, 0.75, 0.65] applied by index after `sort((a,b)=>b.hits-a.hits)`; descending invariant guaranteed by construction.
- **A5 — `/browse` slash command does NOT enter chat history nor fire the pipeline.** handleSend L372-376 returns before addUserMessage. Correct race-free behavior.
- **A6 — `shouldRequestAssumptions` correctly handles all three cases:** null intent, low confidence, null target. Test L131-147 covers all branches.
- **A7 — Test L80 "remove → hide" mapping works** because `Object.keys(VERB_CUES)` iterates insertion order and 'hide' is declared first (L48-55). Note the fragility flagged in L4 above.

## Score
84/100
