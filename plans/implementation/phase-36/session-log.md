# Phase 36 — Session Log (Sprint F P1 — Listen + AISP Unification)

> **Sealed:** 2026-04-28
> **Composite (estimated, pre-review):** 96/100 (held vs P35; UX surface improvement targets Grandma climb)
> **Sprint F P1.**

## Wave 1 — Listen + AISP Pipeline Unification

### A1 Listen + Intent Pipeline (full AISP unification) ✅
- ListenTab `runListenPipeline` extracted from old `submitListenFinal`
- Captures `result.aisp.intent` + `result.templateId` for new banner chip
- `setPttAisp({ verb, target, templateId })` drives the chip rendered alongside reply
- Voice clarification: when `shouldRequestAssumptions(result.aisp.intent)` → calls `generateAssumptionsLLM` (P35) → renders `ListenClarificationCard` instead of pttReply banner
- Accepted assumption persists via `recordAcceptedAssumption` (P34) and re-feeds `runListenPipeline(rephrasing)`

### A2 Listen Review Mode ✅
- NEW `src/components/left-panel/listen/ListenReviewCard.tsx` (~85 LOC)
  - "Heard / Will" preview card with Approve / Edit / Cancel
  - role=region + aria-live="polite" for SR users
  - focus-visible rings on all 3 buttons (a11y)
  - Low-confidence hint when intent confidence < 0.7
- NEW `src/components/left-panel/listen/listenActionPreview.ts` (~60 LOC)
  - Pure-rule classifier wrapper (no LLM call); `<1ms` cost
  - Verb labels capitalized; target types pulled from INTENT_ATOM enum
  - Generic fallback "Run the chat pipeline on this transcript." when no target
- `submitListenFinal` rewritten: NO auto-fire. Sets `pttReview` state instead.
- 3 new handlers: `handleListenApprove` (fires runListenPipeline) / `handleListenEdit` (hand-off to chat tab) / `handleListenCancel` (discards)
- NEW `uiStore.pendingChatPrefill` field + `setPendingChatPrefill` + single-shot `consumePendingChatPrefill` consumer
- ChatInput consumes prefill on mount via useEffect; transcript flows seamlessly Listen → Chat tab

### A1+ Voice Clarification Card ✅
- NEW `src/components/left-panel/listen/ListenClarificationCard.tsx` (~70 LOC)
  - Mirrors P34 ClarificationPanel UX (3 ranked buttons + "say it again" escape)
  - Dark-background styling matched to ListenTab
  - Confidence chip renders "X% match" (P34 fix-pass copy alignment carried forward)

## Wave 2 — ADR + Tests (A3) ✅

### ADR-065 ✅
- `docs/adr/ADR-065-listen-aisp-unification.md` full Accepted (~85 lines)
- Documents review-first voice UX rationale (ASR-mistranscription error model differs from text)
- Edit hand-off pattern via `pendingChatPrefill`
- Rule-classifier preview source (cost: ~$0)

### Tests ✅
- `tests/p36-listen-enhanced.spec.ts` — **26 PURE-UNIT cases GREEN first-pass**
  - 5 buildActionPreview tests (high/low confidence, verb labels, value extraction, never-null)
  - 4 ListenReviewCard component tests (3 buttons + a11y + heard/will + focus rings)
  - 4 ListenClarificationCard tests (3 options + escape + confidence chip + null-empty)
  - 8 ListenTab review-first wiring tests (imports + state machine + handlers)
  - 3 uiStore.pendingChatPrefill round-trip tests
  - 2 ADR-065 + **31/35 prompt coverage gate met** (gate raised from P35's 28/35)

## Verification

| Check | Status | Detail |
|---|---|---|
| `npm run build` | ✅ PASS | clean |
| BYOK matrix (20) | ✅ |
| Sprint D regression (99) | ✅ |
| Sprint E P34 (66) | ✅ |
| Sprint E P35 + fix (52) | ✅ |
| **Sprint F P36 new (26)** | ✅ |
| **Cumulative** | ✅ **255/255 GREEN** |

## Persona re-score (estimated)

- **Grandma:** **81** (+1 vs P35 80; review-first voice = trust delta — "Bradley shows me what he heard before doing it")
- **Framer:** **89** (held; voice + text now share every AISP UX surface — same pattern, two surfaces)
- **Capstone:** **99** (held; 5-atom architecture extends across both modalities; capstone-thesis exhibit broadens)
- **Composite estimate:** **96/100** (held; brutal review + persona walk firm up)

## P36 DoD final accounting

| # | Item | Status |
|---|---|---|
| 1 | Listen → AISP pipeline (intent + clarification + assumptions) | ✅ |
| 2 | Listen review mode (Approve/Edit/Cancel before fire) | ✅ |
| 3 | Edit hand-off to ChatInput via pendingChatPrefill | ✅ |
| 4 | ADR-065 full Accepted | ✅ |
| 5 | ≥6 PURE-UNIT tests | ✅ (26) |
| 6 | 31/35 prompt coverage gate | ✅ |
| 7 | Build green; backward-compat | ✅ |
| 8 | Seal + P37 preflight | ✅ |

## Effort actuals

| Activity | Est | Actual | × |
|---|---:|---:|---:|
| ListenReviewCard + ListenClarificationCard | 30m | ~12m | 2.5× |
| listenActionPreview helper | 10m | ~4m | 2.5× |
| ListenTab refactor (review-first) | 45m | ~15m | 3× |
| uiStore.pendingChatPrefill + ChatInput consumer | 15m | ~5m | 3× |
| ADR-065 | 20m | ~8m | 2.5× |
| 26 tests | 30m | ~10m | 3× |
| Seal artifacts | 15m | ~10m | 1.5× |
| **Total P36** | 2.75h | **~65m** | **~2.5×** |

## Successor

**P37 — Sprint F P2 (Command Triggers + LLM-Call Audit + Content-Route Research).** Per owner mandate added at P36 seal: review every user input + logic flow; produce a full document outlining every LLM call + template; investigate command triggers (e.g., user types "hero" → skip intent classifier, go straight to hero LLM call); evaluate content-route alternatives (separate option/command/toggle for content vs design). Research-first phase.

P36 SEALED at composite **96/100** (estimated). 5-atom AISP architecture now spans BOTH chat + voice surfaces.
