# ADR-101 — Spec Export Quality Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P76 / OC-9
- **Cross-refs:** ADR-081 (Open Core RC share), ADR-082 (Open Core RC), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard)

## Context

Sprint N (P57 / ADR-081) shipped Shareable Output: a static HTML emitter and a content-addressable in-browser share-spec stub. P74's brutal-honest comprehensive review (`plans/strategic-reviews/2026-05-01-comprehensive-review-{1-features,2-design-ux,3-gaps-resolutions}.md`) scored Spec/Export at the lower end of the rubric (~74-78/100 vs SOTA 80) on three concrete observations:

1. The export modal mixed three near-identical CTAs without a clear primary action
2. The static HTML output was raw markup, not a styled mini-document — visitors saw an unloved page
3. The North Star and Human Spec generators emitted template scaffolding rather than reading like real product documents

The user mandate from the P74 review is explicit: redesign the export modal, emit polished static HTML, and lift the spec-doc surface to product-quality writing.

## Decision

We adopt a four-part **Spec Export Quality Standard** for P76 / OC-9.

1. **Export modal canonical layout.** A single primary CTA labelled `Download .heybradley` plus a single secondary CTA labelled `Copy AISP` plus a Cancel affordance. Layout is token-derived per ADR-091 (no inline styles, no off-palette colors). The modal is a real ARIA dialog (`role="dialog"`, `aria-modal="true"`, focus trap, ESC dismiss).
2. **Static HTML emission is a real document.** The emitter must produce valid HTML5 — `<!doctype html>`, `<meta charset="utf-8">`, `<meta name="viewport">` — with a `<style>` block that inlines the active theme tokens. The page must open in a browser as a polished standalone document. A "Built with Hey Bradley" footer is mandatory for attribution.
3. **AISP file naming is content-addressable and versioned.** Filename pattern: `{slug}-aisp-v{version}.txt` (e.g. `coffee-roaster-aisp-v1.0.txt`). The first line of every AISP file is a version header (`# v1.0` or richer markdown). Multi-file exports carry a bundle manifest.
4. **Spec docs read like product documents.** `humanSpecGenerator.ts` and `northStarGenerator.ts` emit at least three top-level markdown headings with real prose auto-filled from MasterConfig — never template scaffolding placeholders.

## Quality bar (enforced by `tests/p76-spec-export-quality.spec.ts`)

- Export modal renders with the two canonical CTAs and ARIA dialog attributes
- AISP filename pattern present; version header is the first line
- Static HTML emits doctype + meta viewport + `<style>` block + attribution footer
- Spec generators emit ≥3 markdown headings each
- No animation library imports leak into the four owned closer files (KISS)

## Out of scope

- Real hosted share URL (Tier-2; the ADR-081 in-browser stub remains the open-core surface)
- Collaborative spec editing (Tier-2)
- Spec versioning history beyond the filename (Tier-2)

## Bounded-context impact

Lives entirely within the existing `specification` aggregate. No new bounded context is created. The export modal lives in `src/components/shell/`; the static HTML and bundle code live in `src/contexts/specification/`; the spec generators live in `src/lib/specGenerators/`.

## Consequences

**Positive.** Closes the P74 review's spec-export gap (74→85+ projected). Makes the export experience reviewer-impressive on first contact — a Capstone or Framer reviewer downloads a .heybradley file or opens the static HTML preview and immediately sees product-grade output. The version-header convention seeds future spec-history work without committing to it now.

**Negative.** Tighter coupling between MasterConfig fields and the spec generator output: schema changes will require generator updates. Mitigation: existing schema-validation tests (P59 corpus + P60 QA matrix) catch drift early, and the generators read MasterConfig through a typed interface so the TypeScript compiler surfaces breaks at build time.
