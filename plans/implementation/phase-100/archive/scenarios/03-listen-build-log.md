# P100 W2 / A5 — Scenario 3: Listen-mode startup site (build log)

> **Phase:** P100 W2 · **Wave 2 / A5** · **Date:** 2026-05-02
> **Owns:** `plans/implementation/phase-100/scenarios/03-listen-build-log.md` (this file)
> **Companions:** `tests/fixtures/scenario-3-listen-startup.ts`, `tests/fixtures/scenario-3-listen-final.json`
> **Inputs:** P100 W1 `log-design.md` §3 (categories), §4 (linking strategy), §7(a) (listen 2-stage capture verdict)
> **Output:** Northstar AI — small-business AI startup site (single page · 6 sections · MasterConfig validated)

## §1 Pipeline path note

Per W1 audit `log-design.md` §7(a) **REJECT** verdict on the owner's "3-stage" framing: today only 2 listen stages exist in the codebase. Wave 2 adds a `listen_capture` row that carries **both** raw and cleaned text on a single row keyed by `request_id`, so the request_envelope and downstream `intent_classification` rows can join back. This scenario simulates the new wired flow.

Per-prompt event order, listen-mode:

```
input_event (mode=listen)
  → listen_capture (raw + cleaned + interim_count + ptt_held_ms + supported='webSpeech')
    → intent_classification (consumes the cleaned text; identical to chat path)
      → [template_match? | decomp_split? | page_scope_resolution? | export_emit?]
        → patch_validation (skipped on export-only step 10)
          → response_summary (carries personality-rendered bubble)
```

Personality variant on every step is `teacher` per A5 brief — forgiving and supportive ("Got it — adding 4 team members. Let me know if you'd like specific roles." rather than terse acknowledgement).

## §2 Per-prompt log table

| # | timestamp | request_id | mode | raw_transcript | cleaned_transcript | classified_intent | atom_path | patches_applied | latency_ms |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-05-02T11:00:00Z | req-l-001 | listen | "um hey can you uh create a site for my like startup thing" | "create a site for my startup" | verb=add, target=undefined (whole-site), audience=business | INTENT → SELECTION → PATCH | scaffold MasterConfig; site.purpose=marketing, audience=business; 6 default sections (menu/hero/columns/pricing-placeholder/footer) | 1850 |
| 2 | 2026-05-02T11:00:12Z | req-l-002 | listen | "yeah so we do like AI stuff for like small businesses you know" | "we do AI for small businesses" | verb=change, target.type=text, scope=site+hero copy | INTENT → CONTENT → PATCH | site.tagline="AI that pays back the same week"; hero headline + subtitle rewritten for SMB audience; voiceAttributes=[approachable, specific, no-hype] | 950 |
| 3 | 2026-05-02T11:00:20Z | req-l-003 | listen | "make the hero um bigger and like more colorful or something" | "make the hero bigger and more colorful" | verb=change, target.type=hero, target.index=1 | INTENT → PATCH | sections[hero].layout.padding=144px 24px; headline.size=72px; style.background=linear-gradient(135deg,#1f6feb→#1ea97c) | 280 |
| 4 | 2026-05-02T11:00:25Z | req-l-004 | listen | "oh wait actually can you add like a team section with like four people" | "actually add a team section with four people" | "actually" → DECOMP single-todo; verb=add, target.type=team, params.count=4 | INTENT → DECOMP → PATCH | insert team section (variant=grid, columns=4) with 4 placeholder cards | 380 |
| 5 | 2026-05-02T11:00:30Z | req-l-005 | listen | "the font is kinda weird can you make it more like modern" | "make the font more modern" | verb=change, target.type=text (typography keyword) | INTENT → PATCH | theme.typography.headingFamily="Plus Jakarta Sans"; headingWeight=700; baseSize=17px | 220 |
| 6 | 2026-05-02T11:00:34Z | req-l-006 | listen | "actually you know what forget the team section" | "remove the team section" | "forget" → verb=remove, target.type=team | INTENT → PATCH | remove section[team]; section count drops back to 5 | 190 |
| 7 | 2026-05-02T11:00:38Z | req-l-007 | listen | "add pricing um three tiers like free and then two paid ones" | "add pricing with three tiers free and two paid" | verb=add, target.type=pricing, params.tiers=3 | INTENT → SELECTION → CONTENT → PATCH | insert pricing section (variant=three-tier) with Starter $0 / Grow $49 / Scale $199; CONTENT_ATOM fills tier copy with SMB-appropriate language | 1100 |
| 8 | 2026-05-02T11:00:43Z | req-l-008 | listen | "make the colors match our brand which is like blue and green" | "make the colors match our brand blue and green" | verb=change, target.type=text (palette keyword) | INTENT → PATCH | theme.palette.accentPrimary=#1f6feb (blue); accentSecondary=#1ea97c (green); hero gradient repaints | 240 |
| 9 | 2026-05-02T11:00:47Z | req-l-009 | listen | "oh and we need a contact form at the bottom" | "add a contact form at the bottom" | verb=add, target.type=contact-form, position=last | INTENT → SELECTION → PATCH | insert contact-form section (variant=stacked) at order=3; 3 fields (name/email/business); footer pushes to order=4 | 850 |
| 10 | 2026-05-02T11:00:51Z | req-l-010 | listen | "ok export this for our developer" | "export this for our developer" | verb=export, target=undefined | INTENT → export_emit | no patches; emits Claude Code markdown bundle per ADR-122 | 60 |

## §3 Per-prompt narrative + teacher-mode personality response

### Prompt 1 — Initial scaffold (listen)

- **raw_transcript:** "um hey can you uh create a site for my like startup thing"
- **cleaned_transcript:** "create a site for my startup"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=2400ms, interim=5) → intent_classification (consumes cleaned text) → template_match → patch_validation → response_summary
- **Pipeline:** webSpeechAdapter strips uh/um/like fillers and the trailing vague "thing". INTENT classifier sees "create a site for my startup" → verb=add, no concrete target type → SELECTION_ATOM whole-site scan against `templateLibrary.ts`. Closest match: `saas-startup` template (light mode, gradient hero, 3-tier pricing slot). Confidence ~0.74 — solid starting shape.
- **Patches:** MasterConfig scaffolded with `site.audience=business`, `tone=warm`, default 5-section layout. Pricing slot placeholder; contact-form not yet added.
- **Latency:** 1850ms (STT cleanup +50 / SELECTION cold path +1700 / patch +100).
- **Personality (teacher):** "No worries — I caught that. Building a starter site for your startup right now. I went with a friendly SaaS look with a light background and a colorful gradient hero. Tell me what you do and I'll write the headline for you next."

