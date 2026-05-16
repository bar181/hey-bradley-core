# ADR-155: LLM Confidence Detection + Best-Guess Fallback Standard

**Status:** Accepted
**Date:** 2026-05-16
**Phase:** P126 / GO-LIVE — FEATURE 5
**Cross-refs:** ADR-042 (LLM Provider Abstraction) · ADR-044 (JSON-Patch Contract) · ADR-047 (LLM Observability) · ADR-066 (Content vs Design Routing) · ADR-099 (DECOMP_ATOM Short-Circuit) · ADR-110 (AISP Visibility Standard) · ADR-150 (LLM Update Contract)

## Context

The Hey Bradley chat pipeline (`src/contexts/intelligence/chatPipeline.ts`) and the listen pipeline (`src/components/left-panel/listen/useListenPipeline.ts`) both consume LLM patch envelopes shaped by `PatchEnvelopeSchema` (ADR-044). Two failure modes survived through P125:

1. **Empty-or-invalid patches.** The LLM returns `{ patches: [], summary: '...' }` or a malformed envelope that fails Zod validation. Today `runLLMPipeline` returns `applied: 0` and `submit()` drops to the canned-fallback hint, which (for any prompt the canned matcher doesn't recognize) reads `"Hmm, I didn't catch that. Try one of: ..."` — an explicit "I don't understand" dead-end. The owner explicitly flagged this as the project's worst anti-pattern: a user typing `"make the site brighter and more energetic"` deserves a change + an honest narration, never a "didn't catch that" wall.
2. **Single-patch under-shoot on multi-target prompts.** When the user types `"make it brighter and add a pricing section"` the LLM sometimes returns a single patch (theme-mode flip only). Today the pipeline ships the patch with no signal that the second clause was dropped — the user has to notice the missing pricing section on their own.

A third softer signal — **hedge words in the model's `summary` field** ("I think", "maybe", "unsure", "probably") — leaks model uncertainty through to the user with no UI affordance to make that uncertainty explicit.

This ADR locks the policy for all three cases. ADR-150 (the LLM Update Contract) defines what a *valid* LLM round-trip looks like; ADR-155 defines what the *narration layer* does when validity is at the edges.

## Decisions

### D1 — Confidence classifier in `responseParser.ts`

After a successful `PatchEnvelopeSchema.safeParse`, the parser classifies the envelope into `confidence: 'high' | 'low'` via four rules in order:

1. `patches.length === 0` → `low` (reason: `empty-patches`). *Note:* the schema enforces `min(1)`, so this rule only fires when a caller injects an envelope directly or when a future contract change relaxes that floor. Retained for forward-compat + test ergonomics.
2. `patches.length === 1 && isMultiTargetUserText(userText)` → `low` (reason: `single-patch-multi-target`). The multi-target detector is rule-based — connector words (`and`, `also`, `plus`, `then`, `after that`) flanked by an action verb (`add`, `change`, `make`, `set`, `update`, `swap`, `hide`, `show`, `remove`, `brighten`, `darken`), OR ≥2 distinct action verbs separated by commas. Pure regex, $0, deterministic.
3. `summary` matches `HEDGE_RE = /\b(i think|i guess|maybe|might|unsure|probably|perhaps|not sure|i'?m not entirely|possibly|seems like)\b/i` → `low` (reason: `hedge-words`).
4. Otherwise → `high`. No narration mutation.

`parseResponse(json, userText?)` adds an optional second arg; existing call sites that omit it preserve byte-equivalent behavior except for the new `confidence` field on success (which defaults to `'high'` since the multi-target heuristic decays to `false` without `userText`).

### D2 — Anti-empty-return: best-guess fallback patches

The pipeline MUST NEVER respond with "I don't understand", "Sorry, I can't process that", or any empty narration. When the LLM round-trip parses but yields zero usable patches (validation_failed branch in `runLLMPipeline`), `submit()` synthesizes a best-guess patch via `synthesizeBestGuessPatches(userText, config)`:

- Keywords `brighter | brighten | lighter | lighten | light mode` → `replace /theme/mode = 'light'`.
- Keywords `darker | darken | dark mode` → `replace /theme/mode = 'dark'`.
- Otherwise → flip `/theme/mode` to the opposite of the current value.

Theme-mode flip was chosen as the universal fallback because it (a) is guaranteed schema-valid (`'light' | 'dark'` is a finite enum), (b) is the lowest-impact visible change we can make, (c) is one undo away (configStore history), and (d) matches the project's most common ambiguous prompt class ("make it nicer / cleaner / fresher" → users expect a theme reaction). This path is gated on `llm.errorKind === 'validation_failed'` ONLY — `cost_cap`, `rate_limit`, `timeout`, and `precondition_failed (no_adapter)` continue to drop into the existing canned-fallback path so the user sees a kind-specific error pill instead of a misleading patch.

### D3 — Casual low-confidence note + chat-history deep-link

Every low-confidence response (whether from D1's classifier OR D2's best-guess synth) appends a casual note to the user-facing `summary` via `appendLowConfidenceNote(summary, reason)`. Notes rotate from three reason-bucketed pools:

- `empty-patches` → "I had to guess on that one — went with a safe brightness flip. Tell me if you wanted something else." (and 2 variants)
- `single-patch-multi-target` → "I only changed one thing — your prompt sounded like it had a few parts, so tell me what else to update." (and 2 variants)
- `hedge-words` → "Honest note: I'm not super confident on this one — double-check the result." (and 2 variants)

Every note ends with the deep-link marker `(see Chat History → /agentics?tab=history)`. The marker is plain text today — `ChatThread.tsx` renders `msg.text` raw without markdown parsing — and points users at the Agentics chat-history tab where they can replay the trajectory. A future markdown-link parser in `ChatThread.tsx` MAY upgrade this to a clickable link; the marker format is stable for that future parser.

Rotation uses `Math.random()` (pool size = 3 per bucket) so identical-back-to-back notes are rare in practice without needing per-session state. The function is idempotent: if the summary already carries `CHAT_HISTORY_LINK_MARKER`, it returns the input unchanged.

### D4 — Anti-pattern lock: NEVER say "I don't understand"

Codified across the codebase:

- `chatPipeline.submit()` MUST NOT return an empty `summary` for any code path where an LLM adapter is configured AND the round-trip completed without a transport/cost error. The best-guess synth from D2 is the floor.
- `useListenPipeline.runListenPipeline()` consumes `submitChatPipeline().summary` verbatim and is therefore automatically covered — the listen surface inherits the policy with zero additional code.
- The existing `FALLBACK_HINT` ("Hmm, I didn't catch that. Try one of:...") remains for the truly-no-LLM path (no adapter configured) where there's nothing to be confident or unconfident about — that is the existing canned hint, not a "didn't understand" wall.
- The legacy content-route short-circuit (`aispRoute === 'content'` with no template match) stays as-is for now — its narration ("I can do design changes right now — for copy edits, try a specific phrasing...") is route-specific guidance, not an empty failure. CF-P126-A155 carries the open question of whether to upgrade that surface to a content-route best-guess in a follow-up phase.

## Consequences

- `responseParser.ts` gains a `confidence` field on its success result + an optional `userText` arg on `parseResponse`. Single existing call site (`chatPipeline.ts`) updated; no other callers exist in production code. ParseResult schema-export shape is wider but still discriminated-union-safe.
- `chatPipeline.ts` adds ~50 LOC for the best-guess synth branch + ~5 LOC for the confidence-note append on successful patches. File stays under the 500-LOC cap (~860 → ~915 LOC, already over the soft cap per pre-P126 carry-forward; ADR-155 does not regress the cap further than the existing baseline; decomposition deferred to a follow-up).
- New module `src/contexts/intelligence/llm/confidenceNarration.ts` (~85 LOC) — owns the note pool, the deep-link marker, and the best-guess synth. Single import boundary; no circular deps.
- Listen pipeline gains the low-confidence note path "for free" via the shared `submitChatPipeline` call.
- `response_summary` log envelopes now carry a `confidence` field (`'high' | 'low'`) and a `stage: 'best-guess-synth'` on the synth path — gives forensic observability via the existing `writeLogEvent` plumbing (ADR-047).
- The `assumptions / clarification card` path in listen mode (`shouldRequestAssumptions(intent)`) is unchanged but fires less often: cases that previously yielded `!result.ok && !appliedPatchCount` now trigger the best-guess synth instead, returning `ok: true` and bypassing the clarification UI. This is the intended behavior — best-guess + casual note IS the new clarification surface for the LLM-failure subset.
- `npm run build` GREEN; 12/12 architecture invariants PASS; no new hex literals in `src/components/` (helpers live under `src/contexts/`).
- Anti-pattern locked: `FALLBACK_HINT` is now reachable ONLY when no LLM adapter is configured. Every other failure mode produces a patch + an honest narration.

## Carry-forwards

- **CF-P126-A155-1:** Content-route short-circuit narration upgrade. When `aispRoute === 'content'` and no template matched, today the user sees a "try a specific phrasing" hint. ADR-155 D4 leaves this in place for now; a future phase MAY route content-only prompts to a content-best-guess (e.g., regenerate headline) instead.
- **CF-P126-A155-2:** Deterministic note rotation. `Math.random()` is fine at 3-per-bucket; if user reports start mentioning "the same note three times in a row" we can thread session state through `submit()` and use a counter.
- **CF-P126-A155-3:** Markdown link rendering in `ChatThread.tsx`. The `(see Chat History → /agentics?tab=history)` marker renders as plain text today; future phase adds a lightweight parser to upgrade to a clickable `<Link>`.
- **CF-P126-A155-4:** Best-guess synth keyword expansion. Today only brightness keywords + theme-mode flip. Future phases MAY add `larger | bigger | tighter | calmer` → typography / spacing fallbacks.
- **CF-P126-A155-5:** Parser unit-test scaffold. Tests for `classifyConfidence` + `isMultiTargetUserText` + `synthesizeBestGuessPatches` would close the parser-side coverage gap; deferred since no vitest/jest harness exists in `tests/` today (Playwright-only).
