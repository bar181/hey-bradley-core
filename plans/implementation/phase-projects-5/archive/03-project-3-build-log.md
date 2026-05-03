# Project 3 — Quattro Studio (Sarah · Agency · 8-turn build log)

**Sprint:** 5-PROJECTS / Project 3
**Persona:** Sarah Vance — agency principal
**Site:** Quattro Studio — boutique brand-and-product agency, Austin
**Mode:** Chat
**Date:** 2026-05-03

## Persona profile

Sarah is the founding principal of a four-partner studio working with venture-backed companies between seed and Series-B. Her voice in the chat is **polished, restrained, confident** — never breezy, never effusive, never apologetic. She edits as she types. She does not write the word "amazing." She picks her clients and she picks her phrasing.

Distinct from `north-light-agency` (Margot — Wes-Anderson dry/specific): Sarah is more upscale, less ironic. North Light is a four-person boutique with a literary tone; Quattro is a four-partner shop with a board-room tone.

## 8-turn sequence

| Turn | Sarah's prompt | Atom path | Outcome |
|------|----------------|-----------|---------|
| 1 | "Build an agency site for Quattro Studio — boutique brand-and-product, Austin" | INTENT → SELECTION | `purpose=agency` · `audience=business` · `tone=formal` · `brandName='Quattro Studio'` · default-sections seeded |
| 2 | "We work with seed-to-Series-B startups. Lead with that positioning" | INTENT → CONTENT (description patch) | `site.description` rewritten; positioning section primed for turn 3 hero |
| 3 | "Hero: 'We make brands ready for the round you haven't raised yet.' professional / understated" | PATCH (verbatim) + voice extraction | Hero headline verbatim · `voiceAttributes=['polished','restrained','confident']` |
| 4 | "Add 3 case-study tiles: Glycora (medical wearable rebrand), Ferment (B2B coffee infrastructure), and Soane (SaaS reporting tool)" | DECOMP (3 todos) → PATCH | `case-study` section inserted at order=2 with three case-study-cards |
| 5 | "Add a portfolio section — 6 image tiles with project names; placeholder image URLs OK" | INTENT → PATCH | `gallery` section inserted at order=3 with 6 gallery-tiles |
| 6 | "Add team section — Sarah (Principal), Aiden (Design Director), Mira (Strategy Director)" | DECOMP (3 todos) → PATCH | `team` section inserted at order=4 with three team-members |
| 7 | "Add a contact-form section with fields: name / email / company / project type / budget range / message" | INTENT → PATCH | `contact-form` section inserted at order=5 with 6 input fields + submit button |
| 8 | "Footer with location (Austin), email, social links (LinkedIn + Instagram + Are.na)" | PATCH | `footer` section finalized with location + email + 3 social links |

Total prompts: **8** · total latency: **~10.4s** (8 LLM rounds + 2 DECOMP splits)

## Final section composition (8 sections, single-page)

1. `menu` — navbar with Work / Studio / Team / Start-a-project CTA
2. `hero` — verbatim Sarah headline + warm-cream + brass-gold CTA
3. `text` — two-column positioning block (seed-to-Series-B line)
4. `case-study` — 3 tiles: Glycora · Ferment · Soane (each with challenge / solution / outcome / metrics)
5. `gallery` — 6-tile portfolio (Glycora device · Ferment warehouse · Soane dashboard · Lumen Bio · Halt Security · Orchid Foods)
6. `team` — 3-member grid: Sarah Vance (Principal) · Aiden Park (Design Director) · Mira Okafor (Strategy Director)
7. `contact-form` — 6-field form: name · email · company · project type · budget range · message
8. `footer` — multi-column: brand · Studio links · Practice links · Elsewhere (LinkedIn / Instagram / Are.na) · contact line · copyright

Both required P75/OC-7 section types present: ✅ `case-study` ✅ `contact-form`

## Voice & palette

**Voice attributes:** `["polished", "restrained", "confident"]` — applied through hero subtitle, positioning paragraphs, case-study challenge/solution/outcome copy, team bios, contact-form blurb.

**Palette:** warm-cream (`#f4ecdc`) bg primary · deep-navy (`#0c1d3a`) text + dark sections · brass (`#b08a3e`) accent. Light mode default; dark alternate palette inverted for night view. Refined-modern preset. Border radius `2px` (square-cornered, restrained).

**Typography:** Canela (heading family, weight 500) + Inter (body) · 17px base · 1.6 line-height — close kerning, large heading scale, calm rhythm.

## Distinct from sibling agency precedent

| Axis | North Light (Margot) | Quattro (Sarah) |
|------|----------------------|-----------------|
| Tone | dry, specific, literary, slightly ironic | polished, restrained, board-room confident |
| Headline mood | "We make brands that age well." | "We make brands ready for the round you haven't raised yet." |
| Palette | deep forest + gold + cream | warm cream + deep navy + brass |
| Heading family | Fraunces (literary serif) | Canela (institutional serif) |
| Border radius | 4px | 2px |
| Audience | founders generally | venture-backed seed-to-Series-B specifically |
| Team naming | first names only ("Margot, Henri…") | full names + titles ("Sarah Vance, Principal") |
| Footer copyright voice | "Lit by north windows." | "A boutique of four." |

## Hard-rule compliance

- [x] JSON validates against MasterConfig (single-page; `sections[]` only, no `pages[]`)
- [x] ≥8 sections (exactly 8) — single-page
- [x] Includes `case-study` AND `contact-form` (both P75/OC-7 section types)
- [x] Real polished copy throughout — zero Lorem ipsum, zero placeholder body text
- [x] Three owned files only: `src/data/examples/quattro-studio.json` + `tests/fixtures/project-3-quattro-studio-logevents.json` + this build log
- [x] No new dependencies
- [x] No key shapes in fixture (no `sk-…` / `AIza…` tokens)
- [x] Valid `event_type` values only (`intent_classification` · `template_match` · `decomp_split` · `patch_validation` · `response_summary` — all in migration 005 CHECK enum)
- [x] Fixture row count: 12 rows ≥ 8 minimum

## Notes for sibling closer

- This project's JSON is **not** wired into `EXAMPLE_SITES` in `src/data/examples/index.ts` — that wire-up is owned by the closer per sprint convention.
- Fixture file follows the `e2e2-north-light-agency-logevents.json` shape (array of `{session_id, request_id, event_type, input_type, event_data, latency_ms, created_at}` rows) and reuses the schema-CHECK-enum-compliant event-type set.
- Persona distinctness from `north-light-agency` is the load-bearing axis — see comparison table above.
