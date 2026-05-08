# AISP Made Visible: From Buried Tab to Default Surface

The moat was correct from day one. The problem was nobody could see it.

If you opened Hey Bradley a month ago, you got a chat box, a preview pane, and a polite suggestion to flip into EXPERT mode if you wanted the technical view. The 5-atom AISP architecture — the actual differentiator, the academically defensible part, the thing no other AI builder produces — sat behind a tab nobody clicked. The product was working. The story was hiding.

Sprint L fixed that. This is what changed and why it matters to you.

## The 5-atom Crystal Atom architecture

Every chat turn in Hey Bradley produces five symbolic envelopes, in order:

- **PATCH_ATOM** — the precise change to apply to the current design state. No prose, no guessing, a closed schema the renderer can apply deterministically.
- **INTENT_ATOM** — the verb, the target, and the scope of what you asked for. "Add a testimonial section to hero-2" parses into structured fields, not a paragraph.
- **SELECTION_ATOM** — which template lane the request enters. Two-step selection means the model picks a category first, then a kind within it, with traceable reasoning at each step.
- **CONTENT_ATOM** — the text payload, with explicit tone and length defaults derived from the section type. A hero is short and bold. A blog body is long and neutral. The atom carries that.
- **ASSUMPTIONS_ATOM** — every inference the system made when you were vague. Surfaced, not hidden. You see what the model guessed and you can correct it before the patch lands.

Five atoms, five closed schemas, five chances to catch ambiguity before it ships. Lovable does not produce these. v0 does not produce these. The AISP open spec is at [github.com/bar181/aisp-open-core](https://github.com/bar181/aisp-open-core), and any modern LLM understands the symbol set natively.

## Why we hid it (and why that was wrong)

The original UX put the AISP trace in an EXPERT-mode tab, opt-in, off by default. The reasoning was reasonable at the time: novices do not want to see symbolic envelopes, and the Geek-mode personality engine for technical users was itself opt-in. We were protecting the new user from the math.

That was wrong, and the persona scoring told us so. The Capstone persona scored the system at 92 of 100 with the trace hidden, and the gap was legibility, not features. The reviewer could not see the moat unless they knew where to click. A defense panel does not click around. Hiding the differentiator is the same as not having one.

The lesson: if your moat is technical, the technical surface IS the marketing. Burying it does not lower the bar for novices. It lowers the ceiling for everyone.

## Sprint L: making it default-on

Sprint L sealed at `2944461` with three changes that flipped the default:

1. **Always-on AISP trace.** Every chat turn now renders the atom sequence inline, in plain sight, with each atom labeled by name. No mode switch required. The trace is part of the conversation, not a side panel.
2. **Spec auto-open.** When a turn produces a meaningful patch, the spec view opens automatically and stays open. You scroll down and there it is — the human-readable plan beside the symbolic envelope.
3. **Crystal Atom labels inline.** PATCH, INTENT, SELECTION, CONTENT, ASSUMPTIONS each get a labeled chip in the chat stream. You watch the atoms fire as the model resolves your request. The animation is not decorative. It is the spec forming in real time.

ADR-078 (Spec Unmissable) records the decision and the rollback path. The cumulative test count held at 234 green at seal. Nothing regressed; everything became visible.

## What Lovable can't do

Lovable's pipeline is prompt → code. Fast, impressive, and a single transformation with no inspectable intermediate state. If the output is wrong, you re-prompt. There is no spec to correct because there is no spec.

Hey Bradley's pipeline is prompt → AISP spec → code. The spec is the inspectable intermediate. You fix assumptions before the patch lands. You hand the spec to Claude Code, Cursor, or any agentic engineer and get a build that matches on the first pass. The spec is what makes the build reproducible.

> The moat is not "we generate code differently." The moat is "we produce a spec the rest of the industry does not produce, and now you can watch it form."

## Try the live flow

Open Hey Bradley, hold push-to-talk, describe a site in one sentence, and watch the five atoms light up in order. PATCH lands. INTENT parses. SELECTION picks a lane. CONTENT drafts. ASSUMPTIONS surface, ready for you to correct.

That is the demo. It used to be hidden. Now it is the default.

You came for a builder. You are leaving with a spec engine that happens to also build. That order matters.
