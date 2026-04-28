# P35 — UX+Functionality Review (Lean)
> **Score:** 87/100
> **Verdict:** PASS (Grandma 80 / Framer 88; composite ≥85, below 95 capstone target — see notes)

## Summary
P35 lands the 5th Crystal Atom and an EXPERT pipeline-trace pane cleanly; the 6-tier fallback is conservative and the rule-based safety floor is preserved. UX has two real risks (3-panel stack under one bradley reply, no LLM thinking indicator) and Functionality has one clear bug (OpenRouter keys pass `looksLikeOpenAIKey`).

## MUST FIX
- F1: `src/contexts/intelligence/llm/keys.ts:75-80` — `looksLikeOpenAIKey` regex `^sk-(?:proj-)?[A-Za-z0-9_-]{20,}$` accepts OpenRouter `sk-or-...` keys (only `sk-ant-` is rejected). User who pastes an OR key under `openai` provider gets a green "Format looks right" check then a 401 at runtime. Add `if (/^sk-or-/i.test(t)) return false;` next to the ant guard.
- F2: `src/components/shell/ChatInput.tsx:516-538` — every bradley reply with `aisp` renders BOTH `AISPTranslationPanel` AND `AISPPipelineTracePane`, and a turn that triggered clarification also stacks `ClarificationPanel` below input. In EXPERT that's 3 panels per turn; the trace pane duplicates intent + template that the translation panel already shows. Gate trace pane on EXPERT only AND/OR collapse the translation panel into atom 1 of the trace pane.
- F3: `src/contexts/intelligence/aisp/assumptionsLLM.ts:124-138` — `auditedComplete` has no client-side timeout wrapper visible from this call site; if the provider hangs, `isProcessing`/`inFlight` stays true and the user sees a blinking cursor with no spinner copy ("thinking…", "still working…"). Wrap with `AbortController` + 8-12s deadline OR show a "thinking…" line in the typewriter once latency > 1.5s.
- F4: `src/contexts/intelligence/aisp/assumptionsAtom.ts:34-37,98-129` — Γ R3 (rephrasing must be `{verb-enum} ∪ {target-enum}`-constructed) is documented in the atom and SYSTEM_PROMPT but `validateAssumptionsAtomOutput` does not enforce it at runtime — only length ≤100. An LLM that drifts ("perhaps you wanted the bakery hero?") passes validation and pollutes 3-button copy. Add a verb-prefix + target-substring runtime check; reject on miss.

## SHOULD FIX
- L1: `src/contexts/intelligence/aisp/assumptionsLLM.ts:107-111` — soft cost-cap gate at `sessionUsd >= cap * 0.65` is functionally redundant with auditedComplete's hard `sessionUsd + projected >= cap` enforcement. The soft gate IS reachable (it fires earlier) and the intent is good (don't burn budget on a low-confidence side-call), but the comment claims it's "the earlier soft-gate" — make that explicit in the trace string ("cost reserve 65% hit") so EXPERT users see the distinction.
- L2: `src/components/settings/LLMSettings.tsx:112-118` — provider `<select>` now has 6 options (simulated, mock, gemini, openai, openrouter, claude). Decision fatigue is real for a Grandma persona; first-run users won't know which to pick. Add a one-line prefix above the select ("Free option pre-selected — pick a paid one only if you have a key") and consider visually grouping `simulated`/`mock` under an `<optgroup label="Free">`.
- L3: `src/components/shell/AISPPipelineTracePane.tsx:97` — confidence rendered as `Math.round(a.confidence * 100)` so a perfect LLM match shows "100% match" which reads slightly off (humans say "exact match" at 100). Render `${Math.round(a.confidence * 100)}%` and label-suffix as "match" for <100, "exact match" at 100. Cosmetic.
- L4: `src/contexts/intelligence/aisp/assumptionsLLM.ts:43-58` — SYSTEM_PROMPT injects the full `ALLOWED_TARGET_TYPES` enum (~16 items at last count) every call. With gpt-5-nano at $0.05/1M-in this is a rounding error, but on Claude Haiku it adds up over a session. Consider promoting the enum to a cached system message OR truncating to the 6-8 types the user has actually used in this session.
- L5: `src/contexts/intelligence/aisp/assumptionsAtom.ts:95` — empty array is rejected (`arr.length === 0` returns null), which forces fallback to rule-based when the LLM correctly determines "no plausible alternatives." That defeats Ω which says "Generate UP TO 3" (≥0 is valid per Σ `count:ℕ∈[0,3]`). Allow length 0 and have the caller treat zero-length validated as `source: 'llm'` empty rather than triggering rules.

## Acknowledgments
- A1: Rule-based fallback discipline is correct — `ruleFallback` always returns; `generateAssumptionsLLM` "never throws" contract is preserved across all 6 tiers (no-adapter, cost-cap, throw, !res.ok, validation-fail, success). This is the right shape for a low-stakes side-call.
- A2: `AISPPipelineTracePane` is collapsed-by-default (`useState(false)`), EXPERT-only via `rightPanelTab === 'SIMPLE'` early return, and renders only the atoms that fired (assumptions + content gates). Good progressive-disclosure hygiene.
- A3: `OpenAIAdapter` correctly threads `req.signal` into the SDK call (P20 C20 abort path preserved); `dangerouslyAllowBrowser: true` is acknowledged in the BYOK threat model (ADR-043).
- A4: `pickAdapter` keeps the OpenAI adapter dynamic-imported so the simulated path doesn't pull the OpenAI SDK into the bundle — bundle hygiene preserved.
- A5: Σ/Γ validator rejects NaN, Infinity, out-of-range confidence, non-monotonic confidence ordering, bad ids, and oversized rephrasing. Defensive in the right places.
- A6: Tier-hint copy (`Cheap · fast (gpt-5-nano default)`) and key-format placeholder (`sk-… or sk-proj-…`) are user-friendly without leaking pricing into the primary chrome.

## Persona scores
- Grandma: 80 (≥79 ✓ — provider menu still busy; saved by the simulated default + tier hints)
- Framer: 88 (≥85 ✓ — 3-panel stack under EXPERT replies is the only Framer drag)
- Capstone: 95 estimated (5-atom AISP pipeline visible in production is the demo money-shot; F4 enum-drift is the only thesis risk)

## Score
87/100 — PASS with 4 must-fix items. Composite to ≥95 requires F2 (panel stacking) + F4 (Γ R3 runtime enforcement) closed. F1 (key collision) is a security/UX correctness bug and must land regardless.
