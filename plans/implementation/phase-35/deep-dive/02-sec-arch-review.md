# P35 Deep-Dive Review — Security + Architecture (R3+R4 combined)

**Phase:** 35 (Sprint E P2 — ASSUMPTIONS_ATOM + LLM lift + OpenAI BYOK + EXPERT trace pane)
**Reviewer scope:** Security + Architecture, lean pass, ≤200-line cap
**Files audited:** assumptionsAtom.ts, assumptionsLLM.ts, openaiAdapter.ts, keys.ts, pickAdapter.ts, AISPPipelineTracePane.tsx, ADR-064
**Verdict:** PASS with 2 MUST-FIX, 4 SHOULD-FIX

---

## MUST FIX (block seal)

### M1 — `redactKeyShapes` does NOT cover bare `sk-` OpenAI keys (Sec, HIGH)
`keys.ts:88-95` redacts only `sk-ant-…`, `sk-proj-…`, `AIza…`, `Bearer …`. OpenAI's classic non-project keys use a bare `sk-<base62>{20+}` shape (matched by `looksLikeOpenAIKey` line 79 but NOT by the redactor). OpenAI SDK error messages routinely echo the malformed key in the error string; `auditedComplete` persists `error_text` to `llm_calls`, which is exported by default in `.heybradley` zips. Net: a bad-key error from OpenAI can leak the raw key into a user-shareable export.
**Fix:** add `.replace(/sk-(?!ant-|proj-)[A-Za-z0-9_-]{20,}/g, '[REDACTED]')` immediately after the `sk-proj-` line so the negative-lookahead doesn't double-redact already-classified shapes. Add a unit test for each of the 3 OpenAI shapes + Anthropic + Google.

### M2 — Cost-cap reserve gate is inverted when `capUsd` is unset (Sec, MEDIUM-HIGH)
`assumptionsLLM.ts:107-111`: `if (cap > 0 && sessionUsd >= cap * 0.65)` — when `capUsd` is `0`/null/undefined (cap disabled or never configured), the gate is **skipped** and the LLM call proceeds. ADR-064 §Λ frames `cost_cap_reserve = 0.65` as a safety floor; with no cap configured, there is no floor, so a low-confidence loop can burn unbounded budget on assumptions side-calls. The per-call cap inside `auditedComplete` still fires, but the per-stage soft-gate is moot.
**Fix:** decide policy explicitly. Either (a) treat unset cap as "block LLM lift, fall back to rules" (safe default, matches Grandma persona), or (b) document in ADR-064 that unset cap means "unrestricted" and add a dev-only console.warn at the gate. Option (a) is preferred — it's the conservative read of Λ.

---

## SHOULD FIX (acknowledged tech debt; not seal blockers)

### S1 — `OpenAIAdapter.complete` swallows refusal responses (Sec, MEDIUM)
`openaiAdapter.ts:67`: `r.choices?.[0]?.message?.content ?? ''`. OpenAI 2026 safety system can return `message.refusal` (string) instead of `content` for blocked prompts. Current code yields empty string → `safeJson('')` → `{}` → upstream sees `invalid_response`-shaped output and falls back. Functionally safe, but the fallback path is mis-labeled — operators see "validation failure" when the truth is "model refused." Surface gap for audit and for capstone-defense narrative.
**Fix:** detect `message.refusal` and return `{ ok: false, error: { kind: 'refusal', detail: redactKeyShapes(refusal) } }`. Add `'refusal'` to the LLM error union if not already present. Trace shows up correctly in the EXPERT pane.

### S2 — `validateAssumptionsAtomOutput` does not strip markdown/HTML in `label`/`rationale` (Sec, LOW today, MEDIUM if surface evolves)
`assumptionsAtom.ts:104,113-116,119`: trusts label up to 200 chars, rationale up to 500. EXPERT pane (`AISPPipelineTracePane.tsx:98-103`) renders via JSX text nodes (auto-escaped) and ClarificationPanel similarly. Today: safe. But ADR-064 promises future surfaces; if any consumer ever uses `dangerouslySetInnerHTML`, this is a stored-XSS vector since the LLM is the attacker-influenced-input source under prompt-injection.
**Fix:** add a defensive sanitize step in the validator — strip `<`, `>`, backticks, and `]<>` markdown-link sequences from label/rationale before push. Cheap, no UX cost (those characters never appear in legitimate clarification copy). Document in ADR-064 §Trade-offs.

