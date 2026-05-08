# Phase 26 — Preflight 00 Summary

> **Phase title:** Sprint C Phase 1 — AISP Instruction Layer
> **Status:** PREFLIGHT (activates post-P25 seal; Sprint C kickoff)
> **Successor of:** P25 (Sprint B P3 — Intent Translation; Sprint B closes at composite 88/100)
> **Successor:** P27 (Sprint C P2 — AISP Intent Pipeline)

## North Star

> **The AISP Crystal Atom classifies user intent BEFORE the rule-based translator. When AISP is confident (≥0.85), its classification wins; otherwise the P25 rule-based pipeline runs as fallback. Both paths converge on the same Template registry.**

## Sprint B → Sprint C transition

Sprint B (P23-P25) shipped:
- Template registry + router (P23)
- /type-N scope tokens (P24)
- Rule-based intent translation (P25)

Sprint C (P26-P28) extends this with AISP awareness. The pipeline becomes:

```
user input
  ↓
AISP Crystal Atom intent classifier        ← NEW (P26)
  ├── confidence ≥ 0.85 → emit { intent, scope, params }
  │     ↓
  │   tryMatchTemplate(constructedCanonical)   ← P23+P24 unchanged
  └── confidence < 0.85 → fall through to:
       ↓
     translateIntent (P25 rule-based)
       ↓
     tryMatchTemplate(canonicalText)
       ↓
     LLM fallthrough (P18)
```

## Scope IN (P26 Phase 1 only)

- **AISP intent classifier module** that consumes user text → produces structured `{ intent, scope, params, confidence }`
- **Crystal Atom for intent grammar** — defines verb vocabulary + scope syntax + param shapes per AISP spec (`bar181/aisp-open-core ai_guide`)
- **Pre-template integration**: AISP classifier runs BEFORE P25 translator; on high-confidence emit, constructs canonical text for the template router; on low-confidence, defers to P25
- **Single-LLM-call classifier** OR **rule-based AISP grammar parser** (decision at P26 kickoff): prefer rule-based for $0 cost; fall back to LLM only if rule-based confidence < 0.85
- **ADR-053** (AISP Intent Classifier) full author
- **+5 pure-unit Playwright cases** (regex grammar parser; AISP atom shape; high-confidence path; low-confidence fallback to P25)

## Scope OUT (P27 + P28 work)

- Multi-step pipelines (Sprint C P27 — AISP intent pipeline with 2-step LLM calls)
- 2-step template selection (Sprint C P28 — theme-pick AISP-scoped → modify with full chat context)
- Cost-cap math for AISP-only calls (defer; today's per-session cap covers it)
- Multi-intent in one prompt ("hide hero AND change footer") — Sprint D

## Effort estimate

- ~30m AISP grammar parser (rule-based; mirrors P25 intent translator's data-as-table pattern)
- ~30m Crystal Atom for intent (verb+scope+param schema; 1 page of AISP)
- ~15m chatPipeline integration
- ~30m ADR-053 + 5 unit tests
- ~15m retro + seal
- **Total: ~2h** (vs original 4-6 day estimate; ~24-48× faster at velocity)

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `src/contexts/intelligence/aisp/intentAtom.ts` | NEW | Crystal Atom for intent (Ω Σ Γ Λ Ε structure per AISP) |
| `src/contexts/intelligence/aisp/intentClassifier.ts` | NEW | `classifyIntent(text)` → `{ intent, scope, params, confidence }` |
| `src/contexts/intelligence/aisp/index.ts` | NEW | barrel export |
| `src/contexts/intelligence/chatPipeline.ts` | EDIT | call AISP classifier BEFORE P25 translator |
| `docs/adr/ADR-053-aisp-intent-classifier.md` | NEW | full Accepted |
| `tests/p26-aisp-intent.spec.ts` | NEW | 5+ pure-unit cases |

## DoD

- [ ] Crystal Atom for intent (Ω Σ Γ Λ Ε structure; cross-link to bar181/aisp-open-core)
- [ ] `classifyIntent(text)` returns `{ intent, scope, params, confidence }` shape
- [ ] Confidence threshold 0.85 (slightly higher than template router's 0.8 — AISP wins precedence when it's confident)
- [ ] chatPipeline runs AISP classifier BEFORE P25 translator; falls through gracefully
- [ ] Backward compat: P23+P24+P25 tests unchanged
- [ ] +5 pure-unit Playwright cases
- [ ] ADR-053 full Accepted
- [ ] Build green; tsc clean
- [ ] Retro + STATE + P27 preflight

## Composite target

- Grandma 76+ (held; AISP path is invisible)
- Framer 87+ (held; cost-skip rate slightly improved)
- Capstone 93+ (+1 from P25; AISP-in-action is the **Capstone thesis demonstration**)
- **Target: 88-89/100**

## Capstone significance

Sprint C is where AISP becomes user-visible (Sprint B was infrastructure). The Crystal Atom intent classifier IS the proof of the AISP thesis: a math-first symbolic vocabulary that LLMs understand natively. P26 is the "show, don't tell" moment for the capstone panel.

## Carryforward into P26 (unchanged from P25)

- C04 ListenTab split, C17 Zod helper, C15 import lock, C16 migration FK
- C11/C12 cosmetic (P22 carries)
- Vercel deploy (owner-triggered)

## Cross-references

- P25 retrospective: `phase-25/retrospective.md`
- ADR-050 (Template-First Chat — sealed P23)
- ADR-051 (Section Targeting Syntax — sealed P24)
- ADR-052 (Intent Translator — sealed P25; P26 supersedes via AISP classifier)
- ADR-053 (AISP Intent Classifier — to be authored at P26)
- `bar181/aisp-open-core ai_guide` — Crystal Atom canonical spec source
- `src/contexts/intelligence/prompts/system.ts` — existing AISP usage in system prompt (P18)

---

**Phase 26 activates immediately on owner greenlight.** Sprint C kickoff.
