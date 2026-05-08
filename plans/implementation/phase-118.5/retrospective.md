# P118.5 / WALKTHROUGH — Retrospective

## Walkthrough outcomes

| Question | Answer |
|---|---|
| Route shipped? | Yes — `/walkthrough` |
| Word count (body copy + headlines, excl. CTA labels + nav + footer) | ≤220 |
| Animation respects `prefers-reduced-motion`? | Yes — every scoped keyframe + the `useReveal` hook + the typewriter component gate on it |
| 3 CTAs in locked order verified? | Yes — Start describing → `bar181/hey-bradley-core` → `bar181/aisp-open-core` |
| Brand invisible Scenes 1-5? | Yes — only `MarketingNav` carries the brand in 1-5 |
| Scene 6 close line locked? | Yes — "From your idea to a real site, in your words." literal |
| Scene 4 changelog friend voice? | Yes — "Changed the headline. Felt more honest." not commit-log voice |
| Scene 5 nephew pivot present? | Yes — verbatim per owner Q3 |
| Tests GREEN? | Yes — 22/22 cases under chromium |
| Both tsc strict configs CLEAN? | Yes |

## Keep

- **Section-like page, not full-screen replay app.** Owner correction was load-bearing — the pre-feedback concept-draft used `position: fixed inset: 0` and `cursor: none`. Owner's "section-like" frame anchored the layout to `MarketingNav` + footer + scroll-snap container with sane page chrome. The story flows through normal page mechanics (scroll wheel, arrow keys, swipe). Same instruction is the canonical pattern for any future story-paced surface.
- **Owner-verbatim copy locks.** Q1-Q4 were hard-locked into ADR-147 D2 + the spec. Future iterators can re-render the visuals freely, but the close line, the deadline, the nephew, the CTA order are immovable. This is how Apple-style story pages stay coherent over multiple polish passes.
- **Friend voice on the changelog.** "Changed the headline. Felt more honest." reads true. "Hero headline updated to X." reads like documentation. Same information, different signal — the friend voice is what makes Scene 4 land emotionally instead of operationally.

## Drop

- **Auto-advance timer.** Considered briefly during preflight; owner answer Q1 was OFF. Auto-advance steals agency from the visitor and turns the story into a pitch. Visitor-paced is the right default; if owner reverses post-launch, it's a 3-line addition to the snap-scroll observer.
- **Cursor-hide effect.** The pre-feedback concept-draft used `cursor: none` for cinematic feel. Owner correctly flagged it as off-brand for a section-like page — the cursor hiding fights the page's own scroll bar and creates an uncomfortable "this isn't a normal web page" affordance.
- **Scene-by-scene navigation dots.** Considered for desktop-only. Adds chrome without adding clarity; the scroll-snap behavior is its own progress indicator.

## Reframe

- **The walkthrough is "show, don't tell" for first-time visitors.** It is NOT a feature tour, NOT a product demo, NOT documentation. It is the user's story told from the user's POV, with the brand walking on stage only after the user has already won. The reframe (story page > replay app) made this possible.
- **Don Miller voice is the constraint that makes the page work.** Brand invisible until Scene 6 + single first-person past-tense narrator + friend voice on the iteration changelog: these three constraints look like restrictions but are actually the load-bearing structure. Without them, the page would drift into feature language by Scene 3.

## Carry-forwards

- CF-P118.5-1 — owner-recorded video version of the same 6-scene flow (carries CF-P118-2 forward)
- CF-P118.5-2 — A/B test walkthrough engagement vs plain Welcome (post-launch owner analytics)
- CF-P118.5-3 — localization of the walkthrough copy (Tier-2; deferred per ADR-109 deferral list)

## Velocity note

Single-agent seal in one pass. Original P118 plan budgeted P118.5 as a separate sprint after the main P118 work; in practice the four owner answers + clear ADR-146 D1 frame made this a clean ~1-pass execution. Reinforces the post-P19 reality check rule: when the constraint set is locked and owner-locked-down, multi-hour shifts beat multi-day shifts every time.
