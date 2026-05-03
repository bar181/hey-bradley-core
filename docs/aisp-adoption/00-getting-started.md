# AISP Adoption — Getting Started

> **Goal:** make a 3rd-party tool able to consume an AISP bundle in any
> language, with zero dependencies. This page is the entry point.

## What is AISP?

AISP (AI Symbolic Protocol) is a math-first neural-symbolic language designed
for AI consumption rather than human reading. It uses 512 symbols that LLMs
recognize natively, targeting near-zero ambiguity. The canonical anchor for the
Hey Bradley AISP runtime is **ADR-053 (INTENT_ATOM)**, which introduced the
Crystal Atom shape — `Ω` Objective · `Σ` Structure · `Γ` Grounding · `Λ`
Logistics · `Ε` Evaluation — that every downstream AISP atom inherits.

A Hey Bradley AISP bundle is a JSON file that captures a website's full
specification (theme, sections, content, page layout) plus a trace of the AISP
atoms that produced it. Consuming this bundle elsewhere — in another generator,
a CI pipeline, a different framework — is a one-file integration.

The public AISP repo: <https://github.com/bar181/aisp-open-core>.

## The 8 atoms — AISP suite COMPLETE

The AISP suite is **COMPLETE at v2.0.0-RC1** with eight production-wired
Crystal Atoms. Five emit into the `bundle.atoms` object that ships with every
Whiteboard-mode bundle (the surface 3rd-party consumers parse). Three additional
atoms drive Planning + Agentics workbench surfaces and are NOT serialised in
`bundle.atoms` by design — they live in their own emit channels (Process Map,
Domain Model, Agent Spec) consumed by the markdown spec bundle (ADR-122) rather
than the JSON bundle.

### Bundle-emitted atoms (5 + DECOMP — what `bundle.atoms` carries)

| Atom | Role | ADR |
|------|------|-----|
| `INTENT` | classify verb + target from user input | ADR-053 |
| `ASSUMPTIONS` | rank ≤3 candidate clarifications when confidence is low | ADR-064 |
| `SELECTION` | pick the best-fit template id | ADR-057 |
| `CONTENT` | generate constrained text (tone, length capped) | ADR-060 |
| `PATCH` | the final JSON-Patch envelope applied to the master config | ADR-045 |
| `DECOMP` | split a multi-clause utterance into ordered todos *before* INTENT | ADR-099 |

### Workbench atoms (Planning + Agentics modes)

| Atom | Role | ADR |
|------|------|-----|
| `PROCESS` | project description → phases / sprints / waves / agents → ProcessMap (Planning mode) | ADR-118 |
| `DDD` | project description → bounded contexts + 4-kind relationships → DomainModelSVG (Planning mode) | ADR-119 |
| `AGENT` | wave context → ordered AgentSpec[] with disjoint ownedFiles + DoD checklists (Agentics mode; final atom of the suite) | ADR-120 |

If you only consume Whiteboard-mode bundles (the JSON shape below), you parse
the 5 baseline atoms + optional DECOMP. The PROCESS / DDD / AGENT atoms live in
the markdown spec bundle (ADR-122) — a separate emit surface designed for
Claude Code / Cursor / agent-pipeline consumption.

## The bundle shape

Top-level keys (all optional except `version`, `slug`, `site`):

```
{
  "generatedAt":  "<ISO timestamp>",
  "version":      "aisp-1.2",
  "slug":         "<kebab-case-from-site-title>",
  "filenames":    { northstar, humanSpec, aisp, config, manifest },
  "site":         { title, tone, tagline, ... },
  "theme":        { preset, mode, palette, typography, ... },
  "sections":     [ { type, id, enabled, order, variant, content?, ... } ],
  "pages":        [ { pageId, title, filenames } ],   // multi-page only
  "atoms":        { intent?, assumptions?, selection?, content?, patch? }
}
```

For the full field-by-field schema see
[01-bundle-schema.md](./01-bundle-schema.md).

## Sample bundle

A minimal but representative bundle ships at:

> `examples/3rd-party-consumer/sample-bundle.json`

It is single-page (no `pages` array), 5 sections, and includes 5 atom traces.

## Quickstart

Two reference parsers ship in the same directory. Both use stdlib only — no
npm packages, no pip packages.

```bash
# TypeScript (Node 20+)
cd examples/3rd-party-consumer && npx tsx parse-aisp-typescript.ts sample-bundle.json

# Python (3.10+)
cd examples/3rd-party-consumer && python parse-aisp-python.py sample-bundle.json
```

Each parser prints the same structured summary: spec version, slug, site title,
theme block, section table, atom traces, and (when present) the multi-page
table.

## Where to learn more

- [Bundle schema reference](./01-bundle-schema.md) — top-level fields, per-atom
  shapes, file naming convention, multi-page layout, versioning policy.
- [Reference walkthrough](./02-reference-implementation-walkthrough.md) —
  line-by-line tour of the TypeScript parser; the Python parser is a 1:1 port.
- [Hey Bradley AISP spec generators](../../src/lib/specGenerators.ts) — how the
  bundle is composed inside the app (canonical emitter).
- [`shareSpecBundle.ts`](../../src/contexts/specification/shareSpecBundle.ts) —
  the bundle composer (`composeShareSpecBundle()` is the seam to mirror).
