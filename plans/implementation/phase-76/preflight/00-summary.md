# P76 / OC-9 — Spec Quality + Export Polish (Preflight)

> **Phase:** P76 · **Sprint:** OC-9 · **Date:** 2026-05-01
> **Predecessor:** P74 sealed at `819be2e` (873 GREEN, 99 ADRs)
> **Companion:** P75 / OC-7 Section Type Closure (parallel)

## 3 parallel agents

### A4 — Export bundle UI redesign
**Owns:**
- `src/components/shell/ExportStaticHtmlButton.tsx` (EDIT — modal redesign; primary "Download .heybradley" + secondary "Copy AISP")
- `src/components/shell/ShareSpecButton.tsx` (EDIT — attribution footer typography polish)
- `src/contexts/specification/staticHtmlExport.ts` (EDIT — output styled HTML, not raw; valid mini-document with theme tokens inlined)
- `src/contexts/specification/attribution.ts` (verify "Built with Hey Bradley" footer styling)

### A5 — Spec panel quality
**Owns:**
- `src/lib/specGenerators/humanSpecGenerator.ts` (EDIT — formatted markdown with proper headings, real content)
- `src/lib/specGenerators/northStarGenerator.ts` (EDIT — vision document tone, not generic template)
- `src/contexts/specification/shareSpecBundle.ts` (EDIT — clean file naming `{project-name}-aisp.txt`, version header per file)
- `src/components/right-panel/expert/SectionExpert.tsx` (light touch — verify Blueprints tabs read clean)

### A6 — ADR-101 + Tests + EOP
**Owns:**
- `docs/adr/ADR-101-spec-export-quality.md` (NEW; ≤120 LOC)
- `tests/p76-spec-export-quality.spec.ts` (NEW; ≥10 cases)
- `plans/implementation/phase-76/{02-post-review.md, session-log.md, retrospective.md}`
- CLAUDE.md sync (ADRs → 101 — paired with P75's 100; tests +10)

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO breaking existing export round-trip (Claude Code consumer must still parse the spec bundle)
4. Static HTML export emits valid HTML5 with `<style>` block (theme tokens inlined); opens in browser as a real page
5. AISP export filename pattern: `{slug}-aisp-{version}.txt` (e.g., `coffee-roaster-aisp-v1.0.txt`)
6. North Star + human spec read like real documents, not template scaffolding
7. NO shell commands inside agents
8. TypeScript-strict

## Acceptance gates (combined P75 + P76)
- 18 section types in enum
- case-study + contact-form components + editors + QuickAdd cards
- Export modal redesigned
- Static HTML export emits styled valid HTML
- Spec generators produce real-document quality
- ADR-100 + ADR-101 Accepted
- Cumulative ≥898 GREEN (873 + 15 + 10)
- tsc clean
