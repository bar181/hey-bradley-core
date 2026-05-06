---
title: "The Handoff That Changes Everything"
slug: "the-handoff-that-changes-everything"
date: "2026-05-06"
voice: "founder-direct"
excerpt: "Every other AI builder regenerates from scratch on each user message. Hey Bradley sends a JSON-patch. The architectural difference shows up first in iteration quality, second in cost, and third — and most importantly — in the handoff to the developer or coding agent who picks up the work."
tags: ["architecture", "agentic-engineering", "spec-first"]
---

# The Handoff That Changes Everything

A developer I know got pinged on a Tuesday by an old client. The client had a half-finished Figma file, three pages of notes from a brand workshop, a Google Doc with section copy that did not match the Figma, and a paragraph in the email about "what we kind of agreed on in the last meeting." The developer estimated three hours just to get to the point where she could open her editor. She charged for those three hours. The client paid. Nobody felt good about the transaction.

This is the universal shape of the handoff. The non-technical owner has the vision in pieces, scattered across the surfaces they used to capture it, and the technical person who picks up the work has to reassemble the pieces before they can start. The first hour of every project is forensic, not productive.

Hey Bradley changes the shape of that handoff. Not because the team is smarter. Because the team picked a different load-bearing primitive.

## The architectural insight

Every other AI builder works the same way under the hood. The user types a prompt. The system regenerates the site. The whole site. New HTML, new copy, new layout — sometimes intentional, often not. The "diff" between turn N and turn N+1 is computed by the human, by squinting and saying "wait, why is the testimonial different now."

The token cost on every turn is proportional to the size of the entire site, because the LLM is being asked to imagine the whole site each time. If your homepage has eight sections and a footer and a contact form, the model is regenerating eight sections and a footer and a contact form on every prompt, even when you only changed the headline. This is the second-prompt problem. It is also the second-bill problem.

Hey Bradley does not work that way.

The user types a prompt. The system sends the LLM a JSON-patch request — a diff against a typed schema, not a regenerate-from-scratch instruction. The LLM replies with a patch — `replace /sections/2/headline`, `add /sections/4/components/0`, `remove /sections/7` — three lines, not three thousand. The patch is validated against the schema. If it would corrupt the site, the schema rejects it before it lands. The preview re-renders the patched site, in real time, while the user is still talking.

The spec IS the JSON. The exported `CLAUDE.md` is a human-readable wrapper around what the JSON already knows. Sections are typed. Components are typed. Tone, audience, purpose — all enumerated. There is no prose-only artifact pretending to be a spec. There is a typed schema, a JSON instance of it, and a markdown export that any developer or AI coding assistant can read.

This is architecturally different from every competitor. Not in degree. In kind.

## Why the cost shape matters

The cost implication takes a minute to land, but it is load-bearing for the whole product, so it is worth landing.

When the LLM is regenerating the entire site on every turn, the per-turn cost scales with site size. Bigger site, bigger bill, every prompt. When the LLM is producing a patch — three lines of JSON, validated against a schema — the per-turn cost is roughly constant regardless of site size. Big site, small site, the patch is the patch.

The plain-English version: it is the difference between a meeting that bills hourly and a Slack message. Both can solve the problem. One scales linearly with the size of the question; the other does not.

That difference compounds. Across a session that is twenty turns long — the kind of session where Maren is iterating until the homepage feels right — one architecture is paying for the entire site twenty times, and the other is paying for twenty patches. The order-of-magnitude gap is real, and it is what makes cheaper LLMs viable. Hey Bradley can route most operations to small, fast, inexpensive models — sometimes free ones — because the LLM does not need to imagine the whole site. It only needs to imagine the diff against a typed contract. That is a much smaller, much more constrained job, and the smaller models are good at it.

This is why the unit economics of this product are different from the unit economics of regenerative builders. Not because we negotiated better LLM rates. Because the architecture asks the LLM to do a smaller, narrower thing each turn, and the smaller narrower thing is cheaper to do well.

## The handoff

Now, the developer who got pinged on Tuesday.

In the old shape, she gets a Figma file, brand notes, a copy doc, and an email paragraph. Her first three hours are forensic. She makes a list of questions. She sends them to the client. She waits. She gets answers that contradict the Figma. She sends a second list. She starts coding around hour four with half her questions still pending.

In the new shape, she gets the export. The export is a markdown bundle plus a JSON file. The JSON is the typed instance of the schema — it tells her exactly what sections exist, exactly what each section contains, exactly what the brand voice attributes are, exactly what the tone enum value is, exactly which storytelling preset the client picked. The `CLAUDE.md` is a human-readable preamble — it tells her in prose what the schema says in types, so the first read is fast.

She opens Claude Code. She drops the export in. The agent has a typed contract to work against, not a vibe to interpret. The first prompt she sends the agent is not "what does the client want," it is "build me a Next.js implementation of this site, starting with the layout, using Tailwind." The agent reads the bundle, reads the schema, reads the brand voice, and starts producing code that matches the spec on the first pass. There are no clarifying questions, because the spec is precise enough that there is nothing to clarify.

Her first hour on the project is not forensic. It is shipping. The schema did the alignment work that used to require three meetings and a contradicting copy doc.

This is the handoff that changes everything. Not the building. The receiving.

## What this looks like for the broader frame

The thesis behind Hey Bradley is that software with AI as your assistant should feel symmetric from both ends. The user who *describes* the site — Maren on a Tuesday, in her own words, by talking — gets a tool that captures her words faithfully and iterates without losing her context. The developer or coding agent who *receives* the site — three weeks later, when Maren wants something custom — gets a typed contract that matches what they know how to do.

In between is a schema. The schema is what makes both ends possible. Maren never sees it; she just sees her site. The developer sees it as the source of truth; she does not have to negotiate it. Both ends are doing what they are good at, and the artifact between them is doing the work of translation that used to be done by long emails and missed phone calls.

This is, we think, what spec-first means in practice. Not a methodology. An architectural decision. The spec is a typed object. The user manipulates it through conversation. The developer or agent consumes it as a contract. Neither end is required to learn the other end's vocabulary. The schema is the interlingua.

The road map for what comes next — multi-page improvements, page-aware patches, smarter section reordering, a richer storytelling-preset library, the eventual full Σ_512 AISP scoring runtime — is being sketched in public. The architecture below the product is open and being iterated alongside the product itself.

Read what's coming next → https://github.com/bar181/aisp-open-core
