# The Most Expensive Game of Telephone in History

Every piece of software starts as an idea in someone's head. By the time it reaches production, that idea has been translated at least five times: from thought to words, from words to a document, from document to design, from design to code, from code to deployment.

Each translation loses fidelity. Research from our Harvard ALM capstone measured the loss.

## Act I — The Problem Nobody Fixed

When a founder describes their vision to a designer, roughly 60% of the original intent survives. The designer interprets what they heard and hands it to a developer — another 60% survives. By the time the idea reaches production code, through five typical handoffs, the math is devastating:

**0.60 to the fifth power = 7.8% fidelity.**

Less than 8% of the original idea survives to production.

This is not a tooling problem. Figma is excellent at what it does. So is Jira. So is Slack. The problem is the *translation itself* — every handoff introduces ambiguity, and ambiguity compounds.

## Act II — The Insight

The whiteboard was always the most important tool in software development. Not because it's sophisticated, but because it's the only place where the person with the idea and the person building it stand in the same room, pointing at the same thing.

We found that 55% of AI-assisted build effort is spent on ambiguity removal — not writing code. The bottleneck is not the code. The bottleneck is the spec.

**Dev effort breakdown:**
- Concept to Spec: 55% of total effort (the bottleneck)
- Spec to Code: 30%
- Code to Deploy: 15%

The tools optimize the wrong half. Copilot, Cursor, and Claude Code are extraordinary at turning clear instructions into working code. But who writes the clear instructions?

## Act III — The Same Day, Different Ending

A nurse in Vermont has an idea for a patient intake form at 10:00 AM. She describes it: "I need a simple page where patients enter their name, date of birth, and reason for visit. Nothing fancy. Just clean and calming."

With the traditional chain, her idea passes through a project manager, a designer, a developer, and a QA cycle. She sees the result in two weeks. It has a dark theme, three dropdown menus she didn't ask for, and the word "calming" was interpreted as "corporate blue."

With a spec-first approach, she describes it into a chat box. The system captures her exact words, preserves them as structured intent, and produces a preview she can see immediately. By noon she's adjusting the color. By 2:00 PM she has a production-ready spec. The developer who picks it up reads her actual words, not someone's interpretation of someone's notes.

## The Math

AISP (AI Symbolic Protocol) preserves 98% fidelity per handoff. Five handoffs:

**0.98 to the fifth power = 90.4% fidelity.**

From 7.8% to 90.4%. That's not an incremental improvement — it's a category change.

The protocol achieves this by using 512 mathematical symbols that AI models understand natively, without instruction. Near-zero ambiguity. The spec is not prose that requires interpretation. It's structured intent that machines read directly.

## The Landscape

| Approach | Fidelity per step | After 5 steps | Bottleneck |
|---|---|---|---|
| Whiteboard + Docs | ~60% | 7.8% | Every handoff |
| Figma + Jira | ~65% | 11.6% | Design-to-dev |
| AI builders (Lovable, v0) | ~70% | 16.8% | Prompt ambiguity |
| AI coding tools (Cursor) | ~75% | 23.7% | Spec quality |
| **AISP + Hey Bradley** | **~98%** | **90.4%** | **None structural** |

## What Becomes Possible

When intent preservation reaches 90%+, software stops being a department. The person with the idea becomes the person who ships the product. Not because the technology replaces developers — but because it replaces the telephone game.

The spec is the product. The code is the implementation detail.

*Capstone research, Harvard ALM Digital Media Design — Bradley Ross, 2026.*
