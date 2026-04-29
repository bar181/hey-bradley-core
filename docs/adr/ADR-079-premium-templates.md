# ADR-079: Premium Template Design System

**Status:** Accepted
**Date:** 2026-04-29
**Deciders:** Bradley Ross
**Phase:** P56

## Context

Sprint M Wave 1 ships moat priority #3 from the open-core moat roadmap
(`plans/strategic-reviews/open-core-moat-roadmap.md`): **make the output
premium**. The Sprint J system-wide review (`plans/strategic-reviews/2026-04-29-sprint-j-system-wide/`
§UX) and the 2026-04-29 product evaluation flagged that the existing 17
examples / 12 themes prove COVERAGE — every section type, every theme has at
least one referent. They do NOT prove QUALITY. A reviewer should look at the
default output and feel "designer made this," not "AI generic."

Sprint K (P54) made the speed visible. Sprint L (P55) made the spec
unmissable. Sprint M (P56) makes the OUTPUT premium — the missing leg of the
"thesis + speed + output" tripod that capstone reviewers grade against.

## Decision

### 3 strongly opinionated templates

`src/data/examples/saas-founder/index.ts` (A1), `indie-portfolio/index.ts`
(A2), and `b2b-agency/index.ts` (A3) ship as the flagship premium tier.
Each template is a TypeScript module (not JSON) so palette, typography, and
hero composition can be expressed as typed structures rather than parsed
strings. ≤300 LOC per template file.

### Distinct visual identity per template

Each template owns a DISTINCT primary palette anchor (assert: no two share
the same primary hex code in P56.5), a curated typeface pair, and a hero
composition that telegraphs the audience without reading the copy:

- **SaaS Founder** — confident, product-led; metric-forward hero.
- **Indie Portfolio** — warm, voice-first; story-led hero.
- **B2B Agency** — disciplined, trust-forward; case-study hero.

### Real copy throughout

Zero placeholders. Zero `Lorem ipsum`, zero `Welcome to Your Website`, zero
`Your Tagline Here`, zero `Click here`, zero `Describe what makes your
business special`. The P56.6 test asserts this regex against all three
template files — the gate is automated, not aspirational.

### Registration in `src/data/examples/index.ts`

Each template registers as an additional `EXAMPLE_SITES[]` entry alongside
the existing 17 examples. The registry stays unchanged — the Template
Library API (ADR-058) and persistence layer (ADR-059) consume the new
entries through the existing decoration-over-registry pattern.

### Design reference at `plans/strategic-reviews/template-design-reference-2026.md`

A4's design reference doc is the source of truth for visual direction —
palette anchors, typography pairs, hero composition rules, image
curation lists. Templates implement against the reference; if the
reference changes, templates re-cut against it.

## Trade-offs

- **3 templates increase maintenance surface.** Mitigated by self-testing
  through the existing `example_prompts` 35/35 coverage gate (no per-template
  test infrastructure; piggyback on Sprint F).
- **Image curation gap remains.** Templates reference image IDs from the
  existing 300-image catalog (D2 — no new image assets). A6 fills any
  catalog gaps surfaced during dispatch.
- **TypeScript modules diverge from JSON examples.** Existing 17 examples
  stay JSON-based. New premium tier ships as `.ts` to express typed
  palette/typography structures. Mitigated by `MasterConfig` type contract
  holding both surfaces.
- **Opinionated > broad.** 3 strongly-curated templates ship ALONGSIDE the
  existing 12 themes — not a replacement. Existing themes remain the
  "novice / blank-slate" tier; premium templates are flagship-level on top.

## Consequences

- (+) Default output reads "designer made this" — moat #3 visible.
- (+) Each template has a distinct hero visual identity — no rainbow, no
  generic Inter-everywhere.
- (+) Real-copy gate is automated (P56.6) — placeholders cannot regress in.
- (+) Decoration-over-registry pattern from ADR-058 holds — no library API
  changes; new entries flow through existing list/filter surfaces.
- (-) 3 new template files add ~900 LOC of curation; offset by zero new
  components and zero new section types.
- (-) Image curation gap (A6 scope) is the soft seam — a curated template
  rendered against missing image IDs falls back to placeholder art.

## Cross-references

- **ADR-058** — Template Library API (decoration over registry); new
  templates flow through the existing list/filter surface unchanged.
- **ADR-059** — Template Persistence (migration 003 + userTemplates repo);
  premium templates ship as built-ins, not user-saved entries.
- **ADR-070** — P47 Builder UX polish; premium templates surface in the
  same Browse panel as existing examples.
- **ADR-073** — Sprint J personality composition; orthogonal — personality
  modulates voice; templates own visual identity.
- **ADR-077** — Sprint K sibling pattern (moat priority #1, speed visible).
- **ADR-078** — Sprint L sibling pattern (moat priority #2, spec
  unmissable); templates render the spec that L surfaces.
- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe)
- `plans/strategic-reviews/template-design-reference-2026.md` (A4 source)
- `plans/implementation/phase-56/preflight/00-summary.md`

## Status as of P56 Wave 1 dispatch

- ADR-079 full Accepted
- A1/A2/A3 templates dispatched in parallel
- `tests/p56-premium-templates.spec.ts`: 10 PURE-UNIT cases (some
  expected-failure until A1-A3 land — GREEN-flip on Wave 1 seal)
- A4 design reference + A6 image curation parallel
