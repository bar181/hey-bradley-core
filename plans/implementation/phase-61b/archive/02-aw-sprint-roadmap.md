# P61b — AW Sprint Roadmap (Agentic Workbench)

> **Date:** 2026-04-30 · **Sequencing:** AFTER OC-18 public RC seal
> **Window estimate:** 3-4 weeks of swarm execution
> **Pair with:** `01-strategic-vision-2026-04-30.md` (canonical owner vision)

---

## Hard sequencing rule

```
P61 launch plan (NOW, planning)
      ↓
OC-1..OC-18 (post-defense, 2-3 weeks execution)
      ↓
v1.0.0 public RC sealed
      ↓
AW-1..AW-10 (this roadmap, 3-4 weeks execution)
      ↓
v2.0.0-RC Open Core RC v2 (all three modes live)
```

**No AW work begins before OC-18 seals.** Reasoning: OC-1 through OC-10
close the visual floor, onboarding, mobile, and performance gaps that
affect ALL three modes. Building Agentics on a shaky foundation is wasteful.

**EXCEPT:** three architectural decisions made NOW (`03-pre-oc1-decisions.md`)
to preserve the design space for Agentics mode as OC sprints execute.

---

## 10 AW sprints — brutal-honest review per sprint

### AW-1 — PROCESS_ATOM + decomposition engine (B+)

What's good: extends proven 5-atom pipeline with a sixth atom; reuses
INTENT_ATOM resolver; deterministic by design. What's brittle: phase /
sprint / wave decomposition is opinionated — must encode the user's
methodology, not Jira's. **Gate:** PROCESS_ATOM emits hierarchical JSON
(phases > sprints > waves > agents); 50 example decompositions in
test corpus; deterministic for same input.

### AW-2 — Process-map visualization (A−)

What's good: the visual moat — no competitor has this. What's brittle:
a real interactive D3-or-equivalent build, not a sprint of polish.
SVG vs canvas, click-targets, mobile-rendering all need design. **Gate:**
clickable phase / sprint / agent nodes; status-color coding (planning /
in-flight / sealed); side-panel auto-opens on click; mobile renders as
collapsible tree.

### AW-3 — DDD_ATOM + bounded-context generator (B)

What's good: ADR-054 defines the bounded contexts; DDD_ATOM auto-drafts
them from a project description. What's brittle: bounded-context naming
is judgement-heavy; LLM output requires human review. **Gate:** DDD_ATOM
emits 3-7 bounded contexts per project; named per DDD conventions;
review-and-approve UI before commit.

### AW-4 — AGENT_ATOM + wave coordination view (A−)

What's good: closes the loop from spec to dispatch; ties to the existing
disjoint-files swarm-orchestration discipline. What's brittle: agent
scope conflicts must be detected statically (file overlap = blocker).
**Gate:** AGENT_ATOM per wave; conflict map flags overlapping file
scopes; export to swarm-instructions.md format.

### AW-5 — SpecWorkbench (B+)

What's good: surfaces both AISP and human-readable spec at once;
addresses the "AISP is Greek to non-engineers" gap. What's brittle:
two-pane synchronized scrolling is non-trivial UI work. **Gate:** AISP
+ human-spec side-by-side; sync-scroll; "Explain this atom" inline
button per Crystal Atom.

### AW-6 — Export: CLAUDE.md + swarm instructions + ADR bundle (A)

What's good: THE Claude Code hand-off mechanism; the moat that turns
Hey Bradley from a designer-tool into a developer-tool. What's brittle:
CLAUDE.md format isn't standardized — must encode our specific
swarm-orchestration conventions. **Gate:** export emits 3 artifacts
(CLAUDE.md, swarm-instructions.md, adr-bundle.zip); round-trip verified
by Claude Code agent reading the export and producing matching code.

### AW-7 — TDD scaffold generator (B)

What's good: completes the spec-to-test loop; tests-before-code is the
discipline that makes AISP credible. What's brittle: test scaffolds tied
to a framework (Playwright / Vitest / Jest) — must support multiple.
**Gate:** generates Playwright spec scaffolds from AISP atoms; one
scaffold per acceptance gate.

### AW-8 — KISS + review pattern generator (B)

What's good: encodes the multi-reviewer brutal-review pattern as a
reusable artifact; helps any team adopt the methodology. What's brittle:
"KISS" is subjective; LOC caps + dep-bloat checks are the concrete
proxies. **Gate:** generates 4-reviewer prompt templates (UX / Functional /
Security / Architecture); LOC-cap checker integrates with PR workflow.

### AW-9 — Seal panel — DoD + session log + retrospective (B−)

What's good: closes the phase loop; auto-generates the artifacts the
discipline already requires. What's brittle: heavy boilerplate UI work
for marginal automation gain (the artifacts are already markdown).
**Gate:** "Seal Phase" button generates session-log.md + retrospective.md
templates pre-filled from phase activity log.

### AW-10 — Full integration + public beta (A)

What's good: the v2 RC moment; all three modes integrated. What's
brittle: regression surface is enormous (every OC sprint + every AW sprint).
**Gate:** all three modes navigable from 3-card onboarding; cumulative
test corpus passes; v2.0.0-RC tag pushed.

---

## Cumulative effort estimate

| Tier | Sprints | Days |
|---|---|---|
| AW-1..AW-5 (foundation + Planning mode) | 5 | 7-10 |
| AW-6..AW-10 (Agentics mode + integration) | 5 | 8-12 |
| **Total** | **10** | **15-22 working days** |

At observed 100× velocity: ~3-4 calendar weeks of swarm execution.

---

## Three-card onboarding stub — special pre-OC1 case

The 3-card onboarding screen ("What are you building today?") needs to
ship in OC-2 (onboarding redesign), even though Planning + Agentics
modes won't be live until AW-5 / AW-10. The stub:

- Plants the architecture (3 modes are first-class citizens)
- Whiteboard card → live (today's app)
- Planning card → "Coming soon — week 4" + email-capture
- Agentics card → "Coming soon — week 7" + waitlist signup

This is a pre-OC1 architectural decision pending owner go (see
`03-pre-oc1-decisions.md`). It costs ~½ day of OC-2 scope and locks in
the platform framing before users arrive.

---

## What this roadmap does NOT cover

- Specific UI component design (per-sprint preflight handles)
- ADR-088 / ADR-089 / ADR-090 detailed contents (drafts pending owner go)
- Pricing / monetization for AW modes (commercial-tier work)
- Collective-intelligence layer (post-v2 commercial-tier)

---

## Bottom line

10 sprints over 3-4 calendar weeks turn Hey Bradley from a Lovable / Framer
competitor into a category-of-one **agentic engineering workbench** with no
direct competition above the website-builder layer. Foundation work in OC
sprints carries the design discipline; AW sprints layer the methodology
encoding on top. Public RC v2.0.0 ships at AW-10 seal.
