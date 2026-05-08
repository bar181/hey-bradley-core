# P68 / OC-4 — Templates Round 2

> **Phase:** P68 · **Sprint:** OC-4 (P1)
> **Date:** 2026-05-01
> **Predecessor:** P67c sealed at `8d46ddf` (626 GREEN, library 8.4 / touched 8.8)
> **Companion:** P69 / OC-5 (Mobile Redesign) running in parallel
> **Mandate:** 26 → 37 templates (+11 new); honest reframe of "40+ target"

---

## Honest target reframe

User brief: "40+ templates total (currently 26). 14 new." Recon shows the agent breakdown is 4 + 4 + 3 = **11 new templates**, not 14. Land at **37** total. To reach 40+ would need a 3-template gap-filler; documented as carry-forward.

---

## 4 parallel agents

### A1 — Healthcare + Wellness verticals (4 templates)
- `clinic.json` — primary care / medical clinic
- `wellness-coach.json` — holistic wellness coaching
- `mental-health-practice.json` — therapy / mental health practice
- `telehealth.json` — telehealth platform marketing

### A2 — Creator + Personal Brand verticals (4 templates)
- `founder-story.json` — solo-founder narrative landing
- `creator-youtuber.json` — content creator / YouTuber
- `speaker.json` — keynote speaker / conference presenter
- `researcher-academic.json` — academic / research personal brand

Don Miller framing: problem-first, then solution. Distinct from the existing `indie-portfolio` (more narrative-driven).

### A3 — Developer Tools + Open Source verticals (3 templates)
- `cli-tool.json` — CLI / dev tool product
- `oss-library.json` — open-source library landing
- `api-docs-landing.json` — API documentation marketing

Geek/Lars persona: dense info, monospace accents, AISP section prominent.

### A4 — Registry + filtering + ADR-096 + tests
- Register all 11 new templates in `src/data/examples/index.ts`
- Tag-based filtering schema in `TemplateBrowsePicker.tsx` already exists from P67/A2 (persona, industry, complexity); add visual-style filter
- ADR-096 — Template Library Expansion Standard (≤120 LOC)
- `tests/p68-oc4-templates-round2.spec.ts` (≥15 cases)

---

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new section types (use existing 16)
4. NO image URLs (CSS gradients only)
5. NO hand-curated TS template format (all .json)
6. Hero padding `80px 24px` per OC-1 design discipline
7. No `system-ui` references; only Inter / Fraunces / JetBrains Mono / Playfair Display
8. Self-contained `style:` per section
9. NO shell commands

## Acceptance gates
- 11 new `.json` templates registered
- Each ≥6 sections, real-copy, vertical-distinct
- ADR-096 Accepted
- Test spec passing
- tsc clean
- Cumulative 626 + 15 = 641+ GREEN

---

## Successor
OC-4 round 3 if owner wants the 3-template gap-filler to reach 40+, or move to OC-CLEANUP / OC-12 live-LLM.
