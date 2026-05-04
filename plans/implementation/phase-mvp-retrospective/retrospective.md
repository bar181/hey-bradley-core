# MVP-RETRO Phase — Retrospective

> **Phase:** MVP-RETRO · **Date:** 2026-05-04 · **Sealed via:** keep / drop / reframe

## Keep

### The 8-doc taxonomy
Process retro / market / technical / capstone / next-steps / best-practices / casual / blogs covers four audiences (owner / team / capstone / public) without redundancy. Each doc has a single primary reader.

### Wave-staged dispatch
Wave 1 independent reviews → Wave 2 synthesis → Wave 3 public storytelling. The synthesis docs (05+06+07) explicitly cite Wave 1 findings, which kept them grounded vs hand-waving.

### LOC caps that flexed honestly
Doc 07 came in at 36 LOC because the casual voice doesn't need 200. Doc 04 hit 276 because the original-vs-final story actually had that much specific material. Caps as guardrails, not floors.

### Cross-track convergence callouts
Same self-inflicted regression flagged by 3+ docs — pattern was real, not noise. The convergence list in session-log.md is the most useful 5-line summary of the build.

### Don Miller voice for 07 + 08a/b/c
Story-brand structure with "but" pivots produced the only docs in this phase that work as standalone reading. The formal docs (01-04) are reference material; the casual + blog docs are READ material.

## Drop

### "Beers + pizza" + Don Miller frame for blogs were redundant
07 already used Don Miller voice. The blog posts (08a/b/c) re-applied it. Result: 4 docs with overlapping voice. If we did this again, 07 would be the casual internal voice and the blog posts would have a sharper public-marketing voice (more concrete reader pain in the opening hook; less internal anecdote).

### Sequential committing of each doc as it landed
Created 9 commits where 3 (one per wave) would have been cleaner. The git log on this branch is fragmented. Future retro phases should commit per wave, not per agent.

### Doc 03 + Doc 06 overlap
Technical deep dive (03) and best practices (06) cover ~30% of the same material from different angles. If we did this again, one doc with subsections would be tighter than two with cross-reference chains.

## Reframe

### "Capstone defense doc" → "any future-team onboarding doc"
Doc 04 (capstone comparison) is more useful as the explainer for anyone joining the project than as a Harvard ALM artifact. The primary audience reframes after launch.

### "Best practices" → "swarm-driven build template"
Doc 06 catalogues 11 patterns + 7 anti-patterns + 15-item checklist. That's not a retrospective artifact; that's a template another project can copy verbatim. Reframe as `templates/agentic-engineering-build-template.md` for re-use.

### "Blog posts" → "the post-launch content calendar opener"
The 3 blog posts are not the whole content strategy. They're posts 1-3 of an ongoing series. Each ends with "next post in this series" hooks. Future content phases extend the series rather than starting fresh.

### "Casual summary" → "the founder voice document"
Doc 07 is the truest voice in the entire repo. Reframe as the canonical "what does the founder sound like when describing this product" reference for any future marketing copy.

## What this phase taught us

The discipline that produced the 109-phase build is itself documentable. We have three artifacts (06 best practices / 03 technical / 01 process) that each capture pieces of it. Distilled, the methodology is:

1. Brief like a smart colleague (every Crystal Atom does this)
2. Disjoint ownership (every wave dispatch enforces this)
3. ADR before code (every architectural decision)
4. EOP triplet (every phase closes this way)
5. Brutal-honest review (every major seal includes this)
6. Cross-track convergence on audits (find the same bug from multiple angles)

That's it. Six rules. Ship anything.

## Honest verdict

The MVP-RETRO phase is comprehensive but produced the equivalent of three useful docs (07 casual / 06 best practices / 04 capstone comparison) wrapped in five reference docs that future readers will skim, not read. If we ran this phase again, we'd:

- Cut to 4 docs total (process+technical merged / market+next-steps merged / casual + 3 blogs as-is / capstone standalone)
- Commit per wave (3 commits, not 9)
- Sharpen blog post voice differential from doc 07

The phase achieves its mandate. The question owner reviews next is which subset of these docs becomes load-bearing for capstone defense + public site, and which become archive.

## Next phase guidance

Per doc 05 — pending human review. 5 signal-conditional phases proposed (Agentic IDE v0 / Level 2 / Whiteboard executive / L4+ agentic / MCP standalone). NO scaffolding until owner sees the launch signal.

This retrospective is itself a deliverable — it sits in `plans/implementation/phase-mvp-retrospective/` for review and does not require a next-phase preflight.
