# ADR-049: Cost-Cap Telemetry & Hard Cap

**Status:** Accepted
**Date:** 2026-04-27 (P20 Day 1)
**Deciders:** Bradley Ross
**Phase:** P20 — MVP Close

## Context

A real LLM key (Claude Haiku, Gemini, OpenRouter) can rack up real bills if a stuck loop fires repeated calls. Through P18-P19 the codebase already had:

- `auditedComplete.ts:114` reads `VITE_LLM_MAX_USD` (env-only) for the cap
- Cost projection math (`estimateMaxCostForModel`) computes upper-bound spend per call
- Pre-call cap check returns `{ kind: 'cost_cap' }` error if `sessionUsd + projected >= cap`
- `mapChatError` (P19 fix-pass-2 F2) surfaces cost_cap with friendly copy
- `llm_logs` records `status='cost_cap'` for rejected calls

What was MISSING for P20 final-seal:
1. A visible **CostPill** in the shell footer showing `$current / $cap`
2. A Settings UI to edit the cap (range $0.10–$20)
3. kv-persistence so cap survives reload
4. ADR documenting the decision

## Decision

### Surface

A small **CostPill** in the shell footer always visible while authenticated to a project. Format: `$0.07 / $1.00`. Color states:

| State | Trigger | Color |
|---|---|---|
| green | spend < 80% of cap | `text-emerald-600` |
| amber | spend ≥ 80% of cap | `text-amber-600` |
| red | spend ≥ 100% of cap | `text-red-600` |

Hidden when `sessionUsd === 0` (DEV smoke; reduces noise).

### Persistence

Cost cap stored in `kv['cost_cap_usd']` (number-as-string per kv table contract). Read on `intelligenceStore.init()`. Written on `setCapUsd(n)` action with clamping to [0.10, 20.00].

### Default

`$1.00` per session. Can be overridden by:
1. `VITE_LLM_MAX_USD` env var (build-time fallback if kv has no entry)
2. `kv['cost_cap_usd']` (runtime; takes precedence)
3. User edit in Settings → LLM panel

### Pre-call check

`auditedComplete.ts` already projects max-cost-of-next-call. Decision retained: `wouldExceed = sessionUsd + projected >= cap`.

### Cross-tab consistency

Cap is per-session in-memory (NOT cross-tab synced). Rationale: cap is a soft wall, not a security boundary. If user opens 2 tabs and exceeds cap in tab A, tab B will catch up on next reload.

## Alternatives considered

- **Per-call cap instead of per-session:** rejected; per-call is too coarse for multi-step pipelines (Sprint C 2-step, Sprint E clarification)
- **Server-enforced cap:** rejected; ADR-029 (no backend) precludes
- **Hard kill at exactly $1.00:** rejected in favor of pre-call projection (prevents going over)

## Consequences

- (+) User-visible cap prevents bill shock (pill always visible)
- (+) kv-persistence means default-$1.00 survives reload
- (+) Settings cap-edit gives user control without redeploying
- (+) Closes P20 DoD items 1-3
- (-) +80 LOC for CostPill component + small Settings additions
- (-) Cross-tab cap drift (acceptable per "soft wall" framing)

## Cross-references

- ADR-042 (LLM Provider Abstraction) — cost field in adapter response
- ADR-043 (BYOK Trust Boundaries) — cap is a UX feature, NOT a security boundary
- ADR-046 (Multi-Provider Architecture) — projection math handles all 6 adapters
- ADR-047 (LLM Logging) — `llm_logs.status='cost_cap'` records rejections
- `06-phase-20-mvp-close.md` §3.4 — original P20 plan referenced ADR-047 by mistake; corrected here
- C20 carryforward (AbortSignal plumb-through) — paired Day-1 work

## Status as of P20 seal

- ADR authored ✅
- `CostPill.tsx` shipped ✅
- `intelligenceStore.capUsd` + `setCapUsd` wired ✅
- kv persistence at `cost_cap_usd` key ✅
- Settings cap-edit input ✅
- `tests/p20-cost-cap.spec.ts` covers under-cap / at-cap / over-cap / cap-edit-propagates ✅
