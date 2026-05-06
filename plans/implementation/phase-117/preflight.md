# P117 — Section Capability Audit + Fix — Preflight

> **Phase:** P117 · **Sprint:** SECTION-CAPABILITY-AUDIT-FIX · **Date:** 2026-05-06
> **Branch:** swarm/p117-section-capability
> **Predecessor:** P116 sealed at `d9556f8` (5 non-SaaS demos + 17 templates lifted + InlineEditable + section-type swap)

## Mandate

Owner asks: confirm Hey Bradley sections (hero / image / article / pricing / all core types), score each section for quality + ease of use + design vs SOTA, including options available in chat / listen / builder mode. Confirm Hey Bradley provides full range of website shapes (SPA / multi-page / portfolio / blog). **Identify and close gaps in parallel.**

## Wave 1 — 3 disjoint-scope audit agents (READ-ONLY research)

### A1 — Section inventory + per-section scoring
**Owns:** `docs/audit/p117-section-inventory.md` (NEW; ≤500 LOC)
- Enumerate all 18 canonical section types per ADR-100 (`hero` / `menu` / `columns` / `pricing` / `action` / `footer` / `quotes` / `questions` / `numbers` / `gallery` / `logos` / `team` / `image` / `divider` / `text` / `blog` / `case-study` / `contact-form`)
- Per section, list rendered components in `src/templates/<type>/` (e.g. HeroSplit + HeroCentered for hero)
- Score each section 1-10 on 4 dimensions:
  - Quality (visual polish, typography, spacing per ADR-091/094)
  - Ease (chat mode — can user say "add testimonial" and get a quotes section)
  - Ease (listen mode — voice-driven add/edit/delete works)
  - Ease (builder mode — SectionsSection right-panel editor experience; per ADR-143)
  - Design (responsiveness, image handling per ADR-113, theme-token compliance)
- Identify per-section gaps with severity P1/P2/P3
- 5-row summary table at top
- Score MUST be honest — no padding

### A2 — vs-SOTA comparison per section type
**Owns:** `docs/audit/p117-vs-sota.md` (NEW; ≤400 LOC)
- For each of the 18 sections, score Hey Bradley vs:
  - Lovable (chat-driven; primary peer)
  - Wix (no-code SOTA; full visual editor)
  - Webflow (designer-grade; CSS-class fidelity)
  - Framer (modern motion + components)
  - Squarespace (template-driven; non-designer)
- Use 1-10 scoring on visual polish + section variety + ease-of-use
- Per section, name the leader + delta (e.g. "hero: HB 8.5 / Lovable 9.0 / Wix 9.5 / leader Wix Δ-1.0")
- Honest weakest 3 sections + honest strongest 3 sections
- Composite score across all 18

### A3 — Site-shape capability assessment
**Owns:** `docs/audit/p117-site-shapes.md` (NEW; ≤400 LOC)
- Verify Hey Bradley supports each canonical site shape:
  - SPA (single-page; default mode)
  - Multi-page (per ADR-103 / ADR-104; PageSelector + per-page bundle.pages[])
  - Portfolio (gallery + image + text)
  - Blog (blog section + 4 BlogCard variants per ADR-097)
  - Marketing (hero + columns + pricing + cta)
  - Personal (founder/about/contact)
  - SaaS landing (hero + numbers + pricing + logos)
  - Restaurant / venue / non-profit (post-P116 5 new demos)
- For each shape: list which existing EXAMPLE_SITES demonstrate it (post-P116 64 sites)
- Identify shapes that are unsupported or weak
- Confirm the 64 demos cover the full range — or name gaps

## Wave 2 — Fix dispatch (parallel; based on Wave 1 findings)

After Wave 1 lands, dispatch fix agents in priority order. Likely fix tracks (subject to audit):
- F1: Lift weakest-3 sections per A2 vs-SOTA
- F2: Close any unsupported site-shape per A3 (likely none post-P116; reserved)
- F3: Builder-mode editor lift for low-ease sections per A1 (e.g. pricing-tier inline editing if scored low)
- F4: Listen-mode coverage gaps per A1 (e.g. transcript verb table for any uncovered section type)

## Wave 3 — Closer

- ADR-145 (Section Capability Standard) ≤120 LOC
- `tests/p117-section-capability.spec.ts` (≥10 cases)
- Phase EOP triplet (preflight + session-log + retrospective)
- CLAUDE.md sync
- `docs/adr/README.md` counter bump 135 → 136

## Hard rules

1. NO new dependencies
2. tsc strict CLEAN both configs
3. EOP triplet at phase root
4. ADR-145 ≤120 LOC
5. Wave 1 is READ-ONLY (audit docs only); fixes only after Wave 1 lands
6. Each fix must cite the audit finding it closes
7. Honest scoring — no SOTA-padding; honest gap naming

## Acceptance gates

- 3 audit docs landed at `docs/audit/p117-{section-inventory,vs-sota,site-shapes}.md`
- Per-section + per-shape scores published with named leaders
- All P1 audit gaps either CLOSED or DOCUMENTED as carry-forward
- Composite Hey Bradley vs SOTA score declared honestly
- ADR-145 Accepted
- ≥10 P117 tests GREEN
- Cumulative regression preserved (≥365 GREEN)
- Both tsc strict configs CLEAN
