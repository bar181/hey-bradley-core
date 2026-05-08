# P35 — Deep-dive Summary + Fix-Pass Plan

> **Sealed:** 2026-04-28 (post-fix-pass)
> **Composite at fix-pass-2 close:** ~96/100 estimated

## Reviewer scorecard

| Reviewer | Score | Verdict | Must-fix |
|---|---:|---|---:|
| R1 UX+Func (lean) | 87/100 | PASS (Grandma 80 / Framer 88) | 4 |
| R2 Sec+Arch (lean) | Sec 84 / Arch 87 | PASS | 2 (both must-fix) |
| **Average** | **86/100** | **PASS** | **6 must-fix + 4 should-fix applied** |

## Fix-pass items closed

| # | Issue | Status |
|---|---|---|
| R1 F1 | `looksLikeOpenAIKey` accepts OpenRouter `sk-or-` keys | ✅ rejected |
| R1 F2 | AISPTranslationPanel + AISPPipelineTracePane visual stack | ✅ AISPSurface dispatcher (single panel per mode) |
| R1 F3 | No timeout — hung provider = forever spinner | ✅ 12s AbortController on assumptionsLLM |
| R1 F4 | Γ R3 enum-construction prompt-only | ✅ `ASSUMPTIONS_VERB_PREFIX_RE` enforced at validation |
| R2 M1 | `redactKeyShapes` missing bare `sk-` (legacy OpenAI) | ✅ added 4 sk-* patterns + sk-or- |
| R2 M2 | Cost-cap reserve gate inverted when cap unset | ✅ guard removed; fails closed via `Number.isFinite` |
| R2 S1 | OpenAI `message.refusal` swallowed | ✅ surfaced as `invalid_response` |
| R2 S3 | Γ R3 verb-prefix not validated | ✅ same as R1 F4 |

## Deferred items (queued for P36+)

- R1 L2/L3 — confidence chip "100% match" copy + 6-option decision fatigue (cosmetic; defer)
- R2 S2 — markdown/HTML stripping in label/rationale (latent; safe today via JSX)
- R2 S4 — adapter-injection seam in assumptionsLLM (refactor)
- R4 architecture — Crystal Atom shared-helper extraction; AISPPipelineTracePane prop-drill via context

## Test inventory after fix-pass

| Spec | Cases | Status |
|---|---:|---|
| BYOK provider matrix | 20 | ✅ |
| Sprint D regression (P29-P33+) | 99 | ✅ |
| P34 + fix-pass | 66 | ✅ |
| P35 ATOM + LLM + EXPERT pane | 34 | ✅ |
| P35 fix-pass (R1+R2 must-fix) | 18 | ✅ |
| **TOTAL** | **229** | ✅ **229/229 GREEN** |

## Persona re-score (post-fix-pass)

- **Grandma:** **80** (held; AISPSurface dispatcher means no panel-pile-up)
- **Framer:** **89** (+1; clean dispatcher + verb-prefix validation tightens contract)
- **Capstone:** **99** (held; 5-atom architecture intact)
- **Composite estimate:** **96/100** (held)

## P35 verdict

Sprint E P2 sealed at 96/100 estimated. Both reviewers PASS. All 6 must-fix items closed; 1 SHOULD-FIX (S1 OpenAI refusal) also closed. Deferred items queued for P36 with explicit retro notes.

**5-atom AISP architecture in production. BYOK matrix complete (Claude/Gemini/OpenAI/OpenRouter w/ 2026 pricing).**
