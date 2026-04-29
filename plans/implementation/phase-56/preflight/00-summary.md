# P56 Preflight — Sprint M: Premium Templates + Output Quality

> **Phase title:** Sprint M — 3-5 Strongly Opinionated Templates + Premium Design Discipline
> **Status:** PLANNED
> **Successor of:** P55 (Sprint L — spec unmissable)
> **Canonical roadmap:** `plans/strategic-reviews/open-core-moat-roadmap.md`

## North Star

> **3-5 strongly opinionated templates ship as flagship premium output.**
> Each template's output reads as "designer made this," not "AI made this." Opinionated curation beats the current breadth of 17 examples / 12 themes. Typography, color, image curation are tight per template — not generic.

This is moat priority #3 (premium output) from the open-core moat roadmap. Sprint J shipped the personality + mobile layer; Sprint M proves the OUTPUT is premium, not just the chat surface.

## Moat metric (the gate)

| Dimension | Target |
|---|---|
| New strongly-opinionated templates | 3-5 (final count owner-decided during dispatch) |
| Each template self-tested via example_prompts | yes (existing 35/35 coverage gate) |
| Typography discipline per template | curated typeface pair + scale; no generic Inter-everywhere |
| Color discipline per template | 3-5 swatch palette per template; no rainbow |
| Image curation per template | 8-12 hand-picked images from existing 300-image catalog |
| "Designer made this" persona vibe-check | Framer persona ≥90 (currently 90); 0 reviewers say "AI generic" |

## Scope IN — 3 parallel agents

### A1 — Template specs (3-5 new strongly-opinionated templates)
- Owner-named candidates: **SaaS founder**, **Indie portfolio**, **B2B agency**, **Conference site**, **Personal brand**
- Final count + final picks decided during dispatch (3 minimum, 5 maximum)
- Each template = registry entry in `src/contexts/intelligence/templates/registry.ts` + library entry in `src/contexts/intelligence/templates/library.ts` (P29 BrowseTemplate split-type)
- ≤80 LOC per template registry entry; ≤40 LOC per library metadata block

### A2 — Premium typography + color + image curation
- NEW `src/styles/templates/{template-id}.css` (or Tailwind theme tokens) per template — typeface pair, scale, color swatch, spacing rhythm
- Hand-curated image lists per template referencing the existing 300-image catalog (no new image assets)
- Section-level defaults that preserve premium discipline (CONTENT_ATOM tone/length defaults from P32 wired to template-specific overrides where appropriate)
- ≤200 LOC total style delta across all 3-5 templates

### A3 — ADR-079 + tests + EOP + persona re-score
- NEW `docs/adr/ADR-079-premium-template-discipline.md` (≤140 LOC; full Accepted; cross-refs ADR-058 Template Library, ADR-059 Persistence, ADR-061 Section Defaults)
- NEW `tests/p56-premium-templates.spec.ts` (~15 PURE-UNIT cases): each template registers; example_prompts coverage holds at 35/35; library metadata complete; section defaults applied
- Persona re-score (Grandma + Framer + Capstone) on output samples — Framer expected ≥90, Capstone ≥98
- EOP: session-log + retrospective + P57 preflight scaffold

## Carryforward fold-in (system-wide review §6 items 4, 6, 7)

- Top-10 #4 (replace placeholder Builder hero with branded sample) — A1 SaaS-founder or Indie-portfolio template ships with branded hero; placeholder retired.
- Top-10 #6 (memo `PersonalityPicker.previewFor`) — micro-perf folded into A2 if any picker render is touched.
- Top-10 #7 (re-render personality previews with recent input) — live-feel polish folded into A2.

## Locked decisions

- **D1 — Opinionated > broad.** 3-5 strongly-curated templates beat 12 generic ones. Existing 12 themes stay; new templates are flagship-level on top.
- **D2 — Reuse existing image catalog.** No new image assets. 300-image library is sufficient; curation is the work.
- **D3 — Reuse existing CONTENT_ATOM tone/length defaults.** Template-specific overrides allowed where premium discipline requires (e.g., conference-site = "professional" tone always).
- **D4 — Each template self-tested.** No new test infrastructure; piggyback on existing 35/35 example_prompts coverage gate.
- **D5 — AgentProxyAdapter / FixtureAdapter only.** $0 cost; PURE-UNIT tests.

## Scope OUT (deferred)

- Hosted share URL → P57
- Public release / README rewrite → P58
- New image assets — explicit defer (D2)
- Tier-2 SaaS dashboard flagship → commercial track (rec #5 product-evaluation)

## DoD

- [ ] A1 3-5 new templates registered + library entries complete
- [ ] A2 typography + color + image curation per template applied
- [ ] A3 ADR-079 full Accepted + ~15 PURE-UNIT tests GREEN
- [ ] Persona re-score: Grandma ≥82, Framer ≥90, Capstone ≥98
- [ ] tsc clean; cumulative regression GREEN
- [ ] example_prompts coverage holds at 35/35 (no regression)
- [ ] STATE.md row + CLAUDE.md roadmap updated; P57 preflight scaffolded

## Risks

- **R1 — More templates = more maintenance.** Mitigation: D4 (each template self-tested via existing coverage; no per-template test infra).
- **R2 — Premium discipline diverges from existing 12 themes.** Mitigation: new templates ship ALONGSIDE existing themes; not a replacement.
- **R3 — Curation taste-call disagreement.** Mitigation: persona re-score (A3) catches Framer-persona dislike before seal.
- **R4 — A1 + A2 grows past one-day budget.** Mitigation: drop from 5 templates to 3 if A1 grows past ≤500 LOC total.

## Cross-references

- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe — Sprint M = priority 3)
- ADR-058 (Template Library API)
- ADR-059 (Template Persistence)
- ADR-061 (Section Defaults — CONTENT_ATOM tone/length)
- `2026-04-29-sprint-j-system-wide/04-performance-and-forward.md` §6 recs 4/6/7

P56 is the proof-point that Hey Bradley produces premium output, not generic AI output. Without M, the moat surface (L) shows a beautiful spec for a mediocre site. With M, the spec describes a site you'd actually ship.
