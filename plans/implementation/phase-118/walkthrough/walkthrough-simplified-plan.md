# P118 — Walkthrough Concept · Honest Review + Simplified Plan

> **Owner-supplied draft** captured at `plans/implementation/phase-118/walkthrough/concept-draft.html`
> **Date:** 2026-05-06
> **Status:** REVIEWED · NOT YET IMPLEMENTED — implementation gates on Wave 2 (F2 + F3) landing first
> **Recommendation:** ship as a **NEW page at `/walkthrough`** linked quietly from Welcome Section 5 + from About + from the new blog posts. Not a replacement for Welcome.

## Why this concept is strong (keep the spine)

1. **Single continuous story** — viewer follows ONE user's journey from voice-note to shipped site. That's a strictly better explanation than any feature-list page can deliver.
2. **The "But… now what?" pivot** is the most powerful frame in the draft. A pretty site is not a product. Most builders STOP there. Hey Bradley keeps going. **That's the moat.** Keep this beat exactly.
3. **The replay framing** ("Session Replay · 4 min 12 sec") makes the visitor a witness, not a target. Apple does this with product films. Don Miller calls it "story-as-evidence."
4. **The transition from preview to spec to handoff** is the real differentiator. Every other builder's story ends at the visual. Ours ends at "your developer/AI assistant ships it."
5. **Both repos as CTAs** is the right finish — the visitor leaves with two doors: one to use the product, one to read what's coming next.

## What violates the locked rules (honest cuts)

The owner just locked these in P118 preflight v2:
- NO numbers on public pages
- NO competitor names on public pages
- NO Crystal-Atom / AISP / DDD / JSON-patch / Σ-Γ-Λ-Ε jargon

The draft violates every one of them:

