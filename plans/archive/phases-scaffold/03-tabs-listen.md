# Phase 1.2: All Tabs + Listen Mode Visual

**Status:** NOT STARTED
**Estimated Agents:** 10 (parallel)
**Blocked By:** Phase 1.1
**Unblocks:** Phase 1.3
**CAPSTONE DEMO CHECKPOINT** — Must be visually stunning. Human review required.

---

## Agent Assignment

| Agent | Responsibility | Files |
|-------|---------------|-------|
| xai-human-agent | XAI Docs Human view + spec templates | `XAIDocsTab.tsx`, `specification/templates/*` |
| xai-aisp-agent | AISP formatter + AISP view | `specification/services/aispFormatter.ts` |
| workflow-agent | WorkflowTab with animated pipeline | `WorkflowTab.tsx` |
| listen-overlay-agent | ListenOverlay dark transition | `listen-mode/ListenOverlay.tsx` |
| red-orb-agent | RedOrb 3-layer CSS glow | `listen-mode/RedOrb.tsx` |
| typewriter-agent | Typewriter + StartListeningButton | `listen-mode/Typewriter.tsx`, `StartListeningButton.tsx` |
| features-agent | Features section schema + renderer | `templates/features/*` |
| cta-agent | CTA section schema + renderer | `templates/cta/*` |
| registry-agent | Section registry + AISP ID overlays | `templates/registry.ts` |
| test-agent | Integration tests for 1.1 + 1.2 | `tests/integration/*` |

---

## Checklist

### 1.2.1 — XAI Docs Tab (xai-human-agent + xai-aisp-agent)
- [ ] `src/components/center-canvas/XAIDocsTab.tsx`
  - HUMAN / AISP sub-toggle (same pill style as mode toggles)
  - COPY + EXPORT AISP buttons (top right)
- [ ] Human docs view:
  - Monospace text, structured sections
  - Section list with copy/export details
  - Generated from configStore (read-only derived)
- [ ] AISP docs view:
  - `@aisp 1.2` formatted spec
  - Orange syntax highlighting (`@section`, `@layout`, `@heading`)
  - Line numbers
- [ ] `src/contexts/specification/services/specGenerator.ts` — Config → markdown
- [ ] `src/contexts/specification/services/aispFormatter.ts` — Config → AISP format
- [ ] `src/contexts/specification/templates/northStar.ts`
- [ ] `src/contexts/specification/templates/architecture.ts`
- [ ] `src/contexts/specification/templates/implPlan.ts`

### 1.2.2 — Workflow Tab (workflow-agent)
- [ ] `src/components/center-canvas/WorkflowTab.tsx`
  - "LLM UPDATE PIPELINE" header
  - 6 pipeline steps with status icons:
    1. Voice Capture — "Captured 3 intents"
    2. Intent Parsing — "hero, features, cta"
    3. AISP Generation — "3 sections generated"
    4. Schema Validation — "Validating aisp-1.2..." (ACTIVE)
    5. Reality Render — "Waiting for validation" (WAITING)
    6. Edge Deploy — "Ready on validation" (WAITING)
  - Step states: completed (green check), active (orange spinner), waiting (gray clock), error (red X)
  - "LIVE STREAM OUTPUT" log panel at bottom with timestamps
  - Mock data for demo (real wiring in Phase 5)

### 1.2.3 — Listen Mode (listen-overlay-agent + red-orb-agent + typewriter-agent)
- [ ] `src/components/listen-mode/ListenOverlay.tsx`
  - Dark overlay transition: 300ms fade to `#0a0a0f`
  - Covers left panel AND center canvas
  - Top bar and status bar remain visible (warm cream)
  - Right panel hides or minimizes
