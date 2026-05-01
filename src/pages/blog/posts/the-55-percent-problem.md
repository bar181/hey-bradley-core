---
title: "The 55% Problem: What Happens Before You Open Claude Code"
slug: "the-55-percent-problem"
date: "2026-05-01"
excerpt: "Industry research consistently puts 55% of software project effort before the first line of code. Claude Code, Cursor, and every coding agent start at the 45% line. Hey Bradley occupies the missing 55%."
tags: ["aisp", "spec-first"]
---

# The 55% Problem: What Happens Before You Open Claude Code

The number is older than the AI era. McKinsey, Standish Group, and a long line of software-engineering economics research have put it in the same range for thirty years: roughly 55% of software project effort happens before the first line of code is written. Requirements gathering. Scoping. Architectural decisions. Design debates. Stakeholder alignment. ADR drafts. Ticket grooming. Whiteboard sessions that end with a phone snap and a vague "I think we agreed on this." The actual coding is the small half.

Claude Code, Cursor, Devin, Copilot — the entire current generation of coding agents — all start at the 45% line. They assume the spec is in your head and ready to type. They are extraordinary at the second half. They are not even trying to occupy the first.

That is the gap. It is also where most projects die.

## The pattern of failure

You have an idea. You open a chat with a coding agent. You start typing. The first thirty seconds go well — the model is fast, the output is plausible, the first commit lands. Then you realize you do not actually know what tone the marketing copy should be in. You pause. You ask the model. The model picks one. You say "no, more like this." Three turns later you are in a tone debate with a model that has no memory of the brand decisions you made last week, because the brand decisions were never written down. They were in your head, partial and shifting, and now they are leaking into the build one prompt at a time.

This is the 55% problem in miniature. The coding agent is doing the 45% job perfectly. The 55% job — the spec, the scoping, the assumption capture — is happening in real time, ad hoc, in the chat window of a tool that was built for the other half. The output is fragmented working memory dressed as code. The build is a 70% match, and the gap is everything you forgot to specify.

Adding more model intelligence does not fix this. Cursor 2.0, Claude 5, the next $200M coding-agent startup — none of them will fix it, because none of them are trying to. They are racing on the visible 45%. The invisible 55% is the missing market.

## What occupying the 55% looks like

Hey Bradley's job is to be the spec engine. Not a competing coding agent. The deliberate complement to the ones you already use.

The architecture is the 5-atom AISP Crystal Atom, in production today:

- **INTENT_ATOM** captures the verb, the target, and the scope of what you actually asked for. Not your prose request. The structured parse of it. ADR-053 records the design.
- **SELECTION_ATOM** records which template lane the request enters, with traceable two-step reasoning. ADR-057.
- **CONTENT_ATOM** carries the text payload with explicit tone and length defaults derived from the section type. ADR-060, ADR-061.
- **ASSUMPTIONS_ATOM** surfaces every inference the system made when you were vague — and lets you correct them before the build proceeds. ADR-064.
- **PATCH_ATOM** is the deterministic change to apply. Closed schema. No prose, no guessing.

Five closed symbolic envelopes. Five chances to catch ambiguity before it ships. The full open spec lives at github.com/bar181/aisp-open-core. Any modern LLM understands the symbol set natively, by design — AISP is a math-first neural-symbolic protocol, not structured prose.

The output of a Hey Bradley session is not "a working site" in the Lovable sense. It is a spec — the AISP envelope plus a human-readable plan plus an optional preview — that is unambiguous enough to hand to Claude Code, Cursor, or any agentic engineer. The build then matches the spec on the first pass, because the spec is precise enough to be matched.

## Why this is academically credible, not just product copy

The 5-atom architecture is not a marketing diagram. It is a deterministic state machine with closed Σ at each layer. The LLM cannot widen the schema. The renderer cannot guess. The assumption surface is mandatory — the model is required to declare what it inferred, and the user is required to confirm or correct before the patch lands. Sub-2% ambiguity by construction, measured against the test corpus.

That is the part the capstone defense rests on. The roadmap has been sealed phase-by-phase: Sprint B introduced template-first routing (ADR-050), Sprint C wired in the AISP instruction layer with LLM-native lift (ADR-053, ADR-055, ADR-056), Sprint D added the content generators (ADR-058 through ADR-062), Sprint E introduced the assumptions engine (ADR-064). Ninety-six accepted ADRs on disk through P69. The AISP open-core spec is public. The architecture is reproducible by anyone who reads the ADRs.

That is what "occupying the 55%" actually requires. Not a clever chat surface. Not a slicker prompt. A formal protocol with closed schemas, an inspectable trace at every step, and an output that is unambiguous enough to be the input to a coding agent. We did the protocol work first. The chat surface is the thin layer on top.

## The handoff is the proof

The most important moment in a Hey Bradley session is the moment you copy the spec. You hold push-to-talk. You describe a site or a feature or an architectural decision in one sentence. The atoms light up in order. PATCH lands. INTENT parses. SELECTION picks a lane. CONTENT drafts. ASSUMPTIONS surface. You correct one of them. You hit copy. The spec is on your clipboard.

You paste it into Claude Code. The build matches what you asked for, on the first pass, because the spec was unambiguous enough to be matched. You did not lose context. You did not argue with a model about decisions you had already closed. The 55% work was done in the spec engine. The 45% work happened in the coding agent. Each tool did the job it was built for.

That is the handoff. That is the missing market. That is the bet.

Explore AISP →
