# R1 — Projects Load + Visual Quality Review

## Summary

All 5 example sites parse as JSON, validate cleanly against `masterConfigSchema` (Zod), use only canonical 18 section types, ship valid 6-digit hex palettes (primary + alternate), and contain zero Lorem-ipsum filler. Copy is genuinely opinionated and persona-consistent across all five — the differentiation between Axon (terminal-blunt), GreenLane (founder-direct), Quattro (restrained-polished), Mrs. Albright (warm-grandmotherly), and Bordo (engineer-exact) is real, not cosmetic. Composite **9.0/10**, verdict **PASS**.

## Per-project scoring

### Project 1 — Axon CLI (developer)
- JSON parses: YES
- Zod validates: YES (`masterConfigSchema.safeParse → ok`)
- Section types canonical: YES (`menu, hero, columns, text, pricing, quotes, action, footer` — 8 sections; +4 sections in `pages.docs`; all in 18-enum)
- Hex palette valid: YES (12/12 hex strings match `/^#[0-9a-fA-F]{6}$/` across primary + alternate)
- Copy quality 1-10: **9** — terminal-native voice carries through (`"$ axon"` logo, `"// six things Axon does"` headings, code-block `"→ 7 CVEs surfaced (2 high, 5 medium)"`); pricing tier names matter (`"Pay for parallelism. Open source covers the single-developer case."`); testimonials are titled by role only (`"Eng Manager · Sequent"`) which is the right move for a developer audience.
- Persona consistency: YES — every surface stays dry/precise; footer copyright `"Built for engineers who hate review meetings."` matches the hero `"Stop reviewing dependencies one PR at a time."`
- Overall score: **9/10**

### Project 2 — GreenLane (Marcus startup)
- JSON parses: YES
- Zod validates: YES
- Section types canonical: YES (`menu, hero, text, columns, pricing, team, action, footer`; 8 sections, all 18-enum)
- Hex palette valid: YES (12/12)
- Copy quality 1-10: **9** — founder-direct without bro-tech swagger; hero (`"You're spending 40 hours a week on compliance reports instead of building product."`) names the problem plainly; problem section (`"Compliance is not a feature. It is a tax on focus."`) is genuinely confident-not-cocky; team bios are specific (`"Wrote the compliance report by hand once. Decided that was enough for one career."`).
- Persona consistency: YES — `voiceAttributes: ["confident", "direct", "understated"]` shows up everywhere; CTA fineprint `"Two-business-day reply, always from a founder."` lands the persona.
- Overall score: **9/10**

### Project 3 — Quattro Studio (Sarah agency)
- JSON parses: YES
- Zod validates: YES
- Section types canonical: YES (`menu, hero, text, case-study, gallery, team, contact-form, footer`; 8 sections; uses both P75/OC-7 additions — `case-study` + `contact-form`)
- Hex palette valid: YES (12/12; cream `#f4ecdc` + ink `#0c1d3a` + gold `#b08a3e` is genuinely elegant)
- Copy quality 1-10: **10** — the strongest of the five. Case studies have actual numbers (`"Series-B 3.2x step-up"`, `"+64% ACV · 11 → 6 week cycle"`, `"+41% pipeline conversion"`); positioning is brave (`"We work with seed-to-Series-B founders. That's the line."`); contact form fineprint (`"We engage on projects of $80k and up"`) is the kind of self-selection a real boutique writes.
- Persona consistency: YES — restrained-polished holds throughout; team bios end with disciplined one-liners (`"Believes a brand is finished when nothing more can be removed without breaking it."`)
- Overall score: **10/10**

### Project 4 — Mrs. Albright (Grandma listen)
- JSON parses: YES
- Zod validates: YES
- Section types canonical: YES (`menu, hero, text, contact-form, footer`; 6 sections; deliberately spare)
- Hex palette valid: YES (12/12; warm-paper `#fdf8ec` + walnut `#3a3528` + honey `#c69a3a` reads as a retired-teacher's home)
- Copy quality 1-10: **10** — pitch-perfect grandma persona: `"Hello — I'm Margaret Albright. I taught high school English at Roosevelt High for 32 years..."`; `"A misplaced comma is much easier to learn when it's in your own sentence than when it's on a worksheet about somebody else's."` Form copy treats parents like adults (`"There's no obligation — we'll just have a short conversation about whether I'm the right tutor for your student."`).
- Persona consistency: YES — Lora typography + warm palette + plain-spoken voice cohere; footer credentials line (`"Teaching English at Roosevelt High since 1988. Now tutoring from home."`) lands.
- Overall score: **10/10**

### Project 5 — Bordo (Lars agentic spec)
- JSON parses: YES
- Zod validates: YES
- Section types canonical: YES (`menu, hero, text, footer`; 9 sections — heavy reuse of `text` for the 6 spec stages, which is correct since they're long-form prose blocks)
- Hex palette valid: YES (12/12; oxblood `#7a1f2b` + sage `#22c55e` is unusual but signals wine-domain + green-status accent)
- Copy quality 1-10: **9** — the spec-as-website concept executes: each section header documents an atom (`"PROCESS_ATOM Σ — phase decomposition"`, `"DDD_ATOM Σ — bounded contexts"`, `"AGENT_ATOM Σ — Wave 1 agent scoping"`); verbatim AISP Σ blocks render in-page; KISS verdict (`"0 P1 / 1 P2 / 0 P3 — Verdict: PASS"`) and SealPanel EOP excerpts are genuinely useful artifacts. P3 deduction: heavy reliance on `text`-type sections means visual rhythm is monotone — would benefit from a `columns` block for the agent-scoping table.
- Persona consistency: YES — blunt/exact/precise holds throughout; footer copyright (`"Spec built end-to-end with Hey Bradley Planning mode."`) closes the loop.
- Overall score: **9/10**

## Composite score
Average across 5: **(9 + 9 + 10 + 10 + 9) / 5 = 9.4/10**

## Findings

1. **P3 (note) — Bordo visual rhythm.** 6 of 9 sections are `text` type. Functionally correct (it's a spec document) but flattens the visual. Recommendation: future iteration could swap one `text` for `columns` (3-up agent cards) + one `text` for `quotes` (KISS verdict pull-quote). Not blocking — design intent is "spec, not marketing."

2. **P3 (note) — Axon home page has empty sections array.** `pages[0].sections: []` (home) plus `pages[1]` (docs) carries 4 sections. Top-level `sections[]` (8 items) is the home content; the multi-page wire per ADR-103 lets the home/docs split work, but `pages.home.sections === []` looks like an audit trip-wire. Verified intentional: home renders top-level `sections`; docs renders `pages.docs.sections`. Documentation in the JSON would help future readers.

3. **P3 (note) — Image URLs are placeholder domain.** Quattro gallery uses `https://images.example.com/quattro/*.jpg` (6 tiles). Not a Lorem violation (alt text is real), and the placeholder is correct hygiene at template level — but a build-time check that flags `images.example.com` as not-yet-bound would catch this before the user hosts the site. Carry-forward suggestion only.

## Verdict

**PASS** — all 5 sites are production-quality fixtures suitable for E2E pipeline validation, demo seed corpus, and persona-rubric scoring. Zero P1, zero P2, three P3 (notes). Composite 9.4/10 against the ADR-094 Professional Grade Standard floor of 8.5.
