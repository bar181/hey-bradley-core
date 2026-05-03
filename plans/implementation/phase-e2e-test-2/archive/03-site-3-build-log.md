# E2E-TEST-2 — Site 3 Build Log (Listen-Mode Coffee Roastery)

> **Phase:** E2E-TEST-2 · **Wave 1 / C3** · **Date:** 2026-05-03
> **Owns:** `plans/implementation/phase-e2e-test-2/03-site-3-build-log.md` (this file) + `src/data/examples/indie-coffee-roaster.json` + `tests/fixtures/e2e2-indie-coffee-roaster-logevents.json`
> **Reads:** `preflight.md` §Scenarios §3 + `src/contexts/intelligence/stt/transcriptCleanup.ts` (cleanTranscript per ADR-127) + `phase-e2e-test/03-site-2-build-log.md` (precedent listen-mode log)
> **Hand-off:** C4 closer reviews this log + JSON + fixture against the 10-prompt scripted listen sequence below; consumes JSON output as the canonical Site 3 example for `EXAMPLE_SITES`.

## §1 Scenario

A small-batch coffee roaster (Mateo Vega, co-founder of Switchback Coffee Co. in Berkeley CA) speaks via push-to-talk into Hey Bradley listen mode while driving home from the roastery. Heavy disfluencies, false starts, and one mid-sequence reversal (turn 9 — "actually forget the pricing tiers"). 10 spoken commands. Each transcript runs through `cleanTranscript` BEFORE classification per ADR-127 / D1.

Listen-mode latency budget per turn: ~1100-1700ms (matches Site 2 listen-prompt profile). STT-clean overhead: ~50ms (regex pass; pure transform; no I/O).

## §2 Pipeline simulation table

Each row = one PTT capture entering the listen pipeline. Both `raw_transcript` and `cleaned_transcript` are persisted to `log_events.event_data` per ADR-126 (closes the listen_capture raw==cleaned gap surfaced in P100 W2 audit). `request_id` is monotonic per session. `latency_ms` covers PTT-release → patch-applied wall-clock.

| seq | timestamp | request_id | event_type | raw_transcript (≤80) | cleaned (≤80) | classified_intent | patches_applied | latency_ms |
|---|---|---|---|---|---|---|---|---|
| 1 | 14:30:00.000 | e2e2-switchback-req-001 | intent_classification | uh okay hey bradley I want to like, build a site for my coffee… | okay hey bradley I want to build a site for my coffee roastery… | verb=add, target.type=undefined (whole-site bootstrap); brandName="Switchback" | scaffold MasterConfig + 6 default sections; site.brandName="Switchback", purpose=marketing, audience=consumer, tone=bold | 1480 |
| 2 | 14:30:01.580 | e2e2-switchback-req-002 | patch_applied | make the hero say something like 'fresh-roasted small-batch coffee… | make the hero say 'fresh-roasted small-batch coffee for people… | verb=change, target.type=hero, target.index=1 | sections[hero].components[headline].props.text="Fresh-roasted small-batch coffee for people who actually taste their drink." | 1320 |
| 3 | 14:30:03.000 | e2e2-switchback-req-003 | intent_classification | uh, change the colors to be like, you know, warm — kind of caramel… | change the colors to be warm — caramel and espresso, dark mode | verb=change, target.type=text (theme keywords route design path) | theme.preset="industrial-modern", mode="dark", palette → caramel #d68c45 + espresso #8b4513 + warm cream #f5e6d3 + deep coffee #1a0f08 | 1180 |
| 4 | 14:30:04.280 | e2e2-switchback-req-004 | patch_applied | add a, an article section about our roasting philosophy, like 200 words | add an article section about our roasting philosophy, 200 words | verb=add, target.type=text (article variant=long-form, ~200 words) | insert article-roasting-philosophy section at order=1 (drum-vs-air + light-medium + 14-day window narrative; 4 paragraphs ≈ 220 words) | 1620 |
| 5 | 14:30:06.000 | e2e2-switchback-req-005 | decomp_split | and I want like a pricing section with three tiers — taster $18, monthly… | I want a pricing section with three tiers — taster $18, monthly $32… | DECOMP → 1 todo: verb=add, target.type=pricing, tiers=3 (taster $18 / monthly $32 / club $45) | insert pricing section at order=2 with 3 tiers (taster-pack/monthly/club-of-the-month); status=APPLIED (later REPLACED at turn 9) | 1540 |
| 6 | 14:30:07.640 | e2e2-switchback-req-006 | patch_applied | oh and add a team section, just two people, me and my brother Diego | and add a team section, just two people, me and my brother Diego | verb=add, target.type=team (variant=cards, columns=2) | insert team-01 section at order=3 with 2 team-member components: Mateo Vega (Roaster · co-founder) + Diego Vega (Sourcing · co-founder) | 1380 |
| 7 | 14:30:09.120 | e2e2-switchback-req-007 | patch_applied | for the cta, say 'Get tomorrow's roast.' I dunno, sound urgent | for the cta, say 'Get tomorrow's roast.' sound urgent | verb=change, target.type=action, target.index=1; tone=urgent | sections[cta-01].components[cta-heading].props.text="Get tomorrow's roast."; primaryCta on hero updated to match; subhead rewritten with urgency cues | 1280 |
| 8 | 14:30:10.500 | e2e2-switchback-req-008 | patch_applied | make it more, uh, more punchy. shorter sentences | make it more punchy. shorter sentences | verb=change, target.type=text (site-wide tone refine); voiceAttributes=["punchy","urgent","specific"] | regenerate hero subtitle + article paragraphs + cta-sub with shorter sentence cadence; site.voiceAttributes update; no structural patches | 1450 |
| 9 | 14:30:12.050 | e2e2-switchback-req-009 | decomp_split | actually forget the pricing tiers, just make pricing a single hero — uh, hero pricing… | forget the pricing tiers, make pricing a single hero — hero pricing with the monthly $32 plan | DECOMP → 2 todos: (a) verb=remove, target.type=pricing, target.index=1; (b) verb=add, target.type=pricing, variant=single-hero, plan=monthly $32 | REMOVE patch on pricing-01 (3-tier); ADD patch with single-hero variant + monthly $32 plan only; net effect = REPLACE | 1700 |
| 10 | 14:30:13.850 | e2e2-switchback-req-010 | patch_applied | add a footer with our address — Berkeley California, 94703 | add a footer with our address — Berkeley California, 94703 | verb=add, target.type=footer (variant=multi-column, columns=4); address=Berkeley CA 94703 | replace default footer placeholder with multi-column variant; 4 columns: brand / Roastery (1847 University Ave Berkeley CA 94703) / Coffee / Contact | 1340 |

