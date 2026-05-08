---
title: "Spec-First vs Vibe-Coding: A Head-to-Head Comparison"
slug: "spec-first-vs-vibe-coding"
date: "2026-05-01"
excerpt: "Vibe-coding works until the second iteration. Spec-first inverts the order so the artifact is the spec, not the screenshot — and the second prompt actually composes."
tags: ["spec-first", "aisp", "comparison"]
---

# Spec-First vs Vibe-Coding: A Head-to-Head Comparison

Vibe-coding works until the second iteration. The first prompt produces a beautiful site. Hero, gradient, three columns, a tasteful testimonial, a footer that doesn't embarrass anyone. You take a screenshot. You feel like a wizard. Then you type the second prompt — "make the hero brighter" — and the result comes back with a different layout, different copy, a footer that lost two links, and a hero that is, technically, brighter, but in a way that broke everything else. Vibes don't compose.

You've felt this if you've used Lovable, v0, Framer AI, or any prompt-to-site tool. The first turn is magic. The second turn is roulette. By the fifth turn you're copy-pasting from an earlier screenshot and starting over. The tool isn't broken. The interaction model is. There is no artifact between your sentence and the rendered output that survives the next round-trip.

## What vibe-coding actually optimizes for

Vibe-coding optimizes for first-touch wow. Type a sentence, get a site, hold the demo. That is a real win — the very first time a non-technical person produces a credible landing page in twelve seconds, something genuinely shifted in the industry. We are not arguing against that moment.

We are arguing against the design choice that made the second moment worse. Vibe tools treat each prompt as if it were the first prompt. There is no durable representation of "what we agreed last time." The model re-derives intent from your sentence plus a screenshot of the current state, and re-derivation drifts. Drift compounds. By the third edit, the site is a remix of your last three sentences and none of your original ones.

The deeper problem is that the artifact is the rendered HTML. HTML is downstream of the decisions that produced it. You can't edit a decision by editing its output any more than you can edit a recipe by chewing slower. The recipe has to exist as its own object.

## What spec-first inverts

Spec-first puts the artifact one layer up. The spec is the thing. The rendered site is downstream — derivable, regenerable, disposable. When you change your mind, you change the spec. The site re-renders from the changed spec. Round-trip is lossless because the spec is the source of truth, not the pixels.

Hey Bradley emits a 5-atom AISP Crystal Atom spec on every reply. The atoms are closed symbolic envelopes — INTENT (the verb, target, scope of what you asked), ASSUMPTIONS (every inference made when you were vague), SELECTION (which template lane the request entered), CONTENT (the text payload with tone and length defaults), PATCH (the deterministic change to apply). Five atoms. Five chances to catch ambiguity. One persistent artifact.

When the next agent reads the project, it does not read a screenshot. It reads the spec. When you say "make the hero brighter," the system reads the existing PATCH state, mutates the relevant fields, and emits a new PATCH that composes with the prior ones. Brighter, in context. Footer untouched. Copy preserved. The second prompt finally behaves like the first.

## Head-to-head, plainly

Vibe-coders — Lovable, v0, Framer AI — are excellent at zero-to-one. One prompt, one site, one screenshot. They lose at one-to-N. The second iteration drifts. The fifth iteration is a different project. The artifact is the rendered output, and the rendered output is the wrong layer to edit.

Spec-first — Hey Bradley plus the open AISP standard — is moderately good at zero-to-one and dramatically better at one-to-N. The first site might take a beat longer because the system is also producing the spec. Every iteration after that composes. The fifth turn is recognizably the same project as the first. The artifact is the spec, and the spec is the right layer to edit.

Both approaches will exist. Vibe-coding wins for throwaway demos and zero-stakes exploration. Spec-first wins for anything you intend to iterate on, hand to a teammate, hand to an agentic engineer, or remember next month.

## The hand-off test

The fastest way to tell which category a tool belongs to is the hand-off test. Build something in the tool. Close it. Open Claude Code or Cursor. Ask the agent to extend the project. If the agent has to read screenshots, you used a vibe tool. If the agent reads a structured spec and continues exactly where you left off, you used a spec-first tool.

The AISP envelope was designed for that hand-off. It is a math-first symbolic protocol with 512 symbols any modern LLM understands natively. The full open standard lives at github.com/bar181/aisp-open-core. Hand the envelope to any agentic engineer and the build matches what you asked for on the first pass. That is what "round-trip safe" means in practice — not magic, just an artifact at the right layer.

## The verdict

Vibe-coding is a great first turn. Spec-first is a great second, third, and fifth turn. If your project ends at the demo, vibes are fine. If your project has a next step, the spec is the asset that survives between sessions.

You probably want both, used in the right order. Vibe-explore to find the shape. Spec-first to ship it. Hey Bradley sits in the second lane on purpose.

Explore AISP →
