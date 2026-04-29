# Phase 52 — Preflight 00 Summary

> **Phase title:** Sprint J P3 — Conversation Log + Share Spec
> **Status:** PREFLIGHT
> **Successor of:** P51 (Picker UI + Onboarding step + chat-bubble styling; sealed at composite TBD)
> **Locked plan:** `plans/implementation/sprint-j-personality/03-sprint-j-locked.md` §P52

## North Star

> **Make the build inspectable + shareable.** Every prompt + AI reply visible
> in an EXPERT-mode Conversation Log (joined `chat_messages` ⨝ `llm_logs`). One
> click copies the full spec (North Star + SADD + AISP) as a data-URL to the
> clipboard. ZERO Σ widening (preserved across P50/P51/ADR-073/ADR-074). Privacy
> discipline: `redactKeyShapes` runs at the export boundary (ADR-067).

## Scope IN — 3 parallel agents (per `03-sprint-j-locked.md` §P52)

### A7 — ConversationLogTab + tab registration + MD/JSON exporters
- NEW `src/components/center-canvas/ConversationLogTab.tsx` (≤300 LOC; filter by session / personality / provider; export MD + JSON; expert-only)
- `src/store/uiStore.ts` (add `'CONVERSATION_LOG'` to `ActiveTab` enum; ≤10 LOC delta)
- `src/components/center-canvas/TabBar.tsx` (register tab; expert: true; ≤15 LOC delta)
- `src/components/center-canvas/CenterCanvas.tsx` (render branch; ≤10 LOC delta)
- NEW `src/contexts/specification/conversationLogExport.ts` (MD + JSON exporters; ≤120 LOC)

### A8 — ShareSpecButton + clipboard data-URL bundle
- NEW `src/components/shell/ShareSpecButton.tsx` (≤140 LOC; one-click toast confirmation; viral mechanic)
- `src/components/shell/ChatInput.tsx` (mount above input on desktop; ≤10 LOC delta)
- NEW `src/contexts/specification/shareSpecBundle.ts` (compose North Star + SADD + AISP; base64-encode; ≤80 LOC; MUST call `redactKeyShapes` at export boundary)

### A9 — ADR-075 + ~20 tests
- NEW `docs/adr/ADR-075-conversation-log-and-share.md` (≤120 LOC; cross-ref ADR-040 + ADR-045 + ADR-067 + ADR-073)
- NEW `tests/p52-log-and-share.spec.ts` (~20 cases — tab registration + ActiveTab enum + MD/JSON export shape + ShareSpecButton testid + clipboard call site + `redactKeyShapes` invocation at export boundary + privacy guard for BYOK keys)

## Scope OUT (P53 / Sprint J Wave 4)

- Mobile UX bifurcation — 3-tab mobile experience without desktop builder (P53 / A10+A11+A12)
- Sprint J close + 4-reviewer brutal review + presentation readiness gate (P53 EOP)

## Carryforward INTO P52 (from P51)

- **ADR-074 "Status as of P51 seal" backfill** — at P51 seal commit; A6's TBD markers replaced with final composite score.
- **Cumulative regression must be GREEN before P52 dispatches.** (P51 spec is 15/15 GREEN; tsc clean.)

## DoD

- [ ] A7 ConversationLogTab visible only in EXPERT mode + MD/JSON export buttons functional
- [ ] A8 ShareSpecButton mounted above ChatInput on desktop + clipboard call returns data-URL with `redactKeyShapes` evidence
- [ ] A9 ADR-075 ≤120 LOC, full Accepted, cross-refs ADR-040 + ADR-045 + ADR-067 + ADR-073
- [ ] A9 `tests/p52-log-and-share.spec.ts` ~20 cases GREEN
- [ ] tsc clean; full Sprint J cumulative regression GREEN
- [ ] STATE.md row + CLAUDE.md roadmap updated; P52 seal commit + P53 preflight scaffold

## Composite target: 93+ (Sprint J seal-gate per D9)

## Cross-references

- ADR-073 (P50; engine + composition; locked Option B)
- ADR-074 (P51; picker + onboarding; this preflight's upstream)
- ADR-040 (kv repository — joined `chat_messages` ⨝ `llm_logs` query seam)
- ADR-045 (PATCH_ATOM Σ — share-spec MUST NOT widen)
- ADR-067 (Sprint H export-strip discipline + `redactKeyShapes` precedent for Share Spec)
- `03-sprint-j-locked.md` §P52 agent table

P52 activates on P51 seal greenlight + cumulative regression GREEN.