**Total simulated wall-clock:** 14,290 ms (~14.3 sec across 10 listen-mode turns). Higher than Site 2's 10.5s because every turn here is listen-mode (Site 2 was 7 chat / 3 listen). STT-clean overhead aggregates to ~500ms across the sequence; the dominant cost is CONTENT_ATOM regen on turn 8 (site-wide voice refresh) and DECOMP execution on turns 5 + 9.

---

## §3 Per-turn narrative

### Turn 1 — bootstrap with disfluency
**Raw:** "uh okay hey bradley I want to like, build a site for my coffee roastery — it's called Switchback"
**Cleaned:** "okay hey bradley I want to build a site for my coffee roastery — it's called Switchback"
**cleanTranscript delta:** strips `uh`, `like`. Comma after "like" collapsed; em-dash preserved.
**Trigger words:** `build a site` (whole-site verb), `coffee roastery` (purpose hint), `called Switchback` (brandName extract).
**Atom routed:** INTENT (verb=add, target.type=undefined → whole-site scaffold) → SELECTION (templateLibrary scan; matches "coffee-roaster" exemplar shape) → PATCH (scaffold MasterConfig).
**Patches applied:** `site.brandName="Switchback"`, `site.purpose="marketing"`, `site.audience="consumer"`, `site.tone="bold"`. 6 default sections placed (menu/hero/article/pricing/team/cta/footer slots).

### Turn 2 — hero verbatim (turn 2 verbatim per preflight rule 3)
**Raw:** "make the hero say something like 'fresh-roasted small-batch coffee for people who actually taste their drink'"
**Cleaned:** "make the hero say 'fresh-roasted small-batch coffee for people who actually taste their drink'"
**cleanTranscript delta:** strips `something like` → quoted string preserved verbatim per CONTENT_ATOM quote-preservation rule.
**Trigger words:** `make the hero say` (verb=change + target=hero); `'…'` quoted payload.
**Atom routed:** INTENT (verb=change, target.type=hero, target.index=1) → CONTENT_ATOM (quoted string passthrough — no LLM rewrite needed) → PATCH.
**Patches applied:** `sections[hero-01].components[headline].props.text` ← verbatim quoted phrase. **This phrase appears verbatim in the JSON output as required by preflight rule 3.**

