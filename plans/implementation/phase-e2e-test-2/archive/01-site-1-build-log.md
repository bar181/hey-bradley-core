# E2E-TEST-2 Sprint — Site 1 Build Log (C1)

> **Phase:** E2E-TEST-2 · **Wave 1 / C1** · **Date:** 2026-05-03
> **Owns:** `plans/implementation/phase-e2e-test-2/01-site-1-build-log.md` (this file) + `src/data/examples/coffee-essay.json` + `tests/fixtures/e2e2-coffee-essay-logevents.json`
> **Scenario:** Long-form blog import — user pastes a 2000-word essay on specialty coffee into chat, then refines with 4-5 follow-up prompts.
> **Output:** `coffee-essay.json` validated against `MasterConfig` (7 sections single-page; site title "The Pour Lab"; warm-paper / espresso theme; voice = thoughtful / specific / first-person)

## §1 Per-prompt log table

| seq | timestamp | request_id | event_type | prompt (excerpt ≤80 chars) | classified_intent | patches_applied | latency_ms |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-03T09:00:00Z | req-001 | intent_classification | "essay-2078words [paste]" | verb=generate, target=article, len=2078, atom=DECOMP_ATOM | scaffold MasterConfig; site.purpose=blog, audience=consumer, tone=warm; long-form path triggered (>500 chars) | 1820 |
| 2 | 2026-05-03T09:00:02Z | req-001 | decomp_split | "essay-2078words [paste]" | DECOMP→5 todos: intro/sec1/sec2/sec3/sec4/conclusion; confidence 0.88 | structure extracted: 1 hero summary + 4 article subheads + 1 conclusion; pull-quote candidate flagged at paragraph 3 | 220 |
| 3 | 2026-05-03T09:00:03Z | req-001 | template_match | "essay-2078words [paste]" | SELECTION_ATOM matched theme=warm-paper + sections=[hero,article,pull-quote,cta,footer]; conf 0.81 | theme.preset=warm-paper; palette → parchment+espresso (bgPrimary #f7f1e6, accentPrimary #7a3b1d, accentSecondary #c98a4b) | 290 |
| 4 | 2026-05-03T09:00:04Z | req-001 | process_atom_output | "essay-2078words [paste]" | CONTENT_ATOM regen × 6 (hero summary + 4 article paragraphs + 1 pull-quote candidate); voice=thoughtful,specific,first-person | sections[]=[menu, hero, article, pull-quote, cta, footer]; hero.subtitle=92-word essay summary; article.4 paragraphs each ≥80 words; pull-quote draft = "single-origin is how I learned I prefer washed Kenyans in winter" | 2480 |
| 5 | 2026-05-03T09:00:08Z | req-001 | patch_validation | "essay-2078words [paste]" | bulk apply (47 patch ops) | 6 sections inserted, theme palette set, typography Fraunces+Inter applied, hero+article populated | 140 |
| 6 | 2026-05-03T09:00:36Z | req-002 | intent_classification | "make the hero darker" | verb=change, target.type=hero, target.attr=style.background, atom=INTENT_ATOM | sections[hero].style.background → "#ece2cf" (deeper parchment) — REVERTED in seq 7 (user clarified) | 180 |
| 7 | 2026-05-03T09:00:44Z | req-003 | intent_classification | "actually keep parchment but darken the cta gradient" | verb=change, target.type=cta, target.attr=style.background; corrects seq 6 | sections[hero].style reverted; sections[cta].style.background → "linear-gradient(135deg, #7a3b1d 0%, #c98a4b 100%)" (deeper espresso) | 240 |
| 8 | 2026-05-03T09:00:58Z | req-004 | intent_classification | "add a pull-quote from the third paragraph" | verb=add, target.type=quotes, target.variant=pull-quote, source.paragraph=3, atom=CONTENT_ATOM | sections[].insert at order=2: quotes section variant=single with one pull-quote component; quote text from para-3 (single-origin paragraph); 60-100 char excerpt | 870 |
| 9 | 2026-05-03T09:01:10Z | req-005 | intent_classification | "shorten the article excerpt in the hero" | verb=change, target.type=hero, target.component=subtitle, atom=CONTENT_ATOM | sections[hero].components[subtitle].props.text rewritten 134→92 words; preserves three-pour ratio detail + four-year frame | 950 |
| 10 | 2026-05-03T09:01:24Z | req-006 | intent_classification | "add a small testimonial section with two reader quotes" | verb=add, target.type=quotes, target.variant=two-up, count=2, atom=CONTENT_ATOM | sections[].insert at order=3 (after pull-quote): quotes section variant=two-up with 2 testimonial components; readers Marina Lo + Devon Patel; voice matches first-person honest tone | 1140 |
| 11 | 2026-05-03T09:01:38Z | req-007 | patch_validation | "add a small testimonial section with two reader quotes" | follow-up patch from seq 10 | sections.length 5→7 (post-pull-quote insert + post-testimonial insert); order indices renumbered; final layout = menu / hero / article / pull-quote / testimonials / cta / footer | 90 |

## §2 Per-prompt narrative

### Prompt 1 — Long-form essay paste (chat)
- **Input:** 2078-character paste — five-paragraph essay on specialty coffee, opening with the V60 anchor, then four sections (V60 vs espresso / acidity legibility / single-origin as information / brewing math), closing with a personal reflection on Sunday discipline.
- **Mode:** chat
- **Pipeline:** Length-detect threshold (>500 chars) routes through DECOMP_ATOM long-form branch instead of normal verb+target classifier. DECOMP splits the essay into 5 logical sections + summary + pull-quote candidate. SELECTION_ATOM matches against warm/personal theme bank (`warm-paper` wins on parchment + espresso color cues). CONTENT_ATOM regenerates hero summary + article body + initial pull-quote in one batched LLM-equivalent pass.
- **Patches:** Full MasterConfig scaffolded — site.brandName="The Pour Lab", domain="pourlab.com", author="Jules Henrik". Theme = warm-paper light mode, parchment bg, espresso accents, Fraunces headings + Inter body. Sections = menu, hero (with 92-word summary), article (5 subheads + 5 long paragraphs), cta, footer.
- **Latency:** 1820ms (length-detect +50 / DECOMP +220 / SELECTION +290 / CONTENT +1200 / patch apply +140 / overhead +20).
- **Resulting state:** 5-section site (menu, hero, article, cta, footer); article carries the bulk of the essay; pull-quote candidate flagged but not yet inserted as its own section.

### Prompt 2 — "make the hero darker" (chat)
- **Input:** "make the hero darker"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM only — no DECOMP needed (single clause). `verb=change, target.type=hero, target.attr=style.background`. CONTENT_ATOM not invoked — this is a design patch, not a copy regen.
- **Patches:** sections[hero].style.background → "#ece2cf" (a step deeper into the parchment family). User reviews and immediately backs out in the next prompt — flagged as ambiguous intent (the user wanted the CTA darker, not the hero).
- **Latency:** 180ms (rules +30 / palette resolve +120 / patch +30).
- **Resulting state:** Hero temporarily darker; reverted in seq 7.

### Prompt 3 — Clarification + CTA gradient darken (chat)
- **Input:** "actually keep parchment but darken the cta gradient"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM with corrective verb pattern ("actually keep X but Y"); previous patch from seq 6 is rolled back via store undo; new patch applies to sections[cta].style.background. Trigger word `cta` resolves directly to action section type (per ADR-100 18-section enum).
- **Patches:** sections[hero].style.background reverted to "#f7f1e6" (parchment); sections[cta].style.background → "linear-gradient(135deg, #7a3b1d 0%, #c98a4b 100%)" (espresso → caramel gradient).
- **Latency:** 240ms (undo +60 / rules +30 / gradient resolve +120 / patch +30).
- **Resulting state:** Parchment hero preserved; CTA now anchored by a warm espresso gradient; theme cohesion held.

### Prompt 4 — "add a pull-quote from the third paragraph" (chat)
- **Input:** "add a pull-quote from the third paragraph"
- **Mode:** chat
- **Pipeline:** Trigger word `pull-quote` (per the trigger-word taxonomy doc C4 will ship) maps to `quotes` section type with variant=`pull-quote`. INTENT_ATOM resolves `verb=add, target.type=quotes, source.paragraph=3`. CONTENT_ATOM extracts a 60-100 character excerpt from the third article paragraph (single-origin section). Pull-quote candidate flagged in seq 2 is resurfaced as the suggested excerpt.
- **Patches:** sections[].insert at order=2 a new `quotes` section with variant=`single`, containing one `pull-quote` component. Quote text: "Drinking single-origin is how I learned I prefer washed Kenyans in winter." Attribution: "From paragraph three — single-origin as information."
- **Latency:** 870ms (rules +50 / source-paragraph extract +220 / CONTENT excerpt-pick +500 / patch +100).
- **Resulting state:** 6-section site; pull-quote sits between article and cta as a typographic breath.

### Prompt 5 — "shorten the article excerpt in the hero" (chat)
- **Input:** "shorten the article excerpt in the hero"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=change, target.type=hero, target.component=subtitle`. CONTENT_ATOM rewrites with length constraint (target ~90 words, down from 134). Voice attributes (thoughtful / specific / first-person) preserved — this is a tightening pass, not a tone change.
- **Patches:** sections[hero].components[subtitle].props.text rewritten — preserves the load-bearing details (four years, V60, three-pour ratio, 94 degrees) while dropping subordinate clauses. Final length: 92 words.
- **Latency:** 950ms (rules +30 / CONTENT regen with length cap +870 / patch +50).
- **Resulting state:** Hero summary tighter; reads in ~25 seconds instead of ~40.

### Prompt 6 — "add a small testimonial section with two reader quotes" (chat)
- **Input:** "add a small testimonial section with two reader quotes"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=add, target.type=quotes, target.variant=two-up, count=2`. Trigger word `testimonial` maps to `quotes` section with `testimonial` component type (mirrors aisp-executive precedent). CONTENT_ATOM generates two reader quotes in voice-matched first-person honest register — Marina Lo and Devon Patel, both framed as actual newsletter readers.
- **Patches:** sections[].insert at order=3 a new `quotes` section with variant=`two-up`, two `testimonial` components. Layout = grid columns=2 gap=24px maxWidth=780px (matches typography.containerMaxWidth).
- **Latency:** 1140ms (rules +30 / CONTENT 2× regen +980 / patch apply +130).
- **Resulting state:** 7-section site; final shape is menu / hero / article / pull-quote / testimonials / cta / footer. Order indices renumbered post-insert.

## §3 Total wall-clock simulated

- **Sum of latency_ms:** 8,420 ms (= 1820 + 220 + 290 + 2480 + 140 + 180 + 240 + 870 + 950 + 1140 + 90)
- **Per-prompt avg (user-visible):** ~1,403 ms (6 user prompts; 5 internal pipeline steps under prompt 1)
- **Mode breakdown:**
  - chat: 6 prompts → 8,420 ms
  - listen: 0 prompts (this scenario is paste-driven; sibling C3 covers listen mode)
- **Atom-path breakdown:**
  - INTENT only (rules / design patches): 2 prompts (420 ms — prompts 2, 3)
  - INTENT → CONTENT_ATOM (copy regen): 3 prompts (2,960 ms — prompts 4, 5, 6)
  - DECOMP → SELECTION → CONTENT (long-form import): 1 prompt (5,040 ms — prompt 1, including 5 internal pipeline steps)
- **Atoms invoked (unique):** INTENT_ATOM, DECOMP_ATOM, SELECTION_ATOM, CONTENT_ATOM (4 of the 8 AISP atoms).
- **Patches applied (total):** 53 patch operations across 6 user prompts.

## §4 Final state

- **Page 1 (single-page site):** 7 sections — menu / hero / article(long-form, 5 subheads + 5 paragraphs) / pull-quote / testimonials / cta / footer
- **Theme:** warm-paper light mode; parchment background (#f7f1e6) + espresso accents (#7a3b1d / #c98a4b); Fraunces headings + Inter body
- **Voice:** thoughtful, specific, first-person (preserved across all CONTENT_ATOM regens)
- **Concrete details preserved across the build:** four years of pour-over, ~6000 cups, V60, 94°C, 15g/250g ratio (60g/L SCA), 1.35% TDS, 18-22% extraction yield window, washed Kenyan AAs, natural Colombians, Hario V60, ~$90 entry budget
- **Schema validation:** `coffee-essay.json` parses cleanly + matches `MasterConfig` type at index.ts wire-time (C4 owns wire)
- **DECOMP / process atom outputs persisted:** seq 2 (decomp_split) + seq 4 (process_atom_output) per ADR-126 + ADR-127 — both event_types are valid migration 005 enum members
