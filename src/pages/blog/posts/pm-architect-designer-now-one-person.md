---
title: "The PM, Architect, and Designer Are Now One Person"
slug: "pm-architect-designer-now-one-person"
date: "2026-05-01"
excerpt: "Founders today wear three hats by force, not choice. Hey Bradley collapses the spec-to-build gap so one person can hold all three lanes without dropping any of them."
tags: ["founders", "spec-first", "agentic-engineering"]
---

# The PM, Architect, and Designer Are Now One Person

Founders today wear three hats by force, not choice. The product manager who scopes the work, the architect who decides the structure, the designer who polishes the surface — they're now one tired person staring at a blank chat box at 11pm. The org chart didn't shrink. The headcount didn't get cheaper. The work just stopped getting paid the same way, because one human is now expected to carry three lanes that used to be three salaries.

You probably feel this if you're shipping anything alone right now. You opened a project, wrote a brief in your head, sketched the layout, picked the typography, decided the section order, drafted the copy, and reviewed your own work — all before a single line of code. Then you opened Claude Code or v0 or Lovable and were asked to summarize that whole multi-lane thinking in a single prompt. Of course it came back wrong. You were trying to compress three roles into one sentence.

## The three lanes, briefly

The product manager lane is scope. What goes in, what stays out, who is this for, why does it ship now instead of next quarter. PMs don't write code; they write the constraints that make the code worth writing.

The architect lane is structure. What sections does this site need, in what order, with what relationships, on what stack. Architects don't pick fonts; they decide which decisions can be reversed cheaply later and which ones lock you in.

The designer lane is the surface. The grid, the type ramp, the spacing rhythm, the hover state, the empty state, the mobile breakpoint. Designers don't write requirements; they make the requirements feel like a product instead of a checklist.

Three different brains. Three different review meetings, traditionally. Three different artifacts on disk. And now one person, doing all of it, between Slack messages, with no review meeting at all because there is nobody else in the room.

## Where the existing tools fall short

Most AI builders compress all three lanes into a single prompt and a single output. You type a sentence, you get a site. The PM lane, the architect lane, and the designer lane all have to fit inside that one sentence. They don't fit. The result feels generic because it is generic — the tool guessed at the parts of your thinking you couldn't compress in time.

The honest version: when you only have a prompt, you get a prompt-shaped result. The lanes you didn't articulate become the lanes the LLM hallucinates. That's why the second prompt — "make it less generic" — never actually works. You're asking the model to read a mind that hasn't finished thinking.

## How Hey Bradley splits the lanes back out

Hey Bradley collapses the spec-to-build gap by giving each lane its own surface, then composing them automatically. You don't manage three tools. You manage one conversation that knows it is doing three jobs.

The 5-atom AISP architecture is the mechanism. Every chat turn produces five symbolic envelopes — INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH — and each atom maps cleanly to a lane. INTENT is the PM lane: the verb, the target, the scope. SELECTION and PATCH are the architect lane: which template, which section, which structural choice. CONTENT is the designer lane: tone, length, voice, the surface of the thing. ASSUMPTIONS is the review meeting that never happened, surfaced inline so you catch your own omissions before the patch lands.

Templates collapse the design lane further. Instead of picking 200 micro-decisions about grids and type and spacing, you pick a template that has already made those decisions coherently. The 37 templates in the library aren't variations of one base; they're 37 different opinions held tightly. You inherit the opinion. You don't re-litigate it at midnight.

The chat surface collapses the PM lane into running conversation. You don't open a doc and write a brief. You talk. The system parses verbs, ordinals, section references, scope hints, personality cues. By the time the patch lands, the brief has been captured as a structured INTENT atom — not because you wrote one, but because the conversation produced one.

## One person, three hats, one tool

The promise is not "AI replaces the PM, architect, and designer." The promise is "the same human can hold all three lanes at once, without losing any of them, because the tool knows which lane each utterance belongs to."

You speak. The system separates intent from assumption from selection from content. The patch lands. The spec is the artifact. The next time you open the project, you are not re-deriving the brief from a screenshot — you are reading the AISP envelope you produced last week and extending it.

That is what collapses the three-hat tax. Not faster code generation. Lane-aware capture, persistent specs, opinionated templates, and an LLM that is finally asked the right kind of question.

You are the PM. You are the architect. You are the designer. You are one person. The tool finally accepts that and stops asking you to pretend otherwise.

Try the open source version →