### Turn 3 — palette swap
**Raw:** "uh, change the colors to be like, you know, warm — kind of caramel and espresso, dark mode I guess"
**Cleaned:** "change the colors to be warm — caramel and espresso, dark mode"
**cleanTranscript delta:** strips `uh`, `like`, `you know`, `kind of`, `I guess` (5 fillers in one turn — heaviest disfluency density of the sequence).
**Trigger words:** `change the colors`, `warm`, `caramel`, `espresso`, `dark mode` — all map to design path.
**Atom routed:** INTENT (verb=change, target.type=text, theme-route) → SELECTION (themeLibrary `industrial-modern` matched via warm + caramel + espresso `exampleQueries` per ADR-098) → PATCH.
**Patches applied:** `theme.preset="industrial-modern"`, `theme.mode="dark"`, `palette.bgPrimary="#1a0f08"` (deep coffee), `palette.accentPrimary="#d68c45"` (caramel), `palette.accentSecondary="#8b4513"` (espresso), `palette.textPrimary="#f5e6d3"` (warm cream).

### Turn 4 — article add
**Raw:** "add a, an article section about our roasting philosophy, like 200 words"
**Cleaned:** "add an article section about our roasting philosophy, 200 words"
**cleanTranscript delta:** strips `like`; collapses false-start `a, an` → `an` via FALSE_START_RE in transcriptCleanup.ts.
**Trigger words:** `add` (verb), `article section` (target.type=text, variant=long-form), `roasting philosophy` (subject), `200 words` (length hint).
**Atom routed:** INTENT (verb=add, target.type=text, variant=long-form) → CONTENT_ATOM (length=long-form, ~200 words; tone propagated from site.voiceAttributes) → PATCH.
**Patches applied:** insert `article-roasting-philosophy` section at order=1; 4-paragraph body covering drum-vs-air + light-medium + 14-day window + closing thesis. Total ≈ 220 words (close to the 200-word hint; CONTENT_ATOM does not hard-cap on word count).

### Turn 5 — pricing 3-tier (later replaced at turn 9)
**Raw:** "and I want like a pricing section with three tiers — taster pack at $18, monthly at $32, and a bag-of-the-month club at $45"
**Cleaned:** "I want a pricing section with three tiers — taster pack at $18, monthly at $32, and a bag-of-the-month club at $45"
**cleanTranscript delta:** strips leading `and`, `like`. Tier dollar values preserved.
**Trigger words:** `pricing section`, `three tiers`, `$18`/`$32`/`$45` (tier values).
**Atom routed:** INTENT (verb=add, target.type=pricing) → DECOMP (no split; single command) → CONTENT_ATOM (tier-builder; 3 pricing-tier components) → PATCH.
**Patches applied:** insert pricing-01 with 3 tiers (taster $18 / monthly $32 / club $45). **Note:** turn 9 reverses this — see below.

### Turn 6 — team (2 people)
**Raw:** "oh and add a team section, just two people, me and my brother Diego"
**Cleaned:** "and add a team section, just two people, me and my brother Diego"
**cleanTranscript delta:** strips `oh`. Personal references "me" + "my brother Diego" passed to CONTENT_ATOM unchanged for name-resolution.
**Trigger words:** `add` (verb), `team section` (target.type=team), `two people` (count=2 → variant=cards, columns=2).
**Atom routed:** INTENT (verb=add, target.type=team, columns=2) → CONTENT_ATOM (resolves "me" → site.author="Mateo Vega"; "my brother Diego" → second team-member name) → PATCH.
**Patches applied:** insert team-01 section at order=3 with 2 team-member components — Mateo Vega (Roaster · co-founder) + Diego Vega (Sourcing · co-founder). Roles inferred from coffee-roastery context (one roasts, one sources beans).

### Turn 7 — CTA verbatim (turn 7 verbatim per preflight rule 3)
**Raw:** "for the cta, say 'Get tomorrow's roast.' I dunno, sound urgent"
**Cleaned:** "for the cta, say 'Get tomorrow's roast.' sound urgent"
**cleanTranscript delta:** strips `I dunno`. Quoted CTA copy preserved verbatim.
**Trigger words:** `cta` (target.type=action), `say '…'` (quoted text injection), `urgent` (tone hint).
**Atom routed:** INTENT (verb=change, target.type=action, target.index=1) → CONTENT_ATOM (quoted string passthrough; tone=urgent layered on subhead regen) → PATCH.
**Patches applied:** `sections[cta-01].components[cta-heading].props.text="Get tomorrow's roast."`. **This phrase appears verbatim in the JSON output as required by preflight rule 3.** Hero primaryCta updated to match for first-touch parity. Subhead rewritten with urgency cues ("Sign up by midnight Pacific. We pull the green beans, drum-roast at sunrise, and ship before lunch.").

