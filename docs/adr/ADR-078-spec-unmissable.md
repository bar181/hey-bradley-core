# ADR-078: Spec Unmissable — AISP Always-On + Auto-Open + Primary Tab

**Status:** Accepted
**Date:** 2026-04-29
**Deciders:** Bradley Ross
**Phase:** P55

## Context

Sprint L Wave 1 ships moat priority #2 from the open-core moat roadmap
(`plans/strategic-reviews/open-core-moat-roadmap.md`): **make the spec
unmissable**. The 2026-04-29 product evaluation flagged this as the single
most-important fix in the entire moat sequence — the AISP thesis is
invisible to default users because Geek mode is opt-in. Lovable hides the
plan; Framer hides the plan; Hey Bradley shows it on every reply by default,
and the spec panel auto-opens the first time a patch lands.

Sprint J P50/P51 made personality-mode and AISP visible *only* in Geek mode.
Sprint L closes that gap: every reply, every personality, every successful
patch surfaces the AISP trace so the reviewer-or-grandma sees the moat without
prompting.

## Decision

### AISP trace always-on (`AISPTranslationPanel.tsx`)

DRAFT mode shows `I understood: [verb] [target]` as a single muted pill
rendered above any `{open && (...)}` collapse block — testid
`aisp-trace-always-on`. EXPERT mode keeps the FULL Crystal Atom inline trace
(`Ω` / `Σ` / `Γ` / `Λ` / `Ε`) plus rationale. No mode toggling required to
see the thesis; Geek personality still owns the deepest classification text.

### Atom light-up animation (CSS-only)

During pipeline execution the chip applies a Tailwind `transition` +
`animate-pulse` (or `duration-*`) variant to surface the 5-atom sequence
(PATCH → INTENT → SELECTION → CONTENT → ASSUMPTIONS). Pure CSS — no JS
animation library added by Sprint L. The `framer-motion` dep already in
`package.json` (pre-P55, used elsewhere) is not consumed by the new code;
no new `react-spring` or other animation deps. KISS dep guard.

### Spec panel auto-open on first patch

`uiStore` gains `specPanelHasAutoOpened: boolean` + `markSpecAutoOpened()`
action, persisted to kv as `ui_spec_panel_auto_opened`. `CenterCanvas`
listens for the first successful PATCH_ATOM apply per session; on first hit
it calls `setActiveTab('XAI_DOCS')` and `markSpecAutoOpened()`. One-shot —
the user can re-collapse and we respect that. No auto-popup on subsequent
patches.

### Spec promoted to primary EXPERT tab

`TabBar.tsx` reorders the EXPERT tab array so `XAI_DOCS` lands ABOVE `DATA`
(was: Preview / Blueprints / Resources / Data / Pipeline → now: Preview /
Blueprints (XAI_DOCS) / Data / Resources / Pipeline). Inside `XAIDocsTab`
the human-readable spec rendering is the default sub-tab; raw JSON moves to
a sub-tab.

### "Spec updated" indicator

When the spec content changes since the user last viewed the tab,
`uiStore.specHasUnseenUpdate` flips true and `TabBar` renders a
`spec-unseen-indicator` testid pill next to the XAI_DOCS label. Cleared on
tab activation.

## Trade-offs

- **Friction risk on auto-open.** Could feel intrusive. Mitigated by
  one-shot-per-session — once dismissed, never re-pops. MAYBE gate by
  personality (Coach/Geek = auto-open, Pro = quieter) — deferred per locked
  KISS; revisit at fix-pass if persona scoring drops.
- **Geek mode differentiator preserved.** Default mode shows the simplified
  `I understood: [verb] [target]` pill; Geek keeps the FULL Crystal Atom
  detail (`[Ω→change Σ→hero @ 0.92] · {rationale}`). Geek's value-add is
  the depth, not the visibility.
- **No Σ widening.** Trace reads from `result.aisp` already populated by
  P34/P35. Composition pattern from ADR-073 holds. PATCH_ATOM Σ untouched.
- **CSS-only animation budget.** Tailwind `transition` + `animate-pulse`
  ship for free; no new deps. ≤800ms total settle so the animation feels
  informative, not gimmicky.

## Consequences

- (+) Thesis legible to reviewers without mode toggling — addresses
  `2026-04-29-product-evaluation.md` §"What's broken" #1.
- (+) Auto-open creates a wow-factor first-patch moment — moat #2 visible.
- (+) Geek mode keeps its differentiator — full classification text only
  there. Re-score during fix-pass to confirm Geek persona did not regress.
- (+) Spec promoted to PRIMARY EXPERT tab + unseen-update indicator means
  capstone reviewers can find the spec without explanation.
- (-) Two new uiStore fields (`specPanelHasAutoOpened`,
  `specHasUnseenUpdate`) widen the persisted UI envelope; mitigated by
  both being booleans with explicit kv keys.
- (-) Auto-open behavior is one-shot — users who clear localStorage will
  see the auto-open again on next session. Acceptable per D3.

## Cross-references

- **ADR-027** — XAI Docs panel; Sprint L promotes its parent tab to primary.
- **ADR-053** — INTENT_ATOM; the trace pill renders verb/target from
  `result.aisp` populated by INTENT_ATOM.
- **ADR-073** — P50 personality composition pattern; ADR-078 follows the
  same composition-not-mutation discipline — no Σ widening.
- **ADR-074** — Personality picker; Geek personality still owns the FULL
  Crystal Atom inline detail.
- **ADR-077** — Sprint K Wave 1 sibling pattern; render-layer / observability
  move on top of the Sprint C-D atom architecture.
- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe)
- `plans/implementation/phase-55/preflight/00-summary.md`

## Status as of P55 seal

- ADR-078 full Accepted
- AISPTranslationPanel always-on trace shipped (A1)
- Spec auto-open + primary-tab promotion shipped (A2)
- `tests/p55-spec-unmissable.spec.ts`: 15 PURE-UNIT cases
- No Σ widening; backward-compat with P19-P54 callers
