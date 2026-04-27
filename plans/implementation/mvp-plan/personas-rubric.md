# Personas Scoring Rubric

> Phase 15 deliverable. Used to score the MVP against three target personas before closing the phase.
> Scoring: 0–100 per persona, summed across five 20-point dimensions. A persona "passes" only when total >= target.

---

## How to use this rubric

1. Open the live build in a fresh browser tab (incognito, no localStorage).
2. For each persona below, follow the dedicated "How to score" section in order.
3. Score each dimension at one of the five anchors (0, 5, 10, 15, 20). Do not interpolate.
4. Sum the five dimensions. Record total against target.
5. If a persona scores below target, file the gaps as Phase 15 follow-ups before phase close.

---

## Persona 1 — Grandma (DRAFT mode, novice)

### Profile

Grandma is 68, retired, and uses an iPad and a desktop browser. She has never built a website but wants a simple page for her quilting club. She is in DRAFT mode by default. She does not know what "section", "variant", "spec", or "blueprint" mean. Success for her looks like: she sees something pretty, types one sentence, sees the page change, and feels safe sharing the link with two friends.

### Target: >= 70 / 100

### Dimensions

#### D1. First-touch comprehension (20 pts)

Within 30 seconds of landing, does she know what to do next?

- **0** — She stares at the screen, asks "what is this?", and closes the tab.
- **5** — She finds one button but cannot tell what it does until she clicks it.
- **10** — She identifies a starter card and a chat box, but pauses before acting.
- **15** — She picks a starter card within 20 seconds and starts typing.
- **20** — She picks a starter card within 10 seconds and types a clear request without prompting.

#### D2. Visual delight (20 pts)

Does the rendered page look like something she would proudly show family?

- **0** — Default render is broken, empty, or visibly placeholder-ish (lorem ipsum, gray boxes).
- **5** — Page renders but looks dated or unstyled; she says "it looks like a form".
- **10** — Page is clean but plain; she does not comment on the visuals.
- **15** — Page is attractive; she says "oh that's nice" unprompted.
- **20** — Page is attractive AND she points to a specific element ("I love that header image").

#### D3. Time to first edit (20 pts)

How long from landing to the first visible content change she caused?

- **0** — She never makes an edit in 5 minutes.
- **5** — First edit takes 3–5 minutes; required guidance.
- **10** — First edit takes 90–180 seconds; she figured it out alone.
- **15** — First edit takes 45–90 seconds.
- **20** — First edit takes under 45 seconds and she sees the change immediately.

#### D4. Confidence to share (20 pts)

After 5 minutes, would she send the preview link to a friend?

- **0** — "No, this isn't ready, it might break."
- **5** — "Maybe, if I had more time."
- **10** — "I would show my daughter first."
- **15** — "Yes, I would send this to one friend."
- **20** — "Yes, I'm sending this to two friends right now" — and she does.

#### D5. No fear of breaking (20 pts)

Does any UI element scare her away from clicking?

- **0** — She refuses to click multiple buttons because "I might break it".
- **5** — She avoids the JSON / Pipeline / Data tabs; visible jargon causes hesitation.
- **10** — She clicks freely in the chat but avoids side panels.
- **15** — She clicks anything in DRAFT mode without hesitation; jargon is hidden.
- **20** — She clicks freely AND says "I can always undo, right?" — and an undo path is obvious.

### How to score Grandma

1. Open a fresh incognito tab to the deployed URL.
2. Set mode to DRAFT (should be default — verify).
3. Read the screen for 30 seconds without clicking. Score D1.
4. Pick the first starter card that catches your eye. Score D2 on the rendered preview.
5. Type one short request in the chat ("make the header say Quilting Club"). Time it. Score D3.
6. After 5 minutes total, ask yourself: would I share this link with my actual grandmother? Score D4.
7. Hover and click 5 random UI elements. Note any jargon (JSON, AISP, AST, blueprint, pipeline, AISP Crystal). Score D5.
8. Sum D1..D5. Pass if total >= 70.

