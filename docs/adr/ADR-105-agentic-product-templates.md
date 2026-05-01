# ADR-105 — Agentic-Product Templates

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P80 / OC-15
- **Cross-refs:** ADR-096 (Template Library Expansion Standard — P68 / OC-4), ADR-098 (Template Intelligence Architecture — P72 / OC-TI), ADR-091 (Canonical Component Quality — P65b / OC-2.5 Wave 2)

## Context

Pre-P80 the example library counted **37 templates** across healthcare/wellness (4), creator/personal (4), dev-tools/OSS (3), local-business, SaaS, professional, agency, and capstone verticals. **Zero** of the 37 templated specifically against the agentic-product market — the very category Hey Bradley itself competes in. This is Gap 6 in `plans/strategic-reviews/2026-05-01-comprehensive-review-3-gaps-resolutions.md` (P2, high-leverage):

> SOTA reference: Lovable, Framer both advertise 50+ template families; HB sits at 37 (17 baseline + 3 OC-3 + 11 OC-4). Bottom-5 in P73 audit still underperforming even post-fix. Resolution: P80 OC-15 (Agentic-product templates) — 5+ opinionated, strongly vertical-positioned. Land at least 3 from the 5 to reach 40.

The **literal floor** named in `CLAUDE.md` (P73 carry-forward) was "+3 to reach 40+ as OC-4 round 3." P80 ships **+4** vertical-positioned agentic-product templates (37 → 41), clearing the floor with one buffer entry against the SOTA 50+ reference.

## Decision

### 1. Add 4 vertical-positioned agentic-product templates

- **`ai-agent-marketplace.json`** — agent listing / discovery / install marketplace (think OpenAI GPT Store / Anthropic skills directory)
- **`ai-coding-copilot.json`** — IDE-embedded coding copilot product (Cursor / Continue / Cody adjacent)
- **`ai-workflow-platform.json`** — agentic workflow / orchestration platform (n8n + LLM / Crew / LangGraph adjacent)
- **`ai-support-copilot.json`** — customer-support agentic deflection (Intercom Fin / Decagon / Sierra adjacent)

Each carries opinionated copy with concrete pricing tiers, named ROI numbers (e.g. "60% deflection rate"), and named fictional integrations ("connects to your Linear, Slack, and Stripe"). Vertical positioning is visible at a glance in `tagline` + `voiceAttributes`. AISP `purpose: "marketing"` on all four; theme presets selected from existing 21-theme intelligence library (no new theme presets shipped under this ADR).

### 2. Each template conforms to the existing 18-section enum

Section enum widened to 18 under ADR-100 (P75 / OC-7 — `case-study` + `contact-form`). The agentic-product family relies heavily on `case-study` (named-customer ROI proof) and `contact-form` (sales-led tier capture); both are now first-class. **No new section types are introduced under ADR-105.** This is the right discipline: the audit-fix discipline established in P73 + P75 covers the agentic-product template needs without widening the enum.

### 3. Real opinionated copy with named tiers, ROI numbers, and fictional integrations

ADR-091 (Canonical Component Quality) and ADR-096 (Template Library Expansion Standard) require opinionated, vertical-positioned copy — NOT lorem-ipsum and NOT generic placeholders. P80 templates honor that:

- **Pricing tiers** named (Starter / Team / Enterprise — or vertical-specific equivalents).
- **ROI numbers** concrete and falsifiable ("60% deflection," "40 hours saved/week," "$2.4M ARR retained").
- **Integrations** named with real product names (Linear, Slack, Stripe, GitHub, Notion). Fictional = the customer using them is fictional; the integrations themselves are real.
- **`exampleQueries`** populated per ADR-098 / P73 — every entry trains future Tier-2 HNSW retrieval.

## Out of scope

- **Animated demos in hero sections** — stays static per ADR-091 (hover-lift only). Tier-2 video / Lottie hero embeds remain commercial.
- **Video embeds inside templates** — Tier-2.
- **BYO theme generation** (per-template theme synthesis from scratch) — P82 candidate. P80 picks from the existing 21-theme intelligence library.
- **Page-aware multi-page agentic templates** — single-page each. Multi-page expansion of these templates is a P82+ candidate now that ADR-103 / ADR-104 land the multi-page wire.

## Acceptance gates

1. Four new JSON templates exist on disk under `src/data/examples/`: `ai-agent-marketplace.json`, `ai-coding-copilot.json`, `ai-workflow-platform.json`, `ai-support-copilot.json`.
2. `src/data/examples/index.ts` imports + wires all four. `EXAMPLE_SITES.length` ≥ 41.
3. Each new template has ≥6 sections.
4. Each new template parses as valid JSON with `site`, `theme`, `sections` keys.
5. None of the 4 JSON files contains animation-library imports / strings (`framer-motion`, `gsap`, `lottie`, `@react-spring`, `animejs`).
6. Section enum unchanged at 18 (P75 ADR-100 still authoritative).
7. ≥12 P80 tests GREEN in `tests/p80-agentic-product-templates.spec.ts`.
8. ADR-105 Accepted; cross-refs ADR-096 / ADR-098 / ADR-091.

## Consequences

**Positive:**
- Closes Gap 6 (P2 / high-leverage) from the comprehensive review with one template buffer over the literal floor (37 → 41 vs. floor 40).
- Hey Bradley now self-templates its own market — the agentic-product family is the most user-relevant for the prosumer + dev-tool persona pipeline.
- Vertical positioning visible in `tagline` + `voiceAttributes` flows directly into AISP atom output and EXPERT trace pane density.
- `case-study` + `contact-form` (P75 / ADR-100) get real production usage, validating the section-type closure decision retroactively.

**Negative:**
- Templates skew toward "AI-product marketing site" voice — not all visitors land in this vertical. Mitigated by the existing 37 templates covering healthcare/creator/local-business/dev-tools.
- Pricing-tier copy ages faster than evergreen copy; agentic-product market is volatile (Q1 2026 SOTA differs from Q4 2025 SOTA). Mitigation: tier names are illustrative, not category-defining; future audit sprint can refresh.

**Mitigations:**
- Keep ADR-105 ≤120 LOC; lean on ADR-096 / ADR-098 / ADR-091 for inherited standards.
- Pure-unit FS-read test coverage (`tests/p80-agentic-product-templates.spec.ts`) with `existsSync` guards on A1 surfaces — A3 (this agent) ships docs + tests + EOP without needing A1's JSON files at write-time.
- No new dependencies; no animation libs in any P80 source (banned-string check enforced by P80.6 spec block).
