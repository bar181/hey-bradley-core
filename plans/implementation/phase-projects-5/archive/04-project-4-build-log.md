# Project 4 Build Log — Mrs. Albright's Tutoring (Grandma persona, listen-mode)

**Persona:** Grandma — Margaret Albright, 60s, retired English teacher, 32 years at Roosevelt High. Voice-input only. Warm, encouraging, plain-spoken.
**Site:** `mrs-albright-tutoring` — single-page marketing site for remote one-on-one English tutoring.
**Input mode:** Listen (Web Speech STT simulated; pre-canned per ADR-127). Every turn runs through `cleanTranscript()` per `src/contexts/intelligence/stt/transcriptCleanup.ts`.
**Cleaner contract:** strips `uh|um|er|ah|like|you know|i mean|actually|kinda|sorta|basically` + collapses `\b(\w+)\s+\1\b` false-starts + drops `...`/`—`. Idempotent. Note: `sweetheart` is grandma-warmth, NOT in the strip list — preserved as-is in cleaned form (would only be stripped by Tier-2 persona-aware cleaner).

## Per-turn table

| # | Raw transcript (what STT heard) | Cleaned transcript (post `cleanTranscript()`) | Atom | Verb | Target | Effect |
|---|---|---|---|---|---|---|
| 1 | `uh okay hey bradley I want to make a website for my tutoring, you know, my english tutoring for high school kids` | `okay hey bradley I want to make a website for my tutoring, my english tutoring for high school kids` | INTENT_ATOM | add | site (whole) | Initialize project. Extracted: `purpose=marketing`, `audience=consumer`, vertical=tutoring/education, learners=high-school. |
| 2 | `the title should be um, Mrs. Albright's Tutoring, that's me` | `the title should be Mrs. Albright's Tutoring, that's me` | PATCH_ATOM | change | `/site/title` | Set title to `Mrs. Albright's Tutoring`. Verbatim preserved (proper noun, possessive). |
| 3 | `make it look like, you know, friendly and warm. not flashy. soft yellows and warm grays` | `make it look friendly and warm. not flashy. soft yellows and warm grays` | INTENT_ATOM | change | `/theme` | Apply `warm-paper` preset, light mode, accent `#c69a3a` (warm yellow), secondary `#8aa37b` (sage), bg `#fdf8ec` (cream), text `#3a3528` (warm gray). Heading family `Lora` (readable serif per persona — older user UX). |
| 4 | `the hero should say, uh, 'Help your student love English again.' with a small sub-line about, you know, my 32 years teaching` | `the hero should say, 'Help your student love English again.' with a small sub-line about my 32 years teaching` | PATCH_ATOM | change | `/sections/1` (hero) | Replace headline with quoted verbatim. Subtitle synthesized to mention `32 years` + Roosevelt High (back-resolved from turn 10). Verbatim preserved on quoted span. |
| 5 | `add a section about who I help, you know, students who hate English class but, like, deserve to find their voice` | `add a section about who I help, students who hate English class but deserve to find their voice` | PATCH_ATOM | add | `/sections/-` | Append `text` section `who-i-help`. Heading lifted near-verbatim from cleaned transcript: "Students who hate English class — and deserve to find their voice." |
| 6 | `and add a, an article about my approach — three short paragraphs about, like, reading discussion not drills` | `and add an article about my approach three short paragraphs about reading discussion not drills` | PATCH_ATOM | add | `/sections/-` | Append `text` section `approach-article` with `variant=long-form`, three body paragraphs. False-start `a, an → an` collapsed. |
| 7 | `add a, you know, schedule section, just three time slots: weekdays after school, saturday mornings, and tuesday evenings` | `add a schedule section, just three time slots: weekdays after school, saturday mornings, and tuesday evenings` | PATCH_ATOM | add | `/sections/-` | Append `pricing` section `schedule-01` (3 tiers as time slots). **Reversed at turn 9.** False-start `a, you know, → a` collapsed. |
| 8 | `make a contact form — name, parent email, student grade, what they're working on` | `make a contact form name, parent email, student grade, what they're working on` | PATCH_ATOM | add | `/sections/-` | Append `contact-form` section with 4 fields: `parent_name` text, `parent_email` email, `student_grade` select(9-12), `working_on` textarea. |
| 9a | `uh forget the schedule, just make the contact form the main thing. and a small note that I respond within a day` | `forget the schedule, make the contact form the main thing. and a small note that I respond within a day` | DECOMP_ATOM | (split) | (multi) | **DECOMP reversal pattern: `forget X, make Y` → 2 todos.** Todo 1: `remove /sections/schedule-01`. Todo 2: `change /sections/contact-01` — promote to primary CTA + add response-note. |
| 9b | (same raw / cleaned as 9a) | (same) | PATCH_ATOM | replace | `/sections/3..4` | Apply DECOMP todos: remove schedule section, append response-note text inside contact-form (`"I respond within a day, often the same evening..."`). Net effect = REPLACE schedule with promoted contact form. |
| 10 | `and, you know, a footer with my email and a small line saying I've taught at Roosevelt High since 1988` | `and, a footer with my email and a small line saying I've taught at Roosevelt High since 1988` | PATCH_ATOM | add | `/sections/-` | Append `footer` section. Email verbatim from `site.email`. Credentials line: "Teaching English at Roosevelt High since 1988. Now tutoring from home." |

## Notes

- **cleanTranscript hits per turn:** `uh` ×3 (turns 1, 4, 9), `um` ×1 (turn 2), `you know` ×6 (turns 1, 3, 4, 5, 7, 10), `like` ×3 (turns 3, 5, 6). False-starts collapsed: `a, an` (turn 6), `a, you know` (turn 7).
- **Raw + cleaned both persisted** in fixture `event_data.raw_transcript` + `event_data.cleaned_transcript` per ADR-126 + ADR-127 listen-mode 2-stage capture closure.
- **Verbatim discipline (per ADR-053 Σ):** turns 2 (title), 4 (quoted headline), 10 (Roosevelt High since 1988) preserved literally — quoted spans + proper nouns + numerics never re-paraphrased.
- **DECOMP reversal (turn 9):** mid-sequence `forget X, make Y` correctly decomposed into remove + change todos with no orphan patches. Mirrors precedent at `tests/fixtures/e2e2-indie-coffee-roaster-logevents.json:215` (turn 9 reversal there).
- **Final shape:** 6 sections — menu, hero, text (who-i-help), text long-form (approach), contact-form (primary CTA), footer. **No schedule, no pricing.** Single-page. Contact form is the only conversion surface.
- **Persona scoring (Grandma rubric):** large readable type (`baseSize: 18px`, `lineHeight: 1.7`, serif `Lora`); high-contrast warm palette; one CTA on the page; no jargon; warm grandmother voice throughout.

## Latency / cost

| Phase | Total events | Listen-mode latency p50 | Notes |
|---|---|---|---|
| Pipeline | 11 events (10 turns + 1 DECOMP split) | ~1380ms | Listen mode includes STT capture + classify + apply. Pre-canned (no live LLM, no live STT per task hard rule 6). |

## Boundary checks (KISS / no-new-deps)

- No new npm deps.
- JSON validates against `MasterConfig` (4 schemas: site, theme, sections[], components[]).
- All 6 section types ∈ canonical 18 (`menu`/`hero`/`text` ×2/`contact-form`/`footer`).
- BYOK: no `sk-`/`AIza`/auth-token shapes anywhere in fixture.
