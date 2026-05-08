---
title: "How We Built an Open Core Product in 2 Days With a Swarm"
slug: "built-open-core-in-2-days-with-swarm"
date: "2026-05-01"
excerpt: "Most AI agents promise speed and produce sludge. Wave-gate orchestration with disjoint-file agents and brutal-honest reviewers shipped 12 sprints in 2 days — here is the honest scoreboard."
tags: ["agentic-engineering", "swarm", "wave-gate"]
---

# How We Built an Open Core Product in 2 Days With a Swarm

Most "AI agents" promise speed but produce sludge. The promise sounds clean: "Claude Code will write your app while you make coffee." The reality is messier. Roughly 30% of the time you get working code on the first pass. The other 70% you get something close enough to be dangerous — a function that compiles, runs, passes one happy-path test, and silently drops the field you actually cared about. Speed without discipline is just faster regret.

We have shipped through that pattern enough times to recognize the shape. The fix is not a smarter agent. The fix is the orchestration around the agent. Specifically: disjoint-file scope, written briefs, brutal-honest reviewers, AISP specs as the hand-off artifact, and a gate at the end of every wave that the swarm cannot bypass. We call it wave-gate orchestration, and it is how we sealed 12 sprints over 2 working days on the Hey Bradley open core build.

## What "12 sprints in 2 days" actually means

The honest sprint chain: OC-1 Open Core RC. OC-2 Mode Architecture. OC-2.5 Design Tokens (Wave 1 + Wave 2). OC-3 First Templates. OC-4 Template Library Expansion (37 templates). OC-5 Mobile UX Redesign. Polish Wave 1. Polish Wave 2. Close-the-Gap. Library-Wide Polish. Templates Round 2. Mobile Redesign. Twelve sprints, sealed sequentially with parallel waves where the file scope allowed.

The scoreboard at seal: 730 cumulative pure-unit tests green. 96 ADRs accepted on disk. Library mean visual polish moved from 6.0 to 8.5+. Mobile-touched-surface polish moved from 8.5 to 9.0+. Codebase grew to roughly 28,400 lines of TypeScript across 227 source files. Twelve themes, 37 examples, 16 section types, 300 catalog images, 13 image effects. Numbers from the seal commit, not from a pitch deck.

## The wave-gate pattern

A wave is a single coordinated push. Three to seven agents spawn in parallel. Each agent owns a strictly disjoint slice of the work — disjoint files, not just disjoint intent. A4 writes markdown posts. A5 writes other markdown posts. A6 edits the Blog page and writes the ADR. No two agents touch the same file in the same wave, ever. Mid-wave commits are forbidden. The orchestrator waits for every agent to return, runs the gate, then commits once.

A gate is a hard checkpoint. Tests must be green. Build must be clean. ADR must be filed. Retrospective must be written. If the gate fails, the wave did not ship — even if the agents returned looking confident. This is the part that prevents sludge. The agents do not get to decide whether they shipped. The gate does.

## Brutal-honest reviewers as the brake

Every major phase ends with a 4-perspective brutal review: UX, functionality, security, architecture. Each reviewer writes against a chunked report, recursive up to three passes, blocker-fix-re-review until the report comes back clean. The reviewers are not cheerleaders. They are pre-instructed to find the worst thing about the wave and surface it. Most must-fix items get caught in the first pass. The phases that didn't pass the third pass got rolled back, not papered over.

This is where the velocity comes from. Speed without a brake is a crash. A swarm that skips reviews ships fast and ships wrong. A swarm with disciplined reviewers ships fast and ships right, because the wrong things get caught at gate-time instead of leaking into the next sprint as accumulated debt.

## What broke, honestly

Not everything went smoothly. The ChatInput.tsx orchestrator refactor in Polish Wave 2 timed out three separate times. The file had grown past the comfortable agent-context budget, and the refactor needed to land in a single coherent change rather than incrementally. We retried with a tighter scope brief, smaller line budget, and explicit rollback instructions. It landed on the fourth attempt. Three timeouts is not a triumph; it is data. The lesson — which is now in the velocity-corrected estimate doc — is that orchestrator-shaped files need their own pre-decomposition pass before they enter a parallel wave.

Sprint J Wave 1 hit stream timeouts on three agents in parallel. We shrank wave size for the next two sprints and the pattern proved out at three rather than seven. Sprint M then re-validated the upper bound at seven agents on tight scope. The wave size is not a constant; it depends on how clean the disjoint-file scope is.

## Why AISP specs matter to swarms

Disjoint files keep agents from clobbering each other. AISP specs keep agents from drifting. Every agent in a wave reads the same spec — the 5-atom Crystal Atom envelope produced upstream — and emits its slice as a downstream patch. The spec is the contract. Two agents looking at the same INTENT atom and the same SELECTION atom converge on compatible output even when they don't talk to each other, because the spec is unambiguous enough to make the local decision identical.

This is the part that makes swarm work scale past two agents. Without a shared spec, every additional agent multiplies the coordination cost. With a shared spec, every additional agent runs in parallel on its slice and the merge is mechanical.

## The honest takeaway

You do not need a research lab to run a swarm like this. You need disjoint-file scope, a written brief per agent, brutal-honest reviewers gating each phase, AISP specs as the hand-off, and the discipline to never commit mid-wave. The velocity is real. The velocity emerges only when the discipline holds. Compress the discipline and you get sludge faster, which is worse than sludge slower.

12 sprints, 2 days, 730 tests green, 96 ADRs accepted. The pattern is in the repo. So is the ChatInput timeout retrospective. We left both in on purpose.

Try the open source version →