- [ ] `src/components/listen-mode/RedOrb.tsx`
  - 3-layer CSS construction:
    - Layer 1: Solid red core (`bg-red-500`, 40px)
    - Layer 2: Blurred mid-ring (`bg-red-500/30`, `blur-xl`, 120px)
    - Layer 3: Ambient glow (`bg-red-500/10`, `blur-3xl`, 300px)
  - `animate-orb-pulse` on core (2s ease-in-out infinite)
  - `animate-orb-breathe` on ambient glow (4s ease-in-out infinite)
  - Accepts `status` prop: `'IDLE' | 'THINKING' | 'LISTENING'`
  - LISTENING: `animate-orb-active` (faster pulse, 1.2s)
  - Small orb in left panel, larger ambient glow in center canvas
- [ ] `src/components/listen-mode/Typewriter.tsx`
  - Character-by-character text rendering
  - Monospace font, warm orange color
  - System-like brevity: "Parsing intent...", "Generating AISP..."
  - No conversational filler
- [ ] `src/components/listen-mode/StartListeningButton.tsx`
  - Centered below orb in left panel
  - "START LISTENING" text with play icon
  - Pill shape, warm styling

### 1.2.4 — Section Templates (features-agent + cta-agent)
- [ ] `src/templates/features/schema.ts` — Features Zod schema
- [ ] `src/templates/features/FeaturesGrid3.tsx` — 3-column card grid
  - Icon, title, description per card
  - Renders from configStore
- [ ] `src/templates/cta/schema.ts` — CTA Zod schema
- [ ] `src/templates/cta/CTASimple.tsx` — Banner section
  - Heading, button with URL
  - Renders from configStore
- [ ] `src/presets/sections/features-defaults.json`
- [ ] `src/presets/sections/cta-defaults.json`

### 1.2.5 — Section Registry (registry-agent)
- [ ] `src/templates/registry.ts` — SectionType → variant → component map
- [ ] RealityTab renders all sections from registry
- [ ] Section click-to-select with dashed orange border

---

## Testing

- [ ] `tests/contexts/specification/specGenerator.test.ts` — Config → valid markdown
- [ ] `tests/contexts/specification/aispFormatter.test.ts` — Config → valid AISP
- [ ] `tests/components/listen-mode/RedOrb.test.ts` — Renders 3 layers, responds to status
- [ ] `tests/components/center-canvas/WorkflowTab.test.ts` — Renders pipeline steps
- [ ] `tests/templates/features/FeaturesGrid3.test.ts` — Renders from config
- [ ] `tests/templates/cta/CTASimple.test.ts` — Renders from config
- [ ] `tests/integration/core-loop.test.ts` — Control → store → preview → JSON roundtrip

---

## Design References

| Component | Reference | What to Match |
|-----------|-----------|--------------|
| Red Orb | [Apple Siri](https://apple.com/siri) | Ambient glow, breathing animation |
| Red Orb | [Humane AI Pin](https://humane.com) | Minimal AI interface, pulsing light |
| Workflow Pipeline | [Vercel Deploy](https://vercel.com/dashboard) | Sequential steps with status icons |
| Workflow Pipeline | [GitHub Actions](https://github.com/features/actions) | Step states (pass/fail/running) |
| XAI Docs Human | [Stripe Docs](https://stripe.com/docs) | Clean structured documentation |
| XAI Docs AISP | [GitHub Code View](https://github.com) | Syntax highlighting, line numbers |
| Features Grid | [Tailwind UI](https://tailwindui.com) | 3-col feature cards with icons |
| CTA Banner | [Linear](https://linear.app) | Bold heading + single CTA button |

---

## Exit Criteria
- [ ] XAI DOCS shows HUMAN view with structured spec text
- [ ] XAI DOCS AISP view shows @aisp formatted syntax
- [ ] WORKFLOW shows pipeline steps with animated states
- [ ] Listen toggle produces dark overlay with pulsing red orb
- [ ] The orb effect is **visually stunning** (3-layer glow, breathing)
- [ ] Features and CTA sections visible in REALITY tab
- [ ] Section click-to-select works
- [ ] All tests pass
- [ ] **CAPSTONE DEMO CHECKPOINT — human review required**
