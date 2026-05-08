# ADR-122 — Export Claude Code (Markdown Bundle)

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P96 / AW-EXPORT-CLAUDE-CODE
- **Cross-refs:** ADR-101 (Spec Export Quality), ADR-108 (AISP Adoption), ADR-110 (AISP Visibility), ADR-121 (SpecWorkbench)

## Context

Hey Bradley is a **spec factory**, not a code generator. P95 / ADR-121
shipped the SpecWorkbench — the read-only review surface for the AISP
suite. P96 ships the **export pipeline** that materializes a phase's
`AgentAtomOutput` (+ human spec + ADRs + process map) into a single
artifact a downstream consumer (Claude Code, Cursor, any LLM agent)
can ingest and implement against in their own repo.

The owner Q2 update during the P95 planning sprint reframed the export
from a ZIP archive to a **markdown bundle**: one `.md` file with
explicit file markers. Markdown is readable by humans in any editor,
ingestible by LLMs without unzipping, and version-controllable as a
single text blob in git. ZIP added friction (binary, opaque, requires
unzip step) without a corresponding UX win at open-core scope.

ADR-110 governs AISP visibility — the export bundle is the canonical
externalization of AISP from the workbench. ADR-108 already established
the polyglot-adoption pattern (TS + Python reference impls bundled as
plain text); ADR-122 extends that pattern to the per-phase export.
ADR-121 D2 explicitly delegated the ZIP/multi-file path to P96; this
ADR closes that delegation with a markdown-bundle answer.

## Decisions

### Decision 1 — Markdown bundle (NOT ZIP) per Q2 owner answer

The export emits a single `.md` file. Plain text. Readable in any editor
or terminal. Git-versionable as a normal text artifact. LLM-ingestible
without a binary-decode step. ZIP rejected — adds friction
(unzip/extract/file-tree-navigate) without any UX gain at open-core
scope. Tier-2 commercial may layer File System Access API for true
multi-file directory writes; the markdown bundle remains the canonical
single-artifact source of truth.

### Decision 2 — Single `.md` with `# === FILE: <path> ===` markers

Logical files inside the bundle are demarcated by `# === FILE: <path> ===`
markers. A trivial post-process script can split the bundle on the
marker into the real file tree. This pattern works in every browser
(no File System Access API requirement); is round-trippable; and is
LLM-friendly (Claude Code, Cursor, etc. parse the marker pattern
directly without any custom tooling). The marker is a plain markdown
heading — does not break preview rendering.

### Decision 3 — The bundle IS the canonical Hey Bradley OUTPUT

Hey Bradley's value proposition is spec generation, not code generation.
The workbench is a spec factory; the bundle is what the user takes
elsewhere. Code generation is downstream — Claude Code (or any
consumer) reads the bundle, plans, and writes implementation in their
own repo. This boundary keeps Hey Bradley's surface bounded + auditable
and lets the consumer pick their own runtime/stack/style — Hey Bradley
ships specs, not opinions about implementation.

### Decision 4 — Logical file set: ≥6 files per bundle

Every bundle contains at minimum:
- `CLAUDE.md` — project-context preamble (purpose, atoms summary,
  methodology, downstream-consumer hand-off note)
- `process-map.md` — the phase's process flow (phases / sprints / waves)
- `human-spec/north-star.md` — owner-readable goals + scope
- `human-spec/sadd.md` — system-architecture + design decisions narrative
- `human-spec/implementation-plan.md` — sprint-level plan
- `aisp/phase-aisp.md` — verbatim AISP Σ block per AGENT_ATOM
- `adrs/ADR-{id}.md` — one per ADR ref (≥1 per phase)
- `agents/wave-{n}.md` — one per wave; AgentSpec scopes + DoD checklists

## Out of scope (deferred)

- **File System Access API** for true multi-file directory write — Tier-2
  commercial; browser support remains gappy at open-core RC scope
- **Per-file copy buttons** in the workbench tabs — Tier-2; clipboard
  primary on the AISP tab (per ADR-121 D2) covers the high-leverage
  case; per-file copies add UI surface without commensurate value
- **Bundle versioning + diff view** (compare two bundles for the same
  phase across edits) — Tier-2 commercial
- **JSZip / archiver dependency** — REJECTED. KISS holds. Markdown
  bundle is zero-dep; ZIP would add ~50KB minified + a binary boundary
  without UX win

## Acceptance gates

- ADR ≤120 LOC; **Status: Accepted**; 4 decisions enumerated
- Cross-refs ADR-101 + ADR-108 + ADR-110 + ADR-121
- `src/contexts/specification/exportClaudeCode.ts` exports
  `buildClaudeCodeBundle` function + `ExportClaudeCodeBundle` type;
  source contains `# === FILE:` marker pattern
- `src/components/agentics/ExportClaudeCodeButton.tsx` carries
  `data-testid="export-claude-code-button"`; uses `Blob` for download
- `SpecWorkbench.tsx` imports + renders `ExportClaudeCodeButton`
- KISS — no `jszip` / `archiver` / `fs-promises` / animation libs in
  P96 source; `package.json` unchanged (no new deps)
- EOP triplet at `plans/implementation/phase-96/seal/`

## Consequences

- **Positive:** zero-dep export pipeline; markdown is universally
  readable + LLM-ingestible; single-artifact bundle is git-versionable;
  spec-factory framing is reinforced — Hey Bradley ships specs, not
  code; downstream consumer freedom (any runtime, any stack); polyglot
  adoption pattern from ADR-108 carries over cleanly.
- **Negative:** no true multi-file directory write at open-core (user
  runs split script or feeds whole bundle to LLM); no per-file copy
  buttons; bundle versioning + diff is a Tier-2 ask.
- **Mitigations:** the file-marker pattern is trivial to split (one
  awk/python one-liner); LLMs ingest the marker pattern natively
  without custom tooling; clipboard CTA from ADR-121 D2 already covers
  the AISP-only quick-copy case; Tier-2 carry-forward documented for
  File System Access API + diff view when product warrant emerges.