### Prompt 2 — Content fill (listen)

- **raw_transcript:** "yeah so we do like AI stuff for like small businesses you know"
- **cleaned_transcript:** "we do AI for small businesses"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=2100ms, interim=4) → intent_classification → patch_validation → response_summary
- **Pipeline:** Cleanup strips "yeah so", two "like"s, and the trailing "you know". Cleaned text now reads as a clear positioning statement. INTENT detects no surface verb but a strong positioning signal → routes to CONTENT_ATOM with audience=business override and the cleaned text seeded as positioning context.
- **Patches:** site.tagline="AI that pays back the same week"; hero.headline="AI that pays back the same week."; hero.subtitle rewritten for SMB audience with concrete promise (100 free tasks); voiceAttributes=[approachable, specific, no-hype] persisted to site.
- **Latency:** 950ms (STT cleanup +50 / CONTENT regen +850 / patch +50).
- **Personality (teacher):** "Got it — AI for small businesses. I rewrote the headline and subtitle to lean into that. The new line is 'AI that pays back the same week' — feel free to swap it. Want me to adjust the tone if it feels too punchy?"

### Prompt 3 — Hero bigger + colorful (listen)

- **raw_transcript:** "make the hero um bigger and like more colorful or something"
- **cleaned_transcript:** "make the hero bigger and more colorful"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=1900ms, interim=4) → intent_classification → patch_validation → response_summary
- **Pipeline:** Cleanup strips "um", "like", and the hedge "or something". INTENT classifies verb=change, target.type=hero, target.index=1 with two adjustments (size + color). No DECOMP fan-out — single-target compound modifier.
- **Patches:** sections[hero].layout.padding=144px 24px (was 96px); headline.size=72px (was 60px); style.background=linear-gradient(135deg,#1f6feb 0%,#1ea97c 100%); section gap +8px.
- **Latency:** 280ms (STT cleanup +30 / rules INTENT +50 / patch +200).
- **Personality (teacher):** "Done — the hero is taller, the headline is larger, and I added a blue-to-green gradient to give it more color. We can dial it back if it's too much. Want me to sample a different gradient?"

### Prompt 4 — Add team section (listen, DECOMP)

- **raw_transcript:** "oh wait actually can you add like a team section with like four people"
- **cleaned_transcript:** "actually add a team section with four people"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=2300ms, interim=5) → intent_classification → decomp_split (1 todo; "actually" trigger) → patch_validation → response_summary
- **Pipeline:** Cleanup strips "oh wait", drops two "like" fillers, keeps "actually" (semantic — signals reversal/addition). DECOMP_ATOM fires on "actually" trigger but emits a single todo (verb=add, target=team, count=4) at confidence=0.9 → batch-execute one-todo path. SELECTION matches `team-grid-4` arrangement.
- **Patches:** insert section (type=team, variant=grid, layout.columns=4) at order=2; 4 placeholder team cards with role+name slots.
- **Latency:** 380ms (STT cleanup +30 / rules INTENT +50 / DECOMP +50 / SELECTION +100 / patch +150).
- **Personality (teacher):** "Got it — adding 4 team members. I left names and roles as placeholders so you can fill them in. Let me know if you'd like specific roles or photos."

