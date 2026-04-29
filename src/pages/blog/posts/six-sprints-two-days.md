# Six Sprints in Two Days: The Wave-Gate Pattern

Most teams ship a sprint per fortnight. We shipped six in two days. That is not a brag. It is a pattern, and the pattern is reproducible. Here is what made it possible, what broke along the way, and what we kept.

You are probably running a small team or working alone. You have an AI assistant, a backlog, and the nagging sense that you should be moving faster than you are. The bottleneck is rarely the code. The bottleneck is coordination — who owns what, when do they hand off, and how do you keep three agents from clobbering the same file. We solved that part. The rest followed.

## The wave-gate pattern

A wave is a single coordinated push: 3 to 7 agents spawned in parallel, each owning a strictly disjoint slice of the work, all finishing before the next wave starts. A gate is the commit that seals the wave — tests green, build clean, ADR filed, retrospective written.

Three rules made it work:

1. **Disjoint scope.** Agent A1 owns the renderer. A2 owns the page. A3 edits existing files. A4 writes markdown. A5 owns ADR plus tests. No two agents touch the same file in the same wave.
2. **Commit between waves, never inside.** Mid-wave commits are how you get half-merged state. The orchestrator waits for every agent to return, then commits once.
3. **Brief everything in writing.** Every agent gets a written scope with deliverables, constraints, and a verification command. No verbal handoffs, no "you'll figure it out."

The discipline is boring. The output is not.

## The orchestrator's 1M-token context

The velocity source is not the database. It is the orchestrator's context window.

A 1M-token Opus context can hold the entire phase plan, every relevant ADR, the last three retrospectives, the current STATE.md, and every file each agent is about to touch — all at once, all in working memory, all referenceable when an agent comes back with a question. The orchestrator does not need to re-read the codebase between waves. It already has it.

The agents themselves run in shorter contexts. They do not need the whole repo. They need their slice, briefed precisely, with the absolute paths spelled out. The orchestrator carries the global picture. The agents execute the local one. The hand-off is the brief.

This is why the velocity source is documents, not infrastructure. The plans, the ADRs, the retrospectives, the session logs — they are the medium the orchestrator thinks in. Skip the documentation discipline and the orchestrator forgets what shipped yesterday.

## What broke and what we learned

Sprint J wave 1 hit stream timeouts. Three agents in parallel, two finished cleanly, one returned a partial result after the orchestrator had already moved on. We learned to set explicit timeout budgets per agent and to retry the slow lane in a follow-up wave rather than block the seal.

Sprint K and Sprint L survived because we shrank the wave size. Three agents, tight scope, fast return — sealed in under a working day each. The pattern proved itself on the moat-priority work, where slowness would have cost the most.

Sprint M validated the upper bound. Seven agents, parallel, disjoint scope, premium template work plus design system plus tests plus ADR. All seven returned, the seal commit landed at `3398702`, and nothing collided. The wave-gate pattern scales further than we thought.

## The honest scoreboard

Here is what is actually committed as of today, with no rounding up:

- **244 cumulative tests, all green** at the most recent seal. Curated PURE-UNIT seal-gate count, not the higher per-file grep total.
- **79 ADRs accepted** on disk, with documented numbering gaps and three superseded duplicates listed in `docs/adr/README.md`.
- **B+ category grade** going into Sprint M. Sprint L raised the AISP visibility score and Sprint M raises the template polish score.
- **A- projected** after Sprint L plus Sprint M land in the public site refresh. Not promised. Projected.

> The scoreboard matters because the wave-gate pattern only works if the gates actually hold. If you ship six sprints in two days but three of them are red, you shipped nothing. The gate is the test suite, not the velocity.

## The takeaway

You do not need a research lab to ship like this. You need disjoint scope, a written brief, a commit at every gate, and an orchestrator with enough context to hold the whole picture. The velocity is not the agents. The velocity is the coordination — and the coordination is documents.

Ship the docs first. The waves follow.