---

## Persona 2 — Framer User (EXPERT mode, power user)

### Profile

Mira is 31, a freelance designer who ships client sites in Framer and Webflow weekly. She wants pixel control, fast iteration, real export, and no babysitting. She switches to EXPERT mode within the first minute. She judges the tool against her existing toolchain: if it costs her 10 minutes more than Framer to ship a hero + features + footer, she abandons it. Success looks like: she builds a 3-section page, exports a working artifact, and inspects the JSON without surprises.

### Target: >= 78 / 100

### Dimensions

#### D1. Mode parity with Framer/Webflow (20 pts)

Does EXPERT mode expose the controls a designer expects?

- **0** — No section reordering, no variant switching, no preview/edit toggle.
- **5** — Reorder works but variant switching requires editing JSON by hand.
- **10** — Sections, variants, and preview/edit toggle exist but are slow or clunky.
- **15** — All three exist and respond in under 300ms; one minor gap (e.g., no inline rename).
- **20** — Full parity: reorder, variant switch, inline rename, preview/edit toggle, all under 300ms.

#### D2. Speed to compose 3-section page (20 pts)

Time from blank to nav + hero + footer rendered with real content.

- **0** — Over 10 minutes or never completes.
- **5** — 6–10 minutes.
- **10** — 3–6 minutes.
- **15** — 90 seconds – 3 minutes.
- **20** — Under 90 seconds end-to-end.

#### D3. Export / handoff quality (20 pts)

Does the ZIP / JSON export match what she sees on screen?

- **0** — Export missing, broken, or contents do not match preview.
- **5** — Export works but assets are missing or paths are wrong.
- **10** — Export matches preview but has cosmetic issues (extra whitespace, dead files).
- **15** — Export matches preview cleanly; AISP/JSON included; one minor nit.
- **20** — Export is clean, deterministic, includes AISP Crystal Atom, and re-imports without loss.

#### D4. JSON / Blueprints transparency (20 pts)

Can she inspect and trust the underlying model?

- **0** — JSON tab missing or shows opaque blob.
- **5** — JSON visible but undocumented; field names cryptic.
- **10** — JSON visible and readable; blueprints exist but cross-references are stale.
- **15** — JSON, AISP, and 7 blueprint sub-tabs all present and consistent with the preview.
- **20** — All of D4=15 AND she can hand the JSON to another tool (or LLM) and it round-trips.

#### D5. No friction / no surprises (20 pts)

Does anything stop the flow — modal nags, console errors, layout jank, mystery state?

- **0** — Multiple console errors, hard reloads required, state lost between tabs.
- **5** — One blocking issue (e.g., preview desyncs after variant change).
- **10** — A few cosmetic warnings; nothing blocks the workflow.
- **15** — Clean console; one minor UX surprise (tooltip missing, label unclear).
- **20** — Zero console errors, zero state loss, zero modal nags across the full build session.

### How to score Framer User

1. Open fresh incognito; switch to EXPERT mode within 60 seconds. Note time-to-toggle.
2. Open the Kitchen Sink example. Inspect every Center tab (Preview, Blueprints, Resources, Data, Pipeline). Score D1 and D4.
3. Start a blank example. Build nav + hero + footer using EXPERT controls only (no chat). Time it. Score D2.
4. Trigger ZIP export. Unzip locally. Diff the rendered HTML/JSON against the preview. Score D3.
5. Throughout the session keep DevTools console open. Log every warning/error. Score D5.
6. Sum D1..D5. Pass if total >= 78.

---

## Persona 3 — Capstone Reviewer (Harvard professor)

### Profile

Dr. Patel teaches a software engineering capstone at Harvard. She reviews student projects for technical depth, design rigor, evidence of process, and intellectual contribution. She reads the README, the ADRs, the plans directory, and the code in that order. She wants to see: a defensible architecture, honest deferred-features tracking, real tests, and at least one novel idea (here: AISP). Success for her looks like: she would assign this project a high pass and recommend it as an exemplar.