### Prompt 5 — Modern font (listen)

- **raw_transcript:** "the font is kinda weird can you make it more like modern"
- **cleaned_transcript:** "make the font more modern"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=1700ms, interim=3) → intent_classification → patch_validation → response_summary
- **Pipeline:** Cleanup strips "kinda", "like", and the framing "the font is weird" (preserves the actual ask). INTENT classifies verb=change, target.type=text (typography keyword "font" routes through theme path). Modern → matches `themeLibrary.ts` `modern-startup` exampleQueries; pulls Plus Jakarta Sans + Inter pairing.
- **Patches:** theme.typography.fontFamily=Inter (kept); headingFamily=Plus Jakarta Sans (was Inter); headingWeight=700; baseSize=17px (was 16px); lineHeight=1.65.
- **Latency:** 220ms (STT cleanup +20 / rules INTENT +50 / theme matcher +70 / patch +80).
- **Personality (teacher):** "Switched to a cleaner, modern font pairing — Plus Jakarta Sans for headings and Inter for body. It should feel a bit more polished now. Want me to try a different combination?"

### Prompt 6 — Forget team (listen, contradiction)

- **raw_transcript:** "actually you know what forget the team section"
- **cleaned_transcript:** "remove the team section"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=1500ms, interim=3) → intent_classification → patch_validation → response_summary
- **Pipeline:** Cleanup is more aggressive here — strips "actually you know what" (filler/preamble) and rewrites "forget the X" → "remove the X" (verb-mapping rule in webSpeech post-processor). INTENT classifies verb=remove, target.type=team, target.index=1. Recent contradiction is allowed — no special handling — the prior team-add at step 4 gets undone via remove patch.
- **Patches:** remove section[id=team-01]; section count drops from 6 to 5; downstream sections renumber.
- **Latency:** 190ms (STT cleanup +30 / rules INTENT +50 / patch +110).
- **Personality (teacher):** "No problem — team section removed. We can always add it back later if you change your mind. What's next?"

### Prompt 7 — Pricing 3-tier (listen)

- **raw_transcript:** "add pricing um three tiers like free and then two paid ones"
- **cleaned_transcript:** "add pricing with three tiers free and two paid"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=2000ms, interim=4) → intent_classification → template_match → patch_validation → response_summary
- **Pipeline:** Cleanup strips "um", "like", "and then", and rewrites "two paid ones" → "two paid". INTENT classifies verb=add, target.type=pricing, params.tiers=3, params.shape=[free, paid, paid]. SELECTION matches `pricing-three-tier` arrangement. CONTENT_ATOM fills tier names + bullet copy with SMB-targeted language.
- **Patches:** insert pricing section (variant=three-tier, columns=3) at order=2 (after value-props); tier-free=Starter/$0/100 tasks, tier-grow=$49 (highlighted), tier-scale=$199. Footer pushes to order=4.
- **Latency:** 1100ms (STT cleanup +50 / SELECTION +200 / CONTENT regen +800 / patch +50).
- **Personality (teacher):** "Pricing is in — three tiers: a free Starter, a Grow plan at $49 (I highlighted that one), and a Scale plan at $199. Tell me your real prices and I'll swap them in."

### Prompt 8 — Brand colors (listen)

- **raw_transcript:** "make the colors match our brand which is like blue and green"
- **cleaned_transcript:** "make the colors match our brand blue and green"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=1850ms, interim=4) → intent_classification → patch_validation → response_summary
- **Pipeline:** Cleanup strips one "like" — "blue and green" survives intact (the actual signal). INTENT classifies verb=change, target.type=text (palette keyword "colors" routes through theme path). Two-color brand pair → primary=blue, secondary=green.
- **Patches:** theme.palette.accentPrimary=#1f6feb (was the saas-startup default); accentSecondary=#1ea97c; hero gradient repaints to match (already aligned from step 3); pricing-card "highlighted" border re-tints.
- **Latency:** 240ms (STT cleanup +30 / rules INTENT +50 / palette swap +100 / patch +60).
- **Personality (teacher):** "Brand colors locked in — blue (#1f6feb) for primary and green (#1ea97c) for accents. The hero gradient and pricing highlights repainted to match. Let me know if you have hex codes that match your logo more exactly."

### Prompt 9 — Contact form (listen)

