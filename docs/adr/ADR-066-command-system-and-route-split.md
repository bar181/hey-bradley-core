# ADR-066: Unified Command System + Content / Design Route Split

**Status:** Accepted
**Date:** 2026-04-28 (P37 Sprint F P2)
**Deciders:** Bradley Ross
**Phase:** P37

## Context

P36 (ADR-065) closed the Listen-Chat surface gap: voice and text now share every AISP UX touchpoint (clarification card, AISP chip, accepted-assumption persistence, review-first gate). With surface parity in place, P37's owner-stated bottleneck surfaced two adjacent problems:

1. **The user already knows what they want, but the chat pipeline still runs the full INTENT → SELECTION → PATCH chain.** Power users want a deliberate bypass — "open the template browser" should not need to be classified by an LLM.
2. **Content updates via LLM are slow; design updates via JSON-Patch are fast.** The current `chatPipeline` treats every input the same — both routes funnel through the LLM patch path even when no copy generation is needed.

Both problems are upstream of the existing 5-atom architecture. They need a gate, not a new atom.

## Decision

### Command Trigger Surface (A1 — `src/contexts/intelligence/commands/commandTriggers.ts`)

A single pure function `parseCommand(text): CommandTrigger | null` runs **before** the AISP intent classifier in both `ChatInput.handleSend` and `ListenTab.submitListenFinal`. Returns a typed discriminated union (`browse | apply-template | generate | design | content | hide | show`); host components own dispatch.

Slash forms (`/browse`, `/template <name>`, `/generate`, `/design`, `/content`, `/hide`, `/show`) are unambiguous and case-insensitive. A small whitelist of voice phrasings (`"browse templates"`, `"apply template <name>"`, `"generate content"`, `"design only"`, `"content only"`) is whole-input matched — token-boundary anchored to avoid false-positives inside prose. `COMMAND_TRIGGER_LIST` is the public help-surface manifest.

### Content / Design Route Classifier (A2 — `src/contexts/intelligence/aisp/routeClassifier.ts`)

`classifyRoute(intent, text): { route, rationale }` where `route ∈ {content, design, ambiguous}`. Pure-rule, $0, idempotent. Decision order:

1. Explicit content verbs (`rewrite | regenerate | reword | rephrase`) → **content**
2. Generic verb (`change | update | set | make`) + copy-noun target (`headline | body | tagline | …`) → **content**
3. Design cue phrase (`theme | dark mode | colour | layout | brighter | …`) → **design**
4. Explicit design verb (`hide | show | add | remove | reset | brighten | …`) → **design**
5. Bare `change/update` with no signal in either direction → **ambiguous**
6. Default → **design** (backward-compat with pre-P37 LLM-patch path)

Wired into `chatPipeline.submit()` after AISP classification, gating downstream behaviour without changing the existing fall-through to LLM patch.

### Why both ship together

Commands give users a **deliberate** bypass — "I know what I want; don't classify me." The route classifier provides an **automatic** split — "I'm asking for content; don't waste latency on the design path." Together they form one upstream gate: the chat pipeline asks first whether the input is a command (skip atoms entirely), then classifies the route (decide which atom chain to run). Shipping them independently would leave one bottleneck in place.

### Σ-restriction discipline carried forward

Neither module mutates the existing Crystal Atoms; both are pure pre-classifiers that emit typed discriminators. `parseCommand` is whole-input only (no embedded matches → no surprise dispatches). `classifyRoute` is rule-based (zero LLM cost; no hallucination surface). Both are reachable via the existing `@/contexts/intelligence/aisp` barrel for a single import path on every consuming surface.

## Trade-offs accepted

- **Rule-based now; LLM-driven later.** P38+ may swap an LLM into `classifyRoute` when rule-based confidence is low, mirroring the AISP rule→LLM lift pattern (P26 → P27, P34 → P35). The rule path stays as the safety floor.
- **Ambiguous → ASSUMPTIONS_ATOM (P38 wiring).** When `route='ambiguous'` the immediate behaviour is fall-through to the existing LLM patch path; the user is not blocked. Sprint F P3 will wire ambiguous → ASSUMPTIONS_ATOM clarification.
- **Voice command vocabulary is intentionally small.** Only 5 voice phrasings are whitelisted at P37; we want zero false-positive captures of NL prose. New aliases require `COMMAND_TRIGGER_LIST` updates + a regression test.
- **Commands skip atoms entirely.** A `/browse` command does NOT generate an INTENT_ATOM trace, an AISP chip, or an audit row. This is deliberate — commands are the user's explicit shortcut around the atom pipeline. The trade is a small gap in the EXPERT trace pane on command-driven turns; acceptable given the latency win.
- **Backward-compatible default.** Unrecognised input → `route='design'` so all P15–P36 demos continue to land on the existing LLM-patch path with no behaviour change.

## Consequences

- (+) Power users have a deliberate latency-free path to template browsing + content/design scoping
- (+) Voice and chat consume the SAME `parseCommand` — surface parity from ADR-065 carries forward to commands
- (+) Content path is now identifiable upstream; P38 can route it through CONTENT_ATOM directly without re-parsing
- (+) Ambiguous bucket gives ASSUMPTIONS_ATOM a clear trigger contract (Sprint F P3 candidate)
- (+) Composite expected to climb on Framer (architectural separation) + Capstone (clear research-bottleneck framing)
- (-) Two new modules + a barrel-export edit; ~270 LOC total (well within ≤300 budget)
- (-) Commands skip atoms → minor gap in EXPERT trace pane on command turns (mitigated: command type appears in the reply banner)

## Cross-references

- **ADR-045** — system-prompt PATCH_ATOM; commands skip the LLM entirely
- **ADR-050** — Template-First Chat Architecture; `/browse` opens that registry; `apply-template` invokes its router
- **ADR-051** — Section Targeting Syntax (`/hero-1` etc.); commands run upstream of scope parsing
- **ADR-053** — INTENT_ATOM (Crystal Atom verb/target/params); commands run BEFORE this gate
- **ADR-057** — SELECTION_ATOM (template selection); design route lands here
- **ADR-060** — CONTENT_ATOM (copy generation); content route will land here at P38
- **ADR-064** — ASSUMPTIONS_ATOM; ambiguous route is its trigger contract
- **ADR-065** — Listen + AISP unification; surface parity that this ADR extends with commands

## Status as of P37 seal

- `parseCommand` shipped + wired in ChatInput (A1) ✅
- `classifyRoute` shipped + wired in chatPipeline (A2) ✅
- `aispRoute` field surfaced on `ChatPipelineResult` (A2) ✅
- ADR-066 full Accepted ✅
- ≥10 PURE-UNIT integration tests covering bridge composition + 33/35 prompt coverage gate ✅
- Build green; tsc clean; backward-compat with all P15–P36 ✅
