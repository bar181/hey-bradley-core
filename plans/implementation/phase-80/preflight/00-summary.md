# P80 / OC-15 — Agentic-Product Templates (Preflight)

> **Phase:** P80 · **Sprint:** OC-15 · **Date:** 2026-05-01
> **Predecessor:** P79 sealed at `a15fc8a` (~942+ GREEN, 104 ADRs)
> **Cross-refs:** ADR-096 (Template Library Expansion P68 / OC-4), ADR-098 (Template Intelligence), ADR-091 (Canonical Component Quality)
> **Gap-closure:** Gap 6 — "+3 templates to reach 40+" (closes Lovable/Framer parity floor)

## Reframe — current state

Recon: `src/data/examples/index.ts` exports 37 templates across healthcare, creator, dev-tools, local-business, SaaS verticals. **Zero agentic-product templates**. P80 ships **4 vertical-positioned AI/agentic-product templates** to reach 41 total (gap floor at 40).

## 4 templates to ship

1. **AI agent marketplace** (`ai-agent-marketplace.json`) — listing/discovery surface for AI agents; cards w/ ratings, capability tags, integrations grid
2. **AI coding copilot product** (`ai-coding-copilot.json`) — IDE/editor extension landing; hero w/ animated-feel demo placeholder, value props, pricing tiers
3. **AI workflow automation** (`ai-workflow-platform.json`) — Zapier-meets-AI; flow-builder visual hero, integration logos, use-case grid
4. **AI customer support agent** (`ai-support-copilot.json`) — copilot for support teams; ROI metrics hero, before/after, deflection rate stats

## 3 parallel agents · disjoint scopes

### A1 — 4 NEW templates + index.ts wire
**Owns:**
- `src/data/examples/ai-agent-marketplace.json` (NEW)
- `src/data/examples/ai-coding-copilot.json` (NEW)
- `src/data/examples/ai-workflow-platform.json` (NEW)
- `src/data/examples/ai-support-copilot.json` (NEW)
- `src/data/examples/index.ts` (EDIT — append 4 imports + 4 EXAMPLE_SITES entries)

**Constraints:**
- Each template MUST conform to MasterConfig schema (verify against `src/lib/schemas/masterConfig.ts`)
- Each template MUST cover ≥6 sections from the canonical 18-section enum (no fabricated section types)
- Reference EXISTING themes from `themeLibrary` (21 available); pick `industrial-modern`, `dark-feminine`, or `neon` for the futurist AI feel
- Real opinionated copy (no lorem ipsum); 30-60 word body paragraphs
- ADR-091 compliance — token-derived spacing, no hardcoded hex colors in section configs
- Each template gets an `exampleQueries: string[]` metadata field at the top level (mirror P73 `exampleQueries` standard) — 5 queries per template that demonstrate the template's vertical

### A2 — Visual coherence + persona scoring
**Owns:**
- `plans/strategic-reviews/2026-05-01-p80-template-scoring.md` (NEW; ≤200 LOC) — read all 4 NEW templates A1 wrote; score each on:
  - Design quality (1-10)
  - Vertical positioning clarity (1-10)
  - Copy quality (1-10)
  - ADR-091 token compliance (1-10)
  - Composite (avg)
- Identify any template scoring <7 in any dimension; produce inline-fix recommendations (NOT edits — A1 territory)

**Constraints:** READ-ONLY for source. Doc artifact only.

### A3 — ADR-105 + tests + EOP
**Owns:**
- `docs/adr/ADR-105-agentic-product-templates.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-096 + ADR-098 + ADR-091)
- `tests/p80-agentic-product-templates.spec.ts` (NEW; ≥12 cases; Playwright `test.describe`/`test`; FS-read PURE-UNIT pattern):
  - P80.1 ADR-105 file shape (4)
  - P80.2 4 new templates exist on disk (4)
  - P80.3 index.ts wires all 4 (1)
  - P80.4 EXAMPLE_SITES count ≥41 (1)
  - P80.5 each new template carries `exampleQueries` ≥3 items (1)
  - P80.6 KISS — no animation libs in P80 source (1)
  - P80.7 EOP triplet (3)
- `plans/implementation/phase-80/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync (ADRs 104 → 105; tests +12; templates 37 → 41; capabilities entry)

**Constraints:** ADR ≤120 LOC; Status: Accepted; tests use `@playwright/test` (NOT vitest); ROOT = `process.cwd()`.

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new section types (still 18 — case-study + contact-form added P75 cover the agentic vertical)
4. Each template ≥6 sections; no template < 4 ; no template > 14
5. No hardcoded hex colors in section JSON — use theme tokens
6. NO touching files outside owned list
7. NO shell commands inside agents (except tsc + targeted playwright run)
8. TypeScript-strict (JSON validates against schema; no schema changes)

## Acceptance gates
- 4 NEW templates valid against MasterConfig schema
- index.ts exports 41 templates; EXAMPLE_SITES.length === 41
- ADR-105 Accepted citing ADR-096 + ADR-098 + ADR-091
- ≥12 P80 tests GREEN
- Full session OC chain regression (P62-P80) GREEN — ≥620
- tsc strict clean
- Templates 37 → 41 (closes Gap 6 with margin)
