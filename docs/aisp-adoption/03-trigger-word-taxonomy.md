# Trigger-Word Taxonomy — chat + listen vocabulary

**Phase:** E2E-TEST-2 / C4 (closer)
**Cross-ref:** ADR-099 (DECOMP_ATOM) · ADR-100 (Section Type Completeness) · ADR-126 (Comprehensive Logs) · ADR-127 (Format Verification)

This document codifies the implicit vocabulary that drives the Hey Bradley pipeline. It surfaces the trigger words that map user utterances onto canonical pipeline behavior — section enums, DECOMP verbs, content tone, brand fields, listen-mode capture.

The taxonomy is **descriptive, not prescriptive** — Hey Bradley already routes these words; this doc lists them so external LLMs and bundle consumers can reproduce the routing without reading source.

See `tests/fixtures/e2e2-*-logevents.json` for seeded examples of each trigger class in action.

---

## 1. Section type triggers (18 enum types)

Per ADR-100, the canonical enum is exactly 18 values. User-facing aliases route through the matcher to the canonical type. Variants live on the `variant` field — never the `type` field.

| User says (any of) | Canonical `type` | Common `variant` |
|---|---|---|
| "hero", "above-the-fold", "top-of-page" | `hero` | `centered` / `split` |
| "menu", "nav", "navigation", "navbar" | `menu` | `simple` / `mega` |
| "pricing", "plans", "tiers", "packages" | `pricing` | `three-tier` / `single` |
| "team", "about us", "the people" | `team` | `grid` / `single-row` |
| "cta", "call to action", "sign up", "get started" | `action` | `centered` / `cta` |
| "footer" | `footer` | `simple` / `multi-column` |
| "blog", "posts", "articles list" | `blog` | `grid` / `list` |
| "gallery", "photos", "portfolio images" | `gallery` | `grid` / `masonry` |
| "testimonials", "reviews", "what people say", "quotes" | `quotes` | `single` / `two-up` / `carousel` |
| "faq", "questions", "common questions" | `questions` | `accordion` / `two-column` |
| "stats", "numbers", "metrics" | `numbers` | `four-up` / `centered` |
| "logos", "clients", "brands we worked with" | `logos` | `grid` / `marquee` |
| "features", "columns", "value props", "benefits" | `columns` | `three-up` / `four-up` |
| "image", "single photo", "feature image" | `image` | `full-width` / `inset` |
| "divider", "spacer", "section break" | `divider` | `line` / `space` |
| "text", "paragraph", "copy", "long-form", "article", "essay" | `text` | `short` / `paragraph` / `long-form` |
| "case study", "portfolio item", "client work" | `case-study` | `single` / `pair` |
| "contact form", "lets talk", "form" | `contact-form` | `inline` / `modal` |

**Common surprises** (codified here so the pipeline does not silently fail):

- "article" / "essay" / "long-form" / "blog post body" → **`text` with `variant: long-form`**, NOT a `type: article`. (Site C1 codifies this; see `coffee-essay.json:70`.)
- "pull-quote" → **`quotes` with `variant: single`** + component `type: pull-quote`. (Not its own section enum.)
- "testimonial" → **`quotes` with `variant: two-up`** (or other multi). (Not its own section enum.)

---

## 2. DECOMP verb triggers (DECOMP_ATOM Σ R3)

Per `src/contexts/intelligence/aisp/decompAtom.ts`, the verb classifier maps user verbs onto a finite set of pipeline operations. CF#3 (P101 W1 closure) added `forget`, `need`, `create` to the lookup table.

