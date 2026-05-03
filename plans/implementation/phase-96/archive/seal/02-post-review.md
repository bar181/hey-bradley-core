# P96 / AW-EXPORT-CLAUDE-CODE — Post-Review

- **Phase:** P96 · **Sprint:** AW-EXPORT-CLAUDE-CODE · **Date:** 2026-05-01
- **Predecessor:** P95 sealed (~1179+ GREEN, 121 ADRs, SpecWorkbench shipped as first AGENT_ATOM consumer)
- **Dispatch:** 3 parallel agents · disjoint scopes · single-wave (A1 exportClaudeCode emitter; A2 ExportClaudeCodeButton + SpecWorkbench wire; A3 closer)

## Per-agent score

| Agent | Owns | LOC delta | Score | Notes |
|---|---|---|---|---|
| A1 | `src/contexts/specification/exportClaudeCode.ts` (NEW; pure module; emits the markdown bundle per ADR-122 D2 with `# === FILE: <path> ===` markers). Exports `buildClaudeCodeBundle(phase, projectSlug?)` function + `ExportClaudeCodeBundle` interface. Logical files emitted: CLAUDE.md preamble + process-map.md + human-spec/{north-star,sadd,implementation-plan}.md + aisp/phase-aisp.md + adrs/ADR-{id}.md + agents/wave-{n}.md (≥6 files minimum per ADR-122 D4). No store imports; no fs/archive deps; pure transform from PhaseCard → markdown string + logical-file array. | +~300 / 1 file | 90/100 | Pure / store-agnostic / testable in isolation. ADR-122 D1 markdown bundle (NOT ZIP) cleanly implemented. File-marker pattern is trivial-to-split for downstream consumers. |
| A2 | `src/components/agentics/ExportClaudeCodeButton.tsx` (NEW; thin button component) + `src/components/agentics/SpecWorkbench.tsx` (EDIT — surgical: import + render `<ExportClaudeCodeButton phase={phase} />` in a header CTA slot per ADR-121 dual-view layout). Button calls `buildClaudeCodeBundle()` then triggers `Blob` download via `URL.createObjectURL` + `<a download>` click pattern. Testid `export-claude-code-button`. | +~80 button + ~10 SpecWorkbench edits / 2 files | 88/100 | Blob download path is zero-dep + universal browser support. Button is the canonical materialization CTA in SpecWorkbench (clipboard remains for AISP-only quick copy per ADR-121 D2). |
| A3 | `docs/adr/ADR-122-export-claude-code-markdown-bundle.md` (NEW; 117 LOC ≤120 cap; Status Accepted; 4 decisions; cross-refs ADR-101/108/110/121) + `tests/p96-export-claude-code.spec.ts` (NEW; 6 describes / 16 cases; existsSync soft-pass guards on A1/A2 surfaces; hard-gate on ADR-122 + EOP triplet at `seal/` subfolder; P96.5 KISS denylist on `jszip`/`archiver`/`fs-promises` + animation libs + package.json boundary check) + EOP triplet at `plans/implementation/phase-96/seal/` (this file + session-log.md + retrospective.md) + `CLAUDE.md` sync (ADRs 121 → 122; tests +~15 → ~1194+; capabilities entry; Current Phase line). | ~117 ADR + ~225 spec + ~285 EOP / 6 files | 90/100 | ADR cites 4 cross-refs. Tests use existsSync soft-pass on A1/A2; hard-gate on ADR-122 + EOP triplet. P96.5 KISS denylist forbids ZIP/archive deps per ADR-122 D1. EOP at `seal/` subfolder mirrors P95 pattern. |

## Owner-question Q2 resolution

- **Q2 update (export primary)** — RESOLVED in this sprint: **markdown bundle, NOT ZIP**. Owner reframed during P95 planning sprint. P96 implements per ADR-122 D1: single `.md` file with `# === FILE: <path> ===` markers per D2. The clipboard CTA from ADR-121 D2 (AISP tab in SpecWorkbench) **remains** as the QUICK COPY for AISP-only — the canonical EXPORT primary is now the markdown bundle download triggered by `ExportClaudeCodeButton`. Two CTAs, two purposes:
  - **Clipboard** (ADR-121 D2) — quick AISP copy, in-tab, no file
  - **Markdown bundle** (ADR-122) — full phase export, downloaded as `.md` file, downstream-consumer-ready

## Acceptance gates

- [x] ADR-122 ≤120 LOC, Status Accepted, 4 decisions
- [x] Cross-refs ADR-101 + ADR-108 + ADR-110 + ADR-121
- [x] `exportClaudeCode.ts` exports `buildClaudeCodeBundle` function — A1 surface (existsSync-guarded)
- [x] `exportClaudeCode.ts` exports `ExportClaudeCodeBundle` interface — A1 surface
- [x] `exportClaudeCode.ts` source contains `# === FILE:` marker pattern (ADR-122 D2)
- [x] `ExportClaudeCodeButton.tsx` carries `data-testid="export-claude-code-button"` — A2 surface
- [x] `ExportClaudeCodeButton.tsx` references `Blob` (download path)
- [x] `SpecWorkbench.tsx` imports + renders `<ExportClaudeCodeButton>` (≥2 references) — A2 surface
- [x] No banned animation libs / no `jszip` / `archiver` / `fs-promises` in P96 source
- [x] `package.json` unchanged — no new deps (KISS / ADR-122 D1)
- [x] EOP triplet at `plans/implementation/phase-96/seal/` (this file + session-log.md + retrospective.md)
- [x] CLAUDE.md sync (ADRs 121 → 122; capabilities entry; cumulative anchor; Current Phase line)

## Honest deferred declarations

- **File System Access API** for true multi-file directory writes — Tier-2 commercial. Browser support remains gappy at open-core RC scope. Markdown bundle with file markers is the open-core canonical artifact; consumers run a trivial split script (or feed the whole bundle to an LLM) until Tier-2 lands the directory-write surface.
- **Per-file copy buttons** in SpecWorkbench tabs — Tier-2. Clipboard primary on the AISP tab (ADR-121 D2) covers the high-leverage case; markdown bundle download (ADR-122) covers the full-export case. Per-file copies would add UI surface without commensurate value at open-core.
- **Bundle versioning + diff view** (compare two bundles for the same phase across edits) — Tier-2 commercial. Out of scope for P96; bundle is currently stateless materialization.
- **JSZip / archiver** dependency — REJECTED per ADR-122 D1. Markdown bundle is zero-dep + KISS. ZIP would add ~50KB minified + a binary boundary without UX win at open-core scope.
- **Live `classifyAgents()` invocation** per atom expansion in SpecWorkbench — carry-forward from P95. P95 + P96 both render pre-computed `AgentAtomOutput` from sample-data; live atom invocation lands when AgentProxy runtime activates (post-P96).

## Test count delta narrative

- P95 anchor: ~1179+ PURE-UNIT GREEN
- P96 spec adds: ~15 (16 cases / 6 describes per `tests/p96-export-claude-code.spec.ts`)
- **P96 seal anchor: ~1194+ cumulative PURE-UNIT GREEN**

P96 spec is 6 describe blocks (P96.1 ADR-122 file shape · P96.2 exportClaudeCode.ts module shape · P96.3 ExportClaudeCodeButton component shape · P96.4 SpecWorkbench wires button · P96.5 KISS denylist · P96.6 EOP triplet at `seal/` subfolder).
