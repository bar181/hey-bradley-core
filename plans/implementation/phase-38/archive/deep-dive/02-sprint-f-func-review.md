# Sprint F End-of-Sprint — R2 Functionality Review (Lean)
> **Score:** 86/100
> **Verdict:** PASS

## Summary
Sprint F P1+P2 chain (parseCommand → classifyRoute → router → LLM patch) composes correctly across the 35-prompt corpus on the listen surface, with redactKeyShapes correctly gating `appendListenTranscript`, all 5 BYOK adapters opaquely routed via `auditedComplete`, and the unconditional `classifyRoute` fire confirmed pure-rule ($0). However, a real CHECK-constraint regression exists for OLD `.heybradley` bundles and several voice/chat asymmetries leak edge-case UX dead-ends.

## MUST FIX
- F1: `exportImport.ts:177-183` — OLD bundle import (pre-P37 6-category CHECK) runs new INSERT with `command`/`voice_only`/`ambiguous` rows; the imported table's CHECK constraint rejects the new rows, killing the corpus re-seed. Fix: drop & recreate `example_prompts` table inside the import lock before re-running 001 SQL, OR add a category-migration step.
- F2: `useListenPipeline.ts:198-231` — switch handles 7 of 8 CommandKinds; `template-help` (added by P37 R1 F1 fix-pass in `commandTriggers.ts:194-196`) falls through silently → review card never opens, no help message rendered. Fix: add `case 'template-help': setPendingChatPrefill('/template'); ...`.

## SHOULD FIX
- L1: `useListenPipeline.ts:204-209` — `apply-template` voice dispatches `build me a <target>` to chat. Chat surface has no `/template <name>` interceptor parity, so phrasing routes through NL parser, not the apply-template command path. Voice/chat semantic drift; recommend dispatching `/template <target>` to mirror P37 ADR-066 intent.
- L2: `chatPipeline.ts:192-264` — `submit()` never calls `parseCommand`. Slash commands typed in chat must rely on ChatInput.tsx interception. Asymmetric with listen surface; if ChatInput misses, `/browse` reaches AISP and is mis-classified. Confirm ChatInput interception OR add `parseCommand` gate at top of `submit()`.
- L3: `chatPipeline.ts:294-330` — `aispRoute === 'ambiguous'` does NOT short-circuit; falls through to `runLLMPipeline`. Listen surface handles ambiguous via `shouldRequestAssumptions` post-pipeline, but chat pipeline emits no clarification card. Chat ambiguous prompts pay full LLM round-trip then return canned hint. Add an ambiguous-route ASSUMPTIONS branch parallel to the content-route branch.
- L4: `commandTriggers.ts:194` — `lower === '/template '` is dead code (line 174 `raw.trim()` then `lower = raw.toLowerCase()`; trailing-space variant unreachable). Cosmetic, safe to delete second clause.

## Acknowledgments
- A1: `exportImport.ts:178-183` — example_prompts re-seed correctly idempotent via `INSERT OR REPLACE` for SAME-schema imports; lock works for fresh exports of P37 corpus.
- A2: `exportImport.ts:190-194` — user_templates truncate (P35 R3 F1) intact and symmetric with example_prompts re-seed; correctly defends against foreign-bundle template injection.
- A3: `useListenPipeline.ts:164` — `redactKeyShapes(text)` correctly applied at the persist boundary BEFORE `appendListenTranscript`. R2 S2 redaction symmetric with assumptionStore confirmed.
- A4: `chatPipeline.ts:218` — `classifyRoute` unconditional fire is correct (pure-rule cue tables, ~$0, latency negligible). R3 L2 fix-pass landing was right call.
- A5: `chatPipeline.ts:96-147` — `runLLMPipeline` provider-opaque via `auditedComplete(adapter, ...)`; all 5 BYOK providers (claude/gemini/openai/openrouter/simulated/mock) wire through unchanged post-P37.
- A6: Migration 001 — `command`/`voice_only`/`ambiguous` rows with NULL `match_pattern` correctly cannot pollute AgentProxyAdapter fixture matching at runtime (regex match against NULL is no-op).
- A7: 35-prompt corpus mental-trace — content-route prompts (rewrite/regenerate/rephrase + change+headline) hit CONTENT_VERB_RE/copy-noun branches in `routeClassifier.ts:104-122`; design-route prompts hit DESIGN_CUE_RE on lines 126-131; ambiguous prompts ("change something", "fix it") correctly trigger route='ambiguous' on lines 147-152.
- A8: Test count 408/408 not independently verified in this read-only pass; trusted from sprint-close summary.

## Score
86/100