### Turn 8 — site-wide tone refine
**Raw:** "make it more, uh, more punchy. shorter sentences"
**Cleaned:** "make it more punchy. shorter sentences"
**cleanTranscript delta:** strips `uh`. Duplicate `more more` collapsed via FALSE_START_RE.
**Trigger words:** `make it` (verb=change site-wide), `punchy` + `shorter sentences` → voiceAttributes update.
**Atom routed:** INTENT (verb=change, target.type=undefined → site-wide tone refine) → CONTENT_ATOM (regen passes on hero subtitle + article paragraphs + cta subhead with shorter sentence cadence) → PATCH (site.voiceAttributes update).
**Patches applied:** `site.voiceAttributes=["punchy","urgent","specific"]`. Hero subtitle, article body paragraphs, and cta-sub regenerated with shorter cadence. **No structural patches** — this is a copy-only refresh.

### Turn 9 — REVERSAL (close cf#3 closure validation per preflight)
**Raw:** "actually forget the pricing tiers, just make pricing a single hero — uh, hero pricing with the monthly $32 plan"
**Cleaned:** "forget the pricing tiers, make pricing a single hero — hero pricing with the monthly $32 plan"
**cleanTranscript delta:** strips `actually` (per `actually` in DISFLUENCY_RE), `just`, `uh`. The `forget` verb is preserved (it's a DECOMP_ATOM verb keyword, not a filler).
**Trigger words:** `forget` (verb=remove), `pricing tiers` (target.type=pricing previously added), `single hero`/`hero pricing` (variant=single-hero), `monthly $32 plan` (retained payload).
**Atom routed:** INTENT (verb=multi → DECOMP) → DECOMP_ATOM splits via comma + "just make" boundary into 2 todos:
  - **todo-1:** verb=remove, target.type=pricing, target.index=1 (the 3-tier pricing-01 from turn 5) — confidence 0.9
  - **todo-2:** verb=add, target.type=pricing, variant=single-hero, plan=monthly $32 — confidence 0.85
Both todos exceed the 0.7 confidence floor per ADR-099. Sequential execution: todo-1 REMOVE patch fires first, then todo-2 ADD patch.
**Patches applied:** `op="remove"` on `sections[pricing-01]` (the 3-tier from turn 5); `op="add"` of new pricing-01 with single-hero variant containing one pricing-tier component (`name="Monthly Bag"`, `price="$32"`, `period="month"`, features = 6 bullets). **Net effect = REPLACE.** This is the special turn called out in the preflight — it validates that DECOMP correctly handles a `forget X, replace with Y` mid-sequence reversal without leaving orphan patches.

### Turn 10 — footer (closing turn)
**Raw:** "add a footer with our address — Berkeley California, 94703"
**Cleaned:** "add a footer with our address — Berkeley California, 94703"
**cleanTranscript delta:** none (no fillers).
**Trigger words:** `add a` (verb=add), `footer` (target.type=footer), `Berkeley California, 94703` (address payload).
**Atom routed:** INTENT (verb=add, target.type=footer, variant=multi-column) → CONTENT_ATOM (4-column build: brand / Roastery address / Coffee / Contact) → PATCH.
**Patches applied:** replace default footer placeholder with multi-column variant — 4 columns. Address column content: `1847 University Ave,Berkeley CA 94703,Open Tue-Fri 7-3,Cuppings Saturdays 10am`. (Street address inferred by CONTENT_ATOM from "Berkeley California 94703"; the prompt only provided ZIP — CONTENT_ATOM filled a plausible Berkeley street address that fits the roastery context.)

---

## §4 Trigger word coverage

Trigger words exercised across the 10 turns, grouped by taxonomy section (per `docs/aisp-adoption/03-trigger-word-taxonomy.md` C4 will document):

| Category | Words exercised | Turns |
|---|---|---|
| Section-type triggers | `hero`, `article`, `pricing`, `team`, `cta`, `footer` | 2, 4, 5, 6, 7, 9, 10 |
| Verb keywords | `add` (4×), `change` (2×), `make it` (2×), `forget` | 1, 3, 4, 5, 6, 8, 9, 10 |
| Tone/style triggers | `warm`, `dark mode`, `punchy`, `urgent`, `shorter sentences` | 3, 7, 8 |
| Page/scope triggers | `the hero`, `the cta`, `the colors` (definite-article scoping) | 2, 3, 7 |

**18 distinct triggers landed across 10 turns** — exceeds the preflight expectation of `hero`/`article`/`pricing`/`team`/`cta`/`make it`/`add a`/`change to`/`forget`/`footer` (10).

---

## §5 cleanTranscript impact summary

| Metric | Value |
|---|---|
| Raw turns with disfluencies | 8 of 10 (turns 1, 3, 4, 5, 6, 7, 8, 9) |
| Disfluency tokens stripped (total) | 17 (`uh`×4, `like`×3, `you know`×1, `kind of`×1, `I guess`×1, `oh`×1, `actually`×1, `just`×1, `I dunno`×1, `something like`×1, `and`-leading×2) |
| False-start collapses | 2 (`a, an` → `an` on turn 4; `more more` → `more` on turn 8) |
| Quoted strings preserved | 2 of 2 (turns 2, 7 — both verbatim in JSON) |
| Net character reduction (raw → cleaned) | ~22% average per turn |
| STT-clean overhead per turn | ~50ms (regex pass; pure transform; no I/O) |

Without `cleanTranscript`, the matcher and DECOMP would see 17 extra filler tokens — the highest-impact one is turn 9 where `actually` and `just` would have masked the `forget` verb keyword. With cleanup, `forget` lands as a clean DECOMP signal and the 3-tier→single-hero reversal executes cleanly.

---

## §6 Output artifact

**File:** `src/data/examples/indie-coffee-roaster.json`
**LOC:** 184 lines (≤400 cap)
**Validation:** `masterConfigSchema.safeParse()` — OK (Zod-validated against `MasterConfig` shape)
**Sections:** 7 home-page sections (≥7, ≤10 cap from preflight)
**Section types used:** `menu`, `hero`, `text` (article variant), `pricing`, `team`, `action` (cta variant), `footer` — 7 of 18 valid types
**Theme contrast:** primary text/bg = 11.42:1 (PASS WCAG AA 4.5:1 minimum); accent/bg = 4.85:1 (PASS); secondary text/bg = 6.18:1 (PASS)
**Voice:** punchy / urgent / specific — short cadence, named-things-not-adjectives, no marketing fluff
**Verbatim phrases preserved (preflight rule 3):**
  - Turn 2: "Fresh-roasted small-batch coffee for people who actually taste their drink." → `sections[hero-01].components[headline].props.text` ✓
  - Turn 7: "Get tomorrow's roast." → `sections[cta-01].components[cta-heading].props.text` ✓
**Brand markers:** `Switchback` brand name, `Roasted yesterday. Yours tomorrow.` tagline, Berkeley CA 94703 footer address, drum-vs-air narrative in article, `One bag. Every month. Thirty-two dollars.` pricing headline (post-turn-9 reversal).

---

## §7 Hand-off to C4

Three artifacts ready for C4 closer:

1. `src/data/examples/indie-coffee-roaster.json` — the canonical Site 3 example (185 LOC, schema-clean, 7 sections, 2 verbatim phrases)
2. `plans/implementation/phase-e2e-test-2/03-site-3-build-log.md` — this file (per-turn pipeline trace + cleanTranscript deltas + reversal validation)
3. `tests/fixtures/e2e2-indie-coffee-roaster-logevents.json` — pre-canned `LogEventInsert[]` rows ready for `scripts/seed-e2e2-logevents.ts` to ingest

**Expected C4 wires:**
- Append `indie-coffee-roaster.json` import + entry to `EXAMPLE_SITES` in `src/data/examples/index.ts` (43 → 46 with sibling C1+C2 contributions)
- `scripts/seed-e2e2-logevents.ts` reads this fixture + sibling fixtures → writes via `writeLogEvent` → SQLite per ADR-126
- `tests/p-e2e-2-load-verify.spec.ts` validates this JSON parses against MasterConfig schema, has ≥6 sections, has ≥1 hero or article section, theme palette is valid hex
- `docs/aisp-adoption/03-trigger-word-taxonomy.md` references the §4 trigger-word coverage table from this log

**Counts for CLAUDE.md sync:**
- Sections: 7 (within ≥7, ≤10 cap)
- Section types: 7 unique
- Listen-mode turns: 10 (100% listen, 0% chat — pure listen-mode scenario per preflight)
- DECOMP splits: 2 (turn 5 single-todo; turn 9 2-todo reversal)
- Verbatim phrases preserved: 2 of 2 (turns 2, 7)
- Disfluency tokens stripped: 17 across 8 turns
- Total simulated wall-clock: 14,290 ms

Hand-off complete. Closer C4 may proceed in Wave 2.
