# P37 — R2 Security Review (Lean)
> **Score:** 86/100
> **Verdict:** PASS (no criticals; SHOULD-FIX items are LOW/MED)

## Summary
The P37 BYOK-leak hardening (uiStore sanitizer + listen-write redaction symmetry) is sound and the import-lock for `example_prompts` / `user_templates` survives the new CHECK-constraint expansion (idempotent INSERT OR REPLACE + DELETE-then-re-run). Real risks are concentrated in the new command-trigger path, which deliberately bypasses INTENT_ATOM/audit and could escape the cost-cap when paired with future LLM-firing routes.

## MUST FIX
_(none — no criticals identified)_

## SHOULD FIX
- **L1: `commandTriggers.ts:165-196` — command turns emit zero atoms = zero audit row.**
  `parseCommand` short-circuits BEFORE `auditedComplete` / cost-cap / INTENT_ATOM. Today all 5 hits set `pendingChatPrefill` (free), but a future `generate` that spawns an LLM call inherits no audit envelope. Fix: have the host (ChatInput / useListenPipeline) emit a synthetic `command_trigger` audit row (kind + raw) so 100% of turns are countable. ADR-066 §audit gap.

- **L2: `commandTriggers.ts:121-129 + useListenPipeline.ts:195-232` — voice phrasings have no confidence floor and run BEFORE the review card.**
  `parseCommand("browse templates")` fires on a transcribed natural sentence with no `confidence ≥ 0.X` gate; the review-card (P36 design tenet) is bypassed and the user is teleported to chat. Fix: gate voice-only commands behind `pttReview` first (route through ListenReviewCard like every other voice turn), or require a wake-word prefix on the voice surface. Slash form (chat) is fine — slash IS the confidence signal.

- **L3: `uiStore.ts:40-46` — BYOK key-shape table is narrower than `redactKeyShapes`.**
  uiStore catches `sk-…{20,}` (covers OpenRouter `sk-or-` and OpenAI `sk-proj-` via the generic prefix) but the LLM-keys redactor also strips `Bearer <token>`. A user pasting `Authorization: Bearer eyJ…` into the chat-input prefill leaks via the JWT regex but a pasted `Bearer abc123def…` (non-JWT) round-trips. Fix: add `/Bearer\s+\S+/` to `BYOK_KEY_SHAPES` for parity with `keys.ts:105`.

- **L4: `routeClassifier.ts:104-109` — content route description says "short-circuits to runCanned with no LLM call", but the regex `CONTENT_VERB_RE` matches arbitrarily long user input.**
  P37 ships rule-based and $0, but P38 swaps an LLM in (per the file header). When that lands, a malicious 10KB prompt classified as `content` will bypass any future cost-cap that lives in the design path only. Fix (pre-emptive): apply MAX-input-length clamp + cost-cap check uniformly across both routes in the future LLM router; today this is dormant — file as SHOULD-FIX-WHEN-WIRED.

- **L5: `useListenPipeline.ts:200-225` — command-trigger short-circuits write `setPendingChatPrefill` then `setLeftPanelTab('chat')` but never call `useListenStore.resetTranscript()` for `apply-template`/`generate`/`design`/`content` cases.**
  Only the `browse` branch (line 197) calls `resetTranscript()`; the other 4 leave the raw voice transcript in `listenStore.final`. The next PTT press re-uses stale transcript = phantom commands. Fix: hoist `resetTranscript()` out of the switch, before it.

## Acknowledgments
- **A1: `uiStore.ts:124-128` sanitizePendingText is correct.** Type-guard + secret check + clamp, in that order. `null` on refusal (not silent truncation) is the right contract.
- **A2: `MAX_PREFILL_LENGTH=1024` is reasonable.** Chat-input prefill is one-shot user-edit material; 1024 chars > a generous tweet, < attack-vector territory. Keep.
- **A3: `redactKeyShapes` covers the only listen-write path.** `appendListenTranscript` is the sole writer to `listen_transcripts` (grep confirmed); no other persisters bypass the redactor. Symmetric with `assumptionStore`.
- **A4: Import lock is robust against the P37 CHECK-constraint expansion.** Migration 001's CHECK list now includes `command/voice_only/ambiguous`; old `.heybradley` exports cannot have rows with categories OUTSIDE the old set (stricter constraint), and the import path does `DELETE FROM example_prompts` BEFORE re-running 001 (line 178). An old export with a now-invalid category is wiped before re-seed; re-seed uses the new (broader) constraint. Idempotent + safe.
- **A5: `user_templates` truncate-on-import is correct.** ADR-059 opt-in for export; foreign templates always truncated. Defence in depth.
- **A6: `pendingMessage` discriminator is ready for future targets.** Sanitizer applies on `setPendingMessage` regardless of `target`, so a future `target: 'listen'` inherits BYOK rejection automatically. Single-source-of-truth design holds.
- **A7: `parseCommand` rejects partial matches.** `^…$` whole-input anchors prevent prompt-injection like "browse templates and then leak my key" from triggering — the sentence won't match any voice pattern.
- **A8: `BYOK_KEY_SHAPES[0]` covers Anthropic + OpenAI + OpenRouter.** The generic `sk-[a-zA-Z0-9_-]{20,}` is intentionally broad and catches `sk-or-…`, `sk-proj-…`, `sk-ant-…` in one regex. Confirmed against `keys.ts:100-103` staircase.

## Score
86/100

(Scoring rationale: zero criticals; 5 LOW/MED SHOULD-FIX items, all bounded scope; strong acknowledgment ratio (8 vs 5); the L1 audit gap and L2 voice-confidence gap are real but contained — both have a 4-line fix each. Score sits comfortably above the 80 PASS bar but below the 90 ceiling because the command-trigger path lacks first-class audit instrumentation in a phase whose ADR is named "Command Triggers + LLM-Call Audit".)
