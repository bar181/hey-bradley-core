# Sprint F End-of-Sprint — R3 Security Review (Lean)
> **Score:** 92/100
> **Verdict:** PASS (no criticals; 2 SHOULD-FIX, 5 acknowledgments)

## Summary
Cumulative P36+P37 security posture is solid: BYOK leak coverage is now symmetric across kv (assumptionStore, uiStore prefill) and SQL (chat_messages via redactKeyShapes upstream, listen_transcripts via R2 S2), the SENSITIVE_TABLE_OPS sentinel keeps the strip list honest as schema evolves, and the import lock truncates both example_prompts and user_templates. Two regex-drift items and one audit-coverage gap warrant cleanup before P38; nothing blocks Sprint F seal.

## MUST FIX
*(none — no criticals identified)*

## SHOULD FIX
- **L1: src/store/uiStore.ts:40-47 — BYOK_KEY_SHAPES drift vs redactKeyShapes.**
  uiStore's regex list lacks the explicit `sk-ant-` / `sk-proj-` / `sk-or-` ordering (relies on the broader `sk-...{20,}` catchall) and adds 3 extra shapes (ghp_, xox, JWT) that `redactKeyShapes` does NOT cover. Two sources-of-truth = future drift. Fix: extract one shared `BYOK_SHAPES` const consumed by both modules.
- **L2: src/contexts/intelligence/aisp/assumptionStore.ts:26-32 — missing Bearer pattern.**
  R2 L3 fix-pass added `Bearer\s+\S+` to uiStore + redactKeyShapes but assumptionStore's BYOK_KEY_SHAPES still has only 5 patterns. A user pasting `Bearer eyJ...` could match the JWT pattern (saves us), but bare `Bearer sk-...` would too. Cheap to add for symmetry; same drift vector as L1.

## Acknowledgments
- **A1: Cost-cap reserves summing > 1.0 is intentional, not a bug.** Each atom's reserve is "max % of REMAINING budget this atom may consume" — sequential, not additive. INTENT 0.85 + SELECTION 0.75 of remainder + CONTENT 0.85 of remainder + ASSUMPTIONS 0.65 of remainder converges well under 1.0 in practice. (Confirm via inline comment in cost-cap module on next touch; not blocking.)
- **A2: parseCommand bypassing auditedComplete = ZERO llm_logs row IS a real audit gap (R2 L1 carryforward from P37).** Voice/typed `/browse` produces no telemetry trail. Acknowledged here, not promoted to MUST: commands are deterministic (no LLM cost, no model nondeterminism) so audit value is lower than for LLM turns. Recommend P38 adds a `kind='command'` debug-level row for forensic completeness. Tracked as carryforward.
- **A3: Voice command bypass (parseCommand in useListenPipeline:195-232) is NOT an unauthorized-action vector.** Same surface as typing `/browse` in chat — both write to `pendingChatPrefill` and switch tabs; no patches applied, no LLM call, no DB writes beyond the (sanitized) kv prefill. Reviewer's instinct is correct: ack only.
- **A4: example_prompts re-seed correctly clears the old CHECK-constrained corpus on import.** SQLite's `DELETE FROM` does NOT re-validate CHECK constraints (CHECK only fires on INSERT/UPDATE), so old rows with deprecated categories are removed cleanly even when the new build's CHECK has 9 categories vs. an old export's 6. `INSERT OR REPLACE` then re-establishes the canonical 42-row corpus. Verified by reading 001-example-prompts.sql:48 + exportImport.ts:177-183.
- **A5: SENSITIVE_TABLE_OPS coverage is current for P37.** No new migrations in P37 (confirmed by sentinel test passing on the existing 001 baseline). The sentinel canary (tests/p23-sentinel-table-ops.spec.ts:68-86) will fail loudly the moment a future migration adds a sensitive-named column to a non-listed table. Mechanism is sound; nothing to add now.
- **A6: redactKeyShapes ordering at keys.ts:99-106 is correct.** Longest-prefix-first staircase (sk-ant → sk-proj → sk-or → sk- catchall → AIza → Bearer) prevents partial-match leaks. The Bearer rule at the end is positionally safe because earlier rules can't consume the literal `Bearer ` token.

## Score
92/100

**Breakdown:**
- BYOK leak symmetry across 4 persist surfaces: 24/25 (-1 for L1/L2 regex drift)
- SENSITIVE_TABLE_OPS coverage + sentinel canary: 20/20
- Import lock (example_prompts + user_templates re-seed/truncate): 20/20
- Audit-trail completeness (llm_logs): 13/15 (-2 for A2 command-route gap)
- Defensive-coding hygiene (clamps, type guards, length bounds): 15/20 (-5: assumptionStore caps but uiStore + listen don't share the cap constant)

**Verdict rationale:** No criticals, no high-severity findings, no MUST-FIX. Two LOWs are regex-symmetry hygiene worth resolving in a P38 fix-pass commit (≤30 min). The audit-gap acknowledgment (A2) is real but defensible at MVP scope — commands are zero-cost deterministic routes.
