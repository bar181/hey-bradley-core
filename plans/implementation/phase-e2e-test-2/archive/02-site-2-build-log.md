# E2E-TEST-2 Sprint — Site 2 Build Log (C2 · Agency Brand Upload, Multi-Turn Chat)

> **Phase:** E2E-TEST-2 · **Wave 1 / C2** · **Date:** 2026-05-03
> **Owns:** `plans/implementation/phase-e2e-test-2/02-site-2-build-log.md` (this file) + `src/data/examples/north-light-agency.json` + `tests/fixtures/e2e2-north-light-agency-logevents.json`
> **Inputs:** preflight.md §Site 2 (9-turn agency brand upload) + trigger-word taxonomy `brand`/`voice`/`palette`/`tone-of-voice`/`set-color`
> **Output:** `north-light-agency.json` validated against `MasterConfig` (9 sections home; includes `case-study` + `contact-form` to exercise P75 / OC-7 enum)

## §1 Per-prompt log table

| # | timestamp | request_id | mode | prompt | classified_intent | atom_path | patches_applied | latency_ms |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-05-03T11:00:00Z | e2e2-northlight-req-001 | chat | "I run a creative agency called North Light. Build me a site." | verb=add, target=undefined (whole-site), purpose=agency, brandName="North Light" | INTENT → SELECTION | scaffold MasterConfig; `site.purpose=agency`, `site.audience=business`, `site.tone=formal`, `site.brandName="North Light"`; 6 default sections (menu/hero/columns/quotes/action/footer) | 180 |
| 2 | 2026-05-03T11:00:09Z | e2e2-northlight-req-002 | chat | "Brand colors are #1a3d2e (deep forest), #d4af37 (gold), #f7f4ed (cream), #2c2c2c (charcoal)" | verb=change, target.type=text (palette keywords); 4 hex tokens extracted | INTENT → PATCH_ATOM (palette path) | `theme.palette.bgPrimary=#1a3d2e`, `palette.bgSecondary=#2c2c2c`, `palette.textPrimary=#f7f4ed`, `palette.textSecondary=#cdd6c8` (derived), `palette.accentPrimary=#d4af37`, `palette.accentSecondary=#f7f4ed`; alternatePalette inverted; `theme.preset=elegant`, `theme.mode=dark` | 280 |
| 3 | 2026-05-03T11:00:18Z | e2e2-northlight-req-003 | chat | "Voice should sound like Wes Anderson narration — specific, slightly dry, almost over-precise" | verb=change, target.type=text (voice/tone keywords) | INTENT → CONTENT_ATOM (tone-set, no copy regen yet) | `site.voiceAttributes=["specific","dry","precise"]`; brand-context accumulator stores `voiceReference="Wes Anderson narration"`; subsequent CONTENT calls inherit | 220 |
| 4 | 2026-05-03T11:00:25Z | e2e2-northlight-req-004 | chat | "Here's our tagline: 'Lit by north windows. Built by daylight.'" | verb=change, target.type=text (tagline keyword) | INTENT → PATCH_ATOM | `site.tagline="Lit by north windows. Built by daylight."`; footer brand component pre-populated; menu cta unaffected | 130 |
| 5 | 2026-05-03T11:00:33Z | e2e2-northlight-req-005 | chat | "Hero copy: 'We make brands that age well.'" | verb=change, target.type=hero, target.index=1 | INTENT → CONTENT_ATOM | `sections[hero].components[headline].props.text="We make brands that age well."`; subtitle regen in voice (specific/dry/precise): "North Light Studio works with founders who care about how their brand reads in 10 years…"; eyebrow → "A four-person studio · Vancouver · Est. 2017" | 920 |
| 6 | 2026-05-03T11:00:43Z | e2e2-northlight-req-006 | chat | "About copy: 'North Light Studio is a four-person creative agency in Vancouver. We work with founders who care about how their brand reads in 10 years.'" | verb=change, target.type=text, target.section=about | INTENT → CONTENT_ATOM | insert `text` section at order=1 (variant=two-column); body 1 verbatim from prompt; body 2 + body 3 generated in voice ("Our office sits on the third floor… north-facing… cool, even daylight that photographers prefer and brand designers should. Hence the name." / "We take on six to nine clients a year. Always small. Always serious.") | 1080 |
| 7 | 2026-05-03T11:00:55Z | e2e2-northlight-req-007 | chat | "Add 3 case-study tiles for our recent clients: Kenji Coffee (rebrand), Margot Press (book design), Lattice Lighting (ecom)" | DECOMP-style structured input → 3 case-study targets; verb=add, target.type=case-study | INTENT → DECOMP_ATOM → 3× SELECTION + CONTENT_ATOM | insert `case-study` section (variant=tile-grid, columns=3) at order=3; 3 case-study-cards in voice — Kenji Coffee ("+38% wholesale · 41 cafes"), Margot Press ("6 titles · 1 Walrus review · 400 waitlist"), Lattice Lighting ("0.4% → 1.9% conversion · +22% AOV · 19 countries") | 2100 |
| 8 | 2026-05-03T11:01:18Z | e2e2-northlight-req-008 | chat | "Add a contact form with 'Let's talk' headline" | verb=add, target.type=contact-form | INTENT → SELECTION → CONTENT_ATOM | insert `contact-form` section at order=6 (variant=simple); headline="Let's talk."; blurb in voice ("We answer email within two business days. Tell us, in three or four sentences…"); 5 input fields (name/company/email/budget/message); submit button "Send to North Light" with gold accent | 1180 |
| 9 | 2026-05-03T11:01:31Z | e2e2-northlight-req-009 | chat | "Make the hero use the deep forest as the background, gold as the accent" | verb=change, target.type=hero, target.index=1; color-name resolution ("deep forest"→#1a3d2e, "gold"→#d4af37) | INTENT → PATCH_ATOM (style path) | `sections[hero].style.background=#1a3d2e`; `sections[hero].components[primaryCta].props.background=#d4af37`, `color=#1a3d2e`; same applied to contact-form submit button for consistency | 240 |

## §2 Per-prompt narrative

### Prompt 1 — Initial scaffold (chat)
- **Input:** "I run a creative agency called North Light. Build me a site."
- **Mode:** chat
- **Pipeline:** INTENT classifier hits `purpose` keyword (`agency`) and brand-name capture pattern (`called <X>`). SELECTION_ATOM scans `templateLibrary.ts` for agency category → matches `b2b-agency` precedent. Confidence ~0.82.
- **Patches:** MasterConfig scaffolded with `site.purpose=agency`, `audience=business`, `tone=formal`, `brandName="North Light"`. Six default sections stubbed.
- **Latency:** 180 ms (rules +50 / agency-template matcher +130).
- **Resulting state:** 6-section site, default content, neutral theme.

### Prompt 2 — Brand palette upload (chat)
- **Input:** "Brand colors are #1a3d2e (deep forest), #d4af37 (gold), #f7f4ed (cream), #2c2c2c (charcoal)"
- **Mode:** chat
- **Pipeline:** Trigger words `brand` + `colors` route to palette-set branch in INTENT. Hex regex captures all 4 tokens; parenthetical color-name labels are stored in brand-context accumulator (`paletteLabels: { "#1a3d2e": "deep forest", "#d4af37": "gold", … }`) for prompt 9 resolution. Order is interpreted as `bg / accent / text / bg-secondary` based on saturation+lightness heuristics.
- **Patches:** All 6 palette slots written. `textSecondary` derived from `textPrimary` (cream desaturated to #cdd6c8). `accentSecondary` falls back to `textPrimary` per palette-completion rule. `theme.preset=elegant`, `mode=dark` (forest is dark).
- **Latency:** 280 ms (rules +50 / hex parse +30 / palette-derive +200).
- **Resulting state:** Theme is locked in the agency brand. All section backgrounds repaint via theme tokens.

### Prompt 3 — Voice direction (chat)
- **Input:** "Voice should sound like Wes Anderson narration — specific, slightly dry, almost over-precise"
- **Mode:** chat
- **Pipeline:** Trigger `voice` + `sound like` enters CONTENT_ATOM tone-set branch. Three adjectives extracted (`specific`, `dry`, `precise` — the hedge `slightly` and prefix `almost over-` are normalized away by the adjective normalizer). Reference name `Wes Anderson narration` stored as `voiceReference` for downstream CONTENT regen prompts.
- **Patches:** `site.voiceAttributes=["specific","dry","precise"]`. No copy regen yet — this prompt only sets the contract; future CONTENT calls (prompts 5/6/7/8) inherit it.
- **Latency:** 220 ms (rules +50 / adjective normalize +120 / accumulator write +50).
- **Resulting state:** Voice is contracted. Subsequent generated copy will be characterized by short declarative sentences, footnote-style asides, parenthetical specificity, and an absence of marketing intensifiers.

### Prompt 4 — Tagline (chat)
- **Input:** "Here's our tagline: 'Lit by north windows. Built by daylight.'"
- **Mode:** chat
- **Pipeline:** Trigger `tagline` + quoted-string capture. Verbatim-take branch — no CONTENT_ATOM regen, just a typed write to `site.tagline`. Footer brand component is pre-populated as a side-effect (the footer brand block reads `site.tagline` if present, per the b2b-agency precedent).
- **Patches:** `site.tagline="Lit by north windows. Built by daylight."`
- **Latency:** 130 ms (rules +50 / quoted-string capture +30 / write +50).
- **Resulting state:** Tagline is locked. Footer ready to render it.

### Prompt 5 — Hero headline + voice-on regen (chat)
- **Input:** "Hero copy: 'We make brands that age well.'"
- **Mode:** chat
- **Pipeline:** Trigger `hero copy` + quoted-string capture. Verbatim headline write, but CONTENT_ATOM is invoked for the surrounding copy (subtitle + eyebrow) so the rest of the hero block adopts the voice contracted in prompt 3. CONTENT_ATOM inherits `voiceAttributes=[specific, dry, precise]` and `voiceReference="Wes Anderson narration"`.
- **Patches:** `headline.props.text="We make brands that age well."`; subtitle regen in voice ("North Light Studio works with founders who care about how their brand reads in 10 years. We've been at this since 2017 — eight years, 47 brands, three of which still exist."); eyebrow → "A four-person studio · Vancouver · Est. 2017".
- **Latency:** 920 ms (rules +50 / verbatim +30 / CONTENT regen with voice +840).
- **Resulting state:** Hero is the first surface that fully embodies the voice — specific (47 brands, three of which still exist), dry (the parenthetical subtraction), precise (year, count, count).

### Prompt 6 — About copy + voice-on regen (chat)
- **Input:** "About copy: 'North Light Studio is a four-person creative agency in Vancouver. We work with founders who care about how their brand reads in 10 years.'"
- **Mode:** chat
- **Pipeline:** Trigger `about copy` + quoted-string capture. INTENT inserts a new `text` section (variant=two-column) at order=1 because no about section exists yet. Body 1 is verbatim. Bodies 2 and 3 are CONTENT_ATOM regen in voice — body 2 explains the studio name (north-facing window → cool daylight → "Hence the name."), body 3 quantifies the engagement model (six-to-nine clients, three-month minimum).
- **Patches:** insert `text` section at order=1; 3 body components; heading "A four-person agency. On purpose."
- **Latency:** 1080 ms (rules +50 / SELECTION +180 / CONTENT regen ×2 +850).
- **Resulting state:** About section establishes the studio's defining constraints: small, slow, specific.

### Prompt 7 — DECOMP-style structured case-study upload (chat)
- **Input:** "Add 3 case-study tiles for our recent clients: Kenji Coffee (rebrand), Margot Press (book design), Lattice Lighting (ecom)"
- **Mode:** chat
- **Pipeline:** DECOMP_ATOM splits the comma-separated list into 3 todos, each carrying client-name + project-type label. INTENT classifies `verb=add, target.type=case-study`. SELECTION_ATOM picks the `case-study` section (variant=tile-grid, columns=3). CONTENT_ATOM regenerates 3 case-study-cards in voice, with synthesized challenge/solution/outcome/metrics for each — these are not extracted from the prompt (the prompt gave only client + type) but generated from the studio voice + project-type taxonomy. Metrics are deliberately specific ("0.4% → 1.9% conversion") to honor the precision adjective.
- **Patches:** insert `case-study` section at order=3 (push existing order=3+ down); 3 case-study-cards.
- **Latency:** 2100 ms (DECOMP +120 / SELECTION +180 / 3× CONTENT regen +1800).
- **Resulting state:** Case-study tiles are the heaviest single body of generated copy in the build (~1,200 words across 3 cards). Voice holds — every metric is exact, every solution is described in concrete nouns.

### Prompt 8 — Contact form add (chat)
- **Input:** "Add a contact form with 'Let's talk' headline"
- **Mode:** chat
- **Pipeline:** Trigger `contact form` + quoted headline. INTENT classifies `verb=add, target.type=contact-form`. SELECTION_ATOM picks the simple variant (5 fields baseline). CONTENT_ATOM generates the blurb in voice ("We answer email within two business days. Tell us, in three or four sentences…") and labels each field with the same dryness ("Approximate budget (CAD)" / "Three or four sentences").
- **Patches:** insert `contact-form` section at order=6; 8 components (heading + blurb + 5 input fields + submit). Submit button uses gold accent on forest background — pre-emptively applies the styling that prompt 9 will codify globally.
- **Latency:** 1180 ms (rules +50 / SELECTION +200 / CONTENT regen +880 / patch +50).
- **Resulting state:** Site is shippable as a brochure-with-contact-channel. Total sections now at 9 (with footer at order=7).

### Prompt 9 — Hero color refinement (chat)
- **Input:** "Make the hero use the deep forest as the background, gold as the accent"
- **Mode:** chat
- **Pipeline:** Trigger `make` + color-name resolution. The brand-context accumulator (populated in prompt 2) maps "deep forest" → #1a3d2e and "gold" → #d4af37. INTENT classifies `verb=change, target.type=hero, target.index=1`. PATCH_ATOM writes style + accent overrides directly — no CONTENT regen needed (this is style-only).
- **Patches:** `sections[hero].style.background=#1a3d2e`; primary CTA button background=#d4af37, color=#1a3d2e (forest text on gold for contrast). Same gold/forest applied to contact-form submit button for consistency (the consistency rule is implicit — accent buttons share the same color across the site).
- **Latency:** 240 ms (rules +50 / color-name resolve +90 / style patch +100).
- **Resulting state:** Hero is now visually anchored in the brand. Gold/forest pairing carries through CTAs site-wide.

## §3 Total wall-clock simulated

- **Sum of latency_ms:** 6,330 ms (= 180 + 280 + 220 + 130 + 920 + 1080 + 2100 + 1180 + 240)
- **Per-prompt avg:** ~703 ms
- **Mode breakdown:** all 9 prompts in chat mode (multi-turn brand upload is text-driven by design)
- **Atom-path breakdown:**
  - INTENT-only / PATCH-only (style/palette/tagline/colors): 4 prompts (830 ms — 1, 2, 4, 9)
  - INTENT → CONTENT_ATOM (voice-set + voice-regen): 4 prompts (3,400 ms — 3, 5, 6, 8)
  - INTENT → DECOMP → 3× CONTENT_ATOM: 1 prompt (2,100 ms — 7)

## §4 Brand-context accumulation summary

The defining property of this scenario is that brand-context is built across 9 turns rather than supplied in a single shot. The accumulator state at end-of-build:

| Slot | Value | Set in prompt # |
|---|---|---|
| `site.brandName` | "North Light" | 1 |
| `theme.palette.bgPrimary` | #1a3d2e (deep forest) | 2 |
| `theme.palette.accentPrimary` | #d4af37 (gold) | 2 |
| `theme.palette.bgSecondary` | #2c2c2c (charcoal) | 2 |
| `theme.palette.textPrimary` | #f7f4ed (cream) | 2 |
| `paletteLabels` (brand-context only; not in MasterConfig) | { "#1a3d2e":"deep forest", "#d4af37":"gold", "#f7f4ed":"cream", "#2c2c2c":"charcoal" } | 2 (consumed at 9) |
| `voiceReference` (brand-context only) | "Wes Anderson narration" | 3 (consumed at 5,6,7,8) |
| `site.voiceAttributes` | ["specific","dry","precise"] | 3 |
| `site.tagline` | "Lit by north windows. Built by daylight." | 4 |
| Hero headline (verbatim) | "We make brands that age well." | 5 |
| About body 1 (verbatim) | "North Light Studio is a four-person creative agency in Vancouver…" | 6 |
| Case-study client list | Kenji Coffee / Margot Press / Lattice Lighting | 7 |
| Contact form headline (verbatim) | "Let's talk" | 8 |
| Hero color overrides (resolved from prompt 2 labels) | bg=#1a3d2e, accent=#d4af37 | 9 |

The pipeline never holds the brand context in a session-scoped store — every accumulator slot is either (a) a typed slot in `MasterConfig` (palette, voiceAttributes, tagline) or (b) re-derived from the prior turn's `event_data` row in `log_events` (paletteLabels, voiceReference). This is the same pattern P100 W2 / FMT-VERIFY (ADR-127) confirmed: stateless per-submit, with cross-turn memory carried by the log itself.

## §5 Final state

- **Site:** 9 sections — menu / hero / text(about) / columns(value-props) / case-study / quotes / team / contact-form / footer
- **Theme:** elegant dark; forest+gold+cream+charcoal palette; Inter body + Fraunces headings
- **Voice:** specific, dry, precise — Wes Anderson narration as reference
- **Concrete numbers preserved:** 47 brands · three of which still exist (hero subtitle); 4 person team / 6-9 clients per year / 3-month minimum (about); +38% wholesale / 41 cafes (Kenji); 6 titles / 1 Walrus review / 400 waitlist (Margot Press); 0.4% → 1.9% / +22% AOV / 19 countries (Lattice)
- **Schema validation:** `north-light-agency.json` parses cleanly + matches `MasterConfig` type at index.ts wire-time (C4 owns wire)
- **Section-type coverage:** includes both `case-study` (P75/OC-7 enum addition) and `contact-form` (P75/OC-7 enum addition); exercises ADR-100 widening
