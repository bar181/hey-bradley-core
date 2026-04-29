---
title: "Lovable Builds the Site. Hey Bradley Designs It First."
date: 2026-04-29
author: Bradley Ross
category: positioning
---

# Lovable Builds the Site. Hey Bradley Designs It First.

On 2026-04-27, Lovable shipped a mobile app with voice capture and cross-device handoff. It's a great product. It's also a different category from Hey Bradley.

If you've used Lovable, Cursor, Claude Designer, or v0, you already know what they do well: turn a prompt into running code in minutes. That's a real win. It's also not the part of the problem that has been killing most projects before they ever ship.

## The 55% problem

Every "AI builder" demo starts at the same place: the user already knows what they want. Type a sentence, watch a site appear. The bottleneck has shifted.

The bottleneck is no longer "how fast can I generate code." The bottleneck is the gap between "I have an idea" and "I have a spec to feed an AI builder." That gap is where most projects die — drift, scope creep, the third rewrite, the conversation that ends "I'll just figure it out as I go."

We call it the 55% problem. Roughly 55% of effort in a typical AI-assisted build goes to ambiguity removal: clarifying tone, picking sections, deciding what to leave out, choosing voice, agreeing on structure. Lovable starts after that work is done. Figma starts at pixels. Nobody owns the spec layer.

## Two lanes, not one

Here is how the lanes actually break down:

| Dimension | Lovable / v0 / Cursor | Hey Bradley |
|---|---|---|
| Starts with | A prompt that becomes code | An idea that becomes a spec |
| Output | Running site (HTML / React / Next) | AISP spec + human plan + optional preview |
| Voice mode | Voice → code | Voice → spec → code |
| Mobile lane | Native mobile app | Mobile listen + read-only spec |
| Wins on | Time-to-running-code | Time-to-decisive-clarity |
| Loses on | Ambiguity removal, persistence | Code-running speed, polish |

Both lanes are valid. Lovable wins when you already know what you want and want it on screen now. Hey Bradley wins when you don't, when the project is large enough that the wrong spec costs more than the right code, or when the build will be handed to an agentic engineer who needs the spec to be unambiguous.

## AISP — what makes spec-first different

AISP is the AI Symbolic Protocol. It's a math-first symbolic language with 512 symbols that any modern LLM understands natively, designed for sub-2% ambiguity between intent and output.

Hey Bradley uses 5 AISP atoms in production today:

- **PATCH_ATOM** — the change to apply to the design state
- **INTENT_ATOM** — the verb / target / scope of the user's request
- **SELECTION_ATOM** — which template lane the request enters
- **CONTENT_ATOM** — the text + tone + length payload
- **ASSUMPTIONS_ATOM** — the inferences the system made when the user was vague

Every chat turn produces all five. None of them are prose. None of them are LLM hallucinations dressed as JSON. They are closed symbolic envelopes with restricted Σ — the LLM cannot widen the schema, the renderer cannot guess. The 5-atom architecture is the moat.

It's also academically defensible. The full spec is open-source at [github.com/bar181/aisp-open-core](https://github.com/bar181/aisp-open-core).

## The wow factor: voice → AISP spec → Claude Code build

Here's the demo flow that nobody else does end-to-end:

1. You hold the push-to-talk button on your phone and describe a site. "I want a landing page for my coffee subscription. Friendly tone, three plans, testimonials, mobile-first."
2. Hey Bradley turns the audio into an AISP spec — atoms light up as each layer resolves. The intent is captured, the template lane is picked, the content is drafted, the assumptions are surfaced.
3. The spec renders as both a human-readable plan AND an AISP symbolic envelope. You scroll, you screenshot, you share.
4. You hand the spec to Claude Code, Cursor, or any agentic engineer. They build it. The spec is unambiguous enough that the build matches what you asked for on the first pass.

Lovable does step 1 and step 4 in a single shot. That's a great product. Hey Bradley does step 2 and step 3 — the part that the rest of the industry is currently leaving on the table.

## Why this matters now

Voice-first capture, mobile-native consumption, and ambiguity-removal-as-a-service are all unmet needs in the agentic-engineering stack. Every "AI builder" race-to-zero on code generation makes the spec layer more valuable, not less. The cheaper the build gets, the more the spec is the project.

Lovable shipped a great mobile app this week. We shipped speed-visible patches, AISP-always-on spec traces, premium opinionated templates, and a hosted shareable spec URL — the four things that turn "polished open-source artifact" into "category-defining product." See [open-core-moat-roadmap.md](https://github.com/bar181/hey-bradley-core/blob/main/plans/strategic-reviews/open-core-moat-roadmap.md) for the full roadmap.

You are the founder, the indie hacker, the agency owner, the side-project builder. You have an idea. You don't yet have a spec. We are the guide that gets you from one to the other in 5 minutes — and then hands the spec to whichever AI builder you prefer.

Lovable builds the site. Hey Bradley designs it first.

---

Hey Bradley is open source under BYOK. Try it at [hey-bradley.com](https://hey-bradley.com) or self-host from [github.com/bar181/hey-bradley-core](https://github.com/bar181/hey-bradley-core). Capstone defense ships May 2026; v1.0 RC ships shortly after.
