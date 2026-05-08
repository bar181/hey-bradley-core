# DDD Bounded Context: ui-shell

## Bounded context: ui-shell

The `ui-shell` bounded context owns the spec/preview UI surface — the
chrome around the configuration domain. It renders the shell (tabs,
panels, modals), manages UI-only state (active tab, selected context,
accordion open/close), and enforces design discipline via the shared
token system. It is a strict consumer of the `configuration`,
`intelligence`, and `persistence` contexts and writes to none of them.

## Responsibility

- Render the spec/preview UI shell (left/center/right panels, tabs, modals)
- Manage UI-only state (interactionMode, activeTab, rightPanelTab,
  leftPanelTab, selectedContext, appMode, etc.)
- Enforce design discipline via the design token system (ADR-087)
- Provide canonical section components for templates to consume

## Aggregates

- **`uiStore` (Zustand)** — UI-only state (`interactionMode`,
  `activeTab`, `rightPanelTab`, `leftPanelTab`, `selectedContext`,
  `appMode`, etc.). The single state-management aggregate for the
  context.
- **Design Token System (ADR-087, P65)** — `src/styles/design-tokens.ts`
  — canonical spacing / typography / radius / shadow / motion tokens
  shared across canonical section components. KISS: one file, no CSS.
- **Section Component Library (ADR-088 enables, ADR-087 disciplines)**
  — Hero / Feature / Testimonial (canonical post-OC-2.5-Wave-2);
  Menu / Action / Footer / Columns / Quotes / Numbers / Text / Blog /
  Gallery (current set).
- **Mode Selector (ADR-088, P63)** —
  `src/components/onboarding/ModeSelectorCard.tsx` — 3-card platform
  discriminator (Whiteboard / Planning / Agentics).
- **AISP Trace Pane (ADR-064 + ADR-078, P55)** —
  `src/components/shell/AISPPipelineTracePane.tsx` — always-on AISP
  visualization with atom animations.
- **Personality Picker (ADR-073, Sprint J)** — picker UI + onboarding
  step + 5 bubble styles.
- **Latency Badge (ADR-077, Sprint K)** — surfaces sub-second response
  visibility.

## Anti-corruption layers

- **Design-token static check** — section components in the canonical
  set MUST import from `design-tokens` and contain no hard-coded
  `'24px'`, `'48px'`, or `'96px'` literals. Enforced by
  `tests/p65-oc25-design-tokens.spec.ts` and successor specs.
- **Zod schemas at MasterConfig boundary** — incoming config is validated
  before any UI state derives from it (mirrors data-flow context map).

## Cross-context dependencies

- **Reads from** `configuration` (configStore), `intelligence` (AISP
  trace data, latency telemetry), `persistence` (kv hydration on app
  load).
- **Writes to** none of the above. UI-only writes stay in `uiStore`.
- **Emits** UI events that flow back through the input context's
  anti-corruption layer (Zod) before reaching `configStore`.

## Quality bar (OC-2.5)

Per ADR-087: every canonical section component MUST pass the design-
token audit (token import + zero hard-coded spacing literals) before a
template can reference it. Existing 26 templates are EXEMPT until OC-8
migration; the token system is forward-looking.
