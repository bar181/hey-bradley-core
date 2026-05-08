# ADR-145 — Section Capability Standard (Render Completeness + vs-SOTA Variant Floor)

- **Status:** Accepted
- **Date:** 2026-05-06
- **Phase:** P117 / SECTION-CAPABILITY-AUDIT-FIX
- **Cross-refs (primary):** ADR-100 (Section Type Completeness — superseded in implementation by P117 closing the render gap), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-143 (Visual Quality + Builder Polish), ADR-144 (Final Visual Quality Standard)

## Context

P117 audit (3 parallel READ-ONLY agents — `docs/audit/p117-section-inventory.md` + `docs/audit/p117-vs-sota.md` + `docs/audit/p117-site-shapes.md`) surfaced a load-bearing render-completeness bug ADR-100 missed: while `sectionTypeSchema` declared 18 canonical types since P75, only 16 had production render paths. `case-study` and `contact-form` had Zod-valid schema entries + dedicated `Simple` editors + at least one template variant on disk — but `RealityTab.tsx` `renderSection()` had no `case 'case-study' | 'contact-form'` branch and `SimpleTab.tsx` had no editor routing. The result: 20 of 64 example sites declared these section types and rendered as empty `<div>` placeholders in the canvas.

Audit also surfaced (a) composite vs-SOTA score 7.6 against Webflow leader 8.8 (Δ-1.1) with 3 sections closable in this sprint via 6 template variants, (b) `SECTION_CUES` table covered only 9 of 18 types, leaving 6 types unreachable from chat/listen mode, and (c) section-type swap matrix per ADR-144 D4 only covered 4 of 18 types.

## Decisions

### D1 — Render completeness invariant (closes P1 audit findings)

Every section type in `sectionTypeSchema` MUST have a corresponding `case <type>:` branch in `RealityTab.tsx` `renderSection()` AND a corresponding `case <type>:` branch in `SimpleTab.tsx` editor switch. ADR-100 declared 18 types but P75-P116 only wired 16; P117 closed `case-study` + `contact-form` render-blank bug that affected 20 of 64 demos.

Future enum additions MUST add both wires in lock-step with the schema change. The P109 section-enum drift regression guard (`tests/p109-section-enum-drift-guard.spec.ts`) reconciles 5 *declaration* sources; this ADR adds the *render-path* invariant that the P117 spec verifies.

### D2 — vs-SOTA variant floor (closes 28% of leader gap)

Top-5 most-used sections (`hero`, `menu`, `pricing`, `team`, `columns`) MUST ship ≥3 variants per type. New variants land alongside the canonical existing ones — not replacing.

P117 added 6 variants closing the audit gap:
- `menu` 2 → 4: NavbarSticky (76 LOC; transparent → solid on scroll) + NavbarMegaMenu (119 LOC; multi-column dropdown)
- `pricing` 3 → 5: PricingCalculator (135 LOC; usage-slider → live $/mo) + PricingEnterprise (86 LOC; "Contact us" tier with feature checklist)
- `team` 3 → 5: TeamHoverBio (87 LOC; hover-reveal extended bio) + TeamWithSocial (93 LOC; LinkedIn + GitHub + Twitter chips)

Composite vs SOTA closes from 7.6 → ~7.9 (+0.3). `columns` already at 8 variants (richest in library); `hero` already at 4 variants per audit.

### D3 — Cue map completeness invariant (closes 6 unreachable section types)

`SECTION_CUES` table in `src/contexts/intelligence/aisp/assumptions.ts` MUST have an entry for every section type in `sectionTypeSchema`. Pre-P117 coverage was 9 of 18; P117 added entries for 6 previously-uncovered types: `numbers` (stat / kpi / metric) + `image` (photo / picture / screenshot) + `divider` (spacer / break / separator) + `logos` (client logos / trusted by / partners) + `case-study` (success story / client story) + `contact-form` (contact us / get in touch / inquiry form). Coverage 9/18 → 15/18.

Chat and listen mode now resolve "add metrics", "add picture", "add spacer", "add client logos", "add case study", "add contact form" to the correct section type via INTENT_ATOM + ASSUMPTIONS_ATOM cue lookup.

### D4 — Quality floor (honest scoring)

18 of 18 section types now render correctly in canvas (was 16/18 pre-P117); 18 of 18 type-keyed editor routes wire to a section-specific `Simple` editor (was 16/18); composite vs SOTA closes from 7.6 → ~7.9.

Honest scoping admissions:
- 3 site shapes remain weak (restaurant 6/10 / non-profit 6/10 / fiction 6/10) — closing those requires schema enum widening per ADR-100 (carry-forward; not closed this sprint).
- Inline edit reach stays at 1 of 18 sections (hero only per ADR-144 D3) — fan-out deferred until shared component contract stabilizes.
- Section-type swap matrix stays at 4 of 18 per ADR-144 D4 — hero/footer/pricing/team need per-type safe-default seed components before expansion.
- 3 sections still below 7.0 floor by composite (`contact-form` 6.0, `case-study` 6.5, `divider` 6.4) — render path now correct but variant + cue depth carry-forward to P118.

## Consequences

- 20 of 64 demos that declared `case-study`/`contact-form` no longer render blank canvas placeholders.
- 6 new variants ship; 596 LOC delta from F2; total templates 53 → 59 across menu/pricing/team.
- Chat/listen mode reaches 6 more section types via SECTION_CUES.
- Zero new dependencies (KISS preserved per P116 baseline).
- Architecture invariants spec (`tests/architecture-invariants.spec.ts`) gains an implicit P117 obligation: when a 19th section type lands, both render switches AND the cue map AND the SimpleTab editor route MUST land in the same PR.