| Scene | Violation | Cut or Translate |
|---|---|---|
| 1 | "Session Replay · 4 min 12 sec" | KEEP the framing; DROP the timestamp |
| 1 | "👤 Bradley Ross · May 2026 · Started with a voice note" | DROP — the user (the visitor) is the hero, not Bradley |
| 3 | "Intent classified in 0.12s · AISP pipeline active · δ = 0.016" | DROP all three meta-items; show the meta as: "Hey Bradley is listening." or simply silence |
| 4 | "⚡ First build: 0.8s" badge | DROP entirely; the speed is felt, not stated |
| 5 | "δ = 0.016 ambiguity — vs 40–65% industry standard" | DROP; the value lands without the metric |
| 5 | "92% SWE-bench Verified — spec-first beats frontier models" | DROP entirely; pitch-deck claim, not story |
| 5 | "AISP Crystal Atom — for Claude Code" + Σ Γ Λ Ε code block | TRANSLATE: "A spec your AI coding assistant can read directly." Show ONE line of plain-English JSON-shape, not the math |
| 5 | "ADR-001: JWT over session auth — locked" + "ADR-002: Postgres over SQLite — locked" | DROP; these are pitch-to-engineers details — wrong audience for the walkthrough |
| 5 | "vp5: 92% SWE-bench Verified" | DROP |
| 6 | "Trusted by 1,200+ engineering teams" + Stripe / Linear / Vercel / Anthropic logos | DROP — false (we don't have those clients); also numbers + brand names |
| 9 | "5 pages · 12 sections · 0.8s first build" | DROP — pure numbers |
| 9 | "Vibe coding got you 80% there. Hey Bradley gets you the rest." | TONE-DOWN — "If you've tried other AI builders, you've felt the gap. This is the bridge." |

## What violates Don Miller / Apple craft (deeper edits)

### Don Miller hero issue
- The current Scene 1 H1 is "**Hey Bradley** built this for me." That makes the **brand** the savior. The Don Miller pattern is **the user is the hero; the brand is the guide.**
- **Fix:** open with the USER's moment. "I needed a website. By Tuesday." Then the brand enters as the guide.

### Apple density issue
- 9 scenes is too many. Apple product pages typically use 4–6 sections with massive whitespace.
- Each current scene packs 3–5 elements. Apple would pack 1.
- **Fix:** consolidate to 6 scenes; one IDEA per scene; one VISUAL per scene; one LINE of copy.

### Mobile-first violations
- `overflow: hidden` on body — kills mobile scroll
- `cursor: none` — accessibility violation
- Fixed-pixel widths (700px, 800px, 600px) — desktop-only
- Grid layouts that break under 600px without breakpoints
- Tap targets <44px on the mode-cards + nav-dots
- **Fix:** scroll-snap container; vw/% widths; min 44px touch targets; cursor visible.

### CTA gap
- Currently links to `heybradley.app` + `github.com/bar181/hey-bradley-core` only
- Owner explicitly asked for **BOTH repos** as CTAs (`hey-bradley-core` + `aisp-open-core`)
- **Fix:** triple-CTA finish: primary "Start describing →" + secondary 1 "View the open core →" → `bar181/hey-bradley-core` + secondary 2 "Read what's coming next →" → `bar181/aisp-open-core`

## Simplified 6-scene plan (Apple + Don Miller)

The new shape: 6 scenes, mobile-first, scroll-snap (no auto-advance; the visitor sets pace; arrow keys + scroll wheel + swipe all work). Auto-advance optional, off by default — pacing should never feel manipulated.

### Scene 1 — The moment (the user's problem)
- **No badge. No timestamp. No name.**
- Headline: **"I needed a website. By Tuesday."** (handwritten / serif italic)
- Sub: "I'd tried the others. They didn't get me there."
- Visual: a single empty browser frame; cursor blinks where text will go.
- Door: a tiny "scroll" indicator that pulses once and fades.

### Scene 2 — Describe it
- Headline: **"So I just described it."**
- Visual: a chat/voice input box with words appearing — typed slowly, pause-and-revise rhythm: "make me a site for my coffee shop in Asheville" *[pause]* "warm. not pretentious. just a menu and our story."
- Sub (small, below): "Speak it. Type it. Either works."
- No "Listen mode active" / no "Intent classified" labels — silent.

### Scene 3 — See it
- Headline: **"It just appeared."** (or even simpler: "I saw it.")
- Visual: a real-feeling site materializes, section by section, in time with the words. Hero block first, then a menu, then a story photo, then a footer. CSS keyframes only — no library.
- One subtle line below: "Then I changed my mind, and it changed too."

### Scene 4 — Iterate
- Headline: **"I kept talking. It kept listening."**
- Visual: a small list of edits scrolling on the side ("changed the headline" / "swapped the photo" / "added our hours" / "moved the menu") — no numbers, no badges, no chrome. Sentences a friend would say.
- The site preview on the side reflects each edit visually.

### Scene 5 — Take it anywhere (the pivot)
- Headline: **"Then it was ready to ship."**
- Single-line story: "I sent the export to my nephew. He opened it in Claude Code. He didn't ask me a single clarifying question."
- Visual: a single document icon morphing into a folder of files, named in plain English (not `aisp/phase-aisp.md` — just "the spec your developer reads"). The file names are HUMAN.
- Tiny link below, named: "*Read how the handoff works* →" → `/blog/the-handoff-that-changes-everything`
- This is the "but… now what" pivot from the draft, but flipped: instead of telling the visitor *now what?* and answering *here's what*, we just SHOW the answer in one beat.

### Scene 6 — Close (BOTH repos + outcome)
- Headline: **"From your idea to a real site, in your words."**
- Sub: "Open source. MIT licensed. Free to try."
- Three CTAs (stacked on mobile, side-by-side on desktop):
  - **Primary:** "Start describing →" (warm button → `/new-project`)
  - **Secondary 1:** "View the open core →" (ghost button → `https://github.com/bar181/hey-bradley-core`)
  - **Secondary 2:** "Read what's coming next →" (ghost button → `https://github.com/bar181/aisp-open-core`)
- Trust ribbon below (12px muted): "Built in the open · MIT licensed · Built at Harvard"

## The route + integration

**Route:** `/walkthrough` (new)
**Component:** `src/pages/Walkthrough.tsx` (NEW; ≤220 LOC; uses `useReveal` hook from F1)
**Linked from:**
- Welcome Section 1 secondary CTA (replace "See how it works" with "Watch the walkthrough →")
- About page below the personal story ("Want to see it in action? →")
- Blog post 1 footer (`describe-it-see-it.md`)
- MarketingNav (optional; can stay below the fold)

**Mobile-first construction:**
- `<main>` is the snap container: `overflow-y: scroll; scroll-snap-type: y mandatory`
- Each scene is a `<section>` with `min-height: 100vh; scroll-snap-align: start`
- Visuals use viewport units (vh / vw) + max-width caps — never fixed pixels
- All text scales with `clamp(min, preferred, max)` per ADR-090
- All animation respects `prefers-reduced-motion`
- All interactive elements ≥44px per ADR-112
- No `overflow: hidden` on body
- No `cursor: none`
- Optional auto-advance toggle (default OFF) — visitor controls pace

**Animation budget:**
- 6 CSS keyframes total (one per scene transition)
- Intersection-observer triggers via existing `useReveal` hook (no new hook needed)
- Reduced-motion fallback: scenes appear instantly, no transitions

**Copy budget:**
- ≤8 words per headline
- ≤25 words per scene body
- Total page word count ≤220 words (Apple-tight)

## Tone & voice (Don Miller-grade)

The narrator across the 6 scenes is a SINGLE user voice — first-person past tense ("I needed", "I described", "It appeared"). No second-person ("you can", "describe yours"). No brand-as-savior ("Hey Bradley made"). The brand is invisible until Scene 6, where it ENABLES the action ("Start describing").

Voice attribute: `theron-miller-hard-twist` (per ADR-141 Decision 2) — specific opening anecdote → unexpected pivot → earned observation.

## Why this is a separate page, not a Welcome.tsx replacement

1. Welcome.tsx (just landed by F1, 272 LOC, 5-section Apple-scroll-story) is the *quick scan* — for the visitor who'll spend 30 seconds.
2. `/walkthrough` is the *deep watch* — for the visitor who'll spend 4 minutes and convert.
3. The Welcome H1 ("Describe it. See it.") is the *promise*; the walkthrough is the *proof*.
4. Replacing Welcome with the walkthrough loses the 30-second visitor entirely.
5. Layering both serves both audiences without compromising either.

## Implementation gates

- DO NOT dispatch implementation until Wave 2 (F2 + F3) lands; the walkthrough imports `useReveal` (F1, landed) and links to a blog post slug created by F2 (in-flight)
- Once Wave 2 is sealed, dispatch as F4 in a follow-up commit OR fold into Wave 3 closer
- Cap: NEW `Walkthrough.tsx` ≤220 LOC; route registration in `main.tsx` ≤5 LOC; Welcome.tsx + About.tsx + Blog post 1 each get a 1-line link to `/walkthrough` (≤3 LOC delta per page)
- Test coverage: existsSync the new route + page; assert no numbers / no jargon / no competitor names in the body; assert all 3 CTAs (Start describing + hey-bradley-core + aisp-open-core) present

## Open questions (ask owner before implementation)

1. **Auto-advance default**: OFF (visitor-paced) is recommended. Confirm.
2. **Voice on/off toggle**: the draft uses `cursor: none` to feel cinematic. Recommend dropping that for a11y. Confirm.
3. **Scene 1 headline**: "I needed a website. By Tuesday." vs. "I needed a website." — the "by Tuesday" adds urgency but commits to a specific timeline. Confirm.
4. **Scene 5 character relationship**: "I sent the export to my nephew" vs "I sent the export to my developer" — the nephew is more relatable; the developer is more universal. Confirm.
5. **CTA order in Scene 6**: Primary first (Start describing), then which open-core repo first? Recommend `hey-bradley-core` first (the product itself), `aisp-open-core` second (the upcoming-work surface). Confirm.

## Net verdict

**Concept: 9.5/10** — the spine is right. The "but… now what?" pivot is the strongest frame Hey Bradley has produced.

**Draft execution: 6/10** — too many scenes, too many numbers, too many UI chrome elements, brand-as-hero violations, mobile-hostile layout, jargon leakage. The draft was made for a desktop product demo, not a public marketing page.

**Simplified concept: ready to ship** — 6 scenes, mobile-first, story-as-evidence, both repos in the close. Implementation deferred until Wave 2 lands; recommend folding into Wave 3 closer or shipping as a P118.5 follow-up.