| User verb (any of) | DECOMP `verb` | Pipeline action |
|---|---|---|
| "make it [adj]" | `modify` | apply-patch on theme/tone/copy |
| "change", "update", "tweak" | `modify` | apply-patch on existing section |
| "add", "include" | `add` | new section / new component |
| "I need", "we need", "needs a" | `add` | new section (CF#3 closure) |
| "create", "build", "I want a" | `add` | new section (project-level if first turn) |
| "replace", "swap", "instead of" | `replace` | swap section / section variant |
| "remove", "delete", "hide", "drop" | `remove` | section removal / disable |
| "forget", "kill", "get rid of" | `remove` | section removal (CF#3 closure) |
| "generate", "write", "draft" | `generate` | CONTENT_ATOM expansion |
| "give me copy for", "fill in the", "write the [section]" | `generate` | CONTENT_ATOM expansion (targeted) |

Each verb carries a `confidence` value (0.9 / 0.6 / 0.3 ladder) — see DECOMP_ATOM Σ R3 in source. Conjunction-split (`AND`/`also`/`then`) is handled before verb classification.

---

## 3. Tone & style triggers (CONTENT_ATOM)

| User says | Effect on theme / content |
|---|---|
| "bright", "brighter", "sunny" | bright theme branch (`theme.mode = light`; lighter palette) |
| "dark", "darker", "dark mode", "night" | dark theme branch (`theme.mode = dark`; deeper palette) |
| "warm", "warmer", "cozy" | warm palette family (terracotta / cream / amber accents) |
| "cool", "cold", "icy" | cool palette family (slate / blue / muted-teal accents) |
| "casual", "playful", "fun", "friendly" | CONTENT_ATOM tone = casual; shorter sentences, contractions, exclamation OK |
| "formal", "professional", "corporate" | CONTENT_ATOM tone = formal; longer sentences, no contractions, third-person OK |
| "punchy", "snappy", "short" | CONTENT_ATOM length = short; sentences ≤ 14 words |
| "long-form", "detailed", "essay" | CONTENT_ATOM length = long; ≥ 4 paragraphs |
| "editorial", "magazine", "literary" | tone = editorial; serif headings + 1.7 line-height |
| "Wes Anderson", "literary-quirky" | tone = formal+specific (per North Light agency template) |

---

## 4. Brand triggers (NEW this sprint)

Brand-level triggers route to `site.*` fields rather than `sections[].*`. They land at the masterConfig top level and propagate via theme + voice attributes.

| User says | Mapped field |
|---|---|
| "brand", "brand name", "we are called X", "it's called X" | `site.brandName` |
| "voice", "tone of voice", "I want it to sound like" | `site.voiceAttributes` |
| "palette", "colors", "color scheme" | `theme.palette` (multi-key patch) |
| "set color [hex]", "use #XXXXXX", "make the accent [color]" | `theme.palette.accentPrimary` (or named slot) |
| "tagline", "subtitle", "one-liner" | `site.tagline` |
| "agency", "studio", "we have clients", "we work with brands" | injects ≥ 1 `case-study` section |
| "newsletter", "email signup", "subscribe" | injects `action` section with `type: input` + `type: button` |

---

## 5. Listen-mode specific triggers

Per ADR-127 (Format Verification + Top-3 Atom-Helper Fixes), listen mode runs a **2-stage capture** before any classification:

1. **Raw transcript** — verbatim Web Speech output (with disfluencies)
2. **Cleaned transcript** — disfluency-stripped, whitespace-normalized

The `cleanTranscript` module (`src/contexts/intelligence/stt/transcriptCleanup.ts`) strips:

- Filler words: "uh", "um", "you know", "like" (when used as filler), "I mean"
- Double-space collapse
- Leading/trailing whitespace

**Quoted strings are preserved verbatim.** If the user says `make the hero say 'X'`, the literal `'X'` is kept untouched in both raw and cleaned transcripts — the pipeline never strips inside quotes. Site C3 (`indie-coffee-roaster.json`) demonstrates this preservation across 8 of 12 turns.

The `listen_capture` event_type in `log_events` carries both `raw_transcript` AND `cleaned_transcript` per ADR-126 §3 listen-capture closure.

---

## 6. Schema-enum gotchas (user-facing)

These trip up first-time users who have read about the pipeline but not the schema:

- `event_type: 'patch_applied'` is **NOT** in the migration 005 CHECK enum. The schema admits 15 values total (see `005-comprehensive-logs.sql:46-58`). Use `patch_validation` for the success-path patch event. `seed-e2e2-logevents.ts` defensively remaps `patch_applied -> patch_validation` at write time.
- Section `type: 'article'` / `'pull-quote'` / `'testimonial'` are **NOT** valid section types. They are component types or section variants. See §1 above.
- `theme.mode` is `'light'` or `'dark'` — not `'bright'` or `'night'`. The user-said-word maps to mode via §3.

---

## 7. See also

- `src/contexts/intelligence/aisp/decompAtom.ts` — DECOMP verb lookup
- `src/contexts/intelligence/aisp/intentAtom.ts` — INTENT_ATOM classifier + page-ref regex
- `src/contexts/intelligence/stt/transcriptCleanup.ts` — listen-mode pre-classification cleanup
- `src/contexts/persistence/migrations/005-comprehensive-logs.sql` — CHECK enum source-of-truth
- `tests/fixtures/e2e2-*-logevents.json` — 35 worked rows across 3 sites covering chat-long-form, mixed chat+listen, and pure listen-mode pipelines
