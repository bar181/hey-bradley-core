# Your Team Re-Explains the Project Every Session

Every time your team opens a new Claude Code or Cursor session, someone re-explains the project. The context window resets. The AI asks the same questions. Your senior engineer types the same architectural constraints for the third time this week.

This is the session amnesia problem, and it's costing your team hours every day.

## What your team gets with Hey Bradley

**A persistent spec.** Not a README that goes stale. A structured specification that captures what your product does, why it does it that way, and what the constraints are. When your AI coding assistant reads it, the session starts where the last one ended.

**A CLAUDE.md handoff.** The builder exports a CLAUDE.md file — the file Claude Code reads on startup. Your architectural decisions, your naming conventions, your test patterns. Written once, applied every session.

**An agent scope map.** Every agent in your swarm knows its boundary. The coder doesn't touch the database schema. The reviewer doesn't refactor the build pipeline. Scope is explicit, not negotiated.

## Real time, not rebuild

Other AI builders regenerate the whole site on every change. Hey Bradley patches what changed. The difference shows up in three places:

- **Iteration speed.** A JSON patch takes milliseconds. A full regeneration takes seconds to minutes.
- **Cost.** Patches use a fraction of the tokens. At scale, this is the difference between $5/month and $500/month.
- **Developer trust.** When a developer sees a diff of exactly what changed, they trust it. When they see a full regeneration, they audit everything.

## Honest about what's shipped

Today: the open-core builder, the spec export, the CLAUDE.md handoff, and the agent scope map. All MIT-licensed. All in the browser.

What's not shipped yet: team workspaces, shared cloud projects, SSO. Those land in a future commercial tier, gated by real demand — not a roadmap slide.

The spec layer is free. The collaboration layer is what we'll charge for. That's the boundary.
