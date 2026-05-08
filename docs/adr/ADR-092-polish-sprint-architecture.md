# ADR-092 — Polish Sprint Architecture

- **Status:** Accepted
- **Date:** 2026-04-30
- **Phase:** P66 / Polish Sprint / Wave 1
- **Cross-refs:** ADR-087 (Design Token System), ADR-091 (Canonical Component Quality), ADR-088 (Mode Architecture), ADR-079 (Premium Templates)

## Context

The brutal-honest competitive review at OC-3 close scored library visual polish
at **6/10**. Decomposition: (a) **library template ceiling vs floor** — closed
at OC-2.5 + OC-2.5 Wave 2 (canonical Hero / Feature / Testimonial); (b) **per-
component quality bar** — closed at OC-2.5 Wave 2 (ADR-091); (c) **mode
framing in product narrative** — closed at OC-2 (ADR-088); (d) **SURFACE
polish across builder + onboarding + mobile + chat + listen + demo discovery**
— this sprint, P66 / Wave 1. Each of A1–A6 addressed one surface in parallel.
ADR-092 codifies the **5 enforceable polish standards** so future surfaces
(post-P66 polish work, AW-* agentic surfaces, OC-CLEANUP marketing pass)
follow the same bar without re-debating per surface.

## Decision — the 5 polish standards

1. **No-API-key demo discovery.** Every product surface that requires a real
   LLM key MUST also offer a scripted, self-contained demo path (fixture
   AgentProxy; no network). Demonstrated by A1 `ListenModeDemo` and A2
   `ChatModeDemo`; precedent for future agentic surfaces (Whiteboard,
   Planning, Agentics) when those land.

2. **First-run mobile path.** Mobile (<768px) first load MUST show a
   single-decision card before exposing the full UI; no tri-pane, no
   10-option grid, no desktop onboarding cold-start. Demonstrated by A3
   `MobileFirstRunCard` gated on the `mobile_first_run_seen` kv key.

3. **Mode framing precedence.** Welcome promises 3 modes; Onboarding
   first-run MUST present the same 3-mode choice (via `ModeSelectorCard`)
   BEFORE personality / project pickers. Demonstrated by A4 integrating
   the previously-standalone `ModeSelectorCard` into `Onboarding.tsx`.

4. **Library scale via filter UI.** Any library exceeding 12 entries MUST
   ship persona / industry / complexity filter UI; preview thumbnails
   REQUIRED for visual section types. Demonstrated by A5
   `TemplateBrowsePicker` (persona + industry filter pills, clear-filters
   affordance) and `QuickAddPicker` (`SectionThumbnail` helper).

5. **Personality affordance ≤ 1 click.** Personality picker access from
   chat AND listen surfaces MUST be ≤ 1 click; settings drawer access is
   preserved as a deeper surface. Demonstrated by A6 inline personality
   popover in `ChatInput.tsx` + `ListenTab.tsx` (Geek mode adds raw
   `INTENT_ATOM` footer; Teacher mode adds "Try:" suggestion chips).

## Quality bar (enforced by `tests/p66-polish-sprint.spec.ts`)

Every standard above has a corresponding PURE-UNIT assertion: file exists,
required exports present, design-token discipline preserved (no animation
libs imported in demos; `tokens` import asserted), and the surface-specific
contract (kv key for mobile; `MODE_HINT_COPY` table for onboarding;
`PERSONA_KEYWORDS` + `INDUSTRY_KEYWORDS` for template browser; etc.).
Future polish work adding new canonical surfaces extends the spec list.

## Bounded-context impact

Lives within the `ui-shell` bounded context (formalized per ADR-087 in
`docs/ddd/ui-shell-bounded-context.md`). Six new aggregates land:

- `ListenModeDemo` (A1) — demos sub-aggregate
- `ChatModeDemo` (A2) — demos sub-aggregate
- `MobileFirstRunCard` (A3) — mobile-shell sub-aggregate
- `ModeSelectorCard` integration (A4) — onboarding-flow sub-aggregate
- Filter UI (A5) — template-browser + quick-add sub-aggregates
- Inline personality popover (A6) — chat + listen surfaces

No cross-context dependencies introduced; all 6 aggregates consume the
existing `tokens` contract (ADR-087) and the canonical component bar
(ADR-091).

## Out of scope

- Backend / hosted multi-page / per-mode UI variants (waits for AW work)
- Marketing sub-page polish (deferred to OC-CLEANUP — Welcome partials,
  OpenCore, AISP, Research, About, HowIBuiltThis, Docs, BYOK CTAs)
- LLM banner consolidation into a unified mode-hint banner (deferred
  follow-up; A4 left LLM banner standalone for this wave)
- ChatInput LOC decomposition (carried forward — file is 1013 LOC after
  A6's +46 popover addition; needs sub-component split in a future sprint)
- Section-editor collapse-by-default sweep across the OTHER 17 editors
  (A5 demonstrated the pattern in `SectionSimple.tsx`; sweep deferred)

## Consequences

**Positive.** Visual polish 6 → 7.5+ across surfaces (per A7 post-review
aggregate). Future agentic surfaces inherit the 5 standards by reference
to ADR-092. Reviewer-impression and competitive-score sub-metrics both
move because the surfaces a first-time visitor touches first (Welcome →
Demo → Onboarding → Builder) are now coherently polished. The standards
are mechanical (file presence + key API + token import), so drift is
caught by the spec, not by hand-review.

**Negative.** Ongoing maintenance discipline required. Carry-forward debt
(ChatInput decomposition, section-editor collapse sweep, marketing
sub-page CTA consistency, LLM banner consolidation) enumerated in
`plans/implementation/phase-66/retrospective.md` and re-budgeted at the
opening of the next polish sprint.

**Mitigations.** The static-check rule is mechanical (FS read + regex);
adding new canonical surfaces is additive — extending the test spec's
surface-file list keeps enforcement uniform across the polish program.