### S3 — ATOM Γ R3 is system-prompt-only; no validator regex (Arch, MEDIUM)
ADR-064 §Trade-offs explicitly accepts that R3 (rephrasing must use verb-enum + target-enum) is enforced via prompt only. Honest. But the cost is that the LLM can produce a free-text `rephrasing` that passes `validateAssumptionsAtomOutput`, gets surfaced to the user as a clarification button, then re-feeds into `runLLMPipeline` and dies at INTENT_ATOM. The user sees a button that does nothing.
**Fix:** add a soft-check at validation time — `rephrasing` must start with one of `hide|show|change|add|reset|remove` (case-insensitive, after trim). Reject the option (don't reject the whole list) on miss. Log the reject count to the trace. This is a 4-line addition that turns a "fail open and confuse user" into "fail closed and use rules."

### S4 — `assumptionsLLM` directly calls `useIntelligenceStore.getState()` — adapter-injection seam missing (Arch, LOW-MEDIUM)
`assumptionsLLM.ts:18, 97`: hard-wires the Zustand store. Mirrors `auditedComplete`'s precedent so isn't a new sin, but the function is otherwise pure. Test fixtures must mutate the global store rather than passing an adapter — couples PURE-UNIT tests to React state shape.
**Fix (deferrable):** accept an optional `{ adapter, capUsd, sessionUsd }` 3-tuple as a second arg; default to `useIntelligenceStore.getState()` when omitted. Same pattern as the P28 SELECTION_ATOM injectables. Carryforward candidate, not seal blocker.

---

## Acknowledgments (intentional / reviewed-and-accepted)

- **`dangerouslyAllowBrowser: true`** — `openaiAdapter.ts:22`. Same pattern as Anthropic/Gemini adapters. ADR-043 covers the BYOK-key-trust threat model: key only loaded after explicit user paste; no third-party JS in the bundle; user owns the device. Confirmed safe within the BYOK contract. **No action.**
- **5 Crystal Atom files w/ shared shape (Arch)** — yes there's repetition (each atom has a verbatim AISP string + a `validate*Output` function + a Λ-constant export trio). Extracting to `crystalAtom.ts` would help only if a 6th atom lands. P36 has none planned. Premature abstraction. **No action; flag in retro.**
- **`AISPPipelineTracePane` 9 props** — at the prop-drill threshold but each prop is a distinct atom output. A context provider would just move the assembly site, not eliminate it. ChatInput is the single producer; component is consumed in one place. **No action; revisit if a 6th atom lands.**
- **OpenAI `chat.completions` (legacy) vs Responses API (Arch)** — gpt-5-nano works on both; `chat.completions` is still GA and not deprecated as of 2026-04. Responses API offers structured-outputs + reasoning tokens, neither of which the adapter currently consumes (atom validation is JSON-shape, not OpenAI-structured-outputs). Migration is a P36+ optimization, not a correctness gap. **No action.**
- **ChatInput pendingAispRef pattern** — ADR-064 §EXPERT pane describes message-attached trace via `pendingAispRef` rather than a side-store. Reviewed; aligns with the "no new state, no new pipeline plumbing" goal. Clean. **No action.**

---

## Score

**R3 (Security): 84/100** — M1 + M2 are real gaps but both are defense-in-depth (per-call cost-cap and SDK-managed key handling are the primary defenses). Once M1+M2 are closed, target is 90.

**R4 (Architecture): 87/100** — 5-atom architecture is coherent; validator pattern reuses cleanly across atoms; EXPERT trace pane composes without new state. S3 is the most architecturally meaningful gap (validator/prompt asymmetry). S4 is a known carryforward.

**Combined seal recommendation: PASS conditional on M1 + M2 closed in a fix-pass commit before phase seal.** S1-S4 are SHOULD-FIX and may roll into P36 carryforward with explicit notes in retrospective.md.
