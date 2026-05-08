# Why Jira Is Incompatible With Agentic Development

The agentic engineer types one prompt. Claude Code returns twelve commits in ninety seconds. Then they open Jira to log it. The ticket form has no idea what just happened. The dropdown wants a story-point estimate. The status column wants "In Progress." The reviewer field wants a human. None of those fields describe what the swarm did. That is the problem.

You are probably running a small team or working alone with an AI assistant. You have a backlog tool because every team has a backlog tool. You also have the nagging sense that the tool is slowing you down rather than helping. You are right.

## What Jira assumes about software work

Jira was built for sequential, human-paced work. The mental model is a relay race. A story becomes a ticket. The ticket becomes a commit. The commit becomes a pull request. The pull request becomes a review. The review becomes a merge. Each baton-pass takes hours or days. The board exists to track who is holding the baton.

Three assumptions are baked in. First, a human is the bottleneck — the workflow optimizes for visibility into a slow human. Second, estimation is in hours or points — the unit assumes a person at a keyboard. Third, the audit trail lives in the ticket — comments, attachments, status transitions are the record of truth.

Every one of those assumptions breaks the moment you put an agentic engineer in the loop.

## What agentic actually looks like

Agentic work is not a relay race. It is a wave. One prompt fans out to seven parallel agents. Each agent owns a strictly disjoint slice. They all return inside a single coordinated push, and the gate commit seals the wave.

The decisions get made *before* the code is written, not during. We call it the locked-decision pattern, and Sprint J Wave 1 was the first time we ran it end-to-end — every architectural choice frozen in `03-sprint-j-locked.md` before any agent spawned. The artifact is the spec, not the ticket.

The numbers from this codebase: Sprints H, I, J, K, L, and M sealed in two working days. Two-hundred-and-forty-four PURE-UNIT tests green at the most recent seal. Eighty ADRs accepted on disk through P56. The dev flywheel — ADRs plus GROUNDING plus retrospectives — *is* the documentation. Not the Jira board.

## Where the mismatch breaks

Tickets created by the AI go stale before a human reads them. The swarm seals every thirty minutes. The ticket sits in "Open" because nobody has gotten around to triaging it.

Estimation columns become noise. What is the story-point value of a wave that closes in forty-five minutes and adds two ADRs? Nobody on the team would put a number in the field. The field stays empty. The reports stop meaning anything.

The sprint-review meeting does not exist. There is no fortnight cadence to review against. The seal commit is the review. The retrospective at the end of each phase is the meeting. Both are documents, both are versioned, both are searchable. The Jira "Activity" tab has none of that context and cannot get it.

The audit trail can no longer keep up. By the time a human writes a comment on the ticket, the commit log and the ADR file already hold the truth. The ticket becomes a derivative artifact — a worse copy of what the repo already records.

## What works instead

Spec-first artifacts. AISP atoms (PATCH, INTENT, SELECTION, CONTENT, ASSUMPTIONS) are closed symbolic envelopes that any modern LLM reads natively. They are precise enough that the build agent implements on the first attempt. Sub-2% ambiguity by construction. The spec is the unit of work, not the ticket.

Wave-gate cadence. Three to seven agents per wave, disjoint scope, commit between waves never inside. The gate is the test suite. If the gate does not hold, the wave did not ship — regardless of what any tracker says.

Retrospectives as the learning system. Every phase ends with a Keep / Drop / Reframe document. Those retrospectives feed the next sprint's plan. Patterns get promoted into the ruvector population. The system gets better because the documents accumulate, not because someone updated a status column.

Hey Bradley sits in this category. The product is a spec generator. You speak or type an intent. It returns an AISP envelope precise enough that an agentic engineer — Claude Code, Cursor, whoever you prefer — can build it on the first pass. The output is the spec. The build is somebody else's lane.

## Closing

Most software work happens before coding. We call it the 55% problem — roughly 55% of effort in an AI-assisted build goes to ambiguity removal: clarifying tone, picking sections, agreeing on structure. Jira optimized the wrong 25%. It optimized the visible part of the relay race, and the relay race is no longer how the work moves.

The bet is simple. The spec is the product. The repo is the audit trail. The retrospective is the meeting. The ticket tool is whatever stays out of the way.

Hey Bradley is open core. May 2026 capstone. The roadmap and every ADR is in the repo if you want to read the work.