### Target: >= 82 / 100

### Dimensions

#### D1. Architectural rigor (20 pts)

Is there a coherent, documented architecture?

- **0** — No ADRs, no plans, code is a flat directory.
- **5** — Some structure, but ADRs are missing or vague.
- **10** — ADRs exist (10–20) and reflect real decisions; some drift from code.
- **15** — 30+ ADRs, plans/ directory, DDD bounded contexts, files mostly under 500 lines.
- **20** — All of D1=15 AND ADRs explicitly cite trade-offs and rejected alternatives.

#### D2. Process evidence (20 pts)

Can she trace how the project evolved phase by phase?

- **0** — No phase docs, no roadmap, no closed-phase scoring.
- **5** — A roadmap exists but phases are not scored or dated.
- **10** — Phases scored (e.g., 74/100) but no closing checklist.
- **15** — Phase roadmap, scores, DoD per phase, deferred-features.md tracked.
- **20** — All of D2=15 AND phase reviews cite specific artifacts (test counts, line counts, ADR IDs).

#### D3. Test discipline (20 pts)

Is the codebase actually tested?

- **0** — No tests, or tests do not run.
- **5** — Tests exist but coverage is thin and many are skipped.
- **10** — 50–100 tests passing; mix of unit + integration.
- **15** — 100+ tests passing; spec files organized; CI green.
- **20** — All of D3=15 AND tests cover edge cases (a11y, error paths, JSON round-trip).

#### D4. Novel contribution (20 pts)

Is there a defensible original idea worth citing?

- **0** — Nothing novel; this is a CRUD app clone.
- **5** — Minor remix of existing patterns.
- **10** — One interesting idea, weakly defended.
- **15** — One strong novel idea (e.g., AISP) with public artifact and explanation.
- **20** — All of D4=15 AND the idea is reproducible by a third party from the docs alone.

#### D5. Communication & honesty (20 pts)

Does the project communicate clearly and admit its gaps?

- **0** — README is empty or marketing-only; no honest limitations section.
- **5** — README explains the project but hides incomplete features.
- **10** — README is clear; deferred features mentioned in passing.
- **15** — README, plans/, and deferred-features.md all align; gaps are explicit.
- **20** — All of D5=15 AND every "future work" item is dated, owned, and cross-linked to a phase.

### How to score Capstone Reviewer

1. Read README.md end to end. Score initial impressions for D5.
2. Open docs/adr/. Skim every ADR title; read 5 at random in full. Score D1.
3. Open plans/implementation/mvp-plan/ and plans/initial-plans/. Verify phase roadmap matches CLAUDE.md. Score D2.
4. Run `npm test` locally. Record pass count and any failures. Score D3.
5. Read the AISP reference (`plans/initial-plans/00.aisp-reference.md`) and visit the public AISP repo. Score D4.
6. Re-read the deferred-features list and confirm honesty (D5 final adjustment).
7. Sum D1..D5. Pass if total >= 82.

---

## Roll-up

| Persona | Target | Score | Pass? |
|---|---|---|---|
| Grandma (DRAFT) | 70 | __ / 100 | [ ] |
| Framer User (EXPERT) | 78 | __ / 100 | [ ] |
| Capstone Reviewer | 82 | __ / 100 | [ ] |

Phase 15 cannot close until all three rows are filled and all three pass.

---

## Notes for reviewers

- Score on the deployed build, not on a dev server with stale state.
- Use a real fresh browser session per persona — do not share cookies/localStorage between runs.
- Record obstacles as bullet points alongside each score; file them as Phase 15 issues if they block target.
- If a dimension legitimately does not apply to a build state, score it 10 (neutral) and annotate why.
- Re-score after each set of fixes; do not edit prior scores — append a new row with date.