- **raw_transcript:** "oh and we need a contact form at the bottom"
- **cleaned_transcript:** "add a contact form at the bottom"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=1600ms, interim=3) → intent_classification → template_match → patch_validation → response_summary
- **Pipeline:** Cleanup strips "oh and we need" → "add" (verb-mapping rule). INTENT classifies verb=add, target.type=contact-form (per ADR-100 enum widening), position=last (before footer). SELECTION matches `contact-form-stacked` arrangement.
- **Patches:** insert contact-form section (variant=stacked) at order=3 with 3 inputs (name/email/business + 1-line context) and primary CTA "Send my 5-min teardown"; footer pushes to order=4.
- **Latency:** 850ms (STT cleanup +30 / rules INTENT +50 / SELECTION +200 / CONTENT for form copy +500 / patch +70).
- **Personality (teacher):** "Contact form added at the bottom — name, work email, and a 1-line business context. CTA reads 'Send my 5-min teardown' so it feels generous, not transactional. We can swap fields anytime."

### Prompt 10 — Export (listen)

- **raw_transcript:** "ok export this for our developer"
- **cleaned_transcript:** "export this for our developer"
- **2-stage capture event order:** input_event → listen_capture (raw + cleaned, ptt=1200ms, interim=2) → intent_classification → export_emit → response_summary
- **Pipeline:** Cleanup is minimal — only "ok" preamble drops. INTENT classifies verb=export → routes to export pipeline (per ADR-122). No patches; emits a markdown bundle with `# === FILE: <path> ===` markers covering CLAUDE.md preamble + AISP spec + ADRs + agent-wave scopes.
- **Patches:** none.
- **Latency:** 60ms (STT cleanup +10 / INTENT +20 / export emit +30).
- **Personality (teacher):** "Exported — your developer will get a single markdown bundle with the spec, the ADRs, and per-wave agent scopes. Hand it to Claude Code, Cursor, or any LLM agent and they'll have everything they need to ship the implementation."

## §4 Listen-mode cleanup rules applied

The W1 audit `log-design.md` §7(a) flagged that `webSpeechAdapter.ts:74 finalText` is the raw stage and `useListenPipeline.ts:165 appendListenTranscript({ ..., text: redactKeyShapes(text) })` is the cleaned write. The cleanup rules invoked across this scenario (in priority order):

1. **Filler stripping** — `uh`, `um`, `like`, `you know`, `kinda`, `or something` removed when surrounded by content tokens.
2. **Preamble stripping** — `oh wait`, `actually you know what`, `yeah so`, `ok` at sentence head when followed by an actual verb.
3. **Verb mapping** — `forget the X` → `remove the X`; `we need X` → `add X`. Rule-based; deterministic; preserves intent.
4. **Hedge stripping** — `like more colorful or something` → `more colorful`.
5. **Quantifier preservation** — `four people`, `three tiers`, `two paid ones` survive verbatim or with minor rewrites (numbers preserved).
6. **Semantic-trigger preservation** — `actually` is kept when it signals reversal/addition (DECOMP trigger per ADR-099); stripped when filler at sentence head.

## §5 Final state summary

- **Sections (6 total, in render order):** menu / hero (gradient blue→green, 144px padding, 72px headline) / value-props 3-card / pricing 3-tier (Starter $0 · Grow $49 highlighted · Scale $199) / contact-form stacked (3 fields) / footer
- **Theme:** light mode; saas-startup preset; Plus Jakarta Sans headings + Inter body; blue (#1f6feb) primary + green (#1ea97c) secondary
- **No team section** — added at step 4, removed at step 6 (recent contradiction handled clean)
- **Audience:** business; voice: approachable + specific + no-hype
- **Output bundle:** Claude Code markdown bundle emitted at step 10 (per ADR-122)

## §6 Counts (audit-friendly summary)

- Prompts: 10
- Listen-mode prompts (inputType='listen'): 10/10
- listen_capture events: 10 (one per prompt; required by brief)
- log_events rows: 6+5+5+6+5+5+6+5+6+5 = 54
- edit_history rows: 9 (steps 1-9; step 10 export-only)
- Total simulated SQLite rows: 63
- Total simulated latency: 1850+950+280+380+220+190+1100+240+850+60 = 6120 ms
- Personality variant: teacher (10/10)

## §7 Sibling-disjoint declaration

- A3 (`scenario-1-axon-cli.ts`): not touched
- A4 (`scenario-2-edge-cases.ts`): not touched
- A6 (planning-mode scenario): not touched (separate `scenarios/04-*` slot)
- src/: not touched (read-only schema reference for validation only)
- ADRs: not touched
- Tests: only the new fixture under `tests/fixtures/` (no spec files edited)
